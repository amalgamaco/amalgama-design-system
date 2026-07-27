---
id: calendar
display_name: Calendar
aliases: [date picker, datepicker, date range, month grid, date & time picker]
category: Input
status: stable
summary: A month-grid date/range picker with real month/year navigation — the base of the Date Picker, usable inline or docked in a popover, dialog, or sheet.
when_to_use:
  - "Choosing a date or a range with month context."
  - "Inline when the calendar must always be visible (booking panel, agenda)."
  - "As a form field → the Date Picker composition (trigger Button + popover)."
  - "With presets for frequent ranges (last 7/30 days, Hoy, Mañana)."
when_not_to_use:
  - "Choosing only a month/year → use Select."
  - "A far-off date typed by hand as the only path → add a native Input type=\"date\"."
  - "A time of day alone (no date) → use a time picker / native type=\"time\"."
use_cases:
  - "Fecha de cierre de una vacante (Date Picker in a form)."
  - "Rango de disponibilidad de un candidato (range mode)."
  - "Agendar una entrevista con fecha + hora (Date & Time Picker composition)."
  - "Mostrar días reservados en un panel de reservas (range + booked dates)."

variants:
  - {name: single,       class: "data-calendar",                  purpose: "Single-date selection (default)."}
  - {name: range,        class: "data-cal-mode=\"range\"",         purpose: "First click sets start, second sets end; middle span uses primary-container."}
  - {name: dropdown,     class: "data-cal-caption=\"dropdown\"",   purpose: "Month/year select caption to jump quickly (par shadcn captionLayout=dropdown)."}
  - {name: presets,      class: calendar-with-presets,            purpose: "Outline shortcut buttons below the grid (Hoy, Mañana, En 7 días…)."}
  - {name: booked,       class: "data-cal-booked=\"YYYY-MM-DD,…\"", purpose: "Non-selectable booked/unavailable days, struck through."}
  - {name: weeknumbers,  class: "data-cal-weeknumbers",           purpose: "Leading column with the ISO-8601 week number."}
  - {name: date-picker,  class: date-picker,                      purpose: "Docked composition: trigger Button + popover panel holding the Calendar; closes on select."}
  - {name: date-time,    class: calendar-time-row,                purpose: "Date & Time composition: a native <input type=\"time\"> row inside the picker panel."}
sizes:
  - {name: sm, class: calendar-sm, use: "compact density (28–30px cell)"}
  - {name: md, class: "(default)", use: "standard 32px cell (--cal-cell)"}
  - {name: lg, class: calendar-lg, use: "touch-friendly (44px cell)"}
size_selection: "Cell size is controlled by --cal-cell via .calendar-sm/-lg — use lg for touch, sm for dense desktop layouts."

content_rules:
  - "Month/day names come from Intl.DateTimeFormat (browser locale) — no locale library."
  - "For distant dates, also offer a native type=\"date\" input; navigating months by grid is tedious and less accessible."
layout_constraints:
  - "Consumes only semantic --color-* tokens; works in light + dark with no per-theme overrides."
  - "Presets render as outline buttons that wrap below the grid; booked days are inert."
  - "Presentation (inline / popover / dialog / sheet) is a composition of the same Calendar — not a separate component."

states:
  default: "Resting month grid; each day a real <button>."
  hover: "Non-selected, non-range day tints to --color-surface-variant."
  focus: "Day and nav buttons show a focus ring (--color-focus / --color-primary fallback)."
  selected: "Filled --color-primary with --color-on-primary text."
  today: "Reinforced with its own --color-surface-variant fill (not color alone)."
  range: "Endpoints use primary; the middle span (calendar-day-range-middle) uses a container fill."
  disabled: "calendar-day-disabled — dimmed (opacity .5), not selectable."
  booked: "calendar-day-booked — struck through, aria-disabled, not selectable."

accessibility:
  roles: "Each day is a real <button>; nav arrows and month/year selects carry their own aria-labels. Booked days are aria-disabled; week numbers are aria-hidden."
  aria: ["aria-label on prev/next ('Mes anterior/siguiente')", "aria-label on month/year selects", "aria-disabled=true on booked days", "aria-hidden on week-number cells"]
  focus: "Tab reaches each day; Enter/Space selects. Date Picker popover: focus enters the panel on open and returns to the trigger on select/close; Esc closes."
  contrast: "State never relies on color alone — selected = primary fill + on-primary text (AA), today reinforced with its own fill. AA in light + dark, no per-theme override."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "move focus across days and controls"}
  - {keys: "Enter / Space", action: "select the focused day or activate a control"}
  - {keys: "Escape", action: "close the Date Picker popover (composition)"}
responsive:
  - "On mobile, present the Calendar in a bottom Sheet (full-width, more tappable) rather than a small popover."
  - "Use calendar-lg for a comfortable touch target on coarse pointers."

ux_principles:
  - "Pick the presentation for the context: inline when date-picking is the main task, popover as the form default, dialog when it needs full focus, sheet on mobile."
  - "Offer keyboard date entry for far-off dates — grid navigation alone is slow and less accessible."
common_mistakes:
  - "Using a full Calendar just to pick a month/year (use Select)."
  - "Making booked/disabled days look selectable."
  - "Relying on color alone to mark selected/today."
  - "No keyboard entry path for distant dates."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "month context + presets surface valid dates instead of forcing recall"}
  - {id: 5, name: "Error prevention", note: "booked/disabled days can't be selected; range enforces start-then-end"}
  - {id: 3, name: "User control and freedom", note: "Esc closes the popover; presets and manual entry give alternatives"}
  - {id: 7, name: "Flexibility and efficiency of use", note: "presets and month/year dropdown speed up frequent choices"}

relationships:
  related: [select, form, popover, dialog, sheet]
  replaces: ["ad-hoc date pickers without an accessible grid"]
  composed_with: [popover, dialog, sheet, button, form, input]
  not_to_confuse_with:
    - {component: select, why: "Select picks month/year or a bounded option; Calendar picks a specific day/range"}
    - {component: popover, why: "Popover is the container; the Date Picker is Calendar docked inside one"}

tokens:
  color: [--color-surface, --border, --color-on-surface, --color-primary, --color-on-primary, --color-primary-container, --color-surface-variant, --color-secondary-container, --color-on-secondary-container, --color-focus, --text-muted]
  radius: [--radius-lg]
  typography: [--font-body, --font-size-body-md]
  spacing: ["--cal-cell (32px default; sm/lg override)", "12px panel padding"]

motion:
  enter: "none — the calendar grid renders in place. When shown inside a Date Picker the popover's entrance/exit is governed by date-picker.css, not calendar.css."
  exit: "none (see enter — popover presentation lives in date-picker.css)."
  stateChange: "Day cells and nav buttons transition background-color on hover (transition: background-color .15s var(--ease-default, ease)); preset buttons transition background + border-color on the same timing. Month/year navigation is an instant JS re-render of the grid — no CSS transition. Selected/today/range states apply instantly via class swaps."
  duration: "hardcoded .15s on .calendar-day, .calendar-nav-btn and .calendar-preset-btn — NOT --duration-* tokens; should be --duration-fast"
  easing: "--ease-default (with an `ease` literal fallback)"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). Hover tints apply instantly; the month re-render is already instant, so navigation and selection stay fully legible."
  constraints: "Hover feedback is background-color/border only (effect → Standard easing) — correct. Do NOT animate the month change: it is a full grid re-render and animating it would be layout thrash. Selection and range states are instant class swaps by design. Replace the hardcoded .15s values with --duration-fast to satisfy the no-raw-ms rule (GOVERNANCE §13.3)."
  relatedPatterns: ["Feedback — day/nav hover confirms the target (effect on Standard easing)", "Visibility of system status — today/selected/range states (color, not motion)", "Date Picker popover entrance belongs to date-picker.css (Popover/Dialog/Sheet presentation)"]

source:
  css: css/components/calendar.css
  classes: [calendar, calendar-sm, calendar-lg, calendar-header, calendar-caption, calendar-caption-dropdowns, calendar-caption-select, calendar-nav-btn, calendar-weekdays, calendar-grid, calendar-day, calendar-day-outside, calendar-day-today, calendar-day-selected, calendar-day-disabled, calendar-day-range-middle, calendar-day-range-start, calendar-day-range-end, calendar-day-booked, calendar-weeknum, calendar-with-presets, calendar-presets, calendar-preset-btn, calendar-time-row, date-picker, date-picker-trigger, date-picker-panel]
  react_wrapper: components/ui/calendar.tsx
  docs_anchor: c-calendar
---

## Correct usage

```html
<!-- Inline calendar (renders itself; current month or YYYY-MM) -->
<div class="calendar" data-calendar="2026-07"></div>
```
*Why:* inline when picking a date is the main task on the screen.

```html
<!-- Date Picker: form default — trigger + popover, closes on select -->
<div class="date-picker">
  <button class="date-picker-trigger btn-tertiary" onclick="toggleDatePicker(this)">📅 Elegir fecha</button>
  <div class="date-picker-panel" hidden>
    <div class="calendar" data-calendar data-cal-caption="dropdown"></div>
  </div>
</div>
```
*Why:* docked popover doesn't take permanent layout space; month/year dropdown speeds far jumps.

```html
<!-- Range + booked dates for availability -->
<div class="calendar" data-calendar data-cal-mode="range" data-cal-booked="2026-07-21,2026-07-22"></div>
```

## Incorrect usage

```html
<!-- ✕ A whole Calendar just to choose a month -->
<div class="calendar" data-calendar></div>
```
*Fix:* if only month/year is needed, use a Select.

```html
<!-- ✕ Booked days styled as if selectable -->
<button class="calendar-day">21</button>
```
*Fix:* mark unavailable days with `data-cal-booked` (struck through + aria-disabled).
