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

### Paso 2 · Escribí esto **[todos]**

```
/embassy-start
```

O en tus palabras: *"necesito arrancar este proyecto con el Design System de Amalgama, white-label
para Megatlón"*.

### Paso 3 · Respondé seis preguntas **[todos]**

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

## 5. El día a día

Abrís la carpeta del proyecto y escribís lo que necesitás. Para elegir hay **una sola pregunta:
¿esto vive en el repo del producto?**

| Quiero… | Escribo | Quién |
|---|---|---|
| Armar o rediseñar una pantalla | `/embassy` | diseño + dev |
| Una propuesta, un reporte, un one-pager | `/embassy-artifact` | todos |
| Revisar antes de entregar o mergear | `/embassy-review` | todos |
| Arrancar un proyecto | `/embassy-start` | todos |

`/embassy-artifact` es la única que no necesita el repo. Sirve para lo que no vive en un producto:
una propuesta comercial, un reporte de proyecto, una página de resultados.

---

## 6. Por qué la UI sale clara y legible

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

## 7. El loop: lo que nos hace trabajar como Vercel

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

## 8. Cuando algo sale mal

| Pasa esto | Hacé esto |
|---|---|
| El color/componente que necesito no existe | No lo inventes. Decilo: se agrega al sistema o se compone con lo que hay |
| Quedó feo y no sé por qué | `/embassy-review` sobre esa pantalla. Te dice qué está mal y con qué severidad |
| El cliente no definió la marca todavía | Arrancás igual con la de Amalgama; queda anotado como pendiente en `DESIGN.md` |
| Necesito una pantalla que no se parece a nada que tengamos | `/embassy` igual: elige el arquetipo más cercano y te dice qué decisiones tomó |
| Me pidieron una app nativa | Embassy es web. Decilo antes de comprometer el diseño |

---

## 9. Estado actual (septiembre 2026)

Hoy está instalada **`/design:design-system`**, que hace lo de `embassy` pero en un solo archivo
grande. Las cinco skills de esta guía están escritas y probadas en `_propuesta-capa-ai/`,
**pendientes de adoptar**. Si alguien tipea `/embassy-start` hoy, todavía no le va a funcionar.

El arreglo que las bloqueaba —el tema de marca no llegaba al modo oscuro— **ya está hecho y
verificado** en el repo.

Lo que falta para que esto sea real: adoptar las skills, y que alguien se haga dueño de correr el
loop del punto 7. Sin eso último tenemos las piezas, no el método.
