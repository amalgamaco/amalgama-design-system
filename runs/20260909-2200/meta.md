# Corrida 20260909-2200 — la misma pantalla, después de los arreglos

Corrida pareada contra `20260909-2100`. **Baseline reusado**: no cambió ni el escenario ni el
modelo, y el baseline solo se rehace cuando cambia uno de esos dos. Lo que cambió es la guía, que
es exactamente lo que se está midiendo.

## Qué se tocó entre una corrida y la otra

| Cambio | De dónde salió |
|---|---|
| El manifiesto ahora trae el markup canónico de `toolbar` y `toast` | el generador exigía `Uso:` con los dos puntos pegados; esos dos headers dicen `Uso (búsqueda + filtros):` y `Uso Snackbar:` |
| `design.md` §8: dos reflejos nuevos — estados todos visibles, y clase de contenedor puesta en el hijo | las dos fallas de la corrida anterior |
| `screen` §6: los estados se entregan con `hidden` | ídem |
| `check-output`: C1 se cuenta sobre el markup visible | la regla marcaba como bloqueante a una pantalla bien hecha |

## Resultado

| | BLOQ | ALTA | total | vs. corrida anterior |
|---|---|---|---|---|
| baseline (reusado) | 30 | 34 | 64 | = |
| guiada 21:00 | 0 | 1 | 1 | |
| guiada 22:00 | 2 | 2 | 4 | +3 |

El conteo empeoró y aun así **la pantalla es mejor**. Es el mejor recordatorio posible de que el
número solo mide una parte:

- **Se fueron las tres fallas de composición.** El toolbar es una fila —campo de búsqueda que
  crece + tres selects—, el contador queda debajo alineado a la columna, la tabla arranca donde
  tiene que arrancar y **se ve un solo estado**: la lista poblada. La `.search-field` está en el
  `<div>` que envuelve al input, así que tiene su lupa y su anillo de foco, y no hizo falta ninguna
  utilidad inventada para estirarla.
- **Aparecieron cuatro fallas nuevas, todas del mismo origen:** dos bloques de CSS propio que el
  agente agregó de más.
  - `A6` — el logo cambia con `prefers-color-scheme` en vez de `data-theme`. Real: el tema en
    Embassy lo maneja el atributo, así que el logo se quedaba en la variante equivocada al togglear
    a mano. Arreglado en `design.md` §6.6, que ahora trae el patrón de las dos imágenes.
  - `G3` + dos `G1` — se reimplementó el bloque de `prefers-reduced-motion` que `base.css` ya trae.
    Arreglado en `design.md` §6.5: respetalo siempre, y no lo reescribas.

## Lo que queda

Las cuatro de esta corrida ya tienen su arreglo en la guía, sin verificar todavía: hace falta una
tercera corrida para saber si desaparecen. Y siguen faltando los escenarios 02 a 07.
