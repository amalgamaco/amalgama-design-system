# GOVERNANCE.md — Embassy Design System Rules

This is the **governance contract** for the Amalgama Design System (Embassy). It defines the global patterns, token usage rules, and implementation standards that every component, page, and document in this repository must follow.

**Read order:**
- `CLAUDE.md` — how to build with the DS (consumption rules, load order, component inventory)
- `MIGRATION.md` — how to apply the DS to an existing product (transformation rules)
- **`GOVERNANCE.md` (this file)** — what must remain consistent across the entire DS (quality contract)

When a rule in a component file conflicts with this document, **this document wins.** The component file must be updated to comply.

---

## 1. Design System Principles

1. **Consistency over customization.** A component must look and behave identically wherever it is used — in a demo, in a spec, in a live product. Visual drift between contexts is always a bug.
2. **Reuse before creating.** Before adding a new token, pattern, or component, verify that an existing one doesn't already solve the problem. The cost of a new abstraction is paid by every future reader and every consumer of the DS.
3. **One source of truth.** Token values live in `css/variables.css`. **Component code (variants, contracts) lives in `css/components/*.css`** — flat, self-contained, no build step. Optional thin React wrappers live in `components/ui/*.tsx` and apply the same classes with zero extra styling. Behavior specifications live in `index.html`. Nothing else is authoritative. *(This repo was migrated to a Tailwind v4 + React/Radix implementation 2026-06-22→26, then that migration was **reverted** 2026-07-17 — `css/components/*.css` is canonical again; each component's `Cuándo usar / Cuándo no` decision rule lives in its CSS header comment.)*
4. **Semantic tokens only in component code.** Components must never reference primitive tokens directly (e.g. `--primary-900`, `--neutral-100`). They always go through a Color Role (`--color-primary`, `--color-disabled`). Primitives are referenced only in `css/variables.css` and in documentation that explicitly teaches the hierarchy.
5. **No per-theme overrides in components.** Semantic tokens recalibrate in `[data-theme="dark"]` inside `variables.css`. A component that needs a `[data-theme="dark"]` override block has chosen the wrong token.
6. **Zero hardcoded values.** No raw hex, no raw px for font-size or radius, no arbitrary `rgba()` outside `variables.css`. The only exception is computed values that cannot be expressed as a token reference (e.g. `color-mix()` expressions) — these are implementation expressions, not tokens, and must be documented as such.

---

## 2. Token Usage Rules

### 2.1 Hierarchy

```
Primitives  →  Color Roles  →  Semantic Aliases  →  (component code)
```

| Tier | Location | Examples | Who references it |
|---|---|---|---|
| **Primitives** | `css/variables.css` (top) | `--primary-900`, `--neutral-100`, `--secondary-200` | Color Roles only |
| **Color Roles** | `css/variables.css` (middle) | `--color-primary`, `--color-disabled`, `--color-focus` | Component CSS, aliases |
| **Semantic aliases** | `css/variables.css` (bottom) | `--bg`, `--border`, `--text-primary`, `--interactive` | Product CSS, layout code |
| **Component tokens** | _opt-in per component; see §2.2_ | `--seg-btn-selected-container-color` (segmented-button, MD3 layer) | That component's CSS only |
| **MD3 system aliases** | `css/md-sys-bridge.css` (optional) | `--md-sys-color-secondary-container` → `var(--color-secondary-container)` | Component tokens that adopt MD3 naming |

### 2.2 When a component may introduce its own token

Almost never — **with one sanctioned exception (the MD3 component-token layer, below)**. Outside that exception, a component token is justified only when:
- The value is specific to that component AND cannot be expressed as any existing Color Role
- The token will be consumed by 2+ files (not just the component's own CSS)
- A designer decision was made and documented

In all other cases, consume a Color Role directly. The `--button-secondary-*` tokens were eliminated precisely because they duplicated `--color-secondary-container` / `--color-on-secondary-container`.

#### Sanctioned exception — MD3 component-token layer

A component **may** declare a full component-token layer that mirrors Material Design 3's "Tokens and specs" table — **one custom property per MD3 component token**, declared on the component root, consumed by every rule. **Reference implementation: `css/components/segmented-button.css`** (canonical; the `--seg-btn-*` MD3 component-token layer is defined locally in the component's own file). This is normally a "shadow token" (§2.3) but is permitted here because it reproduces MD3's *documented three-layer architecture* (palette → system role → component token → CSS), making the component's spec table machine-mappable and each instance themeable by overriding one token.

Rules for adopting this pattern:
1. **Every** component token defaults to its MD3 system role via the bridge, with the Embassy role as fallback: `var(--md-sys-color-X, var(--color-X))`. Never default to a primitive or a hardcoded value.
2. Token names follow MD3's token path, kebab-cased and prefixed with the component (`md.comp.segmented-button.selected.container.color` → `--seg-btn-selected-container-color`).
3. The CSS rules consume **only** component tokens — never a `--color-*` role or `--md-sys-color-*` name directly.
4. The header comment carries the MD3-token → component-token → default mapping table.
5. Deliberate divergences from MD3 defaults (e.g. the focus ring) are documented in the header.

The **MD3 system bridge** (`css/md-sys-bridge.css`) exposes `--md-sys-color-*` (Material's real system-token names) as aliases of the Embassy `--color-*` roles. It is the only place those names are defined; it needs no dark override because the `--color-*` roles already recalibrate. It is optional to load — the `var(--md-sys-color-X, var(--color-X))` fallback keeps adopting components working without it (they resolve to Embassy roles directly).

**Component-tier state tokens — post-revert state (2026-07).** During the Tailwind era, component/family-specific state colors (elevated chip, search field, snackbar action/close, nav/menu) were routed through a `--md-comp-*` component tier defined in `packages/ds/css/hover-tokens.css` (mirrored in `islands/src/styles.css`). Both files were deleted when that architecture was reverted, and the `--md-comp-*` indirection layer did **not** get restored — it was Tailwind/islands-only infrastructure, not a design decision. What *did* survive, because `layout.css`'s nav styling depends on it, is the **navigation/menu family**: `--color-nav-hover`, `--color-nav-hover-content`, `--color-nav-press`, `--color-nav-selected`, `--color-nav-selected-content` are real named tokens, defined directly in `css/variables.css` (no `--md-comp-*` indirection — see §5.4 below for the full table). Every other family's state colors (chip-elevated, search-field, snackbar action/close) are now **inline `color-mix()` expressions in each component's own CSS file**, using the same percentages the old tier used, just not routed through a shared named token. This is a known simplification, not a design change — see §12 for the reconciliation entry. If you're adding a new component/family state, follow the pattern that's actually live: either add real tokens to `css/variables.css` (nav's approach, preferred if 2+ files will consume it) or an inline `color-mix()` expression scoped to that component's file (everyone else's current approach).

> Why this is **not** the rejected `material-web` path: this adopts MD3's token *structure and naming* in plain Embassy CSS (no build, no Lit, no Shadow DOM, Embassy palette as source of truth). It does **not** adopt MD3's component *implementations*. See the architecture note in this section's history (June 2026 evaluation: `material-web` is in maintenance mode and lacks ~70% of Embassy's components).

### 2.3 Prohibited patterns

| Pattern | Why prohibited | Correct alternative |
|---|---|---|
| Raw hex in component CSS (`color: #01164D`) | Breaks dark mode, undocumented | `var(--color-primary)` |
| Raw px for font-size (`font-size: 13px`) | Bypasses type scale | `var(--font-size-body-md)` |
| Raw px for border-radius (`border-radius: 8px`) | Bypasses radius scale | `var(--radius-md)` |
| `color-mix()` via primitive (`color-mix(in srgb, var(--secondary-900) …)`) | Bypasses Color Role | `color-mix(in srgb, var(--color-focus) …)` |
| Per-theme overrides in component files | Duplicates variables.css | Choose the correct semantic token |
| Duplicate token (`--my-component-primary: var(--color-primary)`) | Shadow tokens create drift | Reference `--color-primary` directly |
| `!important` for token values | Indicates wrong specificity or wrong token | Fix selector specificity |
| Undocumented aliases (`--my-blue`) | Invisible to consumers | Use a Color Role or document as a proper alias |

### 2.4 `--interactive` vs `--color-focus` (known divergence)

`--interactive = var(--color-secondary)` and `--color-focus = var(--secondary-900)` resolve to the same hex in light mode (`#4F80FF`). In dark mode they diverge: `--color-secondary` changes to `#B9CCFF` while `--color-focus` stays at `#4F80FF`. **Use `--color-focus` for all focus indicators.** `--interactive` is a legacy alias used in form.css and layout; do not introduce it into new components.

---

## 3. Component Consistency Rules

### 3.1 Single visual identity

A component has exactly one correct visual appearance. The live demo, the anatomy diagram, the spec measurements, the guidelines examples, and the real product implementation must all render the same result. Discrepancies between tabs (Overview vs Specs vs Guidelines vs Code) are documentation bugs.

### 3.2 What must not vary between contexts

| Property | Source of truth |
|---|---|
| Colors | `css/components/<name>.css` — `var(--color-*)` role references |
| Spacing (padding, gap) | `css/components/<name>.css` — `var(--space-*)` tokens or absolute px anchored in the component spec |
| Border radius | `css/variables.css` radius scale |
| Elevation (shadow) | `css/variables.css` shadow scale |
| Typography (size, weight, family) | `css/variables.css` font scale |
| Interactive states (hover, focus, disabled) | canonical patterns defined in Section 6 of this document |

### 3.3 Documentation demos use the real component

Anatomy diagrams, state demos, and usage examples must use the actual DS classes, not SVG approximations or inline-styled lookalikes. An anatomy diagram that visually diverges from the live button is wrong even if it "looks right" in isolation. Static SVG mockups are only acceptable for measurement annotations — the annotated component inside them must still render as real CSS.

### 3.4 No local visual overrides in demos

Documentation demos (`bst-strip`, `bd-anat-canvas`, `docs-demo-box` etc.) must not add inline styles that modify colors, sizes, or shapes beyond what the DS class provides. Acceptable inline overrides: `pointer-events: none` on non-interactive previews, `margin` for layout within demo containers.

### 3.5 Demo size context must be consistent across variants

When a demo row shows multiple variants of the same component at the same conceptual size, every variant in that row must use the same size modifier class. Mixing size classes in a single comparison demo produces false visual inconsistency and is a documentation bug.

When a variant has no DS class (e.g. an approximated Elevated button), its inline styles must match the active size context exactly — same `padding`, `min-height`, `font-size`, `border`, `border-radius`, and `line-height` as the sibling DS elements. An inline `border-radius` that differs from siblings is always wrong.

### 3.6 Buttons use a fixed five-size scale

Buttons have exactly five approved sizes. These are the only sizes that exist. Every property below is authoritative — documentation, examples, and product implementations must match exactly:

| # | Nombre | Clase CSS | Min-height | Padding V | Padding H | Font size | Font weight | Icon size | Gap | Radius |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Extra pequeño (XS) | `.btn-xs` | 24px | 3px | 8px | 11px | 600 | 12px | 8px | `--radius-sm` (4px) |
| 2 | Pequeño (SM) | `.btn-sm` | 32px | 6px | 12px | `--font-size-body-sm` (12.5px) | 600 | 14px | 8px | `--radius-sm` (4px) |
| 3 | Mediano (MD) | _(base, no class)_ | 36px | 8px | 24px | `--font-size-body-md` (13.5px) | 600 | 16px | 8px | `--radius-md` (8px) |
| 4 | Grande (LG) | `.btn-lg` | 44px | 10px | 22px | 15px | 600 | 16px | 8px | `--radius-md` (8px) |
| 5 | Extra grande (XL) | `.btn-xl` | 52px | 14px | 30px | 16px | **700** | 18px | 8px | `--radius-lg` (12px) |

Note: XL is the only size with `font-weight: 700`. All others use `font-weight: 600`. This is intentional — XL is reserved for hero/marketing surfaces where heavier weight reinforces visual impact.

**Rules:**
- No documentation, demo, or product implementation may introduce a button size that is not in this table.
- All documentation (Overview, Specs, Measurements, Anatomy, Guidelines, Code, audit pages) must label button sizes using these names and class names — never MD3 density labels (Small/Medium/Large/Extra Large/Extra Extra Large) or dp values.
- The source of truth for all pixel values is `css/components/button.css`. If a doc value conflicts with the component, the component wins and the doc must be updated.
- Every property in the table above (height, padding, font-size, font-weight, icon size, gap, radius) must be identical in every place a button of that size appears — token panels, anatomy diagrams, measurement SVGs, live demos, and product code.
- Border radius per size is defined in §4.3.

---

## 4. Shape & Radius System

### 4.1 The scale

| Token | Value | Intended use |
|---|---|---|
| `--radius-sm` | `4px` | Tags, small badges, tooltip corners, XS/SM buttons |
| `--radius-md` | `8px` | Inputs, cards (default), modal, chips, MD/LG buttons |
| `--radius-lg` | `12px` | Larger cards, drawers, sheet panels, XL buttons |
| `--radius-xl` | `16px` | Large surface containers |
| `--radius-full` | `9999px` | Chips (filter), badges, avatars, search bars |

### 4.2 Pill shape (`--radius-full`) is reserved for chips and badges

A button with `--radius-full` is visually indistinguishable from a chip. The pill shape communicates "selectable tag" — using it on a button breaks hierarchy and misleads users about the element's role. Buttons never use `--radius-full`.

### 4.3 Button radius scales with button size

Radius on buttons is determined by **size, not by variant**. All five variants (Primary, Secondary, Tertiary, Text, Icon) at the same size must compute to the same `border-radius`. The radius is set once per size in `css/components/button.css`:

| Size class | Token | Value | Min-height |
|---|---|---|---|
| XS (`btn-xs`) | `--radius-sm` | 4px | 24px |
| SM (`btn-sm`) | `--radius-sm` | 4px | 32px |
| MD (default, no modifier) | `--radius-md` | 8px | 36px |
| LG (`btn-lg`) | `--radius-md` | 8px | 44px |
| XL (`btn-xl`) | `--radius-lg` | 12px | 52px |

**Rules:**
- Variant classes (`btn-primary`, `btn-secondary`, etc.) never override `border-radius`.
- Documentation demos showing multiple variants at the same size must all compute to the same `border-radius`. Verify with `getComputedStyle(el).borderRadius`.
- An inline `border-radius` on any button element in an HTML demo is always a bug — apply the correct size class instead.
- When an approximated variant has no DS class (e.g. an Elevated button), its inline styles must exactly match the size context of sibling buttons in the same demo: same `padding`, `min-height`, `font-size`, `border`, `border-radius`, and `line-height`.

### 4.4 Radius must not be arbitrary

A component must use a radius token, not a computed or hardcoded intermediate value (`border-radius: 6px`, `border-radius: 10px`, `border-radius: calc(var(--radius-md) - 2px)`). If no token fits, this is a DS gap: the radius scale must be extended, not circumvented.

### 4.5 Inner/outer radius relationship

When a component has nested elements (e.g. a card with an inner image or an input with a prefix icon container), the inner element's radius = `outer radius − gap`. If the outer radius is `--radius-md` (8px) and the gap is 4px, the inner radius is 4px = `--radius-sm`. Do not apply `--radius-md` to both outer and inner — it creates visible corner mismatches.

---

## 5. Color System Rules

### 5.1 Color Role mapping by surface type

| Surface | Background | Foreground |
|---|---|---|
| Primary action (filled button, FAB) | `--color-primary` | `--color-on-primary` |
| Primary container (elevated button, primary chip) | `--color-primary-container` | `--color-on-primary-container` |
| Secondary / tonal action | `--color-secondary-container` | `--color-on-secondary-container` |
| Page / app background | `--color-surface` / `--bg` | `--color-on-surface` / `--text-primary` |
| Card, panel, dialog | `--color-surface-container` / `--card-bg` | `--color-on-surface` |
| Subtle container | `--color-surface-variant` | `--color-on-surface-variant` |
| Borders (resting state, strong — the border itself is the primary affordance) — Button tertiary/ghost/icon, Checkbox, Radio, Switch | — | `--color-outline` |
| Borders (resting state, subtle — text-entry / content fields) — Input, Textarea, Select, SearchBar, SearchField; also containers (cards/tables/panels) | — | `--border` (`color-mix(on-surface 10%, transparent)`) |
| Borders (filter/selection controls — Chip, Segmented Button) & decorative/dividers | — | `--color-outline-variant` |
| Borders (hover/disabled accent on subtle-tier fields) — Input, Textarea step up to a stronger frame on hover/disabled | — | `--color-outline` |
| Error / danger | `--color-error` | `--color-on-error` |
| Error container | `--color-error-container` | `--color-on-error-container` |
| Success | `--color-success` | `--color-on-success` |
| Warning | `--color-warning` | `--color-on-warning` |

### 5.2 `--color-on-*` rules

- Use the paired `on-*` token for content that sits on a Color Role surface. `--color-on-primary` belongs on `--color-primary` surfaces only.
- `--color-on-surface` is for component internals (chip labels, button text, table cells). **It is NOT for page headings or body text.** Page text uses `--text-primary` (`--primary-900` in light, `--neutral-50` in dark).
- Never approximate: don't use `--color-on-surface` where `--color-on-primary` is correct just because they look similar in one mode.

### 5.3 Disabled state — canonical pattern

```css
/* For components with a filled container: */
.component:disabled {
  background: var(--color-disabled);     /* --neutral-100 light / --neutral-600 dark */
  color: var(--color-on-disabled);       /* --neutral-300, same in both modes */
  border-color: transparent;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  pointer-events: none;
}

/* For components with a transparent container: */
.component:disabled {
  color: var(--color-on-disabled);
  cursor: not-allowed;
}
```

Do **not** use MD3's opacity model (`color-mix(in srgb, var(--color-on-surface) 38%, transparent)`) for disabled states in Embassy components. Embassy provides dedicated tokens; use them. The chip.css MD3 approach is a legacy inconsistency to be reconciled.

### 5.4 Hover state — canonical approaches

Embassy does not prescribe a single hover model across all variants, but the approach must be consistent within a given component family:

| Context | Approach | Token/expression |
|---|---|---|
| Filled, high-emphasis | Dedicated hover token | `var(--color-primary-hover)` |
| Tonal / container (color-mix darkening) | 12% black blend | `color-mix(in srgb, var(--color-XYZ) 88%, #000)` |
| State layer on transparent surface | 8% `onSurface` overlay | `color-mix(in srgb, var(--color-on-surface) 8%, transparent)` |
| State layer on filled container | 8% `on-container` overlay | `color-mix(in srgb, var(--color-on-XYZ) 8%, var(--color-XYZ-container))` |
| Text / ghost | 10% primary overlay | `color-mix(in srgb, var(--color-primary) 10%, transparent)` |
| Surface swap | Named surface token | `var(--color-surface-variant)` |
| **Menu-like / navigation** | **Shared "blue hover" tokens** | `var(--color-nav-hover)` + `var(--color-nav-hover-content)` |

A new component must declare its hover model in the CSS header comment and use it consistently for all its states.

#### Navigation / menu hover — the shared "blue hover" language (jul 2026)

Every **menu-like or navigation-like** surface — main app-shell nav (`.nav-item`), docs component side menu (`.ds-nav-item`), dropdown menus (`css/components/dropdown-menu.css`), lists (`css/components/list.css`), and search result rows (`css/components/search.css`) — shares **one** hover/selected vocabulary so hover reads **blue / light-blue, never neutral gray**. It is built on the `secondary` accent and defined once as semantic tokens directly in `css/variables.css`:

| Aspect | Token | Derivation |
|---|---|---|
| Hover background | `--color-nav-hover` | `secondary-container` @ 45% over transparent |
| Hover icon + label | `--color-nav-hover-content` | `secondary` (blue) |
| Pressed background | `--color-nav-press` | `secondary-container` @ 70% (transient, still weaker than the selected fill) |
| Selected background | `--color-nav-selected` | `secondary-container` (100%) |
| Selected icon + label | `--color-nav-selected-content` | `on-secondary-container` |

Hover/pressed are a **translucent fraction of `secondary-container`** — the *same family* the selected fill uses, one step lighter. This is deliberate: it (a) stays **visible in dark mode** where plain `secondary` is too light to register as a fill, and (b) mirrors the icon-rail's own hover-lighter-than-selected logic. The **lightness ramp `45% < 70% < 100%`** gives hover ≠ pressed ≠ selected on its own; the **different content color** (hover = `secondary` blue text; selected = `on-secondary-container` + bolder weight) reinforces hover ≠ selected. All recalibrate in dark via the `--color-*` roles (light `secondary-container` `#CAD9FF`; dark `#3A5BB0`).

Consume via `bg-[var(--color-nav-*)]` / `text-[var(--color-nav-*-content)]` (React) or the raw vars (CSS) — **never** a neutral `--color-on-surface-state-*` layer for a menu/nav item, and **never** a one-off blue token (the docs `--ds-accent`/`--ds-accent-bg` are documentation-chrome accents only — spec tables, kbd chips, callouts — and must NOT be used for nav/menu hover). Components with their own documented selection systems (Segmented Button → `primary-container`; Chip → chip states) are **not** menu-like and keep their own models.

**Every menu-like/nav surface uses these tokens — no exceptions, no per-item overrides:** dropdown menus, lists, search result rows, the app-shell main nav (`.nav-item`), and *all* docs-shell navigation — the icon **rail** (`.ds-rail-btn` + its `.ds-rail-icon-wrap` pill), drawer items (`.ds-nav-item`), solo items (`.ds-nav-solo`), group-label hovers (`.ds-nav-group-name`/`-toggle`), and the mobile menu button (`.ds-menu-btn`). If two items in the same menu (or two menus in the same shell) hover differently, a surface is off-token — fix the surface, don't add a local color.

### 5.5 State layers — MD3 model

Material Design 3 defines **state layers** as translucent overlays that communicate interaction states without permanently altering the component's color. Embassy follows this model exactly, with `color-mix()` as the CSS implementation.

#### The opacity is a standard percentage — currently applied as a literal (post-2026-07-revert state)

During the Tailwind era, these opacities were routed through named `md.sys.state.*` system tokens defined in `packages/ds/css/hover-tokens.css` (mirrored in `islands/src/styles.css`). Both files were deleted in the 2026-07-17 revert, and that named-token indirection did **not** get restored — components now apply the percentage directly inline in each `color-mix()` expression. **The percentages themselves are still the standard, non-negotiable values below** — this is a loss of indirection, not a design change. If you're introducing a state-layer color in a new component, use the correct percentage from this table inline; if the same derived color needs to be shared across 2+ files, promote it to a real named token in `css/variables.css` rather than reintroducing a parallel `--md-sys-*` tier for one case (see §12 for the reconciliation entry tracking a proper shared-token reintroduction).

```css
/* current pattern — literal percentage, scoped to the component's own file */
background: color-mix(in srgb, var(--color-on-surface) 8%, transparent); /* hover */
```

| Interaction | Opacity |
|---|---|
| Hover | 8% |
| Focus | 10% |
| Pressed | 10% |
| Dragged | 16% |
| Disabled content | 38% |
| Disabled container | 12% |

> **History:** pressed was originally an ad-hoc 12–16% per token (primary 16%, on-surface 12%) and focus was 12%; both were unified to the MD3 spec (pressed 10%, focus 10%) during the Tailwind era via the now-deleted opacity-token layer. The unified *values* in the table above are what's live in the restored components (verify against `css/components/chip.css`'s `color-mix()` calls, which use 8%/12%/38% consistently) — only the shared-token mechanism was lost, not the reconciliation itself. Non-state hover *darkens* (`--color-primary-hover`, `--color-secondary-container-hover`) and the input `--color-error-ring` halo are intentionally **not** state layers and keep their own values.

#### State layer color by surface type

The state layer color is always the **"on" token** of the surface the interaction occurs on:

| Surface | State layer color | Example expression |
|---|---|---|
| Transparent / unselected segment | `--color-on-surface` | `color-mix(in srgb, var(--color-on-surface) 8%, transparent)` |
| `secondaryContainer` (selected segment) | `--color-on-secondary-container` | `color-mix(in srgb, var(--color-on-secondary-container) 8%, var(--color-secondary-container))` |
| `primaryContainer` | `--color-on-primary-container` | `color-mix(in srgb, var(--color-on-primary-container) 8%, var(--color-primary-container))` |
| `inverseSurface` (snackbar) | `--color-inverse-on-surface` | `color-mix(in srgb, var(--color-inverse-on-surface) 8%, transparent)` |

#### Implementation note

MD3's reference implementation (Material Web Components) uses `::before` pseudo-elements for state layers. Embassy uses `color-mix()` directly on `background` — a mathematically equivalent approach that produces the same computed color without requiring wrapper markup or `position: relative` on every component.

**Divergence from MD3:** Embassy's `color-mix()` model composites the state layer into the background at paint time, whereas MD3's pseudo-element model layers it visually on top. For solid surfaces the result is identical. The deviation is documented here as a deliberate implementation choice, not a design departure.

### 5.6 Selected state

Selected state uses the **Secondary family** — never `--color-primary`. Primary flips to white in dark mode (Embassy's dark-mode definition), which reads as "no color" for a passive selection indicator and breaks visual consistency with every other selected/active state in the library. Secondary stays a consistent blue in both themes. A selected state must have a clear visual distinction from hover — do not rely solely on color to communicate selection (Tabs also gains `font-semibold`; Chip/Segmented Button already gain a filled container).

The mapping splits by anatomy, not by "emphasis" (the previous wording here allowed both and caused Tabs to drift onto `--color-primary` — do not reintroduce that branch):

| Anatomy | Selected treatment | Components |
|---|---|---|
| Has a container (pill/segment) | `--color-secondary-container` (MD3 `secondaryContainer`) fill + `--color-on-secondary-container` (MD3 `onSecondaryContainer`) content | Chip |
| Has a container (pill/segment), lighter "Option B" variant | `--color-primary-container` (MD3 `primaryContainer`) fill + `--color-on-primary-container` (MD3 `onPrimaryContainer`) content | Segmented Button |
| Text-only, no container (underline/indicator) | `--color-secondary` directly, on both the label and the indicator | Tabs |

`--color-primary` is reserved for actual page-level/sidebar navigation active state, which lives in the docs shell's own chrome (`index.html`), not in the component library — it is out of this rule's scope, not a second option for it.

**Segmented Button — softer "Option B" variant (2026-06):** the segmented button uses a *lighter* tonal selection — container `--color-primary-container` + content `--color-on-primary-container`, with an `--color-outline-variant` frame and `--color-on-surface-variant` unselected labels. This is a deliberate, documented deviation from the MD3 segmented-button spec (which assigns `secondaryContainer`): it stays within MD3 *roles* and the tonal-selection principle while reading lighter/cleaner. Canonical token mapping lives in `css/components/segmented-button.css` and the component's Specs → Color Roles table.

**Chip — outline-variant frame (2026-07):** unselected Chip's border was `--color-outline` — identical to Button tertiary/ghost/icon's border, so the two components read as the same control when placed side by side, even though Chip is meant to feel like a lighter-weight filter/metadata control, not a primary action. Fixed by moving Chip's frame to `--color-outline-variant`, the same token (and the same rationale) already used by Segmented Button's "Option B" frame above — no new token, just correcting Chip's tier assignment in the borders table (§5.1). Button (tertiary/ghost/icon), Checkbox, Radio and Switch keep `--color-outline` unchanged; they remain the stronger resting-border tier. Canonical mapping lives in `css/components/chip.css`.

**Search Bar / Search Field — shared subtle-border tier, not a new one (2026-07):** `.search-field` (`toolbar.css`), the desktop/toolbar variant of Search, reuses `SearchBar`'s existing `--border` frame and `--search-field-hover/-focus/-border-hover` state tokens — the same subtle resting-border tier already used by Input/Textarea/Select (§5.1). This is why it integrates cleanly into a toolbar row next to `.select`: they already shared a border tier before this decision, it just hadn't been documented as an intentional Search/Select pairing. `.search-field` differs from `.search-bar` only in shape (`--radius-md` vs. pill) and height (padding-driven vs. fixed 56px) — not in color role. Canonical mapping lives in `css/components/toolbar.css` and `css/components/search.css`.

---

## 6. State System

Every interactive component must implement all applicable states from this table. Omitting a state is an accessibility defect.

### 6.1 State token contracts

| State | CSS pseudo / attribute | Required implementation |
|---|---|---|
| **Default** | (none) | Component base styles |
| **Hover** | `:hover:not(:disabled)` | Background or border change per Section 5.4. `transform: translateY(-1px)` optional for buttons. |
| **Focus** | `:focus-visible` | See 6.2 |
| **Pressed / Active** | `:active:not(:disabled)` | State layer or `filter: brightness()` per component spec. `transform: translateY(0)` where hover used translateY. |
| **Disabled** | `:disabled` or `[aria-disabled="true"]` | See Section 5.3 |
| **Selected** | `.selected`, `[aria-selected="true"]`, `[aria-pressed="true"]` | Filled container with `--color-secondary-container` or `--color-primary` |
| **Error** | `.is-error` | `--color-error` border; `--color-error-ring` ring on focus |
| **Loading** | `[aria-busy="true"]` | Spinner + `pointer-events: none` |

### 6.2 Focus — canonical pattern (mandatory for all interactive components)

```css
.component:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--color-focus-ring);
}
```

**Rules:**
- Always `:focus-visible`, never `:focus`. `:focus` fires on mouse click and degrades the experience for mouse users.
- Outline: `2px solid` — never `1px`, never `3px`.
- Outline offset: `2px` — ensures the focus ring clears the component's own border.
- Ring: `0 0 0 4px` — the spread is always 4px. Exceptions must be documented as deliberate DS decisions.
- Token: always `--color-focus` for the outline color and `--color-focus-ring` for the ring shadow. Never `--interactive`, never `--color-secondary`, never hardcoded blue.
- `--color-focus = var(--secondary-900) = #4F80FF`. It has **no dark mode override** — this is intentional: the focus ring provides a consistent accessibility signal regardless of theme.
- `--color-focus-ring = rgba(79,128,255,.15)`. It is currently hardcoded rather than derived from `--color-focus` — a known architectural debt. Do not replicate this pattern; use `color-mix(in srgb, var(--color-focus) 15%, transparent)` in any new component that needs a custom ring.

**Known deviations to reconcile:**

| Component | Deviation | Status |
|---|---|---|
| `form.css` | Uses `--interactive` (border) + `:focus` + 3px ring | Pending alignment |
| `description.css` | Inset ring, `:focus`, 2px | Pending alignment |

### 6.3 State layers — implementation contract

See **§5.5** for the full MD3 state layer model, opacities, and implementation rationale. Components that use state layers must:

1. Declare the state layer color in the CSS header comment under "Color Roles" (using MD3 role names).
2. Apply 8% opacity for `:hover`, 12% for `:active` / `:focus-visible`.
3. Use the `on-*` token paired to the component's current surface as the state layer color — never invent a component-specific tint color.
4. Keep separate `:active` rules for selected vs. unselected surfaces when the surface token differs between those states.

**Components currently using state layers:** `segmented-button.css`, `chip.css` (partial — reconciliation pending), `snackbar-action` in `toast.css`.

---

## 7. Spacing System

### 7.1 The scale

| Token | Value | Primary use |
|---|---|---|
| `--space-1` | `4px` | Icon gaps, micro-separators |
| `--space-2` | `8px` | Inline element gaps, icon-to-label |
| `--space-3` | `12px` | Badge/chip padding, tight rows |
| `--space-4` | `16px` | Compact card padding, field gaps |
| `--space-5` | `20px` | Form field vertical gaps |
| `--space-6` | `24px` | Standard card padding, section gaps |
| `--space-8` | `32px` | Medium section padding |
| `--space-10` | `40px` | Block separators |
| `--space-12` | `48px` | Main content padding |
| `--space-16` | `64px` | Section separators |
| `--space-20` | `80px` | Hero / large section padding |

### 7.2 Rules

- All padding and gap values in component CSS must use a `--space-*` token **or** a fixed value explicitly specified in the component's design spec (e.g. `padding: 8px 24px` for the default button). Fixed values in specs are pinned intentionally — they are not approximations of the nearest token.
- Do not use arbitrary in-between values (`padding: 10px`, `gap: 6px`) without a documented reason.
- Component-to-component spacing (the gap between two cards, the margin between a button and a form) must use `--space-*` tokens, never hardcoded values.
- Touch targets: minimum 44×44px for interactive elements per WCAG 2.5.5. The button's 36px default height is acceptable because it gains visual mass from its filled background; ensure `min-height` is set on small variants.

---

## 8. Typography System

### 8.1 Font families

| Role | Token | Family |
|---|---|---|
| Body / UI text | `--font-body` | Inter |
| Headings / display | `--font-heading` | Epilogue |
| Code / mono / labels | `--font-mono` | DM Mono |

Never use quoted family names (`font-family: 'Inter', sans-serif`) in component code. Always use `var(--font-body)`.

### 8.2 Type scale

| Token | Size | Line-height | Typical use |
|---|---|---|---|
| `--font-size-display` | 28px | 1.15 | Hero headings |
| `--font-size-heading-xl` | 24px | 1.2 | Section h2 |
| `--font-size-heading-lg` | 22px | 1.25 | h3 |
| `--font-size-heading-md` | 18px | 1.3 | h4, card titles |
| `--font-size-heading-sm` | 17px | 1.35 | h5 |
| `--font-size-heading-xs` | 15px | 1.4 | h6, small section headers |
| `--font-size-body-lg` | 14px | 1.5 | Body copy, list items |
| `--font-size-body-md` | 13.5px | 1.5 | **Default**: inputs, buttons, table cells |
| `--font-size-body-sm` | 12.5px | 1.6 | Secondary / supporting text |
| `--font-size-label` | 13px | 1.4 | Form labels, column headers |
| `--font-size-caption` | 12px | 1.4 | Helper text, timestamps |
| `--font-size-overline` | 12px | 1.2 | Uppercase table headers |
| `--font-size-badge` | 11.5px | 1.2 | Badge text, chip labels |

### 8.3 Rules

- **Every `font-size` in component CSS uses a `--font-size-*` token.** No raw px.
- Font weight via `--font-weight-*` tokens: regular (400), medium (500), semibold (600), bold (700), extrabold (800).
- Page text (headings AND body) uses `--text-primary` = `--primary-900` in light (`#01164D`). It is brand navy, not near-black. If text renders as `#0A0C12` (neutral-900 / `--color-on-surface`), the wrong token was used.
- `--color-on-surface` is for content inside components (button labels, chip text, table cells), not page typography.
- Sentence case for UI labels. Title case only in top-level headings and page titles.

---

## 9. Shape & Elevation System

### 9.1 Shadow scale

| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 3px rgba(28,36,56,.06)` | Cards at rest, elevated buttons at rest |
| `--shadow-md` | `0 4px 16px rgba(28,36,56,.08)` | Elevated buttons on hover, floating panels |
| `--shadow-lg` | `0 8px 32px rgba(28,36,56,.12)` | Modals, drawers, toasts |

Shadows are currently not dark-mode-aware (no dark override in `variables.css`). On dark surfaces, `--shadow-sm` at `rgba(28,36,56,.06)` is nearly invisible. This is a known gap. Do not compensate by hardcoding a dark shadow in component CSS — flag it as a DS gap.

### 9.2 Elevation principle

Components that lift off the surface (elevated buttons, floating panels, modals) communicate elevation via shadow, not by changing their background color to something lighter. The shadow token communicates depth; the background token communicates role.

---

## 10. Documentation Rules

### 10.1 Section structure — five tabs, always in this order

```
Overview  |  Specs  |  Guidelines  |  Accessibility  |  Code
```

Never add a sixth tab without a DS-wide decision. The Button component is the reference for documentation depth.

### 10.2 Anatomy diagrams

- Use real component HTML with actual DS classes — never SVG approximations.
- Pin markers are CSS-positioned circles (`bd-anat-pin`) with `::after` connector lines, numbered 1, 2, 3.
- The canvas (`bd-anat-canvas`) uses `position: relative` with `overflow: visible` and enough padding to accommodate pin markers.
- Each pin has a corresponding legend item that describes the part, its token, and its spec value.
- Anatomy diagrams are live components and must adapt to the current theme — no `data-theme="light"` overrides.

### 10.3 Measurement annotations

- Use the `bd-spec-*` SVG annotation system with the magenta annotation color (`#FF00FF`) — this is documentation chrome, not a DS token.
- Annotations show exact values from the component spec (e.g. `8px`, `36px`, `--radius-md`). Never approximate.
- Static SVG measurement diagrams are light-mode only by design. The annotated component inside them must still reference real DS classes.

### 10.4 Token & Specs tables

- Table structure: `bt-tok-table` with columns **Token / Rol / Claro / Oscuro**.
- Each row documents a CSS custom property reference. Computed CSS expressions (`filter: brightness()`, `color-mix()`, `translateY()`) are not tokens and must be labeled as implementation expressions in the `bt-tok-note` column.
- When a token has no dark mode override, use `colspan="2"` for the combined light/dark cell and add a note: "sin variación en dark."
- Show the primitive mapping for focus and disabled tokens to make the hierarchy chain explicit: `--color-focus = var(--secondary-900) · sin variación en dark`.
- The section description must state that all tokens are **Embassy Color Roles** defined in `css/variables.css` — not MD3 tokens, not component-specific aliases.

### 10.5 Guidelines

- Hierarchy table must list all variants in emphasis order (highest to lowest).
- "Cuándo usar / No usés cuando" table must cover all variants.
- Include "Estilos de color" (dos/don'ts) with at least one anti-pattern.
- One Primary action per context is a rule, not a recommendation. Document it as such.

### 10.6 State demos

- State demos use `bst-strip` divs with live component instances.
- Every interactive component documents at minimum: default, hover, focus, pressed, disabled.
- Checked/selected variants document their on/off pair.

### 10.7 Language

Documentation copy is **Spanish (rioplatense)**. Code, token names, and class names are English. This file and `CLAUDE.md` and `MIGRATION.md` are written in English because they target both human engineers and AI agents.

---

## 11. Design System Audit Checklist

Use this checklist when adding a new component or updating an existing one.

### 11.1 Component file (`css/components/<name>.css`)

Author as a self-contained flat-CSS file (see CLAUDE.md's "Adding a new component"). **This is the single source of truth** — an optional thin React wrapper in `components/ui/<name>.tsx` may follow, applying the same classes with zero extra styling.

- [ ] Header comment includes: description, `Cuándo usar`, `Cuándo no`, `Reemplaza a`, `Dependencia`, `Uso:` HTML snippet
- [ ] Flat kebab-case classes; variants/sizes as additive modifier classes (`btn-primary btn-danger btn-sm`), never BEM
- [ ] Zero raw hex — color via `var(--color-*)` role tokens
- [ ] Zero arbitrary font sizes — use the scale (`var(--font-size-body-md)`, `var(--font-size-label)`, …)
- [ ] Border radius uses `var(--radius-sm/md/lg/xl)`; for buttons, size-to-radius mapping matches §4.3 (same size = same radius for all variants)
- [ ] Shadow uses `var(--shadow-sm/md/lg)`; font families use `var(--font-body)` / `var(--font-heading)` / `var(--font-mono)`
- [ ] Focus: the canonical `:focus-visible` pattern (§6.2) — `--color-focus` outline + `--color-focus-ring` halo
- [ ] Disabled: the canonical pattern (§5.3) — `--color-disabled` / `--color-on-disabled`
- [ ] Hover / pressed states declared and consistent within the component
- [ ] No `[data-theme="dark"]` override block in the component file (dark mode is automatic via the token layer recalibrating in `variables.css`)
- [ ] No new token in `variables.css` for a single component's internal use — if a component-scoped custom-property tier is genuinely useful (see Segmented Button's `--seg-btn-*`), define it locally in the component's own file

### 11.1a Motion

See the Motion page (Styles) for the full token reference and transition-pattern spec.

- [ ] No raw easing/duration values (`ease-in-out`, `150ms`, inline `"stroke .3s ease"`) — always `var(--duration-fast/normal/medium/slow)` + `var(--ease-default/enter/exit)`
- [ ] Directional asymmetry respected: exit uses a shorter duration and `--ease-exit`; enter uses `--ease-enter` (never the same duration for both on anything larger than the fast tier)
- [ ] Enter/exit overlays (Dialog, Sheet, Dropdown, Popover, Tooltip) declare **both** `[data-state="open"]` and `[data-state="closed"]` CSS attribute-selector rules (see `accordion.css`/`collapsible.css` for the live pattern) — an entrance without a matching exit is a gap, not a style choice. **Known current gap (2026-07):** Dialog/Modal and Toast/Snackbar's `openOverlay()`/`closeOverlay()` close synchronously via `display:none` with no exit transition — only Toast's dedicated `dismissToast()` has a real timed exit. Don't replicate the instant-close pattern in a new component; treat it as debt to fix, not a precedent.
- [ ] If the component enters/exits, it maps to one of the adopted transition patterns (Enter and exit / Lateral / Top level / Skeleton loaders) documented on the Motion page — a pattern not on that list is a gap to flag, not one to improvise
- [ ] Continuous/looping animations (shimmer, indeterminate spinners) are exempt from the enter/exit tokens — they're a different category

### 11.2 Dark mode verification

- [ ] Load the page with `data-theme="dark"` on `<html>` — all states readable, no inverted-contrast anomalies
- [ ] Disabled state readable (text contrast ≥ 3:1 against disabled background)
- [ ] Focus ring visible against dark surfaces

### 11.3 Token hierarchy

- [ ] No primitive tokens (`--neutral-*`, `--primary-*`) used in component styles
- [ ] No duplicate tokens introduced (`--my-component-primary`)
- [ ] No undocumented aliases
- [ ] If a new Color Role was needed, it was added to `variables.css` with a dark-mode override if required

### 11.4 Documentation

- [ ] 5-tab section in `index.html` (Overview / Specs / Guidelines / Accessibility / Code)
- [ ] Anatomy diagram uses real DS classes (not SVG lookalike)
- [ ] Token table uses `bt-tok-table` format with correct Claro/Oscuro columns
- [ ] Token notes clarify: Color Role, primitive source, dark mode behavior
- [ ] State demos in `bst-strip` cover: default, hover, focus, pressed, disabled (+ selected if applicable)
- [ ] "Cuándo usar / No usés cuando" table is complete

### 11.5 Accessibility

- [ ] Color contrast ≥ 4.5:1 for normal text in both light and dark
- [ ] Color contrast ≥ 3:1 for large text and UI components
- [ ] Focus ring visible: `--color-focus` outline + `--color-focus-ring` ring
- [ ] Interactive elements have accessible names (`aria-label` or visible label)
- [ ] Disabled state uses `disabled` attribute (not only visual styling) OR `aria-disabled="true"` + `pointer-events: none`
- [ ] `role` and `aria-*` attributes documented in the Accessibility tab

### 11.6 React API (optional — only if a wrapper is warranted)

Not every component needs one — domain/composition-only pieces (Vacancy Card, Person variant of Basic Card, Kanban Card, Create Form, Placeholder, Segmented Button) are CSS-only by design; don't fabricate a wrapper where the project doesn't need one.

- [ ] Pattern: `cva` (class-variance-authority) + `cn()` from `components/lib/utils.ts` + `React.forwardRef`
- [ ] Maps props onto the flat CSS classes from `css/components/<name>.css` — zero extra styling, zero Tailwind utilities, zero inline styles beyond what the demo itself needs
- [ ] `disabled` prop wires to the HTML `disabled` attribute
- [ ] `aria-busy` wired for loading states
- [ ] Added to `components/ui/` under the matching filename; no package/bundle step involved — the file itself is the deliverable

### 11.7 Cross-references

- [ ] Component inventory table in `CLAUDE.md` is updated
- [ ] Related components are cross-linked in each other's `index.html` sections

---

## 12. Known Inconsistencies (to be resolved)

These are documented deviations from the rules in this document. They exist in the current codebase and must be reconciled in a future pass — not replicated.

### 12.1 Focus pattern deviations

| File | Inconsistency | Correct pattern | Priority |
|---|---|---|---|
| `form.css` | Uses `--interactive` (border) for focus, `:focus` not `:focus-visible`, 3px ring | `outline: 2px solid var(--color-focus)` on `:focus-visible`, 4px ring | High |
| `description.css` | Inset focus ring, `:focus`, 2px only | Standard `:focus-visible` pattern | Medium |
| `search.css` | `.search-bar:focus-within` uses only background color change — no ring | Add `outline` + `box-shadow` ring | High |
| `toolbar.css` | `.search-field:focus-within` border gets **lighter** on focus — wrong direction | Add ring; border should darken or add `--color-outline` | High |

### 12.2 Token misuse

| File | Inconsistency | Correct pattern | Priority |
|---|---|---|---|
| `form.css` | Disabled background: `--color-surface-variant` instead of `--color-disabled` | `var(--color-disabled)` | Medium |
| `chip.css` | MD3 opacity model for disabled instead of `--color-disabled` / `--color-on-disabled` | Embassy dedicated disabled tokens | Medium |
| `variables.css` | `--color-focus-ring` hardcoded as `rgba(79,128,255,.15)` instead of derived from `--color-focus` | `color-mix(in srgb, var(--color-focus) 15%, transparent)` | Low |
| `vacancy-card.css` | `.assignee-avatar` gradients use raw primitive tokens (`--error-600`, `--secondary-900`, etc.) | Semantic container pairs: `--color-{role}-container` + `--color-on-{role}-container` | High |
| `person-card.css` | `.person-avatar` gradient uses `--secondary-900`, `--secondary-500` (primitives) | `--color-secondary-container` + `--color-on-secondary-container` | High |
| `vacancy-card.css` | `.assignee-avatar` all variants use `--color-on-primary` for text — semantically wrong for non-primary surfaces | Each variant: use its own `on-*` container pair | High |
| `vacancy-card.css` | `.meta-dot` background uses `--text-muted` (a text-role token) | `--color-outline-variant` (decorative separator role) | Medium |
| `description.css` | `.desc-delete-btn:hover` uses `--red-light` / `--red` aliases instead of container pair | `--color-error-container` + `--color-on-error-container` | Medium |
| `vacancy-card.css`, `toolbar.css`, `modal.css`, `toast.css` | Hover uses `var(--bg)` — resolves to page background, not a hover surface | `var(--color-surface-variant)` for hover on secondary elements | High |
| `vacancy-card.css` | `.vacancy-icon` uses `--interactive-light` (shell alias) for bg | `--color-secondary-container` | Low |
| `toolbar.css` | `.toolbar-btn` font-weight `400` instead of `500`/`600` | Match button family: `600` for all button-like interactive elements | Medium |

### 12.3 Spacing off-scale values

| File | Value | Context | Correct |
|---|---|---|---|
| `back-link.css` | `6px` | icon–label gap | `var(--space-2)` (8px) |
| `vacancy-card.css` | `6px` | `.vacancy-meta` gap, `.stat-pill` gap, `.assignee` gap | `var(--space-2)` (8px) |
| `kanban.css` | `6px` | `.kanban-card-title` margin-bottom, `.kanban-card-meta` gap | `var(--space-2)` (8px) |
| `toolbar.css` | `10px` | `.toolbar` gap, `.search-field` gap | `var(--space-2)` or `var(--space-3)` |
| `modal.css` | `10px` | `.modal-footer` gap | `var(--space-2)` or `var(--space-3)` |
| `toast.css` | `10px` | `.toast` gap | `var(--space-3)` (12px) |
| `form.css` | `14px` | horizontal padding on all inputs | `var(--space-4)` (16px) |
| `kanban.css` | `14px` | `.kanban-card` padding-x | `var(--space-4)` (16px) |
| `badge.css` | `10px` | horizontal padding | `var(--space-3)` (12px) |
| `button.css` | `3px` | `.btn-xs` padding-y | Minimum 4px = `var(--space-1)` |
| `button.css` | `11px` | `.btn-xs` font-size (no token) | `var(--font-size-caption)` (12px) or add `--font-size-xs` token |
| `button.css` | `15px` | `.btn-lg` font-size (no token used) | `var(--font-size-heading-xs)` (already equals 15px) |
| `badge.css` | `10.5px` | `.badge-label` font-size (no token) | `var(--font-size-badge)` (11.5px) |

### 12.4 Structural / architectural issues

| Issue | Description | Correct pattern | Priority |
|---|---|---|---|
| Shadows (no dark mode) | `--shadow-sm/md/lg` (`css/variables.css`) have no `[data-theme="dark"]` override — nearly invisible on dark surfaces. Post-revert, components consume `box-shadow: var(--shadow-sm)` directly (no Tailwind inlining in the way anymore), so fixing this is now just adding a `[data-theme="dark"]` override block for the three tokens in `variables.css` — no runtime-var workaround needed. `--btn-elevation`/`--btn-elevation-hover` (2026-07, the Elevated Button's theme-aware elevation token) already does exactly this — a real dark-mode value defined alongside the light one — and is the reference pattern to extend to Card/Dialog/etc. shadows. | Medium |
| Icon button fragmentation | 5 separate icon-button implementations (`.icon-btn`, `.modal-close`, `.more-btn`, `.desc-delete-btn`, `.toast-close`) with inconsistent sizes (36/32/28/28/24px) and tokens | Extend `.icon-btn` with `ghost` modifier; standardize all to use it | High |
| Clickable card hover inconsistency | 4 different hover strategies across vacancy-card, person-card, kanban-card, data-table rows | Standard: `border → --color-outline-variant` + `box-shadow: var(--shadow-md)` + `transform: translateY(-1px)` | Medium |
| Avatar container fragmentation | 3 incompatible avatar patterns (semantic container, primitive gradient, alias bg) | Define shared avatar pattern with 3 size tokens; all use semantic container pairs | High |
| Kanban count pill vs Badge | Count pill is a one-off that duplicates badge functionality with different tokens | Add `badge-neutral` variant; use it instead of custom `.count` | Low |
| Raw transition values | `.1s` used instead of `var(--duration-fast)` in `button.css`, `more-btn`, `kanban.css`, `vacancy-card.css` | Always `var(--duration-fast) var(--ease-default)` | Medium |

---

## 13. Motion & Animation System

### 13.1 Duration tokens

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | `120ms` | Micro-interactions: hover bg/border change, icon transitions, badge fade |
| `--duration-normal` | `200ms` | Standard transitions: panel open/close, modal appear, state changes |
| `--duration-slow` | `300ms` | (Add to `variables.css`) Large surface transitions: page panel slide, drawer enter |
| `--duration-stagger` | `70ms` | (Add to `variables.css`) Per-item delay in list animations |

### 13.2 Easing tokens

| Token | Value | Use |
|---|---|---|
| `--ease-default` | `cubic-bezier(0.2, 0, 0, 1)` | Standard ease-out. Default for all transitions. |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | (Add) Subtle spring for lift/pop interactions (card hover, button press-release) |
| `--ease-linear` | `linear` | Skeleton shimmer, progress bars, spinner rotation |

### 13.3 Rules

- **Every `transition` and `animation-duration` uses a `--duration-*` token.** Raw values like `.1s` or `100ms` in component CSS are prohibited. The only exception is `animation-delay` for per-item stagger — use `--duration-stagger` multiplied by index.
- **Every `transition-timing-function` uses a `--ease-*` token.** Never hardcode `cubic-bezier()` values in component CSS.
- **Shorthand must include easing.** Write `transition: background var(--duration-fast) var(--ease-default)`, not `transition: background var(--duration-fast)`. Omitting easing silently falls back to `ease` which may differ visually.
- **`transform: translateY()` on hover.** Clickable cards and elevated buttons may use `translateY(-1px)` on hover and `translateY(0)` on `:active`. This is the only approved transform effect — no scale, no rotate.
- **`animation-fill-mode: both`.** Any component with a CSS animation must set `animation-fill-mode: both` to prevent state flicker at animation start/end.
- **Reduced motion.** Every animation and transition must respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .component {
    transition: none;
    animation: none;
  }
}
```

Add this block after every component's animation declarations. Embassy provides a global rule in `base.css`; component-specific overrides must not circumvent it.

### 13.4 What animations are permitted in Embassy components

| Pattern | Approved | Tokens |
|---|---|---|
| Hover bg/border change | ✅ | `var(--duration-fast) var(--ease-default)` |
| Card lift on hover | ✅ | `transform: translateY(-1px)`, `var(--duration-fast) var(--ease-default)` |
| Modal appear (opacity + translateY) | ✅ | `var(--duration-normal) var(--ease-default)` |
| Toast slide-in | ✅ | `var(--duration-normal) var(--ease-default)` |
| Skeleton shimmer | ✅ | `--ease-linear`, 1.5s loop |
| Spinner rotation | ✅ | `--ease-linear`, 0.7s loop |
| Staggered list entrance | ✅ | `var(--duration-stagger)` per item, max 5 items |
| Page transition | ❌ Not yet specified | Flag as DS gap — do not improvise |
| Parallax / scroll-linked | ❌ Out of scope | — |

---

## 14. Layout System

### 14.1 App shell structure

Embassy's layout is an **app shell pattern** implemented in `layout.css`. The canonical structure:

```html
<div class="app-shell">
  <aside class="sidebar">...</aside>      <!-- fixed left nav -->
  <div class="shell-content">
    <header class="topbar">...</header>   <!-- fixed top bar -->
    <main class="shell-main">
      <!-- page content -->
    </main>
  </div>
</div>
```

The sidebar is `240px` wide (fixed). The topbar is `60px` tall (fixed). `shell-main` has `padding: var(--space-6) var(--space-8)` (24px / 32px).

### 14.2 Breakpoints

| Token | Value | Behavior |
|---|---|---|
| `--breakpoint-md` | `768px` | Tablet threshold — layout changes below this |
| `--breakpoint-lg` | `1024px` | Desktop threshold |

**Important:** CSS `@media` queries cannot consume `var()`. Use the literal values in media queries and keep them in sync with the token values in `variables.css`.

```css
/* Correct */
@media (max-width: 768px) { … }

/* Wrong — does not work */
@media (max-width: var(--breakpoint-md)) { … }
```

### 14.3 Mobile shell — modal navigation drawer (resolved 2026-07)

Below `--breakpoint-md` (768px) the persistent sidebar becomes a **modal navigation drawer** — Embassy's canonical mobile nav pattern (MD3's modal-vs-standard drawer split; the sidebar *is* the Navigation Drawer, modal on compact and standard/persistent on expanded). This is specified — do not improvise a different one.

**Behavior**

| Width | Sidebar | Content | Trigger |
|---|---|---|---|
| **≥ 768px** | Persistent, fixed, 240px | Offset by `margin-left: var(--sidebar-width)` | none |
| **< 768px** | Off-canvas (`translateX(-100%)`), slides in over a scrim when the shell root has `.nav-open` | Full-width (`margin-left: 0`) | `.shell-menu-btn` hamburger in the topbar |

**Rules**
- Implemented in `layout.css`: `.shell-menu-btn` (hamburger, hidden ≥768, ≥44px target, first in `.topbar`), `.sidebar-scrim` (fixed scrim at `z-index:9`, uses `--color-scrim`), and `@media (max-width:768px)` rules that take the sidebar off-canvas and slide it in on `.app.nav-open`. Media queries use the literal `768px` (`@media` can't read `var()`).
- Motion uses `--duration-medium`/`--ease-default`; a `prefers-reduced-motion` block drops the slide.
- The drawer is **modal** on compact: it overlays content on a scrim, does not push it.
- **Accessibility (required):** the hamburger has `aria-label`, `aria-expanded`, and `aria-controls` pointing at the sidebar (`role="navigation"`); opening moves focus into the drawer; `Esc` and a scrim click close it; focus returns to the hamburger on close. Same contract as `Sheet`/`Dialog`.
- Consuming apps add the ~10 lines of JS that toggle `.nav-open` on `.app` and handle Esc/scrim/focus — the CSS and structure are canonical; the toggle is app-owned.
- `Sheet` (side variant) remains for *content* side panels (filters, detail) — it is **not** the primary-nav drawer.

> Class-name note: this section and the `layout.css` implementation use `.app` / `.sidebar` / `.topbar` / `.main` (the shipped classes). §14.1's example uses aspirational `.app-shell`/`.shell-*` names — a pre-existing doc/code drift to reconcile in a future pass; follow `layout.css` for what actually works.

### 14.4 Content width

| Context | Max width | Notes |
|---|---|---|
| Full-bleed app shell | none | Sidebar + content fill the viewport |
| Centered content page | `1200px` | Marketing / docs pages — add `max-width` to `shell-main` |
| Form / create page | `800px` | Focused task flows — constrain `create-form` width |
| Reading / prose | `680px` | Article or description pages |

Apply `max-width` and `margin: 0 auto` at the page level, never inside components.

### 14.5 Spacing between page elements

Use `--space-*` tokens for all page-level spacing:

| Context | Token | Value |
|---|---|---|
| Between section blocks | `--space-10` | 40px |
| Between cards in a grid | `--space-6` | 24px |
| Between list items | `--space-4` | 16px |
| Page header to first content | `--space-8` | 32px |
| Section header to content | `--space-6` | 24px |

### 14.6 Grid system

Embassy does not prescribe a CSS Grid column system. Instead, use CSS Grid with auto-fill columns directly in page-level layouts:

```css
/* Card grid — responsive without breakpoints */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
}

/* Kanban columns */
.kanban {
  display: grid;
  grid-auto-columns: 280px;
  grid-auto-flow: column;
  gap: var(--space-6);
  overflow-x: auto;
}
```

A multi-column grid framework (like a 12-column system) is out of scope for the MVP. If needed for a specific product, define it at the product layer, not in Embassy.

---

## 15. White-label Theming

For the complete guide, see [WHITE-LABEL.md](./WHITE-LABEL.md). This section establishes the governance rules for white-label work.

### 15.1 Principle: theme at the primitive layer

A client brand replaces the **primitive palette** — the top layer of `variables.css`. The semantic role layer and all component CSS files remain untouched. This is what makes white-labeling reliable: one set of changes cascades automatically through every component.

```
Client brand overrides:  primitives (--primary-*, --secondary-*, radii, fonts)
                              ↓
Embassy provides:        Color Roles (--color-primary, --color-secondary-container…)
                              ↓
Embassy provides:        Component CSS (button.css, badge.css…) — unchanged
                              ↓
Result:                  Fully branded product
```

### 15.2 What is overridable per brand

| Category | Overridable? | What to change |
|---|---|---|
| Primary color palette | ✅ Yes | `--primary-50` through `--primary-900` |
| Secondary color palette | ✅ Yes | `--secondary-50` through `--secondary-900` |
| Neutral palette | ⚠️ Caution | Only if brand grays differ significantly |
| Status colors (success/error/warning/info) | ⚠️ Rarely | Only if the brand has mandated status colors |
| Radius personality | ✅ Yes | `--radius-sm/md/lg/xl` |
| Font families | ✅ Yes (with license) | `--font-heading`, `--font-body`, `--font-mono` |
| Shadows | ⚠️ Caution | Only if brand elevation feels differ |
| Semantic Color Roles (`--color-primary`, etc.) | ❌ Never | These are derived from primitives |
| Component CSS files | ❌ Never | Touching component files breaks portability |
| Token names | ❌ Never | All DS token names are stable identifiers |

### 15.3 Brand theme file structure

A brand theme is a single CSS file loaded **after** `variables.css` and **before** `base.css`:

```html
<link rel="stylesheet" href="css/variables.css">
<link rel="stylesheet" href="brand/client-theme.css">  <!-- brand overrides -->
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/components.css">  <!-- or copy individual files from css/components/ -->
```

### 15.4 Verification after theming

After applying a brand theme:
- [ ] Render in light mode: all text readable, no low-contrast combinations
- [ ] Render in dark mode (`data-theme="dark"`): automatic recalibration working
- [ ] No `[data-theme="dark"]` blocks in the brand theme file (if there are, a semantic role token was overridden instead of a primitive)
- [ ] All component states (hover, focus, disabled, error) still visually distinct
- [ ] Focus ring (`--color-focus`) still visible — it does not change with brand colors by design
- [ ] Run the MIGRATION.md verification checklist against any product that consumes the theme

---

## 16. Component Lifecycle

### 16.1 Status definitions

| Status | Definition |
|---|---|
| **Proposal** | A designer or engineer has identified a need and written a brief. No code exists. |
| **Draft** | CSS (and optionally React wrapper) exists in a branch. Not in `components.css` barrel. Docs incomplete. |
| **Stable** | CSS + docs in `index.html` complete. Meets the §11 audit checklist. Merged to main. |
| **Deprecated** | Replaced by a better pattern. Still in the codebase for backward compatibility. Marked in docs as deprecated with the replacement. |
| **Removed** | Deleted from the codebase. Only in changelog. |

### 16.2 Promotion criteria

A component moves from **Draft → Stable** when:
- All items in the §11 audit checklist pass
- The design spec (in Figma) matches the live CSS output
- Light and dark mode verified
- At least one usage example exists in a real product or the examples directory
- Cross-referenced in `CLAUDE.md` component inventory table

### 16.3 Deprecation process

1. Mark the component in `index.html` with a `deprecated` banner
2. Add an entry to `CLAUDE.md` component inventory with `(deprecated — use X instead)`
3. Add to §12 Known Inconsistencies with `Priority: cleanup`
4. Set a removal target: the component is removed in the next major version after deprecation

### 16.4 Roadmap components

All components previously listed here (checkbox, radio, switch, menu, tooltip, slider, date picker, sheet, list, loading, carousel, divider) were built during the 2026-07 revert and are now **Stable** — see the CLAUDE.md component inventory. The only component genuinely absent from the library today is **Resizable panels** (dropped in the revert — no real use case beyond its own demo page). When a designer or engineer needs a component that isn't in CLAUDE.md's inventory:

1. Do not improvise — compose from existing components or flag the gap
2. Open a proposal documenting: what it is, which existing component it relates to, the markup anatomy, the states required
3. The proposal becomes a Draft once CSS is written and reviewed

---

## 17. Accessibility Standards

### 17.1 Baseline

Embassy targets **WCAG 2.1 Level AA** compliance for all components. Level AAA targets (e.g. 7:1 contrast for small text) are aspirational.

### 17.2 Color contrast requirements

| Context | Minimum ratio | Test |
|---|---|---|
| Normal text (< 18px regular or < 14px bold) | 4.5:1 | WCAG 1.4.3 |
| Large text (≥ 18px regular or ≥ 14px bold) | 3:1 | WCAG 1.4.3 |
| UI components & graphical objects | 3:1 | WCAG 1.4.11 |
| Focus ring against adjacent surface | 3:1 | WCAG 2.4.11 (AA) |
| Disabled state | No requirement (non-interactive) | — |

Primary text token (`--text-primary = #01164D`) on light background (`--bg ≈ #F8F9FA`) achieves ~14:1. On dark background, `--neutral-50` on `--primary-900` achieves ~15:1.

**When applying a white-label brand:** verify primary/secondary palette contrast ratios with the client's specific hex values. Do not assume they pass — measure them.

### 17.3 Interactive element requirements

- All interactive elements must have a visible focus indicator (§6.2)
- All interactive elements must have an accessible name: visible label, `aria-label`, or `aria-labelledby`
- Minimum touch target size: **44×44px** (WCAG 2.5.5). Exception: `.btn-xs` at 24px and `.btn-sm` at 32px — these may only be used in contexts where a larger target is provided by adjacent space or wrapping element
- Disabled elements use the `disabled` HTML attribute (not only visual styling) or `aria-disabled="true"` + `pointer-events: none`

### 17.4 Screen reader patterns

| Component | Required ARIA |
|---|---|
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to modal title |
| Toast | `role="status"` (or `role="alert"` for errors), `aria-live="polite"` (or `"assertive"` for errors) |
| Tabs | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls` |
| Chip (filter) | `role="checkbox"` + `aria-checked`, or `role="button"` + `aria-pressed` |
| Search | `role="search"`, `aria-label="Buscar"` |
| Data table | `<th scope="col">`, `<caption>` for context |
| Icon-only button | `aria-label` required |
| Card (clickable) | `role="link"` or `tabindex="0"` + `role="button"` + keyboard handler |

### 17.5 Keyboard navigation requirements

- All interactive elements reachable via Tab
- Tab order follows visual / logical reading order
- Modals trap focus (Tab cycles within the modal; Escape closes)
- Search results/dropdown navigable with Arrow keys
- Custom interactive elements (`.chip`, `.kanban-card`) implement keyboard equivalents of their click action

---

## 18. Naming Conventions for New Components

### 18.1 CSS class names

- Flat kebab-case: `.component-name`, `.component-name-variant`
- No BEM double-dash: `.btn-primary` not `.btn--primary`
- No nesting indicators: `.card-title` not `.card__title`
- Additive variants: `class="chip chip-selected chip-elevated"` — base class + modifier classes, always

### 18.2 Token names in new components

- Components consume existing Color Roles — they do not define their own tokens
- If a new role token is genuinely needed, add it to `variables.css` with:
  - A light mode value referencing primitives
  - A `[data-theme="dark"]` override if the role changes in dark mode
  - A note in the `variables.css` comment block explaining the new role's purpose

### 18.3 CSS file header structure (mandatory)

Every component CSS file must open with this header:

```css
/* ═══════════════════════════════════════
   Embassy DS — [Component Name]
   [One sentence description]

   Cuándo usar: [use case]
   Cuándo no: [anti-use-cases]
   Reemplaza a: [what it replaces]

   Dependencia: variables.css[, base.css if needed]
   Requiere: [peer dependencies, e.g. lucide icons]

   Uso:
   <markup example>
═══════════════════════════════════════ */
```

Do not start the CSS before this block is complete. The header is the component's contract — it is read by humans, by the `/design-system` skill, and by the audit checklist.

---

## 19. Component coverage — intentional non-additions & compositions

> **History:** between 2026-06-22 and 2026-06-26 Embassy was implemented on Tailwind v4 + React/Radix
> (shadcn/ui), tracking the shadcn/ui component registry as its implementation reference. That
> architecture was **reverted 2026-07-17** — every component is now flat CSS (`css/components/*.css`)
> + vanilla JS, with optional thin React wrappers. The registry-tracking framing no longer applies
> (there's no shadcn dependency to track parity against), but the specific coverage decisions below
> were about *design*, not about which library shipped them, and they still hold: Embassy deliberately
> does NOT ship a second, competing implementation of a pattern it already covers (a violation of §2,
> one canonical component per pattern).

### 19.1 One canonical edge-anchored panel: **Sheet**

**Status: `Sheet` only, no separate Drawer.** A gesture-driven Drawer (vaul-based, during the Tailwind
era) was briefly added, then **removed** — a Drawer and a Side Sheet are visually and motion-identical
at rest; the Drawer's *only* differentiator was gesture (swipe-to-dismiss, snap points, nested
stacking), which the product does not use. Maintaining both violated §2 for no benefit, and the revert
carried this decision forward: there is still only one edge-anchored panel.

**`Sheet` (`css/components/sheet.css` + `components/ui/sheet.tsx`) is the single edge-anchored panel:**
`side="right" | "left"` = Side Sheet · `side="bottom"` = Bottom Sheet · `side="top"`. Map every
drawer/sheet/edge-panel requirement to `Sheet`. If a genuine gesture surface (swipe/snap) is ever
required, reintroduce a gesture engine as a deliberate, documented decision — do not re-add a parallel
component for a static panel. (The separate **Navigation Drawer** in the app-shell — the mobile nav in
`css/layout.css` — is unrelated and stays.)

### 19.2 No separate Sidebar component → use the **app-shell** (`css/layout.css`)

Embassy owns app navigation through the **app-shell** (`.app`/`.sidebar`/`.topbar`/`.main` in
`css/layout.css`) with the resolved modal navigation drawer below 768px (§14.3). A second, separate
Sidebar component would fork the navigation story. **Map sidebar requirements to the app-shell.** If a
component-level, per-view collapsible sidebar is later needed, extend the shell's state API rather than
adding a parallel Sidebar component.

### 19.3 Compositions exported as first-class components

Date Picker, Combobox, and Data Table are **compositions** (assembled from Popover/Calendar-grid or
Command-style filtering, and Table + Pagination respectively), not standalone primitives. Embassy
exports each as a first-class, copy-paste component (`css/components/date-picker.css` +
`components/ui/date-picker.tsx`, `combobox.css`/`combobox.tsx`, `data-table.css`/`data-table.tsx`) so
consumers get the assembled, token-correct pattern without re-wiring it — while still composing only
canonical DS parts. Note these three (plus Command, Context Menu, Menubar, Navigation Menu, Input OTP,
and Form) have real component code but **no standalone doc page in `index.html` yet** — that's the
remaining phase, not a sign the component doesn't exist; check `css/components/` and `components/ui/`
directly rather than assuming from the docs site alone.

### 19.4 Deliberately simplified vs. their Tailwind-era, library-backed versions

The 2026-07 revert rebuilt the hardest, most library-dependent components as **simplified vanilla
equivalents** rather than exact clones of their old Recharts/TanStack/react-day-picker/cmdk/embla
behavior — this is an accepted, documented tradeoff, not a regression to silently fix:

| Component | Simplified away |
|---|---|
| Chart | Legend animation, brush/zoom — hand-drawn SVG + CSS `conic-gradient`, native `<title>` tooltips |
| Data Table | Column resize/pin/drag-reorder, faceted filtering, virtualization, row selection |
| Calendar / Date Picker | Locale system, complex range-selection edge cases, viewport-edge collision detection on the popover |
| Command / Combobox | Fuzzy-match scoring — substring filtering only |
| Popover / Dropdown / Context Menu / Menubar / Navigation Menu | True focus-trap (Tab-cycling), submenu/portal support — real viewport-edge-flip positioning and keyboard nav ARE implemented |
| Input OTP, Slider, Form | — mostly full-fidelity; Slider's range mode uses the standard two-stacked-`<input>` technique |
| Carousel | Drag/swipe physics beyond native touch-scroll, autoplay, infinite loop, the `CarouselApi` escape hatch |
| Resizable panels | **Not implemented at all** — dropped, no real use case beyond its own demo page |

If a product need genuinely requires one of these simplified-away capabilities, that's a DS gap to
flag and scope deliberately — not something to quietly hand-roll in product code.

---

## 20. Cross-component consistency — overlays

### 20.1 Action-emphasis hierarchy (dialogs, overlays, forms)

Buttons carry MD3 emphasis levels. Match the button's emphasis to the action's importance so the
primary action always dominates and the dismiss action stays subordinate:

| MD3 emphasis | Embassy variant | Use for |
|---|---|---|
| **Filled** (highest) | `primary` (or `danger`/`success`) | The one affirmative/primary action — Confirm, Save, Delete. **One per context.** |
| **Filled Tonal** (medium) | `secondary` | A *constructive secondary* action that should be gently encouraged and needs medium weight — e.g. "Save draft" beside "Publish", "Add to cart", MD3's "Next". **Not** a dismiss action. |
| **Elevated** (medium) | `elevated` | A secondary action that must lift off a busy/colored surface. |
| **Outlined** (medium-low) | `tertiary` | **Cancel / Dismiss / Back**, and neutral secondary actions (Export, Filter). Visible but clearly subordinate. |
| **Text** (lowest) | `text` | Minor/tertiary inline actions — "Learn more", dismiss a snackbar. |

**The dialog/overlay footer rule (Dialog, Alert Dialog, Sheet):**

- **Confirm / affirmative** → `primary` (or `danger`/`success`). Exactly one.
- **Cancel / dismiss** → **`tertiary` (Outlined)**. `AlertDialogCancel` defaults to it.
  **Never Tonal (`secondary`) for Cancel** — Tonal is medium emphasis and competes with the Filled
  primary (worst when the primary is disabled and greys out, leaving a heavy tonal Cancel as the
  loudest control). **Never** two Filled, or Filled + Tonal, as a Confirm/Cancel pair.
- Optional third action → `text`.

Tonal vs Outlined, in one line: **Tonal** = a secondary action you want to *encourage* (constructive,
medium weight); **Outlined** = a secondary action that must *step back* (cancel/neutral). A Cancel
always steps back → Outlined. This applies to overlays **and** inline form footers (the escape action
is `tertiary` there too — the earlier "forms may differ" carve-out is retired; the hierarchy is uniform).

### 20.2 Edge-anchored surface motion (Sheet — all sides)

Every `Sheet` side moves as **one system**: entrance/exit on `--ease-emphasized`
(`cubic-bezier(.32,.72,0,1)`, a smooth decelerate with **no overshoot**) at `--duration-sheet`
(500ms), symmetric open/close, with the overlay fading on the same curve/duration. Only the axis of
travel differs by `side` (right/left = x; bottom/top = y). `prefers-reduced-motion` is
handled globally by the theme. **Do not** use `ease-expressive-*` (overshoot) on a large sliding
panel — that bounce reads as unnatural; overshoot is for small spatial motion (zoom/rotate) on
dialogs and menus only.

### 20.3 Overlay triggers

The button that **opens** an overlay (Dialog, Sheet, Alert Dialog, Popover) defaults to
**`Button variant="secondary"` (Tonal)** — the DS-standard overlay trigger. A trigger is a neutral
"open this" affordance; Filled (`primary`) over-weights it and competes with the real primary action,
which lives *inside* the overlay. Deviate only for a **strong UX reason**:

- **Destructive entry point** (e.g. a "Delete" button that opens a confirm) → `danger` — the warning
  color is worth showing at the entry too (pairs with the destructive confirm, §20.4).
- **Field-style trigger** (Date Picker, Combobox — reads as a form control) → `tertiary` (Outlined),
  matching the input surface, not a Tonal button.
- **Page hero CTA** whose whole purpose is that one action → `primary` is acceptable.

Everything else: Tonal.

### 20.4 Destructive confirmations

Any flow that destroys/irreversibly changes data (delete, discard, revoke) uses **one canonical
pattern**, everywhere (Alert Dialog, Dialog, Sheet, confirmation flows):

- **Destructive action** → `Button variant="danger"` (Embassy **Error** tokens: `--color-error` /
  `--color-on-error`). Never a plain `primary` for a destructive confirm. `AlertDialogAction` takes
  `variant="danger"`.
- **Cancel** → `tertiary` (Outlined), per §20.1 — and it should be the **safe default focus**.
- The **confirm must be explicit** (Alert Dialog: no close-on-outside/Esc-to-confirm; Esc = Cancel).
- Optionally the entry-point trigger is also `danger` (§20.3).

## 21. shadcn parity — additions & intentional divergences (2026-07)

A library-wide pass compared every Embassy component against canonical shadcn/ui and
added the missing variants/sub-parts/states, Embassy tokens as the only visual layer.
This section is the durable record of **what was added** and, more importantly, **which
shadcn features Embassy deliberately does NOT mirror** (so they aren't "re-added" later
as if they were gaps).

### 21.1 Variants / sub-parts added (now at parity)

- **Menu primitive** (`dropdown-menu.css`, shared by Dropdown/Context/Menubar): `CheckboxItem`
  + `RadioItem` (indicator driven by `aria-checked`), `inset` (`data-inset`), `Group`.
- **Card**: `.card-action` top-right header slot (grid). **Avatar**: status badge
  (`.avatar-badge` online/busy/away/offline) + `.avatar-group-count` ("+N").
- **Table**: `tfoot` + `caption`. **Toast**: `warning` type + title/description slot.
- **Slider**: vertical orientation. **Switch**: `sm`. **Button**: `link` variant + `icon-xs`.
- **Alert Dialog**: `sm` size + media/icon slot + centered header. **Popover**: Header/Title/
  Description sub-parts. **Tabs**: filled/pill list + vertical orientation.
- **Form controls**: element-level `[aria-invalid]` styling on input/select/textarea/OTP/toggle;
  `:focus`→`:focus-visible`; textarea `field-sizing`. **Skeleton**: circle preset.
- **Restored full behavior** (were simplified in the buildless revert): **Data Table** (row
  selection + text filter + column-visibility + `aria-sort`, `initDataTable()`), **Calendar**
  (dynamic renderer + month/year dropdown caption), **Carousel** (vertical), **Command**
  (filter + keyboard nav + ⌘K `CommandDialog`), **Chart** (JS rich tooltip).

### 21.2 Intentional divergences — DO NOT "fix"

| shadcn feature | Embassy choice | Why |
|---|---|---|
| Badge generic variants (default/secondary/outline/ghost/link) | Semantic **status taxonomy** (`badge-open/active/closed/…`) | Badge = read-only status; interactive → Chip |
| Pagination active = `outline` | Active = filled `secondary-container` | Matches the DS selection language (Chip/Nav/Tabs) |
| Skeleton `animate-pulse` | Shimmer gradient sweep | Brand motion; richer, same intent |
| Alert: 2 variants | 5 semantic variants (default/info/success/warning/error) | Reuses Badge container/on-container token pairs |
| Select: composed Radix dropdown | Native `<select>` restyled | Parity dropdown behavior lives in **Combobox/Command** |
| Toggle Group `spacing=0` (connected) | Spaced, independent toggles | Connected pill = **Segmented Button**'s job |
| Hover Card (hover-triggered) | **Rich Tooltip** (click-triggered) | Consolidated; drops the hover-preview affordance (flagged) |
| Menu submenus (`Sub`/`SubTrigger`/`SubContent`) | **Not built** | Buildless flyout has no portal/nested engine — flag, don't improvise |
| Tooltip/Popover/Sheet/Dialog exit animations, collision-flip, portal | Simplified (documented per file) | Buildless accepted trade-offs |

Also see §19 (Drawer→Sheet, Sidebar→app-shell, Resizable dropped — the other intentional
non-additions). If a consumer genuinely needs one of the above, treat it as a **DS gap to
raise with design**, not a bug to patch unilaterally.

### 21.3b Round-2 audit additions (2026-07)

A second full-library audit closed the remaining real gaps (everything else was
already at parity or a documented divergence):

- **Calendar range mode** — was advertised but non-functional; now a real two-date
  range (`data-cal-mode="range"`, start/middle/end highlighting, "X — Y" trigger).
- **Combobox** — was CSS-only; now wired (`initCombobox`: open/filter/select/check/close).
- **Carousel** — Prev/Next disable at the scroll extremes + keyboard arrows + region role.
- **Accordion** — roving Arrow/Home/End trigger focus (par Radix).
- **List** — canonical two-part focus + leading/trailing/selected/disabled/divider states.
- **Tooltip** arrow · **Navigation Menu** active-link · **Toast** loading spinner ·
  **Input** `type=file` · **Button** error-tinted destructive focus ring · **Avatar**
  badge icon slot · **Divider** semantic-`<hr>` guidance.
- Domain-card (Person/Vacancy/Kanban) usage snippets marked focusable; Stat Card
  snippet uses the modifier class, not an inline style.

### 21.3c New shadcn Base UI components added (2026-07)

A full audit against the current shadcn **Base UI** catalog (62 components) found 48
already present + the documented non-additions (§19: Drawer→Sheet, Sidebar→app-shell,
Resizable dropped; Hover Card→Rich Tooltip; Direction = RTL provider, N/A LTR-only).
The **utility set** that was genuinely missing was added as flat CSS + full DS pages
(nav + 5 tabs + rendered variants): **Spinner** (`spinner.css`), **Button Group**
(`button-group.css`), **Input Group** (`input-group.css`), **Item** (`item.css`),
**Attachment** (`attachment.css`). (Kbd was added then removed — not needed.)

⚠️ **Intentionally NOT added** — out of Embassy's product scope (recruiting/HR): the
chat/messaging family **Bubble** (message bubble), **Message** (message-row scaffold),
**Message Scroller** (auto-scroll chat viewport), and **Marker** (chat/timeline
label-separator — *not* a map pin). Add only if a chat surface is introduced; flag with
design first. **Direction** (`DirectionProvider`/`useDirection`, RTL context) is N/A for a
buildless LTR-only DS — no code to add. Native Select = Embassy's native `<select>`;
Field = `form.css` field-group; Empty = `empty-state.css`; Label folded into field (§23).

### 21.3d Cards architecture — one reusable primitive (2026-07, final)

The **Cards** family converged on a single reusable primitive plus a rich panel, mirroring
shadcn's Item/Card split but using **designer-facing names**:

- **Basic Card** (`item.css`, classes `.item*`) — the canonical **reusable primitive**: a
  compact row (media + content + actions), par shadcn **Item**, with the full official
  composition set rendered in its Specs (variant, size, icon/avatar/image media, **person**,
  group, header, link, dropdown). This is the base block for every compact domain card.
- **Full Card** (`card.css`, classes `.card*`) — the **rich panel** (header/title/
  description/content/footer + action slot; variants `.card` / `.card-elevated` /
  `.card-filled`), par shadcn **Card**.

> **Naming history (do not re-litigate):** this section oscillated. Final state (2026-07):
> the shadcn **Item** primitive is surfaced as **"Basic Card"**; the panel formerly shown as
> "Basic Card" then briefly "Card" is now **"Full Card"**. Class names were kept (`.item*`
> for Basic Card, `.card*` for Full Card) for shadcn parity — only the **display names**
> changed. **Section ids are stable and intentionally do not match the labels:** `c-item` =
> "Basic Card", `c-basic-card` = "Full Card", `c-card` = the "Cards" hub. `c-person` is
> retired → `SECTIONS['c-person'].redirect = 'c-item'` (navigate() honors `redirect`).

The specialized Embassy cards are compositions understood *on top of* Basic Card:

| Card | Fold into Basic Card? | Verdict |
|---|---|---|
| **Person** | **Yes — done.** No longer a separate component | It is a documented **variant of Basic Card**: markup `.item item-outline item-clickable person-card`, avatar in `.item-media`, name/role in `.item-title`/`.item-description`. `person-card.css` only adds the brand gradient avatar + surface bg + hover-shadow and **depends on `item.css`**. Its old top-level page/nav entry was removed (redirect kept). |
| **Nav Card** | Partial | Doc-shell chrome (tag + big visual + arrow); shares the media+content+action shape but is not a consumable component. |
| **Vacancy / Kanban Card** | No | Domain compositions with badges, assignee stacks, drag state, entrance animation — richer than a row. |
| **Stat Card** | No | Metric display (big number + trend), not a row. |

Rule going forward: **new** compact list/row content → build on Basic Card (`.item*`); a
rich panel that groups content → Full Card (`.card*`); reach for a standalone domain card
only when it adds real domain structure (badges/drag/animation). Person is the reference
example of a Basic Card domain variant.

### 21.3 Implementation notes

- `.dropdown-content[hidden]` needs an explicit `display:none` rule — the component's
  `display:flex` overrides the UA `[hidden]`. Any JS-toggled flyout panel relies on this.
- Restored behaviors are vanilla, idempotent initializers wired on load **and** on the SPA's
  `ds:section-shown` event: `initDataTable`, `initCalendar`, `initCommand`, `initChartTooltips`
  (+ `carouselScroll`). New demos should use the documented `data-*` hooks, not re-implement.

Never rely on color alone — the label must name the consequence ("Eliminar vacante", not "OK").