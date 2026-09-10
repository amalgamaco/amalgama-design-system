# Propuesta — capa de agentes del Design System

Todo lo que hay acá es **propuesta**: no modifica ningún archivo existente del repo. Revisalo,
ajustalo y recién ahí movelo a su lugar definitivo.

Analizado sobre el commit **`acb86c0`** (28-jul-2026), con cuatro archivos modificados sin commitear
en el working tree local (`component-rules/search.md`, `components/ui/carousel.tsx`,
`css/components/search.css`, `index.html`).

---

## Qué hay

| Archivo | Qué es | Dónde va cuando se adopte |
|---|---|---|
| `ANALISIS-SKILLS-DS.md` | El análisis: diagnóstico, mapeo contra el modelo de Vercel, mapa de skills, flujo, roadmap y guion para presentarlo | acá mismo, o `docs/` |
| `QUE-CAMBIAMOS.md` | **Para contarle al equipo**: qué le copiamos al `design.md` de Vercel, qué agregamos nosotros y qué cambió en la estructura del repo. Sin tecnicismos | ídem |
| `PRUEBA-EQUIPO.md` | **Probalo vos**: una hora, un proyecto de punta a punta con un cliente inventado, y cinco preguntas para contar qué molestó. Sin checklist técnica a propósito | ídem |
| `GUIA-EQUIPO.md` | **Una página práctica para el equipo**: qué escribir, dónde y qué pasa. Es lo que se reparte | ídem |
| `PLAN-USO-DS.md` | **El plan de uso para presentar al equipo**: las tres capas, cómo arranca un proyecto nuevo, el cuestionario de setup, el día a día y qué hay que construir | ídem |
| `design.md` | Archivo de marca público y autocontenido — el equivalente a `vercel.com/design.md` | **ya está en la raíz del repo** (el raw de GitHub lo sirve) |
| `PUBLIC-API.md` + `public-api.json` | La API acotada de clases, generada. 62 componentes, 483 clases públicas de 548 selectores | **ya está en la raíz del repo**, regenerar en cada release |
| `FAILURES.md` | Taxonomía de fallas compartida por `review` y `eval` | **ya está en la raíz del repo** |
| `scripts/build-public-api.mjs` | Genera `PUBLIC-API.md` y `public-api.json` desde `css/components/` + el manifest | **ya está en `scripts/`** |
| `scripts/check-output.mjs` | Chequeos determinísticos sobre lo que un agente **produjo** (no sobre el DS) | **ya está en `scripts/`** |
| `scripts/check-screen-report.mjs` | Verifica que el diagnóstico de una pantalla sea real y no un re-skin | **ya está en `scripts/`** |
| `skills/` | **Ya no está acá.** Las cinco skills viven en el plugin `embassy` de `amalgamaco/claude-code-plugins` — ver `SKILLS.md` | — |

## Qué se sacó por redundante (8-sep-2026)

- **`skills/embassy:screen/references/marca.md`** — era un subconjunto literal de `design.md` (las mismas
  7 filas de logo, la misma voz, la misma estrategia de tema). Dos fuentes para lo mismo es
  justamente el problema que este trabajo intenta cerrar. `embassy` ahora apunta a `design.md`,
  igual que `artifact`.
- **`scripts/build-brand-theme.mjs`** de esta carpeta — el canónico vive en `scripts/` del repo
  desde el commit del fix de white-label. Eran byte-idénticos.

## Ojo: las skills no se distribuyen desde este repo

El plugin `embassy` que la gente tiene instalado sincroniza desde **`amalgamaco/claude-code-plugins`**
(repo privado), no desde acá. Esta carpeta es el borrador; para que una skill llegue a alguien hay
que llevarla a ese otro repo. La carpeta `skills/` de la raíz de este repo es una copia congelada
(341 líneas contra las 455 del plugin) y hay que borrarla o convertirla en la fuente — ver
`PLAN-USO-DS.md` §9.6.

## Cómo probarlo ya mismo

```bash
# 1. generar la API pública (hay que correrlo antes que nada — check-output.mjs la necesita)
node scripts/build-public-api.mjs

# 2. probar los chequeos sobre cualquier HTML generado
node scripts/check-output.mjs <archivo.html>

# 3. las skills: copiar la carpeta que quieras probar al plugin `embassy` y usarla
```

## Lo que falta y no está acá

- **`references/screen-patterns.md`** vive en el plugin, junto a la skill que lo lee. Queda ahí a
  propósito: es procedimiento, no criterio (ver `SKILLS.md`).
- **Los escenarios 02 a 07** del eval — está escrito el 01 como plantilla; el resto sale de decidir
  cuál es el entregable que más repetimos (ver `ANALISIS-SKILLS-DS.md` §9).
- **Las skills P1 y P2** (`embassy-contribute`, `embassy-figma`,
  `embassy-copy`, y las de a11y / motion / dataviz / mobile). Están especificadas en el análisis
  §5.2, sin escribir. (`embassy-white-label` quedó absorbida por `start`.)

## Dos gaps de cobertura que encontró el generador

1. **El id del CSS no siempre es el id de la regla.** `modal.css` → `dialog.md`, `toast.css` →
   `snackbar.md`, `spinner.css` y `progress.css` → `loading.md`, `dropdown-menu.css` → `menu.md`,
   `sheet.css` → `sheet-side.md` + `sheet-bottom.md`, `kanban.css` → `kanban-card.md`,
   `radio-group.css` → `radio.md`. El generador mapea por `source.css` del manifest, no por nombre
   de archivo — cualquier herramienta que asuma la coincidencia va a linkear a archivos inexistentes.
2. **Seis componentes CSS no tienen `component-rules`:** `back-link`, `create-form`, `date-picker`,
   `description`, `page-header`, `placeholder`. Un agente no los puede elegir por propósito.
   `AI-USAGE-GUIDE.md` §6 dice que `validate-ds.mjs` verifica *"every component in `css/components/`
   has a `component-rules/<id>.md` entry"*, pero el chequeo [5] solo compara `manifest.count` contra
   la cantidad de archivos `.md`. Nunca mira el CSS.

## Arreglado en el repo (8-sep-2026)

Estos sí se tocaron, fuera de esta carpeta. Van en su propio commit.

1. **`css/variables.css`** — 25 roles de marca y estado del bloque `[data-theme="dark"]` pasaron de
   hex literal a `var(--primitiva)`, para que un tema white-label llegue también a dark. Verificado
   en Chromium: sin marca, los valores de Embassy quedan idénticos (0 regresiones sobre 33 roles);
   con marca, los roles de dark que responden pasan de 0 a 10. Los neutrals siguen literales a
   propósito, igual que en el bloque `[data-theme="light"]`.
2. **`WHITE-LABEL.md`** — la plantilla ahora incluye `--primary-60/-75` y `--secondary-925/-950`;
   se agregó la tabla de qué step consume cada rol en light y dark (el doc decía que la marca va en
   el `500`, y `--color-primary` es el `900`); §4.2 ya no afirma algo que el código no hacía; y se
   apunta a `build-brand-theme.mjs` en vez de pedir 20 hex a mano.
3. **`scripts/validate-ds.mjs`** — chequeo `[5b]` nuevo: cobertura `css/components/` →
   `component-rules/`, mapeando por `source.css`. Es lo que `AI-USAGE-GUIDE.md` §6 decía que
   validaba y no validaba. Sale como warning, y hoy reporta los 6 componentes sin regla.
4. **`AI-USAGE-GUIDE.md`** — se sacó la referencia a `/design:presentation-builder`, que no existe,
   y se corrigió el §5.1 sobre los logos (son SVG, no PNG).
5. **`CONTRIBUTING.md` §4** — reescrita entera. Instruía a escribir componentes Tailwind en
   `packages/ds/` y decía que `css/components/*.css` estaba *deprecado*: exactamente al revés de la
   arquitectura vigente desde el 17-jul-2026. Ahora describe el flujo buildless real, incluye la
   regla operativa como archivo obligatorio y cierra con los dos scripts de validación.

## Pendiente, no lo toqué

1. `skills/screen/SKILL.md` del repo (341 líneas) ≠ la copia del plugin instalado
   (455 líneas). Hay que definir cuál es la fuente y sincronizar con un check.
2. `logos/` tiene PNGs; el SKILL.md dice que los PNG están retirados y apunta a SVGs en S3.
   Hay que decidir si se reemplazan o se borran.
3. El CDN sirve desde `@main`: cualquier merge cambia lo que ve un artefacto ya entregado.
   Conviene pinear un tag.
4. Los 6 componentes CSS sin `component-rules` que ahora reporta `[5b]`.
5. **`--color-on-secondary` (blanco) sobre `--color-secondary` (`#4F80FF`) da 3.58:1.** Está por
   debajo de AA para texto normal (4.5:1); alcanza para texto grande y para componentes de
   interfaz (3:1). Lo detectó `build-brand-theme.mjs` corriéndolo con los colores del propio
   Embassy, así que es deuda del sistema y no de ninguna marca de cliente. No lo cambié: pasar el
   texto del acento a navy (4.79:1) o oscurecer el acento es una decisión de diseño, no un bug
   mecánico.
6. `CONTRIBUTING.md` salta de §4 a §6 (no hay §5). Es previo; no renumeré para no romper
   referencias cruzadas.

## Verificación hecha sobre estos archivos

- Cada token `--*` y cada clase `.*` citados existen en el repo (chequeado contra `variables.css`,
  `css/components/*.css` y el manifest).
- Cada archivo del repo referenciado resuelve.
- `build-public-api.mjs` corrido sobre el repo real: 62 componentes, 484 clases públicas, 0 sin
  lista curada.
- `check-output.mjs` probado contra un HTML con fallas sembradas: detecta A1, A2, A3, A6, B1, B3,
  C1, F2, F3, G1, H4 y sale con código 1.
- `build-brand-theme.mjs` corrido con una marca naranja (#FF6B00 / #1E88E5): genera las dos rampas,
  detecta correctamente que blanco sobre el acento queda en 3.46:1 (bajo AA) y avisa que un primary
  claro no encaja en el rol de `--primary-900`.
- El bug de dark mode verificado en Chromium: con las primitivas overrideadas,
  `--color-primary-container` y `--color-secondary-container` siguen devolviendo los valores de
  Embassy bajo `data-theme="dark"`.
- `node scripts/validate-ds.mjs` sobre el repo: 0 failures, 2 warnings preexistentes (729 hex inline
  en `index.html`, 11 duraciones crudas en animaciones).
