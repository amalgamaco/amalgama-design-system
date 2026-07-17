import * as React from "react"
import { cn } from "../lib/utils"

/**
 * Form — accessible form primitives, no external form-state library.
 *
 * Cuándo usar: cualquier formulario con validación. Envolvé cada campo en
 * <FormItem> para obtener label + error + descripción conectados sin cablear
 * ids a mano. Cuándo no: un único input trivial sin validación (usar Input
 * directo). Reemplaza a: markup de formulario con for/id/aria-describedby
 * cableados a mano.
 *
 * Validación: HTML5 nativo (required/pattern/minLength/etc. en el <input>
 * real vía FormControl) + un validador simple por campo a través del hook
 * useFormField(name, initialValue, validate) — sin resolución de schema
 * (no zod). Reutiliza las clases visuales ya existentes en form.css
 * (.field-group/.field-label/.field-input/.field-hint/.field-error-msg).
 */

type Validator<T> = (value: T) => string | undefined

export function useFormField<T = string>(
  name: string,
  initialValue: T,
  validate?: Validator<T>
) {
  const [value, setValue] = React.useState(initialValue)
  const [touched, setTouched] = React.useState(false)
  const error = touched ? validate?.(value) : undefined
  return {
    name,
    value,
    error,
    touched,
    setValue,
    onBlur: () => setTouched(true),
  }
}

interface FormFieldContextValue {
  id: string
  error?: string
}
const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

function useFormFieldContext() {
  const ctx = React.useContext(FormFieldContext)
  if (!ctx) throw new Error("Form sub-components must be used within <FormItem>")
  return ctx
}

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: string
}

export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, error, children, ...props }, ref) => {
    const id = React.useId()
    return (
      <FormFieldContext.Provider value={{ id, error }}>
        <div ref={ref} className={cn("field-group", error && "is-error", className)} {...props}>
          {children}
        </div>
      </FormFieldContext.Provider>
    )
  }
)
FormItem.displayName = "FormItem"

export const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    const { id } = useFormFieldContext()
    return <label ref={ref} htmlFor={id} className={cn("field-label", className)} {...props} />
  }
)
FormLabel.displayName = "FormLabel"

export const FormControl = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    const { id, error } = useFormFieldContext()
    return (
      <input
        ref={ref}
        id={id}
        className={cn("field-input", className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-message` : `${id}-description`}
        {...props}
      />
    )
  }
)
FormControl.displayName = "FormControl"

export const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { id } = useFormFieldContext()
    return <p ref={ref} id={`${id}-description`} className={cn("field-hint", className)} {...props} />
  }
)
FormDescription.displayName = "FormDescription"

export const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { id, error } = useFormFieldContext()
    const body = error ?? children
    if (!body) return null
    return (
      <p ref={ref} id={`${id}-message`} className={cn("field-error-msg", className)} {...props}>
        {body}
      </p>
    )
  }
)
FormMessage.displayName = "FormMessage"
