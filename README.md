# Embassy — Amalgama Design System

Librería de componentes UI reutilizable. El código de componentes vive en el paquete **`@amalgama/ds`** (`packages/ds/`): componentes React **Tailwind v4 + shadcn/Radix**, cada uno **autocontenido** — define sus variantes in-file con utilidades Tailwind que resuelven a tokens Embassy. La única hoja de estilos es `tailwind.theme.css` (tokens + mapeo de theme). Copiás el archivo del componente y funciona.

> **La capa CSS buildless (`css/components/*.css` + el barrel `css/components.css`) fue eliminada (2026-06).** El único origen de verdad de los componentes es Tailwind (`packages/ds/components/ui/*.tsx`). Los tokens (`css/variables.css`, `css/base.css`, `css/layout.css`, `css/md-sys-bridge.css`) **no** están deprecados y siguen siendo el origen de los tokens.

> **AI agents**: ver [CLAUDE.md](./CLAUDE.md) para la guía de consumo completa. Ver [GOVERNANCE.md](./GOVERNANCE.md) para el contrato de calidad. Ver [MIGRATION.md](./MIGRATION.md) para aplicar el DS a un producto existente. Ver [WHITE-LABEL.md](./WHITE-LABEL.md) para implementaciones de marca cliente.

---

## Inicio rápido (Tailwind — canónico)

En un proyecto Tailwind v4, importá el theme una vez y usá los componentes:

```css
/* tu hoja de estilos global */
@import "@amalgama/ds/tailwind.theme.css";  /* tokens + mapeo de theme — la ÚNICA hoja del DS */
```

```tsx
import { Button } from "@amalgama/ds/button"   // autocontenido — no hay CSS extra que copiar

<Button variant="primary">Crear vacante</Button>
```

Cada archivo en `packages/ds/components/ui/` es la implementación completa. Para "vendorizar" un componente, copiá su `.tsx` + `components/lib/utils.ts` (`cn()`); solo necesita el import del theme de arriba. Cargá las fuentes (DM Mono / Epilogue / Inter) por separado.

> **Sin componentes buildless.** El viejo path "linkeá `css/components.css` y usá `btn-primary`" ya no existe (fue eliminado en 2026-06). Para tokens sin build podés seguir linkeando `css/variables.css` + `css/base.css`, pero los componentes son Tailwind: importá `@amalgama/ds/tailwind.theme.css` y copiá el `.tsx`.

Abrí `index.html` en un servidor local para ver el catálogo interactivo:

```bash
python3 -m http.server 8087
# → http://localhost:8087/
```

---

## Estructura

```
amalgama-ds/
├── index.html                # Sitio de documentación canónico (SPA, una sola página)
├── css/                      # Tokens + base (fuente de verdad de tokens)
│   ├── variables.css         # Design tokens (fuente de verdad)
│   ├── base.css              # Reset, tipografía, animaciones
│   ├── layout.css            # App shell (sidebar, topbar, avatar)
│   ├── md-sys-bridge.css     # Alias de nombres MD3 (--md-sys-color-*) → roles Embassy
│   ├── components.css        # ⚠️ DEPRECADO/congelado — barrel buildless (solo para el docs site)
│   └── components/           # ⚠️ DEPRECADO/congelado — CSS por componente (no agregar nada)
├── packages/ds/              # @amalgama/ds — FUENTE DE VERDAD de los componentes (Tailwind v4 + shadcn/Radix)
│   ├── components/ui/        # Componentes React autocontenidos (variantes Tailwind in-file)
│   ├── components/lib/utils.ts # cn() (extendTailwindMerge con tokens Embassy)
│   ├── css/                  # Copia GENERADA de los tokens (no editar; ver scripts/sync-tokens.mjs)
│   └── tailwind.theme.css    # Tokens + mapeo de theme — la única hoja de estilos del paquete
├── islands/                  # Glue Vite: monta @amalgama/ds en el index.html
│   ├── src/                  # Showcases + registro (main.tsx)
│   └── dist/                 # Bundle COMMITEADO y servido (embassy-islands.{js,css})
├── docs/                     # Stubs de redirect a la SPA index.html (+ docs.css, requerido por index.html)
├── scripts/sync-tokens.mjs   # Sincroniza css/variables.css → packages/ds (con --check para CI)
├── skills/design-system/     # SKILL.md — instrucciones para el skill de IA
├── CLAUDE.md                 # Guía de consumo (humanos + IA)
├── GOVERNANCE.md             # Contrato de consistencia
├── MIGRATION.md              # Guía de migración desde legacy
├── WHITE-LABEL.md            # Theming de marca cliente
├── DEPLOYMENT.md             # Cómo se actualiza producción y por qué puede no reflejarse
└── CONTRIBUTING.md           # Cómo agregar o modificar componentes
```

---

## Componentes

### Core (genéricos)

| Componente | CSS (legacy — eliminado) | TSX (canónico) | Descripción |
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

| Componente | CSS (legacy — eliminado) | TSX (canónico) | Descripción |
|---|---|---|---|
| Vacancy Card | `vacancy-card.css` | `vacancy-card.tsx` | Tarjeta de vacante con stats y asignados |
| Person Card | `person-card.css` | `person-card.tsx` | Tarjeta de persona / candidato |
| Kanban | `kanban.css` | `kanban-card.tsx` | Tablero kanban con columnas y cards |
| Create Form | `create-form.css` | `create-form.tsx` | Header/footer para formularios de creación |
| Placeholder | `placeholder.css` | `placeholder.tsx` | Panel para secciones en construcción |

### App Shell (layout.css)

| Elemento | Clase | Descripción |
|---|---|---|
| Topbar | `.topbar` | Barra superior de la aplicación |
| Sidebar | `.sidebar` / `.nav-item` | Navegación lateral |
| Avatar | `.avatar` | Círculo con iniciales o imagen |

### Interactivos (en `@amalgama/ds`, vía islands)

Checkbox, radio, switch, menú (dropdown), tooltip, slider, date picker (calendar), sheet, list, progress, carousel, divider (separator), dialog, popover, avatar, snackbar (sonner). Implementados en `packages/ds/components/ui/` (Tailwind + Radix) y renderizados en el docs site vía islands. No improvises estilos — usá estos componentes o reportá el gap.

---

## Uso con React

Los componentes son autocontenidos: definen sus variantes con utilidades Tailwind (que resuelven a tokens Embassy). Solo necesitás importar el theme una vez (`@amalgama/ds/tailwind.theme.css`) y los peer deps:

```bash
npm install class-variance-authority clsx tailwind-merge tailwindcss
```

```tsx
import { Button } from "@amalgama/ds/button"

<Button variant="primary">Crear vacante</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="tertiary">Ver detalle</Button>
<Button variant="text">Más opciones</Button>
```

> En las tablas de arriba, la columna **CSS** lista los archivos `css/components/*.css` **ya eliminados** (2026-06) — referencia histórica del origen de cada componente; la columna **TSX** es el componente canónico en `packages/ds/components/ui/`.

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
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Cómo se actualiza el sitio publicado y por qué los cambios pueden no reflejarse |
