---
id: nav-bar
display_name: Navigation Bar
aliases: [sidebar, side nav, nav rail, primary navigation]
category: Navigation
status: stable
summary: The app-shell sidebar rail — the persistent list of top-level destinations (icon + label) that anchors primary navigation on desktop.
when_to_use:
  - "Persistent primary navigation for an app shell on desktop (≥ 768px)."
  - "Grouping top-level destinations under section labels, with an active indicator tracking the current route."
when_not_to_use:
  - "Compact/mobile viewports (< 768px) → the same rail becomes the modal Nav Drawer."
  - "Flyout menus opened off a menu bar → use Navigation Menu."
  - "In-page navigation between sub-views of one screen → use Tabs."
  - "Contextual actions/filters over a list → use a Toolbar (those aren't navigation)."
use_cases:
  - "Rail de la app de reclutamiento: Dashboard, Vacantes, Candidatos, Reportes."
  - "Agrupar destinos bajo section labels ('Reclutamiento', 'Organización')."
  - "Marcar la sección activa mientras el usuario navega."
variants:
  - {name: sidebar, class: sidebar, purpose: "The fixed 240px rail container (var(--sidebar-width))."}
  - {name: nav, class: sidebar-nav, purpose: "The scrollable region holding sections and items."}
  - {name: item, class: nav-item, purpose: "A destination row: icon + label, hover/active states via the shared --color-nav-* tokens."}
  - {name: section-label, class: nav-section-label, purpose: "Uppercase group heading above a set of related destinations."}
  - {name: sub-items, class: nav-sub-items, purpose: "Indented nested destinations under a parent item."}
  - {name: badge, class: nav-badge, purpose: "Trailing count/attention pill on an item (--interactive-light)."}
sizes:
  - {name: default, class: "(default)", use: "240px rail; nav-item at body-md; sub-items at label size"}
size_selection: "Single width by design (var(--sidebar-width)). Density comes from grouping with section labels, not from resizing."
content_rules:
  - "Every item shows an icon AND a one-word/short label — never icon-only in the expanded rail."
  - "Group with section labels; keep ~4–5 items per group."
  - "Reserve badges for items that genuinely need attention; don't badge everything."
  - "Keep destination order stable across screens and sessions."
layout_constraints:
  - "Fixed to the left edge, full height; content is offset by margin-left: var(--sidebar-width)."
  - "One active destination at a time."
  - "Don't reorder items by role without communicating it."
states:
  default: "Resting item at --text-secondary."
  hover: "Shared blue-hover: --color-nav-hover background + --color-nav-hover-content text (never gray)."
  active: "--color-nav-selected background + --color-nav-selected-content, weight 500, aria-current=\"page\"."
  focus: "Use native <a>/<button> items so the browser focus ring is preserved (layout.css defines no custom :focus-visible for .nav-item)."
accessibility:
  roles: "The rail is a <nav aria-label=\"Navegación principal\"> (navigation landmark); items are native <a href> or <button>."
  aria: ['aria-label on the <nav>', 'aria-current="page" on the active item', "aria-hidden on decorative icons", "badge count folded into the item's aria-label"]
  focus: "Each item is keyboard-focusable and activates with Enter/Space; don't suppress the native outline."
  contrast: "Tokens (--text-secondary, --color-nav-*, --interactive) recalibrate for dark automatically — never theme overrides. Active state is reinforced by weight, not color alone."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "move focus through destinations"}
  - {keys: "Enter / Space", action: "activate the focused destination"}
responsive:
  - "≥ 768px: persistent fixed rail."
  - "< 768px: becomes the modal Nav Drawer (off-canvas, opened by the topbar hamburger) — do not stretch or duplicate it."
  - "Item spans the full row height, so the ≥44px touch target is covered without extra padding."
ux_principles:
  - "Persistent, stable navigation lets users build a spatial model of the app (Jakob's law / consistency)."
  - "Blue hover — never gray — keeps nav affordances legible in light and dark (shared --color-nav-* tokens)."
common_mistakes:
  - "Icon-only items in the expanded rail (labels are required)."
  - "Gray hover instead of the shared blue-hover nav tokens."
  - "Communicating the active item by color alone (needs weight 500 + aria-current)."
  - "Using nav items for actions (that's a Button) rather than navigation."
nielsen_heuristics:
  - {id: 4, name: "Consistency and standards", note: "stable destination order and one active indicator across screens"}
  - {id: 1, name: "Visibility of system status", note: "active item + aria-current show where the user is"}
  - {id: 6, name: "Recognition rather than recall", note: "all top-level destinations are visible, not memorized"}
relationships:
  related: [nav-drawer, navigation-menu, breadcrumb, topbar]
  replaces: ["legacy sidebars / nav rails"]
  composed_with: [topbar, badge, avatar]
  not_to_confuse_with:
    - {component: nav-drawer, why: "Nav Drawer is this same rail in its compact modal form"}
    - {component: navigation-menu, why: "Navigation Menu is flyout menus off a bar, not the app-shell rail"}
    - {component: toolbar, why: "Toolbar hosts view controls/filters, not navigation"}
    - {component: tabs, why: "Tabs switch sub-views within one screen; the rail switches top-level destinations"}
tokens:
  color: [--color-nav-hover, --color-nav-hover-content, --color-nav-selected, --color-nav-selected-content, --text-secondary, --sidebar-bg]
  radius: [--radius-md, --radius-full]
  spacing: [--sidebar-width]
  motion: [--duration-fast]
motion:
  enter: "none — the sidebar nav is persistent/fixed on ≥768px; it only ever slides in as the mobile Nav Drawer (see nav-drawer)."
  exit: "none (persistent)."
  stateChange: "nav-item hover → nav-hover background + nav-hover-content color; .active → nav-selected background + selected-content color (including the active icon color); nav-badge/chevron are static; sidebar-search hover → border-color."
  duration: "--duration-fast (nav-item background + color, sidebar-search border)"
  easing: "browser default `ease` — nav-item declares `transition: background var(--duration-fast), color var(--duration-fast)` with NO explicit --ease-* token (the tint is a Standard effect; adding --ease-default would be the token-correct form)."
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). Hover/active tints apply instantly. (The reduced-motion @media in layout.css targets the .sidebar/.sidebar-scrim slide, not these nav-item tints.)"
  constraints: "Animate color/background only (state-layer effect) — no transform/lift on nav items. Don't animate layout."
  relatedPatterns: [state-layer]
source:
  css: css/layout.css
  classes: [sidebar, sidebar-nav, nav-item, nav-section-label, nav-sub-items, nav-badge, sidebar-footer]
  react_wrapper: null
  docs_anchor: c-nav-bar
---

## Correct usage

```html
<!-- Persistent rail: grouped, native links, active indicator -->
<nav class="sidebar" aria-label="Navegación principal">
  <div class="sidebar-nav">
    <div class="nav-section-label">Reclutamiento</div>
    <a class="nav-item active" href="/vacantes" aria-current="page">
      <i data-lucide="briefcase" aria-hidden="true"></i> Vacantes
      <span class="nav-badge">12</span>
    </a>
    <a class="nav-item" href="/candidatos"><i data-lucide="users" aria-hidden="true"></i> Candidatos</a>
  </div>
</nav>
```
*Why:* nav landmark, native links, icon+label, active item with aria-current, decorative icons hidden.

## Incorrect usage

```html
<!-- ✕ Icon-only items in the expanded rail -->
<a class="nav-item" href="/vacantes"><i data-lucide="briefcase"></i></a>
```
*Fix:* include the label — the expanded rail is never icon-only.

```html
<!-- ✕ Gray hover instead of the shared blue-hover token -->
<a class="nav-item" style="--color-nav-hover:#eee" href="/reportes">Reportes</a>
```
*Fix:* keep the shared `--color-nav-*` tokens; nav hover reads blue, never gray.
