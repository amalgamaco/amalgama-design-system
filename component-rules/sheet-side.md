---
id: sheet-side
display_name: Side Sheet
aliases: [side sheet, side drawer, panel, sheet]
category: Overlays
status: stable
summary: An edge-anchored modal panel that slides in from a lateral (or top) edge for filters, item detail, or secondary forms — the desktop counterpart of the Bottom Sheet.
when_to_use:
  - "Filters or item detail alongside the current view on wide/desktop screens."
  - "Secondary forms or a properties panel that shouldn't take over the screen."
  - "Complementary content that accompanies the main view without navigating away."
when_not_to_use:
  - "Mobile/compact context → use a Bottom Sheet (sheet-bottom)."
  - "A centered task or destructive confirmation → use Dialog / Alert Dialog."
  - "A long multi-step flow or full page of content → use a dedicated page/route."
  - "Primary app navigation → use the app-shell Nav Bar / Nav Drawer."
use_cases:
  - "Panel de filtros de una lista de vacantes en desktop."
  - "Detalle rápido de un candidato sin salir del pipeline."
  - "Formulario secundario para editar propiedades de una vacante."
variants:
  - {name: right, class: sheet-content-right, purpose: "Right-anchored side sheet — the default for filters/detail (75vw, max 384px)."}
  - {name: left, class: sheet-content-left, purpose: "Left-anchored side sheet (same width contract)."}
  - {name: top, class: sheet-content-top, purpose: "Top-anchored panel; rounded bottom corners, max-height 80vh."}
  - {name: overlay, class: sheet-overlay, purpose: "The blocking scrim (modal); blurs and dims the background."}
  - {name: header, class: sheet-header, purpose: "Title + optional description; leaves room for the absolute close button."}
  - {name: body, class: sheet-body, purpose: "Scrollable content region (only the body scrolls)."}
  - {name: footer, class: sheet-footer, purpose: "Side sheets stack footer actions full-width (narrow-panel convention)."}
sizes:
  - {name: default, class: "(default)", use: "full height, 75vw capped at max-width 384px (sm:max-w-sm)"}
  - {name: narrow-viewport, class: "(≤ ~500px)", use: "may occupy nearly the full width when the viewport is very narrow"}
size_selection: "Keep it content-width (75vw, max 384px) — don't stretch it to half the screen unless the detail truly needs it. On narrow viewports it can take almost the full width; below the breakpoint prefer a Bottom Sheet."
content_rules:
  - "Header states the panel's purpose ('Filtros', 'Detalle de la vacante')."
  - "Footer: primary action + a secondary Cancel; on side sheets they stack full-width."
  - "Keep filters/detail scoped — if it becomes a full workflow, use a page."
layout_constraints:
  - "Anchored to a single edge (left/right full-height, or top); the panel coexists visually with the content behind the scrim."
  - "Header and footer stay fixed; only .sheet-body scrolls."
  - "One close affordance (X, top-right) plus the footer actions."
states:
  default: "Off-canvas (translateX(±100%) / translateY(-100%)); slides to 0 with .open."
  open: "Panel visible over the scrim; background inert."
  focus: "Focus moves into the sheet on open and returns to the trigger on close; focus-visible rings inside."
  closing: "Unmounts on close (no separate closing state — same approach as Dialog)."
accessibility:
  roles: "role=dialog with aria-modal=true; labelled by the sheet-title."
  aria: [aria-modal, aria-labelledby, "aria-label on sheet-close"]
  focus: "Focus trapped while open; Escape and scrim-click close; focus returns to the trigger. Fully operable by keyboard and footer buttons."
  contrast: "Scrim + surface tokens keep content contrast in light + dark."
keyboard:
  - {keys: "Escape", action: "close the sheet"}
  - {keys: "Tab / Shift+Tab", action: "cycle focus within the sheet (trapped)"}
  - {keys: "Enter", action: "activate the focused action"}
responsive:
  - "Use on wide/desktop screens; on mobile/compact migrate to a Bottom Sheet or full-screen."
  - "Bounded width (75vw, max 384px); on very narrow viewports it may occupy almost the full width."
  - "Top variant is height-bounded (80vh) with internal scroll."
ux_principles:
  - "Keep the user in context — a side panel lets them consult filters/detail without losing the underlying view."
  - "Always provide a visible exit — button, Escape, or scrim click."
common_mistakes:
  - "Using a Side Sheet on mobile where a Bottom Sheet is the ergonomic choice."
  - "Stretching the panel to half the screen when the content is a slim filter list."
  - "Using it for primary navigation instead of the app-shell drawer."
  - "Cramming a long multi-step flow into a side panel instead of a page."
nielsen_heuristics:
  - {id: 3, name: "User control and freedom", note: "clear close / Escape / scrim exit"}
  - {id: 1, name: "Visibility of system status", note: "scrim + slide signal a modal context"}
  - {id: 2, name: "Match between system and real world", note: "detail/filters stay next to the list they refine"}
relationships:
  related: [sheet-bottom, dialog, popover]
  replaces: ["legacy side-sheet / drawer for content panels"]
  composed_with: [button, form, chip, list]
  not_to_confuse_with:
    - {component: dialog, why: "Dialog is centered/modal; Side Sheet is edge-anchored filters/detail"}
    - {component: sheet-bottom, why: "Bottom Sheet is the mobile-first, bottom-anchored variant"}
    - {component: nav-drawer, why: "Nav Drawer is primary navigation, not a content panel"}
tokens:
  color: [--color-surface, --color-scrim, --color-on-surface-variant, --color-outline-variant]
  radius: ["0 0 16px 16px (top variant)"]
  motion: [--duration-sheet, --ease-emphasized]
  shadow: [--shadow-lg]
motion:
  enter: "Edge-anchored slide-in from the lateral edge: translateX(±100%→0) for right/left (top variant slides translateY(-100%→0)) when .open is added; the overlay scrim fades in."
  exit: "Symmetric slide-out as .open is removed — the panel then unmounts (same approach as Dialog: no distinct 'closing' state)."
  stateChange: "sheet-close hover → surface-variant background + on-surface color; only .sheet-body scrolls (header/footer stay fixed)."
  duration: "--duration-sheet (500ms — panel slide, symmetric in/out); --duration-fast (close-button hover). Overlay fadeIn is HARDCODED .15s."
  easing: "--ease-emphasized (panel slide — decelerate, NO overshoot, shared by all 4 sides); --ease-default (close-button hover). Overlay uses a HARDCODED `ease`."
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). The sheet appears/disappears without the slide and the scrim without the fade — there is no sheet-specific opt-back-in rule."
  constraints: "Animate transform/opacity only (translateX/Y + scrim opacity); never ease-expressive-* on a Sheet — a bounce reads as unnatural on a large panel (GOVERNANCE §20.2). Don't animate width/left/right/top."
  relatedPatterns: [edge-anchored-slide, overlay-fade]
source:
  css: css/components/sheet.css
  classes: [sheet-overlay, sheet-content, sheet-content-right, sheet-content-left, sheet-content-top, sheet-close, sheet-header, sheet-title, sheet-description, sheet-body, sheet-footer]
  react_wrapper: components/ui/sheet.tsx
  docs_anchor: c-side-sheet
---

## Correct usage

```html
<!-- Right-anchored side sheet: filters in desktop, visible exits -->
<div class="sheet-overlay">
  <div class="sheet-content sheet-content-right open" role="dialog" aria-modal="true" aria-labelledby="ss-title">
    <button class="sheet-close" aria-label="Cerrar">✕</button>
    <div class="sheet-header">
      <div class="sheet-title" id="ss-title">Filtros</div>
      <div class="sheet-description">Refiná la lista de vacantes.</div>
    </div>
    <div class="sheet-body">…</div>
    <div class="sheet-footer">
      <button class="btn-primary">Aplicar</button>
      <button class="btn-tertiary">Cancelar</button>
    </div>
  </div>
</div>
```
*Why:* edge-anchored modal for desktop filters; labelled title, visible exits, body scrolls.

## Incorrect usage

```html
<!-- ✕ Side sheet on mobile where the bottom edge is the reachable one -->
<div class="sheet-content sheet-content-right open">…filtros…</div>
```
*Fix:* on mobile/compact use `sheet-content-bottom` (Bottom Sheet).

```html
<!-- ✕ Stretched to half the viewport for a slim filter list -->
<div class="sheet-content sheet-content-right open" style="max-width:50vw">…</div>
```
*Fix:* keep the content-width contract (75vw / max 384px); widen only if the detail truly needs it.
