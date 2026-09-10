# COMPOSICION.md — cómo se compone una página de Amalgama

Complementa `design.md`. Ahí está **el sistema visual** (color, tipografía, tokens); acá está
**la composición**: qué forma tiene una página nuestra y qué formas no usamos.

Existe porque el sistema visual solo no alcanza. Con tokens correctos y componentes correctos
todavía se puede armar la misma página que arma cualquiera: hero centrado, tres tarjetas con
ícono, banda, footer. `design.md` §1 pide que lo que publiquemos **no parezca una landing SaaS
genérica** — este archivo lo hace verificable.

**Cómo se lee:** cada regla dice qué no hacemos, **qué ponemos en su lugar**, y cómo se verifica.
Una prohibición sin reemplazo vuelve siempre, porque a la hora de llenar la sección hay que poner
algo. Todo lo que este archivo pide **está construido en `css/composition.css`**: si una regla no
tiene clase, es que todavía no está terminada.

## Alcance — qué aplica dónde

Hay **dos ejes**, y conviene no confundirlos.

**Primero, de quién es la marca.** La Parte I es la firma de **Amalgama**: va en lo nuestro y en lo
que firmamos —propuestas, reportes, nuestro sitio, demos—. En un producto white-label la firma es
la del cliente, así que ahí rige solo la Parte II, que no es identidad sino oficio: no parecer
generado.

**Segundo, qué clase de superficie es.** No es el tamaño de pantalla: un dashboard y una landing se
ven los dos en una pantalla grande y no se componen igual.

| | **Página** (landing, propuesta, reporte, one-pager, demo) | **Producto** (pantallas adentro del app shell) |
|---|---|---|
| Estructura y ancho (regla 0) | Sí — se elige una y se dice cuál | Sí, para la columna de contenido adentro del shell. `bleed` casi nunca: un dashboard denso lo quiere, un formulario no |
| Grilla de 12 | Sí | Sí |
| Medida de línea (`.measure`) | Sí | Sí, en todo texto corrido |
| Registro editorial (regla 0b) | Sí, una vez | **No.** Una pantalla de producto abre con `page-title` |
| Overline (regla 1) | Sí, una vez | Con cuidado: el header de tabla y el badge ya son versalitas. Si ya hay dos, no agregues una tercera |
| Índice de sección (eje E) | Sí — es el gesto | **No.** Numerar las secciones de un panel de administración es decoración |
| Ritmo (regla 6) | Sí, y es donde más se nota | Menos: adentro del shell el ritmo lo dan las tarjetas y la densidad del cliente |
| Línea de separación (`.rule`) | Sí, en vez de bandas | A veces. En un dashboard las tarjetas ya separan |
| Hero con el control (regla 3) | Sí | No aplica: la pantalla **es** la herramienta |
| Tres tarjetas con ícono (regla 4) | Prohibida | Prohibida |
| Ubicación del ícono (regla 5) | Sí | Sí — y en producto es donde más se abusa del ícono decorativo |
| Alineación a la izquierda (regla 2) | Sí | Sí |
| Sin sombra salvo lo que flota (regla 7) | Sí | Sí |
| Imágenes: solo material real (regla 10) | Sí | Sí |
| Sin scroll reveal (regla 11) | Sí | Sí |
| El dato con su base (reglas 8 y 12) | Sí | Sí — en producto suele vivir en `stat-card` o en una tabla |
| Cero relleno (regla 9) | Sí | Sí |
| Capa espacial (regla 13) | Solo si la página es **de Amalgama** | Solo en herramientas internas nuestras. **Nunca** en producto de cliente |

**La regla corta:** lo que evita parecer generado aplica a todo. Lo que es *apertura* —el titular
editorial, el índice de sección, el hero— es de página, no de producto. Una pantalla de producto
no abre: continúa.

---

# Parte I — La firma de Amalgama

Embassy ya tiene cinco ejes que **varían por cliente** (densidad, elevación, movimiento, íconos,
forma): existen para que dos productos white-label no se lean como el mismo repintado.

Esto es lo contrario: **lo que no varía nunca**, y es lo que hace que un trabajo se reconozca como
nuestro. Hasta septiembre de 2026 esa firma era solo tipografía y color, y por eso alcanzaba con
cambiar la paleta para que la página pudiera ser de cualquiera.

## A · Dos registros tipográficos, y la distancia entre ellos

El titular de apertura vive en el registro editorial (hasta 96px) y el cuerpo se queda en la
escala de producto (13.5px). Esa distancia es la firma; agrandar todo por igual es el default.
Y las versalitas van apretadas y en mono. Reglas 0b y 1.

## A2 · Tracking de versalitas: 0.04em en mono

El default de una página generada es 0.12–0.16em en sans. El nuestro es **apretado y
monoespaciado**, que se lee como etiqueta de sistema y no como eyebrow editorial. Es la diferencia
más barata y más visible de las cinco. Está en `.overline` y en `--letter-spacing-overline`.

> **Ojo con no confundirlo con el otro tracking positivo.** Las versalitas de componente —badge,
> header de tabla, label del nav, acción del toast— van a 10–11px y usan
> `--letter-spacing-label` (0.08em). A ese tamaño el tracking apretado se lee peor, no mejor:
> resuelven problemas distintos y no se unifican.

## B · Alineación: izquierda, siempre

Ninguna **región de la página** se centra: ni el hero, ni los títulos de sección, ni los párrafos.
El centrado simétrico es la forma por default de toda página generada. Un eje izquierdo firme, con
todas las regiones compartiendo borde, se lee ordenado y deliberado. Regla 2.

## C · Ritmo: proporción, no uniformidad

La página no es una pila de bandas iguales. La sección que carga el argumento respira; las de
apoyo son compactas. `.section-lead` mide 2,5 veces `.section-tight` — una diferencia real, no del
10%. Regla 6.

## D · Forma: borde antes que sombra, superficie antes que caja

Las secciones se separan con **una línea de 1px que cruza toda la pantalla** (`.rule`, fuera de la
columna), no con bandas de fondo alternado. La banda es lo que hace toda página generada; la línea
es la misma decisión que el borde sobre la sombra.

Somos precisión técnica: el borde de 1px es nuestra herramienta de separación, y la sombra queda
para lo que **realmente flota** (overlay, modal, toast). La mayor parte del contenido no necesita
contenedor: se agrupa con espacio. Regla 7.

## E · El gesto: el índice de sección en monoespaciada

**Decidido en septiembre de 2026.** Las secciones llevan su número a la izquierda del título, en
DM Mono, en el color de acento: `02 / 05`. Es `.section-index`.

Se eligió sobre el filete corto —que usan varios estudios— y sobre el borde de un lado, porque es
el que más refuerza lo que decimos ser: un sistema, no una campaña. Y es el más difícil de imitar
por accidente, porque **obliga a contar**: un generador que rellena secciones no sabe cuántas hay.

Las condiciones, que son parte del gesto:

- **Numera el total real.** `02 / 05` en una página de cinco secciones. Nunca se saltea, nunca se
  reinicia, y el total no se infla porque quede mejor.
- **No va si hay una sola sección.** Numerar uno de uno no es un sistema, es decoración.
- **No va en producto.** Es el gesto de una página que se lee de arriba abajo. Numerar las
  secciones de un panel de administración, donde la persona entra a hacer una tarea puntual, es
  decoración y además ruido.
- **Es decorativo para un lector de pantalla** cuando el título ya nombra la sección: va con
  `aria-hidden="true"` para que nadie escuche "cero dos barra cero cinco" antes de cada título.
- **No convierte a las secciones en una secuencia.** Es un índice, no un paso a paso: no implica
  que haya que leerlas en orden. Si el contenido *sí* es una secuencia, mejor todavía.

```html
<span class="section-index" aria-hidden="true">02<span class="sep">/</span>05</span>
```

---

# Parte II — Las reglas

## 0. La estructura se elige antes de escribir markup

**El default de una página generada no es un color: es una silueta.** Una columna centrada de
1200px con dos vacíos a los costados en un monitor ancho. Es correcta para un dashboard y es la
razón por la que todas las landings se parecen.

Son **tres decisiones**, y las tres se dicen en voz alta antes de escribir markup: la
**estructura**, el **ancho** y cómo se compone **adentro**.

### La estructura — una de cuatro

| Clase | Qué es | Cuándo |
|---|---|---|
| `.column` | Una columna centrada | Producto, dashboards, pantallas de app. La segura, y la que menos diferencia |
| `.column-bleed` | **Sin ancho máximo**, con márgenes que crecen con la pantalla | Cuando la página tiene que usar el monitor entero. La salida más rápida de la silueta genérica |
| `.column-rail` | Contenido ancho + un riel angosto al costado para notas, metadatos o índice | La más "estudio". Obliga a decidir qué es principal y qué es nota |
| `.column-split` | Dos tracks asimétricos, 6fr/4fr | Un hero con una herramienta o una imagen a un lado. Nunca 50/50: mitades iguales no dicen cuál manda |

**Una por página.** Mezclar `bleed` en una sección y `column` en la siguiente rompe el borde
izquierdo, que es lo único que sostiene la página.

### El ancho — se elige, no se hereda

1200 es el default y es el número que usa todo el mundo. Si la página gana con más aire lateral, o
tiene que ocupar mejor un monitor grande, **se elige otro** de la escala:

| Clase | Ancho | Se siente |
|---|---|---|
| `.column` | 1200px | El default. Cómodo y neutro |
| `.column-1280` | 1280px | Apenas más respiro, misma sensación |
| `.column-1440` | 1440px | Una tabla ancha o un dashboard denso entran sin apretar |
| `.column-1600` | 1600px | Editorial, para pantallas grandes |
| `.column-1920` | 1920px | Casi borde a borde, pero con un límite real |
| `.column-bleed` | sin límite | El ancho lo pone la pantalla |

Y dos anchos de lectura, que no son elección de estilo sino de contenido: `.column-read` (800px)
para artículos y detalle, `.column-form` (680px) para un formulario o un panel de auth.

**Los márgenes laterales nunca desaparecen.** Sea 1200 o sin límite, el `padding-inline` crece con
la pantalla (de 20px en un celular a 56px, o 96px en `bleed`). Contenido pegado al borde del
viewport es una falla, no una decisión.

### Adentro — la grilla de 12

`.grid-12` con `.span-1` … `.span-12`. Es lo que permite que una sección **no** sea una fila de
bloques iguales: 7+5, 8+4, 5+4+3 son composiciones. Debajo de 900px todo pasa a una columna.

```html
<div class="grid-12">
  <div class="span-7">…el argumento…</div>
  <div class="span-5">…el dato que lo sostiene…</div>
</div>
```

Doce columnas existen para que la asimetría salga barata. Si el resultado es 4+4+4 tres secciones
seguidas, es la grilla de tres tarjetas con otro nombre (regla 4).

**Borde a borde libera el layout, nunca el texto.** Los párrafos siguen cortando en `.measure`
(68 caracteres) o `.measure-lead` (52). Una línea de 200 caracteres en un monitor de 27 pulgadas
es una falla (`D3`), y es el error clásico de sacar el `max-width`.

**Verificación:** una sola clase de estructura en la página; y si es `bleed`, todo párrafo de
texto corrido tiene `measure` o `measure-lead`.

## 0b. El titular de apertura vive en otro registro

**No:** un hero de 28 o 32px porque es el tamaño más grande de la escala. Todo un poco grande y
nada dominante es, literalmente, la primera impresión de una página generada.

**En su lugar:** el registro editorial — `.editorial-lg` (hasta 96px), `.editorial-md` (68) o
`.editorial-sm` (46). Uno solo por página, en el `h1`, y **nunca adentro del app shell**: una
pantalla de producto abre con `page-title`, no con esto.

**Y el cuerpo no se toca.** La escala de producto se queda donde está. Lo que se reconoce no es
el tamaño del título: es la **distancia** entre un título de 96 y un cuerpo de 13.5. Si agrandás
las dos cosas, el gesto desaparece y volvés al "todo un poco grande".

**Verificación:** una sola clase `editorial-*` en la página, y está en el `h1`.

## 1. El overline se decide, y cuando va, va con nuestro tracking

Las mayúsculas no son el problema. El problema son dos: que aparezcan **por reflejo** en toda
página, y que lleven **el tracking amplio** (0.12–0.16em), que es lo que las vuelve reconocibles a
diez metros.

**Cuándo va:** cuando clasifica algo que el título no dice y el lector necesita antes de leerlo —
el tipo de producto, la cobertura, la fecha de un informe. Es una etiqueta de clasificación, no un
saludo.

**Cuándo no va:** cuando repite lo que el h1 ya dice, cuando dice el nombre de la sección
("SERVICIOS" arriba de "Nuestros servicios"), o cuando está sólo para que el título "no arranque
solo". Ante la duda, sacalo y mirá si se perdió algo. Casi nunca se pierde.

**Una vez por página.** Si aparece en el hero, en el logo y en los títulos de columna del footer,
ya no clasifica nada: es una textura.

**Cuando va, va con la clase**, no escrito a mano:

```html
<p class="overline">Informe trimestral</p>
```

**Verificación:** un solo `.overline` en la página, y ningún `text-transform: uppercase` propio
con `letter-spacing` literal. Lo chequea `check-output.mjs` (`H7` y `A11`).

## 2. La página no se centra

**No:** hero centrado, títulos de sección centrados, párrafos centrados con `max-width` propio.

**En su lugar:** todo se alinea al **borde izquierdo de la estructura elegida**, incluidas las
secciones "de marca". Los bordes izquierdo y derecho de **todas** las regiones coinciden.

**Esto es a nivel página.** Adentro de un componente que se centra a propósito el centrado se
queda: `empty-state`, el footer de un `modal`, `placeholder`, el input de OTP, las celdas del
calendario. La regla es sobre las regiones, no sobre los componentes.

**Verificación:** medí el `left` de cada región en el navegador. Si no coinciden todos, hay una
centrándose sola. (`screen` lo mide en su paso de validación; a ojo se ve trazando una vertical.)

## 3. El hero abre con el control, no con una promesa

**No:** h1 + bajada + botón sobre una imagen o un degradé. Eso es una campaña publicitaria, que
`design.md` §1 descarta explícitamente.

**En su lugar:** *precisión técnica con cercanía* significa que **la herramienta está a la vista
desde el primer scroll**. Si la página tiene una tarea —buscar, calcular, filtrar, cotizar—, el
control real de esa tarea va en el hero, funcionando. La frase acompaña; no ocupa el lugar.
`.column-split` existe para esto.

Si la página no tiene ninguna tarea, el hero abre con **el dato o el trabajo**, no con un adjetivo.

## 4. La grilla de tres tarjetas con ícono no es una opción

**No:** tres cards con ícono en cuadrado redondeado, título y dos líneas. Es el relleno de sección
por default. Aparece cuando hay que ocupar espacio y no hay contenido.

**En su lugar**, según lo que tengas de verdad:

| Lo que tenés | La forma |
|---|---|
| Tres instancias reales de la misma categoría, comparables | Una **lista** de `label: valor`, más densa y más legible que tres cards |
| Dos o más opciones con criterios comunes | Una **tabla comparativa**. Los criterios explícitos, no adjetivos |
| Un punto fuerte y dos secundarios | **Un bloque grande y dos chicos.** Asimetría deliberada: el peso visual dice cuál importa |
| Un solo argumento que sostiene la sección | **Un bloque.** Una sección de una sola cosa es una decisión, no un error |
| Nada que decir todavía | **Sacá la sección.** No la rellenes |

Y la regla que las cubre a todas: **una grilla solo cuando los ítems son intercambiables entre
sí.** Si el segundo no podría ir en el lugar del primero sin que nada cambie, no es una grilla.

## 5. El ícono tiene cinco lugares, y "arriba del título" no es el default

**No:** un ícono en un cuadrado con radio, arriba a la izquierda de cada card, del mismo tamaño en
todas. No distingue nada — el título ya dice lo mismo — y es la marca de agua más reconocible de
una página generada.

**En su lugar, elegí uno** y usalo consistente en toda la página:

| Ubicación | Cómo se ve | Cuándo |
|---|---|---|
| **Sin ícono** ← *el default* | El título y el texto solos | La mayoría de las veces. Si el título alcanza, el ícono es ruido |
| **En línea, antes del texto** | 16–20px, alineado a la primera línea, mismo color que el texto | Cuando distingue ítems entre sí en una lista que se escanea: estado, tipo de archivo, canal |
| **Al margen** | Fuera de la caja, en el riel o sangrado a la izquierda del bloque | Con `.column-rail`. El ícono ancla el bloque sin ocupar el lugar del título |
| **Grande y solo** | 40–64px, sin superficie detrás, con mucho aire | Un ícono por sección, no uno por ítem. Cuando el ícono **es** el contenido: un estado vacío, un error, un logro |
| **De fondo** | Muy grande, muy bajo contraste, recortado por el borde del bloque | Una sección destacada, una sola vez en la página. Es textura, no información |

Reglas que valen para las cinco: **Lucide**, `--icon-stroke` del tema, **nunca** una superficie
cuadrada con radio detrás por default, y **nunca** un ícono por card cuando las cards ya se
distinguen por el título. Un emoji no es un ícono (`H4`).

**Verificación:** contá los íconos. Si hay uno por cada ítem de una grilla y los ítems ya tienen
título, sobran todos.

## 6. Las secciones no tienen todas el mismo alto

**No:** cinco bandas con el mismo `padding-block`, del mismo alto, alternando fondo sí y fondo no.
Eso es un acordeón, no una página: el ojo no encuentra dónde parar.

**En su lugar:** el aire es proporcional al peso, con las tres clases del sistema —
`.section-lead` para la que carga el argumento, `.section` para el resto, `.section-tight` para el
apoyo.

**Verificación:** si el alto de todas las secciones entra en un rango de ±15%, no hay ritmo.

## 7. No todo es una tarjeta

**No:** un radio y una sombra estampados en cada bloque. Borde, relleno, radio y sombra dicen
"objeto separado" — gastados en todo, no separan nada y aplanan la jerarquía.

**En su lugar:** gastalos por rol. **Elevación solo para lo que flota** (overlay, modal, toast).
**Borde para lo que está en el plano.** Y para agrupar, primero el espacio: `--space-*` antes que
una caja. La mayor parte del contenido de una página no necesita contenedor.

## 8. Un número que no se puede verificar no se publica

**No:** "+40%", "miles de usuarios", "la mayoría de nuestros clientes". Si el dato no vino del
cliente, no existe — y el redondeo lindo es la marca de que lo inventó un modelo.

**En su lugar:** la cifra real con su base, período y comparador al lado. Si no la tenés, la frase
va sin cuantificar, o la sección espera.

**En una maqueta con datos de relleno**, un aviso persistente y visible en la página lo dice. Un
comentario en el código no alcanza: nadie que mire la pantalla lo lee.

## 10. Imágenes: solo material real

**No:** stock, ilustración isométrica, render 3D, degradados como imagen, gente sonriendo en una
oficina que no es la nuestra. Es la superficie más grande de una página y el default más
reconocible que existe.

**En su lugar:** capturas reales del producto, fotos del trabajo o del equipo, diagramas que
expliquen algo. **Si no hay material real, la sección va sin imagen** — un bloque de texto bien
compuesto se ve mejor que una foto de banco.

**Todas con el mismo marco**, que es la parte que se puede hacer cumplir: `.media` — borde de 1px,
radio del sistema, sin sombra. Y con `.media-caption` cuando lo que se ve necesita una aclaración
(qué pantalla es, de qué fecha).

**Verificación:** ninguna URL de banco de imágenes (unsplash, pexels, shutterstock, freepik), ni
`<img>` sin `.media`, ni un degradé haciendo de foto.

## 11. La página no se revela al scrollear

**No:** cada sección apareciendo con un fade-up de 20px al entrar en pantalla. Es el gesto más
repetido de las landings generadas, cuesta rendimiento y molesta a quien navega con teclado o
vuelve atrás.

**En su lugar:** `.reveal` en **el bloque de apertura y nada más**, al cargar la página, y solo
opacidad — sin desplazamiento. El contenido ya está donde va. `base.css` lo apaga solo cuando el
sistema pide menos movimiento.

**Verificación:** un solo `.reveal` en la página, y cero listeners de scroll o `IntersectionObserver`
que agreguen clases de animación.

## 12. Un dato solo se muestra con su base al lado

**No:** la cifra gigante en color con una flechita verde.

**En su lugar:** `.figure` — la cifra en el color de texto y en números tabulares, la unidad más
chica pegada a ella, y la base (de qué universo sale, en qué período) **al lado**, en mono. Es la
misma regla 8 hecha componente: un número sin base no se publica.

```html
<p class="figure">
  <span class="figure-value">4,2</span><span class="figure-unit">min</span>
  <span class="figure-base">mediana · 240 altas · jul–sep 2026</span>
</p>
```

## 13. La capa espacial es nuestra, y solo nuestra

Amalgama tiene una identidad espacial —fondo profundo con estrellas, un halo, órbitas finas,
planetas— que ya vive en nuestro sitio. Está construida en `css/space.css` y **es lo más
identitario que tenemos**: nadie más la va a tener por accidente.

**Dónde va:** superficies de Amalgama. Nuestro sitio, one-pagers, propuestas comerciales, reportes,
decks y demos que firmamos nosotros.

**Dónde no va, y esto no se negocia:** **cualquier producto de cliente.** Ni una pantalla
white-label, ni la landing de un cliente, ni "un poquito" de fondo. Un cliente que paga por su
marca no compra la nuestra. Es la falla `H12`, y es bloqueante.

**La señal es objetiva:** si el proyecto carga un `brand/<cliente>.css`, la marca es de otro. El
chequeo lo mira exactamente así.

Las condiciones de uso, que son parte de que se vea bien y no a fondo de pantalla:

- **Un halo por página** (`.space-glow`), en la apertura. Dos halos son ninguno.
- **Un planeta grande por sección** como máximo. Tres en una pantalla es un wallpaper.
- **Los planetas no van encima del texto.** Anclan, enmarcan o asoman por un borde.
- **La capa no se mueve.** Sin parallax, sin planetas a la deriva, sin estrellas titilando —
  es la misma regla 11.
- **El título fantasma es textura**, no un título: está al 12% de opacidad y no pasa contraste.
  El titular real va en el registro editorial, aparte.
- **Debajo sigue estando la composición.** La capa es un fondo: no reemplaza la columna, la medida
  de línea ni el ritmo.

## 9. Cero relleno

Si una sección existe para que la página "no quede corta", sacala. Una página de cuatro bloques
con algo que decir vale más que una de ocho, y se nota cuál es cuál.

---

## La prueba final

Tapá el logo y los colores. **Si la página podría ser de cualquier otro estudio cambiando la
paleta, la composición no hizo su trabajo** — y ése es exactamente el punto: los tokens ya
garantizan que se vea bien; esto es lo que hace que se vea nuestra.

Después, la pregunta de `design.md` §8: *¿qué superficie, borde, píldora, ícono, label, color,
párrafo o sección se puede sacar sin perder significado?* Sacala.
