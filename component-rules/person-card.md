---
id: person-card
display_name: Person Card
aliases: [profile card, candidate card, people card]
category: Domain cards
status: stable
summary: A documented Person variant of Basic Card (Item) — a compact profile row (brand avatar + name + role); NOT a separate component.
when_to_use:
  - "Showing candidate or people profiles in lists and directories."
  - "Team dashboards, recruiter or interviewer assignment."
  - "A compact preview before navigating to the full profile."
when_not_to_use:
  - "The full candidate detail → use a dedicated profile view."
  - "When privacy requires hiding the name/photo → don't surface a Person Card."
  - "A vacancy → use Vacancy Card."
  - "A generic row without a brand avatar → use Basic Card (item) directly."
use_cases:
  - "Grilla de candidatos con avatar, nombre y rol."
  - "Asignación de entrevistadores en un dashboard de equipo."
variants:
  - {name: person-card, class: "item item-outline item-clickable person-card", purpose: "The Person variant: Basic Card markup + brand avatar + surface bg + hover-shadow."}
  - {name: avatar, class: "item-media person-avatar", purpose: "Circular tonal avatar (secondary-container/on-container) in the item-media slot."}
sizes:
  - {name: default, class: "(default)", use: "inherits Basic Card (item) density; avatar 44px"}
size_selection: "Single density — it's the Item primitive with a brand avatar. For a smaller row use .item-sm on the base Item; layout, padding and gap all come from item.css."
content_rules:
  - "Name (item-title) + role (item-description) are the minimum required content."
  - "Always show avatar initials as a fallback when there's no image."
  - "Use consistent avatar colors for the same user across the app."
  - "Don't show sensitive contact data (phone, email) in the list card without explicit permission."
layout_constraints:
  - "It IS a Basic Card: markup is .item item-outline item-clickable person-card; avatar in .item-media, name/role in .item-content > .item-title/.item-description."
  - "The CSS only adds the tonal avatar + surface bg + hover-shadow; everything else comes from item.css."
  - "Group in .people-grid (auto-fill, minmax 280px)."
states:
  default: "Surface-bg card (item is otherwise transparent)."
  hover: "item-clickable hover + elevated shadow-md (reinforces the grid-card pattern)."
  focus: "Inherits Item focus: border → --color-focus + 3px --color-focus-ring; needs tabindex=0 + role=button."
accessibility:
  roles: "Clickable <div> — add tabindex=\"0\" and role=\"button\" (or use <a class=\"item person-card\">) so it's focusable and announced."
  aria: ['tabindex="0" + role="button" on the interactive card', "single clear activation point when it navigates", 'avatar has alt with the person''s name, or aria-hidden="true" when the name is visible']
  focus: "Inherits Item's :focus-visible; don't suppress it."
  contrast: "--text-primary/-muted meet AA in light + dark; avatar initials use --color-on-secondary-container over the tonal fill. Never use avatar color alone as the person's unique identifier."
keyboard:
  - {keys: "Tab", action: "focus the card"}
  - {keys: "Enter / Space", action: "open the person's profile"}
responsive:
  - "Grid reflows (auto-fill minmax 280px); keep the card a ≥44px touch target."
  - "Don't truncate the name without offering a tooltip with the full name."
ux_principles:
  - "A face + name + role is the fastest way to recognize a person (recognition over recall)."
  - "It's a variant, not a new component — reuse the Item primitive rather than forking a card."
common_mistakes:
  - "Treating it as a separate component instead of a Basic Card variant."
  - "Showing sensitive contact data in the list card without permission."
  - "Truncating the name with no full-name tooltip."
  - "Using avatar color as the sole identifier of a person."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "avatar + name + role make the person instantly recognizable"}
  - {id: 4, name: "Consistency and standards", note: "same avatar color for the same user everywhere"}
  - {id: 2, name: "Match between system and real world", note: "a face-and-name card mirrors how people identify each other"}
relationships:
  related: [item, avatar, vacancy-card]
  replaces: ["custom profile cards"]
  composed_with: [avatar, badge]
  not_to_confuse_with:
    - {component: item, why: "Person Card IS the Item primitive with a brand avatar — not a distinct component"}
    - {component: vacancy-card, why: "Vacancy Card is for jobs; Person Card is for people"}
    - {component: avatar, why: "Avatar is just the image/initials; Person Card is the whole profile row"}
tokens:
  color: [--card-bg, --color-secondary-container, --color-on-secondary-container, --text-primary, --text-muted]
  radius: ["50% (avatar)"]
  shadow: [--shadow-md]
source:
  css: css/components/person-card.css
  classes: [people-grid, "item", "item-outline", "item-clickable", person-card, "item-media", person-avatar, "item-content", "item-title", "item-description"]
  react_wrapper: null
  docs_anchor: c-person
---

## Correct usage

```html
<!-- Person = Basic Card (item) + brand avatar; focusable, initials fallback -->
<div class="people-grid">
  <div class="item item-outline item-clickable person-card" tabindex="0" role="button" aria-label="Ver perfil: María García">
    <div class="item-media person-avatar">MG</div>
    <div class="item-content">
      <div class="item-title">María García</div>
      <div class="item-description">Desarrolladora Frontend</div>
    </div>
  </div>
</div>
```
*Why:* it's the Item primitive with a tonal avatar; keyboard-focusable, name + role are the minimum content.

## Incorrect usage

```html
<!-- ✕ A forked bespoke profile card instead of the Item variant -->
<div class="my-profile-card"><img src="…"><span>María García</span></div>
```
*Fix:* use `.item item-outline item-clickable person-card` — Person Card is a Basic Card variant, not a new component.

```html
<!-- ✕ Sensitive contact data on the list card, name truncated with no tooltip -->
<div class="item person-card">
  <div class="item-content"><div class="item-title">María G…</div><div class="item-description">+54 11 5555-5555</div></div>
</div>
```
*Fix:* keep name + role only; add a full-name tooltip; move contact data behind the profile detail + permission.
