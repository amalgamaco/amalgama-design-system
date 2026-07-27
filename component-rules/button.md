---
id: button
display_name: Button
aliases: [btn, cta, action button]
category: Actions
status: stable
summary: Triggers an action. Chosen by hierarchy (color) and density (size); exactly one primary action per context.

when_to_use:
  - "The user performs an action: submit, create, save, delete, open an overlay, advance a step."
  - "You need clear action hierarchy on a screen (one main action + alternatives)."
when_not_to_use:
  - "Navigation between pages/views → use a link or nav item, not a button."
  - "Selecting/filtering from a set of options → use Chip (filter) or Segmented Button."
  - "Toggling a single on/off or bold-style state → use Toggle / Toggle Group."
  - "A row of many equal-weight actions → introduce hierarchy (one btn-primary + btn-secondary/tertiary), do not flatten."
use_cases:
  - "Form submit / cancel footer."
  - "Primary page CTA (e.g. 'Crear vacante')."
  - "Opening a Dialog/Sheet (trigger = btn-secondary/tonal by convention)."
  - "Destructive confirmation (btn-primary btn-danger inside an Alert Dialog)."

variants:
  - {name: primary,   class: btn-primary,   purpose: "The single most important action of a context (filled)."}
  - {name: elevated,  class: btn-elevated,  purpose: "Tonal + real elevation; primary-container surface that needs to lift off busy backgrounds (MD3 elevated button)."}
  - {name: secondary, class: btn-secondary, purpose: "Tonal; equal-weight alternative actions and default overlay triggers."}
  - {name: tertiary,  class: btn-tertiary,  purpose: "Outlined; lower-emphasis actions. Alias: btn-ghost."}
  - {name: text,      class: btn-text,      purpose: "Lowest emphasis; inline actions inside dense content."}
  - {name: icon,      class: icon-btn,      purpose: "Icon-only action; requires aria-label."}
  - {name: danger,    class: btn-danger,    purpose: "Modifier (compose with btn-primary/tertiary) for destructive actions — Error tokens."}
  - {name: success,   class: btn-success,   purpose: "Modifier for positive-confirm actions where semantics help."}
sizes:
  - {name: xs, class: btn-xs, use: "very dense toolbars / inline chips of actions"}
  - {name: sm, class: btn-sm, use: "dense tables, cards, secondary bars"}
  - {name: md, class: "(default)", use: "standard forms and page actions"}
  - {name: lg, class: btn-lg, use: "prominent page CTA / marketing hero"}
  - {name: xl, class: btn-xl, use: "landing hero only"}
size_selection: "Match surrounding density. The size class carries its own border-radius (radius scales with size, never with variant) — add the size class only, never an inline border-radius."

content_rules:
  - "Sentence case, verb-first, concise ('Crear vacante', not 'Creación de la vacante')."
  - "Describe the outcome, not 'OK'/'Aceptar' when a specific verb is clearer ('Guardar cambios')."
  - "Icon-only buttons MUST have an aria-label naming the action."
layout_constraints:
  - "Never full-width and never left-align content — a button has intrinsic width and centered content; a full-width left-aligned control reads as a form field. If the legacy layout demands full width, change the layout."
  - "One btn-primary per context. Additional actions step down to secondary/tertiary/text."

states:
  default: "Resting fill/outline per variant."
  hover: "State-layer over the base (hover opacity token); background darkens/tints via color-mix."
  focus: "Visible focus-visible ring (--color-focus / --color-focus-ring); never remove it."
  active: "Pressed state layer."
  disabled: "on-disabled tokens (38% content / 12% container equivalents); no pointer events; still in DOM for SR context."
  loading: "Show an inline spinner (spinner-sm spinner-on-primary inside a btn-primary) and keep the label; disable re-submit. (No built-in loading prop — compose it.)"

accessibility:
  roles: "Native <button type=...>. Icon-only requires aria-label."
  aria: ["aria-label for icon-only", "aria-disabled/disabled for disabled", "aria-busy while loading"]
  focus: "Keyboard-reachable in DOM order; visible focus ring; Enter/Space activate natively."
  contrast: "Label on fill meets AA in light + dark automatically via --color-*/on-* token pairs."
keyboard:
  - {keys: "Tab / Shift+Tab", action: "move focus"}
  - {keys: "Enter / Space", action: "activate"}
responsive:
  - "Touch target ≥ 44px on coarse pointers (use ≥ sm size, not xs, on mobile primary actions)."
  - "In footers, stack vertically on narrow widths rather than shrinking below the min touch target."

ux_principles:
  - "Hierarchy communicates priority — one primary guides the eye to the main action (Von Restorff / visual hierarchy)."
  - "Labels state outcomes so users predict the result before clicking."
common_mistakes:
  - "Two or more btn-primary in one context (destroys hierarchy)."
  - "Full-width stretched button imitating a legacy field."
  - "Using a button for navigation."
  - "Icon-only button with no aria-label."
  - "Overriding border-radius inline instead of using the size class."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "loading/disabled state on submit tells the user what's happening"}
  - {id: 4, name: "Consistency and standards", note: "same variant = same meaning everywhere; primary is always the main action"}
  - {id: 6, name: "Recognition rather than recall", note: "clear verb labels, not ambiguous icons alone"}
  - {id: 5, name: "Error prevention", note: "destructive actions use btn-danger + confirmation, cancel is the safe default"}

relationships:
  related: [segmented-button, button-group, toggle]
  replaces: ["any legacy button/CTA", "a flat 'action row' → map to a hierarchical button group"]
  composed_with: [dialog, sheet, toolbar, form, card]
  not_to_confuse_with:
    - {component: chip, why: "chips filter/select/represent input; buttons perform actions"}
    - {component: segmented-button, why: "segmented switches a view/mode; button acts once"}
    - {component: badge, why: "badge is a read-only status; not interactive"}

tokens:
  color: [--color-primary, --color-on-primary, --color-secondary-container, --color-on-secondary-container, --color-outline]
  radius: "--radius-* scaled by size class (sm→--radius-sm … xl→--radius-lg)"
  motion: [--duration-fast]
  elevation: "--btn-elevation (elevated variant only)"

motion:
  enter: "none — always present (static control, not an overlay)."
  exit: "none."
  stateChange: "Hover: filled variants darken (primary→--color-primary-hover, secondary/elevated via color-mix) AND lift with transform: translateY(-1px); elevated also grows box-shadow (--btn-elevation→--btn-elevation-hover). Active/pressed: settle to translateY(0) + a 12% press layer (filter: brightness(.88/.92) on filled, surface-container-high on tertiary/icon, primary 16% on text). Focus-visible: 2px --color-focus ring + 4px --color-focus-ring."
  duration: "--duration-fast (background/border-color/color/box-shadow). Transform (the lift/settle) uses a hardcoded .1s — should be tokenized to --duration-fast."
  easing: "--ease-default for every property, including transform (this buildless CSS does NOT use --ease-expressive for the lift, unlike the retired Tailwind button.tsx described in guidelines/motion.md)."
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). No component-specific override — the lift/press simply collapse."
  constraints: "Never animate layout (width/padding) — a button has intrinsic width. Only compositor-friendly props: transform (lift), plus color/shadow effects. --translateY(-1px) is the only approved transform effect; no scale-up/rotate on hover."
  relatedPatterns: [state-layer, hover-press-lift, per-property-easing-split]

source:
  css: css/components/button.css
  classes: [btn-primary, btn-elevated, btn-secondary, btn-tertiary, btn-ghost, btn-text, icon-btn, btn-danger, btn-success, btn-xs, btn-sm, btn-lg, btn-xl, btn-compact, btn-next]
  react_wrapper: components/ui/button.tsx
  docs_anchor: c-button
---

## Correct usage

```html
<!-- One primary + a subordinate alternative -->
<div class="btn-group">
  <button class="btn-primary">Guardar cambios</button>
  <button class="btn-tertiary">Cancelar</button>
</div>
```
*Why:* single primary action; the escape action is present but visually subordinate.

```html
<!-- Overlay trigger uses tonal (secondary) by convention -->
<button class="btn-secondary">Editar perfil</button>
```
*Why:* opening an overlay is a neutral affordance; the real primary action lives inside the overlay.

```html
<!-- Icon-only with accessible name -->
<button class="icon-btn" aria-label="Más opciones"><i data-lucide="more-vertical"></i></button>
```

## Incorrect usage

```html
<!-- ✕ Two primaries competing -->
<button class="btn-primary">Guardar</button>
<button class="btn-primary">Cancelar</button>
```
*Fix:* Cancelar → `btn-tertiary` (or `btn-secondary`).

```html
<!-- ✕ Full-width, left-aligned button imitating a field -->
<button class="btn-primary" style="width:100%;justify-content:flex-start">Continuar</button>
```
*Fix:* remove the width/alignment overrides; if the layout needs a full-width row, change the layout, not the button.

```html
<!-- ✕ Button used for navigation -->
<button class="btn-text" onclick="location='/ayuda'">Ayuda</button>
```
*Fix:* use a link/nav item; reserve buttons for actions.
