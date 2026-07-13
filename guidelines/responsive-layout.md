# Responsive Layout

> Build one screen that works from a 375px phone to a wide desktop by starting narrow, layering with two breakpoints, and letting Embassy's spacing grid and app shell do the structural work.

## Why it matters

The same product runs on a recruiter's phone and on a manager's 1440px monitor. A layout that only looks right at one width is half-built. Embassy encodes the responsive contract in tokens — two breakpoints (`--breakpoint-md`, `--breakpoint-lg`), a 4px spacing grid (`--space-*`), an app-shell structure, and two Search variants — so responsiveness is a matter of *applying* the system, not hand-tuning pixels per device. One caveat is unresolved: the sub-768px sidebar behavior is a **pending design decision** — flag it, don't improvise.

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

In the Tailwind layer this is already wired: `md:` and `lg:` prefixes map to 768px/1024px, so `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` is the idiomatic mobile-first ladder. Reach for the utility prefixes before writing a raw media query.

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

Embassy does **not** prescribe a rigid 12-column CSS grid; it uses intrinsic CSS Grid that reflows without breakpoints (GOVERNANCE §14.6):

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
}
```

This auto-fits columns to available width — one column on a phone, several on desktop — with zero media queries. Use it for card grids, dashboards, and kanban columns. Constrain reading width at the *page* level, never inside components: full-bleed app shell (none), centered page (1200px), form/create (800px), prose (680px) — apply `max-width` + `margin: 0 auto` on the page container (GOVERNANCE §14.4).

## Content priority & reflow

As width shrinks, decide what stays, what stacks, and what hides:

- **Stack columns.** Multi-column regions collapse to a single column (`md:grid-cols-2` → default `grid-cols-1`). The most important column comes first in source order so it lands on top when stacked.
- **Hide-then-reveal via progressive disclosure.** Non-essential detail collapses behind an affordance. Use `Accordion` (`@amalgama/ds/accordion`) or `Collapsible` for sections; keep the primary task always visible.
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

- **`SearchBar`** (`@amalgama/ds/search`) — the standalone **mobile/hero** variant: 56px tall, pill (`--radius-full`), can expand into the full `SearchView`. Use it as the prominent search on a phone or a landing surface.
- **`SearchField`** (`@amalgama/ds/toolbar`) — the compact **desktop/toolbar** variant: `--radius-md`, height driven by padding (`min-h-10`), sits inside a `Toolbar` next to `Select`/`ToolbarButton`.

Swap between them responsively: a hero `SearchBar` on mobile becomes a `SearchField` in the toolbar row on desktop. They share the subtle `--border` resting tier with `Input`/`Select`, so `SearchField` integrates cleanly into a toolbar.

## Tables on small screens

A wide `Table` cannot shrink to 375px without becoming unreadable. Two sanctioned fallbacks:

- **Horizontal scroll** — wrap the table in a `ScrollArea` (`@amalgama/ds/scroll-area`) or an `overflow-x: auto` container so it scrolls sideways while the page does not. Keep the first column (identity) visible.
- **Card fallback** — below `md`, re-render each row as a stacked card (label/value pairs), often composing `Card` or a domain card (`vacancy-card`, `person-card`). This is preferred when the table is a primary surface on mobile.

Pick scroll for dense/exploratory data, card fallback for the main content view.

## Mobile sidebar — pending, do not improvise

The sub-768px sidebar behavior (collapse, off-canvas drawer, hamburger trigger) is an **open design decision** (GOVERNANCE §14.3). Do **not** invent an off-canvas pattern, a custom hamburger, or a bespoke drawer. If a screen needs sub-768px navigation, **flag it and defer to the design team**. (When you need a temporary side panel for *content* — filters, detail — `Sheet` exists; that is not a substitute for the unresolved primary-nav decision.)

## Do / Don't

**Do**

- Author the narrow layout first, then enhance with `md:` / `lg:`.
- Use intrinsic `auto-fill minmax()` grids so columns reflow without breakpoints.
- Keep the most important column first in source order for graceful stacking.
- Use `--space-*` tokens for all gaps and padding; step density down on mobile.
- Ensure ≥44px touch targets; use `btn-lg` for mobile primary actions.
- Swap `SearchBar` (mobile) ↔ `SearchField` (desktop) as a responsive pair.

**Don't**

- Write `@media (max-width: var(--breakpoint-md))` — media queries can't read `var()`.
- Set `max-width` inside a component — constrain at the page level.
- Improvise a mobile off-canvas sidebar — it's a pending decision; flag it.
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
