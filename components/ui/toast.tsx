import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const toastVariants = cva(
  "toast",
  {
    variants: {
      variant: {
        success: "toast-success",
        error: "toast-error",
        info: "toast-info",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  icon?: React.ReactNode
  message: string
  onClose?: () => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, icon, message, onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant, className }))}
        {...props}
      >
        {icon && <span className="toast-icon">{icon}</span>}
        <span className="toast-message">{message}</span>
        {onClose && (
          <button className="toast-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)
Toast.displayName = "Toast"

const ToastContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("toast-container", className)} {...props} />
))
ToastContainer.displayName = "ToastContainer"

export { Toast, ToastContainer, toastVariants }
