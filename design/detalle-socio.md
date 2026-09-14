# Ingreso de socio — diagnóstico y rediseño

**Pantalla:** detalle de socio en la app de mostrador de un operador de gimnasios (cliente Welltech).
**Stack:** Flutter · preview con `@material/web` sobre `md-sys-bridge.css`.
**DS:** `amalgama-design-system` @ `01d2c0c` — *"chore(release): point deliverables at v1.1.0"* (2026-09-11), árbol limpio.
**Modo:** improve — rediseño de la pantalla entregada en `Claude outputs/pantalla-detalle-socio.html`.
**Arquetipo:** `entity-detail` (`references/screen-patterns.md` §2).

> **Supuesto que hay que confirmar antes de construir.** Doy por hecho que al mostrador se llega
> **escaneando la credencial o buscando por nombre**, o sea que quien atiende **ya sabe a quién tiene
> enfrente** y la identidad confirma en vez de encabezar. Si en cambio se llega navegando un listado
> sin saber quién es, la identidad vuelve a liderar y cambia el orden de las dos primeras regiones —
> nada más, pero eso sí cambia.

---

## Encuadre

```
OBJETIVO    usuario: resolver si este socio entra, ahora, con la fila esperando
            negocio: menos segundos por ingreso en hora pico, y que la cuota vencida se cobre en el
            mostrador en vez de perderse
OBJETO      primario: el ingreso de este socio (no "el socio")
            niveles: veredicto → identidad y ciclo → historial → plan y administración
ACCIONES    primaria: una sola, y cambia con el veredicto — Registrar ingreso · Cobrar cuota
            secundarias: ver historial completo (texto) · editar plan, suspender, facturación (action sheet)
PATRÓN      arquetipo: entity-detail con acción de transición de estado
            componentes: alert · item/ListTile · avatar · figure · list · collapsible · toast · empty-state · skeleton
RESPONSIVE  nativo: una columna, veredicto arriba, acción en BottomAppBar al alcance del pulgar
            escritorio (si existe): una estructura propia — column-1200 con grid-12 7+5, veredicto +
            identidad + acción en la columna de 7, ciclo/plan/historial en la de 5, y la acción vuelve
            al page-header porque en escritorio no hay barra inferior ni pulgar que alcanzar
ESTADOS     habilitado · bloqueado por cuota · ya ingresó hoy · cargando · no encontrado · error de red ·
            éxito con deshacer · acción en vuelo · sin permiso
            sin estado vacío: si esta pantalla se abrió, hay un socio — el vacío equivalente es
            "no encontrado", que es otra cosa y tiene su propio empty-state
```

---

## Problemas detectados

1. **La pantalla contesta "quién es" antes que "entra o no entra".** El nombre a 32px es lo más
   pesado; el veredicto vive en un badge chico que compite con él, y el resto hay que armarlo
   sumando el badge, dos cifras y una fila de medio de pago. Rompe **jerarquía visual**: el nivel
   must-see está mal elegido — es el veredicto, no la identidad.
2. **Dos cifras de igual peso, y solo una decide.** "9 de 12 accesos" y "38.400 ARS" ocupan lo mismo.
   La plata solo importa cuando está vencida, y en ese caso ya lo dice el banner. Rompe
   **Von Restorff**: dos elementos con el mismo énfasis se anulan.
3. **La sede se dice tres veces** — en la línea de identidad, en la fila "Sede habitual" y en cada
   una de las tres asistencias. Rompe **Nielsen 8** (diseño minimalista) y la ley de un solo sistema
   por eje.
4. **El bloque "Plan" es material de consulta parado en el camino de la decisión.** Modalidad,
   accesos, sede y medio de pago no se leen para dejar pasar a nadie. Rompe **Progressive Disclosure**
   y suma carga cognitiva en la región que tiene que ser la más rápida.
5. **"Accesos" significa dos cosas distintas en la misma pantalla** — el tope semanal ("3 por semana")
   y el consumo del ciclo ("9 de 12 accesos usados"). Rompe **Nielsen 2**: el vocabulario tiene que
   ser el del usuario y significar una sola cosa.
6. **"Modalidad" y "Medio de pago ····1841" son vocabulario de base de datos.** Quien atiende dice
   "plan", y el número de tarjeta no es una decisión de mostrador. Rompe **Nielsen 2**.
7. **Registrar un ingreso es irreversible y no tiene ni confirmación ni deshacer.** Un toque errado
   con fila consume un acceso real y no hay salida. Rompe **Nielsen 3** (control y libertad): donde
   es reversible va deshacer, no un confirm bloqueante.
8. **El caso que más pasa en un mostrador no existe: el socio que ya entró hoy.** La pantalla ofrece
   "Registrar ingreso" igual. Rompe **Nielsen 1** (visibilidad del estado) y **Nielsen 5**
   (prevención del error).
9. **Los estados están escritos en prosa, no en la pantalla.** No hay cargando, ni no-encontrado, ni
   error de red, ni éxito, ni sin permiso. La matriz de `entity-detail` los pide obligatorios.
   Rompe **Nielsen 1** y `feedback-and-states.md`.
10. **El ⋮ del AppBar no dice qué hay adentro** y, en nativo, un menú flotante no es el patrón.
    Rompe **Nielsen 6** (reconocer antes que recordar) y el mapa de `MOBILE.md` §5, que manda
    action sheet.
11. **Dos divisores hacen el trabajo que ya hacen los rótulos y el espacio.** `visual-hierarchy.md`
    es explícito: agrupar con `--space-*` antes que con cromo.

---

## Movimientos

```
RESECUENCIAR            identidad (32px, arriba) → veredicto arriba, identidad debajo como confirmación
                        — jerarquía visual: el must-see es la decisión, no el nombre

INTRODUCIR-JERARQUÍA    nombre a --font-size-display → --font-size-heading-md en una fila de identidad
                        — Von Restorff: liberar el peso máximo para el veredicto

UNIFICAR                badge "Membresía al día" + cifra de cuota + "vence 19 sep" → un solo bloque de
                        veredicto que dice entra/no entra y el dato que lo califica
                        — un solo sistema por eje: tres formas de decir lo mismo

ELIMINAR                la cifra de $ 38.400 del estado habilitado (vive dentro del veredicto cuando bloquea)
                        — Von Restorff

ELIMINAR                fila "Sede habitual" y el "· Palermo" repetido en cada asistencia
                        — Nielsen 8, redundancia

ELIMINAR                fila "Medio de pago ····1841" — no es una decisión de mostrador, vive en facturación
                        — Nielsen 8

ELIMINAR                un divisor; el rótulo de grupo y --space-* ya separan
                        — jerarquía visual: espacio antes que cromo

REEMPLAZAR              "Modalidad" → "Plan"; "Accesos: 3 por semana" → "Tope semanal: 3"
                        — Nielsen 2: la palabra del usuario, y un término = un significado

REVELAR-PROGRESIVAMENTE el bloque Plan pasa a un collapsible cerrado (Flutter: ExpansionTile)
                        — Progressive Disclosure: consulta fuera del camino de la decisión

MOVER                   el ⋮ sin etiqueta → action sheet con acciones nombradas
                        (Editar plan · Suspender membresía · Ver facturación)
                        — Nielsen 6 + MOBILE.md §5 (dropdown-menu → actionsheet en nativo)

AGRUPAR                 ciclo + historial quedan contiguos como "lo que pasó y lo que queda"
                        — chunking, Miller

AGREGAR-ESTADO          ya-ingresó-hoy: veredicto propio y acción primaria deshabilitada con el motivo
                        — Nielsen 5, prevención del error

AGREGAR-ESTADO          éxito: toast con "Deshacer" en vez de un confirm bloqueante
                        — Nielsen 3

AGREGAR-ESTADO          cargando (skeleton con la silueta real) · no encontrado (empty-state error + volver)
                        · error de red (alert + reintentar) · acción en vuelo (botón deshabilitado, aria-busy)
                        · sin permiso (nota de acceso)
                        — feedback-and-states.md + la matriz de entity-detail
```

**No hay estado vacío y es a propósito:** a esta pantalla se llega con un socio resuelto, así que
el vacío no existe; lo que sí existe es *no encontrado*, que es un error y va con su propio
`empty-state` y un camino de vuelta.

**Ninguno de los estados nuevos se muestra a la vez.** Van todos en el markup con `hidden` y el
runtime prende el que corresponde; el poblado es el default. Mostrarlos juntos es la falla `E10`.

---

## Componentes y variantes

| Región | Componente | Por qué ese |
|---|---|---|
| Veredicto | `alert` — `success` habilitado · `error` bloqueado · `info` ya ingresó (Flutter `MaterialBanner`) | Es el único bloque inline y persistente del DS con ícono + título + descripción, y acá la persona sí tiene que actuar. No es `badge` (solo lectura, sin cuerpo) ni `toast` (efímero) |
| Identidad | `item` + `avatar` (Flutter `ListTile` + `CircleAvatar`) | La fila compacta es el primitivo de Embassy para identificar a una persona; no es `person-card` porque acá no se hace clic |
| Ciclo | `figure` de composición | Un número no se publica sin su base: unidad, período y universo al lado |
| Historial | `list` / `list-item` de dos líneas (Flutter `ListTile` con `subtitle`) | Es una lista corta de eventos, no una tabla |
| Plan | `collapsible` (Flutter `ExpansionTile`) | Un solo booleano, no un acordeón de varias secciones |
| Acción primaria | `btn-primary` en barra inferior (Flutter `FilledButton` en `BottomAppBar`) | `MOBILE.md` §5: `toolbar` → AppBar + BottomAppBar. Ancho propio, nunca full-width |
| Acciones del AppBar | action sheet (Flutter `showModalBottomSheet`) | `MOBILE.md` §5: no hay menú flotante en un teléfono |
| Éxito | `toast` con deshacer | Confirma un hecho y se va |
| Cargando | `skeleton` | Se conoce la silueta destino y la espera supera ~300ms |
| No encontrado / sin permiso | `empty-state` variante error | No hay componente de permiso en Embassy — **gap declarado**, se compone, no se inventa |

---

## Gaps del DS que deja este rediseño

- **No hay un "bloque de veredicto"** para pantallas donde la decisión *es* la pantalla. `alert` es
  lo más cercano y alcanza, pero un `alert-success` permanente en el camino feliz es un uso al
  límite de su regla. Vale mirarlo.
- **No hay estado de permiso de primera clase** — ya está anotado como gap en el propio SKILL.
- **`@material/web` no trae banner, avatar ni accordion**, así que en el preview esas tres van con
  clases de Embassy. En Flutter las tres existen (`MaterialBanner`, `CircleAvatar`, `ExpansionTile`)
  y el gap desaparece.
