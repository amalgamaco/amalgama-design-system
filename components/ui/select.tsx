import * as React from "react"
import { cn } from "../lib/utils"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  required?: boolean
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, required, children, ...props }, ref) => {
    const select = (
      <div className="select-wrapper">
        <select ref={ref} className={cn(className)} {...props}>
          {children}
        </select>
        <span className="select-caret">▾</span>
      </div>
    )

    if (!label) return select

    return (
      <div className="field-group">
        <label className="field-label">
          {label}
          {required && <span className="field-required">*</span>}
        </label>
        {select}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
