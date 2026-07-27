---
id: vacancy-card
display_name: Vacancy Card
aliases: [job card, vacante card, position card]
category: Domain cards
status: stable
summary: A domain card summarizing a job vacancy — icon, title, status badge, meta, optional stats and assignees — used as a list unit that navigates to the detail.
when_to_use:
  - "Representing vacancies in recruiting lists, pipelines, and dashboards."
  - "Showing a vacancy's status, priority, and key metrics compactly."
  - "As a navigation unit toward the vacancy detail view."
when_not_to_use:
  - "The full vacancy detail → use a dedicated detail view, not the card."
  - "A person/candidate → use Person Card."
  - "A non-recruiting domain → use the generic Full Card."
  - "Tabular comparison across many vacancies → use a Table / Data Table."
use_cases:
  - "Lista de vacantes abiertas con estado, departamento y antigüedad."
  - "Dashboard de reclutamiento con métricas por vacante y asignados."
variants:
  - {name: card, class: vacancy-card, purpose: "The vacancy row/card container (icon + info + right meta)."}
  - {name: icon, class: vacancy-icon, purpose: "Leading square icon tile (secondary-container tint)."}
  - {name: stats, class: vacancy-stats, purpose: "Optional row of stat-pills (counts) below the meta."}
  - {name: assignees, class: assignee, purpose: "Optional assigned recruiters with tonal assignee-avatar chips."}
  - {name: age, class: vacancy-age, purpose: "Trailing mono age indicator ('3d')."}
  - {name: more, class: more-btn, purpose: "Trailing overflow action button (needs its own label)."}
sizes:
  - {name: default, class: "(default)", use: "single density; padding 16px 20px, list gap 8px"}
size_selection: "Single density by design; group cards in .vacancies-list. Keep density consistent across all cards in a view."
content_rules:
  - "Always show: job title, department, status (badge) and date/age."
  - "Include an urgency/priority indicator only when it drives a decision."
  - "Keep visible attributes to ~6–7 max; don't overload the card."
  - "Never show sensitive process data (salary, internal notes) in the list card."
layout_constraints:
  - "Icon left, info (flex:1) center, right column (age/more) trailing."
  - "Meta items separated by .meta-dot; wraps rather than truncating mid-label."
states:
  default: "Resting outlined card; fade-slide-in on mount."
  hover: "Border → --color-outline-variant, shadow-md, lifts 1px (interactive)."
  focus: "Needs tabindex=0; :focus-visible = 2px --color-focus + 4px --color-focus-ring."
accessibility:
  roles: "The card is a clickable <div> — add tabindex=\"0\" and role=\"button\" (or use an <a>) so it's focusable and announced."
  aria: ['tabindex="0" on the interactive card', 'descriptive aria-label ("Ver vacante: Senior Designer")', 'aria-label="Más acciones" on more-btn']
  focus: "Keyboard-focusable, Enter/Space activates; more-btn is a separate focus stop, not nested inside the navigation element."
  contrast: "--text-primary/-secondary/-muted meet AA in light + dark; status communicated by the badge text, not color alone."
keyboard:
  - {keys: "Tab", action: "focus the card and the more-btn separately"}
  - {keys: "Enter / Space", action: "open the vacancy detail"}
responsive:
  - "Meta wraps on narrow widths; keep the whole card a ≥44px touch target."
ux_principles:
  - "Consistent card density lets recruiters scan a pipeline quickly (visual hierarchy)."
  - "Status as a badge (text + color) keeps the state legible for everyone."
common_mistakes:
  - "Overloading the card with more than 6–7 attributes."
  - "Showing salary / internal notes on the list card."
  - "Clickable card with no tabindex / accessible name."
  - "Nesting more-btn inside the navigation link (double activation)."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "status badge + age show the vacancy's state at a glance"}
  - {id: 8, name: "Aesthetic and minimalist design", note: "only the decision-relevant attributes on the list card"}
  - {id: 6, name: "Recognition rather than recall", note: "title/department/status shown, not remembered"}
relationships:
  related: [item, card, kanban-card, badge]
  replaces: ["custom vacancy rows/cards"]
  composed_with: [badge, avatar, button]
  not_to_confuse_with:
    - {component: person-card, why: "Person Card is for people/candidates; Vacancy Card is for jobs"}
    - {component: kanban-card, why: "Kanban Card is a board tile in a column; Vacancy Card is a list row"}
    - {component: card, why: "Full Card is generic; Vacancy Card is the recruiting-domain unit"}
tokens:
  color: [--card-bg, --border, --color-secondary-container, --text-primary, --text-muted]
  radius: [--radius, --radius-md]
  shadow: [--shadow-md]
  motion: [--duration-fast]
source:
  css: css/components/vacancy-card.css
  classes: [vacancies-list, vacancy-card, vacancy-icon, vacancy-info, vacancy-name, vacancy-meta, meta-dot, vacancy-stats, stat-pill, assignee, assignee-avatar, vacancy-right, vacancy-age, more-btn]
  react_wrapper: null
  docs_anchor: c-vacancy
---

## Correct usage

```html
<!-- Vacancy list item: focusable, labelled, status as a badge -->
<div class="vacancies-list">
  <div class="vacancy-card" tabindex="0" role="button" aria-label="Ver vacante: Desarrollador Frontend">
    <div class="vacancy-icon">💼</div>
    <div class="vacancy-info">
      <div class="vacancy-name">Desarrollador Frontend <span class="badge badge-open">Abierta</span></div>
      <div class="vacancy-meta">Tecnología <span class="meta-dot"></span> Remoto</div>
    </div>
    <div class="vacancy-right"><div class="vacancy-age">3d</div></div>
  </div>
</div>
```
*Why:* keyboard-focusable card, accessible name, status shown as a badge (text + color).

## Incorrect usage

```html
<!-- ✕ Clickable card with no focus/name, salary exposed -->
<div class="vacancy-card" onclick="open()">
  <div class="vacancy-info"><div class="vacancy-name">Frontend — $3.500 USD</div></div>
</div>
```
*Fix:* add `tabindex="0"` + `aria-label`; move salary/internal data off the list card.

```html
<!-- ✕ more-btn nested inside the navigation element -->
<a class="vacancy-card" href="/vacante/12"><button class="more-btn">⋮</button></a>
```
*Fix:* keep more-btn as a sibling focus stop with its own label ("Más acciones"), not inside the link.
