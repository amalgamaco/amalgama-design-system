import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const buttonVariants = cva(
  "",
  {
    variants: {
      variant: {
        primary: "btn-primary",
        elevated: "btn-elevated",
        secondary: "btn-secondary",
        tertiary: "btn-tertiary",
        text: "btn-text",
        next: "btn-next",
        icon: "icon-btn",
        danger: "btn-primary btn-danger",
        success: "btn-primary btn-success",
      },
      size: {
        default: "",
        xs: "btn-xs",
        sm: "btn-sm",
        lg: "btn-lg",
        xl: "btn-xl",
      },
      compact: {
        true: "btn-compact",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, compact, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, compact, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
