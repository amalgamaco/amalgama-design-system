import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "./button"

// shadcn Dialog (Radix) — Embassy modal anatomy (header/body/footer), scrim
// overlay, surface card with radius-lg.
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-[var(--color-scrim)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-normal data-[state=open]:ease-enter data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-fast data-[state=closed]:ease-exit" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-[100] w-[calc(100%-2rem)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-0 text-on-surface shadow-xl outline-none",
        // Expressive: the content's zoom-in is the "hero moment" — the overlay's plain
        // fade stays Standard, since MD3 never overshoots effects (opacity/color).
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-medium data-[state=open]:ease-expressive-enter",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-fast data-[state=closed]:ease-exit",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DialogContent.displayName = "DialogContent"

export function DialogHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center justify-between border-b border-border px-5 py-4", className)} {...props}>
      {children}
      <DialogPrimitive.Close asChild>
        <Button variant="icon" aria-label="Cerrar">
          <X className="size-[18px]" aria-hidden="true" />
        </Button>
      </DialogPrimitive.Close>
    </div>
  )
}

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-base font-semibold text-[var(--text-primary)]", className)} {...props} />
))
DialogTitle.displayName = "DialogTitle"

// shadcn parity: DialogDescription wraps Radix's Description primitive (wires
// aria-describedby to the content automatically). Embassy's DialogBody remains the
// padded content-region wrapper; use DialogDescription for the accessible summary
// line inside a header/body.
export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-on-surface-variant", className)} {...props} />
))
DialogDescription.displayName = "DialogDescription"

export function DialogBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-4 text-sm text-on-surface-variant", className)} {...props} />
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex justify-end gap-2 border-t border-border px-5 py-4", className)} {...props} />
}
