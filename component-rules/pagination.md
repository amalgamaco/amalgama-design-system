---
id: pagination
display_name: Pagination
aliases: [pager, page navigation, paginator]
category: Navigation
status: stable
summary: Navigate between pages of a paged result set — previous/next, numbered pages, and an ellipsis for large ranges.

when_to_use:
  - "Long lists/tables split into navigable pages."
  - "The user needs to jump to a specific page."
when_not_to_use:
  - "Infinite scroll or continuous feeds → use lazy loading."
  - "Small sets that fit in a single view → show them all."
  - "An unknown/unbounded total → prefer a 'cargar más' pattern."
use_cases:
  - "Candidate results split into pages of 20."
  - "A back-office table footer with page numbers and prev/next."

variants:
  - {name: link,   class: pagination-link,   purpose: "A numbered page link."}
  - {name: active, class: "pagination-link.is-active", purpose: "Current page — aria-current=page + secondary-container fill (same selection language as Chip/Nav)."}
  - {name: prev,   class: "btn-text pagination-prev", purpose: "Previous control (reuses btn-text)."}
  - {name: next,   class: "btn-text pagination-next", purpose: "Next control (reuses btn-text)."}
  - {name: ellipsis, class: pagination-ellipsis, purpose: "Collapsed middle pages for large ranges."}
sizes:
  - {name: default, class: "(default)", use: "single size; 36px targets"}
size_selection: "One size; page links are 36px min for a comfortable target."

content_rules:
  - "Number pages from 1; keep the current page obvious and non-clickable-as-navigation (it's the current location)."
  - "Use an ellipsis to collapse the middle of a large range, keeping first/last reachable."
  - "Prev/Next carry a clear label or an accessible name."
layout_constraints:
  - "Structure: nav.pagination > ul.pagination-list > li > (a.pagination-link | prev/next | ellipsis)."
  - "Prev/Next reuse .btn-text; the active page uses the secondary-container selection tokens."

states:
  default: "Link on transparent background."
  hover: "pagination-link:hover → surface-variant (active page keeps its fill)."
  focus: "focus-visible: 2px --color-focus outline + offset."
  active: "is-active → secondary-container / on-secondary-container + aria-current=page."
  disabled: "aria-disabled=true → pointer-events none, opacity .45 (e.g. Prev on page 1)."

accessibility:
  roles: "nav[aria-label] wrapping an <ol>/<ul>; page links are real <a>/<button>."
  aria: ["aria-label on the nav ('Paginación')", "aria-current=page on the active page", "aria-disabled on unavailable prev/next", "aria-hidden on the ellipsis glyph (with sr-only text if it conveys 'more pages')"]
  focus: "Every enabled control is keyboard-reachable with a visible focus ring."
  contrast: "Selection + text tokens meet AA in light + dark; never override per theme."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "move between page controls"}
  - {keys: "Enter / Space", action: "activate the focused page / prev / next"}
responsive:
  - "Collapse to fewer numbered pages + ellipsis on narrow widths; keep prev/next and current page visible."

ux_principles:
  - "Show where the user is (current page) and how far the set goes (first/last) — orientation (visibility of system status)."
  - "Keep prev/next reachable and disable them at the boundaries rather than hiding them."
common_mistakes:
  - "Using pagination for an infinite feed."
  - "No visible current-page indication / missing aria-current."
  - "Hiding prev/next at the boundaries instead of disabling them."
  - "Paginating a set small enough to show at once."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "aria-current + the active fill show the current page"}
  - {id: 3, name: "User control and freedom", note: "jump to any page or step back with prev"}
  - {id: 4, name: "Consistency and standards", note: "familiar prev / numbers / next model"}

relationships:
  related: [data-table, table, list]
  replaces: ["'cargar más' controls when the total is known and bounded"]
  composed_with: [data-table, table, button]
  not_to_confuse_with:
    - {component: data-table, why: "Data Table embeds slice pagination; standalone Pagination is the control itself"}
    - {component: breadcrumb, why: "Breadcrumb shows hierarchy/location, not page-through of a set"}

tokens:
  color: [--color-on-surface, --color-surface-variant, --color-secondary-container, --color-on-secondary-container, --text-secondary, --color-focus]
  radius: [--radius-md, --radius-sm]
  spacing: ["36px link height/min-width", "4px gap"]
  typography: [--font-size-body-md]

source:
  css: css/components/pagination.css
  classes: [pagination, pagination-list, pagination-link, pagination-prev, pagination-next, pagination-ellipsis]
  react_wrapper: components/ui/pagination.tsx
  docs_anchor: c-pagination
---

## Correct usage

```html
<nav class="pagination" aria-label="Paginación">
  <ul class="pagination-list">
    <li><a class="btn-text pagination-prev" href="#">‹ Anterior</a></li>
    <li><a class="pagination-link" href="#">1</a></li>
    <li><a class="pagination-link is-active" aria-current="page" href="#">2</a></li>
    <li><a class="pagination-link" href="#">3</a></li>
    <li><span class="pagination-ellipsis"><span aria-hidden="true">…</span><span class="sr-only">Más páginas</span></span></li>
    <li><a class="btn-text pagination-next" href="#">Siguiente ›</a></li>
  </ul>
</nav>
```
*Why:* labelled nav, current page via aria-current + fill, ellipsis with sr-only text, prev/next present.

## Incorrect usage

```html
<!-- ✕ No current-page indication -->
<nav class="pagination"><ul class="pagination-list">
  <li><a class="pagination-link" href="#">1</a></li>
  <li><a class="pagination-link" href="#">2</a></li>
</ul></nav>
```
*Fix:* mark the current page with `is-active` + `aria-current="page"` and give the nav an `aria-label`.

```html
<!-- ✕ Pagination over an infinite feed -->
<nav class="pagination">…on a continuously loading timeline…</nav>
```
*Fix:* use lazy/infinite loading; reserve Pagination for a bounded, paged set.
