---
id: empty-state
display_name: Empty State
aliases: [empty, no data, zero state, blank slate]
category: Feedback
status: stable
summary: A centered icon + message (+ optional primary action) shown when there is no content to display — always offering a clear way out, not just a message.
when_to_use:
  - "A list, table, or view has no records available."
  - "First-run experiences where the user hasn't created content yet."
  - "Search/filter results with no matches."
when_not_to_use:
  - "Content is still loading → use Skeleton."
  - "A feature is under construction → use Placeholder."
  - "A system error occurred → use an error state / Alert with a specific message."
use_cases:
  - "'Sin vacantes' with a 'Crear vacante' CTA on first run."
  - "'Sin resultados' after a filter, with a 'Limpiar filtros' CTA."
  - "An empty candidate pipeline column."

variants:
  - {name: base, class: empty-state, purpose: "Centered icon (48px) + title + description + optional primary Button, dimmed with secondary/muted text tokens."}
sizes:
  - {name: default, class: "(default)", use: "single layout: 48px 24px padding, 400px max-width description"}
size_selection: "One layout. Scale it by dropping the CTA for minor/expected empties, or keeping it for first-run guidance."

content_rules:
  - "Write from the user's point of view ('No tenés vacantes aún'), not technical jargon ('null results', '404')."
  - "Title is short (Epilogue, weight 600); description is one or two sentences, max ~400px wide."
  - "Include a CTA that helps the user leave the empty state whenever there is a next action."
  - "Use an icon/illustration that reinforces the message without being condescending."
layout_constraints:
  - "Content is centered; title uses --text-secondary, description uses --text-muted."
  - "The CTA is a single primary Button (its own states apply)."

states:
  default: "Static, centered layout — the empty state defines no hover/focus/active of its own; only the CTA (Button) is interactive."

accessibility:
  roles: "A content region in the natural reading flow; the title should be a heading at the level that fits the page outline."
  aria: ["aria-live=\"polite\" on the region when it appears after a search (announce the no-results outcome)", "descriptive label on the CTA (not 'Click aquí')"]
  focus: "The empty state itself is not focusable; the only focus stop is the CTA, which inherits Button's visible focus ring."
  contrast: "--text-secondary / --text-muted meet AA in light + dark — never write per-theme overrides."

ux_principles:
  - "An empty state is an opportunity to guide, not a dead end — always offer a route forward (user control and freedom)."
  - "Set expectations: explain why it's empty and what will fill it."
common_mistakes:
  - "Showing blank space with no message or action."
  - "Technical/error copy without context."
  - "No clear next step for the user."
  - "Using it for loading (should be Skeleton) or errors (should be an error state)."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "confirms there is genuinely nothing here, not a broken screen"}
  - {id: 10, name: "Help and documentation", note: "guides the user toward the action that creates content"}
  - {id: 9, name: "Help users recognize/recover", note: "plain-language message plus a way out"}

relationships:
  related: [skeleton, alert, button, placeholder]
  replaces: ["stray 'no hay datos' text"]
  composed_with: [button, table, list, card, search]
  not_to_confuse_with:
    - {component: skeleton, why: "Skeleton = data loading; Empty State = no data exists"}
    - {component: alert, why: "Alert = inline error/warning message; Empty State = no-content placeholder"}
    - {component: placeholder, why: "Placeholder = feature under construction; Empty State = feature works but has no data"}

tokens:
  color: [--text-secondary, --text-muted]
  typography: [--font-heading, --font-size-heading-md, --font-size-body-lg]
  spacing: ["48px 24px container padding", "400px max description width"]

source:
  css: css/components/empty-state.css
  classes: [empty-state, empty-state-icon, empty-state-title, empty-state-desc]
  react_wrapper: components/ui/empty-state.tsx
  docs_anchor: c-empty
---

## Correct usage

```html
<!-- First-run empty with a guiding CTA -->
<div class="empty-state">
  <div class="empty-state-icon" aria-hidden="true">📋</div>
  <div class="empty-state-title">Sin vacantes</div>
  <p class="empty-state-desc">Todavía no creaste ninguna vacante. Creá la primera para empezar a recibir candidatos.</p>
  <button class="btn-primary" type="button">Crear vacante</button>
</div>
```
*Why:* user-facing copy + a clear route out of the empty state.

```html
<!-- No-results after a filter, announced politely -->
<div class="empty-state" aria-live="polite">
  <div class="empty-state-icon" aria-hidden="true">🔍</div>
  <div class="empty-state-title">Sin resultados</div>
  <p class="empty-state-desc">No encontramos vacantes con esos filtros.</p>
  <button class="btn-primary btn-sm" type="button">Limpiar filtros</button>
</div>
```

## Incorrect usage

```html
<!-- ✕ Empty state used for a loading region -->
<div class="empty-state"><div class="empty-state-title">Cargando…</div></div>
```
*Fix:* use Skeleton while data loads.

```html
<!-- ✕ Technical copy, no way out -->
<div class="empty-state"><div class="empty-state-title">null results (404)</div></div>
```
*Fix:* write plain-language copy and add a CTA.
