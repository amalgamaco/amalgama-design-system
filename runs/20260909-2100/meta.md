# Corrida 20260909-2100 — el primer baseline

| | |
|---|---|
| Commit del DS | `f9ca0e1` (con el tag `v1.0.0` recién creado) |
| Escenario | `01-lista-coleccion`, sin modificar |
| Modelo | claude-opus-5, el mismo de los dos lados |
| Corrió | Ana + Claude, desde Cowork |
| Qué cambió desde la anterior | no hay anterior: esta es la primera |

## Cómo se generó cada lado

Los dos lados salieron de **subagentes con contexto limpio**, no de esta conversación, para que el
criterio del DS no se filtrara por el costado.

- **baseline** — solo el prompt del escenario y los datos. Instrucción explícita de no leer ningún
  design system, guía ni librería, y de no sabotear el trabajo: "el que harías para un cliente real".
- **guiada** — el mismo prompt, más `design.md` y `PUBLIC-API.md` leídos completos antes de
  escribir markup, y el CSS por CDN pineado.

## Resultado — conteo determinístico (`check-output.mjs`)

| escenario | BLOQ | ALTA | MEDIA | BAJA | total |
|---|---|---|---|---|---|
| 01 · baseline | 30 | 34 | 0 | 0 | **64** |
| 01 · guiada | 0 | 1 | 0 | 0 | **1** |
| **delta** | −30 | −33 | 0 | 0 | **−63 (−98%)** |

**Este número está inflado y hay que decirlo.** `check-output` mide sobre todo disciplina de
tokens: 61 de las 64 fallas del baseline son `A1` (hex crudo) y `A3` (font-size en px). Una página
escrita a mano las tiene por definición, y una que consume el DS no las puede tener. El −98% dice
que el DS elimina una clase entera de errores, no que la pantalla sea mejor.

Lo que decide si es mejor es la revisión humana, y ahí el resultado es otro.

## Revisión humana — las dos pantallas al lado

**La guiada tiene tres fallas que el conteo no ve, y una de ellas la haría inentregable.**

| ID | Falla | Lado | Nota |
|---|---|---|---|
| `B3` | `class="search-field"` puesta en el `<input>` en vez del `<div>` que lo envuelve | guiada | El markup canónico es `<div class="search-field"><i…><input></div>`. Con la clase en el input se pierden la lupa y el anillo de foco |
| `D4` | El toolbar no es una fila: la búsqueda quedó a la izquierda, los tres filtros apilados a la derecha, y el contador flotando abajo, fuera del toolbar | guiada | Hay un hueco vertical grande entre el título y la tabla |
| *(nueva)* | El alert de error, el snackbar y la tabla visibles **al mismo tiempo** | guiada | Los estados estaban en el HTML pero sin ocultar. Un reclutador ve "no pudimos cargar las vacantes" arriba de las vacantes cargadas |
| ~~*(nueva)*~~ | ~~`<img>` de logo rota~~ | — | **Descartada: era un error de medición.** El logo apunta al S3 de Amalgama y el navegador con el que saqué el screenshot no tenía salida a internet. No es una falla del output |

El baseline, en cambio, **se ve bien**: el toolbar es una fila coherente, los chips de estado
funcionan, la tabla está prolija. Sus fallas son de sistema (todo hardcodeado, `role="search"`
ausente), no de composición.

**Conclusión honesta de la primera corrida:** el DS gana por goleada en consistencia y pierde en
composición. Las dos cosas son accionables y están abajo.
