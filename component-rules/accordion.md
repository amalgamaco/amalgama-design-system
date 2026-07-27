---
id: accordion
display_name: Accordion
aliases: [expander, collapsible sections, faq]
category: Containment
status: stable
summary: Vertically stacked, expandable sections that reveal or hide long content to keep a dense view scannable.

when_to_use:
  - "FAQs and long reference content."
  - "Grouping optional details that not everyone needs."
  - "Reducing scroll in dense forms/panels."
when_not_to_use:
  - "Navigating between views → use Tabs."
  - "A single show/hide block → use Collapsible."
  - "Critical content that must always be visible → show it inline."
use_cases:
  - "FAQ list on a help page."
  - "Advanced filters grouped into expandable sections."
  - "Optional detail sections in a dense vacancy form."

variants:
  - {name: single,   class: "accordion (default)", purpose: "One section open at a time — the default; keeps focus on FAQs."}
  - {name: multiple, class: "accordion (multi via JS)", purpose: "Several sections open at once — for comparing or configuring."}
  - {name: disabled, class: "accordion-trigger:disabled", purpose: "A section unavailable in the current context — visible but inert."}
  - {name: bordered, class: accordion-bordered, purpose: "The whole accordion in a bordered, rounded container — a contained block on a dense page."}
  - {name: card,     class: "card > card-content > accordion", purpose: "The accordion as a titled unit inside a Card (composition, no dedicated class)."}
sizes:
  - {name: default, class: "(default)", use: "single size; content height animates via grid-rows"}
size_selection: "One accordion, one style — do not mix plain rows and cards in the same list."

content_rules:
  - "Trigger label is a short question or section name; the chevron indicates open/closed."
  - "Keep the panel content scannable; the chevron rotates on open (not color alone)."
layout_constraints:
  - "Structure: accordion > accordion-item > h3 > button.accordion-trigger + accordion-content > accordion-content-inner."
  - "Bordered/Card variants are style-only — they don't change roles, aria-*, or focus order."
  - "Height animates via grid-template-rows 0fr→1fr (no JS scrollHeight measurement)."

states:
  default: "Collapsed: content grid-rows 0fr, chevron down."
  hover: "Trigger underlines (canonical interaction, not a color change)."
  focus: "focus-visible: 2px --color-focus outline + 4px --color-focus-ring halo."
  expanded: "aria-expanded=true, content grid-rows 1fr, chevron rotated 180deg."
  disabled: "Trigger disabled: opacity .5, out of focus order, inert."

accessibility:
  roles: "Each trigger is a real <button> with aria-expanded and aria-controls pointing to its panel (role=region)."
  aria: [aria-expanded, aria-controls, "role=region on the panel", "disabled attribute for a disabled item"]
  focus: "Tab between triggers; the open state adds chevron rotation, not color only. A disabled item uses the button's disabled attribute (out of focus order)."
  contrast: "Consumes only semantic --color-*/--text-* tokens → AA in light + dark with no per-theme overrides."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "move focus between triggers"}
  - {keys: "Enter / Space", action: "expand / collapse the focused section"}
responsive:
  - "Works with variable-height content at any width via the grid-rows technique."

ux_principles:
  - "Progressive disclosure — hide secondary detail until asked, reducing cognitive load."
  - "Show open/closed with more than color (chevron rotation) for perceivability."
common_mistakes:
  - "Using an Accordion for navigation (that's Tabs)."
  - "Using an Accordion for a single show/hide block (that's Collapsible)."
  - "Hiding critical content behind a collapsed section."
  - "Mixing plain and card styles in one accordion."
nielsen_heuristics:
  - {id: 8, name: "Aesthetic and minimalist design", note: "progressive disclosure keeps the view uncluttered"}
  - {id: 4, name: "Consistency and standards", note: "one accordion, one style; standard disclosure pattern"}
  - {id: 7, name: "Flexibility and efficiency of use", note: "single vs multiple open modes for compare vs focus"}

relationships:
  related: [collapsible, tabs, card]
  replaces: ["custom stacked 'ver más' blocks without a shared pattern"]
  composed_with: [card]
  not_to_confuse_with:
    - {component: collapsible, why: "Collapsible is a single region; Accordion is multiple stacked sections"}
    - {component: tabs, why: "Tabs switch views; Accordion stacks disclosable content"}

tokens:
  color: [--border, --text-primary, --text-secondary, --color-focus, --color-focus-ring]
  radius: [--radius-lg, --radius-sm]
  spacing: ["16px trigger padding", "16px pb spacer"]
  motion: [--duration-normal, --duration-fast, --ease-default, --ease-expressive]

source:
  css: css/components/accordion.css
  classes: [accordion, accordion-item, accordion-trigger, accordion-chevron, accordion-content, accordion-content-inner, accordion-bordered]
  react_wrapper: components/ui/accordion.tsx
  docs_anchor: c-accordion
---

## Correct usage

```html
<div class="accordion">
  <div class="accordion-item">
    <h3>
      <button class="accordion-trigger" aria-expanded="false" aria-controls="acc-1" onclick="accToggle(this)">
        ¿Cómo aplico a una vacante?
        <svg class="accordion-chevron" viewBox="0 0 24 24">…</svg>
      </button>
    </h3>
    <div class="accordion-content" data-state="closed" id="acc-1" role="region">
      <div class="accordion-content-inner">Completá tu perfil y hacé clic en Postularme.</div>
    </div>
  </div>
</div>
```
*Why:* real button trigger with aria-expanded/aria-controls; panel is a region; chevron signals state.

## Incorrect usage

```html
<!-- ✕ One-off show/hide dressed as an accordion -->
<div class="accordion"><div class="accordion-item">…solo un bloque…</div></div>
```
*Fix:* a single region is a `Collapsible`, not an Accordion.

```html
<!-- ✕ Disabled section hidden instead of shown inert -->
<!-- (section removed from the DOM when unavailable) -->
```
*Fix:* keep it visible with a `disabled` trigger so the structure stays predictable.
