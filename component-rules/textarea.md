---
id: textarea
display_name: Textarea
aliases: [multiline input, text area, comment box]
category: Forms
status: stable
summary: A multi-line text field for paragraph-length free-form input, with the same label/hint/error language as Input.

when_to_use:
  - "Capturing more than one line of free-form text: a description, a message, notes, a cover letter."
  - "Any field where the user may want line breaks and to see several lines at once."
when_not_to_use:
  - "A single line / scalar value (name, email, title) → use Input."
  - "Rich formatting (bold, lists, links) → use a rich-text editor, not a plain textarea."
  - "Picking from a fixed list → use Select."
use_cases:
  - "Vacante: 'Descripción del puesto' / 'Responsabilidades'."
  - "Candidato: 'Nota interna' del reclutador."

variants:
  - {name: base, class: field-textarea, purpose: "Multi-line field; vertically resizable, auto-grows with content where supported (field-sizing:content)."}
sizes:
  - {name: md, class: "(default)", use: "min-height 80px; grows with content / user resize"}
size_selection: "Single size; set min-height via the class and let it grow. Don't lock the height so short that content is hidden."

content_rules:
  - "Always paired with a label (.field-label in .field-group, or a standalone .label)."
  - "Use .field-hint for guidance and .field-char-count when a max length matters (.is-over past the limit)."
  - "Placeholder is an example, never the label."
layout_constraints:
  - "Full-width within its .field-group; resize is vertical only (resize:vertical) — never horizontal."
  - "Char count + error live in .field-supporting below the field."

states:
  default: "1px --border, --card-bg; line-height 1.5."
  hover: "Border darkens to --color-outline (shared Input hover)."
  focus: "Border --interactive + 3px --color-focus-ring; label recolors to --interactive."
  disabled: "--color-disabled bg, --color-on-disabled text, not-allowed."
  error: "aria-invalid or .field-group.is-error → --color-error border, red label, error message replaces hint."

accessibility:
  roles: "Native <textarea>; associate a label via .field-group wrapping or for/id."
  aria: ["aria-invalid=true on error", "aria-describedby → hint/error/char-count id", "aria-required if required"]
  focus: "Native focus order; visible focus ring; label reinforces focus."
  contrast: "Text, placeholder, border meet AA in light + dark via tokens."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "move focus (Tab inserts focus change, not a tab char)"}
  - {keys: "Enter", action: "insert a new line"}
  - {keys: "type / edit", action: "native multi-line entry, selection, IME"}
responsive:
  - "Full-width; keep an initial min-height that shows a few lines on mobile."
  - "field-sizing:content auto-grows where supported; the resize handle is the fallback."

ux_principles:
  - "Give the field enough visible height to signal that longer input is expected."
  - "Show a live character count when there's a limit, and warn (is-over) before the user overshoots."
common_mistakes:
  - "Using a single-line Input where paragraph text is expected."
  - "Fixing the height so small that typed content is clipped and unscrollable."
  - "Placeholder-only, no persistent label."
  - "Allowing horizontal resize (breaks the form layout)."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "persistent label + hint stay visible while typing"}
  - {id: 1, name: "Visibility of system status", note: "live char count shows remaining budget"}
  - {id: 9, name: "Help users recognize/recover from errors", note: "inline error message + aria-invalid"}

relationships:
  related: [input, form, label, input-group]
  replaces: ["legacy multi-line text fields"]
  composed_with: [form, label, dialog]
  not_to_confuse_with:
    - {component: input, why: "input is single-line; textarea is multi-line"}
    - {component: input-group, why: "input-group joins addons to a single-line control"}

tokens:
  color: [--border, --card-bg, --text-primary, --interactive, --color-focus-ring, --color-error, --color-on-surface-variant]
  radius: [--radius-md]
  typography: [--font-size-body-md, --font-size-caption, --font-size-badge]
  motion: [--duration-fast]

motion:
  enter: "none — always present (static form field)."
  exit: "none."
  stateChange: "Shares the form field transition (border-color + box-shadow). Focus-visible: border→--interactive + 3px --color-focus-ring, label recolors via :focus-within. Error (is-error / aria-invalid): border→--color-error + --color-error-ring. Auto-grow via field-sizing: content changes height with typed content but is intentionally NOT transitioned (animating height would thrash layout)."
  duration: "--duration-fast (border/box-shadow)"
  easing: "none specified — the shared field transition lists durations with no --ease-* token, falling back to the browser default `ease`. Divergence from the --ease-default convention; flag to tokenize."
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (border/ring transitions collapse to ~0). No component-specific override."
  constraints: "Only animate border-color + box-shadow (focus/error effects). Never transition the field-sizing height change or the user-driven resize handle — height/layout animation is a layout-thrash source."
  relatedPatterns: [state-layer]

source:
  css: css/components/form.css
  classes: [field-group, field-label, field-textarea, field-supporting, field-hint, field-error-msg, field-char-count, is-over, is-error]
  react_wrapper: components/ui/textarea.tsx
  docs_anchor: c-textarea
---

## Correct usage

```html
<div class="field-group">
  <label class="field-label">Descripción del puesto</label>
  <textarea class="field-input field-textarea" placeholder="Detallá responsabilidades y requisitos…"></textarea>
  <div class="field-supporting">
    <span class="field-hint">Máximo 500 caracteres.</span>
    <span class="field-char-count">0/500</span>
  </div>
</div>
```
*Why:* multi-line field with a label, hint, and live char count.

## Incorrect usage

```html
<!-- ✕ Textarea locked too short -->
<textarea class="field-textarea" style="height:24px;resize:none"></textarea>
```
*Fix:* keep the min-height (≥ a few lines) and allow vertical resize / auto-grow.

```html
<!-- ✕ Single-line value in a textarea -->
<textarea class="field-textarea" placeholder="Email"></textarea>
```
*Fix:* a single scalar value is an Input.
