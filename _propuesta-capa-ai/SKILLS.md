# Las skills no viven acá

Vivían en `_propuesta-capa-ai/skills/` mientras eran una propuesta. Ya no lo son: están publicadas
en el plugin `embassy` del marketplace privado y esa es **la única copia**.

```
amalgamaco/claude-code-plugins
└── plugins/embassy/
    ├── skills/screen/    ← construir y rediseñar pantallas
    ├── skills/start/     ← kickoff de proyecto + tema de marca
    ├── skills/artifact/  ← entregables on-brand sin repo
    ├── skills/review/    ← auditoría
    ├── skills/break/     ← un componente en todos sus estados
    ├── skills/explain/   ← ingeniería inversa de una UI ajena
    └── skills/eval/      ← el loop de medición
```

## Para cambiar una skill

Editás el `SKILL.md` en **ese** repo, subís la versión del plugin en
`.claude-plugin/marketplace.json` y mergeás a `main`. Sin el bump de versión, Claude Code sirve la
copia cacheada y nadie ve el cambio.

**No renombres el plugin ni una skill sin necesidad.** Un rename no es una actualización: se instala
como un plugin distinto, el equipo se queda con los dos hasta que desinstale el viejo, y el
dashboard de uso —que indexa por `${plugin}:${skill}`— parte el histórico en dos series. Se hizo una
vez, en septiembre de 2026, porque el nombre `design` colisionaba con un plugin de Anthropic y la
colisión hacía desaparecer skills enteras del listado.

## Qué sigue viviendo en este repo

La **capa pública** que las skills leen por URL, y que por eso tiene que estar en la raíz:

| Archivo | Quién lo lee |
|---|---|
| `design.md` | `artifact` — juicio de marca y composición, sin clonar nada |
| `PUBLIC-API.md` · `public-api.json` | `artifact`, `review`, `check-output.mjs` |
| `FAILURES.md` | `review`, `eval` |
| `guidelines/*.md` · `component-rules/*.md` · `css/` | `screen` |
| `scripts/build-brand-theme.mjs` | `start` |
| `scripts/check-screen-report.mjs` · `scripts/check-output.mjs` | el chequeo final de cada skill |
| `component-rules/<id>.md` (bloque `states:`) | `break` — de ahí saca los escenarios, no de una lista genérica |

**La regla es una sola: el criterio y el CSS viven acá; el procedimiento vive en el plugin.** Si
cambiás un componente, esto se actualiza solo (las skills clonan en cada sesión). Si cambiás cómo
se decide algo, hay que tocar la skill y subir la versión.

Después de tocar el CSS o el manifest, regenerá la capa pública:

```bash
node scripts/build-public-api.mjs
```
