---
id: switch
display_name: Switch
aliases: [toggle switch, on/off, toggle]
category: Forms
status: stable
summary: A binary on/off control with immediate effect — flipping it applies the setting instantly, no separate confirm button.

when_to_use:
  - "A single setting that takes effect the moment it is flipped (dark mode, email notifications, availability)."
  - "State that is binary and independent — not part of a group the user submits together."
when_not_to_use:
  - "Selecting one or more items from a list that is submitted with a form → use Checkbox."
  - "Choosing exactly one option among several mutually exclusive alternatives → use Radio Group."
  - "Switching between views/modes (list vs board) → use Segmented Button or Toggle Group."
  - "An action that must run explicitly (save, delete) → use Button."
use_cases:
  - "Perfil: 'Recibir notificaciones por email' (aplica al instante)."
  - "Vacante: 'Publicar en el portal externo' toggled on immediately."
  - "Ajustes: 'Modo oscuro'."

variants:
  - {name: base, class: switch, purpose: "The on/off track + thumb; native <input type=\"checkbox\" role=\"switch\">."}
  - {name: label, class: switch-label, purpose: "Wrapper that pairs the switch with an inline clickable label."}
sizes:
  - {name: md, class: "(default)", use: "standard density — 44×24 track"}
  - {name: sm, class: switch-sm, use: "dense rows or inside a card-action — 36×20 track (par shadcn size=sm)"}
size_selection: "Use the default in settings lists; use switch-sm only inside a dense row or a card action where 44px would crowd the layout."

content_rules:
  - "The label names the setting as a state, not an action ('Notificaciones por email', not 'Activar notificaciones')."
  - "Do not add a 'Sí/No' or 'On/Off' text next to it — the thumb position is the state."
layout_constraints:
  - "Always paired with a persistent visible label; never a bare switch with no name."
  - "Place the label before the switch in a settings row; the switch sits to the right/trailing edge."

states:
  default: "Unchecked: surface-variant track, --color-outline border + thumb."
  hover: "Track border darkens to --color-on-surface."
  focus: "focus-visible ring (--color-focus + --color-focus-ring outline)."
  checked: "Filled --color-primary track, thumb slides right and turns --color-on-primary."
  disabled: "40% opacity, not-allowed cursor, not focusable."
  error: "aria-invalid=\"true\" (unchecked only) → red track border via --color-error."

accessibility:
  roles: "Native <input type=\"checkbox\"> with role=\"switch\"; SRs announce 'activado/desactivado' instead of 'marcado'."
  aria: [role=switch, aria-checked (managed natively), aria-label (if no visible label), "aria-invalid for error"]
  focus: "Keyboard-focusable natively; visible focus ring; label is a click target when using switch-label."
  contrast: "Checked track/thumb pair meets AA in light + dark via primary/on-primary tokens."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "move focus to/from the switch"}
  - {keys: "Space / Enter", action: "toggle on/off"}
responsive:
  - "Keep a ≥ 44px touch target on coarse pointers — prefer the default size over switch-sm on mobile."

ux_principles:
  - "Immediate effect must be truly immediate — if the change needs a save step, it is a Checkbox, not a Switch."
  - "The current state must be readable at a glance from thumb position + fill (visibility of system status)."
common_mistakes:
  - "Using a Switch inside a form that is submitted later (that is a Checkbox)."
  - "A Switch with no visible/adjacent label."
  - "Adding a Cancel/Save step around a Switch — defeats its immediate-effect contract."
  - "Using role=switch semantics for multi-select in a list."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "thumb position + fill show the current state instantly"}
  - {id: 4, name: "Consistency and standards", note: "switch = immediate effect everywhere; checkbox = deferred submit"}
  - {id: 3, name: "User control and freedom", note: "toggling back off immediately reverses the change"}

relationships:
  related: [checkbox, radio-group, toggle, toggle-group]
  replaces: ["ad-hoc toggle switches", "a checkbox styled as a switch without role=switch"]
  composed_with: [label, list, card]
  not_to_confuse_with:
    - {component: checkbox, why: "checkbox is a deferred-submit selection; switch applies instantly"}
    - {component: toggle, why: "toggle is a pressable state button (e.g. bold); switch is a setting"}
    - {component: radio-group, why: "radio picks one of several; switch is a single binary"}

tokens:
  color: [--color-primary, --color-on-primary, --color-surface-variant, --color-outline, --color-on-surface, --color-error]
  radius: [--radius-full]
  motion: [--duration-fast, --duration-normal, --ease-expressive]

motion:
  enter: "none — the control is always present"
  exit: "none"
  stateChange: "Toggling slides the ::after thumb via transform: translateX (20px full / 16px .switch-sm) — a spatial move on --ease-expressive at --duration-normal. In parallel, the track background + border-color and the thumb background are color effects on --duration-fast/--ease-default. This is the per-property split: transform on Expressive, color on Standard."
  duration: "--duration-normal (thumb travel) · --duration-fast (track + thumb color)"
  easing: "--ease-expressive (thumb transform) · --ease-default (track/thumb color effects)"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). The thumb still moves to its on/off position, just without the slide."
  constraints: "Animate transform + color only (thumb via translateX — no left/margin, no layout). Keep the split: the spatial thumb move is Expressive (approved overshoot), the color stays Standard — never put the color on an Expressive curve."
  relatedPatterns: ["motion.md → The dual system: Standard vs. Expressive", "motion.md → Hover & press micro-interactions (per-property timing split)"]

source:
  css: css/components/switch.css
  classes: [switch, switch-sm, switch-label]
  react_wrapper: components/ui/switch.tsx
  docs_anchor: c-switch
---

## Correct usage

```html
<!-- Setting with immediate effect + inline label -->
<label class="switch-label">
  <input type="checkbox" role="switch" class="switch" checked>
  Recibir notificaciones por email
</label>
```
*Why:* role="switch" gives the correct SR announcement; flipping applies the setting instantly.

```html
<!-- Dense row variant -->
<div style="display:flex;align-items:center;justify-content:space-between">
  <span class="label">Publicar en el portal externo</span>
  <input type="checkbox" role="switch" class="switch switch-sm" aria-label="Publicar en el portal externo">
</div>
```
*Why:* compact size fits a dense row; the setting still has an accessible name.

## Incorrect usage

```html
<!-- ✕ Switch inside a form the user submits later -->
<form>
  <input type="checkbox" role="switch" class="switch"> Acepto los términos
  <button class="btn-primary">Enviar</button>
</form>
```
*Fix:* deferred, submitted-with-the-form selection is a Checkbox, not a Switch.

```html
<!-- ✕ Bare switch with no name -->
<input type="checkbox" role="switch" class="switch">
```
*Fix:* add a visible label (switch-label) or an aria-label.
