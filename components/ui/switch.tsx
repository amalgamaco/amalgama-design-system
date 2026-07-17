import * as React from "react"
import { cn } from "../lib/utils"

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

/**
 * Switch: input nativo real con role="switch" — los lectores de pantalla
 * anuncian "activado/desactivado" en lugar de "marcado/no marcado".
 */
const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => (
    <input
      type="checkbox"
      role="switch"
      ref={ref}
      className={cn("switch", className)}
      {...props}
    />
  )
)
Switch.displayName = "Switch"

export { Switch }
