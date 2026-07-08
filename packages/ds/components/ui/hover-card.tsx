/**
 * Hover Card — preview content shown on hover/focus of a trigger, built on
 * @radix-ui/react-hover-card.
 *
 * Cuándo usar: previsualizar contenido enriquecido al pasar el mouse sobre un enlace/nombre
 * (perfil de persona, resumen de vacante) — solo cuando el hover es opcional/no esencial.
 * Cuándo no: información crítica para touch/teclado (usar Popover o navegar), texto corto
 * (usar Tooltip). Reemplaza a: previews custom con timers.
 *
 * shadcn Hover Card structure, Embassy popover-surface tokens + the shared enter/exit motion.
 * Canonical implementation.
 */
import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { cn } from "../lib/utils"

const HoverCard = HoverCardPrimitive.Root
const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 6, ...props }, ref) => (
  <HoverCardPrimitive.Portal>
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-64 rounded-lg border border-border bg-surface-container-high text-on-surface p-4 shadow-lg outline-none",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-fast data-[state=open]:ease-expressive-enter",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-fast data-[state=closed]:ease-exit",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </HoverCardPrimitive.Portal>
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }
