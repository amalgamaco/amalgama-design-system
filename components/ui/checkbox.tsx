import * as React from "react"
import { cn } from "../lib/utils"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Estado visual intermedio (ni marcado ni vacío) — p. ej. selección parcial de filas. */
  indeterminate?: boolean
}

/**
 * Checkbox: input nativo real, estilizado vía .checkbox (appearance:none + ::after).
 * El estado indeterminate solo existe como propiedad DOM, no como atributo HTML —
 * se sincroniza vía un ref effect.
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate = false, ...props }, forwardedRef) => {
    const innerRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLInputElement)

    React.useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate
    }, [indeterminate])

    return (
      <input
        type="checkbox"
        ref={innerRef}
        className={cn("checkbox", className)}
        {...props}
      />
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
