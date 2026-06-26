# DEPLOYMENT.md

How this repository relates to the live Design System site, and **why changes
pushed here may not appear in production**. Read this first if "I changed the
repo but the deployed site looks the same."

Live site: <https://presentations.amalgama.co/p/amalgama-design-system/>

---

## TL;DR

- **This repo has no deploy pipeline.** There is no `.github/workflows/`, no
  Netlify/Vercel config, no deploy script. Merging to `main` does **nothing**
  automatically.
- **The live site is a separately-published, manual snapshot** hosted on the
  `presentations.amalgama.co` platform. It is not wired to this repo.
- As of this writing the live snapshot is **pre-pivot ("v2.0 · Mayo 2026")**:
  it still loads the old buildless component CSS (`css/components.css`, since **deleted**
  from the repo) and has **no `embassy-islands.js`** — so none of the June 2026
  shadcn/Tailwind island work is visible in production. A republish is mandatory.

To update production, someone has to **re-publish the current files to the
presentations platform** (see "How to update production" below). Confirm the
exact publish mechanism with whoever administers `presentations.amalgama.co` —
it lives outside this repo.

---

## The rendering layer

The single source of truth for component code is the **`@amalgama/ds` package**
(`packages/ds/components/ui/*.tsx`, Tailwind, self-contained), rendered in the docs site via
React **islands**. The repo historically also shipped a parallel **buildless CSS** rendering
(`css/components/*.css` + the `components.css` barrel); that layer was **deleted (2026-06)**.

| Layer | Files | Who consumes it | How a component renders |
|---|---|---|---|
| **Islands (Tailwind/shadcn)** — the only component path | `islands/dist/embassy-islands.{js,css}`, built from `islands/src/` + `packages/ds/` | The repo's **own `index.html`** docs site; any Tailwind consumer of `@amalgama/ds` | React islands mounted into `[data-island]` slots |
| **Tokens (CSS)** — not components | `css/variables.css`, `css/base.css`, `css/layout.css`, `css/md-sys-bridge.css` | `index.html`, brand themes, no-build artifacts | CSS custom properties + base reset (no component classes) |

> **Buildless component CSS was deleted (2026-06).** `css/components/*.css` and the
> `components.css` barrel are gone — author all component code in `packages/ds` as Tailwind
> `.tsx`. The docs site's own chrome (hero/nav badges, CTA buttons, the token-tab switcher,
> the Vacantes mockup, the toast demo) now carries those styles inline in `index.html`'s
> embedded `<style>`; the legacy `docs/*.html` pages are redirect stubs to the SPA.

The repo's `index.html` loads the **token CSS** (`css/variables.css`, `css/base.css`,
`css/layout.css`, `css/md-sys-bridge.css`) + `docs/docs.css` + its own embedded chrome styles,
and `embassy-islands.{js,css}` for the component demos. **The deployed snapshot may be older** —
if it looks "old," it predates a rebuild/publish.

---

## How the deployed site is *supposed* to be updated

There is no automation, so it is a manual publish. The repo build step is only
needed for the island bundle:

1. **Rebuild the island bundle** (only if you changed `islands/src/` or `packages/ds/`):
   ```bash
   cd islands && npm install && npm run build
   ```
   This regenerates `islands/dist/embassy-islands.{js,css}` (committed and served).
   Bump the `?v=` query on the `<link>`/`<script>` in `index.html` so caches refresh.

2. **Sync tokens** if you changed `css/variables.css`:
   ```bash
   node scripts/sync-tokens.mjs            # regenerate packages/ds/css/variables.css
   node scripts/sync-tokens.mjs --check    # CI guard: exit 1 if they diverge
   ```

3. **Publish to `presentations.amalgama.co`.** This is the missing/manual step.
   The platform serves a self-contained copy (it references `css/...`,
   `islands/dist/...`, `logos/...` by relative path). Publishing means getting
   the current repo files — at minimum `index.html`, `css/`, `islands/dist/`,
   `docs/docs.css`, `logos/` — onto that platform. **Mechanism is platform-side
   and not in this repo; confirm it with the platform owner.**

> Recommended next step for the team: replace step 3 with a real pipeline (a
> GitHub Action that publishes `main` to the platform, or point the platform at
> the repo) so "merge to `main`" actually deploys.

---

## Why changes in this repo may not be reflected in production

In rough order of likelihood:

1. **No deploy link exists.** Nothing republishes the platform on merge. This is
   the primary cause — the live snapshot predates the entire islands pivot.
2. **The live snapshot was published once, manually.** It is frozen at v2.0
   (May 2026). Every change since — islands, shadcn components, new tabs,
   RichTooltip — is absent until someone republishes.
3. **jsDelivr CDN caching.** External artifacts that pull `css/*` via
   `cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@main/...` get GitHub
   HEAD, but jsDelivr caches aggressively (up to ~7 days). Token changes lag
   until the cache is purged (`purge.jsdelivr.net/gh/amalgamaco/...`).
4. **Browser / `?v=` cache.** If `islands/dist/*` changed but the `?v=` query in
   `index.html` was not bumped, browsers serve the stale bundle.
5. **Stale deployed snapshot.** A change to an island (`islands/src/` /
   `packages/ds/`) will never show on the old deployment, which predates the islands
   bundle (and the buildless component CSS it served was since deleted from the repo).
   Production must be republished from the current `index.html` + `embassy-islands.*`.

---

## What another developer should check next

1. **Find the publish mechanism for `presentations.amalgama.co`** — admin UI,
   a separate infra repo, or a manual upload. This is the real blocker.
2. **Decide if the platform should auto-deploy from `main`** and, if so, add a
   GitHub Action (none exists today).
3. **Re-publish once** to bring production from v2.0 → current, then diff the
   live site against the repo `index.html` to confirm parity.
4. **Production must serve the islands bundle.** The buildless component CSS was
   deleted, so the old "buildless only" snapshot can no longer render components —
   publish `index.html` + token CSS + `embassy-islands.{js,css}` together.
5. **Token flow:** after any `css/variables.css` edit, run `sync-tokens.mjs` and
   purge jsDelivr so CDN consumers update.
