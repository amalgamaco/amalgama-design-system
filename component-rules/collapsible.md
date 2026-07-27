---
id: collapsible
display_name: Collapsible
aliases: [disclosure, show more, expander single]
category: Containment
status: stable
summary: A single show/hide region toggled by any trigger — a minimal disclosure with one boolean state.

when_to_use:
  - "Show/hide a single block under a trigger."
  - "'Ver más' / optional details."
  - "An expandable form section or an expandable table row."
when_not_to_use:
  - "Several grouped expandable sections with the same pattern → use Accordion (which can also enforce one-open-at-a-time)."
  - "Switching between views → use Tabs."
use_cases:
  - "'Ver requisitos' toggling a list of job requirements."
  - "Optional advanced fields under a 'Más opciones' toggle."

variants:
  - {name: base, class: collapsible, purpose: "The single show/hide region; the trigger can be any button."}
sizes:
  - {name: default, class: "(default)", use: "single size; content height animates via grid-rows"}
size_selection: "No size class — Collapsible is intentionally minimal and does not style the trigger."

content_rules:
  - "The trigger may be any element (a text link, an icon button, a plain button) — Collapsible imposes no trigger styling."
  - "The only style contract is the content height animation."
layout_constraints:
  - "Structure: collapsible > trigger (aria-expanded + aria-controls) + collapsible-content > collapsible-content-inner."
  - "Height animates via grid-template-rows 0fr→1fr (same technique as Accordion)."

states:
  default: "Collapsed: content grid-rows 0fr (data-state=closed)."
  focus: "Trigger focus-visible: 2px --color-focus outline."
  expanded: "aria-expanded=true, data-state=open, content grid-rows 1fr."

accessibility:
  roles: "Trigger is a button with aria-expanded and aria-controls pointing to the content region."
  aria: [aria-expanded, aria-controls, "aria-label when the trigger is icon-only"]
  focus: "Trigger is keyboard-focusable with a visible focus ring."
  contrast: "Consumes only semantic --color-* tokens → AA in light + dark, no per-theme overrides."
keyboard:
  - {keys: "Tab", action: "focus the trigger"}
  - {keys: "Enter / Space", action: "toggle the region open/closed"}
responsive:
  - "Works with variable-height content at any width via the grid-rows technique."

ux_principles:
  - "Progressive disclosure for a single optional block keeps the default view clean."
  - "Signal state on the trigger (aria-expanded + a visible affordance), not by content alone."
common_mistakes:
  - "Using a Collapsible for several sections that share a pattern (that's an Accordion)."
  - "Omitting aria-expanded/aria-controls on the trigger."
  - "Toggling display:none directly with no accessible state or animation."
nielsen_heuristics:
  - {id: 8, name: "Aesthetic and minimalist design", note: "hide one optional block until needed"}
  - {id: 3, name: "User control and freedom", note: "the user chooses to reveal or hide"}

relationships:
  related: [accordion, card, table]
  replaces: ["ad-hoc display:none toggles without transition or accessible state"]
  composed_with: [button, card, table]
  not_to_confuse_with:
    - {component: accordion, why: "Accordion is multiple stacked sections; Collapsible is a single region"}

tokens:
  color: [--color-primary, --color-focus]
  radius: [--radius-sm]
  motion: [--duration-normal, --ease-default]

source:
  css: css/components/collapsible.css
  classes: [collapsible, collapsible-trigger, collapsible-content, collapsible-content-inner]
  react_wrapper: components/ui/collapsible.tsx
  docs_anchor: c-collapsible
---

## Correct usage

```html
<div class="collapsible">
  <button type="button" class="btn-text" aria-expanded="false" aria-controls="col-1" onclick="collapsibleToggle(this)">Ver requisitos</button>
  <div class="collapsible-content" data-state="closed" id="col-1">
    <div class="collapsible-content-inner">5+ años de experiencia · Portfolio end-to-end · Inglés avanzado</div>
  </div>
</div>
```
*Why:* one region, any trigger, aria-expanded/aria-controls wired to the animated content.

## Incorrect usage

```html
<!-- ✕ Several sections grouped as separate Collapsibles -->
<div class="collapsible">…FAQ 1…</div>
<div class="collapsible">…FAQ 2…</div>
<div class="collapsible">…FAQ 3…</div>
```
*Fix:* use an `Accordion` for a grouped set of sections (it can also keep only one open).
