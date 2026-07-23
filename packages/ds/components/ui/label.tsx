/**
 * Label — accessible form label, built on @radix-ui/react-label.
 *
 * Cuándo usar: etiquetar cualquier control de formulario standalone (Checkbox, Switch,
 * Radio, un Input sin su prop `label`). Cuándo no: cuando ya usás la prop `label` de
 * Input/Textarea (ya renderizan su propio <label> asociado).
 *
 * shadcn Label structure, Embassy tokens. Radix Label forwards clicks to the associated
 * control and plays well with `htmlFor`. Canonical implementation.
 */
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "../lib/utils"

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-label font-medium text-fg leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-[0.38]",
      className
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
