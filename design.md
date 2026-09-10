# design.md — cómo se construye una página con la marca de Amalgama

> Archivo público y autocontenido. Si sos un agente y llegaste acá con una URL, tenés todo lo que
> necesitás: no hace falta clonar ningún repo ni leer ningún CSS.
> **Fuente canónica:** `amalgamaco/amalgama-design-system`. Si este archivo y el repo se contradicen,
> gana el repo — y este archivo es el bug.
> **Complemento obligatorio:** `PUBLIC-API.md` (la lista de clases permitidas).

---

## 1. Contexto de marca

Amalgama es un estudio de producto digital enfocado en **Welltech** — salud, fitness y bienestar.
Diseña y desarrolla apps mobile, sitios y aplicaciones web para clientes y para adentro.

La marca es **precisión técnica con cercanía**: segura, un poco audaz, nunca fría ni corporativa
genérica. El color base no es negro: es **navy** (`--primary-900`, `#01164D`). Todo lo que se
publique tiene que **comunicar autoría de Amalgama sin parecer la UI de producto de Amalgama, ni
una landing SaaS genérica, ni una campaña publicitaria.**

**Idioma de salida:**

- **UI de producto e interno** → español rioplatense. "Guardá los cambios", no "Guarde los cambios".
- **Material comercial hacia afuera** → inglés.
- Los términos técnicos van en inglés (dashboard, onboarding, empty state).

**Voz:** directa, segura, orientada a la acción. Calidez sin relleno. Sin signos de exclamación,
sin emojis, sin "¡Genial!". CTAs cortos y concretos: *"Hablemos"*, *"Ver el trabajo"*,
*"Crear vacante"*.

---

## 2. Orden de prioridad

Cuando dos reglas chocan, gana la de más arriba.

1. **Lo que el lector necesita decidir.** Una página existe para que alguien haga o entienda algo.
2. **Integridad de la evidencia.** Ningún número sin unidad, período, base ni comparador.
3. **Jerarquía.** Una sola cosa primaria por pantalla; el resto baja de peso.
4. **El sistema de tokens y clases publicado.** Nunca un hex suelto, nunca una clase inventada.
5. **Accesibilidad y comportamiento responsive.**
6. **Preferencia estética.** Última. Si sobrevivió a las cinco anteriores, es válida.

**La composición de la página —qué forma tiene, qué formas no usamos— está en `COMPOSICION.md`,
y es obligatoria.** Este archivo define el sistema visual; ése define cómo se arma la página con
él, y es lo que evita que el resultado tenga la silueta de cualquier página generada: la
estructura (una de cuatro, elegida a propósito), el eje izquierdo, el ritmo entre secciones, el
overline y el índice de sección. Leelos juntos, y las clases salen de `css/composition.css`.

---

## 3. Integrate con el proyecto que te llama

Antes de escribir nada, mirá dónde vas a escribir:

- **Página nueva y autocontenida (sin repo)** → cargá el sistema por CDN (§7) y usá las clases de
  `PUBLIC-API.md`. Este es el caso por defecto de este archivo.
- **Proyecto con su propia capa de tokens** (nombres tipo `--color-bg-*`, `--color-interactive-*`)
  → usá **los nombres que ya existen en ese proyecto**. No agregues una capa de alias que mapee
  nombres de Embassy a nombres del proyecto: rompe el dark mode y esconde el drift.
- **Proyecto de producto con el repo de Embassy a mano** → este archivo no alcanza. Usá el repo:
  `component-rules/<id>.md` para elegir el componente, `css/components/<id>.css` para el markup.

---

## 4. Trabajá en cuatro pasadas

### Pasada 1 — Enmarcá el trabajo del lector

Escribí estas seis líneas antes del primer tag. Si no podés completar una, estás adivinando.

```
OBJETIVO    lector: <verbo + objeto>       negocio: <qué vuelve más probable>
OBJETO      primario: <una sola entidad>   niveles: <clave → soporte → bajo demanda>
ACCIONES    primaria: <una sola>           secundarias: <cuáles y dónde>
COMPOSICIÓN <patrón de §5>
RESPONSIVE  desktop: <estructura>          mobile: <la transformación, no un encogimiento>
ESTADOS     vacío / cargando / error / éxito / sin permiso
```

### Pasada 2 — Elegí la composición

La composición sale de **la pregunta del lector y la forma de la evidencia**, no del gusto. Cuatro
patrones cubren casi todo (§5).

### Pasada 3 — Construí con el sistema visual

Tokens y clases publicadas, nada más (§6, §7).

### Pasada 4 — Revisá en privado antes de mostrar

Recorré §8 (*rechazá estos reflejos*) y §9 (*accesibilidad y responsive*) sobre lo que hiciste, y
arreglalo **antes** de entregar. Una entrega con fallas conocidas cuesta más que una demora corta.

---

## 5. Patrones de composición

| Patrón | Cuándo | Esqueleto |
|---|---|---|
| **Encabezado por afirmación** | Hay una conclusión y la evidencia la sostiene | Título con la afirmación → 2–4 datos que la prueban → detalle → qué sigue |
| **Encabezado por evidencia** | Los datos son el punto y la conclusión se construye | Contexto breve → tabla/chart → lectura → implicancia |
| **Comparación** | Dos o más opciones con criterios comunes | Criterios explícitos → comparación pareada → recomendación con el trade-off |
| **Herramienta** | El lector tiene que probar supuestos | Un modelo, pocos controles, resultado siempre visible, supuestos a la vista |

Reglas transversales de composición:

- **Una sola columna de contenido y un ancho deliberado.** Elegí por contenido, no por costumbre:
  ~1120–1200px para listas, tablas y dashboards · ~760–800px para lectura y detalle ·
  ~640–680px para un formulario o un panel de auth. Los bordes izquierdo y derecho de **todas** las
  regiones se alinean a esa columna. Una barra de búsqueda o un toolbar centrado con un ancho propio
  distinto del de los resultados que filtra es un defecto, no una decisión de estilo.
- **Un solo sistema por eje.** Un concepto se expresa una vez. Si hay chips de filtro *y* una banda
  de carpetas para el mismo conjunto, sobra una.
- **Secuencia canónica** de una página de colección: encabezado + acción primaria → búsqueda,
  filtros y estado de resultados → navegación o contenido contextual (opcional) → resultados →
  paginación.
- **Adyacencia de acciones.** En un grupo de acciones, exactamente un elemento lleva relleno; el
  vecino de menor prioridad baja a outline o texto.
- **Mostrá unidades, períodos, poblaciones, bases y comparadores al lado del dato que califican.**

---

## 6. El sistema visual

### 6.1 Color

Consumí **roles semánticos**, nunca primitivas (`--primary-900`, `--neutral-100` son de entrada
solamente). El único cálculo permitido es `color-mix()` sobre roles.

| Rol | Para qué |
|---|---|
| `--color-primary` / `-on-primary` / `-primary-container` / `-on-primary-container` | navy de marca. **Ojo: en dark se invierte a blanco** — nunca para series de chart ni rellenos grandes |
| `--color-secondary` / quartet | azul interactivo (links, foco, nav, tabs) |
| `--color-tertiary` / quartet | violeta, acento terciario |
| `--color-success` · `-warning` · `-error` · `-info` (+ quartet) | estado |
| `--color-surface`, `-surface-container-{lowest,low,,high,highest}`, `-surface-variant` | superficies |
| `--color-on-surface`, `-on-surface-variant` | contenido **dentro** de componentes |
| `--color-outline` (interactivo) · `--color-outline-variant` (sutil) | bordes |
| `--color-focus`, `--color-focus-ring`, `--color-error-ring`, `--color-scrim` | foco y overlays |
| `--chart-1` … `--chart-5` | series de datos, en ese orden |

Alias semánticos de página: `--bg`, `--surface`, `--card-bg`, `--sidebar-bg`, `--border`
(chrome de contenedores, más tenue que `outline`), `--divider`, `--text-primary`, `--text-secondary`,
`--text-muted`, `--interactive`, `--accent`.

> **El texto de página es navy, no negro.** Títulos y cuerpo usan `--text-primary`
> (`--primary-900` en light, recalibrado en dark). `--color-on-surface` (casi negro) es para
> contenido **adentro** de componentes: label de un chip, texto de un botón, celda de tabla. Si el
> texto de la página sale negro, hay un token mal aplicado.

**Dark mode es automático:** `<html data-theme="dark">`. Los roles se recalibran solos. Si
necesitaste un override por tema, elegiste mal el token. La única excepción del sistema es el
bloque de superficies oscuras que genera el tema de marca —ahí no hay primitiva que overridear—,
y lo escribe el generador, nunca una pantalla.

### 6.2 Tipografía

**Epilogue** para headings · **Inter** para body y UI · **DM Mono** para código y labels técnicos.
Siempre vía `var(--font-heading)` / `var(--font-body)` / `var(--font-mono)`, nunca el nombre de la
familia entre comillas.

Todo `font-size` pasa por un token. Nada de px sueltos.

| Token | px | Rol |
|---|---|---|
| `--font-size-display` | 28 | h1 |
| `--font-size-heading-xl` | 24 | h2 |
| `--font-size-heading-lg` | 22 | h3 |
| `--font-size-heading-md` | 18 | h4 |
| `--font-size-heading-sm` | 17 | h5 |
| `--font-size-heading-xs` | 15 | h6 |
| `--font-size-body-lg` | 14 | cuerpo destacado |
| `--font-size-body-md` | 13.5 | **base de UI** — inputs, botones, celdas |
| `--font-size-body-sm` | 12.5 | secundario |
| `--font-size-label` | 13 | labels de formulario |
| `--font-size-caption` | 12 | pies, ayudas |
| `--font-size-badge` | 11.5 | badges |
| `--font-size-overline` | 12 | headers de tabla en mayúsculas |

Pesos: `--font-weight-{regular,medium,semibold,bold,extrabold}` = 400/500/600/700/800.

### 6.3 Espaciado, forma, elevación

- **Espaciado** — grilla de 4px, escala rala: `--space-1,2,3,4,5,6,8,10,12,16,20`
  (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px). **No existen 7, 9 ni 11.**
- **Radio** — `--radius-sm` 4 · `-md` 8 · `-lg` 12 · `-xl` 16 · `-full` 9999.
  **El radio escala con el tamaño del componente, nunca con su variante.** La píldora
  (`--radius-full`) está reservada a chips y badges: **un botón píldora está prohibido**.
- **Elevación** — `--shadow-sm/md/lg`, con tinte navy. Bordes = en el plano; sombra = overlay.
  Las sombras **no se recalibran en dark** (desaparecen); no las uses como único separador.
- **Layout** — `--sidebar-width` 220px · `--topbar-height` 56px ·
  breakpoints `--breakpoint-md` 768px y `--breakpoint-lg` 1024px (las media queries no leen
  `var()`: escribí el px literal y mantenelo sincronizado).

### 6.4 Íconos

**Lucide**, un solo set, siempre. `stroke` hereda `currentColor`. 18px dentro de chips e inputs,
20px en navegación, 24px en barras de búsqueda. Nunca mezclar sets.

### 6.5 Motion

Funcional, nunca decorativo. **No inventes `cubic-bezier()` ni milisegundos crudos.**

- Duraciones: `--duration-fast` 120ms (micro y todas las salidas chicas) · `-normal` 200 ·
  `-medium` 300 (contenido de dialog) · `-slow` 450 · `-sheet` 500.
- Easings: `--ease-default` (efectos: color, opacidad, sombra — sin rebote) ·
  `-enter` / `-exit` · `-expressive*` (movimiento espacial: translate, scale — con rebote
  controlado) · `-emphasized` (todos los Sheets, sin rebote).
- **Regla de doble easing:** los efectos van con el easing estándar, los movimientos espaciales con
  el expresivo. Si una transición mezcla ambos, separalos por propiedad.
- El único transform de hover aprobado en botones es `translateY(-1px)`.
- Animá solo `transform` y `opacity`. Respetá `prefers-reduced-motion` siempre — nunca lo anules
  con `!important` ni ignorándolo desde JS. **Y no lo re-implementes:** `base.css` ya trae el bloque
  que neutraliza transiciones y animaciones. Un `* { transition-duration: 1ms !important }` propio
  encima no agrega nada y pisa el que sí sabe qué componentes tienen que seguir moviéndose.

### 6.6 Logo

Lockup: bombita + anillo de Saturno, y el wordmark `amalgama` en minúscula. SVG con fondo
transparente:

`https://amalgama-static-sites.s3.us-east-1.amazonaws.com/amalgama-logos/svgs/`

| Archivo | Uso |
|---|---|
| `amalgama-logo-navy-text-blue-icon.svg` | **default**, fondos claros |
| `amalgama-logo-navy-text-navy-blue-icon.svg` | fondos claros, más contenido |
| `amalgama-logo-blue-text-blue-icon.svg` | monocromo azul, fondos oscuros/navy |
| `amalgama-logo-white-text-blue-icon.svg` | fondos oscuros con acento de color |
| `amalgama-logo-white-text-white-icon.svg` | monocromo blanco, fondos oscuros |
| `amalgama-icon-{blue,navy,white}.svg` | solo ícono — favicons, avatares, acentos cuadrados |
| `amalgama-wordmark-{blue,navy,white}.svg` | solo wordmark |

**Para que el logo acompañe el modo oscuro, mirá `data-theme`, no `prefers-color-scheme`.** El tema
en Embassy lo maneja el atributo en `<html>`, así que un `<picture>` con `media="(prefers-color-scheme: dark)"`
se queda en la variante equivocada cada vez que alguien cambia el tema a mano. Poné las dos y dejá
que el tema elija:

```html
<img class="logo logo-light" src="…/amalgama-logo-navy-text-blue-icon.svg" alt="Amalgama">
<img class="logo logo-dark"  src="…/amalgama-logo-white-text-blue-icon.svg" alt="" aria-hidden="true">
```
```css
.logo-dark { display: none; }
[data-theme="dark"] .logo-light { display: none; }
[data-theme="dark"] .logo-dark  { display: block; }
```

Es la única excepción razonable a "no escribas reglas por tema": no estás recalibrando tokens, estás
eligiendo entre dos archivos distintos.

Sin variantes con fondo incrustado: si hace falta un fondo, dibujalo con CSS (token navy, esquinas
redondeadas, padding) y poné el SVG transparente encima. Nunca estirar, recolorear, sombrear ni
apoyar sobre patrones. Clearspace ≥ 16px; ancho mínimo 120px en horizontal. Si un caso no está
cubierto, **pedí el archivo — no inventes un nombre ni aproximes el logo a mano.**

### 6.7 Imágenes

**Solo material real:** capturas del producto, fotos del trabajo o del equipo, diagramas propios.
**Nunca** stock, ilustración isométrica, render 3D ni un degradé haciendo de foto — es el default
más reconocible de una página generada, y el que más rápido borra la diferencia entre nosotros y
cualquiera. Si no hay material real, la sección va sin imagen: un bloque bien compuesto se ve mejor
que una foto de banco.

Todas llevan el mismo marco (`.media`: borde de 1px, radio del sistema, sin sombra) y, cuando hace
falta aclarar qué se está viendo, un `.media-caption` en mono. El detalle está en `COMPOSICION.md`
regla 10.

### 6.8 La capa espacial

Amalgama tiene una identidad espacial —fondo profundo con estrellas, un halo, órbitas, planetas—
en `css/space.css`. Va en **nuestras** superficies: el sitio, one-pagers, propuestas, reportes,
decks. **Nunca en un producto de cliente**, ni siquiera de fondo: es la falla `H12` y es
bloqueante. La señal es objetiva — si el proyecto carga un `brand/<cliente>.css`, la marca es de
otro. Condiciones de uso en `COMPOSICION.md` regla 13.

### 6.9 Estrategia de tema

- Hero / landing → banda oscura (`--primary-900` / `-700`).
- Dashboards y herramientas internas → light.
- Tablas y formularios → light, con el token interactivo solo en lo accionable.
- Decks y propuestas de cliente → página light con banda de header oscura.

---

## 7. Usá la API CSS publicada

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@main/css/variables.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@main/css/base.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@main/css/composition.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@main/css/components.css">
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Epilogue:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

**Reglas de la API:**

1. Solo los nombres listados en `PUBLIC-API.md` son públicos. Todo otro selector es interno.
2. **No inspecciones el CSS** buscando selectores internos. El stylesheet se carga al renderizar;
   no hace falta leerlo.
3. Las clases son planas y kebab-case, y los modificadores son aditivos:
   `class="btn-primary btn-danger"`, `class="chip chip-selected"`.
4. El modificador de tamaño ya trae su `border-radius`. Nunca lo agregues inline.
5. Si nada de la lista sirve, **componé con lo que hay o marcá el gap** — no improvises un
   componente que ya existe con otro nombre.

Los que más se equivocan, resueltos de una:

- **Botones** — jerarquía `btn-primary` → `btn-elevated` → `btn-secondary` → `btn-tertiary` →
  `btn-text` → `icon-btn`. **Uno solo `btn-primary` por contexto.** Nunca full-width ni con el
  contenido alineado a la izquierda: eso se lee como un campo de formulario. El disparador de un
  overlay es `btn-secondary` (la acción primaria vive adentro del overlay). El vecino de menor
  prioridad del primario va `btn-tertiary` (outline), no `btn-secondary` (relleno neutro), que pesa
  más. Desde sep-2026 el secundario NO es el tonal de acento: `--color-secondary-container` quedó
  reservado para el estado **seleccionado** (chip, segmented, pagination, toggle, calendar, item de
  menú activo), así que el botón y el item de menú ya no salen del mismo color.
- **Búsqueda** — si filtra una lista que está en esta misma pantalla → `.search-field` dentro del
  `.toolbar`, creciendo con `flex:1` y alineado a la grilla. Si es global, hero, tipo comando, o es
  mobile → `.search-bar` (píldora). **Nunca un `<input>` genérico con placeholder "Buscar".**
- **Badge vs chip** — `badge` es estado de solo lectura; `chip` es interactivo (filtro, selección,
  input). Un chip nunca es un botón de acción.
- **Toast vs alert vs dialog** — `toast/snackbar` confirma un hecho y se va; `alert` es inline y
  persiste hasta que la persona resuelve; `dialog` bloquea una decisión. Destructivo e irreversible
  → Alert Dialog, que **no** se cierra con Escape ni clic afuera, y donde Cancelar tiene el foco.
- **Estados de carga** — `skeleton` si conocés el layout destino y la espera supera ~300ms ·
  `progress` solo si existe un porcentaje real · `spinner` para esperas inline dentro de un control ·
  `empty-state` cuando no hay datos, nunca un spinner eterno. Menos de ~300ms: nada.
- **Sin datos** — `empty-state` de primer uso explica la función y ofrece el CTA de crear;
  `empty-state` de "sin resultados" dice qué se buscó y ofrece limpiar filtros, **sin** CTA de crear.

---

## 8. Rechazá estos reflejos de diseño generado

Nombro los que aparecen una y otra vez. Si tu página tiene alguno, sacalo antes de entregar.

1. **El eyebrow decorativo** — la etiqueta chiquita en mayúsculas arriba del título que no aporta
   información.
2. **Cards anidadas** — una card adentro de otra card adentro de una sección. Elegí un nivel.
3. **Gradientes decorativos, glassmorphism, blobs y sombras de colores.** La mancha que flota, el
   vidrio esmerilado, el degradé arcoíris: nada de eso está en el sistema. **Un degradé sí**, y son
   tres —`--gradient-brand`, `--gradient-surface`, `--gradient-glow`—, construidos con las
   primitivas de la marca. La diferencia es que **un degradé es una superficie**: pinta una banda,
   una tarjeta o un titular grande. Si flota, si difumina lo que tiene detrás o si está para
   rellenar, es esto.
4. **Dos acciones primarias.** Si "las dos son igual de importantes", falló la jerarquía.
5. **Botón full-width, botón con texto a la izquierda.** Y **botón píldora**, salvo que el tema
   de marca del proyecto declare `--radius-button` — ahí la forma la eligió la marca en el
   kickoff y son píldora todos los botones, no uno. Fijate en `brand/<cliente>.css` antes de
   marcarlo.
6. **Emojis como íconos.** Lucide, siempre.
7. **La grilla de tres cards de features** con ícono, título y dos líneas, cuando el contenido no
   son tres cosas paralelas.
8. **Números sin base.** "+40%" sin decir de qué a qué, en qué período, sobre qué muestra.
9. **Un chart cuando alcanzaba una tabla, o al revés.** Tres valores no son un chart.
10. **Color como único portador de significado** en estados, series o alertas.
11. **Texto de página en negro** en vez de navy (`--text-primary`).
12. **Un hex crudo, un px suelto, una familia tipográfica entre comillas.** Siempre hay un token.
13. **Una clase inventada** que "se parece" a una del sistema.
14. **Full-bleed sin ancho máximo** en un monitor ancho: líneas de más de ~120 caracteres.
15. **Solo el happy path.** Sin estado vacío, de carga ni de error, la página no está terminada.
16. **Copy de relleno** — "Bienvenido a nuestra plataforma", "Impulsá tu negocio", "Descubrí más".
17. **Todos los estados visibles a la vez.** Incluirlos es obligatorio; mostrarlos juntos es un
    defecto. El que no corresponde va en el markup con `hidden` y lo prende el runtime. Un alert de
    error arriba de los resultados cargados, o un snackbar clavado sobre la tabla, es esto.
18. **La clase de un componente contenedor puesta en su hijo.** `.search-field`, `.select-wrapper`,
    `.field-input-wrapper` y compañía envuelven; no se le ponen al `<input>` ni al `<select>`. Si lo
    hacés, perdés el ícono, el anillo de foco y el `flex` que hace que el campo crezca — y después
    aparece una utilidad inventada para compensarlo, que es el segundo síntoma del mismo error. El
    markup exacto de cada uno está en `PUBLIC-API.md`: copialo de ahí en vez de deducirlo del nombre.

Y una pregunta para el final: **¿qué superficie, borde, píldora, ícono, label, color, párrafo o
sección se puede sacar sin perder significado?** Sacala.

---

## 9. Accesibilidad y responsive

**Accesibilidad — piso WCAG 2.1 AA, no negociable:**

- Anillo de foco visible en todo lo interactivo (`--color-focus` / `--color-focus-ring`). Nunca
  removerlo.
- `aria-label` obligatorio en controles de solo ícono.
- `role="search"` con nombre accesible en las búsquedas; `aria-live="polite"` en el contador de
  resultados.
- Tablas con semántica real (`<table>`, `<th scope>`), no divs.
- El estado nunca se comunica solo por color: sumá texto o ícono.
- Orden de tabulación lógico; targets ≥ 44px en punteros gruesos.

**Responsive — mobile es una estructura propia, no un desktop encogido.** Escribí primero angosto y
mejorá en `md` (768px) y `lg` (1024px). Las transformaciones canónicas:

| Desktop | Mobile |
|---|---|
| Tabla | Cards apiladas |
| Sidebar | Navigation drawer modal sobre scrim |
| Filtros en toolbar | Bottom sheet de filtros |
| Multi-columna | Una columna, lo más importante primero |
| Afordancias en hover | Siempre visibles |
| `.search-field` | `.search-bar` |
| Acción primaria | `btn-lg` |

---

## 10. Antes de entregar

- [ ] Las seis líneas de la pasada 1 están completas y la página las cumple
- [ ] Una sola acción primaria; el resto baja en la escala
- [ ] Todas las regiones alineadas a una única columna de contenido con ancho deliberado
- [ ] Cero hex crudos, cero px sueltos de tipografía, cero familias entre comillas
- [ ] Cada clase existe en `PUBLIC-API.md`
- [ ] Estados vacío / cargando / error / éxito diseñados
- [ ] Íconos Lucide; solo-ícono con `aria-label`; foco visible
- [ ] Motion desde los tokens; `prefers-reduced-motion` respetado
- [ ] Probado en light **y** dark con `data-theme`, sin ningún override por tema
- [ ] Ningún ítem de §8 presente
- [ ] Idioma correcto según §1
