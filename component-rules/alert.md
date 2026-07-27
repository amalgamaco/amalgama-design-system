---
id: alert
display_name: Alert
aliases: [banner, callout, inline message, notice]
category: Feedback
status: stable
summary: An inline, persistent contextual message that stays in the page flow until the user resolves or dismisses it.
when_to_use:
  - "A persistent notice tied to the page or a form (system notice, maintenance warning, informational note)."
  - "A full validation summary for a form that must stay visible while the user fixes it."
  - "Contextual information that should remain until acted on — often several at once, in context."
when_not_to_use:
  - "Ephemeral feedback confirming an action just happened → use Snackbar (floating, auto-dismiss)."
  - "A confirmation that must interrupt the user → use Dialog (Alert Dialog)."
  - "Color as the only signal → always pair with a title and/or icon."
use_cases:
  - "Error summary at the top of a vacancy form ('Faltan 3 campos obligatorios')."
  - "Maintenance notice ('El sistema estará en modo lectura el sábado')."
  - "Success confirmation that must persist ('Vacante publicada')."
variants:
  - {name: default, class: alert,         purpose: "Neutral notice on surface-container; use for non-semantic info."}
  - {name: info,    class: alert-info,    purpose: "Informational — info-container / on-info-container tokens."}
  - {name: success, class: alert-success, purpose: "Positive outcome — success-container tokens."}
  - {name: warning, class: alert-warning, purpose: "Caution — warning-container tokens."}
  - {name: error,   class: alert-error,   purpose: "Error/blocking condition — error-container tokens."}
sizes:
  - {name: default, class: "(default)", use: "single density; grows with title + description + actions"}
size_selection: "One size. Density comes from whether you include an icon, description, actions, and/or a close button — not a size class."
content_rules:
  - "Lead with a short title stating the condition; the description gives the consequence or next step."
  - "Reinforce meaning with an icon + title — never rely on the background color alone."
  - "Action buttons in .alert-actions are real DS buttons (btn-*); keep them to the alert's scope."
layout_constraints:
  - "Full-width within its container, in the page flow (not floating)."
  - "Icon sits in the leading grid column; actions and the optional close align under the body."
  - "Multiple alerts may coexist in context; they don't queue or auto-dismiss."
states:
  default: "Resting container/on-container fill per variant."
  focus: "focus-visible ring on close button and any action buttons."
  dismissed: "Optional — .alert-close removes the alert; it is anchored top-right."
accessibility:
  roles: "Container carries role=alert so screen readers announce the message on appearance."
  aria: ["role=alert", "aria-label on .alert-close"]
  focus: ".alert-actions buttons and .alert-close are real <button>/<a> with native focus + keyboard."
  contrast: "Every container/on-container pair meets AA in light + dark."
keyboard:
  - {keys: "Tab", action: "reach action buttons and the close control"}
  - {keys: "Enter / Space", action: "activate the focused action or dismiss"}
responsive:
  - "Full-width block reflows naturally; icon + body + actions stack comfortably on narrow widths."
ux_principles:
  - "Persistence matches intent — the message stays exactly as long as the condition it describes."
  - "Meaning is redundant (icon + title + color), so it survives color-blindness and grayscale."
common_mistakes:
  - "Using an Alert for a fire-and-forget confirmation (should be a Snackbar)."
  - "Conveying severity by background color only, with no title/icon."
  - "Blocking the flow with a modal-like alert when it should be inline."
  - "Putting a required decision's confirm/cancel in an Alert instead of an Alert Dialog."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "persistent condition stays visible while it's true"}
  - {id: 9, name: "Help users recognize and recover from errors", note: "error variant + description guide the fix"}
  - {id: 5, name: "Error prevention", note: "warning variant flags risky context before the user proceeds"}
relationships:
  related: [snackbar, dialog, badge]
  replaces: ["ad-hoc warning/notice banners"]
  composed_with: [button, form]
  not_to_confuse_with:
    - {component: snackbar, why: "Snackbar is floating + ephemeral; Alert is inline + persistent"}
    - {component: dialog, why: "Alert Dialog blocks and demands a choice; Alert coexists with content"}
    - {component: badge, why: "Badge is a compact read-only status marker; Alert is a full contextual message"}
tokens:
  color: [--color-info-container, --color-on-info-container, --color-success-container, --color-warning-container, --color-error-container, --color-surface-container]
  radius: [--radius-lg]
  spacing: ["12px 16px padding", "12px column gap"]
motion:
  enter: "none — Alert is inline and persistent; it appears with the page, no entrance animation."
  exit: "none — dismissal via .alert-close removes it immediately; no exit animation."
  stateChange: ".alert-close fades opacity (.7→1) and shows a currentColor state-layer background on hover; focus ring on :focus-visible."
  duration: "--duration-fast (close button opacity + background)."
  easing: "--ease-default (close button transitions)."
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0); the close-button hover fade becomes instant. Nothing else moves."
  constraints: "Inline/persistent — never animate it like an overlay; animate opacity/background only on the close affordance. Meaning must not rely on motion or color alone (pair with title/icon)."
  relatedPatterns: [hover-press]
source:
  css: css/components/alert.css
  classes: [alert, alert-info, alert-success, alert-warning, alert-error, alert-icon, alert-body, alert-title, alert-description, alert-actions, alert-close]
  react_wrapper: components/ui/alert.tsx
  docs_anchor: c-alert
---

## Correct usage

```html
<!-- Persistent error summary tied to a form -->
<div class="alert alert-error" role="alert">
  <svg class="alert-icon">…</svg>
  <div class="alert-body">
    <div class="alert-title">Revisá el formulario</div>
    <div class="alert-description">Faltan 3 campos obligatorios antes de publicar la vacante.</div>
  </div>
</div>
```
*Why:* inline, persistent, meaning reinforced by icon + title (not color alone), announced via role=alert.

```html
<!-- Informational notice with a dismiss control -->
<div class="alert alert-info" role="alert">
  <svg class="alert-icon">…</svg>
  <div class="alert-body">
    <div class="alert-title">Mantenimiento programado</div>
    <div class="alert-description">El sistema estará en modo lectura el sábado de 2 a 4am.</div>
  </div>
  <button class="alert-close" aria-label="Descartar aviso"><svg>…</svg></button>
</div>
```
*Why:* stays until dismissed; close control has an accessible name.

## Incorrect usage

```html
<!-- ✕ Color-only severity, no title/icon -->
<div class="alert alert-warning" role="alert">Algo salió mal</div>
```
*Fix:* add an `alert-title` + `alert-icon`; never signal severity by background color alone.

```html
<!-- ✕ Ephemeral confirmation forced into a persistent Alert -->
<div class="alert alert-success" role="alert">
  <div class="alert-body"><div class="alert-title">Cambios guardados</div></div>
</div>
```
*Fix:* a fire-and-forget confirmation is a Snackbar, not a persistent Alert.
