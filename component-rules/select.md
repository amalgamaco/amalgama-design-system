---
id: select
display_name: Select
aliases: [dropdown, listbox, picker, combo]
category: Forms
status: stable
summary: Choose exactly one option from a short-to-medium bounded list via a themed dropdown listbox.

when_to_use:
  - "Picking ONE value from a known, bounded list (5–~30 options) where the dropdown must match the DS in every theme."
  - "A form field where the options are fixed and non-searchable (contract type, seniority, location)."
when_not_to_use:
  - "The user needs to type to filter/search the list → use Combobox / Command."
  - "A few (2–5) always-visible options where seeing them all helps the decision → use Radio Group or Segmented Button."
  - "A binary on/off → use Switch."
  - "A dense form field where the native OS dropdown is acceptable → use the native <select> in form.css (.select-wrapper)."
  - "Multi-select with visible tokens → use Chips or a multi-select Combobox."
use_cases:
  - "Formulario de vacante: 'Tipo de contrato' (Full-time / Part-time / Freelance)."
  - "Filtro: 'Seniority' (Junior / Semi-senior / Senior)."

variants:
  - {name: styled, class: select, purpose: "Themed listbox (trigger + floating role=listbox panel with check indicator); par shadcn/Radix Select."}
  - {name: native, class: select-wrapper, purpose: "Native <select> restyled (form.css) — dropdown drawn by the OS; use in dense forms where theming the panel doesn't matter."}
  - {name: grouped, class: "select-group + select-label + select-separator", purpose: "Labelled groups and separators inside the panel."}
sizes:
  - {name: md, class: "(default)", use: "standard field height (min-height 40px)"}
  - {name: sm, class: "select-trigger[data-size=sm]", use: "compact toolbar/dense contexts (min-height 32px)"}
size_selection: "Match surrounding field density; use data-size=sm inside a toolbar or a dense row, default everywhere else."

content_rules:
  - "The trigger shows the selected value, or a muted placeholder ([data-placeholder]) when nothing is chosen."
  - "Option labels are short noun phrases; group related options under a .select-label."
  - "Provide an accessible name (label with for/id or aria-label) for the trigger."
layout_constraints:
  - "The panel is absolutely positioned under the trigger with NO viewport-edge collision detection (accepted buildless simplification) — keep it clear of the viewport bottom."
  - "The selected option carries the check indicator (aria-selected=true); exactly one at a time."

states:
  default: "Trigger: 1px --border, --card-bg; icon is a static ChevronDown (does not rotate)."
  hover: "Panel item highlights to --color-surface-variant (hover or keyboard nav)."
  focus: "Trigger focus / aria-expanded → --interactive border + 3px --color-focus-ring."
  disabled: "Trigger disabled/aria-disabled → surface-variant bg, on-disabled text, not-allowed."
  error: "Trigger aria-invalid=true → --color-error border, --color-error-ring on focus."

accessibility:
  roles: "Trigger is a button with aria-haspopup=listbox / aria-expanded; panel is role=listbox; items role=option; groups role=group."
  aria: [aria-haspopup=listbox, aria-expanded, aria-selected (chosen option), aria-invalid, aria-label/labelledby on trigger]
  focus: "Opening moves focus into the panel; closing returns it to the trigger; selected option checked."
  contrast: "Trigger, panel, and highlighted item meet AA in light + dark via surface/on-surface tokens."
keyboard:
  - {keys: "Enter / Space / ↓", action: "open the panel"}
  - {keys: "↑ / ↓", action: "move highlight between options"}
  - {keys: "Home / End", action: "first / last option"}
  - {keys: "type-ahead", action: "jump to an option by typing its start"}
  - {keys: "Enter", action: "select the highlighted option"}
  - {keys: "Escape", action: "close without changing selection"}
responsive:
  - "Trigger is full-width in a form field; keep a ≥ 44px tap height on coarse pointers."
  - "Long lists scroll inside the panel (max-height min(320px, 60vh)) with scroll buttons."

ux_principles:
  - "Show the current selection clearly on the trigger so state is never ambiguous (visibility of system status)."
  - "Keep option lists short and scannable — if users must hunt, switch to a searchable Combobox."
common_mistakes:
  - "Using Select for a long/unbounded list the user needs to search (use Combobox)."
  - "Using Select for 2–3 options that would be clearer as visible Radio buttons or a Segmented Button."
  - "No accessible name on the trigger."
  - "Relying on the styled panel near the viewport bottom (no collision flip) so it clips."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "options presented in a list, not recalled"}
  - {id: 1, name: "Visibility of system status", note: "trigger reflects the current choice; check marks the selected option"}
  - {id: 4, name: "Consistency and standards", note: "themed panel matches the DS across light/dark"}

relationships:
  related: [combobox, radio-group, segmented-button, dropdown-menu, input]
  replaces: ["legacy dropdowns / unstyled native selects where theming matters"]
  composed_with: [form, label, toolbar, dialog]
  not_to_confuse_with:
    - {component: combobox, why: "combobox filters by typing; select is a fixed pick-one list"}
    - {component: dropdown-menu, why: "dropdown-menu triggers actions; select captures a form value"}
    - {component: radio-group, why: "radio shows all options at once for a few choices"}

tokens:
  color: [--border, --card-bg, --text-primary, --interactive, --color-focus-ring, --color-error, --color-surface-container, --color-surface-variant, --color-outline-variant]
  radius: [--radius-md, --radius-sm]
  shadow: [--shadow-md]
  motion: [--duration-fast, --ease-default]

motion:
  enter: "The listbox panel (.select-content) animates in via @keyframes selectContentIn — opacity 0→1 + transform scale(.96) translateY(-2px)→none — a small fade+zoom from just below the trigger."
  exit: "none — the panel is hidden instantly via the [hidden] attribute (JS initSelect), with no data-state=closed animation. Gap vs. the motion.md overlay rule; flag to add a matching fade/scale-out on --duration-fast --ease-exit."
  stateChange: "Trigger focus-visible / aria-expanded: border→--interactive + 3px --color-focus-ring box-shadow (transitions on border-color + box-shadow). Item highlight (hover + keyboard nav): background→--color-surface-variant (no transition). Selected item check indicator: opacity 0→1 (instant)."
  duration: "--duration-fast (both the selectContentIn entrance and the trigger focus transition)"
  easing: "--ease-default"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (selectContentIn collapses to ~0, panel appears instantly). No component-specific override."
  constraints: "The entrance animates only opacity + transform (compositor-safe). Absolute positioning, no viewport-collision flip (accepted buildless simplification). Add a matching exit before treating the overlay motion as complete."
  relatedPatterns: [overlay-enter-exit, state-layer]

source:
  css: css/components/select.css
  classes: [select, select-trigger, select-value, select-icon, select-content, select-viewport, select-group, select-label, select-item, select-item-text, select-item-check, select-separator, select-scroll-up, select-scroll-down]
  react_wrapper: components/ui/select.tsx
  docs_anchor: c-select
---

## Correct usage

```html
<div class="select">
  <button class="select-trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Tipo de contrato">
    <span class="select-value" data-placeholder>Elegí una opción</span>
    <i data-lucide="chevron-down" class="select-icon"></i>
  </button>
  <div class="select-content" role="listbox" hidden>
    <div class="select-viewport">
      <div class="select-item" role="option">Full-time</div>
      <div class="select-item" role="option" aria-selected="true">Part-time<span class="select-item-check"><i data-lucide="check"></i></span></div>
    </div>
  </div>
</div>
```
*Why:* pick-one from a bounded list; trigger shows the value; selected option is checked.

## Incorrect usage

```html
<!-- ✕ Select for a long searchable list -->
<div class="select"><button class="select-trigger">Elegí un país…</button><!-- 190 options --></div>
```
*Fix:* a long, searchable list is a Combobox/Command, not a Select.

```html
<!-- ✕ Select for two options -->
<div class="select"><button class="select-trigger">Remoto / Presencial</button></div>
```
*Fix:* two visible choices read better as a Segmented Button or Radio Group.
