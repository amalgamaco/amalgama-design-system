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
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    /** Render the built-in close button (X, top-right). Default true. */
    showCloseButton?: boolean
  }
>(({ className, children, showCloseButton = true, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-[var(--color-scrim)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-normal data-[state=open]:ease-enter data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-fast data-[state=closed]:ease-exit" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Canonical shadcn Dialog: content owns the padding (p-6) and `gap-4` separates
        // header / body / footer — no internal dividers. Borderless, clean surface.
        "fixed left-1/2 top-1/2 z-[100] grid w-[calc(100%-2rem)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border border-border bg-card p-6 text-on-surface shadow-xl outline-none",
        // Expressive: the content's zoom-in is the "hero moment" — the overlay's plain
        // fade stays Standard, since MD3 never overshoots effects (opacity/color).
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-medium data-[state=open]:ease-expressive-enter",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-fast data-[state=closed]:ease-exit",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="icon" aria-label="Cerrar" className="absolute right-4 top-4">
            <X className="size-[18px]" aria-hidden="true" />
          </Button>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DialogContent.displayName = "DialogContent"

// Header — borderless, STACKS title + description (a Dialog can carry both). The close button is
// absolute on DialogContent (not a header sibling), so the header never lays its text out in a row.
// pr-8 reserves room for the close button; vertical rhythm comes from DialogContent's `gap-4`.
export function DialogHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1.5 pr-8", className)} {...props}>
      {children}
    </div>
  )
}

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-heading-md leading-none font-semibold text-[var(--text-primary)]", className)} {...props} />
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

// Body — content region; padding + vertical rhythm come from DialogContent (p-6 + gap-4).
export function DialogBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm text-on-surface-variant", className)} {...props} />
}

// Footer — borderless; stacks on mobile (reversed so the primary sits on top), right-aligns on
// desktop (shadcn convention). For a single full-width action, pass a `w-full` button.
export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
}
