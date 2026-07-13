# Building Accessible Screens

> Practical WCAG 2.1 AA guidance for assembling screens with Embassy — the how-to companion to the Foundations → Accessibility statement.

## Why it matters

Embassy's components ship accessible defaults (focus rings, ARIA roles, contrast-checked tokens), but a screen is only as accessible as the way you wire them together. Most failures are introduced at composition time: a `<div>` used as a button, a placeholder standing in for a label, a color-only status, a focus ring stripped "for looks". This guide is the checklist for not undoing what the components give you. Embassy targets **WCAG 2.1 Level AA** (see GOVERNANCE.md §17); AAA is aspirational.

---

## Color contrast

- **Normal text ≥ 4.5:1, large text (≥ 18px, or ≥ 14px bold) and UI/graphical objects ≥ 3:1** (WCAG 1.4.3 / 1.4.11). The token system is pre-calibrated: `--text-primary` on `--bg` is ~14:1 in light and ~15:1 in dark.
- **Stay on the token pairs.** Foreground/background must be a matched Color Role pair — `--color-on-primary` on `--color-primary`, `--color-on-secondary-container` on `--color-secondary-container`. Mixing an unpaired foreground is how you land below 3:1.
- **Verify both themes.** Dark mode recalibrates automatically, but re-check any custom composition with `data-theme="dark"` on `<html>`. Focus rings and disabled text are the usual dark-mode casualties.
- **White-label brands are not exempt.** When primitives are re-themed, measure the new palette's ratios — do not assume they pass (GOVERNANCE.md §17.2).

### Never use color as the only signal (WCAG 1.4.1)

Every status must carry a **text label and/or icon** in addition to color:

- `Badge` states (open/active/closed/draft/archived) always render text, never a bare colored dot.
- `Alert` (`role="alert"`, variants `info`/`success`/`warning`/`error`) pairs an icon with a message — the variant color is reinforcement, not the message.
- `Input` errors turn the field red **and** render an error message wired via `aria-describedby` — the red border is never the sole indicator.
- Kanban/Vacancy card meta uses a label next to any status color.

---

## Keyboard operability (WCAG 2.1.1)

- **Everything reachable and operable by keyboard.** If it can be clicked, it must be Tab-focusable and Enter/Space-activatable.
- **Use real elements.** `Button` renders a real `<button>`; use `asChild` to render an `<a>` for navigation (it composes Radix `Slot`). Never build a control from a styled `<div>`/`<span>` — you lose focusability, Enter/Space handling, and the implicit role for free with the native element.
- **Tab order follows reading order.** Don't reorder with positive `tabindex`; fix the DOM order instead.
- **Composite widgets use arrow keys.** `Tabs`, `Select`, dropdown `Menu`, and search result lists are arrow-navigable — they get this from Radix; preserve it rather than intercepting keys.
- **A clickable `Card` needs keyboard parity** — `role="link"`/`role="button"` + `tabindex="0"` + an Enter/Space handler (GOVERNANCE.md §17.4). A bare `onClick` on a div is a defect.

---

## The canonical focus ring (WCAG 2.4.7)

Every interactive component uses **one** focus treatment — the shared `.focus-ring` utility, applied as `focus-visible:focus-ring`:

```
outline: 2px solid var(--color-focus);   /* #4F80FF, no dark override — a constant a11y signal */
outline-offset: 2px;
box-shadow: 0 0 0 4px var(--color-focus-ring);
```

- **Never remove it.** No `outline: none` without an equivalent replacement. `Button`, Radix primitives, and every DS control already carry `focus-visible:focus-ring`.
- **`:focus-visible`, not `:focus`** — the ring shows for keyboard users and stays out of the way of mouse clicks.
- **Never substitute a different color.** Always `--color-focus` + `--color-focus-ring`, never `--interactive`, `--color-secondary`, or a hardcoded blue (GOVERNANCE.md §6.2, §2.4).
- Text `Input`/`Textarea`/`Select` use a tighter `focus:shadow-[0_0_0_3px_var(--color-focus-ring)]` frame by design — that is the sanctioned field variant, still driven by the focus tokens.

---

## Focus management in overlays

Overlays must trap focus while open and return it on close — Embassy's Radix-based `Dialog`, `Sheet`, and `Alert Dialog` do this for you:

- **Focus moves in** to the overlay on open and is **trapped** (Tab cycles within it).
- **Escape closes**, and focus **returns to the trigger** that opened it.
- **Label the overlay.** Give `Dialog`/`Alert Dialog` a title via `DialogTitle` (auto-wired to `aria-labelledby`); add `aria-describedby` for body context. `Modal` requires `role="dialog"` + `aria-modal="true"` + `aria-labelledby` (GOVERNANCE.md §17.4).
- **Close affordance is a real button.** The Dialog close is `Button variant="icon"` with an `aria-label` — do not replace it with a bare glyph.
- Don't nest a focus trap inside another; open one overlay at a time.

---

## Touch targets (WCAG 2.5.5)

- **Minimum 44×44px** for interactive elements. `Button` size `lg` (min-h 44px) and `xl` (52px) satisfy this directly.
- **`btn-xs` (24px) and `btn-sm` (32px) are below 44px** — only use them where adjacent spacing or a larger wrapping hit area provides the real target (GOVERNANCE.md §17.3). Default to MD+ on primary touch surfaces.
- Icon-only buttons: the `icon` variant is 36px base — bump size or padding on touch-first screens.

---

## Semantic roles & landmarks

- **Search:** the search region uses `role="search"` — both `SearchBar` (`search.tsx`) and `SearchField` (`toolbar.tsx`) set it, plus an `aria-label` like "Buscar". Don't wrap them in another search landmark.
- **Navigation:** use a `<nav>` landmark for nav regions; `<main>` for the primary content; `<header>` for the topbar. The app-shell structure (`aside.sidebar` / `header.topbar` / `main.shell-main`) maps to these.
- **Tables:** `<th scope="col">` on headers and a `<caption>` for context.
- **Tabs:** `role="tablist"`/`tab`/`tabpanel` with `aria-selected` + `aria-controls` (Radix `Tabs` provides these).
- **Filter chips:** `role="checkbox"` + `aria-checked`, or `role="button"` + `aria-pressed`.

---

## Labels & names (WCAG 4.1.2, 3.3.2)

- **Every control has an accessible name** — a visible `<label>` (use the shared `Label` primitive, `@amalgama/ds/label`) or `aria-label`/`aria-labelledby`.
- **Placeholder is not a label.** `Input`'s placeholder disappears on entry and often fails contrast — always pair a real label. Use the placeholder for format hints only ("dd/mm/aaaa").
- **Icon-only buttons require `aria-label`** — an unlabeled `Button variant="icon"` is a defect.
- Use **sentence case** for labels; keep names concise and matched to the visible text.

### Errors on Input / Textarea (WCAG 3.3.1)

`input.tsx` wires this automatically when you pass an `error`:

- Sets `aria-invalid` on the field and toggles it red.
- Links the message with `aria-describedby` (the internal `descId`), so screen readers announce the error with the field.
- Prefer the component's `error`/`hint` props over hand-rolling — that keeps the ARIA wiring intact. `Textarea` mirrors the same contract.

---

## Async feedback with `aria-live`

Content that changes without a reload must be announced:

- **`Snackbar` / Toast:** `role="status"` + `aria-live="polite"` for confirmations; `role="alert"` + `aria-live="assertive"` for errors (GOVERNANCE.md §17.4).
- **Result counts:** the toolbar `ResultCount` and any "X resultados" text should sit in an `aria-live="polite"` region so filtering/search updates are spoken.
- **Loading:** set `aria-busy="true"` on the region (and the triggering `Button`) while a request is in flight.
- Keep live regions in the DOM from first render — injecting the region at announce time is often missed by assistive tech.

---

## Motion & reduced motion (WCAG 2.3.3)

- Embassy ships a global `@media (prefers-reduced-motion: reduce)` rule in `tailwind.theme.css` that near-zeroes animation/transition durations — inherited by any consumer of the theme.
- Don't defeat it with `!important` durations or JS-driven animation that ignores the query.
- No content may flash more than **3 times per second** (WCAG 2.3.1). See `guidelines/motion.md` for the full motion contract.

---

## Screen-reader-only text

- Use the `.sr-only` utility (`base.css`) to add context that's visually redundant but needed aloud — e.g. "Buscar" on a magnifier-only field, or "abre en pestaña nueva" on an external link.
- Don't use `display:none`/`visibility:hidden` for text meant to be announced — those hide it from assistive tech too.

---

## Do / Don't

- **Do** render real `<button>`/`<a>` (via `Button` / `asChild`); **don't** attach `onClick` to a `<div>`.
- **Do** pair every status color with text or an icon (`Badge`, `Alert`); **don't** rely on hue alone.
- **Do** keep `focus-visible:focus-ring`; **don't** `outline: none` without an equal replacement.
- **Do** give every field a real `Label`; **don't** use the placeholder as the label.
- **Do** let `Dialog`/`Sheet`/`Alert Dialog` trap and return focus; **don't** hand-roll overlays that leak focus.
- **Do** use `Input`'s `error` prop (auto `aria-invalid` + `aria-describedby`); **don't** turn a field red with no announced message.
- **Do** announce async changes via `aria-live` (`Snackbar`, `ResultCount`); **don't** update counts silently.
- **Do** use MD+ / `lg` / `xl` buttons on touch; **don't** ship `btn-xs`/`btn-sm` as lone touch targets.

---

## Checklist for a new screen

- [ ] All text meets contrast (4.5:1 body, 3:1 large/UI) in **both** light and `data-theme="dark"`.
- [ ] No status communicated by color alone — every one has text and/or an icon.
- [ ] Every interactive element is a real `<button>`/`<a>` (or `Button` with `asChild`), reachable by Tab in reading order.
- [ ] Focus visible everywhere via `focus-visible:focus-ring` — no stripped outlines.
- [ ] `Dialog`/`Sheet`/`Alert Dialog` trap focus, close on Escape, return focus to the trigger, and are labelled.
- [ ] Primary touch targets ≥ 44px (Button `lg`/`xl`); no lone `btn-xs`/`btn-sm` on touch.
- [ ] Landmarks present: `<nav>`, `<main>`, `<header>`; search regions carry `role="search"` + `aria-label`.
- [ ] Every control has an accessible name (visible `Label` or `aria-label`); no placeholder-as-label.
- [ ] Form errors use `Input`/`Textarea` `error` prop → `aria-invalid` + `aria-describedby`.
- [ ] Async updates (`Snackbar`, result counts, loading) announced via `aria-live` / `aria-busy`.
- [ ] Motion respects `prefers-reduced-motion`; nothing flashes > 3×/s.
- [ ] `.sr-only` added wherever visual context isn't available to a screen reader.

---

## Related

- `guidelines/motion.md` — motion principles and `prefers-reduced-motion` contract.
- `guidelines/ux-laws-and-heuristics.md` — the usability principles these rules serve.
- `GOVERNANCE.md` §6.2 (focus), §5.3 (disabled), §17 (Accessibility Standards).
- Components: **Button**, **Input**, **Textarea**, **Dialog**, **Sheet**, **Alert Dialog**, **Alert**, **Badge**, **Snackbar**, **Tabs**, **Search** (`SearchBar` / `SearchField`), **Label**.
