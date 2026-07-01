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

/* Embassy Segmented Button — token mapping (all via semantic Color Roles).
   Lighter ("Option B") treatment: subtler outline-variant frame + primary-container tonal
   fill — lighter than secondary-container while keeping a branded tonal selection and the
   same dark on-primary-container label for AAA contrast. No new tokens / no hardcoded hex.
   - Group container border ........ --color-outline-variant    (border-outline-variant) — lighter frame
   - Group: transparent bg, full pill radius, 3px padding, 2px gap, no dividers.
   - Segment (unselected) label ..... --color-on-surface-variant (text-on-surface-variant) — lower emphasis, still readable
   - Segment: individually pill-rounded, transparent bg, intrinsic width (not stretched).
   - Selected segment background .... --color-primary-container          (bg-primary-container)
   - Selected segment label ......... --color-on-primary-container       (text-on-primary-container)
   - Hover  (unselected) ............ --color-on-surface-state-hover      (on-surface 8% layer)
   - Pressed(unselected) ............ --color-on-surface-state-press      (on-surface 12% layer)
   - Hover  (selected) .............. on-primary-container 8% over primary-container  (color-mix of existing roles)
   - Pressed(selected) .............. on-primary-container 12% over primary-container (color-mix of existing roles)
   - Focus .......................... focus-ring utility (--color-focus / --color-focus-ring)
   - Disabled ....................... whole control at 38% opacity (DS standard; keeps the
     selected indicator legible — preserves outline + selected fill contrast). Applied at the
     GROUP via :has(:disabled) so the outline fades together with the segments.
   Unselected state-layer tokens live in css/hover-tokens.css (mirrors the Chip implementation). */

const segGroupVariants = cva(
  "inline-flex items-center bg-transparent border border-outline-variant rounded-full p-[3px] gap-[2px] has-[:disabled]:opacity-[0.38] has-[:disabled]:pointer-events-none",
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
    "[&_svg]:w-[18px] [&_svg]:h-[18px] [&_svg]:shrink-0",
    "bg-transparent text-on-surface-variant font-medium leading-[1.2]",
    "cursor-pointer whitespace-nowrap transition-colors",
    "hover:bg-on-surface-state-hover active:bg-on-surface-state-press",
    "data-[state=on]:bg-primary-container data-[state=on]:text-on-primary-container data-[state=on]:font-semibold",
    "data-[state=on]:hover:bg-[color-mix(in_srgb,var(--color-on-primary-container)_8%,var(--color-primary-container))] data-[state=on]:active:bg-[color-mix(in_srgb,var(--color-on-primary-container)_12%,var(--color-primary-container))]",
    "disabled:cursor-not-allowed",
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
