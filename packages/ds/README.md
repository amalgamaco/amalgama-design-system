# @amalgama/ds

The **component-implementation layer** of the Amalgama Design System — Tailwind v4 +
shadcn/Radix React components, themed with Embassy's design tokens.

This repo is the single source of truth for the **component code**. The design system's
**knowledge layer** — tokens, color roles, specs, governance, guidelines, IA, and the
documentation site — lives in the **Design System Amalgama (Embassy)** repo, which
consumes this package to render its docs. Component changes happen here; tokens/specs/
governance changes happen in Embassy.

## What's in here

```
components/ui/*.tsx       38 components (Tailwind v4 + shadcn/Radix)
components/lib/utils.ts    cn() — extendTailwindMerge registering Embassy font-size + color tokens
tailwind.theme.css         Tailwind v4 theme entry (Embassy tokens → utilities) for external consumers
css/variables.css          design tokens (consumed by tailwind.theme.css)
css/hover-tokens.css        computed hover/press color-mix tokens
```

## Consuming it

A React + Tailwind v4 product installs the package and imports the theme + components:

```ts
// app entry CSS
@import "@amalgama/ds/tailwind.theme.css";   // tokens → Tailwind utilities
```
```tsx
import { Button } from "@amalgama/ds/components/ui/button"
import { Dialog } from "@amalgama/ds/components/ui/dialog"
```

Fonts load separately: **Inter** (body), **Epilogue** (headings), **DM Mono** (mono).
Dark mode is automatic via `data-theme="dark"` (the token layer recalibrates).

## Conventions

- All styling is Tailwind utilities resolving to Embassy tokens — never raw hex.
- `cn()` (from `components/lib/utils.ts`) is **required** — it registers Embassy's
  `text-{size}` and `text-{color}` tokens so they don't collide in `tailwind-merge`.
- Peer deps: `react`, `react-dom`, `tailwindcss` v4, `class-variance-authority`, `clsx`,
  `tailwind-merge`. Bundled deps: Radix primitives, `lucide-react`, `sonner`,
  `embla-carousel-react`, `react-day-picker`, `date-fns`.
