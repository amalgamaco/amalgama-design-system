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
Cobertura de los que se portan tal cual: **23 de 37 en gluestack · 29 de 37 en Flutter**. La diferencia no es
casual: Material 3 es una biblioteca completa y gluestack no.

| Embassy | React Native (gluestack) | Flutter (Material 3) | Notas |
|---|---|---|---|
| `accordion` | **Accordion** | **ExpansionTile** | — |
| `alert` | **Alert** | **MaterialBanner** | — |
| `attachment` | ✗ — HStack + Icon + Text | ✗ — HStack + Icon + Text | — |
| `avatar` | **Avatar** | **CircleAvatar** | — |
| `badge` | **Badge** | **Badge** | — |
| `button` | **Button** | **FilledButton · OutlinedButton · TextButton** | Sus variant (solid/outline/link) y action (primary/secondary/positive/negative) NO son nuestras variantes: se mapean a las cinco de Embassy, no se adoptan. |
| `calendar` | **Calendar** | **CalendarDatePicker** | — |
| `card` | **Card** | **Card** | — |
| `carousel` | ✗ — FlatList horizontal con paginado | ✗ — FlatList horizontal con paginado | — |
| `checkbox` | **Checkbox** | **Checkbox** | — |
| `chip` | ✗ — Pressable + Text | **FilterChip · ActionChip** | Su Badge es de solo lectura, igual que el nuestro: no sirve de chip. Se dibuja a 40 y se toca a 48 con hitSlop. |
| `collapsible` | **Accordion** | **ExpansionTile** | — |
| `description` | ✗ — VStack + Text | ✗ — VStack + Text | — |
| `divider` | **Divider** | **Divider** | — |
| `empty-state` | ✗ — VStack + Text + Button | ✗ — VStack + Text + Button | — |
| `form` | **Input + FormControl** | **TextField + InputDecoration** | FormControl trae label, helper y error: es más que nuestro field-group. |
| `input-otp` | ✗ — HStack de Input con teclado numérico | ✗ — HStack de Input con teclado numérico | — |
| `item` | ✗ — HStack + Text | **ListTile** | — |
| `label` | **FormControl** | **InputDecoration.labelText** | — |
| `list` | ✗ — FlatList + Pressable | **ListView + ListTile** | — |
| `person-card` | ✗ — HStack + Avatar + Text | **ListTile + CircleAvatar** | — |
| `placeholder` | **Skeleton** | ✗ — undefined | — |
| `progress` | **Progress** | **LinearProgressIndicator** | — |
| `radio-group` | **Radio** | **Radio · RadioListTile** | — |
| `search` | ✗ — Input + Icon | **SearchBar** | — |
| `segmented-button` | ✗ — HStack de Pressable, o Tabs re-skinneado | **SegmentedButton** | — |
| `select` | **Select** | **DropdownMenu** | En nativo abre un actionsheet, no un popover. |
| `skeleton` | **Skeleton** | ✗ — undefined | — |
| `slider` | **Slider** | **Slider** | — |
| `spinner` | **Spinner** | **CircularProgressIndicator** | — |
| `stat-card` | ✗ — Card + Text con los tokens de .figure | ✗ — Card + Text con los tokens de .figure | — |
| `switch` | **Switch** | **Switch** | — |
| `tabs` | **Tabs** | **TabBar** | — |
| `toast` | **Toast** | **SnackBar** | — |
| `toggle` | ✗ — Pressable con estado | **IconButton.filled** | Se dibuja a 40 y se toca a 48. |
| `toggle-group` | ✗ — HStack de Pressable | **ToggleButtons** | — |
| `vacancy-card` | **Card** | **Card** | — |

### Cambian de patrón · 23

| Web | En nativo | De dónde sale | Por qué |
|---|---|---|---|
| `back-link` | El back del stack navigator | RN ✗ · FL `Navigator.pop` | La jerarquía la lleva el navegador, no la pantalla |
| `breadcrumb` | El back del stack navigator | RN ✗ · FL `AppBar` | Una ruta completa no entra ni se lee en 390px |
| `button-group` | Segmented button, o botones apilados a lo ancho | RN ✗ · FL `SegmentedButton` | Botones pegados de costado no llegan al piso táctil |
| `chart` | El mismo dato con menos series y sin leyenda flotante | RN ✗ · FL ✗ | Una leyenda flotante tapa el gráfico en pantalla chica |
| `combobox` | Sheet con búsqueda | RN `Actionsheet + Input` · FL `SearchAnchor` | El popover con filtro es un patrón de puntero |
| `command` | Pantalla de búsqueda completa | RN ✗ · FL `SearchAnchor` | El ⌘K es de teclado |
| `context-menu` | Actionsheet, con long-press | RN `Actionsheet` · FL `MenuAnchor · showModalBottomSheet` | No hay click derecho |
| `create-form` | Pantalla propia, nunca un modal | RN ✗ · FL `Route propia` | Un formulario dentro de un modal en 390px es una trampa |
| `data-table` | Lista de filas apiladas (label: valor) o card por registro | RN ✗ · FL `ListView + ListTile` | Una tabla en 390px se scrollea de costado y nadie lo hace |
| `date-picker` | El Calendar docked en un bottom sheet | RN `DateTimePicker` · FL `showDatePicker` | El popover chico es de escritorio |
| `dropdown-menu` | Actionsheet | RN `Menu · Actionsheet` · FL `MenuAnchor` | No hay menú flotante |
| `input-group` | Campos apilados | RN ✗ · FL `Column` | Un input con addon de costado no entra |
| `kanban` | Segmented button + una columna a la vez | RN ✗ · FL `SegmentedButton` | Tres columnas en 390px no son tres columnas |
| `menubar` | Tab bar + stack | RN ✗ · FL `NavigationBar` | No existe barra de menú en una app |
| `modal` | Pantalla completa o bottom sheet | RN `Modal · Actionsheet` · FL `showModalBottomSheet · showDialog` | Un diálogo chico centrado se siente web |
| `navigation-menu` | Tab bar + stack | RN ✗ · FL `NavigationBar` | La navegación la lleva el navigator |
| `page-header` | El header del stack navigator | RN ✗ · FL `AppBar` | El título de pantalla lo pone la navegación |
| `pagination` | Scroll infinito o “cargar más” | RN ✗ · FL ✗ | Paginar con números es de escritorio |
| `popover` | Bottom sheet, o el contenido inline | RN `Actionsheet` · FL `showModalBottomSheet` | Un popover necesita un ancla y espacio alrededor |
| `scroll-area` | ScrollView / FlatList | RN ✗ · FL `ListView` | El scroll lo maneja la plataforma |
| `sheet` | Bottom sheet | RN `Actionsheet · BottomSheet` · FL `showModalBottomSheet` | El sheet lateral es un patrón de escritorio |
| `table` | Filas apiladas (label: valor) | RN ✗ · FL ✗ | Una tabla en 390px no se lee |
| `toolbar` | Header nativo + barra de acción abajo | RN ✗ · FL `AppBar + BottomAppBar` | Lo importante va al alcance del pulgar |

### No existen sin puntero · 2

| Web | Por qué no |
|---|---|
| `rich-tooltip` | Ídem tooltip. Si tiene tanto contenido que necesita título y acciones, es un bottom sheet |
| `tooltip` | Necesita hover, y en un teléfono no hay hover. Si el dato hace falta, va inline |

<!-- END mobile-map -->

---

## 5a. Las librerías — una por stack, un solo criterio

Amalgama hace apps en **los dos stacks según el proyecto**, así que la capa de componentes tiene dos
destinos. Lo que **no** se duplica es nada de lo anterior: los tokens, la escala, la densidad, los
patrones y las fallas son los mismos. Si algún día una de las dos capas necesita un valor que no
está en los tokens, el que está mal es el token, no la capa.

|  | React Native | Flutter |
|---|---|---|
| Tokens | `tokens/embassy.tokens.ts` | `tokens/embassy_tokens.dart` |
| Puente | `components/native/lib/theme.ts` | `components/flutter/embassy_theme.dart` |
| Componentes | `components/native/*.tsx` — los ocho, escritos | **el `ThemeData`** — los widgets los pone Material 3 |
| Base externa | gluestack v5, copy-paste | Material 3, incluido en Flutter |
| Cobertura del set de trabajo | 23 de 37 | **29 de 37** |

**La asimetría es real y conviene entenderla antes de elegir.** En Flutter el `ThemeData` *es* la
librería: Material 3 ya trae los widgets con su comportamiento y su accesibilidad, y lo único que
falta es que se vean como Amalgama — eso se decide una vez en `embassy_theme.dart` y listo. En
React Native no existe ese piso: gluestack no llega a la mitad del set, así que hay que escribir
los componentes, y por eso `components/native/` tiene ocho archivos y `components/flutter/` uno.

Una diferencia técnica que importa al escribir: **`TextStyle.height` de Flutter sí es un múltiplo
del `fontSize`**, así que los line-height van tal cual. En RN hay que multiplicar, y no hacerlo es
la falla `M7` — que por eso **no** aplica en Dart y el chequeo no la marca ahí.

### La librería de React Native

`components/native/` es el análogo de `components/ui/*.tsx`: **copy-paste, no
dependencia.** Se copia la carpeta al proyecto y es suya.

| | Web | Nativo |
|---|---|---|
| Estilo | `css/components/*.css` | los tokens, aplicados en el `StyleSheet` de cada componente |
| Estructura | `components/ui/*.tsx` (cva sobre las clases) | `components/native/*.tsx` |
| Puente | `components/lib/utils.ts` (`cn`) | `components/native/lib/theme.ts` (`px`, `family`, `lh`, `useEmbassy`) |

La primera tanda son ocho —`Button`, `Chip`, `Field`, `Card`, `ListItem`,
`Sheet`, `Toast`, `Tabs`— y con eso se arma una pantalla entera. Sin provider:
`useEmbassy()` lee `useColorScheme()` y devuelve `native` o `nativeDark`.

Dependen de `react-native` y, `Sheet` y `Toast`, de `react-native-safe-area-context`.
**No dependen de gluestack ni de NativeWind:** cuando el proyecto los sume, se
copian sus componentes para lo que acá no está y se les reemplaza el styling
por estos mismos tokens.

`check-output` corre sobre ellos y da 0 hallazgos. Lo que **no** está verificado
es que se dibujen bien: nunca corrieron en un simulador. Eso es `M9` y es la
primera tarea del proyecto RN. Detalle completo en `components/native/README.md`.

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

### Y en Flutter, el preview va con los componentes reales

Del lado Flutter hay algo mejor que nuestro CSS: **`@material/web`**, la implementación en web
components de Material 3 que hace Google. Se carga por CDN, sin build, y **no hay puente que
escribir** — `css/md-sys-bridge.css` ya expone los 36 roles `--md-sys-color-*` como alias de los
`--color-*` de Embassy, que es exactamente lo que Material Web lee. El archivo se había escrito en
junio 2026 anticipando esto y quedó sin usarse hasta ahora.

```html
<link rel="stylesheet" href="css/variables.css">
<link rel="stylesheet" href="css/md-sys-bridge.css">
<script type="importmap">
{ "imports": { "@material/web/": "https://esm.run/@material/web/" } }
</script>
<script type="module">import '@material/web/all.js';</script>
```

Adentro del marco van los `<md-*>` en vez de nuestras clases. Ejemplo andando en
`demos/material-preview.html`.

**Por qué solo del lado Flutter.** Los widgets conservan la anatomía de Material —state layers,
ripple, formas, densidades— que nuestro CSS no reproduce, así que ahí suma fidelidad real. En React
Native no sumaría nada: los componentes de gluestack **se re-skinnean con nuestros tokens igual**,
así que el preview con el CSS de Embassy ya es tan fiel como sería un gluestack sin tematizar. Y
gluestack no puede renderizar en un navegador sin `react-native-web` y un bundler.

**Tres límites, dichos de frente:**

- Cubre ~18 componentes (button, checkbox, radio, switch, slider, textfield, select, tabs, menu,
  list, chips, dialog, progress, divider, icon, iconbutton, fab), no los 62.
- El proyecto dice en su README *"maintenance mode pending new maintainers"*, aunque publicó 2.5.0
  en julio de 2026 y sigue sacando nightlies. Vivo, sin dueño claro.
- **Material Web no es el Material de Flutter.** Misma especificación, implementaciones distintas:
  es un preview fiel del *espec*, no del render exacto de la app.

---

Quién lo emite: `artifact` cuando no hay proyecto —para diseñar y aprobar antes de que haya
código— y `screen` al lado del `.tsx` cuando el proyecto existe.

---

## 6. Composición de una pantalla

Esta sección existe porque durante mucho tiempo dijo solamente lo que NO cruza de la web, y
eso alcanzaba para evitar una grilla de 12 en un teléfono pero no para que la pantalla se
pareciera a una app. Se escribió comparando la misma pantalla en tres versiones: la que salía
del sistema, una hecha con convenciones de app sin ninguna restricción, y esa misma estructura
con nuestros tokens. La tercera y la segunda se parecen; la primera no se parecía a ninguna.
Lo que sigue es lo que la segunda tenía y el sistema no nombraba.

### 6a. Lo que no cruza de la web

- **No hay grilla de 12.** `.grid-12` es web. En nativo es una columna, y la jerarquía la hace
  el ritmo vertical y el peso tipográfico, no las columnas.
- **No hay `max-width`.** El ancho es el de la pantalla menos `--screen-gutter` de cada lado.
- **La medida de línea no se mide en `ch`.** El gutter ya la acota; si un texto largo igual queda
  incómodo, se acorta el texto, no se agrega un `maxWidth` arbitrario.
- **Sin reveal al scrollear** (`H11`). En nativo es peor: cuesta frames.
- **La capa espacial sigue siendo solo de Amalgama** (`H12`). Una app de cliente no lleva planetas.

### 6b. Cómo se compone una pantalla de app

Ocho convenciones. No son estéticas —no dependen de la paleta ni de si el botón lo pinta
Material, gluestack o nuestro CSS— son la gramática de una pantalla de app, y cada una tiene
falla con nombre.

**1 · La jerarquía la hace la superficie, no la línea** (`M10`)
Escalón 2 de la escalera de separación (`COMPOSICION.md` Parte I §D), aplicado acá: el fondo de
la pantalla es `--color-surface`; cada bloque de contenido va en `--color-surface-container` con
`--screen-radius` y un borde de 1px en `--color-outline-variant`. Un `<hr>` separando secciones
es un reflejo de web.

**2 · Lo que es una lista va en una lista agrupada** (`M11`)
Un conjunto de pares etiqueta/dato va DENTRO de una tarjeta, no suelto sobre el fondo. Los
divisores van sólo ENTRE filas —nunca antes de la primera ni después de la última— y arrancan
donde arranca el texto: `margin-left` igual al padding de la tarjeta, no a sangre. Un divisor a
sangre corta la tarjeta en dos; uno insetado la lee como una lista.

**3 · El header de sección va afuera del grupo** (`M12`)
`--font-size-caption`, peso 600, `--text-muted`, 8px de aire abajo, alineado al borde del grupo.
No es un `heading-md` adentro de la tarjeta: adentro compite con los datos y gana la etiqueta,
que es justamente lo que no queremos. Si la sección tiene una acción de escape ("Ver todas"),
va en esa misma línea, a la derecha.

**4 · La fila tiene anatomía, y el dato pesa más que su etiqueta** (`M13`)
Alto mínimo 52 —`--row-height` es el piso de 48, una fila de lista respira un poco más—. De
izquierda a derecha: ícono guía opcional, la etiqueta, y el dato a la derecha.

**Los dos van al mismo tamaño —`--font-size-label`, 15— y los separa el peso, no el cuerpo:**
etiqueta en 400 sobre `--text-muted`, dato en **600** sobre `--text-primary`. Es importante que
sea así y no con dos tamaños distintos: el color solo no alcanza. Medido, la distancia entre
`--text-muted` y `--text-primary` es 3.10:1, y aclarar el gris hasta el techo de AA sobre el fondo
solo la lleva a 3.29 — el salto que falta lo da el peso. Dos tamaños distintos en la misma fila,
en cambio, desalinean la línea base y la lista deja de leerse como tabla.

**La inversión de este orden es la falla más frecuente que produce el sistema**: una pantalla
que grita los nombres de los campos y susurra los valores. Quien mira vino a leer el dato.

**4b · La escala de una pantalla, rol por rol**

Todo sale de la escala nativa de §2; acá está qué rol usa cada cosa y con qué peso, que es lo
que no estaba escrito. Los pesos importan tanto como los tamaños.

| Dónde | Token | Peso | Color |
|---|---|---|---|
| Título de la barra | `--font-size-heading-sm` · 17 | 600 | `--text-primary` |
| Nombre en el ancla | `--font-size-heading-lg` · 22 | 600 | `--color-on-primary` |
| Meta bajo el nombre | `--font-size-caption` · 13 | 400 | apagado sobre el ancla |
| Pill de estado | `--font-size-caption` · 13 | 600 | el container que corresponda |
| Número principal | `--font-size-heading-xl` · 24 | 700 | `--color-on-primary` |
| Su unidad | `--font-size-label` · 15 | 500 | apagado |
| Monto en una tarjeta | `--font-size-heading-md` · 20 | 700 | `--text-primary` |
| Header de sección | `--font-size-caption` · 13 | 600 | `--text-muted` |
| **Etiqueta de fila** | `--font-size-label` · 15 | **400** | `--text-muted` |
| **Dato de fila** | `--font-size-label` · 15 | **600** | `--text-primary` |
| Acción secundaria en línea («Ver», «Ver todas») | `--font-size-caption` · 13 | 600 | `--text-primary` |
| Botón primario | `--font-size-body-md` · 16 | 600 | `--color-on-primary` |

El botón primario va a `--control-height` (48) y a `--radius-button`, que en nativo el bloque
`[data-platform="native"]` declara en **14**: a 8 se lee como un botón de escritorio pegado
adentro de una app, y a 14 queda apenas por dentro de los grupos, que van a `--screen-radius`
(16 en nativo). **La regla es «un escalón por dentro del grupo», no «14»**: si se mueve
`--screen-radius`, este valor se mueve con él. Es el único valor de forma fuera de la escala
4·8·12·16 del sistema, y el porqué largo está en `css/variables.css` §«Forma del botón».

**La acción secundaria en línea es una píldora chica, y no se dibuja a 48.** Va al mismo cuerpo
que la pill de estado —caption, 13— porque son la misma clase visual: dos píldoras en la misma
pantalla a dos tamaños distintos se leen como un error. Se dibuja a **36** de alto y **llega a 48
por superficie táctil**, con el patrón de §3: `hitSlop` en React Native, `::after` en el preview,
`materialTapTargetSize` en Flutter. Dibujarla a 48 la convierte en un botón y le compite a la
acción primaria; dibujarla a 36 y dejarla ahí es `M2`, que es bloqueante. Las dos cosas son
frecuentes y las dos están mal.

**5 · Arriba va un ancla, con la superficie invertida**
Identidad y estado entran juntos en un bloque de `--color-primary` con texto en
`--color-on-primary` y el acento en `--color-primary-container`. Adentro: avatar, nombre en
`--font-size-heading-lg`, una línea de meta en `--font-size-caption`, el estado como pill, y el
número que de verdad importa con su barra de progreso. Ese bloque es lo que hace que la pantalla
se lea como una app y no como un documento: da un punto de entrada antes del contenido, y
concentra la identidad en un solo lugar en vez de espolvorearla.

**6 · La acción primaria se ancla abajo** (`M14`)
Fuera del scroll, con `--screen-gutter` a los lados y aire de safe area debajo. Un botón al final
del contenido obliga a scrollear para poder actuar, y en una lista larga desaparece.

**7 · El mono no entra a la UI** (`M15`)
`--font-mono` en una pantalla nativa sirve para datos tabulares que se comparan en columna, y
para nada más. En prosa, en captions, en fechas sueltas o como gesto de marca parte líneas a la
mitad y se lee como una terminal. El índice de sección en mono es un gesto de página, no de
pantalla — ver 6d.

**8 · El ícono es wayfinding, no decoración**
Un ícono al principio de una fila ayuda a encontrarla en una lista larga: 18–20px con
`--icon-stroke`, dentro de un contenedor de 36 en `--color-*-container`. Un ícono arriba del
título de cada tarjeta, en cambio, es `H8` y sigue siéndolo en un teléfono.

### 6c. El bloque de decisión, antes de maquetar

Igual que el bloque de página de `design.md` §4, pero para una pantalla. Cinco líneas,
escritas antes del primer tag. Si no podés completar una, estás adivinando.

```
SUPERFICIE  pantalla: surface        bloques: surface-container    ← el escalón, no la línea
ANCLA       <qué entra en el bloque invertido de arriba, y cuál es el número que importa>
GRUPOS      <cada grupo = una tarjeta>   headers afuera, caption/600/muted
FILA        etiqueta y dato al MISMO cuerpo (label) · los separa el peso: 400 vs 600 · alto ≥ 52
ACCIÓN      primaria: <una sola>     anclada abajo, fuera del scroll
```

**Las cuatro que más se rompen solas, en orden de frecuencia.** Es el orden en el que conviene
revisarlas, y el que las skills citan en vez de repetir:

1. **El dato tiene que pesar más que su etiqueta** (`M13`). Una pantalla que grita los nombres de
   los campos y susurra los valores es el default del sistema, no un descuido.
2. **Los grupos van en tarjeta, con el divisor insetado al padding**, nunca a sangre (`M11`).
3. **El header de sección va afuera del grupo**, en caption apagado — no adentro, en escala de
   heading (`M12`).
4. **El mono no entra a la UI**: ni en captions, ni en fechas, ni como gesto de marca (`M15`).

### 6d. Dónde vive la identidad en una pantalla

Hay que decirlo derecho porque es contraintuitivo: **el índice de sección en mono y la apertura
editorial no sobreviven a un teléfono.** Son gestos de página —nacieron para una portada, un
reporte, una propuesta— y aplicados a una pantalla de producto la vuelven un documento. La
comparación que originó esta sección lo mostró sin ambigüedad: la versión con más identidad
declarada era la que menos se parecía a una app.

En nativo la identidad vive en otras tres cosas, y alcanzan:

- **El color**, sobre todo el bloque ancla invertido: una pantalla que abre con
  `--color-primary` a sangre ya dice de quién es antes de que se lea una palabra.
- **La tipografía**: `--font-heading` en el nombre y en los números, `--font-body` en todo lo
  demás. El par ya es reconocible.
- **La densidad y el radio**: los ocho tokens `--screen-*` de §6e. Dos apps con la misma
  estructura y distinta densidad no se confunden —y esa es exactamente la superficie de ajuste
  que cada equipo tiene.

Una pantalla nativa de Amalgama no lleva overline, no lleva índice de sección y no lleva mono
decorativo. Eso no es perder identidad: es ponerla donde en una app se ve.

---

### 6e. Qué puede ajustar cada proyecto, y qué no

El patrón es uno solo; **la densidad con la que se dibuja es de cada app.** Una app de consumo
respira más que una de back-office, y forzar a las dos al mismo número garantiza que una de las
dos lo abandone. Así que la superficie de ajuste está declarada: son ocho tokens en el bloque
`[data-platform="native"]`, y un proyecto los redeclara en su capa de marca sin salirse de nada.

| Token | Default | Qué mueve |
|---|---|---|
| `--screen-block-gap` | 20px | El aire entre el ancla, las secciones y los grupos |
| `--screen-block-padding` | 18px | El interior del ancla |
| `--screen-group-padding` | 16px | El interior de un grupo — y con él, el inset del divisor |
| `--screen-row-height` | 52px | La fila de etiqueta/dato |
| `--screen-item-height` | 60px | La fila con ícono guía |
| `--screen-item-icon` | 36px | El contenedor del ícono guía |
| `--screen-item-gap` | 13px | Entre el ícono y el texto |
| `--screen-radius` | `--radius-xl` | El radio del ancla y de los grupos |

El inset del divisor de una fila con ícono **se calcula** —padding + ícono + gap— y no se escribe:
así sigue alineado después de que alguien cambie cualquiera de los tres.

**Lo que no se mueve desde acá**, porque no es densidad:

- **`--target-min`.** Es accesibilidad. Un proyecto puede querer filas más bajas; la superficie
  táctil sigue siendo 48 y se alcanza con `hitSlop` o `::after`. Bajar `--screen-row-height` por
  debajo de 48 es válido *si* la fila es sólo lectura; si se toca, es `M2`.
- **Los pesos de la fila.** 400 contra 600 no es una preferencia: la separación por color tiene un
  techo de 3,29:1 y sin el peso la fila deja de leerse. Cambiarlo es `M13`.
- **El orden dato/etiqueta, el header afuera del grupo, el divisor insetado, la acción anclada.**
  Son el patrón, no su densidad.

Un espaciado interno chico —los 16 de un `gap`, los 8 debajo de un header— queda fijo a
propósito: es ritmo tipográfico, no densidad, y volverlo ajustable invita a desarmarlo sin
motivo.

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
