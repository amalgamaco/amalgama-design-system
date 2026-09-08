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
  { id: "A8", sev: "ALTA", desc: "fuga de utilidades de otro framework", re: /\b(text|bg|border)-(zinc|slate|gray|neutral|indigo|blue|red|green)-\d{2,3}\b/g },
  { id: "A10", sev: "MEDIA", desc: "border-radius inline en vez del modificador de tamaño", re: /style="[^"]*border-radius/g },
  { id: "B3", sev: "ALTA", desc: "input genérico con placeholder de búsqueda", re: /<input[^>]*placeholder=["'][^"']*[Bb]usc/g },
  { id: "F3", sev: "ALTA", desc: "búsqueda sin role=\"search\"", custom: (src) => (/[Bb]uscar/.test(src) && !/role=["']search["']/.test(src) ? [[1, "hay búsqueda y ningún role=\"search\""]] : []) },
  { id: "G1", sev: "ALTA", desc: "cubic-bezier o ms crudos en vez de tokens", re: /cubic-bezier\(|(?:transition|animation)[^;{]*?\b\d+m?s\b/g },
  { id: "G3", sev: "BLOQ", desc: "prefers-reduced-motion anulado", re: /prefers-reduced-motion[^}]*\{[^}]*!important/g },
  { id: "H4", sev: "ALTA", desc: "emoji usado como ícono", re: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu },
];

function lineOf(src, index) {
  return src.slice(0, index).split("\n").length;
}

const findings = [];

for (const file of files) {
  if (!fs.existsSync(file)) { console.warn(`! no existe: ${file}`); continue; }
  const src = fs.readFileSync(file, "utf8");
  const lines = src.split("\n");

  for (const rule of RULES) {
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

  // C1 — más de un btn-primary. Heurística: contamos por archivo y avisamos si hay >1.
  const primaries = [...src.matchAll(/class="[^"]*\bbtn-primary\b/g)];
  if (primaries.length > 1) {
    findings.push({
      id: "C1", sev: "BLOQ", desc: "más de un btn-primary — verificá si están en el mismo contexto",
      file, line: lineOf(src, primaries[1].index), evidence: `${primaries.length} ocurrencias`,
    });
  }

  // F2 — icon-btn sin aria-label, mirando el tag completo.
  for (const m of src.matchAll(/<[a-z]+[^>]*\bicon-btn\b[^>]*>/g)) {
    if (!/aria-label\s*=/.test(m[0])) {
      findings.push({ id: "F2", sev: "BLOQ", desc: "icon-btn sin aria-label", file, line: lineOf(src, m.index), evidence: m[0].slice(0, 60) });
    }
  }

  // B1 — clases fuera de la API pública.
  if (publicClasses) {
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
  console.log(JSON.stringify({ files, summary, findings }, null, 2));
} else {
  const order = { BLOQ: 0, ALTA: 1, MEDIA: 2, BAJA: 3 };
  for (const f of findings.sort((a, b) => order[a.sev] - order[b.sev])) {
    console.log(`[${f.id} · ${f.sev}] ${path.basename(f.file)}${f.line ? `:${f.line}` : ""} — ${f.desc}\n    ${f.evidence}`);
  }
  console.log(`\nBLOQUEANTES ${summary.BLOQ} · ALTAS ${summary.ALTA} · MEDIAS ${summary.MEDIA} · BAJAS ${summary.BAJA} · total ${summary.total}`);
  console.log("Lo que no se puede chequear acá (jerarquía, layout, estados, copy, contraste) lo juzga embassy-review.");
}

process.exit(summary.BLOQ > 0 ? 1 : 0);
