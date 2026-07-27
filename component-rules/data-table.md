---
id: data-table
display_name: Data Table
aliases: [interactive table, sortable table, tanstack table]
category: Data display
status: stable
summary: An interactive table over static Table — column sort, text filter, row selection, column visibility, and slice pagination via initDataTable().

when_to_use:
  - "Long lists where the user needs to sort or filter by column."
  - "Batch-action flows: select rows → apply an action."
  - "Dashboards and back-office with many comparable records."
when_not_to_use:
  - "Short, static tables with no sort/filter → use Table."
  - "A single record with many details → use a detail panel."
  - "Mobile as the primary case → tables degrade; consider a List of cards."
use_cases:
  - "Candidate table with sortable columns, a text filter, and row selection for a bulk email."
  - "Back-office records paginated by slice with a column-visibility menu."

variants:
  - {name: base,        class: "[data-datatable] + initDataTable()", purpose: "Interactive table root wiring all features."}
  - {name: sortable-header, class: "data-table-sort-btn[data-dt-sort]", purpose: "Column header as a real <button>; toggles asc→desc with aria-sort + caret."}
  - {name: filter,      class: "data-table-filter + input[data-dt-filter]", purpose: "Substring filter over visible row text; resets to page 1."}
  - {name: selection,   class: "data-table-select + input[data-dt-selectall]", purpose: "Header select-all + per-row checkboxes with 'N de M' count; indeterminate on partial."}
  - {name: pagination,  class: "data-dt-pagesize", purpose: "Slice pagination; the bar hides when there is a single page."}
  - {name: empty,       class: data-table-empty, purpose: "Shown when the filter leaves no visible rows."}
sizes:
  - {name: default, class: "(default)", use: "inherits Table density"}
size_selection: "Inherits Table's single density; set page size via data-dt-pagesize."

content_rules:
  - "Status goes in a Badge, never loose colored text."
  - "Right-align numbers, amounts, and dates; left-align text."
  - "Always show the 'N de M fila(s) seleccionada(s)' count so batch actions are predictable."
  - "Offer the column-visibility menu when there are more columns than fit comfortably."
layout_constraints:
  - "Extends .data-table (table.css) — does not duplicate base table styles; still wrapped in .table-scroll."
  - "Toolbar: filter left, column menu right (data-table-toolbar)."
  - "Out of scope by design: column resize/pin/drag, faceted filters, row virtualization."

states:
  default: "Static table styling from table.css."
  hover: "Row hover from table.css; sort button hover → surface-variant."
  focus: "All controls (sort button, checkboxes, pagination) show the official focus ring (--color-focus)."
  selected: "tr.selected background; header checkbox indeterminate on partial selection."
  sorted: "Active th carries aria-sort=ascending|descending; caret opacity/rotation reflects direction."
  empty: "data-table-empty message when the filter yields no rows."

accessibility:
  roles: "Sortable header is a real <button> (keyboard focus/activation free), not a clickable th; native checkboxes for selection."
  aria: ["aria-sort=ascending/descending on the active th", "scope=col on column headers", "aria-label on each row checkbox and the select-all", "indeterminate DOM property announced as 'mixed'"]
  focus: "Every interactive control is keyboard-reachable with a visible focus ring."
  contrast: "Semantic tokens guarantee AA in light + dark; never override per theme."
keyboard:
  - {keys: "Enter / Space", action: "activate a sort header button; toggle a checkbox"}
  - {keys: "Tab / Shift+Tab", action: "move between sort buttons, checkboxes, and pagination"}
responsive:
  - "The toolbar and footer wrap on narrow widths; the table itself scrolls inside .table-scroll."

ux_principles:
  - "Sort/filter state must be visible (aria-sort + caret, live count) so the user trusts what they're acting on (visibility of system status)."
  - "One sort criterion at a time keeps the model predictable."
common_mistakes:
  - "Using a Data Table for a short static table (over-engineering) → use Table."
  - "Hiding the selection count, making batch actions unpredictable."
  - "Status as colored text instead of a Badge."
  - "Making a sortable header a clickable th instead of a <button>."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "aria-sort + caret + 'N de M' count reflect current state"}
  - {id: 3, name: "User control and freedom", note: "filter/sort are reversible; select-all can be cleared"}
  - {id: 7, name: "Flexibility and efficiency of use", note: "column-visibility and pagination scale to large datasets"}

relationships:
  related: [table, pagination, checkbox, dropdown-menu, empty-state]
  replaces: ["hand-wired sort/pagination tables"]
  composed_with: [badge, button, pagination, checkbox, dropdown-menu, input]
  not_to_confuse_with:
    - {component: table, why: "Table is static; Data Table adds sort/filter/selection/pagination"}
    - {component: list, why: "List is a simple vertical list, not a comparable-columns grid"}

tokens:
  color: [--color-surface-variant, --color-focus, --color-focus-ring, --text-muted, --border]
  radius: [--radius-sm]
  spacing: ["12px toolbar/footer gaps", "6px 8px sort-button padding"]
  typography: [--font-size-caption, --font-size-body-sm]

motion:
  enter: "none — the table renders in place; sorting, filtering and pagination re-slice rows instantly."
  exit: "none — filtered-out or off-page rows are hidden via the [hidden] attribute, no exit animation."
  stateChange: "All instant — no CSS transition is declared anywhere in data-table.css. The sort caret rotates 180deg (transform, descending) and gains full opacity when active; the sort button and rows change background/visibility with no timed transition; column-visibility toggles set display:none."
  duration: "none — data-table.css declares no motion tokens"
  easing: "none"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). No component-specific behavior — nothing here animates in the first place, so state changes already read as instant."
  constraints: "Sort/filter/paginate are instant state swaps by design — don't add row entrance/exit motion (a table reflowing on every sort is layout thrash). If feedback is ever wanted, animate opacity only on row show/hide, keep the caret a transform, and pull real --duration-*/--ease-* tokens rather than hardcoding."
  relatedPatterns: ["Visibility of system status — the caret/aria-sort communicate sort direction without motion", "Feedback (row hover) if ever added, as an effect on Standard easing"]

source:
  css: css/components/data-table.css
  classes: [data-table-sort-btn, data-table-sort-icon, data-table-toolbar, data-table-filter, data-table-select, data-table-footer, data-table-count, data-table-empty]
  react_wrapper: components/ui/data-table.tsx
  docs_anchor: c-data-table
---

## Correct usage

```html
<div data-datatable data-dt-pagesize="5">
  <div class="data-table-toolbar">
    <div class="data-table-filter">
      <input class="field-input" data-dt-filter placeholder="Filtrar candidatos…">
    </div>
    <!-- optional column-visibility menu on the right -->
  </div>
  <div class="table-scroll">
    <table class="data-table">
      <thead><tr>
        <th class="data-table-select"><input type="checkbox" class="checkbox" data-dt-selectall aria-label="Seleccionar todo"></th>
        <th scope="col"><button class="data-table-sort-btn" data-dt-sort>Candidato</button></th>
      </tr></thead>
      <tbody>…</tbody>
    </table>
  </div>
</div>
```
*Why:* filter + sortable header button + native select-all wired through `initDataTable()`; aria-sort and the selection count come for free.

## Incorrect usage

```html
<!-- ✕ Data Table for 3 static rows with no interaction -->
<div data-datatable><table class="data-table"><tbody>…3 rows…</tbody></table></div>
```
*Fix:* use a plain `Table` — reserve Data Table for sort/filter/select/paginate needs.

```html
<!-- ✕ Sortable header as a clickable th -->
<th scope="col" onclick="sort('name')">Candidato ▲</th>
```
*Fix:* use `<th scope="col"><button class="data-table-sort-btn" data-dt-sort>Candidato</button></th>` so it's keyboard-operable and exposes aria-sort.
