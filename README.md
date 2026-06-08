# Amalgama Design System

Libreria de componentes UI reutilizable. Sin npm, sin build tools — solo HTML, CSS y componentes React de referencia.

## Inicio rapido

Agrega las fuentes y los archivos CSS al `<head>` de tu HTML:

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Epilogue:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<link rel="stylesheet" href="path/to/amalgama-ds/css/variables.css">
<link rel="stylesheet" href="path/to/amalgama-ds/css/base.css">
<link rel="stylesheet" href="path/to/amalgama-ds/css/components.css">
```

O carga solo los componentes que necesitas:

```html
<link rel="stylesheet" href="path/to/amalgama-ds/css/variables.css">
<link rel="stylesheet" href="path/to/amalgama-ds/css/base.css">
<link rel="stylesheet" href="path/to/amalgama-ds/css/components/button.css">
<link rel="stylesheet" href="path/to/amalgama-ds/css/components/badge.css">
```

## Estructura

```
amalgama-ds/
├── css/
│   ├── variables.css         # Design tokens
│   ├── base.css              # Reset, tipografia, animaciones
│   ├── layout.css            # App shell (sidebar, topbar)
│   ├── components.css        # Barrel: importa todos los componentes
│   └── components/           # 20 archivos CSS individuales
├── components/
│   ├── lib/utils.ts          # cn() utility (clsx wrapper)
│   └── ui/                   # 17 componentes React (.tsx)
└── docs/                     # Sitio de documentacion
```

## Componentes

### Core (genericos)
| Componente | CSS | TSX | Descripcion |
|------------|-----|-----|-------------|
| Button | `button.css` | `button.tsx` | Botones primary, ghost, next, icon, danger, success |
| Badge | `badge.css` | `badge.tsx` | Indicadores de estado (7 variantes) |
| Card | `card.css` | `card.tsx` | Contenedor con borde y fondo |
| Input | `form.css` | `input.tsx` | Campo de texto con label |
| Select | `form.css` | `select.tsx` | Dropdown con label |
| Textarea | `form.css` | `textarea.tsx` | Area de texto con label |
| Table | `table.css` | `table.tsx` | Tabla de datos |
| Tabs | `tabs.css` | `tabs.tsx` | Pestanas con paneles |
| Modal | `modal.css` | `modal.tsx` | Dialogo modal con overlay |
| Toast | `toast.css` | `toast.tsx` | Notificaciones temporales |
| Toolbar | `toolbar.css` | `toolbar.tsx` | Barra de busqueda y filtros |
| Page Header | `page-header.css` | `page-header.tsx` | Encabezado de pagina |
| Stat Card | `stat-card.css` | `stat-card.tsx` | Tarjetas KPI |
| Skeleton | `skeleton.css` | `skeleton.tsx` | Placeholder de carga |
| Empty State | `empty-state.css` | `empty-state.tsx` | Estado vacio |
| Back Link | `back-link.css` | `back-link.tsx` | Enlace de retorno |
| Description | `description.css` | `description-section.tsx` | Seccion editable |
| Avatar | `person-card.css` | — | Circulo con iniciales (ver docs/avatar.html) |

### Extended (domain-oriented, incluidos en components.css)
| Componente | CSS | TSX | Descripcion |
|------------|-----|-----|-------------|
| Vacancy Card | `vacancy-card.css` | — | Tarjeta de vacante |
| Person Card | `person-card.css` | — | Tarjeta de persona |
| Kanban | `kanban.css` | — | Tablero kanban |
| Create Form | `create-form.css` | — | Header/footer para formularios |
| Placeholder | `placeholder.css` | — | Panel placeholder |

## Uso con React

Los componentes TSX son implementaciones de referencia usando `class-variance-authority` y `clsx`:

```bash
npm install class-variance-authority clsx
```

```tsx
import { Button } from "@amalgama/ds/components/ui/button"

<Button variant="primary">Crear vacante</Button>
<Button variant="ghost">Cancelar</Button>
```

## Personalizacion

Modifica `variables.css` para cambiar tokens globalmente:

```css
:root {
  --accent: #10b981;     /* Cambia el color accent de azul a verde */
  --radius: 8px;         /* Bordes mas cuadrados */
}
```

## Documentacion

Abre `docs/index.html` en un servidor local para ver el catalogo interactivo. Desde la raiz del repo:

```bash
python3 -m http.server 8087
```

Luego abre `http://localhost:8087/docs/index.html`.

## Para Claude Code

Ver [CLAUDE.md](./CLAUDE.md) para una explicacion de la arquitectura (capas CSS, capa React sobre clases, convenciones por componente) y los pasos para agregar un componente nuevo.
