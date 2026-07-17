import * as React from "react"
import { cn } from "../lib/utils"

interface RadioGroupContextValue {
  name: string
  value?: string
  onValueChange?: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null)

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Nombre compartido por todos los <input type="radio"> del grupo (agrupación nativa). */
  name?: string
  /** Valor seleccionado (uso controlado). */
  value?: string
  /** Valor inicial (uso no controlado). */
  defaultValue?: string
  onValueChange?: (value: string) => void
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, name, value, defaultValue, onValueChange, ...props }, ref) => {
    const autoName = React.useId()
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
    const isControlled = value !== undefined
    const current = isControlled ? value : uncontrolled

    const handleChange = (next: string) => {
      if (!isControlled) setUncontrolled(next)
      onValueChange?.(next)
    }

    return (
      <RadioGroupContext.Provider
        value={{ name: name ?? autoName, value: current, onValueChange: handleChange }}
      >
        <div ref={ref} role="radiogroup" className={cn("radio-group", className)} {...props} />
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

export interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  value: string
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, ...props }, ref) => {
    const ctx = React.useContext(RadioGroupContext)
    return (
      <input
        type="radio"
        ref={ref}
        name={ctx?.name}
        checked={ctx?.value !== undefined ? ctx.value === value : undefined}
        onChange={() => ctx?.onValueChange?.(value)}
        className={cn("radio", className)}
        {...props}
      />
    )
  }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
