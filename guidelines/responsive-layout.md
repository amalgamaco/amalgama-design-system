# Responsive Layout

> Build one screen that works from a 375px phone to a wide desktop by starting narrow, layering with two breakpoints, and letting Embassy's spacing grid and app shell do the structural work.

## Why it matters

The same product runs on a recruiter's phone and on a manager's 1440px monitor. A layout that only looks right at one width is half-built. Embassy encodes the responsive contract in tokens — two breakpoints (`--breakpoint-md`, `--breakpoint-lg`), a 4px spacing grid (`--space-*`), an app-shell structure, and two Search variants — so responsiveness is a matter of *applying* the system, not hand-tuning pixels per device. The one previously-open question, the sub-768px sidebar, is now resolved: it's a **modal navigation drawer** (see below).

> **This guideline is about web at a narrow width** — there is still hover, an app shell, a
> viewport that grows and CSS. A **React Native app** is a different axis, not the small end of
> this ladder: its scale, density and component map are in `MOBILE.md`.

## Mobile-first

Author the narrow layout first, then add complexity as width allows. In practice: a single stacked column is the base; multi-column, side-by-side, and revealed-secondary content are progressive enhancements added at `md`/`lg`. This keeps the smallest screen coherent and makes the wide layout additive rather than a set of overrides fighting each other.

## Breakpoints and how media queries consume them

Two thresholds, defined once in `css/variables.css` (GOVERNANCE §14.2):

| Token | Value | Threshold |
|---|---|---|
| `--breakpoint-md` | `768px` | Tablet — layout starts changing below this |
| `--breakpoint-lg` | `1024px` | Desktop |

**Critical:** CSS `@media` queries cannot read `var()`. You must write the **literal** value in the query and keep it in sync with the token:

```css
/* Correct */
@media (min-width: 768px) { … }   /* mobile-first: enhance at md and up */

/* Wrong — silently does nothing */
@media (min-width: var(--breakpoint-md)) { … }
```

Las media queries no pueden leer `var()`, asi que se escribe el literal `768px` / `1024px` y se mantiene sincronizado con los tokens. La escalera mobile-first idiomatica es una grilla intrinseca (`repeat(auto-fill, minmax(…, 1fr))`) que reflowea sola, y una media query solo cuando el cambio es estructural y no de tamano.

## The app shell and content grid

Embassy's layout is an **app shell** (GOVERNANCE §14.1): a fixed `sidebar` (240px) + a fixed `topbar` (60px) + a scrolling `shell-main` (`padding: var(--space-6) var(--space-8)`).

```
┌──────────┬───────────────────────────┐
│          │  topbar (60px, fixed)     │
│ sidebar  ├───────────────────────────┤
│ (240px)  │  shell-main (content)     │
│          │                           │
└──────────┴───────────────────────────┘
```

For **repeating cards of equal weight**, Embassy uses intrinsic CSS Grid that reflows without any breakpoint (GOVERNANCE §14.6):

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
}
```

**But there IS a 12-column grid, and it is not this.** `.grid-12` + `.span-1…12`
(`css/composition.css`, added 2026-09) exists so a section can be **7+5 or 8+4 instead of three
equal blocks** — asymmetry on purpose, which is one of the anti-generic rules in `COMPOSICION.md`.
It collapses to one column below 900px. The two do not compete:

| Use | What |
|---|---|
| N cards of equal weight, unknown count | `.card-grid` — intrinsic, no breakpoint |
| A composed section where the parts weigh differently | `.grid-12` + `.span-*` |

Neither exists in a **native app**: there the layout is one column and `.grid-12` is a web class
(`MOBILE.md` §6, failure `M6`).

This auto-fits columns to available width — one column on a phone, several on desktop — with zero media queries. Use it for card grids, dashboards, and kanban columns. Constrain reading width at the *page* level, never inside components: full-bleed app shell (none), centered page (1200px), form/create (800px), prose (680px) — apply `max-width` + `margin: 0 auto` on the page container (GOVERNANCE §14.4).

## Content priority & reflow

As width shrinks, decide what stays, what stacks, and what hides:

- **Stack columns.** Las regiones multi-columna colapsan a una sola columna por debajo de `md`. La columna mas importante va primera en el orden del markup, para que quede arriba al apilarse.
- **Hide-then-reveal via progressive disclosure.** Non-essential detail collapses behind an affordance. Use `accordion` (`css/components/accordion.css`) or `collapsible` for sections; keep the primary task always visible.
- **Prioritize ruthlessly.** A phone shows the one primary action and the core content; secondary metadata, filters, and bulk tools move into a menu, a `Sheet`, or an accordion rather than crowding the viewport.

## Spacing system & rhythm

All spacing flows through the 4px-grid `--space-*` scale (GOVERNANCE §7, §14.5) — never arbitrary px. Consistent spacing *is* the visual rhythm; drifting to `10px`/`6px` breaks it.

| Context | Token | Value |
|---|---|---|
| Icon-to-label, tight gaps | `--space-2` | 8px |
| Card padding (compact / standard) | `--space-4` / `--space-6` | 16 / 24px |
| Between list items | `--space-4` | 16px |
| Between cards in a grid | `--space-6` | 24px |
| Between section blocks | `--space-10` | 40px |

Density differs by device: desktop can afford `--space-6`/`--space-8` breathing room; on mobile, step down to `--space-4` for card padding and tighten section gaps so more content fits without feeling cramped. Change the *token you pick*, not the underlying scale.

## Touch targets

On touch devices every interactive element must be **≥44×44px** (WCAG 2.5.5, GOVERNANCE §7.2). The Button MD default (36px) is acceptable on desktop because its filled mass reads as a target, but on mobile prefer `btn-lg` (44px) for primary actions and ensure icon buttons, list rows, and chips meet the 44px minimum via padding — never shrink a control below it to fit a dense mobile layout.

## Search as a responsive pattern

Search is **one component with two official platform variants** (GOVERNANCE §5.6), not two components — same state tokens, different shape/context:

- **`.search-bar`** (`css/components/search.css`) — the standalone **mobile/hero** variant: 56px tall, pill (`--radius-full`), can expand into the full `.search-view`. Use it as the prominent search on a phone or a landing surface.
- **`.search-field`** (`css/components/toolbar.css`) — the compact **desktop/toolbar** variant: `--radius-md`, height driven by padding, sits inside a `.toolbar` next to `.select-trigger` / `.toolbar-btn`.

Swap between them responsively: a hero `SearchBar` on mobile becomes a `SearchField` in the toolbar row on desktop. They share the subtle `--border` resting tier with `Input`/`Select`, so `SearchField` integrates cleanly into a toolbar.

## Tables on small screens

A wide `Table` cannot shrink to 375px without becoming unreadable. Two sanctioned fallbacks:

- **Horizontal scroll** — wrap the table in a `.scroll-area` (`css/components/scroll-area.css`) or an `overflow-x: auto` container so it scrolls sideways while the page does not. Keep the first column (identity) visible.
- **Card fallback** — below `md`, re-render each row as a stacked card (label/value pairs), often composing `.card` or a domain card (`.vacancy-card`, `.person-card`). This is preferred when the table is a primary surface on mobile.

Pick scroll for dense/exploratory data, card fallback for the main content view.

## Mobile sidebar — modal navigation drawer

Below `--breakpoint-md` (768px) the persistent sidebar becomes a **modal navigation drawer** (resolved 2026-07, GOVERNANCE §14.3), shipped in `layout.css`: the `.sidebar` goes off-canvas (`translateX(-100%)`) and slides in over a `.sidebar-scrim` when the shell root (`.app`) gets `.nav-open`; a `.shell-menu-btn` hamburger in the topbar toggles it; content goes full-width. Motion uses `--duration-medium`/`--ease-default` and drops under `prefers-reduced-motion`. The app supplies ~10 lines of JS to toggle `.nav-open` and manage focus (open → focus into drawer; `Esc`/scrim-click → close → focus back to hamburger) — same a11y contract as `Sheet`/`Dialog`. Use this pattern; don't invent a bespoke one. (For a *content* side panel — filters, detail — `Sheet` side variant is the tool; it's not the primary-nav drawer.)

## Do / Don't

**Do**

- Author the narrow layout first, then enhance at `md` (768px) and `lg` (1024px).
- Use intrinsic `auto-fill minmax()` grids so columns reflow without breakpoints.
- Keep the most important column first in source order for graceful stacking.
- Use `--space-*` tokens for all gaps and padding; step density down on mobile.
- Ensure ≥44px touch targets; use `btn-lg` for mobile primary actions.
- Swap `SearchBar` (mobile) ↔ `SearchField` (desktop) as a responsive pair.

**Don't**

- Write `@media (max-width: var(--breakpoint-md))` — media queries can't read `var()`.
- Set `max-width` inside a component — constrain at the page level.
- Invent a bespoke mobile sidebar — use the canonical modal navigation drawer (`layout.css`).
- Let a table overflow the viewport — wrap in scroll or fall back to cards.
- Reach for arbitrary spacing (`10px`, `6px`) instead of the `--space-*` grid.

## Checklist for a new screen

- [ ] Base layout designed at ~375px first, enhanced at `md` (768px) and `lg` (1024px)
- [ ] Any raw media query uses the literal 768/1024 values, kept in sync with the tokens
- [ ] Multi-column regions stack to one column, most-important column first
- [ ] Card/dashboard grids use `auto-fill, minmax()` (no per-breakpoint column juggling)
- [ ] Page reading width constrained at the page level (1200 / 800 / 680px), not in components
- [ ] All spacing on the `--space-*` grid; mobile density tightened deliberately
- [ ] Interactive elements ≥44px on touch; mobile primary action uses `btn-lg`
- [ ] Search uses `SearchBar` on mobile / `SearchField` in the desktop toolbar
- [ ] Tables handled on mobile via horizontal scroll (`ScrollArea`) or card fallback
- [ ] Secondary content deferred via `Accordion`/`Collapsible` rather than crowding
- [ ] Sub-768px primary-nav need flagged to design (not improvised)
- [ ] Verified in light and dark at mobile, tablet, and desktop widths

## Related

- [`visual-hierarchy.md`](visual-hierarchy.md) — content priority and the one-primary-action rule that drives what survives a reflow
- [`feedback-and-states.md`](feedback-and-states.md) — how empty/loading/error states reflow on small screens
- [`ux-laws-and-heuristics.md`](ux-laws-and-heuristics.md) — Hick's/Miller's law behind progressive disclosure
- Component docs: **Toolbar** (+ `SearchField`), **Search** (`SearchBar`/`SearchView`), **Accordion**, **Collapsible**, **Sheet**, **ScrollArea**, **Table**, **Card**, **Aspect Ratio** (Foundations → Layout)
- [`GOVERNANCE.md`](../GOVERNANCE.md) §7 (Spacing), §14 (Layout, breakpoints, app shell, grid)
