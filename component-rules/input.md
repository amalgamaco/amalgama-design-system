---
id: input
display_name: Input
aliases: [text field, text input, field]
category: Forms
status: stable
summary: A single-line text field for free-form entry, with label, hint, error, and optional leading/trailing icons.

when_to_use:
  - "Capturing a single line of free-form text or a scalar value (name, email, URL, number, date)."
  - "Any bounded typed value where a picker/select isn't a better fit."
when_not_to_use:
  - "Multi-line / paragraph text (a description, cover letter) → use Textarea."
  - "Choosing one option from a known list → use Select (or Radio Group for few)."
  - "Searchable/typeahead selection from a large set → use Combobox / Command."
  - "Free-text search of content → use Search (search-field / search-bar)."
  - "One-time verification code → use Input OTP."
use_cases:
  - "Formulario de vacante: 'Título del puesto', 'Ubicación'."
  - "Perfil de candidato: 'Nombre', 'Email', 'Teléfono'."
  - "Campo con ícono de moneda o unidad → Input Group."

variants:
  - {name: base, class: field-input, purpose: "Standard single-line text field."}
  - {name: leading-icon, class: "field-input has-leading", purpose: "Icon before the text (inside .field-input-wrapper with .field-leading-icon)."}
  - {name: trailing-icon, class: "field-input has-trailing", purpose: "Icon/affordance after the text (.field-trailing-icon)."}
  - {name: file, class: "field-input[type=file]", purpose: "File picker with a tonal selector button (par shadcn)."}
sizes:
  - {name: md, class: "(default)", use: "the standard field height (10px vertical padding)"}
size_selection: "Single size by design; keep field heights consistent across a form."

content_rules:
  - "Every input has an associated label (.field-label inside .field-group, or a standalone .label with for/id)."
  - "Placeholder is an example/format hint, never a replacement for the label."
  - "Use .field-hint for persistent help; on error, .field-error-msg replaces the hint."
  - "Mark required fields with .field-required (*) — don't rely on color alone."
layout_constraints:
  - "Inputs are full-width within their .field-group; lay fields out in a .fields-grid, not free-floating."
  - "Error message + char count live in .field-supporting directly below the field."

states:
  default: "1px --border, --card-bg background."
  hover: "Border darkens to --color-outline (not on focus/disabled)."
  focus: "Border --interactive + 3px --color-focus-ring; the label turns --interactive."
  disabled: "--color-disabled bg, --color-on-disabled text, not-allowed cursor."
  error: "aria-invalid or .field-group.is-error → --color-error border, red label, --color-error-ring on focus; hint hidden, error message shown."

accessibility:
  roles: "Native <input>; associate the label via wrapping .field-group or for/id."
  aria: ["aria-invalid=true on error", "aria-describedby → hint/error message id", "aria-required for required fields"]
  focus: "Native focus order; visible focus ring; label reinforces focus by recoloring."
  contrast: "Text, placeholder, and error border meet AA in light + dark via tokens."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "move focus between fields"}
  - {keys: "type / edit", action: "native text entry, selection, IME"}
responsive:
  - "Full-width fields stack on narrow screens; keep a ≥ 44px tap height."
  - "Icon padding (has-leading/has-trailing = 42px) keeps text clear of the icon."

ux_principles:
  - "Labels stay visible (never placeholder-only) so the field's purpose survives after typing (recognition over recall)."
  - "Validate and message errors inline, next to the field, in plain language."
common_mistakes:
  - "Using a placeholder as the only label."
  - "Signalling error with red border alone — pair it with aria-invalid + a text message."
  - "Using an Input for multi-line content (should be Textarea) or for picking from a list (Select)."
  - "Free-floating field with no .field-group / associated label."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "persistent label + hint, not placeholder-only"}
  - {id: 9, name: "Help users recognize/recover from errors", note: "inline error message + aria-invalid in plain language"}
  - {id: 5, name: "Error prevention", note: "hints and input formats guide correct entry before submit"}

relationships:
  related: [textarea, select, form, label, input-group, input-otp, search]
  replaces: ["any legacy text field"]
  composed_with: [form, label, input-group, dialog]
  not_to_confuse_with:
    - {component: textarea, why: "textarea is multi-line; input is single-line"}
    - {component: search, why: "search fields query content; inputs capture form values"}
    - {component: select, why: "select picks from a fixed list; input is free-form"}

tokens:
  color: [--border, --card-bg, --text-primary, --interactive, --color-focus-ring, --color-error, --color-error-ring, --text-muted]
  radius: [--radius-md]
  typography: [--font-size-body-md, --font-size-label, --font-size-caption]
  motion: [--duration-fast]

motion:
  enter: "none — always present (static form field)."
  exit: "none."
  stateChange: "Hover: border-color→--color-outline (more prominent than the resting --color-outline-variant). Focus-visible: border→--interactive + 3px --color-focus-ring box-shadow, and the field label recolors to --interactive via :focus-within. Error (is-error / aria-invalid): border→--color-error, focus ring→--color-error-ring. All of these transition on border-color + box-shadow."
  duration: "--duration-fast"
  easing: "none specified — the transition lists only durations (border-color var(--duration-fast), box-shadow var(--duration-fast)) with no --ease-* token, so it falls back to the browser default `ease`. Divergence from the --ease-default convention; flag to tokenize."
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (border/ring transitions collapse to ~0). No component-specific override."
  constraints: "Only animate the border-color + box-shadow (focus ring) effects; never animate the field's width/height. The focus ring is an effect → Standard easing (once tokenized), never a spatial overshoot."
  relatedPatterns: [state-layer]

source:
  css: css/components/form.css
  classes: [field-group, field-label, field-required, field-input, field-input-wrapper, field-leading-icon, field-trailing-icon, has-leading, has-trailing, field-supporting, field-hint, field-error-msg, field-char-count, is-error]
  react_wrapper: components/ui/input.tsx
  docs_anchor: c-input
---

## Correct usage

```html
<div class="field-group">
  <label class="field-label">Título del puesto <span class="field-required">*</span></label>
  <input class="field-input" placeholder="Ej: Desarrollador Frontend">
  <div class="field-supporting"><span class="field-hint">Aparece en el listado público.</span></div>
</div>
```
*Why:* persistent label, placeholder as example only, hint below the field.

```html
<!-- Error state -->
<div class="field-group is-error">
  <label class="field-label">Email</label>
  <input class="field-input" value="texto" aria-invalid="true" aria-describedby="email-err">
  <div class="field-supporting"><span class="field-error-msg" id="email-err">Ingresá un correo válido.</span></div>
</div>
```
*Why:* aria-invalid + a plain-language message, not color alone.

## Incorrect usage

```html
<!-- ✕ Placeholder standing in for a label -->
<input class="field-input" placeholder="Email">
```
*Fix:* add a real .field-label; the placeholder disappears once the user types.

```html
<!-- ✕ Multi-line content in an Input -->
<input class="field-input" placeholder="Descripción del puesto (varios párrafos)">
```
*Fix:* use a Textarea for paragraph text.
