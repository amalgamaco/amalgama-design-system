/**
 * Drawer — a gesture-driven panel that slides from an edge (built on vaul). Distinct from Sheet:
 * Drawer is the touch-first, drag-to-dismiss surface (a mobile bottom drawer with a drag handle),
 * Sheet is the Radix-Dialog side panel for desktop. This is shadcn's own Sheet-vs-Drawer split.
 *
 * Cuándo usar: paneles móviles arrastrables (filtros, detalle, acciones) donde el gesto de
 * arrastrar-para-cerrar importa; bottom sheet táctil. Cuándo no: panel lateral de escritorio
 * (usar Sheet); diálogo modal centrado (usar Dialog); navegación principal (usar el app-shell).
 * Reemplaza a: bottom sheets arrastrables hechos a mano.
 *
 * shadcn Drawer structure (vaul), Embassy tokens — surface = `bg-surface`, scrim = `bg-scrim/40`,
 * título/descripción con los mismos tokens que Sheet. Soporta las 4 direcciones (`direction`).
 * Canonical implementation.
 */
import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { cn } from "../lib/utils"

export const Drawer = ({ shouldScaleBackground = true, ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
)
Drawer.displayName = "Drawer"

export const DrawerTrigger = DrawerPrimitive.Trigger
export const DrawerPortal = DrawerPrimitive.Portal
export const DrawerClose = DrawerPrimitive.Close
/** Nested drawer root — open a Drawer from inside another Drawer (parent stays mounted, stacks behind). */
export const DrawerNestedRoot = DrawerPrimitive.NestedRoot

export const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn(
      // The fade-in/out classes are REQUIRED: vaul starts the overlay at opacity 0 and relies on
      // these to animate it in — without them the scrim never becomes visible. Duration/curve are
      // the shared sheet/drawer tokens (vaul drives the same 500ms emphasized fade) so the Drawer
      // overlay and the Sheet overlay transition identically.
      "fixed inset-0 z-50 bg-scrim/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-drawer ease-emphasized",
      className
    )}
    {...props}
  />
))
DrawerOverlay.displayName = "DrawerOverlay"

export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        // Surface + depth match Sheet (bg-surface, border-border, shadow-xl). Direction is driven
        // by vaul's data-[vaul-drawer-direction]; radius uses the Sheet 2xl language per edge.
        "group/drawer-content fixed z-50 flex h-auto flex-col bg-surface border-border shadow-xl",
        "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-2xl data-[vaul-drawer-direction=top]:border-b",
        "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-2xl data-[vaul-drawer-direction=bottom]:border-t",
        "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
        "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
        className
      )}
      {...props}
    >
      {/* Drag handle — only shown on the bottom drawer (the draggable-to-dismiss affordance). */}
      <div className="mx-auto mt-4 hidden h-1.5 w-[100px] shrink-0 rounded-full bg-outline-variant group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

export const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col gap-1 p-6 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:text-left",
      className
    )}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

export const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-6 pt-4", className)} {...props} />
)
DrawerFooter.displayName = "DrawerFooter"

export const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("font-heading text-heading-xs font-semibold text-fg", className)}
    {...props}
  />
))
DrawerTitle.displayName = "DrawerTitle"

export const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description ref={ref} className={cn("text-label text-fg-subtle", className)} {...props} />
))
DrawerDescription.displayName = "DrawerDescription"

/** Body region between header and footer (Embassy convention, matches SheetBody). */
export const DrawerBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-y-auto px-6", className)} {...props} />
)
DrawerBody.displayName = "DrawerBody"
