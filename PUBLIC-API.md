# PUBLIC-API.md — API pública de clases de Embassy

> **Generado por `node scripts/build-public-api.mjs`. No editar a mano.**
> Fuente: `css/components/*.css` (bloques `Uso:` y headers) + `component-rules/manifest.json`.

## Contrato

1. **Solo los nombres listados acá son API pública.** Cualquier otro selector que exista en el
   CSS es interno y puede cambiar sin aviso.
2. **No inspecciones el CSS buscando selectores internos.** El stylesheet se carga cuando la
   página renderiza; el agente no necesita leerlo.
3. **No inventes clases nuevas.** Si nada de esta lista sirve, componé con las que hay o marcá el
   gap del DS — no improvises.
4. **Los modificadores son aditivos**: `class="btn-primary btn-danger"`, `class="chip chip-selected"`.
5. **El modificador de tamaño ya trae su `border-radius`.** Nunca agregues `border-radius` inline.

64 componentes · **543 clases públicas** de 611 selectores totales en el CSS.

## Cómo cargar el sistema

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@v1.0.0/css/variables.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@v1.0.0/css/base.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@v1.0.0/css/composition.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@v1.0.0/css/components.css">
<!-- app shell (sidebar + topbar) solamente: .../css/layout.css -->
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Epilogue:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

Dark mode: `<html data-theme="dark">`. No agregues overrides por tema.

El tag va pineado a propósito: lo que se entrega no cambia de aspecto porque el DS mergeó algo.
Para subir de versión, ver DEPLOYMENT.md §Releases.

---

### `composition` — Composition (estructura de página) · layout

La estructura de la página: columna, borde a borde, riel o dividida; la medida de línea, el ritmo entre secciones, el overline y el índice de sección. Se carga en TODA página, con shell o sin él.
**Cuándo usar:** SIEMPRE. Toda página que publicamos, con app shell o sin él. Define la estructura (columna, borde a borde, riel, dividida), la medida de línea, el ritmo entre secciones, el overline y el índice de sección. Es la contraparte construida de COMPOSICION.md: ese archivo dice qué forma tiene una página nuestra, éste la hace.
**Cuándo no:** nunca se saltea. Una landing no carga layout.css (no tiene shell) pero sí carga esto — es justamente donde más falta hace.

Clases públicas: `.column` · `.column-1280` · `.column-1440` · `.column-1600` · `.column-1920` · `.column-bleed` · `.column-form` · `.column-rail` · `.column-read` · `.column-split` · `.editorial-lg` · `.editorial-md` · `.editorial-sm` · `.grid-12` · `.measure` · `.measure-lead` · `.overline` · `.section` · `.section-index` · `.section-lead` · `.section-tight` · `.sep` · `.span-1` · `.span-10` · `.span-11` · `.span-12` · `.span-2` · `.span-3` · `.span-4` · `.span-5` · `.span-6` · `.span-7` · `.span-8` · `.span-9`

```html
<div class="column">…</div>                      <!-- default: una columna de 1200 -->
<div class="column column-1440">…</div>          <!-- el mismo esquema, más ancho -->
<div class="column column-bleed">…</div>         <!-- sin ancho máximo, con márgenes igual -->
<div class="grid-12"><div class="span-7">…</div><div class="span-5">…</div></div>
<div class="column column-rail">…<aside>…</aside></div>
<section class="section section-lead">…</section>
<span class="section-index">02 / 05</span>
<p class="overline">Informe trimestral</p>
<h1 class="editorial-lg">Cuánto tardan las altas</h1>   <!-- uno por página, nunca en el shell -->
<p class="measure">Texto corrido que corta a tiempo aunque la página sea ancha.</p>
```

Regla completa: `component-rules/composition.md` · CSS: `css/composition.css`

---

### `layout` — App Shell (Sidebar + Topbar) · layout

Shell de aplicación: sidebar de navegación persistente + topbar. Se carga aparte de components.css.
**Cuándo usar:** shell de aplicación completo — sidebar + topbar + avatar. Solo para apps con navegación persistente.
**Cuándo no:** páginas standalone (auth, landing) — no cargar layout.css.

Clases públicas: `.active` · `.app` · `.avatar` · `.avatar-label` · `.chevron` · `.content` · `.main` · `.nav-badge` · `.nav-item` · `.nav-open` · `.nav-section-label` · `.nav-sub-items` · `.notif-badge` · `.secondary` · `.separator` · `.shell-menu-btn` · `.shortcut` · `.sidebar` · `.sidebar-footer` · `.sidebar-logo` · `.sidebar-nav` · `.sidebar-scrim` · `.sidebar-search` · `.topbar` · `.topbar-breadcrumb` · `.topbar-btn` · `.topbar-notif`

Regla completa: _(sin regla — revisar cobertura del manifest)_ · CSS: `css/layout.css`

---

### `accordion` — Accordion · Containment

Vertically stacked, expandable sections that reveal or hide long content to keep a dense view scannable.
**Cuándo usar:** FAQs, filtros avanzados o detalles opcionales donde mostrar todo a la vez abrumaría.
**Cuándo no:** navegar entre vistas (usar Tabs); un único bloque mostrar/ocultar (usar Collapsible); contenido crítico que siempre debe verse.
**Variantes:** single · multiple · disabled · bordered · card

Clases públicas: `.accordion` · `.accordion-bordered` · `.accordion-chevron` · `.accordion-content` · `.accordion-content-inner` · `.accordion-item` · `.accordion-trigger`

Regla completa: `component-rules/accordion.md` · CSS: `css/components/accordion.css`

---

### `alert` — Alert · Feedback

An inline, persistent contextual message that stays in the page flow until the user resolves or dismisses it.
**Cuándo usar:** mensajes persistentes en la página — un aviso de sistema, la validación completa de un formulario, una nota informativa que debe seguir visible hasta que la persona actúe.
**Cuándo no:** feedback efímero de una acción (usar Snackbar); confirmación que interrumpe (usar Alert Dialog); como único indicador por color (acompañá siempre con título/ícono).
**Variantes:** default · info · success · warning · error

Clases públicas: `.alert` · `.alert-actions` · `.alert-body` · `.alert-close` · `.alert-description` · `.alert-error` · `.alert-icon` · `.alert-info` · `.alert-success` · `.alert-title` · `.alert-warning`

```html
<div class="alert alert-info" role="alert">
  <svg class="alert-icon">…</svg>
  <div class="alert-body">
    <div class="alert-title">Mantenimiento programado</div>
    <div class="alert-description">El sistema estará en modo lectura el sábado de 2 a 4am.</div>
  </div>
</div>
```

Regla completa: `component-rules/alert.md` · CSS: `css/components/alert.css`

---

### `attachment` — Attachment · Data Display

A compact file row showing an icon/thumbnail, name and metadata, with an optional remove action, upload progress, or error state.
**Cuándo usar:** listar archivos subidos o por subir (CV de candidatos, adjuntos de un mensaje), con progreso o botón de quitar.
**Cuándo no:** subir el archivo (usar <input type="file">, ver Input); galería de imágenes (Carousel).
**Variantes:** default · image · uploading · error · list

Clases públicas: `.attachment` · `.attachment-body` · `.attachment-error` · `.attachment-icon` · `.attachment-icon-image` · `.attachment-list` · `.attachment-meta` · `.attachment-name` · `.attachment-progress` · `.attachment-progress-bar` · `.attachment-remove` · `.btn-sm` · `.icon-btn`

```html
<ul class="attachment-list">
  <li class="attachment">
    <span class="attachment-icon"><svg>…</svg></span>
    <div class="attachment-body">
      <div class="attachment-name">CV_Ana_Torres.pdf</div>
      <div class="attachment-meta">240 KB · PDF</div>
    </div>
    <button class="icon-btn btn-sm attachment-remove" aria-label="Quitar">✕</button>
  </li>
</ul>
```

Regla completa: `component-rules/attachment.md` · CSS: `css/components/attachment.css`

---

### `avatar` — Avatar · Display

A circle showing a person's photo or initials over a brand tonal fill — identifies a person, never a non-person entity.
**Cuándo usar:** identificar a una persona (topbar, listas, cards de vacante/persona, asignados).
**Cuándo no:** para íconos genéricos de sistema (usar Icon Button) ni como decoración sin significado.
**Variantes:** image · fallback · badge · group · count
**Tamaños:** sm · md · lg · xl

Clases públicas: `.avatar` · `.avatar-badge` · `.avatar-badge-away` · `.avatar-badge-busy` · `.avatar-badge-offline` · `.avatar-badge-online` · `.avatar-fallback` · `.avatar-group` · `.avatar-group-count` · `.avatar-image` · `.avatar-lg` · `.avatar-md` · `.avatar-sm` · `.avatar-xl`

```html
<span class="avatar avatar-md"><span class="avatar-fallback">MG</span></span>
<span class="avatar avatar-lg"><img class="avatar-image" src="…" alt="María González"></span>
```

Regla completa: `component-rules/avatar.md` · CSS: `css/components/avatar.css`

---

### `back-link` — Back Link · Navigation

A quiet inline link with a leading chevron that returns to the parent view from a detail page — one step up, never a general-purpose action.
**Cuándo usar:** volver a la vista padre desde una página de detalle.
**Cuándo no:** navegación principal (usar sidebar/tabs) ni acciones (usar btn-text).
**Variantes:** default

Clases públicas: `.back-link`

```html
<button class="back-link">
  <svg width="16" height="16" ...>...</svg>
  Volver a vacantes
</button>
```

Regla completa: `component-rules/back-link.md` · CSS: `css/components/back-link.css`

---

### `badge` — Badge · Display

A read-only pill communicating an item's status, category, or a count — each color carries a fixed meaning; never interactive.
**Cuándo usar:** estado o categoría de SOLO LECTURA de un ítem (tablas, cards, listas). Todo label categórico debe ser badge — nunca texto plano coloreado.
**Cuándo no:** si es interactivo/filtrable usar Chip; si es una acción usar Button.
**Variantes:** open · active · closed · draft · archived · warning · tertiary · info · label

Clases públicas: `.badge` · `.badge-active` · `.badge-archived` · `.badge-closed` · `.badge-draft` · `.badge-info` · `.badge-label` · `.badge-link` · `.badge-open` · `.badge-tertiary` · `.badge-warning`

Regla completa: `component-rules/badge.md` · CSS: `css/components/badge.css`

---

### `breadcrumb` — Breadcrumb · Navigation

A hierarchy trail showing where the user is and letting them jump back to an ancestor.
**Cuándo usar:** mostrar la ubicación dentro de una jerarquía de varios niveles y permitir volver a un ancestro.
**Cuándo no:** una sola acción "volver" (usar Back Link); navegación primaria entre secciones (usar Navigation).
**Variantes:** link · page · separator · ellipsis

Clases públicas: `.breadcrumb` · `.breadcrumb-ellipsis` · `.breadcrumb-item` · `.breadcrumb-link` · `.breadcrumb-list` · `.breadcrumb-page` · `.breadcrumb-separator`

Regla completa: `component-rules/breadcrumb.md` · CSS: `css/components/breadcrumb.css`

---

### `button-group` — Button Group · Actions

A container that visually joins related buttons (or an input + addon) into one unit by collapsing shared borders and radii — it carries no selection state of its own.
**Cuándo usar:** agrupar acciones relacionadas del mismo peso (paginador de acciones, split button, input + botón), o un addon de texto junto a un input.
**Cuándo no:** elegir 1 de N con estado (usar Segmented Button / Toggle Group); una sola acción (usar Button).
**Variantes:** horizontal · vertical · text-addon · separator

Clases públicas: `.btn-tertiary` · `.button-group` · `.button-group-separator` · `.button-group-text` · `.button-group-vertical` · `.field-input`

```html
<div class="button-group">
  <button class="btn-tertiary">Anterior</button>
  <button class="btn-tertiary">Siguiente</button>
</div>
<div class="button-group"><span class="button-group-text">https://</span>
  <input class="field-input" placeholder="tu-sitio.com"></div>
```

Regla completa: `component-rules/button-group.md` · CSS: `css/components/button-group.css`

---

### `button` — Button · Actions

Triggers an action. Chosen by hierarchy (color) and density (size); exactly one primary action per context.
**Cuándo usar:** acciones. Jerarquía obligatoria: UN solo btn-primary por contexto; btn-secondary para alternativas; btn-tertiary menor peso; btn-text acciones inline.
**Cuándo no:** navegación (usar links/nav). NUNCA estirar a full-width ni alinear contenido a la izquierda — el botón tiene ancho intrínseco y contenido centrado; si el layout legacy lo pide, se cambia el layout, no el botón.
**Variantes:** primary · elevated · secondary · tertiary · text · icon · danger · success
**Tamaños:** xs · sm · md · lg · xl

Clases públicas: `.btn-compact` · `.btn-danger` · `.btn-elevated` · `.btn-ghost` · `.btn-lg` · `.btn-next` · `.btn-primary` · `.btn-secondary` · `.btn-sm` · `.btn-success` · `.btn-tertiary` · `.btn-text` · `.btn-xl` · `.btn-xs` · `.icon-btn`

```html
<button class="btn-primary">Crear vacante</button>
<button class="btn-elevated">Ver detalle</button>
<button class="btn-secondary">Guardar borrador</button>
<button class="btn-tertiary">Cancelar</button>
<button class="btn-text">Ver más</button>
<button class="icon-btn" aria-label="Ajustes"><svg>…</svg></button>
```

Regla completa: `component-rules/button.md` · CSS: `css/components/button.css`

---

### `calendar` — Calendar · Input

A month-grid date/range picker with real month/year navigation — the base of the Date Picker, usable inline or docked in a popover, dialog, or sheet.
**Cuándo usar:** como base del Date Picker, o en línea cuando el calendario debe estar siempre visible (no como popover).
**Cuándo no:** para elegir solo mes/año (usar Select); para texto libre de fecha sin calendario (usar Input nativo type="date").
**Variantes:** single · range · dropdown · presets · booked · weeknumbers · date-picker · date-time
**Tamaños:** sm · md · lg

Clases públicas: `.calendar` · `.calendar-caption` · `.calendar-caption-dropdowns` · `.calendar-caption-select` · `.calendar-day` · `.calendar-day-booked` · `.calendar-day-disabled` · `.calendar-day-outside` · `.calendar-day-range-end` · `.calendar-day-range-middle` · `.calendar-day-range-start` · `.calendar-day-selected` · `.calendar-day-today` · `.calendar-grid` · `.calendar-header` · `.calendar-lg` · `.calendar-nav-btn` · `.calendar-preset-btn` · `.calendar-presets` · `.calendar-sm` · `.calendar-time-row` · `.calendar-weekdays` · `.calendar-weeknum` · `.calendar-with-presets` · `.date-picker` · `.date-picker-panel` · `.date-picker-trigger`

```html
<div class="calendar">
  <div class="calendar-header">
    <button class="calendar-nav-btn" aria-label="Mes anterior">‹</button>
    <span class="calendar-caption">Julio 2026</span>
    <button class="calendar-nav-btn" aria-label="Mes siguiente">›</button>
  </div>
  <div class="calendar-weekdays">...</div>
  <div class="calendar-grid">...</div>
</div>
```

Regla completa: `component-rules/calendar.md` · CSS: `css/components/calendar.css`

---

### `card` — Full Card · Data display / Containment

A rich content panel that groups content and actions about a single subject on a surface.
**Cuándo usar:** contenedor genérico de contenido agrupado sobre superficie.
**Cuándo no:** métricas (stat-card), personas (person-card), vacantes (vacancy-card).
**Variantes:** outlined · elevated · filled

Clases públicas: `.btn-text` · `.card` · `.card-action` · `.card-content` · `.card-desc` · `.card-elevated` · `.card-filled` · `.card-footer` · `.card-header` · `.card-title`

```html
<div class="card">
  <div class="card-header">
    <div class="card-title">Título</div>
    <p class="card-desc">Descripción breve.</p>
  </div>
  <div class="card-content">Contenido de la tarjeta</div>
  <div class="card-footer"><button class="btn-text">Acción</button></div>
</div>
```

Regla completa: `component-rules/card.md` · CSS: `css/components/card.css`

---

### `carousel` — Carousel · Containment

A scroll-snapping, browsable set of homogeneous items (images or cards) with prev/next controls — for secondary content that doesn't fit in one row.
**Cuándo usar:** colecciones de tarjetas/imágenes que no caben en una fila.
**Cuándo no:** listas verticales largas (usar Table/List); un solo ítem destacado.
**Variantes:** single · multi · vertical · prev-btn · next-btn

Clases públicas: `.carousel` · `.carousel-btn` · `.carousel-btn-next` · `.carousel-btn-prev` · `.carousel-content` · `.carousel-item` · `.carousel-item-half` · `.carousel-vertical`

```html
<div class="carousel">
  <div class="carousel-content">
    <div class="carousel-item">…</div>
    <div class="carousel-item">…</div>
  </div>
  <button class="carousel-btn carousel-btn-prev">‹</button>
  <button class="carousel-btn carousel-btn-next">›</button>
</div>
```

Regla completa: `component-rules/carousel.md` · CSS: `css/components/carousel.css`

---

### `chart` — Charts · Data display

Line, area, bar, and pie visualizations for dashboards and analytics — hand-drawn inline SVG + CSS conic-gradient, themed with the --chart-1..5 categorical palette.
**Cuándo usar:** series temporales o categóricas en dashboards y analytics (línea, barra, torta).
**Cuándo no:** una sola métrica puntual (usar Stat Card); tablas de datos exactos (usar Table).
**Variantes:** line · area · bar · pie · legend

Clases públicas: `.chart-area` · `.chart-axis-label` · `.chart-bar` · `.chart-container` · `.chart-dot` · `.chart-grid` · `.chart-legend` · `.chart-legend-item` · `.chart-legend-swatch` · `.chart-line` · `.chart-pie` · `.chart-pie-wrap` · `.chart-svg`

```html
<div class="chart-container">
  <svg class="chart-svg" viewBox="0 0 600 300">…</svg>
</div>
```

Regla completa: `component-rules/charts.md` · CSS: `css/components/chart.css`

---

### `checkbox` — Checkbox · Selección

A native checkbox for selecting one or more options from a set — three states (unchecked / checked / indeterminate); the change applies on confirm, not instantly.
**Cuándo usar:** selección múltiple independiente (cada opción no afecta a las demás); aceptar términos; seleccionar filas de una tabla (con estado indeterminate en el checkbox de cabecera cuando la selección es parcial).
**Cuándo no:** selección única excluyente (usar Radio Group); on/off inmediato sin lista de opciones (usar Switch).
**Variantes:** default · label · card

Clases públicas: `.checkbox` · `.checkbox-card` · `.checkbox-card-content` · `.checkbox-card-desc` · `.checkbox-card-title` · `.checkbox-label` · `.indeterminate`

```html
<label class="checkbox-label">
  <input type="checkbox" class="checkbox">
  Acepto los términos
</label>
<input type="checkbox" class="checkbox" id="row-1">
<!-- indeterminate se setea vía JS: el.indeterminate = true -->
```

Regla completa: `component-rules/checkbox.md` · CSS: `css/components/checkbox.css`

---

### `chip` — Chip · Actions / Selection

A compact, interactive element for filtering, selecting, or representing input — never for primary actions.
**Cuándo usar:** filtros, selección múltiple, sugerencias — siempre interactivo. Filter chips van debajo de la search bar para refinar resultados.
**Cuándo no:** estado de solo lectura (usar Badge); acción principal (usar Button).
**Variantes:** base · selected · elevated · icon · remove · set

Clases públicas: `.chip` · `.chip-elevated` · `.chip-icon` · `.chip-remove` · `.chip-selected` · `.chip-set`

```html
<button class="chip">Sugerencia</button>
<button class="chip"><span class="chip-icon">…</span> Asistencia</button>
<button class="chip" aria-pressed="false">Filtro</button>
<button class="chip chip-selected" aria-pressed="true">Filtro activo</button>
<span class="chip">Entrada <button class="chip-remove" aria-label="Quitar">✕</button></span>
<button class="chip chip-elevated">Elevado</button>
```

Regla completa: `component-rules/chip.md` · CSS: `css/components/chip.css`

---

### `collapsible` — Collapsible · Containment

A single show/hide region toggled by any trigger — a minimal disclosure with one boolean state.
**Cuándo usar:** mostrar/ocultar UN bloque ("ver más", detalles opcionales de un formulario, una fila expandible en una tabla).
**Cuándo no:** varias secciones expandibles agrupadas con el mismo patrón (usar Accordion, que además garantiza que solo una quede abierta si se necesita).
**Variantes:** base

Clases públicas: `.collapsible` · `.collapsible-content` · `.collapsible-content-inner` · `.collapsible-trigger`

```html
<div class="collapsible">
  <button class="collapsible-trigger" aria-expanded="false" aria-controls="col-1" onclick="collapsibleToggle(this)">
    Ver más
  </button>
  <div class="collapsible-content" data-state="closed" id="col-1">
    <div class="collapsible-content-inner">Contenido adicional…</div>
  </div>
</div>
```

Regla completa: `component-rules/collapsible.md` · CSS: `css/components/collapsible.css`

---

### `combobox` — Combobox · Forms / Selection

A searchable single-select — a trigger button that opens a filterable Command list; pick one value from a long set by typing to narrow it.
**Cuándo usar:** elegir 1 opción de una lista larga donde hace falta buscar/filtrar (país, usuario, repo). Cuándo no: listas cortas sin búsqueda (usar .form-select); multi-select con tags (usar Chips + Command).
**Variantes:** base · trigger · placeholder · panel · check

Clases públicas: `.btn-tertiary` · `.combobox` · `.combobox-check` · `.combobox-chevron` · `.combobox-panel` · `.combobox-trigger` · `.command` · `.form-select`

```html
<div class="combobox">
  <button class="btn-tertiary combobox-trigger" aria-expanded="false" aria-haspopup="listbox">
    Seleccionar… <span class="combobox-chevron">…</span>
  </button>
  <div class="combobox-panel">
    <div class="command">…</div>
  </div>
</div>
```

Regla completa: `component-rules/combobox.md` · CSS: `css/components/combobox.css`

---

### `command` — Command · Overlays

A searchable command palette / filterable list — substring-filtered items with arrow/Enter navigation and an empty state, optionally opened as a ⌘K Command Dialog.
**Cuándo usar:** búsqueda-y-ejecución rápida de comandos o navegación, pickers filtrables, y es la base del Combobox.
**Cuándo no:** un select de formulario corto (usar .form-select); búsqueda de contenido de la página (usar Search).
**Variantes:** inline · dialog · group · item · empty · shortcut

Clases públicas: `.command` · `.command-dialog` · `.command-empty` · `.command-group` · `.command-group-heading` · `.command-input` · `.command-input-icon` · `.command-input-wrapper` · `.command-item` · `.command-list` · `.command-separator` · `.command-shortcut` · `.form-select`

```html
<div class="command">
  <div class="command-input-wrapper">
    <span class="command-input-icon">…lupa…</span>
    <input class="command-input" placeholder="Buscar…">
  </div>
  <div class="command-list">
    <div class="command-empty">Sin resultados.</div>
    <div class="command-group">
      <div class="command-group-heading">Sugerencias</div>
      <div class="command-item" data-active="true">Item</div>
    </div>
  </div>
</div>
```

Regla completa: `component-rules/command.md` · CSS: `css/components/command.css`

---

### `context-menu` — Context Menu · Overlays

A cursor-anchored actions menu opened by right-click (or long-press) on an element — the same panel as Dropdown Menu, just a different trigger.
**Cuándo usar:** acciones contextuales sobre un elemento de una lista/tabla/canvas.
**Cuándo no:** acción siempre visible sobre un botón → Dropdown Menu.
**Variantes:** trigger · panel

Clases públicas: `.context-menu-trigger` · `.dropdown-` · `.dropdown-content` · `.dropdown-item` · `.dropdown-label` · `.dropdown-separator`

```html
<div class="context-menu-trigger" onContextMenu="…">Click derecho acá</div>
<div class="dropdown-content" role="menu" style="top:200px;left:120px">…</div>
```

Regla completa: `component-rules/context-menu.md` · CSS: `css/components/context-menu.css`

---

### `create-form` — Create Form (header + sticky footer) · Layout

The frame for a full-page creation or editing form — a large title above, and a footer that sticks to the bottom of the viewport so the save action is reachable no matter how long the form runs.
**Cuándo usar:** header + footer pegajoso de formularios de creación full-page.
**Cuándo no:** tareas cortas que caben en un Modal.
**Variantes:** default

Clases públicas: `.btn-primary` · `.btn-tertiary` · `.create-footer` · `.create-header` · `.create-title`

```html
<div class="create-header">
  <h1 class="create-title">Crear vacante</h1>
</div>
<!-- formulario -->
<div class="create-footer">
  <button class="btn-tertiary">Cancelar</button>
  <button class="btn-primary">Publicar</button>
</div>
```

Regla completa: `component-rules/create-form.md` · CSS: `css/components/create-form.css`

---

### `data-table` — Data Table · Data display

An interactive table over static Table — column sort, text filter, row selection, column visibility, and slice pagination via initDataTable().
**Cuándo usar:** tablas con datos reales que necesitan ordenar/paginar por columna.
**Cuándo no:** una tabla estática de layout (usar Table directamente).
**Variantes:** base · sortable-header · filter · selection · pagination · empty

Clases públicas: `.data-table` · `.data-table-count` · `.data-table-empty` · `.data-table-filter` · `.data-table-footer` · `.data-table-select` · `.data-table-sort-btn` · `.data-table-sort-icon` · `.data-table-toolbar`

```html
<DataTable columns={[{ key:"name", header:"Nombre", sortable:true }]} data={rows} />
```

Regla completa: `component-rules/data-table.md` · CSS: `css/components/data-table.css`

---

### `date-picker` — Date Picker · Form

A trigger button showing the chosen date, which opens a Calendar in a floating panel below it — the form and toolbar default, for when a permanent calendar would cost too much space.
**Cuándo usar:** elegir una fecha (o rango) desde un campo de formulario o toolbar.
**Cuándo no:** entrada de texto libre de fecha (usar Input nativo type="date" si no hace falta calendario); elegir mes/año sueltos (usar Select).
**Variantes:** default · empty

Clases públicas: `.btn-tertiary` · `.calendar` · `.date-picker` · `.date-picker-icon` · `.date-picker-panel` · `.date-picker-trigger` · `.date-picker-trigger-empty`

```html
<div class="date-picker">
  <button class="date-picker-trigger btn-tertiary">
    <svg class="date-picker-icon">…</svg> 17 de julio, 2026
  </button>
  <div class="date-picker-panel"><div class="calendar">…</div></div>
</div>
```

Regla completa: `component-rules/date-picker.md` · CSS: `css/components/date-picker.css`

---

### `description` — Description Section · Form

A bordered block with an editable heading and a rich-text body — for long-form content the person writes in named, reorderable sections, not for a plain textarea.
**Cuándo usar:** secciones de descripción editables (título + editor rich-text).
**Cuándo no:** campos simples de formulario (usar form.css).
**Variantes:** default

Clases públicas: `.desc-delete-btn` · `.desc-editor` · `.desc-section` · `.desc-section-header` · `.desc-title-input`

```html
<div class="desc-section">
  <div class="desc-section-header">
    <input class="desc-title-input" value="Responsabilidades">
    <button class="desc-delete-btn">✕</button>
  </div>
  <div class="desc-editor" contenteditable="true"
       data-placeholder="Escribe aqui...">
  </div>
</div>
```

Regla completa: `component-rules/description.md` · CSS: `css/components/description.css`

---

### `divider` — Divider · Containment

A 1px line that separates groups of equal-hierarchy content — the lightest separation in the system, no brand color, no elevation.
**Cuándo usar:** separar grupos lógicos dentro de una lista, card o layout.
**Cuándo no:** para crear espaciado (usar --space-* + margin/gap) ni como borde decorativo de contenedor.
**Variantes:** full-width · inset · vertical

Clases públicas: `.divider` · `.divider-inset` · `.divider-vertical`

```html
<hr class="divider">                            <!-- separador semántico -->
<div class="divider" role="separator"></div>    <!-- equivalente explícito -->
<div class="divider divider-inset"></div>
<div class="divider divider-vertical" role="separator" aria-orientation="vertical"></div>
```

Regla completa: `component-rules/divider.md` · CSS: `css/components/divider.css`

---

### `dropdown-menu` — Menu (Dropdown Menu + Popover) · Overlays

A trigger-anchored floating surface — a Dropdown Menu for a keyboard-navigable list of actions, or a Popover for freeform contextual content.
**Cuándo usar:** menú de acciones contextual sobre un botón/ícono ("⋮").
**Cuándo no:** click derecho sobre un área → Context Menu; navegación de nivel superior siempre visible → Menubar / Navigation Menu.
**Variantes:** dropdown · dropdown-item · dropdown-danger · dropdown-checkbox · dropdown-radio · dropdown-group · popover
**Tamaños:** dropdown · popover

Clases públicas: `.dropdown-checkbox-item` · `.dropdown-content` · `.dropdown-group` · `.dropdown-item` · `.dropdown-item-indicator` · `.dropdown-label` · `.dropdown-radio-item` · `.dropdown-separator` · `.dropdown-shortcut` · `.dropdown-trigger` · `.popover-content` · `.popover-description` · `.popover-header` · `.popover-title` · `.popover-trigger`

```html
<button class="dropdown-trigger">Opciones</button>
<div class="dropdown-content" role="menu" style="top:140px;left:60px">
  <div class="dropdown-label">Cuenta</div>
  <div class="dropdown-separator"></div>
  <button class="dropdown-item" role="menuitem">Editar perfil</button>
  <button class="dropdown-item" role="menuitem">Cerrar sesión</button>
</div>
```

Regla completa: `component-rules/menu.md` · CSS: `css/components/dropdown-menu.css`

---

### `empty-state` — Empty State · Feedback

A centered icon + message (+ optional primary action) shown when there is no content to display — always offering a clear way out, not just a message.
**Cuándo usar:** listas/tablas/búsquedas sin resultados o sin datos aún.
**Cuándo no:** features en construcción (usar Placeholder); carga en progreso (usar Skeleton).
**Variantes:** base

Clases públicas: `.btn-primary` · `.empty-state` · `.empty-state-desc` · `.empty-state-icon` · `.empty-state-title`

```html
<div class="empty-state">
  <svg class="empty-state-icon" aria-hidden="true" width="32" height="32"><!-- lucide --></svg>
  <div class="empty-state-title">No hay vacantes</div>
  <p class="empty-state-desc">Crea tu primera vacante para empezar.</p>
  <button class="btn-primary">+ Nueva vacante</button>
</div>
```

Regla completa: `component-rules/empty-state.md` · CSS: `css/components/empty-state.css`

---

### `form` — Form / Input / Textarea · Forms

The layout + validation pattern that composes labels, controls, hints, and errors into an accessible form using native HTML5 validation.
**Cuándo usar:** todo campo de entrada — input, select, textarea, number, date — con label, hint y error.
**Cuándo no:** búsqueda (usar search-field de toolbar.css o search-bar de search.css).
**Variantes:** card · grid · field

Clases públicas: `.field-char-count` · `.field-error-msg` · `.field-group` · `.field-hint` · `.field-input` · `.field-input-wrapper` · `.field-label` · `.field-leading-icon` · `.field-required` · `.field-supporting` · `.field-textarea` · `.field-trailing-icon` · `.fields-grid` · `.form-card` · `.form-card-desc` · `.form-card-title` · `.has-leading` · `.has-trailing` · `.is-error` · `.is-over` · `.select-caret` · `.select-wrapper`

```html
<div class="form-card">
  <div class="form-card-title">Informacion basica</div>
  <p class="form-card-desc">Completa los datos del puesto.</p>
  <div class="fields-grid">
    <div class="field-group">
      <label class="field-label">Titulo <span class="field-required">*</span></label>
      <input class="field-input" placeholder="Ej: Desarrollador Frontend">
    </div>
    <div class="field-group">
      <label class="field-label">Ubicacion</label>
      <div class="select-wrapper">
        <select><option>Remoto</option></select>
        <span class="select-caret">▾</span>
      </div>
    </div>
  </div>
</div>
```

Regla completa: `component-rules/form.md` · `component-rules/input.md` · `component-rules/textarea.md` · CSS: `css/components/form.css`

---

### `input-group` — Input Group · Forms

Joins an input with adjacent addons — icons, text, units, or buttons — into a single bordered unit that shares one focus/error state.
**Cuándo usar:** input con prefijo/sufijo (íconos, unidades, botón de acción), o un textarea con toolbar arriba/abajo.
**Cuándo no:** input simple (usar .field-input); búsqueda filtrable (Combobox).
**Variantes:** inline · block · addon-start · addon-end

Clases públicas: `.field-input` · `.input-group` · `.input-group-addon` · `.input-group-addon-end` · `.input-group-block` · `.input-group-control` · `.input-group-text` · `.is-disabled` · `.is-error` · `.kbd`

```html
<div class="input-group">
  <span class="input-group-addon"><svg>…</svg></span>
  <input class="input-group-control" placeholder="Buscar…">
  <span class="input-group-addon input-group-addon-end"><kbd class="kbd">⌘K</kbd></span>
</div>
```

Regla completa: `component-rules/input-group.md` · CSS: `css/components/input-group.css`

---

### `input-otp` — Input OTP · Forms

One-time-code / PIN entry in individual single-character boxes, with auto-advance, backspace-back, and paste-splitting.
**Cuándo usar:** códigos de verificación (2FA, SMS, email), PIN.
**Cuándo no:** texto libre (usar Input); un solo dígito (usar Input).
**Variantes:** base · slot · separator

Clases públicas: `.is-disabled` · `.is-error` · `.otp-group` · `.otp-separator` · `.otp-slot`

```html
<div class="otp-group" role="group" aria-label="Código de verificación">
  <input class="otp-slot" maxlength="1" inputmode="numeric">
  <input class="otp-slot" maxlength="1" inputmode="numeric">
  …
</div>
```

Regla completa: `component-rules/input-otp.md` · CSS: `css/components/input-otp.css`

---

### `item` — Basic Card · Data display / Containment

The reusable compact-row primitive — media + content (title/description) + actions — that every compact domain card is built on.
**Cuándo usar:** filas ricas y reutilizables (settings rows, resultados, notif con ícono/avatar + texto + acción), personas en grilla, listas con separadores.
**Cuándo no:** tabla de datos (Table); panel con header/footer (Full Card → card.css).
**Variantes:** base · outline · muted · clickable
**Tamaños:** md · sm

Clases públicas: `.btn-sm` · `.btn-tertiary` · `.item` · `.item-actions` · `.item-clickable` · `.item-content` · `.item-description` · `.item-footer` · `.item-group` · `.item-header` · `.item-media` · `.item-media-icon` · `.item-media-image` · `.item-muted` · `.item-outline` · `.item-separator` · `.item-sm` · `.item-title`

```html
<div class="item item-outline">
  <div class="item-media item-media-icon"><svg>…</svg></div>
  <div class="item-content">
    <div class="item-title">Notificaciones</div>
    <div class="item-description">Recibí avisos por email.</div>
  </div>
  <div class="item-actions"><button class="btn-tertiary btn-sm">Config</button></div>
</div>
```

Regla completa: `component-rules/item.md` · CSS: `css/components/item.css`

---

### `kanban` — Kanban Card · Domain cards

A compact draggable card representing one item (candidate or vacancy) on a kanban board column, where the item's current stage is the primary information.
**Cuándo usar:** tableros de flujo por columnas (pipelines de recruiting/HR).
**Cuándo no:** datos tabulares (usar Table); listas simples (usar cards).
**Variantes:** card · header · footer · title · meta · avatar

Clases públicas: `.count` · `.kanban-board` · `.kanban-card` · `.kanban-card-avatar` · `.kanban-card-footer` · `.kanban-card-header` · `.kanban-card-meta` · `.kanban-card-title` · `.kanban-column` · `.kanban-column-body` · `.kanban-column-header`

```html
<div class="kanban-board">
  <div class="kanban-column">
    <div class="kanban-column-header">
      Aplicados <span class="count">5</span>
    </div>
    <div class="kanban-column-body">
      <!-- Interactiva/arrastrable: agregá tabindex="0" role="button" — la card
           es focusable y trae :focus-visible + estado dragging. -->
      <div class="kanban-card" tabindex="0" role="button">
        <div class="kanban-card-title">Juan Perez</div>
        <div class="kanban-card-meta">Frontend · 3 dias</div>
      </div>
    </div>
  </div>
</div>
```

Regla completa: `component-rules/kanban-card.md` · CSS: `css/components/kanban.css`

---

### `label` — Label · Forms

A standalone styled <label> for any form control, especially non-text controls, decoupled from the text-input field-group.
**Cuándo usar:** nombrar un control de formulario, sobre todo checkbox/switch/ radio/slider, o un label suelto asociado por `for`/`id`.
**Cuándo no:** el label integrado de un input de texto con hint/error → usá `.field-label` dentro de `.field-group` (form.css). Título de sección → tipografía de heading, no un label.
**Variantes:** base · required

Clases públicas: `.field-input` · `.label` · `.label-required`

```html
<label class="label" for="email">Correo <span class="label-required">*</span></label>
<input class="field-input" id="email" type="email">

<!-- En línea con un control no-texto -->
<div style="display:flex;align-items:center;gap:8px">
  <input type="checkbox" id="tos">
  <label class="label" for="tos">Acepto los términos</label>
</div>
```

Regla completa: `component-rules/label.md` · CSS: `css/components/label.css`

---

### `list` — List · Data display

A simple vertical list of homogeneous items, each with a headline and optional supporting text, leading and trailing slots.
**Cuándo usar:** colecciones verticales de ítems homogéneos (bandeja de entrada, resultados, menús simples).
**Cuándo no:** datos tabulares con columnas → usar Table; navegación jerárquica → usar Navigation.
**Variantes:** base · divided · actionable · selected · disabled

Clases públicas: `.list` · `.list--divided` · `.list-item` · `.list-item-divider` · `.list-item-headline` · `.list-item-leading` · `.list-item-supporting` · `.list-item-text` · `.list-item-trailing`

```html
<ul class="list">
  <li class="list-item">
    <div class="list-item-headline">Bandeja de entrada</div>
    <div class="list-item-supporting">128 mensajes sin leer</div>
  </li>
</ul>
```

Regla completa: `component-rules/list.md` · CSS: `css/components/list.css`

---

### `menubar` — Menubar · Overlays

A horizontal, always-visible bar of top-level triggers (Archivo, Editar…), each opening an actions panel — the desktop-application menu pattern.
**Cuándo usar:** barra de menú de aplicación tipo desktop, siempre visible.
**Cuándo no:** menú de acciones puntual sobre un botón → Dropdown Menu.
**Variantes:** bar · trigger · panel

Clases públicas: `.dropdown-` · `.dropdown-content` · `.dropdown-item` · `.dropdown-separator` · `.menubar` · `.menubar-trigger`

```html
<div class="menubar">
  <button class="menubar-trigger">Archivo</button>
  <button class="menubar-trigger">Editar</button>
</div>
<div class="dropdown-content" role="menu" style="top:40px;left:8px">…</div>
```

Regla completa: `component-rules/menubar.md` · CSS: `css/components/menubar.css`

---

### `modal` — Dialog · Overlays

A modal surface that interrupts the user for a focused task or a decision that must be resolved before continuing.
**Cuándo usar:** confirmaciones y tareas cortas que bloquean el contexto actual.
**Cuándo no:** formularios largos (página con create-form); feedback pasivo (usar Snackbar).
**Variantes:** dialog · alert-dialog · compact · centered
**Tamaños:** default · sm

Clases públicas: `.btn-danger` · `.btn-primary` · `.btn-tertiary` · `.modal` · `.modal-body` · `.modal-centered` · `.modal-close` · `.modal-description` · `.modal-footer` · `.modal-header` · `.modal-media` · `.modal-overlay` · `.modal-sm` · `.modal-title`

```html
<div class="modal-overlay">
  <div class="modal">
    <button class="modal-close">✕</button>
    <div class="modal-header">
      <div class="modal-title">¿Eliminar la vacante?</div>
      <div class="modal-description">Esta acción no se puede deshacer.</div>
    </div>
    <div class="modal-body">
      <p>Se eliminarán también sus postulaciones asociadas.</p>
    </div>
    <div class="modal-footer">
      <button class="btn-tertiary">Cancelar</button>
      <button class="btn-primary btn-danger">Eliminar</button>
    </div>
  </div>
</div>
```

Regla completa: `component-rules/dialog.md` · CSS: `css/components/modal.css`

---

### `navigation-menu` — Navigation Menu · Navigation

A horizontal row of navigation triggers that reveal grouped-link flyout panels — the top-nav mega-menu pattern.
**Cuándo usar:** navegación principal con sub-secciones agrupadas (mega-menu).
**Cuándo no:** lista de acciones → Dropdown Menu; barra de menú tipo desktop → Menubar.
**Variantes:** root · list · trigger · indicator · viewport · content · link

Clases públicas: `.nav-menu` · `.nav-menu-content` · `.nav-menu-indicator` · `.nav-menu-link` · `.nav-menu-link-desc` · `.nav-menu-link-title` · `.nav-menu-list` · `.nav-menu-trigger` · `.nav-menu-trigger-icon` · `.nav-menu-viewport` · `.nav-menu-viewport-wrap`

```html
<nav class="nav-menu">
  <div class="nav-menu-list">
    <button class="nav-menu-trigger">Productos</button>
    <a class="nav-menu-trigger" href="/precios">Precios</a>
    <span class="nav-menu-indicator"></span>
  </div>
  <div class="nav-menu-viewport">
    <div class="nav-menu-content">…enlaces agrupados…</div>
  </div>
</nav>
```

Regla completa: `component-rules/navigation-menu.md` · CSS: `css/components/navigation-menu.css`

---

### `page-header` — Page Header · Layout

The title of a view plus its actions, on one row at the top of the content column — the anchor that tells a person which screen they are on.
**Cuándo usar:** título + acciones al tope de cada vista.
**Cuándo no:** dentro de cards o modales (tienen su propio header).
**Variantes:** default

Clases públicas: `.btn-primary` · `.header-actions` · `.page-header` · `.page-title`

```html
<div class="page-header">
  <h1 class="page-title">Vacantes</h1>
  <div class="header-actions">
    <button class="btn-primary">+ Nueva vacante</button>
  </div>
</div>
```

Regla completa: `component-rules/page-header.md` · CSS: `css/components/page-header.css`

---

### `pagination` — Pagination · Navigation

Navigate between pages of a paged result set — previous/next, numbered pages, and an ellipsis for large ranges.
**Cuándo usar:** dividir listas/tablas largas en páginas navegables.
**Cuándo no:** scroll infinito, o conjuntos chicos que caben en una vista.
**Variantes:** link · active · prev · next · ellipsis

Clases públicas: `.btn-text` · `.pagination` · `.pagination-ellipsis` · `.pagination-link` · `.pagination-list` · `.pagination-next` · `.pagination-prev`

Regla completa: `component-rules/pagination.md` · CSS: `css/components/pagination.css`

---

### `person-card` — Person Card · Domain cards

A documented Person variant of Basic Card (Item) — a compact profile row (brand avatar + name + role); NOT a separate component.
**Cuándo usar:** persona en grillas (avatar + nombre + rol).
**Cuándo no:** vacantes (vacancy-card); datos tabulares de personas (Table); una fila genérica sin avatar de marca (usá .item directamente).
**Variantes:** person-card · avatar

Clases públicas: `.item` · `.item-clickable` · `.item-content` · `.item-description` · `.item-media` · `.item-outline` · `.item-title` · `.people-grid` · `.person-avatar` · `.person-card`

```html
<div class="people-grid">
  <!-- Interactiva: .item-clickable trae cursor:pointer + hover; agregá
       tabindex="0" role="button" (o usá <a class="item person-card">) para
       que sea focusable y se anuncie como control. -->
  <div class="item item-outline item-clickable person-card" tabindex="0" role="button">
    <div class="item-media person-avatar">MG</div>
    <div class="item-content">
      <div class="item-title">María García</div>
      <div class="item-description">Desarrolladora Frontend</div>
    </div>
  </div>
</div>
```

Regla completa: `component-rules/person-card.md` · CSS: `css/components/person-card.css`

---

### `placeholder` — Placeholder Panel · Feedback

A centred panel that fills a region which has nothing to show *yet in this session* — nothing selected, a feature not built. Never for a list that returned no data.
**Cuándo usar:** panel para secciones/features en construcción.
**Cuándo no:** listas sin datos (usar Empty State).
**Variantes:** default

Clases públicas: `.placeholder-icon` · `.placeholder-panel`

```html
<div class="placeholder-panel">
  <svg class="placeholder-icon" aria-hidden="true" width="32" height="32"><!-- lucide --></svg>
  <p>Selecciona una vacante para ver los detalles.</p>
</div>
```

Regla completa: `component-rules/placeholder.md` · CSS: `css/components/placeholder.css`

---

### `popover` — Menu (Dropdown Menu + Popover) · Overlays

A trigger-anchored floating surface — a Dropdown Menu for a keyboard-navigable list of actions, or a Popover for freeform contextual content.
**Cuándo usar:** contenido contextual breve junto a un elemento (info extra, mini-formulario, selector custom).
**Cuándo no:** lista de acciones → Dropdown Menu; confirmación bloqueante → Dialog; texto de una línea al hover → Tooltip.
**Variantes:** dropdown · dropdown-item · dropdown-danger · dropdown-checkbox · dropdown-radio · dropdown-group · popover
**Tamaños:** dropdown · popover

Clases públicas: `.dropdown-checkbox-item` · `.dropdown-content` · `.dropdown-group` · `.dropdown-item` · `.dropdown-item-indicator` · `.dropdown-label` · `.dropdown-radio-item` · `.dropdown-separator` · `.dropdown-shortcut` · `.dropdown-trigger` · `.popover-content` · `.popover-description` · `.popover-header` · `.popover-title` · `.popover-trigger`

```html
<button class="popover-trigger">Abrir</button>
<div class="popover-content" style="top:120px;left:80px">…</div>
```

Regla completa: `component-rules/menu.md` · CSS: `css/components/popover.css`

---

### `progress` — Loading (Progress + Spinner) · Feedback

Loading indicators that signal an operation is in progress — a determinate Progress bar/ring when a percentage is known, an indeterminate Spinner when it isn't.
**Cuándo usar:** comunicar que una operación está en curso (carga, subida, procesamiento).
**Cuándo no:** una acción instantánea no necesita indicador — usá un spinner solo si tarda más de ~300ms; para estados vacíos usá Empty State, no un progress infinito.
**Variantes:** linear · linear-indeterminate · circular · circular-indeterminate · spinner · spinner-on-primary
**Tamaños:** spinner-sm · spinner-md · spinner-lg · progress-circular

Clases públicas: `.progress` · `.progress-circular` · `.progress-circular-fill` · `.progress-circular-indeterminate` · `.progress-circular-track` · `.progress-fill` · `.progress-indeterminate` · `.spinner` · `.spinner-lg` · `.spinner-on-primary` · `.spinner-sm`

```html
<div class="progress" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-fill" style="width: 60%"></div>
</div>
<div class="progress progress-indeterminate" role="progressbar"><div class="progress-fill"></div></div>
<svg class="progress-circular" viewBox="0 0 44 44"><circle class="progress-circular-track" cx="22" cy="22" r="18"/><circle class="progress-circular-fill" cx="22" cy="22" r="18" style="stroke-dashoffset: calc(113 - (113 * 60 / 100))"/></svg>
<svg class="progress-circular progress-circular-indeterminate" viewBox="0 0 44 44"><circle class="progress-circular-track" cx="22" cy="22" r="18"/><circle class="progress-circular-fill" cx="22" cy="22" r="18"/></svg>
```

Regla completa: `component-rules/loading.md` · CSS: `css/components/progress.css`

---

### `radio-group` — Radio Button · Selección

A native radio group for an exclusive single choice among 2–5 mutually exclusive values, all visible at once for comparison.
**Cuándo usar:** 2-6 opciones mutuamente excluyentes, todas visibles a la vez.
**Cuándo no:** selección múltiple independiente (usar Checkbox); muchas opciones o espacio limitado (usar Select); on/off inmediato (usar Switch).
**Variantes:** default · label · card

Clases públicas: `.radio` · `.radio-card` · `.radio-card-content` · `.radio-card-desc` · `.radio-card-title` · `.radio-group` · `.radio-label`

```html
<div class="radio-group" role="radiogroup" aria-label="Tipo de contrato">
  <label class="radio-label"><input type="radio" name="contract" class="radio" checked> Full-time</label>
  <label class="radio-label"><input type="radio" name="contract" class="radio"> Part-time</label>
</div>
```

Regla completa: `component-rules/radio.md` · CSS: `css/components/radio-group.css`

---

### `rich-tooltip` — Tooltip · Feedback

A small hover/focus text label that clarifies an ambiguous control — plus a click-triggered Rich Tooltip for a title + text + action preview. Never for essential information.
**Cuándo usar:** preview con título + texto + acción sobre un trigger (ícono, chip, avatar).
**Cuándo no:** un hint de una sola línea → Tooltip. Contenido arbitrario grande → un panel propio (Popover/Sheet).
**Variantes:** plain · rich
**Tamaños:** plain · rich

Clases públicas: `.btn-sm` · `.btn-text` · `.icon-btn` · `.open` · `.rich-tooltip-actions` · `.rich-tooltip-body` · `.rich-tooltip-close` · `.rich-tooltip-content` · `.rich-tooltip-row` · `.rich-tooltip-subtitle` · `.rich-tooltip-title` · `.rich-tooltip-top` · `.rich-tooltip-wrap` · `.tooltip-bottom` · `.tooltip-content` · `.tooltip-left` · `.tooltip-right` · `.tooltip-top` · `.tooltip-wrap`

```html
<span class="rich-tooltip-wrap">
  <button class="icon-btn">…</button>
  <div class="rich-tooltip-content rich-tooltip-top open" role="dialog">
    <div class="rich-tooltip-row">
      <div class="rich-tooltip-body">
        <p class="rich-tooltip-title">María García</p>
        <p class="rich-tooltip-subtitle">UX Designer · Disponible</p>
      </div>
      <button class="rich-tooltip-close">✕</button>
    </div>
    <div class="rich-tooltip-actions">
      <button class="btn-text btn-sm">Ver perfil</button>
    </div>
  </div>
</span>
```

Regla completa: `component-rules/tooltip.md` · CSS: `css/components/rich-tooltip.css`

---

### `scroll-area` — Scroll Area · Layout

A scroll container with a discreet, consistent custom scrollbar — pure CSS, for overflow regions inside a panel, menu, or sheet.
**Cuándo usar:** regiones con scroll donde querés una barra consistente y discreta (listas largas dentro de un panel, contenido de un menú/sheet).
**Cuándo no:** el scroll natural de la página completa (no lo envuelvas).
**Variantes:** base

Clases públicas: `.scroll-area`

```html
<div class="scroll-area" style="max-height: 320px">
  …contenido largo…
</div>
```

Regla completa: `component-rules/scroll-area.md` · CSS: `css/components/scroll-area.css`

---

### `search` — Search · Navigation / Forms

Free-text search of content, in two official variants — a standalone pill Search Bar (mobile/hero) and a compact Search Field inside a Toolbar (desktop).
**Cuándo usar:** search-bar standalone para vistas de búsqueda (desktop y mobile). Acompañar con .search-icon-btn para acciones contextuales (Filtros, Ordenar, Vista).
**Cuándo no:** reemplazar search-bar con un input de formulario (usar .form-input). Search con acciones — patrón canónico Embassy: Cuando la búsqueda convive con acciones, usar .search-row + .search-icon-btn.
**Variantes:** bar · field · row · view
**Tamaños:** standalone · row · compact

Clases públicas: `.form-input` · `.search-bar` · `.search-bar-avatar` · `.search-bar-icon` · `.search-bar-input` · `.search-bar-trailing` · `.search-field` · `.search-icon-btn` · `.search-row` · `.search-view` · `.search-view-back` · `.search-view-fullscreen` · `.search-view-header` · `.search-view-results`

```html
<!-- Search bar standalone -->
<div class="search-bar" role="search">
  <span class="search-bar-icon">…lupa…</span>
  <input class="search-bar-input" type="search" placeholder="Buscar" aria-label="Buscar">
  <span class="search-bar-avatar">AV</span>   <!-- opcional -->
</div>

<!-- Search + icon buttons (patrón canónico para toolbar-like) -->
<div class="search-row">
  <div class="search-bar" role="search">
    <span class="search-bar-icon">…lupa…</span>
    <input class="search-bar-input" type="search" placeholder="Buscar" aria-label="Buscar">
  </div>
  <button class="search-icon-btn" aria-label="Filtros"><svg>…</svg></button>
  <button class="search-icon-btn" aria-label="Ordenar"><svg>…</svg></button>
</div>

<!-- Search view (docked). Full-screen: + .search-view-fullscreen -->
<div class="search-view" role="search">
  <div class="search-view-header">
    <button class="search-view-back" aria-label="Volver">…</button>
    <input class="search-bar-input" type="search" placeholder="Buscar">
  </div>
  <ul class="search-view-results">…</ul>
</div>
```

Regla completa: `component-rules/search.md` · CSS: `css/components/search.css`

---

### `segmented-button` — Segmented Button · Actions

A compact pill that switches between 2–5 mutually exclusive views or modes; exactly one segment is active at a time.
**Cuándo usar:** alternar entre vistas (Lista / Cuadrícula), filtros de categoría o modo dentro del mismo contexto (Día / Semana / Mes).
**Cuándo no:** acciones que disparan efectos (usar Button), selección múltiple (usar Chips), navegación entre páginas (usar Tabs), más de 5 opciones o etiquetas muy dispares (usar Select).
**Variantes:** single · multiple
**Tamaños:** sm · md · lg

Clases públicas: `.seg-btn` · `.seg-btn-group` · `.seg-btn-group-lg` · `.seg-btn-group-sm` · `.selected`

```html
<div class="seg-btn-group" role="group" aria-label="Vista">
  <button class="seg-btn selected" aria-selected="true" onclick="segSwitch(this)">Lista</button>
  <button class="seg-btn" aria-selected="false" onclick="segSwitch(this)">Cuadrícula</button>
</div>
```

Regla completa: `component-rules/segmented-button.md` · CSS: `css/components/segmented-button.css`

---

### `select` — Select · Forms

Choose exactly one option from a short-to-medium bounded list via a themed dropdown listbox.
**Cuándo usar:** elegir UNA opción de una lista corta/media cuando el desplegable debe verse igual que el resto del DS (tokens, dark mode, foco).
**Cuándo no:** búsqueda/filtrado dentro de la lista → Combobox/Command; campo de formulario denso donde alcanza el nativo → <select> de form.css. Estructura (slots par shadcn): .select            → Root (position:relative) .select-trigger    → SelectTrigger (button, aria-haspopup="listbox") .select-value    → SelectValue (texto elegido / placeholder) .select-icon     → ChevronDown .select-content    → SelectContent (role="listbox") .select-scroll-up   → SelectScrollUpButton .select-viewport    → SelectViewport (área scrolleable, p-1) .select-group     → SelectGroup (role="group") .select-label   → SelectLabel .select-item    → SelectItem (role="option") .select-item-text  → SelectItemText .select-item-check → SelectItemIndicator (CheckIcon) .select-separator → SelectSeparator .select-scroll-down → SelectScrollDownButton
**Variantes:** styled · native · grouped
**Tamaños:** md · sm

Clases públicas: `.select` · `.select-content` · `.select-group` · `.select-icon` · `.select-item` · `.select-item-check` · `.select-item-text` · `.select-label` · `.select-scroll-down` · `.select-scroll-up` · `.select-separator` · `.select-trigger` · `.select-value` · `.select-viewport`

Regla completa: `component-rules/select.md` · CSS: `css/components/select.css`

---

### `sheet` — Bottom Sheet / Side Sheet · Overlays

An edge-anchored modal panel that slides up from the bottom for quick actions or supplementary content — the preferred overlay on mobile/compact.
**Cuándo usar:** cualquier panel anclado a un borde — filtros, detalle, formularios secundarios, bottom sheet en mobile.
**Cuándo no:** navegación principal (usar el app-shell / Navigation Drawer); diálogo modal centrado (usar Dialog/Modal).
**Variantes:** bottom · overlay · header · body · footer
**Tamaños:** default · desktop-centered

Clases públicas: `.btn-primary` · `.btn-tertiary` · `.open` · `.sheet-body` · `.sheet-close` · `.sheet-content` · `.sheet-content-bottom` · `.sheet-content-left` · `.sheet-content-right` · `.sheet-content-top` · `.sheet-description` · `.sheet-footer` · `.sheet-header` · `.sheet-overlay` · `.sheet-title`

```html
<div class="sheet-overlay">
  <div class="sheet-content sheet-content-right open">
    <button class="sheet-close">✕</button>
    <div class="sheet-header">
      <div class="sheet-title">Editar perfil</div>
      <div class="sheet-description">Actualizá tu información pública.</div>
    </div>
    <div class="sheet-body">…</div>
    <div class="sheet-footer">
      <button class="btn-tertiary">Cancelar</button>
      <button class="btn-primary">Guardar</button>
    </div>
  </div>
</div>
```

Regla completa: `component-rules/sheet-bottom.md` · `component-rules/sheet-side.md` · CSS: `css/components/sheet.css`

---

### `skeleton` — Skeleton · Feedback

An animated shimmer placeholder that mimics the layout of content while data loads — for loads with a known structure, in place of ad-hoc spinners.
**Cuándo usar:** carga de contenido con estructura conocida (mientras llega la data).
**Cuándo no:** estados vacíos (usar Empty State). No usar spinners ad-hoc.
**Variantes:** text · title · card · circle

Clases públicas: `.skeleton` · `.skeleton-avatar` · `.skeleton-card` · `.skeleton-circle` · `.skeleton-text` · `.skeleton-title`

```html
<div class="skeleton skeleton-title"></div>
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-text" style="width:80%"></div>
<div class="skeleton skeleton-card"></div>
```

Regla completa: `component-rules/skeleton.md` · CSS: `css/components/skeleton.css`

---

### `slider` — Slider · Forms

Selects a value (or a range) within a continuum with immediate feedback — for values where the exact number matters little.
**Cuándo usar:** valores donde el número exacto importa poco, con feedback inmediato.
**Cuándo no:** valores que requieren precisión exacta (usar Input numérico).
**Variantes:** single · range · vertical

Clases públicas: `.slider` · `.slider-input` · `.slider-range` · `.slider-track` · `.slider-vertical`

```html
<div class="slider">
  <div class="slider-track"></div>
  <div class="slider-range" style="width: 50%"></div>
  <input type="range" class="slider-input" min="0" max="100" value="50">
</div>
```

Regla completa: `component-rules/slider.md` · CSS: `css/components/slider.css`

---

### `spinner` — Loading (Progress + Spinner) · Feedback

Loading indicators that signal an operation is in progress — a determinate Progress bar/ring when a percentage is known, an indeterminate Spinner when it isn't.
**Cuándo usar:** carga breve/indeterminada dentro de botones, inputs, celdas, o junto a un texto ("Guardando…").
**Cuándo no:** carga con estructura conocida (usar Skeleton); progreso medible (usar Progress).
**Variantes:** linear · linear-indeterminate · circular · circular-indeterminate · spinner · spinner-on-primary
**Tamaños:** spinner-sm · spinner-md · spinner-lg · progress-circular

Clases públicas: `.btn-primary` · `.progress` · `.progress-circular` · `.progress-circular-fill` · `.progress-circular-indeterminate` · `.progress-circular-track` · `.progress-fill` · `.progress-indeterminate` · `.spinner` · `.spinner-lg` · `.spinner-on-primary` · `.spinner-sm`

```html
<span class="spinner" role="status" aria-label="Cargando"></span>
<button class="btn-primary"><span class="spinner spinner-sm spinner-on-primary"></span> Guardando…</button>
```

Regla completa: `component-rules/loading.md` · CSS: `css/components/spinner.css`

---

### `stat-card` — Stat Card · Data display

A single KPI/metric with a label, a large value, and an optional trend indicator.
**Cuándo usar:** métricas numéricas con label y variación (KPIs en dashboards).
**Cuándo no:** contenido no numérico (usar Card).
**Variantes:** base · trend-positive · trend-negative · trend-neutral

Clases públicas: `.stat-card` · `.stat-change` · `.stat-change-negative` · `.stat-change-neutral` · `.stat-change-positive` · `.stat-label` · `.stat-value` · `.stats-grid`

```html
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-label">Vacantes abiertas</div>
    <div class="stat-value">24</div>
    <div class="stat-change stat-change-positive">+12%</div>
  </div>
</div>
```

Regla completa: `component-rules/stat-card.md` · CSS: `css/components/stat-card.css`

---

### `switch` — Switch · Forms

A binary on/off control with immediate effect — flipping it applies the setting instantly, no separate confirm button.
**Cuándo usar:** ajustes que se aplican al instante (modo oscuro, notificaciones).
**Cuándo no:** selección dentro de una lista de opciones (usar Checkbox); elegir una entre varias alternativas (usar Radio Group).
**Variantes:** base · label
**Tamaños:** md · sm

Clases públicas: `.switch` · `.switch-label` · `.switch-sm`

```html
<label class="switch-label">
  <input type="checkbox" role="switch" class="switch">
  Modo oscuro
</label>
```

Regla completa: `component-rules/switch.md` · CSS: `css/components/switch.css`

---

### `table` — Table · Data display

Static tabular data — records with multiple comparable attributes in rows and columns, with an optional clickable-row variant.
**Cuándo usar:** datos tabulares; filas navegables con tr.clickable.
**Cuándo no:** layouts (usar grid); tableros de flujo (usar Kanban).
**Variantes:** base · clickable-row · selected-row · footer · caption

Clases públicas: `.caption` · `.clickable` · `.data-table` · `.selected` · `.table-scroll` · `.tfoot`

```html
<div class="table-scroll">
  <table class="data-table">
    <thead>
      <tr><th>Nombre</th><th>Estado</th><th>Fecha</th></tr>
    </thead>
    <tbody>
      <tr class="clickable"><td>Vacante 1</td><td>Abierta</td><td>15 Mar</td></tr>
    </tbody>
  </table>
</div>
```

Regla completa: `component-rules/table.md` · CSS: `css/components/table.css`

---

### `tabs` — Tabs · Navigation / Containment

Switch between mutually exclusive views of the same entity, showing one panel at a time.
**Cuándo usar:** alternar vistas dentro del MISMO contexto/página.
**Cuándo no:** navegación entre páginas (usar sidebar de layout.css).
**Variantes:** underline · pill · vertical

Clases públicas: `.active` · `.tab` · `.tab-indicator` · `.tab-panel` · `.tabs` · `.tabs-pill` · `.tabs-vertical`

```html
<div class="tabs" role="tablist">
  <button class="tab active" role="tab" aria-selected="true" id="tab-general" aria-controls="panel-general">General</button>
  <button class="tab" role="tab" aria-selected="false" id="tab-requisitos" aria-controls="panel-requisitos" tabindex="-1">Requisitos</button>
  <span class="tab-indicator"></span>
</div>
<div class="tab-panel active" id="panel-general" role="tabpanel" aria-labelledby="tab-general">...</div>
<div class="tab-panel" id="panel-requisitos" role="tabpanel" aria-labelledby="tab-requisitos" hidden>...</div>
```

Regla completa: `component-rules/tabs.md` · CSS: `css/components/tabs.css`

---

### `toast` — Snackbar · Feedback

A floating, ephemeral, non-blocking message that confirms something already happened, with at most one recovery action.
**Cuándo no:** confirmaciones que requieren decisión → usar Modal. Tokens Snackbar — familia inverse (auto-contraste en light y dark sin overrides): Contenedor       --color-inverse-surface       #0A0C12 claro / #EAEBED oscuro Texto mensaje    --color-inverse-on-surface     #EAEBED claro / #13161F oscuro Botón de acción  --color-inverse-primary        #4F80FF claro / #162F6F oscuro Presionado acc.  color-mix(inverse-primary 12%, inverse-surface)
**Variantes:** message · action · close · multiline · static · queue
**Tamaños:** single · multiline

Clases públicas: `.snackbar` · `.snackbar--exit` · `.snackbar--multiline` · `.snackbar--static` · `.snackbar-action` · `.snackbar-close` · `.snackbar-message` · `.snackbar-viewport` · `.toast` · `.toast-container` · `.toast-error` · `.toast-info` · `.toast-success`

```html
<!-- Solo mensaje -->
<div class="snackbar" role="status" aria-live="polite">
  <span class="snackbar-message">Archivo eliminado correctamente</span>
</div>

<!-- Mensaje + botón de acción -->
<div class="snackbar" role="status" aria-live="polite">
  <span class="snackbar-message">Archivo eliminado</span>
  <button class="snackbar-action">Deshacer</button>
</div>

<!-- Mensaje + acción + cierre -->
<div class="snackbar" role="status" aria-live="polite">
  <span class="snackbar-message">Invitación enviada</span>
  <button class="snackbar-action">Ver</button>
  <button class="snackbar-close" aria-label="Cerrar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
</div>

<!-- Mensaje largo apilado -->
<div class="snackbar snackbar--multiline" role="status" aria-live="polite">
  <span class="snackbar-message">No se pudo completar la operación en el servidor remoto</span>
  <button class="snackbar-action">Reintentar</button>
</div>

Dependencia: variables.css (Color Roles inverse)

Cola de apilado (Fase 3): .snackbar-viewport envuelve N .snackbar como
hijos flex en column-reverse — el más nuevo entra abajo (pegado al borde)
y los anteriores se acomodan arriba solos, sin recalcular offsets por
índice. Dentro del viewport cada .snackbar pasa a position:relative (el
viewport es el único position:fixed) y usa una animación de entrada/salida
sin el translateX(-50%) del modo standalone (el centrado horizontal ya lo
resuelve align-items:center del viewport). Ver components/lib/use-toast.ts
+ components/ui/toaster.tsx para la cola en sí (swipe-to-dismiss fuera de
alcance — solo botón de cierre / auto-dismiss por timeout).
```

Regla completa: `component-rules/snackbar.md` · CSS: `css/components/toast.css`

---

### `toggle-group` — Toggle Group · Actions

A set of related Toggles on one axis — multi-select (each independent) or single-select (choosing one deselects the rest); deliberately distinct from Segmented Button.
**Cuándo usar:** agrupar varios Toggle relacionados (formato de texto: negrita/cursiva/subrayado; alineación). type="single" = elegir 1; type="multiple" = varios on/off a la vez.
**Cuándo no:** elegir 1 de N mutuamente excluyentes con etiqueta de vista y forma de píldora (usar Segmented Button — visualmente distinto: outline de grupo + contenedor selected, ver segmented-button.css); filtros tipo tag (usar Chip).
**Variantes:** multiple · single

Clases públicas: `.toggle` · `.toggle-group`

```html
<div class="toggle-group" role="group" aria-label="Formato de texto">
  <button class="toggle" aria-pressed="false">B</button>
  <button class="toggle" aria-pressed="true">I</button>
  <button class="toggle" aria-pressed="false">U</button>
</div>
```

Regla completa: `component-rules/toggle-group.md` · CSS: `css/components/toggle-group.css`

---

### `toggle` — Toggle · Actions

A single two-state (pressed / not-pressed) button for a bold-style setting that applies immediately — state lives on aria-pressed.
**Cuándo usar:** alternar un solo estado on/off que se aplica de inmediato (negrita en un editor, "mostrar solo favoritos").
**Cuándo no:** elegir 1 de N (usar Segmented Button); filtros tipo tag (usar Chip); acción sin estado (usar Button).
**Variantes:** default · outline
**Tamaños:** sm · md · lg

Clases públicas: `.toggle` · `.toggle-lg` · `.toggle-outline` · `.toggle-sm`

```html
<button class="toggle" aria-pressed="false" onclick="togglePress(this)">
  <svg>…</svg>
</button>
<button class="toggle toggle-outline toggle-lg" aria-pressed="true">B</button>
```

Regla completa: `component-rules/toggle.md` · CSS: `css/components/toggle.css`

---

### `toolbar` — Toolbar · Actions / App bar

The row of controls that heads a list, table or dashboard — search, filters, view/period switches, and the view's actions — with variants for filters, bulk selection, overflow and sticky.
**Cuándo usar:** barra de controles sobre UNA lista/tabla/dashboard — búsqueda, filtros, orden y las acciones de esa vista.
**Cuándo no:** búsqueda que encabeza una pantalla completa → search-bar (search.css). Contexto y acciones globales de la app → Top Bar. Navegación entre sub-vistas → Tabs.
**Variantes:** toolbar · actions · search-field · button · filters · selection · overflow · two-line · sticky · result-count

Clases públicas: `.btn-primary` · `.result-count` · `.search-bar` · `.search-field` · `.seg-btn-group` · `.select` · `.toolbar` · `.toolbar-actions` · `.toolbar-btn` · `.toolbar-btn-count` · `.toolbar-filters` · `.toolbar-group` · `.toolbar-overflow-btn` · `.toolbar-selection` · `.toolbar-selection-clear` · `.toolbar-selection-count` · `.toolbar-spacer` · `.toolbar-stack` · `.toolbar-sticky`

```html
<div class="toolbar toolbar-filters" role="toolbar" aria-label="Controles de la lista">
  <div class="search-field"><i data-lucide="search"></i><input type="search" aria-label="Buscar"></div>
  <div class="select" data-select>…</div>
  <div class="seg-btn-group" role="group" aria-label="Vista">…</div>
  <div class="toolbar-actions"><button class="btn-primary">Nueva vacante</button></div>
</div>
<div class="result-count" aria-live="polite">Mostrando <strong>24</strong> vacantes</div>
```

Regla completa: `component-rules/toolbar.md` · CSS: `css/components/toolbar.css`

---

### `tooltip` — Tooltip · Feedback

A small hover/focus text label that clarifies an ambiguous control — plus a click-triggered Rich Tooltip for a title + text + action preview. Never for essential information.
**Cuándo usar:** un hint de texto simple sobre un ícono/control ambiguo.
**Cuándo no:** contenido con título + acción → usar Rich Tooltip (rich-tooltip.css).
**Variantes:** plain · rich
**Tamaños:** plain · rich

Clases públicas: `.icon-btn` · `.rich-tooltip-actions` · `.rich-tooltip-body` · `.rich-tooltip-close` · `.rich-tooltip-content` · `.rich-tooltip-row` · `.rich-tooltip-subtitle` · `.rich-tooltip-title` · `.rich-tooltip-wrap` · `.tooltip-bottom` · `.tooltip-content` · `.tooltip-left` · `.tooltip-right` · `.tooltip-top` · `.tooltip-wrap`

```html
<span class="tooltip-wrap">
  <button class="icon-btn" aria-describedby="tt-1"><svg>…</svg></button>
  <span class="tooltip-content tooltip-top" role="tooltip" id="tt-1">Ajustes</span>
</span>
```

Regla completa: `component-rules/tooltip.md` · CSS: `css/components/tooltip.css`

---

### `vacancy-card` — Vacancy Card · Domain cards

A domain card summarizing a job vacancy — icon, title, status badge, meta, optional stats and assignees — used as a list unit that navigates to the detail.
**Cuándo usar:** ítem de vacante en listas de recruiting (ícono + nombre + meta + stats).
**Cuándo no:** personas (person-card); otros dominios (usar Card genérica).
**Variantes:** card · icon · stats · assignees · age · more

Clases públicas: `.assignee` · `.assignee-avatar` · `.badge` · `.badge-open` · `.meta-dot` · `.more-btn` · `.stat-pill` · `.vacancies-list` · `.vacancy-age` · `.vacancy-card` · `.vacancy-icon` · `.vacancy-info` · `.vacancy-meta` · `.vacancy-name` · `.vacancy-right` · `.vacancy-stats`

```html
<div class="vacancies-list">
  <!-- Interactiva: agregá tabindex="0" role="button" (o usá <a>/<button>) —
       la card es focusable y trae :focus-visible. -->
  <div class="vacancy-card" tabindex="0" role="button">
    <svg class="vacancy-icon" aria-hidden="true" width="20" height="20"><!-- lucide --></svg>
    <div class="vacancy-info">
      <div class="vacancy-name">
        Desarrollador Frontend
        <span class="badge badge-open">Abierta</span>
      </div>
      <div class="vacancy-meta">
        Tecnologia <span class="meta-dot"></span> Remoto
      </div>
    </div>
    <div class="vacancy-right">
      <div class="vacancy-age">3d</div>
    </div>
  </div>
</div>
```

Regla completa: `component-rules/vacancy-card.md` · CSS: `css/components/vacancy-card.css`
