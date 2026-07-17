import * as React from "react"
import { cn } from "../lib/utils"

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onClose?: () => void
  /**
   * Alert Dialog mode (confirmación bloqueante): no cierra con click afuera ni
   * con Escape — exige elegir una acción del footer. No es un componente
   * aparte, es este mismo Modal con este flag.
   */
  alertMode?: boolean
}

function Modal({ open, onClose, alertMode = false, className, children, ...props }: ModalProps) {
  React.useEffect(() => {
    if (!open || alertMode) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, alertMode, onClose])

  if (!open) return null

  return (
    <div
      className="modal-overlay"
      onClick={alertMode ? undefined : onClose}
      role={alertMode ? "alertdialog" : "dialog"}
      aria-modal="true"
    >
      <div
        className={cn("modal", className)}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("modal-header", className)} {...props} />
))
ModalHeader.displayName = "ModalHeader"

const ModalTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("modal-title", className)} {...props} />
))
ModalTitle.displayName = "ModalTitle"

const ModalDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("modal-description", className)} {...props} />
))
ModalDescription.displayName = "ModalDescription"

export interface ModalCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClose?: () => void
}

const ModalClose = React.forwardRef<HTMLButtonElement, ModalCloseProps>(
  ({ className, onClose, ...props }, ref) => (
    <button
      ref={ref}
      className={cn("modal-close", className)}
      onClick={onClose}
      {...props}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  )
)
ModalClose.displayName = "ModalClose"

const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("modal-body", className)} {...props} />
))
ModalBody.displayName = "ModalBody"

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("modal-footer", className)} {...props} />
))
ModalFooter.displayName = "ModalFooter"

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalClose, ModalBody, ModalFooter }
