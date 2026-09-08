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
 *   7. inline-hex     hex in index.html inline styles (swatch tables excluded) — WARN
 */
import fs from "node:fs";
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

console.log(`\n${fails ? "✗" : "✓"} validate-ds: ${fails} failure(s), ${warns} warning(s)\n`);
process.exit(fails ? 1 : 0);
