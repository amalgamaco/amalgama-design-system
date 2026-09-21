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

  /* ── La vara de aceptación de pantalla · D17–D26, más D1 y C2 ────────────
     Regla en guidelines/aceptacion-de-pantalla.md. Los umbrales viven ACÁ y no
     en la prosa: si se mueven, se mueven en un solo lugar.

     Todos son RELACIONES y no valores, a propósito: «el control no puede ser más
     alto que la fila de dato» vale igual en compacta y en cómoda; «36px» vale
     sólo en una. Un umbral absoluto obliga a una excepción por arquetipo y
     termina siendo una plantilla con otro nombre.

     Se miden dentro de [data-ds-screen]. Sin esa raíz no se mide nada de esto y
     el reporte lo dice: el catálogo del DS y una landing no son pantallas de
     producto, y medirlas como si lo fueran da mil cuatrocientos hallazgos que no
     son bugs. */
  aceptacion: {
    // A2/D18 — tolerancia en px antes de decir que el control le gana al dato.
    holguraControl: 2,
    // B1/D19 — cuántos valores distintos de lo mismo. La píldora no cuenta como
    // radio: es una forma, no un paso de la escala. Las alturas admiten 3 —un
    // botón, un chip y un campo es una pantalla sana; cinco es acumulación.
    radiosMax: 2,
    alturasMax: 3,
    gapsMax: 5,
    escalaGap: [2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48, 64, 80, 96],
    // C1/D20 — el dominante contra la segunda región.
    razonDominante: 1.5,
    // C2/D22 — portadores de énfasis por elemento. Un container con su texto
    // `on-` cuenta como UNO: el badge del sistema es peso + superficie y es
    // correcto. Tres es peso + tamaño + superficie, que ya es grito.
    portadoresMax: 2,
    razonTamano: 1.25,
    // C3/D23 — familias de tono con fondo saturado, en cubos de 30°.
    tonosMax: 4,
    // D1/D24 — el salto entre niveles de aire. D15 pide > 1; esto pide que el
    // salto se vea: 24/24/24 pasaba D15 moviendo uno a 23.
    razonAire: 1.75,
    // D2/D25 — cuánto de su caja llena el contenido de un contenedor.
    ocupacionMin: 0.45,
    // D3/D26 — dos ritmos en la misma pantalla: la separación entre los hijos de
    // una región contra la de otra. 2,5 y no 2: un panel con su padding y una
    // toolbar sin caja se separan legítimamente, y 2 marcaba eso.
    razonAireRegiones: 2.5,
    // A3/C2 — un control de apoyo tomando la fila entera.
    anchoPleno: 0.92,
  },
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
                m10: [], m11: [], m12: [], m13: [], m14: [], m15: [], aceptacion: [], pantallas: 0,
                exentos: [], sinFondo: 0, cobertura: { total: 0, visibles: 0, nativos: 0 } };
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


  /* ── La vara de aceptación de pantalla · D17–D26, D1, C2 ──────────────────
     Los chequeos de arriba son de ELEMENTO: este texto contrasta poco, esta
     línea mide 140 caracteres, este target tiene 30px. Los de acá son de
     PANTALLA: no hay ningún elemento culpable en «los componentes quedaron
     gigantes» ni en «esto no está balanceado» — está en la relación entre las
     partes, y por eso hay que medir la pantalla como conjunto.

     Todo cuelga de [data-ds-screen]. Es el mismo criterio que --iterar: el
     script no sabe nada de la página, así que la página declara qué es una
     pantalla. Sin esa raíz esto no corre.

     Va entero en un try: un error acá no puede llevarse puestos F7, D3 y D8,
     que son los que ya andaban. */
  try {
    const areaDe = (e) => { const r = e.getBoundingClientRect(); return r.width * r.height; };
    const hijosVis = (e) => [...e.children].filter(vis);
    const rect = (e) => e.getBoundingClientRect();
    const med = (a) => a.length ? a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)] : 0;
    /* HSL a mano: hace falta la saturación para separar un fondo de acento de un
       gris de superficie, y getComputedStyle sólo devuelve rgb. */
    const satl = (str) => {
      const c = rgb(str); if (!c) return null;
      const r = c.r / 255, g = c.g / 255, b = c.b / 255;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
      const sat = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
      let h = 0;
      if (d) { h = mx === r ? 60 * (((g - b) / d) % 6) : mx === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4); if (h < 0) h += 360; }
      return { h, s: sat, l, a: c.a };
    };
    const CONTROL = "button, [role='button'], input:not([type='hidden']), select, textarea, [class*='chip'], [class*='btn'], [class*='tab'], [class*='seg'], [class*='toggle'], [class*='search-field'], [class*='search-bar']";
    const SETCTL = "button, [role='button'], [class*='chip'], [class*='btn'], [class*='tab'], [class*='seg'], [class*='toggle']";
    const U2 = U.aceptacion;

    const pantallas = [...document.querySelectorAll("[data-ds-screen]")].filter(vis);
    out.pantallas = pantallas.length;

    for (const scr of pantallas) {
      const A = { sel: sel(scr), hallazgos: [] };
      const flag = (el, id, dato) => { const d = marcar(el, id, dato); if (d) A.hallazgos.push({ id, ...d }); };
      const areaPantalla = areaDe(scr) || 1;

      /* Las REGIONES son el nivel estructural de la pantalla, y hay que
         encontrarlo: un wrapper no es una región. Se baja mientras haya un solo
         hijo visible, y si el nivel resulta ser una FILA —riel + contenido— se
         toma la columna más ancha, que es la columna de contenido de la que
         hablan B2 y D1. Es una heurística y está escrita como tal: el día que
         una pantalla la engañe, se declara y listo. */
      let cont = scr, guarda = 0;
      while (guarda++ < 4) { const h = hijosVis(cont); if (h.length === 1) { cont = h[0]; continue; } break; }
      let regiones = hijosVis(cont).filter((e) => areaDe(e) > 2000);
      if (regiones.length >= 2) {
        const r0 = rect(regiones[0]);
        const esFila = regiones.slice(1).some((e) => rect(e).top < r0.bottom - 1 && rect(e).left > r0.right - 1);
        if (esFila) {
          const col = regiones.slice().sort((a, b) => rect(b).width - rect(a).width)[0];
          A.columna = sel(col);
          regiones = hijosVis(col).filter((e) => areaDe(e) > 2000);
        }
      }
      A.regiones = regiones.length;

      /* ── A1 · D17 · la densidad se declara ─────────────────────────────── */
      if (!scr.closest("[data-density]") && !document.documentElement.hasAttribute("data-density"))
        flag(scr, "D17", { motivo: "la pantalla no declara data-density" });

      /* ── A2 · D18 · ningún control pesa más que el dato ─────────────────
         La fila de dato es el conjunto repetido más numeroso de la pantalla: una
         tabla, una lista, una grilla de tarjetas. Se compara contra los controles
         que están AFUERA de ese conjunto, que es el cromo. */
      let filas = null;
      const clave = (e) => e.tagName + "|" + ((e.getAttribute("class") || "").trim().split(/\s+/)[0] || "");
      for (const c of scr.querySelectorAll("*")) {
        if (!vis(c)) continue;
        const h = hijosVis(c);
        if (h.length < 3) continue;
        const k0 = clave(h[0]);
        if (!h.every((e) => clave(e) === k0)) continue;
        if (!filas || h.length > filas.items.length) filas = { cont: c, items: h };
      }
      if (filas) {
        const altoDato = med(filas.items.map((e) => rect(e).height));
        const cuerpoDato = med(filas.items.map((e) => parseFloat(getComputedStyle(e).fontSize) || 0));
        A.dato = { sel: sel(filas.cont), n: filas.items.length, alto: Math.round(altoDato), cuerpo: +cuerpoDato.toFixed(1) };
        if (altoDato > 8) {
          let peor = null;
          for (const ctl of scr.querySelectorAll(CONTROL)) {
            if (!vis(ctl) || filas.cont.contains(ctl)) continue;
            const h = rect(ctl).height;
            if (h > altoDato + U2.holguraControl && (!peor || h > peor.alto))
              peor = { control: sel(ctl), alto: Math.round(h), cuerpo: +(parseFloat(getComputedStyle(ctl).fontSize) || 0).toFixed(1) };
          }
          if (peor) flag(scr, "D18", { ...peor, altoDato: Math.round(altoDato), cuerpoDato: +cuerpoDato.toFixed(1), dato: A.dato.sel });
        }
      }

      /* ── A3 · C2 · nada de apoyo toma todo el ancho ─────────────────────
         C2 ya estaba en el catálogo y se detectaba «por regex + inspección»: el
         regex ve un `w-full` escrito, no un botón que resultó ancho. */
      for (const b of scr.querySelectorAll("button, [role='button'], a[class*='btn'], [class*='btn-']")) {
        if (!vis(b)) continue;
        const pa = b.parentElement; if (!pa) continue;
        const cs = getComputedStyle(pa);
        const ancho = rect(pa).width - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
        if (ancho > 240 && rect(b).width >= ancho * U2.anchoPleno)
          flag(b, "C2", { control: sel(b), w: Math.round(rect(b).width), contenedor: Math.round(ancho) });
      }

      /* ── B1 · D19 · un valor por cosa ──────────────────────────────────── */
      const radios = new Set(), alturas = new Set(), gaps = new Set();
      for (const e of scr.querySelectorAll("*")) {
        if (!vis(e)) continue;
        const cs = getComputedStyle(e);
        const bgA = (rgb(cs.backgroundColor) || { a: 0 }).a;
        const tieneCaja = bgA > 0.02 || (parseFloat(cs.borderTopWidth) || 0) > 0;
        const rr = parseFloat(cs.borderTopLeftRadius) || 0;
        if (tieneCaja && rr > 0 && rr < 100 && rect(e).height > 12) radios.add(Math.round(rr));
        if (cs.display.includes("flex") || cs.display.includes("grid"))
          for (const v of [cs.rowGap, cs.columnGap]) { const g = parseFloat(v) || 0; if (g > 0) gaps.add(Math.round(g)); }
      }
      for (const c of scr.querySelectorAll(CONTROL)) {
        if (!vis(c)) continue;
        const h = Math.round(rect(c).height);
        if (h > 12) alturas.add(h);
      }
      A.valores = { radios: [...radios].sort((a, b) => a - b), alturas: [...alturas].sort((a, b) => a - b), gaps: [...gaps].sort((a, b) => a - b) };
      const fuera = A.valores.gaps.filter((g) => !U2.escalaGap.includes(g));
      if (radios.size > U2.radiosMax || alturas.size > U2.alturasMax || gaps.size > U2.gapsMax || fuera.length)
        flag(scr, "D19", { radios: A.valores.radios, alturas: A.valores.alturas, gaps: A.valores.gaps, fueraDeEscala: fuera });

      /* ── C1 · D20 · hay un dominante y domina ──────────────────────────── */
      const dom = scr.querySelector("[data-ds-dominant]");
      if (!dom) flag(scr, "D20", { motivo: "la pantalla no declara data-ds-dominant" });
      else if (vis(dom)) {
        const aDom = areaDe(dom);
        const otras = regiones.filter((e) => e !== dom && !e.contains(dom) && !dom.contains(e))
          .map((e) => ({ sel: sel(e), a: areaDe(e) })).sort((x, y) => y.a - x.a);
        if (otras[0] && aDom < otras[0].a * U2.razonDominante)
          flag(dom, "D20", { motivo: "no domina por área", dominante: sel(dom), razon: +(aDom / (otras[0].a || 1)).toFixed(2), segunda: otras[0].sel });
        const elevadas = regiones.filter((e) => e !== dom && !dom.contains(e) && !e.contains(dom) && getComputedStyle(e).boxShadow !== "none");
        if (elevadas.length)
          flag(dom, "D20", { motivo: "no es la única superficie elevada", otras: elevadas.slice(0, 3).map(sel).join(" · ") });
      }

      /* ── C2 · D21 · un conjunto repetido, todo en peso fuerte ───────────
         El caso de todos los días: cinco chips de filtro en 600. No son cinco
         filtros importantes, son cinco que se anularon entre sí — y cuando uno se
         active no queda peso libre para decirlo. Sólo CONTROLES: una columna de
         datos en 600 puede ser correcta (III·c), un riel de filtros no. */
      for (const c of scr.querySelectorAll("*")) {
        if (!vis(c)) continue;
        const h = hijosVis(c);
        if (h.length < 3 || !h.every((e) => e.matches(SETCTL))) continue;
        if (c.closest("thead, [role='columnheader']")) continue;
        const pesos = h.map((e) => parseInt(getComputedStyle(e).fontWeight, 10) || 400);
        if (pesos.every((pp) => pp >= 600))
          flag(c, "D21", { conjunto: sel(c), n: h.length, peso: pesos[0] });
      }

      /* ── C2 · D22 · tres portadores en un mismo elemento ────────────────
         Los portadores son cuatro —peso, tamaño, color, superficie— y se gastan
         de a uno; la apertura puede tomar dos. Un container CON su texto `on-`
         cuenta como uno solo: el badge del sistema es peso + superficie y está
         bien. Tres es peso + tamaño + superficie, que ya es grito. */
      const cuerpos = [];
      const conTexto = [];
      for (const e of scr.querySelectorAll("*")) {
        if (!vis(e)) continue;
        if (![...e.childNodes].some((nd) => nd.nodeType === 3 && nd.textContent.trim())) continue;
        conTexto.push(e);
        cuerpos.push(parseFloat(getComputedStyle(e).fontSize) || 0);
      }
      const cuerpoMed = med(cuerpos) || 14;
      A.cuerpoMediano = +cuerpoMed.toFixed(1);
      for (const e of conTexto) {
        if (e.closest("[data-ds-rank^='1']")) continue;
        const cs = getComputedStyle(e);
        const port = [];
        if ((parseInt(cs.fontWeight, 10) || 400) >= 600) port.push("peso");
        if ((parseFloat(cs.fontSize) || 0) >= cuerpoMed * U2.razonTamano) port.push("tamaño");
        const bg = satl(cs.backgroundColor);
        const sup = (bg && bg.a > 0.04) || cs.boxShadow !== "none";
        if (sup) port.push("superficie");
        else { const col = satl(cs.color); if (col && col.s > 0.25 && col.l > 0.15 && col.l < 0.85) port.push("color"); }
        if (port.length > U2.portadoresMax)
          flag(e, "D22", { el: sel(e), portadores: port.join(" + "), texto: e.textContent.replace(/\s+/g, " ").trim().slice(0, 28) });
      }

      /* ── C3 · D23 · el color se gasta por rango ─────────────────────────
         Familias de tono en cubos de 30°: dos azules distintos son un azul. Y el
         fill sólido de marca, que es uno por pantalla: se cuenta por «saturado,
         oscuro y chico» — una barra lateral oscura es una superficie, no un fill,
         así que queda afuera por tamaño. */
      const tonos = new Map(); let fills = 0;
      for (const e of scr.querySelectorAll("*")) {
        if (!vis(e)) continue;
        const bg = satl(getComputedStyle(e).backgroundColor);
        if (!bg || bg.a < 0.06 || bg.s < 0.15) continue;
        const fam = (Math.round(bg.h / 30) * 30) % 360;
        tonos.set(fam, (tonos.get(fam) || 0) + 1);
        const ar = areaDe(e);
        if (bg.l < 0.35 && ar > 1200 && ar < areaPantalla * 0.15) fills++;
      }
      A.tonos = [...tonos.keys()].sort((a, b) => a - b);
      if (tonos.size > U2.tonosMax)
        flag(scr, "D23", { motivo: "tonos de acento simultáneos", n: tonos.size, familias: A.tonos.join("° · ") + "°" });
      if (fills > 1)
        flag(scr, "D23", { motivo: "más de un fill sólido de marca", n: fills });

      /* ── D1 · D24 · tres niveles de aire con salto real ─────────────────
         Hermano de D15 y no su duplicado: D15 marca cuando adentro separa IGUAL o
         más que afuera; esto marca cuando afuera gana pero no se ve que gane. */
      for (const c of scr.querySelectorAll("*")) {
        if (!vis(c)) continue;
        const h = hijosVis(c);
        if (h.length < 2) continue;
        const rs = h.map(rect);
        let apilado = true; const dentro = [];
        for (let i = 1; i < rs.length; i++) {
          const a = rs[i - 1], b = rs[i];
          if (b.top < a.bottom - 1) { apilado = false; break; }
          dentro.push(b.top - a.bottom);
        }
        if (!apilado || !dentro.length) continue;
        const sig = c.nextElementSibling;
        if (!sig || !vis(sig)) continue;
        const afuera = rect(sig).top - rect(c).bottom;
        const maxD = Math.max(...dentro);
        if (maxD > 2 && afuera > maxD + 0.5 && afuera < maxD * U2.razonAire)
          flag(c, "D24", { sel: sel(c), adentro: Math.round(maxD), afuera: Math.round(afuera), razon: +(afuera / maxD).toFixed(2) });
      }

      /* ── D2 · D25 · nada se estira sobre vacío ──────────────────────────── */
      for (const c of scr.querySelectorAll("*")) {
        if (!vis(c)) continue;
        const cs = getComputedStyle(c);
        const h = hijosVis(c);
        if (cs.display.includes("grid")) {
          const cols = (cs.gridTemplateColumns || "").split(" ").filter(Boolean).length;
          if (cols >= 2 && h.length > cols && h.length % cols === 1)
            flag(c, "D25", { motivo: "fila huérfana", sel: sel(c), cols, items: h.length });
        }
        const bgA = (rgb(cs.backgroundColor) || { a: 0 }).a;
        const caja = bgA > 0.02 || (parseFloat(cs.borderTopWidth) || 0) > 0;
        const rc = rect(c);
        if (caja && rc.width * rc.height > 40000 && h.length) {
          /* El vacío que importa es el de ALTO: un contenedor con el doble de alto
             que su contenido es el «marco alrededor de nada». El ancho sobrante es
             otra cosa —una fila con holgura al costado— y marcarlo daba falsos
             positivos en cualquier leyenda o pie de panel. */
          const tops = h.map((e) => rect(e).top), bots = h.map((e) => rect(e).bottom);
          const altoHijos = Math.max(...bots) - Math.min(...tops);
          if (rc.height > 0 && altoHijos / rc.height < U2.ocupacionMin)
            flag(c, "D25", { motivo: "contenedor mayormente vacío", sel: sel(c), ocupacion: +(altoHijos / rc.height).toFixed(2) });
        }
      }

      /* ── D3 · D26 · el aire está repartido ─────────────────────────────── */
      /* El aire de una región es la separación entre sus hijos —su ritmo—, no el
         área que sobra: el padding de un panel es legítimo y no tiene por qué
         igualar al de una toolbar sin caja. Lo que no puede haber son dos ritmos
         distintos en la misma pantalla. */
      const aires = regiones
        .map((e) => {
          const h = hijosVis(e);
          if (h.length < 2) return null;
          const rs = h.map(rect), hu = [];
          for (let i = 1; i < rs.length; i++) {
            if (rs[i].top < rs[i - 1].bottom - 1) return null;   // no es una pila
            hu.push(rs[i].top - rs[i - 1].bottom);
          }
          const g = med(hu);
          return g >= 4 ? { sel: sel(e), aire: g } : null;
        })
        .filter(Boolean);
      if (aires.length >= 2) {
        aires.sort((a, b) => b.aire - a.aire);
        const alto = aires[0], bajo = aires[aires.length - 1];
        if (alto.aire / bajo.aire > U2.razonAireRegiones)
          flag(scr, "D26", { masAire: alto.sel, menosAire: bajo.sel, razon: +(alto.aire / bajo.aire).toFixed(1),
                             gaps: Math.round(alto.aire) + "px contra " + Math.round(bajo.aire) + "px" });
      }

      /* ── B2 · D1 · una sola columna de contenido ────────────────────────
         Estaba en el catálogo desde el principio con «inspección visual» en la
         columna de detección. La moda de los bordes es la columna; lo que se
         aparta más de 2px se aparta. `data-ds-bleed` es la salida declarada para
         una banda que sí va de borde a borde. */
      if (regiones.length >= 3) {
        const izq = regiones.map((e) => Math.round(rect(e).left));
        const der = regiones.map((e) => Math.round(rect(e).right));
        const moda = (arr) => { const m = new Map(); for (const v of arr) m.set(v, (m.get(v) || 0) + 1); return [...m.entries()].sort((x, y) => y[1] - x[1])[0][0]; };
        const mi = moda(izq), md = moda(der);
        regiones.forEach((e, i) => {
          if (e.hasAttribute("data-ds-bleed")) return;
          if (Math.abs(izq[i] - mi) > 2 || Math.abs(der[i] - md) > 2)
            flag(e, "D1", { region: sel(e), bordes: izq[i] + "–" + der[i], columna: mi + "–" + md });
        });
      }

      out.aceptacion.push(A);
    }
  } catch (e) {
    out.aceptacionError = String((e && e.message) || e);
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

  /* ── M10 · la jerarquia la hace la superficie, no la linea ──────────────
     MOBILE.md §6b·1: el fondo de la pantalla es --surface y cada bloque va
     en --surface-container. Un <hr> separando secciones es un reflejo de
     web; un bloque con borde pero el MISMO fondo que la pantalla tambien: esta
     dibujando el limite con una linea en vez de con el escalon. */
  for (const nat of document.querySelectorAll("[data-platform='native']")) {
    if (!vis(nat)) continue;
    const bgPantalla = fondo(nat);
    for (const hr of nat.querySelectorAll("hr")) {
      if (!vis(hr)) continue;
      const d = marcar(hr, "M10", { sel: sel(hr), motivo: "un <hr> separa secciones" });
      if (d) out.m10.push(d);
    }
    if (!bgPantalla) continue;
    for (const hijo of nat.children) {
      if (!vis(hijo)) continue;
      if (hijo.tagName === "HR") continue;          // ya contado arriba, no dos veces
      const cs = getComputedStyle(hijo);
      const tieneBorde = ["Top", "Bottom"].some((l) =>
        parseFloat(cs["border" + l + "Width"]) > 0 && cs["border" + l + "Style"] !== "none");
      if (!tieneBorde) continue;
      const bg = fondo(hijo);
      if (!bg) continue;
      const igual = bg.r === bgPantalla.r && bg.g === bgPantalla.g && bg.b === bgPantalla.b;
      if (!igual) continue;
      const d = marcar(hijo, "M10", { sel: sel(hijo), motivo: "bloque con borde y el mismo fondo que la pantalla: separa por linea, no por superficie" });
      if (d) out.m10.push(d);
    }
  }

  /* ── M11 · lo que es una lista va en una lista agrupada ──────────────────
     §6b·2: un conjunto de pares etiqueta/dato va DENTRO de una tarjeta. Una
     .screen-row suelta sobre el fondo es la falla literal. */
  for (const row of document.querySelectorAll(".screen-row")) {
    if (!vis(row)) continue;
    if (row.closest(".screen-group")) continue;
    const d = marcar(row, "M11", { sel: sel(row), motivo: "fila etiqueta/dato fuera de un .screen-group" });
    if (d) out.m11.push(d);
  }

  /* ── M12 · el header de seccion va AFUERA del grupo ──────────────────────
     §6b·3: caption/600/muted y alineado al borde del grupo. Adentro de la
     tarjeta compite con los datos y gana la etiqueta, que es justo lo que no se
     quiere. Se chequean las dos mitades: donde esta, y a que cuerpo esta puesto. */
  {
    for (const h of document.querySelectorAll(".screen-section-header")) {
      if (!vis(h)) continue;
      const cs = getComputedStyle(h);
      // El caption se lee DESDE EL ELEMENTO, no desde :root: adentro de
      // [data-platform="native"] la escala sube, y leer la del root marcaba
      // headers correctos por estar "a 13px cuando caption es 12". Es la misma
      // trampa que M5 — usar la escala de escritorio en territorio nativo.
      const caption = parseFloat(cs.getPropertyValue("--font-size-caption")) || 12;
      const motivos = [];
      if (h.closest(".screen-group")) motivos.push("esta ADENTRO del grupo");
      const px = parseFloat(cs.fontSize);
      if (px > caption + 0.5) motivos.push(`esta a ${px}px y el rol es caption (${caption}px)`);
      if (!motivos.length) continue;
      const d = marcar(h, "M12", { sel: sel(h), motivo: motivos.join(" y ") });
      if (d) out.m12.push(d);
    }
  }

  /* ── M14 · la accion primaria se ancla abajo ─────────────────────────────
     §6b·6: fuera del scroll. Un boton al final del contenido obliga a scrollear
     para poder actuar, y en una lista larga desaparece. Se marca cuando la
     primaria de una pantalla nativa fluye con el contenido —posicion static y
     sin .screen-action alrededor— en vez de estar anclada. */
  for (const nat of document.querySelectorAll("[data-platform='native']")) {
    if (!vis(nat)) continue;
    for (const btn of nat.querySelectorAll(".btn-primary")) {
      if (!vis(btn)) continue;
      if (btn.closest(".screen-action")) continue;
      let anclado = false;
      for (let n = btn; n && n !== nat.parentElement; n = n.parentElement) {
        const pos = getComputedStyle(n).position;
        if (pos === "sticky" || pos === "fixed" || pos === "absolute") { anclado = true; break; }
      }
      if (anclado) continue;
      const d = marcar(btn, "M14", { sel: sel(btn), motivo: "la primaria fluye con el contenido en vez de estar anclada (.screen-action o posicion fija)" });
      if (d) out.m14.push(d);
    }
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
const sinRaiz = new Map();      // file -> cuántas [data-ds-screen] se encontraron
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
                m10: [], m11: [], m12: [], m13: [], m14: [], m15: [], aceptacion: [], pantallas: 0,
                exentos: [], sinFondo: 0, cobertura: { total: 0, visibles: 0, nativos: 0 } };
    for (const vista of vistas) {
      if (vista != null && APLICAR) {
        try {
          await page.evaluate(`(() => { const ID = ${JSON.stringify(vista)}; try { ${APLICAR}; } catch (e) {} })()`);
          await page.waitForTimeout(120);
        } catch { /* una vista que no abre no rompe el resto */ }
      }
      const parcial = await page.evaluate(SONDA, UMBRAL);
      for (const k of ["contraste", "medida", "targets", "proximidad", "anidadas", "etiquetas", "m10", "m11", "m12", "m13", "m14", "m15", "aceptacion", "exentos"])
        r[k].push(...parcial[k]);
      r.pantallas = Math.max(r.pantallas, parcial.pantallas || 0);
      if (parcial.aceptacionError) r.aceptacionError = parcial.aceptacionError;

      /* Y de nuevo en OSCURO, solo para lo que depende del color.
         Sin esto, el contraste se medía únicamente en claro — y la mitad de las
         fallas de color del sistema viven en oscuro: un `color-mix(container 42%,
         surface)` a nivel componente mueve el FONDO y deja el texto donde estaba,
         y eso ni [15] lo ve (lee variables.css, no el componente) ni lo veía este
         chequeo. El tema va en <html>, que es donde el DS lo documenta. */
      if (vp.nombre === "1440") {
        // Solo si la pagina REACCIONA al tema. Una pagina sin modo oscuro no cambia
        // nada al ponerle el atributo, y medirla igual reportaria sus colores claros
        // como si fueran un oscuro roto. Se comprueba mirando si el fondo se movio.
        const reacciona = await page.evaluate(() => {
          const antes = getComputedStyle(document.body).backgroundColor;
          document.documentElement.setAttribute("data-theme", "dark");
          const despues = getComputedStyle(document.body).backgroundColor;
          if (antes === despues) { document.documentElement.removeAttribute("data-theme"); return false; }
          return true;
        });
        /* Sin modo oscuro no hay segundo pase, pero el primero SÍ se midió: el
           `continue` que había acá se saltaba también la cobertura de abajo, y una
           página sin tema oscuro reportaba "0 de 0 elementos (0%)" con la nota de
           que el resto estaba oculto. Se medía entera; faltaba el conteo. */
        if (reacciona) {
          await page.waitForTimeout(120);
          const osc = await page.evaluate(SONDA, UMBRAL);
          for (const c of osc.contraste) r.contraste.push({ ...c, tema: "oscuro" });
          for (const m of osc.m13) r.m13.push({ ...m, tema: "oscuro" });
          r.exentos.push(...osc.exentos);
          await page.evaluate(() => document.documentElement.removeAttribute("data-theme"));
          await page.waitForTimeout(80);
        } else {
          r.sinOscuro = true;
        }
      }
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
        const k = `${c.sel}|${c.ratio}|${c.tema || "claro"}`;
        if (vistos.has(k)) continue;
        vistos.add(k);
        add("F7", "ALTA", file,
            `contraste por debajo de AA en ${c.tema || "claro"} (${c.ratio}:1, piso ${c.piso}:1 a ${c.px}px)`,
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

    /* La vara de aceptación · una sola vez, en 1440: son relaciones entre
       regiones y el pase de 375px es otra composición, no la misma peor dibujada.
       Cada hallazgo trae su severidad de FAILURES.md. */
    if (vp.nombre === "1440") {
      const SEV = { D17: "ALTA", D18: "ALTA", D19: "ALTA", D20: "ALTA", D21: "ALTA", D22: "ALTA",
                    D23: "MEDIA", D24: "MEDIA", D25: "MEDIA", D26: "MEDIA", D1: "ALTA", C2: "ALTA" };
      const DESC = {
        D17: (h) => [h.motivo, "los controles salen del default en vez de la densidad de la pantalla"],
        D18: (h) => [`el control pesa más que el dato: ${h.alto}px contra una fila de ${h.altoDato}px`,
                     `${h.control} sobre ${h.dato} (cuerpo ${h.cuerpo} vs ${h.cuerpoDato})`],
        D19: (h) => [`más de un valor para la misma cosa: ${h.radios.length} radio(s), ${h.alturas.length} altura(s) de control, ${h.gaps.length} gap(s)`,
                     `radios ${h.radios.join("/")} · alturas ${h.alturas.join("/")} · gaps ${h.gaps.join("/")}` +
                     (h.fueraDeEscala.length ? ` · fuera de escala: ${h.fueraDeEscala.join("/")}` : "")],
        D20: (h) => [`el dominante ${h.motivo}`,
                     h.segunda ? `${h.dominante} ${h.razon}× la segunda (${h.segunda}), mínimo 1,5×` : (h.otras || h.dominante || "")],
        D21: (h) => [`${h.n} controles hermanos, todos en peso ${h.peso}: el peso deja de poder marcar el activo`, h.conjunto],
        D22: (h) => [`tres portadores de énfasis en un elemento: ${h.portadores}`, `${h.el} — “${h.texto}”`],
        D23: (h) => [h.motivo === "tonos de acento simultáneos" ? `${h.n} familias de tono compitiendo (máximo 4)` : `${h.motivo}: ${h.n}`,
                     h.familias || ""],
        D24: (h) => [`el salto de aire no se ve: ${h.adentro}px adentro contra ${h.afuera}px afuera (${h.razon}×, mínimo 1,75×)`, h.sel],
        D25: (h) => [h.motivo === "fila huérfana" ? `fila huérfana: ${h.items} ítems en ${h.cols} columnas` : `contenedor mayormente vacío: el contenido ocupa el ${Math.round(h.ocupacion * 100)}%`, h.sel],
        D26: (h) => [`dos ritmos en la misma pantalla: una región separa ${h.razon}× más que otra (${h.gaps})`, `${h.masAire} contra ${h.menosAire}`],
        D1:  (h) => ["región fuera de la columna de contenido", `${h.region} en ${h.bordes} — la columna es ${h.columna}`],
        C2:  (h) => [`control de apoyo tomando la fila entera: ${h.w}px de ${h.contenedor}px`, h.control],
      };
      for (const A of r.aceptacion)
        for (const h of A.hallazgos) {
          const f = DESC[h.id]; if (!f) continue;
          const [desc, ev] = f(h);
          add(h.id, SEV[h.id] || "MEDIA", file, desc, ev, vp.nombre);
        }
      if (r.aceptacionError) console.warn(`! la vara de aceptación falló en ${path.basename(file)}: ${r.aceptacionError}`);
      sinRaiz.set(file, r.pantallas);
    }

    // M13 / M15 · nativo — una sola vez, no dependen del ancho
    if (vp.nombre === "1440") {
      for (const m of r.m13)
        add("M13", "ALTA", file, `la etiqueta pesa más que su dato en ${m.tema || "claro"}: ${m.motivos}`, m.sel, vp.nombre);
      for (const m of r.m10)
        add("M10", "MEDIA", file, `separación por línea en vez de por superficie — ${m.motivo}`, m.sel, vp.nombre);
      for (const m of r.m11)
        add("M11", "MEDIA", file, `${m.motivo}`, m.sel, vp.nombre);
      for (const m of r.m12)
        add("M12", "MEDIA", file, `header de sección: ${m.motivo}`, m.sel, vp.nombre);
      for (const m of r.m14)
        add("M14", "MEDIA", file, `${m.motivo}`, m.sel, vp.nombre);
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
  for (const [f, cu] of sinRaiz)
    if (!cu)
      console.log(`[aceptación] ${path.basename(f)} — sin [data-ds-screen]: los doce criterios de aceptación NO se midieron` +
        `\n    una pantalla de producto lo declara en su raíz; el catálogo del DS y una landing no son pantallas y por eso quedan afuera`);
  for (const e of exenciones.values())
    console.log(`[${e.id} · EXCEPCIÓN DECLARADA] ${path.basename(e.file)} — ${e.sel}\n    ${e.motivo}`);
  console.log(`\nBLOQUEANTES ${summary.BLOQ} · ALTAS ${summary.ALTA} · MEDIAS ${summary.MEDIA} · total ${summary.total}` +
    (exenciones.size ? ` · ${exenciones.size} excepción(es) declarada(s)` : ""));
  console.log("Lo que sigue sin medirse —«cero relleno», la regla 4, las inversiones de §4b, y de la vara de aceptación el criterio B3 (un concepto, un patrón)— es criterio, no umbral: lo juzgan `review` y las tres pruebas de ojo de guidelines/aceptacion-de-pantalla.md §3.");
}

process.exit(summary.BLOQ > 0 ? 1 : 0);
