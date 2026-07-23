/**
 * Badge — indicadores de estado y etiquetas de categoría.
 *
 * Cuándo usar: estado o categoría de SOLO LECTURA de un ítem (tablas, cards, listas). Todo label categórico debe ser badge — nunca texto plano coloreado.
 * Cuándo no: si es interactivo/filtrable usar Chip; si es una acción usar Button.
 * Reemplaza a: labels de texto plano con color, pills custom, tags legacy.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/badge.css.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center text-badge font-semibold px-[10px] py-1 rounded-full tracking-[0.2px] whitespace-nowrap",
  {
    variants: {
      // Dark: soft-tonal fill — instead of the saturated container, a faint pill
      // (color-mix with surface) keeps the on-container text legible + accessible.
      // Mirrors the buildless [data-theme=dark] .badge-* treatment (036b061).
      variant: {
        open:     "bg-success-container text-on-success-container dark:bg-[color-mix(in_srgb,var(--color-success-container)_42%,var(--color-surface))]",
        // Activa = process in progress — distinct color from open (secondary, not success).
        active:   "bg-secondary-container text-on-secondary-container dark:bg-[color-mix(in_srgb,var(--color-secondary-container)_55%,var(--color-surface))]",
        closed:   "bg-error-container text-on-error-container dark:bg-[color-mix(in_srgb,var(--color-error-container)_42%,var(--color-surface))]",
        draft:    "bg-surface-variant text-on-surface-variant border border-outline",
        archived: "bg-surface-variant text-on-surface-variant opacity-75",
        warning:  "bg-warning-container text-on-warning-container dark:bg-[color-mix(in_srgb,var(--color-warning-container)_42%,var(--color-surface))]",
        tertiary: "bg-tertiary-container text-on-tertiary-container dark:bg-[color-mix(in_srgb,var(--color-tertiary-container)_42%,var(--color-surface))]",
        info:     "bg-info-container text-on-info-container dark:bg-[color-mix(in_srgb,var(--color-info-container)_42%,var(--color-surface))]",
      },
      label: {
        true: "font-mono font-medium text-[10.5px] uppercase tracking-[0.1em]",
      },
    },
    defaultVariants: {
      variant: "open",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, label, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, label, className }))}
      {...props}
    />
  )
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
