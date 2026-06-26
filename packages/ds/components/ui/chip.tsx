/**
 * Chip — elementos compactos que representan una acción, filtro, entrada o sugerencia.
 *
 * Cuándo usar: filtros, selección múltiple, sugerencias — siempre interactivo. Filter chips van debajo de la search bar para refinar resultados.
 * Cuándo no: estado de solo lectura (usar Badge); acción principal (usar Button).
 * Reemplaza a: toggles de filtro ad-hoc, tags clickeables legacy.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/chip.css.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const chipVariants = cva(
  "inline-flex items-center gap-2 h-8 px-4 rounded-full border border-outline bg-transparent text-on-surface text-body-lg font-medium cursor-pointer whitespace-nowrap transition-all duration-fast ease-in-out focus-visible:focus-ring",
  {
    variants: {
      variant: {
        outlined: "hover:bg-on-surface-state-hover active:bg-on-surface-state-press",
        elevated: "border-transparent bg-surface-container-low shadow-sm hover:bg-chip-elevated-hover active:bg-chip-elevated-press",
        selected: "bg-secondary-container text-on-secondary-container border-transparent hover:bg-on-secondary-state-hover active:bg-on-secondary-state-press",
      },
    },
    defaultVariants: {
      variant: "outlined",
    },
  }
)

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  icon?: React.ReactNode
  selected?: boolean
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant, selected, icon, children, ...props }, ref) => {
    const effectiveVariant = selected ? "selected" : (variant ?? "outlined")
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected !== undefined ? selected : undefined}
        className={cn(
          chipVariants({ variant: effectiveVariant }),
          icon ? "pl-2" : "",
          className
        )}
        {...props}
      >
        {icon && (
          <span className="inline-flex items-center justify-center w-[18px] h-[18px] flex-shrink-0 [&_svg]:w-[18px] [&_svg]:h-[18px]">
            {icon}
          </span>
        )}
        {children}
      </button>
    )
  }
)
Chip.displayName = "Chip"

export interface InputChipProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  onRemove?: () => void
  removeLabel?: string
  selected?: boolean
  variant?: "outlined" | "elevated" | "selected"
}

export const InputChip = React.forwardRef<HTMLDivElement, InputChipProps>(
  ({ className, variant = "outlined", selected, icon, onRemove, removeLabel = "Quitar", children, ...props }, ref) => {
    const effectiveVariant = selected ? "selected" : variant
    return (
      <div
        ref={ref}
        className={cn(
          chipVariants({ variant: effectiveVariant }),
          "cursor-default",
          icon ? "pl-2" : "",
          onRemove ? "pr-2" : "",
          className
        )}
        {...props}
      >
        {icon && (
          <span className="inline-flex items-center justify-center w-[18px] h-[18px] flex-shrink-0 [&_svg]:w-[18px] [&_svg]:h-[18px]">
            {icon}
          </span>
        )}
        {children}
        {onRemove && (
          <button
            type="button"
            aria-label={removeLabel}
            onClick={(e) => { e.stopPropagation(); onRemove() }}
            className="inline-flex items-center justify-center w-[18px] h-[18px] p-0 -mr-1 ml-0 border-none bg-transparent rounded-full text-on-surface-variant cursor-pointer flex-shrink-0 hover:bg-on-surface-state-press [&_svg]:w-3.5 [&_svg]:h-3.5"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)
InputChip.displayName = "InputChip"

export interface ChipSetProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
}

export const ChipSet = React.forwardRef<HTMLDivElement, ChipSetProps>(
  ({ className, label, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      className={cn("flex flex-wrap gap-2", className)}
      {...props}
    />
  )
)
ChipSet.displayName = "ChipSet"

export { chipVariants }
