# Navigation

> How people move through an Embassy product — the app shell, hierarchy trails, in-page view switching, and getting back — so every screen answers "where am I, where can I go, how do I return?"

## Why it matters

Navigation is the skeleton every screen hangs off. If wayfinding is inconsistent — a filter that looks like a page link, a back action that behaves like primary nav, an active state that reads as "nothing selected" — users lose their place and stop trusting the product. Embassy standardizes the shell, the trails, and the shared "blue hover" selection language so that navigation feels identical across every recruiting surface. This page is the contract for humans and for AI agents assembling screens.

## The app shell

Embassy's layout is a fixed **app shell** (GOVERNANCE.md §14.1): a left `sidebar` (240px, fixed) for global navigation, a top `topbar` (60px, fixed) for context and global actions, and a scrolling `shell-main` content area (`padding: var(--space-6) var(--space-8)`).

```html
<div class="app-shell">
  <aside class="sidebar">...</aside>      <!-- global nav -->
  <div class="shell-content">
    <header class="topbar">...</header>   <!-- context + global actions -->
    <main class="shell-main"> ... </main> <!-- page content -->
  </div>
</div>
```

Responsibilities are strict — do not blur them:

- **Sidebar** — global, cross-section navigation only (Vacantes, Candidatos, Reportes). Uses the `.nav-item` chrome with the shared nav tokens (below). This is the *only* place `--color-primary` is used for an active nav state (GOVERNANCE.md §5.6); it lives in the shell chrome, not in `packages/ds` components.
- **Topbar** — page context (title, breadcrumb) and *global* actions (search, profile, notifications). Never put a view-specific action here.
- **View-scoped actions go in a `Toolbar`** (`toolbar.tsx`), not the topbar. A "Nueva vacante" button, list filters, and search over *this list* belong in a `Toolbar` above the list — composed of `SearchField` + `Select` + `ToolbarButton`, all at the same `min-h-10` row height. Use `PageHeader` (`page-header.tsx`) for the title + primary action row at the top of the view.

## In-page view switching — pick the right control

Three components look superficially similar; the choice is by *role*, and getting it wrong is a documented mistake:

| Control | Component | Use when | Not for |
|---|---|---|---|
| **Tabs** | `tabs.tsx` | Peer views of the **same subject** within one page (Overview / Actividad / Notas of one vacante) | Navigating between pages — that's the sidebar |
| **Segmented Button** | `segmented-button.tsx` | Switching **how the same data is shown** — view/mode toggles (Lista / Cuadrícula, Día / Semana / Mes); ≤5 short, parallel options | Actions with side effects (use Button); >5 options or disparate labels (use Select) |
| **Select** | `select.tsx` | Choosing among **many** options where a segmented button would overflow (sort order, a long status filter) | 2–4 parallel choices (use Segmented Button) |

Tabs and Segmented Button both draw their selected state from the **Secondary family**, never `--color-primary` (GOVERNANCE.md §5.6): Primary flips to white in dark mode and reads as "no color" for a passive indicator. Tabs use a `text-secondary` label + `bg-secondary` underline indicator and add `font-semibold` so selection never relies on color alone; Segmented Button uses a `primary-container` tonal fill ("Option B") with an `outline-variant` frame.

## Hierarchy trails — Breadcrumb

Use `Breadcrumb` (`breadcrumb.tsx`) to show location within a multi-level hierarchy and let users jump to an ancestor (Vacantes › Frontend Sr › Candidatos). Structure is `nav > ol > li` with `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator` (a `ChevronRight`), and `BreadcrumbEllipsis` for collapsing long trails. The current page is `BreadcrumbPage` — it carries `aria-current="page"` and is non-interactive. Reach for Breadcrumb only when there is a genuine hierarchy; a single "volver" step is a `Back Link`, not a one-item breadcrumb.

## Getting back — Back Link

`BackLink` (`back-link.tsx`) is the single "‹ Volver" affordance for returning from a detail view to its parent. It is **not** primary navigation (that's the sidebar/tabs) and **not** an action (that's a text Button). One back affordance per detail view; place it above the `PageHeader`.

## Active / current state and the shared "blue hover"

Every menu-like or navigation-like surface shares **one** hover/selected vocabulary so hover always reads **blue / light-blue, never neutral gray** (GOVERNANCE.md §5.4). This covers the app-shell `.nav-item`, `dropdown-menu.tsx`, `list.tsx`, and search result rows in `search.tsx`. The tokens (defined in `packages/ds/css/hover-tokens.css`, derived from the `secondary` accent) are:

| Aspect | Token | Derivation |
|---|---|---|
| Hover background | `--color-nav-hover` | `secondary-container` @ 45% |
| Hover icon + label | `--color-nav-hover-content` | `secondary` (blue) |
| Pressed background | `--color-nav-press` | `secondary-container` @ 70% |
| Selected background | `--color-nav-selected` | `secondary-container` (100%) |
| Selected icon + label | `--color-nav-selected-content` | `on-secondary-container` |

The lightness ramp `45% < 70% < 100%` keeps hover ≠ pressed ≠ selected on its own, and the different content color reinforces it. Consume via `bg-[var(--color-nav-*)]` — never a neutral `--color-on-surface-state-*` layer and never a one-off blue. For semantics, mark the current destination with `aria-current="page"` (nav) or the primitive's selected state (`data-state`/`aria-selected`); focus everywhere is the shared `focus-visible:focus-ring` (`--color-focus` outline + `--color-focus-ring` halo, GOVERNANCE.md §6.2).

## Overflow actions — Dropdown Menu

When a row or header has more actions than fit, collapse the secondary ones into a `DropdownMenu` (`dropdown-menu.tsx`) behind a `⋯` trigger. Keep the one primary action visible (see hierarchy rule below); menu items obey the same blue-hover tokens as nav. Use the menu for actions, not for navigating between pages.

## Keep the tree shallow

Deep nesting hides destinations and forces long breadcrumbs. Favor a flat information architecture: global sections in the sidebar, peer views in Tabs, mode switches in Segmented Button. If a screen needs more than ~3 hierarchy levels, that is an IA smell — flag it rather than papering over it with nested menus. One Primary action per context (CLAUDE.md migration rule 3): if a legacy screen has several equal-weight nav actions, introduce hierarchy instead of replicating the flatness.

## Mobile — modal navigation drawer

Below `--breakpoint-md` (768px) the sidebar becomes a **modal navigation drawer** (resolved 2026-07, GOVERNANCE.md §14.3): off-canvas by default, sliding in over a scrim when the shell root gets `.nav-open`, toggled by the topbar hamburger (`.shell-menu-btn`). At ≥768px it stays persistent. The sidebar *is* the Navigation Drawer — modal on compact, standard on expanded (the MD3 split). The behavior ships in `layout.css`; the app wires ~10 lines of JS to toggle `.nav-open` and manage focus. Accessibility contract (same as `Sheet`/`Dialog`): hamburger with `aria-label`/`aria-expanded`/`aria-controls`, focus moves into the drawer on open, `Esc` and scrim-click close, focus returns to the hamburger. `Sheet` (side variant) is for *content* panels, not primary nav. Media queries use the literal `768px` (`@media` can't read `var()`).

## Do / Don't

- **Do** put global navigation in the sidebar and page-scoped controls in a `Toolbar` / `PageHeader`.
- **Do** use `aria-current="page"` on the active sidebar item and current breadcrumb.
- **Do** choose Tabs vs Segmented Button vs Select by role: peer views vs view-mode vs many-options.
- **Do** style every nav/menu hover with the `--color-nav-*` tokens so hover reads blue.
- **Don't** put a view-specific action (e.g. "Nueva vacante") in the topbar — it goes in the view's `Toolbar`/`PageHeader`.
- **Don't** use `--color-primary` for a `packages/ds` selected state, or rely on color alone to show selection.
- **Don't** use a one-item Breadcrumb where a `Back Link` is meant, or a `Back Link` for primary navigation.
- **Do** use the canonical modal navigation drawer below 768px (`layout.css` off-canvas sidebar + `.shell-menu-btn` + scrim); don't invent a different mobile nav.
- **Don't** nest destinations more than ~3 levels deep; flatten the IA instead.

## Checklist for a new screen

- [ ] Screen sits inside the app shell — `sidebar` + `topbar` + `shell-main`.
- [ ] Global nav is in the sidebar; the active item has `aria-current="page"`.
- [ ] Page-scoped search/filters/actions are in a `Toolbar` / `PageHeader`, not the topbar.
- [ ] View switching uses the correct control (Tabs / Segmented Button / Select) per the role table.
- [ ] Multi-level location is shown with `Breadcrumb`; a single return step uses `BackLink`.
- [ ] Selected state uses the Secondary family + a non-color cue (weight/indicator/fill), never `--color-primary`.
- [ ] All nav/menu hover, pressed, and selected states use the `--color-nav-*` tokens (blue hover).
- [ ] Focus is `focus-visible:focus-ring` on every interactive nav element.
- [ ] Overflow actions collapse into a `DropdownMenu`; one Primary action per context.
- [ ] Below 768px the sidebar uses the canonical modal navigation drawer (off-canvas + `.shell-menu-btn` + scrim + focus/Esc handling), not an improvised pattern.

## Related

- [dashboards.md](dashboards.md) — dashboard layout, KPIs, and drill-down navigation
- Components: **Tabs**, **Segmented Button**, **Select**, **Breadcrumb**, **Back Link**, **Toolbar** (`SearchField` / `ToolbarButton` / `ResultCount`), **Page Header**, **Dropdown Menu**, **List**, **Search** (`SearchBar` / `SearchField`), **Navigation Drawer**
- `GOVERNANCE.md` §5.4 (nav hover), §5.6 (selected state), §14 (layout / app shell / §14.3 mobile modal drawer)
- `CLAUDE.md` — app shell inventory and migration rules
