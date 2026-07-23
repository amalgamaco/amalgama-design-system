/**
 * Accordion — vertically stacked, collapsible sections, built on @radix-ui/react-accordion.
 *
 * Cuándo usar: agrupar contenido extenso en secciones expandibles (FAQ, filtros avanzados,
 * detalles opcionales). Cuándo no: navegación entre vistas (usar Tabs), un solo bloque
 * mostrar/ocultar (usar Collapsible), contenido siempre visible.
 *
 * shadcn Accordion structure, Embassy tokens + MD3 Expressive chevron rotation. Canonical
 * implementation.
 */
import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "../lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b border-border", className)} {...props} />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // shadcn canonical: items-start (chevron top-aligns for 2-line titles),
        // hover:underline (not a color change), disabled dims + inert.
        "flex flex-1 items-start justify-between gap-4 py-4 text-left text-body-md font-medium text-fg outline-none transition-colors duration-fast ease-default hover:underline focus-visible:focus-ring disabled:opacity-50 disabled:pointer-events-none [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="size-4 shrink-0 translate-y-0.5 text-fg-muted transition-transform duration-normal ease-expressive-enter" aria-hidden="true" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-body-md text-on-surface-variant data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
    {...props}
  >
    <div className={cn("pb-4 pt-0 leading-[1.6]", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
