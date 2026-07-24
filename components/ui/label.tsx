import * as React from "react"
import { cn } from "../lib/utils"

/**
 * Label — thin typed wrapper over the flat `.label` CSS class (label.css).
 * Zero extra styling; the `.label` class carries all of it, including the
 * disabled-peer dimming (via `:has(+ :disabled)` / `data-disabled`).
 * Associate it with a control the native way, through `htmlFor`.
 */
export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Renders a required marker (`*`) after the children. */
  required?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => (
    <label ref={ref} className={cn("label", className)} {...props}>
      {children}
      {required && <span className="label-required">*</span>}
    </label>
  )
)
Label.displayName = "Label"

export { Label }
