# Amalgama DS — Content Strategy Analysis
## Home & Get Started pages
**Date:** May 2026  
**Reference:** Material Design 3 (m3.material.io)  
**Author:** Analysis for Amalgama Design Team

---

## 1. What Material Design 3 includes in each page

### MD3 Home (m3.material.io)

MD3's home is an **editorial, discovery-first landing page**. Its job is not to explain what Material Design is — it assumes you already know — but to:

- Create a strong first impression with a hero and tagline ("Build beautiful, usable products faster")
- Surface the most recent releases and what's changed
- Showcase the system visually (component highlights, theming demos)
- Provide fast paths to key areas: Figma kit, Flutter, Android, Web
- Communicate ecosystem breadth: it's not just components, it's a whole design+code system
- Signal credibility: open-source, maintained by Google, used at scale

Key content blocks on MD3 Home:
1. Hero + tagline + primary CTA ("Get started")
2. What's new / featured highlights (visual, card-based)
3. System overview cards (Design, Develop, Components, Theme)
4. Tool ecosystem (Figma, Material Theme Builder, code repos)
5. "Recently updated" or featured components
6. Footer with quick links

MD3 Home is **audience-aware**: it speaks to both designers and developers simultaneously, with separate visual paths.

---

### MD3 Get Started (m3.material.io/get-started)

MD3's get-started page is an **onboarding and orientation guide**. It answers: "I've arrived. Where do I go? What is this? How do I begin?" It contains:

1. **What is Material Design?** — a one-paragraph system definition
2. **Who is this for?** — explicitly addresses designers and developers in separate tracks
3. **How the system is organized** — map of foundations → styles → components → develop
4. **Design track** — Figma kit, how to use styles and components in design tools
5. **Develop track** — code libraries, installation paths (Flutter, Android, Compose, Web)
6. **Suggested path by role** — clear branching: "I'm a designer → do X" / "I'm a developer → do Y"
7. **First steps checklist** — actionable next steps, not general philosophy

MD3 Get Started is deliberately **role-based and action-oriented**. It doesn't teach the system — it routes people into it.

---

## 2. What our current pages include

### Current Amalgama DS Home

| Block | What it says |
|---|---|
| Hero + tagline | "El sistema que mueve todo lo que construimos" |
| Stats row | 22+ Components, 80+ Design tokens, MD3 Token architecture, 0 Build deps |
| System overview | "¿Qué hay en el sistema?" — 4 layers: Foundations, Tokens, Components, Guidelines |
| Design principles | 4 principles: Claridad, Tokens primero, Copia y pega, Accesible por defecto |
| Changelog | "Nuevo en v2.0: Arquitectura de tokens semánticos MD3, Dark Mode…" |

### Current Amalgama DS Get Started

| Block | What it says |
|---|---|
| Title | "Guia de uso" |
| Section 1 | Installation: how to link 4 CSS files |
| Section 1B | Option B: link only specific components |
| Section 2 | Page structure: the app shell (sidebar + topbar + content) |
| Section 3 | How to use a component (find → copy → paste) |
| Section 4 | How to customize tokens (table of key tokens) |
| Section 5 | File structure explanation |
| Section 6 | Naming conventions (patterns, BEM-style) |
| Section 7 | Quick template (full HTML boilerplate) |

---

## 3. Comparison table: Material Design 3 vs Amalgama DS

| Content block | MD3 Home | MD3 Get Started | Our Home | Our Get Started | Assessment |
|---|:---:|:---:|:---:|:---:|---|
| System identity / tagline | ✅ | — | ✅ | — | ✅ Both have it |
| Who the DS is for | — | ✅ | ❌ | ❌ | **Missing entirely** |
| What the DS is (definition) | — | ✅ | Partial | ❌ | **Missing from Get Started** |
| How the docs are organized | — | ✅ | ❌ | ❌ | **Missing entirely** |
| Role-based paths (designer/dev) | ✅ | ✅ | ❌ | ❌ | **Missing entirely** |
| What's new / changelog | ✅ | — | Partial | ❌ | Misplaced (brief, not scannable) |
| Featured / recent components | ✅ | — | ❌ | ❌ | Missing from Home |
| Quick links to key sections | ✅ | ✅ | Partial | ❌ | Weak on both pages |
| Installation / technical setup | — | — | ❌ | ✅ | Get Started is too technical |
| File structure explanation | — | — | ❌ | ✅ | Wrong page (belongs in Develop) |
| Naming conventions | — | — | ❌ | ✅ | **Wrong page (belongs in Develop)** |
| Design principles | — | Partial | ✅ | ❌ | Misplaced on Home |
| Token customization guide | — | — | ❌ | ✅ | Too detailed for Get Started |
| System layer overview | — | ✅ | ✅ | ❌ | On wrong page (Home vs Get Started) |
| Changelog | ✅ | — | Partial | ❌ | Good idea, needs expansion |
| Page template / boilerplate | — | — | ❌ | ✅ | Belongs in Develop |

---

## 4. Main issues found

### Issue 1 — Home is explaining the system instead of showcasing it

The "¿Qué hay en el sistema?" block (4 layers: Foundations, Tokens, Components, Guidelines) teaches you the structure of the DS. That is **Get Started content**, not Home content. Someone who already knows the system and comes back to Home doesn't need that every time. Home should tell you **what's current**, not what the system is.

### Issue 2 — Get Started is a developer install guide, not an onboarding page

The current Get Started is a **technical README**. It answers "how do I install this?" but not "what is this?", "who should use it?", or "where do I begin based on my role?". A product designer who opens Get Started today would leave confused — there's nothing for them. The content is entirely developer-oriented.

### Issue 3 — Design principles are on the wrong page

The 4 design principles (Claridad, Tokens primero, Copia y pega, Accesible por defecto) explain **why the DS was built the way it was**. This is orientation content that belongs in Get Started or in a dedicated "About / Philosophy" section — not on the Home page that returning users see every time.

### Issue 4 — There is no role-based orientation anywhere

Neither page answers: "I'm a designer, what do I do?" or "I'm a developer, where do I start?" This is a critical gap. Amalgama's DS serves at least two distinct audiences (product designers, frontend developers) and possibly a third (product managers who use it for specs). There is no routing for any of them.

### Issue 5 — The changelog is a one-liner, not a real changelog

"Nuevo en v2.0: Arquitectura de tokens semánticos MD3, Dark Mode completo…" is a single run-on paragraph. A real changelog that lives on Home should be scannable, dated, and structured so returning users can see at a glance what changed since their last visit.

### Issue 6 — File structure, naming conventions, and the HTML template belong in Develop, not Get Started

Sections 5, 6, and 7 of the current Get Started are developer-reference material. They're not about starting — they're about going deep. Moving them to the Develop section would make Get Started shorter, friendlier, and accessible to non-developers.

### Issue 7 — "Get started" and "Guia de uso" are conceptually different titles for the same page

The sidebar label says "Get started" but the page heading says "Guia de uso" (Usage guide). These are different concepts. "Guia de uso" implies a reference manual. "Get started" implies an introduction. The content currently is closer to a reference manual, which conflicts with the expectation set by "Get started."

### Issue 8 — Home has no "quick access" to the most useful sections

A returning user (the most common user of a DS doc site) opens the Home and wants to jump somewhere fast. The current Home gives them two CTAs ("Explorar componentes" and "Guia de uso") but nothing that surfaces the most-visited pages, the newest content, or the most important updates.

---

## 5. Recommended role for each page

### Home — "What's happening and where to go next"

Home is for **returning users** (50–70% of traffic on a design system doc site is repeat visits). It should answer:
- What's new since I last visited?
- What was recently updated or added?
- What are the key areas I use most?
- Is there anything I should know before I start today?

Home should be **fast to scan**, **visually driven**, and **not require reading**. You should be able to skim it in 10 seconds.

### Get Started — "What is this and how do I begin"

Get Started is for **first-time users** (the onboarding experience). It should answer:
- What is Amalgama DS and why does it exist?
- Who is it for (and am I the right audience)?
- How is the documentation organized?
- What does each section mean?
- What should I do first based on my role?

Get Started should be **welcoming, readable, and role-aware**. It should take about 5 minutes to read and leave you knowing exactly where to go next.

---

## 6. Proposed new Home structure

### Block 1 — Slim hero (keep but reduce)
A single headline and tagline. No explanation. Users who already know the system don't need the definition repeated every time.
```
Amalgama Design System
El sistema que mueve todo lo que construimos.
[Explorar componentes]  [Ver novedades]
```

### Block 2 — What's new (new — flagship block)
A structured, dated changelog. This is the most valuable thing on the Home for returning users.
```
Novedades
─────────────────────────────────────────────
🆕  Mayo 2026   Dark Mode completo + tokens semánticos MD3
🆕  Abril 2026  Nuevas secciones: Ilustraciones, Motion, Writing
🔄  Marzo 2026  Badge, Table, Kanban — specs y Do/Don't ampliados
🐛  Marzo 2026  Correcciones en Topbar y Avatar (layout.css)
```

### Block 3 — Quick access (feature grid)
Cards that route returning users to the most-used areas. No explanation needed — just scannable labels and icons.
```
[ Foundations ]  [ Styles ]  [ Components ]  [ Develop ]
[ Tokens ]       [ Logos ]   [ Typography ]  [ Get Started ]
```

### Block 4 — Featured components (visual)
3–4 components that are new, recently updated, or most commonly used. Visual previews, not text.
```
Recently updated
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Button     │ │  Badge      │ │  Kanban     │
│  9 variants │ │  7 states   │ │  Domain     │
└─────────────┘ └─────────────┘ └─────────────┘
```

### Block 5 — System stats (slim, keep)
Keep the stats row but make it minimal and accurate.
```
22+ Componentes  |  80+ Design tokens  |  CSS nativo  |  Sin dependencias
```

### Block 6 — Design principles (move here from current Home — or remove)
If kept, collapse into a small accordion or strip. Design principles are secondary content on Home.

---

## 7. Proposed new Get Started structure

### Block 1 — What is Amalgama DS?
A 2–3 sentence definition that a new team member can read in 30 seconds.
```
Amalgama DS es la librería de componentes UI y sistema de tokens de Amalgama.
Centraliza todas las decisiones visuales — colores, tipografía, espaciado,
componentes — en una sola fuente de verdad para diseñadores y desarrolladores.
```

### Block 2 — Who is it for?
Explicitly acknowledge both audiences and give them a path.
```
Para diseñadores
→ Usás el DS en Figma para componer interfaces con componentes ya definidos.
  Tu entrada: Foundations → Styles → Components

Para desarrolladores
→ Usás el DS en código copiando HTML + CSS a tu proyecto.
  Tu entrada: Develop → Components → Foundations
```

### Block 3 — How the documentation is organized
A visual map of the 5 sections with a one-line description each.
```
Foundations   Principios base: color, tipografía, espaciado, accesibilidad
Styles        Aplicación visual: elevación, íconos, ilustraciones, motion
Components    Piezas de UI: specs, estados, ejemplos y código
Develop       Setup técnico: instalación, tokens, convenciones, plantillas
Get started   Estás acá — orientación general del sistema
```

### Block 4 — Design principles (move FROM Home)
This is the right place to explain the "why" behind the DS.
```
Claridad sobre complejidad / Tokens primero / Copia y pega / Accesible por defecto
```

### Block 5 — Installation (keep, but summarize)
A short installation block — not 7 detailed sections. Link to Develop for the full technical reference.
```
1. Instalación rápida (3 líneas de código)
2. Cómo usar un componente (copy-paste flow)
   → Ver referencia completa en Develop →
```

### Block 6 — Where to go next (role-based CTAs)
End the page with clear next steps so no one gets lost.
```
Soy diseñador    →  [Ver Foundations]   [Ver Styles]
Soy desarrollador → [Ver Develop]       [Ver Components]
Quiero explorar  →  [Ver Components]   [Ver Tokens]
```

---

## 8. Content that should move

| Content | Current location | Should move to |
|---|---|---|
| System layer overview (4 layers) | Home | Get Started |
| Design principles | Home | Get Started |
| File structure reference | Get Started | Develop |
| Naming conventions | Get Started | Develop |
| HTML page template | Get Started | Develop |
| Token customization deep-dive | Get Started | Develop |
| Changelog (brief mention) | Home | Expand and keep on Home |
| "Who is it for?" | Nowhere | Get Started |
| "How docs are organized" | Nowhere | Get Started |
| Role-based paths | Nowhere | Get Started + Home |
| Featured / recently updated | Nowhere | Home |

---

## 9. Specific copy recommendations

**Home headline:** Keep "El sistema que mueve todo lo que construimos." — it's strong. Don't change it.

**Home subtitle:** Remove or shorten. "Tokens, componentes, guías de motion y contenido — una sola fuente de verdad para todos los productos Amalgama." This is fine but too long for a tagline. Trim to: "Una sola fuente de verdad para todos los productos Amalgama."

**Get Started headline:** Change from "Guia de uso" to "Empezá acá" or "Introducción". "Guia de uso" reads as a reference manual, not an onboarding page.

**Get Started first paragraph (missing — add this):**
> "Amalgama DS es el sistema de diseño interno de Amalgama. Reúne tokens, componentes y guías de uso en un solo lugar para que diseñadores y desarrolladores trabajen desde la misma fuente de verdad. No requiere instalación de paquetes — solo HTML y CSS."

**Changelog format (rewrite):**
Instead of: "Nuevo en v2.0: Arquitectura de tokens semánticos MD3, Dark Mode completo, secciones de Ilustraciones…"

Use:
```
v2.0 — Mayo 2026
  + Arquitectura de tokens semánticos MD3
  + Dark Mode completo con data-theme="dark"
  + Nuevas secciones: Ilustraciones, UI Animations, Content / Writing
  ~ Documentación extendida: specs y Do/Don't en todos los componentes
  ~ Badge, Button, Input — variantes adicionales
```

---

## 10. Summary: Priority actions

| Priority | Action |
|:---:|---|
| 🔴 High | Add "Who is it for?" block to Get Started |
| 🔴 High | Add "How the docs are organized" map to Get Started |
| 🔴 High | Add role-based paths (designer / developer) to Get Started |
| 🔴 High | Move file structure + naming conventions + template to Develop |
| 🟡 Medium | Expand and reformat the Changelog on Home |
| 🟡 Medium | Move design principles from Home to Get Started |
| 🟡 Medium | Add "Quick access" feature grid to Home |
| 🟡 Medium | Add "Featured components" block to Home |
| 🟢 Low | Rename "Guia de uso" heading to "Empezá acá" or "Introducción" |
| 🟢 Low | Shorten Home subtitle |
| 🟢 Low | Add quick-start summary at the top of Get Started (link full docs to Develop) |
