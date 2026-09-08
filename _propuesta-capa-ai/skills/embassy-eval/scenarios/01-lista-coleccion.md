---
id: 01-lista-coleccion
carril: producto
arquetipo: list-collection
skill: embassy
estado: activo
creado: 2026-09-08
---

# Escenario 01 — Lista de colección

**No modificar.** Lo que evoluciona es la guía, no la prueba. Cambiar este archivo invalida la
comparación con todas las corridas anteriores. Si hace falta otro caso, se crea un escenario nuevo
con id nuevo.

---

## Prompt exacto

> Armá la pantalla de listado de vacantes de Gamaforce. El reclutador entra acá varias veces por
> día para encontrar una vacante concreta y ver cómo viene. Tiene que poder buscar por nombre,
> filtrar por estado y por cliente, ordenar por fecha, y crear una vacante nueva. Hay 240 vacantes.
> Desktop y mobile.

Nada más. **No agregues contexto ni pistas** entre corridas: el escenario tiene que llegar igual
siempre.

## Inputs

Datos de muestra en `fixtures/vacantes.json` (240 registros). Campos: `id`, `nombre`, `cliente`,
`estado` (`open` · `active` · `closed` · `draft` · `archived`), `postulantes`, `creada`,
`responsable`.

## Qué se espera

| Dimensión | Esperado |
|---|---|
| Arquetipo | `list-collection` (`references/screen-patterns.md` §2) |
| Toolbar | `.toolbar` con `.search-field` (`flex:1`), filtros de estado y cliente en `.toolbar-filters`, `.result-count` con `aria-live="polite"` |
| Acción primaria | una sola: "Crear vacante" en `.toolbar-actions` |
| Resultados | tabla o `.vacancy-card` / `.item`, alineados a la misma columna que el toolbar |
| Estado | `badge` por estado, nunca texto de color a mano |
| Paginación | `.pagination` al pie, con el contador |
| Estados | vacío de primer uso · vacío sin resultados (sin CTA de crear) · cargando con skeleton · error persistente en `.alert` |
| Mobile | tabla → cards apiladas; `.search-field` → `.search-bar`; filtros → bottom sheet; primaria `btn-lg` |
| Ancho | una columna ~1120–1200px, todas las regiones alineadas |

## Fallas históricas de este escenario

Las que aparecieron en corridas anteriores. Sirven para leer rápido si una corrección funcionó.

| ID | Falla | Visto en |
|---|---|---|
| `B3` | `<input placeholder="Buscar...">` en vez de `.search-field` | baseline |
| `B4` | `.search-bar` centrada arriba de la lista en vez de `.search-field` en el toolbar | baseline, guiada |
| `C1` | "Crear vacante" e "Importar" ambos `btn-primary` | baseline |
| `C4` | Acción secundaria tonal compitiendo con la primaria | guiada |
| `D1` | Toolbar sin alinear a la columna de los resultados | baseline, guiada |
| `D4` | Filtros flotando entre bandas no relacionadas | baseline |
| `D7` | Mobile como desktop encogido, con scroll horizontal de tabla | baseline |
| `E2` | Empty state de "sin resultados" con CTA de crear | guiada |
| `B10` | Dos filtros de igual jerarquía sin `.toolbar-filters` | guiada |
| `F4` | Contador de resultados sin `aria-live` | baseline, guiada |

## Cómo se corre

```bash
RUN=$(date +%Y%m%d-%H%M)
# baseline: solo el prompt y los inputs, sin design.md ni la skill
# guiada:   el mismo prompt, con la skill `embassy` y el repo
node scripts/check-output.mjs runs/$RUN/{baseline,guided}/01-lista-coleccion.html
# y embassy-review sobre cada uno
```
