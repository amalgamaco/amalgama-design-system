#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   build-mobile-index.mjs — la lista de componentes en nativo

   Hay UN solo componente por nombre. Lo que cambia entre plataformas son los
   valores de token y, en diecinueve casos, el patrón. Por eso esto no es un
   catálogo paralelo: es una VISTA sobre el mismo catálogo, generada desde
   public-api.json (que a su vez sale del CSS) más el mapa de abajo.

   El mapa es la única fuente de la decisión "qué pasa con este componente en
   nativo", y este script la renderiza en los dos lugares donde hace falta:

     · index.html            la sección Components · Nativo, entre marcadores
     · MOBILE.md §5          las tres tablas, entre marcadores

   Escrito a mano en los dos lugares, en dos semanas dicen cosas distintas.

   Uso:
     node scripts/build-mobile-index.mjs           genera
     node scripts/build-mobile-index.mjs --check   falla si hay drift (CI)
   ═══════════════════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT  = process.argv.find(a => !a.startsWith("-") && a !== process.argv[0] && a !== process.argv[1])
              || join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");

/* ── El mapa ─────────────────────────────────────────────────────────────
   porta   → mismo componente, otros valores de token
   patrón  → en nativo el patrón equivalente es OTRO, no una versión chica
   ausente → no existe sin puntero
   gs      → el componente de gluestack v5 del que se copia estructura y
             comportamiento; null cuando no lo tiene y hay que armarlo
   arma    → con qué primitivas, cuando gs es null
   ─────────────────────────────────────────────────────────────────────── */
const MAPA = {
  // ── portan tal cual ──
  accordion:        { k: "porta", gs: "Accordion" },
  alert:            { k: "porta", gs: "Alert" },
  attachment:       { k: "porta", gs: null, arma: "HStack + Icon + Text" },
  avatar:           { k: "porta", gs: "Avatar" },
  badge:            { k: "porta", gs: "Badge" },
  button:           { k: "porta", gs: "Button", nota: "Sus variant (solid/outline/link) y action (primary/secondary/positive/negative) NO son nuestras variantes: se mapean a las cinco de Embassy, no se adoptan." },
  calendar:         { k: "porta", gs: "Calendar" },
  card:             { k: "porta", gs: "Card" },
  carousel:         { k: "porta", gs: null, arma: "FlatList horizontal con paginado" },
  checkbox:         { k: "porta", gs: "Checkbox" },
  chip:             { k: "porta", gs: null, arma: "Pressable + Text", nota: "Su Badge es de solo lectura, igual que el nuestro: no sirve de chip. Se dibuja a 40 y se toca a 48 con hitSlop." },
  collapsible:      { k: "porta", gs: "Accordion" },
  description:      { k: "porta", gs: null, arma: "VStack + Text" },
  divider:          { k: "porta", gs: "Divider" },
  "empty-state":    { k: "porta", gs: null, arma: "VStack + Text + Button" },
  form:             { k: "porta", gs: "Input + FormControl", nota: "FormControl trae label, helper y error: es más que nuestro field-group." },
  "input-otp":      { k: "porta", gs: null, arma: "HStack de Input con teclado numérico" },
  item:             { k: "porta", gs: null, arma: "HStack + Text" },
  label:            { k: "porta", gs: "FormControl" },
  list:             { k: "porta", gs: null, arma: "FlatList + Pressable" },
  "person-card":    { k: "porta", gs: null, arma: "HStack + Avatar + Text" },
  placeholder:      { k: "porta", gs: "Skeleton" },
  progress:         { k: "porta", gs: "Progress" },
  "radio-group":    { k: "porta", gs: "Radio" },
  search:           { k: "porta", gs: null, arma: "Input + Icon" },
  "segmented-button": { k: "porta", gs: null, arma: "HStack de Pressable, o Tabs re-skinneado" },
  select:           { k: "porta", gs: "Select", nota: "En nativo abre un actionsheet, no un popover." },
  skeleton:         { k: "porta", gs: "Skeleton" },
  slider:           { k: "porta", gs: "Slider" },
  spinner:          { k: "porta", gs: "Spinner" },
  "stat-card":      { k: "porta", gs: null, arma: "Card + Text con los tokens de .figure" },
  switch:           { k: "porta", gs: "Switch" },
  tabs:             { k: "porta", gs: "Tabs" },
  toast:            { k: "porta", gs: "Toast" },
  toggle:           { k: "porta", gs: null, arma: "Pressable con estado", nota: "Se dibuja a 40 y se toca a 48." },
  "toggle-group":   { k: "porta", gs: null, arma: "HStack de Pressable" },
  "vacancy-card":   { k: "porta", gs: "Card" },

  // ── cambian de patrón ──
  "back-link":      { k: "patron", en: "El back del stack navigator", porque: "La jerarquía la lleva el navegador, no la pantalla" },
  breadcrumb:       { k: "patron", en: "El back del stack navigator", porque: "Una ruta completa no entra ni se lee en 390px" },
  "button-group":   { k: "patron", en: "Segmented button, o botones apilados a lo ancho", porque: "Botones pegados de costado no llegan al piso táctil" },
  chart:            { k: "patron", en: "El mismo dato con menos series y sin leyenda flotante", porque: "Una leyenda flotante tapa el gráfico en pantalla chica" },
  combobox:         { k: "patron", en: "Sheet con búsqueda", porque: "El popover con filtro es un patrón de puntero", gs: "Actionsheet + Input" },
  command:          { k: "patron", en: "Pantalla de búsqueda completa", porque: "El ⌘K es de teclado" },
  "context-menu":   { k: "patron", en: "Actionsheet, con long-press", porque: "No hay click derecho", gs: "Actionsheet" },
  "create-form":    { k: "patron", en: "Pantalla propia, nunca un modal", porque: "Un formulario dentro de un modal en 390px es una trampa" },
  "data-table":     { k: "patron", en: "Lista de filas apiladas (label: valor) o card por registro", porque: "Una tabla en 390px se scrollea de costado y nadie lo hace" },
  "date-picker":    { k: "patron", en: "El Calendar docked en un bottom sheet", porque: "El popover chico es de escritorio", gs: "DateTimePicker" },
  "dropdown-menu":  { k: "patron", en: "Actionsheet", porque: "No hay menú flotante", gs: "Menu · Actionsheet" },
  "input-group":    { k: "patron", en: "Campos apilados", porque: "Un input con addon de costado no entra" },
  kanban:           { k: "patron", en: "Segmented button + una columna a la vez", porque: "Tres columnas en 390px no son tres columnas" },
  menubar:          { k: "patron", en: "Tab bar + stack", porque: "No existe barra de menú en una app" },
  modal:            { k: "patron", en: "Pantalla completa o bottom sheet", porque: "Un diálogo chico centrado se siente web", gs: "Modal · Actionsheet" },
  "navigation-menu":{ k: "patron", en: "Tab bar + stack", porque: "La navegación la lleva el navigator" },
  "page-header":    { k: "patron", en: "El header del stack navigator", porque: "El título de pantalla lo pone la navegación" },
  pagination:       { k: "patron", en: "Scroll infinito o “cargar más”", porque: "Paginar con números es de escritorio" },
  popover:          { k: "patron", en: "Bottom sheet, o el contenido inline", porque: "Un popover necesita un ancla y espacio alrededor", gs: "Actionsheet" },
  "scroll-area":    { k: "patron", en: "ScrollView / FlatList", porque: "El scroll lo maneja la plataforma" },
  sheet:            { k: "patron", en: "Bottom sheet", porque: "El sheet lateral es un patrón de escritorio", gs: "Actionsheet · BottomSheet" },
  table:            { k: "patron", en: "Filas apiladas (label: valor)", porque: "Una tabla en 390px no se lee" },
  toolbar:          { k: "patron", en: "Header nativo + barra de acción abajo", porque: "Lo importante va al alcance del pulgar" },

  // ── no existen sin puntero ──
  tooltip:          { k: "ausente", porque: "Necesita hover, y en un teléfono no hay hover. Si el dato hace falta, va inline" },
  "rich-tooltip":   { k: "ausente", porque: "Ídem tooltip. Si tiene tanto contenido que necesita título y acciones, es un bottom sheet" },
};

/* ── entrada ─────────────────────────────────────────────────────────── */

const api = JSON.parse(readFileSync(join(ROOT, "public-api.json"), "utf8"));
const byId = new Map(api.components.map(c => [c.id, c]));

const faltan = [...byId.keys()].filter(id => !MAPA[id] && !["layout", "composition", "space", "preview-native"].includes(id));
const sobran = Object.keys(MAPA).filter(id => !byId.has(id));

/* ── el demo de cada componente sale del bloque Uso: de su CSS ────────── */

function demo(c) {
  if (!c.usage) return null;
  let u = c.usage
    .replace(/<!--[\s\S]*?-->/g, "")   // los comentarios del snippet no se renderizan
    .split("\n").filter((l) => l.trim() !== "").join("\n")  // y dejan líneas vacías: se van
    .trim();
  if (!u.startsWith("<")) return null;

  // Un solo ejemplo por celda. Cortar por línea en blanco no sirve —los comentarios
  // ya las produjeron— así que se corta cuando el primer elemento cierra.
  const abre = u.match(/^<([a-z][a-z0-9-]*)/i);
  if (abre) {
    const tag = abre[1].toLowerCase();
    const VOID = ["input", "img", "br", "hr", "meta", "link", "source"];
    if (VOID.includes(tag) || /^<[^>]*\/>/.test(u)) {
      u = u.slice(0, u.indexOf(">") + 1);
    } else {
      const re = new RegExp(`</?${tag}\\b[^>]*>`, "gi");
      let d = 0, m;
      while ((m = re.exec(u))) {
        d += m[0].startsWith("</") ? -1 : (m[0].endsWith("/>") ? 0 : 1);
        if (d === 0) { u = u.slice(0, m.index + m[0].length); break; }
      }
    }
  }

  // Los placeholders … del snippet quedarían como texto suelto en la celda.
  return u.replace(/>\s*…\s*</g, "><").replace(/…/g, "").trim();
}

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ── salida 1: la sección de la doc ──────────────────────────────────── */

const porta   = Object.entries(MAPA).filter(([, m]) => m.k === "porta").sort();
const patron  = Object.entries(MAPA).filter(([, m]) => m.k === "patron").sort();
const ausente = Object.entries(MAPA).filter(([, m]) => m.k === "ausente").sort();

const gsTag = (m) => m.gs
  ? `<span class="mc-gs">${esc(m.gs)}</span>`
  : `<span class="mc-gs-no">✗ no tiene · ${esc(m.arma || "primitivas")}</span>`;

const celdas = porta.map(([id, m]) => {
  const c = byId.get(id);
  const d = demo(c);
  return `          <div class="mc-cell">
            <div class="mc-head">
              <a class="mc-id" href="#" onclick="navigate('${id}');return false">${esc(id)}</a>
              ${gsTag(m)}
            </div>
            <div class="mc-demo">${d || '<span class="mc-nodemo">se ve en su página</span>'}</div>
            ${m.nota ? `<p class="mc-note">${esc(m.nota)}</p>` : ""}
          </div>`;
}).join("\n");

const filasPatron = patron.map(([id, m]) =>
  `            <tr><td><a href="#" onclick="navigate('${id}');return false"><code>${esc(id)}</code></a></td><td><strong>${esc(m.en)}</strong>${m.gs ? ` <span class="mc-gs mc-gs-inline">${esc(m.gs)}</span>` : ""}</td><td>${esc(m.porque)}</td></tr>`
).join("\n");

const filasAusente = ausente.map(([id, m]) =>
  `            <tr><td><code>${esc(id)}</code></td><td>${esc(m.porque)}</td></tr>`
).join("\n");

const seccion = `
    <!-- ═══════════ COMPONENTS · NATIVO (GENERADO — build-mobile-index.mjs) ═══════════ -->
    <section class="ds-section" id="s-mobile-components">
      <div class="ds-page-tag">Components · Nativo</div>
      <h1 class="ds-page-title">Componentes en nativo</h1>
      <p class="ds-page-desc">El mismo catálogo, visto desde una app. <strong>No es una segunda biblioteca:</strong> hay un solo componente por nombre y su ficha sigue siendo su página en Components — lo que cambia acá son los valores de token y, en ${patron.length} casos, el patrón. Esta página es generada desde <code>public-api.json</code>, así que no puede decir algo distinto del CSS.</p>

      <div class="ds-callout"><strong>Los demos están renderizados con los tokens de teléfono</strong> (<code>data-platform="native"</code>): cuerpo 16, controles a 48. Son los componentes de Embassy, no los de gluestack — la etiqueta verde dice de qué componente de gluestack se copia la estructura y el comportamiento, y la gris con <code>✗</code>, cuáles hay que armar con primitivas. Por qué el preview no puede ser gluestack, en la página <a href="#" onclick="navigate('mobile');return false">Nativo</a>.</div>

      <h2 class="ds-h2">Se portan tal cual · ${porta.length}</h2>
      <p class="ds-p">Mismo componente, otros valores. Se rediseñan cero.</p>
      <div class="ds-preview" data-platform="native" style="display:block;padding:22px">
        <div class="mc-grid">
${celdas}
        </div>
      </div>

      <h2 class="ds-h2">Cambian de patrón · ${patron.length}</h2>
      <p class="ds-p">Acá no hay demo a propósito: renderizar la versión chica del patrón de escritorio sería enseñar justo lo que <code>M4</code> marca como falla. Lo que va en su lugar:</p>
      <div class="ds-table-wrap">
        <table class="ds-table">
          <thead><tr><th>Web</th><th>En nativo</th><th>Por qué</th></tr></thead>
          <tbody>
${filasPatron}
          </tbody>
        </table>
      </div>

      <h2 class="ds-h2">No existen sin puntero · ${ausente.length}</h2>
      <div class="ds-table-wrap">
        <table class="ds-table">
          <thead><tr><th>Web</th><th>Por qué no</th></tr></thead>
          <tbody>
${filasAusente}
          </tbody>
        </table>
      </div>
    </section>
`;

/* ── salida 2: las tablas de MOBILE.md §5 ────────────────────────────── */

const mdPorta = porta.map(([id, m]) =>
  `| \`${id}\` | ${m.gs ? `**${m.gs}**` : `**no tiene** — ${m.arma}`} |${m.nota ? ` ${m.nota}` : ""}`
).join("\n");

const md = `| Embassy | gluestack v5 | Notas |
|---|---|---|
${porta.map(([id, m]) => `| \`${id}\` | ${m.gs ? `**${m.gs}**` : `**no tiene** — ${m.arma}`} | ${m.nota || "—"} |`).join("\n")}

### Cambian de patrón · ${patron.length}

| Web | En nativo | Por qué |
|---|---|---|
${patron.map(([id, m]) => `| \`${id}\` | ${m.en}${m.gs ? ` (\`${m.gs}\`)` : ""} | ${m.porque} |`).join("\n")}

### No existen sin puntero · ${ausente.length}

| Web | Por qué no |
|---|---|
${ausente.map(([id, m]) => `| \`${id}\` | ${m.porque} |`).join("\n")}
`;

/* ── escribir entre marcadores ───────────────────────────────────────── */

const M = {
  htmlA: "<!-- BEGIN mobile-components (generado) -->",
  htmlB: "<!-- END mobile-components -->",
  mdA:   "<!-- BEGIN mobile-map (generado por scripts/build-mobile-index.mjs) -->",
  mdB:   "<!-- END mobile-map -->",
};

function reemplazar(ruta, a, b, contenido) {
  const p = join(ROOT, ruta);
  const src = readFileSync(p, "utf8");
  const i = src.indexOf(a), j = src.indexOf(b);
  if (i === -1 || j === -1) throw new Error(`faltan los marcadores en ${ruta}`);
  const nuevo = src.slice(0, i + a.length) + "\n" + contenido + "\n" + src.slice(j);
  return { p, ruta, src, nuevo, cambio: nuevo !== src };
}

const salidas = [
  reemplazar("index.html", M.htmlA, M.htmlB, seccion),
  reemplazar("MOBILE.md",  M.mdA,   M.mdB,   md),
];

console.log(`componentes: ${porta.length} portan · ${patron.length} cambian de patrón · ${ausente.length} no existen`);
if (faltan.length) console.log(`\nSIN MAPEAR (${faltan.length}): ${faltan.join(", ")}`);
if (sobran.length) console.log(`\nEN EL MAPA PERO NO EN LA API (${sobran.length}): ${sobran.join(", ")}`);

if (CHECK) {
  const viejos = salidas.filter(s => s.cambio).map(s => s.ruta);
  if (viejos.length || faltan.length) {
    if (viejos.length) console.error(`\nDRIFT: ${viejos.join(", ")} — corré: node scripts/build-mobile-index.mjs`);
    if (faltan.length) console.error(`\nComponentes sin entrada en el mapa: ${faltan.join(", ")}`);
    process.exit(1);
  }
  console.log("\nsin drift");
} else {
  for (const s of salidas) if (s.cambio) writeFileSync(s.p, s.nuevo);
  console.log(`\nescrito: ${salidas.filter(s => s.cambio).map(s => s.ruta).join(", ") || "(sin cambios)"}`);
  if (faltan.length) process.exitCode = 1;
}
