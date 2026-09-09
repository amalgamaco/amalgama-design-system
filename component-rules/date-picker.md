---
id: date-picker
display_name: Date Picker
aliases: [selector de fecha, campo de fecha, calendario desplegable, docked calendar]
category: Form
status: stable
summary: A trigger button showing the chosen date, which opens a Calendar in a floating panel below it — the form and toolbar default, for when a permanent calendar would cost too much space.

when_to_use:
  - "Choosing a date, or a range, from a form field or a toolbar filter."
  - "Anywhere the date is one input among several and an always-visible month grid would dominate the layout."
when_not_to_use:
  - "Date-picking is the main task of the screen (a booking flow, an availability view) → an inline Calendar, always visible."
  - "The person knows the exact date and types faster than they click — a birth date, an expiry → a native `<input type=\"date\">`, no calendar needed."
  - "Choosing a loose month or year → Select."
  - "On mobile, the small floating panel is cramped → dock the Calendar in a bottom Sheet instead."
use_cases:
  - "'Desde' and 'Hasta' filters in a report toolbar."
  - "A publication date on a create form."

variants:
  - {name: default, class: date-picker, purpose: "Trigger plus docked panel; the trigger reuses .btn-tertiary."}
  - {name: empty, class: date-picker-trigger-empty, purpose: "No date chosen yet — the trigger label drops to --text-muted so the placeholder reads as absence, not as a value."}
sizes:
  - {name: md, class: "(default)", use: "the only size; 240px fixed trigger width, 18px icon."}
size_selection: "Single size by design. The 240px width is fixed so a row of date filters stays aligned and does not reflow when a date is chosen."

content_rules:
  - "The trigger shows the chosen date written out — '17 de julio, 2026' — not an ISO string."
  - "Empty state shows what is being chosen ('Elegí una fecha', 'Desde'), with `date-picker-trigger-empty`."
  - "For a range, the trigger shows both ends separated by an en dash, or two separate pickers labelled 'Desde' and 'Hasta'. Pick one and keep it across the product."
layout_constraints:
  - "The panel is `position: absolute; top: calc(100% + 4px)` and `z-index: 30`, anchored under the trigger."
  - "**Known limitation, accepted:** there is no viewport collision detection. A picker near the bottom or right edge will overflow. Place it with room below, or use a Sheet."
  - "The panel contains a Calendar and nothing else — no extra footer, no confirm button. Choosing a date closes it."
  - "Inside `.toolbar-filters` the trigger adopts the shared field treatment; do not override its height there."

states:
  default: "Closed; the trigger shows the current value or the placeholder."
  empty: "No value; muted label via `date-picker-trigger-empty`."
  open: "Panel visible, entering on --duration-fast. The trigger keeps its pressed appearance while open."
  disabled: "Inherits `.btn-tertiary`'s disabled treatment; the panel cannot open."
  focus: "The trigger shows the standard focus ring. On open, focus moves into the calendar grid."

accessibility:
  roles: "The trigger is a real `<button>` with `aria-haspopup=\"dialog\"` and `aria-expanded`. The panel wraps the Calendar, which brings its own grid semantics."
  aria: ["aria-expanded on the trigger reflects the panel", "The trigger's accessible name states what date is being chosen, not just the value — 'Fecha de publicación, 17 de julio 2026'", "aria-hidden=true on the calendar icon"]
  focus: "Opening moves focus into the grid; choosing a date or pressing Escape returns focus to the trigger. Focus must never be lost to the body."
  contrast: "The empty-state label uses --text-muted, which meets AA for body text. The panel border meets 3:1 against the surface."
keyboard:
  - {keys: "Enter / Space", action: "opens the panel and moves focus into the calendar"}
  - {keys: "Escape", action: "closes the panel and returns focus to the trigger"}
  - {keys: "Arrows / PageUp / PageDown", action: "navigate within the calendar — see calendar.md"}
  - {keys: "Tab", action: "with the panel open, leaves it and closes it; the panel is not a focus trap"}
responsive:
  - "On mobile, dock the Calendar in a bottom Sheet rather than the floating panel — the 240px panel plus a month grid does not fit comfortably on a phone."
  - "The 240px trigger goes full-width inside a mobile filter sheet."
  - "Touch targets on the calendar days come from calendar.css; do not shrink them to fit."

ux_principles:
  - "Recognising a date on a grid beats recalling its format in a text field (Nielsen 6) — which is also why the trigger never shows an ISO string."
  - "Deferring the calendar behind a trigger keeps the form scannable; the grid appears only when it is the task (progressive disclosure)."
common_mistakes:
  - "Using it where the Calendar should be permanent, so the person opens and closes a panel for every choice."
  - "Showing '2026-07-17' on the trigger."
  - "Placing it near the bottom edge of the viewport, where the panel is clipped — there is no collision detection."
  - "Shipping the floating panel to mobile instead of a bottom Sheet."
  - "Adding a Confirm button inside the panel; choosing a date is the confirmation."
  - "Letting focus fall to the body when the panel closes."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "a grid to recognise a date, not a format to remember"}
  - {id: 3, name: "User control and freedom", note: "Escape closes and returns focus, with nothing committed"}
  - {id: 8, name: "Aesthetic and minimalist design", note: "the month grid stays out of the layout until it is needed"}

relationships:
  related: [calendar, select, form, toolbar, sheet-bottom]
  replaces: ["ad-hoc date inputs with no accessible calendar"]
  composed_with: [calendar, button, toolbar, form, sheet-bottom]
  not_to_confuse_with:
    - {component: calendar, why: "Calendar is the inline, always-visible grid for when date-picking is the main task; Date Picker docks that same grid behind a trigger"}
    - {component: select, why: "Select picks one value from a short fixed list; a date is a continuous range best chosen on a grid"}
    - {component: combobox, why: "combobox filters a list by typing; there is no list of dates to filter"}

tokens:
  color: [--color-surface, --border, --text-muted]
  radius: [--radius-lg]
  spacing: ["12px panel padding", "8px trigger gap", "240px trigger width"]
  shadow: [--shadow-md]
  typography: []

motion:
  enter: "The panel fades in and rises 4px on --duration-fast with --ease-default (`date-picker-in`)."
  exit: "Immediate. A closing overlay that lingers delays the next action."
  stateChange: "The trigger follows .btn-tertiary's state layer; no motion of its own."
  duration: "--duration-fast"
  easing: "--ease-default"
  reducedMotion: "Inherits the global rule in css/base.css — the transform and fade are suppressed and the panel appears immediately."
  constraints: "Do not scale the panel on entry, and do not animate the calendar's contents separately. One 4px rise for the whole panel."
  relatedPatterns: [overlay-enter]

source:
  css: css/components/date-picker.css
  classes: [date-picker, date-picker-trigger, date-picker-trigger-empty, date-picker-icon, date-picker-panel]
  docs_anchor: c-date-picker
---

## Correct usage

```html
<div class="date-picker">
  <button class="date-picker-trigger btn-tertiary" aria-haspopup="dialog" aria-expanded="false"
          aria-label="Fecha de publicación, 17 de julio 2026">
    <svg class="date-picker-icon" aria-hidden="true"><!-- lucide calendar --></svg>
    17 de julio, 2026
  </button>
  <div class="date-picker-panel" hidden><div class="calendar"><!-- … --></div></div>
</div>
```
*Why:* readable date, real button with the overlay contract, calendar docked rather than permanent.

## Incorrect usage

```html
<!-- ✕ ISO on the trigger, no expanded state, confirm inside the panel -->
<div class="date-picker">
  <button class="date-picker-trigger btn-tertiary">2026-07-17</button>
  <div class="date-picker-panel">
    <div class="calendar">…</div><button class="btn-primary">Aceptar</button>
  </div>
</div>
```
*Fix:* write the date out, add `aria-expanded`, and drop the confirm — picking the day closes the panel.
