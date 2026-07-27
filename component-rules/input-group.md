---
id: input-group
display_name: Input Group
aliases: [input addon, prefix suffix, input with button]
category: Forms
status: stable
summary: Joins an input with adjacent addons — icons, text, units, or buttons — into a single bordered unit that shares one focus/error state.

when_to_use:
  - "An input that needs a prefix/suffix: a leading icon, a unit ($, %, km), or a trailing action button."
  - "A field where an addon and the control must read as one control (one border, one focus ring)."
  - "A textarea with a toolbar above or below it (block layout)."
when_not_to_use:
  - "A plain input with no addons → use Input (.field-input)."
  - "A searchable/filterable field → use Combobox / Command."
  - "Decorative icons that don't need to be inside the field border → use Input's leading/trailing icon slots (.has-leading/.has-trailing)."
use_cases:
  - "Sueldo con prefijo de moneda: '$' + input numérico."
  - "Campo de búsqueda con atajo: input + kbd '⌘K' al final."
  - "Input con botón de acción pegado (aplicar código, copiar)."

variants:
  - {name: inline, class: input-group, purpose: "Horizontal: addon(s) + control on one row, single 40px-high bordered container."}
  - {name: block, class: input-group-block, purpose: "Stacked: full-width addon bars above/below a control (e.g. textarea toolbar)."}
  - {name: addon-start, class: input-group-addon, purpose: "Leading addon (icon / text / button)."}
  - {name: addon-end, class: input-group-addon-end, purpose: "Trailing addon (order:99), e.g. a kbd hint or action button."}
sizes:
  - {name: md, class: "(default)", use: "40px container height (matches .field-input)"}
size_selection: "Single size; keep it aligned with adjacent .field-input fields on the same form."

content_rules:
  - "The control still needs an accessible label (label with for/id, or aria-label)."
  - "Text/unit addons are short (a symbol or 1–2 words); button addons use .btn-text or .icon-btn."
  - "Don't put critical instructions only in an addon — use .field-hint for guidance."
layout_constraints:
  - "The border, focus ring, and error live on the .input-group container — the inner control has no border/background of its own."
  - "Use the addon slots, not position:absolute hacks, to place icons/buttons."

states:
  default: "Container: 1px --border, --card-bg."
  focus: "focus-within → --interactive border + 3px --color-focus-ring (ring is on the container, not the control)."
  disabled: ".is-disabled / :disabled → 50% opacity, no pointer events."
  error: "aria-invalid=true or .is-error → --color-error border; --color-error-ring on focus-within."

accessibility:
  roles: "Container is presentational; the inner <input>/<textarea> keeps native semantics. Addon buttons are real <button>s."
  aria: ["aria-invalid on the container for error", "aria-label/for on the inner control", "aria-label on icon-only addon buttons"]
  focus: "Focus lands on the inner control (and separately on any addon button); the visible ring is on the group."
  contrast: "Addon text (--color-on-surface-variant) and error border meet AA in light + dark."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "focus the control, then any addon button (separate stops)"}
  - {keys: "type / edit", action: "native text entry in the control"}
  - {keys: "Enter / Space", action: "activate a focused addon button"}
responsive:
  - "Keep the group full-width; keep addon buttons ≥ 44px hit area on coarse pointers."

ux_principles:
  - "Grouping the addon with the control communicates that they act as one field (law of common region)."
  - "Prefixes/suffixes clarify the expected format (currency, unit) before the user types."
common_mistakes:
  - "Rebuilding icon placement with absolute-positioned wrappers instead of addon slots."
  - "Putting the border/focus ring on the inner control so it double-rings with the container."
  - "Using Input Group for a plain field with no addon."
  - "Icon-only addon button with no aria-label."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "unit/prefix shows the expected format inline"}
  - {id: 4, name: "Consistency and standards", note: "one bordered unit, one focus/error state like other fields"}

relationships:
  related: [input, textarea, button, search, combobox]
  replaces: ["ad-hoc absolute-positioned icon/button wrappers around inputs"]
  composed_with: [form, label, button, input]
  not_to_confuse_with:
    - {component: input, why: "input is the plain field; input-group adds joined addons"}
    - {component: toolbar, why: "toolbar arranges independent controls; input-group is one field"}

tokens:
  color: [--border, --card-bg, --interactive, --color-focus-ring, --color-error, --color-error-ring, --color-on-surface-variant, --text-primary]
  radius: [--radius-md]
  typography: [--font-size-body-md, --font-size-body-sm]
  motion: [--duration-fast]

source:
  css: css/components/input-group.css
  classes: [input-group, input-group-control, input-group-addon, input-group-addon-end, input-group-text, input-group-block, is-error, is-disabled]
  react_wrapper: null
  docs_anchor: c-input-group
---

## Correct usage

```html
<!-- Currency prefix + numeric control -->
<label class="label" for="sueldo">Sueldo mensual</label>
<div class="input-group">
  <span class="input-group-addon"><span class="input-group-text">$</span></span>
  <input id="sueldo" class="input-group-control" type="number" inputmode="numeric" placeholder="0">
</div>
```
*Why:* the prefix and field read as one control sharing one border and focus ring.

```html
<!-- Trailing keyboard-shortcut hint -->
<div class="input-group">
  <span class="input-group-addon"><i data-lucide="search"></i></span>
  <input class="input-group-control" placeholder="Buscar…" aria-label="Buscar">
  <span class="input-group-addon input-group-addon-end"><kbd class="kbd">⌘K</kbd></span>
</div>
```

## Incorrect usage

```html
<!-- ✕ Border + ring on the inner control -->
<div class="input-group">
  <input class="field-input" style="border:1px solid var(--border)">
</div>
```
*Fix:* let the .input-group container own the border/focus ring; the inner control is borderless.

```html
<!-- ✕ Plain field wrapped in an input-group for no reason -->
<div class="input-group"><input class="input-group-control" placeholder="Nombre"></div>
```
*Fix:* a field with no addon is just an Input (.field-input).
