import * as React from "react"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

// shadcn-style chip (Radix has no chip primitive) — Embassy-bridged tokens.
const chipVariants = cva(
  "inline-flex items-center gap-2 h-8 rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-40 [&>svg]:size-[18px]",
  {
    variants: {
      selected: {
        true: "border-transparent bg-secondary text-secondary-foreground",
        false: "border-input bg-transparent text-foreground hover:bg-accent",
      },
    },
    defaultVariants: { selected: false },
  }
)

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">,
    VariantProps<typeof chipVariants> {
  icon?: React.ReactNode
  onRemove?: () => void
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected, icon, onRemove, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(chipVariants({ selected }), icon && "pl-2.5", onRemove && "pr-2", className)}
      aria-pressed={selected ?? undefined}
      {...props}
    >
      {icon}
      {children}
      {onRemove && (
        <span
          role="button"
          aria-label="Eliminar"
          tabIndex={-1}
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="flex size-[18px] items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
        </span>
      )}
    </button>
  )
)
Chip.displayName = "Chip"
