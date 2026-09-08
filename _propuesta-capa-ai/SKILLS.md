# Las skills no viven acá

Vivían en `_propuesta-capa-ai/skills/` mientras eran una propuesta. Ya no lo son: están publicadas
en el plugin `design` del marketplace privado y esa es **la única copia**.

```
amalgamaco/claude-code-plugins
└── plugins/design/
    ├── skills/design-system/     ← construir y rediseñar pantallas
    ├── skills/embassy-start/     ← kickoff de proyecto + tema de marca
    ├── skills/embassy-artifact/  ← entregables on-brand sin repo
    ├── skills/embassy-review/    ← auditoría
    ├── skills/embassy-break/     ← un componente en todos sus estados
    ├── skills/embassy-explain/   ← ingeniería inversa de una UI ajena
    └── skills/embassy-eval/      ← el loop de medición
```

## Para cambiar una skill

Editás el `SKILL.md` en **ese** repo, subís la versión del plugin en
`.claude-plugin/marketplace.json` y mergeás a `main`. Sin el bump de versión, Claude Code sirve la
copia cacheada y nadie ve el cambio.

## Qué sigue viviendo en este repo

La **capa pública** que las skills leen por URL, y que por eso tiene que estar en la raíz:

| Archivo | Quién lo lee |
|---|---|
| `design.md` | `embassy-artifact` — juicio de marca y composición, sin clonar nada |
| `PUBLIC-API.md` · `public-api.json` | `embassy-artifact`, `embassy-review`, `check-output.mjs` |
| `FAILURES.md` | `embassy-review`, `embassy-eval` |
| `guidelines/*.md` · `component-rules/*.md` · `css/` | `design-system` |
| `scripts/build-brand-theme.mjs` | `embassy-start` |
| `scripts/check-screen-report.mjs` · `scripts/check-output.mjs` | el chequeo final de cada skill |
| `component-rules/<id>.md` (bloque `states:`) | `embassy-break` — de ahí saca los escenarios, no de una lista genérica |

**La regla es una sola: el criterio y el CSS viven acá; el procedimiento vive en el plugin.** Si
cambiás un componente, esto se actualiza solo (las skills clonan en cada sesión). Si cambiás cómo
se decide algo, hay que tocar la skill y subir la versión.

Después de tocar el CSS o el manifest, regenerá la capa pública:

```bash
node scripts/build-public-api.mjs
```
