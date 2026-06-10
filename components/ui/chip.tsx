import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const chipVariants = cva(
  "chip",
  {
    variants: {
      variant: {
        outlined: "",
        elevated: "chip-elevated",
      },
      selected: {
        true: "chip-selected",
        false: "",
      },
    },
    defaultVariants: {
      variant: "outlined",
      selected: false,
    },
  }
)

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  /** Ícono inicial (18px). El padding izquierdo se ajusta solo. */
  icon?: React.ReactNode
}

/**
 * Chip accionable: assist, filter o suggestion.
 * Para filter chips pasá `selected` — el aria-pressed se sincroniza solo.
 */
const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant, selected, icon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(chipVariants({ variant, selected, className }))}
        aria-pressed={selected == null ? undefined : !!selected}
        {...props}
      >
        {icon && <span className="chip-icon">{icon}</span>}
        {children}
      </button>
    )
  }
)
Chip.displayName = "Chip"

export interface InputChipProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Ícono inicial opcional (18px). */
  icon?: React.ReactNode
  /** Callback al presionar el botón de eliminación. Si no se pasa, no se renderiza. */
  onRemove?: () => void
  /** Nombre accesible del botón de eliminación. */
  removeLabel?: string
}

/**
 * Input chip: representa información ingresada por la persona.
 * El chip es contenido (span); solo la eliminación es interactiva.
 */
const InputChip = React.forwardRef<HTMLSpanElement, InputChipProps>(
  ({ className, icon, onRemove, removeLabel = "Quitar", children, ...props }, ref) => {
    return (
      <span ref={ref} className={cn("chip", className)} {...props}>
        {icon && <span className="chip-icon">{icon}</span>}
        {children}
        {onRemove && (
          <button
            type="button"
            className="chip-remove"
            aria-label={removeLabel}
            onClick={onRemove}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </span>
    )
  }
)
InputChip.displayName = "InputChip"

export interface ChipSetProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Nombre accesible del grupo (p. ej. «Filtrar vacantes»). */
  label?: string
}

/** Conjunto de chips: flex con wrap y gap de 8px. */
const ChipSet = React.forwardRef<HTMLDivElement, ChipSetProps>(
  ({ className, label, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      className={cn("chip-set", className)}
      {...props}
    />
  )
)
ChipSet.displayName = "ChipSet"

export { Chip, InputChip, ChipSet, chipVariants }
