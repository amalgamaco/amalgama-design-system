---
id: snackbar
display_name: Snackbar
aliases: [toast, snack, notification]
category: Feedback
status: stable
summary: A floating, ephemeral, non-blocking message that confirms something already happened, with at most one recovery action.
when_to_use:
  - "Confirm that a user action completed (guardado, envío, eliminación reversible)."
  - "Offer a single short recovery action ('Deshacer') for a reversible operation."
  - "Passive feedback that needs no decision and can disappear on its own."
when_not_to_use:
  - "A critical error or a message that requires a decision → use Dialog (Alert Dialog)."
  - "Information that must stay visible until the user acts → use Alert (inline/persistent)."
  - "Two or more actions in the feedback → it is not a snackbar; use Alert or Dialog."
  - "A system notification with semantic icon + classification → use the Toast panel variant (.toast)."
use_cases:
  - "'Archivo eliminado — DESHACER' after removing an attachment from a candidate."
  - "'Invitación enviada' after inviting a recruiter, with an optional 'Ver' action."
  - "'Cambios guardados' after saving a vacancy edit."
variants:
  - {name: message,    class: snackbar,             purpose: "Message only — a bare confirmation."}
  - {name: action,     class: snackbar-action,      purpose: "Single trailing action button (inverse-primary, uppercase label)."}
  - {name: close,      class: snackbar-close,       purpose: "Optional trailing close (icon) affordance; needs aria-label."}
  - {name: multiline,  class: "snackbar snackbar--multiline",  purpose: "Long message with the action stacked below (min-height 68dp)."}
  - {name: static,     class: "snackbar snackbar--static",     purpose: "Non-fixed, no enter/exit animation — for side-by-side Specs comparisons only."}
  - {name: queue,      class: snackbar-viewport,    purpose: "Stacking-queue container (column-reverse) that holds N snackbars; newest enters at the bottom edge."}
sizes:
  - {name: single,    class: "(default)", use: "one-line message, 48dp height"}
  - {name: multiline, class: "snackbar--multiline", use: "message that wraps; action drops below, ~68dp height"}
size_selection: "Keep the message to one or two lines. If it wraps past two lines, rewrite the copy rather than growing the snackbar."
content_rules:
  - "Message in past tense stating the fact ('Archivo eliminado'), not an instruction."
  - "The action is a single short verb ('Deshacer', 'Ver', 'Reintentar'), uppercase label."
  - "Never more than one action; no title/description split — this is not an Alert."
layout_constraints:
  - "Anchored to the bottom edge, horizontally centered; min 288dp / max 568dp wide."
  - "Sits above a bottom navigation bar or FAB without covering them."
  - "One snackbar at a time in standalone mode; the queue viewport stacks newest-at-bottom, it does not scatter offsets by index."
states:
  default: "Inverse-surface bar; slide-up 250ms enter."
  hover: "Action/close button gains an inverse state layer (8% inverse-primary / inverse-on-surface)."
  focus: "focus-visible outline on action/close (2px inverse-primary), offset 2px."
  active: "Pressed state layer (12%) on action/close."
  exit: "fade-out 200ms via .snackbar--exit; auto-dismiss ~4–10s or on close."
accessibility:
  roles: "role=status for informational/confirmation messages (most); role=alert only for errors the user must know immediately."
  aria: [aria-live=polite (with status), aria-live=assertive (with alert), aria-atomic=true, "aria-label on close button"]
  focus: "Focus does NOT auto-move to the snackbar (interrupting the flow is counterproductive); action + close remain Tab-reachable while visible; on dismiss, focus returns to the trigger."
  contrast: "inverse-surface / inverse-on-surface pair meets AA in light + dark with no per-theme override."
keyboard:
  - {keys: "Tab", action: "reach the action and close buttons while visible"}
  - {keys: "Enter / Space", action: "activate the focused action or close"}
  - {keys: "Escape", action: "dismiss the snackbar when focus is inside it"}
responsive:
  - "On mobile spans the available width with margins; on desktop capped at a comfortable max width."
  - "Action stays trailing on one line; in multiline it drops below the message."
ux_principles:
  - "Ephemeral by design — it confirms and gets out of the way; overusing it as persistent messaging defeats the purpose."
  - "The single recovery action gives control back without a modal interruption."
common_mistakes:
  - "Using a snackbar for a critical error or a required decision (should be a Dialog)."
  - "Adding two or more actions."
  - "Stacking/replacing so fast the user can't read it, or auto-focusing it."
  - "Injecting the live-region node only when the toast fires — screen readers won't announce a region added dynamically; the container must exist in the DOM from load."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "confirms the action completed"}
  - {id: 3, name: "User control and freedom", note: "the single 'Deshacer' action undoes a reversible operation"}
  - {id: 9, name: "Help users recognize and recover from errors", note: "recovery action offered inline"}
relationships:
  related: [alert, dialog, toast]
  replaces: ["ad-hoc floating notification bars"]
  composed_with: [button]
  not_to_confuse_with:
    - {component: alert, why: "Alert is inline + persistent; Snackbar is floating + ephemeral"}
    - {component: dialog, why: "Dialog blocks and demands a decision; Snackbar never blocks"}
    - {component: toast, why: "Toast (.toast panel) is the top-right system notification with a semantic icon; Snackbar is the bottom inverse-surface confirmation bar"}
tokens:
  color: [--color-inverse-surface, --color-inverse-on-surface, --color-inverse-primary]
  radius: [--radius-sm]
  spacing: [--space-2, --space-4]
  motion: ["250ms slide-up in", "200ms fade-out"]
motion:
  enter: "Snackbar slides up + fades in (@keyframes snackbar-in / snackbar-stack-in: translateY(16px)→0, opacity 0→1). Toast slides in from the right (@keyframes slideInRight)."
  exit: "Snackbar fades out + slides down via .snackbar--exit (@keyframes snackbar-out / snackbar-stack-out: translateY→16px, opacity→0)."
  stateChange: "Action/close buttons show hover/press state-layer tints (color-mix on --color-inverse-primary / --color-inverse-on-surface); toast-close animates background + color."
  duration: "Hardcoded 250ms in / 200ms out (NOT tokens); button tints use --duration-fast; the toast-spinner loader loops at .7s."
  easing: "--ease-default (snackbar enter, button tints); exit is hardcoded ease-in; toast enter is hardcoded ease."
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0); the component's own @media rule also zeroes the slide, falling back to a near-instant appearance / short opacity fade. The looping toast-spinner loader becomes static."
  constraints: "One snackbar action button max; queue via .snackbar-viewport (column-reverse), no swipe-to-dismiss; animate transform/opacity only. Static side-by-side demos use .snackbar--static (animation:none)."
  relatedPatterns: [snackbar, toast-stack, loading]
source:
  css: css/components/toast.css
  classes: [snackbar, snackbar-message, snackbar-action, snackbar-close, "snackbar--multiline", "snackbar--static", "snackbar--exit", snackbar-viewport, toast, toast-container, toast-success, toast-error, toast-info]
  react_wrapper: components/ui/toast.tsx
  docs_anchor: c-snackbar
---

## Correct usage

```html
<!-- Confirmation + single recovery action; live region present from load -->
<div class="snackbar" role="status" aria-live="polite" aria-atomic="true">
  <span class="snackbar-message">Archivo eliminado</span>
  <button class="snackbar-action">Deshacer</button>
</div>
```
*Why:* past-tense fact, exactly one recovery action, non-blocking, announced politely.

```html
<!-- Long message stacks the action below -->
<div class="snackbar snackbar--multiline" role="status" aria-live="polite" aria-atomic="true">
  <span class="snackbar-message">No se pudo completar la operación en el servidor remoto</span>
  <button class="snackbar-action">Reintentar</button>
</div>
```
*Why:* multiline keeps the message readable and drops the single action to the trailing edge.

## Incorrect usage

```html
<!-- ✕ Two actions in a snackbar -->
<div class="snackbar" role="status">
  <span class="snackbar-message">¿Eliminar la vacante?</span>
  <button class="snackbar-action">Sí</button>
  <button class="snackbar-action">No</button>
</div>
```
*Fix:* a required decision belongs in an Alert Dialog, not a snackbar.

```html
<!-- ✕ Persistent status shown as a snackbar -->
<div class="snackbar" role="status">
  <span class="snackbar-message">Faltan 3 campos obligatorios en el formulario</span>
</div>
```
*Fix:* use an inline `alert alert-error` that stays visible until the user fixes the fields.
