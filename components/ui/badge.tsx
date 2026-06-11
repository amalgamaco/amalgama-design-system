import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const badgeVariants = cva(
  "badge",
  {
    variants: {
      variant: {
        open: "badge-open",
        active: "badge-active",
        closed: "badge-closed",
        draft: "badge-draft",
        archived: "badge-archived",
        warning: "badge-warning",
        tertiary: "badge-tertiary",
        info: "badge-info",
        /** @deprecated alias de `tertiary` — la clase CSS real es badge-tertiary (badge-accent no existe) */
        accent: "badge-tertiary",
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
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, className }))}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
