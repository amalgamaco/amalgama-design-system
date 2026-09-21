# TOKENS.md — Embassy Token Reference (semantic purpose + when-to-use)

**Source of truth is `css/variables.css`.** This document does not define tokens or values; it
adds the *semantic purpose* and the *when-to-use / when-NOT-to-use* rule for each group so agents
and humans pick the **right** token. If a value here ever disagrees with `variables.css`, the CSS
wins — fix this doc, not the CSS.

**The one rule that governs everything (from CLAUDE.md — "Tokens are the law"):**

- All color via `var(--<role>)` — `--primary`, `--surface`, `--on-surface`, `--border`; radii via
  `var(--radius-*)`; shadows via `var(--shadow-*)`; spacing via `var(--space-*)`; every `font-size`
  via a `--font-size-*` token. **Never a raw hex, never a loose px.**
- **Consume SEMANTIC ROLES, never PRIMITIVES, in product/component code.** Primitives
  (`--neutral-*`, `--primary-*`, `--secondary-*`, `--tertiary-*`, `--success-*`, `--error-*`,
  `--warning-*`, `--info-*`) are the raw palette — they are the *input* to the semantic roles and
  must not be referenced directly outside `variables.css`. A component that uses `--primary-900`
  instead of `--primary` breaks dark mode, because only the
  los roles semánticos layer recalibrates under `[data-theme="dark"]`.
- **Dark mode is automatic.** Set `data-theme="dark"` on `<html>`; the semantic los roles semánticos layer
  recalibrates itself. Components need **zero** per-theme overrides. (See "Dark mode" at the end.)

---

## 1. Color — primitives (the raw palette)

These are the tonal ramps. **Do not consume them in component or product code** — they exist only
to feed the semantic roles in §2. Referencing a primitive directly is the single most common way to
break theming. The correct alternative is always the matching los roles semánticos role.

| Group (token pattern) | Steps present | Purpose | Use directly? |
|---|---|---|---|
| `--neutral-*` | `10, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, black, white` | Greyscale ramp feeding surfaces, text, borders, disabled. | **No** — use surface / text / outline / disabled roles. |
| `--primary-*` (navy) | `50, 60, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900` | Brand navy; feeds the Primary role. `--primary-60` = periwinkle Primary Container (light). | **No** — use `--primary*`. |
| `--secondary-*` (agile/periwinkle blue) | `10, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 925, 950` | Interactive accent (links/nav/focus) + Secondary tonal role. `925`/`950` are dark-mode container/on values. | **No** — use `--secondary*` / `--secondary` / `--focus`. |
| `--tertiary-*` (purple/violet) | `50–900` + `950` | Purple accent family. | **No** — use `--tertiary*`. |
| `--success-*` | `50–900` + `950, 975` | Green status ramp. | **No** — use `--success*` / `--success*`. |
| `--error-*` | `50–900` + `950, 975` | Red status ramp. | **No** — use `--error*` / `--error*`. |
| `--warning-*` | `50, 100, 200, 500, 600, 700, 800, 900` + `925, 950, 975` (no `300`/`400`) | Amber status ramp. | **No** — use `--warning` / `--warning-container`. |
| `--info-*` | `50–900` + `950` | Blue status ramp. | **No** — use `--info` / `--info-container`. |
| `--accent-*` (brand) | `hot-pink, chelo-yellow, kika-green, pink-sebiche, sky, lime` | The Manual de Marca accents. **Single values, not ramps** — the Manual defines one value per accent, not ten, so they carry no step number. | **No** — use the `--accent-*` roles (§2a-bis). |

### 1a. Where this ramp differs from the Figma Baseline

The published Baseline (Styles · Color · Baseline) is the Figma source for the ramps. Embassy adds
**eleven steps that are not in it**, every one of them because a role needed a value that passed AA
and the ramp had no step for it. They are Embassy extensions, not Figma drift, and the reason lives
in the comment next to each one in `css/variables.css`:

`neutral-30` · `neutral-350` · `neutral-750` · `primary-60` · `tertiary-950` · `success-950` ·
`success-975` · `error-950` · `error-975` · `warning-925` · `warning-950` · `warning-975` ·
`info-950`.

One step was **mis-numbered until sep-2026**: `--warning-400` held `#FFA120`, which the Baseline
names `warning-600`. It had no consumers and was renamed to `--warning-600`; there is still no
`warning-400` or `warning-300`, because the Baseline has none.

---

## 2. Color — semantic roles — CONSUME THESE

### The name of a role is the role, with nothing in front of it

`--surface`, `--primary`, `--on-surface`, `--outline`, `--focus`. **Not** `--color-surface`.

Until sep-2026 every role carried a `--color-` prefix. It was retired because the system's
reference is Material Design, and Material names the role and nothing else: `md.sys.color.surface`
is written `--surface` once you drop the namespace, and there is no Embassy reason to keep a
namespace that says only "this is a colour" — which the name already says. The prefix also made the
token table read as a wall of the same nine characters, and it is what let a second, unprefixed
vocabulary (`--bg`, `--card-bg`, `--interactive`) grow beside the roles without looking like a
duplicate.

The rename touched 4153 references and **changed no value**: all 630 token×theme pairs were
resolved before and after and diffed. `--color-` is now a retired prefix, and `validate-ds` check
`[2]` fails on any new occurrence of it.

Primitives keep their family name (`--primary-900`, `--neutral-100`), so a role and its primitive
never collide: `--primary` and `--primary-900` are two different custom properties. The three brand
accents were the one real collision — the role is `--accent-hot-pink`, the primitive is
`--palette-accent-hot-pink`.

The usage layer. Every one is theme-aware (recalibrated in `[data-theme="dark"]`). Each accent
comes as a **quartet**: main (`--X`), on-main (`--on-X`), container (tonal recessive
surface), on-container (text on that container). **Pair `X` with `on-X`, and `X-container` with
`on-X-container`** — never mix tiers (e.g. text set to `--on-primary` on a
`--primary-container` background will fail contrast).

### 2a. Brand / accent roles

| Token | Purpose | When to use | When NOT to use → alternative |
|---|---|---|---|
| `--primary` | Highest-emphasis brand fill. | The one Primary CTA per context (filled button, FAB). | Body/heading text → `--on-surface`. Note: in dark it flips to **white**, so selected controls read white. |
| `--on-primary` | Text/icon on `--primary`. | Label inside a filled Primary button. | On any other surface. |
| `--primary-container` | Tonal navy surface (lower emphasis than filled). | Elevated/tonal button bg, selected nav pill backing. | As a page background → surface tiers. |
| `--on-primary-container` | Text on primary container. | Label on a `-container` surface. | — |
| `--primary-hover` | Primary hover state. | `:hover` of Primary fills. | Static fills → `--primary`. |
| `--secondary` | Interactive accent (agile blue). | Links, active nav/tabs, focus accents (via `--secondary`). | A second filled CTA competing with Primary. |
| `--on-secondary` | Text on `--secondary`. | — | — |
| `--secondary-container` | Light tonal blue (inverts vs Primary: light bg + navy text). | Secondary/tonal button, selected chip, nav-selected backing. | When you need a *neutral* recessive button — that's still this token today (Button Secondary consumes it directly). |
| `--on-secondary-container` | Navy text on secondary container. | Chip/segmented selected label. | — |
| `--tertiary` / `-on-tertiary` / `-tertiary-container` / `-on-tertiary-container` | Purple accent quartet. | Tertiary-purple accents, `badge-tertiary`. | As a status color — use success/warning/error/info. |

### 2a-bis. Brand accents (`--accent-*`) — the Manual de Marca palette

Not status and not hierarchy: the colour voice of Amalgama, with names of their own. **The Manual's
rules are part of the token** — honour them or the token is being misused. Full context: `BRAND.md` §3.

| Role (consume this) | Primitive · value | Rules |
|---|---|---|
| `--accent-hot-pink` | `--palette-accent-hot-pink` `#FE566A` | Sanctioned. The most-used accent of the Manual. Not `--error` — that means *error*. |
| `--accent-chelo-yellow` | `--palette-accent-chelo-yellow` `#FFC700` | Sanctioned. **Never on blue or light blue** — *no todos somos hinchas de Boca :)* |
| `--accent-kika-green` | `--palette-accent-kika-green` `#67B9A4` | Sanctioned. Not the success green. |
| `--on-accent` | `--primary-900` | Text/icon on any of the three. **White fails AA on all of them** (3.09:1 on the pink, 2.34:1 on the green). |
| *(no role)* | `--palette-accent-pink-sebiche` `#F1A7A3` | Documented, **not sanctioned** — registered so nobody reinvents it. No role, so nothing can consume it by accident. |
| *(no role)* | `--palette-accent-sky` `#49A4FF` | Documented, not sanctioned. Sits close to `--chart-1`; in a chart use the chart token. |
| *(no role)* | `--palette-accent-lime` `#E0FF4F` | Documented, not sanctioned. Appears once in the Manual, as a highlight. |

The three sanctioned accents **do not recalibrate in dark**: they are brand colour, not surface, and
the pair with `--on-accent` already passes in both themes.

Across any one composition: **at most two accents**, one if it is type. An accent is never a
dominant background and never body copy.

### 2b. Status roles (success / warning / error / info)

Same quartet shape. Each also has a `--X-hover` for success/error. **Status = meaning, not
decoration** — do not use a status color just because you like the hue.

| Token family | Purpose | When to use | When NOT to use → alternative |
|---|---|---|---|
| `--success` + `-on-success` + `-success-container` + `-on-success-container` + `--success-hover` | Positive/confirmation. | Success alerts, "open"/"active" badges, positive stat trend. | Neutral confirmation with no valence → neutral surface. |
| `--warning` + `-on-warning` + `-warning-container` + `-on-warning-container` | Caution (non-blocking). | Warning alerts, draft/pending badges. `--on-warning` is dark (navy/near-black) because warning is a light hue. | Hard errors → error family. |
| `--error` + `-on-error` + `-error-container` + `-on-error-container` + `--error-hover` | Destructive / invalid. | Error alerts, `is-error` inputs, destructive buttons. | Warnings/cautions → warning family. |
| `--info` + `-on-info` + `-info-container` + `-on-info-container` | Neutral informational. | Info alerts/badges. | Interactive accent (links) → `--secondary`. |

### 2c. Surface tiers, text, borders, misc roles

| Token | Purpose | When to use | When NOT to use → alternative |
|---|---|---|---|
| `--surface` | App base background. | Page/app canvas. | Card/panel bg → `--surface-container` / `--surface-container`. |
| `--surface-dim` | Slightly recessed surface. | Muted section behind cards. | — |
| `--surface-bright` | Brightest surface (white / lightest dark). | Raised emphasis surface. | — |
| `--surface-container-lowest / -low / -(base) / -high / -highest` | Elevation ladder of container surfaces. | Cards, menus, sheets — pick the tier by elevation (higher = more raised). | Page canvas → `--surface`. |
| `--surface-variant` | Alt subtle surface. | Zebra rows, subtle fills. | — |
| `--on-surface` | **All primary content on a surface** — page headings, body, and text inside components alike. Near-black. | Any primary text or icon. | On a filled/tonal surface → that surface's own `on-` role. |
| `--on-surface-variant` | Medium secondary content on a surface. | De-emphasized in-component text. | Page secondary text → `--on-surface-variant`. |
| `--outline` | **Prominent** border — interactive elements (buttons, inputs, chips). | Outlines that must read clearly. | Container chrome (cards/tables/panels) → `--border`. |
| `--outline-variant` | **Subtle** border. | Chip rest border, faint dividers within a component. | Where a border must stand out → `--outline`. |
| `--inverse-surface` / `--inverse-on-surface` / `--inverse-primary` | Inverted surface + its content (e.g. dark tooltip on light UI) + inverse accent. | Snackbars/tooltips that invert against the theme. | Normal surfaces → surface tiers. |
| `--disabled` / `--on-disabled` | Disabled control fill + its text. | `:disabled` states. | — |
| `--focus` | Focus accent (agile blue). **No dark override** — deliberately identical across themes (consistent focus signal). | Focus outlines. | — |
| `--focus-ring` | Focus halo = `color-mix(--focus 15%, transparent)`. SSOT-derived; never hardcode `rgba(...)`. | Focus ring/glow. | — |
| `--error-ring` | Invalid-input halo = `color-mix(--error 12%, transparent)`. Recalibrates in dark automatically. | `.is-error` input ring. | Never hardcode the rgba. |
| `--scrim` | Modal/overlay backdrop = `rgba(0,0,0,.32)`. | Dialog/sheet/drawer scrim. | — |
| `--shadow` | `--neutral-900` (light) → `--neutral-black` (dark) | Base colour for elevation. Present in the published Baseline and added here in sep-2026. **The `--shadow-*` composites do not derive from it yet** — they carry Embassy's own navy tint `rgba(28,36,56,…)`. Two truths about one concept; unifying them changes every shadow in the system, so it is a separate decision, not an anchoring fix. |

### 2d. Nav / menu interaction roles ("blue hover")

Menu and sidebar-nav hover reads **blue, never grey**. All derived from
`--secondary-container`, so they recalibrate in dark with no override.

| Token | Purpose | Use / avoid |
|---|---|---|
| `--nav-hover` | Nav/menu item hover bg (secondary-container @ 45%). | Hover of nav items & dropdown/context-menu rows. Do **not** substitute a grey. |
| `--nav-hover-content` | Content color on hover. | Icon/label color on nav hover. |
| `--nav-press` | Pressed bg (secondary-container @ 70%). | `:active` of nav/menu items. |
| `--nav-selected` | Selected bg (full secondary-container). | Current nav item / selected menu row. |
| `--nav-selected-content` | Content on selected. | Label/icon of the selected item. |

> Not for Segmented Button or Chip — those own their selection treatment.

### 2e. Chart categorical tokens (`--chart-1..5`)

**Not in `variables.css`.** They are defined **locally in `css/components/chart.css`**
(`--chart-1: var(--secondary)`, `-2: tertiary`, `-3: success`, `-4: warning`,
`-5: info`) — a component-scoped custom-property tier, matching the CLAUDE.md rule that a component's
internal token layer lives in its own file, not in `variables.css`. Use for categorical series in
charts; they inherit theming through the roles they alias.

### 2e-bis. Interaction state (`--hover` / `-pressed` / `-selected`)

Documented on the site's State Palette since v2.1 and **missing from the CSS until sep-2026** — three
phantom tokens. They exist now, derived rather than literal:

| Token | Value | Use |
|---|---|---|
| `--hover` | `color-mix(--secondary 8%, transparent)` | Hover overlay on an interactive element. Derived, so it recalibrates in dark on its own. |
| `--pressed` | `color-mix(--secondary 14%, transparent)` | Press / tap overlay. |
| `--selected` | `--secondary-container` | Selected background. The site documented `secondary-50`; it was unified with the token that already means SELECTED everywhere in the system rather than opening a second value for one meaning. `--nav-selected` stays as the nav-scoped alias. |

### 2f. The alias tier (all but one of it is gone)

There used to be a fourth tier here: unprefixed convenience names sitting over the roles. It is
empty now except for `--border`, and the architecture is the one Material describes —
**primitives → roles → component tokens**.

**Twenty-one were removed in sep-2026.** The Design System file defines primitives and roles; a second, unprefixed name for the same value is duplicate vocabulary, and it is what made the
token table unreadable. Each one was checked first: removed only when it resolved to **exactly** its
role's value in *both* themes.

Gone, with their usages migrated to the role (110 replacements):
`--bg` → `--surface` · `--card-bg`, `--sidebar-bg` → `--surface-container` ·
`--interactive` → `--secondary` · `--interactive-light` → `--secondary-container` ·
`--interactive-hover` · `--tertiary-purple`, `-hover`, `-light` ·
`--green`, `--red`, `--yellow`, `--blue` and their `-light` siblings → the status roles ·
`--surface-alias` (pointed at `--surface-`**`dim`**) · `--divider` (an exact alias of `--border`) ·
`--accent`, `--accent-light` (prefix collided with the brand accents).

Removing `--bg`/`--card-bg`/`--sidebar-bg` also let the **docs shell drop its bridge**: it used to
re-point those three at its own `--md-*` set so component demos picked up the shell's surfaces. Once
`color-surface` became `neutral-10` (the DS value), the `--md-*` surfaces and the roles resolve to
the same hexes, so the bridge was redundant.

**Collapsed in sep-2026 too: the whole `--text-*` and `--ctx-*` families.** The Design System
documents two levels of content on a surface — `on-surface` and `on-surface-variant`, Material's
shape — and five `--text-*` tokens had grown on top of them, each matching its role in one theme and
diverging in the other, with no row in any table of the system. `--ctx-surface` / `-raised` were
exact duplicates of `surface` / `surface-container`, and the mechanism they existed for (a container
redefining them) works just as well redefining the role, because custom properties already cascade.
`--ctx-track` / `-thumb` moved into `segmented-button.css` as `--seg-btn-track` / `-thumb`, their only consumer.
**Page text is therefore near-black now, not brand navy.**

**The survivors are not duplicates** — each says something the DS does not:

| Alias | Why it survives |
| --- | --- |
| `--border` | `on-surface` at 10%. The DS has `outline` and `outline-variant`; neither is container chrome. |

---

## 3. Typography

### 3a. Font families — always via token, never a quoted family name

| Token | Value | Role |
|---|---|---|
| `--font-heading` | `'Epilogue', sans-serif` | Display + headings (h1–h6). |
| `--font-body` | `'Manrope', 'Inter', sans-serif` | Body/UI text. Manrope since sep-2026; Inter stays in the stack as a fallback, not as a decision. **Manrope has no italic** — an `<em>` renders as a synthetic oblique, so a real italic is a collateral case (see `BRAND.md` §4). |
| `--font-mono` | `'DM Mono', monospace` | Código, atajos de teclado, índice de sección, datos tabulares. **No el `.overline`**, que va en `--font-heading` desde sep 2026. |
| *(no token)* | `Poppins` | **The logotype, and nothing else** (Manual p. 23). It has no token because the logo is a file — `css/brand-collateral.css` `.logotype` is the single exception, for a generated document that cannot embed the SVG. |

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
| `--font-size-body-editorial` | 16px / 1.875 | **Collateral only** — the Manual's 16/30 reading block, beside an editorial headline. | A product screen → `--font-size-body-md`. |
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
| `--space-24` | 96 | **Collateral only** — deck sheet, cover, editorial opening. No product screen needs it. |
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
| `--radius-2xl` | 24px | **Collateral only** — large deck panels. |
| `--radius-full` | 9999px | Pills, avatars, circular icon buttons. |
| `--radius` | = `--radius-lg` | Default radius alias. |
| `--radius-button` | *undeclared* | **The shape switch, and the only one.** Left undeclared on purpose: each button then takes the radius of its size. A brand theme that declares it `9999px` turns every button in the project into a pill at once, without touching cards, modals or fields. It is a brand decision taken once at kickoff — never per screen. See `design.md` §6.3. |

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
| `--row-height` | 36px | **48px** | Table and list row. **Comes from the screen's declared density** (below), not from this default. |
| `--control-height` | 36px | **48px** | Default button, input and select. |
| `--screen-gutter` | *(n/a)* | **20px** | Native only: the side margin of a screen. **Deliberately not `--column-gutter`** — in native there is no column to centre and no `max-width`, so they are different concepts and must not be crossed. |

### Declared density — `data-density`

Density is a **decision per screen**, not a default: who uses it, how many hours a day, with which
pointer. Declared on the screen root, everything that depends on it recalibrates by itself.

```html
<div data-ds-screen data-density="compact">      <!-- staff, eight hours   -->
<div data-ds-screen data-density="comfortable">  <!-- once a month         -->
```

| Density | `--row-height` / `--control-height` | When |
|---|---|---|
| `compact` | **32px** | Operational screens: a desk console, a dense back-office table, anything someone works in all day with a mouse |
| `comfortable` | **36px** (the default, written explicitly) | Screens someone visits occasionally, consumer-facing flows, forms |
| `[data-platform="native"]` | **48px** | An app. Platform always wins over density |

Compact also steps the eight `--screen-*` tokens down one notch, keeping the proportion `D24`
measures. Two things are **not** density and don't move: the touch floor (with a coarse pointer,
compact returns to `--target-min` — 24px is enough for a mouse per WCAG 2.5.8 and not for a finger
per 2.5.5) and the data/label weight order (`M13` / `D12`).

Criterion `A1`, failure `D17`, rule in `guidelines/aceptacion-de-pantalla.md`.

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
  (`--border`, `--focus-ring`, `--error-ring`, `--nav-hover/-press`). Reuse that
  `color-mix` pattern rather than introducing a new opacity token.
- **No MD3 `--md-sys-state-*-opacity` state-layer tokens are present** in this buildless snapshot
  (that system existed only in the reverted Tailwind era). State layers today are the explicit
  `--*-hover`, `--nav-*`, and `color-mix` derivatives above.

## 11. MD3 bridge (`css/md-sys-bridge.css`) — optional

Optional layer that aliases MD3 **system** names (`--md-sys-color-*`,
`--md-sys-typescale-*-font`) onto Embassy roles, so components written in native MD3 nomenclature
resolve against the Embassy palette. Flow is one-directional: Embassy palette → Embassy role →
MD3 name. Because each alias points at a semantic role, it inherits dark-mode recalibration for
free (no dark override in the bridge). Load it **only** if you adopt MD3-named components; otherwise
consume the semantic roles directly.

---

## 11b. Relationship to Material Design 3 — audited 2026-09-21

`CLAUDE.md` already states the stance: MD3 is a **structural** reference — "documentation
architecture, token structure, specs, behaviors and usage guidelines only. Do not copy their visual
style." That sentence is easy to nod at and impossible to check, so here it is layer by layer, with
what was measured against the published MD3 token set.

| Layer | MD3 structure? | What that means here |
|---|---|---|
| **Color · roles** | **Adopted, literally** | The four groups with their full quartet (`primary` / `on-primary` / `primary-container` / `on-primary-container`, × primary · secondary · tertiary · error), the whole surface ramp (`surface-dim`, `-bright`, `container-lowest/low/·/high/highest`, `-variant`, `on-surface`, `on-surface-variant`), `outline` + `outline-variant`, the three `inverse-*`, and `scrim`. Plus MD3's three-layer architecture — palette → system role → component token — which `GOVERNANCE.md` §2.2 writes down as a rule |
| **Color · names** | Adopted via bridge | `css/md-sys-bridge.css` (§11) exposes the real `--md-sys-color-*` names as aliases, redeclared inside `[data-theme]` because custom-property substitution resolves where it is declared |
| **State layers** | **Adopted, exact** | `GOVERNANCE.md` §5.5: hover 8% · focus 10% · pressed 10% · dragged 16% · disabled content 38% · disabled container 12%. The spec percentages, unmodified. The *implementation* differs (`color-mix()` on the background instead of a `::before` layer) and that divergence is documented there as equivalent |
| **Shape** | Four of six steps | `--radius-sm/-md/-lg/-xl` = 4 · 8 · 12 · 16 coincide with MD3's extra-small → large. Our `-2xl` is **24** where MD3's extra-large is **28**, and the names are t-shirt sizes rather than MD3's `corner-*`. `--radius-button` is a brand switch with no MD3 equivalent |
| **Typography** | **Not adopted** | MD3 is 15 roles (display · headline · title · body · label, × large/medium/small) on a 16px body base. Embassy's scale is its own — editorial, display, heading-xl…xs, body-lg/md/sm, label, caption, badge, overline, overline-sm, mono — on a **13.5px** base, because it is a desktop scale (§8.2). We have no `title-*` or `headline-*`; MD3 has no caption, overline or badge. The bridge maps **only the family** of the 15 MD3 typescale roles, so an `@material/web` component doesn't fall back to Roboto |
| **Spacing** | Not applicable | MD3 publishes the 4dp grid, not a named spacing token set. The grid we do follow (every `--space-*` is a multiple of 4, deliberately sparse — no 7, 9 or 11); the names and the steps are ours |
| **Elevation** | Deliberate divergence | MD3 tints the surface per level (`surface-tint`, six levels). Embassy has three navy-tinted shadows and one rule — border = in the plane, shadow = overlay — and they do **not** recalibrate in dark. See §9 |
| **Motion** | Partly | `--ease-default` is MD3's standard curve, and the rule that effects never take an overshoot curve is MD3's too (§10) |

**What Embassy adds on top of MD3.** The `success` / `warning` / `info` families (MD3 ships `error`
only), each with its `-fill` / `-text` / `-hover` members; `--border`; `--focus` / `--focus-ring`;
`--selected`; the `--nav-*` layer; the three brand accents; `--target-min`; the `--screen-*` density
layer and `data-density` (§9b). None of these has an MD3 name, so someone arriving from Material
will not find them by looking for one — that is the cost of the additions, and it is accepted.

**What MD3 has and Embassy leaves out on purpose — decisions, not gaps:**

- **`surface-tint`**, and tonal elevation with it. It is the other side of the elevation decision
  above: surfaces step through the ramp, they don't get tinted by height. Written here so nobody
  "fixes" its absence.
- **The twelve `*-fixed*` roles** (`primary-fixed`, `on-primary-fixed-variant`, …). They exist so a
  color can stay put across themes; every Embassy surface recalibrates on purpose, so there is
  nothing for them to do.
- **The 15-role typescale.** See the row above.

**Open, and tracked elsewhere:**

- `chip.css` applies MD3's opacity model for its disabled state, against §5.4, which tells you to
  use the dedicated tokens. `GOVERNANCE.md` calls it a legacy inconsistency to be reconciled — it is
  the only live contradiction this audit found, and it changes rendered output, so it gets looked at
  before it gets changed.
- **No named state-layer tokens.** The percentages above are right but written inline in each
  `color-mix()`: the `md.sys.state.*` tier died in the 2026-07 revert and was never restored
  (§5.5 and the note under §10). A loss of indirection, not of the values.

*Fixed in the same pass as this section:* `--md-sys-color-shadow` was missing from the bridge
although `--shadow` exists (a component asking for it got nothing), and the bridge's typography
comment credited Inter as the UI typeface while the role it maps already resolved to Manrope — the
file's own documentation contradicting its own code. Both verified in a browser afterwards:
`--md-sys-color-shadow` now resolves to `#0A0C12` in light and `#000000` inside a
`[data-theme="dark"]` island, so the alias recalibrates like every other one.

> **Measured in the same pass, and it is not a documentation problem:** `--font-body` is
> **`'Manrope', 'Inter', sans-serif`** in this tree. The decision that *Epilogue is Embassy's
> default typeface, body and UI included* was taken and implemented on 2026-09-16 — the measurement
> table, the `TOKENS.md` row, the `GOVERNANCE` §Typography edit and a regenerated `tokens/` — in a
> commit (`32816df`) that **is not in this repository**: `git cat-file` does not know the object and
> no branch contains it. So the type layer of the system is one decision behind what the team
> believes is live, and every artifact built "with Embassy tokens" since that date has been using a
> body typeface the repo never adopted. Re-applying it is a small, measured change (the recorded
> deltas were +1.2% to +3.9% on control widths, no layout jump, and the Epilogue weights 400–700
> were already being loaded).
>
> **Where the decision stands (21/09/2026).** Epilogue as the default is **confirmed as the
> direction**, with one reservation from the person who owns it: some components may not hold in
> Epilogue, and those would take a second face — Manrope being the candidate. What is still missing
> is the half that makes it writable: **which components, and by what criterion.** Until that exists
> the token does not move, because the one shape that cannot ship is a list of per-component
> exceptions — `GOVERNANCE.md` §Typography forbids hand-written families precisely so that an
> exception cannot survive a refactor.
>
> Three shapes were evaluated side by side with the real component CSS embedded
> (`Claude outputs/tipografia-componentes-reales.html`):
>
> 1. **One face.** `--font-body` becomes Epilogue; body and headings differ by scale and weight.
> 2. **Two faces split by register** — *what the repo does today*: Epilogue for what speaks
>    (headings, openings, large figures, the editorial layer), Manrope for what is operated and
>    compared (cells, controls, labels, overlines). Both roles already exist and are already
>    separate, so choosing this means changing nothing.
> 3. **Epilogue default plus a third role** (`--font-dense`) for where density bites, with its own
>    row here naming who consumes it and why.
>
> Two things measured while comparing, because they change the argument. In the library's own
> components the text is vertically centred — deviation 0 on `.btn-primary`, the pressed `.chip` and
> the `.seg-btn`, 0.3px on the `.badge` — because they consume `--line-height-control`, so alignment
> argues neither for nor against either face. And **Manrope has no true italic**: a hint or an empty
> state that asks for emphasis gets a synthetic oblique, where Epilogue has the real one.

---

## 12. Dark mode — automatic recalibration

Set `data-theme="dark"` on `<html>`. The `[data-theme="dark"]` block in `variables.css` **overrides
only the semantic role layer** (and the theme-aware aliases `--text-*`, `--primary-500`,
`--btn-elevation*`). Primitives are left alone; the shell reassigns some neutrals, which is why the
dark block writes literal hex for neutral-derived roles to avoid cross-resolution.

**Consequences for authors:**
- Components consume roles → they recalibrate with **zero per-theme override**. Never write a
  `[data-theme="dark"]` block inside a component file.
- `--primary` **inverts to white** in dark (max contrast, WCAG AAA on navy). So Primary fills
  and *selected* controls render white in dark — expected, not a bug.
- `--focus` has **no** dark override on purpose (consistent focus signal across themes); its
  derivative `--focus-ring` therefore resolves the same in both.
- A `[data-theme="light"]` scoped block also exists, so a light island can live inside a dark page
  (used by the docs site's state demos).

---

## Known token gaps

- **`--warning-*` primitive ramp is incomplete**: it omits `--warning-300` and `--warning-600`
  (present: 50, 100, 200, 400, 500, 700, 800, 900). All other status ramps
  (success/error/info) are full 50–900. Minor; only matters if a future warning role needs one of the
  missing steps. Because product code consumes the `--warning*` roles (not primitives), this
  gap is invisible to consumers today — flag it only if a new warning tier is required.
- No other unmet needs found: color (primitives + full semantic role set incl. states, surfaces,
  outlines, nav, focus/error rings, inverse, disabled, scrim), typography (families + full size scale
  + weights + tracking), spacing, radius, shadow/elevation, motion (durations + eases), breakpoints,
  and layout dims are all expressible with the current tokens. There is intentionally **no**
  standalone opacity or z-index scale and **no** MD3 state-layer-opacity tier — these are handled by
  `color-mix` derivatives and explicit hover/nav roles, which is the documented approach, not a gap.
