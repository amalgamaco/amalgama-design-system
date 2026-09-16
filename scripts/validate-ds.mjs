#!/usr/bin/env node
/**
 * Embassy Design System validator.  Run from repo root:  node scripts/validate-ds.mjs
 * Fails (exit 1) on token/route/metadata regressions so CI can gate them.
 *
 * Checks:
 *   1. css-hex        raw hex in css/components/*.css (outside comments; #000/#fff allowed) — FAIL
 *   2. phantom-tokens --color-fg[-*] / --color-chart-* references in index.html — FAIL
 *   3. routes         every SECTIONS route resolves to a section or a valid redirect — FAIL
 *   4. nav-anchors    every navigate('c-*') target resolves — FAIL
 *   5. manifest       component-rules/manifest.json exists & count == rule files — FAIL
 *   6. rules-metadata each component-rules/*.md has required frontmatter fields — FAIL
 *  12. generated      manifest.json / public-api.* must match their generators — FAIL
 *  11. release-tags  local v* tags must be pushed; versions cited in docs must exist — FAIL
 *   7. inline-hex     hex in index.html inline styles (swatch tables excluded) — WARN
 */
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath decodes %20 etc. — robust for repo paths containing spaces.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
let fails = 0, warns = 0;
const fail = (m) => { console.error("  ✗ " + m); fails++; };
const warn = (m) => { console.warn("  ! " + m); warns++; };
const ok = (m) => console.log("  ✓ " + m);

// ── 1. raw hex in css/components (strip comments first) ──────────────────
console.log("\n[1] css/components token compliance");
{
  const dir = path.join(ROOT, "css/components");
  let violations = 0;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".css"))) {
    const src = fs.readFileSync(path.join(dir, f), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    const hits = (src.match(/#[0-9a-fA-F]{3,8}\b/g) || [])
      .filter((h) => !/^#(000000|000|fff|ffffff|FFF|FFFFFF)$/.test(h));
    if (hits.length) { fail(`${f}: raw hex ${[...new Set(hits)].join(", ")}`); violations += hits.length; }
  }
  if (!violations) ok("no raw hex outside comments (only sanctioned #000/#fff)");
}

// ── 2. phantom tokens in index.html ──────────────────────────────────────
console.log("\n[2] phantom tokens");
{
  const html = read("index.html");
  const phantom = (html.match(/--color-fg\b|--color-fg-[a-z]+|--color-chart-/g) || []).length;
  phantom ? fail(`${phantom} phantom --color-fg*/--color-chart-* references (use --text-*/--color-on-surface*/--chart-*)`)
          : ok("0 phantom --color-fg*/--color-chart-* references");
}

// ── 3 & 4. routes + nav anchors ──────────────────────────────────────────
console.log("\n[3] routes & [4] nav anchors");
{
  const html = read("index.html");
  const routes = {};
  for (const m of html.matchAll(/'(c-[a-z0-9-]+)':\s*\{([^}]*)\}/g)) routes[m[1]] = m[2];
  const sections = new Set([...html.matchAll(/id="s-(c-[a-z0-9-]+)"/g)].map((m) => m[1]));
  const resolves = (k) => sections.has(k) ||
    (routes[k] && /redirect:\s*'([^']+)'/.exec(routes[k]) && sections.has(/redirect:\s*'([^']+)'/.exec(routes[k])[1]));
  const brokenRoutes = Object.keys(routes).filter((k) => !resolves(k));
  brokenRoutes.length ? fail(`routes with no section/redirect: ${brokenRoutes.join(", ")}`)
                      : ok(`${Object.keys(routes).length} routes all resolve`);
  const navTargets = new Set([...html.matchAll(/navigate\('(c-[a-z0-9-]+)'\)/g)].map((m) => m[1]));
  const dangling = [...navTargets].filter((t) => !(t in routes) && !sections.has(t));
  dangling.length ? fail(`navigate() targets with no route/section: ${dangling.join(", ")}`)
                  : ok(`${navTargets.size} navigate() targets all resolve`);
}

// ── 5. manifest coverage ─────────────────────────────────────────────────
console.log("\n[5] component manifest");
{
  const ruleFiles = fs.readdirSync(path.join(ROOT, "component-rules"))
    .filter((f) => f.endsWith(".md") && !["README.md", "INDEX.md"].includes(f));
  const mp = path.join(ROOT, "component-rules/manifest.json");
  if (!fs.existsSync(mp)) fail("component-rules/manifest.json missing — run scripts/build-manifest.py");
  else {
    const man = JSON.parse(fs.readFileSync(mp, "utf8"));
    man.count === ruleFiles.length
      ? ok(`manifest count ${man.count} == ${ruleFiles.length} rule files`)
      : fail(`manifest count ${man.count} != ${ruleFiles.length} rule files — regenerate`);
  }
}

// ── 5b. cobertura CSS → component-rules ──────────────────────────────────
// AI-USAGE-GUIDE §6 promete que "every component in css/components/ has a
// component-rules/<id>.md entry". El chequeo [5] solo compara manifest.count
// contra la cantidad de .md, así que nunca miraba el CSS. Esto sí.
// Ojo: el id de la regla NO siempre coincide con el nombre del archivo CSS
// (modal.css → dialog.md, toast.css → snackbar.md…), así que mapeamos por source.css.
console.log("\n[5b] cobertura css/components → component-rules");
{
  const mp = path.join(ROOT, "component-rules/manifest.json");
  if (fs.existsSync(mp)) {
    const man = JSON.parse(fs.readFileSync(mp, "utf8"));
    const cubiertos = new Set(
      (man.components ?? []).flatMap((c) => [c.source?.css].flat().filter(Boolean))
    );
    const cssFiles = fs.readdirSync(path.join(ROOT, "css/components"))
      .filter((f) => f.endsWith(".css"))
      .map((f) => `css/components/${f}`);
    const sinRegla = cssFiles.filter((f) => !cubiertos.has(f));
    sinRegla.length
      ? warn(`${sinRegla.length} componente(s) CSS sin component-rules — un agente no los puede elegir por propósito: ${sinRegla.map((f) => path.basename(f, ".css")).join(", ")}`)
      : ok(`${cssFiles.length} archivos CSS, todos con regla operativa`);
  }
}

// ── 6. rules frontmatter metadata ────────────────────────────────────────
console.log("\n[6] component-rules metadata");
{
  const req = ["id:", "display_name:", "category:", "status:", "summary:", "source:"];
  const dir = path.join(ROOT, "component-rules");
  let bad = 0;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".md") && !["README.md", "INDEX.md"].includes(f))) {
    const src = fs.readFileSync(path.join(dir, f), "utf8");
    if (!src.startsWith("---")) { fail(`${f}: no YAML frontmatter`); bad++; continue; }
    const fm = src.split("---")[1] || "";
    const missing = req.filter((k) => !fm.includes(k));
    if (missing.length) { fail(`${f}: missing ${missing.join(" ")}`); bad++; }
  }
  if (!bad) ok("all rule files have required frontmatter");
}

// ── 7. inline hex in index.html (soft) ───────────────────────────────────
console.log("\n[7] index.html inline hex (informational)");
{
  const html = read("index.html");
  // count hex inside style="..." attributes, excluding var(...,#hex) fallbacks
  let inline = 0;
  for (const m of html.matchAll(/style="([^"]*)"/g)) {
    const s = m[1].replace(/var\([^)]*\)/g, "");
    inline += (s.match(/#[0-9a-fA-F]{3,8}\b/g) || []).filter((h) => !/^#(000|fff|000000|ffffff)$/i.test(h)).length;
  }
  inline ? warn(`${inline} hex value(s) in inline style attrs — verify each is a sanctioned swatch/demo, else tokenize`)
         : ok("no raw hex in inline style attributes");
}

// ── 8. hardcoded motion durations in css/components (soft) ───────────────
console.log("\n[8] css/components motion tokens (informational)");
{
  const dir = path.join(ROOT, "css/components");
  let hits = [];
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".css"))) {
    let src = fs.readFileSync(path.join(dir, f), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    // Exclude prefers-reduced-motion blocks (intentional reduced values) from the lint.
    src = src.replace(/@media[^{]*prefers-reduced-motion[^{]*\{[\s\S]*?\}\s*\}/g, "");
    // raw duration in a transition:/animation: (shorthand or -duration), not via var(--duration), not a *-delay
    for (const m of src.matchAll(/\b(transition|animation)(-duration)?\s*:\s*[^;]*;/g)) {
      const decl = m[0];
      if (/\bvar\(--duration/.test(decl)) continue;
      const dur = decl.match(/(?:^|[^-\w.])([0-9]*\.?[0-9]+m?s)\b/);
      if (dur) hits.push(`${f}: ${dur[1]} in ${m[1]}${m[2] || ""}`);
    }
  }
  hits.length
    ? warn(`${hits.length} raw duration(s) in transition/animation (verify each is an intentional keyframe loop or delay, else use --duration-*):\n      ${[...new Set(hits)].join("\n      ")}`)
    : ok("all transition/animation durations use --duration-* tokens");
}

// ── 9. motion metadata in component-rules (fail) ─────────────────────────
console.log("\n[9] component-rules motion metadata");
{
  const dir = path.join(ROOT, "component-rules");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") && !["README.md", "INDEX.md"].includes(f));
  const missing = files.filter((f) => {
    const fm = fs.readFileSync(path.join(dir, f), "utf8").split("---")[1] || "";
    return !/\nmotion:/.test(fm);
  });
  missing.length ? fail(`${missing.length} rule file(s) missing a motion: block: ${missing.slice(0, 8).join(", ")}${missing.length > 8 ? "…" : ""}`)
                 : ok(`all ${files.length} rule files expose a motion: block`);
}

// ── 10. restos de la era Tailwind en la documentación ────────────────────
// La migración a Tailwind + React se revirtió el 2026-07-17: packages/ds/ e
// islands/ no existen en main. Cualquier doc que siga mandando a importar de
// @amalgama/ds o a usar prefijos md:/lg: está mandando a un lugar que no existe.
console.log("\n[10] restos de la arquitectura revertida (Tailwind / packages/ds)");
{
  const patron = /@amalgama\/ds|packages\/ds|tailwind\.theme\.css|\bmd:grid|\blg:grid|hover-tokens\.css/i;
  // Las menciones que EXPLICAN la reversión son legítimas y tienen que quedar
  // (CLAUDE.md, README.md, DEPLOYMENT.md, GOVERNANCE.md las documentan a propósito).
  // Solo interesan las que todavía INSTRUYEN a usar algo que no existe.
  const historico = /revert|revertida|reverted|deleted|no existen|está vacío|esta vacio|post-revert|era Tailwind|Tailwind era|2026-07-17|Corregido 2026/i;
  const hits = [];
  const scan = (dir) => {
    for (const f of fs.readdirSync(path.join(ROOT, dir))) {
      if (!f.endsWith(".md")) continue;
      const rel = path.join(dir, f);
      const lineas = fs.readFileSync(path.join(ROOT, rel), "utf8").split("\n");
      lineas.forEach((l, i) => {
        // La marca histórica puede estar en la línea siguiente (párrafos envueltos).
        const ventana = lineas.slice(Math.max(0, i - 1), i + 3).join(" ");
        if (patron.test(l) && !historico.test(ventana)) hits.push(`${rel}:${i + 1}`);
      });
    }
  };
  scan("guidelines");
  scan(".");
  hits.length
    ? warn(`${hits.length} doc(s) todavía instruyen usar packages/ds o utilidades Tailwind: ${hits.slice(0, 8).join(", ")}${hits.length > 8 ? ` …y ${hits.length - 8} más` : ""}`)
    : ok("ningún doc instruye usar la arquitectura revertida (las menciones históricas se ignoran)");
}

// ── 11. tags de release publicados ───────────────────────────────────────
// DEPLOYMENT.md §Releases manda a los entregables a pinear contra @v<x.y.z> en
// jsDelivr. Un tag que existe solo en local hace que esa URL devuelva 404 para
// todos los demás: el doc queda apuntando a algo que no existe. Ya pasó con
// v1.0.0, creado y no pusheado. El proceso estaba bien escrito; lo que faltaba
// era que algo lo chequeara.
// También al revés: la versión que los scripts emiten en el <link> tiene que
// ser un tag real, o los proyectos nuevos nacen apuntando al vacío.
console.log("\n[11] tags de release");
{
  const git = (args) => {
    try {
      return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    } catch { return null; }
  };
  const locales = (git(["tag", "-l", "v*"]) ?? "").split("\n").filter(Boolean);
  // Sin red no se puede saber qué hay publicado: se avisa y no se rompe el gate.
  const remoto = git(["ls-remote", "--tags", "origin"]);
  if (remoto === null) {
    warn("no se pudo consultar origin (¿sin red?) — no se verificaron los tags publicados");
  } else {
    const publicados = new Set(
      remoto.split("\n").map((l) => l.split("refs/tags/")[1]).filter(Boolean)
            .map((t) => t.replace(/\^\{\}$/, ""))
    );
    const sinPushear = locales.filter((t) => !publicados.has(t));
    sinPushear.length
      ? fail(`${sinPushear.length} tag(s) solo en local — la URL @<tag> de jsDelivr da 404 para todos los demás: ${sinPushear.join(", ")}. Publicalos: git push origin ${sinPushear.join(" ")}`)
      : ok(`${locales.length} tag(s) de release, todos publicados en origin`);
    // La versión que los entregables van a llevar tiene que existir como tag.
    const fuentes = ["scripts/build-public-api.mjs", "DEPLOYMENT.md"];
    const citadas = new Set();
    for (const f of fuentes) {
      if (!fs.existsSync(path.join(ROOT, f))) continue;
      for (const m of read(f).matchAll(/amalgama-design-system@(v\d+\.\d+\.\d+)/g)) citadas.add(m[1]);
    }
    const fantasma = [...citadas].filter((v) => !publicados.has(v) && !locales.includes(v));
    fantasma.length
      ? fail(`versión(es) citadas en los docs/scripts que no existen como tag: ${fantasma.join(", ")}`)
      : ok(`${citadas.size} versión(es) citadas, todas existen como tag`);
  }
}

// ── 12. archivos generados al día ────────────────────────────────────────
// manifest.json, public-api.json y PUBLIC-API.md se DERIVAN de component-rules/*.md
// y css/components/. Tocar un .md y no regenerar deja la fuente y el registro
// diciendo cosas distintas — y el registro es lo que leen los agentes, así que la
// regla llega a la doc y no a las herramientas. Pasó dos veces (search.md editado a
// mano en el manifest; button.md con --radius-button sin regenerar).
// [5] y [5b] no lo agarran: miran cantidades y cobertura, no si el contenido está al día.
// Sin efectos secundarios: los generadores escriben en un temp vía --out y se compara.
// ── 11c. el header no se cierra antes de tiempo ──────────────────────────
// Pasó de verdad: accordion.css tenía "--color-*/--text-*" en la prosa del header.
// Ese */ CIERRA el comentario, así que todo lo que seguía —incluido el bloque Uso:—
// quedaba como CSS suelto, y el parser se comía la primera regla del archivo
// (.accordion { width: 100% }) usando la prosa como selector. En el navegador no
// hay error: simplemente falta una regla. Y en PUBLIC-API el componente salía sin
// markup, que es como lo encontramos.
console.log("\n[11c] el header de cada componente cierra donde tiene que cerrar");
{
  const CIERRE = "═══════════════════════════════════════ */";
  const rotos = [];
  for (const f of fs.readdirSync(path.join(ROOT, "css/components")).filter((f) => f.endsWith(".css"))) {
    const src = read(`css/components/${f}`);
    if (!src.startsWith("/*")) continue;
    const primer = src.indexOf("*/");
    const cierre = src.indexOf(CIERRE);
    if (cierre !== -1 && primer !== -1 && primer < cierre) rotos.push(f);
  }
  rotos.length
    ? fail(`${rotos.length} header(s) se cierran antes de tiempo por un */ en la prosa ` +
           `(escribí "--color-* y --text-*", no "--color-*/--text-*"): ${rotos.join(", ")}`)
    : ok("ningún header se cierra antes de tiempo");
}

console.log("\n[12] archivos generados al día");
{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ds-gen-"));
  const run = (cmd, args) => {
    try {
      execFileSync(cmd, args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "ignore", "pipe"] });
      return true;
    } catch { return false; }
  };
  try {
    const objetivos = [];
    if (run("python3", ["scripts/build-manifest.py", "--out", path.join(tmp, "manifest.json"),
                        "--out-index", path.join(tmp, "INDEX.md")])) {
      objetivos.push(["component-rules/manifest.json", path.join(tmp, "manifest.json"), "python3 scripts/build-manifest.py"]);
      objetivos.push(["component-rules/INDEX.md", path.join(tmp, "INDEX.md"), "python3 scripts/build-manifest.py"]);
    } else warn("no se pudo correr build-manifest.py (¿falta PyYAML?) — manifest.json e INDEX.md sin verificar");

    if (run("node", ["scripts/build-public-api.mjs", "--out", path.join(tmp, "PUBLIC-API.md"),
                     "--out-json", path.join(tmp, "public-api.json")])) {
      objetivos.push(["PUBLIC-API.md", path.join(tmp, "PUBLIC-API.md"), "node scripts/build-public-api.mjs"]);
      objetivos.push(["public-api.json", path.join(tmp, "public-api.json"), "node scripts/build-public-api.mjs"]);
    } else warn("no se pudo correr build-public-api.mjs — la API pública quedó sin verificar");

    // tokens/ sale de css/variables.css y lo consume React Native, que no puede leer
    // el CSS: si queda atrás, la app y la web se separan sin que nada avise.
    // build-tokens.mjs trae su propio --check, así que se delega ahí.
    if (!run("node", ["scripts/build-tokens.mjs", ROOT, "--check"]))
      fail("tokens/ quedó atrás de css/variables.css. Regeneralo: node scripts/build-tokens.mjs");
    else ok("tokens/ al día con css/variables.css");

    const viejos = objetivos.filter(([rel, gen]) =>
      !fs.existsSync(path.join(ROOT, rel)) || read(rel) !== fs.readFileSync(gen, "utf8"));
    viejos.length
      ? fail(`${viejos.length} archivo(s) generado(s) desactualizado(s) respecto de sus fuentes: ` +
             viejos.map(([rel]) => rel).join(", ") +
             `. Regeneralo(s): ${[...new Set(viejos.map(([, , cmd]) => cmd))].join(" && ")}`)
      : ok(`${objetivos.length} archivo(s) generado(s), todos reproducibles desde sus fuentes`);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// ── 13. el cromo del sitio usa tokens ───────────────────────────────────────
// Por qué existe: [7] cuenta el hex inline de index.html y es SOLO informativo, porque la
// página está llena de swatches y de ejemplos de código donde el literal ES el contenido.
// Ese permiso se le colaba al cromo: en septiembre de 2026 las tarjetas de rol tenían
// `rgba(79,128,255,.1)` y tres eyebrows usaban el tracking ancho en sans que COMPOSICION.md
// regla 1 prohíbe por nombre.
//
// La regla que hace esto enforceable sin ahogar en falsos positivos: **falla solo cuando
// existe un token con ese valor exacto**. Si el valor no está en la escala, no es deuda de
// quien escribió la regla — es un hueco de la escala, y se cuenta aparte.
console.log("\n[13] el cromo del sitio usa tokens");
{
  const html = read("index.html");
  const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join("\n")
    .replace(/\/\*[\s\S]*?\*\//g, "");
  const vars = read("css/variables.css").replace(/\/\*[\s\S]*?\*\//g, "");
  const raiz = vars.slice(vars.indexOf(":root"), vars.indexOf("}", vars.indexOf(":root")));
  const norm = (x) => x.trim().toLowerCase().replace(/^(-?)0\./, "$1.");
  const tok = new Map();
  // Todos los candidatos, no el último: 12px es --font-size-caption Y
  // --font-size-overline, y quedarse con uno solo hace que el mensaje recomiende
  // un rol que puede no ser el de este texto. El chequeo dice qué tokens tienen
  // ese valor; cuál corresponde lo decide quien escribe.
  for (const [, n2, v] of raiz.matchAll(/(--(?:font-size|letter-spacing)-[\w-]+)\s*:\s*([^;]+);/g))
    if (!n2.includes("editorial") && norm(v) !== "0") tok.set(norm(v), [...(tok.get(norm(v)) || []), n2]);

  // El literal ES el contenido: un swatch de color, una muestra de la escala tipográfica,
  // una miniatura que DIBUJA una interfaz. Exentas y nombradas.
  const DEMO = /\.(bd-color|bd-swatch|ds-swatch|bd-type|ds-type|bst-|ds-space|bd-space|ds-token|bd-elev|bd-shadow|bd-radius|emb-collage|emb-motion|emb-dm-thumb)/;
  // Y los que MUESTRAN un esquema: una maqueta del modo oscuro, una comparación
  // bien/mal, un panel de contraste. Ahí el hex ES el contenido, igual que un swatch:
  // tokenizarlos haría que la demo del oscuro cambie con el tema y deje de demostrar nada.
  const MUESTRA = /\.(ds-dark-map|ds-mode-compare|ds-vs-head|ds-ctx-pane|ds-ctx-mock|ds-scheme-board|ds-cr-panel|ds-cr-stage)/;

  const conToken = [], huerfanos = new Map(), colores = [];
  for (const m of css.matchAll(/(^|\})\s*([^{}@]*?)\{([^}]*)\}/g)) {
    const sel = m[2].trim().replace(/\s+/g, " "), body = m[3];
    if (!sel || sel.startsWith("@") || sel.includes(":root") || DEMO.test(sel) || MUESTRA.test(sel)) continue;
    for (const [, prop, val] of body.matchAll(/(?:^|;)\s*([a-z-]+)\s*:\s*([^;]+)/g)) {
      const v = norm(val);
      if (/^(color|background|background-color|border-color)$/.test(prop) && !v.startsWith("var(")
          && /#[0-9a-fA-F]{3,8}\b|rgba?\(/.test(v)
          // blanco y negro con alpha son literales sancionados, igual que en [1]:
          // un velo sobre una superficie fija no tiene token porque no es un color del sistema
          && !/^rgba?\(\s*(255,\s*255,\s*255|0,\s*0,\s*0)\b/.test(v))   // un var(--x, #fallback) no es color crudo
        colores.push(`${sel} { ${prop}: ${val.trim()} }`);
      if (prop === "font-size" && /^[\d.]+px/.test(v))
        tok.has(v) ? conToken.push(`A3 ${sel} { ${v} } → ${tok.get(v).map(t => `var(${t})`).join(" | ")}`)
                   : huerfanos.set(v, (huerfanos.get(v) || 0) + 1);
      if (prop === "letter-spacing" && !v.startsWith("var(") && v !== "normal" && v !== "0")
        tok.has(v) ? conToken.push(`A11 ${sel} { ${v} } → ${tok.get(v).map(t => `var(${t})`).join(" | ")}`)
                   : huerfanos.set(v, (huerfanos.get(v) || 0) + 1);
    }
  }
  if (conToken.length)
    fail(`${conToken.length} declaración(es) con un token exacto disponible y escritas a mano: ` +
         conToken.slice(0, 6).join(" · ") + (conToken.length > 6 ? ` …y ${conToken.length - 6} más` : ""));
  else ok("ninguna declaración a mano teniendo token exacto");

  // Los colores crudos que quedan avisan y NO fallan todavía, a propósito y con fecha:
  // son 16 clases mezcladas — algunas son demos que MUESTRAN el esquema oscuro (`.ds-dark-map`,
  // `.ds-scheme-board`, `.ds-mode-compare-body`: ahí el literal es el contenido, como un swatch)
  // y otras son cromo real (`.ds-copy`, `.ds-writing-box.good`). Separarlas es criterio de
  // diseño, no de regex. Cuando estén clasificadas, las de cromo pasan a `fail` y las de demo
  // entran a DEMO de arriba. Mientras tanto se cuentan para que no se olviden.
  if (colores.length) fail(`${colores.length} color(es) crudo(s) en el cromo: ` + colores.slice(0, 3).join(" · "));
  else ok("sin color crudo fuera de swatches y miniaturas");

  // Huecos de la escala: NO fallan. Son la lista de lo que la escala todavía no cubre.
  const tot = [...huerfanos.values()].reduce((a, b) => a + b, 0);
  if (tot) warn(`${tot} valor(es) sin token posible — hueco de la escala, no deuda: ` +
    [...huerfanos.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([v, n]) => `${v}×${n}`).join(" · "));
}


/* ─────────────────────────────────────────────────────────────────────────────
   [14] el interlineado del componente sale de su tamaño

   La escala de variables.css está PAREADA: --font-size-{rol} trae su
   --line-height-{rol}. Escribir el interlineado a mano al lado de un tamaño
   tokenizado rompe el par en silencio — el día que la escala se mueve, el
   tamaño la sigue y el número no. Y como no falla nada, nadie se entera.

   Antes de que esto existiera, nueve componentes escribían la bajada con cinco
   tamaños y seis interlineados distintos (1.45, 1.5, 1.55, 1.6) para el mismo
   subcomponente. No era una decisión: era que nadie la tenía que tomar.

   Falla cuando un componente escribe un line-height crudo. Apartarse del par
   sigue siendo legítimo — pero se hace con un token que diga por qué
   (--line-height-control / -prose / -title / -none, GOVERNANCE.md §8.3), no con
   un número suelto.
   ──────────────────────────────────────────────────────────────────────────── */
console.log("\n[14] el interlineado del componente sale de su tamaño");
{
  const dirC = path.join(ROOT, "css/components");
  const crudos = [];
  for (const f of fs.readdirSync(dirC).filter(x => x.endsWith(".css"))) {
    const src = fs.readFileSync(path.join(dirC, f), "utf8")
                  .replace(/\/\*[\s\S]*?\*\//g, c => c.replace(/[^\n]/g, " "));  // los comentarios no son CSS (se blanquean, no se borran: el nro de línea tiene que seguir sirviendo)
    src.split("\n").forEach((line, i) => {
      for (const m of line.matchAll(/(?:^|[;{]|\s)line-height\s*:\s*([^;}]+)/g)) {
        const v = m[1].trim();
        if (v.startsWith("var(") || v === "inherit" || v === "normal") continue;
        crudos.push(`${f}:${i + 1} { line-height: ${v} }`);
      }
    });
  }
  if (crudos.length)
    fail(`${crudos.length} interlineado(s) a mano en css/components — usá el par del tamaño, ` +
         `o el token de la excepción (GOVERNANCE.md §8.3): ` +
         crudos.slice(0, 6).join(" · ") + (crudos.length > 6 ? ` …y ${crudos.length - 6} más` : ""));
  else ok("ningún line-height crudo: todos salen de un token");

  /* Y el tamaño, mismo criterio que [13] en el cromo del sitio: falla solo si el
     token exacto YA existe. Lo que no tiene token no es deuda del componente, es
     un hueco de la escala — y se cuenta acá para que se vea, porque el punto
     ciego de esta capa era justamente que nadie la medía. */
  const conTok = [], huecos = new Map(), declarados = [];
  // SOLO el bloque :root. El archivo tiene además un bloque nativo con los mismos
  // nombres y otros valores; leerlo entero devuelve pares inventados (16px "es"
  // body-md). Ya me pasó: la escala se lee donde la escala vive.
  const varsSrc = fs.readFileSync(path.join(ROOT, "css/variables.css"), "utf8");
  const rootBlk = varsSrc.slice(varsSrc.indexOf(":root"), varsSrc.indexOf("\n}", varsSrc.indexOf(":root")));
  const escala = new Map();
  for (const m of rootBlk.matchAll(/(--font-size-[\w-]+):\s*([^;]+);/g)) {
    const v = m[2].trim();
    escala.set(v, [...(escala.get(v) || []), m[1]]);
  }
  for (const f of fs.readdirSync(dirC).filter(x => x.endsWith(".css"))) {
    const crudo = fs.readFileSync(path.join(dirC, f), "utf8");
    const linesRaw = crudo.split("\n");                       // con comentarios: ahi vive el ds-allow
    const src = crudo.replace(/\/\*[\s\S]*?\*\//g, c => c.replace(/[^\n]/g, " "));
    src.split("\n").forEach((line, i) => {
      // Excepcion declarada en la propia linea, con motivo, igual que el ds-allow de
      // check-output: `font-size: 48px; /* ds-allow: es la caja del glifo, no tipografia */`.
      // Existe porque quedan dos font-size que NO son texto —los iconos de
      // empty-state y placeholder, que conservan el tamano de glifo por
      // compatibilidad— y dejarlos como warning permanente entrena a ignorar los
      // warnings, que es peor que no tenerlos.
      const exc = /ds-allow\s*:\s*(.{10,})/.exec(linesRaw[i] ?? "");
      for (const m of line.matchAll(/(?:^|[;{]|\s)font-size\s*:\s*([^;}]+)/g)) {
        const v = m[1].trim();
        if (v.startsWith("var(") || !/^[\d.]+px$/.test(v)) continue;
        if (exc) { declarados.push(`${f}:${i + 1} { ${v} } — ${exc[1].replace(/\*\/.*$/, "").trim()}`); continue; }
        escala.has(v) ? conTok.push(`${f}:${i + 1} { ${v} } → ${escala.get(v).map(t => `var(${t})`).join(" | ")}`)
                      : huecos.set(v, (huecos.get(v) || 0) + 1);
      }
    });
  }
  // Acá AVISA, no falla, y es a propósito. Un px puede ser dos roles (11px es
  // --font-size-mono-sm Y nada más, pero el label de un botón no es mono; 15px
  // es --font-size-heading-xs Y el escalón lg del botón, que no es un heading).
  // Sustituir por valor es el error que este repo ya cometió dos veces: computa
  // igual, miente de rol y se rompe el día que la escala se mueve. La máquina
  // encuentra el valor; el rol lo elige una persona.
  if (conTok.length)
    warn(`${conTok.length} font-size a mano en css/components con token del mismo valor — ` +
         `revisar el ROL antes de sustituir: ` + conTok.join(" · "));
  else ok("ningún font-size a mano con token del mismo valor");
  const th = [...huecos.values()].reduce((a, b) => a + b, 0);
  if (th) warn(`${th} tamaño(s) sin token posible en css/components — hueco de la escala: ` +
    [...huecos.entries()].sort((a, b) => b[1] - a[1]).map(([v, n]) => `${v}×${n}`).join(" · "));
  for (const d of declarados) console.log(`  · excepción declarada — ${d}`);
}


/* ─────────────────────────────────────────────────────────────────────────────
   [15] los pares semanticos del sistema pasan AA

   Cada familia declara --color-X y --color-on-X: el fondo y lo que va ENCIMA.
   Que ese par contraste es la promesa mas basica que hace un design system, y
   hasta hoy no la verificaba nadie. Se verificaba a mano, de a un token, cuando
   alguien se daba cuenta: asi aparecio --ds-text-3 fallando AA en los dos temas
   y en 169 usos. Un par mal no se ve raro — se ve tenue, y se acepta.

   Se resuelven las cadenas de var() hasta el primitivo y se calcula el ratio
   WCAG en los DOS temas, porque un par puede pasar en claro y fallar en oscuro.

   Exento `disabled`, y solo ese: WCAG 1.4.3 exceptua explicitamente los
   controles inactivos. Cualquier otra exencion hay que discutirla, no agregarla.
   ──────────────────────────────────────────────────────────────────────────── */
console.log("\n[15] los pares semánticos pasan AA");
{
  const EXENTOS = new Set(["disabled"]);   // WCAG 1.4.3: componentes inactivos

  /* Pendiente de decision de marca, no de codigo (sep 2026). `success` y `error`
     son los tonos de señal —el verde y el rojo de la marca— y el par solo se
     renderiza en DOS lugares: .btn-primary.btn-success y .btn-primary.btn-danger.
     Todo el resto del sistema usa los pares -container, que si pasan AA.
     Hay dos salidas y la eleccion es de diseño, no de regex:
       (a) el relleno se vuelve el tono profundo que ya existe en la rampa
           —success-900 #006D2C da 6.51:1 con blanco, error-900 #BF0B29 da 6.37:1—
           y el blanco se queda, que es la convencion para un boton de peligro;
       (b) el relleno se queda y el texto se vuelve oscuro, que es exactamente lo
           que `warning` ya hace hoy (neutral-900 sobre #FFB249, 10.91:1): daria
           8.2:1 en el verde y 5.46:1 en el rojo.
     Avisa en vez de fallar para que un par NUEVO que falle se distinga de estos
     dos, igual que hace [13] con los colores crudos. Cuando se decida, se saca
     esta lista y vuelven a fallar como cualquier otro. */
  const DECISION_PENDIENTE = new Set(["success", "error"]);
  const raw = read("css/variables.css").replace(/\/\*[\s\S]*?\*\//g, "");
  const bloque = (marca) => {
    const i = raw.indexOf(marca); if (i < 0) return "";
    const o = raw.indexOf("{", i); let d = 0, j = o;
    for (; j < raw.length; j++) { if (raw[j] === "{") d++; else if (raw[j] === "}") { d--; if (!d) break; } }
    return raw.slice(o + 1, j);
  };
  const leer = (blk, base) => {
    const m = base ? { ...base } : {};
    for (const x of blk.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) m[x[1]] = x[2].trim();
    return m;
  };
  const claro = leer(bloque(":root"));
  const oscuro = leer(bloque('[data-theme="dark"]'), claro);
  const resolver = (map, v, d = 0) => {
    if (d > 12 || v == null) return null;
    v = v.trim();
    const m = /^var\(\s*(--[\w-]+)\s*(?:,([^)]*))?\)$/.exec(v);
    if (m) return map[m[1]] !== undefined ? resolver(map, map[m[1]], d + 1)
                                          : (m[2] ? resolver(map, m[2], d + 1) : null);
    return /^#[0-9a-fA-F]{3,8}$/.test(v) ? v : null;
  };
  const rgb = (h) => { h = h.replace("#", ""); if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => { const [x, y] = [lum(rgb(a)), lum(rgb(b))].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05); };

  const familias = [...new Set(Object.keys(claro)
    .filter((k) => /^--color-on-[\w-]+$/.test(k))
    .map((k) => k.replace("--color-on-", "")))];

  const bajos = [], pendientes = [], sinResolver = [];
  let mirados = 0;
  for (const f of familias) {
    if (EXENTOS.has(f)) continue;
    if (!(`--color-${f}` in claro)) continue;
    for (const [tema, map] of [["claro", claro], ["oscuro", oscuro]]) {
      const fg = resolver(map, map[`--color-on-${f}`]);
      const bg = resolver(map, map[`--color-${f}`]);
      if (!fg || !bg) { sinResolver.push(`${f} (${tema})`); continue; }
      mirados++;
      const r = ratio(fg, bg);
      if (r >= 4.5) continue;
      const linea = `${f} ${tema} ${fg} sobre ${bg} = ${r.toFixed(2)}:1`;
      (DECISION_PENDIENTE.has(f) ? pendientes : bajos).push(linea);
    }
  }
  if (bajos.length)
    fail(`${bajos.length} par(es) por debajo de AA (4.5:1) — un par que no contrasta no se ve roto, se ve tenue: `
         + bajos.join(" · "));
  else ok(`los ${mirados} pares semánticos contrastan ≥ 4.5:1 en los dos temas${pendientes.length ? ` (${pendientes.length} con decisión de marca pendiente, abajo)` : ""}`);
  if (pendientes.length)
    warn(`${pendientes.length} par(es) esperando una decisión de MARCA, no de código — solo se renderizan en `
         + `.btn-primary.btn-success y .btn-primary.btn-danger; ver el comentario del chequeo: ` + pendientes.join(" · "));
  if (sinResolver.length)
    warn(`${sinResolver.length} par(es) no se pudieron resolver hasta un hex (¿color-mix?): ` + sinResolver.join(" · "));
}


/* ─────────────────────────────────────────────────────────────────────────────
   [16] el bloque [data-theme="light"] es un espejo de :root

   Existe para poder meter un demo en claro adentro de una pagina oscura, y para
   eso reescribe a mano 54 tokens de la capa semantica. Es una copia, con todo lo
   que eso implica: cuando :root cambia, la copia no falla — miente.

   Ya paso. Alguien descubrio que --color-on-warning-container daba 3.50:1, lo
   movio al -925 en :root y dejo la nota explicando por que; el espejo se quedo en
   el -900. Meses despues un badge de "En revision" renderizaba a 3.50:1 sin que
   nada lo dijera, y aparecio midiendo el render, no leyendo el CSS.

   Compara VALOR RESUELTO, no texto: el espejo escribe literales a proposito
   (el shell de la doc reasigna primitivos), asi que comparar la expresion daria
   54 diferencias falsas.
   ──────────────────────────────────────────────────────────────────────────── */
console.log("\n[16] el bloque [data-theme=\"light\"] no se quedó atrás de :root");
{
  const raw = read("css/variables.css").replace(/\/\*[\s\S]*?\*\//g, "");
  const bloque = (marca) => {
    const i = raw.indexOf(marca); if (i < 0) return "";
    const o = raw.indexOf("{", i); let d = 0, j = o;
    for (; j < raw.length; j++) { if (raw[j] === "{") d++; else if (raw[j] === "}") { d--; if (!d) break; } }
    return raw.slice(o + 1, j);
  };
  const leer = (blk) => {
    const m = {};
    for (const x of blk.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) m[x[1]] = x[2].trim();
    return m;
  };
  const raiz = leer(bloque(":root"));
  const espejoPropio = leer(bloque('[data-theme="light"]'));
  const espejo = { ...raiz, ...espejoPropio };
  const resolver = (map, v, d = 0) => {
    if (d > 12 || v == null) return null;
    v = v.trim();
    const m = /^var\(\s*(--[\w-]+)\s*(?:,([^)]*))?\)/.exec(v);
    if (m) return map[m[1]] !== undefined ? resolver(map, map[m[1]], d + 1)
                                          : (m[2] ? resolver(map, m[2], d + 1) : null);
    return v;
  };
  const norm = (x) => String(x).toLowerCase().replace(/\s/g, "");
  const distintos = [], huerfanos = [];
  let iguales = 0;
  for (const k of Object.keys(espejoPropio)) {
    if (!(k in raiz)) { huerfanos.push(k); continue; }
    const a = resolver(raiz, raiz[k]), b = resolver(espejo, espejoPropio[k]);
    if (a == null || b == null) continue;
    if (norm(a) !== norm(b)) distintos.push(`${k}: :root=${a} · espejo=${b}`);
    else iguales++;
  }
  if (distintos.length)
    fail(`${distintos.length} token(s) donde el espejo se quedó atrás de :root — una copia que no falla, miente: `
         + distintos.join(" · "));
  else ok(`los ${iguales} tokens del espejo resuelven igual que en :root`);
  if (huerfanos.length)
    warn(`${huerfanos.length} token(s) solo en el espejo, sin equivalente en :root: ` + huerfanos.join(" · "));
}


console.log(`\n${fails ? "✗" : "✓"} validate-ds: ${fails} failure(s), ${warns} warning(s)\n`);
process.exit(fails ? 1 : 0);
