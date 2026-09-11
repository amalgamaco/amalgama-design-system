#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════
   build-tokens.mjs — css/variables.css es la fuente, esto es la salida

   React Native no lee CSS. Este script extrae los tokens de
   css/variables.css a un formato neutral de plataforma y desde ahí
   emite los targets. La fuente sigue siendo el CSS: acá no se declara
   ni un valor.

   Tres cosas que existen en CSS y NO en React Native, y que por eso
   este script resuelve en vez de copiar:
     · var()        — indirección. RN necesita el valor final.
     · clamp()      — fluido por viewport. En RN se congela al mínimo
                      (que es el valor de teléfono) y se guarda el máximo.
     · color-mix()  — se calcula acá y sale hex.

   Uso:
     node scripts/build-tokens.mjs           genera tokens/
     node scripts/build-tokens.mjs --check   falla si hay drift (CI)
   ═══════════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ROOT sale del primer argumento POSICIONAL. Antes era process.argv[2] a secas, así que
// `build-tokens.mjs --check` —la forma que documentan el header de acá y CLAUDE.md— tomaba
// '--check' como ROOT y moría buscando '--check/css/variables.css'. Solo andaba pasando el
// ROOT antes del flag, que es lo que hace validate-ds [12]; a mano nunca funcionó.
const POSITIONAL = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const ROOT  = POSITIONAL[0] || join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC   = join(ROOT, 'css/variables.css');
const OUT   = join(ROOT, 'tokens');
const CHECK = process.argv.includes('--check');

/* ── 1. leer los bloques ────────────────────────────────────────── */

const css = readFileSync(SRC, 'utf8');

function block(selector) {
  const i = css.indexOf(selector + ' {');
  if (i === -1) throw new Error(`no encontré el bloque ${selector}`);
  let depth = 0, j = css.indexOf('{', i);
  for (let k = j; k < css.length; k++) {
    if (css[k] === '{') depth++;
    else if (css[k] === '}') { depth--; if (!depth) return css.slice(j + 1, k); }
  }
  throw new Error(`bloque ${selector} sin cerrar`);
}

function parse(body) {
  const out = new Map();
  let section = 'general';
  let inComment = false, buf = [];

  for (const raw of body.split('\n')) {
    const line = raw.trim();

    if (inComment) {
      buf.push(line);
      if (line.includes('*/')) {
        inComment = false;
        const title = buf.join(' ').replace(/\*\//g, '').replace(/[─\-—=*]{2,}/g, ' ').trim();
        if (title) section = title;
        buf = [];
      }
      continue;
    }
    if (line.startsWith('/*') && !line.includes('*/')) { inComment = true; buf = [line.slice(2)]; continue; }
    if (line.startsWith('/*') && line.includes('*/')) {
      const title = line.replace(/^\/\*|\*\/$/g, '').replace(/[─\-—=*]{2,}/g, ' ').trim();
      if (title && !line.includes('--')) section = title;
      continue;
    }

    const re = /(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/g;
    let m;
    while ((m = re.exec(line))) {
      const after = line.slice(m.index + m[0].length);
      const note = (after.match(/\/\*\s*(.*?)\s*\*\//) || [])[1];
      out.set(m[1], { raw: m[2].trim(), section, note: note || undefined });
    }
  }
  return out;
}

const light  = parse(block(':root'));
const dark   = parse(block('[data-theme="dark"]'));
/* Eje independiente del color: escritorio vs nativo es tamaño y densidad.
   Una app nativa en dark usa los dos bloques a la vez. */
const native = css.includes('[data-platform="native"] {') ? parse(block('[data-platform="native"]')) : new Map();

/* ── 2. resolver ────────────────────────────────────────────────── */

const unresolved = [];

function resolve(name, theme, seen = new Set()) {
  const map = theme === 'dark' ? dark : theme === 'native' ? native : light;
  const entry = map.get(name) ?? light.get(name);
  if (!entry) { unresolved.push(`${name} (${theme}): no existe`); return null; }
  return expand(entry.raw, theme, seen, name);
}

function expand(value, theme, seen, origin) {
  let v = value.trim();
  let guard = 0;
  while (v.includes('var(') && guard++ < 20) {
    v = v.replace(/var\(\s*(--[A-Za-z0-9-]+)\s*(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/, (_, ref, fb) => {
      if (seen.has(ref)) { unresolved.push(`${origin}: ciclo en ${ref}`); return fb || 'transparent'; }
      const next = new Set(seen); next.add(ref);
      const r = resolve(ref, theme, next);
      return r ?? (fb ? fb.trim() : 'transparent');
    });
  }
  while (v.includes('color-mix(')) {
    const before = v;
    v = v.replace(/color-mix\(\s*in\s+srgb\s*,\s*([^,]+?)\s+(\d+(?:\.\d+)?)%\s*,\s*([^)]+?)\s*\)/, (_, a, pct, b) => mix(a.trim(), parseFloat(pct), b.trim()));
    if (v === before) { unresolved.push(`${origin}: color-mix no resuelto → ${v.slice(0, 60)}`); break; }
  }
  return v;
}

/* ── color helpers ──────────────────────────────────────────────── */

const NAMED = { transparent: [0, 0, 0, 0], white: [255, 255, 255, 1], black: [0, 0, 0, 1] };

function toRGBA(c) {
  c = c.trim();
  if (NAMED[c.toLowerCase()]) return NAMED[c.toLowerCase()].slice();
  let m = c.match(/^#([0-9a-f]{3,8})$/i);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = [...h].map(x => x + x).join('');
    if (h.length === 4) h = [...h].map(x => x + x).join('');
    const n = parseInt(h.slice(0, 6), 16);
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, a];
  }
  m = c.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(parseFloat);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  }
  return null;
}

function hex([r, g, b, a]) {
  const h = n => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0').toUpperCase();
  return '#' + h(r) + h(g) + h(b) + (a < 1 ? h(a * 255) : '');
}

function mix(a, pct, b) {
  const A = toRGBA(a), B = toRGBA(b);
  if (!A || !B) return `color-mix(in srgb, ${a} ${pct}%, ${b})`;
  const w = pct / 100;
  // color-mix premultiplica alpha
  const out = [0, 1, 2].map(i => A[i] * w * A[3] + B[i] * (1 - w) * B[3]);
  const alpha = A[3] * w + B[3] * (1 - w);
  const un = alpha ? out.map(x => x / alpha) : out;
  return hex([...un, alpha]);
}

const isColor = v => v != null && toRGBA(v) != null;

/* ── clamp ──────────────────────────────────────────────────────── */

function readClamp(v) {
  const m = v.match(/^clamp\(\s*([^,]+?)\s*,\s*([^,]+?)\s*,\s*([^)]+?)\s*\)$/);
  return m ? { min: m[1].trim(), pref: m[2].trim(), max: m[3].trim() } : null;
}

const px = v => { const m = String(v).match(/^(-?[\d.]+)px$/); return m ? parseFloat(m[1]) : undefined; };


/* ── qué no traduce 1:1 a React Native ──────────────────────────── */

function nativeNote(name, t) {
  const v = t.$value;
  if (typeof v !== 'string') return null;

  if (/^--letter-spacing/.test(name) && v.endsWith('em'))
    return { translates: false, unit: 'em',
             rule: `RN mide letterSpacing en puntos: letterSpacing = fontSize * ${parseFloat(v)}` };

  if (/^--measure/.test(name) && v.endsWith('ch'))
    return { translates: false, unit: 'ch',
             rule: 'RN no tiene ch. En nativo la medida de linea se acota con maxWidth en puntos o con el ancho de la columna.' };

  if (/^--line-height/.test(name) && /^[\d.]+$/.test(v))
    return { translates: false, unit: 'multiplicador',
             rule: `RN mide lineHeight en puntos: lineHeight = fontSize * ${v}` };

  if (v.startsWith('cubic-bezier(')) {
    const p = v.match(/cubic-bezier\(([^)]+)\)/)[1].split(',').map(x => parseFloat(x.trim()));
    return { translates: true, rn: `Easing.bezier(${p.join(', ')})` };
  }

  if (t.$type === 'shadow' || /^--shadow/.test(name))
    return { translates: false,
             rule: 'RN no tiene box-shadow multi-capa: iOS usa shadowColor/Offset/Opacity/Radius y Android solo elevation.' };

  if (t.$type === 'gradient')
    return { translates: false,
             rule: 'RN no tiene gradientes nativos: expo-linear-gradient con los stops ya resueltos.' };

  if (t.$fluid)
    return { translates: false, unit: 'clamp',
             rule: `Congelado en ${t.$value} (telefono). El maximo ${t.$fluid.max} vale para tablet.` };

  if (/^--breakpoint/.test(name))
    return { translates: true, rn: 'useWindowDimensions().width' };

  return null;
}

/* ── 3. armar el modelo ─────────────────────────────────────────── */

function kind(name, value) {
  if (isColor(value)) return 'color';
  if (/^--font-(heading|body|mono)$/.test(name)) return 'fontFamily';
  if (/^--font-size|^--line-height|^--letter-spacing|^--font-weight/.test(name)) return 'typography';
  if (/^--space-|^--radius-|^--breakpoint-|^--measure|^--target-|^--row-height|^--control-height|^--screen-gutter|^--sidebar-width|^--topbar-height/.test(name)) return 'dimension';
  if (/^--shadow-|^--elevation/.test(name)) return 'shadow';
  if (/^--gradient-/.test(name)) return 'gradient';
  if (/^--duration|^--ease|^--transition/.test(name)) return 'motion';
  return 'other';
}

const tokens = {};
for (const [name, e] of light) {
  const L = resolve(name, 'light');
  const D = dark.has(name) ? resolve(name, 'dark') : null;
  const t = { $type: kind(name, L), $value: L, section: e.section };
  if (e.note) t.$description = e.note;
  if (D && D !== L) t.$dark = D;
  if (native.has(name)) {
    const N = resolve(name, 'native');
    if (N && N !== L) t.$platformNative = N;
  }
  const c = readClamp(e.raw);
  if (c) {
    t.$type = 'typography';
    t.$value = c.min;                 // RN: el valor de teléfono
    t.$fluid = { min: c.min, preferred: c.pref, max: c.max };
    t.$native = { phone: px(c.min), tablet: px(c.max) };
  }
  if (e.raw.startsWith('var(')) t.$alias = e.raw.match(/var\(\s*(--[A-Za-z0-9-]+)/)[1];
  const nat = nativeNote(name, t);
  if (nat) t.$native = { ...(t.$native || {}), ...nat };
  tokens[name] = t;
}
// tokens que solo existen en el bloque nativo
for (const [name] of native) if (!tokens[name]) {
  const N = resolve(name, 'native');
  tokens[name] = { $type: kind(name, N), $value: N, $platformNative: N, section: native.get(name).section, $onlyNative: true };
}
// tokens que solo existen en dark
for (const [name] of dark) if (!tokens[name]) {
  const D = resolve(name, 'dark');
  tokens[name] = { $type: kind(name, D), $value: D, $dark: D, section: dark.get(name).section, $onlyDark: true };
}

/* ── 4. targets ─────────────────────────────────────────────────── */

const stamp = `Generado por scripts/build-tokens.mjs desde css/variables.css.\nNO editar a mano: se regenera y se pisa. Cambiá el CSS.`;
const colors = Object.entries(tokens).filter(([, t]) => t.$type === 'color');

const json = JSON.stringify({
  $schema: 'https://design-tokens.org/community-group/format/',
  $description: stamp.replace(/\n/g, ' '),
  source: 'css/variables.css',
  generated: new Date().toISOString().slice(0, 10),
  tokens,
}, null, 2) + '\n';

const camel = n => n.replace(/^--/, '').replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

const ts = `/* ${stamp.split('\n').join('\n   ')} */\n\n` +
`export const light = {\n` +
  Object.entries(tokens).map(([n, t]) => `  ${JSON.stringify(camel(n))}: ${JSON.stringify(t.$value)},`).join('\n') +
`\n} as const;\n\nexport const dark = {\n` +
  Object.entries(tokens).map(([n, t]) => `  ${JSON.stringify(camel(n))}: ${JSON.stringify(t.$dark ?? t.$value)},`).join('\n') +
`\n} as const;\n\n/* Eje de plataforma: los mismos nombres, valores de teléfono.\n   Se combina con light/dark, no lo reemplaza. */\nexport const native = {\n` +
  Object.entries(tokens).map(([n, t]) => `  ${JSON.stringify(camel(n))}: ${JSON.stringify(t.$platformNative ?? t.$value)},`).join('\n') +
`\n} as const;\n\nexport const nativeDark = {\n` +
  Object.entries(tokens).map(([n, t]) => `  ${JSON.stringify(camel(n))}: ${JSON.stringify(t.$platformNative ?? t.$dark ?? t.$value)},`).join('\n') +
`\n} as const;\n\nexport type EmbassyTokens = typeof light;\n`;

const triplet = v => { const c = toRGBA(v); return c ? `${Math.round(c[0])} ${Math.round(c[1])} ${Math.round(c[2])}` : null; };

/* Dos nombres por color, para no chocar:
     runtime  --e-<token>        el valor vive acá (lo inyecta el provider)
     Tailwind --color-<utility>  lo consume bg-/text-/border-
   Embassy ya tiene tokens llamados --color-*, así que sin el prefijo --e- el
   mapeo saldría auto-referencial (--color-primary: rgb(var(--color-primary))). */
const runtimeVar = n => '--e-' + n.replace(/^--/, '');

/* Regla de desempate, deliberada y estable: si dos tokens compiten por el mismo
   nombre corto (--color-surface vs el atajo --surface), gana el rol canónico
   --color-*. El perdedor se queda con su nombre completo, o con alias-<nombre>
   si eso también choca. Un utility que empieza con alias- avisa que casi
   seguro querías el otro. */
const taken = new Map();
const used  = new Set();
const canonicalFirst = [...colors].sort((a, b) =>
  Number(b[0].startsWith('--color-')) - Number(a[0].startsWith('--color-')));
for (const [n] of canonicalFirst) {
  const short = n.replace(/^--(color-)?/, '');
  const long  = n.replace(/^--/, '');
  const name  = !used.has(short) ? short : (used.has(long) ? 'alias-' + long : long);
  if (used.has(name)) throw new Error(`colisión irresoluble de utility "${name}" en ${n}`);
  used.add(name);
  taken.set(n, name);
}
const utility = n => taken.get(n) ?? n.replace(/^--/, '');

const gluestack = `/* ${stamp.split('\n').join('\n   ')} */\n\n` +
`/* Triplete RGB sin rgb() — así NativeWind/Tailwind puede aplicar opacidad\n` +
`   (bg-primary/40 funciona; un hex no). */\n` +
`export const config = {\n  light: {\n` +
  colors.map(([n, t]) => `    ${JSON.stringify(runtimeVar(n))}: ${JSON.stringify(triplet(t.$value))},`).join('\n') +
`\n  },\n  dark: {\n` +
  colors.map(([n, t]) => `    ${JSON.stringify(runtimeVar(n))}: ${JSON.stringify(triplet(t.$dark ?? t.$value))},`).join('\n') +
`\n  },\n} as const;\n`;

/* ── Dart / Flutter ──────────────────────────────────────────────────────
   Amalgama hace apps en los dos stacks según el proyecto, así que el eje
   nativo tiene DOS destinos y una sola fuente. Esto es la data; el ThemeData
   que la consume vive en components/flutter/embassy_theme.dart, igual que
   lib/theme.ts es el puente del lado de React Native.

   Dos diferencias con RN que conviene tener presentes:
     · TextStyle.height de Flutter SÍ es un múltiplo del fontSize, así que los
       line-height se pasan tal cual. En RN hay que multiplicar (falla M7).
     · letterSpacing es en píxeles lógicos, igual que RN: em × fontSize.
   ───────────────────────────────────────────────────────────────────────── */

const dartField = (n) => {
  const base = n.replace(/^--/, '').replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
  return /^[0-9]/.test(base) ? 'v' + base : base;
};

/** #RRGGBB o #RRGGBBAA → 0xAARRGGBB, que es lo que espera Color(). */
function dartColor(v) {
  const c = toRGBA(v);
  if (!c) return null;
  const h = (n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0').toUpperCase();
  return `Color(0x${h(c[3] * 255)}${h(c[0])}${h(c[1])}${h(c[2])})`;
}

const dartNum = (v) => {
  if (typeof v !== 'string') return null;
  const m = v.match(/^(-?[\d.]+)px$/) || v.match(/^(-?[\d.]+)$/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return Number.isInteger(n) ? `${n}.0` : `${n}`;
};

const dims = Object.entries(tokens).filter(([n, t]) =>
  (t.$type === 'dimension' || t.$type === 'typography') && dartNum(t.$value) !== null);

const dartFile = (() => {
  const L = ['// ' + stamp.split('\n').join('\n// '), '',
    "import 'dart:ui' show Color;", '',
    '/// Los colores de Embassy. Los mismos 182 que en web y en React Native:',
    '/// lo que cambia entre plataformas es el TAMAÑO, no el color.',
    'class EmbassyColors {', '  const EmbassyColors._();', ''];

  for (const modo of ['light', 'dark']) {
    L.push(`  // ── ${modo} ──`);
    for (const [n, t] of colors) {
      const v = dartColor(modo === 'dark' ? (t.$dark ?? t.$value) : t.$value);
      if (v) L.push(`  static const ${dartField(n)}${modo === 'dark' ? 'Dark' : ''} = ${v};`);
    }
    L.push('');
  }
  L.push('}', '',
    '/// Tamaños y densidad. Dos juegos: el de escritorio y el de teléfono.',
    '/// En una app SIEMPRE se usa EmbassyDims.native — usar el de web es la falla M5.',
    'class EmbassyDims {', '  const EmbassyDims._();', '');
  for (const modo of ['web', 'native']) {
    L.push(`  // ── ${modo} ──`);
    for (const [n, t] of dims) {
      const raw = modo === 'native' ? (t.$platformNative ?? t.$value) : t.$value;
      const v = dartNum(raw);
      if (v) L.push(`  static const ${dartField(n)}${modo === 'native' ? 'Native' : ''} = ${v};`);
    }
    L.push('');
  }
  L.push('}', '',
    '/// Las familias, ya sin el stack de fallback: Flutter quiere un nombre.',
    'class EmbassyFonts {', '  const EmbassyFonts._();');
  for (const [n, t] of Object.entries(tokens)) {
    if (t.$type !== 'fontFamily') continue;
    L.push(`  static const ${dartField(n)} = '${String(t.$value).split(',')[0].replace(/['"]/g, '').trim()}';`);
  }
  L.push('}', '');
  return L.join('\n');
})();

const themeCss = `/* ${stamp.split('\n').join('\n   ')} */\n\n` +
`/* Tailwind v4 / NativeWind v5: los tokens se declaran en CSS, sin tailwind.config.js. */\n` +
`@theme inline {\n` +
  colors.map(([n]) => `  --color-${utility(n)}: rgb(var(${runtimeVar(n)}));`).join('\n') +
`\n}\n`;

/* ── 5. escribir o chequear ─────────────────────────────────────── */

const notes = Object.entries(tokens).filter(([, t]) => t.$native);
const notesMd = `# Lo que no cruza de CSS a React Native\n\n` +
`> ${stamp.split('\n')[0]}\n\n` +
`${notes.length} de ${Object.keys(tokens).length} tokens no se copian tal cual. El valor sigue siendo el mismo — cambia como se aplica.\n\n` +
`| Token | Valor | Por que | En RN |\n|---|---|---|---|\n` +
notes.map(([n, t]) => `| \`${n}\` | \`${t.$value}\` | ${t.$native.unit ? '`' + t.$native.unit + '`' : (t.$native.translates ? 'equivalente directo' : 'no existe en RN')} | ${t.$native.rn ? '`' + t.$native.rn + '`' : t.$native.rule} |`).join('\n') + '\n';

const files = {
  'NATIVE-NOTES.md':      notesMd,
  'embassy_tokens.dart':  dartFile,
  'embassy.tokens.json':  json,
  'embassy.tokens.ts':    ts,
  'gluestack.config.ts':  gluestack,
  'theme.css':            themeCss,
};

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

let drift = [];
for (const [f, content] of Object.entries(files)) {
  const p = join(OUT, f);
  const prev = existsSync(p) ? readFileSync(p, 'utf8') : null;
  const norm = s => s && s.replace(/^\s*"generated":.*$/m, '');
  if (norm(prev) !== norm(content)) drift.push(f);
  if (!CHECK) writeFileSync(p, content);
}

const n = Object.keys(tokens).length;
console.log(`tokens: ${n}  ·  colores: ${colors.length}  ·  con dark propio: ${Object.values(tokens).filter(t => t.$dark).length}  ·  con valor nativo: ${Object.values(tokens).filter(t => t.$platformNative).length}  ·  fluidos (clamp): ${Object.values(tokens).filter(t => t.$fluid).length}`);
if (unresolved.length) { console.log(`\nSIN RESOLVER (${unresolved.length}):`); unresolved.slice(0, 20).forEach(u => console.log('  · ' + u)); }

if (CHECK) {
  if (drift.length) { console.error(`\nDRIFT: tokens/ está desactualizado respecto de css/variables.css → ${drift.join(', ')}\nCorré: node scripts/build-tokens.mjs`); process.exit(1); }
  console.log('\nsin drift');
} else {
  console.log(`\nescrito en tokens/: ${Object.keys(files).join(', ')}`);
}
if (unresolved.length) process.exitCode = CHECK ? 1 : 0;
