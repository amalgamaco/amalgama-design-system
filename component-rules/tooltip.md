---
id: tooltip
display_name: Tooltip
aliases: [hint, hover label, rich tooltip, hover card]
category: Feedback
status: stable
summary: A small hover/focus text label that clarifies an ambiguous control — plus a click-triggered Rich Tooltip for a title + text + action preview. Never for essential information.
when_to_use:
  - "Clarify an unlabeled icon or control with a short, complementary hint (plain Tooltip)."
  - "Reinforce a control that already has clear focus/hover, without adding permanent chrome."
  - "Show a small preview with a title, supporting text and one action on a trigger (Rich Tooltip)."
when_not_to_use:
  - "Essential information the user must have → put it in the UI, not behind hover."
  - "Interactive content, forms, or a list of actions → use Popover / Dropdown Menu."
  - "A one-off native browser hint → replaces title=… but for richer content use a Popover."
  - "Elements with no focus/hover trigger → hover doesn't exist on touch and isn't keyboard-reachable."
use_cases:
  - "Icon-only toolbar button ('Ajustes', 'Más opciones') gets a plain tooltip."
  - "A '?' next to 'Vacante' opening a Rich Tooltip that defines the term + a 'Saber más' link."
  - "Explaining a truncated metric label on hover/focus."
variants:
  - {name: plain,        class: "tooltip-content + tooltip-{top,bottom,left,right}", purpose: "Short text label, hover/focus-triggered, no actions, wrapped in .tooltip-wrap."}
  - {name: rich,         class: "rich-tooltip-content + rich-tooltip-{top,bottom,left,right}", purpose: "Click/focus-triggered surface with title + subtitle + optional action row; own open/close state (.open)."}
sizes:
  - {name: plain, class: "(default)", use: "single-line label; white-space:nowrap"}
  - {name: rich,  class: rich-tooltip-content, use: "max-width 280px, title + body + actions"}
size_selection: "If the content is one line of text → plain Tooltip. If it needs a title, body, or an action → Rich Tooltip. If it's larger/arbitrary → a Popover or Sheet."
content_rules:
  - "Plain tooltip text is one line, complementary, and never repeats what the UI already says."
  - "Rich tooltip: heading title + short supporting body + at most a small action/link row."
  - "Never place the only copy of critical information in a tooltip."
layout_constraints:
  - "Positioned by side (top/bottom/left/right) at a 6px offset from the trigger, CSS-only."
  - "KNOWN LIMITATION: no viewport-edge collision flip — a tooltip near a screen edge does not auto-reposition (accepted buildless simplification)."
  - "Must not cover the control it describes."
states:
  default: "Hidden (opacity 0, pointer-events none)."
  hover: "Plain tooltip fades in after a ~400–500ms hover-intent delay; hides instantly on leave."
  focus: "Plain tooltip shows immediately on keyboard focus (:focus-within)."
  open: "Rich tooltip toggles .open on click/Enter; pointer can enter to read or use its actions."
accessibility:
  roles: "Plain: role=tooltip associated to the trigger via aria-describedby. Rich: role=dialog, opened by click/Enter."
  aria: [aria-describedby (plain, links trigger→tooltip), "role=tooltip (plain)", "role=dialog (rich)"]
  focus: "Plain shows on :focus-within of the wrap. Rich traps focus while open, closes on Esc / outside click, returns focus to the trigger."
  contrast: "Plain text on inverse-surface and rich text on surface-container meet AA in light + dark."
keyboard:
  - {keys: "Tab (focus trigger)", action: "reveal a plain tooltip immediately"}
  - {keys: "Enter / Space", action: "open/close a Rich Tooltip"}
  - {keys: "Escape", action: "close the Rich Tooltip (and dismiss a focused plain tooltip)"}
responsive:
  - "Touch has no hover — never gate essential info on a tooltip; provide it another way."
  - "Rich Tooltip's click trigger works on touch; plain hover tooltips do not."
ux_principles:
  - "Tooltips supplement, never substitute — the interface must be usable with them all removed."
  - "Hover-intent delay avoids flicker; focus reveals instantly so keyboard users aren't penalized."
common_mistakes:
  - "Hiding required information behind hover (invisible on touch)."
  - "Putting interactive/extensive content in a plain tooltip (use Rich Tooltip or Popover)."
  - "Instantiating a TooltipProvider per tooltip instead of once in the tree (React wrapper)."
  - "Assuming edge collision is handled — it isn't; place tooltips where they won't clip."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "clarifies an icon without forcing the user to remember it"}
  - {id: 8, name: "Aesthetic and minimalist design", note: "keeps supplementary info out of the way until needed"}
  - {id: 10, name: "Help and documentation", note: "Rich Tooltip offers a just-in-time definition + link"}
relationships:
  related: [popover, dialog, rich-tooltip]
  replaces: ["native title= attribute", "ad-hoc hover libraries", "a separate Hover Card (dropped — Rich Tooltip covers it)"]
  composed_with: [button, chip, avatar]
  not_to_confuse_with:
    - {component: popover, why: "Popover holds interactive/arbitrary content; tooltip is a passive label/preview"}
    - {component: dialog, why: "Dialog is modal/blocking; tooltip never blocks"}
tokens:
  color: [--color-inverse-surface, --color-inverse-on-surface, --color-surface-container, --color-on-surface]
  radius: [--radius-sm, --radius-md]
  motion: [--duration-fast, "0.4s hover-intent delay"]
source:
  css: [css/components/tooltip.css, css/components/rich-tooltip.css]
  classes: [tooltip-wrap, tooltip-content, tooltip-top, tooltip-bottom, tooltip-left, tooltip-right, rich-tooltip-wrap, rich-tooltip-content, rich-tooltip-row, rich-tooltip-body, rich-tooltip-title, rich-tooltip-subtitle, rich-tooltip-close, rich-tooltip-actions]
  react_wrapper: components/ui/tooltip.tsx
  docs_anchor: c-tooltip
---

## Correct usage

```html
<!-- Plain tooltip: clarifies an icon-only control, associated via aria-describedby -->
<span class="tooltip-wrap">
  <button class="icon-btn" aria-describedby="tt-ajustes"><i data-lucide="settings"></i></button>
  <span class="tooltip-content tooltip-top" role="tooltip" id="tt-ajustes">Ajustes</span>
</span>
```
*Why:* short supplementary label, shows on hover and on keyboard focus, described-by wired.

```html
<!-- Rich tooltip: title + body + action, click-triggered, own open state -->
<span class="rich-tooltip-wrap">
  <button class="icon-btn" aria-label="¿Qué es una vacante?"><i data-lucide="help-circle"></i></button>
  <div class="rich-tooltip-content rich-tooltip-top" role="dialog">
    <div class="rich-tooltip-row">
      <div class="rich-tooltip-body">
        <p class="rich-tooltip-title">Vacante</p>
        <p class="rich-tooltip-subtitle">Una posición abierta dentro de una búsqueda.</p>
      </div>
      <button class="rich-tooltip-close" aria-label="Cerrar">✕</button>
    </div>
    <div class="rich-tooltip-actions"><button class="btn-text btn-sm">Saber más</button></div>
  </div>
</span>
```
*Why:* richer preview with a link needs the click-triggered, focus-managed Rich Tooltip.

## Incorrect usage

```html
<!-- ✕ Essential info hidden behind hover -->
<span class="tooltip-wrap">
  <span>Precio</span>
  <span class="tooltip-content tooltip-top" role="tooltip">USD 1.200 / mes</span>
</span>
```
*Fix:* show the price in the UI; tooltips vanish on touch and aren't guaranteed discoverable.

```html
<!-- ✕ Interactive form crammed into a plain tooltip -->
<span class="tooltip-content tooltip-top" role="tooltip">
  <input placeholder="Email"><button>Enviar</button>
</span>
```
*Fix:* interactive content belongs in a Popover (or Rich Tooltip for a single small action).
