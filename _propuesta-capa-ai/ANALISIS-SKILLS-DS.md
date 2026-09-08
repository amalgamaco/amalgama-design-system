# Skills para el Design System de Amalgama — análisis y plan

**Autora:** Ana Borthagaray · **Fecha:** 8 de septiembre de 2026
**Repo analizado:** `amalgamaco/amalgama-design-system` @ `acb86c0` (28-jul-2026)
**Referencias externas:** [Vercel — *How our agents build on-brand pages with design.md*](https://vercel.com/blog/how-our-agents-build-on-brand-pages-with-design-md) · [jakubkrehel/skills](https://github.com/jakubkrehel/skills)

---

## 1. Resumen ejecutivo

Embassy ya es, con diferencia, la parte más difícil del problema: 62 componentes, 61 reglas
operativas machine-readable, 13 guías de UX, un contrato de governance de 1.300 líneas y un
script de validación determinístico que hoy corre en verde. Eso es más infraestructura
agent-ready que la que tiene la mayoría de los design systems.

Lo que falta no es más documentación. Faltan **tres cosas que Vercel identificó y nosotros no
tenemos**:

1. **Un archivo de marca público y autocontenido** (el equivalente a `vercel.com/design.md`),
   para que cualquier agente —en cualquier herramienta, sin acceso al repo— produzca algo
   on-brand. Hoy todo nuestro sistema asume `git clone`.
2. **Una API pública acotada de clases**. Hoy le pedimos al agente que *lea el CSS* para citar
   las clases exactas. Son 268 KB de CSS y 517 clases. Vercel hace lo contrario: publica una
   lista corta de nombres permitidos y prohíbe explícitamente leer el stylesheet.
3. **Un loop de evaluación**. `validate-ds.mjs` valida *el design system*; nadie valida *lo que
   el agente produce con él*. Sin escenarios fijos, baseline y conteo de fallas, no sabemos si
   una skill mejora o empeora las cosas — solo sabemos si el repo está prolijo.

La propuesta: **4 skills P0** (`embassy`, `embassy-artifact`, `embassy-review`, `embassy-eval`)
más tres artefactos de soporte (`design.md`, `PUBLIC-API.md` generado, `FAILURES.md`), y un flujo
de trabajo de tres carriles según quién trabaja y con qué acceso.

> **Dónde hacer hincapié, en una línea:** dejar de agregar documentación y empezar a **medir la
> salida**. Todo lo demás sale de ahí.

---

## 2. Qué tenemos hoy

### 2.1 El inventario real

| Capa | Qué hay | Volumen |
|---|---|---|
| Tokens | `css/variables.css` — 250 tokens únicos, 58 roles `--color-*` | 31 KB |
| Componentes (canónico) | `css/components/*.css` — 62 archivos, **517 clases distintas** | 268 KB |
| Wrappers React (opcionales) | `components/ui/*.tsx` | 50 archivos |
| Reglas operativas | `component-rules/*.md` — 61/61, YAML + prosa, `manifest.json` | **489 KB** |
| Playbook UX | `guidelines/*.md` — 13 guías | 144 KB |
| Contratos | `GOVERNANCE.md` (1.326 líneas), `TOKENS.md`, `MIGRATION.md`, `WHITE-LABEL.md`, `CONTRIBUTING.md`, `AI-USAGE-GUIDE.md`, `GAMAFORCE-MIGRATION.md` | ~200 KB |
| Docs humana | `index.html` (SPA) | 2,4 MB |
| Validación | `scripts/validate-ds.mjs` (9 chequeos), `build-manifest.py` | corre en verde |
| Capa de agentes | **1 skill** (`design:design-system`, 455 líneas) + **1 agente** (`design-system-implementer`) + 1 reference (`screen-patterns.md`, 639 líneas) | — |
| Distribución | CSS servido por jsDelivr desde `@main` | sin pin de versión |

### 2.2 Lo que está muy bien (y hay que defender)

- **`component-rules/` es nuestro activo diferencial.** `when_to_use` / `when_not_to_use` /
  `not_to_confuse_with` / `common_mistakes` en YAML es exactamente el tipo de contexto que a los
  agentes les falta. Vercel *no* tiene eso.
- **Los tokens son ley y el dark mode es automático.** El agente no puede equivocarse de tema si
  usa roles semánticos; `validate-ds.mjs` lo verifica.
- **El playbook `guidelines/` separa "correcto" de "bueno".** Es la capa que evita pantallas
  token-perfectas e inusables.
- **Ya existe validación determinística.** Vercel llegó a esa conclusión después de 200 corridas;
  nosotros ya tenemos el hábito.

### 2.3 Los problemas concretos, con evidencia

| # | Problema | Evidencia |
|---|---|---|
| 1 | **El corpus no entra en un contexto.** El skill manda a leer `AI-USAGE-GUIDE` + `CLAUDE.md` + `TOKENS.md` + la regla + el CSS + el wrapper + `guidelines/` + `GOVERNANCE.md`. Sumado: ~1 MB ≈ 250k tokens. | 489 KB rules + 268 KB CSS + 144 KB guidelines + 94 KB governance |
| 2 | **Skill duplicada y en drift.** Hay dos copias del mismo `SKILL.md` que ya divergieron. | repo: 341 líneas · plugin instalado: 455 líneas |
| 3 | **Docs que apuntan a cosas que no existen.** `AI-USAGE-GUIDE.md` §5 instruye usar `/design:presentation-builder`. Esa skill no está en el plugin `design`. | referencia rota |
| 4 | **`CONTRIBUTING.md` quedó en la era Tailwind.** §4 se llama *"Component implementation (Tailwind, in `@amalgama/ds`)"*, arquitectura revertida el 17-jul-2026. | contradice `README.md` y `CLAUDE.md` |
| 5 | **La capa de marca tiene dos fuentes.** El repo tiene `logos/*.png`; el `SKILL.md` dice que los PNG están retirados y apunta a SVGs en S3. | `logos/horizontal/*.png` vs `SKILL.md` §8 |
| 6 | **Cero soporte para trabajo sin repo.** Una propuesta comercial, un reporte, un one-pager, un demo para cliente: hoy no hay camino on-brand que no empiece por clonar el repo. | no existe `design.md` |
| 7 | **Nadie mide la salida.** `validate-ds.mjs` audita el repo, no lo generado. No hay escenarios, baseline ni taxonomía de fallas. | — |
| 8 | **Nada del lado Figma.** El brief del proyecto pide dual output (Figma ↔ código) y el equipo es mayormente de diseño; no hay skill de paridad ni Code Connect, aunque el MCP de Figma está instalado. | — |

> Los dos warnings abiertos de `validate-ds` (729 hex inline en `index.html`, 11 duraciones crudas
> en animaciones) son ruido conocido y no bloquean nada — los dejo anotados para no perderlos.

---

## 3. El modelo de Vercel, en tres partes

Vercel venía de una skill embebida en sus repos (`product-design`) que funcionaba adentro y
fallaba afuera: reportes, propuestas, one-pagers hechos en otras herramientas salían con marca
inventada. Cuando portaron esa skill a un prompt público, *"cada modelo que leía esa descripción
la interpretaba distinto y generaba páginas radicalmente diferentes"*. Lo que resolvió el
problema fue partirlo en tres:

**(1) `design.md` — el archivo de juicio.** Una URL pública (`vercel.com/design.md`), ~8.000
palabras, con secciones de tipo *"trabajá en cuatro pasadas"*, *"usá este orden de prioridad"*,
*"rechazá estos reflejos de diseño generado"*. Lo importante: **nombra los patrones malos
recurrentes** para que el agente los reconozca y los evite, en vez de solo describir lo bueno.

**(2) El stylesheet público con API acotada.** `vercel-brand.css` con ~80 nombres de clase
publicados (`vbg-*`). La regla explícita: *"tratá solo los nombres listados como API pública"* y
*"nunca inspecciones el CSS buscando selectores internos"*. **El agente nunca lee el CSS** — el
stylesheet se carga cuando la página renderiza. Eso ahorra contexto y elimina la deriva.

**(3) El loop de evaluación.** 7 escenarios fijos (propuesta de renovación, reporte, página de
planning, brief), constantes mientras `design.md` evolucionaba. Cada ronda comparaba salidas entre
modelos Claude y GPT, con revisión humana en una app de A/B ciego, y **cada corrección se
registraba contra la corrida exacta que la produjo**. Después las correcciones se implementaban
*en el punto más angosto posible*: prosa en `design.md`, CSS en el stylesheet, o un chequeo de
código determinístico si la falla era mecánica.

**El resultado medido:** sobre las mismas fallas conocidas, las páginas generadas con `design.md`
tuvieron **39 fallas contra 91 sin él — 57% menos**.

Y las seis recomendaciones que dan para replicarlo:

1. Empezá chico: un artefacto repetido, con inputs reales y una rúbrica corta.
2. Guardá el baseline: generá una vez *sin* el contexto nuevo, antes de medir.
3. Convertí el feedback en criterios observables ("se siente apretado" → una regla medible).
4. Restringí la mecánica: lo repetible va a CSS o a un check, no a prosa.
5. Corré comparaciones pareadas: el mismo escenario con y sin la guía.
6. Preguntá si cada corrección generaliza más allá del output que la originó.

---

## 4. Vercel → Embassy: qué tenemos y qué falta

| Pieza del modelo Vercel | Estado en Amalgama | Veredicto |
|---|---|---|
| Archivo de juicio con reglas y anti-patrones | `SKILL.md` §1–§3 + `guidelines/` + `screen-patterns.md`. Muy bueno, pero **vive en el repo y en el plugin**, no en una URL. | 🟡 existe, mal distribuido |
| Anti-patrones nombrados explícitamente | Parcial: `common_mistakes` por componente y §9B del skill. Falta la lista corta transversal de *"esto no se shipea"*. | 🟡 disperso |
| Stylesheet público | jsDelivr sirve `variables.css` / `base.css` / `components.css`, pero **desde `@main`**, sin pin. | 🟡 existe, sin versionar |
| API de clases acotada | **No existe.** Al revés: le pedimos al agente que lea el CSS para citar clases. 517 clases, 268 KB. | 🔴 falta |
| "Nunca leas el CSS" | Contradicho por diseño (`SKILL.md` §2, paso 4). | 🔴 invertido |
| Escenarios fijos de evaluación | No existen. | 🔴 falta |
| Baseline guardado | No existe. | 🔴 falta |
| Revisión humana registrada contra la corrida | No existe. | 🔴 falta |
| Chequeos determinísticos sobre la salida | `validate-ds.mjs` valida el repo, no la salida. Los checks de §9B del skill son manuales. | 🟡 existe la mitad |
| Medición del delta (con vs sin) | No existe. | 🔴 falta |

**Lectura:** tenemos la mitad "conocimiento" del sistema mucho mejor que Vercel, y la mitad
"distribución + medición" sin arrancar. Y es la segunda mitad la que hace que la primera funcione.

### 4.1 La tensión que hay que resolver a conciencia

Vercel dice *"no leas el CSS, usá esta lista de clases"*. Nuestro skill dice *"si no podés citar
las clases exactas del bloque `Uso:`, no lo leíste"*. **Ambas están bien, en contextos distintos**:

- Con el repo a mano, en un proyecto de producto, leer la regla + el CSS del componente es lo
  correcto: da variantes, estados, motion y a11y. Es preciso y es barato si se lee **solo el
  componente que se está usando**.
- Sin repo, en un artefacto de una sola vez, leer el CSS es imposible y además innecesario.
  Ahí hace falta la lista acotada.

La conclusión no es elegir una: es **separar los dos caminos en dos skills distintas** y que cada
una sea explícita sobre cuánto puede leer. Eso es el corazón de la propuesta.

---

## 5. El mapa de skills propuesto

### 5.1 Principios de diseño de esta capa

1. **Una skill = un trabajo con un entregable.** Si no se puede nombrar el output, es una
   reference, no una skill.
2. **Progressive disclosure.** `SKILL.md` corto —de dos a cuatro veces más chico que el actual— que decide y rutea; el detalle en
   `references/` o, mejor, **apuntando al repo** en vez de duplicarlo. Duplicar es lo que produjo
   el drift del problema #2.
3. **El repo es la única fuente de verdad; las skills no la copian, la consultan.**
4. **Toda skill que produce UI termina en un chequeo que otro puede correr.** Sin gate verificable
   no hay skill, hay sugerencia.
5. **Escrita para el rol que la va a usar.** El equipo es mayormente de diseño: si una skill
   requiere terminal, hay que decirlo en la primera línea.

### 5.2 El set

| # | Skill | Qué hace | Quién la usa | Necesita repo | Prioridad |
|---|---|---|---|---|---|
| 1 | **`embassy`** | Router del DS. Bootstrap del repo, elige el modo (crear / mejorar / migrar), abre solo lo que hace falta y aplica los gates. Reemplaza al `design-system` monolítico. | Diseño + Dev | Sí | **P0** |
| 2 | **`embassy-artifact`** | Genera artefactos on-brand **sin repo**: propuestas, reportes, one-pagers, demos, dashboards de una vez. Usa `design.md` + CSS pineado + la API acotada. | Todo el estudio | No | **P0** |
| 3 | **`embassy-review`** | Audita una pantalla / PR / artefacto contra Embassy y emite un reporte con la taxonomía de fallas y severidad. Es el motor de criterio compartido. | Diseño + Dev + QA | Sí (o parcial) | **P0** |
| 4 | **`embassy-eval`** | El loop: escenarios fijos, baseline, corridas pareadas, conteo de fallas, registro de correcciones. | Dueños del DS | Sí | **P0** |
| 5 | `embassy-white-label` | Arma el theme de marca de un cliente end-to-end desde `WHITE-LABEL.md` (override de primitivas, verificación en ambos temas, checklist). | Diseño | Sí | P1 |
| 6 | `embassy-contribute` | Agregar o modificar un componente correctamente: CSS + `component-rules/<id>.md` + manifest + sección en `index.html` + validate. Reescribe de paso el `CONTRIBUTING.md` obsoleto. | Diseño + Dev | Sí | P1 |
| 7 | `embassy-figma` | Paridad Figma ↔ código: variables ↔ tokens, componentes ↔ clases, Code Connect. Cierra el "dual output" del brief. | Diseño | Sí + Figma MCP | P1 |
| 8 | `embassy-copy` | Microcopy rioplatense según `guidelines/content-and-writing.md`: labels, errores, empty states, CTAs. | Diseño + PO | No | P1 |
| 9 | `embassy-a11y` | Auditoría WCAG 2.1 AA focalizada (contraste, foco, targets, semántica, teclado). Hoy vive diluida dentro del skill grande. | Diseño + Dev | Parcial | P2 |
| 10 | `embassy-motion` | Motion desde los bloques `motion:` + `guidelines/motion.md`; detecta easings y duraciones inventadas. | Dev | Sí | P2 |
| 11 | `embassy-dataviz` | Charts con `--chart-1..5`, reglas de encoding y accesibilidad de color. | Diseño + Dev | Parcial | P2 |
| 12 | `embassy-mobile` | Transformaciones responsive y, más adelante, el DS mobile del roadmap. | Diseño | Sí | P2 |

### 5.3 Qué NO recomiendo hacer

- **No portar `jakubkrehel/skills` tal cual.** Es un set excelente (`better-ui`, `better-typography`,
  `better-colors`, `better-layout`, `better-accessibility`, `interface-review`, `break`, `variant`)
  pero es **genérico y opinado por otra marca**: radios concéntricos, `scale(0.96)` al presionar,
  sombras sobre bordes. Varias de esas opiniones **chocan con GOVERNANCE** (nosotros escalamos el
  radio por tamaño, no por anidamiento; el único transform de hover aprobado es `translateY(-1px)`).
  Lo que sí vale la pena robarle son **dos formatos**:
  - **`break`** — renderizar un componente en todos sus estados y escenarios de golpe. Encaja
    perfecto con nuestra matriz de estados y sirve como generador de escenarios para el eval.
  - **`variant`** — generar N variantes de un componente para iterar. Útil en `embassy-contribute`.
- **No hacer una skill por componente.** Para eso ya está `component-rules/`, que es mejor: es
  machine-readable y tiene manifest.
- **No duplicar `guidelines/` adentro de las skills.** Referenciar, nunca copiar.

### 5.4 Fichas de las P0

#### `embassy` — el router

Reemplaza al `design-system` de 455 líneas. El problema del actual no es qué dice, es que **dice
todo siempre**. La versión nueva:

- decide el modo en las primeras 20 líneas (artefacto sin repo → derivar a `embassy-artifact`;
  proyecto con repo → seguir);
- corre el bootstrap (`§0`: clonar/pull, registrar commit);
- aplica el **screen gate** de 6 líneas antes de cualquier markup;
- para cada componente abre **solo** `component-rules/<id>.md` y `css/components/<id>.css`;
- cierra con `validate-ds.mjs` + los checks de `embassy-review`.

Todo lo que hoy está inline (tablas de decisión, motion, tokens, marca) pasa a `references/`, que
se leen **bajo demanda**. El borrador que acompaña este análisis queda en 190 líneas contra las 455 de hoy, y solo abre los archivos del componente que se está usando.

#### `embassy-artifact` — el equivalente a design.md

El desbloqueo más grande y el más barato. Una URL, cero repo, cualquier agente:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@v1.0.0/css/variables.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@v1.0.0/css/base.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@v1.0.0/css/components.css">
```

La skill trae el juicio (composición, jerarquía, voz, anti-patrones) y **la lista acotada de clases
permitidas**; el CSS no se lee nunca. Sirve para propuestas comerciales, reportes de proyecto,
one-pagers, demos y cualquier cosa hecha fuera de un repo de producto.

> Dos decisiones que hay que tomar acá: **(a)** pinear un tag (`@v1.0.0`) en vez de `@main`, porque
> hoy cualquier merge cambia lo que ve un artefacto ya entregado; **(b)** si publicamos `design.md`
> en una URL propia (`amalgama.co/design.md`) o alcanza con el raw de GitHub. Vercel eligió URL
> propia para que un agente sin contexto la pueda pedir sola.

#### `embassy-review` — criterio compartido y observable

Toma una pantalla (código, URL, screenshot o Figma) y devuelve un reporte con hallazgos
clasificados por la **taxonomía de fallas** (`FAILURES.md`), cada uno con severidad, evidencia y la
regla del DS que lo justifica. Dos usos:

- **humano:** revisión de PR o de diseño con un criterio que no depende de quién revisa;
- **máquina:** es el juez del loop de `embassy-eval`.

Es la traducción directa de la recomendación #3 de Vercel: convertir *"se siente apretado"* en un
criterio que dos personas cuentan igual.

#### `embassy-eval` — la parte que nadie tiene

7 escenarios fijos con inputs reales, una rúbrica corta, baseline guardado, corridas con y sin
guía, y conteo de fallas por corrida. Escenarios propuestos (uno por arquetipo que realmente
hacemos):

1. Lista/colección con toolbar, filtros y paginación (Gamaforce: vacantes)
2. Dashboard con KPIs y un chart
3. Detalle de entidad con acciones y estados
4. Form de creación con validación
5. Propuesta comercial de una página (artefacto, sin repo)
6. Reporte de proyecto con tabla y datos (artefacto, sin repo)
7. Migración de una pantalla legacy

**Lo importante no es el número, es el hábito:** cada vez que alguien dice "esto no parece de
Amalgama", esa queja se convierte en una falla nombrada, se agrega a `FAILURES.md`, y se arregla en
el punto más angosto — prosa en `design.md`, CSS en el repo, o un check en el script.

---

## 6. El flujo de trabajo

Tres carriles según **qué se está construyendo y con qué acceso**. La pregunta que rutea es una
sola: *¿esto vive en un repo de producto?*

### Carril A — Producto (repo, código que se mantiene)

```
/embassy
  └─ §0 bootstrap: pull del DS + registrar commit
  └─ screen gate (GOAL · OBJECT · ACTIONS · PATTERN · RESPONSIVE · STATES)
  └─ por componente: component-rules/<id>.md → css/components/<id>.css
  └─ build
/embassy-review        → reporte de fallas
node scripts/validate-ds.mjs  +  lint/typecheck/test del proyecto
  └─ screen report (qué se movió, qué variante y por qué)
```

Para un rollout completo sobre un proyecto existente, el agente `design-system-implementer` sigue
siendo la herramienta correcta; `embassy` es para una pantalla.

### Carril B — Artefacto (una sola vez, sin repo)

```
/embassy-artifact
  └─ design.md (juicio + anti-patrones) + PUBLIC-API.md (clases permitidas)
  └─ CSS pineado por CDN — el CSS no se lee nunca
  └─ self-check contra FAILURES.md
```

Propuestas, reportes, one-pagers, demos de cliente, páginas de resultados. Lo puede correr
cualquiera del estudio, sin saber git.

### Carril C — Evolución del DS (los dueños del sistema)

```
/embassy-contribute   → nuevo componente o cambio (CSS + rule + manifest + docs + validate)
/embassy-eval         → corrida sobre los 7 escenarios, con y sin guía
  └─ fallas nuevas → FAILURES.md
  └─ correcciones → al punto más angosto (design.md · CSS · check)
```

### 6.1 Regla de oro para el equipo

> **Si el trabajo va a un repo de producto → `/embassy`. Si es un entregable de una vez →
> `/embassy-artifact`. Si te sale "esto no parece nuestro" → `/embassy-review`, y lo que salga se
> anota.**

---

## 7. Qué medir

Cuatro métricas, todas baratas de sacar:

| Métrica | Cómo se saca | Meta inicial |
|---|---|---|
| **Fallas conocidas por corrida** | `embassy-review` sobre los 7 escenarios | −50% contra baseline (Vercel logró −57%) |
| **Contexto consumido por pantalla** | tokens leídos en una sesión típica | de ~250k potenciales a < 40k |
| **Tiempo hasta primer output on-brand** | cronómetro, escenario 5 | < 10 minutos sin repo |
| **Drift** | diff entre copias de la skill + `validate-ds` | 0 copias divergentes |

La primera es la que importa. Las otras tres son higiene.

---

## 8. Roadmap sugerido

| Semana | Qué | Resultado observable |
|---|---|---|
| 1 | `design.md` + `PUBLIC-API.md` generado + pin de versión del CDN | Cualquiera genera una propuesta on-brand sin clonar nada |
| 1 | `embassy-artifact` | Carril B abierto |
| 2 | `FAILURES.md` + `embassy-review` | Criterio compartido; primer baseline medido |
| 2 | Refactor de `embassy` (router + references) y **borrar la copia duplicada** | Contexto por pantalla < 40k; 0 drift |
| 3 | `embassy-eval` con los 7 escenarios | Primer número con/sin guía |
| 4 | Arreglar los drifts de docs: `CONTRIBUTING.md` (era Tailwind), `AI-USAGE-GUIDE` §5, logos PNG vs SVG | Documentación que no miente |
| 5–6 | P1: `embassy-white-label` y `embassy-contribute` | Template de cliente y contribución con gate |
| 7+ | P1/P2: `embassy-figma`, `embassy-copy`, resto | Dual output del brief cerrado |

---

## 9. Cómo presentarlo al equipo

Sugerencia de guion, 20 minutos:

1. **Abrir con el número de Vercel** (91 → 39 fallas, −57%). Instala la idea de que esto se mide,
   no se opina.
2. **Mostrar el inventario propio** (§2.1). El equipo probablemente no dimensiona lo que ya hay.
3. **Mostrar el problema #1 con el número:** 1 MB de material de lectura obligatoria. Nadie discute
   que eso hay que recortar.
4. **La demo:** una propuesta comercial generada con `/embassy-artifact`, sin repo, en vivo. Es la
   que convierte.
5. **Cerrar con la regla de oro** (§6.1) y una sola pregunta abierta al equipo: *¿cuál es el
   artefacto que más repetimos?* — porque ese es el escenario 1 del eval, y Vercel es explícito en
   que hay que empezar por uno solo.

Lo que **no** conviene abrir en esa reunión: la discusión de si `design.md` va en dominio propio o
en GitHub raw, y la de Figma. Son decisiones de dueño, no de equipo.

---

## 10. Decisiones abiertas

1. **¿URL propia para `design.md`?** (`amalgama.co/design.md` vs raw de GitHub). Impacta si un
   agente externo la puede descubrir sin que se la peguen.
2. **¿Pinear el CDN?** Recomiendo sí, con un tag por release. Hoy un artefacto entregado hace un
   mes cambia solo cuando mergeamos.
3. **¿Repo público o privado?** Hoy `amalgamaco/amalgama-design-system` es clonable sin auth. Si
   `design.md` va a ser público, conviene que sea una decisión explícita y no un accidente.
4. **¿Dónde vive el canónico de la skill?** Propongo: `skills/` en el repo del DS es la fuente, y
   el plugin `design` se sincroniza desde ahí con un check en `validate-ds.mjs`.
5. **¿Quién es el dueño del loop?** El eval solo sirve si alguien corre las rondas. Sin nombre y
   cadencia, esto se muere en la semana 3.

---

## Anexos

- `design.md` — archivo de marca público (borrador listo para revisar)
- `PUBLIC-API.md` — API acotada de clases, generada desde el CSS
- `FAILURES.md` — taxonomía de fallas compartida por `embassy-review` y `embassy-eval`
- `skills/embassy/`, `skills/embassy-artifact/`, `skills/embassy-review/`, `skills/embassy-eval/`
- `scripts/build-public-api.mjs` — genera `PUBLIC-API.md` desde `css/components/*.css`
