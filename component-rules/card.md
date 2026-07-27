---
id: card
display_name: Full Card
aliases: [card, panel, content card, basic card panel]
category: Data display / Containment
status: stable
summary: A rich content panel that groups content and actions about a single subject on a surface.

when_to_use:
  - "Grouping content + actions about one subject on a surface (header, body, footer)."
  - "A grid or list of comparable entities (vacancies, sections) that each need a title, description, and optional action."
  - "A self-contained block that may be static or interactive — the action button signals which."
when_not_to_use:
  - "A compact single-row entity (icon/avatar + text + action) → use Basic Card (item)."
  - "A single numeric KPI/metric with a trend → use Stat Card."
  - "A person or vacancy entity → use its specialized card (person-card / vacancy-card)."
  - "Tabular records with comparable columns → use Table."
use_cases:
  - "Vacancy summary card in a results grid ('Diseñadora UX Senior' + estado + 'Ver vacante')."
  - "Settings panel with a title, description, and a trailing action in the header."
  - "A dashboard section wrapper grouping related content."

variants:
  - {name: outlined, class: card, purpose: "Default: surface + 1px border, no elevation."}
  - {name: elevated, class: card-elevated, purpose: "surface-container-low + shadow-sm, no border — lifts off a busy background."}
  - {name: filled,   class: card-filled,   purpose: "surface-container-highest tonal fill, no border and no shadow."}
sizes:
  - {name: default, class: "(default)", use: "single size; width follows its container in a grid/list"}
size_selection: "Cards do not scale by a size class; density comes from the grid/collection they sit in and the content inside."

content_rules:
  - "Optional category/tag: max 2 words."
  - "card-title is the entity name (headline); card-desc is short supporting text (~10 words)."
  - "Show a footer action ONLY when the card navigates or has an explicit action — one primary action per card."
  - "Icon-only buttons in card-action / card-footer need aria-label; decorative icons get aria-hidden."
layout_constraints:
  - "Only the container is required; card-header/-content/-footer/-action are all optional — compose only what you need."
  - "card-action anchors top-right of the header (reserves a second grid column)."
  - "Filter/sort controls live OUTSIDE the collection and apply to all cards — never inside a single card."
  - "Keep a collection homogeneous: don't mix interactive and static cards without a clear differentiation."

states:
  default: "Resting surface per variant (outlined/elevated/filled)."
  hover: "Interactive card raises its shadow via --shadow-* on hover, without changing color."
  focus: "Interactive card shows a visible focus ring (outline 2px --color-focus + offset); static card is not focusable."
  disabled: "Not a built-in state — an interactive card gates via its root <a>/<button>."

accessibility:
  roles: "A fully clickable card is an <a> or <button> root with a descriptive aria-label — never a <div onclick>."
  aria: ["aria-label on a clickable card root", "aria-hidden on decorative icons", "aria-label on icon-only header/footer buttons"]
  focus: "Static variant must not receive focus (pointer-events:none; tabindex=-1); interactive variant has a visible focus ring."
  contrast: "Semantic tokens (--color-surface-container, --color-on-surface) guarantee AA in light + dark; never override colors per theme."
keyboard:
  - {keys: "Tab", action: "focus a clickable card / its footer actions"}
  - {keys: "Enter / Space", action: "activate a clickable card root or a focused action"}
responsive:
  - "The grid reflows by breakpoint from multiple columns to one, preserving each card's aspect and spacing."
  - "Card width adapts to its container; internal content hierarchy does not change when scaling."

ux_principles:
  - "One card = one subject; keeps content scannable (chunking / law of proximity)."
  - "A single primary action per card keeps hierarchy clear."
common_mistakes:
  - "Putting a single metric in a Card instead of a Stat Card."
  - "Wrapping a clickable card in <div onclick> (not keyboard/SR accessible)."
  - "Two competing primary actions in one card footer."
  - "Placing filter/sort controls inside a card instead of above the collection."
nielsen_heuristics:
  - {id: 4, name: "Consistency and standards", note: "cards in a collection share one resting elevation and layout"}
  - {id: 8, name: "Aesthetic and minimalist design", note: "only the parts you need; container is the sole required element"}
  - {id: 6, name: "Recognition rather than recall", note: "title + description make each entity recognizable at a glance"}

relationships:
  related: [item, stat-card, vacancy-card, person-card]
  replaces: ["legacy bordered/shadowed boxes and panels"]
  composed_with: [button, badge, chip, accordion, carousel]
  not_to_confuse_with:
    - {component: item, why: "Basic Card (item) is a compact row primitive; Full Card is a rich multi-part panel"}
    - {component: stat-card, why: "Stat Card shows a single KPI; Full Card groups general content"}
    - {component: vacancy-card, why: "specialized domain card; Full Card is generic"}

tokens:
  color: [--card-bg, --border, --color-surface-container-low, --color-surface-container-highest, --text-primary, --text-secondary]
  radius: [--radius]
  spacing: ["16px 20px container padding", "12px header gap", "16px footer offset"]
  elevation: [--shadow-sm]

motion:
  enter: "none — a static container with no CSS entrance"
  exit: "none"
  stateChange: "none — Card declares no transition. The three variants (.card outlined, .card-elevated shadow, .card-filled) are fixed at rest; there is no hover lift or shadow-grow."
  duration: "none (no transition declared)"
  easing: "none (no transition declared)"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). The component defines no motion of its own, so nothing extra to reduce."
  constraints: "Card is a static surface — do not add a hover lift or shadow-grow (that is Button/Elevated behavior, GOVERNANCE §9; elevation is a fixed rest state here). If the card must be clickable, use Basic Card (item.css), which carries the interactive background/border state transition."
  relatedPatterns: ["motion.md → Motion has a purpose (a static surface needs no motion)", "component-rules/item.md → motion (interactive-row state transition)"]

source:
  css: css/components/card.css
  classes: [card, card-elevated, card-filled, card-header, card-title, card-desc, card-content, card-footer, card-action]
  react_wrapper: components/ui/card.tsx
  docs_anchor: c-basic-card
---

## Correct usage

```html
<!-- Vacancy summary card in a results grid: title, category, description, one primary action -->
<div class="card">
  <div class="card-header">
    <div class="card-title">Diseñadora UX Senior</div>
    <div class="card-desc">Amalgama · Buenos Aires</div>
  </div>
  <div class="card-content">Buscamos una Diseñadora UX con experiencia en sistemas de diseño y productos B2B.</div>
  <div class="card-footer">
    <button class="btn-primary btn-sm" type="button">Ver vacante</button>
    <button class="btn-text btn-sm" type="button">Guardar</button>
  </div>
</div>
```
*Why:* one subject per card, one primary action, container + optional parts composed cleanly.

```html
<!-- Header with a trailing action slot -->
<div class="card">
  <div class="card-header">
    <div class="card-title">Notificaciones</div>
    <div class="card-desc">Preferencias de aviso.</div>
    <div class="card-action">
      <button class="icon-btn btn-sm" aria-label="Más opciones"><i data-lucide="more-vertical"></i></button>
    </div>
  </div>
</div>
```
*Why:* card-action anchors top-right; icon-only button carries an accessible name.

## Incorrect usage

```html
<!-- ✕ A single metric shoehorned into a Card -->
<div class="card"><div class="card-title">24</div><div class="card-desc">Vacantes abiertas</div></div>
```
*Fix:* use a `stat-card` with `stat-label` / `stat-value` / `stat-change`.

```html
<!-- ✕ Clickable card as a non-semantic div -->
<div class="card" onclick="location='/vacante/1'">…</div>
```
*Fix:* make the root an `<a class="card">` (or `<button>`) with a descriptive `aria-label`.
