---
name: embassy
description: >-
  Diseñá, rediseñá o migrá pantallas de producto con el design system de Amalgama (Embassy).
  Decide primero QUÉ ES la pantalla —objetivo, jerarquía, arquitectura de información, estados— y
  recién después la construye con tokens y componentes reales leídos del repo. Usala cuando el
  trabajo va a un repo de producto: "armá la vista de vacantes", "mejorá esta pantalla", "esta
  pantalla no se entiende", "está sobrecargada", "rediseñá este listado", "migrá esto a Embassy",
  "aplicá el design system acá", o cuando alguien nombra un componente en contexto Amalgama.
  Para un entregable de una sola vez sin repo usá `embassy-artifact`; para solo auditar sin
  cambiar nada, `embassy-review`. Nunca hardcodees colores ni fuentes de memoria, nunca aproximes
  un componente que existe, y nunca entregues una pantalla en la que solo cambiaste componentes.
detail: >-
  Diagnostica la pantalla contra heurísticas de industria, decide los movimientos, y recién
  entonces construye en Embassy. El diagnóstico es un entregable, no un paso mental.
output: Diagnóstico de pantalla (síntoma → ley → movimiento), la pantalla construida, y el reporte de cambios.
format: Código · lee el repo en cada sesión
examples: |-
  mejorá esta pantalla
  armá la vista de vacantes
  esta pantalla está sobrecargada, rediseñala
---

# Embassy — diseñar pantallas con el design system de Amalgama

El design system se llama **Embassy** y vive en `amalgamaco/amalgama-design-system`.
**El repo es la única fuente de verdad; esta skill no lo copia, lo consulta.**

> **La falla número uno de esta skill es entregar la misma pantalla con componentes de Embassy.**
> Cambiar `<div>` por `.card` y `<input>` por `.search-field` no es rediseñar: es re-skinear. Si al
> terminar no moviste, uniste, dividiste, sacaste ni resecuenciaste **nada**, o la pantalla ya
> estaba bien —y entonces tenés que poder defenderlo dimensión por dimensión— o no hiciste el
> diagnóstico.

---

## Paso 0 — ¿Es esta la skill?

| Situación | Skill |
|---|---|
| Pantalla de producto, en un repo que se mantiene | **esta** |
| Entregable de una vez sin repo (propuesta, reporte, one-pager) | `embassy-artifact` |
| Solo decir qué está mal, sin tocar nada | `embassy-review` |
| Configurar el DS en un proyecto nuevo | `embassy-start` |
| Agregar o cambiar un componente del DS | `embassy-contribute` |
| Rollout completo sobre un proyecto entero | el agente `design-system-implementer` |

---

## Paso 1 — Bootstrap (una vez por sesión)

```bash
if [ -d "/tmp/amalgama-ds/.git" ]; then cd /tmp/amalgama-ds && git pull --ff-only
elif [ -d "$HOME/Documents/Claude/Projects/Design System Amalgama" ]; then
  ln -sfn "$HOME/Documents/Claude/Projects/Design System Amalgama" /tmp/amalgama-ds
else git clone --depth 1 https://github.com/amalgamaco/amalgama-design-system /tmp/amalgama-ds; fi
cd /tmp/amalgama-ds && git rev-parse --short HEAD && git status --short
```

Registrá el commit: es parte del entregable. Si el proyecto destino ya tiene su propia capa de
tokens (`--color-bg-*`, `--color-interactive-*`), usá **esos** nombres y no agregues un puente de
alias: rompe el dark mode y esconde el drift.

---

## Paso 2 — Diagnóstico. **Este es el entregable, no un paso mental.**

Antes de tocar una línea de markup. En modo *mejorar* o *migrar*, **se muestra y se confirma con la
persona antes de construir**; en modo *crear*, se escribe igual y se entrega junto con la pantalla.

Lectura obligatoria de este paso —son cortos y terminan en checklist:

```bash
cat /tmp/amalgama-ds/guidelines/ux-laws-and-heuristics.md   # Nielsen 10 + Hick, Fitts, Miller…
cat /tmp/amalgama-ds/guidelines/information-architecture.md
cat /tmp/amalgama-ds/guidelines/visual-hierarchy.md
cat /tmp/amalgama-ds/guidelines/feedback-and-states.md
```

### 2a · Las seis líneas de encuadre

```
OBJETIVO    usuario: <verbo + objeto, en sus palabras>   negocio: <qué vuelve más probable>
OBJETO      primario: <una sola entidad>                 niveles: <clave → soporte → bajo demanda>
ACCIONES    primaria: <una sola>                         secundarias: <cuáles y dónde>
PATRÓN      arquetipo: <id de screen-patterns §2>        componentes clave: <ids + variante>
RESPONSIVE  desktop: <estructura>                        mobile: <la transformación, no un encogimiento>
ESTADOS     vacío / cargando / error / éxito / deshabilitado / sin permiso: <componente de cada uno>
```

Si no podés llenar una línea, estás adivinando. Preguntá antes de construir.

### 2b · Diagnóstico contra heurísticas de industria

Recorré **las diez preguntas**. Por cada problema, escribí **síntoma → ley que rompe → movimiento**.
Las leyes están desarrolladas en `guidelines/ux-laws-and-heuristics.md`; acá está la pregunta que
dispara cada una.

| # | Pregunta | Ley / heurística |
|---|---|---|
| 1 | ¿Se entiende en tres segundos de qué es esta pantalla y cuál es la acción principal? | Jerarquía visual · Von Restorff |
| 2 | ¿Cuántas opciones enfrenta la persona en el primer golpe de vista? ¿Se pueden agrupar o esconder? | **Hick** · Progressive Disclosure |
| 3 | ¿Hay más de 7±2 elementos sueltos sin agrupar en una región? | **Miller** · chunking (IA) |
| 4 | ¿Los objetivos frecuentes están grandes y cerca; los destructivos, lejos? | **Fitts** |
| 5 | ¿El sistema dice en qué estado está — cargando, cuántos resultados, qué filtro aplica? | Nielsen 1 · visibilidad del estado |
| 6 | ¿El vocabulario es el del usuario o el de la base de datos? | Nielsen 2 · match con el mundo real |
| 7 | ¿Se puede deshacer, cancelar, volver? ¿Lo destructivo pide confirmación? | Nielsen 3 y 5 |
| 8 | ¿La persona tiene que recordar algo de otra pantalla para usar esta? | Nielsen 6 · reconocer > recordar |
| 9 | ¿Qué se puede sacar sin perder significado? | Nielsen 8 · diseño minimalista |
| 10 | ¿Los errores dicen qué pasó y cómo salir, en lenguaje humano? | Nielsen 9 |

Y las **cinco leyes de layout** que en la práctica son las que más se saltean:

1. **Una sola columna de contenido, con ancho deliberado.** Título, acciones, toolbar, filtros,
   resultados, contador y paginación comparten bordes izquierdo y derecho. Ancho por contenido:
   ~1120–1200px lista/tabla/dashboard · ~760–800px lectura/detalle · ~640–680px formulario o auth.
   Nada se centra ni se dimensiona por su cuenta.
2. **Un solo sistema por eje.** Clasificá cada control como *filtro* (refina acá) / *navegación*
   (lleva a otra vista) / *categorización* (etiqueta) / *contenido*. Un concepto se expresa una vez:
   si hay chips **y** carpetas para el mismo conjunto, sobra uno.
3. **Adyacencia de acciones.** Un solo relleno por grupo; el vecino de menor prioridad va outline.
4. **Búsqueda por contexto.** Filtra una lista de esta pantalla → `.search-field` en el toolbar,
   `flex:1`. Global, hero, comando o mobile → `.search-bar`.
5. **Secuencia canónica:** encabezado + acción → toolbar (búsqueda, filtros, estado de resultados)
   → navegación contextual opcional → resultados → paginación.

### 2c · Los movimientos

Cada problema tiene que terminar en **un verbo**, no en un componente:

`RESECUENCIAR` · `INTRODUCIR-JERARQUÍA` · `AGRUPAR` · `UNIFICAR` · `DIVIDIR` · `MOVER` ·
`REEMPLAZAR` · `ELIMINAR` · `REVELAR-PROGRESIVAMENTE` · `ALINEAR` · `AGREGAR-ESTADO`

**Rediseñar es reorganizar, no preservar.** Podés mover, unir, dividir, reemplazar o eliminar. Las
reglas del DS y de UX ganan sobre la fidelidad al layout existente: nunca conserves una estructura
débil solo porque ya está.

**Si la lista de movimientos queda vacía**, la pantalla ya estaba bien — y entonces el diagnóstico
tiene que decir, dimensión por dimensión, por qué. Una lista vacía sin esa defensa significa que el
paso 2b no se hizo.

### Formato del diagnóstico

```
DIAGNÓSTICO — <pantalla>

Encuadre
  <las seis líneas de 2a>

Problemas detectados
  1. <síntoma observable>
     Ley:        <cuál rompe>
     Movimiento: <VERBO> — <qué se hace concretamente>
  2. …

Ya estaba bien
  <lo que se conserva y por qué — que no parezca que no se miró>
```

El arquetipo de pantalla y la matriz de estados salen de `references/screen-patterns.md`
(list-collection, dashboard, entity-detail, create-edit-form, wizard, settings, pipeline-board,
search-results, auth-entry, feed-activity, onboarding-first-run, confirmation-destructive).

---

## Paso 3 — Recién ahora, los componentes

Por cada elemento, en este orden:

1. `component-rules/<id>.md` — confirmá que es el componente correcto (`when_to_use`,
   `when_not_to_use`, `not_to_confuse_with`), elegí la **variante por propósito** y el tamaño por densidad.
2. `css/components/<id>.css` — citá las clases exactas del bloque `Uso:` y los tokens exactos.
   Si no podés citarlos, no lo leíste.
3. `components/ui/<id>.tsx` — solo si el proyecto es React y el wrapper existe.
4. Los bloques `accessibility` / `keyboard` / `motion` de la regla.

**Gate por componente:** una línea con *qué componente + variante y por qué*
(ej.: *"`search-field`, no `search-bar`, porque encabeza una lista de escritorio"*).

**Abrí solo los archivos del componente que estás usando.** El corpus completo son ~250k tokens.
Los pares que más se confunden están resueltos en **`references/decisiones.md`** — es el atajo, no
la fuente: ante cualquier duda gana `component-rules/<id>.md`.

La **capa de marca** —logo, voz, estrategia de tema— está en **`design.md`** de la raíz
(§1 contexto y voz · §6.6 logo · §6.7 tema), el mismo archivo que consume `embassy-artifact`.

---

## Paso 4 — Reglas duras (son rechazos, no preferencias)

- Sin hex crudo ni px suelto donde hay token. El único cálculo permitido es `color-mix()` sobre roles.
- Sin primitivas (`--primary-900`, `--neutral-100`) en código de producto.
- Sin overrides por tema. El dark es automático con `data-theme="dark"`.
- Un solo `btn-primary` por contexto. Nunca full-width, ni alineado a la izquierda, ni píldora.
- Sin inventar ni aproximar un componente que ya existe: componé, o **pará y marcá el gap**.
- Motion desde el bloque `motion:` de la regla + `--duration-*` / `--ease-*`. Nunca `cubic-bezier()`
  a mano, nunca anular `prefers-reduced-motion`.
- Íconos Lucide. Solo-ícono con `aria-label`. Targets ≥44px en punteros gruesos.
- Texto de página en navy (`--text-primary`), no negro.

---

## Paso 5 — Gate de salida

```bash
cd /tmp/amalgama-ds && node scripts/validate-ds.mjs
# y los gates del proyecto: lint, typecheck, build, test
```

**`validate-ds.mjs` solo mide tokens y clases.** Una pantalla puede pasarlo entera y seguir siendo
un re-skin. Por eso el gate real son las dos cosas siguientes.

**Reporte de cambios** (obligatorio, cierra el diagnóstico del paso 2):

1. Movimientos aplicados — la lista `antes → después`, un verbo y una razón por línea.
2. Componentes y variantes elegidos, y por qué cada uno.
3. Diferencias desktop vs mobile: la transformación, no el resize.
4. Estados implementados.
5. La ley o regla detrás de cada decisión no trivial.

Pasalo por el chequeo del diagnóstico, que es el que un re-skin no pasa:

```bash
node /tmp/amalgama-ds/scripts/check-screen-report.mjs diagnostico.md
```

Falla si el encuadre está incompleto, si hay problemas listados sin la ley que rompen, o si la
lista de movimientos está vacía sin la defensa de por qué la estructura ya estaba bien.

**Y después `embassy-review`** sobre lo que produjiste. Cualquier BLOQUEANTE o ALTA se arregla antes
de mostrar.

---

## Checklist

- [ ] Repo pulleado, commit registrado
- [ ] Las cuatro guías del paso 2 leídas en esta sesión
- [ ] Seis líneas de encuadre completas
- [ ] Las diez preguntas de 2b recorridas, cada problema con su ley
- [ ] Las cinco leyes de layout verificadas
- [ ] Lista de movimientos escrita — o la defensa de por qué no hay ninguno
- [ ] En modo mejorar/migrar: el diagnóstico se mostró **antes** de construir
- [ ] Por componente: regla → CSS → wrapper → a11y/motion, con su "por qué esta variante"
- [ ] Mobile es la transformación correcta, no un encogimiento
- [ ] Estados vacío / cargando / error / éxito / deshabilitado / sin permiso implementados
- [ ] Cero hex, primitivas, overrides por tema o clases inventadas
- [ ] `validate-ds.mjs` limpio + gates del proyecto
- [ ] `check-screen-report.mjs` en verde sobre el diagnóstico
- [ ] Reporte de cambios emitido
- [ ] `embassy-review` sin BLOQUEANTES ni ALTAS
- [ ] Renderizado en light y dark
