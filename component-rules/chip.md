---
id: chip
display_name: Chip
aliases: [tag, filter, token, pill]
category: Actions / Selection
status: stable
summary: A compact, interactive element for filtering, selecting, or representing input — never for primary actions.

when_to_use:
  - "Filtering a result set (filter chips below a search bar or toolbar)."
  - "Representing user input as removable tokens (emails, tags, selected people)."
  - "Offering quick suggestions the user can tap to apply (assist/suggestion chips)."
  - "Multi-select from a bounded set where selections stay visible."
when_not_to_use:
  - "Performing the main action of a screen → use Button."
  - "Switching between mutually exclusive views/modes → use Segmented Button."
  - "Showing read-only status that the user cannot act on → use Badge."
  - "A long/unbounded option list → use Select or Combobox."
use_cases:
  - "Filter row: 'Abiertas', 'Cerradas', 'Mis vacantes' (filter chips, multi-select)."
  - "Input field tokens: recipients in a share dialog."
  - "Suggestion chips under an empty search."

variants:
  - {name: base,     class: chip,          purpose: "Assist/action chip (plain button, no selected state)."}
  - {name: selected, class: chip-selected, purpose: "Filter/choice chip in the on state (aria-pressed / data-state=on)."}
  - {name: elevated, class: chip-elevated, purpose: "Chip that needs to lift off a busy/media background."}
  - {name: icon,     class: chip-icon,     purpose: "Leading icon/avatar slot."}
  - {name: remove,   class: chip-remove,   purpose: "Trailing remove affordance on input chips (needs aria-label)."}
  - {name: set,      class: chip-set,      purpose: "Container grouping related chips (role=group)."}
sizes:
  - {name: md, class: "(default)", use: "the only size; 32dp height. Chips do not scale by size — density comes from the chip set."}
size_selection: "Single size by design. If you need a larger tappable control, you're choosing the wrong component."

content_rules:
  - "Short noun/adjective labels (Label Large), not sentences."
  - "Filter chips read as the filter value ('Abiertas'), not a verb."
  - "Removable chips must expose an accessible remove control with aria-label."
layout_constraints:
  - "Live in a horizontal set; wrap or scroll, never truncate mid-label."
  - "Filter chips sit directly below the search/toolbar they refine."

states:
  default: "Outlined resting (border --color-outline-variant)."
  hover: "State layer over the surface."
  focus: "focus-visible ring (--color-focus / --color-focus-ring)."
  selected: "Filled --color-secondary-container / on-secondary-container; toggle chips expose aria-pressed/data-state=on."
  disabled: "on-disabled tokens; not focusable."

accessibility:
  roles: "Toggle chips render on a real toggle (aria-pressed / data-state). Action chips are plain <button> with NO aria-pressed (per WAI-ARIA). Input-chip remove has aria-label."
  aria: [aria-pressed (toggle chips only), "role=group on chip-set", aria-label (remove control)]
  focus: "Each chip is tab-focusable; remove control is a separate focus stop."
  contrast: "Selected fill/label pair meets AA in light + dark via container/on-container tokens."
keyboard:
  - {keys: "Tab", action: "focus each chip / remove control"}
  - {keys: "Enter / Space", action: "toggle or activate the chip"}
  - {keys: "Backspace / Delete", action: "remove a focused input chip (when removable)"}
responsive:
  - "Chip set wraps to multiple rows or scrolls horizontally on narrow widths; keep 44px touch targets."

ux_principles:
  - "Selected state must be obvious (filled), so users can see current filters at a glance (visibility of system status)."
  - "Chips make choices recognizable and directly manipulable (recognition over recall)."
common_mistakes:
  - "Using a chip as a primary CTA."
  - "Adding aria-pressed to a non-toggle action chip."
  - "Making the border identical to an outlined Button (chip uses --color-outline-variant, not --color-outline)."
  - "Read-only status shown as a chip instead of a Badge."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "active filters are visibly selected"}
  - {id: 3, name: "User control and freedom", note: "input chips are removable"}
  - {id: 6, name: "Recognition rather than recall", note: "options shown, not remembered"}

relationships:
  related: [button, segmented-button, badge, search, toggle]
  replaces: ["legacy filter tags / pill buttons"]
  composed_with: [search, toolbar, form, input-group]
  not_to_confuse_with:
    - {component: badge, why: "badge is read-only status; chip is interactive"}
    - {component: segmented-button, why: "segmented is single-select view switch; filter chips are usually multi-select"}
    - {component: button, why: "buttons act; chips filter/select/represent input"}

tokens:
  color: [--color-secondary-container, --color-on-secondary-container, --color-outline-variant, --color-surface]
  radius: [--radius-full]
  spacing: [--space-2, --space-4]
  typography: [--font-size-body-lg]

motion:
  enter: "none — always present (static filter/input element)."
  exit: "none (an input chip being removed is a DOM removal, not an animated exit)."
  stateChange: "Hover/active: state layer via color-mix over the base — unselected on-surface 8%/12%, selected on-secondary-container 8%/12% over the container, elevated the same mixed over surface-container-low. Selected: fill flips to --color-secondary-container (transitions on background). Focus-visible: 2px --color-focus ring + 4px --color-focus-ring. Dragged: box-shadow lifts to --shadow-md."
  duration: "--duration-fast"
  easing: "--ease-default"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). No component-specific override."
  constraints: "Only animate compositor-friendly effects (background/color state layer, box-shadow); no transform lift. Do not animate the height/padding-asymmetry change when an icon/remove slot appears."
  relatedPatterns: [state-layer]

source:
  css: css/components/chip.css
  classes: [chip, chip-selected, chip-elevated, chip-icon, chip-remove, chip-set]
  react_wrapper: components/ui/chip.tsx
  docs_anchor: c-chip
---

## Correct usage

```html
<div class="chip-set" role="group" aria-label="Filtros">
  <button class="chip chip-selected" aria-pressed="true">Abiertas</button>
  <button class="chip" aria-pressed="false">Cerradas</button>
</div>
```
*Why:* filter chips, multi-select, selection visible; toggle chips carry aria-pressed.

```html
<span class="chip chip-icon chip-remove">
  <img class="chip-avatar" …> Ana Torres
  <button class="chip-remove-btn" aria-label="Quitar a Ana Torres">✕</button>
</span>
```
*Why:* input chip with an accessible remove control.

## Incorrect usage

```html
<!-- ✕ Chip as the main action -->
<button class="chip">Guardar cambios</button>
```
*Fix:* use `btn-primary`.

```html
<!-- ✕ Read-only status as a chip -->
<button class="chip">Vacante abierta</button>
```
*Fix:* use `badge badge-open` (non-interactive status).
