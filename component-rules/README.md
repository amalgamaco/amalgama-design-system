# Component Rules — the operational source of truth

Machine-readable, skill-consumable usage rules for every Amalgama DS component.
This directory exists so that **future UI-generation workflows and the
`design-system` skill can *select and use* components with product + UX judgment**,
not just reproduce their visual appearance.

It is the authoritative answer to *"which component, which variant, which size,
and how do I use it correctly?"* — the guidance that must **not** live only inside
rendered HTML documentation.

## Where this fits

| Source | Answers |
|---|---|
| `css/components/<name>.css` | how the component is **implemented** (classes, tokens, states) |
| `index.html` (Specs/Guidelines tabs) | **human** documentation (rendered, browsable) |
| `guidelines/*.md` (Playbook) | how to build a good **screen** (cross-component UX patterns) |
| **`component-rules/<id>.md` (this dir)** | **operational per-component rules** — the decision + usage contract, structured for machines |

`component-rules/` **consolidates and supersedes** the `Cuándo usar / Cuándo no /
Reemplaza a` prose blocks in the CSS headers: the same guidance, plus states,
keyboard, accessibility, heuristics, relationships, and worked examples — in a
parseable shape.

## Format

One file per component: `component-rules/<page-id>.md` (e.g. `button.md`,
`chip.md`, `dialog.md`), where `<page-id>` is the `c-<id>` route without the
`c-` prefix. Each file is **YAML frontmatter (the machine-readable contract) +
a Markdown body (human prose, correct/incorrect examples)**.

### Frontmatter schema

```yaml
id: button                      # matches css/components/<id>.css and route c-<id>
display_name: Button
aliases: [btn, cta]             # other names this maps to (for legacy mapping)
category: Actions               # nav/taxonomy group
status: stable                  # stable | beta | deprecated
summary: One sentence — what it is and its single job.

when_to_use:                    # bullet rules, imperative
  - ...
when_not_to_use:                # includes the correct alternative each time
  - "<situation> → use <other component>"
use_cases:                      # concrete product scenarios
  - ...

variants:                       # every supported variant + its intended purpose
  - {name: primary,   class: btn-primary,   purpose: "the one main action of a context"}
  - {name: secondary, class: btn-secondary, purpose: "equal-alternative actions (neutral fill + outline, not the accent tonal)"}
sizes:                          # every supported size + when to pick it
  - {name: md, class: "(default)", use: "standard density"}
size_selection: "Rule of thumb for choosing a size."

content_rules:                  # label / content rules
  - "Sentence case, concise, verb-first."
layout_constraints:             # hard layout rules
  - "Never full-width; intrinsic width, centered content."

states:                         # ONLY the states this component actually supports
  default: "..."
  hover: "..."
  focus: "focus-visible ring via --color-focus / --color-focus-ring"
  active: "..."
  disabled: "..."
  loading: "..."               # omit keys that don't apply
  error: "..."
  destructive: "..."

accessibility:
  roles: "native <button>; icon-only needs aria-label"
  aria: [...]
  focus: "visible focus ring; logical tab order"
  contrast: "text on fill meets AA in light + dark (tokens guarantee it)"
keyboard:
  - {keys: "Enter / Space", action: "activate"}
  - {keys: "Tab", action: "move focus"}
responsive:
  - "Touch target ≥ 44px on coarse pointers."

ux_principles:                  # the 'why' — good practice
  - ...
common_mistakes:                # the anti-patterns to refuse
  - ...
nielsen_heuristics:             # only the ones genuinely relevant, with a note
  - {id: 1,  name: "Visibility of system status", note: "loading state on submit"}
  - {id: 6,  name: "Recognition over recall",     note: "clear labels, not icons alone"}

relationships:
  related: [segmented-button, button-group]
  replaces: ["legacy CTA/action buttons"]
  composed_with: [dialog, toolbar, form]
  not_to_confuse_with: [{component: chip, why: "chips filter/select; buttons act"}]

tokens:                         # the key token contract (not exhaustive)
  color: [--color-primary, --color-on-primary]
  radius: "--radius-* scales with size"
  motion: [--duration-fast]

source:
  css: css/components/button.css
  classes: [btn-primary, btn-secondary, btn-tertiary, btn-text, icon-btn]
  react_wrapper: components/ui/button.tsx     # or null
  docs_anchor: c-button
```

### Body

After the frontmatter, a short Markdown body:

- **Correct usage** — 1–3 concrete snippets with a one-line why.
- **Incorrect usage** — 1–3 anti-pattern snippets with the fix.
- Any nuance too rich for frontmatter.

## How skills should consume it

1. Parse the frontmatter of the relevant `component-rules/<id>.md`.
2. Use `when_to_use` / `when_not_to_use` / `not_to_confuse_with` to **select** the
   component; `variants` + `size_selection` to configure it; `content_rules` +
   `layout_constraints` + `states` + `accessibility` + `keyboard` + `responsive`
   to **implement** it correctly.
3. Honor `common_mistakes` as hard "do not" constraints.
4. Fall back to `css/components/<id>.css` for implementation detail and
   `guidelines/*.md` for screen-level patterns.

## Coverage

See `component-rules/INDEX.md` for the authored/pending status of every component.
Exemplars (fully authored): `button`, `chip`, `dialog`. The remaining components
are being ported from their CSS-header decision rules + Guidelines tabs into this
schema (tracked in `INDEX.md`).
