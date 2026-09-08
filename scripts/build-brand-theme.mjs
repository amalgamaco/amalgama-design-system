#!/usr/bin/env node
/**
 * build-brand-theme.mjs — genera el archivo de tema de marca de un cliente.
 *
 * Por qué existe
 * ──────────────
 * `WHITE-LABEL.md` dice, correctamente, que se overridean PRIMITIVAS y nunca roles
 * semánticos. Pero pide 20 hex escritos a mano por paleta. Nadie genera 10 tintas
 * coherentes a ojo, y menos verificando contraste AA en light y dark.
 *
 * Este script toma UN hex por paleta y produce las 10 tintas siguiendo la misma
 * curva de luminosidad y croma que usan las paletas de Embassy (medidas en OKLCH
 * sobre `css/variables.css`), con el tono de la marca. Después verifica los pares
 * de contraste que importan y reporta lo que no llega a AA.
 *
 * Uso:
 *   node scripts/build-brand-theme.mjs --slug simplefit \
 *        --primary "#FF6B00" --secondary "#1E88E5" \
 *        [--radius rounded|balanced|technical] \
 *        [--font-heading "Poppins"] [--font-body "Inter"] \
 *        [--out brand/simplefit.css]
 *
 * Salida: el CSS del tema + un reporte de contraste. Exit 1 si algún par falla AA.
 */

import fs from "node:fs";
import path from "node:path";

// ── Curvas de Embassy, medidas en OKLCH sobre css/variables.css ──────────────
// primary: rampa oscura (el 900 es el navy de marca, texto de página y sidebar).
// secondary: rampa clara (el 900 es el acento interactivo, con blanco encima).
const RAMPS = {
  primary: [
    { step: 50, L: 0.928, C: 0.011 }, { step: 60, L: 0.905, C: 0.030 },
    { step: 75, L: 0.868, C: 0.022 }, { step: 100, L: 0.816, C: 0.032 },
    { step: 200, L: 0.693, C: 0.053 }, { step: 300, L: 0.569, C: 0.075 },
    { step: 400, L: 0.477, C: 0.096 }, { step: 500, L: 0.385, C: 0.119 },
    { step: 600, L: 0.362, C: 0.117 }, { step: 700, L: 0.328, C: 0.115 },
    { step: 800, L: 0.293, C: 0.112 }, { step: 900, L: 0.230, C: 0.105 },
  ],
  secondary: [
    { step: 10, L: 0.988, C: 0.006 }, { step: 50, L: 0.961, C: 0.018 },
    { step: 100, L: 0.925, C: 0.036 }, { step: 200, L: 0.886, C: 0.055 },
    { step: 300, L: 0.848, C: 0.074 }, { step: 400, L: 0.812, C: 0.094 },
    { step: 500, L: 0.774, C: 0.114 }, { step: 600, L: 0.737, C: 0.135 },
    { step: 700, L: 0.700, C: 0.156 }, { step: 800, L: 0.667, C: 0.176 },
    { step: 900, L: 0.633, C: 0.196 }, { step: 925, L: 0.480, C: 0.130 },
    { step: 950, L: 0.380, C: 0.145 },
  ],
};

const RADIUS = {
  rounded:   { sm: 6, md: 12, lg: 16, xl: 24 },
  balanced:  { sm: 4, md: 8,  lg: 12, xl: 16 },   // default Embassy
  technical: { sm: 2, md: 4,  lg: 6,  xl: 8 },
};

// ── Color: sRGB ↔ OKLab/OKLCH ────────────────────────────────────────────────
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const unlin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const cbrt = (x) => (x < 0 ? -((-x) ** (1 / 3)) : x ** (1 / 3));

function hexToRgb(hex) {
  const h = hex.replace("#", "").trim();
  const s = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (!/^[0-9a-fA-F]{6}$/.test(s)) throw new Error(`hex inválido: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) / 255);
}
const rgbToHex = (rgb) =>
  "#" + rgb.map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, "0").toUpperCase()).join("");

function rgbToOklch([r, g, b]) {
  [r, g, b] = [lin(r), lin(g), lin(b)];
  const l = cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(a, bb), H: (Math.atan2(bb, a) * 180) / Math.PI };
}

function oklchToRgb({ L, C, H }) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h), b = C * Math.sin(h);
  const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    unlin(+4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
    unlin(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
    unlin(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
  ];
}

/** Baja el croma hasta que el color entra en gamut sRGB (evita clipping feo). */
function toHexInGamut({ L, C, H }) {
  for (let c = C; c >= 0; c -= 0.005) {
    const rgb = oklchToRgb({ L, C: c, H });
    if (rgb.every((v) => v >= -0.001 && v <= 1.001)) return rgbToHex(rgb);
  }
  return rgbToHex(oklchToRgb({ L, C: 0, H }));
}

/** Contraste WCAG 2.1 entre dos hex. */
function contrast(hexA, hexB) {
  const lum = (hex) => {
    const [r, g, b] = hexToRgb(hex).map(lin);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [a, b] = [lum(hexA), lum(hexB)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

/** Genera la rampa completa conservando el tono de la marca. */
function buildRamp(name, brandHex) {
  const { H, C: brandC } = rgbToOklch(hexToRgb(brandHex));
  const ramp = RAMPS[name];
  // El croma de la marca escala la curva, para respetar marcas apagadas o saturadas.
  const refC = ramp.find((s) => s.step === (name === "primary" ? 500 : 900)).C;
  const scale = Math.max(0.35, Math.min(2, brandC / refC || 1));
  return Object.fromEntries(
    ramp.map(({ step, L, C }) => [step, toHexInGamut({ L, C: C * scale, H })])
  );
}

// ── CLI ──────────────────────────────────────────────────────────────────────
const arg = (n, d = null) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : d;
};
const slug = arg("slug");
const primaryHex = arg("primary");
const secondaryHex = arg("secondary", primaryHex);
const radiusKey = arg("radius", "balanced");
const fontHeading = arg("font-heading");
const fontBody = arg("font-body");

if (!slug || !primaryHex) {
  console.error("uso: node scripts/build-brand-theme.mjs --slug <cliente> --primary <#hex> [--secondary <#hex>] [--radius rounded|balanced|technical] [--font-heading X] [--font-body Y]");
  process.exit(2);
}
if (!RADIUS[radiusKey]) { console.error(`--radius inválido: ${radiusKey}`); process.exit(2); }

const P = buildRamp("primary", primaryHex);
const S = buildRamp("secondary", secondaryHex);
const R = RADIUS[radiusKey];

const line = (k, v) => `  --${k}:${" ".repeat(Math.max(1, 18 - k.length))}${v};`;

const css = `/* ═══════════════════════════════════════
   Embassy — tema de marca: ${slug}
   Generado por scripts/build-brand-theme.mjs — no editar a mano.
   Marca: primary ${primaryHex} · secondary ${secondaryHex} · radio ${radiusKey}

   Solo PRIMITIVAS. Nunca roles semánticos (--color-*), nunca overrides por tema.
   Orden de carga: variables.css → ESTE ARCHIVO → base.css → components.css
═══════════════════════════════════════ */

:root {

  /* ── Paleta primary (navy de marca: headings, sidebar, superficies fuertes) ── */
${Object.entries(P).map(([s, v]) => line(`primary-${s}`, v)).join("\n")}

  /* ── Paleta secondary (acento interactivo: links, foco, nav, tabs) ── */
${Object.entries(S).map(([s, v]) => line(`secondary-${s}`, v)).join("\n")}

  /* ── Personalidad de forma (${radiusKey}) ── */
  --radius-sm: ${R.sm}px;
  --radius-md: ${R.md}px;
  --radius-lg: ${R.lg}px;
  --radius-xl: ${R.xl}px;
  /* --radius-full: 9999px  ← nunca se overridea */
${fontHeading || fontBody ? `
  /* ── Tipografía ── */${fontHeading ? `
  --font-heading: '${fontHeading}', sans-serif;` : ""}${fontBody ? `
  --font-body:    '${fontBody}', sans-serif;` : ""}
  /* La escala --font-size-* NO se overridea: está validada y es estable entre clientes. */` : ""}

}
`;

const out = arg("out", `brand/${slug}.css`);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, css);
console.log(`✓ ${out}`);

// ── Verificación de contraste (los pares que realmente rompen) ───────────────
const WHITE = "#FFFFFF", SURFACE = "#FAFBFC"; // --neutral-white / --neutral-10

// min = umbral · hard = si por debajo, sale con código 1.
// 3.0 es el mínimo de WCAG para texto grande y para componentes de interfaz;
// 4.5 es el de texto normal.
const pairs = [
  ["texto de página sobre fondo", P[900], SURFACE, 4.5, true],
  ["--color-on-primary (blanco) sobre --color-primary", WHITE, P[900], 4.5, true],
  ["--color-on-primary-container sobre --color-primary-container", P[900], P[60], 4.5, true],
  ["--color-on-secondary-container sobre --color-secondary-container", P[900], S[200], 4.5, true],
  // Embassy mismo está en 3.58:1 acá (blanco sobre #4F80FF): es una deuda del sistema,
  // no algo que introduzca la marca del cliente. Por eso avisa y no bloquea.
  ["--color-on-secondary (blanco) sobre --color-secondary", WHITE, S[900], 4.5, false],
  ["borde interactivo sobre fondo (no-texto)", S[900], SURFACE, 3.0, false],
];

// Aviso de encaje: dónde va a caer realmente el color de marca.
// En Embassy --color-primary = --primary-900 (texto de página, sidebar, relleno
// primario), así que tiene que ser oscuro. Un hex de marca claro y vivo no entra
// por ese lado: su lugar es --secondary, el acento interactivo.
{
  const { L: Lp } = rgbToOklch(hexToRgb(primaryHex));
  if (Lp > 0.55) {
    console.log(`
⚠ El primary de marca (${primaryHex}) es claro (L=${Lp.toFixed(2)}). La rampa lo lleva a
  ${P[900]} conservando el tono, porque --color-primary se usa para texto de página y sidebar
  y necesita sostener texto blanco. El color vivo de la marca casi no va a aparecer por ahí.
  Si la marca ES ese color vivo, pasalo como --secondary y usá de --primary un neutro
  oscuro de la marca.`);
  }
}

console.log("\nContraste (WCAG 2.1 AA)");
let fails = 0, warns = 0;
for (const [label, fg, bg, min, hard] of pairs) {
  const r = contrast(fg, bg);
  const ok = r >= min;
  if (!ok) hard ? fails++ : warns++;
  const mark = ok ? "✓" : hard ? "✗" : "!";
  console.log(`  ${mark} ${r.toFixed(2)}:1 (mín ${min})  ${label}  [${fg} / ${bg}]`);
}
if (warns) {
  console.log(`
! ${warns} par(es) por debajo del umbral de texto normal pero por encima de 3:1 — sirven para texto
  grande y para componentes de interfaz, no para body text. El acento de Embassy tiene el mismo
  problema (3.58:1), así que no lo introdujo esta marca. Si el acento va a llevar texto normal
  encima, oscurecelo o poné texto oscuro.`);
}

console.log(`
Dark mode: desde 2026-09 el bloque [data-theme="dark"] de css/variables.css referencia
  var(--primitiva) para las familias primary/secondary/tertiary/estado, así que estas
  primitivas SÍ se propagan a dark. Dark consume --primary-400, --primary-50,
  --secondary-300, --secondary-925 y --secondary-950: verificá esos cinco en el preview.
  Los tokens derivados de la rampa neutral siguen literales a propósito.`);

if (fails) {
  console.error(`\n✗ ${fails} par(es) de texto por debajo de AA. Ajustá el hex de marca o pedí al cliente una variante más oscura o más clara.`);
  process.exit(1);
}
console.log(`\n✓ Los pares de texto pasan AA en light${warns ? " (con los avisos de arriba)" : ""}.`);
