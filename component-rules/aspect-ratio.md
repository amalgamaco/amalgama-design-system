---
id: aspect-ratio
display_name: Aspect Ratio
aliases: [ratio, media box, intrinsic ratio, embed wrapper]
category: Layout
status: stable
summary: A layout primitive that locks content to a fixed width:height ratio while the width stays fluid — for media, thumbnails, and embeds.
when_to_use:
  - "Thumbnails, video, or card cover images whose width is fluid but whose shape must stay constant."
  - "Preventing layout shift while a media asset loads."
  - "Embeds (maps, players, iframes) that must keep a proportion in a responsive grid."
when_not_to_use:
  - "Content whose height depends on its text → let it size naturally, no ratio box."
  - "A fixed-pixel media box that never reflows → set width/height directly."
  - "A person's photo circle → use Avatar (it is already a fixed square/circle)."
use_cases:
  - "16:9 cover image on a vacancy card."
  - "1:1 thumbnail in a candidate gallery."
  - "4:3 embedded map/preview in a detail panel."

variants:
  - {name: ratio, class: "(inline style: aspect-ratio: W / H)", purpose: "Any width:height ratio via the CSS aspect-ratio property — 16/9, 1/1, 4/3, etc. No dedicated class."}
sizes:
  - {name: default, class: "(no size scale)", use: "the box takes its width from the parent; height is derived from the ratio"}
size_selection: "Pick the ratio, not a size: set aspect-ratio on the container and let it fill the available width. Constrain with max-width where needed."

content_rules:
  - "The single child fills the box — use object-fit:cover on images so they crop rather than distort."
layout_constraints:
  - "It is a layout utility, not a styled component — there is NO css/components/aspect-ratio.css; it is a div with the CSS aspect-ratio property."
  - "One child that fills 100% width/height; apply border-radius on the media, not the wrapper, if you want rounded corners."
  - "Do not put text-driven content inside — its height would fight the ratio."

states:
  default: "Static container that maintains its width:height ratio; no interactive states."

accessibility:
  roles: "Presentational wrapper — no role of its own. The media inside carries the semantics (img needs alt; decorative img gets alt=\"\")."
  aria: ["alt on an <img> child (empty alt if purely decorative)"]
  focus: "Not focusable; if it wraps an interactive embed, that embed owns focus."
  contrast: "N/A — it draws nothing itself."

ux_principles:
  - "Reserving the media's space up front avoids layout shift as assets load (visibility of system status / stable layout)."
common_mistakes:
  - "Wrapping text content whose height must grow."
  - "Stretching an image without object-fit:cover, so it distorts."
  - "Reaching for a component/import — it is just the aspect-ratio CSS property."
nielsen_heuristics:
  - {id: 8, name: "Aesthetic and minimalist design", note: "consistent media proportions keep grids tidy"}
  - {id: 1, name: "Visibility of system status", note: "reserved space prevents jarring reflow while media loads"}

relationships:
  related: [card, carousel, skeleton, avatar]
  replaces: ["padding-bottom percentage hacks for intrinsic ratio boxes"]
  composed_with: [card, carousel, item]
  not_to_confuse_with:
    - {component: avatar, why: "Avatar is a fixed person circle; Aspect Ratio is a fluid-width media box"}
    - {component: skeleton, why: "Skeleton is the loading placeholder; Aspect Ratio reserves the final media's shape"}

tokens:
  radius: ["--radius-lg (applied to the media child, optional)"]

source:
  css: "layout primitive — no dedicated css/components file; uses the native CSS aspect-ratio property"
  classes: []
  react_wrapper: null
  docs_anchor: c-aspect-ratio
---

## Correct usage

```html
<!-- 16:9 cover image, fluid width, no layout shift -->
<div style="aspect-ratio: 16 / 9">
  <img src="/cover.jpg" alt="Oficina del equipo de diseño"
       style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-lg)">
</div>
```
*Why:* the box reserves the shape; object-fit:cover crops instead of distorting.

```html
<!-- 1:1 thumbnail in a gallery grid -->
<div style="aspect-ratio: 1 / 1;max-width:10rem">
  <img src="/thumb.jpg" alt="" style="width:100%;height:100%;object-fit:cover">
</div>
```
*Why:* decorative thumbnail keeps a square regardless of column width.

## Incorrect usage

```html
<!-- ✕ Text content forced into a ratio box -->
<div style="aspect-ratio: 16 / 9"><p>Descripción larga de la vacante…</p></div>
```
*Fix:* let text-driven blocks size to their content; reserve aspect-ratio for media.

```html
<!-- ✕ Image without object-fit, distorting to fill -->
<div style="aspect-ratio: 16 / 9"><img src="/cover.jpg" style="width:100%;height:100%"></div>
```
*Fix:* add `object-fit:cover` so the image crops to the ratio.
