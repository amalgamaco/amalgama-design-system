# Embassy Playbook — Product Guidelines

This directory is the **product-thinking layer** of the Amalgama Design System. Where
`packages/ds` documents *what* components exist and `GOVERNANCE.md` documents *how they're
built*, these guides document **how to build great product experiences with them** — the
UX principles, laws, heuristics, and interaction patterns that should guide every new
screen built with Embassy.

It has two audiences, one source of truth:

- **Humans** (designers, developers) read the same content on the docs site under the
  **Playbook** section (`index.html`), in Spanish (rioplatense).
- **AI agents & developers** applying the DS read these `.md` files. When generating a new
  screen, consult the relevant guide(s) here **before** placing components — the goal is
  screens that are usable and consistent, not just token-correct.

> These guides reference Embassy's real components and tokens. They complement — never
> contradict — `CLAUDE.md` (consuming/extending the DS), `GOVERNANCE.md` (cross-component
> rules), and `MIGRATION.md` (restyling existing products).

## Principles — how to think

| Guide | Covers |
|---|---|
| [UX Laws & Heuristics](ux-laws-and-heuristics.md) | Nielsen's 10 usability heuristics + Hick's, Fitts's, Miller's Law, Goal Gradient, Progressive Disclosure, Peak-End, Von Restorff, cognitive load — each mapped to Embassy. |
| [Information Architecture](information-architecture.md) | Grouping, labeling, hierarchy & depth, the navigation model, findability. |
| [Visual Hierarchy](visual-hierarchy.md) | Directing attention with size, weight, color, spacing, position; one primary action per view. |
| [Content & UX Writing](content-and-writing.md) | Rioplatense product voice, labels, microcopy, button/error/empty-state copy. |
| [Accessibility](accessibility.md) | Practical WCAG 2.1 AA for building screens: contrast, keyboard, focus, targets, semantics. |
| [Motion](motion.md) | Purposeful motion, the Standard vs Expressive system, duration/easing tokens, reduced-motion. |

## Patterns — how to build

| Guide | Covers |
|---|---|
| [Forms](forms.md) | Layout, labels, validation, error prevention & recovery, submission feedback. |
| [Tables & Data-Heavy Interfaces](tables-and-data.md) | Density, alignment, sorting, filtering, pagination, empty/loading/error. |
| [Navigation](navigation.md) | App shell, breadcrumbs, tabs vs segmented button, wayfinding, active state. |
| [Dashboards](dashboards.md) | Summary-before-detail, KPI hierarchy, charts, drill-down, scannability. |
| [Feedback & States](feedback-and-states.md) | Empty, loading, error, and success states — the full state lifecycle of a screen. |
| [Responsive & Layout](responsive-layout.md) | Mobile-first, breakpoints, reflow, spacing rhythm, touch targets. |

## How to apply this when building a screen

1. **Frame the screen** with [Information Architecture](information-architecture.md) and
   [Visual Hierarchy](visual-hierarchy.md) — what's the one primary action, what's secondary?
2. **Choose the pattern** — is it a form, a table, a dashboard, a navigation surface? Read
   that pattern guide.
3. **Design the states** up front with [Feedback & States](feedback-and-states.md) — empty,
   loading, error, success — not just the happy path.
4. **Write the copy** per [Content & UX Writing](content-and-writing.md).
5. **Check against** [UX Laws & Heuristics](ux-laws-and-heuristics.md),
   [Accessibility](accessibility.md), [Motion](motion.md), and
   [Responsive & Layout](responsive-layout.md) before calling it done — each guide ends with
   a checklist.
