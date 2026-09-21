# Aceptación de pantalla — cuándo una pantalla está aceptable

**Esto no es una plantilla.** No dice qué componentes lleva una pantalla ni cómo se ve: dice qué
**relaciones** tienen que cumplirse entre las cosas que tenga. Por eso una consola de sesenta
bicis y un formulario de tres campos pasan la misma vara y no se parecen en nada.

Es la respuesta a un problema medido: el sistema tenía las reglas de *corrección* —una sola acción
primaria, el estado en `badge`, los filtros en el `toolbar`, todo alineado a una columna— y ninguna
de *proporción*. Todas eran binarias, y la armonía no es binaria: es una razón entre cosas. Una
pantalla podía pasar `validate-ds` entera, cumplir las ocho convenciones de `COMPOSICION.md` III·a,
y salir con los controles gigantes, cinco chips en negrita y cuatro tarjetas blancas apiladas.

**Por qué todos los umbrales son relaciones y no valores.** «El control no puede ser más alto que
la fila de dato» vale igual en compacta y en cómoda; «36px» vale sólo en una. Un umbral absoluto
obliga a una excepción por arquetipo y termina siendo una plantilla con otro nombre.

**Cuándo se corre.** Después de construir y antes de mostrar. Los criterios no reemplazan la
decisión previa —el arquetipo, la jerarquía, los estados, la copy— que sigue viviendo en
`screen-patterns.md` §2 y en el bloque de decisión de `COMPOSICION.md` III·b. Esto es la vara que
mide lo que salió.

---

## 1. Las cinco decisiones que cada pantalla declara

La mitad de las discusiones sobre estética son en realidad estas cinco sin declarar. Van en el
bloque de decisión de III·b, **antes** del markup, y quedan escritas en el diagnóstico de la
pantalla (`design/<pantalla>.md`).

| Decisión | Qué resuelve | Dónde vive |
|---|---|---|
| **Densidad** | `compact` o `comfortable`, según quién la usa, cuántas horas por día y con qué puntero. De acá salen las alturas de control y de fila — **no del default** | `data-density` en la raíz de la pantalla (`variables.css` §Densidad) |
| **Ancho** | La clase de columna que corresponde al contenido | `.column` · `.column-read` · `.column-form` (`COMPOSICION.md` §0) |
| **Contenedor** | Por grano: comparar valores → `table` · leer ítems → `list` · reconocer entidades → grilla | III·a·4 |
| **Dominante** | Cuál es el objeto que tiene que ganar el ojo, y por qué gana | `data-ds-dominant` en esa región |
| **Set semántico** | Qué significa cada tono en esta pantalla, y su leyenda si hay más de dos | la pantalla, más su leyenda visible |

Las dos primeras y la cuarta se declaran **en el markup** porque son las que el gate necesita para
medir: sin `data-density` no se puede decir si un control está fuera de escala, y sin
`data-ds-dominant` no se puede decir si el dominante domina. Una pantalla que no las declara no es
una pantalla mal hecha: es una pantalla que no se puede medir, y por eso `D17` es ALTA.

**La raíz.** Los criterios se miden dentro de `[data-ds-screen]`. Sin esa raíz, `check-render`
corre los chequeos de elemento (contraste, medida, targets, proximidad) y **saltea los doce**,
avisándolo en el reporte. Es deliberado: el catálogo del DS y una landing no son pantallas de
producto, y medirlas como si lo fueran da mil cuatrocientos hallazgos que no son bugs.

```html
<div data-ds-screen data-density="compact">
  <header class="page-header">…</header>
  <div class="toolbar">…</div>
  <section class="card" data-ds-dominant>…</section>
</div>
```

---

## 2. Los doce criterios

Cada uno con su falla en `FAILURES.md`, su severidad y quién lo chequea. Los umbrales están en
`scripts/check-render.mjs` (`UMBRAL.aceptacion`), no repetidos acá: si se mueven, se mueven en un
solo lugar.

### A · Tamaño — contra los componentes gigantes

**A1 · La densidad se declara, no se hereda.** `D17` · ALTA · medido
¿Quién usa esta pantalla, cuántas horas por día y con qué puntero? Un mostrador que la mira ocho
horas y una pantalla que el socio abre una vez al mes no tienen la misma densidad, y hoy las dos
salen con el default de 36px. El piso táctil no es densidad: 44px en puntero grueso (`D8`) y 24px
en fino, y no baja.

**A2 · Ningún control pesa más que el dato.** `D18` · ALTA · medido
El control es el medio, el dato es el fin. Si el filtro es más alto y más grande que la fila que
filtra, la pantalla te muestra primero la herramienta. Se compara el alto del control de cromo
contra el alto de la fila de dato, y el cuerpo contra el cuerpo.

**A3 · Nada de apoyo toma todo el ancho.** `C2` · ALTA · medido
Un botón estirado de borde a borde se lee como un campo, y un campo con un ancho propio se lee como
un botón: el ancho es parte de qué es la cosa. Sólo la búsqueda y el contenedor de datos toman la
fila completa. La excepción es el primario en mobile.

### B · Homogeneidad — que no parezca hecha por tres personas

**B1 · Un valor por cosa.** `D19` · ALTA · medido
¿Cuántos radios distintos hay? ¿Cuántas alturas de control? Si hay cinco de cada uno no hay
sistema: hay cinco decisiones sueltas que se tomaron de a una. La píldora (`--radius-full`) no
cuenta como radio propio: es una forma, no un paso de la escala.

**B2 · Una sola columna de contenido.** `D1` · ALTA · medido
¿Comparten borde izquierdo y derecho el título, la toolbar, los resultados y el conteo? Una región
que se centra o se dimensiona sola rompe el eje, y el eje es lo que hace que una pantalla se lea
deliberada. Estaba en el catálogo desde el principio y se detectaba «por inspección visual»: ahora
se mide en el render.

**B3 · Un concepto, un patrón.** `D5` + `COMPOSICION.md` §4c · ALTA · de ojo
¿Hay dos controles para el mismo eje —chips y carpetas para el mismo set, tabs y un select que
filtran lo mismo—? ¿Hay dos cosas «seleccionadas» del mismo color? Un control por eje (filtrar ·
navegar · categorizar) y una sola forma de seleccionado por eje: el objeto operado en tonal, el
filtro activo a media fuerza, el modo de vista sin acento. **No se automatiza**: saber si dos
controles expresan el mismo eje es entender el dominio, no contar nodos.

### C · Jerarquía — que se sepa qué mirar primero

**C1 · Hay un dominante, y domina de verdad.** `D20` · ALTA · medido
Declarado antes de construir y verificado después. El dominante ocupa más área que cualquier otra
región y al menos una vez y media la segunda, y es la única superficie elevada. Vale para un
tablero, una tabla o un formulario: cambia cuál es, no la relación.

**C2 · Un portador de énfasis por rango.** `D21` y `D22` · ALTA · medido
Los portadores son cuatro —peso, tamaño, color, superficie— y se gastan de a uno. La apertura puede
tomar dos; el apoyo, ninguno. Dos formas de romperlo, y las dos se miden: un conjunto repetido de
controles **todos** en peso fuerte (`D21` — cinco chips en negrita no son cinco filtros importantes:
son cinco que se anularon entre sí, y encima se quedaron sin recurso para marcar el activo), y un
elemento con tres portadores encima (`D22`). `F6` ya decía que el color no puede ser el **único**
portador; esto es el recíproco, que faltaba escrito.

**C3 · El color se gasta por rango.** `D23` · MEDIA · medido
El tono de marca es de acciones; el semántico es de datos. El mismo tono no puede hacer las dos
cosas en una pantalla. Un fill de marca por pantalla (`D14` lo dice para el botón; acá vale para
cualquier superficie que lo lleve), cada tono semántico con su fila de leyenda, y el cromo en
neutro: filtros, riel y modo de vista se encuentran por posición.

### D · Balance — que el aire esté repartido

**D1 · Tres niveles de aire, con salto real.** `D24` · MEDIA · medido
Dentro del grupo < entre grupos < entre bloques, cada salto de al menos una vez y tres cuartos, y
todos valores de la escala. `D15` pide que el de adentro sea *menor*, y con eso 24/24/24 pasa
moviendo uno a 23. Cuando el espacio no agrupa hay que dibujar cajas para suplirlo, y de ahí salen
las cajas de más: `D24` y el presupuesto de contenedores son la misma falla a dos distancias.

**D2 · Nada se estira sobre vacío.** `D25` · MEDIA · medido
Una grilla de cuatro columnas con cinco ítems deja una fila con uno solo y tres huecos; un panel
con el doble de alto que su contenido queda como un marco alrededor de nada. Las columnas se eligen
para que el contenido las complete.

**D3 · El aire está repartido.** `D26` · MEDIA · medido
Una pantalla con la tabla al ras y el encabezado nadando en aire está desbalanceada aunque las dos
mitades, por separado, estén bien. El aire por elemento de una región no supera el doble del de
otra región de la misma pantalla.

---

## 3. Cómo se cierra

Una vara sin regla de cierre es una lista de deseos: siempre queda algo en amarillo y siempre se
entrega igual.

| | |
|---|---|
| **Se acepta** | Cero fallas **ALTAS** y hasta dos **MEDIAS**, cada una anotada con su razón en `design/<pantalla>.md` |
| **Vuelve** | Cualquier ALTA. Se arregla, o se declara excepción **por elemento** con `data-ds-allow="D18 - motivo"` y el motivo escrito — nunca por pantalla, y nunca «porque se ve bien así» |
| **No cuenta** | Que pase `validate-ds`. Ése mide tokens y clases: una pantalla con los controles gigantes y todo en negrita lo pasa entera |

```bash
node scripts/check-render.mjs <pantalla>.html     # los once medidos
node scripts/check-output.mjs <pantalla>.html     # tokens, clases, a11y en el texto
```

### Las tres que no tienen umbral

Se corren sobre la pantalla ya construida, en este orden, y cada una se contesta en diez segundos.
Son de ojo a propósito: convertir estas tres en número es cómo se llega a una pantalla que cumple
todo y no se puede usar.

1. **Grises.** Apagá el color (`data-ds-gray` en la raíz, `css/diagnostics.css`). Si la jerarquía
   se cae, el color estaba haciendo un trabajo que le tocaba a la forma — y para quien no distingue
   esos dos tonos no lo va a hacer.
2. **Ojos entrecerrados.** ¿Qué se lee primero? Si no es el dominante que declaraste, el énfasis
   está puesto en otra cosa. `data-ds-order` numera las regiones por orden de lectura para
   contrastar lo declarado con lo que pasa.
3. **Restar uno más.** Un borde, un contenedor y una etiqueta por región. Lo que no se extraña, no
   iba. Es la regla 9 —cero relleno— convertida en un movimiento concreto.

**El orden de lectura no es la dominancia**, y confundirlas es lo que produce la pantalla donde
todo grita. El título se lee primero y no lleva ningún énfasis: lo pone adelante su posición y ser
el único titular. El objeto se lee después y es el que tiene que dominar, porque ahí está el
trabajo. Los portadores se gastan en el segundo, no en el primero.

---

## 4. Qué no está acá

- **Qué componente va.** `component-rules/<id>.md` y `guidelines/component-decisions.md`.
- **Qué lleva la pantalla.** Los doce arquetipos, en `screen-patterns.md` §2.
- **Cómo se dibuja la pantalla de producto.** Las ocho convenciones, en `COMPOSICION.md` III·a.
- **Los valores.** `css/variables.css` es la fuente; `TOKENS.md` explica cada rol.

Una regla vive en un solo lugar. Acá está la vara; las fallas están en `FAILURES.md` con su
severidad y su detección; los umbrales, en `check-render.mjs`. Si los tres dicen cosas distintas,
gana el código y se arregla el documento.
