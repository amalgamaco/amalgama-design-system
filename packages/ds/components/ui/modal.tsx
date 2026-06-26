/**
 * Modal — diálogo modal con overlay, header, body y footer.
 *
 * Cuándo usar: confirmaciones y tareas cortas que bloquean el contexto actual.
 * Cuándo no: formularios largos (página con create-form); feedback pasivo (usar Toast).
 * Reemplaza a: dialogs/popups/lightboxes legacy.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/modal.css.
 */
import * as React from "react"
import { cn } from "../lib/utils"

export interface ModalOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

const ModalOverlay = React.forwardRef<HTMLDivElement, ModalOverlayProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-scrim/60 animate-fade-in",
        className
      )}
      {...props}
    />
  )
)
ModalOverlay.displayName = "ModalOverlay"

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onClose?: () => void
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ className, open, onClose, children, ...props }, ref) => {
    React.useEffect(() => {
      if (!open) return
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose?.()
      }
      document.addEventListener("keydown", handleKey)
      return () => document.removeEventListener("keydown", handleKey)
    }, [open, onClose])

    if (open === false) return null

    return (
      <ModalOverlay onClick={onClose}>
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "relative bg-card border border-border rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col animate-slide-in-up",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ModalOverlay>
    )
  }
)
Modal.displayName = "Modal"

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0", className)}
      {...props}
    />
  )
)
ModalHeader.displayName = "ModalHeader"

export interface ModalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const ModalTitle = React.forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn("font-heading text-heading-sm font-semibold text-fg m-0", className)}
      {...props}
    />
  )
)
ModalTitle.displayName = "ModalTitle"

export interface ModalCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ModalClose = React.forwardRef<HTMLButtonElement, ModalCloseProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label="Cerrar"
      className={cn(
        "inline-flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-fg-muted cursor-pointer hover:bg-surface-variant hover:text-fg transition-colors duration-[120ms] focus-visible:focus-ring [&_svg]:w-5 [&_svg]:h-5",
        className
      )}
      {...props}
    >
      {children ?? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
    </button>
  )
)
ModalClose.displayName = "ModalClose"

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-6 py-5 flex-1 overflow-y-auto", className)} {...props} />
  )
)
ModalBody.displayName = "ModalBody"

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-end gap-3 px-6 py-4 border-t border-border flex-shrink-0", className)}
      {...props}
    />
  )
)
ModalFooter.displayName = "ModalFooter"

export { ModalOverlay, Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter }
