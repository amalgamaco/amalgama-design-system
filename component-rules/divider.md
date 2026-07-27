---
id: divider
display_name: Divider
aliases: [separator, rule, hr, line]
category: Containment
status: stable
summary: A 1px line that separates groups of equal-hierarchy content — the lightest separation in the system, no brand color, no elevation.
when_to_use:
  - "Separating logical groups within a list, card, or layout."
  - "Dividing sections of equal hierarchy."
  - "Reinforcing grouping alongside a heading or spacing (not on its own)."
when_not_to_use:
  - "Creating spacing/whitespace → use --space-* with margin/gap, not a divider."
  - "Framing or boxing content → use a Card."
  - "Decorative filler → remove it; the divider is not ornament."
  - "Stacking several rules to add weight → use spacing between groups instead."
use_cases:
  - "Between the header and body of a card."
  - "Between grouped rows in a list of candidates."
  - "Vertical rule between inline actions in a toolbar."

variants:
  - {name: full-width, class: divider,          purpose: "Edge-to-edge line; separates unrelated sections or equal-hierarchy groups."}
  - {name: inset,      class: divider-inset,    purpose: "16px left indent so the line aligns with item text after a leading icon/avatar."}
  - {name: vertical,   class: divider-vertical, purpose: "1px vertical rule that stretches to the container height for inline divisions."}
sizes:
  - {name: default, class: "(default)", use: "single size — 1px line; the only dimension. Density comes from surrounding spacing."}
size_selection: "No size scale. Keep ~8px (--space-2) of breathing room above/below between groups."

content_rules:
  - "The divider holds no content — it is a bare line."
layout_constraints:
  - "One divider between groups; never stack multiple."
  - "Do not mix inset and full-width within the same group."
  - "Inset indent must match where the item text starts (after the leading media)."

states:
  default: "Static 1px line in --border (--color-outline-variant); recalibrates in dark mode automatically. The divider has no interactive states."

accessibility:
  roles: "Decorative divider (the common case) can be a bare <div> with no role. A semantically meaningful separator uses <hr class=\"divider\"> (implicit role=separator) or role=\"separator\" + aria-orientation on the div."
  aria: ["role=separator (only when semantically meaningful)", "aria-orientation=vertical on the vertical variant"]
  focus: "Not focusable; never interactive."
  contrast: "1px line derives from --border, calibrated for both themes; do not rely on the divider alone to convey grouping — reinforce with headings/spacing."

ux_principles:
  - "Grouping should be carried mainly by proximity and headings; the divider is a light reinforcement, not the primary signal (law of proximity)."
common_mistakes:
  - "Using a divider to create spacing instead of --space-* margins/gaps."
  - "Stacking multiple dividers."
  - "Boxing content with dividers instead of using a Card."
  - "Mixing inset and full-width dividers inside one group."
nielsen_heuristics:
  - {id: 8, name: "Aesthetic and minimalist design", note: "the lightest possible separation — no brand color or elevation added"}

relationships:
  related: [list, card, item, toolbar]
  replaces: ["unstyled <hr> / ad-hoc CSS borders between sections"]
  composed_with: [list, card, item, dropdown-menu, toolbar]
  not_to_confuse_with:
    - {component: card, why: "a Card frames/contains content; a Divider only draws a separating line"}

tokens:
  color: [--border]
  spacing: [--space-2]

motion:
  enter: "none — a static separator line."
  exit: "none"
  stateChange: "none — divider.css declares no transitions, states, or animations."
  duration: "none"
  easing: "none"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). No component-specific behavior — a divider never moves."
  constraints: "Never animate a divider; it is a purely static structural line. Its job is separation, which motion cannot improve."
  relatedPatterns: ["No motion — static structural element"]

source:
  css: css/components/divider.css
  classes: [divider, divider-inset, divider-vertical]
  react_wrapper: null
  docs_anchor: c-divider
---

## Correct usage

```html
<!-- Separate equal-hierarchy sections -->
<div>Sección A</div>
<div class="divider"></div>
<div>Sección B</div>
```
*Why:* one full-width rule between unrelated groups.

```html
<!-- Inset divider aligned to item text (after a leading avatar) -->
<div class="divider divider-inset"></div>
```
*Why:* the indent lines the rule up with the text, not the avatar.

```html
<!-- Vertical rule between inline actions -->
<div class="divider divider-vertical" role="separator" aria-orientation="vertical"></div>
```

## Incorrect usage

```html
<!-- ✕ Stacked dividers to add visual weight -->
<div class="divider"></div>
<div class="divider"></div>
```
*Fix:* use a single divider and add spacing with `--space-*`.

```html
<!-- ✕ Divider used to box content -->
<div class="divider"></div><div>Contenido</div><div class="divider"></div>
```
*Fix:* wrap the content in a `card` if it needs a frame.
