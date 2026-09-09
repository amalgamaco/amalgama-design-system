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

// Los tres ejes que se agregaron en sep-2026 para que dos productos white-label
// no se distingan solo por el color. Cada uno tiene presets cerrados a propósito:
// un valor libre por cliente es como el sistema se fractura.

// Densidad — cuánto respira. Es el eje que más cambia la sensación, y funciona
// porque los componentes consumen --space-* (291 valores tokenizados en sep-2026).
// Los medios pasos escalan con el resto: si no, el interior de los componentes
// quedaría inmune y la densidad no se sentiría donde más importa.
const DENSITY = {
  compacta:  { "0-5": 2, "1": 3,  "1-5": 5,  "2": 6,  "2-5": 8,  "3": 10, "3-5": 12, "4": 12, "5": 16, "6": 20, "8": 24, "10": 32, "12": 40, "16": 48, "20": 64 },
  estandar:  { "0-5": 2, "1": 4,  "1-5": 6,  "2": 8,  "2-5": 10, "3": 12, "3-5": 14, "4": 16, "5": 20, "6": 24, "8": 32, "10": 40, "12": 48, "16": 64, "20": 80 },
  amplia:    { "0-5": 2, "1": 4,  "1-5": 8,  "2": 10, "2-5": 12, "3": 16, "3-5": 18, "4": 20, "5": 24, "6": 32, "8": 40, "10": 52, "12": 64, "16": 80, "20": 96 },
};

// Elevación — cómo se separan las superficies. Sombra difusa se lee cálido y de
// producto; borde nítido con sombra mínima se lee técnico y sostiene mejor la
// densidad alta. No se mezclan: elegir uno es la decisión.
const ELEVATION = {
  sombra:  { sm: "0 1px 3px rgba(28,36,56,.06)",  md: "0 4px 16px rgba(28,36,56,.08)", lg: "0 8px 32px rgba(28,36,56,.12)" },
  plana:   { sm: "0 0 0 1px rgba(28,36,56,.08)",  md: "0 1px 4px rgba(28,36,56,.06)",  lg: "0 2px 8px rgba(28,36,56,.08)"  },
};

// Movimiento — el ritmo. Sobrio no llama la atención sobre sí mismo y es lo que
// quiere una herramienta de trabajo; expresivo tiene un rebote leve al entrar y
// es lo que espera un producto de público. Las curvas ya existen en el sistema.
const MOTION = {
  sobrio:    { fast: 120, normal: 200, medium: 300, ease: "cubic-bezier(.4,0,.2,1)",      enter: "cubic-bezier(0,0,0,1)" },
  expresivo: { fast: 160, normal: 260, medium: 380, ease: "cubic-bezier(.34,1.56,.64,1)", enter: "cubic-bezier(.175,.885,.32,1.4)" },
};

// Trazo de los íconos. Liviano se lee elegante, robusto se lee utilitario.
const ICON_STROKE = { liviano: 1.5, estandar: 2, robusto: 2.5 };

// Superficies de dark — el eje que faltaba, y el que más se nota.
//
// El "gris neutro" de Embassy no es neutro: medido en OKLCH da H≈270, o sea que
// es un negro AZUL, tan de marca como el navy. Como en [data-theme="dark"] esos
// valores están escritos literales, dos productos white-label salían idénticos en
// oscuro: el 90% de los píxeles seguía siendo el azul de Embassy y la marca del
// cliente solo aparecía en los acentos (nav activo, links).
//
// Acá rehueamos esas mismas superficies al tono de la marca, conservando la MISMA
// L y la MISMA C. Cambia de quién es el tinte, no cuánto tinte hay: el contraste
// de los tres tokens de texto sobre superficie se mueve menos de 0.2:1 (verificado
// abajo, y bloquea si algo cae de AA).
//
// Los tokens de texto (--text-*, --color-on-surface*) NO se tiñen: son grises y
// tienen que seguir leyéndose igual sobre cualquier marca.
const DARK_SURFACES = {
  "color-surface":                   "#13161F",
  "color-surface-dim":               "#0A0C12",
  "color-surface-bright":            "#1C202C",
  "color-surface-container-lowest":  "#0A0C12",
  "color-surface-container-low":     "#13161F",
  "color-surface-container":         "#1C202C",
  "color-surface-container-high":    "#282C39",
  "color-surface-container-highest": "#353A4A",
  "color-surface-variant":           "#282C39",
  "color-outline":                   "#747989",
  "color-outline-variant":           "#474D61",
  "color-disabled":                  "#282C39",
  "color-inverse-on-surface":        "#13161F",
};

// El orden de emisión: la escala se lee de menor a mayor, con los medios pasos
// intercalados donde corresponden y no apelotonados al final.
const SPACE_ORDER = ["0-5", "1", "1-5", "2", "2-5", "3", "3-5", "4", "5", "6", "8", "10", "12", "16", "20"];

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

// Mismo L, mismo C, otro H: la superficie neutra de Embassy pasada al tono de la marca.
const reHue = (hex, H) => {
  const { L, C } = rgbToOklch(hexToRgb(hex));
  return toHexInGamut({ L, C, H });
};

// ── CLI ──────────────────────────────────────────────────────────────────────
const arg = (n, d = null) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : d;
};
const slug = arg("slug");
const primaryHex = arg("primary");
const secondaryHex = arg("secondary", primaryHex);
const radiusKey = arg("radius", "balanced");
const densityKey = arg("density", "estandar");
const elevationKey = arg("elevation", "sombra");
const motionKey = arg("motion", "sobrio");
const strokeKey = arg("icon-stroke", "estandar");
const fontHeading = arg("font-heading");
const fontBody = arg("font-body");

if (!slug || !primaryHex) {
  console.error(`uso: node scripts/build-brand-theme.mjs --slug <cliente> --primary <#hex>
       [--secondary <#hex>]
       [--radius      rounded | balanced | technical]
       [--density     compacta | estandar | amplia]
       [--elevation   sombra | plana]
       [--motion      sobrio | expresivo]
       [--icon-stroke liviano | estandar | robusto]
       [--font-heading X] [--font-body Y]`);
  process.exit(2);
}
const bad = (n, k, o) => { if (!o[k]) { console.error(`--${n} inválido: ${k} — opciones: ${Object.keys(o).join(" | ")}`); process.exit(2); } };
bad("radius", radiusKey, RADIUS);
bad("density", densityKey, DENSITY);
bad("elevation", elevationKey, ELEVATION);
bad("motion", motionKey, MOTION);
bad("icon-stroke", strokeKey, ICON_STROKE);

const P = buildRamp("primary", primaryHex);
const S = buildRamp("secondary", secondaryHex);

// El acento tiene que sostener texto oscuro a 4.5:1 — --color-on-secondary es primary-900
// desde sep-2026 (blanco encima de un acento vivo no llega a AA en ninguna marca). Algunos
// tonos, sobre todo los rojos, quedan a centésimas: un rosa fuerte dio 4.47:1. En vez de
// rechazar la marca por 0.03, bajamos la luminosidad del 900 en pasos chicos hasta que
// pase. Es la misma clase de ajuste que ya hace la rampa, que tampoco usa el hex tal cual.
let accentAdjust = null;
{
  const { H, C } = rgbToOklch(hexToRgb(S[900]));
  let L = rgbToOklch(hexToRgb(S[900])).L;
  const L0 = L;
  // Más claro, no más oscuro: el texto encima es oscuro, así que subir la luminosidad del
  // acento es lo que abre el contraste. (Lo escribí al revés la primera vez y el chequeo lo
  // agarró: bajando la L el par empeoraba hasta 2.09:1.)
  while (contrast(P[900], S[900]) < 4.5 && L < 0.80) {
    L += 0.005;
    S[900] = toHexInGamut({ L, C, H });
  }
  if (L !== L0) accentAdjust = { from: L0, to: L, hex: S[900] };
}
const R = RADIUS[radiusKey];
const D = DENSITY[densityKey];
const E = ELEVATION[elevationKey];
const M = MOTION[motionKey];
const K = ICON_STROKE[strokeKey];

// El tono de la marca, tomado del primary: es el que tiñe las superficies de dark.
const brandHue = rgbToOklch(hexToRgb(primaryHex)).H;
const DARK = Object.fromEntries(
  Object.entries(DARK_SURFACES).map(([k, v]) => [k, [reHue(v, brandHue), v]])
);

const line = (k, v) => `  --${k}:${" ".repeat(Math.max(1, 18 - k.length))}${v};`;

const css = `/* ═══════════════════════════════════════
   Embassy — tema de marca: ${slug}
   Generado por scripts/build-brand-theme.mjs — no editar a mano.
   Marca: primary ${primaryHex} · secondary ${secondaryHex} · radio ${radiusKey}

   Primitivas en :root — nunca roles semánticos ahí.
   La única excepción es el bloque [data-theme="dark"] del final: las superficies
   oscuras están escritas literales en variables.css y no llegan por primitiva, así
   que se rehuean acá al tono de la marca. Sin eso, todos los productos white-label
   se ven iguales en oscuro.
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

  /* ── Densidad (${densityKey}) ── */
${SPACE_ORDER.map((k) => `  --space-${k}:${" ".repeat(Math.max(1, 8 - k.length))}${String(D[k]).padStart(2)}px;`).join("\n")}

  /* ── Elevación (${elevationKey}) ── */
  --shadow-sm: ${E.sm};
  --shadow-md: ${E.md};
  --shadow-lg: ${E.lg};

  /* ── Movimiento (${motionKey}) ── */
  --duration-fast:   ${M.fast}ms;
  --duration-normal: ${M.normal}ms;
  --duration-medium: ${M.medium}ms;
  --ease-default:    ${M.ease};
  --ease-enter:      ${M.enter};

  /* ── Íconos (${strokeKey}) ── */
  --icon-stroke: ${K};
${fontHeading || fontBody ? `
  /* ── Tipografía ── */${fontHeading ? `
  --font-heading: '${fontHeading}', sans-serif;` : ""}${fontBody ? `
  --font-body:    '${fontBody}', sans-serif;` : ""}
  /* La escala --font-size-* NO se overridea: está validada y es estable entre clientes. */` : ""}

}

/* ── Superficies en modo oscuro ──────────────────────────────────────────────
   El negro de Embassy es azul (H≈270 en OKLCH). Acá va el mismo negro con el tono
   de esta marca: misma luminosidad, misma saturación, otro tono. Es lo que hace
   que el oscuro de ${slug} no se confunda con el de cualquier otro producto.
   Los grises de texto no se tocan a propósito. */
[data-theme="dark"] {
${Object.entries(DARK).map(([k, [v, orig]]) => `  --${k}:${" ".repeat(34 - k.length)}${v};  /* Embassy: ${orig} */`).join("\n")}
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
  // Hasta sep-2026 este par era blanco sobre el acento y daba 3.58:1 en Embassy — se
  // avisaba y no bloqueaba, porque ningún componente lo usaba. Ahora --color-on-secondary
  // es primary-900 (texto oscuro), así que el par pasa AA en cualquier marca y sí bloquea.
  ["--color-on-secondary (texto oscuro) sobre --color-secondary", P[900], S[900], 4.5, true],
  ["borde interactivo sobre fondo (no-texto)", S[900], SURFACE, 3.0, false],
  // Dark: los tres grises de texto sobre las superficies ya teñidas con el tono de
  // la marca. Rehuear conserva la L, así que esto se mueve centésimas — pero es
  // exactamente el chequeo que hay que hacer para poder teñir sin miedo.
  ["dark · texto principal sobre fondo",        "#EAEBED", DARK["color-surface"][0],                4.5, true],
  ["dark · texto principal sobre tarjeta",      "#EAEBED", DARK["color-surface-container"][0],      4.5, true],
  ["dark · texto secundario sobre tarjeta",     "#BFC1C8", DARK["color-surface-container"][0],      4.5, true],
  ["dark · texto atenuado sobre tarjeta",       "#9FA3AE", DARK["color-surface-container"][0],      4.5, true],
  ["dark · texto atenuado sobre superficie alta","#9FA3AE", DARK["color-surface-container-high"][0], 4.5, true],
  ["dark · borde sobre fondo (no-texto)",       DARK["color-outline"][0], DARK["color-surface"][0],  3.0, true],
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

if (accentAdjust) {
  console.log(`
· Aclaré el acento de L=${accentAdjust.from.toFixed(3)} a L=${accentAdjust.to.toFixed(3)} (${accentAdjust.hex})
  para que el texto encima llegue a 4.5:1. Es un ajuste de luminosidad: el tono de la marca
  se mantiene. Si el cliente necesita el hex exacto, va como color de acento decorativo y el
  texto encima no se usa.`);
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
  grande y para componentes de interfaz, no para body text.`);
}

console.log(`
Dark mode: desde 2026-09 el bloque [data-theme="dark"] de css/variables.css referencia
  var(--primitiva) para las familias primary/secondary/tertiary/estado, así que estas
  primitivas SÍ se propagan a dark. Dark consume --primary-400, --primary-50,
  --secondary-300, --secondary-925 y --secondary-950: verificá esos cinco en el preview.

  Y desde 2026-09 este archivo además reescribe las superficies oscuras con el tono de
  la marca (bloque [data-theme="dark"] al final): fondo ${DARK["color-surface"][0]},
  tarjetas ${DARK["color-surface-container"][0]}, bordes ${DARK["color-outline"][0]}.
  Los grises de texto se dejan neutros a propósito.`);

if (fails) {
  console.error(`\n✗ ${fails} par(es) de texto por debajo de AA. Ajustá el hex de marca o pedí al cliente una variante más oscura o más clara.`);
  process.exit(1);
}
console.log(`\n✓ Los pares de texto pasan AA en light${warns ? " (con los avisos de arriba)" : ""}.`);
