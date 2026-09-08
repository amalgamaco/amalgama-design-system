# CONTRIBUTING.md — How to add or modify Embassy components

This document is for designers and engineers who want to contribute a new component, fix an existing one, or extend the token system. Read it before opening a PR or starting CSS work.

**Read order if you are new:** README.md → CLAUDE.md → GOVERNANCE.md → this file.

---

## Before you start: use the checklist in §11 of GOVERNANCE.md

The audit checklist in GOVERNANCE.md §11 defines what "done" means for a component. Print it, work through it, and only consider your contribution complete when every item is checked. The checklist covers: CSS quality, dark mode, token hierarchy, docs structure, accessibility, React wrapper, and cross-references.

---

## 1. Is there already a component for this?

Before proposing a new component:

1. Read the full component inventory in `CLAUDE.md`
2. Check the roadmap section in `CLAUDE.md` — it may already be planned
3. Check `GOVERNANCE.md §12` Known Inconsistencies — you may be fixing something that is already documented
4. Read every existing component's `Cuándo usar / Cuándo no / Reemplaza a` block — what you need may be a variant of something that exists

If the need is genuinely new, proceed.

---

## 2. Proposal phase

Before writing any code, write a brief (in Spanish or English) that answers:

- **What is this component?** One sentence.
- **What user problem does it solve?** What existing pattern (or non-pattern) breaks without it?
- **Which existing components does it relate to?** (e.g. "it is a dismissible version of Badge")
- **What are its states?** (default, hover, focus, disabled, selected, error, loading — which apply?)
- **What is its anatomy?** Sketch the HTML structure with element names.
- **What tokens will it consume?** List the Color Roles and space tokens it needs. If it needs a new token, explain why no existing one fits.
- **What are its DO / DON'T rules?** When should it be used vs. an existing component?

Share the proposal with at least one other designer before writing CSS.

---

## 3. Design phase

1. Design the component in Figma against the existing token palette — never introduce new colors
2. Create states: default, hover, focus, pressed, disabled; selected if applicable
3. Verify contrast ratios for all text (≥ 4.5:1 for normal text, ≥ 3:1 for large text and UI components)
4. Document: all padding values, gap values, border radius, font-size, font-weight — each mapped to a token
5. If any spec value does not map to an existing token, that is a DS gap to resolve before implementation — either add the token or snap to the nearest scale value

---

## 4. Component implementation (buildless CSS)

> **Corregido 2026-09.** Esta sección describía la arquitectura Tailwind + React de `packages/ds/`,
> que fue **revertida el 17-jul-2026**. `packages/ds/` e `islands/` no existen en `main`. La
> arquitectura canónica es **buildless**: `css/components/<id>.css` con clases planas kebab-case, y
> wrappers React opcionales en `components/ui/<id>.tsx` que aplican esas mismas clases sin estilos
> propios. Ver `README.md` y `CLAUDE.md`.

### 4.1 Dónde vive cada cosa

Un componente nuevo son **dos archivos obligatorios** y uno opcional:

| Archivo | Obligatorio | Qué es |
|---|---|---|
| `css/components/<id>.css` | **sí** | La implementación canónica. Autocontenida: solo depende de la capa de tokens |
| `component-rules/<id>.md` | **sí** | La regla operativa: `when_to_use`, `when_not_to_use`, `variants` por propósito, `states`, `accessibility`, `keyboard`, `motion`, `not_to_confuse_with`, `common_mistakes`. Es lo que permite que un agente lo **elija** bien, no solo que lo pinte |
| `components/ui/<id>.tsx` | no | Wrapper React tipado (`cva` + `cn` + `forwardRef`). Aplica las clases del CSS; **cero estilos propios** |

- `<id>` en kebab-case, y es también la ruta `c-<id>` del sitio de documentación.
- Agregá el `@import` en `css/components.css` (el barrel).
- El id del archivo CSS **no tiene por qué coincidir** con el id de la regla cuando un CSS
  alimenta a más de un componente conceptual (`modal.css` → `dialog.md`, `sheet.css` →
  `sheet-side.md` + `sheet-bottom.md`). Lo que manda es el campo `source.css` de la regla.

### 4.2 Estructura obligatoria del archivo CSS

El header es el contrato del componente — lo leen las personas, las skills y el checklist de
auditoría. No empieces el CSS antes de completarlo (`GOVERNANCE.md` §18.3):

```css
/* ═══════════════════════════════════════
   Embassy DS — [Nombre del componente]
   [Una oración de descripción]

   Cuándo usar: [caso de uso]
   Cuándo no: [anti-casos, nombrando siempre la alternativa correcta]
   Reemplaza a: [qué patrón legacy reemplaza]

   Dependencia: variables.css[, base.css si hace falta]
   Requiere: [peer deps, ej. íconos Lucide]

   Uso:
   <div class="mi-componente">…</div>
═══════════════════════════════════════ */

.mi-componente {
  /* Solo roles semánticos. Nunca primitivas, nunca hex crudo. */
  background: var(--color-surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  font-size: var(--font-size-body-md);
  transition: background var(--duration-fast) var(--ease-default);
}

.mi-componente:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--color-focus-ring);
}
```

Las variantes son **aditivas** y se componen sobre la base
(`class="btn-primary btn-danger"`, `class="chip chip-selected"`). El modificador de **tamaño**
es el que lleva el `border-radius`, nunca la variante (`GOVERNANCE.md` §4.3).

### 4.3 Patrones prohibidos

Cualquiera de estos frena el PR:

- **Hex crudo o px suelto** donde existe un token. Color → `var(--color-*)`; radio →
  `var(--radius-*)`; espaciado → `var(--space-*)`; `font-size` → `var(--font-size-*)`; familia →
  `var(--font-body|--font-heading|--font-mono)`. El único cálculo permitido es `color-mix()` sobre
  roles.
- **Primitivas en código de componente** (`--primary-900`, `--neutral-100`). Siempre a través de un
  rol semántico. Las primitivas son la capa que se overridea por marca (`WHITE-LABEL.md`).
- **Overrides por tema** (`[data-theme="dark"]`, `.dark`, `@media (prefers-color-scheme)`) dentro de
  un componente. El dark mode es automático; si lo necesitaste, elegiste el token equivocado.
- **Utilidades de Tailwind u otro framework** en el CSS del componente.
- **Radio píldora** (`--radius-full`) en cualquier cosa que no sea chip, badge o avatar.
- **Easings o duraciones inventadas.** Solo `--duration-*` y `--ease-*`, y respetando la regla de
  doble easing (`GOVERNANCE.md` §13).
- **Quitar el anillo de foco** o ignorar `prefers-reduced-motion`.
- **Duplicar un componente que ya existe** con otro nombre. Antes de crear, revisá §1 y
  `component-rules/manifest.json`.

### 4.4 Antes de abrir el PR

```bash
python3 scripts/build-manifest.py   # regenera el manifest desde los frontmatter
node scripts/validate-ds.mjs        # token-lint, rutas, cobertura y metadata
```

El chequeo `[5b]` avisa si el CSS nuevo quedó sin su `component-rules/<id>.md`. Un componente sin
regla no lo puede elegir ningún agente: solo se puede copiar si alguien ya sabe que existe.

---

## 6. Documentation

Every component needs documentation in `index.html` (the root SPA) following the 5-tab structure from GOVERNANCE.md §10.1:

```
Overview  |  Specs  |  Guidelines  |  Accessibility  |  Code
```

**Overview tab:**
- Component description (what it is, what it does)
- Visual anatomy with real DS markup and pin markers
- Token table (`bt-tok-table` format: Token / Rol / Claro / Oscuro)
- State demos (`bst-strip`) for all applicable states

**Specs tab:**
- SVG measurement annotations with magenta annotation color
- Padding, height, radius, icon-size, gap for every size variant
- All values exactly matching the CSS implementation

**Guidelines tab:**
- Hierarchy table (if multiple variants)
- "Cuándo usar / No usés cuando" table
- At least one DO / DON'T pair with visual examples
- One Primary action per context rule if applicable

**Accessibility tab:**
- Required ARIA attributes and their values
- Keyboard interaction map (Tab, Enter, Space, Arrow keys, Escape)
- Screen reader behavior description
- Color contrast ratios for the component's key text/background pairs

**Code tab:**
- Copy-pasteable HTML snippet using the real DS class names
- React usage snippet if a wrapper exists
- Token reference table

> The legacy `docs/*.html` per-component pages were **retired (2026-06)** — they are now
> redirect stubs to the canonical `index.html` SPA. Do **not** create a `docs/<name>.html`
> page; the component's documentation lives only in `index.html`.

---

## 7. Modifying an existing component

### 7.1 Non-breaking changes (variants, states, sizing)

1. Read the component's current `.tsx` (`packages/ds/components/ui/<name>.tsx`) + docs before touching anything
2. Verify the change against GOVERNANCE.md — the change must comply with all rules in §§ 2–11
3. Update the component `.tsx` (and its islands showcase, then rebuild the bundle)
4. Update `index.html` documentation to reflect the change
5. If the change affects CLAUDE.md's component inventory table, update it

### 7.2 Breaking changes (markup changes, variant name changes, token changes)

Breaking changes require:
1. Approval from at least two people (one designer + one engineer)
2. A migration note in the CSS comment header
3. An entry in the changelog (when one exists)
4. A deprecation period if any product already consumes the old markup — never delete old classes immediately

### 7.3 Renaming a CSS class or token

- Old class stays for at least one release cycle with a deprecation comment
- `CLAUDE.md` and `MIGRATION.md` must be updated to reflect the new name
- The `/design-system` skill's SKILL.md may also need updating

---

## 8. Review checklist before submitting

Run through GOVERNANCE.md §11 (the full audit checklist). Additionally:

- [ ] The component has a clear proposal answering the questions in §2 above
- [ ] The design was reviewed by at least one other designer
- [ ] `packages/ds/components/ui/<name>.tsx` created, self-contained, with the header comment (incl. `Cuándo usar / Cuándo no`)
- [ ] No prohibited patterns (§4.3): no raw hex, no arbitrary sizes/radii, no custom CSS class, no `css/components/*.css` file, classes merged via `cn()`
- [ ] Dark mode tested manually: `data-theme="dark"` on `<html>`, all states readable (no `dark:` overrides)
- [ ] WCAG color contrast verified for all text/background combinations in the component
- [ ] `index.html` has the 5-tab documentation section (+ islands showcase if interactive)
- [ ] `CLAUDE.md` component inventory updated

---

## 9. What not to contribute

- Do not add components for roadmap items without going through the full proposal → design → review workflow
- Do not introduce new token names without discussing them — token proliferation is the most common source of drift
- Do not fix "visual inconsistencies" by adding inline styles or `!important` — fix the token or the component structure
- Do not contribute a component that only works in one product context — Embassy components must be product-agnostic
- Do not contribute a component without documentation — undocumented code is incomplete code
