# Cómo usar el Design System

Qué escribir, dónde, y qué pasa.

> **¿Querés probarlo antes de usarlo en un proyecto real?** `PRUEBA-EQUIPO.md` es un protocolo de
> 40 minutos con casos concretos y qué esperar en cada uno.

---

## Antes que nada (una sola vez)

Escribí `/embassy:` en Claude y fijate que el autocompletado te ofrezca **siete**: `screen` ·
`start` · `artifact` · `review` · `break` · `explain` · `eval`.

Si no aparecen, instalá el plugin **`embassy`** desde el marketplace de Amalgama y reiniciá Claude
Code. Y si tenías uno viejo llamado `design`, desinstalalo.

**No hace falta clonar nada.** Las skills traen el Design System solas.

---

## Arrancar un proyecto nuevo · 4 pasos

### 1 · Abrí la carpeta del proyecto

En Claude, **Add folder** sobre la carpeta **del proyecto nuevo**. Puede estar vacía.

> Nunca sobre la carpeta del Design System. Es el error más común: el DS no se abre, se consume.

### 2 · Pegá esto

```
/embassy:start
```

O escribilo con tus palabras: *"arranquemos este proyecto con el Design System, white-label para
Megatlón."*

Si ya tenés los datos, adelantalos todos en el mismo mensaje:

```
/embassy:start

Cliente: Megatlón
Stack: React / Next
Superficie: app con shell (sidebar + topbar)
Densidad: herramienta interna densa
Idioma: español rioplatense
Marca: primario #14524A · acento #0E9F6E
Forma: redondeada
Tipografía: las de Embassy
```

> **Densidad** es cuánta información entra por pantalla: herramienta interna densa · producto
> consumer · mixto.

### 3 · Respondé lo que falte

Seis preguntas: tipo de proyecto · stack y superficie · densidad e idioma · los dos colores de
marca · la forma (redondeada, balanceada o técnica) · tipografía y grises.

> **De los dos colores, el primario es el tono oscuro** — el del texto y el sidebar. El acento es
> el color vivo, el de los botones y los links. Si la marca del cliente es un naranja fuerte, ese
> va como **acento**. Si te equivocás, el generador te avisa.

### 4 · Mirá el preview y aprobá

Te deja **`theme-preview.html`**: todos los componentes con la marca del cliente, en claro y en
oscuro. Abrilo y probá el toggle. Si algo no representa la marca, decíselo y lo regenera.

**Ese archivo es lo que le mostrás al cliente en el kickoff.**

### Qué te queda

```
tu-proyecto/
├── brand/megatlon.css      ← la marca del cliente
├── DESIGN.md               ← qué se decidió y qué quedó pendiente
├── design/                 ← vacía por ahora
├── theme-preview.html      ← para mostrar y aprobar
├── CLAUDE.md               ← le dice al agente qué usar
└── index.html / src/…      ← el layout base
```

Media hora, una vez. Después el proyecto no vuelve a pensar en el DS.

**Todo esto son archivos de verdad en tu carpeta**, no código para copiar y pegar. Commiteables
como cualquier otra cosa. A medida que armás pantallas, `design/` se va llenando con un archivo por
pantalla que explica por qué quedó así — qué se movió y qué componente se eligió sobre cuál.

---

## ¿Y si el proyecto ya existe?

No corras `/embassy:start` — ese es para empezar de cero. Tenés dos caminos según el tamaño.

### Pantalla por pantalla

Abrís la carpeta y vas con **`/embassy:screen`**, una pantalla a la vez.

```
migrá esta pantalla a Embassy
```

Es lo mejor cuando son pocas pantallas, o cuando querés que además de verse bien **funcionen
mejor** — porque `screen` sí rediseña: mira qué está mal, lo dice, y lo mueve.

### El proyecto entero, de una

Para una app completa hay un agente aparte: **`embassy:rollout`**. Le pedís *"migrá este proyecto
entero a Embassy"* y arranca solo.

Recorre todo el código y reemplaza los colores, las tipografías y los componentes hechos a mano por
los del DS, en fases que te va mostrando para que apruebes. Al terminar el proyecto **se ve** como
Amalgama.

> **Lo importante es lo que NO hace: no rediseña ninguna pantalla.** Si una pantalla tenía tres
> botones compitiendo y ningún estado vacío, los sigue teniendo cuando termina — ahora en los
> colores correctos. Es una migración técnica, no una mejora de UX.

Y como para hacer eso tiene que leer todas las pantallas igual, **aprovecha y te deja una lista** de
las que están estructuralmente mal, ordenada de peor a mejor:

```
src/pages/Vacantes.tsx    3 acciones primarias compitiendo · sin estado vacío   → /embassy:screen
src/pages/Candidatos.tsx  11 filtros sueltos sin agrupar                        → /embassy:screen
src/pages/Reportes.tsx    tabla sin alternativa en mobile                       → /embassy:screen
```

Esa lista es el valor real del rollout: sale gratis, y te dice **por dónde empezar** cuando después
te sientes a rediseñar de a una con `/embassy:screen`.

**El orden que funciona:** primero `rollout` para que todo se vea bien y salga la lista, después
`screen` sobre las tres o cuatro pantallas que más duelen.

---

## Cuándo usar cada una

### `/embassy:start` — el día que arranca el proyecto

Una sola vez, antes de la primera pantalla. Si ya existe `brand/algo.css` en la carpeta, esta skill
ya cumplió.

### `/embassy:screen` — todos los días, para cada pantalla

La que más vas a usar: armar una pantalla nueva, rediseñar una que está mal, migrar una vieja.

```
armá la vista de listado de socios
esta pantalla no se entiende, rediseñala
migrá esta pantalla a Embassy
```

Primero te dice **qué está mal y por qué**, después qué movió, y recién ahí el código.

> Si te devuelve una pantalla donde solo cambiaron los colores y los botones, algo falló. Eso es un
> re-skin, y la skill está hecha justamente para no hacer eso. Avisá.

### `/embassy:artifact` — cuando no hay repo

Propuestas, reportes, one-pagers, la página de resultados del trimestre, un brief, una demo. Sale
un HTML solo, on-brand, sin clonar ni instalar nada.

> ¿Dudás entre esta y `screen`? Preguntate: *¿alguien va a volver a editar esto en tres meses?*
> Sí → `screen`. No → `artifact`.

### `/embassy:review` — antes de entregar o mergear

Audita y te dice qué está mal, con severidad y con el arreglo. **No lo arregla.**

```
revisá esta pantalla antes de que la mande
¿esto respeta el DS?
esto no parece de Amalgama, ¿qué está mal?
```

Sirve también sobre cosas que no hiciste con Claude: una URL, un screenshot, un link de Figma, el
diff de un PR.

### `/embassy:break` — cuando dudás si un componente aguanta

Renderiza *un* componente en todos sus estados, largos de texto y anchos a la vez, con la marca del
cliente en claro y en oscuro, en una página que scrolleás.

```
rompé el select
probá la card de vacante con contenido real
¿esto aguanta la marca de Megatlón en oscuro?
```

### `/embassy:explain` — cuando el cliente manda una referencia

```
el cliente mandó esta referencia, ¿se puede con Embassy?
cómo está hecha esta animación
```

Te explica cómo está construido y después contesta lo que importa: **ya existe** en Embassy ·
**se compone** con lo que hay · **es un gap** y se anota · **choca con el sistema**, se puede hacer
y no deberíamos.

---

```
arranca el proyecto ──▶ /embassy:start      (una vez)
                          │
        cada pantalla ──▶ /embassy:screen     (todo el tiempo)
                          │
     antes de entregar ──▶ /embassy:review    (cada vez que mostrás algo)


        sin repo ──▶ /embassy:artifact   (propuestas, reportes)

  cuando hace falta ──▶ /embassy:break     (¿este componente aguanta?)
                    ──▶ /embassy:explain   (¿cómo hicieron esto? ¿se puede?)


 proyecto que ya existe ──▶ embassy:rollout  (migra todo y lista qué rediseñar)
                              └──▶ /embassy:screen sobre lo que salió en la lista
```

*(Hay una séptima, `/embassy:eval`, que es para los dueños del DS. No la vas a necesitar.)*

### Las confusiones que se dan siempre

| Si pensás… | En realidad va… |
|---|---|
| "Es una pantalla, uso `artifact`" | `screen`, si vive en el repo del producto |
| "Quiero que revise y me lo arregle" | `review` solo diagnostica. Para arreglar, `screen` |
| "Cada pantalla nueva la arranco con `start`" | No: `start` es una vez por proyecto |
| "Quiero ver si el componente está bien, uso `break`" | `break` muestra qué **se rompe**; si está **bien hecho** lo dice `review` |

---

## Cómo escribir el prompt

**Usá el comando.** Es lo único que garantiza que la skill se ejecute. Sin comando a veces se
dispara sola —Claude lee tu mensaje y decide— pero es probable, no seguro.

**Y describí el objetivo, no los componentes.** Es lo que más cambia el resultado:

> ✅ *"Armá la vista de listado de socios, filtrable por estado y plan; la acción principal es dar
> de alta; los usuarios entran a buscar a una persona puntual."*
>
> ❌ *"Hacé una tabla con filtros y un botón."*

El segundo te da componentes. El primero te da una pantalla.

**Cómo sabés que funcionó:** el resultado te dice qué componente eligió y por qué. Si te devuelve
una pantalla y nada más, repetilo con el comando.

---

## Los cinco errores que esto evita

1. **Poner un color a mano.** Todo sale de tokens. Un `#3A5BB0` suelto rompe el dark mode.
2. **Inventar un componente que ya existe.** Hay 63. Si parece que falta, casi seguro está con otro
   nombre.
3. **Dos acciones primarias en una pantalla.** Si las dos parecen igual de importantes, falta
   jerarquía.
4. **Un `<input placeholder="Buscar">`.** Hay dos buscadores distintos y cuál va depende de si
   filtra una lista de esta pantalla o busca en toda la app.
5. **Tocar el Design System desde tu proyecto.** Tu proyecto solo escribe su propio archivo de
   marca.

---

## Preguntas frecuentes

**¿Puedo usar esto en un proyecto que ya existe?**
Sí — mirá la sección *"¿Y si el proyecto ya existe?"* más arriba. Si el proyecto ya tiene sus
propios tokens, se usan esos.

**¿Tengo que saber programar?**
Para `start` y `artifact`, no. Respondés preguntas y mirás el resultado.

**¿Y si el cliente todavía no definió la marca?**
Arrancás igual: queda la de Amalgama y se anota como pendiente. Cuando llegue el color, se regenera
en dos minutos.

**¿Dónde veo los componentes?**
En `presentations.amalgama.co/p/amalgama-design-system/`, o abriendo el `index.html` del repo del
Design System.

**Encontré algo que el DS resuelve mal.**
Decilo. Se arregla en el sistema, no en tu proyecto.
