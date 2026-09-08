# Cómo trabajamos con el Design System

Guía paso a paso, para diseño y para desarrollo. Sin teoría: qué hacer, en qué orden, qué esperar.
El razonamiento está en `PLAN-USO-DS.md`; el diagnóstico en `ANALISIS-SKILLS-DS.md`.

Cada paso está marcado con quién lo hace: **[todos]** · **[diseño]** · **[dev]**.

---

## 1. Las tres reglas de cómo trabajamos

Esto es lo que Vercel describe en su artículo y lo que estamos adoptando. Tres ideas, nada más:

**Una sola fuente de verdad.** El repo del Design System es el único lugar donde vive lo que es
cierto. Nadie copia tokens, colores ni componentes a su proyecto: los consume. Si algo cambia,
cambia en un solo lado.

**El agente aplica las reglas, vos no tenés que acordártelas.** No hace falta recordar que hay una
sola acción primaria por pantalla, ni cuándo va un tipo de buscador y cuándo otro. Las skills lo
saben y lo aplican; un script lo verifica antes de entregar.

**Se mide, no se opina.** Cuando alguien dice "esto no parece nuestro", eso se convierte en una
falla con nombre, se anota, y la próxima vez el sistema la evita. Vercel bajó de 91 a 39 fallas
conocidas haciendo exactamente esto — un 57% menos. No es una impresión: es un número que se
compara contra la corrida anterior.

---

## 2. Antes de empezar (una vez por persona) **[todos]**

Necesitás el **plugin `design`** instalado en Claude. Si alguna vez usaste `/design:design-system`,
ya lo tenés y se actualiza solo.

No necesitás clonar nada. Las skills traen el Design System solas.

---

## 3. Arrancar un proyecto nuevo

### Paso 1 · Abrí la carpeta del proyecto **[todos]**

En la app de Claude, botón **Add folder**, elegí la carpeta del proyecto. Puede estar vacía.

### Paso 2 · Pedilo, en una frase **[todos]**

**No hay una fórmula que memorizar.** Cualquiera de estas dos arranca exactamente lo mismo:

```
/embassy-start
```

```
Necesito arrancar este proyecto con el Design System de Amalgama, white-label para Gamafit.
```

La única diferencia es si te hace las preguntas o ya se las respondiste. **Si tenés los datos a
mano, pegalos de una y te ahorrás la ida y vuelta:**

```
Necesito arrancar este proyecto con el Design System de Amalgama, white-label.

Cliente: Gamafit
Stack: React / Next
Superficie: dashboard
Densidad: herramienta interna densa      ← cuán apretada es la UI, NO cuántos usuarios hay
Idioma de la UI: español rioplatense
Marca: primario #XXXXXX, acento #YYYYYY
Forma: redondeada
Tipografía: las de Embassy
```

> **La línea de «Densidad» es la que más se contesta mal.** No pregunta cuántos usuarios tiene el
> negocio — eso no cambia ningún token. Pregunta en qué contexto se usa: herramienta interna densa,
> producto consumer con targets grandes, o mixto. Eso sí define tamaños, targets táctiles y tema.

### Paso 3 · Respondé lo que falte **[todos]**

Vienen en dos tandas. **Un hex por paleta alcanza** — las diez tintas las genera el sistema.

**Contexto**

1. ¿Qué tipo de proyecto es? — cliente white-label · interno de Amalgama · entregable de una vez
2. ¿Stack y superficie? — buildless / React / proyecto con tokens propios · y: app con sidebar,
   sitio, dashboard
3. ¿Para quién y en qué idioma? — herramienta interna densa · producto consumer · mixto

**Marca** (solo si es white-label)

4. Color primario y de acento
5. Personalidad de la forma — redondeada · balanceada · técnica
6. Tipografía y grises

No te va a preguntar si querés modo oscuro (ya viene), ni los tamaños de tipografía (no se tocan),
ni cuántos usuarios tiene el cliente (no cambia nada).

### Paso 4 · Mirá el preview y aprobá **[diseño]**

Te queda un archivo **`theme-preview.html`**: todos los componentes con la marca del cliente, en
claro y en oscuro. Abrilo en el navegador.

Si algo no representa la marca, decíselo y lo regenera. **Es el momento de discutir** — no cuando
ya hay veinte pantallas hechas.

Ese mismo archivo es lo que le mostrás al cliente en el kickoff. Su marca, sobre componentes
reales, funcionando.

### Paso 5 · Revisá lo que quedó **[dev]**

```
tu-proyecto/
├── brand/megatlon.css      la marca (solo primitivas, generado)
├── DESIGN.md               el contrato: qué marca, qué idioma, qué se decidió, qué falta
├── theme-preview.html      para mostrar y aprobar
├── CLAUDE.md               con el bloque que le dice al agente qué usar
└── index.html / src/…      el layout base, con el CSS en el orden correcto
```

El orden de carga del CSS importa y siempre es este:

```html
<link rel="stylesheet" href=".../css/variables.css">   <!-- 1. tokens -->
<link rel="stylesheet" href="brand/megatlon.css">       <!-- 2. la marca -->
<link rel="stylesheet" href=".../css/base.css">         <!-- 3. reset -->
<link rel="stylesheet" href=".../css/layout.css">       <!-- 4. solo si hay sidebar -->
<link rel="stylesheet" href=".../css/components.css">   <!-- 5. componentes -->
```

**Media hora, una vez.** Después el proyecto no vuelve a pensar en el Design System: lo usa.

---

## 4. ¿Es desktop o es mobile?

La pregunta correcta no es "¿desktop o mobile?" sino **"¿qué usa la mayoría, y en qué contexto?"**.
Embassy es responsive por contrato: el mismo código sirve para las dos. Lo que cambia es cómo se
arma cada pantalla.

| Si el proyecto es… | Lo que cambia |
|---|---|
| **Herramienta interna de escritorio** (backoffice, dashboard) | App shell con sidebar y topbar (`layout.css`). Tablas de verdad. Buscador compacto en el toolbar. Densidad alta, tamaños por defecto |
| **Producto consumer, mayormente teléfono** | Sin sidebar fijo: navegación en drawer. Tablas se vuelven cards apiladas. Filtros en un panel que sube desde abajo. Buscador tipo píldora. Acción principal en tamaño grande |
| **Los dos por igual** | Se diseña angosto primero y se mejora en pantallas grandes. Es el default y es lo más común |
| **App nativa iOS / Android** | **Embassy hoy no la cubre.** Es solo web. Está en el roadmap, no en el sistema actual — decilo en el kickoff antes de prometerlo |

**Lo importante:** mobile no es el desktop achicado. Es una estructura propia. Cuando pedís una
pantalla, `/embassy` decide la transformación correcta sola:

| En escritorio | En teléfono |
|---|---|
| Tabla | Cards apiladas |
| Sidebar fijo | Menú que se desliza sobre la pantalla |
| Filtros en la barra | Panel que sube desde abajo |
| Buscador compacto | Buscador tipo píldora |
| Acciones que aparecen al pasar el mouse | Siempre visibles |
| Varias columnas | Una sola, lo más importante primero |

Y hay un piso que no se negocia: **cualquier cosa que se toca mide 44px o más**. En una pantalla
táctil, un botón de 30px es un botón que falla.

---

## 5. Cuándo usar cada skill

Ordenado por el momento del proyecto en el que estás.

### Antes de que el proyecto exista

| Momento | Skill | Por qué |
|---|---|---|
| Armar la propuesta comercial para ganarlo | **`embassy-artifact`** | Todavía no hay repo ni marca del cliente. Sale on-brand de Amalgama, sin clonar nada |

### El día que arranca

| Momento | Skill | Por qué |
|---|---|---|
| Configurar el proyecto por primera vez | **`embassy-start`** | Seis preguntas y queda listo. **Una sola vez por proyecto** |

### Todos los días, construyendo

| Momento | Skill | Por qué |
|---|---|---|
| **Cualquier pantalla** — nueva, rediseño de una que no funciona, o migración de una legacy | **`embassy`** | Es el mismo trabajo con distinto punto de partida: primero decide qué es la pantalla, después la construye |
| Antes de entregar, mergear o mostrar al cliente. O cuando algo «no parece nuestro» | **`embassy-review`** | Te dice qué está mal y con qué severidad. No toca nada |

### Cosas que no son producto

| Momento | Skill | Por qué |
|---|---|---|
| Reporte de proyecto, one-pager, página de resultados, demo | **`embassy-artifact`** | No vive en un repo. No necesita el DS clonado |

### Sobre el sistema, no sobre un proyecto

| Momento | Skill | Por qué |
|---|---|---|
| Falta un componente y hay que agregarlo | **`embassy-contribute`** *(pendiente de escribir)* | CSS + regla + manifest + docs + validación |
| Saber si el sistema mejoró después de un cambio | **`embassy-eval`** | Solo para los dueños del DS |

### Los tres pares que se confunden

**`embassy` vs `embassy-artifact`** — la pregunta es *¿esto vive en el repo de un producto?*
Sí → `embassy`, que lee el detalle del componente en el repo.
No → `embassy-artifact`, que trabaja con una lista acotada de clases y tiene prohibido leer el CSS.

**`embassy` vs `embassy-review`** — *¿querés que cambie algo, o que te diga qué está mal?*
`embassy` construye. `embassy-review` diagnostica y no toca nada. En un PR ajeno, review.

**`embassy-start` vs `embassy`** — *¿es la primera vez en este proyecto?*
`embassy-start` se corre una vez y configura. `embassy` se corre en cada pantalla, siempre.

### Cuándo no usar ninguna

- Preguntas sobre el sistema («¿qué componente uso para X?») — se contestan leyendo
  `component-rules/` o el catálogo, sin skill.
- Código que no es UI.
- Cambiar un texto o un dato en una pantalla que ya está bien.

### Cómo se disparan

Dos formas:

- **Por nombre:** escribís `/embassy` y arranca. Siempre funciona.
- **Por lo que decís:** cada skill tiene una lista de frases que la activan. *"mejorá esta
  pantalla"*, *"armá la vista de X"*, *"revisá esto antes de entregar"* disparan la que
  corresponde, sin nombrarla.

El disparo automático es una comodidad, no una garantía: depende de que tu frase se parezca a
la descripción de la skill. **Si el trabajo importa, escribila con `/`.**

**Cómo saber si se disparó:** se ve en la interfaz, arriba de la respuesta. Y en el contenido —
si se cargó, Claude registra el commit del Design System y te dice qué componente eligió y por
qué. Si te devuelve UI sin mencionar nada de eso, no se disparó: escribila con `/` y repetí.

---

## 6. El día a día, en una línea

La pregunta que rutea es siempre la misma: **¿esto vive en el repo del producto?**

- **Sí** → `/embassy` para construir, `/embassy-review` antes de entregar.
- **No** → `/embassy-artifact`.
- **Primera vez en este proyecto** → `/embassy-start`.

---

## 7. Por qué la UI sale clara y legible

No es estilo: son reglas que el sistema aplica solo. Conviene conocerlas para poder discutirlas.

**Una sola acción principal por pantalla.** Si dos parecen igual de importantes, falta jerarquía —
y el sistema lo va a marcar en vez de dejarlo pasar.

**Todo alineado a una sola columna.** El título, la barra de búsqueda, los filtros y los resultados
comparten los mismos bordes. Nada se centra por su cuenta. Es lo que hace que una pantalla se vea
ordenada aunque no sepas explicar por qué.

**Un ancho pensado, no el ancho de la ventana.** Una lista o un dashboard viven en unos 1200px; un
texto para leer, en 800; un formulario, en 650. Texto que cruza un monitor entero no se lee.

**Cada estado diseñado, no solo el que sale bien.** Vacío la primera vez, vacío porque el filtro no
encontró nada, cargando, error, éxito. Una pantalla sin estado vacío no está terminada.

**Colores desde tokens, nunca a mano.** Por eso el modo oscuro funciona solo y por eso cambiar la
marca de un cliente son quince variables y no revisar cien pantallas.

**Un solo set de íconos** (Lucide) y **una sola escala tipográfica**. Sin excepciones por pantalla.

Si algo de esto se rompe, `/embassy-review` lo nombra con su severidad y dice cómo arreglarlo.

---

## 8. El loop: lo que nos hace trabajar como Vercel

Esta es la parte que convierte "tenemos un design system" en "el design system mejora".

**Cuando algo no te cierra, decilo.** No hace falta que sepas por qué. "Esto no parece nuestro" es
suficiente para empezar.

**Se traduce a algo medible.** "Se siente apretado" no sirve; "el buscador y los resultados no
comparten el borde izquierdo" sí, porque dos personas lo cuentan igual. Eso se anota en la lista de
fallas conocidas con un identificador.

**Se arregla en un solo lugar.** Si es criterio, va a la guía. Si es mecánico, al CSS. Si se puede
detectar automáticamente, a un script. Nunca en los tres, porque después se desincronizan.

**Y se mide si funcionó.** Se corren los mismos escenarios de siempre, con y sin la corrección, y
se cuentan las fallas. Si no bajan, la corrección no servía.

Para el equipo esto significa una sola cosa: **tu queja no se pierde en un Slack.** Entra al
sistema y la próxima vez no vuelve a pasar.

---

## 9. Cuando algo sale mal

| Pasa esto | Hacé esto |
|---|---|
| El color/componente que necesito no existe | No lo inventes. Decilo: se agrega al sistema o se compone con lo que hay |
| Quedó feo y no sé por qué | `/embassy-review` sobre esa pantalla. Te dice qué está mal y con qué severidad |
| El cliente no definió la marca todavía | Arrancás igual con la de Amalgama; queda anotado como pendiente en `DESIGN.md` |
| Necesito una pantalla que no se parece a nada que tengamos | `/embassy` igual: elige el arquetipo más cercano y te dice qué decisiones tomó |
| Me pidieron una app nativa | Embassy es web. Decilo antes de comprometer el diseño |

---

## 10. Estado actual (septiembre 2026)

Hoy está instalada **`/design:design-system`**, que hace lo de `embassy` pero en un solo archivo
grande. Las cinco skills de esta guía están escritas y probadas en `_propuesta-capa-ai/`,
**pendientes de adoptar**. Si alguien tipea `/embassy-start` hoy, todavía no le va a funcionar.

El arreglo que las bloqueaba —el tema de marca no llegaba al modo oscuro— **ya está hecho y
verificado** en el repo.

Lo que falta para que esto sea real: adoptar las skills, y que alguien se haga dueño de correr el
loop del punto 7. Sin eso último tenemos las piezas, no el método.
