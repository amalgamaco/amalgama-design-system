# Tables & data-heavy interfaces

> How to present lists of records — candidatos, vacantes, evaluaciones — so they stay scannable, filterable, and fast, using Embassy's `Table`, `Toolbar`, `Pagination`, and state components.

## Why it matters

Recruiting and HR surfaces are mostly lists: a table of candidatos, a board of vacantes, a roster of people. These screens live or die on scannability — how quickly someone finds the one row they need among hundreds. Embassy's `DataTable` already bakes in the structural decisions (an `overflow-x-auto` card wrapper, a tonal header, hover rows, token-driven borders); the guidance below is about choosing the right container, aligning columns, wiring the toolbar and pagination, and covering the empty / loading / error states that raw tables forget.

## Table vs. List vs. Card grid

Pick the container by what the user needs to *do* with the data:

- **`Table` (`DataTable`)** — comparing many records across the same columns, where alignment matters (candidatos with name, estado, puntaje, fecha). Best when the user scans down a column to compare values. This is the default for structured tabular data.
- **`List`** — a single scannable stream where each item is read as a unit, not compared column-by-column (activity feed, notificaciones, results under a search). `List` uses the MD3 list-item anatomy (headline + optional supporting text + optional action row) on `bg-card`.
- **Card grid** — rich, visual records where each item carries an image/avatar and several mixed attributes (a wall of `VacancyCard` or `PersonCard`). Use a CSS grid with `repeat(auto-fill, minmax(280px, 1fr))` and `--space-6` gaps (GOVERNANCE §14.6). Choose cards when browsing/recognition beats precise comparison.

Rule of thumb: **need to compare values → Table; need to read items → List; need to recognize entities → Card grid.**

## Anatomy of an Embassy table

`DataTable` composes a small set of parts, each already themed — build the table from these, don't restyle a raw `<table>`:

- **`DataTable`** — the `<table>` wrapped in `relative w-full overflow-x-auto bg-card border border-border rounded-lg`. The card chrome lives on the wrapper so the rounded corners clip the header fill.
- **`DataTableHead`** — `<thead>`, `bg-surface-variant` with a bottom `--border`; the tonal fill is what separates the header band from the rows.
- **`DataTableHeaderCell`** — `<th>`, `text-overline` uppercase, `font-semibold`, `text-fg-muted`, left-aligned by default.
- **`DataTableRow`** — `<tr>` with `hover:bg-surface-variant`; pass `clickable` for navigable rows (`cursor-pointer` + `focus-visible:focus-ring`).
- **`DataTableCell`** — `<td>`, `text-body-md`, `text-fg`, top border in `--border`.
- **`DataTableFooter` / `DataTableCaption`** — optional summary row / caption.

## Column design

- **Alignment by data type.** Text and identifiers left-aligned (the `DataTableHeaderCell`/`DataTableCell` default). Numeric, currency, and count columns **right-aligned** so digits line up by place value — add `text-right` and `tabular-nums` (e.g. `class="text-right tabular-nums"`) so the figures don't jitter as they change. Dates: left or right, but consistent within a table.
- **Header cells** are `text-overline`, uppercase, `font-semibold`, `text-fg-muted` — quiet by design so the data, not the chrome, carries the weight. Keep header labels short (one or two words).
- **Column order & priority.** Put the identifying column first (nombre del candidato), the most-scanned attributes next (estado, puntaje), and low-priority metadata last. On narrow viewports the trailing columns are the first to hide.
- **Don't over-column.** If a row needs more than ~6–7 columns to be useful, the record probably wants a Card or a detail view, not a wider table.

## Density & readability

- **Comfortable default.** Embassy cells are `px-4 py-3` (body cells) and `px-4 py-[10px]` (headers) — a comfortable density that keeps rows tappable. A "compact" mode (reduced vertical padding) is acceptable for power-user, data-dense screens, but keep it a deliberate, consistent variant, not per-row.
- **Minimal borders.** Rows separate with a single top border in `--border` (the subtle `color-mix(on-surface 10%)` tier), not heavy rules or zebra-striping by default. Whitespace does the separating; borders are a whisper. The whole table sits in a `bg-card` + `border-border` + `rounded-lg` wrapper.
- **Row hover.** Rows carry `hover:bg-surface-variant`; navigable rows use the `clickable` prop (adds `cursor-pointer` + `focus-visible:focus-ring`) so keyboard users get the same affordance.

## Sortable headers

- Make a column sortable only when ordering by it is genuinely useful (fecha de postulación, puntaje). Render a sort affordance (chevron) in the `DataTableHeaderCell`, toggle asc/desc/none, and expose state with `aria-sort` on the `<th>`.
- Show the active sort column and direction clearly; only one column sorts at a time unless the domain truly needs multi-sort.
- Default the table to the most useful order (e.g. postulaciones más recientes primero), not an arbitrary insertion order.

## Toolbar above the table

Put controls in a `Toolbar` directly above the table — it's a flex row (`gap-2`, `mb-4`) sized to a single line:

- **`SearchField`** (desktop variant of Search, from `toolbar.tsx`) for free-text filtering ("Buscar candidato…"). It shares the subtle `--border` tier with `Select`, so they line up cleanly in the same row. On mobile/hero contexts use `SearchBar` (`search.tsx`) instead.
- **`Select`** filters for closed facets (estado de vacante, seniority, ubicación) — all at `min-h-10`, matching the SearchField height.
- **`ToolbarButton`** for actions and secondary filters (a "Filtros" toggle, "Exportar"). It composes the canonical `Button variant="icon"` at `min-h-10` for row parity.
- **`ResultCount`** below the toolbar to report the result set ("Mostrando **24** candidatos"), giving users feedback that filters worked.

Keep every toolbar control on one row at the same height; wrap or collapse into a filter sheet on mobile rather than letting controls stack raggedly.

## Pagination vs. infinite scroll

- **`Pagination`** — the default for tables where users need a stable, addressable position, want to jump to a page, or need to know the total size. Its active page uses Embassy's Secondary-container selection language (shared with Chip/nav). Use it for admin/back-office tables like a candidatos list.
- **Infinite scroll** — only for exploratory, feed-like browsing where total count doesn't matter and users skim continuously. Avoid it for tables people need to return to a specific row in, and never combine it with a footer the user can never reach.
- Whichever you pick, keep page size sensible (25–50 rows) and preserve the user's page/filters across navigation and back-button.

## Structural patterns

- **Sticky header.** For long tables, keep the `DataTableHead` visible while the body scrolls so column context never disappears. Apply sticky positioning to the header row within the scroll container.
- **Horizontal overflow.** `DataTable` already wraps the `<table>` in `relative w-full overflow-x-auto` so a wide table scrolls **inside its own box** instead of pushing the page sideways — never remove that wrapper or let a table break the page's horizontal scroll (GOVERNANCE / CLAUDE responsive rule).
- **Row selection + bulk actions.** For batch operations (cambiar estado de varios candidatos, archivar), add a leading `Checkbox` column plus a header "select all" `Checkbox`. When ≥1 row is selected, reveal a bulk-action bar (reuse the `Toolbar` row or a contextual bar) with the batch actions; route destructive bulk actions through `AlertDialog`.
- **Status via `Badge`.** Render record status as a `Badge`, not colored text — its variants map to real states: `open`/`active` (success container), `closed` (error container), `draft` (surface-variant + outline), `archived` (muted), `warning`, `tertiary`, `info`. This keeps "Abierta" / "Cerrada" / "Borrador" visually consistent across every table and card.

## Empty, loading & error states

A data view must handle the three non-happy paths explicitly:

- **Empty → `Empty State`.** No results (filter matched nothing) or no data yet (no candidatos aún). `EmptyState` gives an icon, a message, and an optional action ("Crear vacante"). Distinguish "no results for this filter" (offer to clear filters) from "nothing exists yet" (offer to create). Don't leave a blank table body.
- **Loading → `Skeleton` rows.** While data loads, render `Skeleton` placeholders in the table's shape (a handful of shimmer rows), not a centered spinner — skeletons preserve layout and perceived speed. Don't use `Empty State` for loading.
- **Error → `Alert variant="error"`.** If the fetch fails, show an inline `Alert` above (or in place of) the table explaining what happened and offering a retry. `Alert` is inline and persistent, which fits a load failure; a `Snackbar` (ephemeral) is wrong here.

## Summarizing a data view

A table rarely stands alone — it usually sits under a summary. Use `Stat Card` for the KPIs above a list (candidatos totales, vacantes abiertas, tiempo medio de contratación): each shows a label, a large value, and a percentage change (`statChangeVariants`). Lay them out in the same `repeat(auto-fill, minmax(280px, 1fr))` grid with `--space-6` gaps, above the `Toolbar`. Keep the numbers in `Stat Card` and the details in the `Table` — don't duplicate a metric as a table column and a stat tile.

## Worked example — candidatos list

A typical recruiting table screen, top to bottom: a row of `Stat Card` KPIs → a `Toolbar` (`SearchField` "Buscar candidato…", `Select` estado, `Select` seniority, `ToolbarButton` "Filtros") → `ResultCount` → the `DataTable` with columns **Candidato** (left), **Vacante** (left), **Estado** (`Badge`), **Puntaje** (right, `tabular-nums`), **Postulación** (right, date), each row `clickable` to the detail page → `Pagination` below. While loading, the table body is `Skeleton` rows; with no matches, an `Empty State` offering "Limpiar filtros"; on fetch failure, an `Alert variant="error"` with a retry.

## Responsive strategy

- **Let the table scroll horizontally** inside its `overflow-x-auto` wrapper as the first line of defense on tablet.
- **On phones, prefer collapsing** each row into a stacked `Card` (label: value pairs) or switching the whole view to a `List` — a many-column table is unusable at 375px. Decide per screen which columns are essential; hide the rest below `--breakpoint-md` (768px).
- Below 768px the app-shell sidebar is the canonical **modal navigation drawer** (GOVERNANCE §14.3) — rely on it; don't build a bespoke mobile nav around the table.

## Accessibility

- **Real table semantics.** Use `DataTable`'s native `<table>`/`<thead>`/`<th>`/`<td>` structure so screen readers announce rows and column headers — never fake a grid out of `<div>`s.
- **Sortable headers expose `aria-sort`** (`ascending`/`descending`/`none`) on the `<th>`, and the sort control has an accessible name.
- **Clickable rows are keyboard-reachable.** The `clickable` prop adds `focus-visible:focus-ring`; make the row (or a cell link) focusable and Enter-activatable, not mouse-only.
- **Status isn't color-only.** `Badge` carries a text label alongside its container color, so state survives for colorblind users and screen readers.
- **Selection checkboxes have labels** (e.g. `aria-label="Seleccionar candidato Ana"`), and the header "select all" is labeled too.

## Scale & performance

- **Paginate or window large sets** — don't render thousands of `<tr>`s at once. Fetch per page (`Pagination`) or virtualize the body for very long lists; either way keep the sticky header and scroll wrapper intact.
- **Filter server-side** when the dataset is large — the `Toolbar` inputs drive the query, and `ResultCount` reflects the filtered total, not the page length.
- **Keep row content light.** Heavy per-cell components (charts, live widgets) belong in a detail view, not multiplied across hundreds of rows.

## Do / Don't

- **Do** right-align numeric columns with `tabular-nums`; left-align text.
- **Do** keep the `overflow-x-auto` wrapper so wide tables never push the page sideways.
- **Do** put search + filters in a `Toolbar` above the table and report counts with `ResultCount`.
- **Do** render status as a `Badge`, and cover empty (`Empty State`), loading (`Skeleton`), and error (`Alert`) states.
- **Do** use a Card grid or `List` when comparison isn't the goal.
- **Don't** zebra-stripe or add heavy borders — separate rows with whitespace and the subtle `--border`.
- **Don't** cram 10 columns into one table; move detail to a row expansion or detail page.
- **Don't** use infinite scroll for tables users must return to a specific row in.
- **Don't** show a bare empty table body or a lone spinner — use the dedicated state components.
- **Don't** communicate status with colored text alone; use `Badge` for a consistent, accessible signal.

## Checklist for a new screen

- [ ] Container chosen deliberately: `Table` (compare), `List` (read), or Card grid (recognize).
- [ ] Text columns left-aligned; numeric/currency columns right-aligned with `tabular-nums`.
- [ ] Identifying column first; columns ordered by scan priority; ≤ ~7 columns.
- [ ] `Toolbar` above the table with `SearchField` + `Select` filters + `ToolbarButton`, all `min-h-10`; `ResultCount` shown.
- [ ] Sortable headers only where useful, with `aria-sort` and a sensible default order.
- [ ] Long tables have a sticky header; the `overflow-x-auto` wrapper is intact.
- [ ] `Pagination` (or a justified infinite scroll) with a sensible page size; filters/page preserved on navigation.
- [ ] Row selection + bulk-action bar where batch operations exist; destructive bulk actions via `AlertDialog`.
- [ ] Status shown with `Badge` variants, not colored text.
- [ ] Empty (`Empty State`), loading (`Skeleton` rows), and error (`Alert`) states all implemented.
- [ ] Responsive plan: horizontal scroll on tablet, collapse to Card/`List` below 768px.
- [ ] Borders use `--border`; density comfortable and consistent; clickable rows use the `clickable` prop + `focus-visible:focus-ring`.

## Related

- [forms.md](forms.md) — creating and editing the records these views list.
- Components: `Table` (`DataTable` and parts), `List`, `Card`, `Vacancy Card`, `Person Card`, `Toolbar` (`SearchField`/`Select`/`ToolbarButton`/`ResultCount`), `Search` (`SearchBar`), `Pagination`, `Badge`, `Empty State`, `Skeleton`, `Alert`, `Checkbox`, `Alert Dialog`, `Stat Card`, `Kanban`.
- `GOVERNANCE.md` — §5.1 border tiers, §7 spacing, §14.4 widths, §14.6 grid, §14.3 mobile modal navigation drawer.
- `CLAUDE.md` — component inventory, table/list/card decision rules, responsive & breakpoint rules.
