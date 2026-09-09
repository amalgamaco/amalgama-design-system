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

## 2 · Hacé una pantalla

En la misma carpeta:

```
/embassy:screen

Armá la vista de listado de socios. Se puede filtrar por estado y por plan.
La acción principal es dar de alta un socio nuevo. Los usuarios entran
mayormente a buscar a una persona puntual.
```

Miralo como mirarías el trabajo de alguien del equipo.

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
- **Pegale una pantalla vieja tuya a `/embassy:review`** y fijate si lo que te marca es cierto. Si
  te marca algo que está bien, queremos saberlo.
- **Pedile un one-pager con `/embassy:artifact`**, sin repo ni carpeta de por medio.

---

## Lo que ya sabemos

Para que no gastes tiempo escribiéndolo:

- **Lo flojo es la composición, no los colores.** Medimos una pantalla generada con el DS y no
  tenía un solo color a mano, pero el toolbar quedó partido en dos y los mensajes de error
  aparecían encima de los resultados. Si ves algo así, contalo igual —queremos saber cuánto pasa—
  pero no te sorprendas.
- **Si un comando "no existe", reiniciá Claude Code antes de reportarlo.** Los plugins se refrescan
  al arrancar y una skill nueva no aparece hasta entonces.
