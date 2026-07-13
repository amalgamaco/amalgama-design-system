# Dashboards

> How to lay out a data-dense screen in Embassy so the most important numbers land first, detail is one deliberate step away, and every widget survives empty, loading, and dark-mode states.

## Why it matters

A recruiting dashboard exists to answer a question fast: how many vacantes are active, how many candidatos are in process, is the tiempo promedio de contratación getting worse? If the layout gives equal weight to everything, the answer is buried. Embassy's approach is summary-before-detail, a clear visual hierarchy of metrics, and restraint — supported by `StatCard`, `Chart`, and generous `--space-*` whitespace so a scan takes seconds, not minutes.

## Summary before detail

Lead with the headline numbers, then let the user drill in. The top of the dashboard is a KPI row built with `StatsGrid` + `StatCard` (`stat-card.tsx`); the detail — tables, kanban, charts — sits below.

```tsx
<StatsGrid>
  <StatCard label="Vacantes activas" value={12} change="+2 este mes" trend="positive" />
  <StatCard label="Candidatos en proceso" value={48} change="+9" trend="positive" />
  <StatCard label="Tiempo promedio de contratación" value="24 d" change="+3 d" trend="negative" />
</StatsGrid>
```

`StatsGrid` is a responsive auto-fit grid (`repeat(auto-fit, minmax(200px, 1fr))`, `gap-4`) — it reflows without breakpoints. `StatCard` renders the label (`text-body-sm text-fg-muted`), a large `text-display` value in the heading font, and an optional change line.

## Visual hierarchy of metrics

Readers scan in an **F-pattern** — top-left first, then across, then down. Place the single most important KPI top-left and order the row by importance left-to-right. For recruiting that usually means: vacantes activas → candidatos en proceso → tiempo promedio. Keep the KPI row to a scannable count (about 3–5); more than that and nothing stands out. Detail widgets below the fold are ordered most-consulted first.

## Scannability and trend direction

`StatCard`'s `trend` prop is the token-bound way to signal direction — **use it instead of a raw color**:

| `trend` | Class | Token |
|---|---|---|
| `positive` | `text-success` | `--color-success` |
| `negative` | `text-error` | `--color-error` |
| `neutral` | `text-fg-muted` | neutral text |

`trend` maps through `statChangeVariants`; the legacy `changeColor` prop is a `@deprecated` arbitrary-CSS escape hatch — do not use it. Note that direction ≠ sentiment: for tiempo promedio de contratación *going up is bad*, so a rising value is `trend="negative"`. Choose the trend by whether the change is good for the business, not by the arithmetic sign.

## Charts, with care

Use `Chart` (`chart.tsx`, the Recharts wrapper) for series — trends over time or categorical comparisons. Reach for it only when the shape of data matters: a single number is a `StatCard`, exact values are a `Table`.

- **Restrained, token-bound palette.** The default categorical palette is `--chart-1..5`, mapped to Embassy's secondary/tertiary/success/warning/info roles — **never `--color-primary`** (it flips to white in dark mode and reads as "no color" for a series, same rule as Tabs). Use as few series as the story needs.
- **Clear labels.** Axis ticks (`fill-fg-muted`), grid lines (`stroke-border`), and a `ChartLegendContent` / `ChartTooltipContent` so every mark is identifiable. Don't rely on color alone.
- **Emphasize endpoints.** Draw the eye to the latest value / delta rather than decorating every point.
- **Theme-aware for free.** `Chart` recalibrates via `[data-theme="dark"]` — never hardcode series colors per theme.

## Progressive disclosure — drill-down

Show the summary; reveal detail on demand. Drill from a KPI or table row into:

- a **`Dialog`** (`dialog.tsx`) for a focused, modal detail that keeps dashboard context;
- a **`Sheet`** (`sheet.tsx`) — side sheet for a record inspector, bottom sheet for mobile detail;
- or **navigation** to a dedicated detail page (with a `Breadcrumb` trail and `BackLink` back — see [navigation.md](navigation.md)) when the detail is a first-class view.

Don't cram the detail of every record onto the dashboard itself; that defeats summary-before-detail.

## Grouping related widgets

Cluster widgets that answer the same question. Use `Card` (`card.tsx`) as the container for a grouped widget (a chart + its caption, a mini-table), and page-level CSS Grid for the arrangement (GOVERNANCE.md §14.6): `repeat(auto-fill, minmax(280px, 1fr))` with `gap: var(--space-6)`. Related metrics sit adjacent; unrelated groups get whitespace between them. Grid/max-width live at the page level, never inside a component.

## Empty and loading states

Every data widget must handle no-data and loading — an unstyled blank is a defect:

- **Loading:** `Skeleton` (`skeleton.tsx`) placeholders that match the widget's final shape (KPI blocks, table rows, chart area). Prefer skeletons over spinners for layout-shaped content.
- **Empty:** `EmptyState` (`empty-state.tsx`) — icon + title + description — for "sin resultados" or "sin datos aún". Distinct from `Placeholder` (feature in construction) and `Skeleton` (loading in progress); pick by the component's decision rule.

## Refresh and real-time feedback

When data can update, tell the user: show last-updated context, and on a manual refresh use `aria-busy` + a `Skeleton` (or a subtle `Progress` for a determinate load) so the transition isn't a jarring flash. Motion goes through the tokens — `--duration-normal` / `--ease-default` for panel updates (GOVERNANCE.md §13), and everything respects `prefers-reduced-motion`.

## Don't overcrowd

Whitespace is what makes a dense screen scannable. Use `--space-*` tokens for every gap (GOVERNANCE.md §14.5): `--space-10` (40px) between section blocks, `--space-6` (24px) between cards in a grid, `--space-8` (32px) from page header to first content. Resist packing more widgets in; if the page feels full, cut or drill-down rather than shrink gaps. Never hardcode spacing.

## Do / Don't

- **Do** lead with a `StatsGrid` of 3–5 `StatCard`s, most important top-left (F-pattern).
- **Do** set direction with `trend` (positive/negative/neutral), judged by business impact not arithmetic sign.
- **Do** keep chart palettes to `--chart-1..5`, label axes and series, and emphasize endpoints.
- **Do** move record-level detail into a `Dialog` / `Sheet` / detail page (progressive disclosure).
- **Do** give every widget a `Skeleton` loading state and an `EmptyState` no-data state.
- **Do** separate widget groups with `--space-*` whitespace.
- **Don't** use `changeColor` or any raw color for a trend — it bypasses the tokens.
- **Don't** use `--color-primary` for a chart series (white in dark mode).
- **Don't** dump full detail onto the dashboard or crowd out whitespace to fit more.
- **Don't** show a raw blank while data loads, or hardcode gaps / series colors / durations.

## Checklist for a new screen

- [ ] Top row is a `StatsGrid` of `StatCard`s; the primary KPI is top-left, ~3–5 total.
- [ ] Each `StatCard` change uses `trend` (token-bound), with direction judged by business impact.
- [ ] Charts use `Chart` with the `--chart-1..5` palette (no `--color-primary`), labeled axes/legend, emphasized endpoints.
- [ ] Detail is reached via drill-down (`Dialog` / `Sheet` / navigation), not shown inline for every record.
- [ ] Related widgets are grouped in `Card`s; arrangement is page-level CSS Grid with `--space-6` gaps.
- [ ] Every data widget has a `Skeleton` loading state and an `EmptyState` empty state.
- [ ] Refreshing data sets `aria-busy` and shows a skeleton/progress cue; motion uses the tokens + reduced-motion.
- [ ] All spacing via `--space-*`; verified readable in light and dark.

## Related

- [navigation.md](navigation.md) — app shell, drill-down navigation, breadcrumbs and back links
- Components: **Stat Card** (`StatsGrid` / `StatCard`), **Chart** (`ChartContainer` / `ChartTooltipContent` / `ChartLegendContent`), **Card**, **Table**, **Dialog**, **Sheet**, **Skeleton**, **Empty State**, **Placeholder**, **Progress**
- `GOVERNANCE.md` §7 (spacing), §13 (motion), §14.5–14.6 (page spacing / grid)
- `CLAUDE.md` — component inventory and token rules
