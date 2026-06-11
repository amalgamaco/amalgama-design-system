# MIGRATION.md — Applying Embassy to an existing product

This file is the **reverse-mapping contract** for restyling or rebuilding an existing product (legacy screens, external platforms) with the Amalgama Design System. It is written for AI agents (the `/design-system` skill and the `design-system-implementer` agent) and humans doing migrations.

CLAUDE.md tells you how to *build with* the DS. This file tells you how to *transform into* the DS. Read both before touching legacy code. **DS rules win over visual fidelity to the legacy design — always.**

---

## The workflow (phases, in order)

1. **Token audit (before any component work).** Inventory the legacy CSS: every hardcoded hex, every custom property. If the product defines its own custom-property layer that overlaps DS token names or roles (**>10 diverging vars = blocker**), STOP and reconcile tokens first — never ship a parallel token layer (e.g. a mode class redefining `--bg`, `--border`, `--text-primary` to legacy values). The DS token values ARE the target; legacy values do not survive, not even "close" ones.
2. **Component inventory.** List every UI element on the screen and map each to a DS component using the table below. Elements that map to nothing get flagged (see *Gaps*), not improvised.
3. **Apply.** Load order per CLAUDE.md; markup per each component's `Uso:` block; colors per the algorithm below. Never stretch or realign a component beyond its documented anatomy.
4. **Hierarchy pass.** One `btn-primary` per context. If the legacy screen had several equal-weight actions, introduce hierarchy (primary + secondary/tertiary); don't replicate the flatness.
5. **Verify.** Run the checklist at the bottom — in light AND dark (`data-theme="dark"` on `<html>`).
6. **Report divergences.** Every place where DS rules forced a departure from the legacy design gets listed for designer validation.

---

## Color replacement algorithm (deterministic)

**Classify each legacy color by the ROLE of the element it paints, then assign that role's semantic token. Never match by nearest hex.** A legacy `#1c2438` on a heading is not "closest to neutral-700" — it is page text, so it becomes `var(--text-primary)`.

| Element role | Token | Never |
|---|---|---|
| Page headings & body text | `--text-primary` | `--color-on-surface` (reserved for component internals) |
| Secondary / supporting text | `--text-secondary` | custom grays |
| Muted / disabled text | `--text-muted` | opacity hacks |
| Text inside components (chips, buttons, cells) | `--color-on-surface` / the component's own `on-*` token | `--text-primary` |
| Page background | `--bg` | raw hex |
| Card / panel surface | `--card-bg` | raw hex |
| Container borders (cards, tables, panels) | `--border` | `--color-outline` |
| Interactive element outlines (inputs, chips) | `--color-outline` | `--border` |
| Links, nav, tabs, focus | `--interactive` / `--color-focus` | brand navy |
| Status (success/error/warning/info) | `--color-{status}` + `-container` + `on-` pairs | raw status hex |
| Shadows | `--shadow-sm/md/lg` | custom rgba shadows |

Hard rules:
- **Never redefine** a `--color-*`, `--text-*`, `--bg`, `--border`, or alias token to a legacy value. If a DS token "looks wrong," the wrong token was chosen — pick the right role, don't bend the token.
- **Never write per-theme overrides** (`@media (prefers-color-scheme)`, `.dark` classes). Semantic tokens recalibrate themselves under `data-theme="dark"`. Legacy code that hardcodes "theme-aware-looking" hex pairs gets collapsed into the single semantic token.
- Zero raw hex in output (the only hex allowed lives in `css/variables.css`).

## Typography replacement rules

- Font families only via `--font-heading` (Epilogue), `--font-body` (Inter), `--font-mono` (DM Mono). Never quoted family names in component code.
- **Every `font-size` is a `--font-size-*` token.** Headings map h1→`display`, h2→`heading-xl`, h3→`heading-lg`, h4→`heading-md`, h5→`heading-sm`, h6→`heading-xs` (bound in `base.css`). UI text: 14→`body-lg`, 13.5→`body-md`, 12.5→`body-sm`, 13→`label`, 12→`caption`/`overline`, 11.5→`badge`.
- Legacy sizes with no token equivalent: snap to the nearest **role-appropriate** token (a 20px legacy section title is an h3/`heading-lg`, not a 20px one-off). If genuinely no role fits, flag it as a DS gap.
- Page text color is brand navy (`--text-primary`), never near-black. If migrated text renders black, a token is misapplied.

---

## Legacy pattern → DS component mapping

| Legacy element | DS target | Disambiguation |
|---|---|---|
| Search input inside a toolbar/filter bar | `.search-field` (toolbar.css) | compact, in-toolbar |
| Standalone / hero search box | `.search-bar` (search.css) | 56px pill; results via `.search-view` |
| Filter toggles, tag selectors | `.chip` / `.chip-selected` | interactive → chip; read-only → badge |
| Status / category text labels | `.badge badge-*` | **any colored categorical label is a badge, never plain text + color** |
| Top navigation bar | `.topbar` (layout.css) | with `.sidebar` if app shell |
| Side navigation | `.sidebar` + `.nav-item` (layout.css) | |
| Modal / dialog / popup / lightbox | `.modal` + `.modal-overlay` | long forms → full page with `create-form` |
| Toast / snackbar / inline alert after action | `.toast toast-{success,error,info}` | needs a decision → modal instead |
| Generic panel / box | `.card` | KPIs → `stat-card`; people → `person-card`; vacantes → `vacancy-card` |
| KPI / metric widget | `.stat-card` | |
| Data table | `.data-table` | clickable rows: `tr.clickable` + `tabindex="0"` |
| Tab bar (same-page views) | `.tabs` + `.tab` | page navigation → sidebar, not tabs |
| "Action row" of equal buttons | Button group **with hierarchy** | one `btn-primary` + `btn-secondary`/`btn-tertiary`; intrinsic widths |
| Form fields (text/select/textarea/date/number) | `form.css` field anatomy | label + input + hint/error slots |
| Back / breadcrumb-lite link | `.back-link` | |
| Page title row | `.page-header` | |
| Empty list / no results | `.empty-state` | under construction → `.placeholder` |
| Loading spinner | `.skeleton` variants | |
| Pipeline / board view | `.kanban-*` | |
| User avatar | `.avatar` (layout.css) | |

No match → **flag as DS gap and stop on that element**. Do not invent a lookalike. Roadmap components (checkbox, radio, switch, menu, tooltip, slider, date picker, sheet, list, loading, carousel, divider) have no consumable code: compose from existing components or flag.

## Anti-pattern catalog (each one was a real migration failure)

1. **Stretched button.** `width:100%` / left-aligned content on `.btn-*` makes it read as a form field. Buttons keep intrinsic width and centered content. If the legacy layout demands full-width, change the layout.
2. **Plain text as status.** `<span style="color:…">Vacaciones</span>` → `<span class="badge badge-open">Vacaciones</span>`. Pick the variant by the category's *meaning*, not its legacy color.
3. **Parallel token layer.** A class that redefines DS tokens to legacy values (`html.product-mode { --bg: #fafaff; … }`). This silently defeats theming. Reconcile to DS values instead.
4. **Per-theme CSS.** Hand-written dark overrides. The semantic layer already recalibrates; component code is theme-blind.
5. **Hardcoded type.** `font: 600 20px 'Epilogue'` → heading token + `--font-heading`.
6. **Flat action rows.** Three equal buttons side by side → introduce hierarchy.
7. **Nearest-color mapping.** Mapping legacy hex to the visually closest primitive instead of classifying the element's role.

---

## Verification checklist (run before declaring done)

Machine-checkable — all must pass:

- [ ] `grep -nE '#[0-9a-fA-F]{3,8}\b' <output css/html>` → no hits outside `css/variables.css` (SVG fills in illustrations exempt).
- [ ] `grep -n 'font-size:\s*[0-9]'` → no hits (all sizes via `--font-size-*`).
- [ ] `grep -n "font-family:\s*['\"]"` → no quoted family names in component code.
- [ ] No redefinition of `--color-*`, `--text-*`, `--bg`, `--border`, `--shadow-*` outside `variables.css`.
- [ ] At most one `btn-primary` per view context; no `width: 100%` on `.btn-*`.
- [ ] Every categorical/status label is a `.badge`; every filter control is a `.chip`.
- [ ] CSS `<link>` tags carry `?v=N` and were bumped if library files changed.
- [ ] Render with `data-theme="dark"` on `<html>`: no illegible text, no per-theme overrides added to fix it.
- [ ] Page text is navy (`--text-primary`), not black, in light mode.
- [ ] Divergence report written (every DS-forced departure from legacy, for designer sign-off).

## Gaps & escalation

- **Mobile shell**: sidebar behavior under 768px is a pending design decision — do not improvise off-canvas patterns. Flag screens that need it. Breakpoint reference values: `--breakpoint-md: 768px`, `--breakpoint-lg: 1024px` (media queries can't consume `var()`; use the literal values).
- **Icons**: Lucide (CDN `unpkg.com/lucide`, `<i data-lucide="…">` + `lucide.createIcons()`), stroke inherits `currentColor`. Sizes: 18px inside chips/inputs, 20px in nav, 24px in search bars. Don't mix icon sets in one product.
- Anything else with no documented pattern: report it as a DS gap with a proposed pattern — never improvise silently.
