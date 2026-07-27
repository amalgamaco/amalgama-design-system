---
id: toggle
display_name: Toggle
aliases: [toggle button, pressed button, format button]
category: Actions
status: stable
summary: A single two-state (pressed / not-pressed) button for a bold-style setting that applies immediately — state lives on aria-pressed.

when_to_use:
  - "Toggling one on/off setting that applies instantly (bold in an editor, 'mostrar solo favoritos')."
  - "Formatting controls in a toolbar (negrita / itálica / subrayado)."
  - "A bold-style button whose pressed state should read as selected, not as navigation."
when_not_to_use:
  - "Choosing 1 of N mutually exclusive options → use Segmented Button."
  - "Tag-style filtering → use Chip."
  - "A stateless action → use Button."
  - "An on/off preference with a visible label (Notificaciones: on/off) → use Switch."
  - "Several related toggles grouped on one axis → wrap them in Toggle Group."
use_cases:
  - "Text-format toggle in a rich editor."
  - "'Solo favoritos' filter toggle above a list."
  - "A pinned/starred toggle on a card action row."

variants:
  - {name: default, class: toggle,          purpose: "Borderless toggle; pressed fill only."}
  - {name: outline, class: toggle-outline,  purpose: "Outlined resting state (border --color-outline-variant); border clears when pressed."}
sizes:
  - {name: sm,      class: toggle-sm,        use: "dense toolbars (32px)"}
  - {name: md,      class: "toggle (default)", use: "standard density (36px)"}
  - {name: lg,      class: toggle-lg,        use: "touch targets (40px)"}
size_selection: "Match the surrounding toolbar density; use lg for comfortable touch. Icon-only toggles keep a square min-width at every size."

content_rules:
  - "A short label or a single icon — bold/italic glyphs, a star, etc."
  - "Icon-only toggles MUST carry an aria-label naming the setting."
  - "The label names the setting, not the current value ('Negrita', not 'Quitar negrita')."
layout_constraints:
  - "Intrinsic width; not a full-width control."
  - "Pressed state uses --color-secondary-container (never --color-primary, which inverts to white in dark and would read as 'no color')."

states:
  default: "Transparent (or outlined) resting; label/icon --color-on-surface."
  hover: "State layer on-surface @ 8% (pressed: on-secondary-container @ 8% over the container)."
  focus: "Visible focus-visible ring (--color-focus + --color-focus-ring)."
  pressed: "aria-pressed=true → filled --color-secondary-container / --color-on-secondary-container (outline variant drops its border)."
  disabled: "opacity 0.38; no pointer events."
  error: "aria-invalid=true adds a --color-error border (rare, kept for control consistency)."

accessibility:
  roles: "Native <button> with aria-pressed reflecting the on/off state; Enter/Space work natively."
  aria: ["aria-pressed=true/false", "aria-label on icon-only toggles"]
  focus: "Keyboard-reachable in DOM order; visible focus ring; togglePress() flips aria-pressed."
  contrast: "Pressed fill/label pair (secondary-container / on-secondary-container) meets AA in light + dark."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "move focus"}
  - {keys: "Space / Enter", action: "toggle pressed state"}
responsive:
  - "Use lg for a ≥ 44px touch target on coarse pointers."

ux_principles:
  - "The pressed fill makes the current on/off state obvious at a glance (visibility of system status)."
  - "Immediate application — no confirm step for a formatting toggle (efficiency of use)."
common_mistakes:
  - "Using it to choose 1 of N (that's Segmented Button)."
  - "Using --color-primary for the pressed fill (inverts to white in dark)."
  - "Icon-only toggle with no aria-label."
  - "Using a Toggle for an on/off preference with a label — that's a Switch."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "pressed fill shows the setting is on"}
  - {id: 4, name: "Consistency and standards", note: "shares the secondary-container selection language with Chip and nav-active"}
  - {id: 7, name: "Flexibility and efficiency of use", note: "one tap applies the setting immediately"}

relationships:
  related: [toggle-group, chip, segmented-button, switch, button]
  replaces: ["ad-hoc on/off buttons with hand-managed aria-pressed"]
  composed_with: [toolbar, toggle-group]
  not_to_confuse_with:
    - {component: switch, why: "Switch is a labelled on/off preference; Toggle is a bold-style button"}
    - {component: chip, why: "chips are tag-style multi-select filters; a toggle is a single setting button"}
    - {component: segmented-button, why: "segmented picks 1 of N views; a toggle is one independent on/off"}
    - {component: button, why: "buttons act statelessly; a toggle holds an on/off state"}

tokens:
  color: [--color-secondary-container, --color-on-secondary-container, --color-on-surface, --color-outline-variant, --color-focus, --color-focus-ring, --color-error]
  radius: [--radius-md]
  spacing: [--space-2]
  motion: [--duration-fast, --ease-default]

source:
  css: css/components/toggle.css
  classes: [toggle, toggle-outline, toggle-sm, toggle-lg]
  react_wrapper: components/ui/toggle.tsx
  docs_anchor: c-toggle
---

## Correct usage

```html
<!-- Icon-only format toggle with an accessible name -->
<button type="button" class="toggle" aria-label="Negrita" aria-pressed="false" onclick="togglePress(this)">
  <svg width="16" height="16">…</svg>
</button>
```
*Why:* real <button> + aria-pressed give keyboard/SR support for free; aria-label names the icon-only control.

```html
<!-- Outlined toggle with a label -->
<button type="button" class="toggle toggle-outline" aria-pressed="true" onclick="togglePress(this)">Solo favoritos</button>
```
*Why:* one on/off setting that applies immediately; pressed fill uses secondary-container (dark-safe).

## Incorrect usage

```html
<!-- ✕ Toggle used to pick one of several views -->
<div style="display:flex"><button class="toggle" aria-pressed="true">Lista</button><button class="toggle" aria-pressed="false">Cuadrícula</button></div>
```
*Fix:* a mutually exclusive view switch is a Segmented Button.

```html
<!-- ✕ Icon-only toggle without a name -->
<button class="toggle" aria-pressed="false"><svg>…</svg></button>
```
*Fix:* add `aria-label="Negrita"` so screen readers announce the setting.
