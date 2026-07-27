---
id: badge
display_name: Badge
aliases: [tag, status pill, label, count]
category: Display
status: stable
summary: A read-only pill communicating an item's status, category, or a count — each color carries a fixed meaning; never interactive.

when_to_use:
  - "Showing a record's read-only status (abierta, activa, cerrada, en progreso)."
  - "Category or section labels in lists of candidates, vacancies, or tasks (the label modifier)."
  - "A numeric count on a nav item or icon (e.g. unread notifications)."
  - "Any coloured categorical label — a categorical label must always be a Badge, never plain coloured text."
when_not_to_use:
  - "Filterable or clickable status → use Chip (interactive)."
  - "An action → use Button."
  - "Long text or a status with an extended description → use a callout or Tooltip."
use_cases:
  - "Vacancy status next to a job title: 'Abierta'."
  - "Section label: 'Components · Actions' (label modifier, monospaced)."
  - "In-progress state with a leading spinner: 'Procesando'."
  - "Version/changelog link rendered as an <a class=\"badge\">."

variants:
  - {name: open,     class: badge-open,     purpose: "Green — vacancy open / available (success-container)."}
  - {name: active,   class: badge-active,   purpose: "Process active / in progress (secondary-container — distinct from open so 'abierta' and 'activa' don't read alike)."}
  - {name: closed,   class: badge-closed,   purpose: "Red — closed / finished (error-container)."}
  - {name: draft,    class: badge-draft,    purpose: "Grey + border — draft / unpublished (surface-variant + outline)."}
  - {name: archived, class: badge-archived, purpose: "Soft grey — archived / inactive (surface-variant @ 75% opacity)."}
  - {name: warning,  class: badge-warning,  purpose: "Amber — pending / needs attention (warning-container)."}
  - {name: tertiary, class: badge-tertiary, purpose: "Violet — new / highlighted (tertiary-container)."}
  - {name: info,     class: badge-info,     purpose: "Blue — informational / category / version (info-container)."}
  - {name: label,    class: badge-label,    purpose: "Modifier — monospaced uppercase category/section label; combine with any variant."}
sizes:
  - {name: md, class: "(default)", use: "the only size; padding 4px 10px, --font-size-badge. Badges do not scale by size."}
size_selection: "Single size by design. A count is abbreviated (99+) rather than widening the pill."

content_rules:
  - "1–3 words or a number; sentence case, one line, white-space: nowrap."
  - "Never plain coloured text for a categorical label — use a Badge."
  - "A leading SVG (12px) or spinner may reinforce the meaning; the label text is always present."
  - "Numeric counts are abbreviated (99+) to preserve the pill width."
layout_constraints:
  - "Colour comes from a container / on-container token pair per variant — never raw hex."
  - "Pill shape (--radius-full), compact padding, single line."
  - "Status/category badges sit inline beside the record name; count badges anchor to the trailing-top of the icon/nav item."
  - "Don't stack multiple badges on one element; keep to 3–4 distinct colours per view."

states:
  default: "Read-only resting; the component defines no hover, focus, or active for the base span."
  link: "Exception: an <a class=\"badge\"> is focusable and shows a 2px --color-focus ring on focus-visible; hover dims opacity."

accessibility:
  roles: "Non-interactive <span> — no click handlers, no tabindex. Exception: an <a class=\"badge\"> link is focusable. A leading spinner carries role=status + aria-label."
  aria: ["aria-label on numeric badges (e.g. '3 notificaciones nuevas')", "aria-live=polite when the badge changes dynamically", "role=status + aria-label on a leading spinner"]
  focus: "The status badge is not focusable; only the link variant receives a focus ring."
  contrast: "AA in both themes — light: pale -container fill + dark -900 text; dark: subtle tint of the colour over surface + light on-container text (~8:1)."
keyboard:
  - {keys: "(none)", action: "the base badge is non-interactive; only the link variant is keyboard-reachable via Tab/Enter"}
responsive:
  - "Single line, nowrap; abbreviate counts rather than wrapping."

ux_principles:
  - "Fixed colour-to-meaning mapping lets users learn the vocabulary once and recognize it everywhere (consistency)."
  - "Never encode status by colour alone — the label text always states the meaning (accessibility)."
common_mistakes:
  - "Making a badge interactive (click/filter) — that's a Chip."
  - "Using plain coloured text instead of a Badge for a categorical label."
  - "Stuffing long text into a badge (it's 1–3 words)."
  - "Adding tabindex or click handlers to the read-only span."
  - "Relying on colour alone to convey the status."
nielsen_heuristics:
  - {id: 4, name: "Consistency and standards", note: "each colour has one fixed meaning across the product"}
  - {id: 1, name: "Visibility of system status", note: "surfaces a record's state at a glance"}
  - {id: 6, name: "Recognition rather than recall", note: "learned colour vocabulary is recognized, not memorized per screen"}

relationships:
  related: [chip, alert, stat-card]
  replaces: ["plain coloured text labels", "custom pills / legacy tags"]
  composed_with: [table, card, item, list, topbar]
  not_to_confuse_with:
    - {component: chip, why: "chips are interactive (filter/select/remove); a badge is read-only status"}
    - {component: button, why: "buttons act; a badge only informs"}
    - {component: alert, why: "alert is a persistent inline message block; a badge is a compact status pill"}

tokens:
  color: [--color-success-container, --color-on-success-container, --color-secondary-container, --color-on-secondary-container, --color-error-container, --color-on-error-container, --color-warning-container, --color-tertiary-container, --color-info-container, --color-surface-variant, --color-outline]
  radius: [--radius-full]
  spacing: ["4px 10px padding"]
  typography: [--font-size-badge, --font-mono]

source:
  css: css/components/badge.css
  classes: [badge, badge-open, badge-active, badge-closed, badge-draft, badge-archived, badge-warning, badge-tertiary, badge-info, badge-label, badge-link]
  react_wrapper: components/ui/badge.tsx
  docs_anchor: c-badge
---

## Correct usage

```html
<!-- Read-only status next to a record name -->
<div style="display:flex;align-items:center;gap:8px;font-weight:600">
  Diseñador UX <span class="badge badge-open">Abierta</span>
</div>
```
*Why:* read-only status, fixed green = open, label text present (not colour alone).

```html
<!-- Monospaced category label -->
<span class="badge badge-info badge-label">Components · Actions</span>
```
*Why:* categorical label as a badge, not plain coloured text.

```html
<!-- Numeric count with an accessible name -->
<span class="badge badge-closed" aria-label="3 procesos cerrados">3</span>
```
*Why:* the count is announced meaningfully to screen readers.

## Incorrect usage

```html
<!-- ✕ Badge made clickable to filter -->
<span class="badge badge-open" tabindex="0" onclick="filter('open')">Abiertas</span>
```
*Fix:* an interactive filter is a Chip (`chip chip-selected`), not a badge.

```html
<!-- ✕ Plain coloured text instead of a badge -->
<span style="color:green">Abierta</span>
```
*Fix:* use `badge badge-open` — every categorical label is a badge, tokens not hex.
