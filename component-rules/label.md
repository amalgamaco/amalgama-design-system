---
id: label
display_name: Label
aliases: [form label, control label]
category: Forms
status: stable
summary: A standalone styled <label> for any form control, especially non-text controls, decoupled from the text-input field-group.

when_to_use:
  - "Naming a form control that isn't a text input — checkbox, switch, radio, slider — inline or via for/id."
  - "A loose label associated with a control by for/id where you don't want the full .field-group scaffold."
when_not_to_use:
  - "The integrated label of a text input with hint/error → use .field-label inside .field-group (form.css)."
  - "A section title / heading → use heading typography, not a label."
  - "Read-only status text → use Badge or plain text."
use_cases:
  - "Checkbox + label en línea: 'Acepto los términos'."
  - "Switch + label: 'Recibir notificaciones'."
  - "Label suelto asociado a un control por for/id."

variants:
  - {name: base, class: label, purpose: "Styled label; adds pointer cursor when it carries a for attribute."}
  - {name: required, class: label-required, purpose: "Required-field marker (*), same treatment as .field-required."}
sizes:
  - {name: md, class: "(default)", use: "label typography (--font-size-label, weight 500); the only size"}
size_selection: "Single size; matches .field-label's type language."

content_rules:
  - "Short noun phrase naming the control ('Correo', 'Acepto los términos'), not a sentence or instruction."
  - "Use .label-required for required fields; don't signal required with color alone."
  - "Associate with the control via for/id, or wrap/adjoin it inline for checkbox/switch/radio."
layout_constraints:
  - "For non-text controls, place the label inline next to the control (gap via flex)."
  - "When the associated control is disabled, the label dims automatically — don't hand-dim it."

states:
  default: "--text-primary, weight 500; cursor:pointer when [for] is present."
  disabled: "Derived from the associated control (:has(+ :disabled), :disabled + .label, or data-disabled=true) → 50% opacity, not-allowed, no pointer events. No JS."

accessibility:
  roles: "Native <label>; a for/id or wrapping association gives the control its accessible name and extends its click target."
  aria: ["for → control id (association)", "data-disabled=true to mirror a disabled control when order prevents :has"]
  focus: "The label is not a focus stop; clicking it focuses/activates the associated control."
  contrast: "Label text meets AA against the surface in light + dark via --text-primary."
keyboard:
  - {keys: "(click / tap)", action: "focuses or toggles the associated control — labels are not focusable themselves"}
responsive:
  - "Keep the label + control on one line for checkbox/switch/radio; the label click target aids touch."

ux_principles:
  - "Every control has a visible, associated name — the label is what makes the control usable and accessible."
  - "Extending the click target to the label reduces effort (Fitts's law), especially for small toggles."
common_mistakes:
  - "Using .label for a text input that has hint/error (use .field-label in .field-group)."
  - "A label with no for/id and not wrapping/adjoining its control (no association)."
  - "Styling a section heading as a label."
  - "Hand-dimming a label instead of letting the disabled-derivation do it."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "controls are named, not guessed from position"}
  - {id: 4, name: "Consistency and standards", note: "same label type language as field-label across the DS"}

relationships:
  related: [input, checkbox, switch, radio-group, slider, form]
  replaces: ["unstyled <label> or a <span> acting as a label"]
  composed_with: [checkbox, switch, radio-group, slider, input, form]
  not_to_confuse_with:
    - {component: input, why: "the text-input label is .field-label in .field-group; .label is the standalone/non-text-control label"}
    - {component: badge, why: "badge is read-only status; a label names an interactive control"}

tokens:
  color: [--text-primary, --red]
  typography: [--font-body, --font-size-label, "font-weight 500"]
  spacing: ["8px gap"]

motion:
  enter: "none — always present"
  exit: "none"
  stateChange: "none — the label declares no transition. Its disabled dimming (opacity 0.5 + pointer-events:none, derived from the associated control via :has(+ :disabled) / :disabled + .label / data-disabled) applies instantly."
  duration: "none (no transition declared)"
  easing: "none (no transition declared)"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). The component defines no motion of its own, so there is nothing extra to reduce."
  constraints: "A static text control — do not add entrance or hover motion. The disabled dimming is an immediate state change, not an animation; keep it instant."
  relatedPatterns: ["motion.md → Motion has a purpose (a static control that gives no feedback/continuity/hierarchy needs no motion)"]

source:
  css: css/components/label.css
  classes: [label, label-required]
  react_wrapper: components/ui/label.tsx
  docs_anchor: c-label
---

## Correct usage

```html
<!-- Inline label for a non-text control (extends click target) -->
<div style="display:flex;align-items:center;gap:8px">
  <input type="checkbox" id="tos">
  <label class="label" for="tos">Acepto los términos</label>
</div>
```
*Why:* the label names the checkbox and, via for/id, makes the text a click target.

```html
<!-- Standalone label with a required marker -->
<label class="label" for="email">Correo <span class="label-required">*</span></label>
<input class="field-input" id="email" type="email">
```

## Incorrect usage

```html
<!-- ✕ Using .label for a text input with hint/error -->
<label class="label">Email</label>
<input class="field-input">
<span class="field-error-msg">…</span>
```
*Fix:* wrap it in a .field-group with .field-label so error/hint states bind correctly.

```html
<!-- ✕ Label with no association -->
<label class="label">Nombre</label> <input class="field-input">
```
*Fix:* add for="name" + id="name" (or wrap the control) so the label names it.
