# CONTRIBUTING.md — How to add or modify Embassy components

This document is for designers and engineers who want to contribute a new component, fix an existing one, or extend the token system. Read it before opening a PR or starting CSS work.

**Read order if you are new:** README.md → CLAUDE.md → GOVERNANCE.md → this file.

---

## Before you start: use the checklist in §11 of GOVERNANCE.md

The audit checklist in GOVERNANCE.md §11 defines what "done" means for a component. Print it, work through it, and only consider your contribution complete when every item is checked. The checklist covers: CSS quality, dark mode, token hierarchy, docs structure, accessibility, React wrapper, and cross-references.

---

## 1. Is there already a component for this?

Before proposing a new component:

1. Read the full component inventory in `CLAUDE.md`
2. Check the roadmap section in `CLAUDE.md` — it may already be planned
3. Check `GOVERNANCE.md §12` Known Inconsistencies — you may be fixing something that is already documented
4. Read every existing component's `Cuándo usar / Cuándo no / Reemplaza a` block — what you need may be a variant of something that exists

If the need is genuinely new, proceed.

---

## 2. Proposal phase

Before writing any code, write a brief (in Spanish or English) that answers:

- **What is this component?** One sentence.
- **What user problem does it solve?** What existing pattern (or non-pattern) breaks without it?
- **Which existing components does it relate to?** (e.g. "it is a dismissible version of Badge")
- **What are its states?** (default, hover, focus, disabled, selected, error, loading — which apply?)
- **What is its anatomy?** Sketch the HTML structure with element names.
- **What tokens will it consume?** List the Color Roles and space tokens it needs. If it needs a new token, explain why no existing one fits.
- **What are its DO / DON'T rules?** When should it be used vs. an existing component?

Share the proposal with at least one other designer before writing CSS.

---

## 3. Design phase

1. Design the component in Figma against the existing token palette — never introduce new colors
2. Create states: default, hover, focus, pressed, disabled; selected if applicable
3. Verify contrast ratios for all text (≥ 4.5:1 for normal text, ≥ 3:1 for large text and UI components)
4. Document: all padding values, gap values, border radius, font-size, font-weight — each mapped to a token
5. If any spec value does not map to an existing token, that is a DS gap to resolve before implementation — either add the token or snap to the nearest scale value

---

## 4. Component implementation (Tailwind, in `@amalgama/ds`)

> **2026-06:** components are now authored as **self-contained Tailwind components** in
> `packages/ds/components/ui/`. **Do not create `css/components/*.css` files** — that buildless
> layer is deprecated/frozen. All styling lives in-file as Tailwind utilities that resolve to
> Embassy tokens.

### 4.1 File location and naming

- `packages/ds/components/ui/<component-name>.tsx` — kebab-case, all lowercase
- No barrel to edit — the package exports `./components/ui/*.tsx` via its `exports` map (import as `@amalgama/ds/<name>`)
- If the component should render in the docs site, add a showcase in `islands/src/islands/`, register it, and rebuild (`cd islands && npm run build`)

### 4.2 Mandatory file structure

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

/* ═══════════════════════════════════════
   Embassy DS — [Component Name]  ([Description — one sentence])
   Cuándo usar: [use case]
   Cuándo no: [anti-use-cases — be specific]
   Reemplaza a: [what legacy pattern this replaces]
═══════════════════════════════════════ */

const componentVariants = cva(
  // base — Tailwind utilities resolving to Embassy tokens only
  "inline-flex items-center rounded-md text-body-md transition-all duration-fast focus-visible:focus-ring disabled:bg-disabled disabled:text-on-disabled disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-primary-hover",
        secondary: "bg-secondary-container text-on-secondary-container hover:bg-secondary-container-hover",
      },
      size: { sm: "px-3 py-1.5 text-body-sm", md: "px-6 py-2", lg: "px-[22px] py-2.5" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
)

export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {}

export const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div ref={ref} className={cn(componentVariants({ variant, size }), className)} {...props} />
  )
)
Component.displayName = "Component"
```

### 4.3 Prohibited patterns

These will block a PR:

- Raw hex (`bg-[#...]`, `text-[#...]`) — use token utilities (`bg-primary`, `text-on-surface`, …)
- Arbitrary font sizes (`text-[14px]`) — use the scale (`text-body-lg`, `text-label`, …)
- Arbitrary radii (`rounded-[8px]`) — use `rounded-sm/md/lg/xl`
- Quoted font families — use `font-body` / `font-heading` / `font-mono` utilities
- `dark:` variants or `[data-theme="dark"]` overrides — wrong token chosen; dark mode is automatic via the token layer
- A **custom CSS class** (e.g. `btn-primary`) or a new `css/components/*.css` file — author variants in-file
- Merging classes without `cn()` — always merge through `cn()` so `tailwind-merge` resolves token utilities
- A new utility in `tailwind.theme.css` for something expressible as atomic Tailwind utilities — only add there for genuinely-unexpressible patterns (shimmer, `::before` placeholder)

Carry the `Cuándo usar / Cuándo no / Reemplaza a` decision rule as a header comment in the `.tsx`.

---

## 6. Documentation

Every component needs documentation in `index.html` (the root SPA) following the 5-tab structure from GOVERNANCE.md §10.1:

```
Overview  |  Specs  |  Guidelines  |  Accessibility  |  Code
```

**Overview tab:**
- Component description (what it is, what it does)
- Visual anatomy with real DS markup and pin markers
- Token table (`bt-tok-table` format: Token / Rol / Claro / Oscuro)
- State demos (`bst-strip`) for all applicable states

**Specs tab:**
- SVG measurement annotations with magenta annotation color
- Padding, height, radius, icon-size, gap for every size variant
- All values exactly matching the CSS implementation

**Guidelines tab:**
- Hierarchy table (if multiple variants)
- "Cuándo usar / No usés cuando" table
- At least one DO / DON'T pair with visual examples
- One Primary action per context rule if applicable

**Accessibility tab:**
- Required ARIA attributes and their values
- Keyboard interaction map (Tab, Enter, Space, Arrow keys, Escape)
- Screen reader behavior description
- Color contrast ratios for the component's key text/background pairs

**Code tab:**
- Copy-pasteable HTML snippet using the real DS class names
- React usage snippet if a wrapper exists
- Token reference table

> The legacy `docs/*.html` per-component pages were **retired (2026-06)** — they are now
> redirect stubs to the canonical `index.html` SPA. Do **not** create a `docs/<name>.html`
> page; the component's documentation lives only in `index.html`.

---

## 7. Modifying an existing component

### 7.1 Non-breaking changes (variants, states, sizing)

1. Read the component's current `.tsx` (`packages/ds/components/ui/<name>.tsx`) + docs before touching anything
2. Verify the change against GOVERNANCE.md — the change must comply with all rules in §§ 2–11
3. Update the component `.tsx` (and its islands showcase, then rebuild the bundle)
4. Update `index.html` documentation to reflect the change
5. If the change affects CLAUDE.md's component inventory table, update it

### 7.2 Breaking changes (markup changes, variant name changes, token changes)

Breaking changes require:
1. Approval from at least two people (one designer + one engineer)
2. A migration note in the CSS comment header
3. An entry in the changelog (when one exists)
4. A deprecation period if any product already consumes the old markup — never delete old classes immediately

### 7.3 Renaming a CSS class or token

- Old class stays for at least one release cycle with a deprecation comment
- `CLAUDE.md` and `MIGRATION.md` must be updated to reflect the new name
- The `/design-system` skill's SKILL.md may also need updating

---

## 8. Review checklist before submitting

Run through GOVERNANCE.md §11 (the full audit checklist). Additionally:

- [ ] The component has a clear proposal answering the questions in §2 above
- [ ] The design was reviewed by at least one other designer
- [ ] `packages/ds/components/ui/<name>.tsx` created, self-contained, with the header comment (incl. `Cuándo usar / Cuándo no`)
- [ ] No prohibited patterns (§4.3): no raw hex, no arbitrary sizes/radii, no custom CSS class, no `css/components/*.css` file, classes merged via `cn()`
- [ ] Dark mode tested manually: `data-theme="dark"` on `<html>`, all states readable (no `dark:` overrides)
- [ ] WCAG color contrast verified for all text/background combinations in the component
- [ ] `index.html` has the 5-tab documentation section (+ islands showcase if interactive)
- [ ] `CLAUDE.md` component inventory updated

---

## 9. What not to contribute

- Do not add components for roadmap items without going through the full proposal → design → review workflow
- Do not introduce new token names without discussing them — token proliferation is the most common source of drift
- Do not fix "visual inconsistencies" by adding inline styles or `!important` — fix the token or the component structure
- Do not contribute a component that only works in one product context — Embassy components must be product-agnostic
- Do not contribute a component without documentation — undocumented code is incomplete code
