---
id: slider
display_name: Slider
aliases: [range, range slider, track]
category: Forms
status: stable
summary: Selects a value (or a range) within a continuum with immediate feedback — for values where the exact number matters little.

when_to_use:
  - "Picking an approximate value on a continuous scale (volume, brightness, zoom)."
  - "Filtering by a numeric range where both bounds are adjustable (salary min–max)."
  - "Any value where dragging with live feedback beats typing an exact number."
when_not_to_use:
  - "A precise value the user must type exactly (an amount, an age) → use a numeric Input."
  - "A small set of discrete labelled choices → use Radio Group or Segmented Button."
  - "A binary on/off → use Switch."
use_cases:
  - "Filtro de vacantes: rango de sueldo 'de $X a $Y' (modo rango)."
  - "Ajuste de tolerancia de match (0–100%)."

variants:
  - {name: single, class: slider, purpose: "One thumb — select a single value."}
  - {name: range, class: "slider (two stacked .slider-input)", purpose: "Two thumbs — select a min/max range; each thumb re-enables pointer-events on itself."}
  - {name: vertical, class: slider-vertical, purpose: "Vertical orientation (writing-mode:vertical) — tall, narrow track (par shadcn orientation=vertical)."}
sizes:
  - {name: md, class: "(default)", use: "the only size; 20px thumb, 4px track"}
size_selection: "Single size by design; density comes from the surrounding layout, not a size variant."

content_rules:
  - "Pair the slider with a visible readout of the current value(s) — the number the thumb represents."
  - "Range mode must label which thumb is min and which is max (aria-label per input)."
layout_constraints:
  - "The active .slider-range fill and thumb position must reflect the input value (set width/height inline or via JS)."
  - "Give the slider a visible track the full width/height of its container; don't shrink it below a draggable size."

states:
  default: "Track --color-surface-variant, active range + thumb --color-primary."
  hover: "Thumb gains a focus-ring halo (--color-focus-ring) on hover."
  focus: "focus-visible thumb halo (--color-focus-ring)."
  disabled: "Container [data-disabled] → 40% opacity, not-allowed thumb cursor."

accessibility:
  roles: "Native <input type=\"range\"> → role=\"slider\" with aria-valuemin/max/now free from the browser."
  aria: [role=slider, aria-valuemin, aria-valuemax, aria-valuenow, "aria-label per thumb (range mode)"]
  focus: "Each thumb is a native focus stop; drag, keyboard, and focus semantics come from the browser."
  contrast: "Active range vs inactive track distinguishable in light + dark via primary vs surface-variant."
keyboard:
  - {keys: "Arrow keys (←/→ or ↑/↓)", action: "increment / decrement by step"}
  - {keys: "Home / End", action: "jump to min / max"}
  - {keys: "Page Up / Page Down", action: "large step"}
  - {keys: "Tab", action: "move focus between thumbs / off the slider"}
responsive:
  - "touch-action:none keeps drag smooth on touch; keep the thumb ≥ 20px (≈44px hit area) for coarse pointers."
  - "Use slider-vertical only where a tall control genuinely fits; horizontal is the default on narrow screens."

ux_principles:
  - "Sliders trade precision for speed — only use them where an approximate value is acceptable."
  - "Always echo the chosen value as text so the user knows exactly what they set (visibility of system status)."
common_mistakes:
  - "Using a slider where an exact value is required (should be a numeric Input)."
  - "No visible value readout, leaving the user guessing the exact number."
  - "Rebuilding a slider with a <div> + drag handlers instead of the native <input type=range>."
  - "Range mode without per-thumb aria-labels for min and max."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "live value readout reflects the thumb position"}
  - {id: 3, name: "User control and freedom", note: "drag or keyboard, freely adjustable in both directions"}
  - {id: 7, name: "Flexibility and efficiency of use", note: "keyboard steps + Home/End for fast, precise-enough adjustment"}

relationships:
  related: [input, radio-group, progress]
  replaces: ["custom <div> + drag-handler sliders"]
  composed_with: [form, toolbar, label]
  not_to_confuse_with:
    - {component: progress, why: "progress is read-only status; slider is an interactive input"}
    - {component: input, why: "input captures exact typed values; slider is approximate"}

tokens:
  color: [--color-primary, --color-surface-variant, --color-focus-ring, --card-bg]
  radius: [--radius-full]
  shadow: [--shadow-sm]
  motion: [--duration-fast, --ease-default]

motion:
  enter: "none — the control is always present"
  exit: "none"
  stateChange: "On hover (not disabled) and focus-visible the thumb grows a 4px --color-focus-ring halo — a box-shadow effect (transition: box-shadow). The track fill (.slider-range) and thumb position update via inline style/JS as the user drags and are NOT transitioned — they track the pointer 1:1."
  duration: "--duration-fast"
  easing: "--ease-default"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). No looping/essential motion; the focus halo still appears, just without the fade."
  constraints: "Only box-shadow transitions. Never add a transition to .slider-range width/height or the thumb position — the fill must follow the drag with zero lag. Effect-only, Standard easing; no overshoot."
  relatedPatterns: ["motion.md → Hover & press micro-interactions (focus/hover shadow = effect, Standard easing)"]

source:
  css: css/components/slider.css
  classes: [slider, slider-track, slider-range, slider-input, slider-vertical]
  react_wrapper: components/ui/slider.tsx
  docs_anchor: c-slider
---

## Correct usage

```html
<!-- Single value with a readout -->
<label class="label" for="tol">Tolerancia de match: <strong>70%</strong></label>
<div class="slider">
  <div class="slider-track"></div>
  <div class="slider-range" style="width:70%"></div>
  <input type="range" id="tol" class="slider-input" min="0" max="100" value="70" aria-label="Tolerancia de match">
</div>
```
*Why:* approximate value, live readout, native range input gives keyboard + drag for free.

## Incorrect usage

```html
<!-- ✕ Slider for a value that must be exact -->
<div class="slider"><input type="range" class="slider-input" min="0" max="100000" value="52000"></div>
```
*Fix:* an exact salary is a numeric Input; a slider can't hit a precise figure reliably.

```html
<!-- ✕ Range mode with no per-thumb labels -->
<div class="slider">
  <input type="range" class="slider-input" value="20">
  <input type="range" class="slider-input" value="80">
</div>
```
*Fix:* add aria-label="Mínimo" / "Máximo" and a visible value readout for each thumb.
