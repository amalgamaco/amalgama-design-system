---
id: page-header
display_name: Page Header
aliases: [encabezado de página, título de vista, header de pantalla]
category: Layout
status: stable
summary: The title of a view plus its actions, on one row at the top of the content column — the anchor that tells a person which screen they are on.

when_to_use:
  - "The top of any full view that has a name: a list, a dashboard, a detail page, a settings screen."
  - "Wherever the screen's single primary action belongs — 'Nueva vacante', 'Invitar', 'Exportar'."
when_not_to_use:
  - "Inside a Card, Dialog or Sheet — each of those brings its own header."
  - "As the app-wide bar with the logo, search and avatar → that is the Top Bar in layout.css."
  - "Above a full-page creation form → `create-header`, which pairs with the sticky `create-footer`."
  - "As a section heading inside a page → a plain heading element with the type scale."
use_cases:
  - "'Vacantes' with a '+ Nueva vacante' primary button on the right."
  - "A candidate's name on a detail page, with an overflow menu of secondary actions."

variants:
  - {name: default, class: page-header, purpose: "The only variant — title left, actions right, space-between."}
sizes:
  - {name: md, class: "(default)", use: "the only size; --font-size-heading-lg title, 24px bottom margin."}
size_selection: "Single size by design. A view's title does not change weight by importance — hierarchy comes from the page below it."

content_rules:
  - "The title is the name of the view as it appears in the navigation. If the sidebar says 'Vacantes', the header says 'Vacantes' — not 'Listado de vacantes'."
  - "On a detail page the title is the record's name, not the entity type: 'Diseñador UX', not 'Detalle de vacante'."
  - "**One `btn-primary` maximum** in `.header-actions`. Everything else steps down to tertiary, text or an overflow menu."
  - "Three actions is the practical ceiling. Past that, the rest go behind an overflow menu."
layout_constraints:
  - "Title left, actions right, vertically centred, `space-between`. Never centre the title."
  - "Aligned to the same content grid as everything below it — the toolbar, the table and this header share one left edge."
  - "24px below it before the content starts; do not add extra margin to the first child."
  - "One per view."

states:
  default: "Static. The header itself has no states; its buttons carry their own."

accessibility:
  roles: "`.page-title` is the view's `<h1>` — exactly one per page, and it is this one."
  aria: ["No landmark of its own; it lives inside the page's main region", "Icon-only actions in .header-actions require aria-label"]
  focus: "Not focusable. Its buttons are, in DOM order after the title."
  contrast: "--text-primary on the page background, AA in both themes."
keyboard:
  - {keys: "Tab", action: "moves through .header-actions in DOM order, after any back-link above"}
responsive:
  - "On narrow screens the row wraps: title first, actions below, full width. Never shrink the title to keep one line."
  - "The primary action becomes `btn-lg` on mobile for the 44px touch target."
  - "When several actions do not fit, collapse them to an overflow menu rather than letting them wrap into a second cluster."

ux_principles:
  - "The title answers 'where am I' before anything else is read — it is the first fixation on the page (Nielsen 1)."
  - "Putting the primary action in a fixed, predictable place across every view means it is found by habit, not by search (Fitts, consistency)."
common_mistakes:
  - "Two `btn-primary` in `.header-actions`. If both look equally important, hierarchy is missing — step one down."
  - "A title that differs from the navigation label, so the person cannot confirm they landed where they clicked."
  - "'Detalle de vacante' instead of the record's actual name."
  - "Centring the title, or letting it break the content grid the toolbar and table follow."
  - "Using it inside a card or a modal, which already have headers."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "names the current view"}
  - {id: 4, name: "Consistency and standards", note: "same place, same shape, every screen — including where the primary action lives"}
  - {id: 8, name: "Aesthetic and minimalist design", note: "one primary action; the rest step down or hide behind overflow"}

relationships:
  related: [toolbar, back-link, breadcrumb, create-form]
  replaces: ["ad-hoc page headers"]
  composed_with: [button, dropdown-menu, badge, back-link]
  not_to_confuse_with:
    - {component: toolbar, why: "the toolbar governs the collection below it (search, filters, result count); the header names the view"}
    - {component: topbar, why: "the top bar is app-wide chrome — logo, global search, avatar — and lives in layout.css"}
    - {component: create-form, why: "a full-page creation form uses create-header + the sticky create-footer"}

tokens:
  color: [--text-primary]
  spacing: ["24px margin-bottom", "10px gap between actions"]
  typography: [--font-heading, --font-size-heading-lg]

motion:
  enter: "none — present with the page."
  exit: "none."
  stateChange: "none; the container is static. Its buttons animate per button.css."
  duration: "n/a"
  easing: "n/a"
  reducedMotion: "Nothing to reduce; inherits the global rule in css/base.css."
  constraints: "Do not animate the title in. The anchor of the page should be there the instant it paints."
  relatedPatterns: []

source:
  css: css/components/page-header.css
  classes: [page-header, page-title, header-actions]
  docs_anchor: c-page-header
---

## Correct usage

```html
<div class="page-header">
  <h1 class="page-title">Vacantes</h1>
  <div class="header-actions">
    <button class="btn-tertiary">Exportar</button>
    <button class="btn-primary">Nueva vacante</button>
  </div>
</div>
```
*Why:* title matches the nav label, one primary, the secondary steps down to outline.

## Incorrect usage

```html
<!-- ✕ Two competing primaries -->
<div class="page-header">
  <h1 class="page-title">Detalle de vacante</h1>
  <div class="header-actions">
    <button class="btn-primary">Importar</button>
    <button class="btn-primary">Nueva vacante</button>
  </div>
</div>
```
*Fix:* the title is the record's name ('Diseñador UX'), and 'Importar' — the lower-priority sibling — becomes `btn-tertiary`.
