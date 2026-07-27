---
id: input-otp
display_name: Input OTP
aliases: [otp, one-time code, pin, verification code]
category: Forms
status: stable
summary: One-time-code / PIN entry in individual single-character boxes, with auto-advance, backspace-back, and paste-splitting.

when_to_use:
  - "Entering a fixed-length verification code (2FA, SMS, email confirmation) or a numeric PIN."
  - "Any short code where per-character boxes aid readability and reduce entry errors."
when_not_to_use:
  - "Free-form text of any length → use Input."
  - "A single character/digit → use Input."
  - "A password → use Input type=password, not OTP boxes."
use_cases:
  - "Verificación en dos pasos: código de 6 dígitos enviado por SMS."
  - "Confirmación de email: código de 6 caracteres."

variants:
  - {name: base, class: otp-group, purpose: "Container (role=group) holding the individual .otp-slot boxes."}
  - {name: slot, class: otp-slot, purpose: "One <input maxlength=1> box; auto-advances on type, goes back + clears on backspace."}
  - {name: separator, class: otp-separator, purpose: "Optional visual divider between groups (e.g. 3 + 3)."}
sizes:
  - {name: md, class: "(default)", use: "40×40 boxes; the only size"}
size_selection: "Single size by design; the box count equals the code length."

content_rules:
  - "The group needs an accessible name (role=group + aria-label 'Código de verificación')."
  - "Set inputmode=numeric for digit-only codes; use maxlength=1 per box."
  - "One box per expected character; a separator may split logical groups but keep total = code length."
layout_constraints:
  - "Boxes sit in a horizontal .otp-group; don't stack or wrap the code across lines."
  - "Paste splits a full code across boxes from the focused position — don't disable paste."

states:
  default: "1px --border box, mono font, centered."
  hover: "Border darkens to --color-outline (not on focus/disabled)."
  focus: "Border --interactive + 3px --color-focus-ring; the focused box lifts (z-index)."
  disabled: ".otp-group.is-disabled / :disabled → dimmed, not-allowed."
  error: "Per-box aria-invalid, or .otp-group.is-error for the whole code → --color-error border, error ring on focus."

accessibility:
  roles: "Real <input maxlength=1> boxes inside a role=group; browser handles selection/deletion/IME."
  aria: [role=group, aria-label (the group), "aria-invalid on box(es) / group for error"]
  focus: "Typing auto-advances focus; Backspace on an empty box returns to and clears the previous one."
  contrast: "Box border, text, and error state meet AA in light + dark via tokens."
keyboard:
  - {keys: "type a character", action: "fill the box and advance to the next"}
  - {keys: "Backspace", action: "clear the box; on an empty box, go back and clear the previous"}
  - {keys: "← / →", action: "move between boxes"}
  - {keys: "paste", action: "split a full code across boxes from the current position"}
  - {keys: "Tab", action: "move focus off the group"}
responsive:
  - "Keep boxes ≥ 40px (≈44px tap) on coarse pointers; a 6-box group fits typical mobile widths."

ux_principles:
  - "Per-character boxes make a code easy to read back and correct (recognition, error prevention)."
  - "Auto-advance and paste-splitting minimise friction — never fight the user's paste."
common_mistakes:
  - "Using OTP boxes for free-form text or a password."
  - "Disabling paste, forcing manual per-box entry."
  - "No accessible group name."
  - "Rebuilding boxes as <div>+caret JS instead of real <input maxlength=1>."
nielsen_heuristics:
  - {id: 7, name: "Flexibility and efficiency of use", note: "paste-splitting + auto-advance speed up entry"}
  - {id: 5, name: "Error prevention", note: "one box per character makes miskeys visible and easy to fix"}
  - {id: 1, name: "Visibility of system status", note: "focused box highlights the current position"}

relationships:
  related: [input, form, label]
  replaces: ["N loose <input> code fields without auto-advance/paste-splitting"]
  composed_with: [form, label, dialog]
  not_to_confuse_with:
    - {component: input, why: "input is free-form; OTP is fixed-length per-character code entry"}

tokens:
  color: [--border, --card-bg, --text-primary, --interactive, --color-focus-ring, --color-error, --color-error-ring, --color-disabled, --color-on-disabled]
  radius: [--radius-md]
  typography: [--font-size-heading-xs, --font-mono, --font-weight-medium]
  motion: [--duration-fast, --ease-default]

motion:
  enter: "none — the boxes are always present (static; JS auto-advance/backspace/paste move the caret, not animation)"
  exit: "none"
  stateChange: "Focus moves the border to --interactive and adds a 3px --color-focus-ring box-shadow; hover (when not focused/disabled) darkens the border to --color-outline; error/invalid swaps to --color-error + --color-error-ring. Only border-color and box-shadow transition."
  duration: "--duration-fast"
  easing: "--ease-default"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). No looping or essential motion to preserve — the focus ring still appears, just without the fade."
  constraints: "Transition border-color/box-shadow only (cheap effects, no layout). Auto-advance, backspace-back and paste-splitting are instant caret/value changes — never animate them. Don't animate box width or the group gap."
  relatedPatterns: ["motion.md → Hover & press micro-interactions (state-layer/border effects on --ease-default)"]

source:
  css: css/components/input-otp.css
  classes: [otp-group, otp-slot, otp-separator, is-disabled, is-error]
  react_wrapper: components/ui/input-otp.tsx
  docs_anchor: c-input-otp
---

## Correct usage

```html
<div class="otp-group" role="group" aria-label="Código de verificación">
  <input class="otp-slot" maxlength="1" inputmode="numeric" autocomplete="one-time-code">
  <input class="otp-slot" maxlength="1" inputmode="numeric">
  <input class="otp-slot" maxlength="1" inputmode="numeric">
  <span class="otp-separator">–</span>
  <input class="otp-slot" maxlength="1" inputmode="numeric">
  <input class="otp-slot" maxlength="1" inputmode="numeric">
  <input class="otp-slot" maxlength="1" inputmode="numeric">
</div>
```
*Why:* fixed-length code, named group, numeric input mode, paste splits across the boxes.

## Incorrect usage

```html
<!-- ✕ OTP boxes for free-form text -->
<div class="otp-group"><input class="otp-slot" maxlength="1"><!-- for a name --></div>
```
*Fix:* free-form text is an Input; OTP is only for fixed-length codes.

```html
<!-- ✕ No accessible group name -->
<div class="otp-group"><input class="otp-slot" maxlength="1"> …</div>
```
*Fix:* add role="group" + aria-label describing the code.
