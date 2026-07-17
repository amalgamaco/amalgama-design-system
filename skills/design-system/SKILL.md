---
name: design-system
description: Build UIs using Amalgama's official design system from https://github.com/amalgamaco/amalgama-design-system (CSS tokens, component classes, React wrappers) and apply Amalgama brand identity (logo, voice, theme rules) to any UI, artifact, dashboard, or component. Use this skill whenever the user wants to build, style, or review anything that should look like Amalgama or use Amalgama components — phrases like "Amalgama brand", "Amalgama style", "Amalgama design system", "amalgama-ds", "@amalgama/ds", "make it look like Amalgama", "our brand", "our components", chip, search, or any specific component name in an Amalgama context (button, badge, card, modal, toast, stat-card, kanban, vacancy-card, person-card). Also trigger for any web UI, dashboard, report, internal tool, or client-facing component that should reflect Amalgama's aesthetic. Always use this skill before writing Amalgama-branded UI code — do NOT hardcode colors or fonts from memory; pull tokens from the repo.
---

# Amalgama Design System Skill

This skill has two layers:

1. **The design system** (canonical, in code) — colors, typography, components. The local repo is the single source of truth. Never work from memory; always read the repo.
2. **The brand layer** (this file) — logo selection, voice/tone, theme strategy — things that are not in the code repo.

---

## Step 0 — Detect context before doing anything else

Ask yourself two questions before proceeding:

**Q1: Is there a local DS repo on disk?**

Check for it in order:

```bash
# Preferred — local repo (most current, ahead of GitHub)
if [ -d "/tmp/amalgama-ds/.git" ]; then
  cd /tmp/amalgama-ds && git pull --ff-only
elif [ -d "$HOME/Documents/Claude/Projects/Design System Amalgama" ]; then
  # Symlink so commands below work uniformly
  ln -sfn "$HOME/Documents/Claude/Projects/Design System Amalgama" /tmp/amalgama-ds
else
  # GitHub fallback — only if no local copy exists
  git clone --depth 1 https://github.com/amalgamaco/amalgama-design-system /tmp/amalgama-ds
fi
```

After this, `/tmp/amalgama-ds` is the DS root. All paths below are relative to it.

**Q2: Does the target project already have an adapted DS token layer?**

```bash
find . -path "*/amalgama-ds/tokens/*.css" -o -path "*/styles/tokens/*.css" | head -5
grep -r "color-text-primary\|color-bg-surface\|prim-neutral" --include="*.css" -l | head -3
```

If any token files are found: **do NOT use DS token names directly** (e.g. `var(--accent)`, `var(--bg)`, `var(--neutral-900)`). The project has its own semantic token layer; use its names instead.

**Mandatory — build the mapping table before writing any CSS:**

Read both files and produce an explicit DS-alias → project-alias table. Never guess token names:

```bash
# DS semantic aliases (short names used in DS component CSS)
grep -E "^\s+--bg:|^\s+--border:|^\s+--card-bg:|^\s+--sidebar-bg:|^\s+--text-|^\s+--interactive" /tmp/amalgama-ds/css/variables.css

# Project's semantic token names
cat src/styles/amalgama-ds/tokens/semantics.css   # or your project's equivalent path
```

Common mapping for projects following the gamaforce token pattern:

| DS repo alias | Project token |
|---|---|
| `--bg` | `--color-bg-surface` |
| `--border` | `--color-border` |
| `--card-bg` | `--color-bg-surface` |
| `--sidebar-bg` | `--color-nav-bg` |
| `--text-primary` | `--color-text-primary` |
| `--text-secondary` | `--color-text-secondary` |
| `--text-muted` | `--color-text-muted` |
| `--interactive` | `--color-interactive-primary` |
| `--interactive-hover` | `--color-interactive-primary-hover` |
| `--interactive-light` | `--color-interactive-secondary` |
| `--surface` | `--color-bg-sunken` |
| `--neutral-*` | `--prim-neutral-*` (prefixed) |
| `--primary-*` | `--prim-primary-*` (prefixed) |
| `--secondary-*` | `--prim-secondary-*` (prefixed) |

These are typical — always verify against the actual files. Do not use this table as a substitute for reading.

If no token files are found: you are building a fresh artifact. Proceed to Step 2A.

**Q3: Does the project have its own adapted component CSS directory?**

```bash
find . -path "*/amalgama-ds/components/*.css" | head -5
```

If component CSS files are found in the project (e.g. `src/styles/amalgama-ds/components/`): **these are the authoritative source for class anatomy and token names in that project.** The project's copies have already been adapted — the token references inside use the project's names (`var(--color-bg-surface)` instead of `var(--card-bg)`). Always read the project-local component CSS files to discover the actual available classes and their correct markup before writing component code.

```bash
# Read the project-local component CSS to understand what classes exist and their anatomy
ls src/styles/amalgama-ds/components/
cat src/styles/amalgama-ds/components/<name>.css | head -80
```

If the component you need is not in the project's directory but exists in the DS (`css/components/<name>.css`), read the DS file for its anatomy/variants and adapt it to the project's token names before using it.

---

## Step 1 — Read the source of truth

Always read in this order. Do not skip files. Do not guess from memory.

```bash
cat /tmp/amalgama-ds/CLAUDE.md          # canonical guide for consuming the DS
cat /tmp/amalgama-ds/MIGRATION.md       # mandatory for any existing-product work
```

> **2026-07 — reverted to buildless CSS.** This repo was migrated to a Tailwind v4 + React/Radix
> implementation between 2026-06-22 and 2026-06-26 (`packages/ds/`, `islands/`), then that migration
> was **reverted** on 2026-07-17: every component was hand-ported back to flat CSS
> (`css/components/*.css`) + vanilla JS, `packages/ds/`/`islands/` were deleted, and
> `css/components/*.css` is the single source of truth again. Optional thin React wrappers live in
> `components/ui/*.tsx` (apply the same classes, zero extra styling — not every component has one).
> Each component's `Cuándo usar / Cuándo no` decision rule lives in its CSS header comment.

**Authoritative source per information type** (from CLAUDE.md — do not override with other sources):

| Information needed | Where to read |
|---|---|
| Token values (colors, type scale, spacing, radii, shadows) | `css/variables.css` |
| Component code, variants, props (the source of truth) | `css/components/<name>.css` (canonical, flat classes) + optional `components/ui/<name>.tsx` wrapper |
| Per-component decision rule (`Cuándo usar / Cuándo no / Reemplaza a`) | `css/components/<name>.css` header comment |
| Specs, guidelines, accessibility | root `index.html` (single-page app — canonical) |
| Migration / restyling rules | `MIGRATION.md` |
| **UX principles / heuristics / interaction patterns (how to build a good screen)** | **`guidelines/` — the Playbook** |

**`docs/*.html` are retired** — they are now redirect stubs pointing at the canonical SPA (`index.html`). Never read or cite them as a source.

> **Building a whole screen, not just dropping in a component? Read the Playbook.**
> `guidelines/` holds Embassy's UX principles and pattern playbooks (UX laws & heuristics,
> information architecture, visual hierarchy, content/writing, accessibility, motion; and
> forms, tables, navigation, dashboards, feedback/empty/loading/error states, responsive).
> Start at `guidelines/README.md`, then read the guide for the pattern you're building. A
> screen that is token-correct but ignores these (no empty/error states, wrong action
> hierarchy, unusable on mobile) is **not** done. `cat /tmp/amalgama-ds/guidelines/README.md`

For each component you are about to use:

```bash
# 1. Canonical component code (variants, classes) + the Cuándo usar/no decision rule
#    in the file's header comment — flat CSS, self-contained
cat /tmp/amalgama-ds/css/components/<name>.css

# 2. Optional — only if a React wrapper is wanted (not every component has one)
cat /tmp/amalgama-ds/components/ui/<name>.tsx

# 3. Only if you need live rendered examples
# Start a local server: cd /tmp/amalgama-ds && python3 -m http.server 8087
# Open: http://localhost:8087/   (root index.html — the docs/*.html pages just redirect here)
```

---

## Step 2 — How to consume the DS in your output

### Step 2A — Fresh artifact (no existing project token layer)

**Default to this: link the DS's own component CSS — no build step, no framework.**

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Epilogue:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- jsDelivr serves with correct MIME type and is more reliable than raw.githubusercontent.com -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@main/css/variables.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@main/css/base.css">
<!-- Add layout.css only for full app shell (sidebar + topbar + avatar) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@main/css/components.css">
<!-- Or copy just the file(s) you need from css/components/ instead of the whole barrel -->
```

```html
<button class="btn-primary">Crear vacante</button>
```

**Warning:** CDN links serve GitHub HEAD. If the local repo has token/component changes not yet
pushed to GitHub, these links will serve stale CSS. For the most current tokens/components in an
artifact, copy the content of `css/variables.css` (and the component files you need) into an
inline `<style>` block instead.

Use token names exactly as they appear in `css/variables.css`. For component anatomy/variants,
read the component's file in `css/components/`.

### Step 2B — Existing project with its own token layer (most production work)

**Do not link DS CSS files directly. Do not copy DS CSS verbatim. Do not add alias bridges.**

The rule: **use the project's existing semantic tokens**. The DS is a reference for:
- What HTML markup structure to use (from `Uso:` blocks)
- What class names to use (from the DS component CSS)
- What logic/behavior a component should have

When a DS component class (e.g. `.stat-card`) references a DS token (e.g. `var(--card-bg)`), use the mapping table from Q2 above to substitute the correct project token name. Add the component CSS file to the project's DS components directory with those project token names.

**Never** create alias variables that re-map DS token names onto project token names in a shared globals file. That is a parallel token layer and it breaks dark mode, causes token drift, and hides mismatches.

#### Third-party component CSS variable bridge

When the project uses a third-party component (shadcn, base-ui, etc.) that completely replaces a DS primitive — e.g. shadcn `<Sidebar>` instead of DS `.sidebar`/`.nav-item` — the third-party library's own CSS variables **must be wired to DS semantic tokens in `globals.css`**. Never hardcode hex values.

```css
/* ❌ Wrong — hardcoded hex; won't update when the DS palette changes */
--sidebar: #ffffff;
--sidebar-foreground: #1c2438;
--sidebar-accent: #edf2ff;
--sidebar-accent-foreground: #4f80ff;
--sidebar-border: #c8d1e7;
--sidebar-ring: #4f80ff;

/* ✅ Correct — token-driven; dark mode comes for free from semantics.css */
--sidebar:                    var(--color-nav-bg);
--sidebar-foreground:         var(--color-text-primary);
--sidebar-accent:             var(--color-nav-item-active-bg);
--sidebar-accent-foreground:  var(--color-nav-item-active-text);
--sidebar-border:             var(--color-border);
--sidebar-ring:               var(--color-interactive-primary);
```

Verify coverage: check `[data-theme="dark"]` in `globals.css` — if it overrides those same variables with more hardcoded hex, delete those overrides. When the third-party CSS vars reference DS semantic tokens, dark mode is automatic.

#### Project-local component CSS

If a project has vendored component CSS (e.g. `src/styles/amalgama-ds/components/button.css`),
it's a project-adapted copy of the DS's own `css/components/<name>.css` — re-sync against the
canonical DS file when you touch the component, since the DS version is the one that gets fixes
and new variants:

```bash
# Canonical anatomy + variants live in css/components/
cat /tmp/amalgama-ds/css/components/button.css
```

If the project's class names diverge from the DS (e.g. `.btn--primary` vs `.btn-primary`), the
copy is stale — re-sync the file rather than patching around the drift.

### Step 2C — React / Next.js projects

Same rule as everywhere else: **`css/components/<name>.css` is the source of truth.** For React
projects, an optional thin wrapper in `components/ui/<name>.tsx` gives you a typed component
instead of raw classes — it applies the exact same CSS classes and adds zero styling of its own.
Not every component has one; check `ls components/ui/` before assuming.

- **Start from the CSS** — read `css/components/<name>.css` for the variants, classes, and the
  `Cuándo usar` decision rule
- **Vendor by copying** the CSS file (link the whole `css/components.css` barrel, or copy just
  what you need) — and if you want the typed wrapper, also copy `components/ui/<name>.tsx` +
  `components/lib/utils.ts` (`cn()`)
- Peer deps for the optional wrapper only: `react`, `class-variance-authority`, `clsx` — no
  Tailwind, no `tailwind-merge`
- If a component is missing entirely, write the CSS file first (flat classes, header comment,
  `Uso:` snippet — see CLAUDE.md's "Adding a new component"), then optionally the wrapper; do not
  invent Tailwind utility classes for it

---

## Step 3 — Component selection: read the decision blocks first

Before choosing a component, read its `Cuándo usar / Cuándo no / Reemplaza a` block in the CSS header comment. Every component has one. These are the per-component rules that prevent mis-selection (badge vs. chip, card vs. stat-card, search-bar vs. search-field, modal vs. toast, etc.).

```bash
grep -A 6 "Cuándo usar" /tmp/amalgama-ds/css/components/<name>.css
```

If you are migrating a legacy element, use the **Legacy pattern → DS component mapping** table in `MIGRATION.md` as the first lookup, before reading the individual CSS file.

---

## Step 4 — Apply the brand layer

These pieces are **not** in the DS repo and are the responsibility of this skill.

### Logo

The mark: lightbulb with a Saturn-style orbital ring, lowercase `amalgama` wordmark in a rounded geometric sans-serif.

| Variant | Background | Use when |
|---|---|---|
| Logo Text 1 (blue icon + navy wordmark) | Light | Default light background |
| Logo Text 2 (navy mono) | Light, minimal | Restrained, single-color contexts |
| Logo Text 3 (blue mono) | Dark | On dark/navy backgrounds |
| Horizontal-1/2/3 | Same scheme, horizontal layout | Navbars, headers |
| With-bg variants | Built-in rounded rect bg | Drop onto any background (cards, app icons) |
| Blue-icon-bg / favicon | Square | App icons, favicons |

Rules: white/light bg → variant 1; navy bg → mono; blue bg → mono; square → with-bg. **Never** stretch, recolor, add drop shadows, or place on busy patterns. Clearspace: minimum 16px all sides. Min width 120px horizontal.

If logo PNGs are needed and not provided, ask the user to upload them. Do not invent SVG approximations.

### Voice & tone

- Direct, confident, action-oriented.
- Short headlines with impact ("We think. We mix. We deliver.").
- Warmth without fluff — "your dream team", not "synergistic partnerships".
- CTA language: "Let's talk", "See the work", "Get started".
- Product UI is **Spanish (rioplatense)**. Marketing copy defaults to English.

### Theme strategy

| Context | Theme |
|---|---|
| Hero sections, landing pages | Dark (`--primary-900` / `--primary-700` background) |
| Internal dashboards, tools | Light (default `--bg`, white cards) |
| Feature highlights | Dark panel inside a light page |
| Data tables, forms | Light + interactive token on actionable elements |
| Client presentations | Light page with dark header band |

### Brand framing

Amalgama is a **Welltech digital product studio** — health, fitness, and wellness software. Visuals balance technical precision with a modern, approachable feel. Confident and slightly bold; not corporate-stuffy, not startup-casual.

---

## Pre-flight checklist before shipping a branded UI

- [ ] DS repo is available and current at `/tmp/amalgama-ds` (this session)
- [ ] Read `CLAUDE.md` — done
- [ ] Read `MIGRATION.md` — done (if modifying an existing product)
- [ ] For each component used: read its `Uso:` block and `Cuándo usar` decision block in the CSS header
- [ ] Fonts linked or inherited: Inter (body), Epilogue (headings), DM Mono (code) — always via `var(--font-body)` / `var(--font-heading)` / `var(--font-mono)`
- [ ] CSS load order correct (variables → base → components → layout if needed)
- [ ] If project has its own token layer: all colors/spacing/radii use **project** semantic token names, not DS names
- [ ] If fresh artifact: all colors via `var(--…)` tokens — zero raw hex, zero hardcoded font families
- [ ] No alias bridges added (no new variables that re-map DS token names to project names)
- [ ] Third-party components (shadcn Sidebar, base-ui, etc.) that replace DS components: their `--sidebar-*` / `--popover-*` / other CSS variables reference DS semantic tokens, not hardcoded hex
- [ ] React wrappers: variant → CSS class mapping verified against live DS source (no double-dash BEM like `btn--primary`)
- [ ] No per-theme overrides written (`@media prefers-color-scheme`, `.dark` classes) — dark mode is automatic via `data-theme="dark"` on `<html>` with semantic tokens
- [ ] Component class names match the repo `Uso:` block exactly — flat kebab-case, additive variants
- [ ] If React wrappers used: built from CSS class anatomy, not invented
- [ ] Logo present → correct variant for background
- [ ] Copy language matches the surrounding product (default: Spanish for product UI)

---

## When something is missing from the DS

1. Check the component CSS header `Uso:` block — there may be a composed variant you missed.
2. Check MIGRATION.md's mapping table — there may be a DS equivalent for the legacy pattern.
3. If genuinely new: follow the "Adding a new component" section in `CLAUDE.md` — propose CSS first (with standard header comment and `Cuándo usar` block), then optionally the React wrapper. Flag clearly that this is a DS extension.
4. **Never** bypass tokens with ad-hoc hex values. If you must compose a new pattern, use `var(--…)` so the DS still owns the values.
5. All components previously called out as "roadmap" (checkbox, radio, switch, menu, tooltip, slider, date picker, sheet, list, loading, carousel, divider) now have real, consumable code — check `css/components/` and CLAUDE.md's inventory before assuming something is missing. The only component genuinely absent is **Resizable panels** (dropped in the 2026-07 revert) — for that or any other true gap, compose from existing components or flag it. Do not invent styles.
