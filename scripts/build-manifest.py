#!/usr/bin/env python3
"""Regenerate component-rules/manifest.json from the per-component frontmatter.

The 61 component-rules/<id>.md files are the source of truth; this script derives
the machine-readable registry (manifest.json) that skills / UI-generation
workflows consume. Run from the repo root:  python3 scripts/build-manifest.py
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
if errors:
    print("ERRORS:\n  " + "\n  ".join(errors)); sys.exit(1)
print("frontmatter: all valid")
