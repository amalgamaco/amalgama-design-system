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
3. **One source of truth.** Token values live in `css/variables.css`. Component markup contracts live in each component's `css/components/*.css` header. Behavior specifications live in `index.html`. Nothing else is authoritative.
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

A component **may** declare a full component-token layer that mirrors Material Design 3's "Tokens and specs" table — **one custom property per MD3 component token**, declared on the component root, consumed by every rule. **Reference implementation: `segmented-button.css`.** This is normally a "shadow token" (§2.3) but is permitted here because it reproduces MD3's *documented three-layer architecture* (palette → system role → component token → CSS), making the component's spec table machine-mappable and each instance themeable by overriding one token.

Rules for adopting this pattern:
1. **Every** component token defaults to its MD3 system role via the bridge, with the Embassy role as fallback: `var(--md-sys-color-X, var(--color-X))`. Never default to a primitive or a hardcoded value.
2. Token names follow MD3's token path, kebab-cased and prefixed with the component (`md.comp.segmented-button.selected.container.color` → `--seg-btn-selected-container-color`).
3. The CSS rules consume **only** component tokens — never a `--color-*` role or `--md-sys-color-*` name directly.
4. The header comment carries the MD3-token → component-token → default mapping table.
5. Deliberate divergences from MD3 defaults (e.g. the focus ring) are documented in the header.

The **MD3 system bridge** (`css/md-sys-bridge.css`) exposes `--md-sys-color-*` (Material's real system-token names) as aliases of the Embassy `--color-*` roles. It is the only place those names are defined; it needs no dark override because the `--color-*` roles already recalibrate. It is optional to load — the `var(--md-sys-color-X, var(--color-X))` fallback keeps adopting components working without it (they resolve to Embassy roles directly).

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
| Colors | `css/components/<name>.css` token references |
| Spacing (padding, gap) | `css/components/<name>.css` — uses `--space-*` or absolute px anchored in the component spec |
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
- The source of truth for all pixel values is `css/components/button.css`. If a doc value conflicts with CSS, the CSS wins and the doc must be updated.
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

Radius on buttons is determined by **size, not by variant**. All five variants (Primary, Secondary, Tertiary, Text, Icon) at the same size must compute to the same `border-radius`. The radius is set once per size modifier in `css/components/button.css`:

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
| Borders (interactive elements) | — | `--color-outline` |
| Borders (subtle, decorative) | — | `--color-outline-variant` |
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

A new component must declare its hover model in the CSS header comment and use it consistently for all its states.

### 5.5 State layers — MD3 model

Material Design 3 defines **state layers** as translucent overlays that communicate interaction states without permanently altering the component's color. Embassy follows this model exactly, with `color-mix()` as the CSS implementation.

#### State layer opacities (MD3 spec)

| Interaction | Opacity |
|---|---|
| Hover | 8% |
| Pressed | 12% |
| Focused | 12% |
| Dragged | 16% |

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

Selected state (chips, tabs, nav items, segmented buttons) uses `--color-secondary-container` (MD3: `secondaryContainer`) for the container and `--color-on-secondary-container` (MD3: `onSecondaryContainer`) for content. High-emphasis selected items (e.g. nav active) use `--color-primary`. A selected state must have a clear visual distinction from hover — do not rely solely on color to communicate selection.

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

### 11.1 CSS file (`css/components/<name>.css`)

- [ ] Header comment includes: description, specs, `Dependencia:`, `Uso:` block with exact markup, `Cuándo usar`, `Cuándo no`, `Reemplaza a`
- [ ] Zero raw hex values (only `var(--color-*)` or `var(--text-*)`)
- [ ] Zero raw px for `font-size` (only `var(--font-size-*)`)
- [ ] Border radius uses `var(--radius-*)` tokens; for buttons, verify size-to-radius mapping matches §4.3 (same size = same computed `border-radius` for all variants)
- [ ] Shadow uses `var(--shadow-*)` tokens
- [ ] Font families use `var(--font-body)`, `var(--font-heading)`, or `var(--font-mono)`
- [ ] Spacing uses `var(--space-*)` or pinned spec values documented in the header
- [ ] Focus: `outline: 2px solid var(--color-focus); outline-offset: 2px; box-shadow: 0 0 0 4px var(--color-focus-ring);` on `:focus-visible`
- [ ] Disabled: `var(--color-disabled)` (bg) + `var(--color-on-disabled)` (text) + `cursor: not-allowed; pointer-events: none`
- [ ] Hover: model declared in header comment, consistent within the component
- [ ] Pressed: state layer or `filter:brightness()` applied on `:active:not(:disabled)`
- [ ] No `[data-theme="dark"]` block in the component file
- [ ] No `!important` flags
- [ ] Added `@import` to `css/components.css`

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
- [ ] Legacy `docs/<name>.html` page created and cross-linked

### 11.5 Accessibility

- [ ] Color contrast ≥ 4.5:1 for normal text in both light and dark
- [ ] Color contrast ≥ 3:1 for large text and UI components
- [ ] Focus ring visible: `--color-focus` outline + `--color-focus-ring` ring
- [ ] Interactive elements have accessible names (`aria-label` or visible label)
- [ ] Disabled state uses `disabled` attribute (not only visual styling) OR `aria-disabled="true"` + `pointer-events: none`
- [ ] `role` and `aria-*` attributes documented in the Accessibility tab

### 11.6 React wrapper

- [ ] Pattern: `cva` (class-variance-authority) + `cn()` from `components/lib/utils.ts` + `React.forwardRef`
- [ ] All styling in CSS classes — no inline styles in the React component
- [ ] `disabled` prop wires to the HTML `disabled` attribute
- [ ] `aria-busy` wired for loading states
- [ ] Exports added to barrel file if one exists

### 11.7 Cross-references

- [ ] Component inventory table in `CLAUDE.md` is updated
- [ ] Related components are cross-linked in each other's `index.html` sections
- [ ] Component appears in the `docs/` legacy catalog

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
| Shadows (no dark mode) | `--shadow-sm/md/lg` have no dark mode override — nearly invisible on dark surfaces | Add `[data-theme="dark"]` shadow overrides in `variables.css` | Medium |
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

### 14.3 Mobile shell (pending)

The mobile sidebar behavior (collapse, off-canvas drawer, hamburger trigger) is a **pending design decision**. Do not improvise mobile nav patterns. Flag any screen that requires sub-768px nav behavior and defer to the design team. Once specified, this document will be updated.

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
<link rel="stylesheet" href="css/components.css">
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

Roadmap components (checkbox, radio, switch, menu, tooltip, slider, date picker, sheet, list, loading, carousel, divider) are **Proposal status**. They have no consumable code. When a designer or engineer needs one:

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
