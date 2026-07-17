# Motion Principles

> How and when Embassy moves — the principles behind the motion tokens, the companion to the Styles → Motion token reference.

## Why it matters

Motion in Embassy is functional, never decorative: it confirms an action, preserves continuity between states, and signals hierarchy. Because the DS ships a dual easing system (Standard for effects, Expressive for spatial moves), motion applied by the wrong rule reads as either lifeless or gimmicky. This guide is the decision layer on top of the raw tokens — what to animate, with which curve, for how long, and when to move nothing at all.

---

## Motion has a purpose

Only animate to serve one of three jobs:

- **Feedback** — confirm the system received input (a `Button` press dip, a `Snackbar` sliding in after "Vacante publicada").
- **Continuity** — connect a before/after so the user doesn't lose their place (a `Sheet` sliding from the edge it will return to, a `Dialog` growing from center).
- **Hierarchy** — direct attention to what changed (the Dialog content zoom is the "hero moment"; its scrim only fades).

If an animation does none of these, remove it. Decoration, parallax, and scroll-linked effects are out of scope (GOVERNANCE.md §13.4).

---

## The dual system: Standard vs. Expressive

Embassy adopts MD3's two easing families, and the split is a hard rule:

- **Standard easing** (`--ease-default`, `--ease-enter`, `--ease-exit`) drives **effects** — anything about color, opacity, or shadow. Effects **never overshoot**.
- **Expressive easing** (`--ease-expressive`, `--ease-expressive-enter`, `--ease-expressive-exit`) drives **spatial moves** — transform: translate, scale, a panel sliding, a button lifting/pressing. These carry a controlled overshoot that approximates spring physics.

**The rule: never overshoot an effect.** A fade or color change on an Expressive curve looks like a glitch. This is why `button.tsx` splits its transition timing per-property — `background-color`, `border-color`, `color`, `box-shadow` all use `--ease-default`, while `transform` (the press/lift) uses `--ease-expressive`. Mirror that pattern: if one transition animates both a color and a transform, give each property its own curve.

---

## Duration tokens — pick by surface size

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 120ms | Micro-interactions: hover bg/border, icon swaps, badge fade, **all exits** on small elements |
| `--duration-normal` | 200ms | Standard state changes: scrim fade, small panel open |
| `--duration-medium` | 300ms | Larger surfaces entering: Dialog content zoom |
| `--duration-slow` | 450ms | Reserved for the largest surface transitions |
| `--duration-sheet` | 500ms | Edge-anchored panels: **all `Sheet` sides** (right/left/bottom/top), symmetric open/close |

**Smaller/faster, larger/slower.** A hover tint is `fast`; a Dialog entering is `medium`; a `Sheet` sliding from an edge is `--duration-sheet` (500ms). **Exits are shorter than entrances** on small elements — but the `Sheet` is symmetric (same 500ms in and out, matching its emphasized curve). See GOVERNANCE.md §11.1a / §20.2.

## Easing tokens — when to use which

| Token | Curve | Use |
|---|---|---|
| `--ease-default` | `cubic-bezier(.4,0,.2,1)` | Default for all effect transitions (color/opacity/shadow) |
| `--ease-enter` | `cubic-bezier(0,0,0,1)` | Decelerating — element entering on an effect (scrim fade-in) |
| `--ease-exit` | `cubic-bezier(.3,0,1,1)` | Accelerating — element leaving (fade-out, closing) |
| `--ease-expressive` | `cubic-bezier(.34,1.56,.64,1)` | Spatial hover/press with overshoot (button lift) |
| `--ease-expressive-enter` | `cubic-bezier(.175,.885,.32,1.4)` | Spatial element entering with overshoot (**Dialog zoom-in**, small zoom/rotate on menus) |
| `--ease-expressive-exit` | `cubic-bezier(.3,0,.8,.15)` | Spatial element leaving |
| `--ease-emphasized` | `cubic-bezier(.32,.72,0,1)` | Emphasized decelerate, **no overshoot** — the shared curve for **all `Sheet` sides** (a bounce reads as unnatural on a large sliding panel) |

**Never hardcode a `cubic-bezier()` or a raw ms value** in component code — always a token (GOVERNANCE.md §13.3). No `ease-in-out`, no `duration-[150ms]`.

---

## Entrance & exit patterns

Overlays declare **both** `data-[state=open]` and `data-[state=closed]` animations — an entrance without a matching exit is a gap, not a style choice (GOVERNANCE.md §11.1a). The adopted patterns:

- **Dialog** (`dialog.tsx`): scrim **fades** (`fade-in-0`, Standard `ease-enter`, `duration-normal`); content **zooms** (`zoom-in-95` + fade, Expressive `ease-expressive-enter`, `duration-medium`). The spatial zoom is the hero moment; the effect-only scrim never overshoots. Both exit faster on `ease-exit` / `duration-fast`.
- **Sheet** (`sheet.tsx`): panel **slides** from its edge (`slide-in-from-{side}`) on `--ease-emphasized` at `--duration-sheet` (500ms) — a smooth decelerate with **no overshoot**, **symmetric** open/close; the overlay fades on the same curve/duration. All four `side`s share this one motion system (only the axis differs). Do **not** use `ease-expressive-*` on a Sheet — the bounce reads as unnatural on a large panel (GOVERNANCE §20.2).
- **Tooltip** (`tooltip.tsx`): quick `fade-in-0 zoom-in-95` on `duration-fast ease-enter`, with a directional `slide-in-from-*` toward the trigger; matching `data-[state=closed]` fade/zoom-out on `ease-exit`.
- **Snackbar / Toast**: slides in on `duration-normal ease-default`; confirms feedback, then leaves.
- **Skeleton / spinner**: continuous shimmer/rotation loops on `--ease-linear` — these are a **separate category, exempt** from the enter/exit tokens (GOVERNANCE.md §11.1a).

If a new component enters/exits, it must map to one of these patterns — an unlisted pattern is a gap to flag, not to improvise.

---

## Hover & press micro-interactions

- **Lift on hover, settle on press.** Filled buttons (`primary`/`secondary`/`elevated`/`danger`/`success`) use `hover:-translate-y-px` and `active:translate-y-0 active:scale-[0.96]` — a spatial move on the Expressive curve.
- **Shadow grows with the lift on Elevated.** The `elevated` variant pairs the translate with `hover:shadow-[var(--btn-elevation-hover)]` (elevation 1 → 2), returning to `--btn-elevation` on press. The shadow is an effect → Standard easing, animated alongside the transform's Expressive easing (per-property split above). Elevation is communicated by shadow, not by lightening the background (GOVERNANCE.md §9.2).
- **`translateY(-1px)` is the only approved transform effect** — no scale-up, no rotate on hover (GOVERNANCE.md §13.3). Filled buttons additionally use a small `active:scale-[0.96]` press for tactile feedback.
- **State-layer color changes are effects.** Hover/press tints (`hover:bg-*`, the `color-mix` state layers) transition on `--ease-default` — never Expressive.

---

## Respecting `prefers-reduced-motion` (WCAG 2.3.3)

- Embassy ships a global `@media (prefers-reduced-motion: reduce)` block in `tailwind.theme.css` that collapses animation/transition durations to ~0 for everything importing the theme — you get it for free.
- **Don't defeat it:** no `!important` durations, no JS animation that ignores the media query.
- **Preserve essential motion.** Feedback that carries meaning (a spinner indicating progress) may remain, but non-essential entrance/continuity motion should honor the reduced setting. A component with special reduced-motion behavior (e.g. Snackbar falling back to a plain fade) may define its own tighter `@media` rule.
- Nothing may flash more than **3 times per second** (WCAG 2.3.1).

---

## Performance

- **Animate `transform` and `opacity` only.** These are GPU-composited and don't trigger layout/paint. The DS's slide/zoom/fade patterns all live in this safe set.
- **Never animate layout properties** — `width`, `height`, `top`/`left`, `margin` — they force reflow and stutter. Use `transform: translate`/`scale` to achieve the same visual.
- **Set `animation-fill-mode: both`** on any keyframe animation to prevent a flash at start/end (GOVERNANCE.md §13.3); the DS animation utilities already do.
- Keep looping animations (shimmer, spinner) cheap and on `--ease-linear`; don't stack many simultaneous loops on one screen.

---

## Do / Don't

- **Do** animate to give feedback, continuity, or hierarchy; **don't** animate for decoration.
- **Do** use Expressive easing for spatial moves (button lift, Sheet slide); **don't** overshoot an effect (fade/color/shadow stays Standard).
- **Do** split per-property timing when one transition mixes transform + color (see `button.tsx`); **don't** put a color fade on an Expressive curve.
- **Do** make exits shorter than entrances (`ease-exit` / `duration-fast`); **don't** reuse the entrance duration for the exit.
- **Do** declare both open and closed animations on overlays; **don't** ship an entrance with no exit.
- **Do** reference `--duration-*` / `--ease-*` tokens; **don't** hardcode ms or `cubic-bezier()`.
- **Do** animate `transform`/`opacity`; **don't** animate `width`/`height`/`top`/`left`.
- **Do** let the global `prefers-reduced-motion` rule stand; **don't** override it with `!important`.

---

## Checklist for a new screen

- [ ] Every animation serves feedback, continuity, or hierarchy — no decoration.
- [ ] Spatial moves use Expressive easing; effects (color/opacity/shadow) use Standard — no overshoot on effects.
- [ ] All durations/easings come from `--duration-*` / `--ease-*` tokens — no raw ms or `cubic-bezier()`.
- [ ] Exits are shorter than entrances and use `ease-exit`.
- [ ] Every overlay declares both `data-[state=open]` and `data-[state=closed]` animations.
- [ ] Any entrance/exit maps to an adopted pattern (Dialog zoom / Sheet slide / Tooltip / Snackbar / Skeleton) — gaps are flagged, not improvised.
- [ ] Button hover/press uses the approved `-translate-y-px` lift (+ shadow growth on Elevated); no scale-up/rotate.
- [ ] Only `transform`/`opacity` are animated; no layout properties.
- [ ] Keyframe animations set `animation-fill-mode: both`; loops use `--ease-linear`.
- [ ] `prefers-reduced-motion` respected (global rule intact); nothing flashes > 3×/s.

---

## Related

- `guidelines/accessibility.md` — the `prefers-reduced-motion` and flash-threshold requirements in context.
- `guidelines/ux-laws-and-heuristics.md` — why feedback and continuity matter (Doherty threshold, visibility of system status).
- `GOVERNANCE.md` §13 (Motion & Animation System), §11.1a (motion checklist), §9 (Elevation).
- Components: **Button** (lift/press, Elevated shadow), **Dialog** (scrim fade + content zoom), **Sheet** (slide), **Tooltip**, **Snackbar**, **Skeleton**.
