# Cómo usar el Design System — guía para el equipo

Una página. Sin teoría: qué escribir, dónde, y qué pasa.
El razonamiento detrás está en `PLAN-USO-DS.md`.

---

## Antes que nada (una sola vez, por persona)

Tenés que tener el **plugin `design`** instalado en Claude. Si ya usaste
`/design:design-system` alguna vez, ya lo tenés y se actualiza solo.

No necesitás clonar el repo del Design System. Las skills lo traen solas.

---

## Arrancar un proyecto nuevo

### 1 · Abrí la carpeta del proyecto en Claude

En la app de Claude, agregá la carpeta del proyecto (el botón **Add folder**). Puede estar vacía.

### 2 · Escribí esto

> **`/embassy-start`**
>
> o, en tus palabras: *"Necesito arrancar este proyecto con el Design System de Amalgama,
> white-label para Megatlón."*

### 3 · Respondé seis preguntas

Te va a preguntar, en dos tandas:

**Contexto** — qué tipo de proyecto es (cliente / interno / entregable suelto) · con qué stack y
qué superficie (buildless, React, app con sidebar, landing…) · para quién es y en qué idioma.

**Marca** — el color primario y el de acento (**un hex de cada uno alcanza**) · la personalidad de
la forma (redondeada / balanceada / técnica) · tipografía y grises.

> No te va a preguntar si querés dark mode: ya viene. Ni los tamaños de tipografía: no se tocan.
> Ni cuántos usuarios tiene el cliente: no cambia nada.

### 4 · Mirá el preview y aprobá

Al terminar te deja **`theme-preview.html`**: todos los componentes con la marca del cliente, en
claro y oscuro. Abrilo. Si algo no representa la marca, decíselo y lo regenera.

**Ese archivo es lo que le mostrás al cliente en el kickoff.**

### Qué te queda en la carpeta

```
tu-proyecto/
├── brand/megatlon.css      ← la marca (solo primitivas, generado)
├── DESIGN.md               ← el contrato: qué marca, qué idioma, qué se decidió, qué falta
├── theme-preview.html      ← para mostrar y aprobar
├── CLAUDE.md               ← con el bloque que le dice al agente qué usar
└── index.html / src/…      ← el layout base, con el CSS en el orden correcto
```

Total: **media hora, una vez.** Después el proyecto no vuelve a pensar en el DS.

---

## El día a día

Abrís la carpeta del proyecto en Claude y escribís lo que necesitás. La regla para elegir es una
sola pregunta: **¿esto vive en el repo del producto?**

| Quiero… | Escribo | Qué me devuelve |
|---|---|---|
| Armar o rediseñar una pantalla | **`/embassy`** *"armá la vista de listado de socios"* | La pantalla con componentes reales, más un reporte de qué eligió y por qué |
| Una propuesta, un reporte, un one-pager | **`/embassy-artifact`** *"armá una propuesta para Megatlón"* | Un HTML on-brand, sin necesidad del repo |
| Revisar algo antes de entregar o mergear | **`/embassy-review`** *"revisá esta pantalla"* | Lista de problemas con severidad y cómo arreglar cada uno |
| Arrancar un proyecto | **`/embassy-start`** | Lo de arriba |

No hace falta que te acuerdes de las reglas del DS. Las skills las aplican y el chequeo final las
verifica.

---

## Las skills, en una línea cada una

| Skill | Para qué | ¿Necesita el repo del DS? |
|---|---|---|
| `embassy-start` | El kickoff: seis preguntas y el proyecto queda configurado | Lo trae sola |
| `embassy` | Construir pantallas de producto | Lo trae sola |
| `embassy-artifact` | Entregables de una vez, on-brand, sin repo | No |
| `embassy-review` | Auditar y decir qué está mal, con severidad | Lo trae sola |
| `embassy-eval` | Medir si el sistema mejora — **solo dueños del DS** | Sí |

**Están conectadas al Design System de verdad**, no son prompts sueltos: viven versionadas en el
repo del DS, lo leen en cada sesión y registran con qué commit trabajaron. Si mañana cambia un
componente, la skill que lo enseña cambió en el mismo commit.

---

## Los cinco errores que esto evita (y que no hay que hacer a mano)

1. **Poner un color a mano.** Todo sale de tokens. Un `#3A5BB0` suelto rompe el dark mode.
2. **Inventar un componente que ya existe.** Hay 62. Si parece que falta, casi seguro está con
   otro nombre — y si de verdad falta, se marca, no se improvisa.
3. **Dos acciones primarias en una pantalla.** Si las dos parecen igual de importantes, falta
   jerarquía.
4. **Un `<input placeholder="Buscar">`.** Existen `search-field` y `search-bar`, y cuál va depende
   de si filtra una lista de esa pantalla o es global.
5. **Tocar `variables.css` o un componente del DS desde el proyecto.** El proyecto solo escribe su
   `brand/<cliente>.css`, y ahí solo primitivas.

---

## Preguntas frecuentes

**¿Tengo que saber programar?**
Para `/embassy-start` y `/embassy-artifact`, no. Respondés preguntas y mirás el resultado.

**¿Y si el cliente todavía no definió la marca?**
Arrancás igual: se queda la de Amalgama y queda anotado como pendiente en `DESIGN.md`. Cuando
llegue el color, se regenera el tema en dos minutos.

**¿Puedo usar esto en un proyecto que ya existe?**
Sí. `/embassy` detecta si el proyecto ya tiene su propia capa de tokens y usa esos nombres. Para un
rollout completo sobre un proyecto grande, existe el agente `design-system-implementer`.

**¿Dónde veo los componentes?**
En `index.html` del repo del Design System (el catálogo interactivo), o en
`presentations.amalgama.co/p/amalgama-design-system/`.

**Encontré algo que el DS resuelve mal.**
Decilo. Se anota como falla en `FAILURES.md` y se arregla en el sistema, no en tu proyecto.

---

## Estado actual (septiembre 2026)

Hoy está instalada **`/design:design-system`**, que hace lo que hace `embassy` pero en un solo
archivo grande. Las cinco skills de esta guía están escritas y probadas en
`_propuesta-capa-ai/` del repo del DS, **pendientes de adoptar**.

El arreglo que las bloqueaba —el tema de marca no llegaba a modo oscuro— **ya está hecho y
verificado** en el repo (`PLAN-USO-DS.md` §7.0).
