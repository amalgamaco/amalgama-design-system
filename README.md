# Embassy — Amalgama Design System

Librería de componentes UI reutilizable, **sin build**. El código de cada componente vive en **`css/components/<nombre>.css`** — clases planas kebab-case (`btn-primary`, `chip-selected`, `badge-open`), cada archivo **autocontenido**: lo copiás o linkeás `css/components.css` (el barrel) y funciona, sin framework ni paso de compilación. El sitio de documentación canónico es **`index.html`** (SPA de una sola página, HTML + JS vanilla).

> **Arquitectura buildless (canónica, confirmada 2026-07).** `css/components/*.css` + `index.html` (vanilla) son el origen de verdad. Entre 2026-06-22 y 2026-06-26 el repo se migró a Tailwind v4 + React/Radix (`packages/ds/`, `islands/`); esa migración fue **revertida** el 2026-07-17 y todo se re-portó a CSS buildless. `packages/ds/` e `islands/` **no existen** en `main`. Wrappers React opcionales y tipados viven en `components/ui/*.tsx` (aplican las mismas clases, cero estilos propios) para proyectos que los quieran.

> **AI agents / skills**: empezá por **[AI-USAGE-GUIDE.md](./AI-USAGE-GUIDE.md)** (cómo consumir el DS para construir/migrar pantallas) y **[CLAUDE.md](./CLAUDE.md)**. Para elegir/usar un componente: **[component-rules/](./component-rules/)** (reglas operativas por componente, machine-readable) + **[component-rules/manifest.json](./component-rules/manifest.json)** (registro). Para aplicar Embassy a Gamaforce: **[GAMAFORCE-MIGRATION.md](./GAMAFORCE-MIGRATION.md)**.

---

## Inicio rápido (buildless — canónico)

Sin build. Linkeá las capas de tokens/base y las clases de componentes:

```html
<link rel="stylesheet" href="css/variables.css">     <!-- 1. tokens (requerido) -->
<link rel="stylesheet" href="css/base.css">           <!-- 2. reset + tipografía base -->
<link rel="stylesheet" href="css/layout.css">         <!-- 3. solo para el app shell (sidebar/topbar) -->
<link rel="stylesheet" href="css/components.css">     <!-- 4. todos los componentes — o copiá uno de css/components/ -->
```

```html
<button class="btn-primary">Crear vacante</button>
```

Cada archivo en `css/components/` es la implementación completa de ese componente — copialo standalone (solo necesita la capa de tokens de arriba). Fuentes: **Inter** (body), **Epilogue** (headings), **DM Mono** (code) vía `var(--font-*)`. Íconos: **Lucide**.

Ver el catálogo interactivo:

```bash
python3 -m http.server 8087
# → http://localhost:8087/
```

---

## Estructura

```
amalgama-ds/
├── index.html                # Sitio de documentación canónico (SPA, una sola página)
├── css/
│   ├── variables.css         # Design tokens — ORIGEN DE VERDAD de tokens (ver TOKENS.md)
│   ├── base.css              # Reset, tipografía, animaciones
│   ├── composition.css       # Estructura de página: columna, anchos, grilla de 12, medida, ritmo
│   ├── layout.css            # App shell (sidebar, topbar, avatar) — solo web
│   ├── space.css             # Capa espacial de Amalgama — SOLO productos internos, se carga aparte
│   ├── md-sys-bridge.css     # Alias MD3 (--md-sys-color-*) → roles Embassy (opcional)
│   ├── components.css         # Barrel: @import de todos los css/components/*.css
│   └── components/           # CSS por componente — ORIGEN DE VERDAD de componentes (62 archivos)
├── tokens/                   # GENERADO por scripts/build-tokens.mjs — no editar a mano
│   ├── embassy.tokens.ts     # light · dark · native · nativeDark, tipados (React Native)
│   ├── embassy.tokens.json   # Formato neutral con provenance
│   ├── gluestack.config.ts   # Colores en triplete RGB para NativeWind v5
│   ├── theme.css             # Bloque @theme inline de Tailwind v4
│   └── NATIVE-NOTES.md       # Los tokens que no cruzan 1:1 de CSS a RN
├── components/ui/*.tsx        # Wrappers React opcionales (cva + cn, mismas clases, cero estilos propios)
├── components/native/         # La librería para React Native — copy-paste, lee tokens/ (ver su README)
├── component-rules/          # Reglas operativas por componente (machine-readable) — ver README + INDEX + manifest.json
│   ├── <id>.md               # 70 archivos: frontmatter YAML (schema) + prosa (ejemplos correcto/incorrecto)
│   ├── manifest.json         # Registro agregado (regenerar: python3 scripts/build-manifest.py)
│   ├── README.md             # Schema + cómo lo consumen los skills
│   └── INDEX.md              # Cobertura
├── guidelines/               # Playbook UX (13 .md): principios, IA, jerarquía, forms, tablas, nav, estados, motion, a11y…
├── scripts/
│   ├── validate-ds.mjs       # Validación automatizada (node scripts/validate-ds.mjs)
│   ├── build-manifest.py     # Regenera component-rules/manifest.json desde los frontmatter
│   ├── build-brand-theme.mjs # Genera el tema de marca de un cliente desde un hex por paleta
│   ├── build-tokens.mjs      # Exporta variables.css a tokens/ (React Native). --check falla si hay drift
│   ├── build-public-api.mjs  # Regenera PUBLIC-API.md y public-api.json
│   └── check-output.mjs      # Chequea lo producido contra la taxonomía de FAILURES.md
├── docs/                     # Stubs de redirect a la SPA index.html
├── CLAUDE.md                 # Guía de consumo (humanos + IA)
├── AI-USAGE-GUIDE.md         # Cómo los agentes/skills consumen el DS
├── GAMAFORCE-MIGRATION.md    # Aplicar Embassy a Gamaforce (audit + workflow + screen patterns + DoD)
├── TOKENS.md                 # Referencia de tokens (propósito + cuándo/cuándo no)
├── COMPOSICION.md            # La FORMA de la página — obligatorio antes de construir
├── MOBILE.md                 # Apps nativas (React Native): escala, densidad, targets, mapa de componentes
├── FAILURES.md               # Taxonomía de fallas — el vocabulario de review y eval
├── GOVERNANCE.md             # Contrato de consistencia
├── MIGRATION.md              # Guía de migración genérica desde legacy
├── WHITE-LABEL.md            # Theming de marca cliente
├── CONTRIBUTING.md           # Cómo agregar o modificar componentes
└── DEPLOYMENT.md             # Cómo se actualiza producción
```

---

## Componentes

Origen de verdad = `css/components/<nombre>.css` (clases planas). La columna **React** nombra el wrapper opcional en `components/ui/` donde existe (`—` = solo-CSS). Cada componente tiene además su regla operativa en `component-rules/<id>.md`.

### Core (genéricos)

| Componente | CSS (canónico) | React (opcional) |
|---|---|---|
| Button | `button.css` | `button.tsx` |
| Badge | `badge.css` | `badge.tsx` |
| Chip | `chip.css` | `chip.tsx` |
| Card / Item (Basic Card) | `card.css` / `item.css` | `card.tsx` / — |
| Input / Select / Textarea | `form.css` / `select.css` | `input.tsx`, `select.tsx`, `textarea.tsx` |
| Search | `search.css` (+ `.search-field` en `toolbar.css`) | `search.tsx` |
| Table / Data Table | `table.css` / `data-table.css` | `table.tsx` / `data-table.tsx` |
| Tabs | `tabs.css` | `tabs.tsx` |
| Dialog (+ Alert Dialog) / Sheet | `modal.css` / `sheet.css` | `modal.tsx` / `sheet.tsx` |
| Toast / Snackbar | `toast.css` | `toast.tsx` |
| Toolbar | `toolbar.css` | `toolbar.tsx` |
| Segmented Button | `segmented-button.css` | `segmented-button.tsx` |
| Stat Card / Skeleton / Empty State | `stat-card.css` / `skeleton.css` / `empty-state.css` | `*.tsx` |

### Extended (dominio)

Vacancy Card (`vacancy-card.css`), Kanban Card (`kanban.css`), Person Card (`person-card.css`, variante de Basic Card), Create Form (`create-form.css`), Placeholder (`placeholder.css`) — solo-CSS, aplicados con clases directas.

### App Shell (`layout.css`)

Topbar (`.topbar`), Sidebar / Navigation Drawer (`.sidebar` / `.nav-item`, drawer modal &lt;768px), Avatar (`.avatar`).

> El inventario completo con variantes y reglas de decisión (`Cuándo usar / Cuándo no`) está en **CLAUDE.md** (tabla de inventario) y en **`component-rules/<id>.md`** por componente.

---

## Dark mode

Automático — sin overrides por componente:

```html
<html data-theme="dark"><!-- todos los componentes se adaptan solos --></html>
```

Los roles semánticos (`--color-*`, `--text-*`, `--bg`) se recalibran solos bajo `data-theme="dark"`. Los componentes son ciegos al tema. Ver **TOKENS.md**.

---

## Personalización de tokens

Sobreescribí las **primitivas**, no los roles semánticos:

```css
:root {
  --primary-900: #1a3a5c;  --primary-500: #2d6db4;  --secondary-500: #00a86b;
  --radius-sm: 2px; --radius-md: 4px; --radius-lg: 6px; --radius-xl: 8px;
  --font-heading: 'Brand Heading', sans-serif; --font-body: 'Brand Body', sans-serif;
}
```

Ver [WHITE-LABEL.md](./WHITE-LABEL.md) para el proceso completo.

---

## Validación

```bash
node scripts/validate-ds.mjs      # token-lint + rutas/anchors + cobertura de manifest/metadata
python3 scripts/build-manifest.py # regenera component-rules/manifest.json desde los frontmatter
```

---

## Documentación (mapa)

| Documento | Propósito |
|---|---|
| `index.html` (raíz) | Catálogo interactivo — doc humana canónica |
| [AI-USAGE-GUIDE.md](./AI-USAGE-GUIDE.md) | Cómo agentes/skills consumen el DS para construir/migrar pantallas |
| [component-rules/](./component-rules/) + `manifest.json` | Reglas operativas por componente (machine-readable) — elegir/usar un componente |
| [GAMAFORCE-MIGRATION.md](./GAMAFORCE-MIGRATION.md) | Aplicar Embassy a Gamaforce — audit, workflow, screen patterns, checklists, DoD |
| [guidelines/](./guidelines/) | Playbook UX — cómo construir una buena *pantalla* (principios, IA, forms, tablas, estados, motion, a11y) |
| [TOKENS.md](./TOKENS.md) | Referencia de tokens (propósito + cuándo/cuándo no) — fuente: `css/variables.css` |
| [COMPOSICION.md](./COMPOSICION.md) | La **forma** de la página: estructura, ancho, grilla, ritmo, y las reglas anti-genérico |
| [MOBILE.md](./MOBILE.md) | **Apps nativas** (React Native): la escala nativa, densidad, targets, el stack y el mapa de los 62 componentes |
| [FAILURES.md](./FAILURES.md) | Taxonomía de fallas — el vocabulario compartido de `review` y `eval` |
| [PUBLIC-API.md](./PUBLIC-API.md) | La lista acotada de clases públicas (generado) |
| [CLAUDE.md](./CLAUDE.md) | Guía de consumo completa (humanos + IA) + tabla de inventario |
| [GOVERNANCE.md](./GOVERNANCE.md) | Contrato de consistencia — reglas transversales |
| [MIGRATION.md](./MIGRATION.md) | Migración genérica desde legacy (algoritmo de reemplazo de tokens, mapeo, anti-patrones) |
| [WHITE-LABEL.md](./WHITE-LABEL.md) | Theming de marca cliente |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Cómo agregar o modificar componentes |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Cómo se actualiza el sitio publicado |
