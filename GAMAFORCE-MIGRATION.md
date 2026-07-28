# GAMAFORCE-MIGRATION.md — Redesigning Gamaforce with Embassy

This is the **Gamaforce-specific migration guide** for the Amalgama Design System (Embassy).
Gamaforce is a recruiting / ATS-style product — vacantes, candidatos, personas/equipos,
estructura organizacional, pipeline de recruiting (kanban) y dashboards. Its screens are
currently inconsistent and poorly designed; this guide is the contract for redesigning any
one of them with Embassy so the result is token-correct **and** actually usable.

This document is a **layer on top of the generic migration contract**, not a replacement.
It does not restate the token-replacement algorithm, the legacy→DS mapping table, the
anti-pattern catalog, or the verification checklist — those live in **[MIGRATION.md](MIGRATION.md)**
and you must read that first. What this file adds is: the Gamaforce screen inventory, the
domain components built specifically for Gamaforce (`vacancy-card`, `kanban`, `person-card`),
per-screen-type recipes with real markup, and Gamaforce-tuned checklists.

---

## 1. Purpose & how to use this guide

**Who reads this:** a developer, designer, or AI agent tasked with redesigning an existing
(inconsistent) Gamaforce screen with Embassy — or building a new Gamaforce screen from scratch.

**When to use it:** any time you touch a Gamaforce vista. Start here to identify the screen
type, then follow the workflow in §3 and the per-screen recipe in §4.

**The source-of-truth stack — read in this order, do not duplicate their content, cite them:**

| Need | Authoritative source |
|---|---|
| How to *consume/extend* Embassy (buildless CSS + vanilla JS is canonical; tokens are law; fonts; icons; breakpoints; mobile shell) | **[CLAUDE.md](CLAUDE.md)** |
| How to *transform legacy → DS* (token-replacement algorithm, legacy→DS mapping table, anti-pattern catalog, verification checklist) | **[MIGRATION.md](MIGRATION.md)** — the generic contract this file layers on |
| Cross-component consistency, one-primary-action, hierarchy, spacing/radius/state rules, app-shell structure (§14) | **[GOVERNANCE.md](GOVERNANCE.md)** |
| Per-component decision + usage contract (`when_to_use` / `when_not_to_use` / variants / states / a11y) | **`component-rules/<id>.md`** (e.g. `button.md`, `chip.md`, `dialog.md`, `vacancy-card.md`, `kanban-card.md`, `person-card.md`) |
| How to build a good *screen* (UX laws, IA, hierarchy, forms, tables, dashboards, states, navigation, responsive, a11y, copy, motion) | **`guidelines/*.md`** — the Playbook |
| Component implementation (classes, variants, tokens, states) | **`css/components/<name>.css`** header + body |

**Golden rule (from MIGRATION.md §5):** *DS rules win over visual fidelity to the legacy
Gamaforce design — always.* If a legacy screen forces a choice between "looks like today" and
"follows Embassy", Embassy wins, and you report the divergence for designer sign-off.

**Never invent a component.** Every class you write must exist in `css/components/`. If no
documented pattern fits a Gamaforce element, **stop and flag it as a DS gap** (MIGRATION.md
§Gaps) — do not improvise a lookalike.

---

## 2. Screen audit process

Before redesigning, audit the existing screen. Each row = **what to look for** + **the Embassy
rule it violates** (with the doc to cite). Record every hit; they become your migration backlog.

### 2.1 Invented / incorrect components

| Look for | Violates | Fix |
|---|---|---|
| A custom card/box/panel `<div>` with hand-rolled border+shadow | MIGRATION.md mapping: generic panel → `.card` | Map to `.card` / `.card-elevated` / `.card-filled` (card.css) |
| A "vacante row" built as ad-hoc flex | Domain component exists | Use `.vacancy-card` (vacancy-card.css) |
| A "persona" tile built as ad-hoc flex | Domain component exists | Use `.item item-outline item-clickable person-card` (person-card.css) |
| A pipeline/board hand-built with columns | Domain component exists | Use `.kanban-board` / `.kanban-column` / `.kanban-card` (kanban.css) |
| A KPI number in a styled `<div>` | metric widget → `.stat-card` | Use `.stat-card` inside `.stats-grid` (stat-card.css) |
| A drag-resize split pane | **Not implemented** — dropped in the 2026-07 revert | Flag as DS gap; do not build a resize engine (CLAUDE.md) |

### 2.2 Hardcoded values instead of tokens

| Look for | Violates | Fix |
|---|---|---|
| Any raw hex (`#3b82f6`, `#fff`, `#1c2438`) in CSS/inline styles | Tokens are law (CLAUDE.md); MIGRATION.md §Color algorithm | Classify by element **role**, assign the semantic token — never nearest-hex |
| A "product mode" class redefining `--bg`/`--border`/`--text-primary` to legacy values | MIGRATION.md anti-pattern #3 (parallel token layer) | Delete it; DS token values ARE the target |
| Hand-written `@media (prefers-color-scheme)` / `.dark` overrides | MIGRATION.md anti-pattern #4 (per-theme CSS) | Delete; the semantic layer recalibrates under `data-theme="dark"` |
| `font: 600 20px 'Epilogue'` / loose `font-size: 15px` | MIGRATION.md §Typography; GOVERNANCE §8 | `--font-heading` + a `--font-size-*` token; snap to nearest role token |
| Custom rgba shadows | GOVERNANCE §9.1 | `--shadow-sm/md/lg` |

### 2.3 Poor hierarchy

- **Two+ equal-weight primary buttons** in one context → GOVERNANCE §Single primary; button.md `common_mistakes`. One `btn-primary`; the rest step down to `btn-secondary`/`btn-tertiary`/`btn-text`.
- **Flat "action row"** of identical buttons → MIGRATION.md anti-pattern #6. Introduce hierarchy.
- **Everything the same size/weight** (no clear entry point) → `guidelines/visual-hierarchy.md`. The main action / first metric must win the eye.

### 2.4 Inconsistent spacing

- Off-scale gaps (`13px`, `18px`, `margin: 22px`) → GOVERNANCE §7 / §14.5. All page spacing via `--space-*`. Reference: section blocks `--space-10`, cards in a grid `--space-6`, list items `--space-4`, page-header→content `--space-8`.
- Radius overridden inline on buttons instead of via the size class → button.md `size_selection`; GOVERNANCE §4.3.

### 2.5 Accessibility issues

- Icon-only button with no `aria-label` → button.md; `guidelines/accessibility.md`.
- Clickable card/row that isn't focusable → add `tabindex="0" role="button"` (vacancy-card / kanban / person-card `Uso:` blocks) or use `<a>`.
- Removed focus ring → GOVERNANCE §6.2 (focus ring is mandatory, never removed).
- Color-only status (colored text, no label/shape) → MIGRATION.md anti-pattern #2; use a `.badge`.
- Touch target < 44px on mobile primary actions → button.md `responsive`.

### 2.6 Missing states

For **every** list, table, form and async surface, check the four states exist — not just the happy path (`guidelines/feedback-and-states.md`):

- **Empty** — is there an `.empty-state` (no data / no results)? Not a bare "no hay datos" string.
- **Loading** — `.skeleton` for content-shaped waits (default); `.spinner`/progress for actions.
- **Error** — inline `.alert alert-error` for load/validation failure; `.toast toast-error` for transient.
- **Disabled** — canonical disabled tokens (GOVERNANCE §5.3), not opacity hacks.

### 2.7 Wrong navigation patterns

- **Tabs used for page navigation** → `guidelines/navigation.md`; tabs are same-page view switching. Page nav lives in the `.sidebar`.
- **No app shell** on a persistent-nav screen → wrap in the `.app` shell (GOVERNANCE §14.1).
- **Custom mobile nav** improvised → below 768px the sidebar is the **modal navigation drawer** shipped in `layout.css` (GOVERNANCE §14.3). Use it.
- **Deep/duplicated nav trees** → `guidelines/information-architecture.md` (keep the tree shallow).

### 2.8 Excessive complexity

- Everything on one screen, no progressive disclosure → `guidelines/ux-laws-and-heuristics.md` (Hick's Law, Progressive Disclosure). Push detail behind drill-down / Dialog / Sheet.
- A dashboard that's a wall of equal widgets → `guidelines/dashboards.md` (summary before detail).

### 2.9 Misuse of specific components (Gamaforce-frequent)

| Symptom | Rule |
|---|---|
| Colored text label used as a status | badge.md — any categorical/status label is a `.badge`, never styled text |
| A `.chip` used to trigger an action | chip.md — chips filter/select/represent input; actions are buttons |
| A `.card` where a `.stat-card` belongs (KPI) | stat-card.css `Cuándo usar` |
| A `.card` where the compact row primitive fits (`.item`) | item.css — rich reusable rows are `.item*` |
| A Toast used for a decision the user must make | dialog.md / feedback-and-states.md — decisions are Dialogs, not Toasts |
| A full search box (`.search-bar`) inside a toolbar | toolbar.css — in-toolbar search is `.search-field` |
| Checkboxes styled ad-hoc | checkbox.css — native `<input type="checkbox">` restyled |
| A `<select>` that should be a filter Chip set, or vice-versa | chip.md vs select.md — refine list = chips/select in toolbar; single form value = `<select>` |

---

## 3. Migration workflow (11 ordered steps)

Follow in order. Each step names the concrete Embassy rule and where to consult.

1. **User + business goal.** What is this screen *for*? What is the one thing the user came to do? → the single `btn-primary` maps to it. Consult: `guidelines/information-architecture.md`, `visual-hierarchy.md`.
2. **IA / hierarchy audit.** Group and rank content: primary action, primary content, secondary, tertiary. Decide entry point. → `guidelines/information-architecture.md` (grouping/labeling/depth) + `visual-hierarchy.md`.
3. **Map UI elements → Embassy components.** Every element gets a DS component from MIGRATION.md's mapping table (+ the Gamaforce domain components in §5 here). No match → flag a DS gap, don't improvise.
4. **Remove duplication.** Collapse repeated ad-hoc patterns into one Embassy component. Two card styles → one `.card`. Three status colors → `.badge` variants. → GOVERNANCE §3 (single visual identity).
5. **Layout + spacing.** Wrap in the `.app` shell (GOVERNANCE §14.1); page-level spacing via `--space-*` (§14.5); grids via auto-fill `grid-template-columns: repeat(auto-fill, minmax(…,1fr))` (§14.6); content width per §14.4 (forms ≤800px, prose ≤680px).
6. **Typography + color roles.** Classify each color by the **role** of the element it paints and assign the semantic token; every `font-size` via a `--font-size-*` token; page text is navy `--text-primary`, never black. → MIGRATION.md §Color algorithm + §Typography.
7. **Responsive.** Verify at 375 / 768 / 1280. Reflow multi-column → single column below 768px; sidebar → modal drawer below 768px (GOVERNANCE §14.3). → `guidelines/responsive-layout.md`.
8. **Interaction + motion.** Use existing vanilla behaviors (`openOverlay`/`closeOverlay`, `switchCompTab`, `initDataTable`, `initCalendar`, flyout positioning) — don't reinvent. Motion via duration/easing tokens; honor `prefers-reduced-motion`. → GOVERNANCE §13, `guidelines/motion.md`.
9. **Accessibility.** Roles/labels on icon buttons and clickable cards; visible focus ring (never removed); keyboard reachable; status by label+color, not color alone; ≥44px touch targets. → `guidelines/accessibility.md`, GOVERNANCE §6.2.
10. **Validate all states.** Empty / loading / error / disabled designed and wired, not just the happy path. → `guidelines/feedback-and-states.md`.
11. **Visual + functional regression.** Run the MIGRATION.md verification checklist (grep for raw hex / loose font-size / quoted families / token redefinition; one `btn-primary`; no `width:100%` buttons). Render light **and** `data-theme="dark"`. Write the **divergence report**. → MIGRATION.md §Verification.

---

## 4. Screen patterns

For each Gamaforce screen type: recommended layout, Embassy components (by name), action
hierarchy, responsive behavior, common mistakes, accessibility notes, a short HTML skeleton
using **real flat classes**, and the Playbook guide to consult. All examples inside the
`.app` shell unless noted. Product copy is rioplatense Spanish.

> **App shell (shared by all app screens).** Shipped classes in `layout.css` are `.app` /
> `.sidebar` / `.topbar` / `.main` (GOVERNANCE §14.1 note — follow `layout.css`, the
> `.app-shell`/`.shell-*` names in the prose are aspirational drift). Skeleton:
>
> ```html
> <div class="app">
>   <aside class="sidebar" role="navigation">
>     <nav class="sidebar-nav">
>       <a class="nav-item active" href="#">Vacantes</a>
>       <a class="nav-item" href="#">Candidatos</a>
>       <a class="nav-item" href="#">Equipos</a>
>     </nav>
>   </aside>
>   <div class="content">
>     <header class="topbar">
>       <button class="shell-menu-btn icon-btn" aria-label="Abrir navegación" aria-expanded="false" aria-controls="sidebar"><i data-lucide="menu"></i></button>
>       <!-- breadcrumb / search / avatar -->
>     </header>
>     <main class="main"><!-- page content --></main>
>   </div>
> </div>
> ```

---

### 4.1 Dashboard — *Panel de reclutamiento*

- **Layout:** `.page-header` → `.stats-grid` (KPI row) → grouped `.card` widgets (charts, recent activity) in an auto-fill grid.
- **Components:** `page-header`, `stat-card` (in `stats-grid`), `card`, `chart`, `empty-state`, `skeleton`.
- **Action hierarchy:** one `btn-primary` in the header (`+ Nueva vacante`). Widget-level actions are `btn-text`/`icon-btn`.
- **Responsive:** `stats-grid` and widget grid via `repeat(auto-fill, minmax(240px,1fr))` — reflows to 1 column below 768px.
- **Common mistakes:** wall of equal widgets (no summary-before-detail); KPIs as plain `.card` instead of `.stat-card`; a spinner where `.skeleton` belongs.
- **A11y:** each stat has a text label (not number alone); charts keep a `<title>`/text fallback.
- **Playbook:** `guidelines/dashboards.md`.

```html
<div class="page-header">
  <h1 class="page-title">Panel de reclutamiento</h1>
  <div class="header-actions"><button class="btn-primary">+ Nueva vacante</button></div>
</div>
<div class="stats-grid">
  <div class="stat-card"><div class="stat-label">Vacantes abiertas</div><div class="stat-value">24</div><div class="stat-change stat-change-positive">+12%</div></div>
  <div class="stat-card"><div class="stat-label">Candidatos activos</div><div class="stat-value">148</div><div class="stat-change stat-change-negative">−4%</div></div>
  <div class="stat-card"><div class="stat-label">Contrataciones (mes)</div><div class="stat-value">7</div></div>
</div>
```

### 4.2 List — *Listado de vacantes / candidatos*

- **Layout:** `.page-header` → `.toolbar` (search + filtros) → list of domain cards → `.pagination`.
- **Components:** `page-header`, `toolbar` + `search-field`, `chip`/`chip-selected` (filtros bajo la toolbar), `vacancy-card` (vacantes) or `person-card` (personas), `empty-state`, `skeleton`, `pagination`.
- **Action hierarchy:** one `btn-primary` in header; each card row is the navigable element (not a button per row).
- **Responsive:** cards stack full-width below 768px; toolbar wraps.
- **Common mistakes:** ad-hoc flex rows instead of `vacancy-card`/`person-card`; `.search-bar` inside the toolbar (use `.search-field`); status as colored text (use `.badge`).
- **A11y:** clickable card = `tabindex="0" role="button"` (or `<a>`); result count announced.
- **Playbook:** `guidelines/tables-and-data.md` (Table vs List vs Card grid), `navigation.md`.

```html
<div class="toolbar">
  <div class="search-field"><i data-lucide="search"></i><input type="text" placeholder="Buscar vacantes..."></div>
  <button class="toolbar-btn">Filtros</button>
  <button class="toolbar-btn">Ordenar</button>
</div>
<div class="chip-set">
  <span class="chip chip-selected">Abiertas</span>
  <span class="chip">Tecnología</span>
  <span class="chip">Remoto</span>
</div>
<div class="vacancies-list">
  <div class="vacancy-card" tabindex="0" role="button">
    <div class="vacancy-icon">💼</div>
    <div class="vacancy-info">
      <div class="vacancy-name">Desarrollador Frontend <span class="badge badge-open">Abierta</span></div>
      <div class="vacancy-meta">Tecnología <span class="meta-dot"></span> Remoto</div>
    </div>
    <div class="vacancy-right"><div class="vacancy-age">3d</div></div>
  </div>
</div>
```

### 4.3 Table — *Tabla de candidatos*

- **Layout:** `.page-header` → `.toolbar` → `.table-scroll` wrapping `.data-table` → pagination (built-in).
- **Components:** `toolbar` + `search-field`, `data-table` (sort + filtro + selección de filas + visibilidad de columnas + paginación via `initDataTable()` over `[data-datatable]`), `badge` (status cells), `empty-state`, `skeleton`.
- **Action hierarchy:** bulk actions appear when rows are selected; one primary bulk action.
- **Responsive:** wrap in `.table-scroll` so wide tables scroll **inside their own container** (never stretch the page). On mobile consider collapsing to a card list.
- **Common mistakes:** table without `.table-scroll`; hand-wired sort/paginate instead of `initDataTable()`; clickable rows without `tr.clickable` + `tabindex`.
- **A11y:** sortable headers expose `aria-sort`; clickable rows keyboard-activatable.
- **Playbook:** `guidelines/tables-and-data.md`.

```html
<div class="table-scroll">
  <table class="data-table" data-datatable>
    <thead><tr><th>Candidato</th><th>Vacante</th><th>Estado</th><th>Aplicó</th></tr></thead>
    <tbody>
      <tr class="clickable" tabindex="0"><td>María García</td><td>Frontend</td><td><span class="badge badge-active">En revisión</span></td><td>15 mar</td></tr>
    </tbody>
  </table>
</div>
```

### 4.4 Detail page — *Vacante (detalle)*

- **Layout:** `.back-link` → `.page-header` (title + actions) → content in `.card` sections; optional `.tabs` for same-page views (Descripción / Candidatos / Actividad).
- **Components:** `back-link`, `page-header`, `card`, `tabs`, `badge`, `description`, `sheet` (side) for edit/detail panels.
- **Action hierarchy:** one `btn-primary` (e.g. `Publicar` / `Editar`); secondary actions in a `dropdown-menu` (overflow) via `icon-btn`.
- **Responsive:** two-column content collapses to one below 768px; side Sheet is full-width on mobile.
- **Common mistakes:** tabs used for navigation to other pages; more than one primary action.
- **A11y:** breadcrumb/back link present; tab list has proper ARIA (handled by `.tabs`).
- **Playbook:** `guidelines/navigation.md`, `information-architecture.md`.

```html
<a class="back-link" href="#"><i data-lucide="arrow-left"></i> Vacantes</a>
<div class="page-header">
  <h1 class="page-title">Desarrollador Frontend <span class="badge badge-open">Abierta</span></h1>
  <div class="header-actions">
    <button class="btn-secondary">Editar</button>
    <button class="btn-primary">Ver candidatos</button>
  </div>
</div>
```

### 4.5 Profile — *Perfil de persona / candidato*

- **Layout:** `.back-link` → header with `.avatar` + name/role → `.card` sections (contacto, historial, notas).
- **Components:** `avatar`, `person-card` (in related lists), `card`, `item` (rich rows: contacto, adjuntos), `badge`, `tabs`, `attachment`.
- **Action hierarchy:** one primary (`Mover a entrevista` / `Contactar`); rest secondary/tertiary.
- **Responsive:** single column below 768px.
- **Common mistakes:** custom profile card instead of the `.item person-card` variant; ad-hoc contact rows instead of `.item`.
- **A11y:** avatar has accessible name; action buttons labelled.
- **Playbook:** `guidelines/information-architecture.md`, `visual-hierarchy.md`.

### 4.6 Form — *Editar vacante / datos de candidato*

- **Layout:** constrained width (≤800px); fields via `form.css` anatomy (label + input + hint/error slots); footer with actions.
- **Components:** `form.css` (`field-group`, `field-label`, native `<input>/<select>/<textarea>`, `field-hint`, `field-error-msg`, `is-error`), `label`, `checkbox`/`radio-group`/`switch`, `select`, `date-picker` (composition of Calendar), `button`.
- **Action hierarchy:** footer = one `btn-primary` (`Guardar cambios`) + `btn-tertiary`/`btn-secondary` Cancel (Cancel is the safe default, never dominant).
- **Responsive:** single-column fields on mobile; footer stacks rather than shrinking below the touch target.
- **Common mistakes:** full-width stretched submit button (reads as a field); placeholder used as label; validation only on submit with no prevention.
- **A11y:** every input has a `<label>`; errors linked via `aria-describedby` (`is-error` + `field-error-msg`); required marked.
- **Playbook:** `guidelines/forms.md`.

```html
<div class="field-group">
  <label class="field-label" for="titulo">Título de la vacante</label>
  <input id="titulo" type="text" placeholder="Ej: Desarrollador Frontend">
  <span class="field-hint">Aparece en el listado público.</span>
</div>
<div class="field-group is-error">
  <label class="field-label" for="area">Área</label>
  <select id="area" aria-describedby="area-err"><option>Tecnología</option></select>
  <span class="field-error-msg" id="area-err">Seleccioná un área.</span>
</div>
<div class="btn-group">
  <button class="btn-primary">Guardar cambios</button>
  <button class="btn-tertiary">Cancelar</button>
</div>
```

### 4.7 Create / Edit flow — *Crear vacante (full-page)*

- **Layout:** full-page with **sticky** header + footer via `create-form.css`; form body between them; width ≤800px.
- **Components:** `create-header` / `create-title`, form fields (`form.css`), `create-footer` with buttons. For short tasks use a **Dialog** instead (dialog.md `when_not_to_use`: large flow → dedicated page).
- **Action hierarchy:** footer = one `btn-primary` (`Publicar`) + `btn-tertiary` Cancel.
- **Responsive:** footer stays sticky; buttons stack on narrow widths.
- **Common mistakes:** using a Modal for a long multi-section form; multiple primaries in the footer.
- **A11y:** logical tab order; unsaved-changes guard on cancel/navigate-away.
- **Playbook:** `guidelines/forms.md` (§Multi-step & unsaved work).

```html
<div class="create-header"><h1 class="create-title">Crear vacante</h1></div>
<!-- form body -->
<div class="create-footer">
  <button class="btn-tertiary">Cancelar</button>
  <button class="btn-primary">Publicar</button>
</div>
```

### 4.8 Search & filtering

- **Layout:** search + filters live in the `.toolbar` above the list/table; active filters as a `.chip-set` below.
- **Components:** `search-field` (in-toolbar; **not** `.search-bar`, which is the 56px standalone/mobile hero variant), `chip`/`chip-selected` (filtros), `select`/`dropdown-menu` (opciones), `empty-state` (no results).
- **Equal-hierarchy filter controls:** when the bar holds 2+ filters of the same hierarchy (e.g. `select` + `seg-btn-group` + `date-picker` on a dashboard), add the **`.toolbar-filters`** variant so they share one field treatment (surface/border/radius/height) — the Segmented Button's selected segment keeps its primary state. Don't leave a transparent pill/date trigger next to filled Select fields, and don't restyle the standalone components. (There is no separate "Filter Toolbar" — it's this Toolbar variant.)
- **Action hierarchy:** filtering is not a button action — chips/selects refine; a `btn-text` "Limpiar filtros" is the only button. A page action in `.toolbar-actions` is Filled/Primary only if it's the view's main action, else Tonal (GOVERNANCE §20.5).
- **Responsive:** `.search-bar` can expand to `.search-view` fullscreen on mobile.
- **Common mistakes:** chips used to trigger actions; standalone `.search-bar` inside a toolbar; no empty state for zero results.
- **A11y:** search input in a `role="search"` region; removable chips have an accessible remove control (`chip-remove`).
- **Playbook:** `guidelines/tables-and-data.md` (§Toolbar), `navigation.md`.

### 4.9 Calendar — *Entrevistas / disponibilidad*

- **Components:** `calendar` (dynamic month renderer via `initCalendar()` on `[data-calendar]`); **Date Picker** and **Date & Time Picker** are documented compositions backed by `date-picker.css` (there is no separate Date Picker page). Presentations: inline · in a Popover · in a Dialog · in a Sheet.
- **Patterns available:** range (`data-cal-mode="range"`), presets (`.calendar-with-presets`), booked/non-selectable dates (`data-cal-booked`), week numbers (`data-cal-weeknumbers`).
- **Common mistakes:** hand-rolling a month grid; expecting roving-grid keyboard nav (intentionally simplified — no collision detection, no react-day-picker keyboard).
- **A11y:** labels via `Intl.DateTimeFormat`; flag the missing roving-grid keyboard if the screen needs full keyboard date entry.
- **Playbook:** `guidelines/forms.md` (input types), `feedback-and-states.md`.

### 4.10 Task management (kanban) — *Pipeline de recruiting*

- **Layout:** `.page-header` → `.kanban-board` with `.kanban-column`s; each column has a header with a count and a body of `.kanban-card`s.
- **Components:** `kanban` (`kanban-board`, `kanban-column`, `kanban-column-header` + `.count`, `kanban-column-body`, `kanban-card`), `badge`, `avatar`.
- **Action hierarchy:** one `btn-primary` in the header; card-level actions minimal.
- **Responsive:** columns scroll horizontally (`grid-auto-flow: column; overflow-x:auto`); do not force-wrap columns.
- **Common mistakes:** building the board with ad-hoc columns; cards not focusable/draggable-accessible.
- **A11y:** draggable card = `tabindex="0" role="button"`; column counts are text.
- **Playbook:** `guidelines/dashboards.md` isn't it — use `information-architecture.md` + kanban-card.md rules.

```html
<div class="kanban-board">
  <div class="kanban-column">
    <div class="kanban-column-header">Aplicados <span class="count">5</span></div>
    <div class="kanban-column-body">
      <div class="kanban-card" tabindex="0" role="button">
        <div class="kanban-card-title">Juan Pérez</div>
        <div class="kanban-card-meta">Frontend · 3 días</div>
      </div>
    </div>
  </div>
  <div class="kanban-column">
    <div class="kanban-column-header">En entrevista <span class="count">2</span></div>
    <div class="kanban-column-body"><!-- cards --></div>
  </div>
</div>
```

### 4.11 Recruiting flow

A recruiting flow is a **composition**, not a new component: a candidate advancing through
stages. Use the **kanban** (§4.10) for the pipeline board view, the **Detail page** (§4.4)
for a candidate's stage detail, a **Dialog** for stage-change confirmation, and a **Toast**
(`toast-success`) for the "Movido a entrevista" feedback. One `btn-primary` per screen
("Mover de etapa"). Consult `guidelines/feedback-and-states.md` for the confirm→feedback loop.

### 4.12 Candidate management

- **List view:** §4.3 Table (dense, sortable, bulk-select via `data-table` row selection).
- **Card grid view:** §4.2 List with `person-card`.
- Provide a **Segmented Button** (`seg-btn-group`) to switch table ↔ grid view (view switch, not tabs). Never use tabs for a view-mode toggle. → `guidelines/navigation.md` (§In-page view switching).

### 4.13 Organizational structure — *Equipos / organigrama*

- **Layout:** grouped `.card` sections per team; members as `.item person-card` in a people grid; hierarchy via nested `.card`/`.item-group` with `.item-separator`.
- **Components:** `card`, `item` / `person-card`, `avatar`, `badge` (rol), `breadcrumb` (drill into a team), `collapsible`/`accordion` for expandable branches.
- **Common mistakes:** improvising a tree-diagram engine (none exists — flag as a DS gap if a true org-chart visualization is required); custom person tiles instead of `person-card`.
- **A11y:** collapsible branches expose `aria-expanded`; keyboard-operable.
- **Playbook:** `guidelines/information-architecture.md`.

### 4.14 Empty state

- **Component:** `empty-state` (`empty-state-icon`, `-title`, `-desc`, optional CTA `btn-primary`).
- **When:** list/table/search with no data or no results. For a feature under construction use `.placeholder`; for a content-shaped wait use `.skeleton` — not empty-state.
- **Copy (rioplatense):** title states the situation, desc + CTA state the next step — `No hay vacantes` / `Creá tu primera vacante para empezar.`
- **Playbook:** `guidelines/feedback-and-states.md` (§Empty states — never a blank void).

```html
<div class="empty-state">
  <div class="empty-state-icon">📭</div>
  <div class="empty-state-title">No hay candidatos todavía</div>
  <p class="empty-state-desc">Compartí la vacante para empezar a recibir postulaciones.</p>
  <button class="btn-primary">Compartir vacante</button>
</div>
```

### 4.15 Loading state

- **Component:** `skeleton` (default for content-shaped waits — mirror the shape of the coming content: card skeletons for a card list, row skeletons for a table). Use `spinner`/`progress` for **actions** (button submit), not content loads.
- **When NOT a spinner:** content that has a known shape → skeleton (feedback-and-states.md §When NOT to show a spinner).
- **A11y:** `aria-busy` on the region; keep layout stable to avoid shift.
- **Playbook:** `guidelines/feedback-and-states.md` (§Loading states).

### 4.16 Error state

- **Inline / persistent** (load failed, validation): `.alert alert-error` (Alert = inline/persistent).
- **Transient** (action failed): `.toast toast-error` (Snackbar = floating/ephemeral).
- **Distinction:** Alert vs Snackbar is canonical — see feedback-and-states.md §Alert vs Snackbar.
- **Copy:** say what happened + how to recover — `No pudimos cargar las vacantes. Reintentá.` with a retry action.
- **A11y:** error region announced (`role="alert"` for the transient case).
- **Playbook:** `guidelines/feedback-and-states.md` (§Error states).

```html
<div class="alert alert-error" role="alert">
  <i data-lucide="alert-circle"></i>
  <div><strong>No pudimos cargar las vacantes.</strong> Revisá tu conexión y reintentá.</div>
  <button class="btn-text">Reintentar</button>
</div>
```

### 4.17 Confirmation / destructive-action flow — *Eliminar vacante*

- **Component:** **Alert Dialog** variant of `modal` (`modal[data-alert]`) — NOT dismissible by Escape or outside click; the user must choose. Driven by `openOverlay()`/`closeOverlay()`.
- **Action hierarchy:** confirm = `btn-primary btn-danger`; Cancel = `btn-secondary` (the safe default focus, never visually dominant). This Cancel-as-secondary standard is DS-wide (GOVERNANCE §20.1).
- **Copy:** title states the decision as a question; description states the consequence — `¿Eliminar esta vacante?` / `Se van a perder las 12 postulaciones asociadas. Esta acción no se puede deshacer.`
- **A11y:** `role="alertdialog"`, `aria-modal`, focus trapped, focus returns to trigger on close.
- **Playbook:** `guidelines/feedback-and-states.md`; rules in `component-rules/dialog.md`.

```html
<div class="modal-overlay">
  <div class="modal" role="alertdialog" data-alert="true" aria-labelledby="del-t" aria-describedby="del-d">
    <h2 class="modal-title" id="del-t">¿Eliminar esta vacante?</h2>
    <p class="modal-desc" id="del-d">Se van a perder las 12 postulaciones asociadas. Esta acción no se puede deshacer.</p>
    <div class="modal-footer">
      <button class="btn-secondary">Cancelar</button>
      <button class="btn-primary btn-danger">Eliminar</button>
    </div>
  </div>
</div>
```

---

## 5. Gamaforce domain components (built for this product)

These three exist **specifically for Gamaforce**. Use them — do not rebuild their layout.

| Component | Class contract | Use for | Do NOT use for | Rules |
|---|---|---|---|---|
| **Vacancy Card** | `.vacancy-card` (+ `vacancy-icon`/`-info`/`-name`/`-meta`/`-right`/`-age`, `meta-dot`) inside `.vacancies-list` | Vacante row: ícono + nombre + `.badge` status + meta + antigüedad | Personas (person-card); otros dominios (Card genérica) | `vacancy-card.css`, `component-rules/vacancy-card.md` |
| **Kanban** | `.kanban-board` › `.kanban-column` › `.kanban-column-header`+`.count` / `.kanban-column-body` › `.kanban-card` (`-title`/`-meta`) | Pipeline por columnas (recruiting/HR) | Datos tabulares (Table); listas simples (cards) | `kanban.css`, `component-rules/kanban-card.md` |
| **Person (variant of Basic Card)** | `.item item-outline item-clickable person-card` › `.item-media person-avatar` + `.item-content`(`-title`/`-description`) inside `.people-grid` | Persona en grilla: avatar + nombre + rol | Vacantes (vacancy-card); personas en tabla (Table); fila genérica sin avatar de marca (`.item` solo) | `person-card.css` (depends on `item.css`), `component-rules/person-card.md` |

Interactive cards must be focusable: add `tabindex="0" role="button"` or use `<a>` (per each `Uso:` block).

---

## 6. Checklists

Use as real checkboxes in the migration PR / review.

### 6.1 UI Audit Checklist (run on the *existing* screen, §2)

- [ ] No invented components — every element maps to a `css/components/` class or is flagged as a DS gap.
- [ ] Gamaforce domain patterns used where they apply (`vacancy-card`, `kanban`, `person-card`), not ad-hoc flex.
- [ ] No raw hex / no loose `font-size` / no quoted font families in the screen's CSS or inline styles.
- [ ] No parallel token layer (no class redefining `--bg`/`--border`/`--text-*`) and no hand-written per-theme overrides.
- [ ] Exactly one `btn-primary` per context; no flat action rows; no `width:100%` on buttons.
- [ ] Spacing on the `--space-*` scale; button radius via size class, not inline.
- [ ] Every status/categorical label is a `.badge`; every filter control is a `.chip`/select; chips don't trigger actions.
- [ ] KPIs are `.stat-card`; generic panels are `.card`; compact rich rows are `.item`.
- [ ] Empty / loading / error / disabled states all present (not just happy path).
- [ ] Navigation correct: sidebar for pages, tabs only for same-page views, segmented button for view-mode switch.
- [ ] Icon buttons have `aria-label`; clickable cards/rows are focusable; focus ring intact; status not color-only.

### 6.2 Migration Checklist (run *while* migrating, §3)

- [ ] Step 1 — user + business goal identified; the single primary action named.
- [ ] Step 2 — IA + hierarchy decided (primary/secondary/tertiary content and actions).
- [ ] Step 3 — every UI element mapped to an Embassy component (gaps flagged, not improvised).
- [ ] Step 4 — duplication collapsed into single components.
- [ ] Step 5 — wrapped in the `.app` shell; page spacing via `--space-*`; grids auto-fill; content width per §14.4.
- [ ] Step 6 — colors assigned by element role (semantic tokens); type via `--font-size-*` + `--font-*`; page text navy.
- [ ] Step 7 — verified at 375 / 768 / 1280; sidebar → modal drawer below 768px.
- [ ] Step 8 — reused existing vanilla behaviors; motion via tokens; `prefers-reduced-motion` honored.
- [ ] Step 9 — a11y pass (roles, labels, focus, keyboard, targets, status not color-only).
- [ ] Step 10 — all four states designed and wired.
- [ ] Step 11 — verification greps clean; light + dark rendered; divergence report written.

### 6.3 Definition of Done (a migrated Gamaforce screen)

- [ ] **Tokens only** — zero raw hex outside `variables.css`; every font-size a `--font-size-*` token; no redefined DS tokens.
- [ ] **One primary action** per context; hierarchy for the rest; no full-width stretched buttons.
- [ ] **All states designed** — empty (`empty-state`), loading (`skeleton`), error (`alert`/`toast`), disabled (canonical tokens).
- [ ] **Responsive** at 375 / 768 / 1280 — reflows cleanly; mobile nav = modal drawer.
- [ ] **Light + dark** both correct (`data-theme="dark"`), no per-theme overrides added.
- [ ] **Keyboard + focus** — every interactive element reachable, visible focus ring, logical order.
- [ ] **A11y roles/labels** — icon buttons labelled, dialogs/alertdialogs correct, clickable cards focusable, status by label+color.
- [ ] **No console errors**; Lucide icons render (`lucide.createIcons()`); vanilla initializers run.
- [ ] **Matches component-rules** — each component obeys its `component-rules/<id>.md` `when_to_use` / `common_mistakes`.
- [ ] **Divergence report** written for every DS-forced departure from the legacy Gamaforce design.
