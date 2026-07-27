---
id: kanban-card
display_name: Kanban Card
aliases: [board card, pipeline card, draggable card]
category: Domain cards
status: stable
summary: A compact draggable card representing one item (candidate or vacancy) on a kanban board column, where the item's current stage is the primary information.
when_to_use:
  - "Representing an item on a stage-based board (recruiting pipeline, vacancy states)."
  - "When users move records between states visually via drag & drop."
  - "Workflows where each item's current stage is the most important information."
when_not_to_use:
  - "Task lists without clear stages → use a simple list."
  - "More than ~6–7 columns → the board becomes unmanageable; rethink the view."
  - "Comparing attributes across records → use a Table."
  - "A rich list unit with many attributes → use a Vacancy Card / Basic Card."
use_cases:
  - "Pipeline de candidatos: Aplicados → Entrevista → Oferta → Contratado."
  - "Tablero de estados de vacantes con conteo por columna."
variants:
  - {name: card, class: kanban-card, purpose: "The draggable tile (grab cursor)."}
  - {name: header, class: kanban-card-header, purpose: "Title + optional status badge row."}
  - {name: footer, class: kanban-card-footer, purpose: "Meta + optional assignee avatar row."}
  - {name: title, class: kanban-card-title, purpose: "The item name (candidate/vacancy)."}
  - {name: meta, class: kanban-card-meta, purpose: "Short secondary line (role · days)."}
  - {name: avatar, class: kanban-card-avatar, purpose: "Optional assignee avatar (primary-container tint), pushed right."}
sizes:
  - {name: default, class: "(default)", use: "single density; padding 12px 14px, column gap 8px"}
size_selection: "Single density by design; cards stack in .kanban-column-body. Prioritize the most actionable info — cap at ~5–6 attributes."
content_rules:
  - "Limit columns to real process stages — no 'catch-all' columns."
  - "Show the card count in each column header."
  - "Keep to ~5–6 attributes per card; prioritize the most actionable."
  - "Don't omit a priority/urgency indicator when order matters."
layout_constraints:
  - "Lives inside .kanban-column > .kanban-column-body; the board scrolls horizontally."
  - "Columns are 280–320px; the board (.kanban-board) is the horizontal scroller."
states:
  default: "Resting tile with grab cursor."
  hover: "shadow-md, lifts 1px."
  dragging: "opacity .5 + slight rotate(2deg) while being dragged."
  focus: "Needs tabindex=0; :focus-visible = 2px --color-focus + 4px --color-focus-ring."
accessibility:
  roles: "Clickable/draggable <div> — add tabindex=\"0\" and role=\"button\"; cards must be Tab-navigable and Enter/Space-actionable."
  aria: ['tabindex="0" on each card', "each column has an aria-label with its name + card count", "drag & drop needs a keyboard-accessible alternative (context menu or 'Mover a…' button)"]
  focus: "Keyboard-focusable; do not rely on drag alone — a mouse-only move is inaccessible (documented gap: CSS covers only mouse drag)."
  contrast: "--text-primary/-muted and --border meet AA in light + dark; column (--color-surface-variant) vs card (--card-bg) surface hierarchy holds in both themes."
keyboard:
  - {keys: "Tab", action: "focus each card"}
  - {keys: "Enter / Space", action: "activate / open the card"}
  - {keys: "(alternative move control)", action: "change stage without a mouse — required, not shipped in CSS"}
responsive:
  - "Board scrolls horizontally; columns keep a fixed min-width rather than shrinking."
  - "Keep the card a ≥44px touch target."
ux_principles:
  - "Spatial position = state: the column a card sits in is its status (recognition over recall)."
  - "A visible per-column count sets expectations about load/WIP."
common_mistakes:
  - "More than 5–6 attributes per card (cluttered tile)."
  - "Omitting the priority indicator when order matters."
  - "Drag & drop with no keyboard alternative."
  - "Too many columns making the board unusable."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "the card's column shows its current stage; column counts show load"}
  - {id: 6, name: "Recognition rather than recall", note: "stage is spatial, not remembered"}
  - {id: 7, name: "Flexibility and efficiency of use", note: "drag to advance — with a keyboard alternative for everyone"}
relationships:
  related: [vacancy-card, item, badge]
  replaces: ["custom board cards"]
  composed_with: [badge, avatar]
  not_to_confuse_with:
    - {component: vacancy-card, why: "Vacancy Card is a rich list row; Kanban Card is a compact board tile"}
    - {component: table, why: "Table compares attributes across records; the board tracks stage"}
    - {component: item, why: "Basic Card is a generic compact row; Kanban Card adds drag/board semantics"}
tokens:
  color: [--card-bg, --border, --color-surface-variant, --color-primary-container, --text-primary, --text-muted]
  radius: [--radius, --radius-md, --radius-full]
  shadow: [--shadow-md]
  motion: [--duration-fast]
motion:
  enter: "none."
  exit: "none."
  stateChange: "Hover → box-shadow (shadow-md) + lift transform translateY(-1px); .dragging → opacity .5 + transform rotate(2deg) (the drag-pickup state); cursor:grab; :focus-visible ring."
  duration: "--duration-fast (box-shadow on hover); HARDCODED .1s for the transform (lift + drag rotate) — NOT a --duration-* token."
  easing: "browser default `ease` — the box-shadow/transform transitions declare durations only, with NO explicit --ease-* token."
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). Hover lift and the drag rotate/opacity apply instantly; the dragging card stays legible via the .5 opacity."
  constraints: "Animate transform/opacity/shadow only (translateY lift, rotate + opacity on drag); the rotate(2deg) is scoped to the .dragging state only. Don't animate layout during reorder."
  relatedPatterns: [drag-reorder, hover-lift]
source:
  css: css/components/kanban.css
  classes: [kanban-board, kanban-column, kanban-column-header, kanban-column-body, kanban-card, kanban-card-title, kanban-card-meta, kanban-card-header, kanban-card-footer, kanban-card-avatar]
  react_wrapper: null
  docs_anchor: c-kanban
---

## Correct usage

```html
<!-- Board tile: focusable, count in the column header -->
<div class="kanban-board">
  <div class="kanban-column">
    <div class="kanban-column-header">Aplicados <span class="count">5</span></div>
    <div class="kanban-column-body" aria-label="Aplicados, 5 candidatos">
      <div class="kanban-card" tabindex="0" role="button">
        <div class="kanban-card-title">Juan Pérez</div>
        <div class="kanban-card-meta">Frontend · 3 días</div>
      </div>
    </div>
  </div>
</div>
```
*Why:* keyboard-focusable tile, column labelled with its count, stage conveyed by position.

## Incorrect usage

```html
<!-- ✕ Drag-only card, no keyboard focus or move alternative -->
<div class="kanban-card" draggable="true">Juan Pérez</div>
```
*Fix:* add `tabindex="0"` + `role="button"` and provide a keyboard move control ('Mover a…') — drag alone is inaccessible.

```html
<!-- ✕ Overstuffed tile -->
<div class="kanban-card">Juan Pérez · Frontend · 3d · Remoto · $3.5k · Ref: María · 4 entrevistas</div>
```
*Fix:* keep ~5–6 actionable attributes; move the rest to the detail view.
