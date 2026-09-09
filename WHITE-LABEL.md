# WHITE-LABEL.md — Brand Theming for Client Products

This document describes how to apply a client brand to Embassy components. It is for designers and engineers building client-facing products on top of Embassy.

**Read order:** CLAUDE.md → GOVERNANCE.md §15 (theming principles) → this file.

---

## The model: primitives carry the brand

Embassy's token system has three layers:

```
Layer 1 — Primitives       --primary-900, --secondary-500, --radius-md, --font-heading
                               ↓ (consumed by)
Layer 2 — Color Roles      --color-primary, --color-secondary-container, --color-error
                               ↓ (consumed by)
Layer 3 — Components       button.css, badge.css, card.css … (never touched)
```

**White-labeling works at Layer 1 only.** You override primitives; Layers 2 and 3 adapt automatically.

This means:
- You write ~30 CSS variable overrides
- All 22+ components update automatically — including dark mode
- You never edit a component CSS file

---

## Step 1 — Create a brand theme file

Create `brand/<client-slug>-theme.css`. Load it **after** `variables.css` and **before** `base.css`:

```html
<link rel="stylesheet" href="css/variables.css">
<link rel="stylesheet" href="brand/<client-slug>-theme.css">   <!-- ← brand overrides here -->
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/layout.css">                  <!-- only for the app shell -->
<link rel="stylesheet" href="css/components.css">
```

> **React consumers**: identical. The optional wrappers in `components/ui/*.tsx` apply the same
> flat classes and carry no styles of their own, so they read the brand override for free. What
> matters is the load order above: the brand file goes after `variables.css` and before `base.css`.
> Components need no changes either way.

---

## Step 2 — Override the primitive palette

### 2.1 Primary palette (most impactful)

The primary palette drives primary buttons, focused inputs, links, navigation active states, focus rings, and all `--color-primary-*` roles.

```css
:root {
  /* Replace with the client's primary brand color.
     Generate the full scale from the brand's main hex:
     900 = darkest (navy / headings), 500 = base, 50 = lightest tint */
  --primary-50:  #eef5ff;  /* lightest tint — background washes */
  --primary-100: #dde9ff;
  --primary-200: #b3ccff;
  --primary-300: #80a8ff;
  --primary-400: #4d84ff;
  --primary-500: #1a60ff;  /* ← base brand color */
  --primary-600: #1450e0;
  --primary-700: #0e3ebe;
  --primary-800: #092e99;
  --primary-900: #041f7a;  /* ← darkest — page headings, sidebar bg */

  /* Required by the role layer — do NOT omit these two: */
  --primary-60:  #dfe7ff;  /* ← --color-primary-container (light) */
  --primary-75:  #d6dbe8;  /* light grey-navy with body */
}
```

**Which step each role consumes** — this is what actually determines the look, and it is *not* the 500:

| Role | Light | Dark |
|---|---|---|
| `--color-primary` | `--primary-900` | white (fixed) |
| `--color-on-primary` | white (fixed) | `--primary-900` |
| `--color-primary-container` | **`--primary-60`** | `--primary-400` |
| `--color-on-primary-container` | `--primary-900` | `--primary-50` |
| `--color-primary-hover` | `--primary-700` | `--primary-50` |
| `--text-primary` | `--primary-900` | neutral (fixed) |
| `--interactive-hover` | `--primary-500` | `--primary-200` |

So **`--primary-900` is the step that carries the brand** for page text, sidebar and filled primary — it has to be dark enough to hold white text at 4.5:1. If the brand's signature color is a bright one (an orange, a lime), it belongs in the **secondary** palette (the interactive accent), and `--primary` takes the brand's dark neutral.

**How to generate the scale:** don't do it by hand. Run

```bash
node scripts/build-brand-theme.mjs --slug <client> --primary "#XXXXXX" --secondary "#YYYYYY" \
  --radius rounded|balanced|technical --out brand/<client>.css
```

It derives every tint from one hex per palette, following Embassy's own OKLCH lightness/chroma curve, and fails if any role pair drops below AA. If you must do it manually: Radix Colors, Tailwind Palette Generator or Material Theme Builder, then verify contrast.

### 2.2 Secondary / accent palette

The secondary palette drives chips, tabs, interactive highlights, and `--color-secondary-*` roles.

```css
:root {
  --secondary-50:  #f0fdf4;
  --secondary-100: #dcfce7;
  --secondary-200: #bbf7d0;
  --secondary-300: #86efac;
  --secondary-400: #4ade80;
  --secondary-500: #22c55e;  /* ← brand accent color */
  --secondary-600: #16a34a;
  --secondary-700: #15803d;
  --secondary-800: #166534;
  --secondary-900: #14532d;  /* ← --color-secondary: the interactive accent */

  /* Required by the role layer in dark mode — do NOT omit: */
  --secondary-925: #1b6b3c;  /* ← --color-secondary-container (dark) */
  --secondary-950: #12401f;  /* ← --color-on-secondary (dark) */
}
```

**Which step each role consumes:** `--color-secondary` = `--secondary-900` (white text sits on it, so it needs 4.5:1) · `--color-secondary-container` = `--secondary-200` in light and `--secondary-925` in dark · `--color-on-secondary-container` = `--primary-900` in light and `--secondary-100` in dark.

### 2.3 Radius personality

Radius is the single most impactful change for "brand feel":

```css
:root {
  /* Rounded / friendly personality: */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* Sharp / technical personality: */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 6px;
  --radius-xl: 8px;

  /* Embassy default (balanced): */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}
```

`--radius-full` (9999px) should never be overridden — it is reserved for pills and avatars and must remain circular regardless of brand.

### 2.35 Product personality — density, elevation, motion, icon weight

Colour, type and radius make two products look different. These four make them
*feel* different, and they are what stops every white-label build reading as the
same product in a new palette. Each is a **closed set of presets**: a free value
per client is how a design system fragments.

| Axis | Presets | What it changes | Pick by |
|---|---|---|---|
| **Density** | `compacta` · `estandar` · `amplia` | The whole `--space-*` scale, half-steps included | Who uses it daily. Staff tools earn `compacta`; consumer products earn `amplia` |
| **Elevation** | `sombra` · `plana` | `--shadow-sm/md/lg` | How surfaces separate. Diffuse shadow reads warm and product-like; a crisp hairline with almost no shadow reads technical and holds up better at high density |
| **Motion** | `sobrio` · `expresivo` | `--duration-*` and `--ease-default/enter` | `sobrio` never draws attention to itself, which is what a work tool wants. `expresivo` has a slight overshoot on entry, which is what a consumer product expects |
| **Icon weight** | `liviano` · `estandar` · `robusto` | `--icon-stroke` | 1.5 reads light and elegant, 2.5 reads sturdy and utilitarian |

Density is the one that moves the needle most, and it only works because the
components consume `--space-*` — 291 declarations were tokenized in September
2026 precisely so this axis could exist. The half-steps (`--space-0-5`, `-1-5`,
`-2-5`, `-3-5`) scale with the rest on purpose: leave them fixed and component
interiors stay immune, which is exactly where density is felt.

```bash
node scripts/build-brand-theme.mjs --slug nortia --primary "#14524A" --secondary "#0E9F6E" \
  --radius rounded --density compacta --elevation plana --motion sobrio --icon-stroke robusto
```

Every axis defaults to the value already in `variables.css`, so a theme that
names none of them renders exactly as Embassy does today.

**Two combinations to avoid.** `amplia` + `plana` leaves surfaces floating with
nothing separating them — pick one source of separation. And `compacta` +
`expresivo` puts bouncy motion on a dense work tool, where it reads as noise
rather than personality.

### 2.4 Typography

Override fonts only if you have a valid license for the client's typefaces and they can be loaded via Google Fonts or a self-hosted @font-face:

```css
:root {
  --font-heading: 'Client Heading Font', sans-serif;
  --font-body:    'Client Body Font',    sans-serif;
  --font-mono:    'Client Mono Font',    monospace;  /* only if needed */
}
```

If no custom fonts: keep Embassy defaults (Inter / Epilogue / DM Mono). They are brand-neutral and professional.

Do not override `--font-size-*` tokens — the type scale is design-validated and should remain stable across clients.

### 2.5 Neutral palette (caution)

The neutral palette drives surfaces, borders, disabled states, and `--color-surface-*` roles. Most brands share a gray scale — change it only if the client has mandated warm/cool grays:

```css
:root {
  /* Warm gray example: */
  --neutral-50:  #FAFAF9;
  --neutral-100: #F5F5F4;
  --neutral-200: #E7E5E4;
  --neutral-300: #D6D3D1;
  --neutral-400: #A8A29E;
  --neutral-500: #78716C;
  --neutral-600: #57534E;
  --neutral-700: #44403C;
  --neutral-800: #292524;
  --neutral-900: #1C1917;
}
```

### 2.6 Status colors (rarely override)

Override status colors only if the client brand mandates specific status colors that differ significantly from Embassy defaults:

```css
:root {
  /* Embassy defaults — usually keep these */
  /* --success-500: #05A660; */
  /* --error-500:   #DB263C; */
  /* --warning-400: #FFC97D; */
  /* --info-500:    #4F80FF; */
}
```

---

## Step 3 — Minimal theme file template

Copy this template and fill in the client brand values:

```css
/* ═══════════════════════════════════════
   Embassy — [Client Name] Brand Theme
   Overrides: primary palette, secondary palette, radius, fonts
   Load order: after variables.css, before base.css
═══════════════════════════════════════ */

:root {

  /* ── Primary palette ────────────────── */
  --primary-50:  ;
  --primary-100: ;
  --primary-200: ;
  --primary-300: ;
  --primary-400: ;
  --primary-500: ;    /* ← base brand color */
  --primary-600: ;
  --primary-700: ;
  --primary-800: ;
  --primary-900: ;    /* ← headings, sidebar bg — --color-primary */
  --primary-60:  ;    /* ← --color-primary-container (light) — REQUIRED */
  --primary-75:  ;

  /* ── Secondary / accent palette ─────── */
  --secondary-50:  ;
  --secondary-100: ;
  --secondary-200: ;
  --secondary-300: ;
  --secondary-400: ;
  --secondary-500: ;  /* ← accent color */
  --secondary-600: ;
  --secondary-700: ;
  --secondary-800: ;
  --secondary-900: ;   /* ← --color-secondary (the interactive accent) */
  --secondary-925: ;   /* ← --color-secondary-container (dark) — REQUIRED */
  --secondary-950: ;   /* ← --color-on-secondary (dark) — REQUIRED */

  /* ── Radius personality ─────────────── */
  --radius-sm: 4px;   /* tags, XS/SM buttons */
  --radius-md: 8px;   /* cards, inputs, chips */
  --radius-lg: 12px;  /* large panels, XL buttons */
  --radius-xl: 16px;  /* surface containers */
  /* --radius-full: 9999px; ← never override */

  /* ── Typography ─────────────────────── */
  /* --font-heading: 'Client Heading', sans-serif; */
  /* --font-body:    'Client Body', sans-serif; */

  /* ── Neutral palette (only if brand grays differ) ── */
  /* --neutral-50:  ; */
  /* ...            */
  /* --neutral-900: ; */

}
```

---

## Step 4 — Verify the themed product

Run all of these before shipping. They all must pass.

### 4.1 Light mode

- [ ] Page headings render in primary-900 (brand navy), not black
- [ ] Primary buttons use the client's primary color with readable text (`--color-on-primary`)
- [ ] Chips, tabs, active nav items use the secondary accent color
- [ ] Cards and panels have visible borders
- [ ] All text meets 4.5:1 contrast against its background
- [ ] Disabled elements are visually distinct (muted, not the client's brand color)

### 4.2 Dark mode (`data-theme="dark"` on `<html>`)

- [ ] The only `[data-theme="dark"]` block in the brand theme file is the generated **dark
      surfaces** one (see 4.2b). Any other dark override means a semantic role was overridden
      instead of a primitive — fix it
- [ ] Page surfaces shift to dark correctly (no raw-white elements left)
- [ ] Brand palettes reach dark mode. Since 2026-09 the `[data-theme="dark"]` block references
      `var(--primitive)` for the primary / secondary / tertiary / status families, so overriding
      primitives propagates to both themes. Verify it: with the brand file loaded, set
      `data-theme="dark"` and confirm `--color-primary-container`, `--color-secondary` and
      `--color-secondary-container` resolve to brand values, not Embassy's navy and blue.
      (Neutral-derived tokens — surfaces, outline, disabled, text — stay literal on purpose.)
- [ ] `--primary-400`, `--primary-50`, `--secondary-300`, `--secondary-925` and `--secondary-950`
      are defined in the brand file: dark mode consumes those steps
- [ ] Text remains readable — no low-contrast combinations

### 4.2b Dark surfaces carry the brand hue

Embassy's dark "neutrals" are not neutral: measured in OKLCH they sit at H≈270 — a blue-black, as
much a brand decision as the navy. They are written literally in `variables.css`, so no primitive
override reaches them, and before 2026-09 that made every white-label product look identical in
dark: ~90% of the pixels stayed Embassy blue and the client's brand survived only in the accents.

`build-brand-theme.mjs` therefore emits one `[data-theme="dark"]` block at the end of the brand
file, re-hueing those same surfaces to the brand's hue at the **same L and the same C** — what
changes is whose tint it is, not how much tint there is.

- [ ] The block covers surfaces, outline, disabled and inverse-on-surface **only**. Text greys
      (`--color-on-surface*`, `--text-*`) stay neutral on purpose: they have to read the same on
      every brand
- [ ] Every value carries its Embassy original in a comment, so the swap is auditable
- [ ] The generator's contrast report shows the dark pairs passing AA (re-hueing preserves L, so
      they move by hundredths — but it is checked, and it exits 1 if one falls below)
- [ ] Nothing here was hand-written. This block is generated; editing it by hand is how the two
      themes drift apart

### 4.3 Component states

- [ ] Hover state visually distinct from default
- [ ] Focus ring visible (`--color-focus` is intentionally NOT brand-colored — it stays at Embassy blue for accessibility consistency)
- [ ] Pressed/active state distinct from hover
- [ ] Error states still red (unless brand has mandated custom error color)

### 4.4 Technical

- [ ] `grep -n '#[0-9a-fA-F]' brand/<client>-theme.css` → only primitive declarations, never semantic role overrides
- [ ] Brand theme file contains ONLY `:root { … }` overrides — no component selectors, no media queries
- [ ] CSS load order verified: `variables.css` → `brand/<client>-theme.css` → `base.css` → `components.css`
- [ ] `--font-heading` / `--font-body` point to loaded fonts (check Network panel — no 404s)

---

## Step 5 — What NOT to do

These are the most common white-label mistakes:

### ❌ Overriding semantic roles directly

```css
/* WRONG — breaks the token hierarchy */
:root {
  --color-primary: #2d6db4;              /* semantic role — never override */
  --color-surface-container: #f0f4fa;    /* semantic role — never override */
  --text-primary: #1a1a1a;              /* semantic alias — never override */
}
```

Why: overriding roles means the dark mode recalibration can't work — the `[data-theme="dark"]` block in `variables.css` recalibrates roles from primitives. If you hardcode a role, dark mode stops working for that role.

### ❌ Adding per-theme overrides to the brand file

```css
/* WRONG */
[data-theme="dark"] {
  --color-primary: #90b8ff;  /* dark mode override in brand file */
}
```

Why: if you need a dark mode override for a colour role, you overrode a semantic role instead of a primitive. Fix: override the primitive. The semantic role's dark recalibration will cascade automatically.

**The one exception** is the generated dark-surfaces block described in 4.2b, and it exists because
those surfaces have no primitive to override — they are literals in `variables.css`. It is written
by `build-brand-theme.mjs`, never by hand, and it touches surfaces, outline and disabled only.

### ❌ Creating a parallel token layer

```css
/* WRONG — alias bridge that re-maps DS tokens */
:root {
  --brand-primary: var(--color-primary);     /* shadow token */
  --brand-surface: var(--card-bg);           /* shadow token */
}
```

Then using `--brand-primary` in component overrides. This creates invisible token drift — when DS updates `--color-primary`, your `--brand-primary` follows, but nobody reading the brand file knows why components look different.

### ❌ Editing component CSS files

```css
/* WRONG — inside button.css */
.btn-primary {
  background: var(--brand-primary-600);  /* direct edit to component CSS */
}
```

Why: Embassy components are designed to be brand-agnostic. Editing them for a client makes it impossible to update to a new Embassy version without merging conflicts on every component.

---

## Worked example: SimpleFit brand theme

SimpleFit uses a green accent and a rounded, friendly personality:

```css
/* brand/simplefit-theme.css */

:root {
  /* Primary: deep teal-blue */
  --primary-50:  #edfcf2;
  --primary-100: #d3f8e2;
  --primary-200: #a7f0c5;
  --primary-300: #6ddfa0;
  --primary-400: #37c57a;
  --primary-500: #18a75e;
  --primary-600: #0f8549;
  --primary-700: #0e6b3b;
  --primary-800: #0d5430;
  --primary-900: #094527;

  /* Secondary: warm lime */
  --secondary-50:  #f7fee7;
  --secondary-100: #ecfccb;
  --secondary-200: #d9f99d;
  --secondary-300: #bef264;
  --secondary-400: #a3e635;
  --secondary-500: #84cc16;
  --secondary-600: #65a30d;
  --secondary-700: #4d7c0f;
  --secondary-800: #3f6212;
  --secondary-900: #365314;

  /* Friendly, rounded personality */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;

  /* Custom heading font (licensed) */
  --font-heading: 'Nunito', sans-serif;
}
```

This single file — ~30 lines — transforms all Embassy buttons, badges, cards, chips, tabs, inputs, and navigation to the SimpleFit brand. No component files touched.

---

## About the focus ring

`--color-focus` (the keyboard focus outline) is intentionally **not** tied to the brand primary color. It stays at Embassy blue (`#4F80FF`) regardless of brand. This is a deliberate accessibility decision: focus indicators must be distinguishable from surrounding brand color, and using the brand primary as the focus color creates contrast failures when the primary and surface colors are similar.

If a client explicitly requires a branded focus color, verify that the chosen color achieves at least 3:1 contrast against all surfaces in the product (WCAG 2.4.11). Override `--color-focus` in the brand theme file only if this requirement is met.
