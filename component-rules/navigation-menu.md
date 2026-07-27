---
id: navigation-menu
display_name: Navigation Menu
aliases: [mega menu, top nav, nav menu, site navigation]
category: Navigation
status: stable
summary: A horizontal row of navigation triggers that reveal grouped-link flyout panels — the top-nav mega-menu pattern.
when_to_use:
  - "Primary navigation of a site/app with grouped sub-sections."
  - "Mega-menus where each link carries a title + a short description."
when_not_to_use:
  - "A list of actions → use Dropdown Menu."
  - "A desktop application command bar → use Menubar."
  - "Switching views within a single page → use Tabs."
  - "The persistent app-shell sidebar → use the app-shell Nav Bar (layout.css)."
use_cases:
  - "A marketing top-nav: Productos (with grouped feature links) · Precios · Recursos."
  - "A mega-menu grouping 'Para reclutadores' vs 'Para empresas' with descriptive links."
variants:
  - {name: root,      class: nav-menu,             purpose: "The nav container (position:relative, centered)."}
  - {name: list,      class: nav-menu-list,         purpose: "Row of triggers + sliding indicator."}
  - {name: trigger,   class: nav-menu-trigger,      purpose: "A top-level nav item; can be a <button> (opens panel) or <a> (direct link)."}
  - {name: indicator, class: nav-menu-indicator,    purpose: "Sliding underline for the active trigger (offsetLeft/Width technique, like Tabs)."}
  - {name: viewport,  class: nav-menu-viewport,     purpose: "The flyout panel region that holds the active content."}
  - {name: content,   class: nav-menu-content,      purpose: "Grouped-link content shown in the viewport."}
  - {name: link,      class: nav-menu-link,         purpose: "A link inside the panel; nav-menu-link-title + nav-menu-link-desc for title + description."}
sizes:
  - {name: default, class: "(default)", use: "single density; panel content sizes to its grouped links"}
size_selection: "One density. Panel size follows its content; there is no size scale."
content_rules:
  - "Trigger labels are section nouns ('Productos', 'Precios'), not verbs."
  - "Panel links pair a short title with an optional one-line description."
  - "Mark the current section — don't leave the user without an 'you are here' signal."
layout_constraints:
  - "Triggers sit in a centered horizontal row; the sliding indicator tracks the active trigger."
  - "The flyout viewport opens below the row; KNOWN SIMPLIFICATION: no height-easing animation between panels of different heights (re-measures instantly)."
states:
  default: "Trigger resting; panel closed."
  hover: "Hover-intent delay opens/closes the panel (like a real navbar)."
  focus: "Focus ring on triggers and links; click also opens (for keyboard/touch)."
  active: "Current section marked with aria-current=page; indicator under its trigger."
accessibility:
  roles: "<nav aria-label> names the region; triggers and links are real <a>/<button>."
  aria: ["aria-label on <nav>", "aria-current=page on the active link", "aria-expanded on panel triggers"]
  focus: "Because it opens on hover, ALSO expose click-to-open (already supported) so keyboard/touch users can reach panels."
  contrast: "Trigger, link and panel tokens meet AA in light + dark."
keyboard:
  - {keys: "Enter / Space", action: "open the focused trigger's panel (click path)"}
  - {keys: "Tab / Shift+Tab", action: "move through triggers and panel links"}
  - {keys: "Escape", action: "close the open panel"}
responsive:
  - "Hover doesn't exist on touch — the click-to-open path is required for touch/keyboard reach."
  - "On narrow widths a mega-menu typically collapses into the mobile nav drawer pattern."
ux_principles:
  - "Group destinations meaningfully so the mega-menu aids scanning rather than overwhelming."
  - "Always signal the current location (aria-current) for orientation."
common_mistakes:
  - "Using it for actions instead of navigation (that's a Dropdown Menu)."
  - "Relying on hover only, leaving keyboard/touch users unable to open panels."
  - "Omitting aria-current so the user loses their place."
  - "Confusing it with the app-shell sidebar Nav Bar."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "destinations and their groupings are visible"}
  - {id: 1, name: "Visibility of system status", note: "aria-current marks the current section"}
  - {id: 4, name: "Consistency and standards", note: "top-nav mega-menu matches web navigation conventions"}
relationships:
  related: [menubar, menu, tabs]
  replaces: ["custom hover mega-menus with position:absolute"]
  composed_with: [button]
  not_to_confuse_with:
    - {component: menubar, why: "Menubar issues app commands; Navigation Menu moves between sections"}
    - {component: menu, why: "Dropdown Menu lists actions; Navigation Menu lists destinations"}
    - {component: tabs, why: "Tabs switch views within one page; Navigation Menu goes between pages/sections"}
tokens:
  color: [--color-surface-container, --color-on-surface, --color-primary, --color-outline-variant]
  radius: [--radius-md]
  motion: [--duration-normal, --ease-default]
motion:
  enter: "Viewport panel: navMenuIn keyframe — fade + translateY(-4px→0) as the mega-menu opens; a small hover-intent delay precedes open/close (JS), like a real navbar."
  exit: "none — the viewport unmounts on close (no data-[state=closed] exit; and no viewport size/height easing between panels of different heights — accepted simplification vs. Radix)."
  stateChange: "Trigger hover / [data-state=open] → surface-variant background; chevron icon rotate 180deg on open; sliding underline indicator tracks the active trigger via transform + width (same technique as Tabs); link hover → surface-variant, active link → secondary-container."
  duration: "--duration-normal (panel entrance, indicator transform/width), --duration-fast (chevron rotate, indicator opacity)"
  easing: "--ease-default (panel entrance, chevron, indicator opacity); --ease-expressive (indicator transform/width, with an ease-out fallback)"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). Panel appears instantly, the underline jumps to the active trigger, the chevron flips without a tween."
  constraints: "Animate transform/opacity only (panel translateY, indicator transform/width); no height easing on the viewport (accepted simplification). Never animate the panel width/height — layout thrash."
  relatedPatterns: [panel-entrance, sliding-indicator, state-layer]
source:
  css: css/components/navigation-menu.css
  classes: [nav-menu, nav-menu-list, nav-menu-trigger, nav-menu-trigger-icon, nav-menu-indicator, nav-menu-viewport, nav-menu-viewport-wrap, nav-menu-content, nav-menu-link, nav-menu-link-title, nav-menu-link-desc]
  react_wrapper: components/ui/navigation-menu.tsx
  docs_anchor: c-navigation-menu
---

## Correct usage

```html
<!-- Top-nav with a grouped-link flyout; current section marked; click path present -->
<nav class="nav-menu" aria-label="Principal">
  <div class="nav-menu-list">
    <button class="nav-menu-trigger" aria-expanded="false">Productos</button>
    <a class="nav-menu-trigger" href="/precios" aria-current="page">Precios</a>
    <span class="nav-menu-indicator"></span>
  </div>
  <div class="nav-menu-viewport">
    <div class="nav-menu-content">
      <a class="nav-menu-link" href="/reclutadores">
        <span class="nav-menu-link-title">Para reclutadores</span>
        <span class="nav-menu-link-desc">Gestioná vacantes y candidatos.</span>
      </a>
    </div>
  </div>
</nav>
```
*Why:* grouped destinations with descriptions, aria-current for orientation, openable by click (not hover-only).

## Incorrect usage

```html
<!-- ✕ Navigation Menu used for actions -->
<nav class="nav-menu">
  <button class="nav-menu-trigger">Guardar</button>
  <button class="nav-menu-trigger">Eliminar</button>
</nav>
```
*Fix:* actions belong in a Dropdown Menu; a Navigation Menu links to sections.
