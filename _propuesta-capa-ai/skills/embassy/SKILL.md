---
name: embassy
description: >-
  Construí, mejorá o migrá pantallas de producto con el design system de Amalgama (Embassy) —
  tokens, clases y wrappers leídos del repo en cada sesión. Usala cuando el trabajo va a un repo
  de producto y hay que elegir componentes reales: "aplicá el design system acá", "migrá esta
  pantalla a Embassy", "armá el dashboard de vacantes", "revisá si esta pantalla respeta el DS",
  o cualquier nombre de componente en contexto Amalgama (chip, toolbar, select, combobox, dialog,
  calendar, kanban…). Para un artefacto de una sola vez sin repo — propuesta, reporte, one-pager,
  demo — usá `embassy-artifact` en su lugar. Nunca hardcodees colores ni fuentes de memoria y
  nunca aproximes un componente que existe en el repo.
detail: >-
  Router del design system. Decide el modo, hace el bootstrap del repo, aplica el screen gate y
  abre solo los archivos del componente que se está usando.
output: Pantalla construida con tokens y componentes reales, más el screen report y el gate de validación.
format: Código · lee el repo en cada sesión
examples: |-
  aplicá el design system acá
  migrá esta pantalla a Embassy
  armá la vista de vacantes
---

# Embassy — router del design system de Amalgama

El design system se llama **Embassy**. Vive en `amalgamaco/amalgama-design-system`.
**El repo es la única fuente de verdad; esta skill no lo copia, lo consulta.**

Trabajar de memoria produce output incorrecto, no un atajo. Los tokens, las variantes y el catálogo
cambian; tu recuerdo está desactualizado por definición.

---

## Paso 0 — ¿Es esta la skill?

| Situación | Skill |
|---|---|
| El trabajo va a un repo de producto que se mantiene | **esta** |
| Artefacto de una vez, sin repo (propuesta, reporte, one-pager, demo) | `embassy-artifact` |
| Solo auditar algo que ya existe y listar qué está mal | `embassy-review` |
| Agregar o cambiar un componente del DS | `embassy-contribute` |
| Rollout completo del DS sobre un proyecto entero | el agente `design-system-implementer` |

Si el usuario no tiene el repo y no lo puede clonar → `embassy-artifact`. No sigas acá.

---

## Paso 1 — Bootstrap (una sola vez por sesión)

```bash
if [ -d "/tmp/amalgama-ds/.git" ]; then cd /tmp/amalgama-ds && git pull --ff-only
elif [ -d "$HOME/Documents/Claude/Projects/Design System Amalgama" ]; then
  ln -sfn "$HOME/Documents/Claude/Projects/Design System Amalgama" /tmp/amalgama-ds
else git clone --depth 1 https://github.com/amalgamaco/amalgama-design-system /tmp/amalgama-ds; fi
cd /tmp/amalgama-ds && git rev-parse --short HEAD && git status --short
```

**Registrá el commit** — es parte del entregable. Si el working tree tiene cambios sin commitear,
anotalo: puede haber componentes que solo existen ahí. **Nunca commitees ni toques trabajo sin
commitear del repo del DS** salvo pedido explícito.

Detectá qué capa de tokens tiene el proyecto destino:

```bash
grep -rEl "\-\-color-(primary|surface|interactive|bg)|\-\-text-primary" --include="*.css" . | head
```

- **Sin capa propia** → consumí los roles `--color-*` de Embassy directo.
- **Con capa semántica propia** → usá **los nombres del proyecto**. No agregues un puente de alias:
  rompe el dark mode y esconde el drift. Marcalo como divergencia, pero no lo arranques a mitad de tarea.

---

## Paso 2 — Screen gate (antes de cualquier markup)

Escribí estas seis líneas. Si no podés llenar una, estás adivinando: volvé al paso que falta.

```
OBJETIVO    usuario: <verbo + objeto>      negocio: <qué vuelve más probable>
OBJETO      primario: <una entidad>        niveles: <clave → soporte → bajo demanda>
ACCIONES    primaria: <un solo btn-primary>  secundarias: <cuáles y dónde>
PATRÓN      arquetipo: <id>                componentes clave: <ids + variante>
RESPONSIVE  desktop: <estructura>          mobile: <la transformación, no un encogimiento>
ESTADOS     vacío / cargando / error / éxito / deshabilitado / sin permiso: <componente de cada uno>
```

El arquetipo sale de `references/screen-patterns.md` §2 (list-collection, dashboard, entity-detail,
create-edit-form, wizard, settings, pipeline-board, search-results, auth-entry, feed-activity,
onboarding-first-run, confirmation-destructive). El arquetipo te entrega el esqueleto de IA, la
receta de componentes, los estados obligatorios y los anti-patrones.

Para profundidad de UX: `guidelines/README.md` del repo y de ahí a la guía del patrón.

**Las cinco leyes de layout que más se saltean** — verificá las cinco, siempre:

1. **Una sola columna de contenido, con ancho deliberado.** Todas las regiones alineadas a sus
   bordes: título, acciones, toolbar, filtros, resultados, contador, paginación. Ancho por
   contenido: ~1120–1200px lista/tabla/dashboard · ~760–800px lectura/detalle · ~640–680px
   formulario o auth. Nada se centra ni se dimensiona por su cuenta.
2. **Un solo sistema por eje.** Clasificá cada control como *filtro* (refina acá) / *navegación*
   (lleva a otra vista) / *categorización* (etiqueta) / *contenido*. Un concepto se expresa una vez.
3. **Adyacencia de acciones.** Un solo relleno por grupo; el vecino de menor prioridad va outline.
4. **Búsqueda por contexto.** Filtra una lista de esta pantalla → `.search-field` en el toolbar,
   `flex:1`. Global / hero / comando / mobile → `.search-bar`.
5. **Secuencia canónica:** encabezado + acción → toolbar (búsqueda, filtros, estado) → navegación
   contextual opcional → resultados → paginación.

---

## Paso 3 — Por cada componente, en este orden

1. `component-rules/<id>.md` — confirmá que es el componente correcto (`when_to_use`,
   `when_not_to_use`, `not_to_confuse_with`), elegí la **variante por propósito** y el tamaño por densidad.
2. `css/components/<id>.css` — citá las clases exactas del bloque `Uso:` y los tokens exactos.
   Si no podés citarlos, no lo leíste.
3. `components/ui/<id>.tsx` — solo si el proyecto es React y el wrapper existe. El CSS es canónico;
   el wrapper es conveniencia tipada. Si no hay wrapper, escribí el markup con las clases.
4. Los bloques `accessibility` / `keyboard` / `motion` de la regla.

**Gate por componente:** una línea diciendo *qué componente + variante y por qué*
(ej.: *"`search-field`, no `search-bar`, porque encabeza una lista de escritorio"*). Si no podés
escribirla, elegiste de memoria — volvé al punto 1.

**Abrí solo los archivos del componente que estás usando.** El corpus completo son ~250k tokens; no
entra y no hace falta.

```bash
# catálogo: id → ruta c-<id>
python3 -c "import json;[print(c['id'],'—',c['summary'][:66]) for c in json.load(open('/tmp/amalgama-ds/component-rules/manifest.json'))['components']]"
```

Los que más se confunden (buttons, search, select/menu/combobox/command, overlays, calendar,
loading, toolbar) están resueltos en **`references/decisiones.md`**. La capa de marca —logo, voz,
estrategia de tema— está en **`references/marca.md`** (no está en el repo).

---

## Paso 4 — Reglas duras (son rechazos, no preferencias)

- Sin hex crudo ni px suelto donde hay token. El único cálculo permitido es `color-mix()` sobre roles.
- Sin primitivas (`--primary-900`, `--neutral-100`) en código de producto.
- Sin overrides por tema. El dark mode es automático con `data-theme="dark"`; si necesitaste un
  override, elegiste mal el token.
- Un solo `btn-primary` por contexto. Nunca full-width ni alineado a la izquierda. Nunca píldora.
- Sin inventar ni aproximar un componente que ya existe. Si de verdad no existe: componé con lo que
  hay o **pará y marcá el gap**.
- Motion desde el bloque `motion:` de la regla + los tokens `--duration-*` / `--ease-*`. Nunca
  `cubic-bezier()` a mano. Nunca anular `prefers-reduced-motion`.
- Íconos Lucide únicamente. Solo-ícono lleva `aria-label`. Targets ≥44px en punteros gruesos.
- Texto de página en navy (`--text-primary`), no negro. `--color-on-surface` es para adentro de
  componentes.

---

## Paso 5 — Gate de salida

```bash
cd /tmp/amalgama-ds && node scripts/validate-ds.mjs
# y los gates del proyecto destino: lint, typecheck, build, test
```

Después corré la revisión: **`embassy-review`** sobre lo que produjiste, con la taxonomía de
`FAILURES.md`. Cualquier BLOQUEANTE o ALTA se arregla antes de mostrar.

**Screen report — obligatorio** cuando diseñás, rediseñás o migrás una pantalla:

1. Problemas de UX detectados (o, si es nueva, las decisiones de objetivo y jerarquía).
2. Elementos movidos / unificados / reemplazados / eliminados, uno por línea con su razón.
3. Componentes y variantes elegidos, y por qué cada uno.
4. Diferencias desktop vs mobile: la transformación aplicada, no el resize.
5. La regla del DS detrás de cada decisión no trivial.

En modo mejorar o migrar: **rediseñar es reorganizar, no preservar.** Podés mover, unir, dividir,
reemplazar o eliminar. Las reglas del DS y de UX ganan sobre la fidelidad al layout existente —
nunca conserves una estructura débil solo porque ya está. Reportá cada divergencia.

---

## Checklist

- [ ] Repo pulleado y **commit registrado** (+ nota de cambios sin commitear)
- [ ] Screen gate completo; arquetipo elegido
- [ ] Las cinco leyes de layout verificadas
- [ ] Por componente: regla → CSS → wrapper → a11y/motion, con la línea de "por qué esta variante"
- [ ] Mobile es la transformación correcta, no un encogimiento
- [ ] Estados vacío / cargando / error / éxito / deshabilitado / sin permiso diseñados
- [ ] Cero hex, cero primitivas, cero overrides por tema, cero clases inventadas
- [ ] `validate-ds.mjs` limpio + gates del proyecto
- [ ] `embassy-review` sin BLOQUEANTES ni ALTAS
- [ ] Screen report emitido
- [ ] Renderizado en light y dark
