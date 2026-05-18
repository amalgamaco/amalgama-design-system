# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A vanilla CSS + React reference component library for Amalgama products. **No build step, no bundler, no test runner, no lint config.** Consumers load the CSS files directly into a `<link>` or copy components into their own project.

## Serving the docs site

The docs are static HTML in `docs/`. From the repo root:

```bash
python3 -m http.server 8087
# then open http://localhost:8087/docs/index.html
```

(The `-d packages/amalgama-ds` example in `README.md` is for when this lib is checked out as a sub-package under another repo — not how this repo is laid out today.)

## Architecture

### CSS layers, in load order

1. `css/variables.css` — all design tokens (colors, radii, shadows, sidebar/topbar dimensions, transitions). **Every other file depends on this.** Override `:root` values here to retheme globally.
2. `css/base.css` — reset, body typography (Inter for body, Epilogue for headings, DM Mono for code), scrollbar, keyframe animations.
3. `css/layout.css` — app shell (sidebar + topbar). Only needed if consuming the full layout.
4. `css/components.css` — barrel that `@import`s every file in `css/components/`. Consumers can include this *or* cherry-pick individual component CSS files.

Components are grouped into two tiers, both bundled by the barrel:
- **Core** (generic primitives): button, badge, card, form, table, tabs, modal, toast, toolbar, page-header, stat-card, skeleton, empty-state, back-link, description.
- **Extended** (domain-oriented, NewPeopleForce-specific): vacancy-card, person-card, kanban, create-form, placeholder.

### Per-component CSS conventions

Every file in `css/components/` starts with a header comment declaring:
- Purpose
- `Dependencia:` what other CSS files must be loaded first (always at least `variables.css`)
- `Uso:` HTML examples with the exact class names to apply

Classes are flat kebab-case names (`.btn-primary`, `.btn-primary.btn-danger`, `.badge-open`) — not BEM-namespaced. Variants are additive classes that combine on a base.

### React layer

`components/ui/*.tsx` are **thin wrappers** over the CSS classes. Pattern:
- `cva` from `class-variance-authority` maps a `variant` prop to a CSS class string.
- `cn()` from `components/lib/utils.ts` (a `clsx` wrapper) merges in user-provided `className`.
- Components use `React.forwardRef` and export both the component and its `*Variants` function.
- **No styling logic in TS** — if a visual change is needed, edit the CSS file; the TS just selects which class to apply.

Peer deps (not in `package.json` because nothing builds): `react`, `class-variance-authority`, `clsx`.

Not every CSS component has a React wrapper (the "Extended" domain components in particular are CSS-only).

## Adding a new component

1. **CSS**: create `css/components/<name>.css` with the standard header (purpose, dependencies, `Uso:` examples). Add an `@import url('components/<name>.css');` line in `css/components.css` — put core components above the `── Extended components ──` separator, domain components below it.
2. **React** (optional): create `components/ui/<name>.tsx` using `cva` + `cn()` + `forwardRef`. Map each variant prop value to the existing CSS class names — do not introduce new styling here.
3. **Docs**: create `docs/<name>.html` and link it from `docs/index.html` in both the sidebar `<nav>` and the relevant card-grid section. Existing pages are the template — copy one and adapt.

## What's intentionally not here

- No `npm test` / `npm run build` / lint scripts — `package.json` declares only metadata and a `files` allowlist for publishing as a private package.
- No TypeScript config: the `.tsx` files are reference implementations meant to be copied into consuming apps that already have their own React/TS toolchain.
- No `index.ts` barrel for the React components — consumers import each component by path (e.g. `@amalgama/ds/components/ui/button`).

## Voice

Source comments, docs pages, and class-usage examples are written in Spanish (the product's primary language). Match this when editing existing files; new technical scaffolding can stay in English.
