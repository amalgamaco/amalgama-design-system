---
id: table
display_name: Table
aliases: [data table static, tabular data, grid]
category: Data display
status: stable
summary: Static tabular data — records with multiple comparable attributes in rows and columns, with an optional clickable-row variant.

when_to_use:
  - "Lists of records with multiple comparable attributes (candidatos, vacantes)."
  - "The user needs to scan comparable data across columns."
  - "Admin dashboards and reports with tabular data (no sort/filter/select needed)."
when_not_to_use:
  - "The user must sort, filter, select, or paginate → use Data Table."
  - "A single record with many details → use a detail panel."
  - "Simple 1–2 attribute lists → use a List or card list."
  - "Mobile as the primary use case → tables degrade on narrow screens; consider a List of cards."
use_cases:
  - "Candidate list: Candidato · Rol · Estado · Fecha."
  - "A static report table wrapped in .table-scroll for horizontal overflow."

variants:
  - {name: base,      class: "data-table (inside .table-scroll)", purpose: "Standard static table."}
  - {name: clickable-row, class: "tr.clickable", purpose: "Row navigates to a detail; needs tabindex=0 for keyboard focus."}
  - {name: selected-row,  class: "tr.selected",  purpose: "Selected row background (used by Data Table's selection)."}
  - {name: footer,    class: tfoot,     purpose: "Totals/summary row: top border, tinted background, medium weight."}
  - {name: caption,   class: caption,   purpose: "Table title/note rendered at the bottom."}
sizes:
  - {name: default, class: "(default)", use: "single density; keep it consistent across the table"}
size_selection: "One density per table; do not mix compact and comfortable rows."

content_rules:
  - "Short, descriptive column headers; one data type per column."
  - "Status goes in a Badge in the cell, never as loose colored text."
  - "Right-align numbers, amounts, and dates; left-align text."
layout_constraints:
  - "Wrap the <table> in .table-scroll so wide tables scroll inside their own container (the radius/border live on the wrapper so header corners stay clipped)."
  - "Limit visible columns; keep density consistent."
  - "Show an Empty State when there is no data; paginate or virtualize beyond ~50 rows (that's a Data Table)."

states:
  default: "Header on surface-variant; body rows on card-bg."
  hover: "tbody tr:hover → surface-variant background."
  focus: "tr.clickable:focus-visible → 2px --color-focus outline + 4px --color-focus-ring halo (needs tabindex=0)."
  selected: "tr.selected → surface-container-high background."

accessibility:
  roles: "Native <table>/<thead>/<tbody>/<th>/<td>. Interactive (sortable/selectable) tables should use role=grid + arrow-key support — that's the Data Table."
  aria: ["scope=col on column headers", "scope=row where a row header applies", "caption or aria-label describing the table", "aria-sort on sortable headers (Data Table)"]
  focus: "Clickable rows need tabindex=0 to be reachable (the component doesn't add it) and respond to Enter/Space."
  contrast: "--text-primary / --text-muted / --color-surface-variant meet AA in light + dark; never override per theme."
keyboard:
  - {keys: "Tab", action: "move focus to each clickable row (needs tabindex=0)"}
  - {keys: "Enter / Space", action: "activate a focused clickable row"}
responsive:
  - "Tables degrade on small screens; the .table-scroll wrapper provides horizontal scroll rather than truncating or breaking layout."

ux_principles:
  - "Alignment and consistent density make columns scannable (law of common region / proximity)."
  - "Status as a Badge (not colored text) keeps meaning legible without relying on color alone."
common_mistakes:
  - "Omitting the .table-scroll wrapper, so a wide table stretches the page."
  - "Status as loose colored text instead of a Badge."
  - "Clickable rows without tabindex=0 (unreachable by keyboard)."
  - "Adding sort/filter/pagination by hand — use Data Table instead."
  - "Mixing data types or densities within a column/table."
nielsen_heuristics:
  - {id: 4, name: "Consistency and standards", note: "consistent alignment/density; status always via Badge"}
  - {id: 6, name: "Recognition rather than recall", note: "column headers label every attribute"}
  - {id: 8, name: "Aesthetic and minimalist design", note: "limit visible columns to what's comparable"}

relationships:
  related: [data-table, list, item, badge]
  replaces: ["legacy HTML tables"]
  composed_with: [badge, button, pagination, empty-state]
  not_to_confuse_with:
    - {component: data-table, why: "Data Table adds sort/filter/selection/pagination; Table is static"}
    - {component: list, why: "List is a simple 1–2 attribute vertical list; Table compares columns"}

tokens:
  color: [--card-bg, --border, --color-surface-variant, --text-primary, --text-muted, --color-focus, --color-focus-ring, --color-surface-container-high]
  radius: [--radius]
  spacing: ["10px 16px header padding", "12px 16px cell padding"]
  typography: [--font-size-overline, --font-size-body-md]

motion:
  enter: "none — the table is always present (rows are not animated in/out)"
  exit: "none"
  stateChange: "tbody rows recolor their background to --color-surface-variant on :hover (transition: background). A .selected row uses --color-surface-container-high (the selected state itself is not transitioned). A .clickable row's :focus-visible shows an outline + 3px --color-focus-ring box-shadow (not transitioned)."
  duration: "--duration-fast (row-hover background)"
  easing: "None specified — the row-hover transition declares only --duration-fast with no --ease-* token, so it falls back to the browser default ease. Per motion.md it should carry --ease-default."
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). No looping/essential motion; the hover tint still applies, just without the fade."
  constraints: "Only the row background is transitioned (effect, no layout). Don't animate row height or row insertion/removal — sort/filter/paginate should swap rows instantly (no reflow-driven motion)."
  relatedPatterns: ["motion.md → Hover & press micro-interactions (row-hover background = effect, Standard easing)"]

source:
  css: css/components/table.css
  classes: [table-scroll, data-table, clickable, selected, tfoot, caption]
  react_wrapper: components/ui/table.tsx
  docs_anchor: c-table
---

## Correct usage

```html
<div class="table-scroll">
  <table class="data-table">
    <thead>
      <tr><th scope="col">Candidato</th><th scope="col">Rol</th><th scope="col">Estado</th></tr>
    </thead>
    <tbody>
      <tr class="clickable" tabindex="0">
        <td>Ana García</td><td>Diseñadora UX</td><td><span class="badge badge-active">Activo</span></td>
      </tr>
    </tbody>
  </table>
</div>
```
*Why:* wrapped for scroll, scope=col headers, status as a Badge, clickable row reachable via tabindex=0.

## Incorrect usage

```html
<!-- ✕ Status as loose colored text, no scroll wrapper -->
<table class="data-table">
  <tbody><tr><td>Ana García</td><td style="color:green">Activo</td></tr></tbody>
</table>
```
*Fix:* wrap in `.table-scroll` and render status as `<span class="badge badge-active">Activo</span>`.

```html
<!-- ✕ Hand-wired sort/pagination on a static Table -->
<table class="data-table" onclick="sortColumn(event)">…</table>
```
*Fix:* use the Data Table (`[data-datatable]` + `initDataTable()`) which handles sort/filter/pagination and aria-sort.
