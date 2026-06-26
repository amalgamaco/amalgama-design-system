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
<!-- Components are Tailwind: @import "@amalgama/ds/tailwind.theme.css" + copy the .tsx
     (the buildless css/components layer was deleted in 2026-06) -->
```

> **Tailwind consumers** (canonical): white-labeling is identical — it overrides the **primitive
> palette**, which both layers read. Load the brand override before the theme import
> (`@import "brand/<client-slug>-theme.css"; @import "@amalgama/ds/tailwind.theme.css";`) or
> redefine the primitives in `:root` after it. Components need no changes either way.

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
}
```

**How to generate the scale:** use the brand's primary hex as `--primary-500`. Darken progressively (900 is ~50% darker than 500) and lighten progressively (50 is ~90% lighter). Tools: Radix Colors, Tailwind Palette Generator, or Material Theme Builder.

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
  --secondary-900: #14532d;
}
```

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
  --primary-900: ;    /* ← headings, sidebar bg */

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
  --secondary-900: ;

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

- [ ] No `[data-theme="dark"]` overrides exist in the brand theme file (if there are, a semantic role was overridden instead of a primitive — fix it)
- [ ] Page surfaces shift to dark correctly (no raw-white elements left)
- [ ] Primary color adapts (light mode: `--primary-500` base; dark mode: auto-lightens to `--primary-200`)
- [ ] Text remains readable — no low-contrast combinations

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

Why: if you need a dark mode override in the brand file, you overrode a semantic role instead of a primitive. Fix: override the primitive. The semantic role's dark recalibration will cascade automatically.

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
