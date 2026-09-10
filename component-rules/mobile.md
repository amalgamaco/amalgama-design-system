---
id: mobile
display_name: Mobile (React Native)
aliases: [nativo, app nativa, react native, expo, gluestack, nativewind, escala nativa, target táctil]
category: Layout
status: stable
summary: What changes when the target is a native app instead of a browser — the type scale, the density, the touch floor and the component map — and, more importantly, what does not change.

when_to_use:
  - "Every screen of a React Native app. Detected objectively: expo / react-native / nativewind in package.json, or app.json + metro.config.js."
  - "Read it BEFORE placing anything, together with COMPOSICION.md. The scale is not a detail you fix at the end: it decides row heights, which patterns fit and whether a table is possible at all."
when_not_to_use:
  - "Responsive web, even when it is used mostly on a phone. A React or Next project opened on a phone is still web: it has hover, an app shell, a viewport that grows and CSS. The rule that applies there is guidelines/responsive-layout.md."
use_cases:
  - "A member app for a gym client, white-label with their brand."
  - "An internal Amalgama app."
  - "Porting one screen of an existing product to native to see whether the tokens hold."

variants:
  - {name: native, class: "[data-platform=\"native\"]", purpose: "The block in css/variables.css that holds the native values. Exported as the `native` and `nativeDark` objects in tokens/embassy.tokens.ts. It is NOT a theme: light/dark is a colour axis, desktop/native is a size axis, and a native app in dark uses both at once."}
  - {name: web, class: ":root", purpose: "The desktop values. Shipping these inside an app is failure M5, not a default."}
sizes:
  - {name: "(no aplica)", class: "—", use: "the platform is not a size modifier; it is which set of values gets read."}
size_selection: "There is nothing to choose: the platform decides. What IS a decision, per screen, is the native pattern — the map below."

content_rules:
  - "**Sizes are never typed by hand.** They come from `native` / `nativeDark`. A literal number is failure M1."
  - "The body base is 16 in native, not 13.5. Buttons, inputs and rows read the same token, so they follow."
  - "The editorial register stops being fluid — there is no viewport that grows — and freezes at 44 / 34 / 28. Going up a step on a tablet is done by hand."
  - "One editorial opening and one overline per screen, exactly as on the web (H9, H7). On a phone the repetition shows more, not less."
layout_constraints:
  - "**Everything touchable is 48 or more** (`--target-min`), with at least 8px between two targets. Less is M2 and it is blocking. 48 covers iOS (44) and Android (48) at once."
  - "The touchable surface is not what is drawn: a 24px icon inside a 48px pressable is correct — solved with `hitSlop`, never by enlarging the icon."
  - "**The safe area is read, never hardcoded.** `useSafeAreaInsets()` top and bottom; a fixed `paddingTop: 44` is M3, because the notch differs per phone and does not exist on Android."
  - "There is no app shell. The frame is a tab bar plus a stack navigator; `css/layout.css` does not apply."
  - "There is no `max-width` and no 12-column grid. One column, and `--screen-gutter` on each side. `--screen-gutter` is deliberately NOT `--column-gutter`: crossing them is M6."
  - "The line measure is not set in `ch` — RN has no such unit. The gutter already caps it; if a paragraph still reads badly, shorten the text rather than inventing a maxWidth."

states:
  default: "Not a component — a set of platform values. Component states are unchanged: each one keeps the states in its own rule file."

accessibility:
  roles: "The RN equivalents, not the web ones: `accessibilityRole` on Pressable, `accessibilityLabel` on icon-only controls."
  aria: ["There is no aria in RN. `accessible`, `accessibilityLabel`, `accessibilityState` and `accessibilityHint` replace it"]
  focus: "There is no keyboard focus ring; what matters is the screen-reader order and that every control announces its name and state."
  contrast: "Unchanged: the 182 colours are the same and were verified in both themes. The bigger scale only improves legibility."
keyboard:
  - {keys: "—", action: "there is no keyboard navigation; the equivalent is VoiceOver / TalkBack order"}
responsive:
  - "The axis is not width, it is platform. A tablet uses the same native values plus one step up on the editorial register, by hand."
  - "iOS and Android do not draw shadows, fonts or ripple the same way: one screenshot is not evidence (M9)."

ux_principles:
  - "The thumb reaches the bottom of the screen, not the top: the primary action lives in a bottom bar, not in a header (Fitts's law on a held device)."
  - "A pattern is chosen for the device, not shrunk from another one. A table scrolled sideways is a table nobody reads."
  - "Platform conventions are prior knowledge: matching the sizes iOS and Material use is consistency with the world, not with us (Nielsen 4)."
common_mistakes:
  - "Reading `light` / `dark` instead of `native` / `nativeDark`, and shipping the desktop scale in an app (M5). It is the single most common one, because the import compiles."
  - "Passing `lineHeight: 1.5` or `letterSpacing: '-0.02em'`. RN measures both in points and silently draws wrong — it reports no error (M7). The rule is `fontSize * multiplier`."
  - "Porting the desktop pattern at a smaller size: a data-table, a small centred modal, a floating dropdown, a tooltip that needs hover, numbered pagination (M4)."
  - "Putting a form inside a modal. On 390px it is a trap: it gets its own screen."
  - "Copying a gluestack component and leaving its utilities untranslated — `bg-blue-500`, `rounded-xl`, `text-sm` (A8 / M8). Its structure and behaviour are taken; its palette, radii, scale and shadows are not."
  - "Editing `tokens/` by hand. It is generated: the value is changed in the DS and regenerated, and `build-tokens.mjs --check` fails if it drifted."
  - "Assuming the space layer is fine in a client app because it is 'only a background'. It is H12 and it is blocking on any platform."
nielsen_heuristics:
  - {id: 4, name: "Consistency and standards", note: "matching the platform's own sizes and patterns is what makes an app feel native"}
  - {id: 8, name: "Aesthetic and minimalist design", note: "less per screen, because the screen is smaller — not the same content at a smaller size"}

relationships:
  related: [composition, layout, table, data-table, sheet, toolbar, modal]
  replaces: ["the desktop scale used verbatim inside an app", "the 44px that lived loose inside media queries in components.css"]
  composed_with: [composition]
  not_to_confuse_with:
    - {component: composition, why: "COMPOSICION.md still applies almost in full; this only lists what needs a viewport and therefore drops — the grid, the max-width, the ch measure"}
    - {component: layout, why: "layout.css is the web app shell. In native there is none: tab bar plus stack"}
    - {component: space, why: "the space layer is Amalgama's and never ships in a client product — that does not change on any platform"}

tokens:
  color: []
  spacing: [--target-min, --row-height, --control-height, --screen-gutter]
  typography: [--font-size-body-md, --font-size-body-lg, --font-size-label, --font-size-caption, --font-size-display, --font-size-heading-md, --font-size-editorial-lg]

motion:
  entrance: "the platform's own — the stack navigator's transition, not a hand-written one"
  duration: "the navigator's default; a custom transition is a decision, not a default"
  easing: "Easing.bezier() with the values from --ease-*, already converted in tokens/NATIVE-NOTES.md"
  reduced_motion: "AccessibilityInfo.isReduceMotionEnabled() — the RN equivalent of prefers-reduced-motion"

related_rules: [MOBILE.md, COMPOSICION.md]

source:
  css: css/variables.css
  classes: []
  docs_anchor: c-mobile
---

## Correct usage

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { native as t } from '@/theme/embassy.tokens';

const insets = useSafeAreaInsets();

<View style={{ paddingTop: insets.top, paddingHorizontal: parseInt(t.screenGutter) }}>
  <Text style={{
    fontFamily:  'Epilogue',
    fontSize:    32,                       // t.fontSizeDisplay
    lineHeight:  32 * 1.1,                 // RN mide en puntos, no multiplicadores
    color:       t.textPrimary,
  }}>
    Altas del trimestre
  </Text>

  <Pressable
    accessibilityRole="button"
    style={{ minHeight: 48, justifyContent: 'center', alignItems: 'center',
             backgroundColor: t.colorPrimary, borderRadius: 8 }}>
    <Text style={{ fontSize: 16, color: t.colorOnPrimary, fontWeight: '600' }}>
      Procesar pendientes
    </Text>
  </Pressable>
</View>
```

## Incorrect usage

```tsx
// ✗ la escala de escritorio en una app (M5) y tamaños a mano (M1)
import { light as t } from '@/theme/embassy.tokens';
<Text style={{ fontSize: 13.5, lineHeight: 1.5 }}>          // y lineHeight como multiplicador (M7)

// ✗ la safe area hardcodeada (M3)
<View style={{ paddingTop: 44 }}>

// ✗ el patrón de escritorio encogido (M4)
<ScrollView horizontal><DataTable … /></ScrollView>

// ✗ utilities de gluestack sin traducir (M8)
<Box className="bg-blue-500 rounded-xl p-4">
```
