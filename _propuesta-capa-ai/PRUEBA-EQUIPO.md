# Probemos el flujo — protocolo para el equipo

**Qué te pedimos:** 45 minutos, una vez, y que anotes lo que salió mal. Hay 10 minutos más al final, opcionales.

No estamos pidiendo que confirmes que funciona. Estamos pidiendo que **rompas cosas**: las skills
están construidas y revisadas, pero **nadie midió todavía si las pantallas salen mejor que antes**.
Tus hallazgos son el primer número que vamos a tener.

Si algo te sale mal, **eso es el resultado útil**. Un "anduvo todo" sin detalles no nos dice nada.

---

## Antes de arrancar (5 min)

1. **Instalá el plugin `embassy`** desde el marketplace de Amalgama.
2. **Desinstalá el plugin `design` de Amalgama**, el viejo. Quedó vacío de novedades y solo
   confunde. *(Hasta septiembre nuestro plugin se llamaba `design`, igual que uno de Anthropic. Los
   dos peleaban por el mismo nombre y según la máquina te respondía uno u otro.)*
3. **Cerrá y reabrí Claude Code.** El plugin se refresca al arrancar.
4. Escribí `/embassy:` y confirmá que aparecen. Deberían estar `start`, `screen`, `artifact`,
   `review` y `eval`.

> `break` y `explain` pueden no figurar en el listado: son de invocación explícita a propósito.
> Escribí `/embassy:break` entero y fijate si te lo toma. Si te lo toma, están.

**Si algo de esto falla, pará acá y avisá.** No sigas: el resto de la prueba no significa nada con
el plugin mal instalado.

---

# Prueba 0 · La puerta de entrada (2 min)

En una carpeta cualquiera, escribí solamente:

```
/embassy:start
```

Sin decir nada más. Como no le diste contexto, tiene que preguntarte qué necesitás.

- [ ] Te ofrece opciones planteadas como situaciones, no una lista de nombres de comandos.
- [ ] Elegís una que **no** sea "arrancar un proyecto" y **arranca esa otra skill** — no te contesta
      "ahora escribí `/embassy:screen`". Si te devuelve el comando en vez de ejecutarlo,
      **reportalo**: es el punto de toda la skill.

---

# Prueba 1 · Arrancar un proyecto white-label (15 min)

**Usá el mismo cliente inventado que todos** — así podemos comparar resultados entre personas.

### 1.1 · Carpeta nueva

Creá una carpeta vacía en cualquier lado. En Claude, **Add folder** sobre **esa** carpeta.

> ⚠️ **Nunca sobre la carpeta del Design System.** El DS no se abre, se consume. Este es el error
> más común y arruina la prueba entera.

### 1.2 · Escribí solo esto

```
/embassy:start
```

**Sin pegar ningún dato.** Queremos probar justamente que te vaya guiando. Contestá lo que te
pregunte usando estos datos, que son los mismos para todos:

> Es para un cliente, **Nortia** · lo construye alguien a mano, con HTML y CSS · lo usa **la gente
> del negocio** (recepción y entrenadores) · sobre todo en **computadora** · es **una aplicación con
> varias secciones y su propio menú** · en español · color oscuro **#14524A**, color vivo **#0E9F6E** ·
> esquinas **redondeadas** · las tipografías de Amalgama

Chequeá mientras tanto:

- [ ] Pregunta **de a una**, no todas juntas.
- [ ] Las opciones se entienden **sin saber nada del design system**. Si tenés que adivinar qué
      significa una palabra, **anotalo** — esa pregunta está mal escrita.
- [ ] Si decís "no sé", sigue igual con un default en vez de trabarse.
- [ ] **Te pregunta en qué dispositivo se usa.** Si no lo pregunta, es una falla: de ahí salen los
      tamaños táctiles.
- [ ] Lo que puede averiguar mirando la carpeta **no te lo pregunta**.
- [ ] **No te hace cuatro preguntas más** sobre espaciado, sombras, movimiento e íconos. Tiene que
      deducirlos y proponerte un perfil en una sola línea —para Nortia debería salir algo como
      *espaciado compacto, superficies con borde nítido, movimiento sobrio, íconos robustos*— y
      recién ahí ofrecerte cambiarlo. Si te los pregunta de a uno, **anotalo**: se volvió un
      formulario.

### 1.3 · Qué tiene que quedarte en la carpeta

```
brand/nortia.css      ← la marca del cliente
DESIGN.md             ← qué se decidió, para quién es, y qué quedó pendiente
design/               ← vacía por ahora
theme-preview.html    ← para mostrar y aprobar
CLAUDE.md             ← le dice al agente qué usar
index.html            ← el layout base
```

### 1.4 · La prueba que importa: el toggle de dark

Abrí `theme-preview.html` y **cambiá a oscuro**.

| Qué ves | Qué significa |
|---|---|
| Los verdes de Nortia siguen ahí, y el fondo es un **negro verdoso** | ✅ El white-label funciona de punta a punta |
| Los verdes están pero el fondo es el **negro azulado** de Amalgama | ❌ No se generaron las superficies de oscuro — **reportalo** |
| En oscuro vuelven los colores de Amalgama | ❌ **Falla grave — reportala ya** |

> El último caso es un bug que arrastramos meses y se arregló en septiembre. Si volvió,
> queremos saberlo el mismo día. El del medio es más sutil y por eso está acá: el negro de
> Embassy no es neutro, es azul, y si las superficies no se tiñen todos los clientes se ven
> iguales en oscuro. Poné las dos pantallas al lado y comparalas contra un producto Amalgama.

### 1.5 · Chequeá también

- [ ] Abrí `DESIGN.md`: tiene que decir **para quién es, en qué dispositivo y si el menú es
      nuestro** — las tres respuestas que diste. Si no están, las pantallas después no las van a
      tener en cuenta.
- [ ] `DESIGN.md` dice qué quedó **pendiente**, no solo qué se hizo.
- [ ] Abrí `brand/nortia.css`: además de los colores tiene que haber **espaciados, sombras,
      tiempos de animación y grosor de íconos**. Si solo tiene colores, el perfil que te propuso
      quedó en el chat y no se aplicó — **reportalo**.
- [ ] No te preguntó por modo oscuro ni por tamaños de tipografía. Esos ya están decididos.
- [ ] **Al terminar te ofrece armar la primera pantalla.** Si te deja sin próximo paso, anotalo.

---

# Prueba 2 · Una pantalla (15 min) — la prueba principal

Esta es la que más nos interesa, porque es el problema original: **la skill cambiaba los
componentes pero no el sentido de la pantalla.**

### 2.1 · En la misma carpeta, pegá esto

```
/embassy:screen

Armá la vista de listado de socios. Se puede filtrar por estado y por plan.
La acción principal es dar de alta un socio nuevo.
Los usuarios entran mayormente a buscar a una persona puntual.
```

### 2.2 · Antes del código tiene que haber un diagnóstico

**Esto es lo que estamos probando.** El output tiene que traer, *antes* de cualquier markup:

- El **encuadre**: objetivo · objeto · acciones · patrón · responsive · estados
- Los **problemas**, cada uno citando la ley que rompe (Hick, Fitts, Miller, Nielsen…)
- La lista de **movimientos**: qué se resecuencia, agrupa, mueve, reemplaza o elimina, y por qué
- El **commit del DS** con el que trabajó

| Qué recibís | Veredicto |
|---|---|
| Diagnóstico con leyes nombradas + movimientos + después el código | ✅ Funcionando |
| Una pantalla linda y ningún diagnóstico | ❌ **La skill no se disparó, o falló. Reportalo.** |
| Diagnóstico donde todos los "movimientos" son de color o de componente | ❌ **Es un re-skin disfrazado. Reportalo — es el bug original.** |

### 2.3 · Sobre el resultado, chequeá lo obvio

- [ ] **Una sola acción primaria.** Si hay dos botones que compiten, falta jerarquía.
- [ ] **El buscador es un `search-field` dentro del toolbar**, no una barra píldora centrada. Filtra
      una lista de esta pantalla, así que va en el toolbar.
- [ ] **No hay ningún color a mano.** Buscá un `#` en el código: si aparece un hex suelto, es falla.
- [ ] **Están los estados**: vacío, cargando, error, sin resultados. Que falten es la falla que más
      se repite.
- [ ] **Nada de `<input placeholder="Buscar">`** suelto.
- [ ] **Achicá la ventana hasta el ancho de un celular** (375px). No tiene que aparecer scroll
      horizontal, y los botones y el menú tienen que agrandarse para el dedo. Encontramos las dos
      fallas en septiembre construyendo un dashboard de verdad; si volvieron, queremos saberlo.
- [ ] **Si la tabla tiene números** (importes, cantidades, porcentajes), van alineados a la
      derecha, no a la izquierda como el texto.
- [ ] **Apareció un archivo nuevo en `design/`** con el diagnóstico, y `DESIGN.md` lo lista. Si el
      diagnóstico quedó solo en el chat, se pierde al cerrar la pestaña — **reportalo**.
- [ ] **Al terminar te ofrece revisarla** antes de mandarla. Si te deja sin próximo paso, anotalo.

### 2.4 · Ahora rompela a propósito

Pedile algo mal y fijate si te frena:

```
Poné el botón de "Dar de alta" y el de "Importar" los dos como acción principal,
y usá el color #3A5BB0 para el header.
```

**Tiene que negarse o corregirte**, explicando que hay una sola primaria por contexto y que el color
sale de tokens. Si te lo hace sin chistar, **reportalo** — es la falla más importante que podés
encontrar.

---

# Prueba 3 · Un entregable sin repo (5 min)

Carpeta cualquiera, no hace falta que tenga nada:

```
/embassy:artifact

Armá un one-pager con los resultados del último trimestre de un proyecto
imaginario: 3 métricas, un gráfico y las próximas tres prioridades.
```

- [ ] Sale un HTML solo, que abre y se ve on-brand.
- [ ] **No clonó ningún repo.** Si te pidió clonar, es falla: esta skill trabaja por URL.
- [ ] Los colores son de Amalgama, no inventados.
- [ ] **Al terminar te ofrece revisarlo** antes de que lo mandes.

---

# Prueba 4 · Auditar algo que ya existe (5 min)

Agarrá **una pantalla real de un proyecto tuyo** —la que quieras, cuanto más vieja mejor— y pegale:

```
/embassy:review

<pegá acá el HTML, o el link, o un screenshot>
```

- [ ] Devuelve hallazgos con **ID de falla, severidad y la regla** que los justifica.
- [ ] **No te arregla nada sin permiso.** Diagnostica; si te reescribe el código de una, es falla.
- [ ] Pero **sí te ofrece arreglarlo** al final ("¿las arreglo?"). Diagnosticar y desaparecer te
      deja a mitad de camino — si no te lo ofrece, anotalo.
- [ ] Los hallazgos son ciertos. Si te marca cosas que están bien, **eso es un falso positivo y lo
      queremos saber** — ya encontramos cuatro así.

---

# Prueba 5 · Las tres que nadie probó todavía (10 min, opcional)

Si te sobra tiempo, estas son las que menos ojos tuvieron encima.

### 5a · ¿El componente aguanta?

En la carpeta de Nortia:

```
/embassy:break

Probá el select con contenido real.
```

- [ ] Te deja **una página** con el mismo componente repetido en muchas situaciones, no una lista de
      texto.
- [ ] Incluye **la marca de Nortia en claro y en oscuro**. Ese eje va siempre.
- [ ] Te dice qué se rompió y **quién tiene la regla** que lo arregla. No lo arregla solo.

### 5b · ¿Cómo hicieron esto?

Buscá cualquier web que te guste y pegale el link:

```
/embassy:explain

<el link> — ¿cómo está hecha esta animación / este gradiente?
```

- [ ] Distingue lo que **midió** de lo que está **suponiendo**. Si te tira números sin aclarar de
      dónde salen, es falla.
- [ ] Termina diciendo **si se puede con Embassy**: ya existe · se compone · es un gap · choca con
      el sistema.
- [ ] **No te cierra con un bloque de código para copiar.** Eso trae valores de otra página que no
      son nuestros.

### 5c · Migrar un proyecto entero

**Solo si tenés un proyecto viejo a mano y ganas.** Es la más larga.

```
Migrá este proyecto entero a Embassy.
```

- [ ] Te muestra un **plan por fases** y espera que apruebes antes de tocar nada.
- [ ] Al terminar dice, con todas las letras, que **migró tokens y componentes y no rediseñó
      ninguna pantalla**. Si te deja creer que arregló la UX, es la falla más grave de esta prueba.
- [ ] Te deja una **lista de pantallas** que necesitan rediseño, ordenada de peor a mejor.

---

# Cómo reportar

Copiá esta plantilla y completala. Una por prueba que haya fallado.

```
[Prueba N · qué skill] título corto de lo que pasó

  Qué pedí:    (el prompt, tal cual lo pegaste)
  Qué esperaba:
  Qué pasó:
  Evidencia:   (el pedazo de output, el archivo, o un screenshot)
  Commit DS:   (lo dice el output de la skill)
```

**Mandalo a Ana.** Cada hallazgo se clasifica en la taxonomía de `FAILURES.md` del repo del DS
(grupos A a I: tokens, selección de componente, jerarquía, layout, estados, accesibilidad, motion,
reflejos de diseño generado, proceso) y se arregla **en el sistema**, no en tu proyecto.

Si te sobra tiempo, la joya es esta: **repetí la Prueba 2 con un cliente real tuyo y su marca
real**. Los hexes de verdad rompen cosas que un cliente inventado no rompe.

---

# Lo que ya sabemos que está flojo — no hace falta reportarlo

Para que no gastes tiempo en esto:

- **`--color-on-secondary`** queda en 3.58:1. No lo usa ningún componente todavía —el par que sí
  se usa da 12.16:1— así que es una trampa latente, no una falla activa. Queda por documentar la
  restricción.
- **El CDN sirve desde `@main`**, sin tag pineado.
- **El loop de medición nunca se corrió.** Justamente por eso te estamos pidiendo esto.
- **Si un comando "no existe", reiniciá Claude Code antes de reportarlo.** Los plugins se refrescan
  al arrancar; una skill nueva no aparece hasta entonces. Nos pasó y perdimos un rato buscando un
  bug que no estaba.
