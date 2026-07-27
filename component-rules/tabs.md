---
id: tabs
display_name: Tabs
aliases: [tab bar, tabbed panels, tablist]
category: Navigation / Containment
status: stable
summary: Switch between mutually exclusive views of the same entity, showing one panel at a time.

when_to_use:
  - "Mutually exclusive categories of the same content."
  - "Alternative views of the same data (Lista / Kanban / Calendario)."
  - "Secondary navigation within a detail page."
when_not_to_use:
  - "Navigation between different pages/sections → use Navigation (sidebar)."
  - "More than 5–6 tabs → use lateral navigation or an Accordion."
  - "Content to be compared across tabs → show it in columns instead."
  - "Sequential steps → use a Stepper."
use_cases:
  - "Vacancy detail: General / Requisitos / Proceso."
  - "A dataset shown as Lista / Kanban / Calendario."

variants:
  - {name: underline, class: "tabs (default)", purpose: "Standard bottom-border tabs with the animated sliding indicator."}
  - {name: pill,      class: tabs-pill,      purpose: "Tonal container, active tab as an elevated surface (shadcn default TabsList). For a view switch prefer Segmented Button."}
  - {name: vertical,  class: tabs-vertical,  purpose: "Column layout with a static right-edge active border (no sliding bar)."}
sizes:
  - {name: default, class: "(default)", use: "single size; labels stay 1–2 words"}
size_selection: "One size; use fixed distribution for few tabs, horizontal scroll for many — never stack or truncate."

content_rules:
  - "Short labels (1–2 words)."
  - "Icons in all tabs or in none — never mixed."
  - "Reflect the active tab in the URL when possible."
layout_constraints:
  - "Place the tab bar at the top of the content area it controls, below the title/app bar; the active panel appears immediately below."
  - "One active tab at a time; each panel's content is independent (no dependencies between tabs)."
  - "Do not nest tabs (max one level)."

states:
  default: "Inactive tab: on-surface-variant text."
  hover: "Text darkens to on-surface."
  focus: "focus-visible: 2px --color-focus outline + 4px --color-focus-ring halo, distinct from hover."
  active: "--color-secondary text + weight 600 + the sliding indicator (never --color-primary, which inverts to white in dark)."
  disabled: "opacity .4, no pointer events."

accessibility:
  roles: "WAI-ARIA Tabs: role=tablist / role=tab / role=tabpanel."
  aria: ["aria-selected=true on the active tab", "aria-controls linking tab→panel", "aria-labelledby linking panel→tab", "hidden on inactive panels", "roving tabindex (active tab tabindex=0, others -1)"]
  focus: "Roving tabindex; the active state adds a 2px bottom border + medium weight, not color alone."
  contrast: "--color-on-surface-variant / --color-secondary meet AA in light + dark; never override per theme."
keyboard:
  - {keys: "Arrow Left / Right", action: "move focus (and selection) between tabs"}
  - {keys: "Home / End", action: "focus the first / last tab"}
  - {keys: "Enter / Space", action: "activate the focused tab"}
  - {keys: "Tab", action: "move focus into the active panel"}
responsive:
  - "Fixed: few tabs share the width equally. Scrollable: many tabs scroll horizontally rather than stacking or truncating."

ux_principles:
  - "Tabs organize one entity's content; they are not app navigation (Jakob's law — match the mental model)."
  - "Only one panel visible keeps focus; if users must compare, tabs are the wrong pattern."
common_mistakes:
  - "Using tabs for page-level navigation."
  - "More than 5–6 tabs in one bar."
  - "Using --color-primary for the active state (disappears in dark mode)."
  - "Nesting tabs, or mixing icon and text-only tabs."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "the indicator shows the current view"}
  - {id: 4, name: "Consistency and standards", note: "standard WAI-ARIA tabs behavior and keyboard model"}
  - {id: 7, name: "Flexibility and efficiency of use", note: "arrow-key roving navigation between tabs"}

relationships:
  related: [segmented-button, accordion, navigation-menu]
  replaces: ["legacy tab bars"]
  composed_with: [card, table, page-header]
  not_to_confuse_with:
    - {component: segmented-button, why: "Segmented switches a compact view/mode; Tabs organize panels of content"}
    - {component: navigation-menu, why: "Navigation moves between pages; Tabs stay within one page"}
    - {component: accordion, why: "Accordion stacks expandable sections; Tabs show one panel at a time"}

tokens:
  color: [--color-on-surface-variant, --color-on-surface, --color-secondary, --border, --color-focus, --color-focus-ring]
  radius: [--radius-md, --radius-sm]
  motion: [--duration-fast, --duration-normal, --ease-default, --ease-expressive]

motion:
  enter: "none — tab panels swap via display none/block (.tab-panel / .tab-panel.active); the incoming panel appears instantly with no entrance animation."
  exit: "none — the outgoing panel is hidden instantly (display:none)."
  stateChange: "The sliding .tab-indicator glides to the active tab, transitioning transform + width (var(--duration-normal) var(--ease-expressive)) — positioned per-tab by JS via offsetLeft/offsetWidth. Tab labels transition color on hover/active/selected (var(--duration-fast) var(--ease-default))."
  duration: "--duration-normal (indicator slide), --duration-fast (label color)"
  easing: "--ease-expressive (indicator — spatial move with overshoot), --ease-default (label color effect)"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). The indicator jumps to the active tab instantly; selection stays clear via aria-selected + the active label weight/color."
  constraints: "Indicator animates transform + width — width is a layout property but scoped to a 2px bar, an accepted exception. Panels are display-toggled (no fade), so there is no entrance/exit motion to reduce. The pill (.tabs-pill) and vertical (.tabs-vertical) variants hide the sliding indicator and use a static active surface/border instead. Keep the indicator on Expressive (spatial) and the label color on Standard (effect)."
  relatedPatterns: ["Hierarchy — the moving indicator directs attention to the active view (motion.md)", "Standard-vs-Expressive split (spatial indicator vs. effect label color)"]

source:
  css: css/components/tabs.css
  classes: [tabs, tab, tab-indicator, tab-panel, tabs-pill, tabs-vertical]
  react_wrapper: components/ui/tabs.tsx
  docs_anchor: c-tabs
---

## Correct usage

```html
<div class="tabs" role="tablist">
  <button class="tab active" role="tab" aria-selected="true" id="tab-general" aria-controls="panel-general">General</button>
  <button class="tab" role="tab" aria-selected="false" id="tab-req" aria-controls="panel-req" tabindex="-1">Requisitos</button>
  <span class="tab-indicator"></span>
</div>
<div class="tab-panel active" id="panel-general" role="tabpanel" aria-labelledby="tab-general">…</div>
<div class="tab-panel" id="panel-req" role="tabpanel" aria-labelledby="tab-req" hidden>…</div>
```
*Why:* full WAI-ARIA wiring, roving tabindex, one active panel, indicator marks selection.

## Incorrect usage

```html
<!-- ✕ Tabs used to navigate between pages -->
<div class="tabs" role="tablist">
  <button class="tab" onclick="location='/vacantes'">Vacantes</button>
  <button class="tab" onclick="location='/candidatos'">Candidatos</button>
</div>
```
*Fix:* use the sidebar Navigation for cross-page navigation; keep Tabs for views within one page.

```html
<!-- ✕ Active state via --color-primary -->
<button class="tab" style="color:var(--color-primary)">General</button>
```
*Fix:* use the `.active` class (`--color-secondary`); primary inverts to white in dark mode.
