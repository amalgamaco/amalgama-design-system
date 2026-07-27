---
id: stat-card
display_name: Stat Card
aliases: [kpi card, metric card, stat, kpi]
category: Data display
status: stable
summary: A single KPI/metric with a label, a large value, and an optional trend indicator.

when_to_use:
  - "Dashboards showing KPIs or key business metrics."
  - "Section-header summaries (total de vacantes, candidatos activos)."
  - "Reports where the user compares values at a glance."
when_not_to_use:
  - "Non-numeric grouped content → use Full Card."
  - "A compact entity row with an action → use Basic Card (item)."
  - "Comparable multi-attribute records → use Table."
  - "A time series or distribution → use Chart."
use_cases:
  - "'Vacantes abiertas: 24 · +12%' KPI tile in a recruiting dashboard."
  - "'Candidatos activos' summary above a candidate table."

variants:
  - {name: base, class: stat-card, purpose: "The KPI tile: label + value + optional change."}
  - {name: trend-positive, class: stat-change-positive, purpose: "Positive change (Success color)."}
  - {name: trend-negative, class: stat-change-negative, purpose: "Negative change (Error color)."}
  - {name: trend-neutral,  class: stat-change-neutral,  purpose: "Flat/neutral change (muted color)."}
sizes:
  - {name: default, class: "(default)", use: "single size; the stats-grid controls layout/density"}
size_selection: "No size class; lay tiles out in .stats-grid (auto-fit, min 200px). Keep ≤ 6 tiles per view."

content_rules:
  - "Always pair a metric with a reference: a trend/change vs the previous period."
  - "Use consistent units and precision across a view (don't mix '24' and '24.0')."
  - "Define the time period the metric belongs to."
  - "Trend color must be reinforced with text ('↑ +12% vs mes anterior'), never color alone."
layout_constraints:
  - "Group related tiles in one .stats-grid; do not nest a stat-card inside another card."
  - "Use the token-bound trend modifier classes, not an inline style=\"color:…\"."

states:
  default: "Read-only surface tile; no interactive states."

accessibility:
  roles: "Read-only by default. If the metric navigates to a detail, the interactive element must be a real link/button with its own visible focus."
  aria: ["role=group + aria-label on stats-grid", "aria-label giving the value context ('24 vacantes activas')", "text alternative for color trends"]
  focus: "The stat-card itself is not focusable (stat-card.css defines no focus state)."
  contrast: "--text-primary / --text-muted and the state colors meet AA in light + dark; never override per theme."
keyboard:
  - {keys: "Tab", action: "only if a nested link/button is present; the tile itself is not focusable"}
responsive:
  - "stats-grid reflows with auto-fit from multiple columns to one on narrow widths."

ux_principles:
  - "A metric without context is noise — always show a trend or comparison (visibility of system status)."
  - "Limit the number of tiles so the most important KPIs stand out (signal over noise)."
common_mistakes:
  - "Showing a metric with no period or comparison."
  - "Communicating the trend with color only (no text)."
  - "Nesting stat cards inside other cards."
  - "Using an inline color style instead of stat-change-* modifiers."
  - "More than ~6 tiles competing in one view."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "the trend shows how the metric is moving"}
  - {id: 4, name: "Consistency and standards", note: "consistent units/precision across tiles"}
  - {id: 8, name: "Aesthetic and minimalist design", note: "few, prioritized KPIs — not a wall of numbers"}

relationships:
  related: [card, chart, table]
  replaces: ["legacy metric widgets"]
  composed_with: [page-header, chart, badge]
  not_to_confuse_with:
    - {component: card, why: "Full Card groups general content; Stat Card is a single metric"}
    - {component: chart, why: "Chart shows a trend over many points; Stat Card is one value + delta"}

tokens:
  color: [--card-bg, --border, --text-primary, --text-muted, --color-success, --color-error]
  radius: [--radius]
  spacing: ["20px padding", "16px grid gap"]
  typography: [--font-size-display, --font-size-body-sm, --font-size-caption]

source:
  css: css/components/stat-card.css
  classes: [stats-grid, stat-card, stat-label, stat-value, stat-change, stat-change-positive, stat-change-negative, stat-change-neutral]
  react_wrapper: components/ui/stat-card.tsx
  docs_anchor: c-stat-card
---

## Correct usage

```html
<div class="stats-grid" role="group" aria-label="Métricas de vacantes">
  <div class="stat-card">
    <div class="stat-label">Vacantes abiertas</div>
    <div class="stat-value">24</div>
    <div class="stat-change stat-change-positive">↑ +12% vs mes anterior</div>
  </div>
</div>
```
*Why:* metric + label + a trend with text (not color alone), grouped in a stats-grid.

## Incorrect usage

```html
<!-- ✕ Metric with no context and color-only trend -->
<div class="stat-card">
  <div class="stat-value">24</div>
  <div class="stat-change" style="color:green">+12%</div>
</div>
```
*Fix:* add a label and period, and use `stat-change-positive` with text ('↑ +12% vs mes anterior').

```html
<!-- ✕ Stat card nested inside another card -->
<div class="card"><div class="stat-card">…</div></div>
```
*Fix:* place stat cards directly in a `stats-grid`, not inside another surface.
