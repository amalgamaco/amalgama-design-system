#!/usr/bin/env node
/**
 * build-public-api.mjs — genera PUBLIC-API.md y public-api.json desde el repo.
 *
 * Por qué existe
 * ──────────────
 * `css/components/` son 268 KB y 517 clases. Un agente que tiene que "leer el CSS
 * para citar las clases exactas" gasta el contexto entero antes de escribir la
 * primera línea, y en un artefacto sin repo directamente no puede.
 *
 * Este script publica la API ACOTADA: por componente, el nombre público, para qué
 * sirve, y solo las clases curadas en `component-rules/manifest.json` (`source.classes`),
 * completadas con las del bloque `Uso:` y los modificadores del header.
 *
 * Contrato: lo que esté acá es API pública. Lo que no, es interno y no se usa.
 *
 * Uso:  node scripts/build-public-api.mjs [--out PUBLIC-API.md]
 * Corré esto en cada release, junto a build-manifest.py.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CSS_DIR = path.join(ROOT, "css", "components");
const MANIFEST = path.join(ROOT, "component-rules", "manifest.json");

const outArgIdx = process.argv.indexOf("--out");
const OUT_MD = path.join(ROOT, outArgIdx > -1 ? process.argv[outArgIdx + 1] : "PUBLIC-API.md");
const OUT_JSON = path.join(ROOT, "public-api.json");

/** Primer bloque de comentario del archivo = el header canónico. */
function header(css) {
  const m = css.match(/^\s*\/\*([\s\S]*?)\*\//);
  return m ? m[1] : "";
}

/** Línea `Campo: valor` del header, hasta la próxima línea que abre otro campo. */
function field(head, name) {
  const re = new RegExp(`^\\s*${name}\\s*:\\s*(.+(?:\\n(?!\\s*[A-ZÁÉÍÓÚÑ][\\wáéíóúñ ]{2,20}\\s*:).*)*)`, "mi");
  const m = head.match(re);
  return m ? m[1].replace(/\s*\n\s*/g, " ").trim() : "";
}

/** El bloque `Uso:` es el markup canónico: todo lo que sigue hasta el fin del header. */
function usage(head) {
  const i = head.search(/^\s*Uso\s*:/mi);
  if (i === -1) return "";
  return head
    .slice(i)
    .replace(/^\s*Uso\s*:\s*/i, "")
    .split("\n")
    .map((l) => l.replace(/^\s{0,3}/, ""))
    .join("\n")
    .replace(/[═\s]+$/, "")
    .trim();
}

/** Clases que el consumidor realmente escribe: las del markup de ejemplo. */
function publicClasses(usageBlock, head) {
  const fromUsage = [...usageBlock.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/));
  // Modificadores declarados en prosa: `.btn-xs`, `.toolbar-filters`, etc.
  const fromHeader = [...head.matchAll(/(?:^|[\s(·,])\.([a-z][a-z0-9-]{2,40})/g)].map((m) => m[1]);
  return [...new Set([...fromUsage, ...fromHeader])].filter((c) => !c.includes("{")).sort();
}

const rules = {};
// Ojo: el id de la regla NO siempre coincide con el nombre del CSS
// (modal.css → dialog.md, toast.css → snackbar.md, spinner.css → loading.md…).
// Mapeamos por `source.css`, que es lo que el manifest declara de verdad.
const rulesByCss = {};
if (fs.existsSync(MANIFEST)) {
  for (const c of JSON.parse(fs.readFileSync(MANIFEST, "utf8")).components ?? []) {
    rules[c.id] = c;
    for (const f of [c.source?.css].flat().filter(Boolean)) {
      (rulesByCss[f] ??= []).push(c);
    }
  }
}

const components = fs
  .readdirSync(CSS_DIR)
  .filter((f) => f.endsWith(".css"))
  .sort()
  .map((f) => {
    const id = f.replace(/\.css$/, "");
    const css = fs.readFileSync(path.join(CSS_DIR, f), "utf8");
    const head = header(css);
    const use = usage(head);
    const all = [...new Set([...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/\.([a-z][a-z0-9-]{1,40})/g)].map((m) => m[1]))];
    // Un CSS puede alimentar más de una regla (sheet.css → sheet-side + sheet-bottom).
    const matches = rulesByCss[`css/components/${f}`] ?? (rules[id] ? [rules[id]] : []);
    const rule = matches[0] ?? {};
    // La lista curada del manifest gana; el markup de ejemplo solo la completa.
    const curated = [...new Set(matches.flatMap((m) => m.source?.classes ?? []))];
    const classes = curated.length
      ? [...new Set([...curated, ...publicClasses(use, head)])].sort()
      : publicClasses(use, head);
    return {
      id,
      display_name: matches.map((m) => m.display_name).join(" / ") || id,
      category: rule.category ?? "",
      status: rule.status ?? "",
      file: `css/components/${f}`,
      summary: rule.summary ?? field(head, "Cuándo usar").slice(0, 160),
      when: field(head, "Cuándo usar"),
      when_not: field(head, "Cuándo no"),
      variants: rule.variants ?? [],
      sizes: rule.sizes ?? [],
      rules_files: matches.map((m) => `component-rules/${m.id}.md`),
      usage: use,
      classes,
      internal_class_count: all.length,
    };
  });

const totalPublic = new Set(components.flatMap((c) => c.classes)).size;
const allInternal = components.reduce((n, c) => n + c.internal_class_count, 0);

const md = `# PUBLIC-API.md — API pública de clases de Embassy

> **Generado por \`node scripts/build-public-api.mjs\`. No editar a mano.**
> Fuente: \`css/components/*.css\` (bloques \`Uso:\` y headers) + \`component-rules/manifest.json\`.

## Contrato

1. **Solo los nombres listados acá son API pública.** Cualquier otro selector que exista en el
   CSS es interno y puede cambiar sin aviso.
2. **No inspecciones el CSS buscando selectores internos.** El stylesheet se carga cuando la
   página renderiza; el agente no necesita leerlo.
3. **No inventes clases nuevas.** Si nada de esta lista sirve, componé con las que hay o marcá el
   gap del DS — no improvises.
4. **Los modificadores son aditivos**: \`class="btn-primary btn-danger"\`, \`class="chip chip-selected"\`.
5. **El modificador de tamaño ya trae su \`border-radius\`.** Nunca agregues \`border-radius\` inline.

${components.length} componentes · **${totalPublic} clases públicas** de ${allInternal} selectores totales en el CSS.

## Cómo cargar el sistema

\`\`\`html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@main/css/variables.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@main/css/base.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/amalgamaco/amalgama-design-system@main/css/components.css">
<!-- app shell (sidebar + topbar) solamente: .../css/layout.css -->
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Epilogue:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
\`\`\`

Dark mode: \`<html data-theme="dark">\`. No agregues overrides por tema.

---

${components
  .map(
    (c) => `### \`${c.id}\` — ${c.display_name}${c.category ? ` · ${c.category}` : ""}

${c.summary ? `${c.summary}\n` : ""}${c.when ? `**Cuándo usar:** ${c.when}\n` : ""}${c.when_not ? `**Cuándo no:** ${c.when_not}\n` : ""}${c.variants.length ? `**Variantes:** ${c.variants.join(" · ")}\n` : ""}${c.sizes.length > 1 ? `**Tamaños:** ${c.sizes.join(" · ")}\n` : ""}
Clases públicas: ${c.classes.length ? c.classes.map((x) => `\`.${x}\``).join(" · ") : "_(sin lista curada — abrí el CSS)_"}
${c.usage ? `\n\`\`\`html\n${c.usage}\n\`\`\`\n` : ""}
Regla completa: ${c.rules_files.length ? c.rules_files.map((r) => `\`${r}\``).join(" · ") : "_(sin regla — revisar cobertura del manifest)_"} · CSS: \`${c.file}\``
  )
  .join("\n\n---\n\n")}
`;

fs.writeFileSync(OUT_MD, md);
fs.writeFileSync(OUT_JSON, JSON.stringify({ generated_from: "css/components", components }, null, 2));
console.log(`✓ ${path.relative(ROOT, OUT_MD)} — ${components.length} componentes, ${totalPublic} clases públicas`);
console.log(`✓ ${path.relative(ROOT, OUT_JSON)}`);

// Cobertura: qué CSS no tiene ninguna regla operativa.
// validate-ds.mjs [5] no chequea esto — solo compara manifest.count contra los .md.
const sinRegla = components.filter((c) => !c.rules_files.length).map((c) => c.id);
if (sinRegla.length) {
  console.warn(`! ${sinRegla.length} componente(s) CSS sin component-rules: ${sinRegla.join(", ")}`);
  console.warn("  Un agente no puede elegirlos por propósito. Autorá la regla o documentá por qué no la lleva.");
}
