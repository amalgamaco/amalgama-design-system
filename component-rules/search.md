---
id: search
display_name: Search
aliases: [search bar, search field, buscador, find]
category: Navigation / Forms
status: stable
summary: Free-text search of content, in two official variants — a standalone pill Search Bar (mobile/hero) and a compact Search Field inside a Toolbar (desktop).

when_to_use:
  - "Letting the user find content by typing a query (vacancies, candidates, records)."
  - "Standalone / mobile / hero search that can expand into a results view → Search Bar (.search-bar)."
  - "Search sitting in a controls bar above a list/table alongside filters → Search Field (.search-field in toolbar.css)."
when_not_to_use:
  - "Capturing a form value (name, email) → use Input."
  - "Picking one option from a fixed list → use Select."
  - "Type-to-filter selection that returns a chosen value → use Combobox / Command."
  - "The global ⌘K command palette → use Command (command-dialog)."
use_cases:
  - "Mobile: barra de búsqueda de vacantes a ancho completo que se expande a resultados."
  - "Desktop: search-field en la toolbar del listado de candidatos, junto a 'Filtros' y 'Ordenar'."

variants:
  - {name: bar, class: search-bar, purpose: "Standalone pill (--radius-full); 56px standalone / 40px inside .search-row; grey surface-container-high bg. Mobile/hero."}
  - {name: field, class: search-field, purpose: "Compact toolbar variant (toolbar.css); --radius-md, surface (white in light, never transparent), aligns in height with toolbar-btn. Desktop."}
  - {name: row, class: search-row, purpose: "Wrapper pairing a .search-bar with adjacent circular .search-icon-btn actions (Filtros/Ordenar/Vista)."}
  - {name: view, class: search-view, purpose: "Expanded results surface; add .search-view-fullscreen for the full-screen mode."}
sizes:
  - {name: standalone, class: "search-bar (56px)", use: "hero / mobile search"}
  - {name: row, class: "search-row .search-bar (40px)", use: "search-bar aligned with adjacent icon buttons"}
  - {name: compact, class: "search-field", use: "inside a Toolbar on desktop"}
size_selection: "Mobile/standalone or a search that expands into results → Search Bar. Desktop controls bar over a list/table with filters → Search Field. Same state tokens; different shape, height, and background."

content_rules:
  - "Placeholder states the scope ('Buscar vacantes…'), and the input has role=search + an accessible name (aria-label)."
  - "Search Bar: leading search icon; optional trailing action (clear/mic) and account avatar."
  - "Search Field: leading 18px icon + input; keep it as one flex row with toolbar buttons."
layout_constraints:
  - "Search Bar background is grey (--color-surface-container-high) — never --color-surface. Search Field background is --color-surface — never transparent. Don't swap them."
  - "Search Bar width 360–720px; use .search-row to place actions beside it. Search Field flexes to fill the toolbar."
  - "Don't replace a Search variant with a plain form Input — the shape/scope semantics differ."

states:
  default: "Bar: grey pill, subtle 1px border. Field: surface bg, subtle 1px border."
  hover: "Background tints (on-surface 8%) and border darkens."
  focus: "focus-within → background tints (on-surface 12%) and border → --color-secondary; caret --color-secondary."
  disabled: "Bar: aria-disabled / :has(input:disabled) → container 12%, content 38% of on-surface, no pointer events."

accessibility:
  roles: "role=search on the container; the <input type=search> has an accessible name (aria-label or a visible label)."
  aria: [role=search, aria-label (scope of the search), "aria-label on search-icon-btn actions"]
  focus: "Input is a native focus stop; adjacent icon buttons are separate stops; search-view-back returns from the expanded view."
  contrast: "Text, placeholder, and focused border meet AA in light + dark; both variants share the state tokens."
keyboard:
  - {keys: "type", action: "enter the query (native)"}
  - {keys: "Enter", action: "submit / run the search"}
  - {keys: "Escape", action: "clear or close the expanded search-view (where wired)"}
  - {keys: "Tab", action: "move to adjacent icon-button actions"}
responsive:
  - "Mobile: Search Bar takes full width; contextual actions collapse into overflow."
  - "Desktop: Search Field lives in the Toolbar next to filter/sort buttons."
  - "Keep the input and icon-button actions ≥ 44px tap targets."

ux_principles:
  - "Match the variant to context and platform, not to taste — grey pill for standalone/mobile, surface field for the desktop toolbar."
  - "Placeholder communicates scope; results/empty states must be designed for the expanded view."
common_mistakes:
  - "Using a form Input styled as search instead of the Search component."
  - "Giving Search Field the grey Search Bar background (or making Search Bar white) — the backgrounds are variant-defining."
  - "No role=search / no accessible name on the input."
  - "Using Search where a searchable value picker (Combobox) or the ⌘K palette (Command) is the right tool."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "type to find rather than remember where content lives"}
  - {id: 7, name: "Flexibility and efficiency of use", note: "search is a shortcut past deep navigation"}
  - {id: 1, name: "Visibility of system status", note: "focus tint + expanded results view show search state"}

relationships:
  related: [combobox, command, toolbar, chip, input]
  replaces: ["legacy search inputs (form inputs used as a search box)"]
  composed_with: [toolbar, chip, list, empty-state]
  not_to_confuse_with:
    - {component: combobox, why: "combobox returns a chosen value from a list; search queries free-text content"}
    - {component: command, why: "command is the ⌘K palette for actions/navigation; search finds content"}
    - {component: input, why: "input captures a form value; search queries content and carries role=search"}

tokens:
  color: [--color-surface-container-high, --color-surface, --color-on-surface, --color-on-surface-variant, --color-secondary, --border, --color-outline, --color-focus-ring]
  radius: [--radius-full, --radius-md]
  spacing: [--space-2, --space-4]
  typography: [--font-size-body-lg, --font-size-body-md]

motion:
  enter: "none — the .search-bar is always present; .search-view is toggled by JS but declares NO CSS open/close animation (it appears/hides instantly — a gap vs. the Sheet/Dialog entrance patterns)"
  exit: "none"
  stateChange: ".search-bar recolors its background (color-mix state layer) + border-color on :hover and :focus-within (transition: background + border-color). .search-icon-btn transitions background/border-color/color on hover/active/aria-pressed. .search-view-result recolors on hover with NO transition declared (instant)."
  duration: "--duration-fast"
  easing: "--ease-default"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). No looping/essential motion; hover/focus tints still apply, just without the fade."
  constraints: "State-layer color changes are effects — keep them on Standard easing, no overshoot. The .search-view open/close is not animated in CSS; if an entrance is wanted, map it to the Dialog/Sheet pattern (fade + zoom / slide) rather than improvising."
  relatedPatterns: ["motion.md → Hover & press micro-interactions (state-layer color = effect)", "motion.md → Entrance & exit patterns (search-view has no declared open/close — flag as a gap)"]

source:
  css: css/components/search.css
  classes: [search-bar, search-bar-icon, search-bar-input, search-bar-trailing, search-bar-avatar, search-row, search-icon-btn, search-view, search-view-fullscreen, search-view-header, search-view-back, search-view-results, "search-field (toolbar.css)"]
  react_wrapper: components/ui/search.tsx
  docs_anchor: c-search
---

## Correct usage

```html
<!-- Search Bar — standalone / mobile pill -->
<div class="search-bar" role="search">
  <span class="search-bar-icon"><i data-lucide="search"></i></span>
  <input class="search-bar-input" type="search" placeholder="Buscar vacantes" aria-label="Buscar vacantes">
</div>
```
*Why:* standalone/mobile search; grey pill; role=search + accessible name.

```html
<!-- Search Field — compact, inside a Toolbar (desktop) -->
<div class="toolbar">
  <div class="search-field" role="search">
    <i data-lucide="search"></i>
    <input type="search" placeholder="Buscar candidatos…" aria-label="Buscar candidatos">
  </div>
  <button class="toolbar-btn">Filtros</button>
  <button class="toolbar-btn">Ordenar</button>
</div>
```
*Why:* desktop controls bar; surface (white) field aligned with the toolbar buttons.

## Incorrect usage

```html
<!-- ✕ Search Field given the grey Search Bar background -->
<div class="search-field" style="background:var(--color-surface-container-high)">…</div>
```
*Fix:* the background is variant-defining — Search Field stays on --color-surface.

```html
<!-- ✕ A plain form input standing in for search -->
<input class="field-input" placeholder="Buscar…">
```
*Fix:* use a Search variant with role=search (search-bar or search-field), not a form Input.
