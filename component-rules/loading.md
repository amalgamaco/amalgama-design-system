---
id: loading
display_name: Loading (Progress + Spinner)
aliases: [progress, spinner, loader, progressbar, activity indicator]
category: Feedback
status: stable
summary: Loading indicators that signal an operation is in progress — a determinate Progress bar/ring when a percentage is known, an indeterminate Spinner when it isn't.
when_to_use:
  - "An operation is running and you can show real percentage progress → determinate Progress."
  - "A short wait of unknown duration → indeterminate Spinner or indeterminate Progress."
  - "Inline activity inside a button, input, cell, or beside a status text ('Guardando…') → Spinner."
when_not_to_use:
  - "The target layout is known and you can show its shape while loading → use Skeleton."
  - "An empty/no-data result → use Empty State, not an endless spinner."
  - "An instantaneous action (<~300ms) → show no indicator at all."
use_cases:
  - "File upload progress on a candidate CV (determinate linear Progress with a %)."
  - "'Guardando…' spinner inside a btn-primary while a vacancy saves."
  - "Page-top indeterminate bar while a candidate list fetches."
variants:
  - {name: linear,            class: progress,                    purpose: "Determinate horizontal bar; .progress-fill width = percent."}
  - {name: linear-indeterminate, class: "progress progress-indeterminate", purpose: "Unknown-duration horizontal bar (sliding fill)."}
  - {name: circular,          class: progress-circular,           purpose: "Determinate ring; stroke-dashoffset = percent."}
  - {name: circular-indeterminate, class: "progress-circular progress-circular-indeterminate", purpose: "Unknown-duration spinning ring."}
  - {name: spinner,           class: spinner,                     purpose: "Compact rotary indeterminate indicator (par shadcn Spinner)."}
  - {name: spinner-on-primary, class: spinner-on-primary,         purpose: "Spinner tuned to contrast on a filled/colored surface (button, snackbar)."}
sizes:
  - {name: spinner-sm, class: spinner-sm, use: "12px — inside buttons / dense inline"}
  - {name: spinner-md, class: "(default)", use: "16px — standard inline"}
  - {name: spinner-lg, class: spinner-lg, use: "24px — standalone / prominent wait"}
  - {name: progress-circular, class: "(default)", use: "44px ring"}
size_selection: "Spinner for compact/inline waits (sm inside buttons); Progress (linear or circular) when there's measurable advance; Skeleton when the destination layout is known."
content_rules:
  - "Always provide a descriptive aria-label (e.g. 'Cargando' or '65 por ciento') — the indicator has no visible text."
  - "For long operations, pair the indicator with status text for screen-reader users."
layout_constraints:
  - "Linear spans a container width or the page top; circular/spinner live in compact/inline spots."
  - "Never switch between determinate and indeterminate within the same operation."
states:
  default: "Track (--color-surface-variant) + fill/indicator (--color-primary)."
  determinate: "aria-valuenow reflects the real percentage; fill/offset animates to it."
  indeterminate: "aria-valuenow omitted; fill slides / ring spins continuously."
accessibility:
  roles: "Progress: role=progressbar. Spinner: role=status."
  aria: ["aria-valuenow (determinate only)", "aria-valuemin / aria-valuemax (linear)", "aria-label (always)"]
  focus: "Non-interactive; not focusable. Conveys status, not a control."
  contrast: "Indicator on track meets AA in light + dark with no per-theme override; never rely on color alone."
keyboard:
  - {keys: "(none)", action: "loading indicators are not interactive"}
responsive:
  - "Linear bar reflows to its container; spinner size is fixed per size class."
  - "Respects prefers-reduced-motion — the spinner slows its rotation for motion-sensitive users."
ux_principles:
  - "Show progress only for waits long enough to notice (~>300ms); flashing loaders on fast ops feel worse."
  - "Prefer determinate feedback when a percentage exists — it sets expectations and reduces perceived wait."
common_mistakes:
  - "Using an endless spinner where a Skeleton (known layout) or Empty State (no data) fits."
  - "Omitting aria-label so the indicator is silent to screen readers."
  - "Toggling determinate↔indeterminate mid-operation."
  - "Communicating progress by color alone."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "tells the user the system is working and, when determinate, how far along"}
relationships:
  related: [skeleton, empty-state, button]
  replaces: ["hand-rolled per-screen spinners/loaders"]
  composed_with: [button, attachment, dialog]
  not_to_confuse_with:
    - {component: skeleton, why: "Skeleton mimics the incoming layout's shape; Loading is an abstract activity indicator"}
    - {component: empty-state, why: "Empty State handles no-data; Loading handles in-progress"}
tokens:
  color: [--color-primary, --color-surface-variant, --color-outline-variant, --color-on-primary]
  radius: [--radius-full]
  motion: ["1.4s indeterminate slide", "0.7s spinner rotation", "prefers-reduced-motion aware"]
source:
  css: [css/components/progress.css, css/components/spinner.css]
  classes: [progress, progress-fill, progress-indeterminate, progress-circular, progress-circular-track, progress-circular-fill, progress-circular-indeterminate, spinner, spinner-sm, spinner-lg, spinner-on-primary]
  react_wrapper: null
  docs_anchor: c-loading
---

## Correct usage

```html
<!-- Determinate upload progress with an accessible name -->
<div class="progress" role="progressbar" aria-label="Subiendo CV — 60 por ciento"
     aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-fill" style="width:60%"></div>
</div>
```
*Why:* real percentage → determinate; aria-valuenow + label make it announceable.

```html
<!-- Spinner inside a submit button, contrast-tuned for the filled surface -->
<button class="btn-primary" aria-busy="true">
  <span class="spinner spinner-sm spinner-on-primary" role="status" aria-label="Guardando"></span>
  Guardando…
</button>
```
*Why:* short inline wait; spinner-on-primary keeps contrast on the filled button.

## Incorrect usage

```html
<!-- ✕ Endless spinner where the layout is known -->
<div class="card"><span class="spinner" role="status"></span></div>
```
*Fix:* use a Skeleton shaped like the card's content while it loads.

```html
<!-- ✕ Progress with no accessible name -->
<div class="progress" role="progressbar" aria-valuenow="40"><div class="progress-fill" style="width:40%"></div></div>
```
*Fix:* add `aria-label` (and `aria-valuemin`/`aria-valuemax`) so screen readers can announce it.
