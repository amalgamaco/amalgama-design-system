/**
 * Collapsible — a single show/hide region, built on @radix-ui/react-collapsible.
 *
 * Cuándo usar: mostrar/ocultar UN bloque de contenido bajo un disparador ("ver más",
 * detalles opcionales). Cuándo no: varias secciones expandibles agrupadas (usar Accordion).
 *
 * shadcn Collapsible = thin re-export of the Radix primitives (no extra styling). Style the
 * trigger/content at the call site with Embassy tokens. Canonical implementation.
 */
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
