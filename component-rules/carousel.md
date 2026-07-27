---
id: carousel
display_name: Carousel
aliases: [slider, slideshow, gallery, coverflow]
category: Containment
status: stable
summary: A scroll-snapping, browsable set of homogeneous items (images or cards) with prev/next controls — for secondary content that doesn't fit in one row.
when_to_use:
  - "Browsing homogeneous visual items (images, cards) when horizontal space is limited."
  - "Secondary content the user optionally skims, not must-see content."
  - "When you always show prev/next controls and a peek of the next item."
when_not_to_use:
  - "Critical content the user must see → lay it out in full, not behind a scroll."
  - "Comparing options side by side → use a grid or Table."
  - "Primary navigation or the steps of a flow → use Tabs / dedicated screens (or a stepper/wizard)."
  - "A long vertical list → use List/Table."
use_cases:
  - "A row of related vacancy cards on a dashboard."
  - "A gallery of candidate portfolio images."
  - "A vertical set of highlights in a narrow panel (carousel-vertical)."

variants:
  - {name: single,     class: carousel-item,           purpose: "One item per slide — each slide fills the viewport width."}
  - {name: multi,      class: carousel-item-half,      purpose: "Two items per view (basis-1/2, minus the 16px gap); use a custom flex-basis for other fractions."}
  - {name: vertical,   class: carousel-vertical,       purpose: "Scroll-snaps on the Y axis with up/down controls (needs a bounded height)."}
  - {name: prev-btn,   class: carousel-btn-prev,       purpose: "Previous control; overlaps the left edge (top for vertical)."}
  - {name: next-btn,   class: carousel-btn-next,       purpose: "Next control; overlaps the right edge (bottom for vertical)."}
sizes:
  - {name: default, class: "(default)", use: "item width/height is content-driven; nav buttons are 32x32 rounded-full"}
size_selection: "Set how many items are visible via item flex-basis (basis-full mobile, basis-1/2+ desktop). Keep a legible card size — don't scale items proportionally to the viewport."

content_rules:
  - "Use for homogeneous items of similar shape — mixed content reads as clutter."
  - "Always leave a peek of the next item so users know it scrolls."
layout_constraints:
  - "Items live in .carousel-content (flex track, 16px gap, scroll-snap-type)."
  - "Prev/Next controls are always-visible overlays; they disable at the ends (no infinite loop)."
  - "Vertical carousels need a bounded height for snap to work."

states:
  default: "Native scroll-snap track; controls resting on --color-surface with --border + shadow."
  hover: "Nav button fills to --color-surface-variant on hover."
  focus: "Controls are real <button>s with a visible focus ring (secondary role, not primary)."
  disabled: "Nav button at an end is dimmed (opacity ~30%) and inert."

accessibility:
  roles: "Region with role=\"region\" + aria-roledescription=\"carousel\"; each slide is role=\"group\" ('ítem X de N')."
  aria: ["role=region + aria-roledescription=carousel on the wrapper", "role=group + label per slide", "aria-label on prev/next buttons"]
  focus: "Prev/Next are keyboard-operable (Tab, ←/→) and disable at the extremes; focus ring uses the secondary role and stays visible in both themes."
  contrast: "Nav button surface/border/icon tokens meet AA in light + dark."
keyboard:
  - {keys: "Tab", action: "focus the prev/next controls"}
  - {keys: "← / →", action: "move to the previous/next item (scrollBy)"}
responsive:
  - "basis-full on mobile, basis-1/2 or more on desktop; always show a peek of the next item."
  - "On touch, users swipe (native scroll); on desktop, the prev/next controls drive it."

ux_principles:
  - "Keep important content accessible outside the carousel too — carousels hide most of their content by default."
  - "If you add autoplay, pause on hover/focus and honor prefers-reduced-motion."
common_mistakes:
  - "Putting must-see or critical content in a carousel."
  - "Using it for sequential/required steps (that's a stepper/wizard)."
  - "No peek of the next item, so users don't realize it scrolls."
  - "Autoplay with no pause control or reduced-motion handling."
nielsen_heuristics:
  - {id: 3, name: "User control and freedom", note: "explicit prev/next; user paces the browsing, not autoplay"}
  - {id: 4, name: "Consistency and standards", note: "always-visible controls, disabled at the ends"}
  - {id: 8, name: "Aesthetic and minimalist design", note: "shows a subset without overwhelming the layout"}

relationships:
  related: [scroll-area, tabs, table, aspect-ratio]
  replaces: ["custom transform + drag-handler carousels"]
  composed_with: [card, aspect-ratio, item, button]
  not_to_confuse_with:
    - {component: tabs, why: "Tabs switch between distinct panels; Carousel browses one homogeneous collection"}
    - {component: scroll-area, why: "Scroll Area is free scroll; Carousel snaps to discrete items with controls"}
    - {component: table, why: "compare options in a grid/Table, not a carousel"}

tokens:
  color: [--color-surface, --border, --text-primary, --color-surface-variant]
  radius: [--radius-md, --radius-full]
  spacing: ["16px inter-item gap"]

source:
  css: css/components/carousel.css
  classes: [carousel, carousel-content, carousel-item, carousel-item-half, carousel-vertical, carousel-btn, carousel-btn-prev, carousel-btn-next]
  react_wrapper: components/ui/carousel.tsx
  docs_anchor: c-carousel
---

## Correct usage

```html
<!-- One item per slide with always-visible controls -->
<div class="carousel" style="max-width:384px">
  <div class="carousel-content">
    <div class="carousel-item">…slide 1…</div>
    <div class="carousel-item">…slide 2…</div>
  </div>
  <button class="carousel-btn carousel-btn-prev" aria-label="Anterior" onclick="carouselScroll(this,-1)">‹</button>
  <button class="carousel-btn carousel-btn-next" aria-label="Siguiente" onclick="carouselScroll(this,1)">›</button>
</div>
```
*Why:* homogeneous items, snap scroll, labelled controls that disable at the ends.

```html
<!-- Two items per view -->
<div class="carousel-item carousel-item-half">…card…</div>
```
*Why:* basis-1/2 shows two items with the shared 16px gap accounted for.

## Incorrect usage

```html
<!-- ✕ Required onboarding steps in a carousel -->
<div class="carousel"><div class="carousel-content">
  <div class="carousel-item">Paso 1</div><div class="carousel-item">Paso 2</div>
</div></div>
```
*Fix:* sequential steps belong in a stepper/wizard or Tabs, not a carousel.

```html
<!-- ✕ Comparing plans side by side in a carousel -->
<div class="carousel">…plan A…plan B…plan C…</div>
```
*Fix:* use a grid or Table so options are visible together.
