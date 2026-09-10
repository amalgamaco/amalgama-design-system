---
id: composition
display_name: Composition (estructura de página)
aliases: [layout de página, grilla, columna, ancho de contenido, overline, ritmo, section index]
category: Layout
status: stable
summary: The skeleton of a page — which of the four structures it uses, where the text stops, how the sections breathe, and the two marks that make it read as Amalgama's rather than as a generated page.

when_to_use:
  - "Every page we publish, with or without the app shell. It is not optional and it is not per-project."
  - "PAGE surfaces (landing, proposal, report, one-pager, demo) use all of it, opening included: editorial title, section index, hero with the control."
  - "PRODUCT surfaces (screens inside the app shell) use the structure, the grid, the measure, the icon placements and every anti-generic rule — but NOT the opening ones. A product screen does not open, it continues: it starts with page-title, and numbering the sections of an admin panel is decoration. See COMPOSICION.md § Alcance for the full table."
  - "Before placing a single component: the structure is chosen first, from the four, and stated out loud."
  - "A landing, a proposal or a one-pager, where there is no shell and this is the only thing holding the page together."
when_not_to_use:
  - "Never skipped. The closest thing to an exception is a fragment embedded in someone else's product, which inherits their structure — there you still use `.measure` and the rhythm classes."
use_cases:
  - "A client landing that has to look like ours and not like every other landing."
  - "A commercial proposal built with `artifact`."
  - "A product screen inside the shell: `.column` inside `.content`."

variants:
  - {name: column, class: column, purpose: "Default. One centred column, 1200px. Product, dashboards, app screens. The safe one; also the most common, so it differentiates the least."}
  - {name: "widths", class: "column-1280 · column-1440 · column-1600 · column-1920", purpose: "The same centred column at a deliberate width. Side margins never go away — the column grows, the air stays. Pick by content density and by how much of a large monitor the page should own; a dashboard with a sidebar rarely needs more than 1440."}
  - {name: read, class: column-read, purpose: "800px. Reading and detail — an article, a case, a long section."}
  - {name: form, class: column-form, purpose: "680px. A single-column form or an auth panel."}
  - {name: bleed, class: column-bleed, purpose: "No max-width, generous fluid gutters. The page uses the whole monitor instead of leaving two empty margins — the fastest way out of the generated-landing silhouette. The text still stops at `.measure`."}
  - {name: rail, class: column-rail, purpose: "Wide content + a narrow side track for metadata, margin notes or an index. The most 'studio' of the four, and the one a generator imitates worst, because it forces deciding what is a note."}
  - {name: split, class: column-split, purpose: "Two asymmetric tracks, 6fr/4fr. For a hero with a working control or an image on one side. Never 50/50: equal halves do not say which one leads."}
  - {name: "editorial", class: "editorial-lg · editorial-md · editorial-sm", purpose: "The opening title of a landing, a proposal cover or a report. One per page, on the h1, never inside the app shell — a product screen opens with page-title. The body stays on the product scale on purpose: what reads as ours is the DISTANCE between a 96px title and a 13.5px body, not everything getting bigger."}
  - {name: "grid-12", class: "grid-12 + span-1…span-12", purpose: "The 12-column grid, used INSIDE the chosen structure. This is what lets a section be 7+5 or 8+4 instead of three equal blocks. Collapses to one column below 900px."}
sizes:
  - {name: "(no aplica)", class: "—", use: "the width is the variant, not a size modifier."}
size_selection: "Two decisions, both stated out loud: the STRUCTURE (column / bleed / rail / split) and, if it is a column, the WIDTH (1200 default · 1280 · 1440 · 1600 · 1920). Pick by content, not by taste: dense list, table or dashboard → column at 1200–1440 · reading → column-read · form → column-form · a page that must not look generic → bleed, rail or split. Inside any of them, grid-12 does the internal composition."

content_rules:
  - "**One overline per page, maximum.** It classifies something the title does not say (a report period, a coverage, a section number). If it repeats the h1 or names the section, delete it."
  - "The section index numbers the real total of sections (`02 / 05`). It never skips, never restarts and never appears on a page with a single section."
  - "Numbers inside the page come from real data or they do not get published."
layout_constraints:
  - "One structure per page. Mixing `column-bleed` in one section and `column` in the next breaks the left edge, which is the thing holding the page together."
  - "**The left edge of every region matches.** Title, toolbar, content, footer. A region that centres itself is a defect (D1)."
  - "`column-bleed` frees the layout, never the text: paragraphs still carry `.measure`, or the line runs past 120 characters (D3)."
  - "The rhythm is deliberate: `.section-lead` for the section carrying the argument, `.section-tight` for support. If every section is the same height there is no rhythm (COMPOSICION.md rule 6)."
  - "Nothing is centred at page level. Centring survives inside components that own it — empty-state, modal, placeholder, OTP, calendar cells."

states:
  default: "Static structure; it has no interactive states of its own."

accessibility:
  roles: "Structural containers. Use the real landmarks — <main>, <section>, <aside> for the rail — not divs with classes."
  aria: ["The section index is decorative when the heading already names the section: mark it aria-hidden=true so a screen reader does not read '02 slash 05' before every title"]
  focus: "No focusable elements of its own."
  contrast: "The overline uses --text-muted, which meets AA in both themes (8.39:1 light, 6.44:1 dark on card)."
keyboard:
  - {keys: "—", action: "no interaction of its own"}
responsive:
  - "`column-rail` and `column-split` collapse to one column below 900px. The rail goes after the content, never before it."
  - "The gutters shrink with `clamp()`: 20px on a phone, up to 56px (96px in bleed) on a wide monitor."

ux_principles:
  - "A shared left edge is what makes a page read as deliberate instead of assembled (Gestalt, common region + alignment)."
  - "Proportional white space tells the eye where to stop; uniform bands tell it nothing (visual hierarchy)."
  - "Line length caps at ~68 characters because the eye loses the return sweep beyond that."
common_mistakes:
  - "Using `column-bleed` and letting the paragraphs run the full width. The layout is edge to edge; the text is not."
  - "Choosing `column` at 1200 by default without asking whether the page needs to look different. It is the right answer for a dashboard and the boring one for a landing."
  - "Using `grid-12` to lay out three equal blocks three sections in a row. Twelve columns exist to make asymmetry cheap — 7+5, 8+4, 5+4+3 — not to rebuild the three-card grid with new class names."
  - "Widening the column and letting the paragraphs widen with it. The width is the layout's; the text still stops at `.measure`."
  - "Two editorial titles on one page. Two openings is no opening."
  - "Using an editorial size inside the app shell, or on an h2 that is not the page's opening. It is not 'the big heading style', it is the cover."
  - "Scaling the body up to match the title. The contrast IS the signature — bump the body and it disappears."
  - "Numbering sections that are not a real set — three sections numbered `01 / 07` because seven looked better."
  - "An overline on every section. Repeated, it stops classifying and becomes texture."
  - "Five sections with the same padding, alternating background on and off. That is an accordion, not a page."
  - "Centring the hero 'because it is the hero'."
nielsen_heuristics:
  - {id: 8, name: "Aesthetic and minimalist design", note: "the structure carries the hierarchy so the page needs fewer boxes"}
  - {id: 4, name: "Consistency and standards", note: "one structure per page, one left edge, one overline"}

relationships:
  related: [layout, page-header, table, empty-state]
  replaces: ["the hand-written `max-width: 1200px; margin: 0 auto` in every project", "eyebrows invented per page with `letter-spacing: .14em`"]
  composed_with: [layout, page-header]
  not_to_confuse_with:
    - {component: layout, why: "layout.css is the app shell — sidebar and topbar. This is the structure of the content inside it, and it is also used where there is no shell at all"}
    - {component: page-header, why: "page-header is the title block of a screen; this is the skeleton the whole page hangs from"}

tokens:
  color: [--text-muted, --color-secondary, --color-outline]
  spacing: [--space-8, --space-12, --space-20, --measure, --measure-lead]
  typography: [--font-mono, --font-size-overline, --line-height-overline, --letter-spacing-overline]

motion:
  entrance: "none — structure does not animate in"
  duration: "—"
  easing: "—"
  reduced_motion: "n/a"

related_rules: [COMPOSICION.md]

source:
  css: css/composition.css
  classes: [editorial-lg, editorial-md, editorial-sm, column, column-1280, column-1440, column-1600, column-1920, column-read, column-form, column-bleed, column-rail, column-split, grid-12, span-1, span-2, span-3, span-4, span-5, span-6, span-7, span-8, span-9, span-10, span-11, span-12, measure, measure-lead, section, section-lead, section-tight, overline, section-index]
  docs_anchor: c-composition
---

## Correct usage

```html
<!-- Una landing: borde a borde, con el texto acotado y el gesto puesto -->
<main class="column column-bleed">
  <section class="section section-lead">
    <p class="overline">Informe trimestral</p>
    <h1>Cuánto tardan hoy las altas de socios</h1>
    <p class="measure-lead">Medimos las 240 altas del último trimestre en los cuatro clubes.</p>
  </section>

  <section class="section">
    <span class="section-index" aria-hidden="true">02<span class="sep">/</span>05</span>
    <h2>Dónde se pierde el tiempo</h2>
    <p class="measure">…</p>
  </section>
</main>
```
*Why:* one structure, one overline, the text stops at `.measure` even though the layout does not, and the sections do not all weigh the same.

## Incorrect usage

```html
<!-- ✕ Borde a borde sin acotar el texto -->
<main class="column column-bleed">
  <p>Un párrafo de 200 caracteres por línea en un monitor de 27 pulgadas…</p>
</main>
```
*Fix:* `class="measure"` on the paragraph. `column-bleed` frees the layout, not the line.

```html
<!-- ✕ Un overline por sección -->
<p class="overline">Servicios</p><h2>Nuestros servicios</h2>
<p class="overline">Equipo</p><h2>El equipo</h2>
```
*Fix:* one per page, and only when it classifies something the title does not say. Here neither does.
