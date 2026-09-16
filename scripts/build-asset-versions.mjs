#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   build-asset-versions.mjs — el ?v= de cada hoja sale del contenido

   El sitio versiona sus hojas a mano: `css/variables.css?v=10`. La mano falla
   en silencio y de la peor manera: en sep 2026 el commit 71668d4 agregó
   `--rail-width` a variables.css y movió el riel de 72 a 112, pero no tocó el
   `?v=10`. El HTML ya pedía `var(--rail-width)` y el navegador seguía sirviendo
   la hoja vieja de su caché, sin ese token. Resultado, para cualquiera que
   hubiera abierto el sitio antes: `width: var(--rail-width)` invalido → el riel
   se dimensiona solo, `left: var(--rail-width)` invalido → el drawer aterriza
   en x=0 y el riel le tapa media palabra a cada item del menu. El sitio no
   estaba roto en el repo; estaba roto en la pantalla de la gente.

   Un numero que alguien tiene que acordarse de subir no es una version: es una
   promesa. Esto lo deriva del contenido, que es lo unico que no se olvida.

   No se resuelve con `var(--rail-width, 112px)`: eso vuelve a escribir el 112
   en cinco lugares, que es exactamente lo que ese commit habia venido a sacar.
   ═══════════════════════════════════════════════════════════════════════════ */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

const HTML = "index.html";
const sello = (ruta) =>
  createHash("md5").update(readFileSync(ruta)).digest("hex").slice(0, 8);

export function versionar({ escribir = true } = {}) {
  let html = readFileSync(HTML, "utf8");
  const antes = html;
  const tocados = [];

  html = html.replace(
    /(<link[^>]*href=")([^"?]+\.css)(\?v=([A-Za-z0-9.]+))?(")/g,
    (todo, pre, ruta, _q, vieja, post) => {
      if (!existsSync(ruta)) return todo;               // hoja externa o ruta rara
      const nueva = sello(ruta);
      if (vieja !== nueva) tocados.push({ ruta, vieja: vieja ?? "(sin ?v=)", nueva });
      return `${pre}${ruta}?v=${nueva}${post}`;
    }
  );

  if (escribir && html !== antes) writeFileSync(HTML, html);
  return { tocados, cambio: html !== antes, html };
}

/* pathToFileURL, no `file://${argv[1]}`: la ruta del repo tiene espacios y
   import.meta.url los trae percent-encoded — la comparacion cruda da falso
   siempre y el script corria sin hacer nada, en silencio. */
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { tocados } = versionar();
  if (!tocados.length) console.log("✓ los ?v= ya salen del contenido de cada hoja");
  else {
    for (const t of tocados) console.log(`  ${t.ruta}: ${t.vieja} → ${t.nueva}`);
    console.log(`✓ ${tocados.length} hoja(s) reselladas en index.html`);
  }
}
