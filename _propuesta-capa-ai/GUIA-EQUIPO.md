# Empezar con el Design System de Amalgama

Todo lo que hace falta saber para usarlo, en el orden en que lo vas a necesitar.
Sirva cual sea tu rol: no hace falta saber git, ni terminal, ni haber visto el repo.

> **Estado al 8 de septiembre de 2026 — leer esto primero.**
> Los cambios de esta guía están escritos y probados, pero **todavía no publicados**. El equipo
> tiene instalada la versión anterior de la skill (`design` v0.9.2). Los pasos 2 y 3 de acá abajo
> funcionan hoy **solo** en la máquina donde se escribieron.
> Falta pushear y mergear dos branches: `ds/capa-ai-y-fix-white-label` en el repo del Design
> System, y `design/embassy-diagnostico` en el de plugins. Primero la del DS.

---

## Qué es esto

**Embassy** es el Design System de Amalgama: los colores, tipografías, espaciados y los 62
componentes con los que armamos interfaces. Vive en un repositorio, y es la única fuente de verdad.

**Las skills** son la forma de usarlo con Claude. Traen el sistema, aplican sus reglas y verifican
el resultado, para que nadie tenga que acordarse de nada.

---

## Antes de empezar

Un solo requisito: **el plugin `design` instalado en Claude.** Se instala solo para todos en
Amalgama. Si alguna vez usaste `/design:design-system`, ya lo tenés.

No necesitás clonar el Design System, ni tener acceso a su repositorio, ni saber que existe.
La skill lo baja sola y lo deja en una carpeta temporal que nunca vas a ver.

---

## El camino, en cuatro pasos

### 1 · Conectar la carpeta *(una vez por proyecto)*

Creá la carpeta del proyecto en tu computadora. Puede estar vacía.
En Claude: **Add folder** → elegila.

> Conectás **la carpeta del proyecto**, no la del Design System. La regla general: conectás la
> carpeta donde querés que aparezcan los archivos.

### 2 · Adaptarlo a tu proyecto *(una vez por proyecto)*

Escribí un mensaje con los datos. Lo que no sepas, dejalo afuera y te lo pregunta.

```
Necesito arrancar este proyecto con el Design System de Amalgama, white-label.

Cliente: Gamafit
Stack: React / Next
Superficie: dashboard
Densidad: herramienta interna densa
Idioma de la UI: español rioplatense
Marca: primario #XXXXXX, acento #YYYYYY
Forma: redondeada
Tipografía: las de Embassy
```

**Un hex por paleta alcanza** — las diez tintas las genera el sistema y verifica que el contraste
llegue a AA. Si algo no da, te frena ahí y te lo dice.

Te quedan cuatro cosas en la carpeta:

| Archivo | Qué es |
|---|---|
| `brand/gamafit.css` | La marca. Se genera, no se edita a mano |
| `DESIGN.md` | Qué se decidió y qué quedó pendiente |
| `preview.html` | Para aprobar la marca |
| El layout base | Con el CSS cargado en el orden correcto |

Y algo que no se ve pero es lo que hace que el paso 4 funcione: deja escrito en el `CLAUDE.md` del
proyecto que hay que usar la skill. Eso lo lee Claude en cada mensaje dentro de esa carpeta.

### 3 · Ver el preview y aprobar *(una vez, con diseño)*

Doble click en `preview.html`. Tocá el switch de **Modo oscuro**.

¿No representa a la marca? Decíselo con tus palabras — *"el acento está muy apagado, probá
#XXXXXX"* — y lo regenera.

**Ese archivo es también lo que le mostrás al cliente en el kickoff.** Su marca, sobre componentes
reales, funcionando en los dos temas.

### 4 · Pedir pantallas *(siempre)*

```
Armá la pantalla de listado de envíos.
```

```
Mejorá esta pantalla, está sobrecargada.
```

```
Revisá esta pantalla antes de que la mande.
```

En un rediseño te devuelve **primero el diagnóstico** —qué está mal, qué principio de UX rompe, qué
se mueve— y lo confirma con vos antes de tocar código.

**Los pasos 1 a 3 son media hora, una sola vez. El paso 4 es el trabajo.**

---

## Las cinco skills

| Skill | Cuándo | Necesita el repo |
|---|---|---|
| **`embassy-start`** | Configurar un proyecto. Una vez | Lo trae sola |
| **`embassy`** | Cualquier pantalla: nueva, rediseño o migración | Lo trae sola |
| **`embassy-artifact`** | Propuesta, reporte, one-pager, demo — algo que no vive en un repo | No |
| **`embassy-review`** | Antes de entregar. O cuando algo «no parece nuestro» | Parcial |
| **`embassy-eval`** | Medir si el sistema mejora. Solo dueños del DS | Sí |

**La pregunta que rutea:** *¿esto vive en el repo de un producto?*
Sí → `embassy`. No → `embassy-artifact`.

---

## Preguntas que van a salir

**¿Tengo que clonar el Design System?**
No. La skill lo baja sola. No necesitás acceso al repositorio.

**¿Dónde abro Claude?**
En la carpeta de tu proyecto. La del Design System solo la abre quien lo modifica.

**¿Cómo sé si la skill se está corriendo?**
Se ve en la interfaz, arriba de la respuesta. Y en el contenido: si se cargó, registra el commit
del Design System y te dice **qué componente eligió y por qué**. Si te devuelve interfaz sin
mencionar nada de eso, no se disparó.

**¿Cómo la fuerzo?**
Escribiéndola con barra: `/design:design-system armá la pantalla de X`. El disparo automático es
una comodidad; si el trabajo importa, usá la barra.

**¿Sirve para mobile?**
Sí, y no hay que pedirlo: Embassy es responsive por contrato. Lo que cambia es la estructura —
en teléfono la tabla se vuelve cards, el sidebar se vuelve un menú deslizable, los filtros suben
desde abajo. **Mobile no es el desktop achicado.**
**Para una app nativa iOS/Android, Embassy hoy no sirve.** Es solo web. Decilo en el kickoff.

**¿Y si falta un componente?**
No lo inventes. Decilo: se compone con los que hay, o se agrega al sistema. Casi siempre existe
con otro nombre.

**¿Puedo usarlo en un proyecto que ya existe?**
Sí. Detecta si el proyecto ya tiene su propia capa de colores y usa esos nombres.

**¿Necesito saber programar?**
Para los pasos 1 a 3, no. Respondés preguntas y mirás el resultado.

---

## Lo que nunca se hace

1. **Poner un color a mano.** Todo sale de tokens. Un `#3A5BB0` suelto rompe el modo oscuro.
2. **Inventar un componente.** Hay 62. Si parece que falta, buscá — y si de verdad falta, se marca.
3. **Dos acciones principales en una pantalla.** Si las dos parecen igual de importantes, falta
   jerarquía.
4. **Editar el Design System desde el proyecto.** El proyecto solo escribe su `brand/<cliente>.css`.
5. **Entregar sin estado vacío, de carga y de error.** Una pantalla con solo el camino feliz no
   está terminada.

---

## Si algo sale mal

| Pasa esto | Hacé esto |
|---|---|
| La respuesta no menciona el Design System | No se disparó la skill. Repetí con `/design:design-system` |
| Quedó feo y no sabés por qué | *"Revisá esta pantalla"* — te lo dice con severidad y cómo arreglarlo |
| El contraste no pasa AA | Te frena solo. Pedí al cliente una variante más clara o más oscura |
| El cliente todavía no definió la marca | Arrancás igual con la de Amalgama; queda anotado como pendiente |
| El color vivo de la marca no aparece | Probablemente va como **acento**, no como primario. El sistema te avisa |

---

## Dónde está cada cosa

| Documento | Para qué |
|---|---|
| **Esta guía** | Empezar y usarlo |
| `PLAN-USO-DS.md` | El plan y el razonamiento, para presentar al equipo |
| `ANALISIS-SKILLS-DS.md` | El diagnóstico que originó todo esto |
| `design.md` (raíz del repo) | Las reglas de marca, para cualquier agente |
| `PUBLIC-API.md` (raíz del repo) | Las 484 clases disponibles |
