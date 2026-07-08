# CLAUDE.md

This file is the **single source of truth for consuming and extending the Amalgama Design System**. It is read both by humans and by AI agents (e.g. the `design-system` skill) that apply the DS to other projects — internal tools, dashboards, artifacts, and platforms like presentations.amalgama.co.

This repo has two layers:

1. **The component library** — the `@amalgama/ds` package at `packages/ds/`. Tailwind v4 + shadcn/Radix React components in `components/ui/*.tsx`, each **self-contained** (variants defined in-file with Tailwind utilities that resolve to Embassy tokens). The only stylesheet is `tailwind.theme.css` (tokens + theme mapping). **This is the single source of truth for component code.**
2. **The documentation site** — `index.html` at the repo root (single-page app, canonical). The per-component `docs/*.html` pages are **retired redirect stubs** that bounce to the SPA.

> **Buildless CSS layer was deleted (2026-06).** `css/components/*.css` + the `css/components.css` barrel (the old "no-build, copy a CSS file" path) and the root `components/ui/*.tsx` thin wrappers were **removed** — the Tailwind components in `packages/ds` are the single source of truth. Each component's `Cuándo usar / Cuándo no` decision rule now lives in its `.tsx` header comment. The docs site's own chrome (hero/nav badges, CTA buttons, the token-tab switcher, the Vacantes mockup, the toast demo) carries those styles inline in `index.html`. Token files (`css/variables.css`, `css/base.css`, `css/layout.css`, `css/md-sys-bridge.css`) are **not** deprecated and remain the token source.

---

## Consuming the DS

### Tailwind (canonical)

In any Tailwind v4 project, import the theme once and copy/import components:

```css
/* your app's global stylesheet */
@import "@amalgama/ds/tailwind.theme.css";  /* tokens + theme mapping (the ONLY DS stylesheet) */
```

```tsx
import { Button } from "@amalgama/ds/button"   // self-contained — no extra CSS to copy
<Button variant="primary">Crear vacante</Button>
```

Each component file in `packages/ds/components/ui/` is the complete implementation. To vendor a component, copy its `.tsx` + `components/lib/utils.ts` (`cn()`); it needs only the theme import above.

### Tokens-only load order (no build)

The buildless **component** CSS was deleted (2026-06) — there is no `css/components.css` to link.
The **token** layer still exists and can be linked directly in a no-build artifact for
colors/typography/spacing; components themselves are Tailwind (see the Tailwind section above).
Load the tokens in this order:

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Epilogue:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/variables.css">     <!-- 1. tokens (required) -->
<link rel="stylesheet" href="css/md-sys-bridge.css"> <!-- 1b. optional: exposes MD3 --md-sys-color-* names as aliases of --color-* roles; load right after variables -->
<link rel="stylesheet" href="css/base.css">          <!-- 2. reset + typography base (required) -->
<link rel="stylesheet" href="css/layout.css">        <!-- 3. only for full app shell (sidebar, topbar, avatar) -->
```

For components, import the Tailwind theme (`@amalgama/ds/tailwind.theme.css`) and copy the `.tsx`.

**MD3 system bridge (`css/md-sys-bridge.css`)** — optional layer that aliases Material Design 3's real system-token names (`--md-sys-color-*`) onto Embassy's `--color-*` roles, and maps all `--md-sys-typescale-*-font` tokens to `var(--font-body)` (Inter) so `@material/web` components don't fall back to Roboto/serif. (After editing the bridge, bump the `?v=` on its `<link>` in `index.html` or the browser serves the cached old file.) Components that adopt MD3's component-token layer (currently **Segmented Button** — the reference pattern; see GOVERNANCE.md §2.2) default each token to `var(--md-sys-color-X, var(--color-X))`: with the bridge loaded they use Material's naming; without it they fall back to the Embassy role. Embassy's palette stays the single source of truth either way, and the bridge needs no dark override (the `--color-*` roles already recalibrate). This adopts MD3's token *structure*, **not** the `material-web` component implementations (evaluated June 2026 and rejected: maintenance mode + lacks ~70% of Embassy's components).

**Tokens are the law.** All colors via `var(--color-*)` or semantic aliases (`--accent`, `--bg`, `--border`), radii via `var(--radius-*)` (scaled by component size, never by variant — see GOVERNANCE.md §4.3), shadows via `var(--shadow-*)`, spacing via `var(--space-*)`. Never raw hex. Dark mode is automatic: set `data-theme="dark"` on `<html>` — the semantic `--color-*` layer recalibrates itself; components need zero per-theme overrides.

Fonts: **Inter** (body/UI), **Epilogue** (headings), **DM Mono** (code/labels) — always via `var(--font-body)` / `var(--font-heading)` / `var(--font-mono)`, never quoted family names in component code.

**Every `font-size` flows through a `--font-size-*` token** — never loose px. `base.css` binds h1–h6 to the scale (h1→`display` … h6→`heading-xs`); UI text uses `body-lg/md/sm`, `label`, `caption`, `overline`, `badge`. A legacy size with no exact token snaps to the nearest *role-appropriate* token, not a new px value.

**Icons: Lucide** (CDN `unpkg.com/lucide`, `<i data-lucide="…">` + `lucide.createIcons()`), stroke inherits `currentColor`. 18px inside chips/inputs, 20px in nav, 24px in search bars. One icon set per product — never mix.

**Breakpoints**: canonical values `--breakpoint-md: 768px`, `--breakpoint-lg: 1024px` live in `variables.css` (media queries can't consume `var()` — use the literal values and keep them in sync). The mobile sidebar/shell pattern is a pending design decision — flag it, don't improvise off-canvas patterns.

**Typography color is brand navy, not black.** Page text — headings AND body — uses `var(--text-primary)` = `primary-900` (`#01164D`) in light mode, recalibrated to `#EAEBED` in dark. Secondary text: `var(--text-secondary)`. `--color-on-surface` (near-black `#0A0C12`) is reserved for content *inside* components (chip labels, button text, table cells) — never for page typography. If Embassy page text renders black, a token is misapplied.

### React layer — the single source of truth (Tailwind, copy-paste portable)

**Component code lives in the `@amalgama/ds` package: `packages/ds/components/ui/*.tsx`.** Each component is **self-contained**: it defines all of its variants **in-file with Tailwind utility classes that resolve to Embassy tokens** (`bg-primary`, `text-on-surface`, `rounded-md`, `text-body-md`, …). There is **no per-component CSS file** — the component file *is* the complete, reusable implementation. Copy a component file (+ `packages/ds/components/lib/utils.ts` for `cn()`) into any Tailwind v4 project that imports the theme (`@amalgama/ds/tailwind.theme.css`) and it works immediately.

Pattern: `cva` (class-variance-authority) for variants + `cn()` (`packages/ds/components/lib/utils.ts`, an `extendTailwindMerge` that registers Embassy size/color tokens) + `React.forwardRef`. Peer deps: `react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss>=4`. Dark mode is automatic via `data-theme="dark"` — never add per-theme overrides in a component.

> The old root `components/ui/*.tsx` thin wrappers (which only applied buildless CSS classes like `btn-primary`) and the buildless `css/components/*.css` layer were both **deleted (2026-06)** — see the History note under Component inventory.

### Class conventions

The canonical components are **Tailwind `.tsx`** — read `packages/ds/components/ui/<name>.tsx` for variants, props, and the `Cuándo usar` rule in its header comment. (The legacy buildless class convention — flat kebab-case, additive variants like `btn-primary btn-danger`, `chip chip-selected`, `badge badge-open` — still appears in the docs-site chrome and in migration mappings, but is no longer the source of truth.)

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

Canonical component code is `packages/ds/components/ui/<name>.tsx` (Tailwind, self-contained). The **CSS** column below names the `css/components/*.css` files that were **deleted (2026-06)** — kept here only as a historical reference for each component's origin; the **React** column names the canonical component in `packages/ds/components/ui/`. The **Docs page** column points at `docs/*.html` files that are now **redirect stubs** to the SPA.

| Component | CSS — DELETED (`css/components/`) | React — canonical (`packages/ds/components/ui/`) | Docs page (`docs/` → redirect) |
|---|---|---|---|
| Button | `button.css` (`btn-primary/-secondary/-tertiary/-text`, `icon-btn`; sizes: `btn-xs/-sm/-lg/-xl`; modifiers: `btn-danger/-success/-compact`; radius scales with size: XS/SM→`--radius-sm`, MD/LG→`--radius-md`, XL→`--radius-lg`) | `button.tsx` | `button.html` |
| **Segmented Button** | `segmented-button.css` (`seg-btn-group`, `seg-btn`, `seg-btn.selected`; sizes: `seg-btn-group-sm/-lg`; color roles: MD3 `secondaryContainer`/`onSecondaryContainer` for selected, `onSurface` for unselected, `outline` for border; state layers via `color-mix()`) | — | — |
| Badge | `badge.css` (`badge badge-{open,active,closed,draft,archived,warning,tertiary,info}`) | `badge.tsx` | `badge.html` |
| **Chip** | `chip.css` (`chip`, `chip-selected`, `chip-elevated`, `chip-icon`, `chip-remove`, `chip-set`) | `chip.tsx` (`Chip`, `InputChip`, `ChipSet`) | `chip.html` |
| **Search** | `search.css` (`search-bar` + slots, `search-view` + `-fullscreen`, header/results) | `search.tsx` (`SearchBar`, `SearchView`, …) — **mobile/standalone variant.** Desktop/toolbar variant is `SearchField` in `toolbar.tsx` (see row below) — both are official Search variants, same state tokens, different shape/height. | `search.html` |
| Input / Select / Textarea | `form.css` | `input.tsx`, `select.tsx`, `textarea.tsx` | `input.html`, `select.html`, `textarea.html` |
| Card | `card.css` | `card.tsx` | `card.html` |
| Table | `table.css` | `table.tsx` | `table.html` |
| Tabs | `tabs.css` | `tabs.tsx` | `tabs.html` |
| Modal | `modal.css` | `modal.tsx` | `modal.html` |
| Toast | `toast.css` | `toast.tsx` | `toast.html` |
| Skeleton | `skeleton.css` | `skeleton.tsx` | `skeleton.html` |
| Empty State | `empty-state.css` | `empty-state.tsx` | `empty-state.html` |
| Stat Card | `stat-card.css` | `stat-card.tsx` | `stat-card.html` |
| Toolbar (+ `search-field`) | `toolbar.css` | `toolbar.tsx` (`Toolbar`, `SearchField`, `ToolbarButton`, `ResultCount`) — `SearchField` is the **desktop/toolbar variant of Search** (compact, `--radius-md`, shares state tokens with `SearchBar`) | `toolbar.html` |
| Page Header | `page-header.css` | `page-header.tsx` | — |
| Back Link | `back-link.css` | `back-link.tsx` | — |
| Description | `description.css` | `description-section.tsx` | — |
| Topbar / Sidebar / Avatar | `layout.css` (app shell) | — | `topbar.html`, `navigation.html`, `avatar.html` |

**shadcn primitives added (2026-07, shadcn-alignment pass):** `toggle.tsx` (Radix Toggle — foundation for Chip's filter state), `label.tsx` (Radix Label), `accordion.tsx` (Radix Accordion), `alert.tsx` (inline message, cva variants `default`/`info`/`success`/`warning`/`error`), `breadcrumb.tsx`, `collapsible.tsx` (Radix), `hover-card.tsx` (Radix), `scroll-area.tsx` (Radix), `aspect-ratio.tsx` (Radix), `pagination.tsx` (composes `buttonVariants`), `alert-dialog.tsx` (Radix — Action/Cancel compose `Button`). All follow the canonical shadcn structure/exports, themed with Embassy tokens; docs sections + nav entries added in `index.html`. See [[shadcn-alignment-audit-2026-07]] memory.

**Extended (domain-oriented):** Vacancy Card, Person Card, Kanban, Create Form, Placeholder — canonical React in `packages/ds/components/ui/` (`vacancy-card.tsx`, `person-card.tsx`, `kanban-card.tsx`, `create-form.tsx`, `placeholder.tsx`); the matching `css/components/*.css` were deleted (2026-06). Use for recruiting/HR product surfaces. Vacancy/Kanban cards now compose `Avatar`/`AvatarFallback` for their initials disc (2026-07) instead of hand-rolled markup.

**shadcn/Radix islands (interactive components, rendered in `index.html` only):** the
interactive components are React (shadcn/ui + Radix) + Tailwind v4, built in `islands/`
to `islands/dist/embassy-islands.{js,css}` and mounted into `[data-island]` slots in
`index.html`. They consume tokens via the Embassy→Tailwind bridge (`islands/src/styles.css`)
and import their implementations from the in-repo **`@amalgama/ds`** package at
**`packages/ds/`** (linked via `file:../packages/ds`; `@ds/*` alias → the package's
`exports`). This repo is a **monorepo**: `packages/ds/` is the single source of truth for
component code, the root is the docs + tokens + governance. (See `islands/INTEGRATION.md`.)
Covered: **checkbox, switch, radio, slider, menu (dropdown),
list, divider (separator), progress, chip, input/textarea, select, tabs, dialog, tooltip,
date picker, sheet, carousel, segmented-button, avatar, snackbar (sonner)** + domain cards
(kanban/person/vacancy).

> **History:** an earlier experiment rendered these via official `@material/web` web
> components. That runtime was **removed (2026-06)** — there are **0 live `<md-*>` elements**.
> `css/md-sys-bridge.css` stays (Embassy CSS + Segmented Button still consume `--md-sys-color-*`).
> Both the islands and the canonical components import their implementations from `@amalgama/ds`
> (`packages/ds`). The `css/components/*.css` files (button, badge, card, chip, search, etc.) and
> the `css/components.css` barrel were **deleted (2026-06)** — the docs site's own chrome was
> re-homed into `index.html`'s embedded `<style>`, and the `docs/*.html` pages became redirect
> stubs to the SPA. Do not recreate `css/components/*.css`; author components in `packages/ds`.

**Canonical Overview structure (all component pages):** badge → title → subtitle → 4 tabs
(Overview / Guidelines / Accessibility / Code) → key-characteristic bullets → single-mode
variant showcase → numbered references. **Show only one color mode at a time — no side-by-side
light/dark; examples follow the global theme toggle.** Note: in dark mode Embassy `--color-primary`
is white, so selected controls render white — see [[md3-structure-adoption]] memory.

Component relationships: filter **chips** refine **search** results (chips below the search bar) and toolbar filters. **Search has two official platform variants** (2026-07), same state tokens, different shape/context — not two separate components: **`SearchField`** (`toolbar.tsx`) is the compact desktop variant, used inside a `Toolbar` alongside `Select`/`ToolbarButton`; **`SearchBar`** (`search.tsx`) is the standalone 56px mobile/hero variant, which can expand into the full `SearchView`. Full guidance on which to use lives in the Search component's Guidelines tab ("Ubicación").

Every component CSS header now carries a **`Cuándo usar / Cuándo no / Reemplaza a`** block — that is the per-component decision rule (badge vs chip, modal vs toast, card vs stat-card, etc.). Agents must honor it when mapping legacy elements.

### Where to look things up (authoritative source per information type)

| Information | Authoritative source |
|---|---|
| Token values (colors, type scale, spacing, radii, shadows, breakpoints) | `css/variables.css` |
| Component code, variants, props, usage rules | `packages/ds/components/ui/*.tsx` (canonical, Tailwind in-file) |
| Per-component decision rule (`Cuándo usar / Cuándo no`) | the component's `packages/ds/components/ui/<name>.tsx` header comment |
| Usage guidelines / specs / accessibility (human depth) | root `index.html` |
| Migration / restyling rules | `MIGRATION.md` |
| Cross-component consistency rules, state patterns, audit checklist | `GOVERNANCE.md` |

The `docs/*.html` pages are retired redirect stubs — never read or cite them as a source.

---

## Adding a new component

Author the component in `packages/ds` as a **self-contained Tailwind component** — do **not** create a `css/components/*.css` file (that layer was deleted in 2026-06).

1. **Component first**: `packages/ds/components/ui/<name>.tsx` following the `cva` + `cn()` + `forwardRef` pattern. Define every variant in-file with Tailwind utilities that resolve to Embassy tokens (`bg-primary`, `text-on-surface`, `rounded-md`, `text-body-md`). No raw hex; must work in light and dark with zero per-theme overrides. Use `vacancy-card.tsx` / `button.tsx` as references. Carry the `Cuándo usar / Cuándo no` decision rule as a header comment in the `.tsx`.
2. **Theme additions (only if unavoidable)**: a pattern not expressible as atomic Tailwind utilities (e.g. a shimmer, a `::before` placeholder) goes in `packages/ds/tailwind.theme.css` under `@layer utilities` / `@utility`. Never add a token here that isn't a real DS token.
3. **Islands showcase**: add a showcase in `islands/src/islands/` and register it so the docs site can render it via a `[data-island]` slot; rebuild the islands bundle.
4. **Docs**: section in root `index.html` (Overview/Specs/Guidelines/Accessibility/Code tabs — use Button as the reference for depth). Do **not** create a `docs/<name>.html` page — that catalog is retired (redirect stubs only).
5. Cross-link related components (related-components cards + inline `navigate()` links).

---

## Working on the documentation site

The canonical docs app is **`index.html` at the repo root** (single-page, sections per component, tab system). The `docs/*.html` pages are **retired redirect stubs** that bounce to the SPA — there is no separate per-component catalog to keep in sync.

Structural references: **Material Design 3** and **Uber Base** — for documentation architecture, token structure, specs, behaviors and usage guidelines only. **Do not copy their visual style.** The DS must preserve Amalgama's identity: colors, typography, components, brand feel, tone and visual language.

Documentation conventions:

- Component sections follow MD3 depth: Overview / Specs / Guidelines / Accessibility / Code tabs.
- Spec measurement annotations in SVGs use the magenta annotation color (doc chrome, not a token).
- Static SVG mockups are light-mode illustrations by design; live examples must be token-driven and theme-aware.
- Spanish (rioplatense) for product/docs copy.
