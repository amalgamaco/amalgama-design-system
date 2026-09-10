# Component Rules — coverage index

> GENERADO por `scripts/build-manifest.py` desde los frontmatter de
> `component-rules/<id>.md`. **No editar a mano:** se regenera y se pisa.

**70 reglas operativas**, todas con frontmatter valido. El schema y como las
consumen los skills estan en `README.md`; el registro machine-readable, en `manifest.json`.

No todas son componentes: `composition`, `space` y `mobile` son reglas de sistema —
la forma de la pagina, la capa espacial de Amalgama y las apps nativas.

## Actions

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `button` | Button | `css/components/button.css` | Triggers an action. Chosen by hierarchy (color) and density (size); exactly one primary action per context. |
| `button-group` | Button Group | `css/components/button-group.css` | A container that visually joins related buttons (or an input + addon) into one unit by collapsing shared borders and radii — it carries no selectio… |
| `segmented-button` | Segmented Button | `css/components/segmented-button.css` | A compact pill that switches between 2–5 mutually exclusive views or modes; exactly one segment is active at a time. |
| `toggle` | Toggle | `css/components/toggle.css` | A single two-state (pressed / not-pressed) button for a bold-style setting that applies immediately — state lives on aria-pressed. |
| `toggle-group` | Toggle Group | `css/components/toggle-group.css` | A set of related Toggles on one axis — multi-select (each independent) or single-select (choosing one deselects the rest); deliberately distinct fr… |

## Actions / App bar

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `toolbar` | Toolbar | `css/components/toolbar.css` | The row of controls that heads a list, table or dashboard — search, filters, view/period switches, and the view's actions — with variants for filte… |

## Actions / Selection

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `chip` | Chip | `css/components/chip.css` | A compact, interactive element for filtering, selecting, or representing input — never for primary actions. |

## Containment

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `accordion` | Accordion | `css/components/accordion.css` | Vertically stacked, expandable sections that reveal or hide long content to keep a dense view scannable. |
| `carousel` | Carousel | `css/components/carousel.css` | A scroll-snapping, browsable set of homogeneous items (images or cards) with prev/next controls — for secondary content that doesn't fit in one row. |
| `collapsible` | Collapsible | `css/components/collapsible.css` | A single show/hide region toggled by any trigger — a minimal disclosure with one boolean state. |
| `divider` | Divider | `css/components/divider.css` | A 1px line that separates groups of equal-hierarchy content — the lightest separation in the system, no brand color, no elevation. |

## Data Display

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `attachment` | Attachment | `css/components/attachment.css` | A compact file row showing an icon/thumbnail, name and metadata, with an optional remove action, upload progress, or error state. |

## Data display

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `charts` | Charts | `css/components/chart.css` | Line, area, bar, and pie visualizations for dashboards and analytics — hand-drawn inline SVG + CSS conic-gradient, themed with the --chart-1..5 cat… |
| `data-table` | Data Table | `css/components/data-table.css` | An interactive table over static Table — column sort, text filter, row selection, column visibility, and slice pagination via initDataTable(). |
| `list` | List | `css/components/list.css` | A simple vertical list of homogeneous items, each with a headline and optional supporting text, leading and trailing slots. |
| `stat-card` | Stat Card | `css/components/stat-card.css` | A single KPI/metric with a label, a large value, and an optional trend indicator. |
| `table` | Table | `css/components/table.css` | Static tabular data — records with multiple comparable attributes in rows and columns, with an optional clickable-row variant. |

## Data display / Containment

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `card` | Full Card | `css/components/card.css` | A rich content panel that groups content and actions about a single subject on a surface. |
| `item` | Basic Card | `css/components/item.css` | The reusable compact-row primitive — media + content (title/description) + actions — that every compact domain card is built on. |

## Display

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `avatar` | Avatar | `css/components/avatar.css` | A circle showing a person's photo or initials over a brand tonal fill — identifies a person, never a non-person entity. |
| `badge` | Badge | `css/components/badge.css` | A read-only pill communicating an item's status, category, or a count — each color carries a fixed meaning; never interactive. |

## Docs shell (not a product component)

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `nav-card` | Nav Card | `(docs-internal — no css/components file; styles inline in index.html)` | A documentation-shell-only navigation card that links into sections of the docs site — NOT part of the consumable library. |

## Domain cards

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `kanban-card` | Kanban Card | `css/components/kanban.css` | A compact draggable card representing one item (candidate or vacancy) on a kanban board column, where the item's current stage is the primary infor… |
| `person-card` | Person Card | `css/components/person-card.css` | A documented Person variant of Basic Card (Item) — a compact profile row (brand avatar + name + role); NOT a separate component. |
| `vacancy-card` | Vacancy Card | `css/components/vacancy-card.css` | A domain card summarizing a job vacancy — icon, title, status badge, meta, optional stats and assignees — used as a list unit that navigates to the… |

## Feedback

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `alert` | Alert | `css/components/alert.css` | An inline, persistent contextual message that stays in the page flow until the user resolves or dismisses it. |
| `empty-state` | Empty State | `css/components/empty-state.css` | A centered icon + message (+ optional primary action) shown when there is no content to display — always offering a clear way out, not just a message. |
| `loading` | Loading (Progress + Spinner) | `['css/components/progress.css', 'css/components/spinner.css']` | Loading indicators that signal an operation is in progress — a determinate Progress bar/ring when a percentage is known, an indeterminate Spinner w… |
| `placeholder` | Placeholder Panel | `css/components/placeholder.css` | A centred panel that fills a region which has nothing to show *yet in this session* — nothing selected, a feature not built. Never for a list that… |
| `skeleton` | Skeleton | `css/components/skeleton.css` | An animated shimmer placeholder that mimics the layout of content while data loads — for loads with a known structure, in place of ad-hoc spinners. |
| `snackbar` | Snackbar | `css/components/toast.css` | A floating, ephemeral, non-blocking message that confirms something already happened, with at most one recovery action. |
| `tooltip` | Tooltip | `['css/components/tooltip.css', 'css/components/rich-tooltip.css']` | A small hover/focus text label that clarifies an ambiguous control — plus a click-triggered Rich Tooltip for a title + text + action preview. Never… |

## Form

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `date-picker` | Date Picker | `css/components/date-picker.css` | A trigger button showing the chosen date, which opens a Calendar in a floating panel below it — the form and toolbar default, for when a permanent… |
| `description` | Description Section | `css/components/description.css` | A bordered block with an editable heading and a rich-text body — for long-form content the person writes in named, reorderable sections, not for a… |

## Forms

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `form` | Form | `css/components/form.css` | The layout + validation pattern that composes labels, controls, hints, and errors into an accessible form using native HTML5 validation. |
| `input` | Input | `css/components/form.css` | A single-line text field for free-form entry, with label, hint, error, and optional leading/trailing icons. |
| `input-group` | Input Group | `css/components/input-group.css` | Joins an input with adjacent addons — icons, text, units, or buttons — into a single bordered unit that shares one focus/error state. |
| `input-otp` | Input OTP | `css/components/input-otp.css` | One-time-code / PIN entry in individual single-character boxes, with auto-advance, backspace-back, and paste-splitting. |
| `label` | Label | `css/components/label.css` | A standalone styled <label> for any form control, especially non-text controls, decoupled from the text-input field-group. |
| `select` | Select | `css/components/select.css` | Choose exactly one option from a short-to-medium bounded list via a themed dropdown listbox. |
| `slider` | Slider | `css/components/slider.css` | Selects a value (or a range) within a continuum with immediate feedback — for values where the exact number matters little. |
| `switch` | Switch | `css/components/switch.css` | A binary on/off control with immediate effect — flipping it applies the setting instantly, no separate confirm button. |
| `textarea` | Textarea | `css/components/form.css` | A multi-line text field for paragraph-length free-form input, with the same label/hint/error language as Input. |

## Forms / Selection

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `combobox` | Combobox | `css/components/combobox.css` | A searchable single-select — a trigger button that opens a filterable Command list; pick one value from a long set by typing to narrow it. |

## Input

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `calendar` | Calendar | `css/components/calendar.css` | A month-grid date/range picker with real month/year navigation — the base of the Date Picker, usable inline or docked in a popover, dialog, or sheet. |

## Layout

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `aspect-ratio` | Aspect Ratio | `layout primitive — no dedicated css/components file; uses the native CSS aspect-ratio property` | A layout primitive that locks content to a fixed width:height ratio while the width stays fluid — for media, thumbnails, and embeds. |
| `composition` | Composition (estructura de página) | `css/composition.css` | The skeleton of a page — which of the four structures it uses, where the text stops, how the sections breathe, and the two marks that make it read… |
| `create-form` | Create Form (header + sticky footer) | `css/components/create-form.css` | The frame for a full-page creation or editing form — a large title above, and a footer that sticks to the bottom of the viewport so the save action… |
| `mobile` | Mobile (React Native) | `css/variables.css` | What changes when the target is a native app instead of a browser — the type scale, the density, the touch floor and the component map — and, more… |
| `page-header` | Page Header | `css/components/page-header.css` | The title of a view plus its actions, on one row at the top of the content column — the anchor that tells a person which screen they are on. |
| `scroll-area` | Scroll Area | `css/components/scroll-area.css` | A scroll container with a discreet, consistent custom scrollbar — pure CSS, for overflow regions inside a panel, menu, or sheet. |
| `space` | Space (capa espacial de Amalgama) | `css/space.css` | Amalgama's own space layer — deep navy canvas with a starfield, one glow, thin orbits, planets and the ghost title. It is studio identity, so it go… |

## Navigation

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `back-link` | Back Link | `css/components/back-link.css` | A quiet inline link with a leading chevron that returns to the parent view from a detail page — one step up, never a general-purpose action. |
| `breadcrumb` | Breadcrumb | `css/components/breadcrumb.css` | A hierarchy trail showing where the user is and letting them jump back to an ancestor. |
| `nav-bar` | Navigation Bar | `css/layout.css` | The app-shell sidebar rail — the persistent list of top-level destinations (icon + label) that anchors primary navigation on desktop. |
| `nav-drawer` | Navigation Drawer | `css/layout.css` | The app-shell sidebar in its compact form — below 768px it becomes a modal, off-canvas drawer that slides in over a scrim, toggled by the topbar ha… |
| `navigation-menu` | Navigation Menu | `css/components/navigation-menu.css` | A horizontal row of navigation triggers that reveal grouped-link flyout panels — the top-nav mega-menu pattern. |
| `pagination` | Pagination | `css/components/pagination.css` | Navigate between pages of a paged result set — previous/next, numbered pages, and an ellipsis for large ranges. |
| `topbar` | Top Bar | `css/layout.css` | The app-shell header for each view — surfaces navigation context (breadcrumbs / menu), the current view's actions, and global actions (notification… |

## Navigation / Containment

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `tabs` | Tabs | `css/components/tabs.css` | Switch between mutually exclusive views of the same entity, showing one panel at a time. |

## Navigation / Forms

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `search` | Search | `css/components/search.css` | Free-text search of content, in two official variants — a standalone pill Search Bar (mobile/hero) and a compact Search Field inside a Toolbar (des… |

## Overlays

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `command` | Command | `css/components/command.css` | A searchable command palette / filterable list — substring-filtered items with arrow/Enter navigation and an empty state, optionally opened as a ⌘K… |
| `context-menu` | Context Menu | `css/components/context-menu.css` | A cursor-anchored actions menu opened by right-click (or long-press) on an element — the same panel as Dropdown Menu, just a different trigger. |
| `dialog` | Dialog | `css/components/modal.css` | A modal surface that interrupts the user for a focused task or a decision that must be resolved before continuing. |
| `menu` | Menu (Dropdown Menu + Popover) | `['css/components/dropdown-menu.css', 'css/components/popover.css']` | A trigger-anchored floating surface — a Dropdown Menu for a keyboard-navigable list of actions, or a Popover for freeform contextual content. |
| `menubar` | Menubar | `css/components/menubar.css` | A horizontal, always-visible bar of top-level triggers (Archivo, Editar…), each opening an actions panel — the desktop-application menu pattern. |
| `sheet-bottom` | Bottom Sheet | `css/components/sheet.css` | An edge-anchored modal panel that slides up from the bottom for quick actions or supplementary content — the preferred overlay on mobile/compact. |
| `sheet-side` | Side Sheet | `css/components/sheet.css` | An edge-anchored modal panel that slides in from a lateral (or top) edge for filters, item detail, or secondary forms — the desktop counterpart of… |

## Selección

| id | Nombre | Fuente CSS | Resumen |
|---|---|---|---|
| `checkbox` | Checkbox | `css/components/checkbox.css` | A native checkbox for selecting one or more options from a set — three states (unchecked / checked / indeterminate); the change applies on confirm,… |
| `radio` | Radio Button | `css/components/radio-group.css` | A native radio group for an exclusive single choice among 2–5 mutually exclusive values, all visible at once for comparison. |
