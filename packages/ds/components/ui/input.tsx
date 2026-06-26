/**
 * Input — campo de entrada de formulario (input). Parte de la familia Form (input / select / textarea).
 *
 * Cuándo usar: todo campo de entrada — input, select, textarea, number, date — con label, hint y error.
 * Cuándo no: búsqueda (usar search-field de toolbar.css o search-bar de search.css).
 * Reemplaza a: cualquier form control legacy; nunca inventar campos custom.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/form.css (shared across input/select/textarea).
 */
import * as React from "react"
import { cn } from "../lib/utils"

const fieldInputBase =
  "w-full px-[14px] py-[10px] border border-border rounded-md text-body-md font-body text-fg bg-card outline-none transition-[border-color,box-shadow] duration-fast ease-in-out appearance-none placeholder:text-fg-muted hover:border-outline focus:border-link focus:shadow-[0_0_0_3px_var(--color-focus-ring)] disabled:bg-surface-variant disabled:text-on-disabled disabled:border-outline disabled:cursor-not-allowed"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, required, type, ...props }, ref) => {
    const input = (
      <input
        type={type}
        ref={ref}
        className={cn(fieldInputBase, className)}
        {...props}
      />
    )

    if (!label) return input

    return (
      <div className="group mb-5 last:mb-0">
        <label className="block text-label font-medium text-fg mb-2 group-focus-within:text-link">
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
        {input}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
