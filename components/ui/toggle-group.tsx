import * as React from "react"
import { cn } from "../lib/utils"
import { toggleVariants, type ToggleProps } from "./toggle"
import type { VariantProps } from "class-variance-authority"

type ToggleGroupVariants = VariantProps<typeof toggleVariants>

const ToggleGroupContext = React.createContext<ToggleGroupVariants>({
  variant: "default",
  size: "default",
})

interface SingleGroupProps {
  type: "single"
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

interface MultipleGroupProps {
  type: "multiple"
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

type ToggleGroupOwnProps = (SingleGroupProps | MultipleGroupProps) & ToggleGroupVariants

export type ToggleGroupProps = ToggleGroupOwnProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">

const ToggleGroupValueContext = React.createContext<{
  isSelected: (value: string) => boolean
  toggleValue: (value: string) => void
}>({
  isSelected: () => false,
  toggleValue: () => {},
})

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, variant, size, type, value, defaultValue, onValueChange, children, ...props }, ref) => {
    const isMultiple = type === "multiple"
    const [uncontrolled, setUncontrolled] = React.useState<string | string[]>(
      defaultValue ?? (isMultiple ? [] : "")
    )
    const current = value ?? uncontrolled

    const isSelected = React.useCallback(
      (v: string) => (isMultiple ? (current as string[]).includes(v) : current === v),
      [current, isMultiple]
    )

    const toggleValue = React.useCallback(
      (v: string) => {
        if (isMultiple) {
          const arr = current as string[]
          const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
          if (value === undefined) setUncontrolled(next)
          ;(onValueChange as ((v: string[]) => void) | undefined)?.(next)
        } else {
          const next = current === v ? "" : v
          if (value === undefined) setUncontrolled(next)
          ;(onValueChange as ((v: string) => void) | undefined)?.(next)
        }
      },
      [current, isMultiple, value, onValueChange]
    )

    return (
      <div ref={ref} role="group" className={cn("toggle-group", className)} {...props}>
        <ToggleGroupContext.Provider value={{ variant, size }}>
          <ToggleGroupValueContext.Provider value={{ isSelected, toggleValue }}>
            {children}
          </ToggleGroupValueContext.Provider>
        </ToggleGroupContext.Provider>
      </div>
    )
  }
)
ToggleGroup.displayName = "ToggleGroup"

export interface ToggleGroupItemProps extends Omit<ToggleProps, "pressed" | "defaultPressed" | "onPressedChange"> {
  value: string
}

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, value, variant, size, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext)
    const { isSelected, toggleValue } = React.useContext(ToggleGroupValueContext)
    const pressed = isSelected(value)
    const resolvedVariant = context.variant ?? variant
    const resolvedSize = context.size ?? size

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={pressed}
        className={cn(
          toggleVariants({ variant: resolvedVariant, size: resolvedSize }),
          className
        )}
        onClick={() => toggleValue(value)}
        {...props}
      />
    )
  }
)
ToggleGroupItem.displayName = "ToggleGroupItem"

export { ToggleGroup, ToggleGroupItem }
