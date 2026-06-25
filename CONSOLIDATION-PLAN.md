# Tailwind + shadcn Consolidation — Migration Scope

Scoping doc for moving the Amalgama DS toward a Tailwind + shadcn–centered codebase
while preserving Embassy's docs, governance, tokens, guidelines, and IA.
Produced 2026-06-23. **This is a plan, not executed work.**

---

## TL;DR — the central decision before any code moves

The DS currently serves **two consumer classes**, and they need different artifacts:

| Consumer | How it consumes | Needs |
|---|---|---|
| React product surfaces + the docs site (`index.html`) | shadcn/Radix + Tailwind v4 | `islands/` + the TW repo |
| **Buildless targets** — artifacts, dashboards, reports, presentations.amalgama.co (via the `design-system` skill) | `class="btn-primary"` + CDN-linked CSS, **no build step** | `css/` (tokens + `css/components/*.css`) + `components/ui/*.tsx` |

**Tailwind + shadcn cannot serve the second class** — it requires React and a build pipeline. So:

- **Option A — Full consolidation.** Drop `css/components/` + `components/ui/`, go all-in on Tailwind+shadcn.
  **Cost:** the skill loses its ability to style buildless artifacts/presentations/dashboards. Only defensible if the org is **abandoning buildless consumption**. Not recommended unless that's an explicit decision.
- **Option B — Layered (recommended).** Keep `css/` as the buildless consumption + token layer; Tailwind+shadcn for React + docs rendering; eliminate only the *genuine* redundancy. Gets you "centered on Tailwind+shadcn" for product code without breaking the skill.

Everything below is phased so **Phase 0–1 apply to both options**; Phase 2–3 apply **only to Option A**.

---

## Current state (measured)

- `index.html` renders via **38 `[data-island]` shadcn showcases** + Embassy-CSS markup for everything else.
- The everything-else splits into:
  - **Docs chrome** (`docs-*` in `docs/docs.css`; `ds-*`, `nav-card-*`, `ds-comp-tab-*` defined **inline in `index.html`'s `<style>`**; shell in `css/layout.css`). **Independent of `css/components/`. Stays in all options.**
  - **DS-component demos** embedded in the Guidelines/Specs/Accessibility tabs — real `btn-primary` (×53), `badge` (×59), `seg-btn` (×60), `chip` (~×60 excl. `ds-cr-chip`), `card`, `stat-card`, `search-bar`, `icon-btn` (×19), `data-table`, etc. **These are the only reason `css/components/` is loaded by the docs.**
- `css/components/` = 24 files, ~2,400 lines (biggest: form 304, search 296, button 229, segmented-button 223, toast 213, chip 157).
- `components/ui/*.tsx` (20) + `components/lib/utils.ts` = the published CSS-class React layer; imported **nowhere in code**, but **read by the skill** (SKILL.md §"check the React wrapper", "copy the .tsx + utils.ts").
- Consumption-contract surface to repoint under Option A: `skills/design-system/SKILL.md`, `CLAUDE.md`, `package.json` (`files: [css/, components/]`), plus references in `README.md`/`GOVERNANCE.md`/`MIGRATION.md`.

---

## Phase 0 — Hygiene & decision (low risk, do regardless of option)

1. **Resolve the Option A vs B decision** (above). Everything downstream depends on it.
2. **Fix stale Material docs.** `CLAUDE.md` still documents `@material/web` checkbox/switch/radio/etc. as live, but the runtime was removed and there are **0 live `<md-*>` elements**. Update the inventory to say those components are now shadcn/Radix islands. (Keep `css/md-sys-bridge.css` — Embassy CSS + Segmented Button still use it.)
3. **Delete the integration backup** `index.html.bak-20260623` once the integration is trusted.

**Effort:** small. **Risk:** none.

---

## Phase 1 — Migrate docs-embedded component demos → islands (both options)

Goal: make `css/components/` a *consumption artifact only*, not a *docs-rendering dependency*. After this, `index.html` renders 100% via islands + docs chrome, and `css/components.css` can be dropped from `index.html`'s `<head>` (the file stays for the skill under Option B).

Approach — per component, in the existing `[data-island]` pattern:
1. Inventory every inline Embassy-class demo in that component's section (variant grids, size scales, do/don't pairs, anatomy callouts, state demos).
2. Replace each with either the existing showcase or a new small showcase island (e.g. `button-variants`, `button-dont`), reusing the already-reconciled `@ds/*` components.
3. Rebuild `islands/`, bump `?v=`, verify that section in light + dark.

Order by demo density (do the cheapest first to build confidence): `data-table` (6) → `toolbar` (4)/`btn-text` (4) → `stat-card`/`empty-state` (8) → `btn-secondary`/`page-header` → `icon-btn` (19) → `search-bar` (22) → `btn-primary` (53) → `badge` (59) → `seg-btn` (60) → `chip` (~60) → `card`.

**Effort:** large — this is the real bulk. ~12 component sections, dozens of small inline demos each. Sized per-component, not big-bang.
**Risk:** medium — must preserve exact visual/spec fidelity in the docs; verify each section. Reversible per component.
**Exit check:** remove `css/components.css` from `index.html` `<head>`, reload, confirm zero visual regressions and no missing-style fallbacks.

**Important refinement (discovered during execution):** the escaped `<pre><code>class="…"</code></pre>` examples and the spec/anatomy/`Uso:` tables **stay** — under Option B they document the buildless CSS-class API the skill consumes. Only **live rendered** Embassy-class demos (not inside `<code>`) get converted to islands. The pattern per live demo: add a focused export to the component's `*Showcase.tsx` → register in `main.tsx` → swap the inline markup for `<div data-island="…">` → rebuild, bump `?v=`, verify the section.

**Progress tracker:**
- [x] `empty-state` — Specs anatomy demo → `empty-state-anatomy` island (v=16, verified)
- [x] `stat-card` — Specs stats-grid demo → `stat-card-grid` island (v=17, verified)
- [x] `data-table` — 2 Specs tables → `table-basic` + `table-clickable` islands (v=20, verified). *(A 3rd "data-table" usage is inside a composite page mockup — handle with page-header/toolbar/search below.)*
- [ ] `badge` (59) · `seg-btn` (60) · `chip` (~60) — variant grids + do/don't
- [ ] buttons: `btn-text`/`btn-secondary`/`btn-tertiary`/`btn-primary` (53)/`icon-btn` (19)
- [ ] `card`
- [ ] **composite page mockups** (page-header + toolbar + search-field + result-count + table together) — convert as whole-page islands; covers `page-header`/`toolbar`/`search-bar` usages at once
- [ ] ~~**Exit:** drop `css/components.css` from `index.html` `<head>`~~ — **REVISED (finding 2026-06-23).** Not achievable/desirable: DS component classes are used throughout the docs not just as demos but as **teaching material** (e.g. the "semantic colors for states" section renders `<span class="badge badge-open">badge-open</span>` — the text IS the class name) and as **incidental chrome** (badges inside Vacancy Card, composite mockups, utility-class sections). Those legitimately stay as CSS-class markup — like the `<code>` examples, they document the buildless API that Option B keeps. So `css/components.css` **stays loaded in the docs** (and stays in the repo for the skill regardless).

**Revised Phase 1 scope:** convert only each component's **primary Specs/variant demo** (reduces the island-vs-inline duplication of the main example). Done: empty-state, stat-card, data-table. Remaining primary demos (badge/seg-btn/chip/buttons/card/composite mockups) are **optional polish** with diminishing returns — the single-source-of-truth goal is already met by the architecture work, independent of these.

---

## Phase 2 — Repoint the consumption contract (Option A only)

Only meaningful if buildless consumption is being dropped.
1. Rewrite `skills/design-system/SKILL.md`: replace the CSS-class + CDN workflow (Step 2A, the `css/components/<name>.css` anatomy reads, the "copy .tsx + utils.ts") with a Tailwind+shadcn / TW-repo consumption model. **This is the hardest, highest-risk change** — it redefines how every artifact/dashboard gets styled.
2. Update `CLAUDE.md` "Consuming the DS" + "React layer" + the component inventory's React/CSS columns.
3. Update `package.json` `files`, `README.md`, `GOVERNANCE.md`, `MIGRATION.md`.
4. Decide the buildless story explicitly: either "no longer supported" or "ship a prebuilt Tailwind→CSS bundle" (a build step that compiles the shadcn components to static CSS classes — partially recreates what you'd be deleting).

**Effort:** large. **Risk:** high — changes the public contract + the skill's core capability.

---

## Phase 3 — Drop the redundant layers (Option A only)

After Phase 1 + 2 land and bake:
1. `git rm -r css/components/` and the `@import`s in `css/components.css` (keep `variables/base/layout/md-sys-bridge`).
2. `git rm -r components/ui components/lib`.
3. Final audit: `grep` the repo + skill for any lingering `css/components` / `components/ui` references; rebuild islands; full light/dark pass over `index.html`.

**Effort:** small (mechanical). **Risk:** low *if* Phases 1–2 were thorough; catastrophic if not — gated behind them.

---

## Recommendation

Adopt **Option B** unless buildless consumption is being explicitly retired:

- **Do now:** Phase 0 (hygiene + Material-doc fix).
- **Do incrementally:** Phase 1 (docs demos → islands) — this delivers most of the "single system in the docs" benefit, lets you drop `css/components.css` from `index.html`, and is fully reversible per component.
- **Keep:** `css/` (tokens + component CSS) and `components/ui/` as the buildless consumption layer for the skill. They stop being a *docs* dependency after Phase 1 but remain the artifact/presentation styling source.
- **Defer Phase 2–3** until/unless there's a decision to abandon buildless consumption or to ship a compiled CSS bundle from the Tailwind components.

Net: you get a Tailwind+shadcn-centered **product + docs** codebase, while the CSS-class library survives as a narrow, clearly-scoped buildless adapter — instead of an unmaintained parallel system.

---

## Merged to a single repo (monorepo) — 2026-06-24

Per decision, the two repos were collapsed into **one**. The `@amalgama/ds` package was
copied into Embassy at **`packages/ds/`** (copy-in; the standalone
`amalgama-tailwind-design-system` repo is to be **archived** on GitHub). Wiring updated:
`islands/package.json` → `file:../packages/ds`; `scripts/sync-tokens.mjs` → `packages/ds/css/variables.css`;
`@ds` alias unchanged (package-name based). Verified: build 2659 modules, **42/42 islands, 0 errors** at v=21.
Result: one active repo — root = docs/tokens/governance, `packages/ds/` = component package, `islands/` = docs glue.

## Repo architecture (decided 2026-06-23, now in-repo) — "root = brain, packages/ds = hands"

Split source-of-truth by asset type:
- **TW repo (`@amalgama/ds`)** = single source of truth for the Tailwind+shadcn **implementation**; products install it.
- **Embassy** = single source of truth for the **knowledge layer** (tokens, color roles, specs, governance, guidelines, IA) + the docs app; its `islands/` **consume** the TW package.
- Component-implementation work happens in the TW repo; docs/token/spec/governance work in Embassy. No more double-maintenance.

**Steps to reach it:**
- [x] **1. Make TW complete** — ported the 19 islands-only components + reconciled the 4 islands-ahead ones (tabs/select→Radix, card→shadcn anatomy, chip→type=button) into TW; installed the extended `cn()`; declared the Radix/embla/sonner/lucide/react-day-picker deps; bumped `@amalgama/ds` → 1.1.0. TW `components/ui` now 38 files; 23/23 ported files verified identical to the working islands originals.
- [x] **5. Flip islands vendor → consume** — DONE. islands depend on `@amalgama/ds` via `file:../../amalgama-tailwind-design-system`; `@ds` alias → `node_modules/@amalgama/ds/components/ui`; `resolve.preserveSymlinks: true`. Deleted `islands/src/components/` + `islands/src/lib/` (32 vendored copies + local cn). Retired `sync-ds.mjs` (dead — synced into the deleted folder). Verified: build = 2659 modules, **40/40 islands mount, 0 console errors** at v=18; Radix components (tabs/select/switch/dialog) render from the package. **→ single source of truth for component implementation achieved.**
- [x] **2. Slim TW** — DONE. Removed the stale fork: `index.html`, `docs/`, `examples/`, `logos/`, `skills/`, `GOVERNANCE.md`, `MIGRATION.md`, `DS Content Strategy Analysis.md`, and the buildless CSS (`css/base.css`, `css/layout.css`, `css/components.css`, `css/components/`). Kept `components/`, `tailwind.theme.css`, and the token files it imports (`css/variables.css`, `css/hover-tokens.css`). Rewrote `README.md` + `CLAUDE.md` as concise package docs that point to Embassy as the knowledge source. TW root is now: components, css (2 token files), tailwind.theme.css, package.json, README, CLAUDE. Islands rebuild verified (40/40 mount, 0 errors).
- [x] **3. Tokens ownership** — DONE (Option A). Embassy `css/variables.css` is the single canonical token source; TW's copy is a GENERATED artifact kept in sync by `scripts/sync-tokens.mjs` (with a `--check` drift guard, verified by simulating + healing drift). TW's CLAUDE.md marks its `variables.css` "do not edit — generated." *Remaining minor derivation-duplication (lower priority, both derive from the canonical tokens): `hover-tokens.css` (TW) vs the inlined `:root` state tokens in `islands/styles.css`, and the `@theme` token-NAME mapping that appears in both `islands/styles.css` and `tailwind.theme.css`.*
- [x] **4. Make TW a real package** — DONE. Added an `exports` map to `@amalgama/ds` (v1.2.0, `type: module`): `./*` → `components/ui/*.tsx` (so `@amalgama/ds/button` etc.), plus `./theme`, `./tokens`, `./lib/utils`. **Dogfooded:** Embassy's islands now consume through the public API — `@ds` alias → `@amalgama/ds` (routes via exports), replacing the internal file-path shortcut. Build = 2659 modules, **40/40 mount, 0 errors** at v=19. *(Still `private: true` — flip that + choose registry/git when a real product needs to install it; the shadcn raw-`.tsx` distribution needs no build step.)*
