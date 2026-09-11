# DEPLOYMENT.md

Cómo el contenido de este repo llega al sitio público de Embassy.

**Sitio live:** <https://presentations.amalgama.co/p/amalgama-design-system/>

---

## TL;DR

**La plataforma espeja este repo. Mergear a `main` es publicar.** No hay snapshot
manual que rearmar, no hay build step, no hay que pedirle nada a nadie para que un
cambio aparezca. El sitio es **público** (abre sin login), así que el link se puede
compartir con cualquiera de Amalgama.

---

## Evidencia (verificado 2026-09-08)

Esto no es una suposición — se comprobó así:

1. **La plataforma sirve el árbol del repo, no una copia curada.**
   `https://presentations.amalgama.co/p/amalgama-design-system/component-rules/manifest.json`
   devuelve el JSON real del repo, con su `count: 61`. Un snapshot armado a mano no
   incluiría ese archivo.
2. **El sitio trae el último commit de `main`.** `acb86c0` (28/7/2026) agregó
   `padding: 0` a `.icon-btn`; el `css/components/button.css` que sirve el sitio lo tiene.
3. **Las versiones coinciden.** El sitio muestra `v2.1 · Julio 2026`, igual que el
   `index.html` del repo.
4. **Es público.** Se abre sin credenciales de Amalgama.

---

## Qué se publica

La arquitectura canónica es **buildless** (confirmada 2026-07-17, cuando se revirtió
la migración a Tailwind/React):

| Capa | Archivos | Rol |
|---|---|---|
| **Docs site** | `index.html` | SPA de una sola página, HTML + JS vanilla. Es el catálogo. |
| **Tokens** | `css/variables.css`, `css/base.css`, `css/layout.css`, `css/md-sys-bridge.css` | Custom properties + reset. Requerido por todo lo demás. |
| **Componentes** | `css/components/*.css` (62 archivos) + el barrel `css/components.css` | Clases planas kebab-case, cada archivo autocontenido. Origen de verdad del código. |
| **Assets** | `logos/`, `docs/docs.css` | Referenciados por path relativo desde `index.html`. |

`docs/*.html` son **redirect stubs** al SPA (`../index.html#c-<componente>`); se
mantienen para no romper links viejos, no son páginas reales.

---

## Cómo publicar un cambio

1. **Editá** lo que corresponda: `css/components/<nombre>.css` para el componente,
   `index.html` para la doc, `component-rules/<nombre>.md` para las reglas del agente.
2. **Corré el validador** — es el gate real antes de mergear:
   ```bash
   node scripts/validate-ds.mjs      # debe terminar en "0 failure(s)"
   ```
   Chequea hex crudo en CSS, tokens fantasma, rutas y anchors rotos, el manifest
   contra los archivos de reglas, y la metadata de frontmatter y de motion.
   Los warnings (hex inline en `index.html`, duraciones crudas en keyframes) son
   informativos y hoy están asumidos.
3. **Si tocaste `component-rules/`**, regenerá el registro:
   ```bash
   python3 scripts/build-manifest.py
   ```
4. **Commiteá y mergeá a `main`.**
5. **Verificá en el sitio** con hard refresh (Cmd+Shift+R). Si no aparece, ver
   "Puntos abiertos" abajo antes de asumir que algo se rompió.

---

## Lo que NO hay que hacer

- **No armar snapshots manuales** ni subir archivos a mano a la plataforma.
- **No buscar `islands/` ni `packages/ds/`.** La migración a Tailwind + React/Radix
  (junio 2026) fue **revertida** el 17/7. `islands/` hoy solo tiene `node_modules`
  residual y `packages/ds/` está vacío. `scripts/sync-tokens.mjs`, que copiaba tokens a
  ese paquete inexistente, se eliminó en septiembre 2026.
- **No autorizar componentes nuevos fuera de `css/components/`.** Los wrappers React
  opcionales en `components/ui/*.tsx` aplican las mismas clases y no llevan estilos propios.

---

## Consumidores externos por CDN

Artifacts y proyectos que no clonan el repo linkean los tokens vía jsDelivr, **contra un tag**:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@v1.1.0/css/variables.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@v1.1.0/css/base.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@v1.1.0/css/composition.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@v1.1.0/css/components.css">
```

`@main` en un entregable significa que una pantalla que el cliente ya aprobó puede cambiar de
aspecto porque alguien mergeó algo un martes. Un tag lo congela. jsDelivr además cachea un tag
para siempre, así que no hay que purgar nada.

### Releases

La regla en una línea: **lo que se entrega pinea, las skills leen `main`.**

| Quién | Contra qué | Por qué |
|---|---|---|
| El HTML de un proyecto o un artifact | `@v<x.y.z>` | Lo entregado no cambia solo |
| Las skills, leyendo `design.md`, `PUBLIC-API.md`, `public-api.json` | `main` | El criterio conviene tenerlo al día, y no viaja con el entregable |
| El sitio de docs | el repo | No pasa por jsDelivr |

Para sacar una versión:

```bash
node scripts/build-public-api.mjs      # el manifiesto tiene que estar al día
git tag -a v1.1.0 -m "qué cambió, en una línea"
git push origin v1.1.0
```

Cuándo sube cada número: **patch** si es un arreglo que no cambia cómo se ve nada (un contraste
que ya estaba mal, un bug de cascada); **minor** si hay componentes o tokens nuevos, o si algo se
ve distinto a propósito; **major** si un proyecto que actualiza tiene que tocar su código.

Después del tag, actualizá el número en `scripts/build-public-api.mjs` y en las dos skills que
emiten HTML (`screen`, `artifact`) — si no, los proyectos nuevos siguen naciendo en la versión
vieja. Los proyectos que ya existen suben cuando alguien decide subirlos, que es el punto.

---

## Puntos abiertos

Confirmar con quien administra `presentations.amalgama.co`:

- **Qué branch sirve y con cuánta latencia.** Está verificado que sirve el contenido de
  `main`; no está verificado si el sync es por webhook en el push o por pull periódico.
  Si un merge no aparece en minutos, este es el primer lugar donde mirar.
- **Cómo se registró este proyecto.** La plataforma expone un endpoint de registro
  (`POST /api/external/proposals`, con `githubRepo` y bearer token interno) que usan las
  propuestas comerciales. Probablemente Embassy esté registrado por la misma vía.
- **Si conviene un check de CI.** Hoy no hay `.github/workflows/`. Un job que corra
  `node scripts/validate-ds.mjs` en cada PR evitaría publicar una regresión, ya que
  mergear publica directo.

---

## Por qué este archivo cambió

La versión anterior (hasta 2026-09-08) afirmaba que **no existía deploy link**, que el
sitio live era un snapshot manual congelado en `v2.0 · Mayo 2026` "pre-pivot", y describía
el pipeline de islands (`cd islands && npm run build`, bump del `?v=`) que ya no existe.
Las tres cosas eran falsas y llevaban a la conclusión opuesta a la real: que el sitio
estaba viejo y había que republicarlo a mano. Reescrito con las verificaciones de arriba.
