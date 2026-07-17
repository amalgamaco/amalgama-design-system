import * as React from "react"
import { cn } from "../lib/utils"

export type SheetSide = "top" | "right" | "bottom" | "left"

export interface SheetProps {
  open?: boolean
  onClose?: () => void
  side?: SheetSide
  children: React.ReactNode
}

/**
 * Sheet — the DS's one canonical edge-anchored panel (`side` picks the edge).
 * Fully controlled, same pattern as Modal: consumer owns `open` state and renders
 * its own trigger; Escape closes it, click-outside (the overlay) closes it too.
 */
function Sheet({ open, onClose, side = "right", children }: SheetProps) {
  React.useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="sheet-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={cn("sheet-content", `sheet-content-${side}`, "open")}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

/** Convenience passthrough — wire its onClick to whatever sets `open` true. */
const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button ref={ref} className={className} {...props} />
))
SheetTrigger.displayName = "SheetTrigger"

export interface SheetCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClose?: () => void
}

const SheetClose = React.forwardRef<HTMLButtonElement, SheetCloseProps>(
  ({ className, onClose, ...props }, ref) => (
    <button
      ref={ref}
      className={cn("sheet-close", className)}
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
SheetClose.displayName = "SheetClose"

const SheetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("sheet-header", className)} {...props} />
))
SheetHeader.displayName = "SheetHeader"

const SheetTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("sheet-title", className)} {...props} />
))
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("sheet-description", className)} {...props} />
))
SheetDescription.displayName = "SheetDescription"

const SheetBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("sheet-body", className)} {...props} />
))
SheetBody.displayName = "SheetBody"

const SheetFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("sheet-footer", className)} {...props} />
))
SheetFooter.displayName = "SheetFooter"

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
}
