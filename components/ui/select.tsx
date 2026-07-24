import * as React from "react"
import { cn } from "../lib/utils"

export interface SelectProps
  // `size` is overridden below (shadcn trigger size, not the native rows attribute).
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string
  required?: boolean
  /** Supporting/helper text below the field. Hidden while `error` is set. */
  hint?: string
  /** Error message — turns the field red, sets aria-invalid and replaces the hint. */
  error?: string
  /** Compact trigger height (par shadcn size="sm"). */
  size?: "default" | "sm"
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, required, hint, error, size = "default", id, children, ...props }, ref) => {
    const autoId = React.useId()
    const fieldId = id ?? autoId
    const invalid = Boolean(error)
    const descId = error || hint ? `${fieldId}-desc` : undefined

    const select = (
      <div className="select-wrapper">
        <select
          id={fieldId}
          ref={ref}
          data-size={size === "sm" ? "sm" : undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={descId}
          className={cn(className)}
          {...props}
        >
          {children}
        </select>
        <span className="select-caret">▾</span>
      </div>
    )

    const supporting = error || hint ? (
      <div className="field-supporting" id={descId}>
        {error ? <span className="field-error-msg">{error}</span> : <span className="field-hint">{hint}</span>}
      </div>
    ) : null

    if (!label && !supporting) return select

    return (
      <div className={cn("field-group", invalid && "is-error")}>
        {label && (
          <label className="field-label" htmlFor={fieldId}>
            {label}
            {required && <span className="field-required">*</span>}
          </label>
        )}
        {select}
        {supporting}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
