/**
 * Segmented Button — selector de opción única dentro de un conjunto discreto de opciones mutuamente excluyentes, con forma de píldora.
 *
 * Cuándo usar: alternar entre vistas (Lista / Cuadrícula), filtros de categoría o modo dentro del mismo contexto (Día / Semana / Mes).
 * Cuándo no: acciones que disparan efectos (usar Button), selección múltiple (usar Chips), navegación entre páginas (usar Tabs), más de 5 opciones o etiquetas muy dispares (usar Select).
 * Reemplaza a: toggle-group custom, radio-button pill legacy.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/segmented-button.css.
 */
import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

/* Embassy Segmented Button (segmented-button.css):
   - Group: transparent bg, 1px outline border, full pill radius, 3px padding, 2px gap.
   - Segment: individually pill-rounded, transparent bg, on-surface label, intrinsic
     width (NOT stretched), NO dividers between segments.
   - Selected: secondary-container fill + on-secondary-container label.
   - Hover (unselected): on-surface 8% state layer; (selected): on-secondary-container
     8% over the container. */

const segGroupVariants = cva(
  "inline-flex items-center bg-transparent border border-outline rounded-full p-[3px] gap-[2px]",
  {
    variants: {
      size: { sm: "", md: "", lg: "" },
    },
    defaultVariants: { size: "md" },
  }
)

const segItemVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 rounded-full",
    "bg-transparent text-on-surface font-medium leading-[1.2]",
    "cursor-pointer whitespace-nowrap transition-colors",
    "hover:bg-[color-mix(in_srgb,var(--color-on-surface)_8%,transparent)]",
    "data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container data-[state=on]:font-semibold",
    "data-[state=on]:hover:bg-[color-mix(in_srgb,var(--color-on-secondary-container)_8%,var(--color-secondary-container))]",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
    "focus:outline-none focus-visible:focus-ring focus-visible:z-10",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "px-[10px] py-1 text-caption",
        md: "px-4 py-1.5 text-body-sm",
        lg: "px-5 py-2 text-body-md",
      },
    },
    defaultVariants: { size: "md" },
  }
)

type SegSize = "sm" | "md" | "lg"
const SegSizeContext = React.createContext<SegSize>("md")

interface SegmentedButtonGroupProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>, "type">,
    VariantProps<typeof segGroupVariants> {
  type?: "single" | "multiple"
}

const SegmentedButtonGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  SegmentedButtonGroupProps
>(({ className, size = "md", type = "single", ...props }, ref) => (
  <SegSizeContext.Provider value={size as SegSize}>
    <ToggleGroupPrimitive.Root
      ref={ref}
      type={type as "single"}
      className={cn(segGroupVariants({ size }), className)}
      {...props}
    />
  </SegSizeContext.Provider>
))
SegmentedButtonGroup.displayName = "SegmentedButtonGroup"

interface SegmentedButtonItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof segItemVariants> {}

const SegmentedButtonItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  SegmentedButtonItemProps
>(({ className, size, ...props }, ref) => {
  const ctxSize = React.useContext(SegSizeContext)
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(segItemVariants({ size: size ?? ctxSize }), className)}
      {...props}
    />
  )
})
SegmentedButtonItem.displayName = "SegmentedButtonItem"

export { SegmentedButtonGroup, SegmentedButtonItem }
