# Information Architecture

> How to structure, label, and navigate content in Embassy screens so users always know where they are, what they're looking at, and where to go next.

## Why it matters

Components render pixels; information architecture (IA) decides what goes where and what it's called. A well-structured recruiting screen lets a user find a candidate, understand a vacancy's state, and move it through the pipeline without re-reading the page. Poor IA — deep menus, clever-but-vague labels, flat hierarchies — makes even perfectly-tokened components hard to use. This guide is the shared IA contract for Amalgama's recruiting/HR surfaces (vacantes, candidatos, entrevistas, kanban), for both human devs and agents.

---

## Grouping & chunking

- **Group by user task, not by data table.** A vacancy screen groups "detalle", "candidatos", and "actividad" as the recruiter thinks of them — surface each as `Tabs` or `Card` sections, not one long scroll.
- **Chunk within Miller's 7±2.** Break a long `Table` or `Create Form` into labeled sets; segment a candidate flow into named `Kanban` stages rather than one list.
- **Use the right container for the grain of the content.** `Stat Card` for one KPI; `Card`/`Vacancy Card`/`Person Card` for an entity summary; `Table` for scannable rows; `List` for simple linear items; `Kanban` for pipeline stages.
- **Space communicates grouping.** Separate section blocks with `--space-10` (40px), cards in a grid with `--space-6`, list items with `--space-4` (GOVERNANCE §14.5). Prefer whitespace over extra dividers; use a `Divider`/separator only when whitespace can't carry the split.
- **One primary object per screen.** A screen is "about" a vacancy *or* a candidate — don't split focus between two equal entities.

Container decision at a glance:

| Content shape | Container | Example |
|---|---|---|
| Single metric | `Stat Card` | "Candidatos activos: 42" |
| Entity summary | `Card` / `Vacancy Card` / `Person Card` | A vacancy tile in a grid |
| Scannable tabular rows | `Table` | Postulaciones with columns |
| Simple linear items | `List` | Recent activity |
| Pipeline with stages | `Kanban` | Candidatos por etapa |
| A focused create/edit task | `Create Form` | Nueva vacante |

## Labeling

- **Clear over clever.** Labels name the thing plainly: "Candidatos", "Publicar vacante", "En entrevista" — never a cute or ambiguous coinage. If a `Tab` or nav item needs a `Tooltip` to be understood, the label is wrong.
- **Rioplatense product voice.** Product/UI copy is Spanish (rioplatense); code, tokens, and class names stay English (GOVERNANCE §10.7). Sentence case for UI labels; title case only for page titles (§8.3).
- **Match the user's vocabulary (Nielsen 2).** Use pipeline terms the recruiter uses (vacante, postulación, entrevista, oferta), not internal model names or stage numbers.
- **Consistent verbs for consistent actions.** "Editar"/"Eliminar"/"Publicar" mean the same thing on every screen; a `Button` label and its resulting `Dialog` title agree.
- **Labels carry type.** A `Badge` label states a state ("Abierta", "Cerrada"); an icon-only `Button variant="icon"` always has an accessible name via `aria-label` + `Tooltip`.

## Hierarchy & depth

- **Shallow beats deep.** Aim for at most 2–3 levels: app section → entity → detail. If a user needs four clicks to reach a candidate, the tree is too deep — flatten it or add `Search`.
- **Express hierarchy visually with the type scale.** Page title (`--font-size-display`/`heading-xl`), section headers (`heading-md`/`sm`), body (`body-lg`/`md`), supporting text (`body-sm`/`caption`). Page text uses `--text-primary` (brand navy), never `--color-on-surface` (§8.3).
- **One primary action per level (Von Restorff).** A single `Button variant="primary"` per view or `Dialog`; peers are `secondary`/`tertiary`/`text`.
- **Don't nest modals.** A `Dialog` opening another `Dialog` is a depth smell; use a `Sheet` for a side branch, or a single stepped flow instead.
- **Avoid deep menu trees.** Prefer a flat sidebar of top-level sections plus in-page `Tabs` over multi-level flyout menus.

## Navigation model

Embassy's canonical layout is the **app shell** (GOVERNANCE §14.1): a fixed **sidebar** (top-level sections — Vacantes, Candidatos, Entrevistas, Reportes) plus a fixed **topbar** (`--topbar-height` 56px) for global search, account, and context actions. Within that shell:

- **`Breadcrumb`** for the location trail on deep pages — `Vacantes / Sr. Frontend / Candidatos`. Shows depth and gives a one-click way back up (Nielsen 3). Use when depth ≥ 2.
- **`Tabs`** for peer views *of the same object* within one page — a vacancy's "Detalle · Candidatos · Actividad". Tabs don't change the object, only the facet. Selected tab uses the Secondary family + `font-semibold` (§5.6).
- **`Segmented Button`** for switching *how the same data is shown* — lista vs. tablero (kanban) vs. calendario. It's a view/representation toggle, not navigation to new content. (Selected uses its lighter "Option B" `primary-container` treatment — §5.6.)
- **`Pagination`** for moving through long, ordered result sets (candidate lists, search results) that shouldn't all load at once.
- **Menu/nav hover is always the shared blue** (`--color-nav-hover` / `--color-nav-hover-content`), never gray — this applies to sidebar items, `Dropdown Menu`, `List` rows, and search result rows (GOVERNANCE §5.4).

**Which switcher?** `Tabs` = different facets of one entity · `Segmented Button` = different renderings of one dataset · sidebar = different top-level sections · `Breadcrumb` = where am I / go up.

A worked recruiting example:

```
Sidebar:      Vacantes · Candidatos · Entrevistas · Reportes   (top-level sections)
Topbar:       global SearchField · Avatar · account menu       (Dropdown Menu)
Breadcrumb:   Vacantes / Sr. Frontend / Candidatos             (trail, depth ≥ 2)
Tabs:         Detalle · Candidatos · Actividad                 (facets of the vacancy)
Segmented:    Lista · Tablero · Calendario                     (how "Candidatos" renders)
Toolbar:      SearchField + filter Chips + "Nueva postulación" (in-view actions)
```

Each control has exactly one job — moving one part (say, Tabs) never changes what another part means.

## Findability

- **`SearchField`** (compact, in a `Toolbar`) is the desktop/in-page search for filtering a `Table` or list of candidates/vacancies. **`SearchBar`** (56px pill) is the standalone mobile/hero search that can expand into a full `SearchView`. Same state tokens, different shape/context — pick by placement, not by feature.
- **Filter `Chip`s refine search.** Place filter `Chip`s directly below the `SearchBar` or in the `Toolbar` next to a `SearchField`; cap the visible set (~5, Hick's) and overflow into a `Dropdown Menu`/`Select`.
- **Support both browse and search.** Sidebar + `Tabs` serve browsing; `Search`/`SearchField` serves the user who already knows the name. Large lists need both.
- **Always design the zero-results and empty states.** Use `Empty State` for "no hay candidatos que coincidan" with a next step; `Skeleton` while results load. A blank result area reads as broken (Nielsen 1).

## Progressive disclosure of complexity

- **Default to the 80% case; reveal the rest on demand.** Fold advanced filters or settings into `Accordion`/`Collapsible`; open edit/detail flows in a `Sheet` or `Dialog`; put row-level actions behind a `Dropdown Menu`; show extra candidate context in a `Popover` off a `Person Card`.
- **Layer detail by depth.** `Vacancy Card` (summary) → vacancy page `Tabs` (facets) → candidate `Sheet` (detail). Each layer adds detail only when the user asks for it.
- **Multi-step over one giant form.** A long `Create Form` (nueva vacante) splits into steps with a `Progress` indicator (goal gradient) rather than 20 fields at once.
- **Never dump complexity inline** just because the component allows it — inline everything is the anti-pattern progressive disclosure exists to fix.

## IA anti-patterns to catch in review

- **The everything-page.** A screen that mixes two primary entities, ten equal-weight actions, and no hierarchy. Fix: pick one primary object, add hierarchy, disclose the rest.
- **Tab soup.** More than ~6 `Tabs`, or `Tabs` used to navigate to unrelated objects. Fix: fewer facets, move object-navigation to the sidebar/`Breadcrumb`.
- **Mystery-meat labels.** Icon-only controls or clever names with no accessible name or tooltip. Fix: plain rioplatense label + `aria-label`/`Tooltip`.
- **Full-width stretched button as a nav row.** Reads as a form field, not an action (see CLAUDE.md migration rules). Fix: intrinsic-width `Button`, or a `List` row if it's navigation.
- **Deep flyout menus.** Three-level cascading menus. Fix: flatten to sidebar + in-page `Tabs`, add `Search`.
- **Silent long lists.** A big `Table`/`Kanban` with no search, filters, empty, or loading state. Fix: add `SearchField` + `Chip`s + `Empty State` + `Skeleton`.

---

## Do / Don't

**Do**
- Keep the tree shallow (2–3 levels) and use `Breadcrumb` when depth ≥ 2.
- Label plainly in rioplatense; make a `Tab`/nav item understandable without a tooltip.
- Use `Tabs` for facets of one object, `Segmented Button` for view representation, sidebar for top-level sections.
- Bound visible filters (~5 `Chip`s) and disclose the rest via `Dropdown Menu`/`Select`.
- Provide both browse (sidebar/`Tabs`) and search (`SearchField`/`SearchBar`) for large datasets.
- Design empty and loading states (`Empty State`, `Skeleton`) for every list and search.

**Don't**
- Don't build deep multi-level flyout menus — flatten to sidebar + in-page `Tabs`.
- Don't use `Tabs` to navigate to a *different* object (that's sidebar/breadcrumb navigation).
- Don't use a `Segmented Button` where the choices are actions, not view modes (use `Button`s).
- Don't nest a `Dialog` in a `Dialog`; branch with a `Sheet` or a stepped flow.
- Don't invent clever labels or stage numbers the user doesn't use ("Stage 3" → "En entrevista").
- Don't split a screen's focus across two equal entities.

## Checklist for a new screen

- [ ] The screen is about one primary entity; secondary entities are subordinate.
- [ ] Depth is ≤ 3 levels; a `Breadcrumb` shows the trail wherever depth ≥ 2.
- [ ] Navigation uses the right control: sidebar (sections), `Tabs` (facets), `Segmented Button` (view modes), `Pagination` (long sets).
- [ ] Content is grouped by task into appropriate containers (`Card`/`Stat Card`/`Table`/`List`/`Kanban`), spaced with `--space-*` tokens.
- [ ] Labels are clear, rioplatense, sentence-case, and match the recruiter's vocabulary; icon-only controls have accessible names.
- [ ] Visual hierarchy follows the type scale; page text uses `--text-primary`, not `--color-on-surface`.
- [ ] Large datasets are findable via `SearchField`/`SearchBar` + capped filter `Chip`s, with browse still available.
- [ ] Empty, zero-result, and loading states are designed (`Empty State`, `Skeleton`).
- [ ] Complexity is disclosed progressively (`Accordion`/`Collapsible`/`Sheet`/`Popover`/multi-step `Create Form`) — nothing over-dumped inline.
- [ ] Exactly one `Button variant="primary"` per view/level; menu & nav hover is the shared blue, not gray.

## Related

- [UX Laws & Heuristics](./ux-laws-and-heuristics.md) — Hick's, Miller's, progressive disclosure, Nielsen heuristics.
- `GOVERNANCE.md` — §14 layout & app shell, §5.4/§5.6 nav hover & selected state, §8 typography, §10.7 language.
- `CLAUDE.md` — component inventory, IA placement rules, Search Bar/Field split.
- Component docs: Breadcrumb, Tabs, Segmented Button, Pagination, Search/SearchField, Toolbar, Chip, Dropdown Menu, Sheet, Dialog, Accordion, Collapsible, Popover, Card/Stat Card/Vacancy Card/Person Card/Kanban, List, Table, Empty State, Skeleton, Create Form, Progress, Avatar.
