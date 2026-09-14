> **Esta guía vivía en la sección «Develop · Web» de `index.html`, que se retiró en septiembre de 2026.**
> Estaba sólo en el HTML de la doc, donde ninguna skill podía leerla: la regla del sistema es que la
> página publicada es validación visual, nunca fuente. Acá sí la lee `embassy:start` cuando configura
> un proyecto nuevo.

# Guía de implementación web

Todo lo que necesitás para integrar el Design System en un proyecto web — instalación, estructura, componentes, tokens y plantillas. Sin npm, sin build tools, solo HTML y CSS.


## 1. Instalacion

Agrega las fuentes de Google Fonts y los 4 archivos CSS al `` de tu HTML. No se necesita ningun otro paso.

```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Epilogue:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- Amalgama Design System -->
<link rel="stylesheet" href="css/variables.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/components.css">
```

| Archivo | Contenido | Lineas |
|---|---|---|
| `variables.css` | Design tokens: colores, radios, sombras, transiciones | 82 |
| `base.css` | Reset, tipografia, animaciones, clases utilitarias | 81 |
| `layout.css` | App shell: sidebar, topbar, contenido | 189 |
| `components.css` | Barrel: importa todos los componentes desde `css/components/` | — |


### Opcion B: Solo los componentes que necesitas

Copiá solo los archivos `.css` individuales que necesites desde `css/components/` — no hace falta el barrel completo:

```html
<!-- Solo los componentes que usas -->
<link rel="stylesheet" href="css/components/button.css">
<link rel="stylesheet" href="css/components/form.css">
<link rel="stylesheet" href="css/components/table.css">
<link rel="stylesheet" href="css/components/badge.css">
```


## 2. Estructura de pagina

Todas las paginas de la app usan este shell: un sidebar fijo a la izquierda con navegacion, un topbar sticky arriba, y el area de contenido principal.

```html
<div class="app">
  <!-- Sidebar (220px fijo) -->
  <aside class="sidebar">
    <div class="sidebar-logo">Mi App</div>
    <nav class="sidebar-nav">
      <div class="nav-section-label">Reclutamiento</div>
      <a class="nav-item active">Dashboard</a>
      <a class="nav-item">Vacantes</a>
      <a class="nav-item">Candidatos</a>
    </nav>
  </aside>

  <!-- Main (ocupa el resto) -->
  <main class="main">
    <!-- Topbar (56px sticky) -->
    <header class="topbar">
      <div class="topbar-breadcrumb">
        <a href="#">Reclutamiento</a>
        <span class="separator">/</span>
        Dashboard
      </div>
      <div class="avatar">MG</div>
    </header>

    <!-- Content -->
    <div class="content">
      <!-- Tu contenido aqui -->
    </div>
  </main>
</div>
```


## 3. Usar un componente

Cada componente es un archivo `.css` autocontenido en `css/components/` — usá las clases directamente en tu HTML/JSX. Si tu proyecto es React, copiá también el wrapper opcional desde `components/ui/` (+ `components/lib/utils.ts` para `cn()`). Cada archivo incluye un comment header con ejemplo de uso y la regla de decisión.


### Ejemplo: pagina de vacantes

Combinando `page-header`, `toolbar`, `data-table` y `badge` en una sola vista:

# Vacantes

| Puesto | Departamento | Candidatos | Estado |
|---|---|---|---|
| Disenador UX Senior | Producto | 12 | Abierta |
| Frontend Developer | Ingenieria | 8 | Abierta |
| Product Manager | Producto | 5 | Pendiente |

```html
<div class="content">
  <div class="page-header">
    <h1 class="page-title">Vacantes</h1>
    <button class="btn-primary">+ Nueva vacante</button>
  </div>

  <div class="toolbar">
    <div class="search-field">
      <svg ...>...</svg>
      <input type="text" placeholder="Buscar vacantes...">
    </div>
    <button class="toolbar-btn">Filtros</button>
  </div>

  <div class="result-count">Mostrando <strong>3</strong> vacantes</div>

  <table class="data-table">
    <thead>
      <tr><th>Puesto</th><th>Departamento</th><th>Estado</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>Disenador UX Senior</td>
        <td>Producto</td>
        <td><span class="badge badge-open">Abierta</span></td>
      </tr>
    </tbody>
  </table>
</div>
```


## 4. Personalizar tokens

Cambia cualquier variable en `variables.css` y toda la interfaz se actualiza automaticamente. Estos son los tokens principales:

| Token | Default | Controla |
|---|---|---|
| `--interactive` | #4F80FF | Botones, links, estados activos, badges destacados |
| `--primary-500` | #253e82 | Color navy del brand, hover de botones |
| `--radius` | 12px (lg) | Border-radius de cards, modals, tables |
| `--radius-md` | 8px | Border-radius de inputs, botones, kanban cards |
| `--bg` | var(--neutral-50) | Fondo de pagina |
| `--card-bg` | #ffffff | Fondo de tarjetas, sidebar, topbar |
| `--text-primary` | var(--primary-900) · #01164D | Texto principal de página (títulos y cuerpo) — navy brand. En dark: #EAEBED |
| `--border` | on-surface al 10% (color-mix) | Bordes de contenedores (cards, tablas, paneles). Los elementos interactivos usan `--color-outline` |
| `--shadow-md` | 0 4px 16px rgba(28,36,56,.08) | Hover en cards, dropdowns |
| `--duration-fast` | 120ms | Todas las transiciones rapidas (hover, focus) |


### Ejemplo: cambiar el color interactivo

```css
/* variables.css — cambia solo esta linea */
--interactive: #10b981;    /* de azul a verde */

/* Resultado: TODOS los botones, links, tabs activos,
   badges y focus rings cambian a verde */
```


## 5. Estructura de archivos

```text
frontend/
  css/
    variables.css          ← Tokens: colores, radios, sombras, transiciones
    base.css               ← Reset, tipografia, animaciones, utilidades
    layout.css             ← App shell: sidebar, topbar, contenido
    components.css         ← Barrel: importa todo css/components/
    components/
      button.css           ← clases planas (.btn-primary...), sin build step
      badge.css
      card.css
      ...                  ← autocontenidos: copia el .css que necesites
  components/ui/            ← wrappers React opcionales (mismas clases)
    button.tsx
    ...
  ui/
    index.html             ← Catalogo de componentes (SPA canonica)
```

| Archivo | Que incluye |
|---|---|
| `variables.css` | 6 paletas de color (neutral, primary, secondary, success, error, warning), aliases semanticos (--bg, --tertiary, --border...), escala de radius (sm/md/lg/xl/full), 3 niveles de sombra, tokens de transicion |
| `base.css` | Box-sizing reset, tipografia body (Inter 14px), headings (Epilogue 600), scrollbar custom, 6 keyframe animations, clases utilitarias (.text-muted, .font-mono, .sr-only) |
| `layout.css` | App shell (.app, .main, .content), sidebar (220px fijo), topbar (56px sticky con breadcrumbs y avatar) |
| `components.css` | Barrel que importa todos los componentes de `css/components/`. Enlazalo una vez (``). |
| `components/ui/*.tsx` | Wrappers React opcionales (mismas clases planas de `css/components/`, sin utilidades Tailwind). Copiá el `.tsx` + `components/lib/utils.ts` si tu proyecto es React. |


## 6. Convenciones de nombrado

| Patron | Ejemplo | Descripcion |
|---|---|---|
| `.componente` | `.card`, `.badge`, `.modal` | Clase base del componente |
| `.componente-elemento` | `.modal-header`, `.card-title` | Elemento hijo del componente |
| `.componente.modificador` | `.badge.badge-open`, `.btn-primary.btn-sm` | Variante visual |
| `.text-*` | `.text-muted`, `.text-accent` | Utilidades de color de texto |
| `.font-*` | `.font-mono`, `.font-heading` | Utilidades de familia tipografica |
| `--token-escala` | `--neutral-500`, `--radius-md` | Tokens con escala numerica |


### Colores semanticos para estados

```html
<!-- Exito / activo → verde -->
<span class="badge badge-open">Abierta</span>
<span class="badge badge-active">Activa</span>

<!-- Error / cerrado → rojo -->
<span class="badge badge-closed">Cerrada</span>

<!-- Warning → amarillo -->
<span class="badge badge-warning">Pendiente</span>

<!-- Neutro → gris -->
<span class="badge badge-draft">Borrador</span>
<span class="badge badge-archived">Archivada</span>

<!-- Tertiary (violeta) -->
<span class="badge badge-tertiary">Nueva</span>
```


## 7. Plantilla rapida

Copia esta plantilla para crear una nueva pagina desde cero:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi Pagina — Amalgama</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Epilogue:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/components.css">
</head>
<body>
  <div class="app">
    <aside class="sidebar">
      <div class="sidebar-logo">
        <svg width="20" height="20" ...>...</svg>
        NewPeopleForce
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-label">Menu</div>
        <a class="nav-item active">Dashboard</a>
        <a class="nav-item">Vacantes</a>
      </nav>
    </aside>
    <main class="main">
      <header class="topbar">
        <div class="topbar-breadcrumb">Dashboard</div>
        <div class="avatar">MG</div>
      </header>
      <div class="content">
        <div class="page-header">
          <h1 class="page-title">Dashboard</h1>
        </div>
        <!-- Agrega componentes aqui -->
      </div>
    </main>
  </div>
</body>
</html>
```
