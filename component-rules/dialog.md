---
id: dialog
display_name: Dialog
aliases: [modal, alert dialog, confirmation]
category: Overlays
status: stable
summary: A modal surface that interrupts the user for a focused task or a decision that must be resolved before continuing.

when_to_use:
  - "A short, focused task that must be completed or dismissed before continuing (edit a field set, confirm a choice)."
  - "A destructive/irreversible confirmation → the Alert Dialog variant (data-alert=\"true\")."
when_not_to_use:
  - "Non-blocking, transient feedback → use Snackbar/Toast."
  - "Persistent inline messaging → use Alert."
  - "A side panel of filters/details → use Sheet (edge-anchored)."
  - "A large multi-step flow or full page of content → use a dedicated page/route."
use_cases:
  - "Confirm deletion ('¿Eliminar esta vacante?') — Alert Dialog."
  - "Quick edit form ('Editar perfil')."

variants:
  - {name: dialog,       class: modal,                purpose: "Standard modal: dismissible via close button, Escape, or outside click."}
  - {name: alert-dialog, class: "modal[data-alert]",  purpose: "Blocking confirmation: NOT dismissible by Escape or outside click — the user must choose an action."}
  - {name: compact,      class: modal-sm,             purpose: "Small centered confirmation."}
  - {name: centered,     class: modal-centered,       purpose: "Center content + optional modal-media icon (destructive confirms)."}
sizes:
  - {name: default, class: "(default)", use: "standard modal — width min(560px, calc(100vw - 32px))"}
  - {name: sm,      class: modal-sm,     use: "compact confirmation"}
size_selection: "Use sm + centered for a single-decision confirmation; default for a small form."

content_rules:
  - "Title states the decision/task as a question or noun phrase; description gives the consequence."
  - "Footer: primary/confirm action + a secondary Cancel. Cancel is the safe default focus."
  - "Destructive confirm uses btn-danger; Cancel is btn-secondary (never the visually dominant action)."
layout_constraints:
  - "Borderless panel, single 24px padding, 16px vertical rhythm between header/body/footer (no per-section divider borders)."
  - "One close affordance (X, top-right) on standard dialogs; omit on Alert Dialog."

states:
  default: "Open over a scrim; content zoom-in."
  focus: "Focus moves into the dialog on open, returns to the trigger on close; focus-visible rings inside."
  destructive: "Alert Dialog with btn-danger confirm; outside-click/Escape disabled to prevent accidental confirm."

accessibility:
  roles: "role=dialog (standard) / role=alertdialog (blocking); aria-modal=true; labelled by title, described by description."
  aria: [aria-modal, aria-labelledby, aria-describedby, "aria-label on close button"]
  focus: "Focus trap while open; Escape closes standard dialog (disabled for Alert Dialog); focus returns to trigger."
  contrast: "Scrim + surface tokens ensure content contrast in light + dark."
keyboard:
  - {keys: "Escape", action: "close (standard dialog only; Alert Dialog ignores it)"}
  - {keys: "Tab / Shift+Tab", action: "cycle focus within the dialog (trapped)"}
  - {keys: "Enter", action: "activate the focused action"}
responsive:
  - "Width is min(560px, 100vw - 32px) — never touches the viewport edge on mobile."
  - "On very small screens consider a Sheet (bottom) instead for reach."

ux_principles:
  - "Reserve modality for moments that genuinely require the user's full attention — overuse trains dismissal."
  - "Make the safe action the default and the destructive action clearly marked."
common_mistakes:
  - "Using a Dialog for non-blocking feedback (should be a Snackbar)."
  - "Allowing outside-click/Escape to dismiss a destructive confirmation."
  - "Making Cancel visually dominant, or Confirm ambiguous ('OK')."
  - "Adding section-divider borders (the panel is borderless with a single 24px padding)."
nielsen_heuristics:
  - {id: 3, name: "User control and freedom", note: "clear cancel / escape hatch on standard dialogs"}
  - {id: 5, name: "Error prevention", note: "Alert Dialog confirms destructive actions, safe default focus"}
  - {id: 1, name: "Visibility of system status", note: "scrim + focus signal a modal context"}

relationships:
  related: [sheet, snackbar, alert, popover]
  replaces: ["legacy modal/confirm popups"]
  composed_with: [button, form, input]
  not_to_confuse_with:
    - {component: sheet, why: "Sheet is edge-anchored (filters/detail); Dialog is centered/modal task"}
    - {component: snackbar, why: "Snackbar is transient non-blocking feedback"}
    - {component: alert, why: "Alert is persistent inline messaging, not modal"}

tokens:
  color: [--color-surface, --color-on-surface, --color-scrim]
  radius: [--radius-lg]
  spacing: ["24px container padding", "16px section gap"]
  motion: [--duration-sheet, --ease-emphasized]

source:
  css: css/components/modal.css
  classes: [modal, modal-overlay, modal-header, modal-title, modal-description, modal-footer, modal-sm, modal-centered, modal-media]
  react_wrapper: components/ui/modal.tsx
  docs_anchor: c-dialog
---

## Correct usage

```html
<!-- Alert Dialog: destructive confirmation, not dismissible by Escape/outside-click -->
<div class="modal-overlay" data-alert="true">
  <div class="modal" role="alertdialog" aria-modal="true">
    <div class="modal-header">
      <div class="modal-title">¿Eliminar esta vacante?</div>
      <div class="modal-description">Esta acción no se puede deshacer.</div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary">Cancelar</button>
      <button class="btn-primary btn-danger">Eliminar</button>
    </div>
  </div>
</div>
```
*Why:* blocking confirm; Cancel is the safe default; destructive action clearly marked.

## Incorrect usage

```html
<!-- ✕ Dialog for transient success feedback -->
<div class="modal-overlay"><div class="modal">Guardado ✓</div></div>
```
*Fix:* use a Snackbar — don't interrupt with a modal for non-blocking feedback.
