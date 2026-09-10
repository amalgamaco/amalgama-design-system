# Probalo vos

**Qué te pedimos:** una hora, una vez, y que nos cuentes qué te molestó.

No hace falta que sigas una checklist ni que sepas nada del Design System. La idea es que uses el
chat como lo usarías un martes cualquiera y que lo que salga mal, salga mal solo. Eso es lo que
queremos saber.

Si algo te resultó confuso, aunque no sepas explicar por qué, **eso también cuenta**. Sobre todo
eso.

---

## Antes de arrancar

1. Instalá el plugin **`embassy`** desde el marketplace de Amalgama.
2. Si tenés uno viejo llamado **`design`**, desinstalalo.
3. **Cerrá y reabrí Claude Code.** Los plugins se refrescan al arrancar, y si no lo hacés vas a
   pensar que faltan comandos que en realidad están.
4. Escribí `/embassy:` y fijate que aparezcan `start`, `screen`, `artifact`, `review` y `eval`.

> `break` y `explain` pueden no figurar en la lista: se invocan escribiendo el comando entero.

Si algo de esto no funciona, avisá y pará acá.

---

## 1 · Arrancá un proyecto

Creá una carpeta vacía en cualquier lado y hacé **Add folder** sobre esa carpeta.

> Nunca sobre la carpeta del Design System. El DS no se abre, se consume.

Escribí solamente esto:

```
/embassy:start
```

**Sin pegar datos ni explicar nada.** Te va a ir preguntando de a una. Contestá como si fuera un
cliente tuyo — inventá el que quieras, o usá este si no tenés ganas de pensar:

> Un gimnasio que se llama **Nortia**. Lo usa la gente de recepción, desde la computadora. Los
> colores son un verde oscuro `#14524A` y un verde vivo `#0E9F6E`. Esquinas redondeadas.

Sobre el final te va a preguntar cuatro cosas más: cuánto aire querés entre las cosas, cómo se
separan las tarjetas del fondo, cómo se mueve la interfaz y qué tan gruesos son los íconos. Cada
una viene con una recomendación puesta; podés dejarla o cambiarla.

Cuando termine, abrí el **`theme-preview.html`** que te dejó y pasalo a modo oscuro.

---

## 2 · Armá o mejorá una pantalla

`/embassy:screen` no es solo para pantallas nuevas: **también mira una que ya existe, te dice qué
está mal y la rehace.** Cualquiera de estas frases va al mismo lugar, y la que uses cambia lo que
hace:

```
/embassy:screen  armá la vista de listado de socios
/embassy:screen  mejorá esta pantalla
/embassy:screen  esta pantalla no se entiende, rediseñala
/embassy:screen  hay demasiada información acá, ordenala
/embassy:screen  migrá esta pantalla al design system
/embassy:screen  esto no parece de Amalgama, arreglalo
```

Probá **las dos cosas**: una de cero y una sobre algo que ya tengas. La segunda es la que más nos
interesa, porque es donde la skill puede quedarse corta y limitarse a cambiar los colores.

Para la de cero, en la misma carpeta:

```
/embassy:screen

Armá la vista de listado de socios. Se puede filtrar por estado y por plan.
La acción principal es dar de alta un socio nuevo. Los usuarios entran
mayormente a buscar a una persona puntual.
```

Para la otra, agarrá una pantalla real de un proyecto tuyo —cuanto más vieja, mejor— y pedile que
la mejore.

Miralos como mirarías el trabajo de alguien del equipo. En el caso de la pantalla que ya existía,
la pregunta clave es: **¿además de verse mejor, quedó más fácil de usar?** Si lo único que cambió
son los colores y los botones, se quedó a mitad de camino y queremos saberlo.

---

## 3 · Contanos

Las únicas preguntas que nos importan:

- **¿Se lo mandarías a un cliente?** Si no, ¿qué le falta o qué le sobra?
- **¿Alguna pregunta no se entendió?** Copiala tal cual. Si tuviste que adivinar qué significaba
  una palabra, esa pregunta está mal escrita y la reescribimos.
- **¿Te trabaste en algún momento?** Dónde y con qué.
- **¿Algo se ve mal?** Un color raro, texto que no se lee, algo desalineado, la pantalla en el
  celular. Un screenshot alcanza.
- **¿Te dijo que sí a algo que debería haber frenado?** Por ejemplo si le pedís dos botones
  principales o un color a mano, tendría que corregirte.

Mandale lo que encuentres a Ana, con el prompt que usaste y un screenshot. No hace falta que lo
clasifiques ni que propongas el arreglo: eso lo hacemos nosotros, y se arregla en el sistema, no en
tu proyecto.

---

## Si te sobran ganas

Cualquiera de estas tres suma, y ninguna lleva más de diez minutos:

- **Repetilo con un cliente real tuyo y su marca real.** Es lo que más sirve: los colores de verdad
  rompen cosas que un cliente inventado no rompe.
- **Pegale una pantalla vieja a `/embassy:review`** y fijate si lo que te marca es cierto. Ojo con
  la diferencia: `review` te dice qué está mal y no toca nada; `screen` lo arregla. Si te marca algo
  que está bien, queremos saberlo.
- **Pedile un one-pager con `/embassy:artifact`**, sin repo ni carpeta de por medio.

---

## Una sola cosa que ya sabemos

**Si un comando "no existe", reiniciá Claude Code antes de reportarlo.** Los plugins se refrescan al
arrancar y una skill nueva no aparece hasta entonces. Nos pasó y perdimos un rato buscando un bug
que no estaba.
