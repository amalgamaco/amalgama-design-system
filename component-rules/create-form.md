---
id: create-form
display_name: Create Form (header + sticky footer)
aliases: [formulario de creación, alta full-page, create page, sticky footer]
category: Layout
status: stable
summary: The frame for a full-page creation or editing form — a large title above, and a footer that sticks to the bottom of the viewport so the save action is reachable no matter how long the form runs.

when_to_use:
  - "Creating or editing a record that does not fit comfortably in a Dialog: several sections, rich text, uploads, or anything the person will scroll."
  - "Any form long enough that the submit button would otherwise sit below the fold."
when_not_to_use:
  - "A short task of two or three fields → Dialog. A full page for a two-field form is a navigation cost with no payoff."
  - "Filters over a collection → the toolbar's filter controls, or a Sheet on mobile."
  - "A destructive confirmation → Alert Dialog."
  - "A read-only detail view → Page Header plus content."
use_cases:
  - "'Crear vacante' with description sections, requirements and publication settings."
  - "Editing a candidate profile with photo, contact data and a free-text history."

variants:
  - {name: default, class: "create-header + create-footer", purpose: "The only shape — the two pieces are used together, with the form between them."}
sizes:
  - {name: md, class: "(default)", use: "the only size; --font-size-heading-xl title, 16px 32px footer padding."}
size_selection: "Single size by design."

content_rules:
  - "The title names the action and the object: 'Crear vacante', 'Editar perfil'. Not 'Formulario' and not just the object."
  - "The footer holds exactly two actions: the confirming one as `btn-primary` on the right, and Cancel as `btn-tertiary`. `space-between` puts destructive-adjacent distance between them."
  - "The confirming button says what happens — 'Publicar', 'Guardar cambios' — never 'Enviar' or 'OK'."
  - "If the form can be saved incomplete, a third 'Guardar borrador' goes as `btn-text` beside Cancel, never as a second filled button."
layout_constraints:
  - "`.create-footer` is `position: sticky; bottom: 0` with a top border and the card surface — it must read as a bar over the content, not as the end of the page."
  - "`.create-header` carries no bottom margin; `.create-title` provides the 20px separation."
  - "The footer needs `margin-top: auto` in a column flex container to stay at the bottom on short forms."
  - "The form content between them keeps a constrained reading width; the footer spans the full column."

states:
  default: "Footer visible and stuck while the form scrolls."
  submitting: "The primary button goes to its loading state (inline `spinner-sm spinner-on-primary`, label kept) and re-submission is blocked. The footer itself does not change."
  invalid: "Validation lives on the fields, not on the footer. Never disable the submit button to express invalidity — the person then has no way to learn what is wrong; let them submit and show the errors."

accessibility:
  roles: "The form is a real `<form>`. `.create-title` is the page's `<h1>`."
  aria: ["The submit button is type=submit so Enter works from any field", "On submit failure, move focus to the first field with an error and announce the count via aria-live"]
  focus: "Focus order runs title → fields → footer. Because the footer is sticky, it is visually last and in the DOM last — the two must agree."
  contrast: "The footer's top border against the card surface meets the 3:1 UI-component threshold in both themes."
keyboard:
  - {keys: "Enter", action: "submits from any single-line field"}
  - {keys: "Tab", action: "runs through the fields and ends on Cancel then the primary action"}
  - {keys: "Escape", action: "does nothing — this is a page, not an overlay. Leaving is Cancel, which must confirm if there are unsaved changes"}
responsive:
  - "The sticky footer matters most on mobile, where forms are longest. Keep it."
  - "On mobile the two buttons stack full-width, primary on top, and the primary becomes `btn-lg` for the 44px target."
  - "Watch the on-screen keyboard: it reduces the viewport, and a sticky footer can end up covering the focused field. Test with the keyboard open."

ux_principles:
  - "A save action that scrolls away makes a person hunt for it at the exact moment they are ready to finish (Fitts, and the reason the footer sticks)."
  - "Naming the outcome on the button ('Publicar') tells the person what is about to happen before they commit (Nielsen 2)."
  - "A disabled submit hides the reason for the block; showing errors on submit teaches instead of stonewalling (Nielsen 9)."
common_mistakes:
  - "Using a full page for a form that fits in a Dialog."
  - "A footer that is not sticky, so the primary action scrolls out of reach."
  - "Disabling the submit button until the form is valid."
  - "'Enviar' or 'Guardar' where the real outcome is 'Publicar'."
  - "Leaving the page without confirming when there are unsaved changes."
  - "Two filled buttons in the footer — Cancel is `btn-tertiary`."
nielsen_heuristics:
  - {id: 3, name: "User control and freedom", note: "Cancel is always visible, and unsaved changes confirm before leaving"}
  - {id: 2, name: "Match with the real world", note: "the button names the outcome in the user's words"}
  - {id: 9, name: "Help users recognise and recover from errors", note: "errors are shown on submit rather than hidden behind a disabled button"}

relationships:
  related: [form, dialog, page-header, description, button]
  replaces: ["custom form headers and footers"]
  composed_with: [form, description, button, alert, select, date-picker]
  not_to_confuse_with:
    - {component: dialog, why: "a dialog is for a short focused task that blocks; this is a full page for a long one"}
    - {component: page-header, why: "page-header names a view; create-header names an action in progress and pairs with the sticky footer"}
    - {component: sheet-bottom, why: "a bottom sheet is a mobile overlay for a secondary task, not the primary creation flow"}

tokens:
  color: [--card-bg, --border]
  radius: []
  spacing: ["16px 32px footer padding", "20px title margin-bottom"]
  typography: [--font-heading, --font-size-heading-xl]

motion:
  enter: "none — the frame is present with the page."
  exit: "none."
  stateChange: "The footer does not animate as it sticks; no shadow appears on scroll. The primary button's loading state follows button.css."
  duration: "n/a for the frame"
  easing: "n/a for the frame"
  reducedMotion: "Inherits the global rule in css/base.css."
  constraints: "Do not animate the footer in and out on scroll direction. A save action that hides is worse than one that scrolls."
  relatedPatterns: []

source:
  css: css/components/create-form.css
  classes: [create-header, create-title, create-footer]
  docs_anchor: c-create-form
---

## Correct usage

```html
<form>
  <div class="create-header"><h1 class="create-title">Crear vacante</h1></div>
  <!-- secciones del formulario -->
  <div class="create-footer">
    <button type="button" class="btn-tertiary">Cancelar</button>
    <button type="submit" class="btn-primary">Publicar</button>
  </div>
</form>
```
*Why:* the button names the outcome, Cancel steps down, and the footer stays reachable.

## Incorrect usage

```html
<!-- ✕ Disabled until valid, and the outcome is unnamed -->
<div class="create-footer">
  <button class="btn-primary" disabled>Enviar</button>
</div>
```
*Fix:* let them submit and show the field errors; label it 'Publicar'; add a `btn-tertiary` Cancel.
