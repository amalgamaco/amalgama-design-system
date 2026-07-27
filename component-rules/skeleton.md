---
id: skeleton
display_name: Skeleton
aliases: [placeholder, loading placeholder, shimmer, ghost]
category: Feedback
status: stable
summary: An animated shimmer placeholder that mimics the layout of content while data loads — for loads with a known structure, in place of ad-hoc spinners.
when_to_use:
  - "Initial load of content with a known structure (cards, lists, tables)."
  - "When the load takes longer than ~300ms."
  - "To reduce the 'flash' when data arrives in an already-visible section."
when_not_to_use:
  - "Very fast loads (< 300ms) → a spinner (Loading) is enough."
  - "Content whose structure is unknown ahead of time → use a spinner."
  - "No data at all (empty result) → use Empty State."
  - "An error while loading → show an error state, not an endless skeleton."
  - "Buttons or UI controls → do not skeleton interactive chrome."
use_cases:
  - "Vacancy list loading — several skeleton rows matching the real card layout."
  - "Candidate profile header loading — title + text lines + circle avatar."
  - "Dashboard cards loading — skeleton-card blocks."

variants:
  - {name: text,   class: skeleton-text,   purpose: "A line of body text (14px tall)."}
  - {name: title,  class: skeleton-title,  purpose: "A heading (22px tall, 60% width)."}
  - {name: card,   class: skeleton-card,   purpose: "A block / card body (80px tall)."}
  - {name: circle, class: skeleton-circle, purpose: "Round placeholder for an avatar/icon (40px). Alias: skeleton-avatar."}
sizes:
  - {name: default, class: "(default)", use: "each variant carries its own height; tune width inline (e.g. style=\"width:80%\") to mimic real content"}
size_selection: "Pick the variant that matches the real element (title/text/card/circle); vary line widths inline so the placeholder reads like real content, not identical bars."

content_rules:
  - "The skeleton holds no text — it is a shimmering shape."
  - "Mirror the real content's structure and proportions faithfully; do not use wildly different dimensions."
layout_constraints:
  - "Show multiple rows/cards when the real content is a list."
  - "Do not leave a skeleton visible indefinitely if the load fails — swap to an error state."

states:
  default: "Shimmer — a 90deg gradient sweeping across the block on a 1.5s infinite loop (background-size 200% 100%). The skeleton defines no hover/focus/active — it is decorative."

accessibility:
  roles: "Decorative placeholder — not focusable, not a control."
  aria: ["aria-hidden=\"true\" on the skeleton shapes (noise for screen readers)", "aria-busy=\"true\" on the loading container (removed when data arrives)", "aria-label=\"Cargando…\" on the wrapper"]
  focus: "Never receives focus; skeleton.css defines no focus/interaction states."
  contrast: "The shimmer uses surface tokens (--color-surface-variant, --color-surface-container-highest) that recalibrate in dark mode — never write per-theme overrides. Do not block interaction with the rest of the UI while the skeleton shows."

ux_principles:
  - "A structural placeholder improves perceived performance vs. a bare spinner (visibility of system status)."
  - "Matching the real layout avoids a jarring reflow when content swaps in."
common_mistakes:
  - "Leaving a skeleton up forever on a failed load instead of showing an error."
  - "Skeletoning buttons or interactive controls."
  - "Skeleton dimensions that don't match the real content."
  - "Pairing a skeleton with a spinner — pick one per context."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "the shimmer tells the user content is on its way"}
  - {id: 4, name: "Consistency and standards", note: "one loading treatment across cards/lists/tables"}

relationships:
  related: [empty-state, progress, avatar]
  replaces: ["custom spinners/loaders for structured content"]
  composed_with: [card, item, list, table, charts]
  not_to_confuse_with:
    - {component: empty-state, why: "Empty State = no data exists; Skeleton = data is loading"}
    - {component: progress, why: "Progress/Spinner shows indeterminate or measured progress; Skeleton mimics the awaited layout"}

tokens:
  color: [--color-surface-variant, --color-surface-container-highest]
  radius: [--radius-md, --radius-full]
  motion: ["shimmer 1.5s infinite (background-size 200% 100%)"]

source:
  css: css/components/skeleton.css
  classes: [skeleton, skeleton-text, skeleton-title, skeleton-card, skeleton-circle, skeleton-avatar]
  react_wrapper: components/ui/skeleton.tsx
  docs_anchor: c-skeleton
---

## Correct usage

```html
<!-- Structured placeholder mirroring the real card layout -->
<div aria-busy="true" aria-label="Cargando">
  <div class="skeleton skeleton-title"></div>
  <div class="skeleton skeleton-text" style="width:100%"></div>
  <div class="skeleton skeleton-text" style="width:85%"></div>
  <div class="skeleton skeleton-card"></div>
</div>
```
*Why:* varied widths + matching structure read like the content that is loading.

```html
<!-- List row with a circle avatar placeholder -->
<div style="display:flex;gap:12px" aria-hidden="true">
  <div class="skeleton skeleton-circle"></div>
  <div style="flex:1"><div class="skeleton skeleton-text" style="width:50%"></div></div>
</div>
```

## Incorrect usage

```html
<!-- ✕ Skeleton shown when there is simply no data -->
<div class="skeleton skeleton-card"></div>
```
*Fix:* if the list is empty, show an Empty State, not a skeleton.

```html
<!-- ✕ Skeletoning a button -->
<div class="skeleton" style="width:120px;height:40px"></div>
```
*Fix:* don't skeleton interactive controls; skeleton content regions only.
