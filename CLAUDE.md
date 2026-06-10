# CLAUDE.md

This file is the **single source of truth for consuming and extending the Amalgama Design System**. It is read both by humans and by AI agents (e.g. the `design-system` skill) that apply the DS to other projects — internal tools, dashboards, artifacts, and platforms like presentations.amalgama.co.

This repo has two layers:

1. **The library** — `css/` (tokens + component styles) and `components/` (React wrappers). No build step; consumable as-is.
2. **The documentation site** — `index.html` at the repo root (single-page app, canonical) plus legacy per-component pages in `docs/`.

---

## Consuming the DS

### CSS load order

Always load in this order:

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Epilogue:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/variables.css">   <!-- 1. tokens (required) -->
<link rel="stylesheet" href="css/base.css">        <!-- 2. reset + typography base (required) -->
<link rel="stylesheet" href="css/components.css">  <!-- 3. barrel: all components -->
<link rel="stylesheet" href="css/layout.css">      <!-- 4. only for full app shell (sidebar, topbar, avatar) -->
```

Instead of the barrel (`components.css`), you can cherry-pick individual files from `css/components/`.

**Tokens are the law.** All colors via `var(--color-*)` or semantic aliases (`--accent`, `--bg`, `--border`), radii via `var(--radius-*)`, shadows via `var(--shadow-*)`, spacing via `var(--space-*)`. Never raw hex. Dark mode is automatic: set `data-theme="dark"` on `<html>` — the semantic `--color-*` layer recalibrates itself; components need zero per-theme overrides.

Fonts: **Inter** (body/UI), **Epilogue** (headings), **DM Mono** (code/labels).

### React layer

Thin wrappers in `components/ui/*.tsx` — all styling lives in the CSS classes. Pattern: `cva` (class-variance-authority) for variants + `cn()` from `components/lib/utils.ts` + `React.forwardRef`. Peer deps: `react`, `class-variance-authority`, `clsx`.

Copy the component file + `components/lib/utils.ts` into the target project (or import from `@amalgama/ds/...` if set up).

### Class conventions

Flat kebab-case, additive variants — **not** BEM: `btn-primary btn-danger`, `chip chip-selected`, `badge badge-open`. Every component CSS file has a header comment with a `Uso:` block showing exact markup. Read it before using a component.

### Applying the DS to an existing product (migration rules)

When restyling or rebuilding an existing screen, **DS rules win over visual fidelity to the legacy design**. Concretely:

1. **Never stretch or realign a component beyond its documented anatomy** to imitate the legacy layout (e.g. a full-width left-aligned button reads as a form field — buttons have intrinsic width and centered content). If the legacy layout demands it, that layout is the thing to change.
2. **Map legacy elements to the closest documented DS pattern**, not to a visual lookalike. An "action row" is a button group with hierarchy (one `btn-primary` + alternatives), not a stretched outlined button.
3. **One Primary action per context.** If the legacy screen has several equal-weight actions, introduce hierarchy; don't replicate the flatness.
4. **If no documented pattern fits, stop and flag it** as a DS gap instead of improvising — same rule as for roadmap components.
5. **Report every divergence** from the legacy design that these rules force, so designers can validate the trade-off.

---

## Component inventory

| Component | CSS (`css/components/`) | React (`components/ui/`) | Docs page (`docs/`) |
|---|---|---|---|
| Button | `button.css` (`btn-primary/-secondary/-tertiary/-text`, `icon-btn`, `btn-sm/-danger/-success`) | `button.tsx` | `button.html` |
| Badge | `badge.css` (`badge badge-{open,active,closed,draft,archived,warning,tertiary,info}`) | `badge.tsx` | `badge.html` |
| **Chip** | `chip.css` (`chip`, `chip-selected`, `chip-elevated`, `chip-icon`, `chip-remove`, `chip-set`) | `chip.tsx` (`Chip`, `InputChip`, `ChipSet`) | `chip.html` |
| **Search** | `search.css` (`search-bar` + slots, `search-view` + `-fullscreen`, header/results) | `search.tsx` (`SearchBar`, `SearchView`, …) | `search.html` |
| Input / Select / Textarea | `form.css` | `input.tsx`, `select.tsx`, `textarea.tsx` | `input.html`, `select.html`, `textarea.html` |
| Card | `card.css` | `card.tsx` | `card.html` |
| Table | `table.css` | `table.tsx` | `table.html` |
| Tabs | `tabs.css` | `tabs.tsx` | `tabs.html` |
| Modal | `modal.css` | `modal.tsx` | `modal.html` |
| Toast | `toast.css` | `toast.tsx` | `toast.html` |
| Skeleton | `skeleton.css` | `skeleton.tsx` | `skeleton.html` |
| Empty State | `empty-state.css` | `empty-state.tsx` | `empty-state.html` |
| Stat Card | `stat-card.css` | `stat-card.tsx` | `stat-card.html` |
| Toolbar (+ `search-field`) | `toolbar.css` | `toolbar.tsx` (`Toolbar`, `SearchField`, `ToolbarButton`, `ResultCount`) | `toolbar.html` |
| Page Header | `page-header.css` | `page-header.tsx` | — |
| Back Link | `back-link.css` | `back-link.tsx` | — |
| Description | `description.css` | `description-section.tsx` | — |
| Topbar / Sidebar / Avatar | `layout.css` (app shell) | — | `topbar.html`, `navigation.html`, `avatar.html` |

**Extended (domain-oriented):** Vacancy Card, Person Card, Kanban, Create Form, Placeholder — CSS in `css/components/`, docs in `docs/`. Use for recruiting/HR product surfaces.

**Roadmap (documented as "Coming soon", no consumable code yet):** checkbox, radio, switch, menu, tooltip, slider, date picker, sheet, list, loading, carousel, divider. **Do not invent styles for these** — compose from existing components or flag the gap.

Component relationships: filter **chips** refine **search** results (chips below the search bar) and toolbar filters; **search-field** (toolbar.css) is the compact in-toolbar search, **search-bar** (search.css) is the standalone 56px component.

---

## Adding a new component

1. **CSS first**: `css/components/<name>.css` with the standard header comment (description, specs, `Dependencia:`, `Uso:` with exact markup). Semantic tokens only — it must work in light and dark with zero overrides.
2. Add the `@import` to `css/components.css` (bump the `?v=` query in consumers if cached).
3. **React wrapper** (optional but preferred): `components/ui/<name>.tsx` following the `cva` + `cn()` + `forwardRef` pattern.
4. **Docs**: section in root `index.html` (Overview/Specs/Guidelines/Accessibility/Code tabs — use Button as the reference for depth) + a `docs/<name>.html` page.
5. Cross-link related components (related-components cards + inline `navigate()` links).

---

## Working on the documentation site

The canonical docs app is **`index.html` at the repo root** (single-page, sections per component, tab system). The `docs/*.html` pages are the legacy per-component catalog — keep them in sync when components change (they are read by tooling).

Structural references: **Material Design 3** and **Uber Base** — for documentation architecture, token structure, specs, behaviors and usage guidelines only. **Do not copy their visual style.** The DS must preserve Amalgama's identity: colors, typography, components, brand feel, tone and visual language.

Documentation conventions:

- Component sections follow MD3 depth: Overview / Specs / Guidelines / Accessibility / Code tabs.
- Spec measurement annotations in SVGs use the magenta annotation color (doc chrome, not a token).
- Static SVG mockups are light-mode illustrations by design; live examples must be token-driven and theme-aware.
- Spanish (rioplatense) for product/docs copy.
