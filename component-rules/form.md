---
id: form
display_name: Form
aliases: [form layout, field group, validation]
category: Forms
status: stable
summary: The layout + validation pattern that composes labels, controls, hints, and errors into an accessible form using native HTML5 validation.

when_to_use:
  - "Any screen that collects structured input and submits it (create/edit a record, sign in, filters you apply)."
  - "Grouping related fields with consistent label/hint/error treatment and a clear submit action."
when_not_to_use:
  - "A single instant-effect setting → use Switch/Checkbox directly, no form scaffold."
  - "Free-text content search → use Search."
  - "A non-blocking confirmation → not a form; use a Dialog with actions."
use_cases:
  - "Crear vacante: título, descripción, ubicación, tipo de contrato, sueldo → footer con Guardar / Cancelar."
  - "Editar perfil de candidato dentro de un Dialog."

variants:
  - {name: card, class: form-card, purpose: "A titled section of related fields (form-card-title + form-card-desc + fields)."}
  - {name: grid, class: fields-grid, purpose: "Two-column responsive field layout (1fr 1fr)."}
  - {name: field, class: field-group, purpose: "One label + control + supporting text unit; add .is-error for the error state."}
sizes:
  - {name: md, class: "(default)", use: "standard field density; the only size"}
size_selection: "Single density; keep every field the same height within a form."

content_rules:
  - "Every field has a persistent label; mark required fields with .field-required (*), don't rely on color."
  - "Group related fields under a form-card with a short title/description."
  - "Footer: one btn-primary submit + a secondary/tertiary Cancel; never two competing primaries."
  - "Write hints as guidance and error messages as plain-language fixes."
layout_constraints:
  - "Lay fields out in a .fields-grid or stacked .field-group units — never free-floating inputs."
  - "One primary submit action per form context."
  - "Error message replaces the hint in the same .field-supporting slot (no layout shift)."

states:
  default: "Fields at rest; submit enabled."
  focus: "Active field shows --interactive border + ring; its label recolors."
  invalid: ".field-group.is-error / control aria-invalid → red border + label + inline message; native :invalid drives validation."
  submitting: "Disable the submit button and show an inline spinner while the request is in flight (compose it)."
  disabled: "Disabled controls use --color-disabled / --color-on-disabled."

accessibility:
  roles: "Native <form> + native controls; labels associated via .field-group wrapping or for/id."
  aria: [aria-invalid (on error), aria-describedby (hint/error id), aria-required, "aria-live for a form-level error summary"]
  focus: "On submit with errors, move focus to the first invalid field; logical tab order top-to-bottom."
  contrast: "Labels (--text-primary), hints, and error text meet AA in light + dark."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "move between fields in DOM order"}
  - {keys: "Enter", action: "submit from a single-line field (native)"}
  - {keys: "Space / Enter", action: "toggle/activate checkboxes, switches, buttons"}
responsive:
  - "fields-grid collapses to a single column on narrow screens."
  - "Footer actions stack rather than shrink below the min touch target."

ux_principles:
  - "Ask only for what you need; group logically and order fields the way the user thinks."
  - "Validate inline and message errors next to the field in plain language; keep the safe action (Cancel) subordinate but present."
common_mistakes:
  - "Placeholder-only labels."
  - "Multiple btn-primary submits, or a dominant Cancel."
  - "Errors shown only as red borders with no message / no aria-invalid."
  - "Free-floating inputs with no field-group / grid structure."
nielsen_heuristics:
  - {id: 9, name: "Help users recognize/recover from errors", note: "inline, plain-language messages tied to fields via aria-describedby"}
  - {id: 5, name: "Error prevention", note: "required markers, hints, and input formats reduce mistakes before submit"}
  - {id: 6, name: "Recognition rather than recall", note: "persistent labels + hints stay visible while filling"}
  - {id: 3, name: "User control and freedom", note: "a clear Cancel escape from the flow"}

relationships:
  related: [input, textarea, select, checkbox, radio-group, switch, label, button]
  replaces: ["ad-hoc form markup with inconsistent label/error handling"]
  composed_with: [input, textarea, select, label, button, dialog, sheet]
  not_to_confuse_with:
    - {component: dialog, why: "a dialog may contain a form; the form is the field/validation pattern itself"}
    - {component: toolbar, why: "toolbar filters a list in place; a form collects and submits input"}

tokens:
  color: [--card-bg, --border, --text-primary, --text-secondary, --interactive, --color-error, --color-error-ring, --red]
  radius: [--radius, --radius-md]
  spacing: ["24px 32px card padding", "20px field gap", "16px grid gap"]
  typography: [--font-size-label, --font-size-body-md, --font-size-caption]

source:
  css: css/components/form.css
  classes: [form-card, form-card-title, form-card-desc, fields-grid, field-group, field-label, field-required, field-input, field-supporting, field-hint, field-error-msg, is-error]
  react_wrapper: components/ui/form.tsx
  docs_anchor: c-form
---

## Correct usage

```html
<form>
  <div class="form-card">
    <div class="form-card-title">Información básica</div>
    <p class="form-card-desc">Completá los datos del puesto.</p>
    <div class="fields-grid">
      <div class="field-group">
        <label class="field-label">Título <span class="field-required">*</span></label>
        <input class="field-input" required aria-required="true">
      </div>
      <div class="field-group">
        <label class="field-label">Ubicación</label>
        <input class="field-input">
      </div>
    </div>
  </div>
  <div class="btn-group">
    <button class="btn-primary" type="submit">Guardar cambios</button>
    <button class="btn-tertiary" type="button">Cancelar</button>
  </div>
</form>
```
*Why:* grouped fields, persistent labels, required markers, one primary + subordinate Cancel.

## Incorrect usage

```html
<!-- ✕ Two competing primary submits, placeholder labels -->
<form>
  <input class="field-input" placeholder="Título">
  <button class="btn-primary">Guardar</button>
  <button class="btn-primary">Cancelar</button>
</form>
```
*Fix:* real labels, one btn-primary; Cancelar → btn-tertiary/secondary.
