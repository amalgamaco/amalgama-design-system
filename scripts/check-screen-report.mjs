#!/usr/bin/env node
/**
 * check-screen-report.mjs — verifica que el diagnóstico de una pantalla sea real.
 *
 * Por qué existe
 * ──────────────
 * `validate-ds.mjs` mide tokens y clases. Una pantalla re-skineada —los mismos
 * bloques en el mismo orden, ahora con componentes de Embassy— pasa ese check
 * entera. Ese es exactamente el modo de falla que reportó el equipo: "cambia los
 * componentes pero no el sentido de la pantalla".
 *
 * Lo que se chequea acá es el DIAGNÓSTICO, no el CSS: que exista el encuadre, que
 * cada problema cite la ley que rompe, y que haya movimientos —o, si no los hay,
 * la defensa explícita de por qué la estructura ya estaba bien.
 *
 * Uso:  node scripts/check-screen-report.mjs diagnostico.md
 *       … | node scripts/check-screen-report.mjs -
 */

import fs from "node:fs";

const VERBOS = ["RESECUENCIAR","INTRODUCIR-JERARQUÍA","INTRODUCIR-JERARQUIA","AGRUPAR","UNIFICAR",
  "DIVIDIR","MOVER","REEMPLAZAR","ELIMINAR","REVELAR-PROGRESIVAMENTE","ALINEAR","AGREGAR-ESTADO"];
const ENCUADRE = ["OBJETIVO","OBJETO","ACCIONES","PATRÓN","RESPONSIVE","ESTADOS"];
const LEYES = /Nielsen|Hick|Fitts|Miller|Von Restorff|Progressive Disclosure|Peak-End|carga cognitiva|jerarquía visual|chunking|GOVERNANCE|Ley \d|ley \d/i;

const arg = process.argv[2];
if (!arg) { console.error("uso: node scripts/check-screen-report.mjs <archivo.md|->"); process.exit(2); }
const txt = arg === "-" ? fs.readFileSync(0, "utf8") : fs.readFileSync(arg, "utf8");

const fallas = [], avisos = [];

// 1 · Encuadre completo
const faltan = ENCUADRE.filter((k) => !new RegExp(`^\\s*${k}\\b`, "mi").test(txt));
if (faltan.length) fallas.push(`faltan líneas del encuadre: ${faltan.join(", ")}`);

// 2 · Movimientos con verbo
const movs = VERBOS.flatMap((v) => [...txt.matchAll(new RegExp(`\\b${v}\\b`, "g"))].map(() => v));
const defensa = /ya estaba bien|no hay movimientos|estructura correcta|se conserva/i.test(txt);

if (!movs.length && !defensa) {
  fallas.push("cero movimientos y ninguna defensa de por qué la estructura ya estaba bien — esto es un re-skin, no un rediseño");
} else if (!movs.length) {
  avisos.push("cero movimientos, con defensa declarada: verificá que la defensa cubra jerarquía, agrupación, secuencia y estados");
}

// 3 · Cada problema con su ley
const problemas = [...txt.matchAll(/^\s*\d+\.\s+(.+)$/gm)].length;
const leyes = [...txt.matchAll(new RegExp(LEYES.source, "gi"))].length;
if (problemas && leyes < problemas)
  fallas.push(`${problemas} problema(s) listados pero solo ${leyes} cita(s) de una ley o regla — cada problema tiene que decir cuál rompe`);

// 4 · Estados
if (!/vac[íi]o/i.test(txt) || !/error/i.test(txt))
  avisos.push("el diagnóstico no menciona estado vacío y/o de error — son los que más se olvidan");

// 5 · Mobile como transformación
if (/RESPONSIVE/i.test(txt) && /(shrink|achicad|encogid|responsive autom)/i.test(txt))
  avisos.push("mobile descrito como un encogimiento: tiene que ser una estructura propia");

for (const f of fallas) console.log(`✗ ${f}`);
for (const a of avisos) console.log(`! ${a}`);
console.log(`\n${fallas.length ? "✗" : "✓"} diagnóstico: ${fallas.length} falla(s), ${avisos.length} aviso(s)` +
  `  ·  ${movs.length} movimiento(s): ${[...new Set(movs)].join(", ") || "ninguno"}`);
process.exit(fallas.length ? 1 : 0);
