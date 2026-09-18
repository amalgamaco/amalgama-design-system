#!/usr/bin/env python3
"""
sync-color-docs.py — las tablas de color del sitio salen de variables.css.

Por qué existe. Las fichas de Baseline y Color Roles en index.html tienen los hex
TIPEADOS A MANO en el HTML. Eso las volvió una segunda fuente de verdad que derivó
de la primera sin que nadie se enterara: en sep-2026 nueve celdas decían un valor
distinto al del CSS, y esa tabla se usó como si fuera la fuente. Se alinearon los
tokens reales contra la documentación vieja y hubo que revertir.

Este script cierra ese agujero: reescribe las celdas desde css/variables.css.
La tabla pasa a ser una vista, no una fuente.

  python3 scripts/sync-color-docs.py            # corrige index.html
  python3 scripts/sync-color-docs.py --check    # no escribe; sale 1 si hay drift

Qué toca, y sólo esto:
  · <span class="ds-sem-hex">#XXXXXX</span> y el swatch de al lado, en las filas
    de la tabla semántica (las que declaran emb.color.X<span>--color-X</span>).
  · Los chips y el nombre de primitiva de las fichas .ds-cr-card.
No toca prosa, ni ejemplos, ni las tablas de paleta primitiva (ésas SON el valor).
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
CSS  = ROOT / "css" / "variables.css"
HTML = ROOT / "index.html"
CHECK = "--check" in sys.argv

# ── el valor real de cada rol, resuelto desde variables.css ─────────────────
def bloques():
    nc = re.sub(r"/\*.*?\*/", "", CSS.read_text(), flags=re.S)
    def blk(sel):
        m = re.search(r"(?m)^%s\s*\{" % re.escape(sel), nc)
        if not m: return {}
        j = m.end() - 1; k = j; d = 0
        while True:
            if nc[k] == "{": d += 1
            elif nc[k] == "}":
                d -= 1
                if d == 0: break
            k += 1
        return {mm.group(1): " ".join(mm.group(2).split())
                for mm in re.finditer(r"--([A-Za-z0-9_-]+)\s*:\s*([^;]+);", nc[j+1:k])}
    return blk(":root"), blk('[data-theme="dark"]'), blk('[data-theme="light"]')

RAIZ, DARK, LIGHT = bloques()
L = {**RAIZ, **LIGHT}
D = {**RAIZ, **DARK}

def resolver(scope, nombre, cadena=False):
    """Devuelve el hex final, o (hex, primitiva) si cadena=True."""
    v = scope.get(nombre); ultima = None
    for _ in range(24):
        if v is None: return (None, None) if cadena else None
        m = re.fullmatch(r"var\(\s*--([A-Za-z0-9_-]+)\s*\)", v.strip())
        if not m: break
        ultima = m.group(1); v = scope.get(ultima)
    v = (v or "").strip()
    hexv = v.upper() if re.fullmatch(r"#[0-9A-Fa-f]{3,8}", v) else None
    return (hexv, ultima) if cadena else hexv

cambios, drift = 0, []
html = HTML.read_text()

# ── 1. tabla semántica: emb.color.X<span>--color-X</span> + dos celdas ──────
FILA = re.compile(
    r'(?P<a><span class="ds-sem-tok">[^<]*<span>--(?P<tok>[a-z0-9-]+)</span></span></td>'
    r'<td><div class="ds-sem-cell"><span class="ds-sem-sw" style="background:)(?P<lsw>#[0-9A-Fa-f]{6})'
    r'(?P<b>"></span><span class="ds-sem-hex">)(?P<lhex>#[0-9A-Fa-f]{6})'
    r'(?P<c></span></div></td><td><div class="ds-sem-cell"><span class="ds-sem-sw" style="background:)(?P<dsw>#[0-9A-Fa-f]{6})'
    r'(?P<d>"></span><span class="ds-sem-hex">)(?P<dhex>#[0-9A-Fa-f]{6})')

def fix_fila(m):
    global cambios
    tok = m.group("tok")
    rl, rd = resolver(L, tok), resolver(D, tok)
    if not rl or not rd:                      # color-mix, rgba: la tabla lo escribe a mano
        return m.group(0)
    # se comparan las CUATRO: el swatch puede derivar sin que el texto lo haga
    actuales = [m.group("lsw").upper(), m.group("lhex").upper(),
                m.group("dsw").upper(), m.group("dhex").upper()]
    if actuales != [rl, rl, rd, rd]:
        drift.append(f"--{tok}: tabla {m.group('lsw')}/{m.group('lhex')} · "
                     f"{m.group('dsw')}/{m.group('dhex')} → css {rl}/{rd}")
        cambios += 1
    return m.group("a") + rl + m.group("b") + rl + m.group("c") + rd + m.group("d") + rd

html = FILA.sub(fix_fila, html)

# ── 2. fichas de Color Roles: chip + nombre de la primitiva ────────────────
CARD = re.compile(
    r'(?P<a><div class="ds-cr-tok">[^<]*·\s*--(?P<tok>[a-z0-9-]+)</div>'
    r'<div class="ds-cr-vals"><span class="ds-cr-val"><b>Light</b><span class="ds-cr-chip" style="background:)'
    r'(?P<lc>#[0-9A-Fa-f]{6})(?P<b>"></span>)(?P<ln>[a-z0-9-]+)'
    r'(?P<c></span><span class="ds-cr-val"><b>Dark</b><span class="ds-cr-chip" style="background:)'
    r'(?P<dc>#[0-9A-Fa-f]{6})(?P<d>"></span>)(?P<dn>[a-z0-9-]+)')

def fix_card(m):
    global cambios
    tok = m.group("tok")
    hl, pl = resolver(L, tok, cadena=True)
    hd, pd = resolver(D, tok, cadena=True)
    if not hl or not hd: return m.group(0)
    pl, pd = pl or m.group("ln"), pd or m.group("dn")
    if (m.group("lc").upper() != hl or m.group("dc").upper() != hd
            or m.group("ln") != pl or m.group("dn") != pd):
        drift.append(f"--{tok} (ficha): {m.group('lc')}/{m.group('ln')} → {hl}/{pl} · "
                     f"{m.group('dc')}/{m.group('dn')} → {hd}/{pd}")
        cambios += 1
    return m.group("a") + hl + m.group("b") + pl + m.group("c") + hd + m.group("d") + pd

html = CARD.sub(fix_card, html)

# ── salida ─────────────────────────────────────────────────────────────────
if CHECK:
    if drift:
        print(f"✗ {len(drift)} celda(s) de color derivaron de variables.css:")
        for d in drift: print("   " + d)
        print("  Corré: python3 scripts/sync-color-docs.py")
        sys.exit(1)
    print("✓ las tablas de color dicen lo mismo que variables.css")
    sys.exit(0)

if cambios:
    HTML.write_text(html)
    print(f"✓ {cambios} celda(s) sincronizada(s) desde variables.css:")
    for d in drift: print("   " + d)
else:
    print("✓ nada que sincronizar: las tablas ya dicen lo mismo que variables.css")
