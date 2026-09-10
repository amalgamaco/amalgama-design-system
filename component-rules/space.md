---
id: space
display_name: Space (capa espacial de Amalgama)
aliases: [planetas, órbitas, fondo espacial, estrellas, identidad espacial]
category: Layout
status: stable
summary: Amalgama's own space layer — deep navy canvas with a starfield, one glow, thin orbits, planets and the ghost title. It is studio identity, so it goes on our surfaces and never on a client's.

when_to_use:
  - "Amalgama's own surfaces: our site, one-pagers, commercial proposals, project reports, decks and demos we sign."
  - "An internal tool that is explicitly ours and has no client brand on it."
when_not_to_use:
  - "**Any client product.** Not a white-label screen, not a client landing, not 'just a bit of it in the background'. A client paying for their brand is not buying ours — there the space layer is failure `H12`."
  - "A page that already loads a `brand/<client>.css`. That file's presence is the signal: this is somebody else's brand."
  - "A dense product screen of ours. The layer is for pages that are read, not for tables and forms — it costs legibility and buys nothing."
use_cases:
  - "The commercial one-pager for a prospect, signed by Amalgama."
  - "Our own site: hero, services, the desirability/feasibility/viability diagram."

variants:
  - {name: canvas, class: space, purpose: "The background itself: vertical gradient plus a CSS starfield. Goes on the body or the outermost wrapper, with data-theme=dark on the html."}
  - {name: glow, class: space-glow, purpose: "The halo behind the opening block. ONE per page — two halos is none."}
  - {name: orbit, class: orbit, purpose: "A thin ring that frames a diagram. Never decorative on its own: a circle with nothing inside is a circle with no reason."}
  - {name: planet, class: "planet + planet-sm · planet-md · planet-lg", purpose: "A planet image from Amalgama's set, with its fixed treatment: no box, no border, no radius, a soft halo. planet-lg anchors a section, planet-sm marks a point on an orbit."}
  - {name: ghost title, class: title-ghost, purpose: "The huge title barely lighter than the background, as watermark texture. Decorative — it does not replace the real heading, and it is not the editorial register."}
sizes:
  - {name: "sm · md · lg", class: "planet-sm · planet-md · planet-lg", use: "32 / 96 / 260px. One lg per section at most: three big planets on one screen is a wallpaper, not a page."}
size_selection: "The planet's size says how much it matters. If everything is big, nothing is."

content_rules:
  - "The layer carries no information. Every planet, orbit and star can be removed without losing meaning — that is what makes it decoration, and why it is rationed."
  - "The ghost title is texture, not a heading. Either the real heading sits next to it, or the ghost carries the text and then it must meet contrast — never both."
layout_constraints:
  - "One glow per page, at the opening."
  - "At most one `planet-lg` per section."
  - "Planets never sit on top of text. They anchor, frame or peek from an edge; if one overlaps a paragraph, it is in the way."
  - "The structure underneath is still `composition.css`: the space layer is a background, it does not replace the column, the measure or the rhythm."

states:
  default: "Static. The layer does not animate: no parallax, no drifting planets, no twinkling stars (see COMPOSICION.md rule 11 and guidelines/motion.md)."

accessibility:
  roles: "Purely decorative. The canvas is a background; planets are <img> with alt=\"\" and aria-hidden=true, or CSS backgrounds."
  aria: ["Nothing in this layer is announced", "The ghost title is aria-hidden when the real heading repeats its text — otherwise a screen reader reads the same words twice"]
  focus: "Nothing here is focusable."
  contrast: "Text over the canvas uses the dark-theme tokens: --text-primary (#EAEBED) on #000B29 measures 17.9:1, --text-secondary 13.7:1. The glow lightens the top band to #0B1B44, where --text-primary still measures 16.3:1. Any text placed over a large planet must be checked on its own — a planet is not a surface token."
keyboard:
  - {keys: "—", action: "no interaction"}
responsive:
  - "The starfield tiles, so it needs no change by breakpoint."
  - "Below 900px drop the `planet-lg`s or step them down to `md`: on a phone a 260px planet is half the screen."

ux_principles:
  - "Decoration earns its place by being rationed. The identity comes from repeating one thing, not from filling the page with it."
  - "A dark canvas raises the cost of every element: what survives on it should be what matters."
common_mistakes:
  - "Using it on a client deliverable because it looks good. That is the one thing this component is not for."
  - "Three big planets in one viewport."
  - "Animating the layer — drifting planets, twinkling stars, parallax on scroll."
  - "Putting a paragraph on top of a planet and assuming the contrast holds."
  - "Using `title-ghost` as the page's heading. It is 12% opacity: it is texture, and as a heading it fails contrast."
nielsen_heuristics:
  - {id: 8, name: "Aesthetic and minimalist design", note: "decoration is rationed so the content keeps the weight"}

relationships:
  related: [composition, layout]
  replaces: ["dark backgrounds with an invented gradient, made up per project"]
  composed_with: [composition]
  not_to_confuse_with:
    - {component: composition, why: "composition is the skeleton of any page, ours or a client's. This is a skin, and only ours"}

tokens:
  color: [--space-deep, --space-mid, --space-near, --space-glow, --space-star, --text-primary]
  spacing: []
  typography: [--font-heading, --font-size-editorial-lg, --letter-spacing-editorial]

motion:
  entrance: "none"
  duration: "—"
  easing: "—"
  reduced_motion: "n/a — the layer is static by design"

related_rules: [COMPOSICION.md]

source:
  css: css/space.css
  classes: [space, space-glow, orbit, planet, planet-sm, planet-md, planet-lg, title-ghost]
  docs_anchor: c-space
---

## Correct usage

```html
<html data-theme="dark">
<body class="space">
  <div class="space-glow"></div>
  <main class="column column-1440">
    <section class="section section-lead">
      <p class="overline">Propuesta</p>
      <h1 class="editorial-lg">Rediseño del back-office</h1>
      <p class="measure-lead">…</p>
    </section>
  </main>
  <img class="planet planet-lg" src="…/planeta-saturno.png" alt="" aria-hidden="true"
       style="position:absolute; right:-60px; top:420px">
</body>
```
*Why:* one canvas, one glow, one big planet off to the side, and the content still hanging from `composition.css`.

## Incorrect usage

```html
<!-- ✕ En el producto de un cliente -->
<link rel="stylesheet" href="brand/nortia.css">
<body class="space"> … </body>
```
*Fix:* remove the layer. If `brand/<cliente>.css` is loaded, the page belongs to someone else's brand — failure `H12`.

```html
<!-- ✕ El título fantasma haciendo de título -->
<h1 class="title-ghost">Nuestros servicios</h1>
```
*Fix:* `title-ghost` is 12% opacity texture. The real heading goes in `editorial-*`; the ghost, if it stays, goes `aria-hidden`.
