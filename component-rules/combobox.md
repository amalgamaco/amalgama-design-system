---
id: combobox
display_name: Combobox
aliases: [autocomplete, typeahead, searchable select, filtrable select]
category: Forms / Selection
status: stable
summary: A searchable single-select — a trigger button that opens a filterable Command list; pick one value from a long set by typing to narrow it.
when_to_use:
  - "Choosing exactly one value from a long list where typing to filter speeds up the choice (país, usuario, repo, vacante)."
  - "A form field whose option set is too long to scan comfortably in a plain Select."
when_not_to_use:
  - "Short option list with no need to search → use Select (.form-select)."
  - "Selecting several values with visible tokens → use Chips + Command (multi-select)."
  - "Running commands or navigating the app (⌘K palette) → use Command."
  - "Free-text entry that is not constrained to a known set → use a plain text Input."
use_cases:
  - "Asignar reclutador a una vacante desde una lista larga de usuarios."
  - "Elegir el país de residencia de un candidato en un formulario de alta."
  - "Seleccionar una vacante existente para vincular un candidato."
variants:
  - {name: base, class: combobox, purpose: "The relative-positioned wrapper holding the trigger + panel."}
  - {name: trigger, class: combobox-trigger, purpose: "The button (btn-tertiary) that opens the panel; shows the current value or placeholder."}
  - {name: placeholder, class: "combobox-trigger.is-placeholder", purpose: "Muted trigger label when nothing is selected yet."}
  - {name: panel, class: combobox-panel, purpose: "The floating popover (240px) that hosts a .command searchable list."}
  - {name: check, class: "combobox-check.is-selected", purpose: "Leading check marking the currently selected option."}
sizes:
  - {name: md, class: "(default)", use: "single size; trigger and panel are 240px wide by design"}
size_selection: "Single size. If you need a wider control, size the wrapper — do not stretch it to imitate a full-width field."
content_rules:
  - "Placeholder is an instruction ('Seleccionar…'), the resting label is the chosen value."
  - "Empty-search state must show a 'sin resultados' message, not a blank panel."
  - "Option labels are short nouns, one per row."
layout_constraints:
  - "Trigger and panel share the same width; panel anchors directly below the trigger (top: 100% + 4px)."
  - "The panel embeds a full .command block — do not hand-roll a list; reuse Command's filter/nav."
states:
  default: "Closed; trigger shows value or muted placeholder, chevron at 50% opacity."
  hover: "btn-tertiary hover state on the trigger."
  focus: "focus-visible ring on the trigger (--color-focus / --color-focus-ring); arrow keys move the active option once open."
  open: "aria-expanded=true; panel visible with the Command input focused for immediate typing."
  selected: "Chosen option shows combobox-check.is-selected; trigger reflects the value."
  disabled: "Unavailable options carry aria-disabled=true and are excluded from selection."
accessibility:
  roles: "Trigger is a native <button> with aria-haspopup=\"listbox\" and aria-expanded; the panel list follows Command's listbox/option semantics."
  aria: ['aria-haspopup="listbox"', "aria-expanded synced on open/close", 'aria-disabled="true" on unavailable options', "accessible name on the trigger"]
  focus: "Opening moves focus to the search input; Escape and outside-click close and return focus to the trigger."
  contrast: "Trigger, panel surface and check all derive from --color-* tokens — AA in light + dark."
keyboard:
  - {keys: "Enter / Space", action: "open the panel from the trigger"}
  - {keys: "Type", action: "filter the option list (substring, not fuzzy)"}
  - {keys: "Arrow Up / Down", action: "move the active option"}
  - {keys: "Enter", action: "select the active option and close"}
  - {keys: "Escape", action: "close without selecting; focus returns to the trigger"}
responsive:
  - "Keep a 44px touch target on the trigger; the panel scrolls internally rather than overflowing the viewport."
ux_principles:
  - "Typeahead turns recall into recognition for long sets — the user narrows instead of scrolling (recognition over recall)."
  - "The selected value stays visible on the trigger so the current choice is always legible."
common_mistakes:
  - "Using a Combobox for a short list that a plain Select handles fine (added complexity for no gain)."
  - "Leaving aria-expanded out of sync with the panel's real open state."
  - "Blank panel on no matches instead of an explicit empty state."
  - "Confusing it with Command (palette for commands/navigation, not a form value)."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "type-to-filter surfaces matching options instead of asking the user to remember them"}
  - {id: 3, name: "User control and freedom", note: "Escape / outside-click dismiss without committing a value"}
  - {id: 1, name: "Visibility of system status", note: "selected check + trigger value show the current choice"}
relationships:
  related: [select, command, chip, input]
  replaces: ["hand-rolled searchable selects"]
  composed_with: [command, form, toolbar]
  not_to_confuse_with:
    - {component: select, why: "Select has no typeahead; use it for short lists"}
    - {component: command, why: "Command runs commands / navigates (⌘K); Combobox picks a form value"}
    - {component: chip, why: "chips represent multi-select tokens; Combobox is single-select"}
tokens:
  color: [--color-surface-container, --color-on-surface, --text-muted, --border]
  radius: [--radius-md]
  shadow: [--shadow-md]
  spacing: [--space-2, --space-4]
source:
  css: css/components/combobox.css
  classes: [combobox, combobox-trigger, combobox-chevron, combobox-panel, combobox-check, command]
  react_wrapper: components/ui/combobox.tsx
  docs_anchor: c-combobox
---

## Correct usage

```html
<!-- Searchable single-select for a long list -->
<div class="combobox" data-combobox>
  <button class="btn-tertiary combobox-trigger is-placeholder" aria-haspopup="listbox" aria-expanded="false">
    Seleccionar reclutador…
    <span class="combobox-chevron"><i data-lucide="chevrons-up-down"></i></span>
  </button>
  <div class="combobox-panel" hidden>
    <div class="command">
      <input class="command-input" type="text" placeholder="Buscar reclutador…" aria-label="Buscar reclutador">
      <div class="command-list" role="listbox">
        <div class="command-item" role="option"><span class="combobox-check"><i data-lucide="check"></i></span> Ana Torres</div>
        <div class="command-item" role="option"><span class="combobox-check"><i data-lucide="check"></i></span> Bruno Díaz</div>
      </div>
    </div>
  </div>
</div>
```
*Why:* long list + typeahead; trigger carries aria-haspopup/aria-expanded and reuses Command for filtering.

## Incorrect usage

```html
<!-- ✕ Combobox for a 3-option status field -->
<div class="combobox" data-combobox>
  <button class="btn-tertiary combobox-trigger">Estado…</button>
  <div class="combobox-panel"><!-- Abierta / Cerrada / Borrador --></div>
</div>
```
*Fix:* a short, non-searchable set is a plain Select (`.form-select`).

```html
<!-- ✕ aria-expanded left hardcoded false while the panel is open -->
<button class="combobox-trigger" aria-expanded="false">Ana Torres</button>
<div class="combobox-panel"><!-- visible --></div>
```
*Fix:* keep aria-expanded in sync with the panel's real open state (initCombobox handles this).
