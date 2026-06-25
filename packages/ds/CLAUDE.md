# CLAUDE.md

This repo (`@amalgama/ds`) is the **component-implementation layer** of the Amalgama
Design System: Tailwind v4 + shadcn/Radix React components in `components/ui/`, themed
with Embassy tokens.

## Source of truth — read this first

This repo owns **only the component implementation**. It does **not** own the design
system's knowledge. The canonical source for tokens, color roles, specs, governance,
guidelines, IA, and the documentation site is the **Design System Amalgama (Embassy)**
repo. Do not re-create docs, governance, or a documentation site here — that was an old
fork and has been removed.

- **Work on a component's code (variants, behavior, a11y)?** → here, in `components/ui/`.
- **Work on tokens / specs / color roles / governance / docs?** → in Embassy.

Embassy's docs site consumes this package (via a `file:`/npm dependency) to render its
live component examples, so changes here surface there after a rebuild.

## Rules for component code

- **Tokens are the law.** Style only with Tailwind utilities that resolve to Embassy
  tokens (`bg-primary`, `text-on-surface`, `rounded-md`, `text-body-md`, …). Never raw hex.
- **`cn()` is non-negotiable** (`components/lib/utils.ts`): it uses `extendTailwindMerge`
  to register Embassy font-size and color-role tokens so `text-{size}` and `text-{color}`
  don't collide and silently drop. Always merge classes through it.
- **shadcn/Radix pattern**: `cva` for variants + `cn()` + `forwardRef`. Interactive
  components wrap Radix primitives.
- Dark mode is automatic via `data-theme="dark"` — the token layer recalibrates; do not
  add per-theme overrides in components.
- `tailwind.theme.css` is the theme entry for external consumers; it imports the token
  files in `css/`.
- **`css/variables.css` is a GENERATED copy** of Embassy's canonical tokens — do **not**
  edit it here. Change tokens in Embassy (`css/variables.css`) and run Embassy's
  `scripts/sync-tokens.mjs` to regenerate this copy. (`css/hover-tokens.css` holds derived
  color-mix state tokens — implementation-side.)
