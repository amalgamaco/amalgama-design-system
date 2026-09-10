#!/usr/bin/env python3
"""Regenerate component-rules/manifest.json and INDEX.md from the per-component frontmatter.

The component-rules/<id>.md files are the source of truth; this script derives
the machine-readable registry (manifest.json) that skills / UI-generation
workflows consume, plus the human-readable INDEX.md. Run from the repo root:  python3 scripts/build-manifest.py
Requires PyYAML (pip3 install pyyaml).
"""
import os, json, glob, sys
try:
    import yaml
except ImportError:
    sys.exit("PyYAML required: pip3 install pyyaml")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RULES = os.path.join(ROOT, "component-rules")
files = [f for f in glob.glob(os.path.join(RULES, "*.md"))
         if os.path.basename(f) not in ("README.md", "INDEX.md")]

comps, errors = [], []
for f in sorted(files):
    txt = open(f, encoding="utf-8").read()
    if not txt.startswith("---"):
        errors.append(f"{f}: no frontmatter"); continue
    try:
        d = yaml.safe_load(txt.split("---", 2)[1])
    except Exception as e:
        errors.append(f"{f}: YAML error {e}"); continue
    rel = os.path.relpath(f, ROOT)
    entry = {
        "id": d.get("id"), "display_name": d.get("display_name"),
        "category": d.get("category"), "status": d.get("status", "stable"),
        "aliases": d.get("aliases", []), "summary": d.get("summary"),
        "variants": [v.get("name") if isinstance(v, dict) else v for v in (d.get("variants") or [])],
        "sizes": [s.get("name") if isinstance(s, dict) else s for s in (d.get("sizes") or [])],
        "states": list((d.get("states") or {}).keys()) if isinstance(d.get("states"), dict) else (d.get("states") or []),
        "tokens": d.get("tokens", {}), "relationships": d.get("relationships", {}),
        "motion": d.get("motion", {}), "source": d.get("source", {}), "rules_file": rel,
    }
    missing = [k for k in ("id", "display_name", "category", "status", "summary") if not entry.get(k)]
    if missing:
        errors.append(f"{rel}: missing frontmatter {missing}")
    comps.append(entry)

manifest = {
    "note": "Machine-readable registry. Source of truth = component-rules/<id>.md frontmatter (schema in component-rules/README.md). Regenerate with scripts/build-manifest.py.",
    "count": len(comps), "components": comps,
}
# --out redirige la salida sin tocar el archivo versionado (chequeo [12] de validate-ds).
out = os.path.abspath(sys.argv[sys.argv.index("--out") + 1]) if "--out" in sys.argv \
      else os.path.join(RULES, "manifest.json")
open(out, "w", encoding="utf-8").write(json.dumps(manifest, ensure_ascii=False, indent=2))
print(f"wrote {out} ({len(comps)} components)")

# INDEX.md tambien se genera: escrito a mano quedo 9 reglas atras del manifest
# (back-link, composition, create-form, date-picker, description, mobile,
# page-header, placeholder, space), que es exactamente el drift que este repo
# existe para no tener.
if True:
    by_cat = {}
    for c in comps:
        by_cat.setdefault(c["category"] or "Sin categoria", []).append(c)
    lines = [
        "# Component Rules — coverage index",
        "",
        "> GENERADO por `scripts/build-manifest.py` desde los frontmatter de",
        "> `component-rules/<id>.md`. **No editar a mano:** se regenera y se pisa.",
        "",
        f"**{len(comps)} reglas operativas**, todas con frontmatter valido. El schema y como las",
        "consumen los skills estan en `README.md`; el registro machine-readable, en `manifest.json`.",
        "",
        "No todas son componentes: `composition`, `space` y `mobile` son reglas de sistema —",
        "la forma de la pagina, la capa espacial de Amalgama y las apps nativas.",
        "",
    ]
    for cat in sorted(by_cat):
        lines += [f"## {cat}", "", "| id | Nombre | Fuente CSS | Resumen |", "|---|---|---|---|"]
        for c in sorted(by_cat[cat], key=lambda x: x["id"]):
            css = (c.get("source") or {}).get("css") or "—"
            summ = (c.get("summary") or "").replace("|", "\\|")
            if len(summ) > 150:
                summ = summ[:147].rstrip() + "…"
            lines.append(f"| `{c['id']}` | {c['display_name']} | `{css}` | {summ} |")
        lines.append("")
    idx = os.path.abspath(sys.argv[sys.argv.index("--out-index") + 1]) if "--out-index" in sys.argv \
          else os.path.join(RULES, "INDEX.md")
    open(idx, "w", encoding="utf-8").write("\n".join(lines))
    print(f"wrote {idx} ({len(by_cat)} categorias)")
if errors:
    print("ERRORS:\n  " + "\n  ".join(errors)); sys.exit(1)
print("frontmatter: all valid")
