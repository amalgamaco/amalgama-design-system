---
name: embassy-start
description: >-
  Configurá un proyecto nuevo para usar el Design System de Amalgama (Embassy), con o sin marca de
  cliente (white-label). Hace seis preguntas clave, genera el tema de marca desde un solo hex por
  paleta, verifica contraste AA, arma el layout base y deja el proyecto listo para que cualquiera
  siga con `/embassy`. Disparala ante "arranquemos este proyecto con el design system",
  "necesito usar Embassy para <cliente>", "setup del DS", "white label para <cliente>",
  "configurá el design system acá", "empezar un proyecto nuevo con nuestro DS", "armá el theme de
  la marca", "cómo arranco con Embassy". Es para el kickoff, una vez por proyecto — para construir
  pantallas después del setup usá `embassy`.
detail: >-
  El kickoff del design system en un proyecto: 6 preguntas, tema de marca generado y verificado,
  layout base, DESIGN.md del proyecto y preview de tema para mostrarle al cliente.
output: brand/<slug>.css · DESIGN.md · layout base · theme-preview.html · bloque para el CLAUDE.md del proyecto · reporte de verificación.
format: Conversación guiada · escribe archivos en el repo del proyecto
examples: |-
  arranquemos este proyecto con el design system de Amalgama
  necesito Embassy white label para SimpleFit
  configurá el DS acá
---

# Embassy Start — el kickoff del design system

Una vez por proyecto, ~15 minutos. Al terminar, nadie más tiene que saber cómo funciona el DS: el
proyecto queda configurado y el `CLAUDE.md` le dice al agente qué usar.

**Vos hacés las preguntas y escribís los archivos. La persona solo responde.** No asumas que sabe
qué es una primitiva, un token semántico o el orden de carga del CSS.

---

## Paso 1 — Traé el DS y ubicate

```bash
if [ -d "/tmp/amalgama-ds/.git" ]; then cd /tmp/amalgama-ds && git pull --ff-only
elif [ -d "$HOME/Documents/Claude/Projects/Design System Amalgama" ]; then
  ln -sfn "$HOME/Documents/Claude/Projects/Design System Amalgama" /tmp/amalgama-ds
else git clone --depth 1 https://github.com/amalgamaco/amalgama-design-system /tmp/amalgama-ds; fi
cd /tmp/amalgama-ds && git rev-parse --short HEAD
```

Registrá el commit: va en el `DESIGN.md` que vas a generar. Leé `WHITE-LABEL.md` (el modelo de
theming) y `PUBLIC-API.md` (las clases disponibles). **No leas `css/components/`**: no hace falta
para el setup.

Mirá qué hay ya en el proyecto destino antes de preguntar nada:

```bash
ls package.json next.config.* vite.config.* 2>/dev/null
grep -rEl "\-\-color-(primary|surface)|\-\-text-primary|tailwind" --include="*.css" --include="*.js" . | head
```

Lo que puedas inferir, no lo preguntes: confirmalo en una línea.

---

## Paso 2 — Las seis preguntas

Preguntá en dos rondas, con opciones concretas. Si podés usar una herramienta de preguntas de opción
múltiple, usala — es más rápido que escribir.

### Ronda A · Contexto

**1. ¿Qué tipo de proyecto es?**
Producto de cliente (white-label) · Producto interno de Amalgama · Entregable de una sola vez

> Si es un entregable de una vez → **derivá a `/embassy-artifact` y terminá acá.** No hace falta
> configurar nada.
> Si es interno de Amalgama → saltá la Ronda B: se usa la marca Amalgama tal cual.

**2. ¿Stack y superficie?**
Stack: buildless (HTML + CSS + JS) · React / Next · proyecto existente con su propia capa de tokens
Superficie: app con shell (sidebar + topbar) · sitio o landing · dashboard embebido

> *Proyecto con capa de tokens propia* cambia todo: en ese caso **no** generes un tema. Usá los
> nombres de tokens que ya existen y anotá la divergencia en el `DESIGN.md` (`GOVERNANCE.md` §15).

**3. ¿Audiencia, densidad e idioma?**
Herramienta interna densa · Producto consumer · Mixto — y el idioma de la UI

> Define tamaños por defecto, targets táctiles (≥44px si hay mobile real), estrategia de tema y la
> voz del copy. Producto de Amalgama = español rioplatense; cliente = lo que use el cliente.

### Ronda B · Marca (solo si la 1 fue white-label)

**4. ¿Color primario de la marca? ¿Y el de acento?**
**Un hex de cada uno alcanza** — vos generás las 10 tintas.

> Si todavía no hay marca definida: se queda Embassy y lo anotás como pendiente en `DESIGN.md`.
> Si te dan un manual de marca o un logo, pedí el hex exacto; no lo saques de un screenshot.
>
> **Cuidado con el rol de cada paleta.** En Embassy `--color-primary` es `--primary-900`: se usa
> para texto de página y sidebar, así que tiene que ser oscuro. `--color-secondary` es
> `--secondary-900`: el acento interactivo. Si el color vivo de la marca es un naranja o un lima,
> va como **secondary**, y el primary es el neutro oscuro de la marca. El script te avisa si el hex
> que pasaste no encaja en el rol.

**5. ¿Qué personalidad de forma?**
Redondeada · Balanceada (default de Embassy) · Técnica

> Son 4 tokens de radio y es el cambio que más mueve la percepción de marca (`WHITE-LABEL.md` §2.3).

**6. ¿Tipografía y grises?**
Tipografía: Embassy default (Inter / Epilogue / DM Mono) · el cliente tiene fuentes **con licencia y
forma de cargarlas** (¿cuáles?) · hay que proponer
Grises: los de Embassy · el cliente mandó cálidos o fríos

> Sin licencia verificada y sin Google Fonts o `@font-face` que funcione, **se quedan las de
> Embassy**. Son neutras a propósito. Nunca overridees `--font-size-*`.

### Lo que NO preguntás, y por qué

Si te preguntan por alguna de estas, explicá el motivo — no la agregues al cuestionario.

| No se pregunta | Por qué |
|---|---|
| Cuántos usuarios tiene el negocio | No cambia ningún token. Lo que importa lo captura la pregunta 3 |
| Si quiere light y dark | El dark ya viene automático y sin costo. Preguntarlo sugiere que es opcional |
| Tamaños de tipografía | La escala está validada y es estable entre clientes |
| Qué componentes quiere | Están los 62; se usa el que corresponde a cada caso |
| El radio de las píldoras | `--radius-full` nunca se overridea |
| Colores de estado | Solo si el cliente los tiene mandados por normativa o accesibilidad |

---

## Paso 3 — Generá el tema

```bash
node /tmp/amalgama-ds/scripts/build-brand-theme.mjs \
  --slug <cliente> --primary "#XXXXXX" --secondary "#YYYYYY" \
  --radius rounded|balanced|technical \
  [--font-heading "X"] [--font-body "Y"] \
  --out brand/<cliente>.css
```

El script genera las tintas siguiendo la curva de luminosidad de Embassy con el tono de la marca, y
verifica los pares de contraste que rompen. **Si sale con código 1, no sigas**: mostrá el par que
falla y volvé a la pregunta 4 con una variante más oscura o más clara del color.

**El bug de dark mode que vas a encontrar.** Hoy el bloque `[data-theme="dark"]` de
`css/variables.css` hardcodea en hex los roles que llevan marca (`--color-primary-container`,
`--color-secondary`, `--color-secondary-container` y los de tertiary), en vez de consumir
`var(--primitiva)`. Consecuencia: **el tema de marca funciona en light y no llega a dark** — el
cliente ve el azul y el navy de Embassy en tema oscuro. Verificalo y decilo:

```bash
node -e '
const {chromium}=require("playwright");(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto("file://"+process.cwd()+"/theme-preview.html");
for (const t of ["dark",null]) { await p.evaluate(v=>v?document.documentElement.setAttribute("data-theme",v):document.documentElement.removeAttribute("data-theme"),t);
console.log(t||"light", await p.evaluate(()=>["--color-primary","--color-primary-container","--color-secondary","--color-secondary-container"]
  .map(k=>k+"="+getComputedStyle(document.documentElement).getPropertyValue(k).trim()).join("  ")));}
await b.close();})();'
```

No lo arregles desde el proyecto — **un override por tema en el archivo de marca está prohibido**
(`WHITE-LABEL.md` §5). Anotalo como gap del DS en el `DESIGN.md` y avisale al dueño del DS.

---

## Paso 4 — Armá el layout base

Orden de carga, siempre este:

```html
<link rel="stylesheet" href=".../css/variables.css">   <!-- 1. tokens -->
<link rel="stylesheet" href="brand/<cliente>.css">      <!-- 2. la marca (solo primitivas) -->
<link rel="stylesheet" href=".../css/base.css">         <!-- 3. reset + tipografía -->
<link rel="stylesheet" href=".../css/layout.css">       <!-- 4. solo si hay app shell -->
<link rel="stylesheet" href=".../css/components.css">   <!-- 5. componentes -->
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
```

- **Buildless** → los links de arriba, vendorizando el CSS del DS o apuntando al CDN pineado.
- **React / Next** → los mismos imports en el entry, y `components/ui/*.tsx` copiados si el equipo
  los quiere. El CSS es canónico; los wrappers son conveniencia tipada.
- **Proyecto con capa de tokens propia** → no agregues `brand/`. Usá los nombres que ya existen y
  **nunca** un puente de alias que remapee nombres de Embassy a los del proyecto.

---

## Paso 5 — El preview de tema

Generá `theme-preview.html`: una página autocontenida con los componentes de uso frecuente
renderizados con la marca del cliente, y un toggle de tema.

Qué incluir, en este orden (uno de cada, no un catálogo completo):

1. Header con el logo y la acción primaria — la escala de botones completa (`btn-primary`,
   `btn-elevated`, `btn-secondary`, `btn-tertiary`, `btn-text`, `icon-btn`)
2. Un `toolbar` con `search-field`, `toolbar-filters` y `result-count`
3. Una tabla o lista con `badge` de estado y `chip` de filtro
4. Tres `stat-card` con variación positiva, negativa y neutra
5. Un formulario: `field-input`, `select`, `checkbox`, `radio`, `switch`, `textarea`
6. Feedback: `alert` de cada variante, un `toast`, un `empty-state`, un `skeleton`
7. La paleta generada: las tintas de primary y secondary con su número de contraste

Reglas: las clases salen de `PUBLIC-API.md`, cero hex crudos, y el toggle solo pone o saca
`data-theme="dark"` en `<html>` — **ningún estilo por tema**.

Esta página es el entregable de kickoff: es lo que se le muestra al cliente y lo que usa el equipo
de diseño para aprobar el tema. Mucho mejor que una tabla de hex.

---

## Paso 6 — Dejá el contrato del proyecto

### `DESIGN.md` en la raíz del proyecto

```markdown
# Design — <proyecto>

**Design System:** Embassy (`amalgamaco/amalgama-design-system`) @ <commit>
**Tema de marca:** `brand/<cliente>.css` — primary <hex> · secondary <hex> · radio <personalidad>
**Tipografía:** <fuentes> · **Idioma de UI:** <idioma> · **Densidad:** <audiencia>

## Cómo se trabaja acá
- Pantallas nuevas o rediseños → `/embassy`
- Entregables de una vez (propuestas, reportes) → `/embassy-artifact`
- Antes de entregar o mergear → `/embassy-review`

## Reglas que no se negocian
- Solo tokens. Cero hex crudos, cero px de tipografía sueltos, cero familias entre comillas.
- Solo primitivas en `brand/`. Nunca roles semánticos, nunca overrides por tema.
- Un solo `btn-primary` por contexto.
- Las clases salen de `PUBLIC-API.md`. Componente que falta se marca, no se inventa.

## Decisiones tomadas
- <una línea por decisión, con su razón>

## Pendientes
- <lo que quedó abierto: fuentes sin licenciar, marca sin definir, gaps del DS detectados>
```

### El bloque para el `CLAUDE.md` del proyecto

Si existe, agregalo; si no, proponé crearlo. Es lo que hace que el proyecto "se acuerde" del DS:

```markdown
## Design System
Este proyecto usa Embassy con el tema de marca de `brand/<cliente>.css`.
Antes de escribir cualquier UI, usá la skill `embassy`. No hardcodees colores, fuentes ni radios:
todo sale de tokens. Las reglas completas están en `DESIGN.md`.
```

---

## Paso 7 — El reporte de cierre

Cerrá con esto, corto:

1. **Qué quedó configurado** — los archivos generados, uno por línea.
2. **Contrastes** — la tabla del script, y qué se ajustó si algo falló.
3. **Dark mode** — el resultado de la verificación del paso 3.
4. **Pendientes** — fuentes sin licencia, marca sin definir, gaps del DS.
5. **Cómo sigue el equipo** — la línea de `/embassy` y `/embassy-review`.

---

## Checklist

- [ ] DS pulleado y commit registrado
- [ ] Lo inferible del proyecto, inferido y confirmado — no preguntado
- [ ] Las seis preguntas hechas (o la Ronda B salteada con motivo)
- [ ] Tema generado con el script, no a mano
- [ ] Contraste AA verificado en light; dark verificado y reportado
- [ ] Orden de carga del CSS correcto
- [ ] `brand/` contiene **solo** primitivas — `grep -E "^\s*--color-" brand/<cliente>.css` vacío
- [ ] `theme-preview.html` generado, funcionando en ambos temas
- [ ] `DESIGN.md` y el bloque de `CLAUDE.md` escritos
- [ ] Reporte de cierre entregado
