/**
 * Textarea — campo de texto multilínea de formulario (textarea). Parte de la familia Form (input / select / textarea).
 *
 * Cuándo usar: todo campo de entrada — input, select, textarea, number, date — con label, hint y error.
 * Cuándo no: búsqueda (usar search-field de toolbar.css o search-bar de search.css).
 * Reemplaza a: cualquier form control legacy; nunca inventar campos custom.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/form.css (shared across input/select/textarea).
 */
import * as React from "react"
import { cn } from "../lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  required?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, required, ...props }, ref) => {
    const textarea = (
      <textarea
        ref={ref}
        className={cn(
          "w-full px-[14px] py-[10px] border border-border rounded-md text-body-md font-body text-fg bg-card outline-none resize-y min-h-[80px] leading-[1.5] transition-[border-color,box-shadow] duration-fast ease-default placeholder:text-fg-muted hover:border-outline focus:border-link focus:shadow-[0_0_0_3px_var(--color-focus-ring)] disabled:bg-surface-variant disabled:text-on-disabled disabled:border-outline disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    )

    if (!label) return textarea

    return (
      <div className="group mb-5 last:mb-0">
        <label className="block text-label font-medium text-fg mb-2 group-focus-within:text-link">
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
        {textarea}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
