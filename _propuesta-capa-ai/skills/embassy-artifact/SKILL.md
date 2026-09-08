---
name: embassy-artifact
description: >-
  Generá cualquier entregable on-brand de Amalgama sin necesidad del repo del design system —
  propuestas comerciales, reportes de proyecto, one-pagers, resúmenes de resultados, páginas de
  planning, briefs, demos y dashboards de una sola vez. Usa el archivo público `design.md` (juicio
  de marca y composición), `PUBLIC-API.md` (la lista acotada de clases permitidas) y el CSS de
  Embassy servido por CDN. Disparala ante "armá una propuesta para X", "necesito un reporte con
  nuestra marca", "hacé un one-pager de esto", "una página con los resultados del trimestre",
  "que quede como Amalgama" cuando NO hay un repo de producto de por medio. Si el trabajo va a un
  repo de producto que se mantiene, usá `embassy` en su lugar.
detail: >-
  Entregables on-brand sin clonar nada: design.md + API acotada de clases + CSS por CDN.
output: Un HTML autocontenido, on-brand, verificado contra la taxonomía de fallas.
format: HTML de un solo archivo · sin build · sin repo
examples: |-
  armá una propuesta para SimpleFit
  necesito un reporte del proyecto con nuestra marca
  hacé un one-pager con estos resultados
---

# Embassy Artifact — entregables on-brand sin repo

Para todo lo que **no** vive en un repo de producto: propuestas, reportes, one-pagers, páginas de
resultados, briefs, demos. Lo puede correr cualquiera del estudio, sin git y sin terminal.

**La regla que hace que esto funcione: no leas el CSS.** Son 268 KB y 500+ selectores. El
stylesheet se carga cuando la página renderiza; vos trabajás con la lista acotada de clases.

---

## Paso 1 — Cargá las dos fuentes

```bash
# El juicio de marca: composición, jerarquía, voz, anti-patrones
curl -s https://raw.githubusercontent.com/amalgamaco/amalgama-design-system/main/design.md
# La API acotada de clases permitidas
curl -s https://raw.githubusercontent.com/amalgamaco/amalgama-design-system/main/PUBLIC-API.md
```

Si no hay red, pedí los dos archivos al usuario. **No sigas de memoria**: la marca cambia y las
clases inventadas son la falla número uno de este flujo.

`PUBLIC-API.md` es largo. Leelo en dos tiempos: primero el índice de componentes para elegir, después
solo las secciones de los que vas a usar.

---

## Paso 2 — Enmarcá el entregable

Seis líneas antes del primer tag (§4 de `design.md`):

```
OBJETIVO    lector: <quién y qué necesita decidir>   negocio: <qué vuelve más probable>
OBJETO      primario: <de qué se trata la página>    niveles: <clave → soporte → bajo demanda>
ACCIONES    primaria: <una sola>                     secundarias: <cuáles>
COMPOSICIÓN <afirmación | evidencia | comparación | herramienta>
RESPONSIVE  desktop: <estructura>                    mobile: <la transformación>
ESTADOS     <los que apliquen: vacío, error, sin datos>
```

Si el usuario no te dio el objetivo del lector, **preguntá antes de escribir**. Una propuesta sin
saber quién la lee y qué tiene que decidir sale genérica y hay que rehacerla entera.

### Composiciones

| Patrón | Cuándo | Esqueleto |
|---|---|---|
| Encabezado por afirmación | hay una conclusión y la evidencia la sostiene | afirmación → 2–4 datos que la prueban → detalle → qué sigue |
| Encabezado por evidencia | los datos son el punto | contexto breve → tabla/chart → lectura → implicancia |
| Comparación | dos o más opciones con criterios comunes | criterios → comparación pareada → recomendación con el trade-off |
| Herramienta | el lector tiene que probar supuestos | un modelo, pocos controles, resultado siempre visible |

---

## Paso 3 — Construí

Cabecera fija del documento:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@main/css/variables.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@main/css/base.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@main/css/components.css">
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Epilogue:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<script src="https://unpkg.com/lucide@latest"></script>
```

> Si el entregable se publica como artifact de Claude, el CDN de scripts externos está restringido:
> usá `cdnjs.cloudflare.com` para Lucide e **inlineá** `variables.css` en un `<style>`. Los estilos
> propios de la página van inline igual: un solo archivo, sin dependencias más allá de estas.

Reglas de construcción, en orden de peso:

1. **Solo clases de `PUBLIC-API.md`.** Si nada sirve, componé con lo que hay; no inventes.
2. **Todo color, radio, espacio y tamaño de fuente sale de un token.** Cero hex, cero px sueltos,
   cero familias entre comillas. Si necesitás un valor derivado, `color-mix()` sobre un rol.
3. **Una sola columna de contenido con ancho deliberado**, y todas las regiones alineadas a ella.
   ~1120–1200px dashboards y tablas · ~760–800px lectura · ~640–680px formularios.
4. **Una sola acción primaria.** El resto baja de escala.
5. **Los datos se califican donde están:** unidad, período, base, comparador.
6. **Íconos Lucide** (`<i data-lucide="…">` + `lucide.createIcons()`), un solo set.
7. **Nada de motion inventado.** Tokens `--duration-*` / `--ease-*`, y `prefers-reduced-motion`
   respetado.
8. **Idioma:** producto e interno en rioplatense; comercial hacia afuera en inglés.

Tema por superficie: hero o landing con banda oscura (`--primary-900`); reportes, propuestas y
dashboards en light con header oscuro si hace falta contraste de marca.

**Logo:** los SVG transparentes de `design.md` §6.6, elegidos por fondo. Nunca dibujarlo a mano,
nunca inventar un nombre de archivo, nunca una variante con fondo incrustado.

---

## Paso 4 — Autorrevisión antes de entregar

Recorré la lista de reflejos de `design.md` §8 y la taxonomía de `FAILURES.md`. Lo que más aparece
en este flujo, en orden:

- **`B1`** clases que no existen en `PUBLIC-API.md` → cruzalas una por una
- **`A1`/`A2`/`A3`** hex crudo, familia entre comillas, px de tipografía suelto
- **`H2`** gradientes decorativos, glassmorphism, sombras de colores
- **`H1`** eyebrow decorativo arriba del título
- **`C1`** dos acciones primarias
- **`H4`** emojis usados como íconos
- **`E6`** números sin base ni período
- **`D3`** full-bleed sin ancho máximo
- **`A9`** texto en negro en vez de navy

Chequeo mecánico, si hay terminal:

```bash
grep -nE "#[0-9a-fA-F]{3,8}\b" salida.html | grep -v "svg\|logo"   # A1
grep -nE "font-family\s*:\s*['\"]" salida.html                      # A2
grep -oE 'class="[^"]+"' salida.html | tr ' ' '\n' | grep -oE '[a-z][a-z0-9-]+' | sort -u
# ↑ cruzá esa lista contra public-api.json
```

Y siempre: **abrilo en light y en dark** (`<html data-theme="dark">`). Si tuviste que agregar un
override por tema, elegiste mal el token.

---

## Checklist

- [ ] `design.md` y `PUBLIC-API.md` leídos en esta sesión
- [ ] Las seis líneas del encuadre completas
- [ ] Composición elegida por la pregunta del lector, no por gusto
- [ ] Cada clase existe en `PUBLIC-API.md`; el CSS no se leyó
- [ ] Cero hex, cero px de tipografía sueltos, cero familias entre comillas
- [ ] Una acción primaria; todas las regiones en una columna con ancho deliberado
- [ ] Datos con unidad, período y base
- [ ] Ningún reflejo de `design.md` §8
- [ ] Light y dark, sin overrides por tema
- [ ] Idioma correcto para el destinatario
