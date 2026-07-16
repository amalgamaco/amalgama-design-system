/**
 * Sheet — THE canonical edge-anchored panel of the DS (Radix Dialog, static).
 * `side="right" | "left"` = Side Sheet · `side="bottom"` = Bottom Sheet · `side="top"`.
 *
 * Cuándo usar: cualquier panel anclado a un borde — filtros, detalle, formularios secundarios,
 * bottom sheet en mobile. Cuándo no: navegación principal (usar el app-shell / Navigation Drawer);
 * diálogo modal centrado (usar Dialog).
 *
 * Standardization (2026-07): the DS collapsed to ONE edge-anchored panel. The separate vaul Drawer
 * was removed — its only added value was gesture (swipe / snap points / nesting), which the product
 * doesn't use. If a gesture surface is ever needed, reintroduce a gesture engine; until then every
 * edge panel is a Sheet. Motion: --ease-emphasized · --duration-sheet (500ms, no overshoot),
 * reduced-motion handled globally by the theme.
 *
 * shadcn Sheet structure, Embassy tokens. Canonical implementation.
 */
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "./button"

const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // Overlay fade on the shared emphasized curve at 500ms, symmetric enter/exit.
      // prefers-reduced-motion is handled globally by the theme.
      "fixed inset-0 z-50 bg-scrim/40 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "duration-sheet ease-emphasized",
      className
    )}
    {...props}
  />
))
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName

const sheetVariants = cva(
  // Canonical shadcn Sheet structure, Embassy tokens. `gap-4` separates header / body / footer;
  // the panel slides on the emphasized-decelerate curve at 500ms, symmetric enter/exit (no overshoot).
  // Reduced-motion handled globally. Side panels fill the height and are responsive (75% → 24rem).
  "fixed z-50 flex flex-col gap-4 bg-surface border-border shadow-xl duration-sheet ease-emphasized",
  {
    variants: {
      side: {
        top:
          "inset-x-0 top-0 h-auto border-b rounded-b-2xl sm:mx-auto sm:max-w-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        left:
          "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        bottom:
          "inset-x-0 bottom-0 h-auto max-h-[80vh] border-t rounded-t-2xl sm:mx-auto sm:max-w-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
      },
    },
    defaultVariants: { side: "right" },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  /** Render the built-in close button (X, top-right). Default true — set false to omit. */
  showCloseButton?: boolean
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ className, side, children, showCloseButton = true, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
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
SheetContent.displayName = DialogPrimitive.Content.displayName

// Header — borderless (shadcn); pr-14 reserves room for the top-right close button.
const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 px-6 pt-6 pr-14", className)} {...props} />
)
SheetHeader.displayName = "SheetHeader"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("font-heading text-heading-xs font-semibold text-fg", className)}
    {...props}
  />
))
SheetTitle.displayName = DialogPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-label text-fg-subtle", className)}
    {...props}
  />
))
SheetDescription.displayName = DialogPrimitive.Description.displayName

// Body — scrollable content region; vertical rhythm comes from SheetContent's `gap-4`.
const SheetBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-y-auto px-6", className)} {...props} />
)
SheetBody.displayName = "SheetBody"

// Footer — borderless, pinned to the bottom (`mt-auto`); buttons STACK full-width
// (flex-col + default align-stretch), the shadcn Sheet convention for a narrow panel.
const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 px-6 pb-6", className)} {...props} />
)
SheetFooter.displayName = "SheetFooter"

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
}
