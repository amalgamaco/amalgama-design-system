/**
 * Textarea — campo de texto multilínea de formulario (textarea). Parte de la familia Form (input / select / textarea).
 *
 * Cuándo usar: todo campo de entrada — input, select, textarea, number, date — con label, hint y error.
 * Cuándo no: búsqueda (usar `SearchField` de toolbar.tsx en desktop, `SearchBar` de search.tsx en mobile).
 * Reemplaza a: cualquier form control legacy; nunca inventar campos custom.
 *
 * Mirrors Input's MD3 Text Field API (label / hint / error, aria-invalid + aria-describedby)
 * for consistency across the Form family. Canonical implementation.
 */
import * as React from "react"
import { cn } from "../lib/utils"

const fieldBase =
  "w-full px-[14px] py-[10px] border border-border rounded-md text-body-md font-body text-fg bg-card outline-none resize-y min-h-[80px] leading-[1.5] transition-[border-color,box-shadow] duration-fast ease-default placeholder:text-fg-muted hover:border-outline focus:border-link focus:shadow-[0_0_0_3px_var(--color-focus-ring)] disabled:bg-disabled disabled:text-on-disabled disabled:border-outline disabled:cursor-not-allowed"

const fieldError =
  "border-error hover:border-error focus:border-error focus:shadow-[0_0_0_3px_var(--color-error-ring)]"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visible label rendered above the field (provides the accessible name). */
  label?: string
  /** Marks the field as required — appends a red asterisk to the label. */
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

    const control = (
      <textarea
        id={fieldId}
        ref={ref}
        aria-invalid={invalid || undefined}
        aria-describedby={descId}
        className={cn(fieldBase, invalid && fieldError, className)}
        {...props}
      />
    )

    const support = error || hint ? (
      <p id={descId} className={cn("mt-1.5 text-caption", error ? "text-error" : "text-fg-subtle")}>
        {error || hint}
      </p>
    ) : null

    if (!label && !support) return control

    return (
      <div className="group mb-5 last:mb-0">
        {label && (
          <label
            htmlFor={fieldId}
            className="mb-2 block text-label font-medium text-fg group-focus-within:text-link"
          >
            {label}
            {required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}
        {control}
        {support}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
