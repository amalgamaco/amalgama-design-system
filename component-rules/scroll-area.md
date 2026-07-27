---
id: scroll-area
display_name: Scroll Area
aliases: [scroll container, scrollbar, overflow region]
category: Layout
status: stable
summary: A scroll container with a discreet, consistent custom scrollbar — pure CSS, for overflow regions inside a panel, menu, or sheet.
when_to_use:
  - "A region that scrolls and wants a consistent, discreet scrollbar (long list inside a panel, menu, or sheet body)."
  - "Constraining overflow to an inner region while the page itself stays fixed."
when_not_to_use:
  - "The whole-page/document scroll → let the browser handle it; do not wrap it."
  - "A short region that never overflows → no scroll container needed."
  - "Horizontally scrolling a table → use the .table-scroll wrapper (table.css)."
use_cases:
  - "A candidate list inside a fixed-height side panel."
  - "The scrollable body of a dropdown menu or sheet."
  - "A horizontal row of category cards (content in a max-content row)."

variants:
  - {name: base, class: scroll-area, purpose: "The single class — styles the native scrollbar (thin, --color-outline thumb) over an overflow:auto container."}
sizes:
  - {name: default, class: "(default)", use: "single implementation; you set height/width inline and the container scrolls"}
size_selection: "No size scale. Define an explicit max-height/height (and width for horizontal scroll); overflow:auto does the rest."

content_rules:
  - "For horizontal scroll, lay the content out in a row with width:max-content."
layout_constraints:
  - "Must have a bounded height (or width) for scrolling to engage — set it inline or via a parent."
  - "overscroll-behavior is contained so scroll doesn't chain to the page."
  - "Do not wrap the page's natural scroll."

states:
  default: "overflow:auto with a thin, tokenized scrollbar (transparent track, --color-outline thumb)."
  hover: "The webkit scrollbar thumb darkens to full --color-outline on hover."

accessibility:
  roles: "A plain scrollable region; add role/label only if it is a distinct landmark. Keep it keyboard-scrollable (a focusable child or tabindex if it holds no focusable content)."
  aria: ["aria-label if the region is a meaningful named landmark"]
  focus: "Content inside stays in natural tab order; the region scrolls into view as focus moves."
  contrast: "The thumb derives from --color-outline (a color-mix at rest) and recalibrates per theme."
keyboard:
  - {keys: "Arrow keys / PageUp / PageDown", action: "scroll when the region or a child is focused"}
responsive:
  - "Keep the scrollbar usable on touch (native momentum scroll works; the custom style is cosmetic)."
  - "Firefox uses scrollbar-width/scrollbar-color; Chromium/WebKit uses ::-webkit-scrollbar rules — both are covered."

ux_principles:
  - "A discreet, consistent scrollbar keeps overflow legible without stealing attention (aesthetic and minimalist design)."
  - "Contained overscroll prevents surprising scroll chaining to the page behind a panel."
common_mistakes:
  - "Wrapping the whole-page scroll in a scroll-area."
  - "Forgetting to bound the height, so nothing ever scrolls."
  - "Using it for table horizontal overflow instead of .table-scroll."
nielsen_heuristics:
  - {id: 4, name: "Consistency and standards", note: "one scrollbar treatment across browsers and panels"}

relationships:
  related: [list, sheet, dropdown-menu, table]
  replaces: ["the default browser scrollbar inside panels/menus"]
  composed_with: [list, sheet, dropdown-menu, popover, card]
  not_to_confuse_with:
    - {component: carousel, why: "Carousel is snap-scrolling of discrete items with prev/next; Scroll Area is a free-scroll region"}
    - {component: table, why: "table horizontal overflow uses .table-scroll, not scroll-area"}

tokens:
  color: [--color-outline]
  radius: [--radius-full]

motion:
  enter: "none — a static scroll container; content scrolls via native browser behavior."
  exit: "none"
  stateChange: "The WebKit scrollbar thumb changes color on hover (from color-mix outline 60% to solid --color-outline) with no declared transition (instant). Scrolling itself is native and not driven by any CSS animation."
  duration: "none — scroll-area.css declares no motion tokens"
  easing: "none"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). Native scrolling continues to honor the user's OS/browser scroll settings; the thumb color change is already instant."
  constraints: "Don't add scroll-behavior:smooth or a custom scroll-animation engine — it would fight native scrolling and the reduced-motion preference. Thumb feedback stays a color change only; never animate the scrollbar size/layout."
  relatedPatterns: ["No entrance/exit motion — native scroll respects OS reduced-motion settings", "Feedback — thumb color on hover (effect)"]

source:
  css: css/components/scroll-area.css
  classes: [scroll-area]
  react_wrapper: components/ui/scroll-area.tsx
  docs_anchor: c-scroll-area
---

## Correct usage

```html
<!-- Bounded-height vertical scroll region -->
<div class="scroll-area" style="height:10rem;width:16rem;border-radius:var(--radius-md);border:1px solid var(--border)">
  <div style="padding:12px">…lista larga de candidatos…</div>
</div>
```
*Why:* explicit height engages the scroll; the scrollbar is consistent and discreet.

```html
<!-- Horizontal scroll: content in a max-content row -->
<div class="scroll-area" style="width:26rem">
  <div style="display:flex;gap:10px;width:max-content;padding:12px">…tarjetas…</div>
</div>
```
*Why:* a max-content row overflows on X so the X scrollbar appears.

## Incorrect usage

```html
<!-- ✕ Wrapping the page's own scroll -->
<body><div class="scroll-area">…toda la página…</div></body>
```
*Fix:* let the document scroll natively; use scroll-area only for inner regions.

```html
<!-- ✕ No bounded size, so it never scrolls -->
<div class="scroll-area">…contenido largo…</div>
```
*Fix:* give it a max-height (and width for horizontal scroll).
