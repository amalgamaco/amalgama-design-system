# Plan de uso del Design System de Amalgama

**Para presentar al equipo** · 8 de septiembre de 2026 · Ana Borthagaray
Complementa a `ANALISIS-SKILLS-DS.md` (el diagnóstico). Este documento responde una sola pregunta:
**¿cómo se usa Embassy, en la práctica, desde que arranca un proyecto?**

---

## 0. La idea, en una página

Hoy usar Embassy depende de que la persona sepa que existe, encuentre el repo, lea la documentación
correcta y no se olvide de ninguna regla. Eso funciona con dos o tres personas y se rompe con doce.

La propuesta lo convierte en **un flujo con una puerta de entrada única**:

```
Proyecto nuevo  →  /embassy-start   → te hace 6 preguntas y deja el proyecto configurado
                                       (brand.css + DESIGN.md + preview + CLAUDE.md)
Trabajo diario  →  /embassy          → construir pantallas de producto
                →  /embassy-artifact → entregables de una vez, sin repo
                →  /embassy-review   → auditar lo que salió
Evolución       →  /embassy-eval     → medir si el sistema mejora o empeora
```

Tres ideas que sostienen todo:

1. **Nadie tiene que recordar las reglas.** Las skills las aplican, y el gate de salida las verifica.
2. **El repo del DS es la única fuente de verdad.** Las skills lo leen, nunca lo copian.
3. **Se mide.** Cada cambio en el sistema se compara contra un baseline, no contra una impresión.

---

## 1. El modelo mental: tres capas

La confusión más común es tratar todo como "el design system". Son tres cosas distintas, con dueños
distintos y ritmos de cambio distintos.

| Capa | Qué es | Dónde vive | Quién la cambia | Cada cuánto |
|---|---|---|---|---|
| **1 · El sistema** | Tokens, 62 componentes, 61 reglas operativas, guidelines de UX, governance | `amalgamaco/amalgama-design-system` | Los dueños del DS, vía `CONTRIBUTING` | Semanal |
| **2 · Las skills** | El *cómo se usa*: qué leer, en qué orden, qué está prohibido, cómo se valida | **`amalgamaco/claude-code-plugins`** (repo privado), distribuido como plugin `design` | Los dueños del DS | Con cada cambio del sistema |
| **3 · El proyecto** | La marca del cliente y las decisiones de ese producto | El repo del proyecto: `brand/<cliente>.css` + `DESIGN.md` | El equipo del proyecto | Al arrancar, y poco más |

**La capa 2 vive hoy en un repo distinto al de la capa 1**, y hay que decidirlo explícitamente
(§9.6). El plugin `design` se sincroniza desde `amalgamaco/claude-code-plugins`, **no** desde el repo
del design system. El repo del DS tiene además una carpeta `skills/` con una copia congelada: 341
líneas contra las 455 del plugin instalado. Dos copias, un solo nombre, y **la que la gente usa es la
del plugin**. Mientras siga así, cualquier cambio a la skill hay que hacerlo en el repo de plugins —
el repo del DS no la distribuye.

**La capa 3 nunca modifica la capa 1.** Un proyecto no edita componentes ni roles semánticos: solo
sobreescribe **primitivas** (`--primary-500`, `--radius-md`, `--font-body`). Es lo que ya define
`WHITE-LABEL.md`, y es lo que debería hacer que el dark mode siga funcionando gratis en cada
cliente — hoy no llega del todo, y es el único arreglo bloqueante del plan (§7.0).

---

## 2. Cómo arranca un proyecto nuevo

Cinco pasos. El primero es el único que requiere una conversación.

### Paso 1 · `/embassy-start` — la conversación de setup (15 minutos)

Abrís Claude en la carpeta del proyecto y decís, literalmente:

> *"Necesito arrancar este proyecto con el Design System de Amalgama, white-label para \<cliente\>."*

La skill hace **6 preguntas** (§3), genera los archivos y te muestra el preview del tema con la
marca del cliente aplicada, en light y dark. Si algo no cierra —un contraste que no llega a AA, una
fuente sin licencia— te lo dice ahí, no tres semanas después.

### Paso 2 · Revisión con el equipo de diseño (15 minutos)

Se mira el `theme-preview.html`, no una tabla de hex. Si algo no representa la marca, se ajusta un
valor y se regenera. Este es el momento de discutir, no cuando ya hay 20 pantallas hechas.

### Paso 3 · Kickoff con el cliente

El mismo `theme-preview.html` se le muestra al cliente. Es el entregable más barato y más
convincente del kickoff: su marca, sobre 62 componentes reales, funcionando.

### Paso 4 · Se construyen pantallas con `/embassy`

Ya no hace falta explicar el DS a nadie: el `CLAUDE.md` del proyecto (que generó el paso 1) le dice
al agente qué skill usar y con qué marca.

### Paso 5 · Antes de cada entrega, `/embassy-review`

Un reporte de hallazgos con severidad. Lo que sea BLOQUEANTE o ALTA se arregla antes de mostrar.

> **Total de setup: media hora, una vez.** Después el proyecto no vuelve a pensar en el DS —
> lo usa.

---

## 3. `/embassy-start`: el cuestionario

### 3.1 Las 6 preguntas, en dos rondas

**Ronda A — contexto** (define qué CSS se carga y con qué densidad se trabaja)

| # | Pregunta | Opciones | Qué decide |
|---|---|---|---|
| 1 | ¿Qué tipo de proyecto es? | Producto de cliente (white-label) · Producto interno de Amalgama · Entregable de una vez | Si hay theming o se usa la marca Amalgama. La tercera opción deriva a `/embassy-artifact` y termina acá |
| 2 | ¿Stack y superficie? | Buildless (HTML+CSS+JS) · React / Next · Proyecto existente con capa de tokens propia · — y: app con shell (sidebar+topbar) · sitio/landing · dashboard embebido | Qué archivos CSS se linkean, si se usan los wrappers `.tsx`, y si hay que respetar nombres de tokens que ya existen |
| 3 | ¿Audiencia y densidad? | Herramienta interna densa · Producto consumer · Mixto — y el idioma de la UI | Tamaños por defecto, targets táctiles, estrategia de tema y voz del copy |

**Ronda B — marca** (solo si la 1 fue white-label)

| # | Pregunta | Formato | Qué decide |
|---|---|---|---|
| 4 | ¿Cuál es el color primario de la marca? ¿Y el de acento? | **Un hex de cada uno alcanza** | La skill genera las 10 tintas de cada paleta y verifica contraste AA en light y dark. Si no hay marca definida todavía: se queda Embassy y se marca como pendiente en `DESIGN.md` |
| 5 | ¿Qué personalidad de forma? | Redondeada · Balanceada (default Embassy) · Técnica | Los 4 tokens de radio. Según `WHITE-LABEL.md` §2.3 es **el cambio más impactante** para que se sienta de otra marca, y son 4 líneas |
| 6 | ¿Tipografía y grises? | Embassy default (Inter / Epilogue / DM Mono) · El cliente tiene fuentes **con licencia y forma de cargarlas** · Hay que proponer — y: grises de Embassy · el cliente mandó cálidos o fríos | `--font-heading` / `--font-body` y, si aplica, la escala neutral |

### 3.2 Lo que NO se pregunta, y por qué

Esto importa tanto como lo anterior: cada pregunta de más es una decisión que alguien puede tomar mal.

| No se pregunta | Por qué |
|---|---|
| *"¿Cuántos usuarios tiene el negocio?"* | No cambia ningún token. Lo que sí importa —densidad, targets, tono— ya lo captura la pregunta 3 |
| *"¿Querés light y dark mode?"* | El dark ya viene automático y sin costo. Preguntarlo sugiere que es opcional y habilita a que alguien lo rompa con overrides |
| *"¿Qué tamaños de tipografía?"* | La escala está validada y se mantiene estable entre clientes (`WHITE-LABEL.md` §2.4). No se overridea |
| *"¿Qué componentes querés?"* | Están los 62. No se elige un subconjunto: se usa el que corresponde a cada caso |
| *"¿Qué radio para las píldoras?"* | `--radius-full` nunca se overridea — chips, badges y avatares se mantienen circulares en toda marca |
| *"¿Colores de estado?"* | Verde/rojo/amarillo/azul casi nunca cambian. Solo se pregunta si el cliente los tiene mandados por normativa o accesibilidad |

### 3.3 Qué queda en el proyecto al terminar

Cinco archivos. Ninguno toca el repo del DS.

| Archivo | Qué es |
|---|---|
| `brand/<cliente>.css` | Solo primitivas, generado por `build-brand-theme.mjs` desde un hex por paleta. Se carga **después** de `variables.css` y **antes** de `base.css` |
| `DESIGN.md` | El contrato local del proyecto: qué marca, qué densidad, qué idioma, qué se decidió y **qué quedó pendiente**. Es el equivalente de proyecto del `design.md` de Amalgama |
| El layout base | `index.html` o el shell de React, con los links en el orden correcto según el stack |
| `theme-preview.html` | Todos los componentes con la marca del cliente, light y dark. **Este es el "artifact" del flujo** |
| Un bloque para el `CLAUDE.md` del proyecto | Le dice al agente qué skill usar, con qué marca y qué está prohibido. Es lo que hace que el proyecto "se acuerde" del DS sin que nadie lo repita |

Más un **reporte de verificación**: contrastes AA en ambos temas, fuentes que faltan licenciar,
decisiones que quedaron abiertas.

---

## 4. El día a día: qué skill en qué momento

La pregunta que rutea es siempre la misma: **¿esto vive en un repo de producto?**

| Momento | Skill | Quién | Necesita el repo del DS |
|---|---|---|---|
| Arrancar un proyecto | `/embassy-start` | Diseño + Dev | Sí (lo clona solo) |
| Construir o rediseñar una pantalla | `/embassy` | Diseño + Dev | Sí |
| Propuesta, reporte, one-pager, demo | `/embassy-artifact` | **Todo el estudio** | No |
| Auditar antes de entregar o mergear | `/embassy-review` | Diseño + Dev + QA | Sí, o parcial |
| Medir si el sistema mejora | `/embassy-eval` | Dueños del DS | Sí |
| Agregar o cambiar un componente | `/embassy-contribute` *(pendiente)* | Dueños del DS | Sí |

**La regla de oro, para el equipo:**

> Si va a un repo de producto → `/embassy`. Si es un entregable de una vez → `/embassy-artifact`.
> Si te sale *"esto no parece nuestro"* → `/embassy-review`, y lo que salga se anota.

Y una diferencia que conviene explicar bien porque es contraintuitiva:

- **`/embassy` sí lee el detalle** del componente que estás usando — su regla, su CSS, sus estados.
  Puede, porque tiene el repo, y le sirve: ahí está el `not_to_confuse_with` que evita elegir mal.
- **`/embassy-artifact` tiene prohibido leer el CSS.** Trabaja con una lista acotada de 435 clases.
  Es lo que le permite funcionar en cualquier herramienta, sin repo y sin gastar el contexto entero.

---

## 5. ¿Las skills están conectadas al Design System?

Sí, en tres puntos concretos. Vale la pena decirlos porque es lo que las diferencia de "un prompt
bien escrito".

**1 · Viven en el repo del DS.** `skills/` es parte del sistema, no un accesorio. Si cambia un
componente, la skill que lo enseña cambia en el mismo commit y en el mismo PR.

**2 · Leen el repo en runtime, no copian.** Cada sesión hace `git pull` y **registra el commit
usado** como parte del entregable. Eso significa que una pantalla hecha hace un mes se puede
reproducir, y que una skill nunca queda enseñando una variante que ya no existe.

**3 · El gate de salida corre los scripts del propio DS.** `validate-ds.mjs` para el sistema,
`check-output.mjs` para lo generado. No es "el agente cree que está bien": es un script que sale con
código 1 si hay algo bloqueante.

**El contraejemplo está pasando hoy:** hay dos copias del `SKILL.md` que ya divergieron, y el
`AI-USAGE-GUIDE` manda a usar una skill que no existe en el plugin. Cuando la skill no está
conectada al sistema, se pudre sola. Por eso la conexión no es un detalle de implementación — es la
razón de que el modelo funcione.

---

## 6. Qué tomamos de Vercel y qué no

**Tomamos:**

| Idea de Vercel | Cómo la aplicamos |
|---|---|
| Un archivo de juicio en una URL pública | `design.md` en la raíz del repo — cualquier agente, en cualquier herramienta, sin clonar |
| Un stylesheet público con API acotada | `PUBLIC-API.md`: 435 clases publicadas de 548 selectores, generadas por script |
| *"Nunca inspecciones el CSS"* | Regla dura de `/embassy-artifact`. Sin eso, 268 KB de CSS se comen la sesión |
| Escenarios fijos + baseline guardado | `/embassy-eval`, con 7 escenarios que **no se tocan** mientras la guía evoluciona |
| Corregir en el punto más angosto | Prosa, CSS o check — nunca los tres. Está en `FAILURES.md` |
| Nombrar los anti-patrones | `design.md` §8: 16 reflejos de diseño generado que se rechazan por nombre |

**Ajustamos una cosa:** Vercel no tiene `component-rules`. Nosotros sí, y son nuestro mejor activo.
Por eso en el carril producto **sí** leemos el detalle del componente — pero solo el que estamos
usando, no el catálogo.

**Y hay un aprendizaje suyo que aplica directo a este plan:** *"empezá chico, con un artefacto
repetido"*. Si el DS se va a usar como template de proyectos nuevos, **el propio setup es ese
artefacto repetido** — y por lo tanto debería ser el escenario 1 del eval, no una lista de vacantes.
Cada vez que alguien arranca un proyecto, es una corrida gratis del sistema.

Su número, para contexto: sobre las mismas fallas conocidas, **91 sin la guía contra 39 con la
guía — 57% menos**.

---

## 7. Qué hay que construir para que esto exista

### 7.0 ~~Antes que nada~~ · RESUELTO (8-sep-2026): el theming de marca ya llega a dark mode

Escribiendo este plan probé el flujo contra el repo real y apareció algo que había que arreglar
**antes** de correr `/embassy-start` con un cliente. **Ya está arreglado en el repo** — dejo el
diagnóstico porque explica por qué hacía falta y qué se verificó.

El bloque `[data-theme="dark"]` de `css/variables.css` **hardcodea en hex** los roles que llevan
marca, en vez de consumir `var(--primitiva)`: 103 valores hex contra 13 referencias a primitivas.
Resultado: un tema de cliente funciona en light y **el tema oscuro sigue mostrando el azul y el
navy de Embassy**.

Lo verifiqué en un browser real, overrideando las primitivas de una marca naranja:

| Rol | Light (con la marca aplicada) | Dark |
|---|---|---|
| `--color-primary` | `#7A2E00` ✓ marca | `#FFFFFF` (correcto, es blanco a propósito) |
| `--color-primary-container` | `#D7DEFB` ✗ Embassy | `#475993` ✗ Embassy |
| `--color-secondary-container` | `#FFD5B0` ✓ marca | `#3A5BB0` ✗ Embassy |

Y hay un segundo detalle: la plantilla de `WHITE-LABEL.md` §3 **no incluye `--primary-60`**, que es
justamente lo que alimenta `--color-primary-container` en light. Por eso ese rol queda con el
periwinkle de Embassy aun en light, como se ve arriba.

Además, `WHITE-LABEL.md` §4.2 afirma que *"Primary color adapts (light mode: `--primary-500` base;
dark mode: auto-lightens to `--primary-200`)"*. Con los hex hardcodeados, eso hoy no es cierto.

**Lo que se hizo:**

1. En el bloque `[data-theme="dark"]` de `variables.css`, **25 roles** de las familias
   primary / secondary / tertiary / error / success / warning / info pasaron de hex literal a
   `var(--primitiva)`. Cada reemplazo se validó contra el valor real de la primitiva antes de
   aplicarlo. Los tokens derivados de la rampa neutral **siguen literales a propósito**, por la
   misma razón ya documentada en el bloque `[data-theme="light"]` (el shell de la doc reasigna esos
   primitivos y produce resolución cruzada).
2. `WHITE-LABEL.md`: se agregaron `--primary-60` / `--primary-75` y `--secondary-925` / `--secondary-950`
   a la plantilla, con una tabla de **qué step consume cada rol** en light y en dark — porque el doc
   decía que la marca va en el `500` y en realidad `--color-primary` es el `900`.
3. `WHITE-LABEL.md` §4.2: la afirmación falsa se reemplazó por el chequeo real de propagación.

**Verificación en Chromium, antes y después:**

- Sin tema de marca, los valores computados de Embassy son **idénticos** en light y en dark
  (33 roles comparados, 0 diferencias). No hay regresión visual.
- Con un tema de marca cargado, los roles de dark que responden al override pasaron de
  **0 a 10**.

Es la respuesta concreta a *"¿hay que ajustar el DS?"*: era esto, y ya está hecho.

### 7.1 El resto

Nada de esto es grande. Ordenado por dependencia:

| # | Qué | Depende de | Esfuerzo |
|---|---|---|---|
| 0 | ~~Los tres arreglos de §7.0~~ | — | **Hecho** (8-sep-2026), verificado sin regresión |
| 1 | ~~`design.md` + `PUBLIC-API.md` en la raíz del repo~~, y pinear el CDN a un tag | — | **Movidos** (8-sep-2026): `design.md`, `PUBLIC-API.md`, `public-api.json`, `FAILURES.md` y los dos scripts ya están en su lugar definitivo. Falta decidir el tag del CDN |
| 2 | `/embassy-artifact` | 1 | Ya está escrita |
| 3 | `/embassy-start` + `build-brand-theme.mjs` | 0, 1 | **Ya están escritos y probados** — falta la plantilla del `theme-preview.html` |
| 4 | `FAILURES.md` + `/embassy-review` | — | Ya están escritas |
| 5 | Resolver el drift: una sola copia del `SKILL.md`, con un check en `validate-ds.mjs` | — | Media jornada |
| 6 | `/embassy-eval` con el escenario "setup de proyecto nuevo" | 3, 4 | La skill está escrita; falta correr el primer baseline |
| 7 | Arreglar los docs que mienten (`CONTRIBUTING.md` Tailwind, `AI-USAGE-GUIDE` §5, logos PNG vs SVG) | — | Media jornada |

Lo único que falta escribir de verdad es **la plantilla del `theme-preview.html`** y **el primer
baseline del eval**. Todo lo demás es mover archivos y tomar dos decisiones.

---

## 8. Cómo presentarlo al equipo (20 minutos)

1. **Abrí con el problema, no con la solución** (2 min): hoy usar bien el DS depende de que la
   persona se acuerde de 40 reglas. Mostrá los dos `SKILL.md` divergentes como síntoma.
2. **Las tres capas** (3 min) — §1. Es el concepto que tienen que llevarse; todo lo demás cuelga
   de ahí.
3. **La demo** (8 min): corré `/embassy-start` en vivo sobre un proyecto vacío con un cliente
   inventado. Seis preguntas, y al final el `theme-preview.html` con su marca. **Esta es la parte
   que convence** — no la expliques antes, mostrala.
4. **La regla de oro** (2 min) — §4. Una sola línea que todos tienen que recordar.
5. **El número de Vercel** (2 min): 91 → 39. Instala que esto se mide, no se opina.
6. **Las decisiones abiertas** (3 min) — §9. Cerrá pidiendo respuestas, no aplausos.

Lo que **no** conviene abrir en esa reunión: si `design.md` va en dominio propio o en GitHub raw, y
todo el tema Figma. Son decisiones de dueño, no de equipo.

---

## 9. Las decisiones que necesito del equipo

Seis, y todas son cortas:

1. **¿Quién es el dueño del loop?** El eval solo sirve si alguien corre las rondas con una cadencia.
   Sin nombre, esto se muere en la semana tres.
2. **¿Cuál es el entregable que más repetimos?** Es el escenario 1 del eval. Mi apuesta es el setup
   de proyecto nuevo, pero lo tienen que confirmar ellos.
3. **¿El repo del DS queda público?** Hoy se clona sin auth. Si `design.md` va a ser público,
   conviene que sea una decisión y no un accidente.
4. **¿Pinear el CDN?** Recomiendo sí, con un tag por release. Hoy un artefacto entregado hace un mes
   cambia solo cuando mergeamos.
5. **¿`/embassy-start` es obligatorio en el kickoff?** O sea: ¿un proyecto puede arrancar sin correrlo?
   Mi opinión es que no debería, y que el `DESIGN.md` que genera sea parte de la Definition of Ready
   del proyecto.
6. **¿Dónde vive el canónico de las skills?** Hoy hay dos copias en dos repos: `skills/` en el repo
   del DS (congelada, 341 líneas) y el plugin `design`, que sincroniza desde
   `amalgamaco/claude-code-plugins` (455 líneas, la que la gente usa). Hay que elegir una y borrar la
   otra. **Recomiendo que el canónico sea el repo de plugins** y que `skills/` del DS se elimine: es
   más simple y es como funciona la distribución hoy. El acoplamiento skill↔componente se resuelve
   haciendo que la skill **apunte** a `component-rules/` en vez de repetirlo, que es como está
   escrita. El único archivo que todavía repite contenido del repo es `references/decisiones.md`, y
   por eso es el candidato a llevar un check o a desaparecer.

---

## Anexo — archivos de esta propuesta

Los cinco `SKILL.md` en `_propuesta-capa-ai/skills/` del repo del DS; `design.md`, `PUBLIC-API.md`,
`public-api.json` y `FAILURES.md` ya viven en la raíz del repo, que es de donde los leen las skills.

| Archivo | Estado |
|---|---|
| `ANALISIS-SKILLS-DS.md` | El diagnóstico que originó este plan |
| `PLAN-USO-DS.md` | Este documento |
| `design.md` · `PUBLIC-API.md` · `FAILURES.md` | Listos para mover a la raíz |
| `skills/embassy-start/` | La skill del §3 |
| `skills/embassy/` · `embassy-artifact/` · `embassy-review/` · `embassy-eval/` | Las cuatro P0 |
| `scripts/build-public-api.mjs` · `check-output.mjs` · `build-brand-theme.mjs` | Probados contra el repo real |
