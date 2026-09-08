# Cómo usar el Design System — guía para el equipo

Una página. Qué escribir, dónde, y qué pasa. El razonamiento está en `PLAN-USO-DS.md`.

---

## Antes que nada (una sola vez, por persona)

Tenés que tener el **plugin `design`** instalado en Claude. Si alguna vez usaste
`/design:design-system`, ya lo tenés y se actualiza solo.

**No hace falta clonar el repo del Design System.** Las skills lo bajan solas y anotan con qué
commit trabajaron.

---

## Arrancar un proyecto nuevo · 4 pasos

### 1 · Abrí la carpeta del proyecto

En Claude, **Add folder** sobre la carpeta **del proyecto nuevo** — no sobre la del Design System.
Puede estar vacía. Esto es lo que más se confunde: el DS no se abre, se consume.

### 2 · Pegá esto

```
/design:embassy-start
```

Y si preferís escribirlo con tus palabras, funciona igual:

> *"Necesito arrancar este proyecto con el Design System de Amalgama, white-label para Megatlón."*

Podés adelantar todas las respuestas en el mismo mensaje si ya las tenés:

```
/design:embassy-start

Cliente: Megatlón
Stack: React / Next
Superficie: app con shell (sidebar + topbar)
Densidad: herramienta interna densa
Idioma: español rioplatense
Marca: primario #14524A · acento #0E9F6E
Forma: redondeada
Tipografía: las de Embassy
```

> **Densidad** es cuánta información entra por pantalla (herramienta interna densa · producto
> consumer · mixto). **No** es cuántos usuarios tiene el cliente — ese dato no cambia nada.

### 3 · Respondé lo que falte

Son seis preguntas en dos rondas: **contexto** (tipo de proyecto · stack y superficie · densidad e
idioma) y **marca** (primario y acento · personalidad de la forma · tipografía y grises).

Tres cosas no te las va a preguntar, porque ya están decididas: dark mode viene siempre, los
tamaños de tipografía no se tocan, y el volumen de usuarios no cambia nada.

> **Ojo con qué color va en cada rol.** `--color-primary` es el tono **oscuro** (texto de página y
> sidebar); `--color-secondary` es el **acento** interactivo. Si el color vivo de la marca es un
> naranja o un lima, va como acento y el primario es el neutro oscuro de la marca. El generador te
> avisa si el hex no encaja, y verifica contraste AA antes de dejarte seguir.

### 4 · Mirá el preview y aprobá

Te deja **`theme-preview.html`**: todos los componentes con la marca del cliente, en claro y en
oscuro. Abrilo y probá el toggle. Si algo no representa la marca, decíselo y lo regenera.

**Ese archivo es lo que le mostrás al cliente en el kickoff.**

### Qué te queda en la carpeta

```
tu-proyecto/
├── brand/megatlon.css      ← la marca (solo primitivas, generado)
├── DESIGN.md               ← qué marca, qué idioma, qué se decidió, qué falta
├── theme-preview.html      ← para mostrar y aprobar
├── CLAUDE.md               ← el bloque que le dice al agente qué usar
└── index.html / src/…      ← el layout base, con el CSS en el orden correcto
```

Media hora, una vez. Después el proyecto no vuelve a pensar en el DS.

---

## Cuándo usar cada skill

Son cinco y **nunca hay duda de cuál**, porque cada una tiene un momento distinto en la vida del
proyecto. Leelas en este orden:

### 1 · `/design:embassy-start` — el día que arranca el proyecto

**Una sola vez, al principio.** Antes de que exista la primera pantalla.

Es la que hace las seis preguntas, genera el tema de la marca, verifica contraste y deja el
proyecto configurado. Si ya la corriste en este proyecto, no la volvés a correr nunca —
salvo que el cliente cambie de marca.

> *"¿Ya existe `brand/<cliente>.css` en la carpeta?"* Si sí, esta skill ya cumplió.

### 2 · `/design:design-system` — todos los días, para cada pantalla

**Es la que más vas a usar.** Cada vez que haya que armar una pantalla nueva, rediseñar una que
está mal, o migrar una vieja al DS.

```
armá la vista de listado de socios
esta pantalla no se entiende, rediseñala
migrá esta pantalla a Embassy
```

No te devuelve solo la pantalla: primero te dice **qué está mal y por qué** (citando la ley de UX
que se rompe), después qué movió, y recién ahí el código. Si te devuelve una pantalla donde solo
cambiaron los colores y los botones, algo falló — eso es un re-skin y la skill está hecha
justamente para no hacer eso.

### 3 · `/design:embassy-artifact` — cuando NO hay repo

**El corte es este: ¿esto vive en un repo de producto que se mantiene, o es un entregable de una
vez?**

Propuestas comerciales, reportes de proyecto, one-pagers, la página de resultados del trimestre,
un brief, una demo. Sale un HTML solo, on-brand, sin clonar nada y sin instalar nada.

> Si dudás entre esta y `design-system`, preguntate: *¿alguien va a volver a editar esto dentro de
> tres meses?* Sí → `design-system`. No → `embassy-artifact`.

### 4 · `/design:embassy-review` — antes de entregar o mergear

**El paso previo a mostrar algo.** No construye ni arregla: audita y te dice qué está mal, con
severidad y con el arreglo propuesto.

```
revisá esta pantalla antes de que la mande
¿esto respeta el DS?
esto no parece de Amalgama, ¿qué está mal?
```

Sirve también sobre cosas que no hiciste con Claude: le pegás una URL, un screenshot, un link de
Figma o un diff de un PR.

### 5 · `/design:embassy-eval` — no la vas a usar

**Es de los dueños del Design System.** Mide si el sistema mejora corriendo escenarios fijos y
comparando contra un baseline. Aparece acá solo para que sepas que existe y por qué no es para el
día a día.

---

### En una línea de tiempo

```
arranca el proyecto ──▶ embassy-start        (una vez)
                          │
        cada pantalla ──▶ design-system      (todo el tiempo)
                          │
     antes de entregar ──▶ embassy-review    (cada vez que mostrás algo)


        en paralelo, sin repo ──▶ embassy-artifact   (propuestas, reportes)
```

### Las tres confusiones que se dan siempre

| Si pensás… | En realidad va… |
|---|---|
| "Es una pantalla, uso `embassy-artifact`" | `design-system`, si vive en el repo del producto |
| "Quiero que revise y me lo arregle" | `embassy-review` solo diagnostica. Para que lo arregle, `design-system` |
| "Cada pantalla nueva la arranco con `embassy-start`" | No: `embassy-start` es una vez por proyecto |

El prefijo `design:` es el nombre del plugin. La forma corta (`/embassy-start`) también funciona
si no hay otra skill con ese nombre.

---

## Cómo funcionan los prompts

No hay una tabla de palabras mágicas con match exacto. Hay **tres mecanismos**, de más a menos
confiable.

**1 · El slash command.** Determinístico. Nombrás la skill y se ejecuta, escribas lo que escribas
después. Es el único mecanismo garantizado, y por eso esta guía los usa.

**2 · El `CLAUDE.md` de la carpeta.** Claude lo lee en **cada** mensaje que mandás estando en esa
carpeta. Si adentro dice "usá Embassy, la marca está en `brand/megatlon.css`, no hardcodees
colores", eso aplica siempre. `/design:embassy-start` te lo deja escrito — es la razón por la que
el paso 2 vale la media hora.

**3 · El disparo automático.** Claude lee la descripción de cada skill instalada y decide si tu
mensaje encaja. Es **semántico, no literal**: "esta pantalla está sobrecargada" dispara aunque esa
frase exacta no esté en ningún lado. Sube la probabilidad nombrar Embassy o Amalgama, decir
"pantalla", "rediseñá", "aplicá el design system", nombrar un componente del DS, o pedir algo
"con nuestra marca". Sube, no garantiza — si te importa que se dispare, usá el comando.

**Cómo sabés que se disparó:** la skill aparece nombrada en la interfaz, y el resultado trae el
commit del DS con el que trabajó y dice qué componente y qué variante eligió y por qué. Si te
devuelve una pantalla sin nada de eso, no se disparó: repetilo con el comando.

**Lo que hace bueno a un prompt**, con skill o sin skill: describí **el objetivo y el objeto** de
la pantalla, no los componentes.

> ✅ *"Armá la vista de listado de socios, filtrable por estado y plan; la acción principal es dar
> de alta; los usuarios entran a buscar a una persona puntual."*
>
> ❌ *"Hacé una tabla con filtros y un botón."*

El segundo te da componentes. El primero te da una pantalla, porque la skill arranca decidiendo
qué **es** la pantalla antes de elegir con qué se construye — y si vos ya se lo diste, sale bien a
la primera.

---

## Los cinco errores que esto evita

1. **Poner un color a mano.** Todo sale de tokens. Un `#3A5BB0` suelto rompe el dark mode.
2. **Inventar un componente que ya existe.** Hay 63. Si parece que falta, casi seguro está con otro
   nombre — y si de verdad falta, se marca como gap, no se improvisa.
3. **Dos acciones primarias en una pantalla.** Si las dos parecen igual de importantes, falta
   jerarquía.
4. **Un `<input placeholder="Buscar">`.** Existen `search-field` y `search-bar`, y cuál va depende
   de si filtra una lista de esta pantalla o es global.
5. **Tocar `variables.css` o un componente del DS desde el proyecto.** El proyecto solo escribe su
   `brand/<cliente>.css`, y ahí solo primitivas.

---

## Preguntas frecuentes

**¿Tengo que saber programar?**
Para `embassy-start` y `embassy-artifact`, no. Respondés preguntas y mirás el resultado.

**¿Y si el cliente todavía no definió la marca?**
Arrancás igual: queda la de Amalgama y se anota como pendiente en `DESIGN.md`. Cuando llegue el
color, se regenera en dos minutos.

**¿Puedo usar esto en un proyecto que ya existe?**
Sí. Si el proyecto ya tiene su propia capa de tokens, se usan esos nombres y se anota la
divergencia. Para un rollout completo sobre un proyecto grande existe el agente
`design-system-implementer`.

**¿Dónde veo los componentes?**
En `index.html` del repo del DS (el catálogo interactivo), o en
`presentations.amalgama.co/p/amalgama-design-system/`.

**Encontré algo que el DS resuelve mal.**
Decilo. Se anota en `FAILURES.md` y se arregla en el sistema, no en tu proyecto.

**¿Por qué la skill de pantallas se llama `design-system` y no `embassy`?**
Porque ya existía con ese nombre y hace exactamente eso. Tener dos skills compitiendo por el mismo
disparo es peor que una sola buena. Puede que se renombre más adelante.
