---
id: button-group
display_name: Button Group
aliases: [btn-group, joined buttons, split button, input addon]
category: Actions
status: stable
summary: A container that visually joins related buttons (or an input + addon) into one unit by collapsing shared borders and radii — it carries no selection state of its own.

when_to_use:
  - "Grouping related actions of the same weight into one visual unit (an action paginator, a split button)."
  - "An input paired with a button or a text addon (e.g. an 'https://' prefix)."
  - "A split button: a primary action plus a secondary trigger separated by button-group-separator."
when_not_to_use:
  - "Choosing 1 of N with persistent state and view labels → use Segmented Button."
  - "Grouped independent on/off toggles (bold/italic) or single-select toggles → use Toggle Group."
  - "A single standalone action → use Button."
  - "Actions that need real hierarchy (one primary + subordinate) laid out normally → use spaced Buttons, not a joined group."
use_cases:
  - "Range paginator: 'Día' / 'Semana' / 'Mes' as joined tertiary buttons."
  - "Split save button: 'Guardar' + a dropdown trigger with a separator."
  - "Input with a text addon: 'https://' + a URL field."
  - "Vertical icon-button stack (up / down reordering)."

variants:
  - {name: horizontal, class: "button-group (default)",        purpose: "Buttons joined left-to-right; inner radii/borders collapse."}
  - {name: vertical,   class: button-group-vertical,           purpose: "Buttons stacked; top/bottom radii/borders collapse."}
  - {name: text-addon, class: button-group-text,               purpose: "A neutral prefix/suffix chip (surface-variant surface + border) joined to an input or button."}
  - {name: separator,  class: button-group-separator,          purpose: "A 1px divider between sub-groups — used in split buttons."}
sizes:
  - {name: inherited, class: "(from children)", use: "the group has no size of its own; size comes from the child btn-* / icon-btn classes"}
size_selection: "Set size on the child buttons (e.g. btn-sm); keep every child in the group the same size so the joined unit reads evenly."

content_rules:
  - "All members should be the same button variant and size, so the group reads as one control."
  - "Icon-only members inside the group still need an aria-label."
  - "Keep the group to genuinely related actions — don't join unrelated buttons just to save space."
layout_constraints:
  - "width: fit-content — the group is intrinsic-width, not stretched."
  - "Children lose their adjacent radius and border; do not re-add per-child border-radius overrides."
  - "A split button pairs one action with a trigger via button-group-separator, not two equal primaries."

states:
  default: "Children render in their own variant's resting state; inner edges share a single border."
  focus: "The focused child raises above its neighbors (position:relative; z-index:1) so its focus ring is not clipped."
  hover: "Per child, inherited from the button variant."
  disabled: "Per child, inherited from the button variant."

accessibility:
  roles: "Container carries role=group with an aria-label describing the set; members are native <button> (or an <input>) elements."
  aria: ["role=group + aria-label on the container", "aria-label on icon-only members"]
  focus: "Each child is individually focusable in DOM order; the focused child's ring is lifted with z-index so it is never clipped by a neighbor."
  contrast: "Inherited from the child button/ input tokens; the container adds no color of its own except button-group-text (surface-variant / on-surface)."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "move focus between members"}
  - {keys: "Enter / Space", action: "activate the focused member"}
responsive:
  - "Switch to button-group-vertical on narrow widths rather than shrinking members below the min touch target."
  - "Keep child touch targets ≥ 44px on coarse pointers."

ux_principles:
  - "Physical grouping signals that the actions belong together (law of proximity / common region)."
  - "A split button keeps the common action one tap away while tucking variants behind the trigger (efficiency of use)."
common_mistakes:
  - "Using it to pick 1 of N with state (that's Segmented Button / Toggle Group)."
  - "Joining two equal-weight primaries instead of establishing hierarchy."
  - "Mixing variants/sizes so the joined unit looks broken."
  - "Re-adding border-radius on children and defeating the joined look."
  - "Omitting the container aria-label."
nielsen_heuristics:
  - {id: 4, name: "Consistency and standards", note: "joined same-variant buttons read as one familiar control"}
  - {id: 7, name: "Flexibility and efficiency of use", note: "split button surfaces the common action, hides the rest"}
  - {id: 8, name: "Aesthetic and minimalist design", note: "shared borders reduce visual noise for related actions"}

relationships:
  related: [button, segmented-button, toggle-group, input]
  replaces: ["rows of adjacent buttons with hand-tuned radius overrides"]
  composed_with: [button, input, toolbar]
  not_to_confuse_with:
    - {component: segmented-button, why: "segmented picks 1 of N with persistent selected state; button group has no selection"}
    - {component: toggle-group, why: "toggle-group holds stateful on/off toggles; button group holds plain actions"}

tokens:
  color: [--color-surface-variant, --color-on-surface, --color-outline, --color-border]
  radius: "--radius-* inherited from the child buttons; inner corners collapse to 0"
  spacing: "children share a single 1px border (no gap between joined members)"

motion:
  enter: "none — always present; the group is a layout wrapper only (joins children by collapsing inner radii/borders)."
  exit: "none."
  stateChange: "The group itself declares no transition — on focus-visible a child is raised via z-index: 1 (no animated property). All hover/press/focus motion is delegated to the child controls (see button.css → button.md: hover lift, press layer, focus ring)."
  duration: "none of its own — inherits --duration-fast from the child buttons."
  easing: "none of its own — inherits --ease-default from the child buttons."
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css. No component-specific override; children collapse their own motion."
  constraints: "Never animate the radius/border collapse that joins members — it is a static structural style. Motion belongs to the child buttons, not the group."
  relatedPatterns: [state-layer]

source:
  css: css/components/button-group.css
  classes: [button-group, button-group-vertical, button-group-text, button-group-separator]
  react_wrapper: null
  docs_anchor: c-button-group
---

## Correct usage

```html
<!-- Joined range paginator — same variant + size, container labelled -->
<div class="button-group" role="group" aria-label="Rango">
  <button class="btn-tertiary btn-sm" type="button">Día</button>
  <button class="btn-tertiary btn-sm" type="button">Semana</button>
  <button class="btn-tertiary btn-sm" type="button">Mes</button>
</div>
```
*Why:* related same-weight actions joined into one unit; role=group + aria-label name the set.

```html
<!-- Input with a text addon -->
<div class="button-group">
  <span class="button-group-text">https://</span>
  <input class="field-input" placeholder="tu-sitio.com">
</div>
```
*Why:* the addon and field read as a single control; the addon uses surface-variant tokens, no hex.

```html
<!-- Split button — primary action + trigger, divided by a separator -->
<div class="button-group" role="group" aria-label="Guardar">
  <button class="btn-primary btn-sm" type="button">Guardar</button>
  <span class="button-group-separator"></span>
  <button class="btn-primary btn-sm icon-btn" type="button" aria-label="Más opciones de guardado"><svg>…</svg></button>
</div>
```
*Why:* one action plus a subordinate trigger, not two equal primaries.

## Incorrect usage

```html
<!-- ✕ Using a button group to pick a stateful view -->
<div class="button-group"><button class="btn-tertiary">Lista</button><button class="btn-tertiary">Cuadrícula</button></div>
```
*Fix:* a 1-of-N view switch with a selected state is a Segmented Button.

```html
<!-- ✕ Mixed variants defeating the joined unit -->
<div class="button-group"><button class="btn-primary">Guardar</button><button class="btn-text btn-lg">Cancelar</button></div>
```
*Fix:* keep members the same variant/size; if you need hierarchy, use spaced standalone buttons instead.
