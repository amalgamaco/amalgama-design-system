# MOBILE.md — cómo se construye una pantalla nativa de Amalgama

Complementa `design.md` y `COMPOSICION.md`. Ahí está **el sistema visual** (color, tipografía,
tokens) y **la composición** (qué forma tiene una superficie nuestra). Acá está lo que cambia
cuando el destino es una **app nativa** en React Native, y —sobre todo— lo que **no** cambia.

Existe porque Embassy nació para escritorio y su escala lo delata: el cuerpo base son **13,5px**,
que es el tamaño del *caption* de iOS. Una app construida con la escala tal cual sale chica y
fuera de norma en las dos plataformas. Eso no es una impresión, es medible, y este archivo lo
resuelve sin tocar nada de web.

**Cómo se lee:** igual que `COMPOSICION.md`. Cada regla dice qué no hacemos, **qué ponemos en su
lugar**, y cómo se verifica. Lo que este archivo pide sale de `tokens/`, que es **generado**: si
una regla no tiene token, todavía no está terminada.

---

## 1. Qué cambia al cruzar a nativo

Tres grupos. Confundirlos es de donde salen las apps que no parecen del mismo sistema.

| | Qué incluye | Por qué |
|---|---|---|
| **No cambia nada** | Los **182 colores** con su dark, los radios, las tres familias tipográficas, la grilla de 4px, la jerarquía primitiva → rol → alias, y **toda la composición que aplica**: eje izquierdo, un overline, el índice de sección, el dato con su base, imágenes reales, sin scroll reveal, cero relleno | Es la marca y es oficio. Un teléfono no cambia de quién es el producto |
| **Cambia de valor, no de nombre** | La escala tipográfica, la densidad (`--row-height`, `--control-height`), el target mínimo y el gutter | Un componente lee `--font-size-body-md` en las dos plataformas y no sabe dónde corre. Cambia el valor, nunca el nombre |
| **No existe en nativo** | El app shell (sidebar + topbar), el hover, el `max-width`, la grilla de 12 columnas, la medida de línea en `ch`, y trece componentes de escritorio (§5) | No hay puntero, no hay ventana que crezca, no hay columna: hay pantalla |

La consecuencia práctica: **una pantalla nativa nuestra se reconoce por lo mismo que una web
nuestra** — cómo está puesta, no por un tamaño de fuente.

---

## 2. La escala nativa

Vive en `css/variables.css`, en el bloque `[data-platform="native"]`, y sale generada a
`tokens/embassy.tokens.ts` como los exports `native` y `nativeDark`.

**No es un tema.** Claro/oscuro es un eje de **color**; escritorio/nativo es un eje de **tamaño**.
Son independientes: una app nativa en dark usa los dos a la vez, por eso hay cuatro exports.

| Token | Web | Nativo | Referencia |
|---|---|---|---|
| `--font-size-display` | 28px | **32px** | iOS large title 34 |
| `--font-size-heading-xl` | 24px | 24px | — |
| `--font-size-heading-lg` | 22px | 22px | Material title-large 22 |
| `--font-size-heading-md` | 18px | **20px** | — |
| `--font-size-heading-sm` | 17px | 17px | Título de nav de iOS |
| `--font-size-heading-xs` | 15px | 15px | — |
| `--font-size-body-lg` | 14px | **17px** | iOS body 17 |
| `--font-size-body-md` — *la base* | 13,5px | **16px** | Material body-large 16 |
| `--font-size-body-sm` | 12,5px | **14px** | — |
| `--font-size-label` | 13px | **15px** | iOS secundario 15 |
| `--font-size-caption` | 12px | **13px** | iOS caption 13 |
| `--font-size-badge` | 11,5px | **11px** | El único que baja: va en pastillas chicas |

El **registro editorial** deja de ser fluido —no hay viewport que crezca— y se congela en
44 / 34 / 28. En tablet se sube un escalón a mano; no hay `clamp()` que lo haga solo.

**Tres cosas de CSS que no existen en React Native**, y que por eso el generador resuelve en vez
de copiar. Están listadas token por token en `tokens/NATIVE-NOTES.md`:

| En CSS | En RN | Regla |
|---|---|---|
| `line-height: 1.5` (multiplicador) | puntos | `lineHeight = fontSize * 1.5` |
| `letter-spacing: -0.02em` | puntos | `letterSpacing = fontSize * -0.02` |
| `clamp(52px, 8vw, 96px)` | no existe | Congelado en el valor de teléfono |
| `color-mix()` | no existe | Ya viene calculado a hex |
| `var()` encadenado | no existe | Ya viene resuelto al valor final |
| `box-shadow` multicapa | no existe | iOS `shadow*`, Android solo `elevation` |
| `linear-gradient` | no existe | `expo-linear-gradient` con los stops resueltos |

**Nunca se escribe un tamaño a mano.** Sale de `native` / `nativeDark`. Un número suelto es falla
`M1`.

---

## 3. Densidad y superficie táctil

Hasta ahora los 44px vivían sueltos dentro de media queries en `components.css`: eran un parche
por archivo, no una decisión. Ahora son tokens.

| Token | Web | Nativo |
|---|---|---|
| `--target-min` | 44px | **48px** |
| `--row-height` | 36px | **48px** |
| `--control-height` | 36px | **48px** |
| `--screen-gutter` | *(no aplica)* | **20px** |

- **48 es un piso, no un tamaño.** Cubre iOS (44) y Android (48) de una. Un control puede ser más
  alto; nunca más bajo. Menos de 48 es falla `M2`.
- **El área tocable no es lo que se ve.** Un ícono de 24px dentro de un `Pressable` de 48 está
  bien; un ícono de 24px que *es* el botón, no. Se resuelve con `hitSlop`, no agrandando el ícono.
- **8px mínimo entre dos targets.** Dos filas de 48 pegadas se tocan mal aunque cada una mida bien.
- **`--screen-gutter` no es `--column-gutter`.** Se llaman distinto a propósito: en nativo no hay
  columna que centrar ni `max-width` que acote, hay una pantalla con margen. Cruzarlos es falla `M6`.
- **La safe area no se hardcodea.** `useSafeAreaInsets()` siempre; un `paddingTop: 44` es falla
  `M3`, porque el notch mide distinto en cada teléfono y no mide nada en Android.

---

## 4. El stack

**NativeWind v5 + Tailwind v4**, con **gluestack v5** como base de los componentes.

Por qué esta combinación y no otra: Tailwind v4 abandonó `tailwind.config.js` y declara los tokens
**en CSS**, con `@theme inline`. Eso hace que el puente desde Embassy sea mecánico en vez de una
transcripción a mano, que es de donde sale el drift.

**Los tokens no se escriben, se generan.** `scripts/build-tokens.mjs` lee `css/variables.css` —que
sigue siendo la única fuente— y emite:

| Archivo | Qué es |
|---|---|
| `tokens/gluestack.config.ts` | `light` y `dark` en triplete RGB sin `rgb()`, para que Tailwind pueda aplicar opacidad (`bg-primary/40`) |
| `tokens/theme.css` | El bloque `@theme inline` que mapea cada color a su utility |
| `tokens/embassy.tokens.ts` | `light`, `dark`, `native`, `nativeDark` tipados, para lo que no sea color |
| `tokens/NATIVE-NOTES.md` | Los tokens que no cruzan 1:1 y qué hacer con cada uno |

`node scripts/build-tokens.mjs --check` falla si `tokens/` quedó atrás del CSS. Va en CI: es lo
único que impide que la app y la web se separen en silencio.

**De gluestack se copia el archivo, no se adopta el sistema.** Su CLI deja el componente en tu
repo y es tuyo (`npx gluestack-ui add button`). Se toma la **estructura y el comportamiento** —
accesibilidad, estados, composición de slots— y se le reemplaza el styling por nuestros tokens.

Es exactamente lo que ya hicimos en web con shadcn: `components/ui/*.tsx` es la estructura de
shadcn con las clases de Embassy y **cero** styling propio (su `cn` es solo `clsx`, sin `twMerge`).

**De gluestack no se adopta nada de esto:** su paleta, sus radios, su escala tipográfica, sus
sombras, su iconografía, ni sus nombres de variante. Si un componente entra con `bg-blue-500`,
`rounded-xl` o `text-sm` sin traducir, es falla `A8` — la misma que ya existe para fugas de
utilidades en web.

---

## 5. El mapa de componentes

Embassy tiene 62 componentes en web. **No se portan 62.** Un tercio son de escritorio y en nativo
el patrón equivalente es *otro*, no una versión chica del mismo.

### Se portan tal cual (mismo componente, otros valores)

`accordion` · `alert` · `attachment` · `avatar` · `badge` · `button` · `calendar` · `card` ·
`carousel` · `checkbox` · `chip` · `collapsible` · `description` · `divider` · `empty-state` ·
`form` · `input-otp` · `item` · `label` · `list` · `person-card` · `placeholder` · `progress` ·
`radio-group` · `search` · `segmented-button` · `select` · `skeleton` · `slider` · `spinner` ·
`stat-card` · `switch` · `tabs` · `toast` · `toggle` · `toggle-group` · `vacancy-card`

### Qué da gluestack, qué cambia de patrón y qué no existe

Adoptar gluestack **no es adoptar componentes listos**. Su catálogo v5 tiene 40 y el nuestro 62, y
el solapamiento es parcial: casi la mitad de nuestro set de trabajo **no existe ahí** y se arma con
primitivas (`Pressable`, `HStack`, `VStack`, `Text`). Conviene saberlo antes, porque es la
diferencia entre "instalamos gluestack y ya está" y el trabajo real. **gluestack ahorra el
comportamiento y la accesibilidad de los que sí están, no el sistema visual de ninguno.**

Las tres tablas de abajo y la página *Components · Nativo* de la doc salen del mismo mapa, que vive
en `scripts/build-mobile-index.mjs`. Escritas a mano en los dos lados, en dos semanas dicen cosas
distintas.

### Se portan tal cual

<!-- BEGIN mobile-map (generado por scripts/build-mobile-index.mjs) -->
| Embassy | gluestack v5 | Notas |
|---|---|---|
| `accordion` | **Accordion** | — |
| `alert` | **Alert** | — |
| `attachment` | **no tiene** — HStack + Icon + Text | — |
| `avatar` | **Avatar** | — |
| `badge` | **Badge** | — |
| `button` | **Button** | Sus variant (solid/outline/link) y action (primary/secondary/positive/negative) NO son nuestras variantes: se mapean a las cinco de Embassy, no se adoptan. |
| `calendar` | **Calendar** | — |
| `card` | **Card** | — |
| `carousel` | **no tiene** — FlatList horizontal con paginado | — |
| `checkbox` | **Checkbox** | — |
| `chip` | **no tiene** — Pressable + Text | Su Badge es de solo lectura, igual que el nuestro: no sirve de chip. Se dibuja a 40 y se toca a 48 con hitSlop. |
| `collapsible` | **Accordion** | — |
| `description` | **no tiene** — VStack + Text | — |
| `divider` | **Divider** | — |
| `empty-state` | **no tiene** — VStack + Text + Button | — |
| `form` | **Input + FormControl** | FormControl trae label, helper y error: es más que nuestro field-group. |
| `input-otp` | **no tiene** — HStack de Input con teclado numérico | — |
| `item` | **no tiene** — HStack + Text | — |
| `label` | **FormControl** | — |
| `list` | **no tiene** — FlatList + Pressable | — |
| `person-card` | **no tiene** — HStack + Avatar + Text | — |
| `placeholder` | **Skeleton** | — |
| `progress` | **Progress** | — |
| `radio-group` | **Radio** | — |
| `search` | **no tiene** — Input + Icon | — |
| `segmented-button` | **no tiene** — HStack de Pressable, o Tabs re-skinneado | — |
| `select` | **Select** | En nativo abre un actionsheet, no un popover. |
| `skeleton` | **Skeleton** | — |
| `slider` | **Slider** | — |
| `spinner` | **Spinner** | — |
| `stat-card` | **no tiene** — Card + Text con los tokens de .figure | — |
| `switch` | **Switch** | — |
| `tabs` | **Tabs** | — |
| `toast` | **Toast** | — |
| `toggle` | **no tiene** — Pressable con estado | Se dibuja a 40 y se toca a 48. |
| `toggle-group` | **no tiene** — HStack de Pressable | — |
| `vacancy-card` | **Card** | — |

### Cambian de patrón · 23

| Web | En nativo | Por qué |
|---|---|---|
| `back-link` | El back del stack navigator | La jerarquía la lleva el navegador, no la pantalla |
| `breadcrumb` | El back del stack navigator | Una ruta completa no entra ni se lee en 390px |
| `button-group` | Segmented button, o botones apilados a lo ancho | Botones pegados de costado no llegan al piso táctil |
| `chart` | El mismo dato con menos series y sin leyenda flotante | Una leyenda flotante tapa el gráfico en pantalla chica |
| `combobox` | Sheet con búsqueda (`Actionsheet + Input`) | El popover con filtro es un patrón de puntero |
| `command` | Pantalla de búsqueda completa | El ⌘K es de teclado |
| `context-menu` | Actionsheet, con long-press (`Actionsheet`) | No hay click derecho |
| `create-form` | Pantalla propia, nunca un modal | Un formulario dentro de un modal en 390px es una trampa |
| `data-table` | Lista de filas apiladas (label: valor) o card por registro | Una tabla en 390px se scrollea de costado y nadie lo hace |
| `date-picker` | El Calendar docked en un bottom sheet (`DateTimePicker`) | El popover chico es de escritorio |
| `dropdown-menu` | Actionsheet (`Menu · Actionsheet`) | No hay menú flotante |
| `input-group` | Campos apilados | Un input con addon de costado no entra |
| `kanban` | Segmented button + una columna a la vez | Tres columnas en 390px no son tres columnas |
| `menubar` | Tab bar + stack | No existe barra de menú en una app |
| `modal` | Pantalla completa o bottom sheet (`Modal · Actionsheet`) | Un diálogo chico centrado se siente web |
| `navigation-menu` | Tab bar + stack | La navegación la lleva el navigator |
| `page-header` | El header del stack navigator | El título de pantalla lo pone la navegación |
| `pagination` | Scroll infinito o “cargar más” | Paginar con números es de escritorio |
| `popover` | Bottom sheet, o el contenido inline (`Actionsheet`) | Un popover necesita un ancla y espacio alrededor |
| `scroll-area` | ScrollView / FlatList | El scroll lo maneja la plataforma |
| `sheet` | Bottom sheet (`Actionsheet · BottomSheet`) | El sheet lateral es un patrón de escritorio |
| `table` | Filas apiladas (label: valor) | Una tabla en 390px no se lee |
| `toolbar` | Header nativo + barra de acción abajo | Lo importante va al alcance del pulgar |

### No existen sin puntero · 2

| Web | Por qué no |
|---|---|
| `rich-tooltip` | Ídem tooltip. Si tiene tanto contenido que necesita título y acciones, es un bottom sheet |
| `tooltip` | Necesita hover, y en un teléfono no hay hover. Si el dato hace falta, va inline |

<!-- END mobile-map -->

---

## 5b. Verlo antes de que exista

Un `.tsx` no se puede mirar sin un proyecto y un simulador, así que una pantalla nativa entregada
solo como código es una pantalla que nadie revisó. `css/preview-native.css` da el marco de teléfono
a 390px:

```html
<link rel="stylesheet" href="css/preview-native.css">

<div class="phone-row">
  <figure class="phone" data-platform="native">
    <div class="phone-status"></div>
    <header class="phone-nav">…</header>
    <div class="phone-screen"><!-- la pantalla, con los componentes de Embassy sin cambios --></div>
    <nav class="phone-tabbar">…</nav>
  </figure>
</div>
```

**No es un mockup.** Adentro van los mismos `btn-primary`, `chip` y `field-input` que en web; lo
único que cambia es que `data-platform="native"` hace que los tokens resuelvan a los valores de
teléfono. Verificado: el botón pasa de 34 a 48 y el campo de 38 a 48 con el mismo HTML.

- `preview-native.css` **no es opcional**: sin él los controles se dibujan a la altura de
  escritorio y el preview miente. Es `M2` y es bloqueante.
- Nada de estructura de página adentro — `.grid-12`, `.column-*`, `max-width`, `ch` — es `M6`.
- **390px no se cambia** para que algo entre. Si no entra en 390, no entra en un teléfono.
- Para oscuro, `data-theme="dark"` **además** de `data-platform="native"`: son dos ejes
  independientes y se combinan.
- `data-targets` en el marco dibuja el contorno de cada superficie tocable, para contar a ojo lo
  que `M2` cuenta en el chequeo.

**Lo que el preview no muestra**, y hay que decirlo cuando se pide aprobación: la sombra de Android
(`elevation`), el ripple, el rebote del scroll, el teclado del sistema y las fuentes reales del
dispositivo. Para eso hace falta el simulador.

Quién lo emite: `artifact` cuando no hay proyecto —para diseñar y aprobar antes de que haya
código— y `screen` al lado del `.tsx` cuando el proyecto existe.

---

## 6. Composición en un teléfono

Casi todo `COMPOSICION.md` sigue valiendo. Lo que cambia:

- **No hay grilla de 12.** `.grid-12` es web. En nativo es una columna, y la jerarquía la hace el
  ritmo vertical y el peso tipográfico, no las columnas.
- **No hay `max-width`.** El ancho es el de la pantalla menos `--screen-gutter` de cada lado.
- **La medida de línea no se mide en `ch`.** El gutter ya la acota; si un texto largo igual queda
  incómodo, se acorta el texto, no se agrega un `maxWidth` arbitrario.
- **Una sola apertura editorial por pantalla**, igual que en web (`H9`). En un teléfono se nota más.
- **Un overline por pantalla** (`H7`). Sigue siendo un clasificador, no textura.
- **El índice de sección sigue siendo nuestro gesto** y es lo más barato de conservar: es mono,
  chico y no depende del ancho.
- **Sin reveal al scrollear** (`H11`). En nativo es peor: cuesta frames.
- **La capa espacial sigue siendo solo de Amalgama** (`H12`). Una app de cliente no lleva planetas.

---

## 7. Antes de entregar

- [ ] Ningún tamaño escrito a mano: todo sale de `native` / `nativeDark`
- [ ] Todo lo tocable mide 48 o más, y hay 8px entre targets
- [ ] `useSafeAreaInsets()` arriba y abajo, sin números fijos
- [ ] Dark probado de verdad, no asumido
- [ ] Ningún patrón de escritorio encogido (§5)
- [ ] `node scripts/build-tokens.mjs --check` pasa
- [ ] Se ve en las dos plataformas: iOS y Android no dibujan igual sombras, fuentes ni ripple

---

## Fallas

Las fallas propias de nativo están en `FAILURES.md`, grupo **M**. Las de las otras familias
—tokens, jerarquía, accesibilidad, reflejos de IA— aplican igual: una app no se audita distinto
que una pantalla web.
