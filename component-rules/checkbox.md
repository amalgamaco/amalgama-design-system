---
id: checkbox
display_name: Checkbox
aliases: [check, tickbox, multi-select]
category: Selección
status: stable
summary: A native checkbox for selecting one or more options from a set — three states (unchecked / checked / indeterminate); the change applies on confirm, not instantly.

when_to_use:
  - "Multi-select from a set of independent options (filters, permissions, preferences)."
  - "A single opt-in that needs explicit confirmation (aceptar los términos)."
  - "Parent-child hierarchies where partial selection shows an indeterminate header (e.g. select-all in a table)."
when_not_to_use:
  - "Exclusive single choice from a small set → use Radio."
  - "An on/off setting that applies immediately → use Switch."
  - "Inline tag-style filtering in a toolbar → use Chip."
use_cases:
  - "Notification preferences: email + push (each independent)."
  - "Table select-all header with an indeterminate partial state."
  - "Terms-and-conditions opt-in before submit."

variants:
  - {name: default, class: checkbox,       purpose: "A native <input type=checkbox> restyled via appearance:none + ::after check/dash."}
  - {name: label,   class: checkbox-label, purpose: "Wraps the control + text into one clickable target."}
  - {name: card,    class: checkbox-card,  purpose: "Selectable card with title + description; checked state via :has(input:checked), no JS."}
sizes:
  - {name: md, class: "(default)", use: "the only size; control is 18×18dp"}
size_selection: "Single control size (18dp). Extend the tappable area with a wrapping <label>, not by enlarging the box."

content_rules:
  - "Every checkbox needs an associated label (wrap in <label> or use aria-label)."
  - "Communicate state with the mark (check / dash), not colour alone."
  - "Stack options vertically under a clear heading; label text may wrap to a second line without misaligning the box."
layout_constraints:
  - "Indeterminate reflects partial parent-child selection; don't nest more than one level."
  - "Consume --color-* tokens only; no per-theme overrides."
  - "The indeterminate state is a DOM property (el.indeterminate = true), not an attribute/class."

states:
  default: "Transparent container, 2px border --color-outline."
  hover: "Border darkens to --color-on-surface."
  checked: "Solid --color-primary fill + --color-on-primary check mark."
  indeterminate: "Solid --color-primary fill + --color-on-primary dash (partial selection)."
  focus: "Visible focus-visible ring (--color-focus 2px + --color-focus-ring 4px halo)."
  disabled: "opacity 0.4; not interactive."
  error: "aria-invalid=true → --color-error border (same signal as Input/Select)."

accessibility:
  roles: "Real <input type=checkbox> — native focus, Space activation, and aria-checked come for free; no hand-rolled ARIA."
  aria: ["associated <label> or aria-label (required)", "indeterminate DOM property for partial state", "aria-invalid on error"]
  focus: "Keyboard-operable (Space); visible focus ring; the 18dp control needs a wrapping <label> to reach a ≥ 44dp comfortable target."
  contrast: "Checked fill/mark (primary / on-primary) meets AA in light + dark."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "move focus to/from the checkbox"}
  - {keys: "Space", action: "toggle checked"}
responsive:
  - "Minimum touch target 48px even though the control is 18px — associate a clickable <label>."
  - "Stack options vertically; avoid horizontal rows that are hard to scan; keep consistent vertical spacing."

ux_principles:
  - "The mark (check/dash) conveys state independently of colour (accessibility)."
  - "Deferred application (apply on confirm) suits multi-select forms; distinguish from Switch's instant apply."
common_mistakes:
  - "Using a checkbox for an exclusive choice (that's Radio)."
  - "Using a checkbox for an instant on/off setting (that's Switch)."
  - "No associated label / aria-label."
  - "Conveying state with colour only, no mark."
  - "Nesting indeterminate hierarchies more than one level deep."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "options and their checked state are visible"}
  - {id: 4, name: "Consistency and standards", note: "native checkbox semantics behave as users expect"}
  - {id: 9, name: "Help users recognize/recover from errors", note: "aria-invalid + a message below on validation failure"}

relationships:
  related: [radio, switch, chip, form]
  replaces: ["unstyled HTML checkboxes", "custom div+ARIA re-implementations"]
  composed_with: [form, table, list, card]
  not_to_confuse_with:
    - {component: radio, why: "radio is exclusive single choice; checkbox is independent multi-select"}
    - {component: switch, why: "switch applies instantly; checkbox applies on confirm"}
    - {component: chip, why: "chips are inline toolbar filters; checkboxes are form-level selection"}

tokens:
  color: [--color-primary, --color-on-primary, --color-outline, --color-on-surface, --color-error, --color-focus, --color-focus-ring]
  radius: ["4px (--radius-sm equivalent)"]
  spacing: [--space-2]
  typography: [--font-size-body-md]

source:
  css: css/components/checkbox.css
  classes: [checkbox, checkbox-label, checkbox-card, checkbox-card-content, checkbox-card-title, checkbox-card-desc]
  react_wrapper: components/ui/checkbox.tsx
  docs_anchor: c-checkbox
---

## Correct usage

```html
<!-- Labelled opt-in — whole row is the click target -->
<label class="checkbox-label">
  <input type="checkbox" class="checkbox">
  Acepto los términos
</label>
```
*Why:* real input + associated label give keyboard/SR support and a large tappable area for free.

```html
<!-- Table select-all with a partial (indeterminate) state -->
<input type="checkbox" class="checkbox" id="select-all">
<script>document.getElementById('select-all').indeterminate = true;</script>
```
*Why:* indeterminate is set via the DOM property to signal partial selection.

## Incorrect usage

```html
<!-- ✕ Checkbox used for an exclusive choice -->
<label class="checkbox-label"><input type="checkbox" class="checkbox"> Mensual</label>
<label class="checkbox-label"><input type="checkbox" class="checkbox"> Anual</label>
```
*Fix:* mutually exclusive options are a Radio group.

```html
<!-- ✕ No label -->
<input type="checkbox" class="checkbox">
```
*Fix:* wrap in a `<label>` or add `aria-label` so the control is named.
