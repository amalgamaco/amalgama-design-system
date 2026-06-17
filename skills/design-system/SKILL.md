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

If any token files are found: **do NOT use DS token names directly** (e.g. `var(--accent)`, `var(--bg)`, `var(--neutral-900)`). The project has its own semantic token layer; use its names instead. Map DS concepts to the project's equivalents before writing any code. The DS repo is a structural reference (markup patterns, class names, anatomy), not a token import.

If no token files are found: you are building a fresh artifact. Proceed to Step 2A.

**Q3: Does the project have its own adapted component CSS directory?**

```bash
find . -path "*/amalgama-ds/components/*.css" | head -5
```

If component CSS files are found in the project (e.g. `src/styles/amalgama-ds/components/`): **these are the authoritative source for class anatomy and token names**, not `/tmp/amalgama-ds/css/components/`. The project's copies have already been adapted — the class names are the same (`.widget`, `.card`, `.badge`, etc.) but the token references inside use the project's names (`var(--color-bg-surface)` instead of `var(--card-bg)`). Always read the project-local component CSS files to discover the actual available classes and their correct `Uso:` markup before writing component code.

```bash
# Read the project-local component CSS to understand what classes exist and their anatomy
ls src/styles/amalgama-ds/components/
cat src/styles/amalgama-ds/components/<name>.css | head -80
```

If the component you need is not in the project's directory but exists in the GitHub DS, adapt it to use the project's token names before using its class anatomy.

---

## Step 1 — Read the source of truth

Always read in this order. Do not skip files. Do not guess from memory.

```bash
cat /tmp/amalgama-ds/CLAUDE.md          # canonical guide for consuming the DS
cat /tmp/amalgama-ds/MIGRATION.md       # mandatory for any existing-product work
```

**Authoritative source per information type** (from CLAUDE.md — do not override with other sources):

| Information needed | Where to read |
|---|---|
| Token values (colors, type scale, spacing, radii, shadows) | `css/variables.css` |
| Component markup, variant classes, usage rules | `css/components/<name>.css` header (`Uso:` + `Cuándo usar / Cuándo no / Reemplaza a`) |
| Specs, guidelines, accessibility | root `index.html` (single-page app — canonical) |
| Migration / restyling rules | `MIGRATION.md` |
| React props and variant API | `components/ui/<name>.tsx` |

**`docs/*.html` are legacy** — they lag behind the SPA. Never let them override the sources above.

For each component you are about to use:

```bash
# 1. Read the CSS header — this is the canonical markup specification
cat /tmp/amalgama-ds/css/components/<name>.css | head -60

# 2. Check if a React wrapper exists
cat /tmp/amalgama-ds/components/ui/<name>.tsx

# 3. Only if you need live rendered examples
# Start a local server: cd /tmp/amalgama-ds && python3 -m http.server 8087
# Open: http://localhost:8087/   (root index.html — NOT docs/index.html)
```

---

## Step 2 — How to consume the DS in your output

### Step 2A — Fresh HTML artifact (no existing project token layer)

The repo has no build step. Link CSS directly:

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Epilogue:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- jsDelivr serves with correct MIME type and is more reliable than raw.githubusercontent.com -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@main/css/variables.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@main/css/base.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@main/css/components.css">
<!-- Add layout.css only for full app shell (sidebar + topbar + avatar) -->
```

**Warning:** CDN links serve GitHub HEAD. If the local repo has token changes not yet pushed to GitHub, these links will serve stale CSS. For the most current tokens in an artifact, copy the content of `css/variables.css` into an inline `<style>` block instead.

Use token names exactly as they appear in `css/variables.css`. Use class names exactly as they appear in each component's `Uso:` block.

### Step 2B — Existing project with its own token layer (most production work)

**Do not link DS CSS files directly. Do not copy DS CSS verbatim. Do not add alias bridges.**

The rule: **use the project's existing semantic tokens**. The DS is a reference for:
- What HTML markup structure to use (from `Uso:` blocks)
- What class names to use (from the DS component CSS)
- What logic/behavior a component should have

When a DS component class (e.g. `.stat-card`) references a DS token (e.g. `var(--card-bg)`), find the equivalent in the project's token layer and either use that name in your Tailwind `className`, or add the component CSS file to the project's DS components directory using the project's token names.

**Never** create alias variables that re-map DS token names onto project token names in a shared globals file. That is a parallel token layer and it breaks dark mode, causes token drift, and hides mismatches.

### Step 2C — React / Next.js projects

CSS is canonical. React wrappers are thin. This matters:

- **Start from the CSS** — read `css/components/<name>.css`, understand the class anatomy and variants
- **Then check the React wrapper** (`components/ui/<name>.tsx`) for prop-based convenience only
- If no React wrapper exists for a component, write a TSX component that renders the correct CSS class structure; do not invent styles
- Copy the component `.tsx` file + `components/lib/utils.ts` into the target project if using DS wrappers
- Peer deps: `class-variance-authority`, `clsx` (`npm i class-variance-authority clsx`)
- If the project already has adapted wrappers, use those — do not create a second copy

---

## Step 3 — Component selection: read the decision blocks first

Before choosing a component, read its `Cuándo usar / Cuándo no / Reemplaza a` block in the CSS header. Every component has one. These are the per-component rules that prevent mis-selection (badge vs. chip, card vs. stat-card, search-bar vs. search-field, modal vs. toast, etc.).

```bash
grep -A 20 "Cuándo usar" /tmp/amalgama-ds/css/components/<name>.css
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
5. Roadmap components (checkbox, radio, switch, menu, tooltip, slider, date picker, sheet, list, loading, carousel, divider) have no consumable code yet — compose from existing components or flag as a DS gap. Do not invent styles.
