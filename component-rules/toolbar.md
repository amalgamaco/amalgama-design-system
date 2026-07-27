---
id: toolbar
display_name: Tool Bar
aliases: [filter bar, action bar, list controls]
category: Actions / App bar
status: stable
summary: The row of controls that heads a list or table — a compact search field plus filters, sorting, and the view's single primary action.
when_to_use:
  - "Heading a list or table with search, filters, sorting, and the view's action."
  - "A compact search that shares one row with other controls (.search-field)."
  - "Summarizing the filtered result with a .result-count line below the bar."
when_not_to_use:
  - "Search that heads a whole screen → use the standalone Search Bar (.search-bar, 56px)."
  - "App context and global actions (profile, notifications) → use the Top Bar."
  - "Several equal-weight primary actions → keep one btn-primary and step the rest down to toolbar-btn."
  - "In-page navigation between sub-views → use Tabs."
use_cases:
  - "Encabezar la lista de vacantes con búsqueda, filtro de estado y 'Nueva vacante'."
  - "Barra de candidatos con search + Filtros + result-count 'Mostrando 8 de 128'."
variants:
  - {name: toolbar, class: toolbar, purpose: "The single-row flex container (gap --space-2, margin-bottom --space-4)."}
  - {name: search-field, class: search-field, purpose: "Compact search variant; surface (white in light) background, grows with flex:1."}
  - {name: button, class: toolbar-btn, purpose: "Outlined secondary action (analogous to btn-secondary) for filters/sort/view actions."}
  - {name: result-count, class: result-count, purpose: "Summary line below the bar; the number goes in <strong> with --color-on-surface."}
sizes:
  - {name: default, class: "(default)", use: "single row; search-field and toolbar-btn share the same height"}
size_selection: "Single density by design. The search-field grows (flex:1); pair it with a btn-primary btn-sm for the view action to keep heights aligned."
content_rules:
  - "Order left→right by frequency of use: search → filters → sort → view action."
  - "One primary action per bar; everything else is a toolbar-btn (outlined) or a Select."
  - "result-count reflects the real filtered count ('Mostrando N de M') and updates on filter."
layout_constraints:
  - "One row; the search-field grows to fill, controls sit to its right at equal height."
  - "On narrow viewports, collapse secondary filters into a single 'Filtros' button that opens a panel."
  - "Don't mix Tool Bar with the shell — global context/actions live in the Top Bar."
states:
  default: "Resting bar."
  hover: "toolbar-btn tints (--color-surface-variant); search-field lightens on hover."
  focus: "toolbar-btn shows :focus-visible (2px --color-focus + 4px --color-focus-ring); search-field shows focus via :focus-within (border --color-secondary)."
  active: "toolbar-btn dims slightly on press (opacity .85)."
accessibility:
  roles: "search-field's <input type=\"search\">; filters use Select (role=listbox) or native .toolbar-btn."
  aria: ["aria-label on the search input when there's no visible <label>", 'aria-live="polite" on result-count to announce the post-filter count', "Select provides listbox semantics"]
  focus: "Tab order follows visual order; never suppress the native <input> outline."
  contrast: "Tokens (--color-surface, --color-on-surface-variant, --color-outline) guarantee AA in light + dark — never theme overrides."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "move through search, filters, sort, action"}
  - {keys: "Enter / Space", action: "activate the focused control"}
  - {keys: "Type (in search)", action: "filter the list"}
responsive:
  - "On narrow widths collapse secondary filters into one 'Filtros' button/panel."
  - "Keep the search-field and buttons at a ≥44px touch target on coarse pointers."
ux_principles:
  - "Group a list's controls in one predictable place so users don't hunt for filters (recognition over recall)."
  - "Preserve action hierarchy — one primary, the rest secondary — even when the legacy bar was flat."
common_mistakes:
  - "Using the mobile Search Bar (56px, gray) inside a Tool Bar instead of the compact search-field."
  - "Several primary actions with equal weight (keep one btn-primary)."
  - "result-count that doesn't update or misreports the count."
  - "Putting global/shell actions in the Tool Bar (they belong in the Top Bar)."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "filters and sort are visible controls, not remembered commands"}
  - {id: 1, name: "Visibility of system status", note: "result-count announces how many records remain after filtering"}
  - {id: 7, name: "Flexibility and efficiency of use", note: "search + filters + sort speed up the frequent list task"}
relationships:
  related: [search, select, button, page-header]
  replaces: ["legacy filter bars"]
  composed_with: [search, select, button, table, data-table, chip]
  not_to_confuse_with:
    - {component: topbar, why: "Top Bar is app chrome + global actions; Tool Bar controls one list/table"}
    - {component: page-header, why: "Page Header titles the content; the Tool Bar carries its controls"}
    - {component: search, why: "the standalone Search Bar heads a whole screen; the Tool Bar uses the compact search-field"}
tokens:
  color: [--color-surface, --color-on-surface-variant, --color-surface-variant, --color-outline, --color-secondary]
  radius: [--radius-md]
  spacing: [--space-2, --space-4]
  motion: [--duration-fast]
source:
  css: css/components/toolbar.css
  classes: [toolbar, search-field, toolbar-btn, result-count]
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
  <button class="toolbar-btn"><i data-lucide="filter" aria-hidden="true"></i> Filtros</button>
  <button class="btn-primary btn-sm">Nueva vacante</button>
</div>
<div class="result-count" aria-live="polite">Mostrando <strong>8</strong> de <strong>128</strong> vacantes</div>
```
*Why:* one primary action, outlined secondary filters, labelled search, live result count.

## Incorrect usage

```html
<!-- ✕ Multiple equal-weight primaries, no search -->
<div class="toolbar">
  <button class="btn-primary">Nueva vacante</button>
  <button class="btn-primary">Importar</button>
  <button class="btn-primary">Exportar</button>
</div>
```
*Fix:* keep one `btn-primary` (Nueva vacante); step Importar/Exportar down to `toolbar-btn`.

```html
<!-- ✕ Standalone mobile Search Bar dropped into a Tool Bar -->
<div class="toolbar"><div class="search-bar">…</div><button class="toolbar-btn">Filtros</button></div>
```
*Fix:* inside a Tool Bar the search is always the compact `.search-field`, not the 56px `.search-bar`.
