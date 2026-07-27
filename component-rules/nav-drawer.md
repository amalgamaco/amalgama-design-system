---
id: nav-drawer
display_name: Navigation Drawer
aliases: [mobile nav, off-canvas menu, hamburger menu, modal drawer]
category: Navigation
status: stable
summary: The app-shell sidebar in its compact form — below 768px it becomes a modal, off-canvas drawer that slides in over a scrim, toggled by the topbar hamburger.
when_to_use:
  - "Presenting the app's primary navigation on compact/mobile viewports (< 768px), where the persistent sidebar can't stay open."
  - "Any app-shell built on layout.css that needs its Nav Bar reachable on small screens — this IS that sidebar, modal on compact."
when_not_to_use:
  - "Wide/desktop viewports (≥ 768px) → the same sidebar stays persistent (Nav Bar), no drawer."
  - "A content side panel (filters, item detail) → use a Side Sheet, not the nav drawer."
  - "In-page navigation between sub-views → use Tabs."
  - "Flyout menus off a menu bar → use Navigation Menu."
use_cases:
  - "Abrir la navegación de secciones (Vacantes, Candidatos, Reportes) desde el hamburger en un teléfono."
  - "Shell de la app de reclutamiento en tablet en modo retrato."
variants:
  - {name: sidebar, class: sidebar, purpose: "The drawer surface itself — off-canvas by default on compact, persistent on ≥768px."}
  - {name: open, class: "app.nav-open", purpose: "State on the shell root that slides the drawer in (translateX(0)) and shows the scrim."}
  - {name: scrim, class: sidebar-scrim, purpose: "Fixed backdrop (z-index 9) behind the drawer; click to close (modal on compact)."}
  - {name: trigger, class: shell-menu-btn, purpose: "Hamburger button in the topbar (hidden ≥768px, ≥44px target) that toggles .nav-open."}
sizes:
  - {name: default, class: "(default)", use: "240px (var(--sidebar-width)); off-canvas via translateX(-100%) until open"}
size_selection: "Single width by design; the drawer overlays content (does not push it) on compact."
content_rules:
  - "Same content as the persistent Nav Bar: section labels + icon-plus-label destination items."
  - "Every item shows icon AND label — never icon-only in the drawer."
  - "Active item mirrors the current route; badges only for items needing attention."
layout_constraints:
  - "Media queries use the literal 768px (@media can't read var(--breakpoint-md))."
  - "Modal on compact: overlays content on the scrim, does not reflow it (.main reclaims full width)."
  - "Hamburger is placed first in the .topbar and only shows below 768px."
states:
  default: "Off-canvas (translateX(-100%)); scrim hidden."
  open: "Slides to translateX(0) with .app.nav-open; scrim visible; focus moved into the drawer."
  hover: "Nav items use the shared blue-hover tokens (--color-nav-hover / -hover-content)."
  active: "Current destination: --color-nav-selected background + weight 500 + aria-current=\"page\"."
  focus: "Use native <a>/<button> items so the browser focus ring is preserved (layout.css defines no custom :focus-visible for .nav-item)."
  reduced_motion: "prefers-reduced-motion drops the slide — the drawer just shows/hides."
accessibility:
  roles: "The drawer is a <nav aria-label=\"Navegación principal\"> (role=navigation); groups use role=group + aria-labelledby."
  aria: ['aria-label on the <nav>', 'aria-current="page" on the active item', "hamburger has aria-label + aria-expanded + aria-controls pointing at the sidebar", 'role="group" + aria-labelledby on item groups']
  focus: "Opening moves focus into the drawer; Escape and scrim-click close; focus returns to the hamburger — same contract as Sheet/Dialog. Don't suppress the native outline."
  contrast: "Tokens (--text-secondary, --color-nav-*, --interactive) recalibrate for dark automatically — never theme overrides. Active state is not color-only (weight 500 + aria-current reinforce it)."
keyboard:
  - {keys: "Enter / Space (on hamburger)", action: "open the drawer"}
  - {keys: "Tab / Shift+Tab", action: "move through drawer items while open"}
  - {keys: "Enter / Space (on item)", action: "navigate to the destination"}
  - {keys: "Escape", action: "close the drawer; focus returns to the hamburger"}
responsive:
  - "≥ 768px: persistent fixed sidebar (Nav Bar); no hamburger, no scrim."
  - "< 768px: off-canvas modal drawer opened by the hamburger; content is full-width."
  - "Consuming apps wire ~10 lines of JS to toggle .nav-open and handle Esc / scrim / focus — CSS + structure are canonical, the toggle is app-owned."
ux_principles:
  - "One canonical mobile nav pattern — don't improvise a different off-canvas menu (GOVERNANCE §14.3)."
  - "Modal on compact keeps the user's place: the drawer overlays, the scrim signals it's blocking."
common_mistakes:
  - "Improvising a bespoke mobile nav instead of using the shipped modal drawer."
  - "Suppressing the native focus outline on .nav-item."
  - "Communicating the active item by color alone (needs weight 500 + aria-current)."
  - "Using it for filters/detail (that's a Side Sheet) instead of navigation."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "destinations are shown, not remembered, once the drawer is open"}
  - {id: 3, name: "User control and freedom", note: "Escape / scrim-click always close the drawer"}
  - {id: 4, name: "Consistency and standards", note: "one canonical mobile nav pattern across the shell"}
relationships:
  related: [nav-bar, sheet-side, navigation-menu]
  replaces: ["ad-hoc hamburger / off-canvas mobile menus"]
  composed_with: [topbar, badge]
  not_to_confuse_with:
    - {component: nav-bar, why: "Nav Bar is the same sidebar in its persistent desktop form; Nav Drawer is its modal compact form"}
    - {component: sheet-side, why: "Side Sheet holds content (filters/detail); the drawer holds primary navigation"}
    - {component: navigation-menu, why: "Navigation Menu is flyout menus off a bar, not the app shell"}
tokens:
  color: [--color-nav-hover, --color-nav-selected, --color-scrim, --sidebar-bg, --border]
  spacing: [--sidebar-width]
  motion: [--duration-medium, --ease-default]
  shadow: [--shadow-lg]
motion:
  enter: "Mobile modal drawer (<768px): the sidebar slides in from the left edge translateX(-100%→0) when .app.nav-open is set; the scrim fades in (opacity 0→1). ≥768px it is persistent/fixed and does not animate in."
  exit: "Slide-out translateX(0→-100%) + scrim fade-out when .nav-open is removed (symmetric show/hide)."
  stateChange: "nav-item hover → nav-hover background + nav-hover-content color; .active → nav-selected background + selected-content color; sidebar-search hover → border-color."
  duration: "--duration-medium (drawer slide), --duration-normal (scrim opacity), --duration-fast (nav-item hover, sidebar-search hover)"
  easing: "--ease-default (drawer slide, scrim fade, nav-item/search hover)"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). PLUS layout.css ships its own @media (prefers-reduced-motion: reduce) block setting `.sidebar` and `.sidebar-scrim` transition:none — the drawer shows/hides instantly with no slide and no scrim fade."
  constraints: "Animate transform/opacity only (translateX + scrim opacity). Never animate width/margin/left — the ≥768px→<768px switch is a media-query layout change, not an animated one."
  relatedPatterns: [edge-anchored-slide, overlay-fade, state-layer]
source:
  css: css/layout.css
  classes: [sidebar, "app.nav-open", sidebar-scrim, shell-menu-btn, nav-item, nav-section-label]
  react_wrapper: null
  docs_anchor: c-nav-drawer
---

## Correct usage

```html
<!-- Compact shell: hamburger toggles the modal drawer -->
<div class="app">
  <nav class="sidebar" aria-label="Navegación principal">
    <div class="sidebar-nav">
      <a class="nav-item active" href="/vacantes" aria-current="page"><i data-lucide="briefcase"></i> Vacantes</a>
      <a class="nav-item" href="/candidatos"><i data-lucide="users"></i> Candidatos</a>
    </div>
  </nav>
  <div class="sidebar-scrim"></div>
  <div class="main">
    <header class="topbar">
      <button class="shell-menu-btn" aria-label="Abrir navegación" aria-expanded="false" aria-controls="sidebar">
        <i data-lucide="menu"></i>
      </button>
      …
    </header>
  </div>
</div>
```
*Why:* native nav landmark, aria-current on the active item, hamburger with aria-expanded/aria-controls; app JS toggles `.nav-open`.

## Incorrect usage

```html
<!-- ✕ A hand-rolled off-canvas menu that ignores the shell pattern -->
<div class="my-mobile-menu" style="position:fixed;left:0;transform:translateX(-100%)">…</div>
```
*Fix:* use the shipped `.sidebar` + `.app.nav-open` drawer — don't improvise (GOVERNANCE §14.3).

```html
<!-- ✕ Active item styled by color only -->
<a class="nav-item" style="color:var(--color-primary)" href="/vacantes">Vacantes</a>
```
*Fix:* add `.active` (weight 500) + `aria-current="page"` so the state isn't color-only.
