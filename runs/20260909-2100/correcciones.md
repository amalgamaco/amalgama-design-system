# Correcciones — corrida 20260909-2100

## [C1] El check castigaba a quien sigue el DS  ✅ arreglado en esta corrida

```
Apareció en: 01 (guiada)
Corrida:     runs/20260909-2100/guided/01-lista-coleccion.html
Punto:       check — scripts/check-output.mjs
Cambio:      C1 se cuenta sobre el markup VISIBLE. Se agregó stripHidden(), que borra los
             subárboles con hidden / aria-hidden="true" / display:none antes de contar.
Por qué:     el DS exige que la pantalla traiga sus estados (vacío, sin resultados, error) y en
             mobile un bottom sheet, y cada uno trae su propia acción primaria. Contando a ciegas,
             una pantalla BIEN hecha daba 3 btn-primary y salía BLOQUEANTE. La regla premiaba a
             quien se olvidaba de los estados.
Generaliza:  sí — le pasa a cualquier pantalla con estados, que son todas.
```

## [B3] La clase del buscador terminó en el input

```
Apareció en: 01 (guiada) — y estaba en las fallas históricas del escenario, lado baseline
Corrida:     runs/20260909-2100/guided/01-lista-coleccion.html:187
Punto:       prosa — PUBLIC-API.md, entrada de `toolbar`
Cambio:      propuesto, no aplicado. El manifiesto lista `.search-field` entre las clases
             públicas pero el markup canónico (`<div class="search-field"><i…><input></div>`)
             solo está en el comentario de toolbar.css, que el agente no lee. Falta el snippet
             en la entrada del manifiesto.
Generaliza:  sí — el mismo hueco afecta a cualquier clase que sea contenedor y no modificador.
```

## [D4 + estados] La composición del toolbar y los estados sin ocultar

```
Apareció en: 01 (guiada)
Corrida:     runs/20260909-2100/guided/01-lista-coleccion.html
Punto:       prosa — design.md §secuencia canónica, y screen §estados
Cambio:      propuesto, no aplicado. Dos huecos distintos:
             a) design.md dice que el toolbar es UNA fila y que todo se alinea a una columna,
                pero no muestra el defecto: search a la izquierda + filtros a la derecha con un
                hueco en el medio. Un ejemplo del error suele valer más que la regla.
             b) nada dice explícitamente que los estados van en el HTML CON hidden. El agente
                los incluyó —hizo lo que se le pidió— y quedaron los cuatro visibles a la vez.
Generaliza:  sí, las dos. (b) es la más barata y la que más ensucia el resultado.
```

## Falla nueva propuesta para FAILURES.md

```
E10 · Varios estados visibles a la vez (el error encima de los resultados, el snackbar fijo)
     Severidad: ALTA · Detección: inspección
     Por qué merece ID propio: E1–E5 cubren que FALTE un estado. Este es el opuesto —están todos,
     y se pisan— y aparece justo cuando alguien cumple con la regla de incluirlos.
```
