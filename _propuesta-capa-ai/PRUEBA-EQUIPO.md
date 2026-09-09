# Probemos el flujo — protocolo para el equipo

**Qué te pedimos:** 40 minutos, una vez, y que anotes lo que salió mal.

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
4. Escribí `/embassy:` y confirmá que aparecen. Deberían estar `screen`, `start`, `artifact`,
   `review` y `eval`.

> `break` y `explain` pueden no figurar en el listado: son de invocación explícita a propósito.
> Escribí `/embassy:break` entero y fijate si te lo toma. Si te lo toma, están.

**Si algo de esto falla, pará acá y avisá.** No sigas: el resto de la prueba no significa nada con
el plugin mal instalado.

---

# Prueba 1 · Arrancar un proyecto white-label (15 min)

**Usá el mismo cliente inventado que todos** — así podemos comparar resultados entre personas.

### 1.1 · Carpeta nueva

Creá una carpeta vacía en cualquier lado. En Claude, **Add folder** sobre **esa** carpeta.

> ⚠️ **Nunca sobre la carpeta del Design System.** El DS no se abre, se consume. Este es el error
> más común y arruina la prueba entera.

### 1.2 · Pegá esto, tal cual

```
/embassy:start

Cliente: Nortia
Stack: buildless (HTML + CSS + JS)
Superficie: app con shell (sidebar + topbar)
Densidad: herramienta interna densa
Idioma: español rioplatense
Marca: primario #14524A · acento #0E9F6E
Forma: redondeada
Tipografía: las de Embassy
```

### 1.3 · Qué tiene que quedarte en la carpeta

```
brand/nortia.css      ← la marca (solo primitivas, generado)
DESIGN.md             ← qué marca, qué idioma, qué se decidió, qué falta
theme-preview.html    ← para mostrar y aprobar
CLAUDE.md             ← el bloque que le dice al agente qué usar
index.html            ← el layout base, con el CSS en el orden correcto
```

### 1.4 · La prueba que importa: el toggle de dark

Abrí `theme-preview.html` y **cambiá a oscuro**.

| Qué ves | Qué significa |
|---|---|
| Los verdes de Nortia siguen ahí en oscuro | ✅ El white-label funciona de punta a punta |
| En oscuro vuelven los colores de Amalgama | ❌ **Falla grave — reportala ya** |

> Ese segundo caso es un bug que arrastramos meses y se arregló en septiembre. Si volvió,
> queremos saberlo el mismo día.

### 1.5 · Chequeá también

- [ ] `brand/nortia.css` tiene **solo primitivas** (`--primary-900`, `--secondary-500`…), **nunca**
      roles (`--color-primary`). Si tocó un rol, es una falla.
- [ ] `DESIGN.md` dice qué quedó pendiente, no solo qué se hizo.
- [ ] No te preguntó por dark mode ni por tamaños de tipografía. Esos ya están decididos.

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

---

# Prueba 4 · Auditar algo que ya existe (5 min)

Agarrá **una pantalla real de un proyecto tuyo** —la que quieras, cuanto más vieja mejor— y pegale:

```
/embassy:review

<pegá acá el HTML, o el link, o un screenshot>
```

- [ ] Devuelve hallazgos con **ID de falla, severidad y la regla** que los justifica.
- [ ] **No te arregla nada.** Esta skill solo diagnostica; si te reescribe el código, es falla.
- [ ] Los hallazgos son ciertos. Si te marca cosas que están bien, **eso es un falso positivo y lo
      queremos saber** — ya encontramos cuatro así.

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

- **Seis componentes no tienen regla escrita**: `back-link`, `create-form`, `date-picker`,
  `description`, `page-header`, `placeholder`. Alrededor de esos seis la skill compone a ojo.
- **`--color-on-secondary`** queda en 3.58:1 (blanco sobre el acento). Está bajo AA para texto
  chico; es una decisión de diseño pendiente.
- **El CDN sirve desde `@main`**, sin tag pineado.
- **El loop de medición nunca se corrió.** Justamente por eso te estamos pidiendo esto.
