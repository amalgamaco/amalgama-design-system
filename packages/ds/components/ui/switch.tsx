import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "../lib/utils"

/* MD3 switch mapped to Embassy roles:
   - unchecked track: surface-variant fill + outline border; thumb: outline
   - checked track: primary fill; thumb: on-primary
   - focus: Embassy focus ring */
export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-fast ease-default align-middle",
      "outline-none focus-visible:focus-ring",
      "disabled:cursor-not-allowed disabled:opacity-40",
      "data-[state=checked]:bg-primary data-[state=checked]:border-transparent",
      "data-[state=unchecked]:bg-surface-variant data-[state=unchecked]:border-outline",
      // Error/invalid — red track border on the unchecked track (matches buildless).
      "aria-invalid:data-[state=unchecked]:border-error",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        // Spatial: the thumb's slide gets the Expressive overshoot bounce as it settles.
        "pointer-events-none block h-5 w-5 rounded-full shadow ring-0 transition-transform duration-normal ease-expressive",
        "data-[state=checked]:translate-x-5 data-[state=checked]:bg-on-primary",
        "data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-outline"
      )}
    />
  </SwitchPrimitive.Root>
))
Switch.displayName = "Switch"
