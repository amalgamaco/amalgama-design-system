# Component decision tables — the pairs most often gotten wrong

Loaded from la skill `screen` §3. **Leelo cuando NO sepas qué componente usar, no solo
cuando ya elegiste uno** — la tabla de abajo entra por lo que tenés en la mano; el resto
del archivo entra por el componente, y para eso ya hay que saber cuál abrir.
This is the shortcut, not the source: on any disagreement `component-rules/<id>.md` wins.

---

## Por lo que tenés en la mano

Las reglas de esta página estaban indexadas por componente, así que se encontraban
solo si ya sabías cuál era. Esta tabla entra por la intención. Dice **a dónde ir**, no
repite lo que dice cada regla: la fuente sigue siendo `component-rules/<id>.md`.

| Lo que tenés | Lo que es | Dónde está escrito |
|---|---|---|
| **Cambiar el período** — Día / Semana / Mes | `segmented-button` | `segmented-button.md` lo nombra literal. **No** `tabs` (eso navega entre paneles), **no** `toggle-group` (eso son toggles independientes tipo negrita/cursiva) |
| **Elegir una fecha** | `calendar` si elegir la fecha **es** la tarea (grilla inline siempre visible) · `date-picker` si es un campo más de un formulario (la misma grilla detrás de un trigger) | `date-picker.md` → `not_to_confuse_with` |
| **Buscar** | `search-bar` standalone / mobile / hero (píldora, 56px) · `search-field` dentro de una toolbar sobre un listado (compacta, alinea con los botones) | `search.md` → `when_to_use`, y §«Search» acá abajo |
| **Una etiqueta** | Tres cosas distintas, y «tag» no es ninguna — ver abajo | §«"Tag" no existe» |
| **Marcar que algo está elegido** | Depende de qué tipo de elección — hay tres pesos | `COMPOSICION.md` §4c |
| **Marcar que algo importa más** | No es lo mismo que elegido — ver abajo | §«Destacado no es seleccionado» |
| **Agrupar contenido en una superficie** | Cuatro formas de tarjeta, excluyentes | `COMPOSICION.md` §4b |

### Un componente adentro de un panel: lo declara el contenedor

Todo componente de Embassy asumía que estaba apoyado sobre `--surface`. Metido
en un panel con fondo propio quedaba mal, y se arreglaba pisando la clase pública a
mano: medido sobre una consola de check-in en septiembre de 2026, **ocho de catorce
overrides eran esto**.

Ahora el fondo lo declara **el contenedor**, no el componente:

| Token | Qué es | Quién lo usa |
|---|---|---|
| `--surface` | El fondo de lo que me contiene | Un componente que tiene que **fundirse** con su contenedor — `list` |
| `--surface-container` | El escalón que se despega de ese fondo | Algo que tiene que verse **encima** — `field-input`, un track |

Las cards del DS (`card`, `card-elevated`, `card-filled`) lo setean solas. **Para un
panel que no es una card** —un rail, un sheet, una región propia del proyecto— se
declara en el contenedor:

```html
<aside class="mi-rail" data-surface="container">
  <ul class="list">…</ul>          <!-- se funde con el rail -->
  <input class="field-input">       <!-- se despega de él -->
</aside>
```

Valores: `surface`, `container-low`, `container`, `container-high`.

**Nunca escribas `background: transparent` sobre una clase pública para arreglar
esto.** Si un componente sigue quedando mal adentro de un contenedor, es un gap del
DS: declaralo con `@ds-gap` (lo pide el chequeo `B2`) y abrí el issue.

### «Tag» no existe, y la palabra sí se usa

No hay componente `tag`, ni clase, ni regla. Quien dice «tag» quiere una de tres, y se
eligen por lo que la cosa **hace**, no por cómo se ve:

| Si el usuario… | Es | Señal |
|---|---|---|
| **no lo puede tocar** — dice en qué estado está algo | `badge` | Abierta, En proceso, Vencida |
| **lo toca para filtrar o elegir** | `chip` | Sólo activas, Esta semana |
| **lee de qué familia es** — una categoría, no un estado | `badge-label` (versalitas, mono, píldora con borde y sin relleno) | FUNDAMENTOS, PRODUCTO |

Si dudás entre `badge` y `chip`, la pregunta es una sola: **¿pasa algo si lo clickeás?**

### Destacado no es seleccionado

Son dos cosas y el sistema las mezclaba. **Seleccionado** es un estado que el usuario
causó: eligió esto. **Destacado** es una propiedad del contenido: esto importa más que
lo de al lado, lo haya tocado alguien o no.

| | Quién lo causa | Cómo se marca | Qué NO |
|---|---|---|---|
| **Seleccionado** | El usuario, al elegir | Relleno tonal del rol que corresponda según `COMPOSICION.md` §4c — `primary-container` el objeto que opera, `secondary-container` el filtro activo, neutro el modo de vista | Nunca por tamaño ni por peso tipográfico: si cambia de tamaño al elegirlo, la fila salta |
| **Destacado** | El contenido, por lo que es | Jerarquía: más aire, un escalón más de superficie (`surface-container-high`), o posición. Y `badge-tertiary` cuando hace falta rotularlo («Nuevo») | **Nunca el token de selección.** Un destacado que usa `secondary-container` se lee como «esto está elegido», y el usuario busca cómo deseleccionarlo |

**Verificación:** si sacás al usuario de la pantalla y recargás, lo seleccionado se
pierde y lo destacado queda. Si algo que vos llamás destacado desaparece al recargar,
era seleccionado.

### Cómo se declara que algo está seleccionado

La sección de arriba dice **de qué color** se pinta. Ésta dice **qué se escribe en el
markup**, que es lo que el sistema tenía contestado de nueve maneras distintas:
`.active`, `.selected`, `.chip-selected`, `.is-selected`, `tr.selected`,
`[aria-selected]`, `[aria-pressed]`, `aria-current` y `data-active`. Cinco componentes
pintaban **sólo la clase**, así que un markup con el ARIA correcto y sin la clase se
veía sin seleccionar: accesible y mudo a la vez.

**El atributo declara el estado. La clase, cuando existe, es un alias que acompaña.**
El CSS pinta siempre el atributo, así que el markup correcto se ve correcto sin que
haya que acordarse de la clase.

Cuál de los tres atributos, por el **rol** del control — no por cómo se ve:

| Lo que es | Se declara con | Quién lo usa |
|---|---|---|
| Una de varias, dentro de un grupo de selección | `aria-selected="true"` | `tab`, `seg-btn` de selección única, `list-item`, fila de `data-table`, opción de `combobox` |
| Un interruptor independiente que queda prendido | `aria-pressed="true"` | `toggle`, chip de filtro, `seg-btn` de selección múltiple |
| El ítem que corresponde a la pantalla en la que estoy | `aria-current="page"` | `nav-item`, `breadcrumb` |

Y una cuarta cosa que **no** es selección y por eso no usa ninguno de los tres: el
ítem bajo el cursor de teclado mientras se navega una lista con las flechas
(`command-item`) se marca con `data-active="true"`. Es transitorio — se va al soltar
la tecla y no sobrevive a un recargo — así que es un **destacado**, no un seleccionado,
y la verificación de la sección anterior lo confirma.

*Si dudás entre `aria-selected` y `aria-pressed`:* ¿el control pertenece a un grupo
donde elegir uno desmarca al otro? Entonces `aria-selected`. ¿Se prende y se apaga
solo, sin mirar a sus hermanos? Entonces `aria-pressed`.

---

Always confirm against the rule file's `not_to_confuse_with`. These encode the specific decisions that get missed.

### Buttons — hierarchy, sizes, modifiers (`button.md` / `button.css`)

One `btn-primary` per context; alternatives step down. Emphasis ladder: **primary → elevated → secondary → tertiary → text → icon**. Overlay/dialog/sheet **triggers** use `btn-secondary` (the real primary lives inside the overlay). **Never** full-width or left-aligned (`width:100%` reads as a form field — change the layout, not the button). Pill radius is forbidden on buttons.

**Adjacency rule — the button next to the primary must not compete with it.** A secondary action that is *lower priority* than the primary (especially secondary **navigation** like "Carpetas", "Ver todo", "Configuración" sitting beside "Nueva propuesta") uses the **outlined `.btn-tertiary`**, not the tonal `.btn-secondary`. Tonal fills a `--secondary-container` block that reads at nearly primary weight; placed immediately beside the filled primary it creates two competing emphases and the eye can't find the one action. Reserve `.btn-secondary` (tonal) for actions that are genuinely **equal-weight alternatives** or for overlay triggers standing alone — not for a lower-priority sibling of the page primary. When two actions sit in one cluster, exactly one may carry fill; the other steps down to outline or text.

| MD3 role | Embassy class | Use for |
|---|---|---|
| Filled | `.btn-primary` | the single most important action of a context |
| Elevated (tonal + shadow) | `.btn-elevated` | primary-container action that must lift off a busy/dark background |
| Tonal (neutral) | `.btn-secondary` | equal-weight alternatives; default overlay/dialog/sheet trigger |
| Outlined | `.btn-tertiary` | lower-emphasis / alternative (e.g. Cancel) |
| Text | `.btn-text` | lowest emphasis, inline in dense content |
| Link | `.btn-link` | inline action-link (underline, no bg block) |
| Icon-only | `.icon-btn` | compact icon action — **requires `aria-label`** |

Sizes (radius scales with **size**, never variant): `.btn-xs` (24px, `--radius-sm`) · `.btn-sm` (32px, `--radius-sm`) · default (36px, `--radius-md`) · `.btn-lg` (44px, `--radius-md`, mobile primary) · `.btn-xl` (52px, `--radius-lg`, hero only). Modifiers compose onto a variant: `.btn-danger` (destructive, error focus ring), `.btn-success`, `.btn-compact` (dense toolbars/tables). Compat aliases: `.btn-ghost`=tertiary, `.btn-next`=primary.

### Search — three usages, never a generic Input (`search.md` / `toolbar.md`)

**Decide by what the search acts on, not by how prominent it looks.** A search that filters results living on the *same* screen belongs in that screen's toolbar; a search with no single list it owns is a hero/global bar.

- **Filters a list / table / card-collection** (results are on this screen) → `.search-field` **inside the `.toolbar`** that heads that collection, aligned to the content grid, growing `flex:1`. This is the default for every `list-collection` / `dashboard` / `search-results` screen — **even when the search is the single most prominent control.** A "screen-heading" search over a list is STILL a toolbar `.search-field`, *not* a centered hero pill.
- **Global / hero / landing / command-style** (queries the whole app or a marketing surface, owns no single list) **or any search on mobile** → `.search-bar` (pill).

| Use | Class (file) | Background | Radius | Size |
|---|---|---|---|---|
| Filters a desktop list/table/collection | `.search-field` (toolbar.css) | `--surface` (white; never grey/transparent) | `--radius-md` | compact · 18px icon · `flex:1` in the toolbar |
| Global / hero / landing / command · or mobile | `.search-bar` (search.css) | `--surface-container-high` (grey; never surface) | `--radius-full` (pill) | 56px · 24px icon · 360–720px |
| Bar + adjacent icon actions | `.search-row` › `.search-bar` + `.search-icon-btn` | as Search Bar | as Search Bar | bar 40px · btn 40×40 · 20px icon |

`.search-field` and `.search-bar` are **siblings** — different shape/height/background, same state tokens. `.search-field` is not legacy; `.search-bar` does not replace it. Search carries `role="search"` + accessible name. Use `.search-row` **only** when pairing a bar with icon actions — inside a real toolbar the search is a `.search-field`. **Never center a collection's search independently of the page grid, and never give it an arbitrary width** — the `.search-field` spans the toolbar (`flex:1`) whose edges align to the content column. Centering a standalone `.search-bar` above a list that lives on the same screen is a **defect**, not a style choice.

### Select vs Dropdown Menu vs Combobox vs Command

| Component | Classes | Rule | Purpose |
|---|---|---|---|
| **Select** | `.select`, `.select-trigger`, `.select-content`, `.select-item`… | `select.md` | pick ONE value from a fixed list (`role=listbox`); a form field |
| **Dropdown Menu** | `.dropdown-trigger`, `.dropdown-content`, `.dropdown-item`… | `menu.md` | a `role=menu` list of **actions/commands**, click-triggered |
| **Combobox** | `.combobox`, `.combobox-trigger`, `.combobox-panel` (embeds `command`) | `combobox.md` | **type-to-filter** single-select that returns a chosen form value |
| **Command** | `.command…` | `command.md` | the ⌘K palette (actions/navigation); the engine Combobox is built on |

Select ≠ Dropdown Menu: Select captures a value, a menu triggers actions. Combobox ≠ Select: Combobox has typeahead (use for long lists); Select for short bounded lists. Multi-select tokens → Chip, not any of these.

### Overlay family — modality & dismissal

**Dropdown Menu and Popover are one rule (`menu.md`)** — chosen by content: menu = keyboard-navigable action list; popover = freeform content. Context Menu (`context-menu.md`) reuses `.dropdown-*` classes, right-click/cursor-anchored.

| Component | Classes | Rule/CSS | Use when | Modality |
|---|---|---|---|---|
| Dropdown Menu | `.dropdown-*` | menu.md / dropdown-menu.css | overflow/contextual actions on a visible trigger | non-modal; Esc + outside-click |
| Popover | `.popover-*` | menu.md / popover.css | freeform content (mini-form, custom picker) beside an element | non-modal; Esc + outside-click |
| Context Menu | `.context-menu-trigger` + `.dropdown-*` | context-menu.md | right-click / long-press actions (must also have a visible path) | non-modal, cursor-anchored |
| Dialog (Modal) | `.modal`, `.modal-overlay`, `.modal-header/body/footer`… | dialog.md / modal.css | blocking focused task/decision, centered | modal; focus-trap; Esc + outside-click |
| **Alert Dialog** | `.modal[data-alert="true"]` (`role=alertdialog`) | dialog.md | destructive/irreversible confirm | modal, **NOT** Esc/outside-click dismissible; Cancel = safe default focus; no X |
| Side / Bottom Sheet | `.sheet-overlay`, `.sheet-content-{right,left,top,bottom}`… | sheet-side.md / sheet-bottom.md / sheet.css | filters / detail / secondary form (side=desktop, bottom=mobile) | modal; focus-trap; Esc + scrim-click |

### Calendar vs Date Picker (`calendar.md`)

- **Calendar** (`.calendar`…) — the **inline, always-visible** month grid. Use when date-picking is the main task, or for range/booked/presets. Config via `data-cal-mode="range"`, `data-cal-caption="dropdown"`, etc.
- **Date Picker** (`.date-picker`, `.date-picker-trigger`, `.date-picker-panel`) — a **trigger + popover that docks a Calendar**; the form/toolbar default that shouldn't take permanent space. On mobile, dock the Calendar in a bottom Sheet, not the small popover.

### Loading family (`loading.md` governs Progress + Spinner; `skeleton.md` for Skeleton)

| Treatment | Classes | Use when |
|---|---|---|
| **Skeleton** | `.skeleton`, `.skeleton-{text,title,card,circle,avatar}` | destination layout is known; content-shaped wait >~300ms (default). `aria-busy` on wrapper, `aria-hidden` on shapes |
| **Progress** | `.progress`/`.progress-fill`, `.progress-circular…`, `-indeterminate` | a real **percentage** exists (uploads). `role=progressbar` + `aria-valuenow` |
| **Spinner** | `.spinner`, `.spinner-sm` (in buttons), `.spinner-lg`, `.spinner-on-primary` | short inline wait inside button/input/cell. `role=status` + `aria-label` |
| no data | `.empty-state` | never an endless spinner |
| <~300ms | (nothing) | no indicator |

Never pair a skeleton with a spinner in one context; never skeleton a button/control; never toggle determinate↔indeterminate mid-op.

### Toolbar & its variants; Segmented Button; Checkbox

**Toolbar is one component with variants** (`toolbar.md` / `toolbar.css`) — heads a list/table/dashboard. Compose the variants; never hand-roll a per-page bar. The former standalone **Filter Toolbar has been folded in** as the `.toolbar-filters` variant (its `filter-toolbar.css`/`.md`/`--ft-*` tokens were removed — don't reference them).

- `.toolbar` container + `.toolbar-actions` (right-aligned slot, `margin-left:auto`, holds the **one** primary + supporting actions) + `.result-count` (`aria-live="polite"`, "Mostrando N de M").
- `.search-field` (compact search that grows `flex:1`) + `.toolbar-btn` (outlined secondary filter/sort/reset; optional `.toolbar-btn-count` chip).
- **`.toolbar-filters`** — unifies **2+ equal-hierarchy filter controls** (Select + Segmented Button + Date Picker) under one field treatment via a scoped **`--tb-*`** token layer (`--tb-height` 40px). It re-skins `.select-trigger` / `.date-picker-trigger` / `.seg-btn-group` **only within `.toolbar-filters`** — never the standalone components; the selected segment keeps its neutral raised treatment (`--seg-btn-track-thumb`) and each segment keeps its own focus ring.
- **`.toolbar-selection`** — bulk-actions variant shown when items are selected (tinted secondary-container surface + `.toolbar-selection-count` + `.toolbar-selection-clear` + bulk actions; enters on `--duration-normal`).
- **`.toolbar-overflow-btn`** — "More" trigger (`aria-haspopup="menu"`) opening a Dropdown/Popover for controls that don't fit; **`.toolbar-sticky`** (+`.is-stuck`) sticks the bar on scroll.
- Order left→right by frequency: search → filters → sort → action. Left = what filters/defines the view; right (`.toolbar-actions`) = the actions, **one primary max**. A search that filters *this* list is a `.search-field` **in this toolbar** — even when it's the most prominent control on the screen; reserve `.search-bar` for global/hero/command search or mobile (never a centered pill over an on-screen list). Global actions → Top Bar; sub-view nav → Tabs.
- **Segmented Button** (`.seg-btn-group`, `.seg-btn`, `.selected`/`[aria-selected]`; sizes `-sm`/`-lg`) — switch 2–5 mutually-exclusive **views/modes of the same screen** (Lista/Cuadrícula, Día/Semana/Mes). vs Tabs (navigate distinct pages) and Toggle Group (independent on/off). Its group is a **sunken track** (`--seg-btn-track`) with no outline and the active segment is a neutral raised thumb — never the tonal selection token, which belongs to the active filter (§«Cómo se declara que algo está seleccionado» y `COMPOSICION.md` §4c). Inside `.toolbar-filters` its container adopts the squared field treatment and **keeps** that treatment plus the per-segment focus ring.
- **Checkbox** (`.checkbox`, `.checkbox-label`, `.checkbox-card`) — form-level multi-select and table **select-all** (header uses the indeterminate **dash** for partial selection; set `el.indeterminate=true` via DOM, not a class). **Not** for inline toolbar filtering — that's a **Chip**. Exclusive choice → Radio; instant on/off → Switch.

### Other high-frequency pairs

- **badge** = read-only status/category (never styled colored text) · **chip** = interactive filter/selection/input.
- **card** = generic container · **stat-card** = KPI (number+label+change) · **item** (Basic Card) = the compact reusable row every domain card is built on · **person-card** / **vacancy-card** / **kanban-card** = domain (Gamaforce).
- **toast/snackbar** = transient passive feedback · **alert** = persistent inline error/guidance that stays until resolved · **modal/alert-dialog** = blocking decision.
- **placeholder panel** ("selecciona…", "próximamente") ≠ **empty-state** ("no data yet").

---

