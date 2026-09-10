# TOKENS.md — Embassy Token Reference (semantic purpose + when-to-use)

**Source of truth is `css/variables.css`.** This document does not define tokens or values; it
adds the *semantic purpose* and the *when-to-use / when-NOT-to-use* rule for each group so agents
and humans pick the **right** token. If a value here ever disagrees with `variables.css`, the CSS
wins — fix this doc, not the CSS.

**The one rule that governs everything (from CLAUDE.md — "Tokens are the law"):**

- All color via `var(--color-*)` or a semantic alias (`--accent`, `--bg`, `--border`); radii via
  `var(--radius-*)`; shadows via `var(--shadow-*)`; spacing via `var(--space-*)`; every `font-size`
  via a `--font-size-*` token. **Never a raw hex, never a loose px.**
- **Consume SEMANTIC ROLES, never PRIMITIVES, in product/component code.** Primitives
  (`--neutral-*`, `--primary-*`, `--secondary-*`, `--tertiary-*`, `--success-*`, `--error-*`,
  `--warning-*`, `--info-*`) are the raw palette — they are the *input* to the semantic roles and
  must not be referenced directly outside `variables.css`. A component that uses `--primary-900`
  instead of `--color-primary` (or `--text-primary`) breaks dark mode, because only the
  `--color-*` layer recalibrates under `[data-theme="dark"]`.
- **Dark mode is automatic.** Set `data-theme="dark"` on `<html>`; the semantic `--color-*` layer
  recalibrates itself. Components need **zero** per-theme overrides. (See "Dark mode" at the end.)

---

## 1. Color — primitives (the raw palette)

These are the tonal ramps. **Do not consume them in component or product code** — they exist only
to feed the semantic roles in §2. Referencing a primitive directly is the single most common way to
break theming. The correct alternative is always the matching `--color-*` role.

| Group (token pattern) | Steps present | Purpose | Use directly? |
|---|---|---|---|
| `--neutral-*` | `10, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, black, white` | Greyscale ramp feeding surfaces, text, borders, disabled. | **No** — use surface / text / outline / disabled roles. |
| `--primary-*` (navy) | `50, 60, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900` | Brand navy; feeds Primary role + page text. `--primary-60` = periwinkle Primary Container (light). | **No** — use `--color-primary*` / `--text-primary`. |
| `--secondary-*` (agile/periwinkle blue) | `10, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 925, 950` | Interactive accent (links/nav/focus) + Secondary tonal role. `925`/`950` are dark-mode container/on values. | **No** — use `--color-secondary*` / `--interactive` / `--color-focus`. |
| `--tertiary-*` (purple/violet) | `50, 100, 200, 300, 400, 500, 600, 700, 800, 900` | Purple accent family. | **No** — use `--color-tertiary*`. |
| `--success-*` | `50–900` (full) | Green status ramp. | **No** — use `--color-success*` / `--green*`. |
| `--error-*` | `50–900` (full) | Red status ramp. | **No** — use `--color-error*` / `--red*`. |
| `--warning-*` | `50, 100, 200, 400, 500, 700, 800, 900` (no `300`/`600`) | Amber status ramp. | **No** — use `--color-warning*` / `--yellow*`. |
| `--info-*` | `50–900` (full) | Blue status ramp. | **No** — use `--color-info*` / `--blue*`. |

---

## 2. Color — semantic roles (`--color-*`) — CONSUME THESE

The usage layer. Every one is theme-aware (recalibrated in `[data-theme="dark"]`). Each accent
comes as a **quartet**: main (`--color-X`), on-main (`--color-on-X`), container (tonal recessive
surface), on-container (text on that container). **Pair `X` with `on-X`, and `X-container` with
`on-X-container`** — never mix tiers (e.g. text set to `--color-on-primary` on a
`--color-primary-container` background will fail contrast).

### 2a. Brand / accent roles

| Token | Purpose | When to use | When NOT to use → alternative |
|---|---|---|---|
| `--color-primary` | Highest-emphasis brand fill. | The one Primary CTA per context (filled button, FAB). | Body/heading text → `--text-primary`. Note: in dark it flips to **white**, so selected controls read white. |
| `--color-on-primary` | Text/icon on `--color-primary`. | Label inside a filled Primary button. | On any other surface. |
| `--color-primary-container` | Tonal navy surface (lower emphasis than filled). | Elevated/tonal button bg, selected nav pill backing. | As a page background → surface tiers. |
| `--color-on-primary-container` | Text on primary container. | Label on a `-container` surface. | — |
| `--color-primary-hover` | Primary hover state. | `:hover` of Primary fills. | Static fills → `--color-primary`. |
| `--color-secondary` | Interactive accent (agile blue). | Links, active nav/tabs, focus accents (via `--interactive`). | A second filled CTA competing with Primary. |
| `--color-on-secondary` | Text on `--color-secondary`. | — | — |
| `--color-secondary-container` | Light tonal blue (inverts vs Primary: light bg + navy text). | Secondary/tonal button, selected chip, nav-selected backing. | When you need a *neutral* recessive button — that's still this token today (Button Secondary consumes it directly). |
| `--color-on-secondary-container` | Navy text on secondary container. | Chip/segmented selected label. | — |
| `--color-tertiary` / `-on-tertiary` / `-tertiary-container` / `-on-tertiary-container` | Purple accent quartet. | Tertiary-purple accents, `badge-tertiary`. | As a status color — use success/warning/error/info. |

### 2b. Status roles (success / warning / error / info)

Same quartet shape. Each also has a `--color-X-hover` for success/error. **Status = meaning, not
decoration** — do not use a status color just because you like the hue.

| Token family | Purpose | When to use | When NOT to use → alternative |
|---|---|---|---|
| `--color-success` + `-on-success` + `-success-container` + `-on-success-container` + `--color-success-hover` | Positive/confirmation. | Success alerts, "open"/"active" badges, positive stat trend. | Neutral confirmation with no valence → neutral surface. |
| `--color-warning` + `-on-warning` + `-warning-container` + `-on-warning-container` | Caution (non-blocking). | Warning alerts, draft/pending badges. `--color-on-warning` is dark (navy/near-black) because warning is a light hue. | Hard errors → error family. |
| `--color-error` + `-on-error` + `-error-container` + `-on-error-container` + `--color-error-hover` | Destructive / invalid. | Error alerts, `is-error` inputs, destructive buttons. | Warnings/cautions → warning family. |
| `--color-info` + `-on-info` + `-info-container` + `-on-info-container` | Neutral informational. | Info alerts/badges. | Interactive accent (links) → `--color-secondary`. |

### 2c. Surface tiers, text, borders, misc roles

| Token | Purpose | When to use | When NOT to use → alternative |
|---|---|---|---|
| `--color-surface` | App base background. | Page/app canvas. | Card/panel bg → `--color-surface-container` / `--card-bg`. |
| `--color-surface-dim` | Slightly recessed surface. | Muted section behind cards. | — |
| `--color-surface-bright` | Brightest surface (white / lightest dark). | Raised emphasis surface. | — |
| `--color-surface-container-lowest / -low / -(base) / -high / -highest` | Elevation ladder of container surfaces. | Cards, menus, sheets — pick the tier by elevation (higher = more raised). | Page canvas → `--color-surface`. |
| `--color-surface-variant` | Alt subtle surface. | Zebra rows, subtle fills. | — |
| `--color-on-surface` | Content **inside** components (chip/button/table-cell labels). Near-black. | Component-internal text/icons. | **Page headings/body → `--text-primary`.** Using on-surface for page type renders black, not brand navy — a token misuse. |
| `--color-on-surface-variant` | Medium secondary content on a surface. | De-emphasized in-component text. | Page secondary text → `--text-secondary`. |
| `--color-outline` | **Prominent** border — interactive elements (buttons, inputs, chips). | Outlines that must read clearly. | Container chrome (cards/tables/panels) → `--border`. |
| `--color-outline-variant` | **Subtle** border. | Chip rest border, faint dividers within a component. | Where a border must stand out → `--color-outline`. |
| `--color-inverse-surface` / `--color-inverse-on-surface` / `--color-inverse-primary` | Inverted surface + its content (e.g. dark tooltip on light UI) + inverse accent. | Snackbars/tooltips that invert against the theme. | Normal surfaces → surface tiers. |
| `--color-disabled` / `--color-on-disabled` | Disabled control fill + its text. | `:disabled` states. | — |
| `--color-focus` | Focus accent (agile blue). **No dark override** — deliberately identical across themes (consistent focus signal). | Focus outlines. | — |
| `--color-focus-ring` | Focus halo = `color-mix(--color-focus 15%, transparent)`. SSOT-derived; never hardcode `rgba(...)`. | Focus ring/glow. | — |
| `--color-error-ring` | Invalid-input halo = `color-mix(--color-error 12%, transparent)`. Recalibrates in dark automatically. | `.is-error` input ring. | Never hardcode the rgba. |
| `--color-scrim` | Modal/overlay backdrop = `rgba(0,0,0,.32)`. | Dialog/sheet/drawer scrim. | — |

### 2d. Nav / menu interaction roles ("blue hover")

Menu and sidebar-nav hover reads **blue, never grey**. All derived from
`--color-secondary-container`, so they recalibrate in dark with no override.

| Token | Purpose | Use / avoid |
|---|---|---|
| `--color-nav-hover` | Nav/menu item hover bg (secondary-container @ 45%). | Hover of nav items & dropdown/context-menu rows. Do **not** substitute a grey. |
| `--color-nav-hover-content` | Content color on hover. | Icon/label color on nav hover. |
| `--color-nav-press` | Pressed bg (secondary-container @ 70%). | `:active` of nav/menu items. |
| `--color-nav-selected` | Selected bg (full secondary-container). | Current nav item / selected menu row. |
| `--color-nav-selected-content` | Content on selected. | Label/icon of the selected item. |

> Not for Segmented Button or Chip — those own their selection treatment.

### 2e. Chart categorical tokens (`--chart-1..5`)

**Not in `variables.css`.** They are defined **locally in `css/components/chart.css`**
(`--chart-1: var(--color-secondary)`, `-2: tertiary`, `-3: success`, `-4: warning`,
`-5: info`) — a component-scoped custom-property tier, matching the CLAUDE.md rule that a component's
internal token layer lives in its own file, not in `variables.css`. Use for categorical series in
charts; they inherit theming through the roles they alias.

### 2f. Semantic aliases (convenience names over the roles)

Thin aliases; prefer them where they read clearer, but they resolve to the roles above.

| Alias | Resolves to | Use for |
|---|---|---|
| `--bg` | `--color-surface` | Page background. |
| `--surface` | `--color-surface-dim` | Recessed surface. |
| `--sidebar-bg` / `--card-bg` | `--color-surface-container` | Sidebar / card backgrounds. |
| `--border` | `color-mix(--color-on-surface 10%, transparent)` | **Container chrome** (cards, tables, panels) — deliberately fainter than `--color-outline` so interactive outlines stand out. |
| `--divider` | `--border` | Divider lines. |
| `--text-primary` | `--primary-900` (light) → `#EAEBED` (dark) | **Page headings AND body.** Brand navy, not black. |
| `--text-secondary` | `--neutral-500` → `#BFC1C8` | Secondary page text. |
| `--text-muted` | `--color-on-disabled` | Muted/hint page text. |
| `--text-on-dark` | `--neutral-white` | Text on permanently-dark surfaces. |
| `--interactive` / `--interactive-hover` / `--interactive-light` | `--color-secondary` / navy-ish hover / `--color-secondary-container` | Links, nav, tabs, focus accents. |
| `--accent` / `--accent-light` | `--interactive` / `--interactive-light` | Docs-shell chrome accents. |
| `--tertiary-purple` / `-hover` / `-light` | tertiary role / `--tertiary-800` / `--tertiary-50` | Legacy purple accents. |
| `--green/-light`, `--red/-light`, `--yellow/-light`, `--blue/-light` | success / error / warning / info main + container | Shorthand status colors. |

---

## 3. Typography

### 3a. Font families — always via token, never a quoted family name

| Token | Value | Role |
|---|---|---|
| `--font-heading` | `'Epilogue', sans-serif` | Display + headings (h1–h6). |
| `--font-body` | `'Inter', sans-serif` | Body/UI text. |
| `--font-mono` | `'DM Mono', monospace` | Code, labels, overlines. |

### 3b. Type scale (`--font-size-*` + matching `--line-height-*`)

**Every `font-size` flows through one of these.** `base.css` binds h1–h6 to the scale; a legacy size
with no exact token snaps to the nearest **role-appropriate** token, never a new px value.

| Token | Size / line-height | Role / binding | When NOT to use → alternative |
|---|---|---|---|
| `--font-size-display` | 28px / 1.15 | **h1** (Epilogue). | Sub-headings → heading-* tiers. |
| `--font-size-heading-xl` | 24px / 1.2 | **h2**. | — |
| `--font-size-heading-lg` | 22px / 1.25 | **h3**. | — |
| `--font-size-heading-md` | 18px / 1.3 | **h4**. | — |
| `--font-size-heading-sm` | 17px / 1.35 | **h5**. | — |
| `--font-size-heading-xs` | 15px / 1.4 | **h6**. | Body copy → body-* tiers. |
| `--font-size-body-lg` | 14px / 1.5 | Comfortable body / base `<body>`. | — |
| `--font-size-body-md` | 13.5px / 1.5 | **UI base**: inputs, buttons, table cells. | — |
| `--font-size-body-sm` | 12.5px / 1.6 | Dense/secondary body. | — |
| `--font-size-label` | 13px / 1.4 | Form labels, control labels. | — |
| `--font-size-caption` | 12px / 1.4 | Captions, helper/hint text. | — |
| `--font-size-badge` | 11.5px / 1.2 | Badge text. | — |
| `--font-size-overline` | 12px / 1.2 | UPPERCASE table headers / overlines. | — |
| `--font-size-mono-md` | 13px / 1.5 | Mono code (DM Mono). | — |
| `--font-size-mono-sm` | 11px / 1.4 | Small mono labels. | — |

### 3c. Weights & letter-spacing

| Token | Value | Notes |
|---|---|---|
| `--font-weight-regular / -medium / -semibold / -bold / -extrabold` | 400 / 500 / 600 / 700 / 800 | Use the token, not a loose numeric weight. |
| `--letter-spacing-display / -heading-xl / -heading-lg / -heading-md` | −0.5 / −0.4 / −0.3 / −0.2 px | Headings only; tightens large Epilogue sizes. No tracking token for body/small headings (they use default). |

---

## 4. Spacing (`--space-*`) — 4px base grid

Consume tokens; never hardcode px for padding/gap/margin. Scale = multiples of 4px.

| Token | px | Typical use |
|---|---|---|
| `--space-1` | 4 | Icon gaps, min separators. |
| `--space-2` | 8 | Inline element gaps. |
| `--space-3` | 12 | Badge / chip padding. |
| `--space-4` | 16 | Compact card padding. |
| `--space-5` | 20 | Form field gaps. |
| `--space-6` | 24 | Standard card padding. |
| `--space-8` | 32 | Medium section padding. |
| `--space-10` | 40 | Block separators. |
| `--space-12` | 48 | Main content padding. |
| `--space-16` | 64 | Section separators. |
| `--space-20` | 80 | Hero / large section padding. |

> The scale is intentionally sparse (no `--space-7/-9/-11`…). If you need a between-value, step to the
> nearest token — do not invent a px value.

---

## 5. Radius (`--radius-*`)

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 4px | Small controls, insets. |
| `--radius-md` | 8px | Inputs, small buttons. |
| `--radius-lg` | 12px | Cards, standard buttons. |
| `--radius-xl` | 16px | Large surfaces. |
| `--radius-full` | 9999px | Pills, avatars, circular icon buttons. |
| `--radius` | = `--radius-lg` | Default radius alias. |

**Governance rule (GOVERNANCE.md §4.3): radius scales with component SIZE, never with VARIANT.** A
size-modifier class (`btn-sm`, `btn-lg`, `btn-xl`) already carries the size-appropriate radius —
adding the size class is sufficient. Never add a separate inline `border-radius`, and never vary
radius to distinguish a *variant* (primary vs secondary keep the same radius at the same size).

---

## 6. Shadow / elevation

| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 3px rgba(28,36,56,.06)` | Subtle lift (rows, small cards). |
| `--shadow-md` | `0 4px 16px rgba(28,36,56,.08)` | Cards, popovers. |
| `--shadow-lg` | `0 8px 32px rgba(28,36,56,.12)` | Modals, high elevation. |
| `--btn-elevation` / `--btn-elevation-hover` | navy multi-layer (light) → **black** multi-layer (dark) | The MD3 Elevated Button lift; consumed as a runtime var, **not** a `--shadow-*`. |

**Dark-mode gotcha (documented in `variables.css` + MEMORY):** `--shadow-*` values are navy-tinted and
**do not have a dark override** — navy shadows disappear on dark surfaces. `--btn-elevation` exists as
a *separate runtime variable* precisely so it can flip to black shadows under `[data-theme="dark"]`.
For any new theme-aware shadow, follow that pattern (own runtime var + dark override), rather than
expecting `--shadow-*` to recalibrate.

---

## 7. Motion (`--duration-*`, `--ease-*`)

Choreography guidance (what to animate, how much, reduced-motion) lives in
[`guidelines/motion.md`](guidelines/motion.md) — these tokens are the vocabulary.

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 120ms | Micro-feedback (hover, small state). |
| `--duration-normal` | 200ms | Standard transitions. |
| `--duration-medium` | 300ms | Larger element moves. |
| `--duration-slow` | 450ms | Large/complex transitions. |
| `--duration-sheet` | 500ms | Shared slide duration for all Sheets. |
| `--ease-default` | `cubic-bezier(.4,0,.2,1)` | General-purpose (MD3 standard). |
| `--ease-enter` | `cubic-bezier(0,0,0,1)` | Elements entering. |
| `--ease-exit` | `cubic-bezier(.3,0,1,1)` | Elements exiting. |
| `--ease-expressive` / `-enter` / `-exit` | overshoot curves | **Spatial only** (movement/scale/rotate). MD3 excludes effects from overshoot — **never** pair with a color/opacity transition. |
| `--ease-emphasized` | `cubic-bezier(.32,.72,0,1)` | Shared curve for every edge-anchored Sheet (Side + Bottom) — smooth, no overshoot. Use for large edge-anchored surfaces. |

---

## 8. Breakpoints (`--breakpoint-*`)

| Token | Value | Meaning |
|---|---|---|
| `--breakpoint-md` | 768px | Below: single-column layout; grids collapse. Below 768 the app-shell sidebar becomes a modal navigation drawer (`layout.css`, GOVERNANCE §14.3). |
| `--breakpoint-lg` | 1024px | Below: compact content; sidebar may collapse. |

**CSS limitation:** media queries **cannot** consume `var()`. Use the literal values (`768px`,
`1024px`) in `@media` and keep them in sync with these tokens. The tokens are the canonical
reference; the literals are the enforcement.

---

## 9. Layout dimensions

| Token | Value | Use |
|---|---|---|
| `--sidebar-width` | 220px | App-shell sidebar width. |
| `--topbar-height` | 56px | App-shell topbar height. |

---

## 9b. Density and touch surface

| Token | Web | Native | Use |
|---|---|---|---|
| `--target-min` | 44px | **48px** | **A floor, not a size.** The minimum touchable surface: WCAG 2.5.5 / iOS is 44, Android is 48, so native takes 48 and covers both. A control may be taller, never shorter. |
| `--row-height` | 36px | **48px** | Table and list row. |
| `--control-height` | 36px | **48px** | Default button, input and select. |
| `--screen-gutter` | *(n/a)* | **20px** | Native only: the side margin of a screen. **Deliberately not `--column-gutter`** — in native there is no column to centre and no `max-width`, so they are different concepts and must not be crossed. |

Before these existed the 44px lived loose inside media queries in `components.css`: it was a patch
per file, not a decision. If a control needs to grow on touch, it reads `--target-min`.

---

## 9c. Platform axis (`[data-platform="native"]`)

**This is not a theme.** Light/dark is a **colour** axis; desktop/native is a **size and density**
axis. They are independent — a native app in dark mode uses both blocks at once.

Embassy's scale is a desktop scale: the body base is 13.5px, which is the size of iOS's *caption*.
The `[data-platform="native"]` block in `variables.css` holds the phone values under **the same
token names**, so a component reads `--font-size-body-md` on either platform and does not know
where it runs.

| | Web | Native |
|---|---|---|
| `--font-size-body-md` (the base) | 13.5px | **16px** |
| `--font-size-body-lg` | 14px | **17px** |
| `--font-size-label` | 13px | **15px** |
| `--font-size-caption` | 12px | **13px** |
| `--font-size-display` | 28px | **32px** |
| editorial `lg / md / sm` | `clamp()` fluid | **44 / 34 / 28**, frozen |

22 tokens change value between platforms; the full table is in `MOBILE.md` §2.

**React Native cannot read CSS.** `scripts/build-tokens.mjs` parses `variables.css` — still the
only source — and emits `tokens/`: `embassy.tokens.ts` (`light`, `dark`, `native`, `nativeDark`),
`gluestack.config.ts`, `theme.css` and `NATIVE-NOTES.md`. Everything in `tokens/` is **generated**:
a value is changed in the CSS and regenerated, never edited there.
`node scripts/build-tokens.mjs --check` fails on drift and belongs in CI.

`NATIVE-NOTES.md` lists what does not survive the crossing: unitless `line-height` and `em`
`letter-spacing` (RN measures both in points), `clamp()`, `color-mix()`, chained `var()`,
multi-layer `box-shadow` and gradients.

---

## 10. Opacity / z-index / state-layer tokens

- **No standalone `--opacity-*` or `--z-index-*` scale exists** in `variables.css`. Opacity is
  applied inline via `color-mix(... N%, transparent)` where a token needs a translucent derivative
  (`--border`, `--color-focus-ring`, `--color-error-ring`, `--color-nav-hover/-press`). Reuse that
  `color-mix` pattern rather than introducing a new opacity token.
- **No MD3 `--md-sys-state-*-opacity` state-layer tokens are present** in this buildless snapshot
  (that system existed only in the reverted Tailwind era). State layers today are the explicit
  `--color-*-hover`, `--color-nav-*`, and `color-mix` derivatives above.

## 11. MD3 bridge (`css/md-sys-bridge.css`) — optional

Optional layer that aliases MD3 **system** names (`--md-sys-color-*`,
`--md-sys-typescale-*-font`) onto Embassy roles, so components written in native MD3 nomenclature
resolve against the Embassy palette. Flow is one-directional: Embassy palette → Embassy role →
MD3 name. Because each alias points at a `--color-*` role, it inherits dark-mode recalibration for
free (no dark override in the bridge). Load it **only** if you adopt MD3-named components; otherwise
consume `--color-*` directly.

---

## 12. Dark mode — automatic recalibration

Set `data-theme="dark"` on `<html>`. The `[data-theme="dark"]` block in `variables.css` **overrides
only the semantic `--color-*` layer** (and the theme-aware aliases `--text-*`, `--interactive-hover`,
`--btn-elevation*`). Primitives are left alone; the shell reassigns some neutrals, which is why the
dark block writes literal hex for neutral-derived roles to avoid cross-resolution.

**Consequences for authors:**
- Components consume roles → they recalibrate with **zero per-theme override**. Never write a
  `[data-theme="dark"]` block inside a component file.
- `--color-primary` **inverts to white** in dark (max contrast, WCAG AAA on navy). So Primary fills
  and *selected* controls render white in dark — expected, not a bug.
- `--color-focus` has **no** dark override on purpose (consistent focus signal across themes); its
  derivative `--color-focus-ring` therefore resolves the same in both.
- A `[data-theme="light"]` scoped block also exists, so a light island can live inside a dark page
  (used by the docs site's state demos).

---

## Known token gaps

- **`--warning-*` primitive ramp is incomplete**: it omits `--warning-300` and `--warning-600`
  (present: 50, 100, 200, 400, 500, 700, 800, 900). All other status ramps
  (success/error/info) are full 50–900. Minor; only matters if a future warning role needs one of the
  missing steps. Because product code consumes the `--color-warning*` roles (not primitives), this
  gap is invisible to consumers today — flag it only if a new warning tier is required.
- No other unmet needs found: color (primitives + full semantic role set incl. states, surfaces,
  outlines, nav, focus/error rings, inverse, disabled, scrim), typography (families + full size scale
  + weights + tracking), spacing, radius, shadow/elevation, motion (durations + eases), breakpoints,
  and layout dims are all expressible with the current tokens. There is intentionally **no**
  standalone opacity or z-index scale and **no** MD3 state-layer-opacity tier — these are handled by
  `color-mix` derivatives and explicit hover/nav roles, which is the documented approach, not a gap.
