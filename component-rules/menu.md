---
id: menu
display_name: Menu (Dropdown Menu + Popover)
aliases: [dropdown, dropdown menu, popover, overflow menu, actions menu]
category: Overlays
status: stable
summary: A trigger-anchored floating surface — a Dropdown Menu for a keyboard-navigable list of actions, or a Popover for freeform contextual content.
when_to_use:
  - "Contextual actions on an element (editar, duplicar, eliminar) triggered by a button/icon → Dropdown Menu."
  - "Overflow of secondary actions that don't fit in the action bar → Dropdown Menu."
  - "Brief contextual content beside an element (extra info, a mini-form, a custom picker) → Popover."
when_not_to_use:
  - "Primary navigation between pages/views → use Navigation Menu / Tabs / Nav Bar."
  - "Choosing one value from a set → use Select."
  - "Filtering a result set → use Chips."
  - "A blocking confirmation → use Dialog."
  - "A right-click / long-press contextual menu → use Context Menu."
  - "A single-line hover hint → use Tooltip."
use_cases:
  - "'⋮' overflow menu on a vacancy card: Editar / Duplicar / Eliminar (destructive last)."
  - "Account menu on an avatar (Editar perfil, Cerrar sesión)."
  - "Popover with a small date/assignee picker anchored to a field."
variants:
  - {name: dropdown,        class: "dropdown-trigger + dropdown-content", purpose: "List of actions (role=menu / menuitem) with keyboard nav."}
  - {name: dropdown-item,   class: dropdown-item,        purpose: "A single action row; supports leading icon + trailing shortcut/chevron."}
  - {name: dropdown-danger, class: "dropdown-item[data-variant=danger]", purpose: "Destructive action — error color, placed last."}
  - {name: dropdown-checkbox, class: dropdown-checkbox-item, purpose: "Toggleable item (role=menuitemcheckbox, aria-checked)."}
  - {name: dropdown-radio,  class: dropdown-radio-item,   purpose: "Single-choice item within a group (role=menuitemradio)."}
  - {name: dropdown-group,  class: dropdown-group,        purpose: "Related items grouped (role=group), split by dropdown-separator."}
  - {name: popover,         class: "popover-trigger + popover-content", purpose: "Freeform floating panel for arbitrary contextual content."}
sizes:
  - {name: dropdown, class: "(default)", use: "min-width 180px, max 280px"}
  - {name: popover,  class: "(default)", use: "min-width 220px, max 320px"}
size_selection: "Dropdown Menu for a list of actions/commands; Popover when the content is not a simple action list. Width fits the longest item with a comfortable min — don't stretch it."
content_rules:
  - "Menu item labels are short imperative verbs ('Editar', 'Duplicar'); order by frequency/importance."
  - "Group related items and separate groups with .dropdown-separator."
  - "Destructive actions go last, in error color + icon (never color alone)."
  - "Keep items to text + icon; don't embed complex controls inside a menu item."
layout_constraints:
  - "Anchored to the trigger, opens into available space (below by default; flips above if no room — real viewport-edge flip via use-flyout)."
  - "Stays within the viewport and above other UI; max-height leaves at least one row less than the app height to signal scroll."
  - "On small screens a long menu may present as a bottom Sheet."
states:
  default: "Surface-container panel, outline-variant border, scale-in animation."
  hover: "Item gains a subtle state layer (surface-variant / nav hover)."
  focus: "Roving focus highlights the active item with the DS focus ring."
  active: "Pressed state layer on the item."
  selected: "Checkbox/radio item shows aria-checked indicator; active nav-style item uses secondary-container tint."
  disabled: "dropdown-item[data-disabled=true] — on-disabled color, no pointer events."
  destructive: "data-variant=danger — error color text, error-container hover."
accessibility:
  roles: "Dropdown: role=menu with role=menuitem (menuitemcheckbox/menuitemradio for toggles). Popover: a labelled region, not a menu."
  aria: ["role=menu / menuitem", "aria-checked (checkbox/radio items)", "aria-disabled / data-disabled", "aria-expanded on the trigger"]
  focus: "On open, focus moves into the panel; on close it returns to the trigger. Click-outside + Escape dismiss. No true focus-trap or submurl/portal (accepted simplification)."
  contrast: "Panel + item tokens meet AA in light + dark."
keyboard:
  - {keys: "Enter / Space (on trigger)", action: "open the menu"}
  - {keys: "Arrow Up / Down", action: "move between items (roving focus)"}
  - {keys: "Home / End", action: "jump to first / last item"}
  - {keys: "Enter / Space", action: "activate the focused item"}
  - {keys: "Escape", action: "close and return focus to the trigger"}
responsive:
  - "Comfortable touch-target item height; consistent density across the menu."
  - "Very long menus should be regrouped/split or shown as a bottom Sheet on mobile."
ux_principles:
  - "A menu is transient and contextual — reach for it for secondary/overflow actions, not primary flow."
  - "Differentiate hover ≠ pressed ≠ selected so the current item state is unambiguous."
common_mistakes:
  - "Using a Dropdown Menu for primary navigation or for picking a form value (Select)."
  - "Distinguishing a destructive item by color alone (add an icon/label)."
  - "Cramming complex controls into a menu item instead of using a Popover."
  - "Overly long menus with no grouping/separators."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "actions are listed, not memorized"}
  - {id: 7, name: "Flexibility and efficiency of use", note: "overflow/secondary actions kept one click away"}
  - {id: 4, name: "Consistency and standards", note: "menu open/close and destructive placement follow platform convention"}
relationships:
  related: [context-menu, menubar, navigation-menu, select, dialog, sheet, tooltip]
  replaces: ["custom position:absolute dropdowns with ad-hoc z-index"]
  composed_with: [button, toolbar, card, table]
  not_to_confuse_with:
    - {component: select, why: "Select picks one value for a form field; a menu triggers actions"}
    - {component: context-menu, why: "Context Menu is right-click/long-press anchored to the cursor; Dropdown is a click on a visible trigger"}
    - {component: popover, why: "Popover is freeform content; Dropdown Menu is a keyboard-navigable action list (both here, chosen by content)"}
    - {component: tooltip, why: "Tooltip is a passive label; menu/popover are interactive"}
tokens:
  color: [--color-surface-container, --color-outline-variant, --color-on-surface, --color-surface-variant, --color-error, --color-error-container]
  radius: [--radius-md, --radius-sm]
  motion: [--duration-normal, --ease-default]
source:
  css: [css/components/dropdown-menu.css, css/components/popover.css]
  classes: [dropdown-trigger, dropdown-content, dropdown-item, dropdown-item-indicator, dropdown-label, dropdown-separator, dropdown-shortcut, dropdown-group, dropdown-checkbox-item, dropdown-radio-item, popover-trigger, popover-content, popover-header, popover-title, popover-description]
  react_wrapper: components/ui/dropdown-menu.tsx
  docs_anchor: c-menu
---

## Correct usage

```html
<!-- Dropdown Menu of actions; destructive action last, in error color -->
<button class="dropdown-trigger" aria-expanded="false" aria-haspopup="menu">Opciones</button>
<div class="dropdown-content" role="menu">
  <button class="dropdown-item" role="menuitem"><i data-lucide="pencil"></i> Editar</button>
  <button class="dropdown-item" role="menuitem"><i data-lucide="copy"></i> Duplicar</button>
  <div class="dropdown-separator"></div>
  <button class="dropdown-item" role="menuitem" data-variant="danger"><i data-lucide="trash-2"></i> Eliminar</button>
</div>
```
*Why:* imperative labels, grouped with a separator, destructive item last with icon + error color.

```html
<!-- Popover for freeform contextual content (not an action list) -->
<button class="popover-trigger">Asignar responsable</button>
<div class="popover-content">
  <div class="popover-header"><div class="popover-title">Responsable</div></div>
  <input class="form-input" placeholder="Buscar persona…">
</div>
```
*Why:* an input + custom content is freeform → Popover, not a Dropdown Menu.

## Incorrect usage

```html
<!-- ✕ Menu used to pick a form value -->
<div class="dropdown-content" role="menu">
  <button class="dropdown-item">Full-time</button>
  <button class="dropdown-item">Part-time</button>
</div>
```
*Fix:* choosing one value for a field is a `Select`, not an actions menu.

```html
<!-- ✕ Destructive item signaled by color only, mid-list -->
<button class="dropdown-item" style="color:red">Eliminar</button>
<button class="dropdown-item">Editar</button>
```
*Fix:* use `data-variant="danger"` + an icon, and place it last after a separator.
