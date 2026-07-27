---
id: command
display_name: Command
aliases: [command palette, command menu, cmdk, searchable command list]
category: Overlays
status: stable
summary: A searchable command palette / filterable list — substring-filtered items with arrow/Enter navigation and an empty state, optionally opened as a ⌘K Command Dialog.
when_to_use:
  - "A command palette / quick navigation surface (⌘K) across the app."
  - "Pickers with many options where typing to filter is faster than scanning."
  - "As the base pattern behind a Combobox."
when_not_to_use:
  - "Choosing one value from a short list → use Select."
  - "Choosing one value by searching a long list inside a form field → use Combobox."
  - "Searching the app's content/results → use Search."
use_cases:
  - "⌘K palette: 'Crear vacante', 'Ir a candidatos', 'Cambiar de equipo'."
  - "A quick action picker grouped into 'Sugerencias' and 'Acciones'."
  - "The filtering engine inside a Combobox field."
variants:
  - {name: inline,   class: command,         purpose: "Embedded palette (input + list) inside a surface."}
  - {name: dialog,   class: command-dialog,  purpose: "⌘K overlay presentation over a scrim."}
  - {name: group,    class: command-group,   purpose: "Labelled section of items (command-group-heading)."}
  - {name: item,     class: command-item,    purpose: "A selectable row; data-active=true marks the keyboard-highlighted item."}
  - {name: empty,    class: command-empty,   purpose: "Real empty-state text shown when the filter matches nothing."}
  - {name: shortcut, class: command-shortcut, purpose: "Trailing keyboard-shortcut hint on an item."}
sizes:
  - {name: default, class: "(default)", use: "fills its container; dialog is a centered overlay"}
size_selection: "Inline .command inside a panel; .command-dialog for the app-wide ⌘K overlay."
content_rules:
  - "Item labels are short, action- or destination-oriented; group related items under a heading."
  - "Filtering is substring match (.toLowerCase().includes()), NOT fuzzy — write labels users will actually type."
  - "Always render a real .command-empty message for no-match."
layout_constraints:
  - "Input pinned at the top with a leading search icon; the list scrolls below it."
  - "The dialog variant floats over a scrim, dismissible by Escape or overlay click."
states:
  default: "Surface-container palette; input focused."
  active: "Highlighted item carries data-active=true as arrows move; Enter runs it."
  empty: "No matches → .command-empty text is shown."
  focus: "Focus stays in the <input>; arrow keys drive the highlight without leaving the field."
accessibility:
  roles: "Text input for the query + a list of selectable items; the empty state is real text."
  aria: ["aria-label / placeholder on the input", "data-active marks the active item", "role=dialog on the ⌘K Command Dialog"]
  focus: "Focus lives in the <input>; ↑/↓/Enter operate without moving focus out. The Command Dialog closes on Escape and overlay click."
  contrast: "Palette tokens meet AA in light + dark (semantic --color-* only)."
keyboard:
  - {keys: "Type", action: "filter items by substring"}
  - {keys: "Arrow Up / Down", action: "move the active-item highlight"}
  - {keys: "Enter", action: "run / select the active item"}
  - {keys: "Escape", action: "close the Command Dialog"}
  - {keys: "Cmd/Ctrl + K", action: "open the Command Dialog (app convention)"}
responsive:
  - "The dialog centers and constrains its width; the list scrolls within the palette."
ux_principles:
  - "Keyboard-first — the palette is an accelerator, so never force the mouse to select."
  - "Group and label items so a long command set stays scannable while typing."
common_mistakes:
  - "Using it where a short Select or a form Combobox is the right fit."
  - "Expecting fuzzy matching — filtering is substring only."
  - "Omitting an empty state so a no-match query looks broken."
  - "Moving focus out of the input on arrow navigation."
nielsen_heuristics:
  - {id: 7, name: "Flexibility and efficiency of use", note: "keyboard accelerator for power users (⌘K)"}
  - {id: 6, name: "Recognition rather than recall", note: "typing filters a visible, labelled list"}
  - {id: 1, name: "Visibility of system status", note: "the empty state confirms a query matched nothing"}
relationships:
  related: [combobox, search, menu, dialog]
  replaces: ["hand-rolled filterable menus"]
  composed_with: [dialog, input]
  not_to_confuse_with:
    - {component: search, why: "Search queries app content/results; Command runs commands / navigates"}
    - {component: select, why: "Select picks one value from a short bounded list; Command is a searchable command surface"}
    - {component: combobox, why: "Combobox is a single-value form field built ON the Command filter; Command is the palette itself"}
tokens:
  color: [--color-surface-container, --color-on-surface, --color-surface-variant]
  radius: [--radius-md]
  motion: [--duration-normal, --ease-default]
source:
  css: css/components/command.css
  classes: [command, command-input-wrapper, command-input-icon, command-input, command-list, command-empty, command-group, command-group-heading, command-item, command-separator, command-shortcut, command-dialog]
  react_wrapper: components/ui/command.tsx
  docs_anchor: c-command
---

## Correct usage

```html
<!-- Grouped command palette with an empty state and an active item -->
<div class="command">
  <div class="command-input-wrapper">
    <span class="command-input-icon"><i data-lucide="search"></i></span>
    <input class="command-input" placeholder="Escribí un comando o buscá…" aria-label="Comandos">
  </div>
  <div class="command-list">
    <div class="command-empty">Sin resultados.</div>
    <div class="command-group">
      <div class="command-group-heading">Sugerencias</div>
      <div class="command-item" data-active="true">Crear vacante <span class="command-shortcut">⌘N</span></div>
      <div class="command-item">Ir a candidatos</div>
    </div>
  </div>
</div>
```
*Why:* grouped, keyboard-driven, substring-filtered, with a real empty state and shortcut hint.

## Incorrect usage

```html
<!-- ✕ Command used to pick one value in a form -->
<div class="command"><input class="command-input" placeholder="Tipo de contrato"></div>
```
*Fix:* a single-value form choice searched within a list is a `Combobox`; a short bounded list is a `Select`.
