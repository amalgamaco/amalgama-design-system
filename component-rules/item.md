---
id: item
display_name: Basic Card
aliases: [item, row, list row, compact card, settings row]
category: Data display / Containment
status: stable
summary: The reusable compact-row primitive — media + content (title/description) + actions — that every compact domain card is built on.

when_to_use:
  - "Rich, reusable rows: settings rows, search results, notifications with an icon/avatar + text + action."
  - "People in a grid, or lists with separators."
  - "The base layer for a specialized compact card (Person, Vacancy, Kanban)."
when_not_to_use:
  - "Tabular data with comparable columns → use Table."
  - "A rich panel with header/body/footer → use Full Card (card)."
  - "A single numeric KPI → use Stat Card."
  - "A plain homogeneous text list (headline + supporting) → use List."
use_cases:
  - "Settings row: icon + 'Notificaciones' + description + a config button."
  - "Search result row with an avatar and a trailing action."
  - "Person card in a candidates grid (item item-outline item-clickable person-card)."

variants:
  - {name: base,     class: item,          purpose: "Transparent-border row; the default flexible row."}
  - {name: outline,  class: item-outline,  purpose: "Adds a 1px --border outline around the row."}
  - {name: muted,    class: item-muted,    purpose: "Tonal surface-variant fill (50%) for a de-emphasized row."}
  - {name: clickable, class: "a.item / item-clickable", purpose: "Interactive row: pointer cursor, hover surface, focus ring."}
sizes:
  - {name: md, class: "(default)", use: "standard row; 16px padding, 16px gap"}
  - {name: sm, class: item-sm, use: "denser row; 12px 16px padding, 10px gap"}
size_selection: "Use item-sm for dense lists (menus, compact settings); default for standard rows with media."

content_rules:
  - "item-title is the primary label (1 line, weight 500); item-description is secondary supporting text."
  - "item-description clamps to 2 lines — ensure the full text is available elsewhere if it's essential."
  - "Media slot (item-media) is optional: nothing, an icon chip (item-media-icon), or an image (item-media-image)."
  - "Keep one primary action in item-actions; a full-row link should not nest other focusable controls."
layout_constraints:
  - "Row is flex: media | content (flex:1) | actions; item-header/-footer span the full row (flex-basis:100%)."
  - "Group rows in item-group; divide them with item-separator."
  - "A second contiguous item-content does not grow (acts as a fixed meta column)."

states:
  default: "Flex row with transparent border (or --border with item-outline)."
  hover: "Interactive rows (a.item / item-clickable) get a surface-variant background."
  focus: "focus-visible: border --color-focus + 3px --color-focus-ring halo."
  disabled: "is-disabled → opacity .5, pointer-events none."

accessibility:
  roles: "A navigable Item is a real <a class=\"item\">; a non-link interactive Item is <button class=\"item\"> or role=button + tabindex=0."
  aria: ["item-group may expose role=list with role=listitem on each Item", "aria-haspopup=menu + aria-expanded on a separate actions trigger"]
  focus: "The whole row is one focus stop when it's a link; a dropdown/actions trigger is a separate control outside the navigable area."
  contrast: "Semantic tokens ensure AA in light + dark; never override colors per theme."
keyboard:
  - {keys: "Tab", action: "focus the row (if link/button) and any separate action control"}
  - {keys: "Enter / Space", action: "activate the row link/button"}
responsive:
  - "The row wraps (flex-wrap) so item-header/-footer drop to their own line on narrow widths; keep a comfortable touch target."

ux_principles:
  - "One consistent row anatomy across the app builds recognition (Jakob's law)."
  - "Group + separator communicate structure via proximity."
common_mistakes:
  - "Nesting extra focusable controls inside an <a class=\"item\"> link (breaks the link semantics)."
  - "Using an Item for a rich panel that needs a header/footer (that's Full Card)."
  - "Using an Item where columns must align across rows (that's Table)."
  - "Relying only on the clamped description for essential text."
nielsen_heuristics:
  - {id: 4, name: "Consistency and standards", note: "the same row primitive underpins every compact card"}
  - {id: 6, name: "Recognition rather than recall", note: "media + title + description make each row scannable"}
  - {id: 8, name: "Aesthetic and minimalist design", note: "only the slots you need; everything is optional"}

relationships:
  related: [card, list, person-card, vacancy-card]
  replaces: ["ad-hoc flex divs with icon + text + button"]
  composed_with: [button, badge, avatar, dropdown-menu, divider]
  not_to_confuse_with:
    - {component: card, why: "Full Card is a rich multi-part panel; Basic Card is a compact row"}
    - {component: list, why: "List is a simpler homogeneous headline+supporting list; Item is a richer, media-capable row primitive"}
    - {component: table, why: "Table aligns comparable columns across rows; Item is a self-contained row"}

tokens:
  color: [--border, --color-surface-variant, --color-on-surface-variant, --text-primary, --text-secondary, --color-focus, --color-focus-ring]
  radius: [--radius-md, --radius-sm]
  spacing: ["16px padding / 16px gap (default)", "12px 16px / 10px gap (item-sm)"]
  motion: [--duration-fast, --ease-default]

motion:
  enter: "none — the row is always present"
  exit: "none"
  stateChange: "Interactive rows (a.item / .item-clickable) recolor their background to --color-surface-variant on hover; :focus-visible moves the border to --color-focus and adds a 3px --color-focus-ring box-shadow. Transition covers background-color + border-color."
  duration: "--duration-fast"
  easing: "--ease-default"
  reducedMotion: "Inherits the global prefers-reduced-motion rule in css/base.css (all transitions/animations neutralized to ~0). No looping/essential motion; the hover tint and focus ring still apply, just without the fade."
  constraints: "Animate background-color/border-color only (effects, no layout, no lift). Don't add a translate/scale on hover — this is a content-row primitive, not a Button. Standard easing, no overshoot."
  relatedPatterns: ["motion.md → Hover & press micro-interactions (state-layer color = effect, Standard easing)"]

source:
  css: css/components/item.css
  classes: [item, item-outline, item-muted, item-sm, item-media, item-media-icon, item-media-image, item-content, item-title, item-description, item-actions, item-header, item-footer, item-group, item-separator, item-clickable]
  react_wrapper: null
  docs_anchor: c-item
---

## Correct usage

```html
<!-- Settings row: icon media + content + trailing action -->
<div class="item item-outline">
  <div class="item-media item-media-icon"><i data-lucide="bell"></i></div>
  <div class="item-content">
    <div class="item-title">Notificaciones</div>
    <div class="item-description">Recibí avisos de nuevas postulaciones por email.</div>
  </div>
  <div class="item-actions"><button class="btn-tertiary btn-sm">Configurar</button></div>
</div>
```
*Why:* the canonical row anatomy — media, content, one action.

```html
<!-- Navigable row: the whole row is a link -->
<a class="item item-outline item-clickable" href="/candidatos/ana-torres">
  <div class="item-media item-media-image"><img src="…" alt=""></div>
  <div class="item-content">
    <div class="item-title">Ana Torres</div>
    <div class="item-description">Diseñadora de producto</div>
  </div>
</a>
```
*Why:* a real `<a>` root makes the full row a keyboard-accessible link.

## Incorrect usage

```html
<!-- ✕ A button nested inside a link row -->
<a class="item item-clickable" href="/x">
  <div class="item-content"><div class="item-title">Ana Torres</div></div>
  <button class="btn-tertiary btn-sm">Editar</button>
</a>
```
*Fix:* move the action out of the link (put the trigger in a separate `item-actions` control, or make the root a non-link `<div>`).

```html
<!-- ✕ Using Item where columns must align across rows -->
<div class="item-group">
  <div class="item"><span>Ana</span><span>UX</span><span>Activo</span></div>
</div>
```
*Fix:* use a `table.data-table` so columns align and can be scanned/sorted.
