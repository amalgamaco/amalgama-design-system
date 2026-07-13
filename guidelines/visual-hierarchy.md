# Visual Hierarchy

> How to direct the eye so a user understands a screen in one glance: what it is, what matters most, and what to do next.

## Why it matters

A screen has one job at a time. Hierarchy is how the interface says "read this first, then this, and here's the one action that matters." When everything shouts, nothing is heard: three equal-weight buttons read as no primary action, navy body text next to navy headings reads as an undifferentiated wall. Embassy encodes hierarchy in its tokens and components — the type scale, the Button variant ladder, the container/surface roles — so your job is to *apply the ladder*, not invent contrast with raw values.

## The four levers of attention

You direct attention with four properties, in roughly this order of strength. Each maps to a token, never to an ad-hoc value.

1. **Size** — the type scale (`--font-size-*`) and component size. A `display` (28px) heading outranks a `heading-md` (18px) card title outranks `body-md` (13.5px) copy.
2. **Weight** — `--font-weight-*`. `bold`/`extrabold` for headings, `semibold` (600) for buttons and labels, `regular` (400) for body. Weight separates a selected Tab (`font-semibold`) from its neighbors.
3. **Color** — brand navy `--text-primary` for primary text, `--text-secondary` for supporting text, and the accent roles (`--color-primary`, `--color-secondary`) reserved for the *few* things that must pull focus.
4. **Space & position** — `--space-*` gaps and reading order. Proximity groups; distance separates. Top-left is read first (see Scanning patterns).

Reach for the weakest lever that works. If two `body-md` lines need distinguishing, change color (`--text-primary` vs `--text-secondary`) before you change size.

## The type scale is the hierarchy tool

Do not pick font sizes — pick a *role* from the scale and the size follows. Every `font-size` flows through a `--font-size-*` token (GOVERNANCE §8.2).

| Level | Token | Font | Typical use |
|---|---|---|---|
| Page title | `--font-size-display` (28px) | Epilogue | The one h1 per page |
| Section | `--font-size-heading-xl` (24px) / `-lg` (22px) | Epilogue | h2 / h3 |
| Card / block title | `--font-size-heading-md` (18px) | Epilogue | Card headers, `Stat Card` label |
| Body | `--font-size-body-lg` (14px) / `-md` (13.5px) | Inter | Prose, table cells, inputs, buttons |
| Supporting | `--font-size-body-sm` (12.5px) / `--font-size-caption` (12px) | Inter | Helper text, timestamps |
| Micro | `--font-size-label` (13px) / `-overline` (12px) / `-badge` (11.5px) | Inter / DM Mono | Form labels, column headers, `Badge` |

Headings are **Epilogue** (`--font-heading`); everything else is **Inter** (`--font-body`); code and eyebrow labels are **DM Mono** (`--font-mono`). One step of the scale is usually enough contrast between adjacent levels — jumping from `display` straight to `body-md` for a subtitle skips the rungs and flattens the middle.

**Color the type correctly.** Page text — headings *and* body — is brand navy `--text-primary` (`#01164D` light, `#EAEBED` dark), never black. `--color-on-surface` (near-black `#0A0C12`) is for content *inside* components only (button labels, chip text, table cells). Secondary text is `--text-secondary`. Getting this wrong makes a page read as flat black instead of Amalgama navy.

## One primary action per view

This is a rule, not a preference (GOVERNANCE §10.5). Each view has exactly **one** `Button variant="primary"` — the filled navy action the user is most likely to want ("Crear vacante", "Guardar", "Publicar"). Everything else steps down the emphasis ladder:

| Emphasis | `Button` variant | When |
|---|---|---|
| Highest — the one action | `primary` (filled `--color-primary`) | The main thing to do on this view |
| High, lifted | `elevated` (primary-container + `--btn-elevation`) | A prominent action that needs to float off a busy surface |
| Medium | `secondary` (tonal `--color-secondary-container`) | A common alternative alongside the primary |
| Low | `tertiary` (outlined `--color-outline`) | Secondary choices, "Cancelar" |
| Lowest | `text` | Inline, low-stakes ("Ver más") |
| Neutral affordance | `icon` | Toolbar / compact actions with a clear glyph |

If a legacy screen has several equal-weight buttons, introduce hierarchy — do not replicate the flatness (see MIGRATION rules and CLAUDE.md §"migration rules" point 3). An action row is one `primary` plus alternatives, never three filled buttons.

## Use accent color sparingly

`--color-primary` (navy) and `--color-secondary` (agile blue) earn attention *because* most of the screen is neutral surface and navy text. Spend them deliberately:

- **`--color-primary`** — the single primary Button, and page-level nav active state (which lives in the shell chrome, not in components — GOVERNANCE §5.6).
- **`--color-secondary` family** — selection and interactive state: selected `Chip`, `Tabs` indicator, focus ring (`--color-focus`), and the shared "blue hover" for menu/nav surfaces.
- **Status roles** (`--color-error/-success/-warning/-info`) — only for genuine status, via `Badge` and `Alert`. A success-green button that isn't a status is misuse.

If two things on a screen both use `--color-primary` as a fill, one of them is wrong.

## Whitespace as grouping

Space is structure. Use `--space-*` tokens (GOVERNANCE §7) and let proximity do the grouping so you need fewer borders and boxes:

- Related fields sit `--space-5` (20px) apart; unrelated groups separate at `--space-10` (40px).
- Card padding is `--space-6` (24px) standard, `--space-4` (16px) compact.
- Page header to first content: `--space-8` (32px); section header to its content: `--space-6` (24px).

Tightening the gap between a label and its field while widening the gap to the next group communicates "these belong together" without a single line of chrome.

## Scanning patterns: F and Z

Lay content out along the path the eye already travels:

- **F-pattern** — content-dense, scannable screens (`Table`, lists, search results, dashboards). Put the most important column and the primary label on the left; users scan down the left edge and across the top row. Column headers use `--font-size-overline`.
- **Z-pattern** — sparse, decision-focused screens (empty states, hero sections, confirmation `Dialog`s). Anchor the eye top-left (title), sweep to top-right (secondary action), diagonal to the primary action bottom-right.

Place the primary Button where the pattern ends, not wherever there's room.

## Emphasis via Badge and Stat Card

Some values deserve to pop out of the text flow:

- **`Badge`** — compact status/metadata inline with content (a vacancy's "Abierta", a count). Pill-shaped, status-colored, `--font-size-badge`. It labels; it is not clickable. Use `Chip` when the token is a selectable filter.
- **`Stat Card`** — a single headline metric given real size: a large `heading` number over a small `caption`/`label` descriptor, optionally a trend. This is size-as-hierarchy at the block level — the number is the loudest thing in the card by design.

## Elevation vs. borders

Both separate an element from its surface. Choose by *behavior*, not by taste:

- **Borders** — for elements that sit *in the plane* of the page. Containers (cards, tables, panels) use the subtle `--border` (on-surface @ 10%). Interactive resting borders (tertiary/icon Button, Checkbox, Radio, Switch) use `--color-outline`; filter/selection controls (`Chip`, Segmented Button) use `--color-outline-variant`; text-entry fields (`Input`, `Textarea`, `Select`, `Search`) rest at `--border` (GOVERNANCE §5.1). A border says "here's an edge," not "this floats."
- **Elevation** — for elements that genuinely *lift off* the surface: modals/`Dialog` (`--shadow-lg`), toasts, floating panels (`--shadow-md`), and the `elevated` Button / raised `Card` at rest (`--shadow-sm`, or the theme-aware `--btn-elevation` for the Elevated Button). Elevation communicates depth; the background token still communicates role (GOVERNANCE §9.2) — never lighten a background to fake a lift.

Rule of thumb: if it overlays other content or you can dismiss it, it gets a shadow. If it's part of the layout, it gets a border. Do not use both a heavy shadow and a heavy border to do one job.

> Note: `--shadow-*` are not yet dark-mode-aware (GOVERNANCE §9.1) — on dark surfaces they nearly vanish. For a shadow that must read in both themes, use the `--btn-elevation` runtime-token pattern; don't hardcode a dark shadow.

## Do / Don't

- **Do** keep exactly one `Button variant="primary"` per view; step everything else down to `secondary`/`tertiary`/`text`.
- **Don't** give two elements the same accent fill — the eye can't tell which is the real action.
- **Do** pick a type *role* from the scale; **don't** type a raw `font-size` px value.
- **Do** color page text `--text-primary` (navy); **don't** use `--color-on-surface` (black) for headings or body.
- **Do** separate groups with `--space-*` whitespace before adding a border or box.
- **Don't** stack a heavy border and a heavy shadow on the same element to force separation.
- **Do** give a border to in-plane elements and a shadow to things that overlay/float.
- **Don't** widen a Button to full width to fill a row — a full-width, left-aligned button reads as a form field (CLAUDE.md migration rule 1).

## Checklist for a new screen

- [ ] Exactly one `Button variant="primary"`; all other actions use a lower-emphasis variant.
- [ ] Every text element maps to a `--font-size-*` role — no raw px sizes.
- [ ] Headings are Epilogue; body/UI is Inter; eyebrow/code labels are DM Mono.
- [ ] Page text uses `--text-primary` (navy), not `--color-on-surface` (black).
- [ ] Accent roles (`--color-primary`/`--color-secondary`) appear only on the few elements that must pull focus.
- [ ] Groups are separated with `--space-*` tokens; proximity does the grouping.
- [ ] Layout follows an F-pattern (dense) or Z-pattern (sparse); the primary action sits where the eye lands.
- [ ] In-plane elements use borders (`--border`/`--color-outline`/`--color-outline-variant`); floating/overlay elements use `--shadow-*` / `--btn-elevation`.
- [ ] Status is shown with `Badge`/`Alert`; a headline metric uses `Stat Card`.
- [ ] Checked against light *and* dark (`data-theme="dark"`) — hierarchy and shadows still read.

## Related

- [content-and-writing.md](content-and-writing.md) — the words that fill the hierarchy: labels, CTA copy, error and empty-state text.
- `Button`, `Chip`, `Badge`, `Stat Card`, `Card`, `Table`, `Tabs`, `Alert` — component docs in `index.html`.
- `GOVERNANCE.md` — §5 Color, §7 Spacing, §8 Typography, §9 Elevation (the authoritative token rules this guide applies).
- `CLAUDE.md` — token load order and the migration/hierarchy rules for restyling legacy screens.
