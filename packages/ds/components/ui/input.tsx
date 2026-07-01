/**
 * Input — campo de entrada de formulario (input). Parte de la familia Form (input / select / textarea).
 *
 * Cuándo usar: todo campo de entrada — input, select, textarea, number, date — con label, hint/supporting text, error e íconos.
 * Cuándo no: búsqueda (usar search-field de toolbar.css o search-bar de search.css).
 * Reemplaza a: cualquier form control legacy; nunca inventar campos custom.
 *
 * Modela los Text Fields de Material Design 3: label, supporting text, estados
 * enabled/hover/focus/disabled/error(+focus), required/optional e íconos leading/trailing — con tokens Embassy.
 * Canonical implementation.
 */
import * as React from "react"
import { cn } from "../lib/utils"

const fieldInputBase =
  "w-full px-[14px] py-[10px] border border-border rounded-md text-body-md font-body text-fg bg-card outline-none transition-[border-color,box-shadow] duration-fast ease-in-out appearance-none placeholder:text-fg-muted hover:border-outline focus:border-link focus:shadow-[0_0_0_3px_var(--color-focus-ring)] disabled:bg-surface-variant disabled:text-on-disabled disabled:border-outline disabled:cursor-not-allowed"

// Error state: red border across every interaction state + error-colored focus ring.
const fieldInputError =
  "border-error hover:border-error focus:border-error focus:shadow-[0_0_0_3px_var(--color-error-ring)]"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Visible label rendered above the field (provides the accessible name). */
  label?: string
  /** Marks the field as required — appends a red asterisk to the label. */
  required?: boolean
  /** Supporting/helper text below the field. Hidden while `error` is set. */
  hint?: string
  /** Error message — turns the field red, sets aria-invalid and replaces the hint. */
  error?: string
  /** Icon inside the field, leading edge (18px, aria-hidden). */
  leadingIcon?: React.ReactNode
  /** Icon inside the field, trailing edge (18px, aria-hidden). */
  trailingIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, required, hint, error, leadingIcon, trailingIcon, id, type, ...props },
    ref
  ) => {
    const autoId = React.useId()
    const fieldId = id ?? autoId
    const invalid = Boolean(error)
    const descId = error || hint ? `${fieldId}-desc` : undefined

    const control = (
      <div className="relative">
        {leadingIcon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2 text-fg-muted [&_svg]:size-[18px]"
          >
            {leadingIcon}
          </span>
        )}
        <input
          id={fieldId}
          type={type}
          ref={ref}
          aria-invalid={invalid || undefined}
          aria-describedby={descId}
          className={cn(
            fieldInputBase,
            leadingIcon && "pl-[42px]",
            trailingIcon && "pr-[42px]",
            invalid && fieldInputError,
            className
          )}
          {...props}
        />
        {trailingIcon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 text-fg-muted [&_svg]:size-[18px]"
          >
            {trailingIcon}
          </span>
        )}
      </div>
    )

    const support = error || hint ? (
      <p
        id={descId}
        className={cn("mt-1.5 text-caption", error ? "text-error" : "text-fg-subtle")}
      >
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
            {required && <span className="ml-0.5 text-error">*</span>}
          </label>
        )}
        {control}
        {support}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
