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
  it loads the buildless `css/*` layer and has **no `embassy-islands.js`** — so
  none of the June 2026 shadcn/Tailwind island work is visible in production.

To update production, someone has to **re-publish the current files to the
presentations platform** (see "How to update production" below). Confirm the
exact publish mechanism with whoever administers `presentations.amalgama.co` —
it lives outside this repo.

---

## The two rendering layers (important)

This repo ships the **same components in two layers**, for two different
consumers. Confusing them is the usual root cause of "my change didn't show up."

| Layer | Files | Who consumes it | How a component renders |
|---|---|---|---|
| **Buildless CSS** | `css/variables.css`, `css/base.css`, `css/layout.css`, `css/components.css` + `css/components/*.css` | The `design-system` skill (artifacts, dashboards, **presentations.amalgama.co**), and external pages via the jsDelivr CDN | `class="btn-primary"` etc. — pure CSS classes, **no JS build** |
| **Islands (Tailwind/shadcn)** | `islands/dist/embassy-islands.{js,css}`, built from `islands/src/` + `packages/ds/` | The repo's **own `index.html`** docs site | React islands mounted into `[data-island]` slots |

The repo's `index.html` loads **both** (buildless `css/*` for structure +
`embassy-islands.js` for interactive components). **The deployed snapshot loads
only the buildless `css/*` layer** — that's why it looks "old."

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
5. **Editing the wrong layer.** A change to an island (`islands/src/` /
   `packages/ds/`) will never show on a deployment that only serves the buildless
   `css/*` layer, and vice-versa. Match the layer to what the target consumes.

---

## What another developer should check next

1. **Find the publish mechanism for `presentations.amalgama.co`** — admin UI,
   a separate infra repo, or a manual upload. This is the real blocker.
2. **Decide if the platform should auto-deploy from `main`** and, if so, add a
   GitHub Action (none exists today).
3. **Re-publish once** to bring production from v2.0 → current, then diff the
   live site against the repo `index.html` to confirm parity.
4. **Confirm which layer production should use** — buildless `css/*` only, or the
   islands bundle too. The live snapshot currently uses buildless only; the repo
   `index.html` uses both.
5. **Token flow:** after any `css/variables.css` edit, run `sync-tokens.mjs` and
   purge jsDelivr so CDN consumers update.
