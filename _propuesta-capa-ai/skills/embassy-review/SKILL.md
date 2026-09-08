---
name: embassy-review
description: >-
  Auditá una pantalla, un PR, un artefacto o un diseño contra el design system de Amalgama
  (Embassy) y devolvé un reporte de hallazgos clasificados por la taxonomía compartida
  `FAILURES.md`, con severidad, evidencia y la regla que justifica cada uno. Disparala ante
  "revisá esta pantalla", "¿esto respeta el DS?", "esto no parece de Amalgama", "auditá este PR",
  "qué está mal acá", "review de diseño", "chequeá antes de mergear", o cuando alguien pega una
  URL, un screenshot, un link de Figma o un diff pidiendo una devolución. NO construye ni arregla
  — solo diagnostica y propone el arreglo; para construir usá `embassy` o `embassy-artifact`.
detail: >-
  Auditoría con criterio observable y compartido. Es el juez que también usa `embassy-eval`.
output: Reporte de hallazgos con ID de falla, severidad, evidencia, regla y arreglo propuesto.
format: Reporte · no modifica código salvo pedido explícito
examples: |-
  revisá esta pantalla contra el DS
  esto no parece de Amalgama, ¿qué está mal?
  auditá este PR antes de mergear
---

# Embassy Review — auditoría con criterio compartido

Traduce *"esto no parece de Amalgama"* en hallazgos que dos personas cuentan igual.

Dos usos, misma salida:

- **Humano** — review de PR o de diseño con un criterio que no depende de quién revisa.
- **Máquina** — es el juez de las corridas de `embassy-eval`.

**No arregla nada** salvo que se lo pidan explícitamente. Diagnostica, prioriza y propone.

---

## Paso 1 — Establecé la línea de base

```bash
# Taxonomía (obligatoria)
cat /tmp/amalgama-ds/FAILURES.md

# Si hay repo: commit del DS y API pública
cd /tmp/amalgama-ds && git rev-parse --short HEAD
cat /tmp/amalgama-ds/PUBLIC-API.md   # o public-api.json para cruzar clases
```

Sin repo (revisando un artefacto o un screenshot), alcanza con `design.md` + `PUBLIC-API.md` desde
el raw de GitHub. Anotá con qué versión revisaste: un hallazgo sin commit no se puede reproducir.

Identificá qué te dieron y con qué podés trabajar:

| Entrada | Qué se puede auditar | Qué no |
|---|---|---|
| Código / PR / diff | todo: tokens, clases, jerarquía, estados, a11y, motion | render real |
| URL en vivo | render, responsive, teclado, ambos temas, contraste | el código fuente de origen |
| Screenshot | composición, jerarquía, tokens visibles, reflejos generados | a11y, motion, estados |
| Figma | composición, jerarquía, paridad de tokens | comportamiento e implementación |

**Decí en el reporte qué quedó fuera de alcance.** Un review que calla lo que no pudo ver se lee
como aprobación.

---

## Paso 2 — Recorrido, en este orden

El orden importa: los problemas de estructura invalidan los de detalle. No reportes un radio mal
puesto en un bloque que no debería existir.

1. **Encuadre.** ¿Cuál es el objetivo del usuario y el objeto primario de la pantalla? ¿Se entiende
   en tres segundos? → grupo `C`, `D`.
2. **Jerarquía y acciones.** Una sola primaria; adyacencia; nada compite. → `C1`–`C6`.
3. **Layout.** Las cinco leyes: una columna con ancho deliberado, un sistema por eje, adyacencia,
   búsqueda por contexto, secuencia canónica. → `D1`–`D8`.
4. **Selección de componentes.** Cada elemento, ¿es el componente correcto y la variante correcta?
   Cruzá contra `component-rules/<id>.md` → `not_to_confuse_with`. → `B1`–`B10`.
5. **Estados y contenido.** Vacío, cargando, error, éxito, sin permiso. Copy, idioma, datos con
   base. → `E1`–`E9`.
6. **Tokens.** Hex, px sueltos, primitivas, overrides por tema, fugas de otro framework. → `A1`–`A10`.
7. **Accesibilidad.** Foco, `aria-label`, `role="search"`, semántica de tabla, color como único
   portador, contraste, teclado. → `F1`–`F8`.
8. **Motion.** Tokens, doble easing, reduced-motion, entradas no declaradas. → `G1`–`G5`.
9. **Reflejos de diseño generado.** `design.md` §8. → `H1`–`H6`.
10. **Proceso.** Copias locales del DS que ya divergieron, commit sin registrar, gap improvisado
    en vez de marcado. → `I1`–`I4`.

### Chequeos mecánicos

Corré estos antes de la lectura manual; barren la mitad de los hallazgos en segundos.

```bash
F=<archivos>
grep -RnE "#[0-9a-fA-F]{3,8}\b" $F | grep -v "variables.css\|logos\|\.svg"        # A1
grep -RnE "font-family\s*:\s*['\"]" $F                                            # A2
grep -RnE "\-\-(primary|neutral|secondary|tertiary)-[0-9]" $F                     # A5
grep -RnE "\[data-theme=.dark.\]|prefers-color-scheme|\.dark\s*\{" $F             # A6
grep -RnE "text-(zinc|slate|indigo|gray)-[0-9]|\bbg-white\b" $F                   # A8
grep -RnE "input[^>]*placeholder=[\"'][^\"']*[Bb]uscar" $F                        # B3
grep -RcE "btn-primary" $F                                                        # C1 (por contexto)
grep -RnE "icon-btn" $F | grep -v "aria-label"                                    # F2
grep -RnE "cubic-bezier\(|transition:[^;]*[0-9]+m?s" $F                           # G1
# B1 — clases que no existen en la API pública:
grep -ohE 'class="[^"]+"' $F | tr ' "' '\n\n' | grep -oE '^[a-z][a-z0-9-]+$' | sort -u > /tmp/used.txt
python3 -c "
import json,sys
api={c for comp in json.load(open('/tmp/amalgama-ds/public-api.json'))['components'] for c in comp['classes']}
print('\n'.join(f'NO EXISTE EN EL DS: {c}' for c in open('/tmp/used.txt').read().split() if c not in api))"
```

Los mecánicos encuentran `A*`, `B1`, `B3`, `F2`, `G1`. Todo lo demás es lectura.

---

## Paso 3 — El reporte

Un hallazgo por bloque, **ordenados por severidad**, con este formato:

```
[C1 · BLOQUEANTE] Dos btn-primary en el header de la lista
  Dónde:     src/pages/Vacantes.tsx:48 y :53
  Evidencia: "Nueva vacante" y "Importar" ambos con .btn-primary
  Regla:     GOVERNANCE §20.5 — una sola acción primaria por contexto
  Arreglo:   "Importar" pasa a .btn-tertiary (menor prioridad y adyacente al primario)
```

Y arriba de todo, el resumen contable:

```
Revisión: <qué>   Commit DS: <hash>   Alcance: <qué se pudo auditar>
BLOQUEANTES 0 · ALTAS 3 · MEDIAS 5 · BAJAS 2   ·   total 10
Fuera de alcance: motion y estados (solo había screenshot)
```

**Reglas del reporte:**

- Cada hallazgo lleva **ID de la taxonomía**. Si algo no tiene ID, es un candidato a falla nueva:
  proponé el ID y el criterio observable, y decilo explícitamente (§4).
- Cada hallazgo cita **la regla del DS**, no tu opinión. Sin regla, es preferencia — marcalo BAJA
  y decí que es preferencia.
- El arreglo va en una línea, concreto. Nada de "revisar la jerarquía".
- **Lo que está bien también se dice**, en dos o tres líneas al final. Un reporte que solo lista
  problemas se lee como que no se entendió la pantalla.
- Si algo requiere una decisión de producto y no de DS, marcalo aparte: no es una falla.

---

## Paso 4 — Fallas nuevas

Cuando encontrás algo que está mal y no tiene ID:

1. Escribilo como **criterio observable** — algo que dos personas cuenten igual. "Se siente
   apretado" no es un criterio; "el toolbar y los resultados no comparten borde izquierdo" sí.
2. Proponé ID, grupo y severidad.
3. Proponé **el punto más angosto** donde corregirlo:
   - criterio o composición → prosa en `design.md` o el `SKILL.md` que corresponda
   - mecánico y repetible → el CSS del repo, o un token
   - detectable por regex/AST → un chequeo en `scripts/check-output.mjs`

No lo agregues a los tres lugares: se duplica y se desincroniza.

---

## Checklist

- [ ] `FAILURES.md` leído en esta sesión; commit del DS registrado
- [ ] Alcance declarado, con lo que quedó afuera
- [ ] Chequeos mecánicos corridos
- [ ] Los diez pasos del recorrido, en orden
- [ ] Cada hallazgo con ID, severidad, evidencia, regla y arreglo de una línea
- [ ] Resumen contable arriba
- [ ] Fallas nuevas propuestas con criterio observable y punto de corrección
- [ ] Lo que está bien, dicho
