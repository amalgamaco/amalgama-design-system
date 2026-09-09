---
id: description
display_name: Description Section
aliases: [sección de descripción, editor de texto largo, rich text section, bloque editable]
category: Form
status: stable
summary: A bordered block with an editable heading and a rich-text body — for long-form content the person writes in named, reorderable sections, not for a plain textarea.

when_to_use:
  - "Long content the author organises themselves: a vacancy's responsibilities, requirements and benefits, each its own named section."
  - "Any field where the person needs to name the block as well as fill it, and to add or remove blocks."
when_not_to_use:
  - "A single free-text field with a fixed label → the textarea in form.css. If the label is not editable, this is the wrong component."
  - "Short text of one line → Input."
  - "Read-only display of long content → plain typography, no editor chrome."
  - "A comment thread or an activity log → those are lists, not editable sections."
use_cases:
  - "The body of a vacancy: 'Responsabilidades', 'Requisitos', 'Qué ofrecemos', each removable."
  - "A proposal template where the author renames and reorders the sections."

variants:
  - {name: default, class: desc-section, purpose: "The only variant — header with editable title and delete, plus a contenteditable body."}
sizes:
  - {name: md, class: "(default)", use: "the only size; 100px minimum body height, growing with content."}
size_selection: "Single size by design. The body grows with what is written; it never scrolls internally."

content_rules:
  - "The title is a real input the person edits — seed it with a suggestion ('Responsabilidades'), never leave it blank."
  - "The body's placeholder comes from `data-placeholder` and should prompt the first line, not name the field again: 'Contá qué va a hacer esta persona en el día a día', not 'Descripción'."
  - "Sections are added and removed by the person; the component does not decide how many there are."
  - "Do not put required-field validation on a section. If a section is mandatory, it is a form field with a fixed label, not this."
layout_constraints:
  - "Bordered block with `--radius-md` and `overflow: hidden`, so the header's bottom border meets the corners cleanly."
  - "16px between consecutive sections."
  - "The delete button is `opacity: 0` and appears on section hover — see the accessibility note; it must also appear on keyboard focus."
  - "The title input is borderless and transparent, taking `flex: 1`. It must keep `min-width: 0` or a long title pushes the delete button out."

states:
  default: "Header on --bg, body on --card-bg, delete hidden."
  hover: "The section reveals its delete button."
  titleFocus: "The title input's text goes to --interactive, the only signal that it is editable."
  bodyFocus: "A 2px inset --color-focus-ring on the editor."
  empty: "The body shows `data-placeholder` via `:empty::before`, in --text-muted."

accessibility:
  roles: "The body is `contenteditable` and needs `role=\"textbox\"` with `aria-multiline=\"true\"`. The title is a real `<input>`."
  aria: ["aria-label on the title input ('Título de la sección')", "aria-label on the delete button naming what it removes ('Eliminar sección Responsabilidades')", "The body's accessible name comes from the title input via aria-labelledby"]
  focus: "**The delete button appears on hover only, which hides it from keyboard users.** It must also become visible on `:focus-within` of the section. A control reachable only with a mouse is a defect, not a style."
  contrast: "The placeholder uses --text-muted, AA for body text. The focus ring meets 3:1 against the editor surface."
keyboard:
  - {keys: "Tab", action: "title → body → delete, then on to the next section"}
  - {keys: "Enter (in the title)", action: "moves to the body; it does not submit the surrounding form"}
  - {keys: "Enter (in the body)", action: "a new paragraph — the body is multiline"}
responsive:
  - "Full width on mobile; the header's 10px/16px padding holds."
  - "The delete button must be permanently visible on touch, where there is no hover. Do not ship a hover-only control to a phone."
  - "44px minimum touch target for delete on mobile — the 28px desktop button is too small there."

ux_principles:
  - "Letting the author name and reorder the blocks matches how people actually draft long content, instead of forcing it into fields someone else chose (Nielsen 7, flexibility)."
  - "Chrome that appears on hover keeps the writing surface calm, but only if it is also reachable another way (progressive disclosure, bounded by accessibility)."
  - "Deleting a section destroys written work — it needs an undo or a confirm, not a bare click (Nielsen 3)."
common_mistakes:
  - "Using it as a plain textarea with a fixed label. If the title is not editable, use form.css."
  - "Leaving delete hover-only, so it cannot be reached by keyboard or on touch."
  - "Deleting a section with content and no confirmation and no undo."
  - "Omitting role=textbox and aria-multiline on the contenteditable body."
  - "A placeholder that repeats the title instead of prompting the first sentence."
  - "Letting a long title push the delete button off the row (missing min-width: 0)."
nielsen_heuristics:
  - {id: 7, name: "Flexibility and efficiency of use", note: "the author structures the content instead of filling someone else's fields"}
  - {id: 3, name: "User control and freedom", note: "sections are added and removed, and removal must be recoverable"}
  - {id: 8, name: "Aesthetic and minimalist design", note: "chrome stays hidden until the section is engaged"}

relationships:
  related: [form, create-form, item]
  replaces: ["ad-hoc rich-text editors"]
  composed_with: [create-form, form, icon-btn]
  not_to_confuse_with:
    - {component: form, why: "form.css covers fields with fixed labels; here the label itself is content the person writes"}
    - {component: accordion, why: "an accordion collapses existing content for reading; this is an editing surface"}
    - {component: card, why: "a card groups content for display; this one is authored in place"}

tokens:
  color: [--border, --bg, --card-bg, --text-primary, --text-muted, --interactive, --color-focus-ring, --color-error-container, --color-on-error-container]
  radius: [--radius-md]
  spacing: ["16px section margin", "10px 12px 10px 16px header padding", "14px 16px editor padding", "100px min-height"]
  typography: [--font-size-body-md]

motion:
  enter: "A newly added section appears immediately. If it is animated, it is the shared list-item entrance on --duration-fast, never a bespoke one."
  exit: "Immediate on delete, paired with an undo affordance — do not spend an animation softening a destructive act."
  stateChange: "The delete button transitions background and colour on --duration-fast; the editor transitions its focus box-shadow on the same."
  duration: "--duration-fast"
  easing: "--ease-default"
  reducedMotion: "Inherits the global rule in css/base.css. The opacity reveal of the delete button is a state change, not decoration, and must remain perceivable — under reduced motion it appears without a transition rather than not at all."
  constraints: "Never animate the editor's height as the person types. The caret must not move under them."
  relatedPatterns: [state-layer]

source:
  css: css/components/description.css
  classes: [desc-section, desc-section-header, desc-title-input, desc-delete-btn, desc-editor]
  docs_anchor: c-description
---

## Correct usage

```html
<div class="desc-section">
  <div class="desc-section-header">
    <input class="desc-title-input" value="Responsabilidades" aria-label="Título de la sección">
    <button class="desc-delete-btn" aria-label="Eliminar sección Responsabilidades">
      <svg aria-hidden="true"><!-- lucide x --></svg>
    </button>
  </div>
  <div class="desc-editor" contenteditable="true" role="textbox" aria-multiline="true"
       data-placeholder="Contá qué va a hacer esta persona en el día a día."></div>
</div>
```
*Why:* editable title, delete names what it removes, the body announces as a multiline textbox.

## Incorrect usage

```html
<!-- ✕ Fixed label and a hover-only unlabelled delete -->
<div class="desc-section">
  <div class="desc-section-header">
    <span class="desc-title-input">Descripción</span>
    <button class="desc-delete-btn">✕</button>
  </div>
  <div class="desc-editor" contenteditable="true"></div>
</div>
```
*Fix:* a fixed label means this is a `form.css` textarea. If the section is right, the title is an `<input>`, delete carries an `aria-label` and a Lucide icon, and it appears on `:focus-within` too.
