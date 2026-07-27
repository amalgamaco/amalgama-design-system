---
id: menubar
display_name: Menubar
aliases: [app menu bar, menu bar, file/edit bar]
category: Overlays
status: stable
summary: A horizontal, always-visible bar of top-level triggers (Archivo, Editar…), each opening an actions panel — the desktop-application menu pattern.
when_to_use:
  - "Desktop-style apps with many actions grouped by category."
  - "Editors, authoring tools, and web IDEs where a persistent File/Edit-style bar is expected."
when_not_to_use:
  - "A single actions menu → use Dropdown Menu."
  - "Navigation between sections → use Navigation Menu / Tabs."
  - "Mobile-first layouts → the menubar is a desktop pattern; use a different affordance."
use_cases:
  - "An authoring tool bar: Archivo · Editar · Ver · Ayuda, each opening its own action panel."
  - "A web IDE-style toolbar with grouped commands per category."
variants:
  - {name: bar,     class: menubar,          purpose: "The horizontal container of top-level triggers."}
  - {name: trigger, class: menubar-trigger,  purpose: "A top-level menu label that opens its panel."}
  - {name: panel,   class: dropdown-content, purpose: "The per-menu action panel — reuses Dropdown Menu's classes/roles."}
sizes:
  - {name: default, class: "(default)", use: "single density; triggers 6px 12px, panels inherit Dropdown Menu sizing"}
size_selection: "One density. Panels follow Dropdown Menu sizing."
content_rules:
  - "Top-level labels are short category nouns (Archivo, Editar, Ver)."
  - "Panel items follow Dropdown Menu rules: imperative labels, grouped with separators, destructive last."
layout_constraints:
  - "Bar is a fit-content horizontal row on a surface-container background with an outline-variant border."
  - "Each panel anchors under its trigger and stays within the viewport."
states:
  default: "Trigger transparent; bar on surface-container."
  hover: "Trigger gains a state layer; once a menu is open, hovering another trigger switches the open menu (desktop convention)."
  focus: "Visible --color-focus ring on the focused trigger."
  open: "Active trigger shows its open panel."
accessibility:
  roles: "Bar role=menubar; triggers role=menuitem; panels role=menu."
  aria: ["role=menubar", "role=menuitem (triggers)", "role=menu (panels)", "aria-expanded on open trigger"]
  focus: "Visible focus ring; Escape closes the open menu."
  contrast: "Bar, trigger and panel tokens meet AA in light + dark."
keyboard:
  - {keys: "Enter / Space / Arrow Down", action: "open the focused trigger's menu"}
  - {keys: "Arrow Up / Down", action: "move within an open panel"}
  - {keys: "Escape", action: "close the open menu"}
responsive:
  - "Desktop pattern — not intended for narrow/mobile layouts."
ux_principles:
  - "Persistent, categorized command surface — appropriate only when the app truly has many grouped commands."
  - "Hover-to-switch between open menus matches long-standing desktop conventions."
common_mistakes:
  - "Using a Menubar when a single Dropdown Menu would do."
  - "Using it for section navigation (that's Navigation Menu / Tabs)."
  - "Shipping it as the primary menu on a mobile-first product."
nielsen_heuristics:
  - {id: 4, name: "Consistency and standards", note: "mirrors the universal desktop File/Edit menu convention"}
  - {id: 7, name: "Flexibility and efficiency of use", note: "many grouped commands one click away"}
  - {id: 6, name: "Recognition rather than recall", note: "categories and their actions are visible on demand"}
relationships:
  related: [menu, navigation-menu, context-menu, toolbar]
  replaces: ["custom application menu bars"]
  composed_with: [button]
  not_to_confuse_with:
    - {component: navigation-menu, why: "Navigation Menu navigates between sections; Menubar issues app commands"}
    - {component: menu, why: "Dropdown Menu is one contextual menu; Menubar is a persistent row of them"}
    - {component: toolbar, why: "Toolbar exposes controls directly; Menubar nests commands under category triggers"}
tokens:
  color: [--color-surface-container, --color-outline-variant, --color-on-surface, --color-focus]
  radius: [--radius-md, --radius-sm]
  motion: [--duration-normal, --ease-default]
source:
  css: css/components/menubar.css
  classes: [menubar, menubar-trigger, dropdown-content, dropdown-item, dropdown-separator]
  react_wrapper: components/ui/menubar.tsx
  docs_anchor: c-menubar
---

## Correct usage

```html
<!-- Persistent desktop-style menu bar; panels reuse dropdown-content -->
<div class="menubar" role="menubar">
  <button class="menubar-trigger" role="menuitem" aria-expanded="false">Archivo</button>
  <button class="menubar-trigger" role="menuitem" aria-expanded="false">Editar</button>
  <button class="menubar-trigger" role="menuitem" aria-expanded="false">Ver</button>
</div>
<div class="dropdown-content" role="menu">
  <button class="dropdown-item" role="menuitem">Nueva búsqueda</button>
  <button class="dropdown-item" role="menuitem">Importar candidatos</button>
</div>
```
*Why:* an app with many grouped commands; each trigger opens its own action panel.

## Incorrect usage

```html
<!-- ✕ Menubar used for section navigation -->
<div class="menubar" role="menubar">
  <button class="menubar-trigger">Vacantes</button>
  <button class="menubar-trigger">Candidatos</button>
</div>
```
*Fix:* moving between sections is Navigation Menu / Tabs, not a command Menubar.

> Note (vanilla vs React): the ←/→ arrow navigation between top-level triggers described in the CSS header is aspirational for the React wrapper; the vanilla demo uses click + hover to switch menus.
