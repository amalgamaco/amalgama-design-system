import * as React from "react"
import { cn } from "../lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  required?: boolean
  /** Supporting/helper text below the field. Hidden while `error` is set. */
  hint?: string
  /** Error message — turns the field red, sets aria-invalid and replaces the hint. */
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, required, hint, error, id, ...props }, ref) => {
    const autoId = React.useId()
    const fieldId = id ?? autoId
    const invalid = Boolean(error)
    const descId = error || hint ? `${fieldId}-desc` : undefined

    const textarea = (
      <textarea
        id={fieldId}
        ref={ref}
        aria-invalid={invalid || undefined}
        aria-describedby={descId}
        className={cn("field-input field-textarea", className)}
        {...props}
      />
    )

    const supporting = error || hint ? (
      <div className="field-supporting">
        {error ? <span className="field-error-msg">{error}</span> : <span className="field-hint">{hint}</span>}
      </div>
    ) : null

    if (!label && !supporting) return textarea

    return (
      <div className={cn("field-group", invalid && "is-error")}>
        {label && (
          <label className="field-label" htmlFor={fieldId}>
            {label}
            {required && <span className="field-required">*</span>}
          </label>
        )}
        {textarea}
        {supporting}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
