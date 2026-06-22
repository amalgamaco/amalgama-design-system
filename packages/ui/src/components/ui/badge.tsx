import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

// Embassy badges are soft status pills. Status variants reference Embassy
// container roles directly (arbitrary values) to stay token-driven + theme-aware.
export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "bg-secondary text-secondary-foreground",
        success: "bg-[var(--color-success-container)] text-[var(--color-on-success-container)]",
        warning: "bg-[var(--color-warning-container)] text-[var(--color-on-warning-container)]",
        error: "bg-[var(--color-error-container)] text-[var(--color-on-error-container)]",
        info: "bg-[var(--color-info-container)] text-[var(--color-on-info-container)]",
        outline: "border border-input text-foreground",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />
}
