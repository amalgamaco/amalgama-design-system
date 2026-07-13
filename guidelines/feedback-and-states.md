# Feedback & States

> Every data-driven screen has a lifecycle — empty, loading, error, populated, success — and each state deserves a real, token-driven Embassy component, never a blank void or a raw spinner.

## Why it matters

A screen is almost never "full of data." It is empty on first use, loading while the fetch runs, broken when the fetch fails, and occasionally confirming that an action landed. Users spend a surprising amount of time in these in-between states, yet they are the ones most often skipped. Embassy ships a dedicated component for each one so the transitions read as one system: `Empty State`, `Placeholder`, `Skeleton`, `Progress`, `Alert`, and `Snackbar` (Sonner). Design the whole lifecycle up front — a screen that only renders its happy path is unfinished.

## The state lifecycle

Think of any list/table/detail surface as a small state machine:

```
first render ──► LOADING (Skeleton)
                   │
     fetch ok ─────┼───► has data ──► POPULATED
                   │                     │ action ──► optimistic ──► SUCCESS (Snackbar) | ERROR (Snackbar/Alert)
                   ├───► no data  ──► EMPTY (Empty State: no-results | first-use)
                   └───► fetch failed ─► ERROR-EMPTY (Empty State) or ERROR (Alert, if data was already shown)
```

Map each edge to a component before you build the happy path.

## Empty states — never a blank void

Use the `EmptyState` component (`@amalgama/ds/empty-state`: `icon` + `title` + `description` + `children` for a next-action slot). It centers content, renders the title in `font-heading text-heading-md` and the description in `text-body-lg text-fg-muted`, and reserves room for a CTA. An empty region must always be *helpful* and offer a clear next step — never an unexplained gap.

There are three distinct empty states; they are not interchangeable:

| Empty kind | When | Message + action |
|---|---|---|
| **First-use** (zero data yet) | The user has never created anything | Explain the feature, give a primary CTA to create the first item (`Button variant="primary"` in the `children` slot). |
| **No-results** (filter/search miss) | Data exists but the current query/filter excludes it | Say what was searched, offer "Limpiar filtros" (`Button variant="tertiary"` or `text`). Do **not** show a "create" CTA here — the data already exists. |
| **Error-empty** (fetch failed, nothing to show) | The list could not load at all | State the failure plainly and offer a **retry** action. |

`PlaceholderPanel` (`@amalgama/ds/placeholder`) is a *different* tool: it is scaffolding for a section that is under construction or awaiting selection ("Selecciona una vacante para ver los detalles", "Próximamente"). Use `EmptyState` for "no data"; use `PlaceholderPanel` for "no content wired up here yet." Its header comment states this split explicitly.

## Loading states

### Skeleton is the default for content-shaped waits

When you know the *shape* of what is coming (a card grid, a table, a detail pane), render `Skeleton` (`@amalgama/ds/skeleton`) in that shape while the data loads. Variants: `text`, `title`, `card`. The shimmer runs on the `skeleton-shimmer` utility (a continuous `--ease-linear` loop, exempt from enter/exit motion tokens per GOVERNANCE §11.1a). Skeletons preserve layout, so the page does not jump when data arrives — **avoid layout shift** by matching the skeleton's dimensions to the real content.

### Progress for actions, not content

`Progress` (`@amalgama/ds/progress`) covers two shapes, both track = `--color-surface-variant`, indicator = `--color-primary`:

- **Linear** (`<Progress />`) — a thin bar (`h-1`, `rounded-full`). Pass `value` (0–100) for determinate work (upload, multi-step import); pass `indeterminate` for "working, duration unknown."
- **Circular** (`<CircularProgress />`) — SVG ring for compact/inline spots. `value` for determinate, `indeterminate` to spin a partial arc.

Determinate is better than indeterminate whenever you can compute a percentage — it tells the user how long is left.

### When NOT to show a spinner

- **Sub-~300ms waits** — showing a spinner that flashes for one frame is worse than showing nothing; let the content appear.
- **Content-shaped waits** — prefer a `Skeleton` over a centered spinner; it communicates structure, not just "busy."
- **After an action with a predictable result** — prefer **optimistic UI**: update the view immediately as if it succeeded, then reconcile. If the server rejects it, roll back and surface a `Snackbar` error with a retry. Optimistic updates make the app feel instant and eliminate most spinners entirely.

Whatever the loading affordance, set `aria-busy="true"` on the region and `pointer-events: none` on controls that must not be double-fired (GOVERNANCE §6.1, Loading state).

## Error states — prevention and recovery

Handle errors at the screen level, not just per-request. Two components, chosen by persistence:

- **`Alert`** (`@amalgama/ds/alert`; `Alert` / `AlertTitle` / `AlertDescription`, `role="alert"`, variant `error`) — **inline and persistent**. Use for blocking or standing errors that must stay visible until resolved: a form's validation summary, a "no se pudo guardar" banner above the form, a degraded-service notice. It sits in the page flow with `bg-error-container` / `text-on-error-container`.
- **`Snackbar`** (`@amalgama/ds/sonner`, via `toast`) — **floating and ephemeral**. Use for transient failures where the context still works: `toast("No se pudo actualizar", { action: { label: "Reintentar", onClick: … } })`.

Recovery principles:

- **Always give a way out.** Every error offers a retry, an undo, or a clear next step — never a dead end.
- **Partial failure is real.** If 9 of 10 rows saved, keep the 9, flag the 1 with an inline `Alert` or a row-level marker, and let the user retry just the failure.
- **Prevent before you recover.** Disable the submit button while a form is invalid, validate inline (`Input` supports `error`/`hint` + auto `aria-invalid`), and confirm destructive actions with `AlertDialog` rather than letting them fail loudly.

## Success & confirmation

Confirm that something happened with a **`Snackbar`** (`toast.success("Vacante publicada")`). It is floating, auto-dismissing, and themed to the Embassy Snackbar spec (`--color-inverse-surface` background, `--color-inverse-on-surface` text, action rendered as `inverse-primary`, `--radius-sm`, `bottom-center`). Do not use an `Alert` for a fleeting success — an inline banner that lingers after the user has moved on is noise. Reserve interrupting confirmations (`AlertDialog`) for irreversible actions only.

## Alert vs. Snackbar — the canonical distinction

This split is defined in `alert.tsx`'s header and GOVERNANCE — they are deliberately **not** duplicates:

| | `Alert` | `Snackbar` (Sonner) |
|---|---|---|
| Placement | Inline, in the page flow | Floating overlay (`bottom-center`) |
| Persistence | Persistent — stays until resolved | Ephemeral — auto-dismisses |
| Purpose | A condition the user must see/act on | A confirmation that something *already* happened |
| Typical use | Form error summary, maintenance notice | "Guardado", "No se pudo actualizar — Reintentar" |

Rule of thumb: **must stay visible until the person acts → `Alert`; only confirms a fact → `Snackbar`.**

## Situation → component map

| Situation | Component | Notes |
|---|---|---|
| List has never had data (first use) | `EmptyState` (first-use) | Primary CTA to create the first item |
| Search/filter returns nothing | `EmptyState` (no-results) | "Limpiar filtros"; no "create" CTA |
| List failed to load, nothing to show | `EmptyState` (error-empty) | Retry action |
| Section under construction / awaiting selection | `PlaceholderPanel` | Scaffolding, not "no data" |
| Content of known shape is loading | `Skeleton` | Match real dimensions; no layout shift |
| Determinate task (upload, import) | `Progress` / `CircularProgress` (`value`) | Prefer determinate |
| Indeterminate action, unknown duration | `Progress indeterminate` / `CircularProgress indeterminate` | Only if >~300ms |
| Standing/blocking error on a populated screen | `Alert variant="error"` | Inline, persistent |
| Transient action failure | `Snackbar` (`toast`) + retry action | Ephemeral |
| Action succeeded | `Snackbar` (`toast.success`) | Never a lingering `Alert` |
| Irreversible confirmation | `AlertDialog` | Interrupting, deliberate |

## Do / Don't

**Do**

- Design all five lifecycle states before shipping a data screen.
- Match `Skeleton` dimensions to the real content to eliminate layout shift.
- Prefer optimistic UI + a `Snackbar` rollback over a blocking spinner.
- Give every error a retry, undo, or next step.
- Put the correct CTA in each empty state (create vs. clear-filters vs. retry).

**Don't**

- Leave an empty region blank or with a bare "No hay datos" string.
- Flash a spinner for sub-300ms waits, or use a spinner where a `Skeleton` fits.
- Use an `Alert` for fleeting success, or a `Snackbar` for an error that must persist.
- Use `EmptyState` for "under construction" — that's `PlaceholderPanel`.
- Hardcode colors/opacity in a loading or error state — use the token-backed components.

## Checklist for a new screen

- [ ] First-use empty state defined, with a primary "create" CTA in `EmptyState`
- [ ] No-results empty state defined, with a "clear filters" action (no create CTA)
- [ ] Error-empty state defined, with a retry action
- [ ] Loading uses `Skeleton` shaped like the real content (no layout shift)
- [ ] Long/determinate actions use `Progress`/`CircularProgress` with a `value`
- [ ] No spinner on sub-300ms waits; optimistic UI considered for mutations
- [ ] `aria-busy` set on loading regions; controls guarded against double-fire
- [ ] Blocking/standing errors use inline `Alert variant="error"`
- [ ] Transient failures use `Snackbar` with a retry action; partial failures preserved
- [ ] Success confirmed with `Snackbar`, not a lingering `Alert`
- [ ] Every state is token-driven and theme-aware (light + dark verified)

## Related

- [`visual-hierarchy.md`](visual-hierarchy.md) — emphasis ladder for the primary action inside an empty/error state
- [`responsive-layout.md`](responsive-layout.md) — how these states reflow on small screens
- [`ux-laws-and-heuristics.md`](ux-laws-and-heuristics.md) — visibility of system status, error prevention/recovery
- Component docs: **Empty State**, **Placeholder**, **Skeleton**, **Progress**, **Alert**, **Snackbar**, **Alert Dialog** (a Dialog variant), **Input** (inline `error`/`hint`)
- [`GOVERNANCE.md`](../GOVERNANCE.md) §6 (State system), §5.5 (state layers), §11.1a (motion)
