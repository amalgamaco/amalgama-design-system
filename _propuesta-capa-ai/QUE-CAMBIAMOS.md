# Qué le copiamos a Vercel, y qué cambiamos en Embassy

Para contarle al equipo, sin tecnicismos.

---

## El problema que teníamos

Embassy existía y estaba bien: 62 componentes, tokens, reglas. Pero cuando alguien le pedía una
pantalla a Claude, salía **algo parecido a Amalgama y distinto cada vez**. El agente no leía el
design system: lo aproximaba de memoria. Ponía un `#3A5BB0` a mano, inventaba un buscador, se
olvidaba del estado vacío.

No era un problema de conocimiento del agente. Era que **el design system no estaba escrito en un
formato que un agente pueda consumir**: vivía en Figma, en la doc y en la cabeza de quienes lo
armamos.

---

## Lo que hizo Vercel

Vercel publicó cómo resolvieron exactamente esto. Su receta tiene tres piezas, y ninguna es un
modelo entrenado ni una herramienta cara:

1. **Un archivo público con el criterio de marca** (`vercel.com/design.md`): no la lista de
   componentes, sino *cómo se decide*. Qué composición usar, qué está prohibido, cómo se escribe.
2. **Una API pública acotada**: la lista corta de clases que un agente puede usar. Si algo no está
   en la lista, no existe.
3. **Un loop de medición**: los mismos escenarios generados una y otra vez, contando fallas, y cada
   corrección va **a la guía**, no a la pantalla.

Con eso bajaron de 91 a 39 fallas conocidas — **57% menos** — en más de 200 corridas.

---

## Lo que hicimos nosotros

Las tres piezas, adaptadas a cómo trabajamos:

| Vercel | Nosotros | Dónde está |
|---|---|---|
| `design.md` público | `design.md` en la raíz del repo, servido por GitHub | el agente lo lee por URL, sin clonar nada |
| API pública acotada | `PUBLIC-API.md` + `public-api.json` — **63 componentes, 509 clases**, con el markup canónico de cada uno | se genera solo desde el CSS, no se escribe a mano |
| Loop de medición | `/embassy:eval` + la carpeta `runs/` | ya corrió dos veces |

**Lo importante del primero:** `design.md` no dice "usá el botón primary". Dice *cuándo* algo es
una acción primaria, por qué solo puede haber una, y muestra los 18 reflejos de diseño generado que
hay que rechazar — el eyebrow decorativo, las cards anidadas, el gradiente, los números sin base.
Es criterio, no catálogo.

**Lo importante del segundo:** que se genere solo. Cada vez que alguien agrega un componente al CSS,
la lista se regenera y el agente se entera. No hay una segunda fuente que se desactualice.

---

## Lo que agregamos, que Vercel no tiene

Acá nos fuimos por encima de la receta, por cómo es nuestro trabajo:

- **Un idioma común para las fallas.** `FAILURES.md`: 67 fallas con ID, severidad y cómo se
  detectan, agrupadas de la A a la I (tokens, componente, jerarquía, layout, estados,
  accesibilidad, motion, reflejos, proceso). Sirve para que "esto está mal" sea una frase con
  ID, y para que dos personas midan igual.
- **Siete skills conversacionales** en vez de un archivo que hay que saber leer. `/embassy:start`
  te pregunta qué necesitás y arranca lo que corresponde: armar una pantalla, un entregable sin
  repo, una auditoría, migrar una app. Nadie tiene que aprenderse comandos.
- **La capa white-label.** Vercel tiene una sola marca; nosotros tenemos una por cliente. Un
  cliente se configura una vez, contestando preguntas en castellano, y el sistema genera las 25
  tintas de la paleta con la curva de Embassy y **verifica el contraste AA solo**, bloqueando si
  algo no llega.
- **Chequeos determinísticos.** `check-output.mjs` mira lo que el agente *produjo* — hex crudos,
  clases que no existen, dos acciones primarias — y no depende de que otro modelo tenga buen día.

---

## Qué cambió en la estructura del repo

Concretamente, lo que hoy hay y antes no:

```
design.md            ← el criterio de marca, público
PUBLIC-API.md        ← las 509 clases permitidas, generado
public-api.json      ← lo mismo, para que lo lea una máquina
FAILURES.md          ← las 67 fallas con ID y severidad
component-rules/     ← 69 reglas, una por componente: cuándo usarlo y cuándo no
runs/                ← las corridas de medición, con su evidencia
scripts/             ← generar la API, generar un tema de marca, y los dos chequeos
```

Y adentro del CSS, cuatro cosas que antes estaban hardcodeadas y ahora son decisiones de marca:
**el espaciado** (los 15 pasos son tokens, así que la densidad se puede cambiar de una),
**la elevación**, **el movimiento** y **el grosor de los íconos**. Más las **superficies del modo
oscuro**, que ahora toman el tono de la marca en vez de ser siempre el negro azulado de Amalgama.

---

## Qué medimos hasta ahora

Dos corridas del escenario 1 (un listado con filtros, buscador y paginación):

| | fallas automáticas |
|---|---|
| Sin el design system | 64 |
| Con el design system | 1 → 4 |

**El número miente un poco y conviene decirlo:** 61 de las 64 son colores y tamaños escritos a mano,
que una página hecha a mano tiene por definición. Lo que el conteo demuestra es que el DS elimina
una clase entera de errores, no que la pantalla esté mejor pensada.

Lo que sí importó fue mirar las dos pantallas al lado. La primera corrida guiada tenía el toolbar
partido en dos y los cuatro estados visibles a la vez. Arreglamos **la guía**, no la pantalla, y en
la segunda corrida eso desapareció. Aparecieron dos fallas nuevas, más chicas, que también fueron a
la guía. Ese ida y vuelta *es* el loop.

---

## Qué falta

- Los escenarios 2 a 7 del loop (hoy existe solo el 1).
- La ronda de prueba con gente de verdad: `PRUEBA-EQUIPO.md`. Un baseline sintético no reemplaza a
  alguien usando esto con un cliente real.

---

## La idea en una frase

Antes el design system era **algo que había que saber**. Ahora es **algo que el agente lee, y que
se corrige solo cada vez que alguien encuentra una falla** — porque la corrección va al sistema, no
al proyecto.
