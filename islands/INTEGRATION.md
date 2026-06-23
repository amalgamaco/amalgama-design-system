# Connecting the islands layer to `amalgama-tailwind-design-system`

This is the runbook for making **`amalgama-tailwind-design-system` (the TW repo)** the
canonical component-implementation layer, while **Embassy** keeps the IA, docs,
governance, tokens, guidelines, and visual rules.

> Status (2026-06): **blocked on repo access.** The TW repo is private, is not
> published to npm, and is not cloned on this machine. The steps below execute as
> soon as a local clone path is available. Nothing here should be guessed against
> an unseen API — read the real source first.

---

## Target architecture

| Layer | Owner | Lives in |
|---|---|---|
| IA · docs · governance · **tokens** (`css/variables.css`) · guidelines | **Embassy** | repo root (`index.html`, `css/`, `*.md`) |
| Component **implementation** (Tailwind v4 + shadcn/Radix) | **TW repo** | `amalgama-tailwind-design-system` |
| Docs **glue** that renders examples into `index.html` | Embassy | `islands/src/islands/*` (showcases) + `[data-island]` slots |

The showcases (`islands/src/islands/*Showcase.tsx`) are Embassy docs-glue. They
**consume** components from the implementation layer. Today those components are
**vendored copies** in `islands/src/components/ui/*` ("adapted from" the TW repo per
`styles.css`). Connecting the repo means making `islands/src/components/ui` *come
from* the TW repo instead of being an independent fork.

---

## Current state (audit, 2026-06)

- `amalgama-tailwind-design-system` is **not** a dependency and **not** imported
  anywhere — only referenced in a `styles.css` comment. Components are vendored.
- **0 live `<md-*>` elements**; the `@material/web` runtime was removed from
  `<head>`. (`css/md-sys-bridge.css` stays — Embassy CSS + Segmented Button use it.)
- Implementation layer per component:
  - **Real shadcn/Radix:** avatar, checkbox, dialog, dropdown-menu (menu),
    progress, radio-group, select, separator (divider), sheet, slider, switch,
    tabs, tooltip, segmented-button (toggle-group); + sonner, react-day-picker
    (calendar), embla (carousel).
  - **shadcn-pattern, no Radix (matches shadcn's own):** button, badge, card,
    input/textarea, table, skeleton.
  - **Embassy-specific (no shadcn counterpart):** chip, search, empty-state,
    stat-card, list, kanban-card, person-card, vacancy-card.

---

## Integration model — decide after reading the repo

1. **Local `file:` dependency (preferred if the repo is a buildable/exporting package).**
   ```jsonc
   // islands/package.json
   "dependencies": { "amalgama-tailwind-design-system": "file:../amalgama-tailwind-design-system" }
   ```
   Then replace `../components/ui/x` imports with the package's exports.
2. **Copy-in / shadcn-registry (if the repo is just source files).** Our vendored
   `islands/src/components/ui` *is* the intended pattern. Set up a sync script that
   pulls the repo's `components/ui` into ours, then re-apply the Embassy patch set
   (below). Add a single `@ds` path alias in `vite.config`/`tsconfig` so showcases
   import from one swappable boundary.

Read the repo's `package.json` (`main`/`module`/`exports`/`files`) + `components/`
to choose. Don't assume.

---

## ⚠️ Embassy decisions that MUST survive the connection

These were deliberate. If the TW repo's versions differ, **keep the Embassy
behavior** (re-apply as a patch layer / props / overrides). Verify each in light +
dark after connecting.

- **`lib/utils.ts` — `cn()` uses `extendTailwindMerge`** registering Embassy
  font-size tokens (`text-label`, `text-body-*`, …) and color-role tokens so
  `text-{size}` and `text-{color}` don't collide and silently drop. Without this,
  tooltips/badges/sized-buttons lose their color. **Non-negotiable.**
- **Button** — Embassy variants `primary/secondary/tertiary/text/icon/danger/success/ghost`,
  sizes `xs/sm/lg/xl` (+ default), radius scales with size, `compact` prop.
- **Switch / Checkbox / Radio** — Embassy token mapping (unchecked: `surface-variant`
  track / `outline` border; checked: `primary` + `on-primary`); focus uses the
  Embassy `focus-ring` utility (not shadcn `ring-*`/`ring-offset-*`, which aren't
  bridged).
- **Segmented Button** — transparent group, 1px `outline` border, 3px padding,
  2px gap, individually pill-rounded **intrinsic-width** segments, **no dividers**,
  `secondary-container` selected fill. Size propagates group→item via context.
- **Slider** — track `bg-surface-variant` (not `bg-muted`, unbridged).
- **Tooltip** — `inverse-surface` / `inverse-on-surface`.
- **Calendar** — react-day-picker v10 `classNames`, ES locale, selected day uses
  `text-on-primary!` so it beats the `today` modifier.
- **Badge** — 8 Embassy semantic variants (open/active/closed/draft/archived/
  warning/tertiary/info) → container tokens.
- **`styles.css`** — the `@theme inline` Embassy→Tailwind token bridge; the
  `@layer base` `[data-island] button` reset (replaces the preflight we skip);
  `tw-animate-css` import. **Gotcha:** never put `*/` inside a CSS comment (e.g.
  `bg-*/border-*`) — it closes the comment early and drops the following rule.
- **Embassy-specific components** (chip, search, empty-state, stat-card, list,
  kanban/person/vacancy cards) likely have **no** TW-repo counterpart — keep ours.

---

## Known blocker for one feature

The Color Roles role-board demos stay **static `--rb-*` mockups**: making them real
islands needs per-board `[data-theme]` scoping, which the current bridge breaks —
`@theme inline` emits a circular `:root { --color-primary: var(--color-primary) }`
that poisons `var()` substitution under a scoped override (works only on `:root`/
global theme). Fixing this = move Tailwind's color namespace off `--color-*`
(systemic). Track separately.

---

## Connect steps (run once a local clone path is given)

1. `ls` the clone; read `package.json` + `components/` + token/theme files.
2. Pick the integration model above.
3. Wire imports (package export or `@ds` alias). Keep showcases unchanged in shape.
4. Re-apply every item in the "MUST survive" list; diff against the repo's versions.
5. `npm run build` in `islands/`, bump the `?v=` in `index.html`, `rsync` to the
   preview, reload, and verify **every** component page in light + dark.
6. Report a component-by-component diff of what changed.
