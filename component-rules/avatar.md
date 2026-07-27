---
id: avatar
display_name: Avatar
aliases: [user avatar, profile picture, initials, gravatar]
category: Display
status: stable
summary: A circle showing a person's photo or initials over a brand tonal fill — identifies a person, never a non-person entity.
when_to_use:
  - "Representing a specific person in the topbar, lists, cards, or assignment rows."
  - "Showing the current user's profile in any application context."
  - "Grouping assignees (stacked avatar group) on a vacancy card or project."
when_not_to_use:
  - "Product images, category icons, or other non-person elements → use an icon (or Icon Button if interactive)."
  - "A generic system/decorative glyph with no person behind it → use a Lucide icon."
  - "Read-only status shown as a standalone dot → use a Badge; on an avatar use the .avatar-badge slot."
use_cases:
  - "Current user in the topbar (avatar-md)."
  - "Assignees on a vacancy card (avatar-group of avatar-md + '+N' overflow)."
  - "Candidate row leading media (avatar-sm/md)."
  - "Account menu trigger (avatar wrapped in a <button>)."

variants:
  - {name: image,    class: avatar-image,       purpose: "Photo fill; falls back to initials if the image fails to load."}
  - {name: fallback, class: avatar-fallback,    purpose: "2-letter initials over the tonal fill when there is no photo."}
  - {name: badge,    class: avatar-badge,       purpose: "Status dot anchored bottom-right (online/busy/away/offline); can hold a small SVG."}
  - {name: group,    class: avatar-group,       purpose: "Stacked/overlapped set of avatars with a surface ring (assignees)."}
  - {name: count,    class: avatar-group-count, purpose: "'+N' overflow cell that closes a group; also hosts an add-person icon."}
sizes:
  - {name: sm, class: avatar-sm, use: "dense list rows, assignee stacks (28px)"}
  - {name: md, class: avatar-md, use: "topbar, standard cards (36px, default)"}
  - {name: lg, class: avatar-lg, use: "profile headers, detail panels (44px)"}
  - {name: xl, class: avatar-xl, use: "large profile / account cards (56px)"}
size_selection: "Match the surrounding density: ~28px in assignee stacks, 36px in the topbar, 44px in a profile header. Font size scales automatically with the size class."

content_rules:
  - "Always 2-letter initials (given name + surname) for maximum legibility — never 3+ characters."
  - "Assign the fill color consistently for the same user across screens (do not recolor per view)."
  - "Provide an image alt with the person's name; the fallback needs an accessible name too (aria-label or a labelled wrapper)."
layout_constraints:
  - "People only — non-person elements use icons, not avatars."
  - "Stack no more than 4–5 avatars without a '+N' overflow count."
  - "The container has no overflow:hidden (the badge would get clipped); the image clips itself via border-radius:inherit."

states:
  default: "Circle with tonal fill (--color-primary-container) + initials, or the photo."
  focus: "Not focusable on its own; when it triggers a menu, wrap it in a <button> with its own focus-visible ring (outline 2px --color-focus + 4px --color-focus-ring)."

accessibility:
  roles: "Static avatar is decorative-ish text; an image needs alt, a fallback needs an accessible name. Interactive avatar (opens a menu) must be a real <button> with aria-haspopup + aria-expanded."
  aria: ["alt on .avatar-image (person's name)", "aria-label on fallback-only avatar ('Iniciales de …')", "aria-label listing people on an avatar-group", "title/aria-label on .avatar-badge stating the status (e.g. 'En línea')"]
  focus: "Only the interactive wrapper is focusable; it carries the standard visible focus ring."
  contrast: "Initials use --color-on-primary-container over the tonal fill — AA in light + dark, no per-theme override. Never use avatar color as the sole identity cue; show the name when space allows."
keyboard:
  - {keys: "Tab", action: "focus the interactive avatar wrapper (only when it triggers a menu)"}
  - {keys: "Enter / Space", action: "open the account menu (interactive wrapper)"}
responsive:
  - "Interactive avatar keeps a ≥ 44px touch target on coarse pointers (wrap a small avatar in a padded button)."

ux_principles:
  - "A consistent color + initials for the same person builds recognition across the product (recognition over recall)."
  - "The status badge communicates presence with a label, not color alone."
common_mistakes:
  - "Using an avatar for a product image, category, or decorative glyph."
  - "More than 4–5 stacked avatars with no '+N' overflow."
  - "Recoloring the same user's avatar between screens."
  - "3+ characters inside the circle."
  - "Making the avatar clickable without wrapping it in a focusable <button>."
nielsen_heuristics:
  - {id: 6, name: "Recognition rather than recall", note: "consistent initials/color let users recognize a person at a glance"}
  - {id: 4, name: "Consistency and standards", note: "same user = same avatar treatment everywhere"}

relationships:
  related: [badge, person-card, list, item, topbar]
  replaces: ["hardcoded-gradient initial divs / ad-hoc profile circles"]
  composed_with: [person-card, item, list, topbar, dropdown-menu]
  not_to_confuse_with:
    - {component: badge, why: "Badge is read-only status text; Avatar identifies a person"}
    - {component: skeleton, why: "skeleton-circle is the loading placeholder for an avatar, not an avatar"}

tokens:
  color: [--color-primary-container, --color-on-primary-container, --color-surface, --color-surface-variant, --color-on-surface-variant, --color-success, --color-error, --color-warning, --color-outline]
  radius: [--radius-full]
  typography: [--font-body]

source:
  css: css/components/avatar.css
  classes: [avatar, avatar-sm, avatar-md, avatar-lg, avatar-xl, avatar-image, avatar-fallback, avatar-badge, avatar-badge-online, avatar-badge-busy, avatar-badge-away, avatar-badge-offline, avatar-group, avatar-group-count]
  react_wrapper: null
  docs_anchor: c-avatar
---

## Correct usage

```html
<!-- Photo with name; falls back to initials if it fails to load -->
<span class="avatar avatar-lg"><img class="avatar-image" src="/users/mg.jpg" alt="Martina González"></span>
```
*Why:* the image carries the person's name; the fallback is automatic.

```html
<!-- Initials-only fallback -->
<span class="avatar avatar-md" aria-label="Iniciales de Carla López"><span class="avatar-fallback">CL</span></span>
```
*Why:* people only, 2-letter initials, accessible name on a fallback-only avatar.

```html
<!-- Stacked assignees with overflow count -->
<div class="avatar-group" aria-label="Asignado a: MG, CL, AM y 4 más">
  <span class="avatar avatar-md"><span class="avatar-fallback">MG</span></span>
  <span class="avatar avatar-md"><span class="avatar-fallback">CL</span></span>
  <span class="avatar avatar-md avatar-group-count">+4</span>
</div>
```

## Incorrect usage

```html
<!-- ✕ Avatar for a non-person entity -->
<span class="avatar avatar-md"><span class="avatar-fallback">🏢</span></span>
```
*Fix:* use a Lucide icon for a company/category; reserve avatars for people.

```html
<!-- ✕ Clickable avatar with no focusable wrapper -->
<span class="avatar avatar-md" onclick="openMenu()"><span class="avatar-fallback">MG</span></span>
```
*Fix:* wrap it in `<button aria-haspopup="menu" aria-expanded="false">` with a visible focus ring.
