#!/usr/bin/env node
/**
 * check-render.mjs — los chequeos que solo existen cuando la página está DIBUJADA.
 *
 * `validate-ds.mjs` valida el design system. `check-output.mjs` valida la salida
 * leyendo el HTML COMO TEXTO, y por eso solo puede atrapar lo que se ve en el
 * código fuente: un token, una clase, un emoji. Todo lo que depende de dónde
 * quedaron las cosas —cuánto mide una línea, cuánto separa un grupo del que
 * sigue, cuánto contrasta un gris contra el fondo que efectivamente le tocó— no
 * está en el texto. Está en el render.
 *
 * Esa era la parte del catálogo que dependía de que alguien mirara.
 *
 * Uso:
 *   node scripts/check-render.mjs <archivo.html> [...]
 *   node scripts/check-render.mjs --json runs/20260908-1430/guided/*.html
 *   node scripts/check-render.mjs index.html --iterar "Object.keys(SECTIONS)" --aplicar "navigate(ID)"
 *
 * Necesita un navegador. El repo NO tiene dependencias a propósito, así que esto
 * es opcional: si Playwright no está, avisa cómo instalarlo y sale con 0 sin
 * romper nada. `npm i -D playwright && npx playwright install chromium`.
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const asJson = process.argv.includes("--json");
const argv = process.argv.slice(2);
const files = argv.filter((a) => !a.startsWith("--") && !/^[^-].*=/.test(a));
const opt = (nombre) => {
  const i = argv.indexOf(`--${nombre}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : null;
};

/* Una SPA dibuja una vista por vez y esconde el resto. Sin esto, medir el sitio
   del DS medía 370 de 44.787 elementos —el 1%— y el "0 hallazgos" resultante
   decía mucho menos de lo que parecía.
     --iterar "<js que devuelve una lista de ids>"
     --aplicar "<js con ID sustituido por cada id>"
   Ej: --iterar "Object.keys(SECTIONS)" --aplicar "navigate(ID)"
   No hay nada del sitio adentro del script: las dos expresiones las pone quien
   sabe cómo navega su pagina. */
const ITERAR = opt("iterar");
const APLICAR = opt("aplicar");

if (!files.length) {
  console.error("uso: node scripts/check-render.mjs <archivo.html> [...]");
  process.exit(2);
}

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.warn(
    "! check-render necesita un navegador y Playwright no está instalado.\n" +
    "  Es opcional a propósito (el repo no tiene dependencias), pero sin esto\n" +
    "  las fallas de composición vuelven a depender de que alguien mire.\n" +
    "  Instalalo con: npm i -D playwright && npx playwright install chromium"
  );
  process.exit(0);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Lo que se mide, y por qué cada umbral es ese
   ═══════════════════════════════════════════════════════════════════════════ */

const UMBRAL = {
  // D3 — medida de línea máxima. FAILURES.md dice ~120 caracteres.
  medidaMax: 120,
  // D16 — medida de línea MÍNIMA. No estaba en el catálogo y es la misma falla
  // por el otro lado: una columna tan angosta que el párrafo se rompe cada tres
  // palabras. Fue el error de las role cards: 213px de ancho, 23 caracteres por
  // línea, y hubo que mirarlo para verlo. Se pide >= 3 líneas para no marcar un
  // label corto, y el piso es 30 porque una columna de móvil legítima da ~45.
  medidaMin: 30,
  lineasMin: 3,
  // D8 — target táctil. 44px es el piso de WCAG 2.5.8 / HIG. Solo se mide en el
  // pase de 375px: un btn-sm de 32px en escritorio es legítimo.
  targetMin: 44,
  // F7 — AA: 4.5:1 texto normal, 3:1 texto grande (>=24px, o >=18.66px en bold).
  aaNormal: 4.5,
  aaGrande: 3.0,
};

const VIEWPORTS = [
  { nombre: "1440", width: 1440, height: 1000 },
  { nombre: "375",  width: 375,  height: 812 },
];

/* ── contraste ───────────────────────────────────────────────────────────── */

/* La sonda corre DENTRO de la página. Se pasa como función, no como string:
   armarla por interpolación obliga a escapar cada backtick y cada \b del regex,
   y un escape mal puesto no rompe — devuelve otra cosa, en silencio. */
const SONDA = (U) => {
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const c = getComputedStyle(el);
    if (c.visibility === "hidden" || c.display === "none" || c.opacity === "0") return false;
    // Texto solo para lector de pantalla: está en el DOM y tiene caja de 1px, pero
    // nadie lo ve. Medirle el contraste marcaba sr-only en todas las páginas.
    if (r.width <= 1 || r.height <= 1) return false;
    if (c.clipPath !== "none" || (c.clip && c.clip !== "auto")) return false;
    return true;
  };
  const sel = (el) => {
    if (el.id) return "#" + el.id;
    const cls = (el.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean).slice(0, 2);
    return el.tagName.toLowerCase() + (cls.length ? "." + cls.join(".") : "");
  };
  const rgb = (s) => {
    const m = /rgba?\(([^)]+)\)/.exec(s);
    if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const mezclar = (fg, bg) => ({            // fg con alpha sobre bg opaco
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1,
  });
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };
  // El fondo EFECTIVO: el primer ancestro con un background no transparente.
  // Es la parte que solo existe dibujada — en el CSS el fondo puede estar tres
  // contenedores más arriba, o venir de un tema.
  const fondo = (el) => {
    let n = el, acc = null;
    while (n) {
      const cs = getComputedStyle(n);
      // Un degradado (o una imagen) no es un color y no se puede resolver a uno:
      // el texto encima puede estar sobre cualquier punto de la rampa. Devolver
      // null y NO medir es lo honesto — antes el chain caía hasta un ancestro
      // blanco y reportaba blanco-sobre-blanco, 1:1, en una banda con gradiente.
      if (cs.backgroundImage && cs.backgroundImage !== "none") return null;
      const c = rgb(cs.backgroundColor);
      if (c && c.a > 0) { acc = acc ? mezclar(acc, c) : c; if (c.a === 1) return acc; }
      n = n.parentElement;
    }
    return acc || { r: 255, g: 255, b: 255, a: 1 };
  };

  /* Excepcion declarada por el propio elemento, con motivo obligatorio:
       <span data-ds-allow="F7 - miniatura decorativa, no es texto que alguien lea">
     Varias: data-ds-allow="F7 - motivo uno; D15 - motivo dos"
     Existe porque una maqueta en miniatura que DIBUJA una interfaz dispara reglas
     escritas para texto real. A nivel elemento y no a nivel pagina: en un archivo
     de 107 secciones, apagar F7 entero para salvar un chip es apagar el chequeo.
     Queda escrita en el markup y sale en el reporte: nadie la apaga en silencio.
     Sin motivo de al menos 10 caracteres no vale. */
  const permitido = (el, id) => {
    const nodo = el.closest("[data-ds-allow]");
    if (!nodo) return null;
    const v = nodo.getAttribute("data-ds-allow") || "";
    // Varias reglas se separan con ; — NO con coma: el motivo casi siempre lleva
    // comas y la primera partia la frase al medio, dejando "miniatura decorativa"
    // como motivo de algo que decia bastante mas.
    const m = new RegExp("(?:^|;)\\s*" + id + "\\s*[-\u2014]\\s*([^;]+)").exec(v);
    const motivo = m ? m[1].trim() : null;
    return motivo && motivo.length >= 10 ? motivo : null;
  };

  const out = { contraste: [], medida: [], targets: [], proximidad: [], anidadas: [], etiquetas: [],
                m13: [], m15: [], exentos: [], sinFondo: 0, cobertura: { total: 0, visibles: 0, nativos: 0 } };
  const marcar = (el, id, dato) => {
    const motivo = permitido(el, id);
    if (motivo) { out.exentos.push({ id, sel: sel(el), motivo }); return null; }
    return dato;
  };

  /* ── F7 · contraste ─────────────────────────────────────────────────────── */
  for (const el of document.querySelectorAll("body *")) {
    if (!vis(el)) continue;
    if (el.closest("[aria-hidden='true']") || el.matches(":disabled, [disabled]")) continue;
    const propio = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!propio) continue;
    const cs = getComputedStyle(el);
    const fg = rgb(cs.color); if (!fg || fg.a === 0) continue;
    const bg = fondo(el);
    if (!bg) { out.sinFondo++; continue; }   // sobre degradado o imagen: no medible
    const px = parseFloat(cs.fontSize), peso = parseInt(cs.fontWeight, 10) || 400;
    const grande = px >= 24 || (px >= 18.66 && peso >= 700);
    const r = ratio(mezclar(fg, bg), bg);
    const piso = grande ? U.aaGrande : U.aaNormal;
    if (r < piso) {
      const d = marcar(el, "F7", { sel: sel(el), ratio: +r.toFixed(2), piso, px: +px.toFixed(1),
                                   texto: el.textContent.replace(/\s+/g, " ").trim().slice(0, 40) });
      if (d) out.contraste.push(d);
    }
  }

  /* ── D3 / D16 · medida de línea ─────────────────────────────────────────── */
  for (const el of document.querySelectorAll("p, li, dd, blockquote, [class*='desc'], [class*='lead'], [class*='body']")) {
    if (!vis(el)) continue;
    const txt = el.textContent.replace(/\s+/g, " ").trim();
    if (txt.length < 40) continue;
    const rg = document.createRange(); rg.selectNodeContents(el);
    const rects = [...rg.getClientRects()].filter((r) => r.height > 0 && r.width > 0);
    if (!rects.length) continue;
    // La medida NO es chars/líneas: la última línea siempre queda a medias, así que
    // ese cociente subestima ~25% y marcaba párrafos sanos. Se mide el ancho real:
    // ancho promedio de carácter = suma de los anchos / caracteres, y la medida es
    // la línea más larga dividida por eso. Es el ancho de la COLUMNA, no del texto.
    const totalW = rects.reduce((a, r) => a + r.width, 0);
    const anchoChar = totalW / txt.length;
    if (!(anchoChar > 0)) continue;
    const maxW = Math.max(...rects.map((r) => r.width));
    const dm = marcar(el, "D3", marcar(el, "D16", { sel: sel(el), cpl: Math.round(maxW / anchoChar), lineas: rects.length, chars: txt.length }));
    if (dm) out.medida.push(dm);
  }

  /* ── D8 · target táctil ─────────────────────────────────────────────────── */
  for (const el of document.querySelectorAll("a[href], button, [role='button'], input:not([type='hidden']), select, summary")) {
    if (!vis(el)) continue;
    // Un <a> pelado es texto, no un control: un link dentro de un párrafo o de una
    // celda no es «la única forma de accionar», que es lo que dice D8. Se mide lo
    // que se presenta COMO control: un botón, o un link que se viste de uno.
    if (el.tagName === "A") {
      const cls = el.getAttribute("class") || "";
      if (!/btn|button|icon-btn|chip|tab|nav-item|pagination|card/.test(cls) && !el.closest("nav")) continue;
    }
    const r = el.getBoundingClientRect();
    const dt = marcar(el, "D8", { sel: sel(el), w: Math.round(r.width), h: Math.round(r.height) });
    if (dt) out.targets.push(dt);
  }

  /* ── D15 · la proximidad no agrupa ───────────────────────────────────────
     Para cada contenedor apilado: el mayor hueco ADENTRO contra el hueco que lo
     separa del grupo que SIGUE. Si adentro separa igual o más que afuera, la
     proximidad no está agrupando nada y un borde alrededor no lo arregla. */
  for (const cont of document.querySelectorAll("body *")) {
    if (!vis(cont)) continue;
    const hijos = [...cont.children].filter(vis);
    if (hijos.length < 2) continue;
    const rects = hijos.map((h) => h.getBoundingClientRect());
    let apilado = true; const dentro = [];
    for (let i = 1; i < rects.length; i++) {
      const a = rects[i - 1], b = rects[i];
      if (b.top < a.bottom - 1) { apilado = false; break; }   // solapan: no es una pila
      dentro.push(b.top - a.bottom);
    }
    if (!apilado || !dentro.length) continue;
    const sig = cont.nextElementSibling;
    if (!sig || !vis(sig)) continue;
    // Si el que sigue es un PAR —mismo tag y mismas clases— no es "el grupo
    // siguiente": son dos items de una lista o de un riel, y ahi estar pegados es
    // deliberado. Sin esto, un riel de botones de 1px de separacion marcaba una
    // vez por boton: diez hallazgos, ninguno real, en el sitio del propio DS.
    const clases = (e) => new Set((e.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean));
    const a = clases(cont), b = clases(sig);
    const parientes = sig.tagName === cont.tagName &&
      ((!a.size && !b.size) || [...a].some((c) => b.has(c)));   // comparten al menos una clase:
    if (parientes) continue;                                    // el .active del riel tambien es un par
    const afuera = sig.getBoundingClientRect().top - cont.getBoundingClientRect().bottom;
    if (afuera <= 0) continue;
    const max = Math.max(...dentro);
    if (max > afuera + 0.5)
      { const dp = marcar(cont, "D15", { sel: sel(cont), adentro: Math.round(max), afuera: Math.round(afuera) });
        if (dp) out.proximidad.push(dp); }
  }

  /* ── D6 · cards anidadas ────────────────────────────────────────────────── */
  for (const el of document.querySelectorAll(".card .card, .card [class*='-card'], [class*='-card'] .card")) {
    if (!vis(el)) continue;
    const padre = el.parentElement && el.parentElement.closest(".card, [class*='-card']");
    const da = marcar(el, "D6", { sel: sel(el), dentroDe: padre ? sel(padre) : "?" });
    if (da) out.anidadas.push(da);
  }

  /* ── D12 · la etiqueta pesa más que su dato ─────────────────────────────
     En una stat-card lo más grande tiene que ser la cifra. Si lo más grande no
     empieza con un número, la tarjeta está diciendo el rótulo y no el dato. */
  for (const card of document.querySelectorAll("[class*='stat']")) {
    if (!vis(card)) continue;
    const hojas = [...card.querySelectorAll("*")].filter((e) =>
      vis(e) && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
    if (hojas.length < 2) continue;
    let top = null, topPx = 0;
    for (const h of hojas) {
      const px = parseFloat(getComputedStyle(h).fontSize);
      if (px > topPx) { topPx = px; top = h; }
    }
    if (!top) continue;
    const t = top.textContent.trim();
    if (!/^[\s\d.,%$+\-/]*\d/.test(t))
      { const de = marcar(card, "D12", { sel: sel(card), mayor: t.slice(0, 30), px: +topPx.toFixed(1) });
        if (de) out.etiquetas.push(de); }
  }

  /* ── Cobertura ───────────────────────────────────────────────────────────
     Cuanto de la pagina se llego a medir. Un sitio de documentacion muestra UNA
     seccion por vez y esconde el resto: en index.html eso es una de 107, asi que
     un "0 hallazgos" sin este numero al lado dice mucho menos de lo que parece.
     Un render mide lo que esta dibujado, no lo que esta en el archivo. */
  {
    const todos = document.querySelectorAll("body *");
    out.cobertura.total = todos.length;
    for (const el of todos) if (vis(el)) out.cobertura.visibles++;
    out.cobertura.nativos = document.querySelectorAll("[data-platform='native']").length;
  }

  /* ── M13 · la etiqueta pesa mas que su dato ──────────────────────────────
     La falla que el sistema produce solo (FAILURES.md M13, MOBILE.md §6b·4).
     En una .screen-row el DATO es lo que se lee y la etiqueta lo acompaña. Se
     compara por tamaño y por CONTRASTE contra el fondo, no por color: en claro
     el dato es mas oscuro y en oscuro es mas claro, y el contraste ordena bien
     en los dos. Si la etiqueta tiene mas cuerpo, o mas contraste que el dato,
     la fila esta diciendo el rotulo en vez del dato. */
  for (const row of document.querySelectorAll(".screen-row")) {
    if (!vis(row)) continue;
    const lab = row.querySelector(".screen-row-label");
    const val = row.querySelector(".screen-row-value");
    if (!lab || !val || !vis(lab) || !vis(val)) continue;
    const cl = getComputedStyle(lab), cv = getComputedStyle(val);
    const pl = parseFloat(cl.fontSize), pv = parseFloat(cv.fontSize);
    const bg = fondo(row);
    if (!bg) continue;
    const rl = ratio(mezclar(rgb(cl.color) || { r: 0, g: 0, b: 0, a: 1 }, bg), bg);
    const rv = ratio(mezclar(rgb(cv.color) || { r: 0, g: 0, b: 0, a: 1 }, bg), bg);
    const motivos = [];
    if (pl > pv) motivos.push(`la etiqueta mide ${pl}px y el dato ${pv}px`);
    if (rl > rv + 0.2) motivos.push(`la etiqueta contrasta ${rl.toFixed(2)}:1 y el dato ${rv.toFixed(2)}:1`);
    if (!motivos.length) continue;
    const d = marcar(row, "M13", { sel: sel(row), motivos: motivos.join(" y ") });
    if (d) out.m13.push(d);
  }

  /* ── M15 · mono fuera de su trabajo ──────────────────────────────────────
     "En nativo el mono es solo para datos tabulares que se comparan en columna"
     (FAILURES.md M15, MOBILE.md §6b·7). FAILURES decia que se detectaba con un
     regex sobre font-mono y no habia ningun regex: el catalogo prometia una
     cobertura que no existia.
     Se mide PROSA, no presencia de mono: un identificador en mono —"accordion",
     "ExpansionTile"— es exactamente el uso correcto, y marcarlo daba 111 falsos
     positivos en la tabla de equivalencias del propio sitio. El corte son cinco
     palabras: por debajo es un dato o una etiqueta, por encima es una frase.
     Solo adentro de un contenedor nativo — en web el mono editorial es legitimo. */
  for (const nat of document.querySelectorAll("[data-platform='native']")) {
    if (!vis(nat)) continue;
    for (const el of nat.querySelectorAll("*")) {
      if (!vis(el)) continue;
      if (!/mono/i.test(getComputedStyle(el).fontFamily)) continue;
      const t = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(" ")
                 .replace(/\s+/g, " ").trim();
      if (t.split(" ").filter(Boolean).length < 5) continue;
      const d = marcar(el, "M15", { sel: sel(el), txt: t.slice(0, 50) });
      if (d) out.m15.push(d);
    }
  }

  return out;
};

/* ═══════════════════════════════════════════════════════════════════════════ */

const findings = [];
const exenciones = new Map();   // clave id|sel -> {id, sel, motivo, file}
const cobertura = new Map();    // file -> {total, visibles, nativos}
const add = (id, sev, file, desc, evidence, vp) =>
  findings.push({ id, sev, file, desc, evidence, viewport: vp });

// Un Chromium ya instalado gana sobre el que Playwright se bajaría. Sirve en CI
// y en cualquier máquina donde el binario esté pero no donde Playwright lo busca.
const binario = process.env.EMBASSY_CHROMIUM || process.env.CHROME_PATH;
const browser = await chromium.launch(binario ? { executablePath: binario } : {});

for (const file of files) {
  if (!fs.existsSync(file)) { console.warn(`! no existe: ${file}`); continue; }
  const url = pathToFileURL(path.resolve(file)).href;

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
    } catch {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    }
    await page.waitForTimeout(250);

    // Las vistas a recorrer. Sin --iterar es una sola: lo que la pagina muestra al abrir.
    let vistas = [null];
    if (ITERAR) {
      try {
        const lista = await page.evaluate(`(() => { try { return ${ITERAR}; } catch (e) { return null; } })()`);
        if (Array.isArray(lista) && lista.length) vistas = lista;
        else console.warn(`! --iterar no devolvió una lista en ${path.basename(file)} — se mide solo la vista inicial`);
      } catch { console.warn(`! --iterar falló en ${path.basename(file)} — se mide solo la vista inicial`); }
    }

    const r = { contraste: [], medida: [], targets: [], proximidad: [], anidadas: [], etiquetas: [],
                m13: [], m15: [], exentos: [], sinFondo: 0, cobertura: { total: 0, visibles: 0, nativos: 0 } };
    for (const vista of vistas) {
      if (vista != null && APLICAR) {
        try {
          await page.evaluate(`(() => { const ID = ${JSON.stringify(vista)}; try { ${APLICAR}; } catch (e) {} })()`);
          await page.waitForTimeout(120);
        } catch { /* una vista que no abre no rompe el resto */ }
      }
      const parcial = await page.evaluate(SONDA, UMBRAL);
      for (const k of ["contraste", "medida", "targets", "proximidad", "anidadas", "etiquetas", "m13", "m15", "exentos"])
        r[k].push(...parcial[k]);
      // La cobertura se queda con el MAXIMO de visibles: es cuanto se llego a ver,
      // no la suma de todas las pasadas (los elementos del shell se repiten).
      r.sinFondo += parcial.sinFondo;
      r.cobertura.total = Math.max(r.cobertura.total, parcial.cobertura.total);
      r.cobertura.visibles = Math.max(r.cobertura.visibles, parcial.cobertura.visibles);
      r.cobertura.nativos = Math.max(r.cobertura.nativos, parcial.cobertura.nativos);
      r.cobertura.vistas = vistas.length;
    }
    await page.close();

    for (const e of r.exentos || []) exenciones.set(`${e.id}|${e.sel}`, { ...e, file });

    // F7 · contraste — se reporta UNA vez (en 1440): el color no cambia con el ancho.
    if (vp.nombre === "1440") {
      const vistos = new Set();
      for (const c of r.contraste) {
        const k = `${c.sel}|${c.ratio}`;
        if (vistos.has(k)) continue;
        vistos.add(k);
        add("F7", "ALTA", file,
            `contraste por debajo de AA (${c.ratio}:1, piso ${c.piso}:1 a ${c.px}px)`,
            `${c.sel} — “${c.texto}”`, vp.nombre);
      }
    }

    // D3 / D16 · medida de línea
    for (const m of r.medida) {
      if (m.cpl > UMBRAL.medidaMax)
        add("D3", "ALTA", file, `línea de ~${m.cpl} caracteres (máximo ~${UMBRAL.medidaMax})`,
            `${m.sel} — ${m.lineas} línea(s)`, vp.nombre);
      if (m.lineas >= UMBRAL.lineasMin && m.cpl < UMBRAL.medidaMin)
        add("D16", "ALTA", file,
            `columna demasiado angosta: ~${m.cpl} caracteres por línea en ${m.lineas} líneas (mínimo ~${UMBRAL.medidaMin})`,
            `${m.sel}`, vp.nombre);
    }

    // D8 · target táctil — solo en el pase angosto
    if (vp.nombre === "375") {
      for (const t of r.targets)
        if (t.h < UMBRAL.targetMin || t.w < UMBRAL.targetMin)
          add("D8", "ALTA", file, `target táctil de ${t.w}×${t.h} (mínimo ${UMBRAL.targetMin})`,
              t.sel, vp.nombre);
    }

    // D15 · proximidad
    for (const p of r.proximidad)
      add("D15", "ALTA", file,
          `la proximidad no agrupa: ${p.adentro}px adentro contra ${p.afuera}px alrededor`,
          p.sel, vp.nombre);

    // D6 · cards anidadas — una sola vez
    if (vp.nombre === "1440")
      for (const a of r.anidadas)
        add("D6", "MEDIA", file, "tarjeta dentro de otra tarjeta", `${a.sel} dentro de ${a.dentroDe}`, vp.nombre);

    // D12 · la etiqueta pesa más que su dato
    if (vp.nombre === "1440")
      for (const e of r.etiquetas)
        add("D12", "ALTA", file, `lo más grande de la stat-card no es la cifra (${e.px}px)`,
            `${e.sel} — “${e.mayor}”`, vp.nombre);

    // M13 / M15 · nativo — una sola vez, no dependen del ancho
    if (vp.nombre === "1440") {
      for (const m of r.m13)
        add("M13", "ALTA", file, `la etiqueta pesa más que su dato: ${m.motivos}`, m.sel, vp.nombre);
      for (const m of r.m15)
        add("M15", "MEDIA", file, "mono en prosa dentro de una pantalla nativa — el mono es para datos que se comparan en columna",
            `${m.sel} — “${m.txt}”`, vp.nombre);
      cobertura.set(file, r.cobertura);
    }
  }
}

await browser.close();

const count = (s) => findings.filter((f) => f.sev === s).length;
const summary = { BLOQ: count("BLOQ"), ALTA: count("ALTA"), MEDIA: count("MEDIA"), BAJA: count("BAJA"), total: findings.length };

if (asJson) {
  console.log(JSON.stringify({ files, summary, findings, exenciones: [...exenciones.values()], cobertura: [...cobertura] }, null, 2));
} else {
  const order = { BLOQ: 0, ALTA: 1, MEDIA: 2, BAJA: 3 };
  for (const f of findings.sort((a, b) => order[a.sev] - order[b.sev] || a.id.localeCompare(b.id))) {
    console.log(`[${f.id} · ${f.sev} · ${f.viewport}px] ${path.basename(f.file)} — ${f.desc}\n    ${f.evidence}`);
  }
  for (const [f, c] of cobertura) {
    const pct = c.total ? Math.round((c.visibles / c.total) * 100) : 0;
    const nota = pct < 60
      ? "  ← el resto está oculto y NO se midió: un render mide lo dibujado, no el archivo"
      : "";
    console.log(`[cobertura] ${path.basename(f)} — ${c.visibles} de ${c.total} elementos visibles por vista (${pct}%)` +
      (c.vistas > 1 ? ` · ${c.vistas} vista(s) recorrida(s)` : "") +
      (c.nativos ? ` · ${c.nativos} contenedor(es) data-platform="native"` : "") +
      (c.vistas > 1 ? "" : nota));
  }
  for (const e of exenciones.values())
    console.log(`[${e.id} · EXCEPCIÓN DECLARADA] ${path.basename(e.file)} — ${e.sel}\n    ${e.motivo}`);
  console.log(`\nBLOQUEANTES ${summary.BLOQ} · ALTAS ${summary.ALTA} · MEDIAS ${summary.MEDIA} · total ${summary.total}` +
    (exenciones.size ? ` · ${exenciones.size} excepción(es) declarada(s)` : ""));
  console.log("Lo que sigue sin medirse —«cero relleno», la regla 4, las inversiones de §4b— es criterio, no umbral: lo juzga la skill `review`.");
}

process.exit(summary.BLOQ > 0 ? 1 : 0);
