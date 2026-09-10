# FAILURES.md — taxonomía de fallas de Embassy

Vocabulario compartido para decir *qué está mal* en una pantalla o un artefacto, de forma que dos
personas cuenten lo mismo. Lo consumen `embassy-review` (auditoría puntual) y `embassy-eval`
(medición sobre escenarios fijos).

**Cómo se usa una falla:** `ID · severidad · dónde · evidencia · regla que lo justifica`.

**Cómo se agrega una falla nueva:** cuando alguien dice *"esto no parece de Amalgama"*, se traduce a
un criterio observable —algo que se pueda contar sin discutir— y se agrega acá con un ID nuevo.
Después se corrige **en el punto más angosto que la evite**:

| Si la falla es… | La corrección va a… |
|---|---|
| de criterio o composición | prosa en `design.md` o en el `SKILL.md` que corresponda |
| mecánica y repetible | el CSS del repo, o un token |
| detectable por regex/AST | un chequeo en `scripts/check-output.mjs` |

Nunca a los tres lugares a la vez: se duplica y se desincroniza.

**Severidades**

| Nivel | Significado | Qué implica |
|---|---|---|
| **BLOQUEANTE** | Rompe una regla dura del DS o deja la pantalla inusable/inaccesible | No se entrega |
| **ALTA** | Se nota y erosiona la marca o la usabilidad | Se arregla antes de entregar |
| **MEDIA** | Correcto pero mediocre; un revisor lo marcaría | Se arregla si hay tiempo, se anota si no |
| **BAJA** | Preferencia o pulido | Opcional |

---

## A · Tokens y sistema visual

| ID | Falla | Sev | Cómo se detecta |
|---|---|---|---|
| `A1` | Hex crudo donde existe un token | BLOQ | `grep -nE "#[0-9a-fA-F]{3,8}\b"` (excluyendo `variables.css`, logos y SVG) |
| `A2` | Familia tipográfica escrita entre comillas en vez de `var(--font-*)` | BLOQ | `grep -nE "font-family\s*:\s*['\"]"` |
| `A3` | `font-size` en px suelto sin token `--font-size-*` | ALTA | regex |
| `A4` | Espaciado fuera de la escala (7, 9, 11, 13, 15px…) | MEDIA | regex sobre padding/margin/gap |
| `A5` | Token primitivo (`--primary-900`, `--neutral-100`) en código de producto | BLOQ | regex |
| `A6` | Override por tema (`.dark{}`, `[data-theme=dark]`, `prefers-color-scheme`) en un componente | BLOQ | regex |
| `A7` | Capa de alias paralela que remapea nombres de Embassy a nombres del proyecto | ALTA | revisión |
| `A8` | Fuga de utilidades de otro framework (`text-zinc-*`, `bg-white`, `rounded-xl`) en un proyecto con tokens | ALTA | regex |
| `A9` | Texto de página en negro en vez de navy (`--text-primary`) | ALTA | inspección |
| `A10` | `border-radius` inline en vez del modificador de tamaño | MEDIA | regex |
| `A11` | `letter-spacing` con valor literal en vez de `--letter-spacing-*` | MEDIA | regex |

## B · Selección de componente

| ID | Falla | Sev | Cómo se detecta |
|---|---|---|---|
| `B1` | Clase que no existe en `PUBLIC-API.md` | BLOQ | cruce contra `public-api.json` |
| `B2` | Componente inventado o aproximado teniendo uno canónico | BLOQ | revisión contra el manifest |
| `B3` | `<input>` genérico con placeholder "Buscar" en vez de `.search-field` / `.search-bar` | ALTA | `grep -RnE "input[^>]*placeholder=\"[^\"]*[Bb]uscar"` |
| `B4` | `.search-bar` (píldora) filtrando una lista de la misma pantalla, o `.search-field` como búsqueda global | ALTA | revisión |
| `B5` | Variante incorrecta para el propósito (tonal donde va outline, etc.) | ALTA | contra `component-rules/<id>.md` → `variants` |
| `B6` | Chip usado como acción, o badge como control interactivo | ALTA | revisión |
| `B7` | Toast donde hacía falta un alert persistente (o al revés) | ALTA | revisión |
| `B8` | Confirmación destructiva sin Alert Dialog, o con Escape/clic afuera habilitados | BLOQ | revisión |
| `B9` | Dropdown / select / picker hecho a mano teniendo el componente | BLOQ | revisión |
| `B10` | Fila de 2+ filtros de igual jerarquía sin `.toolbar-filters` | MEDIA | revisión |

## C · Jerarquía y acciones

| ID | Falla | Sev | Cómo se detecta |
|---|---|---|---|
| `C1` | Más de un `btn-primary` en un mismo contexto | BLOQ | conteo por contenedor |
| `C2` | Botón full-width o con contenido alineado a la izquierda | ALTA | regex + inspección |
| `C3` | Botón con radio píldora, cuando la marca no eligió la forma `pildora` (si la eligió, son píldora TODOS los botones y no es falla) | ALTA | inspección |
| `C4` | Acción secundaria tonal compitiendo con la primaria adyacente (debía ser outline) | ALTA | inspección |
| `C5` | Dos objetos primarios: la pantalla no sabe de qué se trata | ALTA | revisión |
| `C6` | Disparador de overlay con jerarquía de primaria | MEDIA | revisión |

## D · Layout y composición

| ID | Falla | Sev | Cómo se detecta |
|---|---|---|---|
| `D1` | Regiones sin alinear a una única columna de contenido | ALTA | inspección visual |
| `D2` | Un elemento se centra o se dimensiona con un ancho propio ajeno a la grilla | ALTA | inspección |
| `D3` | Sin ancho máximo: líneas de más de ~120 caracteres en pantalla ancha | ALTA | medición |
| `D4` | Fuera de la secuencia canónica (filtros flotando entre bandas ajenas) | MEDIA | inspección |
| `D5` | Un mismo concepto expresado por dos sistemas (chips *y* carpetas para el mismo set) | ALTA | revisión |
| `D6` | Cards anidadas | MEDIA | inspección |
| `D7` | Mobile es el desktop encogido, no la transformación correcta | ALTA | inspección en 375px |
| `D8` | Target táctil < 44px como única forma de accionar | ALTA | medición |
| `D9` | Estructura de página sin elegir, o `column-bleed` con el texto sin acotar (línea > ~120 caracteres) | ALTA | inspección + regex |

## E · Estados y contenido

| ID | Falla | Sev | Cómo se detecta |
|---|---|---|---|
| `E1` | Falta el estado vacío | ALTA | inspección |
| `E2` | Empty state de "sin resultados" con CTA de crear | MEDIA | inspección |
| `E3` | Falta el estado de carga, o hay spinner eterno donde iba `empty-state` | ALTA | inspección |
| `E4` | Falta el estado de error, o el error es transitorio cuando debía persistir | ALTA | inspección |
| `E5` | Skeleton y spinner juntos en el mismo contexto | MEDIA | inspección |
| `E6` | Número sin unidad, período, base o comparador | ALTA | lectura |
| `E7` | Copy de relleno o genérico ("Bienvenido a nuestra plataforma") | MEDIA | lectura |
| `E8` | Idioma incorrecto (producto que no es rioplatense, o comercial afuera que no es inglés) | ALTA | lectura |
| `E9` | Tono fuera de marca: exclamaciones, emojis, entusiasmo publicitario | MEDIA | lectura |
| `E10` | Varios estados visibles a la vez: el error encima de los resultados, el snackbar fijo, el skeleton junto a la tabla | ALTA | inspección |

## F · Accesibilidad

| ID | Falla | Sev | Cómo se detecta |
|---|---|---|---|
| `F1` | Anillo de foco removido o invisible | BLOQ | inspección con teclado |
| `F2` | Control de solo ícono sin `aria-label` | BLOQ | `grep` sobre `icon-btn` |
| `F3` | Búsqueda sin `role="search"` ni nombre accesible | ALTA | regex |
| `F4` | Contador de resultados sin `aria-live` | MEDIA | regex |
| `F5` | Tabla armada con divs en vez de semántica real | ALTA | inspección |
| `F6` | Estado comunicado solo por color | ALTA | inspección |
| `F7` | Contraste por debajo de AA | ALTA | medición |
| `F8` | Orden de tabulación ilógico o foco atrapado sin salida | ALTA | prueba con teclado |

## G · Motion

| ID | Falla | Sev | Cómo se detecta |
|---|---|---|---|
| `G1` | `cubic-bezier()` o milisegundos crudos en vez de tokens | ALTA | regex |
| `G2` | Easing expresivo en un efecto de color/opacidad, o estándar en un movimiento espacial | MEDIA | inspección |
| `G3` | `prefers-reduced-motion` ignorado o anulado | BLOQ | regex + inspección |
| `G4` | Entrada inventada que la regla del componente no declara | MEDIA | contra `motion:` de la regla |
| `G5` | Overlay que declara apertura pero no cierre | MEDIA | inspección |

## H · Reflejos de diseño generado

Los de `design.md` §8, contados como una falla cada uno.

| ID | Falla | Sev |
|---|---|---|
| `H1` | Eyebrow decorativo | MEDIA |
| `H2` | Gradiente decorativo / glassmorphism / blob / sombra de color | ALTA |
| `H3` | Grilla de tres feature-cards sin que el contenido sean tres cosas paralelas | MEDIA |
| `H4` | Emoji usado como ícono | ALTA |
| `H5` | Chart donde alcanzaba una tabla, o al revés | MEDIA |
| `H6` | Elemento que se puede sacar sin perder significado | BAJA |
| `H7` | Más de un overline en mayúsculas en la página — repetido deja de clasificar y es textura | MEDIA | inspección + regex |
| `H8` | Ícono por reflejo: uno arriba del título de cada card, en superficie cuadrada con radio | MEDIA | inspección |
| `H9` | Titular de apertura en la escala de producto (28px) donde iba el registro editorial, o dos editoriales en la misma página | MEDIA | inspección + regex |
| `H10` | Imagen de banco, ilustración isométrica, render 3D o degradé haciendo de foto | ALTA | regex + inspección |
| `H11` | Secciones apareciendo al scrollear (fade-up, IntersectionObserver, librería de scroll-reveal) | MEDIA | regex |
| `H12` | La capa espacial de Amalgama (planetas, órbitas, fondo estrellado) en un producto de cliente | BLOQ | regex + inspección |

## I · Proceso y drift

| ID | Falla | Sev | Cómo se detecta |
|---|---|---|---|
| `I1` | Copia local desactualizada de CSS/TSX del DS (fork silencioso) | ALTA | diff contra el commit registrado |
| `I2` | No se registró el commit del DS usado | MEDIA | falta en el reporte |
| `I3` | No se emitió el screen report en un rediseño | MEDIA | falta |
| `I4` | Gap del DS improvisado en vez de marcado | ALTA | revisión |

---

## Plantilla de hallazgo

```
[C1 · BLOQUEANTE] Dos btn-primary en el header de la lista
  Dónde:     src/pages/Vacantes.tsx:48 y :53
  Evidencia: "Nueva vacante" y "Importar" ambos con .btn-primary
  Regla:     GOVERNANCE §20.5 — una sola acción primaria por contexto
  Arreglo:   "Importar" pasa a .btn-tertiary (es de menor prioridad y está adyacente)
```

## Plantilla de resumen de corrida

```
Escenario: 01-lista-coleccion   Guía: con design.md   Modelo: <id>   Commit DS: acb86c0
BLOQUEANTES 0 · ALTAS 3 · MEDIAS 5 · BAJAS 2   ·   total 10
IDs: B4, C4, D1, D4, E2, E6, F4, G1, H1, H6
Deltas vs baseline: −7 (baseline: 17)
```
