---
id: topbar
display_name: Top Bar
aliases: [top app bar, header bar, app header, topbar]
category: Navigation
status: stable
summary: The app-shell header for each view — surfaces navigation context (breadcrumbs / menu), the current view's actions, and global actions (notifications, profile).
when_to_use:
  - "The main header of every application view — identifying the screen and its context."
  - "Showing navigation context (breadcrumbs or the mobile hamburger) plus the current view's 1–3 actions."
  - "Quick access to global actions: notifications and the profile avatar."
when_not_to_use:
  - "A bar of secondary controls/filters over a list or table → use a Toolbar."
  - "Onboarding or login views where navigation context doesn't apply → omit the topbar."
  - "Table filters and view actions → use a Toolbar, not the topbar."
use_cases:
  - "Cabecera de la vista 'Vacantes' con breadcrumb Reclutamiento / Vacantes y un botón 'Nueva vacante'."
  - "Acceso a notificaciones y perfil desde cualquier pantalla del shell."
  - "En mobile, hospedar el hamburger que abre el Nav Drawer."
variants:
  - {name: topbar, class: topbar, purpose: "The sticky header container (var(--topbar-height))."}
  - {name: breadcrumb, class: topbar-breadcrumb, purpose: "Leading navigation context, pushed left with margin-right:auto."}
  - {name: button, class: topbar-btn, purpose: "A view action; .secondary is the outlined variant."}
  - {name: notif, class: topbar-notif, purpose: "Notifications button with a .notif-badge count."}
  - {name: avatar, class: avatar, purpose: "The profile avatar (global action), far right."}
  - {name: menu-btn, class: shell-menu-btn, purpose: "The hamburger (compact only) that toggles the Nav Drawer; first in the topbar."}
sizes:
  - {name: default, class: "(default)", use: "var(--topbar-height); sticky at top"}
size_selection: "Single height by design (var(--topbar-height)), aligned with the sidebar logo row."
content_rules:
  - "Title/context goes left next to navigation; global actions (profile, notifications) always right, in a consistent position across screens."
  - "Max 1–3 icon actions for the view; overflow the rest into a menu."
  - "Don't change the topbar's content unexpectedly within the same view."
layout_constraints:
  - "Sticky, full-width across the content area; justify-content flex-end with the breadcrumb pushed left."
  - "When search is the primary action of a screen, the topbar area may be replaced by a search field (Material's search app-bar variant)."
states:
  default: "Resting sticky header."
  scrolled: "May elevate (shadow) on scroll to separate from the content."
  hover: "topbar-btn.secondary and topbar-notif tint on hover (--interactive-light)."
  focus: "Use native <a>/<button> controls so the browser focus ring is preserved (layout.css defines no custom :focus-visible for topbar controls)."
accessibility:
  roles: "The topbar lives inside a <header> with role=banner; breadcrumbs use <nav aria-label=\"Breadcrumb\">."
  aria: ['role="banner" on the header', 'aria-label="Breadcrumb" with aria-current="page" on the last crumb', "notifications button aria-label includes the count ('3 notificaciones sin leer')", "hamburger aria-label + aria-expanded + aria-controls"]
  focus: "All controls are native and keyboard-reachable; don't suppress the native outline."
  contrast: "Tokens (--text-muted, --interactive, --color-on-primary) guarantee AA in light + dark — never theme overrides."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "move through topbar controls"}
  - {keys: "Enter / Space", action: "activate the focused control"}
responsive:
  - "On compact, the hamburger (.shell-menu-btn) appears first and toggles the Nav Drawer."
  - "Keep global actions in the same right-hand position across breakpoints."
  - "Collapse extra view actions into an overflow menu on narrow widths."
ux_principles:
  - "Consistent placement of global actions builds a reliable mental model (Jakob's law)."
  - "Reserve the topbar for context + the view's key actions — it is app chrome, not a control panel."
common_mistakes:
  - "Putting list filters/search controls in the topbar instead of a Toolbar."
  - "More than 1–3 icon actions crowding the bar (overflow the rest)."
  - "Moving global actions (profile/notifications) around between screens."
  - "Notifications button with no aria-label / count for screen readers."
nielsen_heuristics:
  - {id: 4, name: "Consistency and standards", note: "global actions in the same place on every screen"}
  - {id: 1, name: "Visibility of system status", note: "breadcrumb + notification badge show where you are / what needs attention"}
  - {id: 8, name: "Aesthetic and minimalist design", note: "only the view's key actions, rest to overflow"}
relationships:
  related: [nav-bar, nav-drawer, breadcrumb, toolbar]
  replaces: ["legacy app headers / top bars"]
  composed_with: [breadcrumb, button, avatar, badge, nav-drawer]
  not_to_confuse_with:
    - {component: toolbar, why: "Toolbar hosts a list/table's controls; the topbar is app chrome + view context"}
    - {component: page-header, why: "Page Header titles the content region; the topbar is the shell header"}
    - {component: breadcrumb, why: "Breadcrumb is a part inside the topbar, not the bar itself"}
tokens:
  color: [--sidebar-bg, --text-muted, --interactive, --interactive-light, --color-on-primary, --border]
  radius: [--radius-md, --radius-full]
  spacing: [--topbar-height]
  motion: [--duration-fast]
source:
  css: css/layout.css
  classes: [topbar, topbar-breadcrumb, topbar-btn, topbar-notif, notif-badge, avatar, avatar-label, shell-menu-btn]
  react_wrapper: null
  docs_anchor: c-topbar
---

## Correct usage

```html
<!-- View header: breadcrumb left, view action + global actions right -->
<header role="banner">
  <div class="topbar">
    <button class="shell-menu-btn" aria-label="Abrir navegación" aria-expanded="false" aria-controls="sidebar"><i data-lucide="menu"></i></button>
    <nav class="topbar-breadcrumb" aria-label="Breadcrumb">
      <a href="/reclutamiento">Reclutamiento</a><span class="separator">/</span><span aria-current="page">Vacantes</span>
    </nav>
    <button class="btn-primary btn-sm">Nueva vacante</button>
    <button class="topbar-notif" aria-label="3 notificaciones sin leer"><i data-lucide="bell"></i><span class="notif-badge">3</span></button>
    <div class="avatar">MG</div>
  </div>
</header>
```
*Why:* banner landmark, labelled breadcrumb, one view action, global actions right with an accessible notification count.

## Incorrect usage

```html
<!-- ✕ List filters crammed into the topbar -->
<div class="topbar"><div class="search-field">…</div><button class="topbar-btn">Filtros</button><button class="topbar-btn">Ordenar</button></div>
```
*Fix:* those belong in a Toolbar above the list; the topbar carries view context + global actions.

```html
<!-- ✕ Notifications with no accessible name -->
<button class="topbar-notif"><i data-lucide="bell"></i><span class="notif-badge">3</span></button>
```
*Fix:* add `aria-label="3 notificaciones sin leer"` — the count must reach screen readers.
