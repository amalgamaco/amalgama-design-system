---
id: breadcrumb
display_name: Breadcrumb
aliases: [breadcrumbs, location trail, path]
category: Navigation
status: stable
summary: A hierarchy trail showing where the user is and letting them jump back to an ancestor.

when_to_use:
  - "Showing location within a hierarchy of 2+ levels."
  - "Letting the user return quickly to an ancestor category."
when_not_to_use:
  - "A single 'back' action → use Back Link."
  - "Primary navigation between sections → use Navigation."
  - "A flat structure with no hierarchy → no breadcrumb needed."
use_cases:
  - "Inicio / Vacantes / Product Designer (on a vacancy detail page)."
  - "A deep settings hierarchy where the user jumps back to a parent."

variants:
  - {name: link,      class: breadcrumb-link,      purpose: "A navigable ancestor link."}
  - {name: page,      class: breadcrumb-page,      purpose: "The current page — bold, not a link, aria-current=page."}
  - {name: separator, class: breadcrumb-separator, purpose: "Visual divider between items; aria-hidden. Accepts a custom glyph/chevron."}
  - {name: ellipsis,  class: breadcrumb-ellipsis,  purpose: "Collapsed middle ancestors; as a <span> or a <button> opening an ancestor menu."}
sizes:
  - {name: default, class: "(default)", use: "single size; body-sm text"}
size_selection: "One size; the trail stays compact above the page title."

content_rules:
  - "Order from root to current: Inicio → … → current page."
  - "The current page is the last item, bold, and not a link."
  - "For long trails, collapse the middle with an ellipsis (keep root + immediate ancestors + current)."
layout_constraints:
  - "Structure: nav.breadcrumb > ol.breadcrumb-list > li.breadcrumb-item, with li.breadcrumb-separator between items."
  - "Separators are aria-hidden and can carry a custom glyph or chevron."

states:
  default: "Links inherit the trail's secondary text color."
  hover: "breadcrumb-link:hover → --color-primary + underline."
  focus: "breadcrumb-link:focus-visible → 2px --color-focus outline + offset."
  current: "breadcrumb-page: bold, --text-primary, not focusable."
  disabled: "N/A."

accessibility:
  roles: "nav[aria-label=breadcrumb] wrapping a semantic <ol>; the current page uses aria-current=page and is not a link."
  aria: ["aria-label=breadcrumb on the nav", "aria-current=page on the current item", "aria-hidden on separators", "aria-haspopup=menu + aria-expanded + aria-label on an ellipsis button; role=menu/menuitem in its panel"]
  focus: "Navigable links show :focus-visible; the current page (breadcrumb-page) is not focusable."
  contrast: "Consumes only semantic --color-* / --font-size-* tokens → AA in light + dark, no per-theme overrides."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "move between ancestor links (and the ellipsis button)"}
  - {keys: "Enter", action: "follow the focused ancestor link / open the ellipsis menu"}
responsive:
  - "The list wraps (flex-wrap) on narrow widths; collapse the middle with an ellipsis rather than overflowing."

ux_principles:
  - "Orientation — show the path so the user always knows where they are (visibility of system status)."
  - "Provide a fast route up the hierarchy without relying on the browser back button (user control)."
common_mistakes:
  - "Using a breadcrumb as primary navigation."
  - "Making the current page a link, or omitting aria-current=page."
  - "Announcing separators (they must be aria-hidden)."
  - "Using a breadcrumb for a single 'back' action (that's Back Link)."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "the trail shows the current location in the hierarchy"}
  - {id: 3, name: "User control and freedom", note: "jump back to any ancestor"}
  - {id: 6, name: "Recognition rather than recall", note: "the path is shown, not remembered"}

relationships:
  related: [back-link, navigation-menu, pagination]
  replaces: ["plain-text 'path' strings with ad-hoc separators"]
  composed_with: [page-header, dropdown-menu]
  not_to_confuse_with:
    - {component: back-link, why: "Back Link is a single 'volver'; Breadcrumb is a multi-level trail"}
    - {component: navigation-menu, why: "Navigation is primary wayfinding; Breadcrumb shows location"}
    - {component: pagination, why: "Pagination pages through a set; Breadcrumb shows hierarchy"}

tokens:
  color: [--text-secondary, --text-primary, --color-primary, --color-outline, --color-surface-variant, --color-focus]
  radius: [--radius-sm]
  spacing: ["6px gap"]
  typography: [--font-size-body-sm]

motion:
  enter: "none — the trail renders statically with the page."
  exit: "none"
  stateChange: "Links transition text color on hover (transition: color .15s var(--ease-default, ease)) and add an underline. The collapse ellipsis, when a <button>, changes background on hover with no declared transition (instant)."
  duration: "hardcoded .15s on .breadcrumb-link — NOT a --duration-* token; should be --duration-fast"
  easing: "--ease-default (with an `ease` literal fallback)"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). The hover color/underline applies instantly; navigation remains fully usable."
  constraints: "Only text color animates (an effect → Standard easing) — correct; the underline is instant. No layout animation. Fix the hardcoded .15s to --duration-fast to satisfy the no-raw-ms rule (GOVERNANCE §13.3)."
  relatedPatterns: ["Feedback — hover color/underline signals a clickable ancestor", "Hover micro-interaction (color change is an effect on Standard easing)"]

source:
  css: css/components/breadcrumb.css
  classes: [breadcrumb, breadcrumb-list, breadcrumb-item, breadcrumb-link, breadcrumb-page, breadcrumb-separator, breadcrumb-ellipsis]
  react_wrapper: components/ui/breadcrumb.tsx
  docs_anchor: c-breadcrumb
---

## Correct usage

```html
<nav class="breadcrumb" aria-label="breadcrumb">
  <ol class="breadcrumb-list">
    <li class="breadcrumb-item"><a class="breadcrumb-link" href="/">Inicio</a></li>
    <li class="breadcrumb-separator" aria-hidden="true">/</li>
    <li class="breadcrumb-item"><a class="breadcrumb-link" href="/vacantes">Vacantes</a></li>
    <li class="breadcrumb-separator" aria-hidden="true">/</li>
    <li class="breadcrumb-item"><span class="breadcrumb-page" aria-current="page">Product Designer</span></li>
  </ol>
</nav>
```
*Why:* labelled nav, semantic ol, ancestor links, current page via aria-current (not a link), aria-hidden separators.

## Incorrect usage

```html
<!-- ✕ Current page as a link, no aria-current -->
<li class="breadcrumb-item"><a class="breadcrumb-link" href="/vacante/1">Product Designer</a></li>
```
*Fix:* render the current page as `<span class="breadcrumb-page" aria-current="page">Product Designer</span>`.

```html
<!-- ✕ A single 'volver' dressed as a breadcrumb -->
<nav class="breadcrumb"><ol class="breadcrumb-list"><li><a class="breadcrumb-link" href="/vacantes">‹ Volver</a></li></ol></nav>
```
*Fix:* use a Back Link for a single upward step; reserve Breadcrumb for a multi-level trail.
