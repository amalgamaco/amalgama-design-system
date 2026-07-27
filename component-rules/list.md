---
id: list
display_name: List
aliases: [list view, item list, menu list]
category: Data display
status: stable
summary: A simple vertical list of homogeneous items, each with a headline and optional supporting text, leading and trailing slots.

when_to_use:
  - "A set of homogeneous items (mensajes, archivos, ajustes)."
  - "Each item with primary text + optional supporting text or one action."
  - "Logical subgroups separated by a Separator."
when_not_to_use:
  - "Comparable tabular data with columns → use Table."
  - "Cards with media/rich hierarchy or a footer → use Full Card (or the Basic Card row primitive)."
  - "Primary app navigation → use Navigation."
use_cases:
  - "Inbox: 'Bandeja de entrada — 128 mensajes sin leer'."
  - "A settings list with a leading icon and a trailing switch."
  - "A simple selectable options list."

variants:
  - {name: base,        class: list,               purpose: "Vertical list container on surface."}
  - {name: divided,     class: "list--divided / list-item-divider", purpose: "Separators between items."}
  - {name: actionable,  class: "button.list-item", purpose: "Whole-row button: hover, focus ring, Enter/Space."}
  - {name: selected,    class: "list-item.is-selected / [aria-selected=true]", purpose: "Selected row — secondary-container (same selection language as Nav/Menu)."}
  - {name: disabled,    class: "list-item.is-disabled / button.list-item:disabled", purpose: "Inert item: opacity .5, no pointer events."}
sizes:
  - {name: default, class: "(default)", use: "single density; min-height 56px per item"}
size_selection: "One density per list — do not mix one-line and two-line items."

content_rules:
  - "list-item-headline is the primary text (1 line); list-item-supporting is optional secondary text."
  - "Truncate long text with ellipsis rather than wrapping to a third line."
  - "One trailing element per item; keep headline/supporting consistent across items."
  - "Leading slot (avatar/icon or nothing) should be uniform across the list."
layout_constraints:
  - "Slots: list-item-leading | (headline + supporting, stacked in list-item-text) | list-item-trailing (margin-left auto)."
  - "Group subgroups with a separator; keep vertical spacing and line length consistent."

states:
  default: "Row on surface; supporting text on-surface-variant."
  hover: "Actionable rows (button.list-item) get a surface-variant background."
  focus: "button.list-item focus-visible: inset 2px --color-focus outline + inset 4px --color-focus-ring halo."
  selected: "is-selected / aria-selected=true → secondary-container / on-secondary-container."
  disabled: "opacity .5, no pointer events."

accessibility:
  roles: "Semantic list via role=list with role=listitem; actionable items are real <button class=\"list-item\"> elements."
  aria: ["role=list / role=listitem", "aria-selected=true on a selected row", "aria-label on icon-only trailing controls"]
  focus: "Actionable items are keyboard-operable (Enter/Space) with a visible focus ring; meaning is never conveyed by position alone."
  contrast: "--color-on-surface / --color-on-surface-variant meet AA in light + dark; never override per theme."
keyboard:
  - {keys: "Tab", action: "focus each actionable item"}
  - {keys: "Enter / Space", action: "activate a focused actionable item"}
responsive:
  - "The 56px min-height item guarantees a comfortable touch target; the list can sit beside a detail panel (list-detail) on wide screens."

ux_principles:
  - "Uniform rows make a collection scannable (law of similarity / common region)."
  - "Truncate rather than reflow so row rhythm stays predictable."
common_mistakes:
  - "Using a List where columns must align across rows (that's Table)."
  - "Mixing one-line and two-line item densities."
  - "Using a List as primary app navigation."
  - "Conveying meaning by position instead of clear headline/supporting text."
nielsen_heuristics:
  - {id: 4, name: "Consistency and standards", note: "one density and slot layout across items"}
  - {id: 6, name: "Recognition rather than recall", note: "headline + supporting label every item"}
  - {id: 8, name: "Aesthetic and minimalist design", note: "one trailing element per item"}

relationships:
  related: [item, table, navigation-menu]
  replaces: ["unstyled <ul>/<li>"]
  composed_with: [avatar, badge, switch, checkbox, divider, button]
  not_to_confuse_with:
    - {component: item, why: "Basic Card (item) is a richer, media-capable row primitive; List is a simpler homogeneous list"}
    - {component: table, why: "Table aligns comparable columns; List is a single-column vertical set"}
    - {component: navigation-menu, why: "Navigation is app-level wayfinding; List is content"}

tokens:
  color: [--color-surface, --color-on-surface, --color-on-surface-variant, --color-surface-variant, --color-secondary-container, --color-on-secondary-container, --border, --color-focus, --color-focus-ring]
  spacing: ["12px 16px item padding", "56px min-height"]
  typography: [--font-size-body-md, --font-size-body-sm]

motion:
  enter: "none — list items render statically; there is no per-item entrance animation."
  exit: "none"
  stateChange: "Instant — no CSS transition is declared in list.css. Interactive rows (button.list-item) swap background on hover (--color-surface-variant) and on selection (--color-secondary-container / on-secondary-container); disabled rows drop to opacity .5. All applied with no timed transition."
  duration: "none — list.css declares no motion tokens"
  easing: "none"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). No component-specific behavior — the hover/selection background changes are already instant."
  constraints: "Row feedback is background-color only; if a hover/selection transition is ever added, keep it background-color on Standard easing and pull a --duration-* token. Never animate item height or reflow the list (layout thrash). Selection shares the menu/nav secondary-container language — style, not motion."
  relatedPatterns: ["Feedback — hover/selection background confirms which row is active", "Shared selection language with Menu/Nav (color, not motion)"]

source:
  css: css/components/list.css
  classes: [list, list-item, list-item-text, list-item-headline, list-item-supporting, list-item-leading, list-item-trailing, list-item-divider, list--divided]
  react_wrapper: null
  docs_anchor: c-list
---

## Correct usage

```html
<ul class="list" role="list">
  <li class="list-item" role="listitem">
    <div class="list-item-headline">Bandeja de entrada</div>
    <div class="list-item-supporting">128 mensajes sin leer</div>
  </li>
  <hr class="list-item-divider">
  <li role="listitem"><button class="list-item" type="button">
    <div class="list-item-headline">Enviados</div>
  </button></li>
</ul>
```
*Why:* homogeneous rows, an actionable row as a real button, subgroups split by a separator.

## Incorrect usage

```html
<!-- ✕ List forced to act like a comparable-columns table -->
<ul class="list">
  <li class="list-item"><span>Ana</span><span>UX</span><span>Activo</span></li>
</ul>
```
*Fix:* use a `table.data-table` so columns align and are scannable.

```html
<!-- ✕ Actionable row as a div onclick -->
<li class="list-item" onclick="open()">…</li>
```
*Fix:* use `<button class="list-item">` so it's keyboard-operable with a focus ring.
