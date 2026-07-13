# UX Laws & Heuristics

> The applied psychology behind Embassy — how established usability principles translate into concrete component and token choices.

## Why it matters

Embassy gives you the *pieces* (components, tokens); these laws tell you *how to arrange them* so a screen is fast to scan, easy to act on, and hard to get wrong. Every principle below is tied to a real Embassy component or token so the guidance is checkable, not aspirational. When a layout decision feels arbitrary, one of these laws usually settles it. Applies equally to a human building a screen and to an agent generating one.

---

## Nielsen's 10 Usability Heuristics

### 1. Visibility of system status

- **What.** The interface always tells the user what is happening, in reasonable time.
- **Why.** Uncertainty erodes trust and provokes duplicate actions (double-submits, refreshes).
- **In Embassy.** Use `Progress` for determinate/indeterminate loading and `Skeleton` while a `Table`, Kanban board, or `Card` grid hydrates. Confirm completed actions with `Snackbar` (ephemeral, e.g. "Vacante publicada"). Reflect saving/loading with `aria-busy` and a `Button` loading state. Never leave a triggered action silent.

### 2. Match between system and the real world

- **What.** Speak the user's language and follow real-world conventions, not internal jargon.
- **Why.** Users map screens onto their mental model; mismatches force translation.
- **In Embassy.** Copy is Spanish (rioplatense) and domain-true: *vacantes*, *candidatos*, *entrevistas*, *etapas*. A `Kanban` column reads "En entrevista", not "Stage 3". `Badge` states map to the real hiring pipeline (open/active/closed/draft/archived).

### 3. User control and freedom

- **What.** Provide clearly marked exits, undo, and cancel for mistaken actions.
- **Why.** People explore and err; a visible way back lowers the cost of trying.
- **In Embassy.** Every `Dialog`/`Sheet` has a `Button variant="icon"` close and a `Cancel`; `Alert Dialog` pairs a destructive Action with a Cancel. Offer undo in a `Snackbar` ("Candidato archivado · Deshacer") instead of a blocking confirm where reversible.

### 4. Consistency and standards

- **What.** The same thing looks and behaves the same everywhere; follow platform conventions.
- **Why.** Consistency lets learning transfer between screens; drift is a bug (GOVERNANCE §1, §3.1).
- **In Embassy.** One `Button variant="primary"` per view; menu/nav hover is always the shared blue (`--color-nav-hover`), never gray; selected state is always the Secondary family (§5.6). Pull tokens from the repo — never hardcode a hex, radius, or font.

### 5. Error prevention

- **What.** Prevent problems before they occur; the best error message is one that never appears.
- **Why.** Prevention beats recovery — it saves the user the whole error/repair loop.
- **In Embassy.** Constrain input at the source: `Select`, `Date Picker`, `Radio`, `Checkbox`, `Switch` instead of free text where the set is finite. Gate destructive actions behind `Alert Dialog`. Disable a submit `Button` until required fields validate; show inline hints on `Input`/`Textarea` before, not after, submit.

### 6. Recognition rather than recall

- **What.** Make options, actions, and information visible so users recognize rather than remember.
- **Why.** Recognition is far cheaper cognitively than recall (see Miller's Law).
- **In Embassy.** Keep filters visible as `Chip`s under a `Toolbar` rather than hidden in a menu; use `Dropdown Menu` and `Select` to show choices on demand; label icon-only `Button variant="icon"` with a `Tooltip`; use `Avatar` + name so a recruiter recognizes a candidate without recalling an ID.

### 7. Flexibility and efficiency of use

- **What.** Accelerators (unseen by novices) let expert users work faster.
- **Why.** One interface must serve both the first-time and the hundredth-time user.
- **In Embassy.** `SearchField` in the `Toolbar` for keyboard-first navigation; `Segmented Button` for instant view switches (lista/tablero); `Pagination` plus filter `Chip`s to jump within large candidate lists. Sensible defaults in `Select`/`Date Picker` so the common path needs no input.

### 8. Aesthetic and minimalist design

- **What.** Every extra unit of information competes with the relevant units for attention.
- **Why.** Signal-to-noise directly drives scanning speed and comprehension.
- **In Embassy.** Prefer `Stat Card` for a single KPI over a dense paragraph; reveal secondary detail with `Accordion`/`Collapsible`; keep a `Card` to essentials and push the rest behind a `Sheet`. Use whitespace via `--space-*` tokens, not extra dividers.

### 9. Help users recognize, diagnose, and recover from errors

- **What.** Error messages in plain language state the problem and suggest a fix.
- **Why.** A diagnosable error is a recoverable one; a code is not.
- **In Embassy.** Inline field errors on `Input`/`Textarea` (`error`/`hint` props, `--color-error` border + `--color-error-ring`); page- or section-level problems in an `Alert` (`variant="error"`). Say what to do next ("Revisá el email — falta @"), not "Error 422".

### 10. Help and documentation

- **What.** Help is easy to search, focused on the user's task, and concrete.
- **Why.** Even great UIs need a fallback for edge cases.
- **In Embassy.** Attach a `Tooltip` (or `Popover` for richer help) to unfamiliar controls; use `Empty State` to teach the next step when there's no data yet ("Todavía no hay candidatos — publicá una vacante"); keep help contextual rather than a separate manual.

---

## Cognition & decision laws

### Hick's Law

- **What.** Decision time grows with the number and complexity of choices.
- **Why.** Fewer, well-grouped options mean faster, more confident decisions.
- **In Embassy.** Cap a `Toolbar` at roughly five filter `Chip`s; move overflow into a `Dropdown Menu` or `Select`. Keep one primary `Button` and demote the rest to `secondary`/`tertiary`/`text`. Split a long `Create Form` across `Tabs` or an `Accordion` rather than showing 20 fields at once.

### Fitts's Law

- **What.** Time to hit a target is a function of its distance and size — big, near targets are faster.
- **Why.** Comfortable target sizes reduce misses and effort, especially on touch.
- **In Embassy.** Respect the ~44px touch-target floor (GOVERNANCE §7.2); the default `Button` is 36px min-height (`btn` base) but gains mass from its fill — bump to `btn-lg`/`btn-xl` for primary CTAs. Keep the primary action where the eye ends (end of a `Dialog` footer, `Toolbar`). Icon-only `Button variant="icon"` must keep a square, generous hit area.

### Miller's Law

- **What.** People hold roughly 7±2 chunks in working memory at once.
- **Why.** Chunking within that limit keeps interfaces scannable without overload.
- **In Embassy.** Group `Table` columns and `Stat Card` rows into small sets; limit a `Tabs` bar to a handful of peer views; break long numbers/IDs into chunks. Segment a `Kanban` into named stages rather than one long list. See Information Architecture for grouping rules.

### Goal Gradient Effect

- **What.** Motivation increases as people get closer to a goal.
- **Why.** Showing proximity to completion pulls users through multi-step flows.
- **In Embassy.** Use `Progress` (or a stepped `Tabs`/`Segmented Button` header) in a multi-step `Create Form` so "publicar vacante" feels within reach. Show "3 de 4 etapas" on a candidate pipeline. Order onboarding so an early quick win is visible.

### Progressive Disclosure

- **What.** Show only what's needed now; reveal advanced or secondary options on demand.
- **Why.** It keeps the default view simple while keeping power available (supports Hick's & minimalist design).
- **In Embassy.** Fold advanced settings into `Accordion`/`Collapsible`; open detail or edit flows in a `Sheet` or `Dialog` instead of inlining them; put row-level actions behind a `Dropdown Menu`; surface extra candidate info in a `Popover` off a `Person Card`. Default view = the 80% case.

### Peak-End Rule

- **What.** People judge an experience by its most intense moment and its end, not the average.
- **Why.** Getting the peak and the finish right disproportionately shapes perceived quality.
- **In Embassy.** Make completion moments feel resolved: a success `Snackbar` ("Vacante publicada"), a well-crafted `Empty State` after clearing a task, a clean `Dialog` close. Invest polish in the end of key flows (submit, publish, hire) rather than spreading it thin.

### Von Restorff Effect (Isolation Effect)

- **What.** When several similar items are present, the one that differs is remembered.
- **Why.** Visual distinction directs attention to the single most important action.
- **In Embassy.** Exactly one filled `Button variant="primary"` per context stands out among tonal (`secondary`), outlined (`tertiary`), and `text` buttons — that contrast *is* the hierarchy. Use a `Badge` sparingly to flag the one row that needs attention. Don't make everything bold, or nothing is.

### Cognitive Load

- **What.** Total mental effort a task demands; split into intrinsic (the task) and extraneous (the UI).
- **Why.** Extraneous load is the designer's to cut — it's pure friction.
- **In Embassy.** Reduce extraneous load with consistent tokens (predictable spacing via `--space-*`, one radius scale, one type scale), `Skeleton` to preserve layout during load, and clear grouping. Never make the user hold state in their head that the UI could show (breadcrumb trail, selected filters as `Chip`s, current tab). Offload memory to recognition (heuristic 6).

---

## Do / Don't

**Do**
- Keep one primary `Button variant="primary"` per view; express hierarchy through variant, not size alone.
- Limit visible choices — ~5 filter `Chip`s, a short `Tabs` bar — and disclose the rest via `Dropdown Menu`/`Accordion`/`Sheet`.
- Acknowledge every action: `Snackbar` for success, inline `Alert`/field error for problems, `Progress`/`Skeleton` for waits.
- Offer an exit or undo on every destructive or modal flow (`Alert Dialog`, `Snackbar` undo, `Dialog` cancel).
- Size and place the important target for the thumb and the eye (Fitts): end-of-footer CTAs, ≥44px touch targets.

**Don't**
- Don't present 8+ equal-weight actions; that's a Hick's/Von Restorff failure — introduce hierarchy.
- Don't hide system status; a silent spinner-less wait reads as broken.
- Don't stretch a `Button` full-width to fill space — it reads as a form field (see CLAUDE.md migration rules).
- Don't use raw hex/px — off-token spacing and color add extraneous cognitive load and break consistency.
- Don't rely on color alone for selected state (§5.6) — pair with a container fill, weight, or indicator.

## Checklist for a new screen

- [ ] Exactly one `Button variant="primary"`; all other actions are `secondary`/`tertiary`/`text`/`icon`.
- [ ] Visible choices are bounded (~5 filter `Chip`s / short `Tabs`); overflow lives in `Dropdown Menu`/`Select`.
- [ ] Every triggered action has feedback: `Progress`/`Skeleton` on load, `Snackbar` on success, inline error on failure.
- [ ] Destructive/irreversible actions are gated by `Alert Dialog` and/or reversible via `Snackbar` undo.
- [ ] Secondary complexity is disclosed progressively (`Accordion`/`Collapsible`/`Sheet`/`Popover`), not dumped inline.
- [ ] Primary targets are large and well-placed; touch targets ≥ 44px; icon buttons carry a `Tooltip` label.
- [ ] Empty and loading states are designed (`Empty State`, `Skeleton`) — not blank screens.
- [ ] Copy is rioplatense and domain-true (vacantes/candidatos/entrevistas); no internal jargon or error codes.
- [ ] All color/space/radius/type come from tokens (`--color-*`, `--space-*`, `--radius-*`, type scale) — zero hardcoded values.
- [ ] Selected/active state uses the Secondary family plus a non-color cue (§5.6).

## Related

- [Information Architecture](./information-architecture.md) — grouping, labeling, hierarchy, navigation model.
- `GOVERNANCE.md` — §5 color roles & states, §6 state system, §7 spacing, §8 typography.
- `CLAUDE.md` — component inventory and per-component `Cuándo usar` rules.
- Component docs: Button, Chip, Toolbar, Dialog, Alert Dialog, Sheet, Snackbar, Alert, Progress, Skeleton, Empty State, Tooltip, Popover, Dropdown Menu, Tabs, Segmented Button, Search/SearchField.
