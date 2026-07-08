import * as React from "react"
import { cn } from "../lib/utils"

/* Create Form — sticky header + footer for full-page creation flows.
   Cuándo usar: header + footer pegajoso de formularios de creación full-page.
   Cuándo no: tareas cortas que caben en un Modal.

   Uso:
   <CreateHeader><CreateTitle>Crear vacante</CreateTitle></CreateHeader>
   {/* form fields */}
   <CreateFooter>
     <Button variant="tertiary">Cancelar</Button>
     <Button>Publicar</Button>
   </CreateFooter>
*/

function CreateHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-0", className)} {...props} />
}

function CreateTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "font-heading text-heading-xl font-semibold tracking-[-0.4px] text-fg mb-5",
        className
      )}
      {...props}
    />
  )
}

function CreateFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "sticky bottom-0 mt-auto flex items-center justify-between border-t border-border bg-card px-8 py-4",
        className
      )}
      {...props}
    />
  )
}

export { CreateHeader, CreateTitle, CreateFooter }
