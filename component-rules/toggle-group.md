---
id: toggle-group
display_name: Toggle Group
aliases: [toggle set, format toggles, grouped toggles]
category: Actions
status: stable
summary: A set of related Toggles on one axis — multi-select (each independent) or single-select (choosing one deselects the rest); deliberately distinct from Segmented Button.

when_to_use:
  - "Grouping several related toggles on the same axis (text format: negrita / itálica / subrayado)."
  - "type=multiple — a set of on/off filters that share an axis and combine (0..N pressed)."
  - "type=single — choosing one value while keeping the button-toggle shape (alignment)."
when_not_to_use:
  - "Switching between labelled views with a pill shape → use Segmented Button."
  - "Tag-style filtering → use Chip."
  - "A single on/off preference with a label → use Switch."
  - "Plain related actions with no state → use Button Group."
use_cases:
  - "Rich-text formatting bar: bold / italic / underline (multiple)."
  - "Paragraph alignment: left / center / right (single)."
  - "A grouped set of on/off list filters that share one dimension."

variants:
  - {name: multiple, class: "toggle-group (togglePress per item)",       purpose: "Each item toggles independently; 0..N pressed at once."}
  - {name: single,   class: "toggle-group (selectSingleToggle per item)", purpose: "Exactly one item pressed; choosing another deselects the previous."}
sizes:
  - {name: inherited, class: "(from .toggle children)", use: "the group has no size of its own; size comes from the child toggle-sm / toggle / toggle-lg"}
size_selection: "Set the size on the child .toggle items and keep them uniform so the group reads evenly."

content_rules:
  - "Each item is a single icon or short label naming its own setting."
  - "Icon-only items MUST carry an aria-label."
  - "Group items that genuinely share one axis; don't mix unrelated toggles."
layout_constraints:
  - "Container is an inline flex row of individual .toggle items (no bordered group container — that shape is Segmented Button)."
  - "Shares only the selection color (--color-secondary-container) with Segmented Button; the shape is intentionally different."

states:
  default: "Each item inherits Toggle's resting state."
  hover: "Per item, Toggle's hover state layer."
  focus: "Per item, visible focus-visible ring (--color-focus + --color-focus-ring)."
  pressed: "aria-pressed=true on an item → filled secondary-container / on-secondary-container."
  disabled: "Per item, opacity 0.38, no pointer events."

accessibility:
  roles: "Container role=group + aria-label naming the axis; each item is a real <button> with aria-pressed."
  aria: ["role=group + aria-label (container)", "aria-pressed on each item", "aria-label on icon-only items"]
  focus: "Each item is focusable; in single mode exactly one item stays aria-pressed=true."
  contrast: "Pressed item fill/label pair meets AA in light + dark."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "move focus between items"}
  - {keys: "Space / Enter", action: "toggle (multiple) or select (single) the focused item"}
responsive:
  - "Keep item touch targets ≥ 44px on coarse pointers (use toggle-lg)."
  - "Wrap or scroll the row rather than shrinking items below the min target."

ux_principles:
  - "Proximity groups toggles that belong to the same axis, aiding scanning."
  - "Pressed fills make the active set/value obvious at a glance (visibility of system status)."
common_mistakes:
  - "Using it where a labelled pill view-switch is meant (that's Segmented Button)."
  - "Using it for tag filters (that's Chip)."
  - "Icon-only items without aria-label."
  - "In single mode, ending with zero or multiple items pressed."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "pressed items show which formats/value are active"}
  - {id: 4, name: "Consistency and standards", note: "shares the secondary-container selection color with Toggle and Chip"}
  - {id: 7, name: "Flexibility and efficiency of use", note: "multiple mode lets users combine settings in one place"}

relationships:
  related: [toggle, segmented-button, chip, button-group, switch]
  replaces: ["ad-hoc rows of on/off buttons"]
  composed_with: [toolbar, toggle]
  not_to_confuse_with:
    - {component: segmented-button, why: "segmented is a bordered pill view-switch (always 1 active, view labels); toggle-group is a row of button toggles (formats/filters)"}
    - {component: chip, why: "chips are tag-style filters below a search/toolbar; toggle-group toggles share one axis"}
    - {component: switch, why: "Switch is a single labelled on/off; toggle-group is a set"}

tokens:
  color: [--color-secondary-container, --color-on-secondary-container, --color-on-surface, --color-focus, --color-focus-ring]
  radius: [--radius-md]
  spacing: [--space-2]

motion:
  enter: "none — always present; the group is a flex layout wrapper only (gap between items)."
  exit: "none."
  stateChange: "The group declares no transition of its own. Each item is a .toggle, so all hover/pressed/focus motion is delegated to toggle.css (see toggle.md): hover state layer, aria-pressed background/color flip, focus ring."
  duration: "none of its own — items use --duration-fast (toggle.css)."
  easing: "none of its own — items use --ease-default (toggle.css)."
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css. No component-specific override; each Toggle collapses its own motion."
  constraints: "Motion belongs to the individual Toggle items, not the group container; do not add group-level animation."
  relatedPatterns: [state-layer]

source:
  css: css/components/toggle-group.css
  classes: [toggle-group, toggle]
  react_wrapper: components/ui/toggle-group.tsx
  docs_anchor: c-toggle-group
---

## Correct usage

```html
<!-- Multi-select — independent text-format toggles -->
<div class="toggle-group" role="group" aria-label="Formato de texto">
  <button type="button" class="toggle" aria-label="Negrita" aria-pressed="true" onclick="togglePress(this)"><svg>…</svg></button>
  <button type="button" class="toggle" aria-label="Itálica" aria-pressed="false" onclick="togglePress(this)"><svg>…</svg></button>
  <button type="button" class="toggle" aria-label="Subrayado" aria-pressed="false" onclick="togglePress(this)"><svg>…</svg></button>
</div>
```
*Why:* related toggles on one axis; each is an independent aria-pressed button; container labelled.

```html
<!-- Single-select — alignment, exactly one active -->
<div class="toggle-group" role="group" aria-label="Alineación">
  <button type="button" class="toggle" aria-label="Izquierda" aria-pressed="true" onclick="selectSingleToggle(this)"><svg>…</svg></button>
  <button type="button" class="toggle" aria-label="Centro" aria-pressed="false" onclick="selectSingleToggle(this)"><svg>…</svg></button>
  <button type="button" class="toggle" aria-label="Derecha" aria-pressed="false" onclick="selectSingleToggle(this)"><svg>…</svg></button>
</div>
```
*Why:* selectSingleToggle keeps exactly one item pressed while preserving the button-toggle shape.

## Incorrect usage

```html
<!-- ✕ Used as a labelled pill view-switch -->
<div class="toggle-group" role="group"><button class="toggle" aria-pressed="true">Lista</button><button class="toggle" aria-pressed="false">Cuadrícula</button></div>
```
*Fix:* a labelled 1-of-N view switch belongs in a Segmented Button (bordered pill).

```html
<!-- ✕ Icon-only items with no names -->
<div class="toggle-group" role="group" aria-label="Formato"><button class="toggle" aria-pressed="true"><svg>…</svg></button></div>
```
*Fix:* add `aria-label` to each icon-only item.
