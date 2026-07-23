# CLAUDE.md

This file is the **single source of truth for consuming and extending the Amalgama Design System**. It is read both by humans and by AI agents (e.g. the `design-system` skill) that apply the DS to other projects — internal tools, dashboards, artifacts, and platforms like presentations.amalgama.co.

This repo has two layers:

1. **The component library** — flat kebab-case CSS classes in `css/components/*.css` (e.g. `btn-primary`, `chip-selected`), each **self-contained** and consumed by linking `css/components.css` (all components) or copying the individual file you need — **no build step, no framework required**. Optional thin React wrappers live in `components/ui/*.tsx` for projects that want a typed component instead of raw classes; they apply the exact same CSS classes and add no styling of their own. **`css/components/*.css` is the single source of truth for component styling.**
2. **The documentation site** — `index.html` at the repo root (single-page app, canonical). The per-component `docs/*.html` pages are **retired redirect stubs** that bounce to the SPA. The docs site itself is plain HTML + vanilla JS (one inline `<script>` block driving SPA routing, tabs, sidebar, theme toggle, and every interactive component demo) — no build step, no React.

> **Reverted to buildless CSS + vanilla JS (2026-07).** Between 2026-06-22 and 2026-06-26 this repo was migrated to a Tailwind v4 + React/Radix (shadcn/ui) implementation (`packages/ds/`, `islands/`), which fully replaced `css/components/*.css`. That migration was **reverted** on 2026-07-17: `packages/ds/` and `islands/` were deleted, and every component + feature built during the Tailwind era (~70 commits: Charts, ~25 new shadcn-parity primitives — Accordion, Alert, Breadcrumb, Data Table, Command/Combobox, Context Menu, etc. — the Dialog/Sheet overlay restructure, the mobile nav shell, and the Embassy Playbook guidelines) was hand-ported into the restored buildless architecture as flat CSS + vanilla JS, so nothing built in that period was lost. A handful of the hardest, most library-dependent pieces (Chart, Data Table, Calendar/Date Picker, Command/Combobox, Carousel, Slider range mode, Input OTP, Form validation) were deliberately rebuilt as **simplified vanilla equivalents** rather than exact library-behavior clones — see each component's CSS header comment for what was simplified away. **(2026-07 parity pass:** several of these were subsequently restored to full shadcn parity in vanilla JS — Chart rich tooltip, Data Table row-selection/filter/column-visibility, Calendar month/year dropdown, Carousel vertical, Command ⌘K palette — plus a sweep of missing variants across the library; the full list and the intentional divergences kept are in **GOVERNANCE.md §21**.) Resizable panels were dropped entirely (no real use case beyond their own demo page) — flag it if you need one, don't improvise a drag-resize engine.

---

## Consuming the DS

### Buildless CSS (canonical)

In any project, no build step required:

```html
<link rel="stylesheet" href="css/variables.css">     <!-- 1. tokens (required) -->
<link rel="stylesheet" href="css/md-sys-bridge.css">  <!-- 1b. optional: MD3 --md-sys-color-* aliases -->
<link rel="stylesheet" href="css/base.css">           <!-- 2. reset + typography base (required) -->
<link rel="stylesheet" href="css/layout.css">         <!-- 3. only for full app shell (sidebar, topbar, avatar) -->
<link rel="stylesheet" href="css/components.css">     <!-- 4. all components — or copy one file from css/components/ -->
```

```html
<button class="btn-primary">Crear vacante</button>
```

Each file in `css/components/` is the complete implementation for that component — copy it standalone into another project (no other CSS to bring along beyond the token layer above). `css/components.css` is a barrel that `@import`s every file in `css/components/`; link it for the whole library, or skip it and link individual files for a smaller footprint.

**Tokens are the law.** All colors via `var(--color-*)` or semantic aliases (`--accent`, `--bg`, `--border`), radii via `var(--radius-*)` (scaled by component size, never by variant — see GOVERNANCE.md §4.3), shadows via `var(--shadow-*)`, spacing via `var(--space-*)`. Never raw hex. Dark mode is automatic: set `data-theme="dark"` on `<html>` — the semantic `--color-*` layer recalibrates itself; components need zero per-theme overrides.

Fonts: **Inter** (body/UI), **Epilogue** (headings), **DM Mono** (code/labels) — always via `var(--font-body)` / `var(--font-heading)` / `var(--font-mono)`, never quoted family names in component code.

**Every `font-size` flows through a `--font-size-*` token** — never loose px. `base.css` binds h1–h6 to the scale (h1→`display` … h6→`heading-xs`); UI text uses `body-lg/md/sm`, `label`, `caption`, `overline`, `badge`. A legacy size with no exact token snaps to the nearest *role-appropriate* token, not a new px value.

**Icons: Lucide** (CDN `unpkg.com/lucide`, `<i data-lucide="…">` + `lucide.createIcons()`), stroke inherits `currentColor`. 18px inside chips/inputs, 20px in nav, 24px in search bars. One icon set per product — never mix.

**Breakpoints**: canonical values `--breakpoint-md: 768px`, `--breakpoint-lg: 1024px` live in `variables.css` (media queries can't consume `var()` — use the literal values and keep them in sync). **Mobile shell:** below 768px the app-shell sidebar is a **modal navigation drawer** — off-canvas, slides in over a scrim on `.app.nav-open`, toggled by the `.shell-menu-btn` hamburger; shipped in `css/layout.css`, spec in GOVERNANCE.md §14.3. Use it; don't invent a different mobile nav.

**Typography color is brand navy, not black.** Page text — headings AND body — uses `var(--text-primary)` = `primary-900` (`#01164D`) in light mode, recalibrated to `#EAEBED` in dark. Secondary text: `var(--text-secondary)`. `--color-on-surface` (near-black `#0A0C12`) is reserved for content *inside* components (chip labels, button text, table cells) — never for page typography. If Embassy page text renders black, a token is misapplied.

### Optional React wrappers — `components/ui/*.tsx`

**Component styling lives in `css/components/*.css` — this is the single source of truth.** For React projects that want a typed component instead of raw classes, `components/ui/*.tsx` provides thin wrappers: `cva` (class-variance-authority) mapping `variant`/`size` props onto the flat CSS class names, `cn()` (`components/lib/utils.ts`, a plain `clsx` wrapper) for class merging, and `React.forwardRef`. These wrappers apply **zero Tailwind and zero extra styling** — they're a typed API surface over the same CSS classes anyone can use directly in plain HTML/JSX. Peer deps: `react`, `class-variance-authority`, `clsx`.

Not every component has a wrapper — domain/composition-only pieces (Vacancy Card, Person variant of Basic Card, Kanban Card, Create Form, Placeholder, Segmented Button) are CSS-only, applied via raw classes directly in markup; their doc pages say so explicitly rather than fabricating a wrapper that doesn't exist. Check `ls components/ui/` before assuming one exists for a given component.

Dark mode is automatic via `data-theme="dark"` on `<html>` — never add per-theme overrides in a component.

### Class conventions

Flat kebab-case, additive variants (`btn-primary btn-danger`, `chip chip-selected`, `badge badge-open`). Read `css/components/<name>.css` for that component's variants, states, and the `Cuándo usar / Cuándo no / Reemplaza a` decision rule in its header comment.

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

Canonical component code is `css/components/<name>.css`. The **React** column names the optional wrapper in `components/ui/` where one exists (`—` means CSS-only, no wrapper). The **Docs page** column points at `docs/*.html` files that are now **redirect stubs** to the SPA.

| Component | CSS — canonical (`css/components/`) | React (optional, `components/ui/`) | Docs page (`docs/` → redirect) |
|---|---|---|---|
| Button | `button.css` — variants: `btn-primary`(filled) · `btn-elevated`(tonal + real elevation, MD3 elevated button) · `btn-secondary`(tonal) · `btn-tertiary`/`btn-ghost`(outlined, alias) · `btn-text` · `icon-btn` · `btn-danger`/`btn-success`(modifiers) · `btn-next`; sizes `btn-xs/-sm/-lg/-xl` (radius scales with size, never variant); `btn-compact` | `button.tsx` | `button.html` |
| Segmented Button | `segmented-button.css` (`seg-btn-group`, `seg-btn`, `.selected`/`aria-pressed`; sizes `seg-btn-group-sm/-lg`; MD3 component-token layer via `--seg-btn-*` custom properties, each with a `var(--md-sys-color-X, var(--color-X))` fallback) — driven by `segSwitch()`/`segSwitchMulti()` in the app-shell script | `segmented-button.tsx` | — |
| Badge | `badge.css` (`badge badge-{open,active,closed,draft,archived,warning,tertiary,info}`, `label` variant) | `badge.tsx` | `badge.html` |
| Chip | `chip.css` (`chip`, `chip-selected`, `chip-elevated`, `chip-icon`, `chip-remove`, `chip-set`) | `chip.tsx` | `chip.html` |
| Search | `search.css` (`search-bar` + slots, `search-view` + `-fullscreen`) — mobile/standalone variant. Desktop/toolbar variant is `.search-field` in `toolbar.css` — both share state tokens, different shape/height. | `search.tsx` | `search.html` |
| Input / Select / Textarea | `form.css` (native `<input>`/`<select>`/`<textarea>`; `field-hint`/`field-error-msg`/`is-error`/`has-leading`/`has-trailing`) | `input.tsx`, `select.tsx`, `textarea.tsx` | `input.html`, `select.html`, `textarea.html` |
| Full Card | `card.css` (rich panel; `.card`=outlined/default, `.card-elevated`, `.card-filled`; `card-header/-title/-desc/-content/-footer/-action` sub-parts) — display name **Full Card**; par shadcn Card. Page id `c-basic-card`. | `card.tsx` | `card.html` |
| Table | `table.css` (`.table-scroll` wrapper for horizontal overflow) | `table.tsx` | `table.html` |
| Tabs | `tabs.css` (animated sliding `.tab-indicator`, full ARIA: `role="tablist/tab/tabpanel"`, roving `tabIndex`, Arrow/Home/End nav) | `tabs.tsx` | `tabs.html` |
| Dialog (+ Alert Dialog variant) | `modal.css` (borderless panel, `p-6`-equivalent padding + `gap-4`-equivalent spacing, absolute close button, stacked header title+description; `alertMode` prop disables Escape/outside-click dismissal for Alert Dialog) — driven by `openOverlay()`/`closeOverlay()` | `modal.tsx` | `modal.html` |
| Sheet (Bottom/Side/Top) | `sheet.css` — **the only edge-anchored panel** (`side="left"\|"right"\|"top"\|"bottom"`), slide-in via `--duration-sheet`/`--ease-emphasized` | `sheet.tsx` | — |
| Toast / Snackbar | `toast.css` (`.snackbar-viewport` stacking queue, `.snackbar--exit/-multiline/-static`) — real stacking queue via `showToast()`/`dismissToast()` + `components/lib/use-toast.ts` | `toast.tsx` | `toast.html` |
| Skeleton | `skeleton.css` | `skeleton.tsx` | `skeleton.html` |
| Empty State | `empty-state.css` | `empty-state.tsx` | `empty-state.html` |
| Stat Card | `stat-card.css` (`trend` prop → `stat-change-*` classes) | `stat-card.tsx` | `stat-card.html` |
| Toolbar (+ `search-field`) | `toolbar.css` | `toolbar.tsx` | `toolbar.html` |
| Page Header | `page-header.css` | `page-header.tsx` | — |
| Back Link | `back-link.css` | `back-link.tsx` | — |
| Description | `description.css` | `description-section.tsx` | — |
| Topbar / Sidebar / Avatar | `layout.css` (app shell) + `avatar.css` | `avatar.tsx` (Avatar only) | `topbar.html`, `navigation.html`, `avatar.html` |
| Accordion | `accordion.css` — CSS-only height animation (`grid-template-rows: 0fr → 1fr`), no JS measurement | `accordion.tsx` | — |
| Alert | `alert.css` (`default`/`info`/`success`/`warning`/`error`, reuses Badge's container/on-container token pairs) — distinct from Snackbar (Alert = inline/persistent, Snackbar = floating/ephemeral) | `alert.tsx` | — |
| Breadcrumb | `breadcrumb.css` (plain `<nav aria-label="breadcrumb">`/`<ol>`/`<li>`) | `breadcrumb.tsx` | — |
| Collapsible | `collapsible.css` — same grid-rows technique as Accordion, single boolean | `collapsible.tsx` | — |
| Pagination | `pagination.css` (reuses `.icon-btn`/`.btn-tertiary` states) | `pagination.tsx` | — |
| Scroll Area | `scroll-area.css` — pure CSS (`scrollbar-width`/`::-webkit-scrollbar`), no JS | `scroll-area.tsx` | — |
| Toggle | `toggle.css` (pressed state = `aria-pressed` attribute, `--color-secondary-container` — not Primary, which inverts to white in dark mode) | `toggle.tsx` | — |
| Toggle Group | `toggle-group.css` — deliberately distinct from Segmented Button (different container shape/use case: grouped toggles vs. view-switch pill), shares selection color only | `toggle-group.tsx` | — |
| Checkbox / Switch / Radio | `checkbox.css`, `switch.css`, `radio-group.css` — real native `<input type="checkbox"/"radio">` (`role="switch"` for Switch), keyboard/screen-reader semantics free | `checkbox.tsx`, `switch.tsx`, `radio-group.tsx` | — |
| Slider | `slider.css` — native `<input type="range">` restyled; range mode = two stacked inputs with `pointer-events` scoped to each thumb | `slider.tsx` | — |
| Tooltip / Rich Tooltip | `tooltip.css`/`rich-tooltip.css` — CSS-only positioning (`position:relative`/`absolute` + `transition-delay`), **no viewport-edge collision flip** (accepted simplification); Rich Tooltip is click-triggered with its own open/close state | `tooltip.tsx`, `rich-tooltip.tsx` | `tooltip.html` |
| Popover / Dropdown Menu / Context Menu / Menubar / Navigation Menu | `popover.css`, `dropdown-menu.css`, `context-menu.css`, `menubar.css`, `navigation-menu.css` — all consume one shared `components/lib/use-flyout.ts` hook (real viewport-edge-flip positioning via `getBoundingClientRect`, click-outside + Escape dismissal, roving arrow-key nav; no true focus-trap, no submenu/portal support) | `popover.tsx`, `dropdown-menu.tsx`, `context-menu.tsx`, `menubar.tsx`, `navigation-menu.tsx` | — (no standalone doc pages yet) |
| Command / Combobox | `command.css`/`combobox.css` — substring filtering (not fuzzy) + arrow-key/Enter nav + empty state via `initCommand()`; **⌘K Command Dialog** (`.command-dialog`); **Combobox** wired via `initCombobox()` (open/filter/select/check/close) | `command.tsx`, `combobox.tsx` | — (no standalone doc page yet) |
| Chart | `chart.css` — hand-drawn inline SVG (line/bar), CSS `conic-gradient` pie, `--chart-1..5` categorical tokens; **JS-positioned rich tooltip** (`initChartTooltips`: color indicator + label + value; `<title>` kept as a11y fallback); no legend animation/brush/zoom | `chart.tsx` | — |
| Data Table | `data-table.css` + `initDataTable()` over `[data-datatable]` — column sort (`aria-sort`), text filter, **row selection** (select-all + per-row + N-of-M count), **column-visibility** menu, slice pagination, empty state; no resize/pin/facets/virtualization | `data-table.tsx` | — (no standalone doc page) |
| Calendar (canonical) | `calendar.css`/`date-picker.css` — **dynamic** `Date`-math month renderer (`initCalendar()` on `[data-calendar]`); **single canonical page** (`c-calendar`, Overview=Basic). **Date Picker consolidated into Calendar (2026-07):** there is no separate Date Picker page — **Date Picker** (`.date-picker` trigger + popover panel, `toggleDatePicker()`) and **Date & Time Picker** (`.calendar-time-row` + `calTimeSync`) are documented **compositions** in Calendar's Specs/Guidelines/Code, still backed by `date-picker.css`. Patterns: month/year dropdown caption (`data-cal-caption="dropdown"`), range (`data-cal-mode="range"`), **presets** (`.calendar-with-presets` + `calApplyPreset`), **booked dates** (`data-cal-booked`, non-selectable), **custom cell size** (`--cal-cell` / `.calendar-sm`/`-lg`), **week numbers** (`data-cal-weeknumbers`, ISO-8601). Guidelines cover the presentations (inline · Popover · Dialog · Sheet). `Intl.DateTimeFormat` labels (no locale lib), absolute popover (no collision detection), no roving-grid keyboard (vanilla vs react-day-picker) | `calendar.tsx`, `date-picker.tsx` (composition wrapper) | — |
| Carousel | `carousel.css` — native CSS `scroll-snap-type` (horizontal **and vertical** via `.carousel-vertical`), Prev/Next via `scrollBy()`; no drag physics/autoplay/infinite loop, no `CarouselApi` escape hatch | `carousel.tsx` | `carousel.html` |
| Input OTP | `input-otp.css` — real `<input maxlength="1">` boxes, auto-advance/backspace-back/paste-splitting | `input-otp.tsx` | — (no standalone doc page) |
| Form | `form.css` (shared with Input/Select/Textarea) — native HTML5 validation + a plain `useFormField` hook, no react-hook-form/zod | `form.tsx` | — (no standalone doc page) |
| Resizable panels | **not implemented** — dropped in the 2026-07 revert (no real use case beyond its own demo); flag if you need one | — | — |
| Avatar / Divider / List / Progress | `avatar.css`, `divider.css`, `list.css`, `progress.css` | — (CSS-only, no wrapper) | `avatar.html` |
| Basic Card | `item.css` (**the reusable compact-row primitive**; display name **Basic Card**, classes `.item*`: `.item` + `item-outline`/`item-muted`/`item-sm`, `item-media`/`-icon`/`-image`, `item-content`/`-title`/`-description`/`-actions`/`-header`/`-footer`, `item-group`/`-separator`, `a.item`/`item-clickable`) — par shadcn **Item**; the base for every compact domain card. Page id `c-item`. | — (CSS-only) | — (under Cards) |
| Kanban / Vacancy Card, Create Form, Placeholder | `kanban.css`, `vacancy-card.css`, `create-form.css`, `placeholder.css` | — (CSS-only, no wrapper; used via raw classes directly in markup) | — |
| ↳ Person (variant of Basic Card) | `person-card.css` — **not a separate component**: a documented Person variant of Basic Card. Markup `.item item-outline item-clickable person-card`, avatar in `item-media`, name/role in `item-title`/`item-description`; the CSS only adds the brand gradient avatar + surface bg + hover-shadow. Depends on `item.css`. Old `c-person` page redirects to `c-item`. | — | — |

**Canonical Overview structure (all component pages):** badge → title → subtitle → 4 tabs
(Overview / Guidelines / Accessibility / Code — the tab switcher is real `.ds-comp-tabs`/`.ds-comp-tab-btn` markup driven by `switchCompTab()`, no framework) → key-characteristic bullets → single-mode
variant showcase → numbered references. **Show only one color mode at a time — no side-by-side
light/dark; examples follow the global theme toggle.** Note: in dark mode Embassy `--color-primary`
is white, so selected controls render white.

Component relationships: filter **chips** refine **search** results (chips below the search bar) and toolbar filters. **Search has two official platform variants**, same state tokens, different shape/context: **`.search-field`** (`toolbar.css`) is the compact desktop variant, used inside a Toolbar alongside Select/ToolbarButton; **`.search-bar`** (`search.css`) is the standalone 56px mobile/hero variant, which can expand into `.search-view`. Full guidance on which to use lives in the Search component's Guidelines tab ("Ubicación").

Every component CSS header carries a **`Cuándo usar / Cuándo no / Reemplaza a`** block — that is the per-component decision rule (badge vs chip, modal vs toast, card vs stat-card, etc.). Agents must honor it when mapping legacy elements.

**Embassy Playbook** (`guidelines/*.md`, 12 files) — UX principles + pattern guides (forms, tables, navigation, dashboards, feedback/states, responsive layout), mirrored on the docs site under the Playbook nav group. Pure content, no framework dependency — see the "Where to look things up" table below.

### Where to look things up (authoritative source per information type)

| Information | Authoritative source |
|---|---|
| Token values (colors, type scale, spacing, radii, shadows, breakpoints) | `css/variables.css` |
| Component code, variants, props, usage rules | `css/components/<name>.css` (canonical) + optional `components/ui/<name>.tsx` wrapper |
| Per-component decision rule (`Cuándo usar / Cuándo no`) | the component's `css/components/<name>.css` header comment |
| Usage guidelines / specs / accessibility (human depth) | root `index.html` |
| Migration / restyling rules | `MIGRATION.md` |
| Cross-component consistency rules, state patterns, audit checklist | `GOVERNANCE.md` |
| **UX principles, laws/heuristics, interaction patterns — how to build a good *screen*** | **`guidelines/` (the Playbook)** — see below |

The `docs/*.html` pages are retired redirect stubs — never read or cite them as a source.

### The Playbook (`guidelines/`) — how to build great screens, not just correct components

`GOVERNANCE.md` and the component docs tell you *what* is token-correct; the **`guidelines/`**
directory tells you *whether the screen is any good*. It is the product-thinking layer: UX
laws & heuristics, information architecture, visual hierarchy, content/UX writing,
accessibility, motion, and pattern playbooks (forms, tables, navigation, dashboards,
feedback/empty/loading/error states, responsive layout). Same content is mirrored on the
docs site under the **Playbook** nav group (Spanish).

**When generating or reviewing any new screen with Embassy, consult the relevant guide(s)
first** — start at [`guidelines/README.md`](guidelines/README.md). Rule of thumb: frame with
IA + visual hierarchy → pick the pattern guide → design empty/loading/error/success states
up front → write the copy → check the per-guide checklist (accessibility, motion, responsive)
before declaring it done. Token-correct but unusable is not done.

---

## Adding a new component

Author the component as a **self-contained flat-CSS file** in `css/components/`.

1. **CSS first**: `css/components/<name>.css` — flat kebab-case classes, additive variant/size modifiers, dark mode via existing `--color-*` tokens only (never a per-theme override block — `variables.css`'s `[data-theme="dark"]` block already recalibrates every token). Header comment: purpose, `Cuándo usar / Cuándo no / Reemplaza a`, dependencies, and a `Uso:` HTML snippet. If a component-scoped custom-property tier is genuinely useful (see Segmented Button's `--seg-btn-*`), define it locally in the component's own file — never add a token to `variables.css` for one component's internal use.
2. **Vanilla JS behavior (if needed)**: small, named functions added to `index.html`'s app-shell `<script>` block (or split into `js/app-shell.js`/`js/components.js` if it grows further) — plain DOM APIs, `data-*` attributes for state, no framework. Reuse an existing pattern first (`switchCompTab`, `openOverlay`/`closeOverlay`, the shared `components/lib/use-flyout.ts`-style positioning approach) before inventing a new one.
3. **Optional React wrapper**: only if a consuming React project would benefit — `components/ui/<name>.tsx`, `cva` + `cn()` + `forwardRef`, mapping props onto the flat CSS classes with zero extra styling.
4. **Docs**: section in root `index.html` (Overview/Guidelines/Accessibility/Code tabs — use Button as the reference for depth). Do **not** create a `docs/<name>.html` page — that catalog is retired (redirect stubs only).
5. Cross-link related components (related-components cards + inline `navigate()` links).

---

## Working on the documentation site

The canonical docs app is **`index.html` at the repo root** (single-page, sections per component, tab system, plain HTML + vanilla JS — no build step, no framework). The `docs/*.html` pages are **retired redirect stubs** that bounce to the SPA — there is no separate per-component catalog to keep in sync.

Structural references: **Material Design 3** and **Uber Base** — for documentation architecture, token structure, specs, behaviors and usage guidelines only. **Do not copy their visual style.** The DS must preserve Amalgama's identity: colors, typography, components, brand feel, tone and visual language.

Documentation conventions:

- Component sections follow MD3 depth: Overview / Specs / Guidelines / Accessibility / Code tabs.
- Spec measurement annotations in SVGs use the magenta annotation color (doc chrome, not a token).
- Static SVG mockups are light-mode illustrations by design; live examples must be token-driven and theme-aware.
- Spanish (rioplatense) for product/docs copy.
