#!/usr/bin/env node
/**
 * check-output.mjs — chequeos determinísticos sobre lo que un agente PRODUJO.
 *
 * `validate-ds.mjs` valida el design system. Esto valida la salida hecha con él.
 * Cubre solo las fallas de `FAILURES.md` que se pueden detectar sin criterio humano;
 * el resto lo juzga `embassy-review`.
 *
 * Uso:
 *   node scripts/check-output.mjs <archivo|glob> [...]
 *   node scripts/check-output.mjs --json runs/20260908-1430/guided/*.html
 *
 * Salida: una línea por hallazgo (`ID · SEV · archivo:línea · evidencia`) y un
 * resumen contable. Exit 1 si hay BLOQUEANTES.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const asJson = process.argv.includes("--json");
const files = process.argv.slice(2).filter((a) => !a.startsWith("--"));

if (!files.length) {
  console.error("uso: node scripts/check-output.mjs <archivo> [...]");
  process.exit(2);
}

/** API pública de clases; si falta, el chequeo B1 se saltea con aviso. */
let publicClasses = null;
const apiPath = path.join(ROOT, "public-api.json");
if (fs.existsSync(apiPath)) {
  const api = JSON.parse(fs.readFileSync(apiPath, "utf8"));
  publicClasses = new Set(api.components.flatMap((c) => c.classes));
} else {
  console.warn("! public-api.json no encontrado — se saltea B1. Corré: node scripts/build-public-api.mjs");
}

/** Clases que no son del DS y son legítimas: utilidades de layout propias de la página. */
const ALLOW_PREFIX = [/^u-/, /^page-/, /^is-/, /^has-/, /^js-/, /^lucide/];

const RULES = [
  {
    id: "A1", sev: "BLOQ", desc: "hex crudo donde existe un token",
    re: /#[0-9a-fA-F]{3,8}\b/g,
    skipLine: (l) => /variables\.css|\.svg|logo|amalgama-static-sites/.test(l) || /#(000|fff|000000|ffffff)\b/i.test(l),
  },
  { id: "A2", sev: "BLOQ", desc: "familia tipográfica entre comillas en vez de var(--font-*)", re: /font-family\s*:\s*['"]/g },
  { id: "A3", sev: "ALTA", desc: "font-size en px suelto sin token", re: /font-size\s*:\s*-?\d+(\.\d+)?px/g },
  { id: "A5", sev: "BLOQ", desc: "token primitivo en código de producto", re: /var\(\s*--(primary|neutral|secondary|tertiary|success|error|warning|info)-\d+/g },
  { id: "A6", sev: "BLOQ", desc: "override por tema", re: /\[data-theme=["']?dark["']?\]\s*\{|prefers-color-scheme|\.dark\s*\{/g },
  // ── M · nativo (React Native) ────────────────────────────────────────────
  // Dos superficies distintas y las dos cuentan:
  //   · el .tsx de la app
  //   · el preview HTML con data-platform="native" (preview-native.css), que es
  //     donde se diseña y se aprueba antes de que exista el .tsx
  // Las reglas se activan solas: solo corren si el archivo es de nativo (§esNativo).
  { id: "M1", sev: "ALTA", nativo: true, desc: "tamaño tipográfico a mano en vez de leerlo de native/nativeDark",
    re: /fontSize\s*:\s*-?\d+(\.\d+)?\b/g },
  { id: "M3", sev: "ALTA", nativo: true, desc: "safe area hardcodeada en vez de useSafeAreaInsets()",
    re: /padding(Top|Bottom)\s*:\s*(2[0-9]|3[0-9]|4[0-9]|5[0-9])\b/g },
  { id: "M5", sev: "ALTA", nativo: true, desc: "la escala web en una app: se importó light/dark en vez de native/nativeDark",
    re: /import\s*\{[^}]*\b(light|dark)\b[^}]*\}\s*from\s*['"][^'"]*embassy\.tokens/g },
  // M7 — el que más caro sale, porque RN no avisa: pasa lineHeight como
  // multiplicador y dibuja mal en silencio. En RN son puntos.
  { id: "M7", sev: "ALTA", nativo: true, desc: "lineHeight o letterSpacing como multiplicador o em — RN los mide en puntos y los ignora",
    re: /(lineHeight|letterSpacing)\s*:\s*(['"]?-?[01]?\.\d+(em)?['"]?|['"]-?\d+(\.\d+)?em['"])/g },
  { id: "M6", sev: "MEDIA", nativo: true, desc: "tokens de columna, grilla de 12, max-width o medida en ch en una pantalla nativa",
    re: /--column-(gutter|max)|\bgrid-12\b|\bcolumn-(read|form|bleed|rail|split|1280|1440|1600|1920)\b|max-?[Ww]idth\s*:\s*\d|\d+ch\b/g },
  { id: "M8", sev: "ALTA", nativo: true, desc: "utility de gluestack/Tailwind sin traducir a tokens",
    re: /\b(bg|text|border|rounded|p|px|py|m|mx|my|gap)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b|\brounded-(sm|md|lg|xl|2xl|3xl|full)\b|\btext-(xs|sm|base|lg|xl|2xl|3xl)\b/g },

  // H10 — imagen de banco. La política es "solo material real" (COMPOSICION.md regla 10): si el
  // dato no vino del cliente no existe, y la foto tampoco. Se detecta por dominio porque es lo
  // único determinístico; una ilustración isométrica subida a nuestro S3 la agarra el review.
  { id: "H10", sev: "ALTA", desc: "imagen de banco (stock) — la política es solo material real",
    re: /(unsplash|pexels|shutterstock|freepik|istockphoto|gettyimages|pixabay)\.com/gi },
  // H11 — la página revelándose al scrollear. .reveal va una sola vez, al cargar.
  { id: "H11", sev: "MEDIA", desc: "secciones apareciendo al scrollear (scroll reveal)",
    re: /IntersectionObserver|data-aos|scrollreveal|wow\.js|aos\.init/gi },
  { id: "A8", sev: "ALTA", desc: "fuga de utilidades de otro framework", re: /\b(text|bg|border)-(zinc|slate|gray|neutral|indigo|blue|red|green)-\d{2,3}\b/g },
  { id: "A10", sev: "MEDIA", desc: "border-radius inline en vez del modificador de tamaño", re: /style="[^"]*border-radius/g },
  // A11 — tracking escrito a mano. La escala es cerrada (variables.css §Letter spacing) y tiene
  // dos positivos que NO son intercambiables: --letter-spacing-overline (0.04em, el overline de
  // página en mono) y --letter-spacing-label (0.08em, versalitas de 10-11px de componente).
  // Un literal acá es casi siempre el eyebrow de 0.14em que delata una página generada.
  {
    id: "A11", sev: "MEDIA", desc: "letter-spacing con valor literal en vez de --letter-spacing-*",
    re: /letter-spacing\s*:\s*(?!var\()[^;}\n]+/g,
    skipLine: (l) => /normal|inherit|initial|unset/.test(l),
  },
  // B3 solo aplica al input SUELTO. Un <input type="search"> dentro de .search-field o .search-bar
  // es el markup canónico del DS — marcarlo era un falso positivo sobre páginas correctas.
  {
    id: "B3",
    sev: "ALTA",
    desc: "input genérico con placeholder de búsqueda, fuera de search-field / search-bar",
    custom: (src) => {
      const out = [];
      for (const m of src.matchAll(/<input[^>]*placeholder=["'][^"']*[Bb]usc[^>]*>/g)) {
        // ¿el contenedor abierto más cercano antes del input es un search-field/search-bar?
        const before = src.slice(0, m.index);
        const wrapper = [...before.matchAll(/class="[^"]*\b(search-field|search-bar|search-view-header)\b[^"]*"/g)].pop();
        if (wrapper && before.slice(wrapper.index).split("</div>").length <= 2) continue;
        out.push([src.slice(0, m.index).split("\n").length, m[0].slice(0, 60)]);
      }
      return out;
    },
  },
  { id: "F3", sev: "ALTA", desc: "búsqueda sin role=\"search\"", custom: (src) => (/[Bb]uscar/.test(src) && !/role=["']search["']/.test(src) ? [[1, "hay búsqueda y ningún role=\"search\""]] : []) },
  { id: "G1", sev: "ALTA", desc: "cubic-bezier o ms crudos en vez de tokens", re: /cubic-bezier\(|(?:transition|animation)[^;{]*?\b\d+m?s\b/g },
  { id: "G3", sev: "BLOQ", desc: "prefers-reduced-motion anulado", re: /prefers-reduced-motion[^}]*\{[^}]*!important/g },
  { id: "H4", sev: "ALTA", desc: "emoji usado como ícono", re: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu },
];

function lineOf(src, index) {
  return src.slice(0, index).split("\n").length;
}

const findings = [];
const allowed = [];

/**
 * Excepción declarada por la propia página, con motivo obligatorio:
 *   <!-- ds-allow: A5, C1 — esta página es un catálogo de tema, muestra la rampa a propósito -->
 * Existe porque un preview de tema o un catálogo de componentes dispara reglas escritas para
 * pantallas de producto. La excepción queda escrita en el archivo y se ve en el reporte: nadie
 * la apaga en silencio. Sin motivo (texto después del guion) no vale.
 */
/**
 * Devuelve el mismo HTML con los subárboles ocultos borrados (reemplazados por espacios, así
 * los números de línea y los offsets no se mueven).
 *
 * Existe por C1. El DS EXIGE que una pantalla traiga sus estados —vacío, sin resultados, error—
 * y en mobile un bottom sheet con su propia acción. Todos vienen ocultos en el markup. Contando
 * a ciegas, una pantalla bien hecha tiene tres o cuatro btn-primary y el check la marcaba como
 * bloqueante: la regla castigaba justamente a quien sigue el sistema. Lo agarramos en la primera
 * corrida del eval, sobre la pantalla guiada.
 *
 * Oculto = atributo `hidden`, `aria-hidden="true"` o un `style` con display:none.
 */
function stripHidden(src) {
  const OCULTO = /(?:\shidden(?=[\s/>=]|$)|aria-hidden\s*=\s*["']?true|style\s*=\s*["'][^"']*display\s*:\s*none)/i;
  const out = src.split("");
  const tag = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)(\/?)>/g;
  const stack = [];
  let ocultoDesde = -1, profundidad = 0;
  for (const m of src.matchAll(tag)) {
    const [txt, cierre, nombre, attrs, autoCierre] = m;
    if (cierre) {
      while (stack.length && stack.pop() !== nombre) { /* markup roto: seguimos */ }
      if (ocultoDesde >= 0 && stack.length < profundidad) {
        for (let i = ocultoDesde; i < m.index + txt.length; i++) if (out[i] !== "\n") out[i] = " ";
        ocultoDesde = -1;
      }
      continue;
    }
    if (autoCierre || /^(br|hr|img|input|link|meta|source|track|wbr|area|base|col|embed|param)$/i.test(nombre)) {
      if (ocultoDesde < 0 && OCULTO.test(attrs)) {
        for (let i = m.index; i < m.index + txt.length; i++) if (out[i] !== "\n") out[i] = " ";
      }
      continue;
    }
    stack.push(nombre);
    if (ocultoDesde < 0 && OCULTO.test(attrs)) { ocultoDesde = m.index; profundidad = stack.length; }
  }
  return out.join("");
}

function declaredAllows(src) {
  const out = new Map();
  for (const m of src.matchAll(/ds-allow\s*:\s*([A-Z]\d+(?:\s*,\s*[A-Z]\d+)*)\s*[—-]\s*(.+?)\s*(?:-->|$)/gm)) {
    const motivo = m[2].trim();
    if (motivo.length < 10) continue; // un motivo de una palabra no es un motivo
    for (const id of m[1].split(",").map((x) => x.trim())) out.set(id, motivo);
  }
  return out;
}

for (const file of files) {
  if (!fs.existsSync(file)) { console.warn(`! no existe: ${file}`); continue; }
  const src = fs.readFileSync(file, "utf8");
  const lines = src.split("\n");
  const allows = declaredAllows(src);

  // El tema de marca generado es la capa de tokens del proyecto, no código de producto: ahí
  // los hex crudos (A1), las primitivas (A5) y los ms y curvas literales (G1) son justamente
  // lo que el archivo tiene que declarar, igual que variables.css. A6 se suma porque las
  // superficies oscuras están literales en variables.css y no hay primitiva que overridear
  // (WHITE-LABEL.md §4.2b). Sin esto, un review sobre el proyecto devolvía ~55 hallazgos
  // falsos apuntando al único archivo que está bien.
  // Se reconoce por la firma del generador, no por el nombre del archivo: un archivo escrito
  // a mano que se llame brand/x.css no zafa de las reglas.
  if (/Generado por scripts\/build-brand-theme\.mjs/.test(src)) {
    for (const id of ["A1", "A5", "A6", "G1"]) {
      if (!allows.has(id)) allows.set(id, "tema de marca generado — WHITE-LABEL.md §4.2b");
    }
  }

  for (const [id, motivo] of allows) allowed.push({ file, id, motivo });

  // ¿Este archivo es de una pantalla nativa? Dos señales objetivas: un .tsx que
  // importa de react-native, o un preview con data-platform="native".
  const esTsxNativo = /\.tsx?$/.test(file) && /from\s+['"]react-native['"]|from\s+['"]expo/.test(src);
  const esPreview   = /data-platform\s*=\s*["']native["']/.test(src);
  const esNativo    = esTsxNativo || esPreview;

  // El preview es HTML de Embassy, así que las reglas de nativo que hablan de
  // sintaxis de RN (M1 fontSize, M3 paddingTop, M5 import, M7 lineHeight) no
  // aplican ahí: en el preview esos valores salen del CSS y de los tokens.
  const soloTsx = new Set(["M1", "M3", "M5", "M7"]);

  // Una pantalla nativa que se entrega SIN preview y sin .tsx no se puede medir.
  // Y un preview sin preview-native.css muestra los controles a la altura de
  // escritorio, o sea que miente: es la falla más barata de detectar y la que
  // más confunde a quien aprueba.
  if (esPreview && !/preview-native\.css/.test(src))
    findings.push({ file, line: 1, id: "M2", sev: "BLOQ",
      desc: "preview nativo sin preview-native.css: los controles se dibujan a la altura de escritorio y el preview miente",
      evidence: 'data-platform="native" sin el <link> de preview-native.css' });

  // M2 en el preview: un alto inline por debajo del piso táctil sobre algo que
  // se toca. Lo inline es lo único determinístico sin navegador; lo que viene
  // del CSS ya lo garantiza preview-native.css.
  if (esPreview) {
    const re = /<(button|a|input|select|textarea)\b[^>]*style="[^"]*\b(min-)?height\s*:\s*(\d+)px/gi;
    let m;
    while ((m = re.exec(src))) {
      if (Number(m[3]) < 48)
        findings.push({ file, line: lineOf(src, m.index), id: "M2", sev: "BLOQ",
          desc: "superficie tocable por debajo de 48 (--target-min)",
          evidence: `<${m[1]}> con ${m[2] || ""}height: ${m[3]}px` });
    }
  }

  for (const rule of RULES) {
    if (allows.has(rule.id)) continue;
    if (rule.nativo && (!esNativo || (soloTsx.has(rule.id) && !esTsxNativo))) continue;
    if (rule.custom) {
      for (const [ln, ev] of rule.custom(src)) findings.push({ file, line: ln, ...rule, evidence: ev });
      continue;
    }
    for (const m of src.matchAll(rule.re)) {
      const ln = lineOf(src, m.index);
      const lineText = lines[ln - 1] ?? "";
      if (rule.skipLine?.(lineText)) continue;
      findings.push({ file, line: ln, ...rule, evidence: m[0].trim().slice(0, 60) });
    }
  }

  // C1 — más de un btn-primary a la vez. Se cuenta sobre el markup VISIBLE: los estados y el
  // bottom sheet que el DS pide vienen ocultos y cada uno trae su propia primaria, que nunca
  // convive con la del toolbar.
  const primaries = [...stripHidden(src).matchAll(/class="[^"]*\bbtn-primary\b/g)];
  if (primaries.length > 1 && !allows.has("C1")) {
    findings.push({
      id: "C1", sev: "BLOQ", desc: "más de un btn-primary — verificá si están en el mismo contexto",
      file, line: lineOf(src, primaries[1].index), evidence: `${primaries.length} ocurrencias`,
    });
  }

  // H7 — el overline repetido. Uno que clasifica algo es una decisión válida; dos o más es un
  // reflejo, y a esa altura no clasifica: es textura (COMPOSICION.md regla 1).
  //
  // Se cuentan las declaraciones propias de la página, no los elementos: `.overline` del DS no
  // suma (viene del CSS del sistema, no del markup), y tampoco suma el CSS vendorizado. Sin ese
  // filtro, una página correcta con un badge y un overline daba 2 y salía marcada.
  if (!allows.has("H7")) {
    const propios = [...src.matchAll(/text-transform\s*:\s*uppercase/g)].filter((m) => {
      const ctx = src.slice(Math.max(0, m.index - 400), m.index);
      return !/amalgama-design-system|vendor\/|node_modules|\.badge|\.overline|th\s*\{|nav-section-label|toast-action/.test(ctx);
    });
    if (propios.length > 1) {
      findings.push({
        id: "H7", sev: "MEDIA",
        desc: "más de un texto en mayúsculas propio de la página — repetido deja de clasificar y es textura",
        file, line: lineOf(src, propios[1].index), evidence: `${propios.length} bloques con text-transform: uppercase`,
      });
    }
  }

  // H9 — dos titulares editoriales. El registro editorial es la apertura de la página; dos
  // aperturas es ninguna. Y usado como "el estilo del título grande" deja de ser una portada.
  if (!allows.has("H9")) {
    const ed = [...src.matchAll(/class="[^"]*\beditorial-(lg|md|sm)\b/g)];
    if (ed.length > 1) {
      findings.push({
        id: "H9", sev: "MEDIA",
        desc: "más de un titular en registro editorial — es la apertura de la página, va una sola vez",
        file, line: lineOf(src, ed[1].index), evidence: `${ed.length} usos de editorial-*`,
      });
    }
  }

  // H12 — la capa espacial en un producto de cliente. La señal es objetiva: si la página
  // carga un brand/<cliente>.css, la marca es de otro, y la identidad de Amalgama no va ahí.
  // Es BLOQUEANTE porque no es un tema de gusto: es ponerle nuestra marca a algo que el
  // cliente pagó para que tenga la suya.
  if (!allows.has("H12")) {
    const espacial = /class="[^"]*\b(space|space-glow|orbit|planet|title-ghost)\b/.test(src) || /css\/space\.css/.test(src);
    const marcaCliente = [...src.matchAll(/href="[^"]*brand\/([a-z0-9-]+)\.css/gi)]
      .map((m) => m[1].toLowerCase())
      .filter((n) => n !== "amalgama");
    if (espacial && marcaCliente.length) {
      findings.push({
        id: "H12", sev: "BLOQ",
        desc: `capa espacial de Amalgama en un producto de marca ajena (brand/${marcaCliente[0]}.css)`,
        file, line: lineOf(src, src.search(/space|planet|orbit/)), evidence: `brand/${marcaCliente[0]}.css + capa espacial`,
      });
    }
  }

  // D9 — column-bleed sin acotar el texto. Sacar el ancho máximo es una decisión de estructura
  // válida (COMPOSICION.md regla 0); dejar que el párrafo mida 200 caracteres no lo es.
  // Se mira el atributo class, no el texto: el primer intento buscaba la palabra suelta y una
  // página que decía "sin measure" en su propio copy se daba por buena.
  const claseBleed = /class="[^"]*\bcolumn-bleed\b/;
  const claseMeasure = /class="[^"]*\bmeasure(-lead)?\b/;
  if (!allows.has("D9") && claseBleed.test(src) && !claseMeasure.test(src)) {
    findings.push({
      id: "D9", sev: "ALTA",
      desc: "column-bleed sin ninguna clase measure: el layout se liberó y el texto también",
      file, line: lineOf(src, src.search(claseBleed)), evidence: "column-bleed sin measure",
    });
  }

  // F2 — icon-btn sin aria-label, mirando el tag completo.
  if (!allows.has("F2")) for (const m of src.matchAll(/<[a-z]+[^>]*\bicon-btn\b[^>]*>/g)) {
    if (!/aria-label\s*=/.test(m[0])) {
      findings.push({ id: "F2", sev: "BLOQ", desc: "icon-btn sin aria-label", file, line: lineOf(src, m.index), evidence: m[0].slice(0, 60) });
    }
  }

  // B1 — clases fuera de la API pública.
  if (publicClasses && !allows.has("B1")) {
    const used = new Set();
    for (const m of src.matchAll(/class="([^"]+)"/g)) m[1].split(/\s+/).forEach((c) => c && used.add(c));
    for (const c of used) {
      if (publicClasses.has(c)) continue;
      if (ALLOW_PREFIX.some((re) => re.test(c))) continue;
      findings.push({ id: "B1", sev: "BLOQ", desc: "clase que no existe en la API pública del DS", file, line: 0, evidence: `.${c}` });
    }
  }
}

const count = (s) => findings.filter((f) => f.sev === s).length;
const summary = { BLOQ: count("BLOQ"), ALTA: count("ALTA"), MEDIA: count("MEDIA"), BAJA: count("BAJA"), total: findings.length };

if (asJson) {
  console.log(JSON.stringify({ files, summary, findings, allowed }, null, 2));
} else {
  const order = { BLOQ: 0, ALTA: 1, MEDIA: 2, BAJA: 3 };
  for (const f of findings.sort((a, b) => order[a.sev] - order[b.sev])) {
    console.log(`[${f.id} · ${f.sev}] ${path.basename(f.file)}${f.line ? `:${f.line}` : ""} — ${f.desc}\n    ${f.evidence}`);
  }
  for (const a of allowed) console.log(`[${a.id} · EXCEPCIÓN DECLARADA] ${path.basename(a.file)} — ${a.motivo}`);
  console.log(`\nBLOQUEANTES ${summary.BLOQ} · ALTAS ${summary.ALTA} · MEDIAS ${summary.MEDIA} · BAJAS ${summary.BAJA} · total ${summary.total}${allowed.length ? ` · ${allowed.length} excepción(es) declarada(s)` : ""}`);
  console.log("Lo que no se puede chequear acá (jerarquía, layout, estados, copy, contraste) lo juzga embassy-review.");
}

process.exit(summary.BLOQ > 0 ? 1 : 0);
