---
id: sheet-bottom
display_name: Bottom Sheet
aliases: [bottom sheet, drawer bottom, action sheet]
category: Overlays
status: stable
summary: An edge-anchored modal panel that slides up from the bottom for quick actions or supplementary content — the preferred overlay on mobile/compact.
when_to_use:
  - "Quick actions or an option list surfaced from the bottom on mobile/compact viewports."
  - "Secondary content that doesn't justify a whole screen but needs focused attention."
  - "A short contextual task the user resolves without leaving the current screen."
when_not_to_use:
  - "Wide/desktop viewports with room to the side → use a Side Sheet (sheet-side)."
  - "A centered task or destructive confirmation → use Dialog / Alert Dialog."
  - "A long multi-step flow or a full page of content → use a dedicated page/route."
  - "Primary app navigation → use the app-shell Nav Bar / Nav Drawer."
  - "Transient, non-blocking feedback → use Snackbar."
use_cases:
  - "Menú de acciones sobre una vacante en mobile ('Editar', 'Cerrar', 'Duplicar')."
  - "Selección rápida de un filtro en una lista de candidatos en pantalla chica."
  - "Formulario corto de una sola decisión en compacto."
variants:
  - {name: bottom, class: sheet-content-bottom, purpose: "The bottom-anchored panel (side=\"bottom\"); full-width on mobile, centered max-w-lg on ≥640px."}
  - {name: overlay, class: sheet-overlay, purpose: "The blocking scrim (modal); blurs and dims the background."}
  - {name: header, class: sheet-header, purpose: "Title + optional description; leaves room for the absolute close button."}
  - {name: body, class: sheet-body, purpose: "Scrollable content region (only the body scrolls)."}
  - {name: footer, class: sheet-footer, purpose: "Trailing-aligned action row (row-reverse, like Dialog) for bottom/top sheets."}
sizes:
  - {name: default, class: "(default)", use: "content-sized, max-height 80vh with internal scroll"}
  - {name: desktop-centered, class: "(≥640px)", use: "auto-margined, capped at max-width 512px (sm:max-w-lg)"}
size_selection: "Keep it content-sized with an 80vh cap; go full-screen only if the task genuinely demands it. On ≥640px it self-centers and caps width — do not stretch it edge-to-edge on desktop."
content_rules:
  - "Header states the task as a short title; description gives one line of context."
  - "Footer: one primary action + a secondary Cancel (Cancel = btn-tertiary/secondary, never dominant)."
  - "Keep it to a single focused task; if it grows, promote it to a page."
layout_constraints:
  - "Anchored to the bottom edge, rounded top corners (16px), full-width on mobile."
  - "Header and footer stay fixed; only .sheet-body scrolls."
  - "One close affordance (X, top-right) plus the footer actions."
states:
  default: "Off-canvas (translateY(100%)); slides to 0 with .open."
  open: "Panel visible over the scrim; background inert."
  focus: "Focus moves into the sheet on open and returns to the trigger on close; focus-visible rings inside."
  closing: "Unmounts on close (no separate closing state — same approach as Dialog)."
accessibility:
  roles: "role=dialog with aria-modal=true; labelled by the sheet-title."
  aria: [aria-modal, aria-labelledby, "aria-label on sheet-close"]
  focus: "Focus trapped while open; Escape and scrim-click close; focus returns to the trigger. Fully operable by keyboard and footer buttons — never gesture-only."
  contrast: "Scrim + surface tokens keep content contrast in light + dark."
keyboard:
  - {keys: "Escape", action: "close the sheet"}
  - {keys: "Tab / Shift+Tab", action: "cycle focus within the sheet (trapped)"}
  - {keys: "Enter", action: "activate the focused action"}
responsive:
  - "Preferred pattern on mobile/compact; on wider viewports prefer a Side Sheet or Dialog."
  - "Full-width on mobile; self-centers and caps at 512px on ≥640px."
  - "Bounded height (80vh) with internal scroll — never let the panel exceed the viewport."
ux_principles:
  - "Anchor supplementary tasks to the bottom edge so they're within thumb reach on mobile (Fitts's law)."
  - "Always provide a visible exit — button, Escape, or scrim click — never depend on a swipe."
common_mistakes:
  - "Using a Bottom Sheet on desktop where a Side Sheet or Dialog fits better."
  - "Dismiss only by swipe with no visible close control."
  - "Cramming a long multi-step flow into a bottom sheet instead of a page."
  - "Making Cancel visually dominant over the primary action."
nielsen_heuristics:
  - {id: 3, name: "User control and freedom", note: "clear close / Escape / scrim exit"}
  - {id: 1, name: "Visibility of system status", note: "scrim + slide signal a modal context"}
  - {id: 8, name: "Aesthetic and minimalist design", note: "one focused task, not a crowded panel"}
relationships:
  related: [sheet-side, dialog, snackbar]
  replaces: ["legacy bottom-sheet / action-sheet"]
  composed_with: [button, form, list]
  not_to_confuse_with:
    - {component: dialog, why: "Dialog is centered/modal; Bottom Sheet is edge-anchored, mobile-first"}
    - {component: sheet-side, why: "Side Sheet anchors to a lateral edge for desktop filters/detail"}
    - {component: nav-drawer, why: "Nav Drawer is primary navigation, not a content panel"}
tokens:
  color: [--color-surface, --color-scrim, --color-on-surface-variant, --color-outline-variant]
  radius: ["16px top corners"]
  motion: [--duration-sheet, --ease-emphasized]
  shadow: [--shadow-lg]
source:
  css: css/components/sheet.css
  classes: [sheet-overlay, sheet-content, sheet-content-bottom, sheet-close, sheet-header, sheet-title, sheet-description, sheet-body, sheet-footer]
  react_wrapper: components/ui/sheet.tsx
  docs_anchor: c-bottom-sheet
---

## Correct usage

```html
<!-- Bottom sheet: quick actions on mobile, visible exits -->
<div class="sheet-overlay">
  <div class="sheet-content sheet-content-bottom open" role="dialog" aria-modal="true" aria-labelledby="bs-title">
    <button class="sheet-close" aria-label="Cerrar">✕</button>
    <div class="sheet-header">
      <div class="sheet-title" id="bs-title">Acciones de la vacante</div>
      <div class="sheet-description">Elegí qué hacer con “Desarrollador Frontend”.</div>
    </div>
    <div class="sheet-body">…</div>
    <div class="sheet-footer">
      <button class="btn-primary">Aplicar</button>
      <button class="btn-tertiary">Cancelar</button>
    </div>
  </div>
</div>
```
*Why:* edge-anchored modal, labelled title, visible close + footer exits, body scrolls.

## Incorrect usage

```html
<!-- ✕ Bottom sheet used for a centered destructive confirmation -->
<div class="sheet-overlay"><div class="sheet-content sheet-content-bottom open">¿Eliminar la vacante?</div></div>
```
*Fix:* a blocking decision belongs in an Alert Dialog (centered, non-dismissible).

```html
<!-- ✕ No visible close, swipe-only dismissal -->
<div class="sheet-content sheet-content-bottom open"><div class="sheet-body">…</div></div>
```
*Fix:* add a `sheet-close` and/or footer button — never gesture-only.
