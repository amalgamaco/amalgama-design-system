# Forms

> How to build data-entry screens with Embassy so people fill them fast, make fewer mistakes, and can always recover from the ones they do make.

## Why it matters

Forms are where users hand data to the product — creating a vacante, editing a candidato, changing settings. A confusing or unforgiving form is the fastest way to lose a task or corrupt data. Embassy's `Input`, `Textarea`, and `Select` already encode most of the layout and accessibility decisions (top label, hint, error, `aria-invalid`, `aria-describedby`); your job is to compose them into a clear order, prevent errors up front, and make recovery obvious when they happen.

## Layout & structure

- **One column.** Fields stack vertically; never place two fields side by side unless they are a genuine pair (e.g. day / month, or a currency + amount). A single column keeps the eye on one path and reads correctly on mobile.
- **Top-aligned labels.** Embassy `Input`/`Textarea`/`Select` render the label above the field (`text-label`, `font-medium`, `mb-2`). Do not left-align labels in a separate column — it doubles horizontal space and breaks the single-column scan. The label *is* the accessible name; never ship a bare field with only a placeholder.
- **Consistent field rhythm.** Each field wrapper carries `mb-5` (`--space-5`, 20px) so vertical gaps between fields are uniform. Let the components own that spacing instead of adding ad-hoc margins.
- **Group related fields** under a section heading (e.g. "Datos de la vacante", "Compensación"). For a long multi-section form, use a section title + a short description; keep groups short (3–6 fields).
- **Logical order.** Order fields the way the user thinks about the task, not the way the database is shaped: identity → details → optional metadata. Put the most important / most likely fields first.
- **Mark optional, not required — and be consistent.** In most recruiting forms the majority of fields are required, so mark the *exceptions* with "(opcional)" in the label and reserve the red asterisk (`required` prop) for the rare truly-required field in an otherwise-optional form. Pick one convention per form and hold it — never mix asterisks and "(opcional)" arbitrarily.

## Field anatomy

Every Embassy form field is one component that renders three linked parts, so you never wire them by hand:

1. **Label** — above the field, `text-label` + `font-medium`, `mb-2`; turns `text-link` on focus (`group-focus-within`). Adding `required` appends a red asterisk.
2. **Control** — the input/textarea/trigger itself: `--radius-md`, `border-border` at rest, stepping to `border-outline` on hover and `border-link` + a 3px `--color-focus-ring` halo on focus.
3. **Supporting text** — a single line below (`text-caption`). It shows the `hint` normally, and is **replaced** by the `error` message when `error` is set. Its `id` is wired into the field's `aria-describedby`, so whichever line is showing is announced.

Because these move together, keep custom classes off the field for layout — compose fields inside your own grid/stack, not by restyling the component internals.

## Field selection & input types

- **Right control for the data.** Free text → `Input`; long text (descripción de vacante) → `Textarea`; a closed set of options → `Select`; a boolean setting → `Switch`; one-of-few visible choices → `RadioGroup`; independent on/off flags → `Checkbox`.
- **Use native input types** on `Input` (`type="email"`, `type="number"`, `type="tel"`, `type="date"`) so mobile keyboards and browser validation help the user. For search, do **not** use `Input` — use `SearchField` (`toolbar.tsx`, desktop) or `SearchBar` (`search.tsx`, mobile).
- **Sensible defaults.** Pre-fill the value most users will pick (estado = "Abierta", moneda = "ARS"). A good default is the cheapest error-prevention there is. Never default a destructive or high-commitment choice.
- **Leading/trailing icons** (`leadingIcon` / `trailingIcon` on `Input`, 18px, `aria-hidden`) can signal format (a `$` for money, a calendar for dates) — decoration only, never the sole carrier of meaning.
- **Select vs. radios vs. combobox.** ≤5 options where seeing them helps → `RadioGroup`; a longer closed list → `Select`; a very long list the user must filter (país, universidad) → a searchable pattern, not a giant scroll. Dates use the date-picker field, not a free-text `Input`.

## Error prevention

Preventing an error is always better than recovering from it.

- **Constrain the input** so bad data is hard to enter: `Select` instead of a free-text field for a closed set; `type="number"` with `min`/`max`/`step`; masks/patterns for phone and document numbers.
- **Inline hints before the fact.** Use the `hint` prop to state the format or rule *before* the user types ("Formato: +54 9 11 …", "Mínimo 8 caracteres"). The hint renders as `text-caption` supporting text and is wired to the field via `aria-describedby`.
- **Disable an invalid submit sparingly.** A permanently-disabled submit button with no explanation reads as a broken screen. Prefer letting the user submit and then showing precise errors. Only disable the primary `Button` for a clearly-communicated transient reason (e.g. while the form is saving, via `aria-busy`).
- **Confirm destructive actions with `AlertDialog`.** Deleting a candidato, closing a vacante, discarding unsaved edits — route these through the `alert-dialog` component (its Action/Cancel compose `Button`), never a bare `onClick`. Permanent deletion itself is a user decision; the dialog makes intent explicit.

## Error recovery

When validation does fail, make the fix effortless.

- **Validate on blur, not on every keystroke.** Firing an error while the user is still typing the first character is hostile. Validate when a field loses focus (`onBlur`), and once a field is in the error state, re-validate on change so the error clears the moment it's fixed.
- **Use the `error` prop.** Passing `error="Ingresá un email válido"` to `Input`/`Textarea` turns the border red (`border-error`), swaps the focus ring to the error ring (`--color-error-ring`), sets `aria-invalid`, and replaces the hint with the error message (wired through `aria-describedby`). Do not hand-roll red borders — the prop does the accessibility plumbing for you.
- **Summarize with a form-level `Alert` on submit.** When a submit fails validation, render an `Alert variant="error"` at the top of the form listing what needs fixing, in addition to the per-field errors. `Alert` is inline and persistent — it stays until the user resolves it — which is exactly right for an error summary. (Contrast with `Snackbar`, below.)
- **Preserve user input.** Never clear the form on a validation error. Keep every value the user typed; only highlight what needs changing.
- **A clear path to fix.** Error messages say what's wrong *and* what to do ("El email ya existe — probá con otro"), not just "Campo inválido". Move focus to the first errored field on a failed submit.

## Submission feedback

- **Loading state on the submit `Button`.** While the request is in flight, set `aria-busy` on the primary `Button` and disable it to prevent double-submits (Embassy's disabled state removes the lift/press transforms and applies `--color-disabled`). Show a spinner or "Guardando…" label.
- **Success → `Snackbar` (Sonner).** On success, fire a `toast()` from the `sonner` wrapper (`Toaster`, themed to the Embassy Snackbar spec: `--color-inverse-surface` background, `bottom-center`). Snackbar is floating and ephemeral — it confirms a fact that already happened and auto-dismisses. Use it for "Vacante creada", "Cambios guardados".
- **Alert vs. Snackbar (they are not duplicates).** `Alert` = inline + persistent, stays in the page flow until resolved (error summary, maintenance notice). `Snackbar` = floating + ephemeral, self-dismisses after confirming something happened. Rule of thumb: if it must remain visible until the person acts → `Alert`; if it just confirms a completed fact → `Snackbar`.
- **Server-side failures.** If the request itself fails (network, 500), don't silently swallow it: show an `Alert variant="error"` with a retry, keep the form filled, and re-enable the submit button. A destructive Snackbar-only failure message is easy to miss.

## Short vs. long forms

- **Short forms → `Dialog`.** A focused task of a few fields (renombrar, invitar, cambio rápido de estado) belongs in a `Dialog`, keeping the user in context. Put the primary action as a filled `Button variant="primary"` and the cancel as `variant="tertiary"`; keep the actions in the dialog footer, primary on the right.
- **Long / multi-section forms → dedicated page with `create-form`.** A full creation flow (crear vacante) goes on its own page constrained to ~800px (see GOVERNANCE §14.4). Use `CreateHeader` + `CreateTitle` for the top and the sticky `CreateFooter` for the actions — the footer pins to the bottom (`sticky bottom-0`, `border-t border-border`, `bg-card`) so Cancelar/Publicar stay reachable while the user scrolls.

## Form actions

- **One Primary action per form.** The commit action is a single filled `Button variant="primary"` ("Crear vacante", "Guardar"). Never give a form two equal-weight filled buttons — introduce hierarchy (GOVERNANCE / CLAUDE: one Primary per context).
- **Secondary actions step down.** Cancel/Volver is `variant="tertiary"` or `variant="text"`; a destructive action (Eliminar) is `variant="danger"` and is confirmed via `AlertDialog`.
- **Consistent placement.** On a page form the actions live in the sticky `CreateFooter` (Cancelar left, primary right); in a `Dialog` they sit in the footer, primary on the right. Don't stretch a button full-width to fill the footer — buttons have intrinsic width and centered content.
- **Don't gate the primary on nothing.** A disabled primary is only for the in-flight (`aria-busy`) state, not as a stand-in for validation feedback.

## Multi-step & unsaved work

- **Break only genuinely long flows into steps.** If a creation flow has natural phases (datos → requisitos → publicación), a stepped flow reduces overwhelm — but a form that fits one screen should stay one screen. Show progress and let users move back without losing data.
- **Never lose typed work.** Preserve values when navigating between steps, and warn before an action that would discard unsaved edits (route the confirm through `AlertDialog`, e.g. "Descartar cambios?"). Where the domain warrants it, autosave drafts and confirm the save with a `Snackbar`.
- **Validate per step, summarize at submit.** Validate each step's fields on blur; on final submit, surface any remaining problems in a form-level `Alert` and jump the user to the offending step/field.

## Selection controls

- **Checkbox** — independent boolean choices, or "select all" in a list. Multiple can be on at once (recibir alertas por email + por push). Also the leading control for row selection in tables.
- **RadioGroup** — exactly one choice from a small, visible set (2–5), e.g. tipo de contrato. If the set is long or space is tight, use `Select` instead; radios are for when seeing all options at once aids the decision.
- **Switch** — an immediate on/off setting that takes effect on toggle (vacante visible / oculta). Do not use a Switch where the change only applies after a submit — that's a Checkbox.
- Always pair these with a `Label` (`@amalgama/ds/label`) so the hit target includes the text and the control has an accessible name. Group a set of radios/checkboxes under a `fieldset`-style heading describing the choice.

## Microcopy

- **Sentence case** for labels and helper text; title case only for the form/page title (GOVERNANCE §8.3). Copy is Spanish (rioplatense).
- **Labels are nouns, buttons are verbs.** Field: "Correo electrónico"; primary action: "Crear vacante" / "Guardar cambios" — never a generic "Enviar" when a specific verb fits.
- **Errors are specific and actionable** — name the field's problem and the fix ("El puntaje debe estar entre 0 y 100"), never "Error" or "Campo inválido".
- **Hints state the rule, not the obvious** — use them for formats and constraints, not to restate the label.

## Accessibility

Embassy's form components handle most of this, but you own the composition:

- **Every field has a programmatic label.** The `label` prop links `<label htmlFor>` to the field `id` (auto-generated via `useId` if you don't pass one). A field with no `label` and no `aria-label` is a defect.
- **Errors are announced, not just colored.** The `error` prop sets `aria-invalid` and points `aria-describedby` at the message, so the error is read on focus — color alone (`border-error`) is never the only signal.
- **Focus is visible and canonical.** All fields and buttons use `focus-visible:focus-ring` (`--color-focus` outline + `--color-focus-ring` halo). Never suppress the outline.
- **Move focus to the first error** on a failed submit, and keep the error summary `Alert` reachable (near the top of the form).
- **Contrast holds in dark mode** automatically via the token layer — don't add per-theme overrides; verify with `data-theme="dark"`.
- **Touch targets** ≥ 44×44px for controls per WCAG 2.5.5 (GOVERNANCE §7.2).

## Do / Don't

- **Do** let `Input`/`Textarea`/`Select` render their own label, hint, and error — don't rebuild them.
- **Do** validate on blur and clear the error as soon as the value becomes valid.
- **Do** keep the form to one column with uniform `--space-5` field gaps.
- **Do** confirm destructive actions with `AlertDialog` and confirm successes with a `Snackbar`.
- **Don't** use a placeholder as the label — placeholders vanish on focus and fail screen readers.
- **Don't** clear the user's input on a validation error.
- **Don't** leave the submit button permanently disabled with no explanation of what's missing.
- **Don't** hand-roll a red border for errors — use the `error` prop so `aria-invalid`/`aria-describedby` come with it.
- **Don't** put more than one Primary action in a form (one filled `Button`; alternatives are `tertiary`/`text`).
- **Don't** fire an error on the first keystroke.
- **Do** keep one Primary action; step secondary/destructive actions down to `tertiary`/`text`/`danger`.
- **Don't** stretch a button full-width to fill a footer — it reads as a field, not an action.

## Checklist for a new screen

- [ ] Single-column layout; related fields grouped under section headings in a logical order.
- [ ] Every field has a visible top-aligned label (via the component's `label` prop), never placeholder-only.
- [ ] Required/optional convention is consistent across the whole form.
- [ ] Correct control per data type (`Input`/`Textarea`/`Select`/`Checkbox`/`RadioGroup`/`Switch`) with native input types.
- [ ] Sensible defaults set; no destructive default.
- [ ] Format rules shown up front via `hint`; inputs constrained (`Select`, `min`/`max`, masks) to prevent errors.
- [ ] Validation runs on blur; errors surfaced via the `error` prop (red border + `aria-invalid` + `aria-describedby`).
- [ ] On failed submit: a form-level `Alert variant="error"` summary, focus moved to the first errored field, all input preserved.
- [ ] Destructive actions confirmed with `AlertDialog`.
- [ ] Submit `Button` shows a loading state (`aria-busy`, disabled) and success fires a `Snackbar`.
- [ ] Short form lives in a `Dialog`; long form on a dedicated ~800px page with `create-form` (`CreateHeader`/`CreateFooter`).
- [ ] One Primary action; focus rings use the canonical `focus-visible:focus-ring`.

## Related

- [tables-and-data.md](tables-and-data.md) — the lists these forms feed into, and toolbar/filter patterns.
- Components: `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Label`, `Button`, `Alert`, `Snackbar` (Sonner `Toaster`), `Dialog`, `Alert Dialog`, `Create Form` (`CreateHeader`/`CreateTitle`/`CreateFooter`).
- `GOVERNANCE.md` — §5.3 disabled pattern, §6 state system, §6.2 focus, §14.4 content widths.
- `CLAUDE.md` — component inventory, Alert-vs-Snackbar rule, consuming the DS.
