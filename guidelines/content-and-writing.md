# Content & Writing

> How Embassy talks: clear, direct, human rioplatense Spanish that tells users exactly what is happening and what to do next.

## Why it matters

Words are interface. A button labeled "Enviar" and one labeled "Publicar vacante" render identically, but only one tells the user what will happen. Microcopy carries as much of the experience as color and layout — a vague error dead-ends a task, a blaming one erodes trust, and a robotic empty state makes a product feel unfinished. Embassy's voice is the connective tissue between components; this guide keeps it consistent so the product sounds like one person, not forty screens written by forty people.

## Voice: clear, direct, human

Product and docs copy is **rioplatense Spanish** (GOVERNANCE §10.7). The voice is a knowledgeable colleague, not a system log and not a hype reel.

- **Clear over clever.** Say the thing. Reserve personality for moments that can carry it (empty states, success confirmations), never at the cost of comprehension.
- **Direct.** Address the user with *vos* implicitly through verbs ("Guardá los cambios", "Revisá los datos"). Prefer active voice and second person over impersonal passives.
- **Human, not robotic.** No system-speak ("Operación finalizada con código 0"), no filler ("Por favor, tenga a bien..."), no false urgency.
- **Concise.** Cut every word that doesn't change meaning. If a sentence works without it, remove it.

## Label by what users recognize, not system internals

Name things for the user's mental model, never for the database column, enum value, or API field behind them.

- Good: `Vacante archivada` · Bad: `status = ARCHIVED`
- Good: `Sin asignar` · Bad: `assignee_id: null`
- Good: `Candidato` · Bad: `Entity #4471`

If engineering calls it a `req` and users call it a `vacante`, the UI says *vacante*. This applies to `Badge` labels, `Select` options, column headers, and filter `Chip`s alike.

## CTA copy says exactly what happens

A button is a promise. Its label is a verb-first phrase describing the outcome of the click — specific enough that the user could predict the next screen (see [visual-hierarchy.md](visual-hierarchy.md) for *which* action is `variant="primary"`).

- Good: `Crear vacante` · `Guardar cambios` · `Publicar` · `Invitar candidato`
- Bad: `Enviar` · `OK` · `Aceptar` · `Continuar` (when something concrete happens)

Then **close the loop** with feedback that confirms the same action, using the right component:

- Ephemeral confirmation of a completed action → **`Snackbar`** (floating, auto-dismiss): after `Crear vacante`, show `Vacante publicada`. (`Toast` is the same floating/ephemeral family — use it for the transient confirmation, not for persistent guidance.)
- Persistent, in-context status or guidance that must stay on screen → **`Alert`** (inline, cva variants `default`/`info`/`success`/`warning`/`error`): e.g. a warning at the top of a form that some fields are missing.

**Alert vs. Snackbar** (CLAUDE.md): Alert is inline and persistent; Snackbar/Toast is floating and ephemeral. Don't put a dismissible-toast message where the user needs to keep reading it, and don't pin an Alert for a "guardado" that only needs a second on screen.

Confirmation `Dialog` buttons name the action, not "Sí/No": `Eliminar vacante` / `Cancelar`, so the label reads correctly even out of context.

## Error messages: what went wrong + how to fix it

Every error answers two questions: *what happened* and *what do I do now*. No blame, no vagueness, no error codes shown to the user.

- **Name the problem in plain language**, from the user's side, not the system's.
- **Give the fix** — the concrete next step.
- **Never blame the user** ("Ingresaste mal el correo" → "Revisá el correo: falta el @").
- **Never be vague** ("Algo salió mal" with no path forward).

Field-level errors live in `Input`/`Textarea` via the **`error`** prop (which wires `aria-invalid` + `aria-describedby` and paints the `--color-error` border and `--color-error-ring`). Use the **`hint`** prop for guidance *before* an error occurs.

- Hint (proactive): `hint="Usá tu correo de Amalgama"`
- Error (reactive, specific + fix): `error="Este correo ya está registrado. Probá iniciar sesión."`
- Bad error: `error="Correo inválido"` (what's invalid? what do I do?)

For form-level or system errors, use an `Alert variant="error"`: `No pudimos guardar la vacante. Revisá tu conexión y volvé a intentar.` — names the failure, gives the action.

## Empty states and placeholders

An **`Empty State`** is a first impression, not a dead end. Three parts: a plain-language line of *what would be here*, one sentence of *why it's empty / what to do*, and — when there's a next step — the primary action as a `Button`.

- Good: **`Todavía no hay vacantes`** / `Creá la primera para empezar a recibir candidatos.` + `Button variant="primary"` → `Crear vacante`
- Bad: `No data` (cold, no path) · `Lista vacía (0 resultados)` (system-speak)

Distinguish "nothing yet" (invite the first action) from "no results" (help adjust the query): `No encontramos vacantes con esos filtros. Probá quitar alguno.`

**Placeholders** in `Input`/`Search` show *format or example*, never instructions or the label itself. Placeholders vanish on typing, so nothing essential lives there — that's what `label` and `hint` are for.

- Good: `Buscar por nombre o correo` (Search) · `ejemplo@amalgama.co` (Input)
- Bad: `Escribí acá` · `Nombre` (that's the label's job)

While real content loads, use **`Skeleton`**, not a "Cargando..." string — it previews the shape of what's coming without words.

## Sentence case

UI labels, buttons, menu items, form labels, and `Badge`s use **sentence case** (GOVERNANCE §8.3): capitalize the first word and proper nouns only. Title Case is reserved for top-level headings and page titles.

- Good: `Crear vacante` · `Guardar cambios` · `Sin asignar`
- Bad: `Crear Vacante` · `Guardar Cambios` · `Todos Los Candidatos`

## Concision

- Prefer the short form: `Editar` not `Editar la información`; `Guardar` not `Guardar los cambios realizados`.
- One idea per sentence. Split a compound sentence rather than stack clauses.
- Drop courtesy padding ("Por favor", "Tené en cuenta que") unless it changes meaning.
- Front-load: put the important word first so scanners catch it — `3 candidatos nuevos`, not `Hay un total de 3 candidatos nuevos`.

## Numbers, dates, and formatting

Rioplatense conventions:

- **Decimals** use a comma, **thousands** a period: `1.250` candidatos, `3,5` puntos.
- **Dates**: day-first — `13/07/2026` numeric, or `13 de julio de 2026` long form. Relative time is warmer for recency: `hace 2 horas`, `ayer`, `hace 3 días`.
- **Time**: 24-hour — `14:30`, not `2:30 PM`.
- **Currency**: symbol then space then amount — `$ 1.500`.
- **Ranges / counts**: pluralize honestly and handle 1 and 0 — `1 vacante`, `2 vacantes`, `Sin vacantes` (not `0 vacantes`).
- **Percentages** in `Stat Card` trends: sign included — `+12%`, `−3%`.

Keep the *same* format for the same data type everywhere; a date that's `13/07/2026` on one screen must not be `Jul 13` on another.

## Do / Don't

- **Do:** `Crear vacante` → Snackbar `Vacante publicada`.
  **Don't:** `Enviar` → Toast `Operación exitosa`.
- **Do (error):** `Este correo ya está registrado. Probá iniciar sesión.`
  **Don't:** `Error: duplicate key` · `Algo salió mal` · `Ingresaste cualquier cosa`.
- **Do (empty):** `Todavía no hay vacantes — creá la primera para empezar.`
  **Don't:** `No data` · `Lista vacía (0)`.
- **Do (label):** `Sin asignar`, `Archivada`.
  **Don't:** `assignee: null`, `status=ARCHIVED`.
- **Do (case):** `Guardar cambios`.
  **Don't:** `Guardar Cambios`.
- **Do (placeholder):** `Buscar por nombre o correo`.
  **Don't:** `Escribí acá` · repeating the label.
- **Do (date):** `13/07/2026` or `hace 2 horas`.
  **Don't:** `2026-07-13T14:30Z` shown to a user · `07/13/2026`.
- **Do (hint before error):** `hint="Usá tu correo de Amalgama"`.
  **Don't:** leave the field bare and only speak up with a vague error after submit.

## Checklist for a new screen

- [ ] Copy is rioplatense Spanish, clear and direct (vos), no system-speak or filler.
- [ ] Every label names what the user recognizes, not a DB field / enum / ID.
- [ ] The primary `Button` label is a specific verb phrase (`Crear vacante`), not `Enviar`/`OK`.
- [ ] Completed actions confirm via `Snackbar`/`Toast`; persistent status via `Alert` (right one chosen).
- [ ] Every error states what went wrong *and* the fix; no blame, no codes, no "Algo salió mal".
- [ ] `Input`/`Textarea` use `hint` for guidance and `error` for specific, actionable failures.
- [ ] `Empty State` distinguishes "nothing yet" from "no results" and offers the next step.
- [ ] Placeholders show format/example only; loading uses `Skeleton`, not a text string.
- [ ] All UI labels are sentence case; only page titles use Title Case.
- [ ] Numbers/dates use rioplatense format (comma decimals, day-first dates, 24h) — consistent across screens.
- [ ] Counts handle 0 and 1 gracefully (`Sin vacantes`, `1 vacante`).

## Related

- [visual-hierarchy.md](visual-hierarchy.md) — which action is the primary Button, and how copy length affects layout and scanning.
- `Button`, `Snackbar`, `Toast`, `Alert`, `Empty State`, `Input`, `Textarea`, `Search`, `Skeleton`, `Dialog`, `Badge`, `Chip`, `Stat Card` — component docs in `index.html`.
- `GOVERNANCE.md` — §8.3 (sentence case), §10.7 (Spanish rioplatense), Alert vs. Snackbar guidance.
- `CLAUDE.md` — Alert (inline/persistent) vs. Snackbar (floating/ephemeral) distinction; component inventory.
