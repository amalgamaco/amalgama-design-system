---
id: back-link
display_name: Back Link
aliases: [volver, atrás, return link, "‹ Volver"]
category: Navigation
status: stable
summary: A quiet inline link with a leading chevron that returns to the parent view from a detail page — one step up, never a general-purpose action.

when_to_use:
  - "Top of a detail page, returning to the list it was opened from ('Volver a vacantes')."
  - "Any view reached from exactly one obvious parent, where naming that parent is clearer than a breadcrumb trail."
when_not_to_use:
  - "Main navigation between sections → sidebar or Tabs."
  - "An action of any kind (cancel, discard, close) → Button. This looks like a link because it navigates; a cancel is not navigation."
  - "Depth of three or more, or several possible parents → Breadcrumb, which shows the whole trail."
  - "Closing an overlay → the Dialog or Sheet's own dismissal, never a back link inside it."
use_cases:
  - "A vacancy detail page under the vacancies list."
  - "A candidate profile opened from a search result."

variants:
  - {name: default, class: back-link, purpose: "The only variant — muted text, 16px leading chevron, darkens on hover."}
sizes:
  - {name: md, class: "(default)", use: "the only size; --font-size-body-md with a 16px icon."}
size_selection: "Single size by design. It is deliberately quiet and does not scale up."

content_rules:
  - "**Name the destination**: 'Volver a vacantes', not 'Volver' and never '‹' alone. The word after 'Volver' is what makes it worth a click."
  - "The destination is written the way it appears in the navigation, so the person recognises where they are going."
  - "One line, sentence case, with the chevron always leading."
layout_constraints:
  - "Sits at the top-left of the content column, above the Page Header — never inside it, never beside the title."
  - "One per view. Two back links means the hierarchy is unclear."
  - "It is a `<button>` when it pops client-side history and an `<a>` when it navigates to a real URL. Both keep this class."

states:
  default: "--text-secondary with the chevron, quiet against the page."
  hover: "Darkens to --text-primary. No underline — the chevron already signals affordance."
  focus: "2px --color-focus outline at 2px offset, plus a 4px --color-focus-ring halo."

accessibility:
  roles: "A real <button> or <a>. Never a styled <div> — this is a navigation control and must be reachable."
  aria: ["The visible text is the accessible name; it already names the destination, so no aria-label is needed", "The chevron SVG carries aria-hidden=true"]
  focus: "Visible focus ring, never removed. It is usually the first focusable element on the page, so its ring matters more than most."
  contrast: "--text-secondary on the page background meets AA in both themes; hover raises it further."
keyboard:
  - {keys: "Tab", action: "reaches it — typically first in the view"}
  - {keys: "Enter / Space", action: "navigates (Space only when it is a <button>)"}
responsive:
  - "Unchanged on mobile. It matters more there: with the sidebar collapsed behind a drawer, this is often the only visible way up."

ux_principles:
  - "A named destination is recognised; a bare arrow has to be recalled (Nielsen 6)."
  - "One clearly marked way back is the 'emergency exit' for a person who opened the wrong record (Nielsen 3)."
common_mistakes:
  - "Writing just 'Volver' — the destination is the useful half."
  - "Using it as Cancel on a form. Cancel discards work and belongs to a button; back navigates."
  - "Putting it inside the Page Header, competing with the title."
  - "Using it at depth 3+ where the person needs the whole trail — that is a Breadcrumb."
  - "Rendering it as a <div> with a click handler, so keyboard users cannot reach it."
nielsen_heuristics:
  - {id: 3, name: "User control and freedom", note: "a marked exit from a view opened by mistake"}
  - {id: 6, name: "Recognition rather than recall", note: "naming the parent beats an unlabelled arrow"}
  - {id: 1, name: "Visibility of system status", note: "states where you are by stating where you came from"}

relationships:
  related: [breadcrumb, page-header, tabs]
  replaces: ["ad-hoc '‹ Volver' links"]
  composed_with: [page-header]
  not_to_confuse_with:
    - {component: breadcrumb, why: "breadcrumb shows the whole trail and suits depth ≥2; back-link is one step to one known parent"}
    - {component: button, why: "a back link navigates; cancel, discard and close act on data or on an overlay"}
    - {component: tabs, why: "tabs switch between sibling views; this goes up a level"}

tokens:
  color: [--text-secondary, --text-primary, --color-focus, --color-focus-ring]
  spacing: ["6px gap", "6px margin-bottom"]
  typography: [--font-size-body-md]

motion:
  enter: "none — present with the page."
  exit: "none."
  stateChange: "colour transitions on --duration-fast on hover; nothing moves."
  duration: "--duration-fast"
  easing: "--ease-default"
  reducedMotion: "Inherits the global rule in css/base.css. A colour transition is not motion, so nothing is suppressed."
  constraints: "Never slide the chevron on hover. The only approved hover transform in Embassy is translateY(-1px), and it is not for this."
  relatedPatterns: []

source:
  css: css/components/back-link.css
  classes: [back-link]
  docs_anchor: c-back-link
---

## Correct usage

```html
<button class="back-link">
  <svg width="16" height="16" aria-hidden="true"><!-- lucide chevron-left --></svg>
  Volver a vacantes
</button>
```
*Why:* names the destination, real button, chevron hidden from screen readers.

## Incorrect usage

```html
<!-- ✕ Unnamed destination, and not focusable -->
<div class="back-link" onclick="history.back()">‹ Volver</div>
```
*Fix:* `<button class="back-link">` and name the parent — 'Volver a vacantes'.

```html
<!-- ✕ Used as Cancel on a create form -->
<button class="back-link">Volver</button>
```
*Fix:* discarding work is an action — `btn-tertiary` labelled 'Cancelar', in the `create-footer`.
