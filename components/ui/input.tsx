import * as React from "react"
import { cn } from "../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  /** Supporting/helper text below the field. Hidden while `error` is set. */
  hint?: string
  /** Error message — turns the field red, sets aria-invalid and replaces the hint. */
  error?: string
  /** Icon inside the field, leading edge. */
  leadingIcon?: React.ReactNode
  /** Icon inside the field, trailing edge. */
  trailingIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, required, hint, error, leadingIcon, trailingIcon, type, id, ...props }, ref) => {
    const autoId = React.useId()
    const fieldId = id ?? autoId
    const invalid = Boolean(error)
    const descId = error || hint ? `${fieldId}-desc` : undefined

    const field = (
      <input
        id={fieldId}
        type={type}
        ref={ref}
        aria-invalid={invalid || undefined}
        aria-describedby={descId}
        className={cn(
          "field-input",
          leadingIcon && "has-leading",
          trailingIcon && "has-trailing",
          className
        )}
        {...props}
      />
    )

    const input = leadingIcon || trailingIcon ? (
      <div className="field-input-wrapper">
        {leadingIcon && <span className="field-leading-icon" aria-hidden="true">{leadingIcon}</span>}
        {field}
        {trailingIcon && <span className="field-trailing-icon" aria-hidden="true">{trailingIcon}</span>}
      </div>
    ) : field

    const supporting = error || hint ? (
      <div className="field-supporting" id={descId}>
        {error ? <span className="field-error-msg">{error}</span> : <span className="field-hint">{hint}</span>}
      </div>
    ) : null

    if (!label && !supporting) return input

    return (
      <div className={cn("field-group", invalid && "is-error")}>
        {label && (
          <label className="field-label" htmlFor={fieldId}>
            {label}
            {required && <span className="field-required">*</span>}
          </label>
        )}
        {input}
        {supporting}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
