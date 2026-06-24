# Component-page validation tracker

Goal: every component page validated against Embassy guidelines/tokens/colors/typography/
spacing/accessibility/behavior, before push → deploy → review at
https://presentations.amalgama.co/p/amalgama-design-system/

## Method per component page (5 tabs)

- **Overview** — the live island showcase. Verify tokens (colors via `--color-*`, radius
  scales with size not variant, fonts Inter/Epilogue/DM Mono, spacing), states (hover/
  focus/active/disabled), dark mode.
- **Specs** — anatomy/measurements. Static SVG mockups stay (light-mode illustrations).
  Convert the *primary* live demo to an island if one remains.
- **Guidelines** — do/don't. See scope note below.
- **Accessibility** — roles, focus ring (`focus-ring` util), contrast, keyboard.
- **Code** — must show the **shadcn/Tailwind API** (`<Button variant="primary">`), not the
  legacy CSS-class API.

## Scope: what to convert vs keep (IMPORTANT)

The single-source-of-truth goal is already met (one repo: `packages/ds` impl + root docs).
Within the docs, a component may appear as an **island** (interactive showcase) AND as
**CSS-class markup** (`class="btn-primary"`) in do/don't, anatomy, code examples, and
teaching sections. **The CSS-class markup is NOT a parallel system** — it's the Embassy
*buildless* output of the same DS, which legitimately stays (see CONSOLIDATION-PLAN Option B).

- ✅ Convert: each page's **primary** variant/Specs demo → island.
- ⛔ Keep as CSS-class: do/don't illustrations, anatomy diagrams, `<code>` examples, and
  teaching sections (e.g. badge names rendered as their own class names).
- 🎯 Highest value: **validate** that islands + CSS both apply Embassy tokens correctly, and
  that the **Code tab teaches the shadcn API**. Fix discrepancies in `packages/ds` (the source).

## Pages (39) — status

Legend: ⬜ not reviewed · 🔍 reviewing · ✅ validated · ⚠ issue found

| Page | Overview | Specs | Guidelines | A11y | Code | Notes |
|---|---|---|---|---|---|---|
| c-button | ✅ | ✅ | ✅ | ✅ | ✅ | Overview island token-correct. Code tab rewritten to real @amalgama/ds API. A11y tab accurate (native button, :focus-visible 2px+4px ring via --color-focus/-ring, WCAG 2.4.7, aria-label/aria-pressed) — no change needed. |
| c-badge | ✅ | ✅ | ✅ | ✅ | ✅ | Overview island correct. Code tab repointed `@/components`/`@/lib`/`npm install cva clsx` → `@amalgama/ds`; "Componente React" reframed to "provisto por @amalgama/ds, no redefinir". A11y tab accurate (read-only span, container-token AA contrast, no color-only states, aria-label/aria-live) — no change needed. |

**Screenshot/Material audit (whole site):** 0 component or Material screenshots exist — the only `<img>` are brand logos. Live examples render via islands. Static SVGs are intentional spec/anatomy diagrams, not screenshots.
| c-chip | ✅ | ✅ | ✅ | ✅ | ✅ | Overview island correct (selected = secondary-container/navy, outlined border = outline, Inter). Code tab was HTML/CSS-only — added @amalgama/ds React section (Chip/InputChip/ChipSet; `selected` drives aria-pressed). A11y tab accurate as-is (assist=button, filter=button aria-pressed, input=span+remove aria-label, set=role=group). |
| c-seg-btn | ✅ | ✅ | ✅ | ✅ | ✅ | Overview island correct. Code tab + React @amalgama/ds section added. A11y FIXED: keyboard table corrected to Radix roving focus (Tab in/out of group, ←/→ between segments) — was wrongly "Tab between segments"; stale --ds-accent contrast tokens → --color-on-secondary-container/-secondary-container/-on-surface. |
| c-input | ✅ | ✅ | ✅ | ✅ | ✅ | Overview island correct (border=--border, radius-md, Inter). Code imports → @amalgama/ds (global repoint). "Copia input.tsx" → "provisto por @amalgama/ds". A11y accurate (focus border --interactive + 3px --color-focus-ring). |
| c-textarea | ✅ | ✅ | ✅ | ✅ | ✅ | Same as input; @amalgama/ds/textarea. |
| c-select | ✅ | ✅ | ✅ | ✅ | ✅ | Radix Select island correct; Code → @amalgama/ds/select; "no redefinir"; a11y focus tokens accurate. |

**Global Code-tab normalization (all pages):** repointed the shadcn copy-in convention → package: `@/components/ui/*`→`@amalgama/ds/*` (15), `@/lib/utils`→`@amalgama/ds/lib/utils` (11), `npm install clsx`→`npm install @amalgama/ds` (8), and "Copia X.tsx a tu proyecto" → "Provisto por @amalgama/ds, no redefinir" (8). 0 generic `@/` paths remain.
| c-checkbox / c-radio / c-switch | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | Radix |
| c-slider | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| c-card / c-basic-card / c-stat-card | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| c-table | ⬜ | ✅ | ⬜ | ⬜ | ⬜ | Specs demos → islands done |
| c-tabs | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| c-dialog / c-sheet / c-snackbar / c-tooltip | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | overlays |
| c-menu / c-list / c-divider | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| c-search | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| c-empty / c-skeleton / c-loading | ⬜ | ✅(empty,stat) | ⬜ | ⬜ | ⬜ | |
| c-avatar / c-progress | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| c-carousel / c-date-picker | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| c-vacancy / c-person / c-kanban | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | domain cards |
| c-app-bar / c-topbar / c-nav-bar / c-nav-drawer / c-nav-card / c-navigation | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | shell/nav |

**Gate:** push + deploy + review on presentations.amalgama.co only after all rows are ✅.

---

## Parallel audit results (2026-06-24) — AUTHORITATIVE

39 pages audited by workflow against the MD3-structure + Embassy/shadcn rubric.
**Status: 4 compliant · 30 minor-gaps · 5 major-gaps.** No Material/component screenshots anywhere ✅. Full per-page detail in `audit-results.json`.

### Cross-cutting gaps (the real remediation backlog)
- **Variant labels/legend under the Overview island — missing on 26 pages:** seg-btn, input, select, textarea, card, basic-card, badge, tabs, dialog, navigation, nav-drawer, nav-bar, topbar, kanban, vacancy, person, app-bar, date-picker, list, menu, radio, sheet, slider, switch, tooltip, nav-card.
- **Overview key-characteristic bullets — missing on 18 pages:** card, basic-card, navigation, nav-bar, app-bar, carousel, checkbox, date-picker, divider, list, loading, menu, radio, sheet, slider, switch, tooltip, nav-card. (audit proposed bullets per page → in audit-results.json)
- **Overview missing description:** date-picker.
- **Overview missing variant island (likely landing/category pages):** card, navigation, app-bar, nav-card; tabs (island present elsewhere).
- **CSS-class visual examples to islandize — 74 total:** button 19, seg-btn 10, input 8, search 7, snackbar 4, chip 4, select 3, badge 3, avatar 3, + 1–2 each on textarea, dialog, basic-card, tabs, skeleton, empty, nav-drawer, topbar, kanban, vacancy, person.
- **Code tab NOT yet @amalgama/ds (12):** fictional/redefined → select, tabs, snackbar, menu; css-class-only → basic-card, nav-drawer, kanban, vacancy, avatar, search, nav-card; mixed → divider.
- **Token issues (8 pages):** button (4 — States section hardcodes hex + shows light+dark side-by-side, violating one-mode rule; .bd-dark-demo #13172B; loose-px size approximations), avatar (2), seg-btn/badge/dialog/snackbar/nav-drawer/person (1 each).
- **A11y issues (11 pages):** seg-btn, navigation, carousel, date-picker, list, loading, menu, radio, sheet, slider (1 each), nav-card (3).

### Correction to earlier ✅ marks
Button/Segmented Button/Badge/Chip/Input/Textarea/Select were marked ✅ on tokens+Code only. Per the structural rubric they are **minor-gaps**: Overview compliant + Code tab now correct, but Specs/Guidelines/Code still contain CSS-class examples that should be islands (Button alone: 19), and most lack the Overview variant legend.
