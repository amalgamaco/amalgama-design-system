---
id: radio
display_name: Radio Button
aliases: [radio, radio group, single choice]
category: Selección
status: stable
summary: A native radio group for an exclusive single choice among 2–5 mutually exclusive values, all visible at once for comparison.

when_to_use:
  - "Choosing exactly one option from 2–5 mutually exclusive values."
  - "When seeing all options at once helps the user compare them."
  - "When a sensible default can be preselected."
when_not_to_use:
  - "Independent multi-select → use Checkbox."
  - "More than ~5 options, or limited space → use Select."
  - "An instant on/off setting → use Switch."
  - "A pill-shaped 1-of-N view switch → use Segmented Button (that pattern is not a radio group)."
use_cases:
  - "Billing frequency: Mensual / Anual / Trimestral."
  - "Contract type: Full-time / Part-time."
  - "Plan selection with title + description via radio-card."

variants:
  - {name: default, class: radio,       purpose: "A native <input type=radio> restyled via appearance:none + ::after dot."}
  - {name: label,   class: radio-label, purpose: "Wraps control + text into one clickable row."}
  - {name: card,    class: radio-card,  purpose: "Selectable card with title + description; selected state via :has(input:checked), no JS."}
sizes:
  - {name: md, class: "(default)", use: "the only size; control is 20×20dp"}
size_selection: "Single control size (20dp). Extend the tappable area with a wrapping <label>, not by enlarging the ring."

content_rules:
  - "2–5 options, stacked vertically and left-aligned, all visible."
  - "Order logically (frequency, magnitude, or alphabetical); group under a clear heading."
  - "Communicate selection with the centre dot, not colour alone."
  - "Preselect the most common option when a reasonable default exists."
layout_constraints:
  - "All radios in one group share the same name attribute (native grouping)."
  - "Consume --color-* tokens only; no per-theme overrides."
  - "Associate a clickable <label> with each option (whole row selects)."

states:
  default: "Empty ring, 2px border --color-outline."
  hover: "Border darkens to --color-on-surface."
  checked: "Border --color-primary + centre dot --color-primary."
  focus: "Visible focus-visible ring (--color-focus 2px + --color-focus-ring 4px halo)."
  disabled: "opacity 0.4; not interactive."
  error: "aria-invalid=true → --color-error border (same signal as Input/Select)."

accessibility:
  roles: "Container role=radiogroup; each <input type=radio> grouped by name gives roving tabindex and aria-checked natively — no per-item ARIA."
  aria: ["role=radiogroup + aria-label on the container", "shared name attribute groups the inputs", "aria-invalid on error"]
  focus: "Tab enters the group (one tab stop); Arrow keys move the selection; each option has a clickable <label> to enlarge the target."
  contrast: "Selected border + dot (--color-primary) meets AA in light + dark; selection is reinforced by the filled dot, not colour alone."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "enter / leave the group (single tab stop — roving tabindex)"}
  - {keys: "↑ / ↓ (or ← / →)", action: "move the selection between options within the group"}
  - {keys: "Space", action: "select the focused option"}
responsive:
  - "Minimum touch target 48px even though the control is 20px — associate a clickable <label>."
  - "Stack options vertically, left-aligned, all visible (2–5)."

ux_principles:
  - "Showing all options side by side supports comparison and recognition over recall."
  - "Selecting one automatically clears the previous — the group always holds exactly one value."
  - "A sensible default lowers effort and signals the recommended choice."
common_mistakes:
  - "Using radios for multi-select (that's Checkbox)."
  - "Using a radio group for more than ~5 options (use Select)."
  - "Rebuilding a pill 1-of-N switch as radios (that's Segmented Button)."
  - "Conveying selection by colour only, no centre dot."
  - "Forgetting the shared name attribute (breaks grouping and roving focus)."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "all options visible for comparison"}
  - {id: 4, name: "Consistency and standards", note: "native radio semantics behave as users expect"}
  - {id: 8, name: "Aesthetic and minimalist design", note: "reserve radios for small option sets; larger sets collapse into Select"}

relationships:
  related: [checkbox, select, switch, segmented-button, form]
  replaces: ["unstyled HTML radio buttons", "custom pill-buttons misused as single-select"]
  composed_with: [form, card, list]
  not_to_confuse_with:
    - {component: checkbox, why: "checkbox is independent multi-select; radio is exclusive single choice"}
    - {component: select, why: "select hides options behind a trigger for larger sets; radio shows 2–5 at once"}
    - {component: segmented-button, why: "a pill view-switch is Segmented Button, not a radio group"}
    - {component: switch, why: "switch is an instant on/off; radio is a deliberate single choice"}

tokens:
  color: [--color-primary, --color-outline, --color-on-surface, --color-error, --color-focus, --color-focus-ring]
  radius: ["50% (circular)"]
  spacing: [--space-2]
  typography: [--font-size-body-md]

source:
  css: css/components/radio-group.css
  classes: [radio-group, radio, radio-label, radio-card, radio-card-content, radio-card-title, radio-card-desc]
  react_wrapper: components/ui/radio-group.tsx
  docs_anchor: c-radio
---

## Correct usage

```html
<!-- Exclusive choice — shared name, role=radiogroup, clickable labels -->
<div class="radio-group" role="radiogroup" aria-label="Frecuencia de facturación">
  <label class="radio-label"><input type="radio" name="freq" class="radio" checked> Mensual</label>
  <label class="radio-label"><input type="radio" name="freq" class="radio"> Anual</label>
  <label class="radio-label"><input type="radio" name="freq" class="radio"> Trimestral</label>
</div>
```
*Why:* one shared name gives native exclusivity, roving focus, and aria-checked; a default is preselected.

```html
<!-- Radio card with title + description -->
<label class="radio-card">
  <input type="radio" name="plan" class="radio" checked>
  <span class="radio-card-content"><span class="radio-card-title">Plan Starter</span><span class="radio-card-desc">Hasta 3 vacantes activas y 1 usuario.</span></span>
</label>
```
*Why:* selected state resolves via :has(input:checked) with no JS; whole card is the target.

## Incorrect usage

```html
<!-- ✕ Radios without a shared name -->
<label class="radio-label"><input type="radio" name="a" class="radio"> Mensual</label>
<label class="radio-label"><input type="radio" name="b" class="radio"> Anual</label>
```
*Fix:* give every option the same `name` so they're mutually exclusive and share one tab stop.

```html
<!-- ✕ Radio group for many options -->
<div class="radio-group" role="radiogroup"><label class="radio-label"><input type="radio" name="pais" class="radio"> Argentina</label> … 30 more …</div>
```
*Fix:* more than ~5 options → use Select.
