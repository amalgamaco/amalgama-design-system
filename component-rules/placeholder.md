---
id: placeholder
display_name: Placeholder Panel
aliases: [panel vacío, "selecciona…", próximamente, coming soon]
category: Feedback
status: stable
summary: A centred panel that fills a region which has nothing to show *yet in this session* — nothing selected, a feature not built. Never for a list that returned no data.

when_to_use:
  - "The detail pane of a master-detail layout before the user has selected anything ('Seleccioná una vacante para ver los detalles')."
  - "A section or tab that exists in the navigation but is not built yet ('Próximamente')."
  - "Any region whose emptiness is the normal resting state, not a result."
when_not_to_use:
  - "A list, table or collection that ran and returned zero rows → Empty State. This is the single most common mistake with this component."
  - "A search that found nothing → Empty State (no-results variant)."
  - "An error, or a permission problem → Alert, or Empty State's error variant."
  - "Content still loading → Skeleton."
use_cases:
  - "Right-hand pane of a candidates screen before a candidate is clicked."
  - "A 'Reportes' tab shipped in the nav ahead of the feature."

variants:
  - {name: default, class: placeholder-panel, purpose: "The only variant — bordered card surface, centred text, muted colour."}
sizes:
  - {name: md, class: "(default)", use: "the only size; 48px 32px padding, --font-size-body-lg. It fills the region it is given."}
size_selection: "Single size by design. It stretches to its container rather than scaling."

content_rules:
  - "One sentence, and it says what to DO, not what is absent. 'Seleccioná una vacante para ver los detalles' — never 'Sin datos'."
  - "An optional leading icon (`.placeholder-icon`) sized 32px. **Lucide SVG, never an emoji** — the emoji in this component's CSS header is an illustration of the markup, not a licence to ship one."
  - "No action button. If the region needs an action to become useful, it is an Empty State, not a placeholder."
layout_constraints:
  - "Centred text on a card surface with a 1px border and the standard radius."
  - "Fills its region; it is not centred in the viewport."
  - "Colour is --text-muted throughout — this panel must never compete with real content."

states:
  default: "The only state. The panel does not react to hover, focus or click — it is a passive region filler."

accessibility:
  roles: "Plain container; non-interactive. Nothing inside it is focusable."
  aria: ["The decorative icon carries aria-hidden=true", "If the panel replaces content that changes on selection, the live region belongs to the pane wrapper, not to this panel"]
  focus: "Not focusable. Do not add tabindex."
  contrast: "--text-muted on --card-bg meets AA for body text in both themes."
keyboard:
  - {keys: "(none)", action: "non-interactive by design"}
responsive:
  - "Padding stays; the panel narrows with its region. On mobile a master-detail layout usually navigates to the detail instead of showing this panel — check the responsive pattern before shipping it to a phone."

ux_principles:
  - "An empty region with no explanation reads as a bug. One sentence turns it into an understood state (Nielsen 1)."
  - "Saying what to do next beats naming the absence — the person came to accomplish something, not to be told nothing is there."
common_mistakes:
  - "Using it for a list that returned no rows. That is an Empty State — the difference is whether something ran."
  - "Shipping the emoji from the CSS header's example as the icon. Icons are Lucide SVG."
  - "Adding a button to it. A placeholder with an action is an Empty State wearing the wrong class."
  - "Writing 'Sin datos' or 'No hay nada' instead of the instruction."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "explains why the region is empty instead of leaving it blank"}
  - {id: 2, name: "Match with the real world", note: "speaks in the task's terms ('seleccioná una vacante'), not the database's"}

relationships:
  related: [empty-state, skeleton, alert]
  replaces: ["loose 'próximamente' text", "blank detail panes"]
  composed_with: [card, sheet-side]
  not_to_confuse_with:
    - {component: empty-state, why: "empty-state is the result of a query that returned nothing and usually offers an action; placeholder is a region that was never going to have content yet"}
    - {component: skeleton, why: "skeleton means content is coming in milliseconds; placeholder means nothing is coming until the user acts"}
    - {component: alert, why: "alert reports a problem; a placeholder reports a normal resting state"}

tokens:
  color: [--card-bg, --border, --text-muted]
  radius: [--radius]
  spacing: ["48px 32px padding", "12px icon margin"]
  typography: [--font-size-body-lg]

motion:
  enter: "none — it is the resting state of the region, not an event."
  exit: "none. When real content replaces it, the content's own entrance carries the transition."
  stateChange: "none; the panel has no states."
  duration: "n/a"
  easing: "n/a"
  reducedMotion: "Nothing to reduce; inherits the global rule in css/base.css."
  constraints: "Do not animate it in. A fading placeholder reads as loading, which is the opposite of what it means."
  relatedPatterns: []

source:
  css: css/components/placeholder.css
  classes: [placeholder-panel, placeholder-icon]
  docs_anchor: c-placeholder
---

## Correct usage

```html
<!-- Detail pane before anything is selected -->
<div class="placeholder-panel">
  <svg class="placeholder-icon" aria-hidden="true" width="32" height="32"><!-- lucide --></svg>
  <p>Seleccioná una vacante para ver los detalles.</p>
</div>
```
*Why:* the region's normal resting state, and the copy says what to do.

## Incorrect usage

```html
<!-- ✕ Used for a filter that returned nothing -->
<div class="placeholder-panel"><p>No se encontraron resultados.</p></div>
```
*Fix:* a query ran and returned zero — that is `empty-state` (no-results), which can also offer to clear the filter.

```html
<!-- ✕ Emoji as the icon, and an action button -->
<div class="placeholder-panel">
  <div class="placeholder-icon">📋</div>
  <p>Nada por acá.</p><button class="btn-primary">Crear</button>
</div>
```
*Fix:* Lucide SVG, copy that instructs, and if it needs an action it is an `empty-state`.
