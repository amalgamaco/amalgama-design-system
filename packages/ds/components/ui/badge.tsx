import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center text-badge font-semibold px-[10px] py-1 rounded-full tracking-[0.2px] whitespace-nowrap",
  {
    variants: {
      variant: {
        open:     "bg-success-container text-on-success-container",
        active:   "bg-success-container text-on-success-container",
        closed:   "bg-error-container text-on-error-container",
        draft:    "bg-surface-variant text-on-surface-variant border border-outline",
        archived: "bg-surface-variant text-on-surface-variant opacity-75",
        warning:  "bg-warning-container text-on-warning-container",
        tertiary: "bg-tertiary-container text-on-tertiary-container",
        info:     "bg-info-container text-on-info-container",
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
