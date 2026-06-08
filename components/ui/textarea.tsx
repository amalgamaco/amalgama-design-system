import * as React from "react"
import { cn } from "../lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  required?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, required, ...props }, ref) => {
    const textarea = (
      <textarea
        ref={ref}
        className={cn("field-input field-textarea", className)}
        {...props}
      />
    )

    if (!label) return textarea

    return (
      <div className="field-group">
        <label className="field-label">
          {label}
          {required && <span className="field-required">*</span>}
        </label>
        {textarea}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
