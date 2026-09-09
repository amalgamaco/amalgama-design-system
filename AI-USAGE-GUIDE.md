# AI-USAGE-GUIDE.md — How to consume Embassy to build & migrate screens

This is the **operating manual for agents and developers who consume the Amalgama
Design System (Embassy) to build or migrate a screen** — Claude Code, the
`/embassy:screen` skill, and any future UI-generation workflow.

It answers one question end to end: *given a screen to build, what do I read, in what
order, and what am I forbidden from doing?* It does **not** re-document components — it
routes you to the structured sources that do.

**Two rules before anything else:**

1. **Read the repo, never work from memory.** Tokens, variants, and rules drift; your
   recollection is stale by definition.
2. **Never derive a rule from rendered `index.html` HTML/copy or from `docs/*.html`.**
   `docs/*.html` are retired redirect stubs. `index.html` is human documentation, not a
   parseable contract. The machine-readable truth lives in `component-rules/`,
   `css/variables.css`, `css/components/`, `guidelines/`, and `GOVERNANCE.md`.

---

## 1. The consumption order (the decision flow)

Follow these steps **in order** for every screen. Do not skip ahead to CSS — a
token-correct screen with the wrong action hierarchy or no error state is **not done**.

### (a) Frame the screen — `guidelines/`

Start at [`guidelines/README.md`](guidelines/README.md). Before placing any component:

- Establish **information architecture** ([`information-architecture.md`](guidelines/information-architecture.md))
  and **visual hierarchy** ([`visual-hierarchy.md`](guidelines/visual-hierarchy.md)) — decide
  the **one** primary action and what steps down to secondary.
- Pick the **pattern guide** for what you're building: forms, tables, navigation,
  dashboards, feedback/states, responsive layout.
- Design the **empty / loading / error / success** states up front
  ([`feedback-and-states.md`](guidelines/feedback-and-states.md)) — not just the happy path.
- Write copy per [`content-and-writing.md`](guidelines/content-and-writing.md) (rioplatense
  Spanish for product UI).

### (b) Select each component — `component-rules/<id>.md`

For every UI element, open `component-rules/<id>.md` (or query `component-rules/manifest.json`
— see §6). Use its frontmatter to **choose the right component**:

- `when_to_use` / `when_not_to_use` — is this even the right component? `when_not_to_use`
  always names the correct alternative.
- `not_to_confuse_with` — resolves the classic mix-ups (chip vs button, badge vs chip,
  dialog vs sheet vs toast, stat-card vs card).

If migrating a legacy element, look it up in `MIGRATION.md`'s legacy→DS mapping table
**first**, then open the target's rules file.

### (c) Configure it — variants / sizes / states from the rules file

- `variants` — pick by **purpose**, not appearance (each entry states its intended job).
- `sizes` + `size_selection` — match surrounding density.
- `states` — implement only the states the component actually supports.

### (d) Style ONLY via tokens — `css/variables.css`

**Tokens are the law.** Every color → `var(--color-*)` or a semantic alias
(`--accent`, `--bg`, `--border`); every radius → `var(--radius-*)`; every shadow →
`var(--shadow-*)`; every spacing → `var(--space-*)`; every `font-size` → a
`--font-size-*` token; fonts → `var(--font-body|--font-heading|--font-mono)`. **Never a
raw hex, never a loose px, never a quoted font family.** (See §4.)

### (e) Apply the flat kebab classes — `css/components/<id>.css`

Use the exact class names and markup from the component's `Uso:` block. Flat kebab-case,
additive variants (`btn-primary btn-danger`, `chip chip-selected`). The size class
carries its own border-radius — add the size class, never an inline `border-radius`.

### (f) Honor cross-component consistency — `GOVERNANCE.md`

- **One primary action per context.** Additional actions step down to
  secondary/tertiary/text. Introduce hierarchy; never flatten to equal weight. A standalone
  **page action** (Page Header / Tool Bar / Filter Toolbar) is **Filled/Primary only when it is
  the view's main action**, else **Tonal (`secondary`)** for a supportive one (GOVERNANCE §20.5).
- Buttons have intrinsic width and centered content — **never full-width or left-aligned**
  (that reads as a form field).
- **Filter rows are a Toolbar variant, not per-page CSS.** When a screen lines up 2+ equal-hierarchy
  filter controls (Select + Segmented Button + Date Picker), use the **Toolbar** `.toolbar-filters`
  variant (`component-rules/toolbar.md`, `toolbar.css`) so they share one field treatment — never
  restyle the standalone Segmented Button / Date Picker / Select to "match", and never mix filled and
  transparent containers without a deliberate hierarchy reason. (There is **no** separate "Filter
  Toolbar" component — it was merged into Toolbar as this variant.)
- No per-theme overrides, no primitive tokens in component code, no shadow tokens.
  (`GOVERNANCE.md` §§1–6 are the quality contract; it wins over any component file.)

### (g) Validate states + a11y + responsive + light/dark

- Every interactive element: default / hover / focus-visible / active / disabled, plus
  the screen's empty / loading / error / success states.
- Accessibility per the rules file (`accessibility`, `keyboard`) and
  [`guidelines/accessibility.md`](guidelines/accessibility.md): visible focus ring, logical
  tab order, `aria-label` on icon-only controls, ≥44px touch targets on coarse pointers.
- Toggle `data-theme="dark"` on `<html>` and confirm both themes — dark mode is
  **automatic**; if you needed a per-theme override, you picked the wrong token.
- Respect `prefers-reduced-motion`.

### (h) Run the validation script — `scripts/validate-ds.mjs`

Token-lint, route/anchor check, and manifest coverage. A clean run is the gate for
"done." (See §6.)

---

## 2. Source-of-truth map

Read the authoritative file for each information type. **Never substitute rendered docs
for these structured sources.**

| Information type | Authoritative file(s) |
|---|---|
| Token values (colors, type scale, spacing, radii, shadows, breakpoints) | `css/variables.css` (optional MD3 aliases: `css/md-sys-bridge.css`) |
| **Which component to pick + how to use it** (when/when-not, variants+purpose, sizes, states, a11y, keyboard, heuristics, relationships, correct/incorrect examples) | **`component-rules/<id>.md`** — read this **first** to select & configure |
| Machine-readable registry / programmatic entry point | `component-rules/manifest.json` |
| Component code (classes, anatomy, `Uso:` snippet, exact tokens) | `css/components/<id>.css` (canonical) + optional wrapper `components/ui/<id>.tsx` |
| Screen patterns & UX (IA, hierarchy, forms, tables, dashboards, states, motion, a11y, copy) | `guidelines/*.md` (start at `guidelines/README.md`) |
| Applying the DS to an existing product (transformation rules) | `MIGRATION.md` (+ the project-specific `GAMAFORCE-MIGRATION.md`) |
| Cross-component consistency, token rules, audit checklist | `GOVERNANCE.md` |
| Load order, brand layer, consuming as artifact / React / existing project | `CLAUDE.md`, `skills/design-system/SKILL.md` |

**Do NOT** read or cite `docs/*.html` (retired redirect stubs) and **do NOT** reverse-engineer
rules from `index.html` markup. The structured sources above are the contract.

---

## 3. How to read `component-rules/<id>.md`

Each file is **YAML frontmatter (the machine contract) + a Markdown body (worked
examples)**. File id = the `c-<id>` route without the `c-` prefix (e.g. `button.md` →
route `c-button`). Full schema in `component-rules/README.md`; coverage in
`component-rules/INDEX.md` (61/61 authored).

Map each field to a build decision:

| Phase | Fields to read | What it decides |
|---|---|---|
| **Select** | `summary`, `when_to_use`, `when_not_to_use`, `use_cases`, `aliases`, `relationships.not_to_confuse_with` | Is this the right component? If not, `when_not_to_use` / `not_to_confuse_with` name the correct one. |
| **Configure** | `variants` (pick by `purpose`), `sizes` + `size_selection` | Which variant and size. |
| **Implement** | `content_rules`, `states`, `accessibility`, `keyboard`, `responsive`, `source.classes`, `source.css` | The markup, classes, states, and a11y wiring. |
| **Constrain** | `layout_constraints`, `common_mistakes`, `ux_principles`, `nielsen_heuristics` | Hard "do not" rules — treat `common_mistakes` as refusals. |

The Markdown body's **Correct / Incorrect usage** snippets are copy-adaptable references.

### Worked example — "an action that deletes a record"

1. **Select.** The element performs an action → `button.md`. Deletion is destructive and
   irreversible → `button.md` `when_to_use` points to *"Destructive confirmation
   (btn-danger inside an Alert Dialog)"*; it must be confirmed → also read `dialog.md`.
2. **Configure (button).** `variants` → `btn-danger` is a **modifier**, composed onto
   `btn-primary`. `dialog.md` `variants` → the **Alert Dialog** (`modal[data-alert]`),
   which is *not* dismissible by Escape or outside click (prevents accidental confirm).
3. **Implement.** `dialog.md` `content_rules`: title states the decision, description
   gives the consequence; footer = destructive confirm + Cancel; **Cancel is
   `btn-secondary` and the safe default focus**.
4. **Constrain.** `button.md` `common_mistakes` + `GOVERNANCE.md`: one primary per
   context, no full-width button, `aria-label` if the trigger is icon-only.

```html
<!-- trigger -->
<button class="icon-btn" aria-label="Eliminar vacante"><i data-lucide="trash-2"></i></button>

<!-- confirmation (Alert Dialog: no Escape / outside-click dismissal) -->
<div class="modal" data-alert="true" role="alertdialog" aria-modal="true"
     aria-labelledby="del-title" aria-describedby="del-desc">
  <h2 id="del-title" class="modal-title">¿Eliminar esta vacante?</h2>
  <p id="del-desc" class="modal-desc">Esta acción no se puede deshacer.</p>
  <div class="modal-footer">
    <button class="btn-secondary" autofocus>Cancelar</button>   <!-- safe default -->
    <button class="btn-primary btn-danger">Eliminar</button>
  </div>
</div>
```

---

## 4. Hard constraints — never do

These are refusals, not preferences. They come from `GOVERNANCE.md` §§1–6, `CLAUDE.md`,
and the per-component `common_mistakes`.

- **No raw hex / raw px** when a token exists. Color → `var(--color-*)`; radius →
  `var(--radius-*)`; font-size → `--font-size-*`; spacing → `var(--space-*)`. The only
  sanctioned computed values are `color-mix()` expressions built from Color Roles.
- **No second `btn-primary` in one context.** Exactly one primary; the rest step down.
- **No full-width or left-aligned buttons.** Intrinsic width, centered content. If the
  legacy layout demands full width, change the layout, not the button.
- **No chips for actions, no badges for interaction.** Chips filter/select/represent
  input; buttons act; badges are read-only status.
- **No inventing components or Tailwind utility classes.** If nothing fits, compose from
  existing components with tokens, or **stop and flag the DS gap** — don't improvise
  (e.g. never hand-roll a drag-resize engine for the dropped Resizable panels).
- **No per-theme overrides** (`@media prefers-color-scheme`, `.dark`, `[data-theme=dark]`
  blocks in a component). Dark mode is automatic via semantic tokens; needing an override
  means the wrong token was chosen.
- **No primitive tokens in component code** (`--primary-900`, `--neutral-100`) — always
  go through a Color Role (`--color-primary`).
- **Never ignore `prefers-reduced-motion`**, and never remove the focus-visible ring.

---

## 5. For artifact and deck generation specifically

These workflows generate whole artifacts/decks, usually as fresh output with no existing
token layer. Pull three layers from the repo — **never hardcode from memory**:

1. **Brand layer** (not in component code — from `skills/design-system/SKILL.md` §8):
   logo variant chosen by background (light backgrounds → navy wordmark + blue icon;
   dark/navy → mono white or mono blue; square accents → icon-only), voice/tone (direct,
   action-oriented; product UI in rioplatense Spanish, outward marketing in English), and
   theme strategy (hero/landing → dark `--primary-900/-700` band; internal tools/tables →
   light). The logo assets are transparent **SVGs**; ask the user for the file if a case
   isn't covered — never invent a filename or approximate the mark.
2. **Tokens** — copy `css/variables.css` (and `css/base.css`) values, or link them; for
   the most current tokens in a self-contained artifact, inline `css/variables.css` in a
   `<style>` block rather than relying on the CDN HEAD.
3. **Component classes** — use the flat classes from `css/components/<id>.css` `Uso:`
   blocks, selected/configured via `component-rules/<id>.md`.

**Every example must be token-driven and theme-aware** — colors via `var(--…)`, one color
mode at a time following the global theme toggle, zero raw hex, zero hardcoded font
families. Static SVG mockups may be light-mode; anything live must respond to
`data-theme`. Frame the deck/screen with `guidelines/` (hierarchy, one primary action per
slide/view) exactly as in §1.

---

## 6. Validation — the "done" gate

Before declaring a screen or artifact done, run:

```bash
node scripts/validate-ds.mjs
```

It checks:

- **Token-lint** — no raw hex / loose px / quoted font families where a token exists; no
  primitive tokens or per-theme overrides in component code.
- **Routes & anchors** — component references resolve to real `c-<id>` routes; no links to
  retired `docs/*.html` stubs.
- **Manifest coverage** — every component in `css/components/` has a
  `component-rules/<id>.md` entry and appears in `component-rules/manifest.json` (the
  programmatic registry / entry point for skills).

**A clean run means:** the screen is token-pure, every component is a real DS component
used per its rules file, and links resolve. Pair it with the manual §1(g) checks
(states, a11y, responsive, light/dark) — the script enforces token/registry correctness;
the human/agent still owns hierarchy and usability. Only then is the screen done.
