import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/* Embassy custom font-size tokens (from styles.css @theme --text-*).
   Must be registered so tailwind-merge classifies `text-label`, `text-body-md`,
   etc. as font-size — otherwise it lumps them in with `text-{color}` utilities
   and silently drops one when both appear (e.g. `text-label text-inverse-on-surface`
   would collapse to just the size, dropping the color). */
const FONT_SIZES = [
  "display",
  "heading-xl",
  "heading-lg",
  "heading-md",
  "heading-sm",
  "heading-xs",
  "body-lg",
  "body-md",
  "body-sm",
  "label",
  "caption",
  "badge",
  "overline",
  "mono-md",
  "mono-sm",
]

/* Embassy color-role tokens (from styles.css @theme inline). Registered so
   tailwind-merge treats `text-/bg-/border-{role}` as colors in their own group,
   distinct from the font-size group above. */
const COLORS = [
  "primary", "on-primary", "primary-container", "on-primary-container", "primary-hover",
  "secondary", "on-secondary", "secondary-container", "on-secondary-container", "secondary-container-hover",
  "tertiary", "on-tertiary", "tertiary-container", "on-tertiary-container",
  "error", "on-error", "error-container", "on-error-container", "error-hover", "error-ring",
  "success", "on-success", "success-container", "on-success-container", "success-hover",
  "warning", "on-warning", "warning-container", "on-warning-container",
  "info", "on-info", "info-container", "on-info-container",
  "surface", "surface-dim", "surface-bright",
  "surface-container-lowest", "surface-container", "surface-container-low",
  "surface-container-high", "surface-container-highest", "surface-variant",
  "on-surface", "on-surface-variant",
  "outline", "outline-variant",
  "inverse-surface", "inverse-on-surface", "inverse-primary",
  "disabled", "on-disabled", "focus", "focus-ring", "scrim",
  "fg", "fg-subtle", "fg-muted", "link", "canvas", "card", "border",
]

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZES }],
      "text-color": [{ text: COLORS }],
      "bg-color": [{ bg: COLORS }],
      "border-color": [{ border: COLORS }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
