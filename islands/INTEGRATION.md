# Islands ↔ `@amalgama/ds` (monorepo architecture)

This repo is a **single repo (monorepo)** with two layers:

| Layer | Owner | Lives in |
|---|---|---|
| Knowledge: IA · docs · governance · guidelines · **tokens** (`css/variables.css`) | repo root (Embassy) | `index.html`, `css/`, `docs/`, `*.md` |
| Component **implementation** (Tailwind v4 + shadcn/Radix) — the `@amalgama/ds` package | `packages/ds/` | `packages/ds/components/ui/*.tsx`, `tailwind.theme.css` |
| Docs **glue** that renders examples into `index.html` | `islands/` | `islands/src/islands/*Showcase.tsx` + `[data-island]` slots |

> History: the implementation layer used to be a separate repo
> (`amalgama-tailwind-design-system`) and, before that, vendored copies inside
> `islands/src/components/ui`. Both are gone — the package was merged in as
> `packages/ds/` and the standalone repo archived. Don't reintroduce copies.

## How it's wired

- `islands/package.json` → `"@amalgama/ds": "file:../packages/ds"` (linked into `node_modules`).
- `islands/vite.config.ts` → `@ds` alias = `@amalgama/ds` (routes through the package's
  `exports` map: `@ds/button` → `@amalgama/ds/button` → `packages/ds/components/ui/button.tsx`),
  plus `resolve.preserveSymlinks: true` so the linked package's Radix/sonner/etc. resolve
  from `islands/node_modules`.
- Showcases import only `@ds/*`. There are **no** local component copies in `islands/src`.

## Where to make changes

- **Component code** (variants, behavior, a11y) → `packages/ds/components/ui/`.
- **Tokens** → root `css/variables.css` (canonical), then `node scripts/sync-tokens.mjs`
  to regenerate `packages/ds/css/variables.css` (guard: `--check`).
- **Docs / specs / governance / IA** → repo root + `islands/src/islands/*Showcase.tsx`.

## Rebuild + verify loop

```bash
cd islands && npm run build          # → dist/embassy-islands.{js,css}
# bump ?v= on the two <link>/<script> tags in index.html
# rsync to the preview copy, reload, verify light + dark
```

The `@amalgama/ds` package ships raw `.tsx` (shadcn-style) — **no build step** of its own.
A product consumes it via the `exports` map: `import { Button } from "@amalgama/ds/button"`
+ `@import "@amalgama/ds/theme"`.
