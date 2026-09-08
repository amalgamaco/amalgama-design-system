---
name: embassy-eval
description: >-
  Corré el loop de evaluación del design system de Amalgama: generá los escenarios fijos con y sin
  la guía, contá las fallas con `embassy-review`, compará contra el baseline y registrá cada
  corrección contra la corrida que la produjo. Disparala ante "corramos el eval del DS", "medí si
  la skill mejoró algo", "¿esto está mejor que antes?", "sacá el baseline", "agreguemos un
  escenario", "cuántas fallas tenemos", o después de cambiar `design.md`, un SKILL.md o el CSS,
  para saber si el cambio ayudó. Es para los dueños del design system, no para el trabajo diario.
detail: >-
  El loop de medición: escenarios fijos, baseline guardado, corridas pareadas y conteo de fallas.
output: Una corrida con conteo de fallas por escenario, el delta contra el baseline y las correcciones propuestas.
format: Corridas + reportes en runs/ · requiere el repo
examples: |-
  corramos el eval del DS
  medí si el cambio en design.md mejoró algo
  sacá el baseline de los escenarios
---

# Embassy Eval — el loop de medición

`validate-ds.mjs` valida **el design system**. Esto valida **lo que se produce con él**.

Sin esto, cada cambio en `design.md` o en un SKILL.md es una apuesta. Con esto, es un número.
Vercel llegó a **57% menos fallas conocidas** (de 91 a 39) corriendo exactamente este loop sobre
siete escenarios fijos y más de 200 corridas.

**Esta skill es para los dueños del DS.** Nadie la corre para hacer una pantalla.

---

## Las cinco reglas del loop

1. **Los escenarios no se tocan.** Lo que evoluciona es la guía, no la prueba. Cambiar un escenario
   invalida la comparación con todo lo anterior.
2. **Guardá el baseline antes de medir.** Generá una vez **sin** la guía nueva. Sin baseline no hay
   delta, hay opinión.
3. **Comparaciones pareadas.** El mismo escenario, con y sin guía, mismo modelo, misma corrida.
4. **Cada corrección se registra contra la corrida exacta que la produjo.** Si no sabés qué output
   generó una regla, no vas a poder saber si la regla sirvió.
5. **La corrección va al punto más angosto que la evita** — prosa, CSS o check. Nunca a los tres.

---

## Los escenarios

Uno por arquetipo que el estudio realmente hace. Viven en `scenarios/<id>.md`, cada uno con: el
prompt exacto, los inputs reales, el arquetipo esperado y las fallas que históricamente aparecen ahí.

| id | Escenario | Carril |
|---|---|---|
| `01-lista-coleccion` | Lista con toolbar, filtros, estado de resultados y paginación | producto (`embassy`) |
| `02-dashboard-kpis` | Dashboard con stat-cards, un chart y drill-down | producto |
| `03-detalle-entidad` | Detalle con acciones, secciones y estados | producto |
| `04-form-creacion` | Formulario de creación con validación y feedback | producto |
| `05-propuesta-comercial` | Propuesta de una página para un cliente | artefacto (`embassy-artifact`) |
| `06-reporte-proyecto` | Reporte con tabla, datos y una conclusión | artefacto |
| `07-migracion-legacy` | Rediseño de una pantalla legacy mal estructurada | migración |

**Empezá por uno.** Vercel es explícito: un artefacto repetido, con inputs reales y una rúbrica
corta. El escenario 1 debería ser **el entregable que más repetimos**; si todavía no está claro
cuál es, esa es la primera pregunta al equipo, no un detalle.

---

## Una corrida

### 1. Preparar

```bash
cd /tmp/amalgama-ds && git rev-parse --short HEAD          # commit del DS
RUN=$(date +%Y%m%d-%H%M)                                    # id de corrida
mkdir -p runs/$RUN/{baseline,guided,reports}
```

Anotá en `runs/$RUN/meta.md`: commit del DS, versión de `design.md`, modelo usado, quién corrió y
qué cambió desde la corrida anterior.

### 2. Baseline — sin la guía

Para cada escenario, generá el output **sin** cargar `design.md` ni la skill que estás midiendo.
Solo el prompt del escenario y sus inputs. Guardalo en `runs/$RUN/baseline/<id>.html`.

Si ya existe un baseline vigente y **ni el escenario ni el modelo cambiaron**, reusalo: no lo
regeneres cada vez. Un baseline se rehace cuando cambia el escenario o el modelo, nunca cuando
cambia la guía — ese es justamente el punto.

### 3. Guiada — con la guía

Mismo prompt, mismos inputs, ahora **con** `design.md` + `PUBLIC-API.md` (carril artefacto) o con
`embassy` y el repo (carril producto). Guardalo en `runs/$RUN/guided/<id>.html`.

### 4. Juzgar

Corré **`embassy-review`** sobre cada output, baseline y guiada. Un reporte por archivo en
`runs/$RUN/reports/`. El juez tiene que ser el mismo para ambos lados del par — si cambiás el juez,
cambiaste la vara.

Sumale el chequeo determinístico:

```bash
node scripts/check-output.mjs runs/$RUN/guided/*.html
node scripts/check-output.mjs runs/$RUN/baseline/*.html
```

### 5. Contar

```
Corrida 20260908-1430 · DS acb86c0 · modelo <id>

escenario                 BLOQ  ALTA  MEDIA  BAJA  total   baseline   delta
01-lista-coleccion           0     3      5     2     10         17      −7
05-propuesta-comercial       0     1      4     1      6         14      −8
…
TOTAL                        0     4      9     3     16         31     −15  (−48%)
```

Lo que se mira, en este orden: **BLOQUEANTES primero** (cualquiera > 0 es una regresión, sin
importar el total), después el delta total, después qué IDs aparecen repetidos en varios escenarios
— esos son los que más rinde corregir.

### 6. Corregir y registrar

Para cada falla recurrente, en `runs/$RUN/correcciones.md`:

```
[D1] Toolbar sin alinear a la columna de contenido
  Apareció en: 01, 02, 06   (3 de 7 escenarios)
  Corrida:     runs/20260908-1430/guided/01-lista-coleccion.html
  Punto:       prosa — design.md §5, "una sola columna de contenido"
  Cambio:      agregar el ancho por tipo de contenido y el ejemplo del defecto
  Generaliza:  sí — aplica a cualquier página de colección
```

**Preguntá siempre si la corrección generaliza.** Una regla que arregla un solo output y no
transfiere es ruido en el archivo.

---

## Revisión humana

El conteo automático no alcanza: hay fallas que solo se ven mirando.

- Poné los dos outputs del par **lado a lado** y preguntá cuál se entrega. Si es posible, a ciegas.
- Cada corrección del revisor se anota **contra la corrida exacta**, no en general.
- Lo que el revisor marca y no tiene ID se convierte en falla nueva vía `embassy-review` §4.

Que pase el eval no garantiza que esté bueno. La pregunta real es si las quejas bajan con el tiempo.

---

## Cuándo correrlo

| Disparador | Alcance |
|---|---|
| Cambio en `design.md` o en un SKILL.md | los escenarios del carril afectado |
| Componente nuevo o cambio de variante | los escenarios que lo usan |
| Modelo nuevo | todo, con baseline nuevo |
| Cadencia | mensual, completo |

Si nadie tiene la cadencia asignada, el loop se muere en la tercera semana. **Necesita un dueño con
nombre.**

---

## Checklist

- [ ] Commit del DS, versión de la guía y modelo anotados en `meta.md`
- [ ] Escenarios sin modificar respecto de la corrida anterior
- [ ] Baseline vigente (o regenerado, con la razón anotada)
- [ ] Par completo: mismo prompt, mismos inputs, mismo juez
- [ ] `check-output.mjs` corrido sobre ambos lados
- [ ] Tabla de conteo con delta
- [ ] Correcciones registradas contra su corrida, con el punto de corrección y si generaliza
- [ ] Fallas nuevas incorporadas a `FAILURES.md`
