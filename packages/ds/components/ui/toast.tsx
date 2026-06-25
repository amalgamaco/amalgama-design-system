import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const toastVariants = cva(
  "bg-card border border-border rounded-md px-5 py-3 shadow-lg flex items-center gap-[10px] text-body-md animate-slide-in-right min-w-[280px] max-w-[420px]",
  {
    variants: {
      variant: {
        success: "border-l-[3px] border-l-success",
        error:   "border-l-[3px] border-l-error",
        info:    "border-l-[3px] border-l-link",
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
  ({ className, variant, icon, message, onClose, ...props }, ref) => (
    <div ref={ref} className={cn(toastVariants({ variant, className }))} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="w-6 h-6 border-none bg-transparent inline-flex items-center justify-center cursor-pointer text-on-surface-variant rounded-sm transition-[background,color] duration-fast ease-in-out hover:bg-surface-variant hover:text-on-surface focus-visible:focus-ring"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  )
)
Toast.displayName = "Toast"

const ToastContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("fixed top-6 right-6 z-[200] flex flex-col gap-2", className)}
      {...props}
    />
  )
)
ToastContainer.displayName = "ToastContainer"

export { Toast, ToastContainer, toastVariants }
