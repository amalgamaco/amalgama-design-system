# shadcn/ui as an Embassy implementation layer — evaluation

**Status:** Evaluation / proposal · 2026-06-22 · not yet adopted
**Question:** Can shadcn/ui become Embassy's technical component foundation while Embassy stays the visual, documentation, governance, and token source of truth?

---

## TL;DR

**Scoped yes.** shadcn/ui is an excellent implementation layer **for Embassy's React products**, with Embassy tokens as the source of truth. It **cannot** be the foundation for the buildless docs site or for the HTML artifacts the `/design-system` skill generates, because shadcn fundamentally requires **React + Tailwind + a build step**.

The recommended model is therefore **two implementation surfaces, one token system**:

| Context | Implementation | Why |
|---|---|---|
| Buildless (docs site, Claude artifacts, presentations, emails, static dashboards) | **Embassy CSS** | shadcn can't run without a bundler |
| React products (internal tools/dashboards with a build) | **shadcn/ui + Embassy token bridge** | best a11y/behavior, owns its source, fills Toast/Tooltip gaps |

Embassy remains the single source of truth for tokens, visual language, governance, and documentation across both.

This is what we already do conceptually with Material Web — except shadcn covers ~90% of Embassy (vs ~30%), fills the Toast and Tooltip gaps Material couldn't, and is far better suited to React than Material's web-components.

---

## The decisive constraint

shadcn/ui is **copy-paste React source** built on **Radix UI primitives + Tailwind CSS v4 (`@theme inline`, oklch) + class-variance-authority**, distributed via a CLI that scaffolds files into bundler projects (Next.js, Vite, Astro, React Router, TanStack, Laravel). **There is no plain-HTML / no-build mode.**

Embassy's canonical docs (`index.html`) is a single static file with no React or bundler, and the `/design-system` skill's primary outputs (Claude artifacts, presentations.amalgama.co, static dashboards) are also buildless. **shadcn cannot render in any of those.** Material Web works there only because web components load from a CDN as custom elements with zero build — shadcn has no equivalent.

→ Making the docs render shadcn would require rewriting them as a React/Tailwind app, abandoning the no-build principle. Out of scope for this proposal.

---

## 1. Component mapping

| Embassy component | shadcn/ui | Material Web (current) |
|---|---|---|
| Button | ✅ Button (cva) | md-* buttons |
| Switch / Checkbox / Radio | ✅ Switch / Checkbox / RadioGroup (Radix) | md-switch / md-checkbox / md-radio |
| Select | ✅ Select (Radix) | md-*-select |
| Input / Textarea | ✅ Input / Textarea | md-*-text-field |
| Tabs | ✅ Tabs (Radix) | md-tabs |
| Dialog / Modal | ✅ Dialog (Radix) | md-dialog |
| **Snackbar / Toast** | ✅ **Sonner** (React) | ❌ none — why Snackbar stayed custom |
| **Tooltip** | ✅ Tooltip (Radix) | ❌ none |
| Card / Table / Badge / Accordion / Sheet / Carousel / Date picker | ✅ all exist | partial / none |
| Chip | ⚠️ Badge / community | md-*-chip |
| Kanban / Vacancy / Person card (domain) | ❌ compose | ❌ compose |

**Coverage:** ~90% (vs Material Web ~30%), **including the Toast and Tooltip gaps that forced Embassy to stay custom.** Domain components remain Embassy compositions in every approach.

---

## 2. Theming with Embassy tokens — strong fit

- shadcn's token model is **`X` / `X-foreground` pairs** (`--primary`/`--primary-foreground`, `--background`/`--foreground`, `--border`, `--ring`, `--radius`). This maps **1:1** onto Embassy's `--color-X` / `--color-on-X` role system — a cleaner conceptual match than Material's `--md-sys-*` typescale sprawl.
- Theming is **pure CSS variables** — same bridge pattern as `css/md-sys-bridge.css`.
- **oklch is not a requirement:** shadcn authors tokens in oklch by default, but the tokens are just CSS color values — assigning Embassy's hex roles works fine.
- **Dark mode is free:** Embassy's `--color-*` roles already recalibrate under `[data-theme="dark"]`. Because the bridge points at those roles, the shadcn tokens inherit dark automatically — **no `.dark` token block needed** (same elegant property as the MD3 bridge). Only `dark:` *utilities* in component source need the variant aligned to the attribute.
- **Caveat — spatial details:** color tokens remap cleanly, but shadcn's paddings, the size→radius scale, state-layer opacities and focus ring live in **Tailwind class strings inside the copied `cva` source**. Matching Embassy's exact specs means editing those strings — more invasive than Material's token-only theming. But shadcn is copy-paste, so **you own that source permanently** (no upstream to fight).

### Draft bridge — `embassy-shadcn-bridge.css`

Lives in the React product's global stylesheet (NOT in Embassy's buildless `css/`). Tailwind v4 syntax:

```css
/* Embassy roles → shadcn token names. Embassy palette stays SoT.
   No .dark block: --color-* already recalibrate under [data-theme="dark"]. */
:root {
  --background:            var(--color-surface);
  --foreground:            var(--color-on-surface);
  --card:                  var(--color-surface-container);
  --card-foreground:       var(--color-on-surface);
  --popover:               var(--color-surface-container-high);
  --popover-foreground:    var(--color-on-surface);
  --primary:               var(--color-primary);
  --primary-foreground:    var(--color-on-primary);
  /* shadcn "secondary" = low-emphasis button bg, NOT a vivid brand accent.
     Map to Embassy's secondary CONTAINER, not --color-secondary. */
  --secondary:             var(--color-secondary-container);
  --secondary-foreground:  var(--color-on-secondary-container);
  --muted:                 var(--color-surface-variant);
  --muted-foreground:      var(--color-on-surface-variant);
  --accent:                var(--color-secondary-container);
  --accent-foreground:     var(--color-on-secondary-container);
  --destructive:           var(--color-error);
  --destructive-foreground:var(--color-on-error);
  --border:                var(--border);
  --input:                 var(--color-outline);
  --ring:                  var(--color-focus, var(--color-primary));
  --radius:                var(--radius-md);
}

/* Expose to Tailwind utilities + align dark variant to Embassy's attribute */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  /* …remaining tokens… */
  --font-sans: var(--font-body); /* Inter, not Roboto */
}
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

> Note the `--secondary` role mismatch above — that semantic difference is exactly the kind of thing the per-component cva review must catch; a naive name-for-name map would make "secondary" buttons look wrong.

---

## 3. Coexistence with current docs

shadcn cannot run in `index.html`. The docs would document shadcn components as **code/screenshots**, while live examples stay Embassy CSS — a documentation/implementation split. Material Web does not have this problem (custom elements run buildless). This is the single biggest downside vs the status quo.

---

## 4. Risks vs Material Web

| | Material Web | shadcn/ui |
|---|---|---|
| Maintenance | ⚠️ Frozen ("maintenance mode") | ✅ You own source; Radix actively maintained |
| React fit | ⚠️ web-components-in-React friction (refs, events, hydration, weak TS) | ✅ native React, first-class props/TS |
| Buildless contexts | ✅ works via CDN | ❌ impossible |
| Coverage | ⚠️ ~30% | ✅ ~90% (incl. Toast, Tooltip) |
| Theming | ⚠️ shadow DOM, exposed props only; typography pitfalls (Roboto→serif) | ✅ open CSS vars, no shadow DOM |
| New risk introduced | — | ⚠️ React/Tailwind/build; token-drift via raw Tailwind utilities; Tailwind v4 churn |

---

## 5. Three-way comparison

| Dimension | 1. Custom Embassy | 2. Material Web | 3. shadcn/ui |
|---|---|---|---|
| Consistency | ✅ total control, hand-built | ~ MD3's logic, fights Embassy specs | ✅ you own source → 100% Embassy-able |
| Ease of maintenance | ⚠️ all yours | ⚠️ frozen upstream; workarounds | ✅ behavior by Radix; you style only |
| Scalability | ⚠️ slow, per-component | ⚠️ capped ~30% | ✅ ~90%, fast |
| Token integration | ✅ native (tokens *are* the system) | ~ color ok; type/shadow leak | ✅ clean role↔pair map; spatial needs source edits |
| Documentation alignment | ✅ docs render real CSS | ✅ docs render real components | ❌ can't run without a React docs rewrite |
| AI-friendliness (`/design-system`) | ✅ HTML/CSS — every artifact target | ✅ custom elements work in HTML | ⚠️ split: ❌ HTML artifacts; ✅✅ React codebases |
| Long-term sustainability | ⚠️ doesn't scale with team | ⚠️ betting on a frozen project | ✅ largest ecosystem + AI mindshare; not an abandonable dependency |

---

## 6. Recommendation

1. **Keep Embassy as token / visual / governance / documentation SoT.** Unchanged.
2. **Adopt shadcn/ui as the React-product implementation layer**, themed exclusively through the Embassy bridge. Governance rule: **components reference bridged tokens only — no raw Tailwind color/spacing/radius utilities.**
3. **This can reduce architectures, not add one:** shadcn replaces Material Web's awkward web-components-in-React role, leaving **Embassy CSS (buildless) + shadcn (React)** — cleaner than today's Embassy CSS + Material custom elements + thin React wrappers. Keep Material Web only in the buildless docs if its demos are still wanted.
4. **Synergy:** Embassy's React wrappers already use `cva + cn() + forwardRef` with `class-variance-authority`/`clsx` as peer deps — the exact shadcn pattern. The existing `components/ui/*.tsx` are already shadcn-shaped; reimplementing them on Radix is low-friction.

### Lowest-risk validation spike (1–2 days, throwaway)

Vite + Tailwind sandbox; add the Embassy bridge; port **Button** (trivial), **Switch** (stateful), **Sonner** (gap-filler). Validates: token mapping, per-component cva-restyle effort, and dark mode against `[data-theme="dark"]` — before any commitment.

---

## 7. Spike result (2026-06-22) — ✅ validated

Built a throwaway **Vite + React + Tailwind v4 + Radix + Sonner** app in an isolated git worktree (`spike/shadcn-embassy`, files in `/tmp/embassy-shadcn-spike/spike-shadcn`), themed only through an Embassy bridge (`src/index.css`), with Embassy's real `variables.css` imported verbatim. Ported **Button** (5 variants × 3 sizes), **Switch** (4 states), and **Sonner** toast.

**What it proved:**

- **Token bridge works.** shadcn utilities (`bg-primary`, `text-secondary-foreground`, …) resolve to Embassy roles. Verified colors: Primary `#01164D`, Secondary = secondary-container, Danger = error, etc.
- **The `--color-*` namespace collision is real but solved by `@theme inline`.** Embassy's `--color-*` roles and Tailwind v4's `--color-*` utility tokens share a prefix, but `@theme inline` does **not** emit the var to `:root` — it inlines the `var()` reference into utilities — so `@theme inline { --color-primary: var(--color-primary) }` is not circular and `bg-primary` cleanly resolves to Embassy's role. **This is the key integration mechanism.**
- **Dark mode is free.** Toggling `[data-theme="dark"]` recalibrated the entire UI (primary→white, secondary→vivid blue, danger→lighter red, switch track→white, surfaces dark) with **zero `.dark` token blocks** — because the bridge points at Embassy roles that already recalibrate. Confirmed visually in both modes.
- **Typography fixed by design.** `--font-sans: var(--font-body)` → Inter everywhere; headings Epilogue. No Roboto/serif fallback (the Material Web pitfall doesn't exist here).
- **Per-component restyle effort is small and readable.** Button = one `cva` block mapping variants→roles and size→radius scale; Switch = Radix Root/Thumb with `data-[state=checked]:bg-primary`; Sonner = a few `--normal-*` CSS vars set to inverse-surface tokens.
- **Sonner fills the Snackbar gap.** Toast rendered "Archivo eliminado / Deshacer" on `--color-inverse-surface` (`#EAEBED` light-bar in dark mode) — the exact inverse behavior Embassy's custom Snackbar documents, which Material Web could not provide.

**Effort:** ~half a day including toolchain. Bridge ≈ 25 lines. The build (`npm run build`) compiles clean — the toolchain integrates without friction.

**Caveat unchanged:** all of this requires the React/Tailwind/Vite build. None of it runs in the buildless docs site or HTML artifacts. The spike confirms the *React-layer* recommendation; it does not change the buildless constraint.

> Spike is a throwaway in `/tmp` (won't survive a reboot) and is **not committed**. The `spike-shadcn` entry added to `.claude/launch.json` serves its built output on `:5180` for review.

---

### Open decisions for the team

- Do Embassy's React products warrant a maintained component layer at all yet, or is the CSS layer sufficient?
- If yes: shadcn (this proposal) vs continuing thin custom wrappers.
- Should the docs site eventually become a React/Tailwind app so it renders the *same* components products ship (single implementation SoT) — accepting the no-build loss?
