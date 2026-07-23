/**
 * ButtonGroup — botones contiguos con radios y bordes compartidos.
 *
 * Cuándo usar: agrupar acciones relacionadas del mismo peso (paginador de acciones,
 *   split button, input + botón), o un addon de texto junto a un input.
 * Cuándo no: elegir 1 de N con estado (Segmented Button / Toggle Group); una sola
 *   acción (Button).
 * Reemplaza a: filas de botones pegados con overrides de radio a mano.
 *
 * Official shadcn/ui component (ButtonGroup). Canonical composition preserved:
 * ButtonGroup · ButtonGroupText · ButtonGroupSeparator. Children lose adjacent
 * radius + border via Tailwind child selectors so the row reads as one unit.
 * Styling is Tailwind mapped to Embassy tokens.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const buttonGroupVariants = cva(
  "inline-flex w-fit [&>*:focus-visible]:relative [&>*:focus-visible]:z-[1]",
  {
    variants: {
      orientation: {
        horizontal:
          "items-stretch [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: { orientation: "horizontal" },
  }
)

export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation, ...props }, ref) => (
    <div ref={ref} role="group" className={cn(buttonGroupVariants({ orientation }), className)} {...props} />
  )
)
ButtonGroup.displayName = "ButtonGroup"

const ButtonGroupText = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center gap-2 px-4 rounded-md border border-border bg-surface-variant text-on-surface font-body text-body-sm font-medium whitespace-nowrap [&>svg]:size-4 [&>svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
)
ButtonGroupText.displayName = "ButtonGroupText"

const ButtonGroupSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="separator" className={cn("self-stretch w-px bg-outline-variant", className)} {...props} />
  )
)
ButtonGroupSeparator.displayName = "ButtonGroupSeparator"

export { ButtonGroup, buttonGroupVariants, ButtonGroupText, ButtonGroupSeparator }
