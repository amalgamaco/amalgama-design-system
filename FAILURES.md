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

**Portabilidad — a quién le aplica cada familia**

Un proyecto de Amalgama puede tener **su propio design system**, y entonces medirlo contra el
inventario de Embassy da un número que parece un score y no mide nada. La separación de fondo ya
está en `COMPOSICION.md` §Alcance: *un producto se ve como su marca y está compuesto como
nosotros.* Acá está esa separación aplicada familia por familia.

| Marca | Significa |
|---|---|
| **Universal** | Aplica a cualquier proyecto, tenga el DS que tenga. Es oficio, no identidad |
| **Reapuntable** | Aplica igual, pero leyendo **la fuente de tokens y componentes del proyecto** en vez de la de Embassy. «Hex crudo donde existe un token» vale siempre; *cuál* es el token lo dice el proyecto |
| **Embassy** | Solo tiene sentido si el DS del proyecto **es** Embassy. En otro proyecto no se reporta — reportarlo es un falso positivo |

Quién decide el régimen: `review` y `screen` lo preguntan antes de auditar nada (Paso 0). No se
infiere a mitad del reporte.

---

## A · Tokens y sistema visual

**Reapuntable.** Todo el grupo vale contra la fuente de tokens del proyecto: si el proyecto tiene
un token para eso, un hex crudo sigue siendo una falla. **Excepciones que no se reportan fuera de
Embassy:** `A7` (el puente de alias es un problema de *adoptar* Embassy) y `A9` (el navy es de
Amalgama — en otro proyecto, el color de texto lo define su DS).

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
| `A9` | Texto de página en negro en vez de navy (`--on-surface`) | ALTA | inspección |
| `A10` | `border-radius` inline en vez del modificador de tamaño | MEDIA | regex |
| `A11` | `letter-spacing` con valor literal en vez de `--letter-spacing-*` | MEDIA | regex |

## B · Selección de componente

**Reapuntable.** El criterio —no inventar lo que ya existe, no usar la variante equivocada— vale
con cualquier catálogo; se cruza contra el del proyecto. `B1` se lee contra su API pública, no
contra `PUBLIC-API.md`. `B6`, `B7` y `B8` son **universales**: chip como acción, toast donde iba
alert y confirmación destructiva sin diálogo son errores de UX, no de DS.

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

**Universal.**

| ID | Falla | Sev | Cómo se detecta |
|---|---|---|---|
| `C1` | Más de un `btn-primary` en un mismo contexto | BLOQ | conteo por contenedor |
| `C2` | Botón full-width o con contenido alineado a la izquierda | ALTA | regex + `check-render` (ancho contra el de su contenedor) · criterio A3 |
| `C3` | Botón con radio píldora, cuando la marca no eligió la forma `pildora` (si la eligió, son píldora TODOS los botones y no es falla) | ALTA | inspección |
| `C4` | Acción secundaria tonal compitiendo con la primaria adyacente (debía ser outline) | ALTA | inspección |
| `C5` | Dos objetos primarios: la pantalla no sabe de qué se trata | ALTA | revisión |
| `C6` | Disparador de overlay con jerarquía de primaria | MEDIA | revisión |
| `C7` | **Dos sistemas de selección del mismo peso en una región**: el modo de vista, el filtro activo y el objeto abierto pintados con el mismo token. Ninguno se lee como más importante y la pantalla queda como una lista de cosas encendidas | ALTA | conteo de tokens de selección por contenedor · `COMPOSICION.md` §4c |

## D · Layout y composición

**Universal.** Es la familia que más se lleva: es composición, no identidad.

| ID | Falla | Sev | Cómo se detecta |
|---|---|---|---|
| `D1` | Regiones sin alinear a una única columna de contenido | ALTA | `check-render` (bordes de las regiones dentro de `[data-ds-screen]`) · criterio B2 |
| `D2` | Un elemento se centra o se dimensiona con un ancho propio ajeno a la grilla | ALTA | inspección |
| `D3` | Sin ancho máximo: líneas de más de ~120 caracteres en pantalla ancha | ALTA | `check-render` |
| `D4` | Fuera de la secuencia canónica (filtros flotando entre bandas ajenas) | MEDIA | inspección |
| `D5` | Un mismo concepto expresado por dos sistemas (chips *y* carpetas para el mismo set) | ALTA | revisión |
| `D6` | Cards anidadas | MEDIA | `check-render` |
| `D7` | Mobile es el desktop encogido, no la transformación correcta | ALTA | inspección en 375px |
| `D8` | Target táctil < 44px como única forma de accionar | ALTA | `check-render` (pase de 375px) |
| `D9` | Estructura de página sin elegir, o `column-bleed` con el texto sin acotar (línea > ~120 caracteres) | ALTA | inspección + regex |
| `D10` | En una pantalla de producto, secciones separadas por línea (`.rule`, bordes sueltos) en vez de por el escalón `--surface` → `--surface-container`. El shell ya encuadra: el borde dibuja dos veces | MEDIA | inspección · `COMPOSICION.md` III·a·1 |
| `D11` | Pantalla de producto que abre con registro editorial, overline de apertura o índice de sección en vez de `page-header`. Una pantalla de producto no abre: continúa | ALTA | inspección · III·a·2 |
| `D12` | **La etiqueta pesa más que su dato** — en un `stat-card` con la cifra chica y el rótulo grande, o en un panel de detalle. Es `M13` en territorio de escritorio | ALTA | `check-render` + inspección · III·a·6 |
| `D13` | Contenedor elegido por costumbre y no por grano: `table` para tres campos de texto, o tarjetas para valores que hay que comparar | MEDIA | inspección · III·a·4 |
| `D14` | Dos `btn-primary` en la misma pantalla, o la acción primaria fuera del `page-header` | ALTA | regex + inspección · III·a·7 |
| `D15` | **La proximidad no agrupa**: el espacio dentro de un grupo es igual o mayor que el que lo separa del grupo siguiente — típicamente una etiqueta más lejos de su propio campo que del campo que sigue. Un borde alrededor no lo arregla | ALTA | `check-render` (mide los dos gaps) · `guidelines/visual-hierarchy.md` §Whitespace as grouping |
| `D16` | **La columna quedó demasiado angosta**: el párrafo se rompe cada tres palabras. Es `D3` por el otro lado — el ancho máximo protege del renglón infinito, nada protegía del renglón de 23 caracteres. Pasa al partir en dos columnas algo que se previsualizó en una, y no se ve leyendo el CSS: se ve midiendo el render | ALTA | `check-render` |
| `D17` | **La densidad no está declarada.** La pantalla no dice `data-density` y sus controles salen del default: el mismo 36px para un mostrador que la mira ocho horas y para una pantalla que el socio abre una vez al mes. Sin la declaración tampoco se puede medir si un control está fuera de escala | ALTA | `check-render` · `guidelines/aceptacion-de-pantalla.md` A1 |
| `D18` | **El control pesa más que el dato**: un filtro más alto y más grande que la fila que filtra. El control es el medio, el dato es el fin; si el select de 40px va arriba de filas de 28, la pantalla muestra primero la herramienta. Es el síntoma que se nombra como «los componentes quedaron gigantes» | ALTA | `check-render` (alto y cuerpo, contra la fila de dato) · A2 |
| `D19` | **Más de un valor para la misma cosa**: cuatro radios y tres alturas de control en una pantalla. No es un sistema con variedad, son decisiones sueltas tomadas de a una. La píldora no cuenta como radio propio | ALTA | `check-render` (cuenta valores computados) · B1 |
| `D20` | **El dominante declarado no domina.** `data-ds-dominant` está puesto y la región recibe el mismo tratamiento que la leyenda: no tiene más área que las otras, o no es la única superficie elevada. La relación se pide igual en un tablero, una tabla o un formulario — cambia cuál es el dominante, no la relación | ALTA | `check-render` (área contra la segunda región, elevación) · C1 |
| `D21` | **Un conjunto repetido de controles, todos en peso fuerte.** Cinco chips en negrita no son cinco filtros importantes: son cinco que se anularon entre sí, y encima se quedaron sin recurso para marcar el activo. El peso es el portador que hay que dejar libre | ALTA | `check-render` (hermanos de la misma clase, todos ≥ 600) · C2 |
| `D22` | **Tres portadores de énfasis en un mismo elemento** — peso, tamaño, color y superficie se gastan de a uno; la apertura puede tomar dos. Es el recíproco de `F6`: ahí el problema es el color como único portador, acá es el color encima de todo lo demás | ALTA | `check-render` (portadores por elemento) · C2 |
| `D23` | **El color no se gasta por rango**: más de cuatro tonos de acento compitiendo, un tono semántico sin su fila de leyenda, o acento en el cromo (filtros, riel, modo de vista). El tono de marca es de acciones y el semántico es de datos; el mismo tono no hace las dos cosas en una pantalla | MEDIA | `check-render` (familias de tono con fondo saturado) · C3 |
| `D24` | **El salto de aire entre niveles es menor a 1,75×.** `D15` pide que el espacio de adentro sea *menor* que el de afuera, y con eso 24/24/24 pasa moviendo uno a 23. Sin salto real el espacio no agrupa, y hay que dibujar cajas para suplirlo: `D24` y las cajas de más son la misma falla a dos distancias | MEDIA | `check-render` (razón entre niveles) · D1 |
| `D25` | **Algo se estira sobre vacío**: una grilla de cuatro columnas con cinco ítems —una fila con uno solo y tres huecos—, o un contenedor con más de la mitad de su caja vacía. Las columnas se eligen para que el contenido las complete | MEDIA | `check-render` (fila huérfana, ocupación del contenedor) · D2 |
| `D26` | **El aire no está repartido**: una región respira más del doble por elemento que otra de la misma pantalla. La tabla al ras y el encabezado nadando en aire está desbalanceado aunque las dos mitades, por separado, estén bien | MEDIA | `check-render` (aire por elemento, entre regiones) · D3 |

> **Las diez de arriba (`D17`–`D26`) son la vara de aceptación de pantalla**, y la regla que
> justifica cada una vive en `guidelines/aceptacion-de-pantalla.md` — no acá: acá está la falla, su
> severidad y cómo se detecta. Se miden dentro de `[data-ds-screen]`; sin esa raíz declarada,
> `check-render` las saltea y lo avisa en el reporte, porque el catálogo del DS y una landing no son
> pantallas de producto. **Cierre:** cero ALTAS y hasta dos MEDIAS anotadas con su razón.

## E · Estados y contenido

**Universal.**

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

**Universal.** Es WCAG, no Embassy.

| ID | Falla | Sev | Cómo se detecta |
|---|---|---|---|
| `F1` | Anillo de foco removido o invisible | BLOQ | inspección con teclado |
| `F2` | Control de solo ícono sin `aria-label` | BLOQ | `grep` sobre `icon-btn` |
| `F3` | Búsqueda sin `role="search"` ni nombre accesible | ALTA | regex |
| `F4` | Contador de resultados sin `aria-live` | MEDIA | regex |
| `F5` | Tabla armada con divs en vez de semántica real | ALTA | inspección |
| `F6` | Estado comunicado solo por color | ALTA | inspección |
| `F7` | Contraste por debajo de AA | ALTA | `check-render` (color resuelto contra el fondo efectivo) |
| `F8` | Orden de tabulación ilógico o foco atrapado sin salida | ALTA | prueba con teclado |
| `F9` | Selección marcada sólo con una clase (`.active`, `.selected`) y sin `aria-selected` / `aria-pressed` / `aria-current`: se ve elegido y el lector de pantalla no lo anuncia | ALTA | regex sobre la clase de estado, cruzado con el atributo |

## G · Motion

**Reapuntable.** Los tokens de duración y easing son los del proyecto; el resto
—doble easing, `prefers-reduced-motion`, entradas no declaradas— es universal.

| ID | Falla | Sev | Cómo se detecta |
|---|---|---|---|
| `G1` | `cubic-bezier()` o milisegundos crudos en vez de tokens | ALTA | regex |
| `G2` | Easing expresivo en un efecto de color/opacidad, o estándar en un movimiento espacial | MEDIA | inspección |
| `G3` | `prefers-reduced-motion` ignorado o anulado | BLOQ | regex + inspección |
| `G4` | Entrada inventada que la regla del componente no declara | MEDIA | contra `motion:` de la regla |
| `G5` | Overlay que declara apertura pero no cierre | MEDIA | inspección |

## H · Reflejos de diseño generado

**Universal, con dos excepciones.** Los reflejos de página generada no dependen de la marca.
No se reportan fuera de Embassy: `H12` (la capa espacial es nuestra) y `H9` (el registro
editorial es un concepto de nuestra escala).

Los de `design.md` §8, contados como una falla cada uno.

| ID | Falla | Sev |
|---|---|---|
| `H1` | Eyebrow decorativo | MEDIA |
| `H2` | Mancha de degradé flotando, glassmorphism, blob o sombra de color. NO es esto un degradé del set (`--gradient-brand` / `-surface` / `-glow`) usado como superficie | ALTA |
| `H3` | Grilla de tres feature-cards sin que el contenido sean tres cosas paralelas | MEDIA |
| `H4` | Emoji usado como ícono | ALTA |
| `H5` | Chart donde alcanzaba una tabla, o al revés | MEDIA |
| `H6` | Elemento que se puede sacar sin perder significado | BAJA |
| `H7` | Más de un overline en mayúsculas en la página — repetido deja de clasificar y es textura | MEDIA | inspección + regex |
| `H8` | Ícono por reflejo: chico, en **superficie cuadrada con radio** tintada y **al lado del título**, uno por card y del mismo tamaño en todas. NO es esto un disco grande arriba del titular, que es la ubicación 4 de la regla 5 | MEDIA | regex + inspección · `COMPOSICION.md` regla 5 |
| `H9` | Titular de apertura en la escala de producto (28px) donde iba el registro editorial, o dos editoriales en la misma página | MEDIA | inspección + regex |
| `H10` | Imagen de banco, ilustración isométrica, render 3D o degradé haciendo de foto | ALTA | regex + inspección |
| `H11` | Secciones apareciendo al scrollear (fade-up, IntersectionObserver, librería de scroll-reveal) | MEDIA | regex |
| `H12` | La capa espacial de Amalgama (planetas, órbitas, fondo estrellado) en un producto de cliente | BLOQ | regex + inspección |

## I · Proceso y drift

**Reapuntable.** Hablan del DS que el proyecto use, sea cual sea.

| ID | Falla | Sev | Cómo se detecta |
|---|---|---|---|
| `I1` | Copia local desactualizada de CSS/TSX del DS (fork silencioso) | ALTA | diff contra el commit registrado |
| `I2` | No se registró el commit del DS usado | MEDIA | falta en el reporte |
| `I3` | No se emitió el screen report en un rediseño | MEDIA | falta |
| `I4` | Gap del DS improvisado en vez de marcado | ALTA | revisión |

## M · Nativo

**Universal.** La composición de una pantalla de app no depende de quién pinte el botón: Material,
gluestack y nuestro CSS obedecen lo mismo. Los tokens de densidad se leen del proyecto.

Solo se pueden fallar en una app. Las demás familias aplican igual: una pantalla nativa no se
audita distinto que una web. Ver `MOBILE.md` §6 para la composición y §5 para el mapa.

Se cuentan sobre **tres** superficies, y `check-output.mjs` las reconoce solas: el `.tsx` de una app
React Native (importa de `react-native` o `expo`), el `.dart` de una app Flutter (importa de
`package:flutter/`) y el **preview HTML** con `data-platform="native"`, que es donde se diseña y se
aprueba antes de que exista el código.

`M2`, `M4`, `M6` y `M9` son de criterio y valen en las tres. `M1`, `M3`, `M5` y `M8` existen en los
dos stacks pero se escriben distinto, así que cada regla declara el suyo. **`M7` es la única que no
cruza:** `TextStyle.height` en Flutter *sí* es un múltiplo del `fontSize`, así que ahí pasar 1,5 es
correcto y marcarlo sería un falso positivo.

| ID | Falla | Sev | Cómo se detecta |
|---|---|---|---|
| `M1` | Tamaño tipográfico escrito a mano en vez de leerlo de `native`/`nativeDark` | ALTA | `grep -nE "fontSize:\s*[0-9]"` |
| `M2` | Superficie tocable por debajo de 48 (`--target-min`), **o** un preview con `data-platform="native"` sin `preview-native.css` (dibuja los controles a la altura de escritorio: el preview miente) | BLOQ | alto inline en el preview + el `<link>` faltante; en `.tsx`, `Pressable`/`TouchableOpacity` sin `hitSlop` ni alto suficiente |
| `M3` | Safe area hardcodeada (`paddingTop: 44`) en vez de `useSafeAreaInsets()` | ALTA | regex |
| `M4` | Patrón de escritorio encogido en vez del patrón nativo: tabla que scrollea de costado, modal centrado chico, menú flotante, paginación numerada | ALTA | inspección contra el mapa de `MOBILE.md` §5 |
| `M5` | La escala web (cuerpo 13,5) en una app: se olvidó `data-platform="native"` o el export `native` | ALTA | comparación de tokens |
| `M6` | `--column-gutter`, `.grid-12`, `max-width` o medida en `ch` en una pantalla nativa | MEDIA | regex |
| `M7` | **Solo React Native.** `lineHeight` o `letterSpacing` pasados como multiplicador o `em`, que RN ignora en silencio. En Flutter `height` ES un múltiplo: ahí no aplica | ALTA | `grep -nE "(lineHeight\|letterSpacing):\s*(0?\.[0-9]\|1\.[0-9])"` |
| `M8` | Utilidades de gluestack/Tailwind sin traducir (`bg-blue-500`, `rounded-xl`, `text-sm`) | ALTA | regex — es `A8` en territorio nativo |
| `M9` | Probado en una sola plataforma: sombras, fuentes y ripple no se dibujan igual en iOS y Android | MEDIA | falta la evidencia de las dos |
| `M10` | Secciones separadas por línea en vez de por superficie: fondo plano con `<hr>` o bordes sueltos, sin el escalón `--surface` → `--surface-container` | MEDIA | `check-render` (un `<hr>`, o un bloque con borde y el mismo fondo que la pantalla) · `MOBILE.md` §6b·1 |
| `M11` | Pares etiqueta/dato sueltos sobre el fondo en vez de agrupados en una tarjeta, o divisores a sangre en vez de insetados al padding | MEDIA | `check-render` (una `.screen-row` fuera de un `.screen-group`); el divisor a sangre sigue siendo inspección · §6b·2 |
| `M12` | Header de sección en escala de heading y adentro del grupo, en vez de caption/600/muted y afuera | MEDIA | `check-render` (compara contra el caption **del contexto**, no el de `:root`) · §6b·3 |
| `M13` | **La etiqueta pesa más que su dato**: la etiqueta en escala de heading o en `--on-surface`, y el valor más chico o apagado. Es la falla que el sistema produce solo | ALTA | `check-render` (compara tamaño y contraste de `.screen-row-label` contra `.screen-row-value`) · §6b·4 |
| `M14` | Acción primaria al final del contenido en vez de anclada abajo, fuera del scroll | MEDIA | `check-render` (primaria que fluye con el contenido, sin `.screen-action` ni posición fija) · §6b·6 |
| `M15` | `--font-mono` en prosa, captions, fechas sueltas o como gesto de marca. En nativo el mono es solo para datos tabulares que se comparan en columna | MEDIA | `check-render` (mono con 5+ palabras dentro de un contenedor nativo — un identificador en mono es el uso correcto) · §6b·7 |

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
