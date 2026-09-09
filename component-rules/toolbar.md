---
id: toolbar
display_name: Toolbar
aliases: [tool bar, filter bar, filter toolbar, action bar, list controls, bulk actions bar]
category: Actions / App bar
status: stable
summary: The row of controls that heads a list, table or dashboard — search, filters, view/period switches, and the view's actions — with variants for filters, bulk selection, overflow and sticky.
when_to_use:
  - "Heading a list, table or dashboard with search, filters, sorting and the view's action."
  - "Unifying equal-hierarchy filter controls (Select + Segmented Button + Date Picker) under one field treatment → the .toolbar-filters variant."
  - "Offering bulk actions after selecting items → the .toolbar-selection variant."
  - "Summarizing the filtered result with a .result-count line below the bar."
when_not_to_use:
  - "Search that heads a whole screen → use the standalone Search Bar (.search-bar, 56px)."
  - "App context and global actions (profile, notifications) → use the Top Bar."
  - "In-page navigation between sub-views → use Tabs."
  - "Several equal-weight primary actions → keep one btn-primary and step the rest down."
use_cases:
  - "Encabezar la lista de vacantes con búsqueda, filtro de estado y 'Nueva vacante'."
  - "Dashboard: Select de métrica + Select de grupo + Segmented Button Mes/Semana + Date Picker de rango + 'Sincronizar repos' (variante .toolbar-filters)."
  - "Barra de acciones masivas 'N seleccionados · Archivar · Eliminar' sobre una tabla (variante .toolbar-selection)."
variants:
  - {name: toolbar, class: toolbar, purpose: "The single-row flex container (flex-wrap, gap --space-2, margin-bottom --space-4)."}
  - {name: actions, class: toolbar-actions, purpose: "Right-aligned action slot (margin-left:auto); holds the one primary + supporting actions."}
  - {name: search-field, class: search-field, purpose: "Compact search variant; surface background, grows with flex:1."}
  - {name: button, class: toolbar-btn, purpose: "Outlined secondary action (filters/sort/reset); optional .toolbar-btn-count chip."}
  - {name: filters, class: toolbar-filters, purpose: "Field-unification variant (ex Filter Toolbar): Select + Segmented Button + Date Picker share one field treatment via the --tb-* token layer. Scoped re-skin; does not change the standalone components."}
  - {name: selection, class: toolbar-selection, purpose: "Bulk-actions variant shown when items are selected; tinted surface + count (.toolbar-selection-count) + clear (.toolbar-selection-clear)."}
  - {name: overflow, class: toolbar-overflow-btn, purpose: "'More' icon trigger that opens a Dropdown/Popover holding controls that don't fit."}
  - {name: two-line, class: toolbar-stack, purpose: "Desktop two-line layout: two stacked .toolbar rows (row 1 search + primary action, row 2 filters) when controls exceed one line."}
  - {name: sticky, class: "toolbar-sticky (+ .is-stuck)", purpose: "Sticks the bar to the top on scroll; shadow/border once unstuck."}
  - {name: result-count, class: result-count, purpose: "Summary line below the bar; the number in <strong>, ideally aria-live=polite."}
sizes:
  - {name: default, class: "(default)", use: "single row; controls share the same height (40px in the filters variant)"}
size_selection: "Single density by design. The search-field grows (flex:1); pair the view action with btn-primary btn-sm to keep heights aligned. In .toolbar-filters every control is --tb-height (40px)."
content_rules:
  - "Left→right by frequency of use: search → filters (most-used first) → view/sort switch → view action."
  - "One primary action per bar (far right); everything else is Neutral fill (btn-secondary), Outlined (toolbar-btn/btn-tertiary) or icon. Secondary actions sit to the left of the primary inside .toolbar-actions."
  - "Left holds what filters/defines the view; right (.toolbar-actions) holds the actions."
  - "result-count reflects the real filtered count ('Mostrando N de M') and updates on filter."
  - "In .toolbar-filters, controls of the same hierarchy share the same field container — don't mix filled and transparent without a documented hierarchy reason."
  - "Desktop layout: one line is the default; keep it while controls fit comfortably (~5 interactive controls max, counting search + primary). Beyond that, use two lines (.toolbar-stack) or move the excess to overflow."
layout_constraints:
  - "One row that wraps (flex-wrap); the search-field grows, controls sit to its right at equal height."
  - ".toolbar-filters is a scoped re-skin: it restyles .select-trigger / .date-picker-trigger / .seg-btn-group ONLY within .toolbar-filters — it must not change the standalone Select, Segmented Button or Date Picker."
  - "In .toolbar-filters the Segmented Button container adopts the field (squared --radius-md); the selected segment keeps its primary state (--color-secondary-container) and each segment keeps its own focus ring."
  - "On narrow viewports collapse secondary filters into a single 'Filtros' button that opens a Sheet/Popover; overflow controls go behind .toolbar-overflow-btn."
  - "Don't mix Toolbar with the shell — global context/actions live in the Top Bar."
  - "Desktop one-line vs two-line: prefer explicit two lines (.toolbar-stack — row 1 search + primary action, row 2 filters) over letting the bar wrap unpredictably; controls stay centered on one 40px baseline. When space is limited the search and the single primary action stay visible first; the view/sort switch collapses to overflow, then secondary filters collapse to a 'Filtros' button. (Mobile wrap/collapse rules are separate — see responsive.)"
states:
  default: "Resting bar."
  hover: "toolbar-btn tints (--color-surface-variant); search-field lightens; in .toolbar-filters the field tints (--tb-surface-hover) and border darkens (--tb-border-hover)."
  focus: "toolbar-btn :focus-visible (2px --color-focus + 4px ring); search-field :focus-within (border --color-secondary); .toolbar-filters field focus = border --interactive + 3px --tb-focus-ring; each seg-btn keeps its own ring."
  active: "toolbar-btn dims on press (opacity .85); Segmented Button selection → --color-secondary-container/--color-on-secondary-container."
  disabled: "toolbar-btn / field: surface --color-surface-variant, text --color-on-disabled, border --color-outline, pointer-events:none."
  loading: "Controls take disabled/aria-busy; the body shows Skeleton — the bar stays visible, never hidden."
  empty: "Filters stay visible; the empty result is shown in the list/table (Empty State), not in the bar."
  selection: ".toolbar-selection: tinted secondary-container surface, count + clear + bulk actions; enters on --duration-normal."
accessibility:
  roles: "Container may take role=\"toolbar\" + aria-label; search uses <input type=\"search\">; filters use Select (role=listbox), Segmented Button (button group), Date Picker (button+popover)."
  aria: ["aria-label on the search input when there's no visible <label>", 'aria-live="polite" on result-count and on .toolbar-selection-count', 'aria-haspopup="menu" + aria-label on .toolbar-overflow-btn', "Select/Segmented Button provide their own semantics"]
  focus: "Tab order follows visual order (search → filters → actions); never suppress the native <input> outline; each seg-btn segment keeps its focus ring (WCAG 2.4.7)."
  contrast: "Tokens (--color-surface, --card-bg, --border, --interactive, --color-secondary-container) guarantee AA in light + dark — never theme overrides."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "move through search, filters, sort, actions in visual order"}
  - {keys: "Enter / Space", action: "activate the focused control / segment / action"}
  - {keys: "↑ ↓ / Home / End / type-ahead / Esc", action: "operate a focused Select"}
  - {keys: "Enter / Esc", action: "open / close a focused Date Picker"}
  - {keys: "Type (in search)", action: "filter the list"}
responsive:
  - "The bar wraps (flex-wrap); below 768px the search-field goes full-width and .toolbar-actions stops pushing right."
  - "Collapse secondary filters into one 'Filtros' button/panel (Sheet/Popover) on narrow widths."
  - "Move controls that don't fit behind .toolbar-overflow-btn."
  - "Keep controls at a ≥44px touch target on coarse pointers."
ux_principles:
  - "Group a list's controls in one predictable place so users don't hunt for filters (recognition over recall)."
  - "Consistency & standards: controls of equal hierarchy look equal — one field treatment, not a mix of filled fields and transparent pills."
  - "Preserve action hierarchy — one primary, the rest supportive — even when the legacy bar was flat."
common_mistakes:
  - "Using the mobile Search Bar (56px, gray) inside a Toolbar instead of the compact search-field."
  - "Leaving a Segmented Button as a transparent pill next to filled Select fields — use .toolbar-filters."
  - "Globally restyling the standalone Segmented Button / Date Picker / Select to 'match' — restyle only inside .toolbar-filters."
  - "Several primary actions with equal weight (keep one btn-primary)."
  - "Page-specific CSS overrides to line controls up instead of using the variant."
  - "result-count that doesn't update or misreports the count."
  - "Putting global/shell actions in the Toolbar (they belong in the Top Bar)."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "filters and sort are visible controls, not remembered commands"}
  - {id: 4, name: "Consistency and standards", note: "equal-hierarchy filters share one field treatment (.toolbar-filters)"}
  - {id: 1, name: "Visibility of system status", note: "result-count and selection-count announce state after filtering/selecting"}
  - {id: 7, name: "Flexibility and efficiency of use", note: "search + filters + sort speed up the frequent list task"}
relationships:
  related: [search, select, combobox, segmented-button, calendar, date-picker, checkbox, button, page-header, data-table]
  replaces: ["legacy filter bars", "flat action rows", "the former standalone Filter Toolbar (now the .toolbar-filters variant)"]
  composed_with: [search, select, combobox, segmented-button, date-picker, calendar, checkbox, button, table, data-table, chip, dropdown-menu, popover]
  not_to_confuse_with:
    - {component: topbar, why: "Top Bar is app chrome + global actions; Toolbar controls one list/table/dashboard"}
    - {component: page-header, why: "Page Header titles the content; the Toolbar carries its controls"}
    - {component: search, why: "the standalone Search Bar heads a whole screen; the Toolbar uses the compact search-field"}
    - {component: segmented-button, why: "standalone it is a transparent pill; inside .toolbar-filters only its container adopts the shared field — the component is unchanged"}
tokens:
  color: [--color-surface, --card-bg, --color-on-surface-variant, --color-surface-variant, --color-outline, --color-secondary, --interactive, --color-focus-ring, --color-secondary-container, --color-on-secondary-container, --text-muted]
  radius: [--radius-md, --radius-sm, --radius-full]
  spacing: [--space-2, --space-3, --space-4, "--tb-height 40px", "--tb-pad-x 14px"]
  typography: [--font-size-body-md, --font-size-label, --font-size-caption, --font-body]
  motion: [--duration-fast, --duration-normal, --ease-default]
  component: [--tb-height, --tb-surface, --tb-surface-hover, --tb-border, --tb-border-hover, --tb-border-focus, --tb-focus-ring, --tb-radius, --tb-pad-x, --tb-gap, --tb-icon, --tb-selected-bg, --tb-selected-text, --tb-motion-duration, --tb-motion-ease]
motion:
  enter: "The bar is static. The .toolbar-selection variant enters on --duration-normal / --ease-default (opacity + translateY). Panels of child controls (Select listbox, Date Picker popover) open on --duration-fast / --ease-default (via --tb-motion-*)."
  exit: "Panels close on the same duration/easing; the bar has no exit motion."
  stateChange: "Hover (surface/border), focus (border + ring) and Segmented Button selection transition on --tb-motion-duration / --tb-motion-ease (--duration-fast / --ease-default). toolbar-btn hover/press are --duration-fast."
  duration: "--duration-fast (120ms) for control state changes and panel entrances; --duration-normal (200ms) for the selection-bar entrance."
  easing: "--ease-default."
  reducedMotion: "toolbar.css declares a scoped @media (prefers-reduced-motion: reduce) block neutralizing control transitions and the selection-bar animation, on top of the global rule in css/base.css."
  constraints: "No transform/scale/bounce on the controls — only background/border/box-shadow (and the selection-bar's small translateY entrance). Panel entrances belong to the child components; the toolbar only guarantees they share the --duration-fast / --ease-default contract."
source:
  css: css/components/toolbar.css
  classes: [toolbar, toolbar-group, toolbar-actions, toolbar-spacer, search-field, toolbar-btn, toolbar-btn-count, result-count, toolbar-filters, toolbar-selection, toolbar-selection-count, toolbar-selection-clear, toolbar-overflow-btn, toolbar-stack, toolbar-sticky]
  react_wrapper: components/ui/toolbar.tsx
  docs_anchor: c-toolbar
---

## Correct usage

```html
<!-- Search grows, secondary filters, one primary view action -->
<div class="toolbar">
  <div class="search-field">
    <i data-lucide="search" aria-hidden="true"></i>
    <input type="search" placeholder="Buscar vacantes…" aria-label="Buscar vacantes">
  </div>
  <button class="toolbar-btn"><i data-lucide="filter" aria-hidden="true"></i> Filtros <span class="toolbar-btn-count">3</span></button>
  <div class="toolbar-actions"><button class="btn-primary btn-sm">Nueva vacante</button></div>
</div>
<div class="result-count" aria-live="polite">Mostrando <strong>8</strong> de <strong>128</strong> vacantes</div>
```
*Why:* one primary action, outlined secondary filters, labelled search, live result count.

```html
<!-- Filters variant: equal-hierarchy controls share one field treatment -->
<div class="toolbar toolbar-filters" role="toolbar" aria-label="Filtros del dashboard">
  <div class="select" data-select>…</div>
  <div class="seg-btn-group" role="group" aria-label="Período">
    <button class="seg-btn selected" aria-selected="true" onclick="segSwitch(this)">Mes</button>
    <button class="seg-btn" aria-selected="false" onclick="segSwitch(this)">Semana</button>
  </div>
  <div class="date-picker">
    <button class="date-picker-trigger" onclick="toggleDatePicker(this)"><i data-lucide="calendar" class="date-picker-icon"></i> 28 ene – 28 jul 2026</button>
    <div class="date-picker-panel" hidden><div class="calendar" data-calendar data-cal-mode="range"></div></div>
  </div>
  <div class="toolbar-actions"><button class="btn-primary">Sincronizar repos</button></div>
</div>
```
*Why:* Select/Segmented Button/Date Picker share surface, border, radius-md and 40px; the selected segment keeps its primary state; one Filled/Primary page action, right-aligned.

## Incorrect usage

```html
<!-- ✕ Multiple equal-weight primaries, no search -->
<div class="toolbar">
  <button class="btn-primary">Nueva vacante</button>
  <button class="btn-primary">Importar</button>
  <button class="btn-primary">Exportar</button>
</div>
```
*Fix:* keep one `btn-primary` (Nueva vacante); step Importar/Exportar down to `toolbar-btn` / `btn-secondary`.

```html
<!-- ✕ Mixed containers: filled Select next to a transparent pill + an outlined date trigger -->
<div class="toolbar">
  <div class="select" data-select>…</div>
  <div class="seg-btn-group"><button class="seg-btn selected">Mes</button><button class="seg-btn">Semana</button></div>
  <button class="date-picker-trigger btn-tertiary">28 ene – 28 jul</button>
</div>
```
*Fix:* add the `.toolbar-filters` variant so the controls share one field treatment. Do **not** edit the standalone Segmented Button / Date Picker / Select to achieve this — the variant scopes the restyle.

```html
<!-- ✕ Standalone mobile Search Bar dropped into a Toolbar -->
<div class="toolbar"><div class="search-bar">…</div><button class="toolbar-btn">Filtros</button></div>
```
*Fix:* inside a Toolbar the search is always the compact `.search-field`, not the 56px `.search-bar`.
