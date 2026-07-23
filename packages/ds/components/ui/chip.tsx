/**
 * Chip — elementos compactos que representan una acción, filtro, entrada o sugerencia.
 *
 * Cuándo usar: filtros, selección múltiple, sugerencias — siempre interactivo. Filter chips van debajo de la search bar para refinar resultados.
 * Cuándo no: estado de solo lectura (usar Badge); acción principal (usar Button).
 * Reemplaza a: toggles de filtro ad-hoc, tags clickeables legacy.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/chip.css.
 *
 * shadcn/Radix alignment (2026-07): a Chip that toggles (filter chip — `selected`
 * controlled) renders on @radix-ui/react-toggle, so it gets `data-[state=on]`,
 * managed `aria-pressed`, and keyboard toggle for free. A Chip that just triggers
 * an action (assist / suggestion chip — no `selected`) stays a plain `<button>`:
 * per WAI-ARIA it must NOT carry `aria-pressed`, since it isn't a toggle. This
 * mirrors MD3's chip taxonomy (assist/suggestion = action, filter = toggle) while
 * using the Radix primitive exactly where a toggle is meant. ChipSet stays a plain
 * group wrapper — filter chips are individually Tab-focusable (WAI-ARIA toggle
 * buttons), unlike Segmented Button which is a single-select roving toolbar.
 *
 * Border token (2026-07): unselected Chip uses --color-outline-variant, not --color-outline.
 * --color-outline is reserved for primary interactive controls (Button tertiary/ghost/icon,
 * Input, Checkbox, Radio, Switch) — Chip is a filter/metadata control and needs a visibly
 * lighter stroke so it doesn't read as another button next to them. Mirrors the Segmented
 * Button's documented "Option B" frame (see segmented-button.tsx) — same role, same token.
 */
import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const chipVariants = cva(
  cn(
    "inline-flex items-center gap-2 h-8 px-4 rounded-full border text-body-lg font-medium cursor-pointer whitespace-nowrap transition-all duration-fast ease-default focus-visible:focus-ring",
    // Selected (data-[state=on] from Radix Toggle, or the `.chip-selected` fallback
    // class on the non-toggle path) — Secondary container fill wins over the variant.
    "data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container data-[state=on]:border-transparent data-[state=on]:hover:bg-on-secondary-state-hover data-[state=on]:active:bg-on-secondary-state-press",
    "disabled:pointer-events-none disabled:opacity-[0.38]"
  ),
  {
    variants: {
      variant: {
        outlined: "border-outline-variant bg-transparent text-on-surface hover:bg-on-surface-state-hover active:bg-on-surface-state-press",
        elevated: "border-transparent bg-surface-container-low text-on-surface shadow-sm hover:bg-chip-elevated-hover active:bg-chip-elevated-press",
      },
    },
    defaultVariants: {
      variant: "outlined",
    },
  }
)

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">,
    VariantProps<typeof chipVariants> {
  icon?: React.ReactNode
  /** When provided, the Chip is a toggle (filter chip): renders on Radix Toggle with managed `aria-pressed`/`data-state`. Omit for action chips (assist/suggestion). */
  selected?: boolean
  /** Radix Toggle change handler — fires alongside onClick when the chip is a toggle. */
  onPressedChange?: (pressed: boolean) => void
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant, selected, onPressedChange, icon, children, ...props }, ref) => {
    const isToggle = selected !== undefined || onPressedChange !== undefined
    const content = (
      <>
        {icon && (
          <span className="inline-flex items-center justify-center w-[18px] h-[18px] flex-shrink-0 [&_svg]:w-[18px] [&_svg]:h-[18px]">
            {icon}
          </span>
        )}
        {children}
      </>
    )
    const classes = cn(chipVariants({ variant }), icon ? "pl-2" : "", className)

    // Filter chip → Radix Toggle (data-state, aria-pressed, keyboard toggle).
    if (isToggle) {
      return (
        <TogglePrimitive.Root
          ref={ref}
          pressed={selected}
          onPressedChange={onPressedChange}
          className={classes}
          {...props}
        >
          {content}
        </TogglePrimitive.Root>
      )
    }

    // Assist / suggestion chip → plain action button (no aria-pressed).
    return (
      <button ref={ref} type="button" className={classes} {...props}>
        {content}
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
  variant?: "outlined" | "elevated"
}

export const InputChip = React.forwardRef<HTMLDivElement, InputChipProps>(
  ({ className, variant = "outlined", selected, icon, onRemove, removeLabel = "Quitar", children, ...props }, ref) => (
    <div
      ref={ref}
      // InputChip isn't a toggle button (it represents entered input), so it stays a
      // <div> and drives the selected look with the same data-[state=on] hook manually.
      data-state={selected ? "on" : "off"}
      className={cn(
        chipVariants({ variant }),
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
