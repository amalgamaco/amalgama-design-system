# Screen Patterns & UX Decision Rules

The **screen-level decision layer** of the design-system skill. `SKILL.md` §2–§9 govern one
*component*; this file governs a whole *screen* — how to turn a goal ("build/fix the candidatos
screen") into information architecture, a pattern, components, states, a responsive plan, and copy
**before** any markup exists.

**Read this whenever you create, redesign, improve, or audit a whole screen or flow** — not for a
single component (that's `SKILL.md` §2).

**Where it sits in the source-of-truth order.** This file *operationalizes* the repo's own flow —
`AI-USAGE-GUIDE.md` §1 (a→h) and `guidelines/*.md` — into an executable procedure. It never
overrides them: the repo is the WHY and the law; this is the HOW. **If this file and the repo
disagree, the repo wins** (and fix this file). Every archetype block ends with the `guidelines/` and
`component-rules/` files that are authoritative for it — read those, don't work from this summary
alone.

This layer makes the skill a **UX decision-maker, not a restyler**: it selects patterns and
components from *user + business goals*, reorganizes weak screens (moving, merging, splitting,
replacing, and removing elements), and refuses to preserve a poor layout just because it already
exists.

---

## 1. The 7-step screen decision procedure (mandatory, in order)

> `SKILL.md` §1 runs these seven and inserts **copy** as its own step before the build, against
> `guidelines/content-and-writing.md`. Copy is part of the design, not a pass afterwards.

Run **all seven** before writing markup, for every screen — create *and* redesign. Do not jump to
step 7 (visual implementation). A token-perfect screen with the wrong hierarchy, the wrong pattern,
or no error state is **not done**. State each step's answer in **one line** — if you can't, you
haven't made the decision yet.

### Step 1 — Goals (user goal + business goal)

- **User goal:** what is the one job the person came to this screen to do? ("Find the candidate for
  Sr. Frontend and move them forward.") Phrase it as a verb + object from the user's vocabulary
  (`content-and-writing.md`, Nielsen #2), never as a feature list.
- **Business goal:** what should this screen make more likely? (Faster time-to-hire → surface
  stalled candidates; conversion → make the primary CTA unmissable.)
- These two set the **primary action** (step 3) and what earns the top of the layout. When they
  conflict (business wants an upsell, user wants speed), resolve toward the user goal and make the
  business goal the *second* priority — a screen that fights its user converts worse.
- Look at: the request itself; if migrating, the legacy screen + `MIGRATION.md`.

### Step 2 — Information hierarchy

- Name the **one primary object** the screen is about (a vacancy *or* a candidate, never both as
  equals — `information-architecture.md`). Everything else is subordinate.
- Rank content into tiers: **must-see-first → supporting → on-demand**. Chunk within Miller's 7±2.
- Pick the container per grain of content: `stat-card` (one KPI) · `card`/`vacancy-card`/`person-card`
  (entity summary) · `table` (compare rows) · `list` (read items) · `kanban` (pipeline) ·
  `create-form` (focused entry). See the container table in `information-architecture.md`.
- Decide **depth**: aim ≤ 2–3 levels (section → entity → detail); add `breadcrumb` where depth ≥ 2.
- Look at: `information-architecture.md`, `visual-hierarchy.md`.

### Step 3 — Primary and secondary actions

- Exactly **one** `btn-primary` per view — the action the user is most likely to want, driven by
  step 1. Everything else steps down the ladder: **elevated → secondary → tertiary → text → icon**
  (`visual-hierarchy.md`; `SKILL.md` §3 Buttons).
- Overlay/dialog/sheet *triggers* are `btn-secondary` — the real primary lives inside the overlay.
- If the screen "needs" several equal-weight actions, that's a hierarchy failure — **introduce
  hierarchy**, don't replicate flatness. Never full-width or left-aligned buttons.
- List secondary actions and where they live: toolbar, row menu (`dropdown-menu`), overflow
  (`toolbar-overflow-btn`), or a `sheet`.

### Step 4 — Screen pattern + components

- Match the screen to an **archetype** in §2 below (list-collection, dashboard, entity-detail,
  create-edit-form, wizard, settings, pipeline-board, search-results, auth-entry, feed-activity,
  onboarding-first-run, confirmation-destructive). The archetype hands you the IA skeleton, the
  component recipe, the required states, and the anti-patterns.
- For each component the archetype names, run the per-component gate (`SKILL.md` §2): read
  `component-rules/<id>.md` → `css/components/<id>.css`, and state "this variant, because …".
- **Select by goal, never by visual resemblance.** A box with a magnifying glass is not
  automatically `search-field`; a "pick one" control is a `select`, not a styled `input`; a
  status token is a `badge`, not colored text. Confirm against each rule's `not_to_confuse_with`.

### Step 5 — Desktop + mobile structure (the correct pattern per viewport, never a shrink)

- Author the **narrow (≈375px) layout first**, then enhance at `md` (768px) and `lg` (1024px) —
  mobile-first (`responsive-layout.md`).
- Choose the mobile *pattern*, don't scale the desktop one down. Apply the responsive-transform
  rules in §3 (table → stacked cards; sidebar → modal nav drawer; toolbar filters → filter `sheet`;
  multi-column → single column, most-important first; hover affordances → always-visible;
  `search-field` → `search-bar`).
- Constrain reading width at the **page** level (full-bleed shell / 1200 / 800 / 680px), never
  inside a component. Grids use `auto-fill, minmax()` so columns reflow without breakpoints.
- Touch targets ≥ 44px; mobile primary action uses `btn-lg`.

### Step 6 — States, accessibility, motion

- Design the **whole lifecycle** up front, not the happy path: `first render → LOADING → POPULATED |
  EMPTY | ERROR`; on action → `SUCCESS | ERROR`. Map every edge to a component using §4 and
  `feedback-and-states.md`. Cover **empty (first-use / no-results / error-empty), loading, error,
  success, disabled, permission/no-access, and the realistic edge cases** (long text, huge numbers,
  1 item, 10 000 items, offline, slow network, RTL/long-i18n if relevant).
- Accessibility: visible focus ring, logical tab order, `aria-label` on icon-only controls,
  `role="search"` on search, `aria-live` on result counts, real table semantics, status never
  color-only. (`accessibility.md`, each rule's `accessibility`/`keyboard`.)
- Motion comes from each component's `motion:` block + `guidelines/motion.md` tokens — never
  invented. Respect `prefers-reduced-motion`. (`SKILL.md` §7.)

### Step 7 — Embassy visual implementation

- Now build, following `AI-USAGE-GUIDE.md` §1(d–h): tokens only, exact classes from each `Uso:`
  block, one theme at a time, dark mode automatic. Run the §9 "done" gate.

### Screen blocking gate

Before markup, write these lines. Missing any → return to that step.

```
GOAL       user: <verb + object>              business: <what this makes more likely>
OBJECT     primary: <one entity>              tiers: <must-see → supporting → on-demand>
ACTIONS    primary: <one btn-primary>         secondary: <list + where>
PATTERN    archetype: <id from §2>            key components: <ids + chosen variant>
RESPONSIVE desktop: <structure>               mobile: <the transform, not a shrink>
STATES     empty/loading/error/success/disabled/permission + edge cases: <component each>
```

---

## 2. Screen archetype catalog

Pick the archetype from the user goal (step 1). Each block is a structured recipe; the `guides:` line
is authoritative — read it. Keys are stable so they can be parsed: `intent`, `use_when`,
`primary_object`, `ia_skeleton`, `primary_action`, `secondary_actions`, `components`, `states`,
`desktop`, `mobile`, `motion`, `anti_patterns`, `guides`.

Quick router:

| The user wants to… | Archetype |
|---|---|
| Scan/compare/act on many records | `list-collection` |
| Understand status at a glance, then drill in | `dashboard-overview` |
| See/act on one record in depth | `entity-detail` |
| Create or edit one record | `create-edit-form` |
| Complete a long, phased task | `multi-step-wizard` |
| Change configuration/preferences | `settings-preferences` |
| Move items through stages | `pipeline-board` |
| Find a known item by typing | `search-results` |
| Sign in / sign up / recover access | `auth-entry` |
| Catch up on recent events | `feed-activity` |
| Start from nothing (first run) | `onboarding-first-run` |
| Confirm a consequential/irreversible action | `confirmation-destructive` |

---

### `list-collection` — table / list / card grid of records

- **intent:** scan, filter, compare, and act on many records of one type.
- **use_when:** the screen is a set of same-shaped entities (candidatos, vacantes, facturas).
- **primary_object:** the record type.
- **ia_skeleton:** page-header (title + one primary action) → optional `stat-card` KPI row →
  `toolbar` (search + filters + result-count) → `table`/`list`/card-grid → `pagination`.
- **primary_action:** create the record ("Nueva vacante", `btn-primary` in page-header).
- **secondary_actions:** filters (`chip`/`select`), sort, export, bulk actions (`toolbar-selection`
  when ≥1 selected), row-level menu (`dropdown-menu`).
- **components:** `page-header`, `stat-card`, `toolbar` (+`search-field`, `toolbar-btn`,
  `result-count`, `toolbar-filters`), `table`/`data-table` or `list` or card grid, `badge` (status),
  `checkbox` (select-all + row), `pagination`, `empty-state`, `skeleton`, `alert`.
- **container choice:** compare values → `table`; read items → `list`; recognize entities → card grid.
- **states:** loading = `skeleton` rows in the table's shape; first-use empty = `empty-state` + create
  CTA; no-results = `empty-state` + "Limpiar filtros" (no create CTA); error = inline `alert` +
  retry; success (bulk/row action) = `toast`; disabled = guarded submit; permission = `empty-state`
  error-empty variant stating lack of access + request path. Edges: 1 row, 10 000 rows (paginate /
  server-filter), very long names (truncate + tooltip).
- **desktop:** KPIs in an `auto-fill minmax(200px,1fr)` grid; single-row toolbar; full table; sticky
  header on long tables; right-aligned numeric columns (`tabular-nums`).
- **mobile:** table → stacked `card`/`person-card` rows (label:value) OR horizontal scroll inside its
  `table-scroll` wrapper; toolbar filters → "Filtros" button opening a bottom `sheet`; `search-field`
  → `search-bar`; sidebar → modal nav drawer.
- **motion:** row hover tint (`--duration-fast`); `toolbar-selection` enters on `--duration-normal`;
  skeleton shimmer is a continuous linear loop.
- **anti_patterns:** silent long list (no search/filter/empty/loading); zebra stripes + heavy borders;
  status as colored text; >~7 columns (move detail to `entity-detail`); infinite scroll where users
  return to a specific row; generic `<input placeholder="Buscar">` instead of search.
- **guides:** `tables-and-data.md`, `information-architecture.md`; rules: `table`, `toolbar`, `search`,
  `badge`, `chip`, `pagination`, `empty-state`, `skeleton`, `stat-card`.

### `dashboard-overview` — summary-before-detail

- **intent:** answer "how are things?" in seconds, then drill into detail.
- **use_when:** the screen aggregates status across many records; the user monitors, doesn't edit here.
- **primary_object:** a domain area (hiring, sales), not a single record.
- **ia_skeleton:** page-header → optional `toolbar-filters` (period/scope) → `stat-card` KPI row
  (3–5, most-important top-left, F-pattern) → grouped widgets (`chart` + `card`, mini-`table`) →
  drill-down into `dialog`/`sheet`/detail page.
- **primary_action:** usually a low-count action ("Sincronizar", "Exportar") — Filled only if it's the
  page's main action, else `btn-secondary`; often the dashboard has *no* primary and that's fine.
- **secondary_actions:** period/scope filters (`toolbar-filters`), per-widget "ver todo" links.
- **components:** `stat-card`, `chart`, `card`, `table` (compact), `toolbar-filters`, `skeleton`,
  `empty-state`, `badge`.
- **states:** every widget has its own `skeleton` (matching shape) and `empty-state`; refresh sets
  `aria-busy`; chart with no series → empty, not a blank box. Permission-limited widgets → hide or
  show an access note, never a broken chart.
- **desktop:** KPI row across the top; widget grid `auto-fill minmax(280px,1fr)`, `--space-6` gaps.
- **mobile:** KPIs stack 1–2 wide; widgets become one column, most-consulted first; charts keep a
  min height and scroll horizontally if dense; defer secondary widgets below the fold.
- **motion:** panel updates on `--duration-normal`/`--ease-default`; no decorative chart animation.
- **anti_patterns:** everything equal weight; `--color-primary` for a chart series (white in dark);
  raw color for trend (use `stat-card` `trend`); dumping record-level detail inline; crowding out
  whitespace to fit more widgets.
- **guides:** `dashboards.md`, `visual-hierarchy.md`; rules: `stat-card`, `chart`, `card`, `toolbar`,
  `skeleton`, `empty-state`.

### `entity-detail` — one record in depth

- **intent:** see everything about one record and act on it.
- **use_when:** the user drilled in from a list/dashboard to a single vacancy/candidate/order.
- **primary_object:** the one record.
- **ia_skeleton:** `breadcrumb`/`back-link` → page-header (record identity + status `badge` + one
  primary action) → `tabs` for facets (Detalle · Candidatos · Actividad) → facet content → detail in
  `sheet`/`popover` for sub-records.
- **primary_action:** the main thing to do to this record ("Publicar", "Contratar"); state
  transitions.
- **secondary_actions:** edit (`sheet`/`dialog`), status change (`select`/`dropdown-menu`), destructive
  (behind `alert-dialog`), share.
- **components:** `breadcrumb`/`back-link`, `page-header`, `badge`, `tabs`, `card`, `description`,
  `list`, `person-card`/`vacancy-card`, `sheet`, `dialog`, `alert-dialog`, `toast`.
- **states:** loading = `skeleton` of the header + first tab; not-found/deleted = `empty-state`
  error-empty + back path; permission = access note; save = `toast`; destructive = `alert-dialog` +
  optional `toast` undo. Edge: record with empty facets → per-tab empty-states.
- **desktop:** two-column is acceptable (main + aside summary); tabs across; primary action in header.
- **mobile:** single column; tabs stay (scroll horizontally if many); aside content moves below or
  into a `collapsible`; edit opens a full-height `sheet`.
- **motion:** tab indicator slide; `sheet` edge-slide on `--duration-sheet`; `dialog` scrim+zoom.
- **anti_patterns:** nested dialogs (branch with a `sheet`); tab soup (>~6, or tabs used to navigate to
  a *different* object); status as colored text; full-width action buttons.
- **guides:** `information-architecture.md`, `navigation.md`; rules: `tabs`, `badge`, `sheet`, `dialog`,
  `alert-dialog`, `breadcrumb`, `card`.

### `create-edit-form` — focused data entry

- **intent:** create or edit one record with as few errors as possible.
- **use_when:** the user hands structured data to the product.
- **primary_object:** the record being created/edited.
- **ia_skeleton (page form):** `create-header` (title) → single-column fields grouped under section
  headings (identity → details → optional) → sticky `create-footer` (Cancelar left `tertiary`,
  primary right). **Short form → `dialog`** instead of a page.
- **primary_action:** one `btn-primary` commit ("Crear vacante", "Guardar cambios").
- **secondary_actions:** Cancelar (`tertiary`/`text`), destructive Eliminar (`btn-danger` via
  `alert-dialog`).
- **components:** native `input`/`select`/`textarea` (with `field-hint`/`field-error-msg`/`is-error`),
  `checkbox`/`radio-group`/`switch`, `label`, `date-picker`, `button`, `alert` (error summary),
  `toast` (success), `dialog`/`alert-dialog`, `create-form`.
- **field selection:** free text→`input`; long→`textarea`; closed set→`select`; 2–5 visible→`radio`;
  independent flags→`checkbox`; immediate on/off→`switch`; dates→`date-picker`; search→never `input`.
- **states:** validate on blur (re-validate on change once errored); inline field errors via the error
  pattern (red border + `aria-invalid` + `aria-describedby`); failed submit = form-level `alert`
  summary + focus first error + **preserve all input**; in-flight submit = disabled + `aria-busy`;
  success = `toast`; destructive = `alert-dialog`. Edge: server 500 → `alert` + retry, keep values.
- **desktop:** one column, ~800px page width; uniform `--space-5` field rhythm.
- **mobile:** same one column full-width; footer actions **stack full-width** (the sanctioned narrow-
  panel exception); `btn-lg` primary; native input types for the right keyboard.
- **motion:** field focus ring; error swap is instant (no bounce); footer stays sticky.
- **anti_patterns:** placeholder-as-label; two-column fields; clearing input on error; permanently
  disabled submit as validation feedback; full-width *left-aligned* button in a *wide* footer; more
  than one primary; erroring on first keystroke.
- **guides:** `forms.md`; rules: `input`, `select`, `textarea`, `checkbox`, `radio-group`, `switch`,
  `label`, `button`, `alert`, `toast`, `dialog`, `alert-dialog`, `create-form`, `date-picker`.

### `multi-step-wizard` — long, phased task

- **intent:** complete a genuinely long flow (datos → requisitos → publicación) without overwhelm.
- **use_when:** the task has natural phases and doesn't fit one screen; otherwise keep it one form.
- **ia_skeleton:** step indicator (`progress` or stepped `tabs`/`segmented-button` header, goal
  gradient) → current step's single-column fields → footer (Atrás `tertiary` + Siguiente/Finalizar
  primary).
- **primary_action:** advance / finish (one primary per step).
- **states:** validate per step on blur; summarize at final submit in an `alert` and jump to the
  offending step; never lose typed work across steps; autosave + `toast` where warranted; confirm
  discard via `alert-dialog`.
- **desktop/mobile:** single column both; on mobile the step header may collapse to "Paso 2 de 4".
- **anti_patterns:** splitting a form that fits one screen; losing data on Back; no progress cue.
- **guides:** `forms.md` (multi-step), `ux-laws-and-heuristics.md` (goal gradient); rules: `progress`,
  `tabs`, `segmented-button`, plus all form rules.

### `settings-preferences` — configuration

- **intent:** change configuration that persists.
- **ia_skeleton:** section nav (`tabs` or a settings sidebar/`list`) → grouped settings in `card`s →
  each setting a labeled row with its control.
- **primary_action:** usually **none global** — either instant-apply (`switch`) or a per-section
  "Guardar". If save is deferred, one `btn-primary` per section.
- **controls:** immediate on/off → `switch`; deferred boolean → `checkbox`; one-of-few → `radio-group`;
  one-of-many → `select`; destructive account actions → `btn-danger` + `alert-dialog`.
- **states:** instant toggles confirm with a `toast`; deferred sections show dirty state + save;
  permission-gated settings are visible-but-disabled with an explanation, not hidden silently.
- **mobile:** section nav becomes a top `tabs` row or a drill-in list; rows stay full-width.
- **anti_patterns:** a `switch` for a change that only applies on save (that's a `checkbox`); giant
  ungrouped list of toggles; no confirmation on destructive account actions.
- **guides:** `forms.md`, `information-architecture.md`; rules: `switch`, `checkbox`, `radio-group`,
  `select`, `tabs`, `card`, `alert-dialog`.

### `pipeline-board` — kanban / stages

- **intent:** move items through named stages and see distribution.
- **ia_skeleton:** page-header + one primary → `toolbar` (search/filter/`segmented-button` to switch
  Lista/Tablero) → `kanban` columns (named stages, Miller-chunked) → `kanban-card` items → detail in
  `sheet`.
- **primary_action:** add an item ("Nueva postulación").
- **states:** empty board / empty column = per-column `empty-state`; loading = `skeleton` cards;
  moving a card = optimistic + `toast` on failure.
- **desktop:** horizontal columns, `auto-fill` widths, board scrolls horizontally inside its box.
- **mobile:** one column visible at a time with a `segmented-button`/swipe to switch stages, OR
  collapse to a grouped `list` by stage — **do not** shrink 5 columns onto 375px.
- **anti_patterns:** stage numbers instead of real names ("Stage 3" → "En entrevista"); one giant
  unstaged list; no way to switch to a list view for scanning.
- **guides:** `information-architecture.md`, `tables-and-data.md`; rules: `kanban`, `segmented-button`,
  `sheet`, `empty-state`, `skeleton`, `toast`.

### `search-results` — find a known item

- **intent:** the user knows roughly what they want and types to find it.
- **ia_skeleton:** prominent `search-bar` (hero/mobile) or `search-field` (in-toolbar) → filter `chip`s
  below (≤~5, overflow to `select`/`dropdown-menu`) → `result-count` (`aria-live`) → results `list`/
  grid → `pagination`.
- **primary_action:** implicit (run the search); refine via chips.
- **states:** idle/pre-query = suggestions or recent; loading = `skeleton`; no-results = `empty-state`
  stating the query + "Limpiar filtros"; error = `alert` + retry. Edge: single result, thousands.
- **mobile:** `search-bar` can expand to a full `search-view`; filters into a `sheet`.
- **anti_patterns:** generic `input` instead of search; no zero-results state; unbounded filter row.
- **guides:** `information-architecture.md` (findability); rules: `search`, `chip`, `toolbar`,
  `empty-state`, `pagination`, `list`.

### `auth-entry` — sign in / sign up / recover

- **intent:** authenticate or register.
- **ia_skeleton:** centered narrow card (≤~440px) on a `--primary-900` band or plain surface → logo →
  title → single-column fields → one `btn-primary` (full-width is acceptable here — a narrow, single-
  action panel) → secondary link (`btn-link`) for the alternate path.
- **primary_action:** "Ingresar" / "Crear cuenta".
- **states:** invalid credentials = form-level `alert` (never reveal which field for login); loading =
  disabled + `aria-busy`; success = navigate; rate-limited/locked = `alert` with next step.
- **⚠ safety:** the skill designs the UI only — never auto-fill, submit, or handle real credentials
  (see the credential rules in the harness). Do not create accounts on the user's behalf.
- **mobile:** identical single column, `btn-lg`, native input types (`type="email"`).
- **anti_patterns:** multi-column auth form; placeholder-only labels; ambiguous errors ("Error").
- **guides:** `forms.md`, `visual-hierarchy.md`; rules: `input`, `button`, `alert`, `card`, `label`.

### `feed-activity` — recent events

- **intent:** catch up on what changed, newest first.
- **ia_skeleton:** optional filter `toolbar` → `list` of events (icon/`avatar` + text + timestamp) →
  load-more/`pagination` or justified infinite scroll.
- **states:** first-use empty = `empty-state` ("Todavía no hay actividad"); loading = `skeleton` rows;
  error = inline `alert`.
- **mobile:** same single stream, denser spacing.
- **anti_patterns:** a `table` for non-comparable items (use `list`); infinite scroll hiding a footer.
- **guides:** `tables-and-data.md` (list vs table); rules: `list`, `avatar`, `empty-state`, `skeleton`.

### `onboarding-first-run` — start from nothing

- **intent:** the user has no data yet; teach the first step.
- **ia_skeleton:** the screen IS an `empty-state` (first-use variant): icon + title + description +
  one `btn-primary` to create the first item. May precede a short `multi-step-wizard`.
- **states:** this *is* the empty state; after the first item is created, the screen becomes its normal
  archetype (usually `list-collection`).
- **anti_patterns:** showing a blank table/dashboard chrome with no data and no guidance; a no-results
  message where a first-use message belongs (they are different — `feedback-and-states.md`).
- **guides:** `feedback-and-states.md`, `ux-laws-and-heuristics.md` (peak-end, goal gradient); rules:
  `empty-state`, `button`.

### `confirmation-destructive` — consequential decision (overlay, not a full screen)

- **intent:** confirm an irreversible/high-stakes action.
- **ia_skeleton:** `alert-dialog` (`modal[data-alert]`, `role="alertdialog"`): title = the decision,
  description = the consequence, footer = destructive confirm (`btn-primary btn-danger`) + Cancel
  (`btn-secondary`, **safe default focus**), no X, **not** dismissible by Escape/outside-click.
- **states:** in-flight confirm = disabled + `aria-busy`; failure = `alert` inside/after; reversible
  actions prefer a `toast` with **undo** over a blocking dialog.
- **anti_patterns:** using a plain `dialog` (dismissible) for a destructive confirm; a bare `onClick`
  delete with no confirmation; making Cancel the loud button.
- **guides:** `feedback-and-states.md`, `forms.md`; rules: `dialog` (alert variant), `button`, `toast`.

---

## 3. Responsive transform rules (the correct pattern per viewport — never a shrink)

Mobile is not "the desktop layout, smaller." Each desktop pattern has a *different* mobile pattern.
Author narrow-first, enhance at `md` (768) / `lg` (1024). Media queries use literal 768/1024 — they
can't read `var()`.

| Desktop pattern | Mobile pattern (the transform) | Mechanism |
|---|---|---|
| Persistent sidebar (240px) | Modal **navigation drawer** (off-canvas + scrim, hamburger) | `layout.css` `.app.nav-open` — canonical, don't reinvent |
| Multi-column region | Single column, **most-important column first in source order** | `grid-cols` collapses to 1; source order = stack order |
| Card / KPI / widget grid | Fewer columns, reflow automatically | `grid-template-columns: repeat(auto-fill, minmax(X, 1fr))` — no per-breakpoint juggling |
| Wide `table` | Stacked `card`/`person-card` rows (label:value) **or** horizontal scroll | card fallback for a primary mobile surface; `table-scroll` wrapper otherwise; keep identity column |
| `toolbar` with inline filters | "Filtros" button → bottom `sheet` with the same controls | `sheet` side="bottom"; keep `result-count` visible |
| `search-field` (compact, in toolbar) | `search-bar` (56px pill), expandable to `search-view` | responsive pair, same state tokens |
| Hover-revealed affordances (row actions, tooltips) | Always-visible or behind an explicit tap (`dropdown-menu`) | no hover on touch — never hide an action behind hover only |
| `kanban` columns side by side | One stage at a time (`segmented-button`/swipe) or grouped `list` | don't compress N columns onto 375px |
| Secondary/advanced content | Deferred behind `accordion`/`collapsible`/`sheet` | progressive disclosure; primary task stays visible |
| Default 36px controls | `btn-lg` (44px) for the primary; ≥44px touch targets everywhere | Fitts / WCAG 2.5.5 |

Page reading width is constrained at the **page** container (full-bleed / 1200 / 800 / 680px), never
inside a component. Density steps *down* on mobile (`--space-6` → `--space-4` card padding) by
choosing a smaller token, never by leaving the grid.

---

## 4. State coverage matrix (which states each archetype must ship)

`●` required · `○` if applicable. All via the dedicated components (`feedback-and-states.md`), never a
blank region or a lone spinner.

| Archetype | empty (first-use) | empty (no-results) | loading | error | success | disabled | permission |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| list-collection | ● | ● | ● skeleton | ● alert | ● toast | ○ | ○ |
| dashboard-overview | ● per widget | ○ | ● skeleton | ● per widget | ○ | ○ | ○ hide/note |
| entity-detail | ○ per tab | — | ● skeleton | ● not-found/alert | ● toast | ○ | ● access note |
| create-edit-form | — | — | ● submit busy | ● field + summary | ● toast | ● submit | ○ |
| multi-step-wizard | — | — | ● per step | ● per step + summary | ● toast | ● advance | ○ |
| settings-preferences | ○ | — | ○ | ● per section | ● toast | ● gated rows | ● gated rows |
| pipeline-board | ● board | ● column | ● skeleton | ● toast | ● toast | ○ | ○ |
| search-results | ○ idle | ● | ● skeleton | ● alert | — | — | ○ |
| auth-entry | — | — | ● submit busy | ● alert | ● navigate | ● submit | ○ locked |
| feed-activity | ● | ○ | ● skeleton | ● alert | — | — | ○ |
| onboarding-first-run | ● (is the screen) | — | ○ | ○ | ● first item | ○ | ○ |
| confirmation-destructive | — | — | ● confirm busy | ● inline | ● toast/undo | ● confirm | — |

Permission/no-access is **not** a first-class Embassy state — compose it from `empty-state`
(error-empty variant: state the lack of access + how to request it) or a persistent `alert`. Flag it
as a DS gap if a product needs a dedicated permission surface; don't invent one.

---

## 5. Audit & redesign playbook (reorganize; never preserve a weak layout)

When improving an existing Embassy screen or migrating a legacy one, the skill's job is **UX
architecture, not just re-skinning**. A screen that is already "styled" can still be reorganized. The
governing rule (CLAUDE.md migration rules, `MIGRATION.md`): **DS + UX rules win over fidelity to the
existing layout.** Do not keep a bad structure just because it's there — but **report every
divergence** so the human can validate the trade-off.

### (a) Diagnose — run the screen through steps 1–3, then name the symptoms

Read the existing screen against the 7-step framework and flag each violation with the law it breaks:

| Symptom | Violates | Fix (see moves below) |
|---|---|---|
| Two+ equal-weight filled buttons | Von Restorff / one-primary rule | INTRODUCE HIERARCHY |
| No clear "what do I do here" | visual hierarchy / goals | RE-SEQUENCE + INTRODUCE HIERARCHY |
| Everything-page (two primary objects, 10 actions) | IA (one primary object) | SPLIT / MOVE / DISCLOSE |
| Generic `<input>` doing search / a fake dropdown | component selection (Nielsen 4) | REPLACE |
| Status as colored text | accessibility / consistency | REPLACE with `badge` |
| Filters as a mismatched control row | consistency (Hick's) | MERGE into `toolbar-filters` |
| Blank while loading / empty void / silent errors | feedback-and-states | ADD-STATE |
| Full-width left-aligned button | reads as a form field | REPLACE with intrinsic-width button |
| 12-column table crammed on the page | Miller / tables | SPLIT (move detail to `entity-detail`) |
| Deep flyout menus / 4-click depth | IA depth | RE-SEQUENCE (flatten to sidebar + tabs) |
| Desktop layout merely shrunk on mobile | responsive-by-pattern | apply §3 transforms |
| Advanced options dumped inline | progressive disclosure | DISCLOSE (`accordion`/`sheet`) |
| Centered `.search-bar` / arbitrary-width search over an on-screen list | wrong variant + broken grid | REPLACE with `.search-field` in the `.toolbar`; ALIGN to the content grid |
| Two systems for the same taxonomy (filter chips **and** a "folders" band of the same set) | one-organizing-system-per-axis / redundancy | REMOVE the duplicate (or MERGE); keep the one that serves the task |
| Tonal `.btn-secondary` sitting beside the filled primary | action adjacency (competing emphasis) | INTRODUCE HIERARCHY (demote secondary nav to `.btn-tertiary` outline) |
| Regions centered / sized independently (title, toolbar, results not edge-aligned) | one-content-grid | ALIGN every region to one content column |
| Filters / search floating between unrelated bands, out of order | canonical page sequence | RE-SEQUENCE to title+action → toolbar → optional nav → results → count |
| "Suggested/pinned" band that just repeats the filter values | redundancy / IA | REMOVE unless it is a genuinely distinct concept (recency, pins, cross-cut) |

### (b) Decide the moves — the legal reorganization verbs

You may do any of these; a redesign is a *list* of them, each with a reason:

- **RE-SEQUENCE** — reorder content into must-see → supporting → on-demand; put the primary action
  where the eye lands (F/Z pattern).
- **INTRODUCE HIERARCHY** — demote all-but-one action down the button ladder; size KPIs; use weight.
- **GROUP / CHUNK** — cluster related content into `card`/section with `--space-*`; chunk within 7±2.
- **MERGE** — unify duplicate/adjacent controls (mismatched filters → `toolbar-filters`; two panels
  saying the same thing → one).
- **SPLIT** — separate a screen that serves two primary objects into two screens/tabs; move
  record-level detail out of a list into `entity-detail`.
- **MOVE** — relocate an element to where its job belongs (global action → top bar; row action → row
  `dropdown-menu`; secondary content → `sheet`/`accordion`).
- **REPLACE** — swap an ad-hoc/wrong element for the correct DS component (fake dropdown → `select`;
  colored text → `badge`; stretched button → intrinsic button; custom card → `stat-card`).
- **REMOVE** — delete redundant chrome, decorative dividers, duplicated metrics, dead controls, and **duplicate organizing systems** (a second control that filters/navigates the same taxonomy).
- **ALIGN** — pull every region (title, actions, toolbar/search, filters, folders, results, count) onto **one content grid**; remove independent centering or arbitrary per-region widths so all left/right edges match.
- **DISCLOSE** — defer advanced/secondary complexity behind `accordion`/`collapsible`/`sheet`/`popover`
  or a multi-step flow.
- **ADD-STATE** — supply the missing empty/loading/error/success/disabled/permission states.

### (c) Produce the change list (the deliverable of a redesign)

Report the redesign as an explicit before → after list, e.g.:

```
MOVE     "Exportar/Imprimir/Compartir" (3 filled buttons, top) → row dropdown-menu; keep one btn-primary "Nueva vacante"   — one-primary rule
REPLACE  colored-text status → badge (open/closed/draft)                                                                    — accessibility + consistency
MERGE    3 mismatched filter controls → one toolbar-filters row                                                             — Hick's + consistency
REPLACE  <input placeholder="Buscar"> → search-field + role="search"                                                        — component selection
SPLIT    candidate detail cards inlined in the list → moved to entity-detail on row click                                   — IA / Miller
ADD      loading skeleton, no-results empty-state, error alert                                                              — feedback-and-states
RESEQ    KPI numbers were mid-page → moved to a stat-card row at the top (F-pattern)                                        — visual hierarchy
```

Each line is a UX-architecture change, not a color change — that is the proof the skill improves the
*structure*, not only the skin.

This change list is **part (2)** of the mandatory **screen report** the skill emits for every screen it
designs, redesigns, or migrates (`SKILL.md` §1). The full report has five parts and is not optional —
a redesign is not done until it is written:

1. **UX problems detected** (or, for a new screen, the goal/hierarchy decisions taken).
2. **Elements moved / merged / replaced / removed** — the before → after change list above, each with a reason.
3. **Components & variants selected** — the Embassy component + variant per region, and why that one.
4. **Desktop vs mobile** — the §3 transform applied (not a resize).
5. **DS rules used** — the rule / law / archetype that justifies each major decision.

---

## 6. Worked validation traces

Two end-to-end traces showing the framework producing a screen. They demonstrate the skill deciding
UX architecture *and* visual UI. (Rendered proofs are built and verified separately when validating.)

### Case A — new screen from scratch: **Candidatos** (no mockup, just the goal)

Goal given: "A screen for recruiters to manage the candidates of a vacancy."

```
STEP 1 GOAL       user: find & advance the right candidato for a vacancy
                  business: shorten time-to-hire → surface who's waiting on the recruiter
STEP 2 OBJECT     primary: candidato (subordinate: the vacancy context)
                  tiers: must-see = pipeline health + the list; supporting = filters; on-demand = per-candidate detail
STEP 3 ACTIONS    primary: "Nueva postulación" (btn-primary, page-header)
                  secondary: filter chips (estado, seniority), sort, bulk "cambiar etapa" (toolbar-selection), row menu
STEP 4 PATTERN    archetype: list-collection (compare candidates across columns → table)
                  components: page-header, stat-card ×3, toolbar(search-field + toolbar-filters + result-count),
                             table + badge(estado) + checkbox(select), pagination, empty-state, skeleton, alert
                  why table (not cards): recruiters compare puntaje/estado/fecha down columns
STEP 5 RESPONSIVE desktop: KPI row → single-line toolbar → full table (sticky header), numeric cols right-aligned
                  mobile (transform, not shrink): table → stacked person-card rows; filters → bottom sheet;
                             search-field → search-bar; sidebar → nav drawer; primary → btn-lg
STEP 6 STATES     loading = skeleton rows; first-use empty = empty-state + "Publicar vacante";
                  no-results = empty-state + "Limpiar filtros" (no create CTA); error = alert + retry;
                  bulk success = toast; permission = empty-state access note
                  a11y: role="search", aria-live result-count, real <table>, badge (not colored text), focus rings
                  motion: row hover tint (fast), toolbar-selection enter (normal), skeleton shimmer (linear)
STEP 7 BUILD      tokens only; badge/toolbar/table classes from each Uso: block; dark mode automatic; run §9 gate
```

Result: a KPI-topped, searchable, filterable candidates table with all lifecycle states and a real
mobile pattern — decided from goals, not copied from a reference.

### Case B — redesign a poorly-structured screen: legacy "Vacancy Manager"

Given "before": a page titled "Vacancy Manager" with — a left-aligned full-width **"Buscar"**
`<input>`; **five** equal blue buttons in a row (Nuevo, Editar, Exportar, Imprimir, Configuración);
job status shown as green/red **colored text**; three raw filter controls that don't line up; the
vacancy *and* its candidates both listed as co-equal tables on one page; no loading/empty/error
anywhere; and on mobile it's the desktop layout zoomed out.

Diagnosis + change list (the redesign IS this list):

```
DIAGNOSE  no primary action (5 equal buttons) · everything-page (2 primary objects) · wrong components
          (input-as-search, colored-text status, mismatched filters) · no states · shrink-not-transform mobile

REPLACE   full-width left-aligned <input> "Buscar" → search-field + role="search"           — component selection / not-a-field
INTRODUCE 5 equal buttons → ONE btn-primary "Nueva vacante"; Editar→row menu;               — Von Restorff / one-primary
HIERARCHY Exportar+Imprimir→toolbar-overflow-btn dropdown; Configuración→top bar
REPLACE   green/red status text → badge (badge-open / badge-closed / badge-draft)            — accessibility + consistency
MERGE     3 mismatched filter controls → one toolbar-filters row                             — Hick's + consistency
SPLIT     candidates table removed from this page → drilled into via entity-detail (row →    — IA (one primary object) / Miller
          vacancy detail, "Candidatos" tab); this screen is now vacancies only
RESEQ     added a stat-card KPI row (abiertas / en proceso / tiempo medio) at the top         — summary-before-detail / F-pattern
ADD-STATE skeleton rows (loading), empty-state first-use + no-results, alert (fetch error)   — feedback-and-states
MOBILE    stopped shrinking: table → person-/vacancy-card rows; filters → bottom sheet;      — responsive-by-pattern (§3)
          sidebar → nav drawer; primary → btn-lg
BUILD     token-pure, one theme at a time, dark automatic; §9 gate clean
```

The "after" is the `list-collection` archetype done correctly — and crucially, elements were **moved,
merged, split out, replaced, and removed**, not merely recolored. That is the difference between
improving the UX architecture and applying new styling.

### Case C — redesign a *styled-but-wrong* screen: **Propuestas y presentaciones**

The trap this case guards against: a screen already rendered in Embassy tokens/components that still
carries weak UX. Styling is not the audit.

Given "before": navy top bar; H1 + **"Carpetas" (tonal `.btn-secondary`) beside "Nueva propuesta"
(filled)**; a **centered grey `.search-bar` pill** floating above the content at its own width; a row
of **client filter chips with counts** (Sin categoría · 9, 24 Hour Fitness · 2, …); a **"Carpetas
sugeridas" band** of 4 cards that are the *same clients* as the chips; then a "Recientes" list of
proposal rows. The screen is token-clean but structurally muddled.

Diagnosis + change list (the redesign IS this list):

```
DIAGNOSE  tonal competes with primary · search is a centered hero pill over an on-screen list ·
          chips AND suggested-folders are the SAME client taxonomy (duplicate organizing system) ·
          regions not on one grid · sequence has folders before the results' own filters

INTRODUCE "Carpetas" tonal .btn-secondary → .btn-tertiary (outline)                         — action adjacency (one fill per cluster)
HIERARCHY   so only "Nueva propuesta" carries fill
REPLACE   centered .search-bar pill → .search-field inside a .toolbar heading the list       — search-by-context / wrong variant
ALIGN     search + filters + results share one content column (no independent centering)     — one content grid
REMOVE    "Carpetas sugeridas" band → deleted; it duplicated the client chips               — one-organizing-system-per-axis / redundancy
          (folder navigation belongs in the "Carpetas" view, reachable from the header)
DECIDE    client taxonomy = ONE control: a filter in the toolbar. ≤~7 → chips; more → a       — Hick's / redundancy
          `select` "Carpeta". Here 13 clients ⇒ move them into a Carpeta `select` in the
          toolbar (chips row was 13-wide and wrapping — over Hick's budget)
RESEQ     canonical order: title+action → toolbar(search + Carpeta filter + sort + count) →   — canonical page sequence
          results (Recientes) → count. No band floats between unrelated sections.
INTRODUCE per-row actions: keep ONE row action ("Ver", btn-secondary sm) + "⋯" overflow      — one-primary-per-context (rows)
HIERARCHY   (Editor visual / Reconstruir / Editar / Copiar ruta) — not 5 flat buttons
REPLACE   "0 vistas" styled link → muted tabular-nums metadata (a metric, not a link)         — component purpose (not a nav target)
ADD-STATE skeleton (loading) · empty-state no-results ("Limpiar filtros") · alert (error) ·   — feedback-and-states
          toast (copy) — none existed
MOBILE    toolbar filters → "Filtros" bottom `sheet`; `search-field` → `search-bar`;          — responsive-by-pattern (§3)
          rows stay single-column, actions reflow below content; primary → btn-lg
BUILD     tokens only; one theme at a time; dark automatic; §9 gate clean
```

Why the folders band goes (Law 2): the chips and "Carpetas sugeridas" were two pickers for the **one**
client dimension — a duplicate organizing system. The audit keeps a single client control in the
toolbar and relegates true folder *navigation* to the dedicated "Carpetas" view. A "suggested" band
would only earn its place if it expressed a **different** concept (e.g. pinned, or most-viewed this
week) — recency is already the list's default sort, so it adds nothing here.

---

## Related (authoritative — read these, don't rely on this summary)

- `guidelines/`: `README.md`, `information-architecture.md`, `visual-hierarchy.md`,
  `ux-laws-and-heuristics.md`, `feedback-and-states.md`, `responsive-layout.md`, `forms.md`,
  `tables-and-data.md`, `dashboards.md`, `navigation.md`, `content-and-writing.md`, `accessibility.md`,
  `motion.md`.
- `AI-USAGE-GUIDE.md` §1 (the repo's consumption flow this procedure operationalizes), `GOVERNANCE.md`
  (§§1–6 quality contract, §14 layout/shell/grid, §20 action hierarchy), `MIGRATION.md` +
  `GAMAFORCE-MIGRATION.md` (legacy → DS transformation).
- `SKILL.md` §2 (per-component gate), §3 (component decision tables), §6 (states), §7 (motion),
  §9 (the "done" gate).
</content>
</invoke>
