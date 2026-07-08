/**
 * Toggle — a two-state button (pressed / not pressed), built on @radix-ui/react-toggle.
 *
 * Cuándo usar: alternar un solo estado on/off que se aplica de inmediato (negrita en un
 * editor, "mostrar solo favoritos"). Cuándo no: elegir 1 de N (usar Segmented Button),
 * filtros tipo tag (usar Chip), acción sin estado (usar Button).
 * Reemplaza a: botones on/off ad-hoc con aria-pressed manual.
 *
 * shadcn Toggle structure, Embassy tokens: the pressed state uses the Secondary-container
 * selection language shared with Chip / nav-active (never --color-primary, which flips white
 * in dark mode). Canonical implementation.
 */
import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const toggleVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 rounded-md text-body-md font-medium cursor-pointer whitespace-nowrap transition-colors duration-fast ease-default",
    "hover:bg-on-surface-state-hover focus-visible:focus-ring",
    "data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container",
    "disabled:pointer-events-none disabled:opacity-[0.38] [&_svg]:size-[18px] [&_svg]:shrink-0"
  ),
  {
    variants: {
      variant: {
        default: "bg-transparent text-on-surface",
        outline: "border border-outline-variant bg-transparent text-on-surface",
      },
      size: {
        default: "h-9 min-w-9 px-2.5",
        sm: "h-8 min-w-8 px-2",
        lg: "h-10 min-w-10 px-3",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size }), className)} {...props} />
))
Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
