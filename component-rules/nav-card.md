---
id: nav-card
display_name: Nav Card
aliases: [navigation card, section card, docs card]
category: Docs shell (not a product component)
status: stable
summary: A documentation-shell-only navigation card that links into sections of the docs site — NOT part of the consumable library.
when_to_use:
  - "Inside the documentation site only — cards that navigate to sections (foundations, styles, component overviews)."
  - "Grids of categories and shortcuts to anchors within the docs SPA."
when_not_to_use:
  - "Any product/app UI → this is docs chrome; use Full Card or Stat Card instead."
  - "Editorial/content cards (news, articles, profiles) → use a product Card (.card)."
  - "Compact domain rows (people, vacancies) → use Basic Card (item) / domain cards."
use_cases:
  - "Grid de secciones de nivel superior del sitio de docs (Foundations, Styles)."
  - "Lista compacta de los 29+ componentes en la navegación de la documentación."
variants:
  - {name: full, class: nav-card, purpose: "Full card with a visual area — for top-level section grids."}
  - {name: compact, class: "nav-card nav-card--compact", purpose: "Dense card for long component lists (29+ items)."}
  - {name: tint, class: "nv-* (on .nav-card-visual)", purpose: "Semantic tint of the visual area only — match the tint to the content category."}
sizes:
  - {name: full, class: "(default)", use: "top-level section grids with an illustration"}
  - {name: compact, class: "nav-card--compact", use: "dense component/index lists"}
size_selection: "Full for top-level section grids; compact for dense component lists. Use at most one tint family per grid."
content_rules:
  - "Title under 3 words; description under ~10 words / max two lines."
  - "Use inline SVG illustrations with currentColor so they adapt to light/dark automatically."
  - "Apply tint variants to .nav-card-visual only — never to the card root."
layout_constraints:
  - "Styles live inline in index.html (docs shell) — there is no css/components file and no React wrapper."
  - "One tint family per grid; the arrow button is decorative."
states:
  default: "Resting card on the docs surface."
  hover: "Card lifts / arrow affords the navigation target."
  focus: "The whole card is a link — visible focus ring; operable with Enter."
accessibility:
  roles: "The whole card is a navigation target — use a real <a> (or wrap the content in one) so it's focusable and operable with Enter."
  aria: ['aria-hidden on the decorative arrow button', 'aria-hidden="true" on the SVG illustration', "accessible name comes from the card title, not the icon"]
  focus: "Visible focus ring on the link; text-over-surface contrast meets AA and tints never sit behind text."
  contrast: "Text on the card surface meets AA in light + dark; nav-card-visual tints stay out from under text."
keyboard:
  - {keys: "Tab", action: "focus the card link"}
  - {keys: "Enter", action: "navigate to the section"}
responsive:
  - "Cards reflow in a responsive grid (.nav-card-grid); compact variant packs denser lists."
ux_principles:
  - "A card grid gives the docs a scannable map of sections (recognition over recall) — this is a wayfinding aid, not product UI."
  - "Semantic tint helps users associate a category with its color, but only as reinforcement."
common_mistakes:
  - "Using Nav Cards in a product/app (they're docs chrome only)."
  - "Applying a tint to the card root instead of only .nav-card-visual."
  - "More than two lines of description, or more than one tint family per grid."
  - "Treating them as content cards (news/articles) instead of navigation."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "sections shown as a scannable grid, not memorized"}
  - {id: 4, name: "Consistency and standards", note: "one tint family per grid, stable card shape"}
relationships:
  related: [card, stat-card, item]
  replaces: ["ad-hoc navigation cards inside the docs site"]
  composed_with: []
  not_to_confuse_with:
    - {component: card, why: "Full Card is the consumable product panel; Nav Card is docs chrome"}
    - {component: stat-card, why: "Stat Card shows a metric in product UI; Nav Card links docs sections"}
    - {component: item, why: "Basic Card (item) is the consumable compact row; Nav Card is docs-only"}
tokens:
  color: ["semantic tint tokens on .nav-card-visual (nv-*)"]
  note: "Docs-chrome styles inline in index.html — no css/components token contract to import."
source:
  css: "(docs-internal — no css/components file; styles inline in index.html)"
  classes: [nav-card, "nav-card--compact", nav-card-header, nav-card-tag, nav-card-arrow-btn, nav-card-content, nav-card-title, nav-card-desc, nav-card-visual, nav-card-grid]
  react_wrapper: null
  docs_anchor: c-nav-card
---

## Correct usage

```html
<!-- Docs-site section grid: whole card is a real link -->
<div class="nav-card-grid">
  <a class="nav-card" href="#s-c-color">
    <div class="nav-card-header">
      <span class="nav-card-tag">Foundations</span>
      <span class="nav-card-arrow-btn" aria-hidden="true"><i data-lucide="arrow-up-right"></i></span>
    </div>
    <div class="nav-card-content">
      <div class="nav-card-title">Color</div>
      <div class="nav-card-desc">Tokens y roles de color.</div>
    </div>
    <div class="nav-card-visual nv-color" aria-hidden="true"><!-- inline SVG, currentColor --></div>
  </a>
</div>
```
*Why:* docs navigation, whole card is an `<a>`, arrow + illustration decorative, tint on the visual only.

## Incorrect usage

```html
<!-- ✕ Nav Card reused as a product content card -->
<div class="nav-card"><div class="nav-card-title">Vacante: Frontend</div>…</div>
```
*Fix:* in product UI use `.card` (Full Card) or a domain card — Nav Card is docs chrome only.

```html
<!-- ✕ Tint applied to the card root -->
<a class="nav-card nv-color" href="#s-c-button">…</a>
```
*Fix:* apply the `nv-*` tint to `.nav-card-visual`, never to the card root.
