# Embassy — Amalgama Design System

Librería de componentes UI reutilizable. Sin npm, sin build tools — solo HTML, CSS y componentes React de referencia.

> **AI agents**: ver [CLAUDE.md](./CLAUDE.md) para la guía de consumo completa. Ver [GOVERNANCE.md](./GOVERNANCE.md) para el contrato de calidad. Ver [MIGRATION.md](./MIGRATION.md) para aplicar el DS a un producto existente. Ver [WHITE-LABEL.md](./WHITE-LABEL.md) para implementaciones de marca cliente.

---

## Inicio rápido

Agregá las fuentes y los archivos CSS al `<head>` de tu HTML **en este orden** (el orden importa):

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Epilogue:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<link rel="stylesheet" href="path/to/amalgama-ds/css/variables.css">   <!-- 1. tokens (obligatorio) -->
<link rel="stylesheet" href="path/to/amalgama-ds/css/base.css">        <!-- 2. reset + tipografía base (obligatorio) -->
<link rel="stylesheet" href="path/to/amalgama-ds/css/components.css">  <!-- 3. barrel: todos los componentes -->
<!-- layout.css solo para app shell completo (sidebar + topbar + avatar) -->
```

O cargá solo los componentes que necesitás:

```html
<link rel="stylesheet" href="path/to/amalgama-ds/css/variables.css">
<link rel="stylesheet" href="path/to/amalgama-ds/css/base.css">
<link rel="stylesheet" href="path/to/amalgama-ds/css/components/button.css">
<link rel="stylesheet" href="path/to/amalgama-ds/css/components/badge.css">
```

Abrí `index.html` en un servidor local para ver el catálogo interactivo:

```bash
python3 -m http.server 8087
# → http://localhost:8087/
```

---

## Estructura

```
amalgama-ds/
├── css/
│   ├── variables.css         # Design tokens (fuente de verdad)
│   ├── base.css              # Reset, tipografía, animaciones
│   ├── layout.css            # App shell (sidebar, topbar, avatar)
│   ├── components.css        # Barrel: importa todos los componentes
│   └── components/           # 22 archivos CSS individuales
├── components/
│   ├── lib/utils.ts          # cn() utility (clsx wrapper)
│   └── ui/                   # 17+ componentes React (.tsx)
├── docs/                     # Páginas de documentación legacy
├── skills/
│   └── design-system/
│       └── SKILL.md          # Instrucciones para el skill de IA
├── CLAUDE.md                 # Guía de consumo (humanos + IA)
├── GOVERNANCE.md             # Contrato de consistencia
├── MIGRATION.md              # Guía de migración desde legacy
├── WHITE-LABEL.md            # Theming de marca cliente
└── CONTRIBUTING.md           # Cómo agregar o modificar componentes
```

---

## Componentes

### Core (genéricos)

| Componente | CSS | TSX | Descripción |
|---|---|---|---|
| Button | `button.css` | `button.tsx` | Primary, secondary, tertiary, text, icon; 5 tamaños |
| Badge | `badge.css` | `badge.tsx` | Indicadores de estado (9 variantes) |
| Chip | `chip.css` | `chip.tsx` | Filtros interactivos, tags seleccionables |
| Card | `card.css` | `card.tsx` | Contenedor con borde y fondo |
| Input / Select / Textarea | `form.css` | `input.tsx`, `select.tsx`, `textarea.tsx` | Campos de formulario con label y hint |
| Search Bar | `search.css` | `search.tsx` | Barra de búsqueda standalone (56px, pill) |
| Table | `table.css` | `table.tsx` | Tabla de datos con filas clickeables |
| Tabs | `tabs.css` | `tabs.tsx` | Pestañas con paneles |
| Modal | `modal.css` | `modal.tsx` | Diálogo modal con overlay |
| Toast | `toast.css` | `toast.tsx` | Notificaciones temporales |
| Toolbar | `toolbar.css` | `toolbar.tsx` | Barra de filtros con search-field compacto |
| Segmented Button | `segmented-button.css` | — | Selector de opciones mutuamente excluyentes |
| Page Header | `page-header.css` | `page-header.tsx` | Encabezado de página con acciones |
| Stat Card | `stat-card.css` | `stat-card.tsx` | Tarjetas KPI / métricas |
| Skeleton | `skeleton.css` | `skeleton.tsx` | Placeholder de carga |
| Empty State | `empty-state.css` | `empty-state.tsx` | Estado vacío |
| Back Link | `back-link.css` | `back-link.tsx` | Enlace de retorno con ícono |
| Description Section | `description.css` | `description-section.tsx` | Sección editable con título + editor |

### Extended (orientados a dominio)

| Componente | CSS | TSX | Descripción |
|---|---|---|---|
| Vacancy Card | `vacancy-card.css` | — | Tarjeta de vacante con stats y asignados |
| Person Card | `person-card.css` | — | Tarjeta de persona / candidato |
| Kanban | `kanban.css` | — | Tablero kanban con columnas y cards |
| Create Form | `create-form.css` | — | Header/footer para formularios de creación |
| Placeholder | `placeholder.css` | — | Panel para secciones en construcción |

### App Shell (layout.css)

| Elemento | Clase | Descripción |
|---|---|---|
| Topbar | `.topbar` | Barra superior de la aplicación |
| Sidebar | `.sidebar` / `.nav-item` | Navegación lateral |
| Avatar | `.avatar` | Círculo con iniciales o imagen |

### En roadmap (sin código consumible aún)

Checkbox, radio, switch, menú, tooltip, slider, date picker, sheet, list, loading, carousel, divider. No improvises estilos para estos — componé desde los existentes o reportá el gap.

---

## Uso con React

Los componentes TSX son implementaciones de referencia que usan `class-variance-authority` y `clsx`:

```bash
npm install class-variance-authority clsx
```

```tsx
import { Button } from "@amalgama/ds/components/ui/button"

<Button variant="primary">Crear vacante</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="tertiary">Ver detalle</Button>
<Button variant="text">Más opciones</Button>
```

---

## Dark mode

Dark mode es automático — no requiere overrides por componente:

```html
<html data-theme="dark">
  <!-- todos los componentes se adaptan solos -->
</html>
```

Los tokens semánticos (`--color-*`, `--text-*`, `--bg`) se recalibran solos bajo `data-theme="dark"`. Los componentes son ciegos al tema.

---

## Personalización de tokens

Para personalizar el DS (en un proyecto interno o un producto cliente), **sobreescribí las primitivas**, no los roles semánticos:

```css
/* brand-theme.css — cargá ANTES de variables.css o en :root después */
:root {
  /* Paleta de marca del cliente */
  --primary-900: #1a3a5c;   /* navy del cliente */
  --primary-500: #2d6db4;   /* primary base */
  --secondary-500: #00a86b; /* accent del cliente */

  /* Personalidad de forma */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 6px;
  --radius-xl: 8px;

  /* Tipografía de marca (solo si tenés licencia de las fuentes) */
  --font-heading: 'Brand Heading', sans-serif;
  --font-body: 'Brand Body', sans-serif;
}
```

Ver [WHITE-LABEL.md](./WHITE-LABEL.md) para el proceso completo con checklist de verificación.

---

## Documentación

| Documento | Propósito |
|---|---|
| `index.html` (raíz) | Catálogo interactivo — la doc canónica |
| [CLAUDE.md](./CLAUDE.md) | Guía de consumo completa para humanos e IA |
| [GOVERNANCE.md](./GOVERNANCE.md) | Contrato de consistencia — reglas que todos los componentes deben cumplir |
| [MIGRATION.md](./MIGRATION.md) | Cómo migrar un producto existente al DS |
| [WHITE-LABEL.md](./WHITE-LABEL.md) | Theming de marca cliente |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Cómo agregar o modificar componentes |
| `DS Content Strategy Analysis.md` | Análisis de contenido del sitio de docs |
