import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const toggleVariants = cva("toggle", {
  variants: {
    variant: {
      default: "",
      outline: "toggle-outline",
    },
    size: {
      default: "",
      sm: "toggle-sm",
      lg: "toggle-lg",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
})

export interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleVariants> {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant, size, pressed, defaultPressed, onPressedChange, onClick, ...props }, ref) => {
    const [uncontrolled, setUncontrolled] = React.useState(!!defaultPressed)
    const isPressed = pressed ?? uncontrolled

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isPressed}
        className={cn(toggleVariants({ variant, size }), className)}
        onClick={(e) => {
          onClick?.(e)
          if (e.defaultPrevented) return
          const next = !isPressed
          if (pressed === undefined) setUncontrolled(next)
          onPressedChange?.(next)
        }}
        {...props}
      />
    )
  }
)
Toggle.displayName = "Toggle"

export { Toggle, toggleVariants }
