---
id: context-menu
display_name: Context Menu
aliases: [right-click menu, contextual menu, long-press menu]
category: Overlays
status: stable
summary: A cursor-anchored actions menu opened by right-click (or long-press) on an element — the same panel as Dropdown Menu, just a different trigger.
when_to_use:
  - "Actions on an item of a list, table, or canvas where right-click is expected."
  - "Secondary 'power' shortcuts that sit alongside the main flow."
  - "Contexts where right-click is a genuine convention (editors, file explorers)."
when_not_to_use:
  - "An always-visible action on a button → use Dropdown Menu."
  - "The ONLY way to reach an important action (right-click isn't discoverable on touch/keyboard) → also expose it visibly."
  - "Navigation between sections → use Navigation Menu."
use_cases:
  - "Right-click a candidate row: Ver perfil / Mover de etapa / Descartar."
  - "Right-click a Kanban card for quick actions."
  - "Long-press a list item on touch to reveal the same actions."
variants:
  - {name: trigger, class: context-menu-trigger, purpose: "The area that listens for the contextmenu event (no own styling)."}
  - {name: panel,   class: dropdown-content,      purpose: "The resulting menu — reuses Dropdown Menu's classes/roles entirely."}
sizes:
  - {name: default, class: "(default)", use: "inherits Dropdown Menu sizing (min 180px / max 280px)"}
size_selection: "Same as Dropdown Menu. Keep it to roughly 7 items or fewer; group with separators or move to a panel if longer."
content_rules:
  - "Reuse Dropdown Menu item rules: short imperative labels, grouped with separators, destructive last in error color + icon."
  - "Every action here must also be reachable somewhere visible (toolbar/dropdown) — right-click has no touch/keyboard equivalent."
layout_constraints:
  - "Opens at the cursor position, kept within the viewport (use-flyout positioning)."
  - "Visually identical to the Dropdown Menu panel (same .dropdown-* classes)."
states:
  default: "Surface-container panel (inherited from dropdown-content)."
  hover: "Item state layer."
  focus: "Roving focus with the DS focus ring."
  disabled: "data-disabled item — on-disabled color."
  destructive: "data-variant=danger — error color."
accessibility:
  roles: "Panel role=menu, items role=menuitem — same contract as Dropdown Menu."
  aria: ["role=menu / menuitem", "aria-disabled / data-disabled"]
  focus: "Escape closes; outside click closes; roving arrow-key nav within the panel."
  contrast: "Inherited Dropdown Menu tokens meet AA in light + dark."
keyboard:
  - {keys: "Arrow Up / Down", action: "move between items once open"}
  - {keys: "Enter / Space", action: "activate the focused item"}
  - {keys: "Escape", action: "close the menu"}
responsive:
  - "Right-click doesn't exist on touch or keyboard — long-press may open it, but every action MUST have a visible alternative path."
ux_principles:
  - "A context menu is an accelerator, never the sole route to an action."
  - "Keep it short and grouped; a sprawling right-click menu is hard to scan under the cursor."
common_mistakes:
  - "Making an action reachable ONLY via right-click (invisible on touch/keyboard)."
  - "Packing more than ~7 items with no grouping."
  - "Using it where an always-visible Dropdown Menu button belongs."
nielsen_heuristics:
  - {id: 7, name: "Flexibility and efficiency of use", note: "power-user accelerator alongside the visible path"}
  - {id: 6, name: "Recognition rather than recall", note: "shows the available actions in place"}
relationships:
  related: [menu, menubar, navigation-menu]
  replaces: ["custom position:fixed context menus with ad-hoc z-index"]
  composed_with: [table, list, kanban]
  not_to_confuse_with:
    - {component: menu, why: "Dropdown Menu opens from a visible trigger on click; Context Menu opens at the cursor on right-click"}
    - {component: navigation-menu, why: "Navigation Menu moves between sections; Context Menu acts on an element"}
tokens:
  color: [--color-surface-container, --color-outline-variant, --color-on-surface, --color-error]
  radius: [--radius-md]
  motion: [--duration-normal, --ease-default]
source:
  css: css/components/context-menu.css
  classes: [context-menu-trigger, dropdown-content, dropdown-item, dropdown-separator, dropdown-label]
  react_wrapper: components/ui/context-menu.tsx
  docs_anchor: c-context-menu
---

## Correct usage

```html
<!-- Right-click a row; the SAME actions also live in a visible ⋮ dropdown -->
<div class="context-menu-trigger" data-row-id="c-201">Ana Torres — Frontend</div>
<div class="dropdown-content" role="menu">
  <button class="dropdown-item" role="menuitem">Ver perfil</button>
  <button class="dropdown-item" role="menuitem">Mover de etapa</button>
  <div class="dropdown-separator"></div>
  <button class="dropdown-item" role="menuitem" data-variant="danger">Descartar candidato</button>
</div>
```
*Why:* expected right-click affordance on a row; actions are also reachable from a visible menu.

## Incorrect usage

```html
<!-- ✕ Right-click is the only way to reach a key action -->
<div class="context-menu-trigger">Descartar (solo con click derecho)</div>
```
*Fix:* mirror the action in a visible control (row ⋮ Dropdown Menu or toolbar) — right-click isn't discoverable on touch/keyboard.
