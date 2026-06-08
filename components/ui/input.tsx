import * as React from "react"
import { cn } from "../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, required, type, ...props }, ref) => {
    const input = (
      <input
        type={type}
        ref={ref}
        className={cn("field-input", className)}
        {...props}
      />
    )

    if (!label) return input

    return (
      <div className="field-group">
        <label className="field-label">
          {label}
          {required && <span className="field-required">*</span>}
        </label>
        {input}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
