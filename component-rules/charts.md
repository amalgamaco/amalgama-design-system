---
id: charts
display_name: Charts
aliases: [chart, graph, data viz, line chart, bar chart, pie chart]
category: Data display
status: stable
summary: Line, area, bar, and pie visualizations for dashboards and analytics — hand-drawn inline SVG + CSS conic-gradient, themed with the --chart-1..5 categorical palette.
when_to_use:
  - "Time series or categorical data in dashboards/analytics."
  - "Line/area for trends over time; Bar to compare discrete categories; Pie/donut for composition of a total (≤ 6 segments)."
when_not_to_use:
  - "A single point metric → use a Stat Card, not a chart."
  - "Exact values the user reads one by one → use a Table."
  - "A pie with more than 6–7 segments → use a Bar chart."
use_cases:
  - "Ingresos vs. gastos over the week (line, two series)."
  - "Vacantes abiertas por área (bar)."
  - "Fuentes de candidatos (pie/donut)."
  - "Postulaciones por semana (area)."

variants:
  - {name: line, class: chart-line,        purpose: "Trends over time; one <polyline> per series with .chart-dot markers."}
  - {name: area, class: chart-area,        purpose: "Line + filled polygon to emphasize accumulated volume."}
  - {name: bar,  class: chart-bar,         purpose: "Compare discrete categories; rounded-top rects."}
  - {name: pie,  class: chart-pie,         purpose: "Composition/proportions via CSS conic-gradient (donut with a 60px inner radius)."}
  - {name: legend, class: chart-legend,    purpose: "Row of color swatch + label; always present with more than one series."}
sizes:
  - {name: default, class: "(default)", use: "280px tall, 100% of parent width (responsive via viewBox); 16/9 container aspect for line/bar"}
size_selection: "One responsive size — the chart fills its measured container. Constrain a pie/donut with a max-width; keep the default 280px height so loading/empty/error states don't shift layout."

content_rules:
  - "Never encode a series by color alone — the legend and tooltip always repeat the label in text."
  - "Use the --chart-1..5 palette in order; don't pick colors at random across charts on the same page."
  - "For critical semantics (approved/rejected) prefer explicit --color-success / --color-error over the generic palette."
layout_constraints:
  - "Colors come only from --chart-1..5 (mapped to secondary/tertiary/success/warning/info) — never a raw hex, never --color-primary (it inverts to white in dark mode)."
  - "Every data-dependent chart must render empty, loading, and error states, all at the chart's height (no layout shift)."

states:
  default: "Series drawn as static SVG (line/bar) or conic-gradient (pie); no entrance animation."
  hover: "JS-positioned rich tooltip (initChartTooltips): color indicator + label + value; native <title> stays as an a11y fallback."
  loading: "Skeleton bars (animate-pulse) at the chart's height, no layout shift when data arrives."
  empty: "Dashed-border container + message at the same height as the real chart."
  error: "Message + retry action (Button variant=\"tertiary\"), --color-error."

accessibility:
  roles: "SVG chart carries role=\"img\" + aria-label describing the chart; the SegmentedButton time-range control inherits its own keyboard/ARIA."
  aria: ["role=img + aria-label on the chart SVG/pie", "<title> per data point as a value fallback", "legend text repeats every series/segment name"]
  focus: "The chart body is not a focus target; interactive chrome (time-range SegmentedButton, retry button) is keyboard-operable."
  contrast: "--chart-1..5 against --color-card meet AA in both themes (same roles used by buttons/badges). Pure SVG isn't accessible alone — pair critical data with an equivalent Table or text."
keyboard:
  - {keys: "Tab / Arrow / Space", action: "operate the time-range SegmentedButton and retry control (chart body itself is non-interactive)"}
responsive:
  - "Scales with the parent width via viewBox — no fixed width, no JS measurement needed for the SVG."
  - "No entrance animation, so there's nothing to pause for prefers-reduced-motion; if you add motion, honor it."

ux_principles:
  - "Match the chart type to the question: trend → line, comparison → bar, composition → pie (≤ 6)."
  - "Show empty/loading/error instead of a chart with fake or stale data (visibility of system status)."
common_mistakes:
  - "A pie with 7+ segments (use a bar chart)."
  - "A single number rendered as a chart (use a Stat Card)."
  - "Hardcoding hex colors per series instead of --chart-*."
  - "Static image/screenshot of a chart."
  - "Encoding a series by color alone with no text label."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "explicit empty/loading/error states, not a blank canvas"}
  - {id: 4, name: "Consistency and standards", note: "--chart-* palette used in order across a page"}
  - {id: 8, name: "Aesthetic and minimalist design", note: "grid is subtle, axes show labels only, no chart junk"}

relationships:
  related: [stat-card, table, skeleton, segmented-button]
  replaces: ["static image charts, custom canvas, or charting libs with no theming"]
  composed_with: [stat-card, segmented-button, skeleton, card, empty-state]
  not_to_confuse_with:
    - {component: stat-card, why: "Stat Card shows one metric; Charts show a series/comparison/composition"}
    - {component: table, why: "Table gives exact per-row values; a chart shows the shape of the data"}

tokens:
  color: [--chart-1, --chart-2, --chart-3, --chart-4, --chart-5, --color-border, --text-muted, --color-card, --color-error]
  radius: ["6px bar top corners", "--radius-lg (state containers)"]
  typography: [--font-size-caption]

source:
  css: css/components/chart.css
  classes: [chart-container, chart-svg, chart-grid, chart-axis-label, chart-line, chart-area, chart-dot, chart-bar, chart-pie, chart-pie-wrap, chart-legend, chart-legend-item, chart-legend-swatch]
  react_wrapper: components/ui/chart.tsx
  docs_anchor: c-charts
---

## Correct usage

```html
<!-- Line chart, two series, legend repeats labels in text -->
<div class="chart-container">
  <svg class="chart-svg" viewBox="0 0 660 280" role="img" aria-label="Ingresos vs gastos, semanal">
    <polyline class="chart-line" points="…" stroke="var(--chart-1)"/>
    <polyline class="chart-line" points="…" stroke="var(--chart-4)"/>
  </svg>
  <div class="chart-legend">
    <span class="chart-legend-item"><span class="chart-legend-swatch" style="background:var(--chart-1)"></span>Ingresos</span>
    <span class="chart-legend-item"><span class="chart-legend-swatch" style="background:var(--chart-4)"></span>Gastos</span>
  </div>
</div>
```
*Why:* palette tokens in order, role=img label, legend names each series in text.

```html
<!-- Empty state at the chart's height (no layout shift) -->
<div style="height:280px;border:1px dashed var(--border);border-radius:var(--radius-lg)">Sin datos para este período</div>
```

## Incorrect usage

```html
<!-- ✕ A single KPI drawn as a bar chart -->
<div class="chart-container"><svg class="chart-svg"><rect class="chart-bar" .../></svg></div>
```
*Fix:* one number is a Stat Card, not a chart.

```html
<!-- ✕ Hardcoded hex per series -->
<polyline class="chart-line" points="…" stroke="#3B82F6"/>
```
*Fix:* use `stroke="var(--chart-1)"` — never a raw hex, never --color-primary.
