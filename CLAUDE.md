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
<link rel="stylesheet" href="css/variables.css">     <!-- 1. tokens (required) -->
<link rel="stylesheet" href="css/md-sys-bridge.css"> <!-- 1b. optional: exposes MD3 --md-sys-color-* names as aliases of --color-* roles; load right after variables -->
<link rel="stylesheet" href="css/base.css">          <!-- 2. reset + typography base (required) -->
<link rel="stylesheet" href="css/components.css">    <!-- 3. barrel: all components -->
<link rel="stylesheet" href="css/layout.css">        <!-- 4. only for full app shell (sidebar, topbar, avatar) -->
```

Instead of the barrel (`components.css`), you can cherry-pick individual files from `css/components/`.

**MD3 system bridge (`css/md-sys-bridge.css`)** — optional layer that aliases Material Design 3's real system-token names (`--md-sys-color-*`) onto Embassy's `--color-*` roles, and maps all `--md-sys-typescale-*-font` tokens to `var(--font-body)` (Inter) so `@material/web` components don't fall back to Roboto/serif. (After editing the bridge, bump the `?v=` on its `<link>` in `index.html` or the browser serves the cached old file.) Components that adopt MD3's component-token layer (currently **Segmented Button** — the reference pattern; see GOVERNANCE.md §2.2) default each token to `var(--md-sys-color-X, var(--color-X))`: with the bridge loaded they use Material's naming; without it they fall back to the Embassy role. Embassy's palette stays the single source of truth either way, and the bridge needs no dark override (the `--color-*` roles already recalibrate). This adopts MD3's token *structure*, **not** the `material-web` component implementations (evaluated June 2026 and rejected: maintenance mode + lacks ~70% of Embassy's components).

**Tokens are the law.** All colors via `var(--color-*)` or semantic aliases (`--accent`, `--bg`, `--border`), radii via `var(--radius-*)` (scaled by component size, never by variant — see GOVERNANCE.md §4.3), shadows via `var(--shadow-*)`, spacing via `var(--space-*)`. Never raw hex. Dark mode is automatic: set `data-theme="dark"` on `<html>` — the semantic `--color-*` layer recalibrates itself; components need zero per-theme overrides.

Fonts: **Inter** (body/UI), **Epilogue** (headings), **DM Mono** (code/labels) — always via `var(--font-body)` / `var(--font-heading)` / `var(--font-mono)`, never quoted family names in component code.

**Every `font-size` flows through a `--font-size-*` token** — never loose px. `base.css` binds h1–h6 to the scale (h1→`display` … h6→`heading-xs`); UI text uses `body-lg/md/sm`, `label`, `caption`, `overline`, `badge`. A legacy size with no exact token snaps to the nearest *role-appropriate* token, not a new px value.

**Icons: Lucide** (CDN `unpkg.com/lucide`, `<i data-lucide="…">` + `lucide.createIcons()`), stroke inherits `currentColor`. 18px inside chips/inputs, 20px in nav, 24px in search bars. One icon set per product — never mix.

**Breakpoints**: canonical values `--breakpoint-md: 768px`, `--breakpoint-lg: 1024px` live in `variables.css` (media queries can't consume `var()` — use the literal values and keep them in sync). The mobile sidebar/shell pattern is a pending design decision — flag it, don't improvise off-canvas patterns.

**Typography color is brand navy, not black.** Page text — headings AND body — uses `var(--text-primary)` = `primary-900` (`#01164D`) in light mode, recalibrated to `#EAEBED` in dark. Secondary text: `var(--text-secondary)`. `--color-on-surface` (near-black `#0A0C12`) is reserved for content *inside* components (chip labels, button text, table cells) — never for page typography. If Embassy page text renders black, a token is misapplied.

### React layer

Thin wrappers in `components/ui/*.tsx` — all styling lives in the CSS classes. Pattern: `cva` (class-variance-authority) for variants + `cn()` from `components/lib/utils.ts` + `React.forwardRef`. Peer deps: `react`, `class-variance-authority`, `clsx`.

Copy the component file + `components/lib/utils.ts` into the target project (or import from `@amalgama/ds/...` if set up).

### Class conventions

Flat kebab-case, additive variants — **not** BEM: `btn-primary btn-danger`, `chip chip-selected`, `badge badge-open`. Every component CSS file has a header comment with a `Uso:` block showing exact markup. Read it before using a component.

Size modifier classes (e.g. `btn-sm`, `btn-lg`, `btn-xl`) carry the size-appropriate `border-radius` — adding the size class is sufficient. Never add a separate `border-radius` inline. The same variant in different size demos must use different size classes, not different inline overrides.

### Applying the DS to an existing product (migration rules)

**Read [MIGRATION.md](MIGRATION.md) first** — it is the full reverse-mapping contract: the phase workflow (token audit → component inventory → apply → hierarchy pass → verify), the deterministic color-replacement algorithm (classify by element ROLE, never nearest-hex), the legacy-pattern → DS-component mapping table, the anti-pattern catalog, and the machine-checkable verification checklist. Run that checklist before declaring a migration done.

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
| Button | `button.css` (`btn-primary/-secondary/-tertiary/-text`, `icon-btn`; sizes: `btn-xs/-sm/-lg/-xl`; modifiers: `btn-danger/-success/-compact`; radius scales with size: XS/SM→`--radius-sm`, MD/LG→`--radius-md`, XL→`--radius-lg`) | `button.tsx` | `button.html` |
| **Segmented Button** | `segmented-button.css` (`seg-btn-group`, `seg-btn`, `seg-btn.selected`; sizes: `seg-btn-group-sm/-lg`; color roles: MD3 `secondaryContainer`/`onSecondaryContainer` for selected, `onSurface` for unselected, `outline` for border; state layers via `color-mix()`) | — | — |
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

**shadcn/Radix islands (interactive components, rendered in `index.html` only):** the
interactive components are React (shadcn/ui + Radix) + Tailwind v4, built in `islands/`
to `islands/dist/embassy-islands.{js,css}` and mounted into `[data-island]` slots in
`index.html`. They consume tokens via the Embassy→Tailwind bridge (`islands/src/styles.css`)
and import their implementations from the in-repo **`@amalgama/ds`** package at
**`packages/ds/`** (linked via `file:../packages/ds`; `@ds/*` alias → the package's
`exports`). This repo is a **monorepo**: `packages/ds/` is the single source of truth for
component code, the root is the docs + tokens + governance. (See `islands/INTEGRATION.md`
and `CONSOLIDATION-PLAN.md`.) Covered: **checkbox, switch, radio, slider, menu (dropdown),
list, divider (separator), progress, chip, input/textarea, select, tabs, dialog, tooltip,
date picker, sheet, carousel, segmented-button, avatar, snackbar (sonner)** + domain cards
(kanban/person/vacancy).

> **History:** an earlier experiment rendered these via official `@material/web` web
> components. That runtime was **removed (2026-06)** — there are **0 live `<md-*>` elements**.
> `css/md-sys-bridge.css` stays (Embassy CSS + Segmented Button still consume `--md-sys-color-*`).
> These islands are a deliberate exception to the no-build/CSS-only rule; there is **no Embassy
> `css/components/*.css` for islands-only components** — do not write one. Components that DO have
> a `css/components/*.css` (button, badge, card, chip, search, etc.) keep it as the **buildless
> consumption layer** for the `design-system` skill (artifacts/dashboards/presentations); the
> island is the docs-site rendering of the same component.

**Canonical Overview structure (all component pages):** badge → title → subtitle → 4 tabs
(Overview / Guidelines / Accessibility / Code) → key-characteristic bullets → single-mode
variant showcase → numbered references. **Show only one color mode at a time — no side-by-side
light/dark; examples follow the global theme toggle.** Note: in dark mode Embassy `--color-primary`
is white, so selected controls render white — see [[md3-structure-adoption]] memory.

Component relationships: filter **chips** refine **search** results (chips below the search bar) and toolbar filters; **search-field** (toolbar.css) is the compact in-toolbar search, **search-bar** (search.css) is the standalone 56px component.

Every component CSS header now carries a **`Cuándo usar / Cuándo no / Reemplaza a`** block — that is the per-component decision rule (badge vs chip, modal vs toast, card vs stat-card, etc.). Agents must honor it when mapping legacy elements.

### Where to look things up (authoritative source per information type)

| Information | Authoritative source |
|---|---|
| Token values (colors, type scale, spacing, radii, shadows, breakpoints) | `css/variables.css` |
| Component markup + variants + usage rules | the component's `css/components/*.css` header (`Uso:` + `Cuándo usar`) |
| Usage guidelines / specs / accessibility (human depth) | root `index.html` |
| Migration / restyling rules | `MIGRATION.md` |
| Cross-component consistency rules, state patterns, audit checklist | `GOVERNANCE.md` |
| React props | `components/ui/*.tsx` |

The legacy `docs/*.html` pages drift — treat them as secondary; never let them override the sources above.

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
