---
id: segmented-button
display_name: Segmented Button
aliases: [seg-btn, segmented control, view switch, view toggle]
category: Actions
status: stable
summary: A compact pill that switches between 2–5 mutually exclusive views or modes; exactly one segment is active at a time.

when_to_use:
  - "Switching the view or mode of the same screen (Lista / Cuadrícula, Día / Semana / Mes)."
  - "A compact, always-visible selector of 2–5 related, similar-length options — no dropdown."
  - "Category or mode filters within one context where the change applies immediately."
when_not_to_use:
  - "Performing an action with an effect → use Button."
  - "Navigating between different pages/sections → use Tabs (or nav)."
  - "More than 5 options, or long/dissimilar labels → use Select."
  - "Multi-select tag-style filtering → use Chip."
  - "A single on/off setting, or grouped independent toggles (bold/italic) → use Toggle / Toggle Group."
use_cases:
  - "View switch on a listing: 'Lista' / 'Cuadrícula'."
  - "Period selector on a dashboard: 'Día' / 'Semana' / 'Mes'."
  - "Alignment or day-of-week filters where segments combine (type=multiple)."

variants:
  - {name: single,   class: "seg-btn.selected / [aria-selected=true]", purpose: "type=single — exactly one active segment; segSwitch() moves selection between siblings."}
  - {name: multiple, class: "seg-btn.selected / [aria-pressed=true]",  purpose: "type=multiple — several segments active at once (combinable filters); segSwitchMulti() toggles each independently."}
sizes:
  - {name: sm,      class: seg-btn-group-sm, use: "compact toolbars, inline filters (~28px)"}
  - {name: md,      class: "seg-btn-group (default)", use: "standard density (~36px)"}
  - {name: lg,      class: seg-btn-group-lg, use: "touch targets / mode-switch CTAs (~44px)"}
size_selection: "Match surrounding density; use lg where a comfortable touch target matters. Keep the group's intrinsic width — never stretch it to full width like a form control."

content_rules:
  - "Short, homogeneous labels of similar length (view/mode names, not verbs) so the group looks balanced."
  - "2–5 segments maximum."
  - "Icon-only segments MUST carry an aria-label naming the option."
layout_constraints:
  - "Intrinsic content width — never full-width; that reads as a form field."
  - "Lives inside the view it controls (toolbar, filter row, section header), not as global navigation."
  - "Single-select always keeps one segment active — there is no 'none selected' state (use Chips if you need that)."

states:
  default: "Transparent segment, group border --color-outline-variant, label --color-on-surface."
  hover: "State layer over the segment (unselected: on-surface @ 8%; selected: on-secondary-container @ 8% over the container)."
  focus: "Visible focus-visible ring (--color-focus + --color-focus-ring) plus a 12% state layer; the ring is required (WCAG 2.4.7) and never removed."
  active: "Pressed state layer at 12%."
  selected: "Filled --color-secondary-container / --color-on-secondary-container, weight 600."
  disabled: "Label onSurface @ 38%, container/border onSurface @ 12%; no pointer events."

accessibility:
  roles: "role=group + aria-label on the container. Each segment is a real <button>; single-select uses aria-selected, independent toggles use aria-pressed."
  aria: ["role=group + aria-label (container)", "aria-selected on each button (single)", "aria-pressed (multiple)", "aria-label on icon-only segments", "aria-disabled/disabled when disabled"]
  focus: "Roving tabindex — Tab enters/leaves the group; Arrow keys move focus between segments; visible ring on the focused segment."
  contrast: "Active label/container pair and inactive label/surface both meet AA in light + dark via the container/on-container token pairs."
keyboard:
  - {keys: "Tab", action: "move focus into the group (selected segment) and back out — not segment by segment"}
  - {keys: "← / →", action: "move focus between segments within the group"}
  - {keys: "Space / Enter", action: "activate the focused segment"}
responsive:
  - "Use the lg size for a ≥ 44px touch target on coarse pointers."
  - "Keep labels short so the group does not overflow on narrow widths; if it would, reconsider Select."

ux_principles:
  - "A single always-visible active segment shows current state at a glance (visibility of system status)."
  - "Options are shown side by side, so the user recognizes choices instead of recalling them."
  - "Immediate, non-destructive switching — no confirm step for a view change."
common_mistakes:
  - "Using it for actions that trigger effects (that's Button)."
  - "Using it as global navigation between pages (that's Tabs)."
  - "Cramming more than 5 segments or dissimilar labels (use Select)."
  - "Stretching the group full-width like a form field."
  - "Icon-only segments without aria-label."
  - "Confusing it with Toggle Group — a pill view-switch vs. grouped independent toggles."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "the active segment always shows the current view/mode"}
  - {id: 4, name: "Consistency and standards", note: "secondary-container selection color matches Chip/Toggle across the system"}
  - {id: 6, name: "Recognition rather than recall", note: "all options are visible, not hidden in a menu"}
  - {id: 7, name: "Flexibility and efficiency of use", note: "one compact tap to switch, no dropdown"}

relationships:
  related: [button, toggle-group, chip, tabs]
  replaces: ["legacy pill radio-button groups", "custom view-switch toggles"]
  composed_with: [toolbar, page-header, card]
  not_to_confuse_with:
    - {component: tabs, why: "tabs navigate between panels/sections; segmented switches a view/mode in place"}
    - {component: toggle-group, why: "toggle-group is a row of independent button toggles (bold/italic); segmented is a bordered pill view-switch"}
    - {component: chip, why: "chips are multi-select tag filters; single-select segmented always keeps one active"}
    - {component: button, why: "buttons act once; segmented selects a persistent mode"}

tokens:
  color: [--color-secondary-container, --color-on-secondary-container, --color-outline-variant, --color-on-surface, --color-focus, --color-focus-ring]
  radius: [--radius-full]
  spacing: [--space-2]
  motion: [--duration-fast, --ease-default]
  component: "MD3 component-token tier --seg-btn-* (each with var(--md-sys-color-X, var(--color-X)) fallback); resolve via css/md-sys-bridge.css"

motion:
  enter: "none — always present (static view/mode switch)."
  exit: "none."
  stateChange: "State layers via color-mix per MD3 spec — unselected hover 8% / focus 12% / pressed 12% over on-surface; selected hover/focus/pressed 8%/12%/12% over the secondary-container. Selecting a segment flips background→--seg-btn-selected-container-color and weight 500→600 (transitions on background). Focus-visible: 2px --color-focus ring + 4px --color-focus-ring (kept alongside the focus state layer, per WCAG 2.4.7)."
  duration: "--duration-fast"
  easing: "--ease-default"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions neutralized to ~0). No component-specific override."
  constraints: "Only animate compositor-friendly effects (background/color/box-shadow state layers); no transform lift or moving-pill indicator. State-layer opacities are driven by the --seg-btn-* component tokens, not hardcoded."
  relatedPatterns: [state-layer]

source:
  css: css/components/segmented-button.css
  classes: [seg-btn-group, seg-btn, selected, seg-btn-group-sm, seg-btn-group-lg]
  react_wrapper: null
  docs_anchor: c-seg-btn
---

## Correct usage

```html
<!-- Single-select view switch — one segment always active -->
<div class="seg-btn-group" role="group" aria-label="Vista">
  <button type="button" class="seg-btn selected" aria-selected="true" onclick="segSwitch(this)">Lista</button>
  <button type="button" class="seg-btn" aria-selected="false" onclick="segSwitch(this)">Cuadrícula</button>
</div>
```
*Why:* mutually exclusive views, one active, aria-selected reflects state, role=group + aria-label name the choice.

```html
<!-- Icon-only segments with accessible names -->
<div class="seg-btn-group" role="group" aria-label="Vista">
  <button type="button" class="seg-btn selected" aria-selected="true" aria-label="Lista" onclick="segSwitch(this)"><svg width="18" height="18">…</svg></button>
  <button type="button" class="seg-btn" aria-selected="false" aria-label="Cuadrícula" onclick="segSwitch(this)"><svg width="18" height="18">…</svg></button>
</div>
```
*Why:* icon-only still exposes a name to screen readers via aria-label.

## Incorrect usage

```html
<!-- ✕ Used to navigate between sections -->
<div class="seg-btn-group" role="group"><button class="seg-btn selected">Vacantes</button><button class="seg-btn">Candidatos</button></div>
```
*Fix:* navigating between distinct sections is Tabs (or nav), not a segmented button.

```html
<!-- ✕ Stretched full-width like a form field -->
<div class="seg-btn-group" role="group" style="width:100%">…</div>
```
*Fix:* remove the width override; a segmented button has intrinsic content width.

```html
<!-- ✕ Seven dissimilar options -->
<div class="seg-btn-group" role="group"><button class="seg-btn">Todas</button>…<button class="seg-btn">Archivadas y vencidas</button></div>
```
*Fix:* more than 5 options or long labels → use Select.
