import * as React from "react"
import { cn } from "../lib/utils"

/* Placeholder Panel — centered panel for "coming soon" / empty section messages.
   Cuándo usar: panel para secciones/features en construcción.
   Cuándo no: listas sin datos (usar Empty State).

   Uso:
   <PlaceholderPanel icon="📋">Selecciona una vacante para ver los detalles.</PlaceholderPanel>
*/

interface PlaceholderPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
}

function PlaceholderPanel({ icon, className, children, ...props }: PlaceholderPanelProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card px-8 py-12 text-center text-fg-muted text-body-lg",
        className
      )}
      {...props}
    >
      {icon && <div className="mb-3 text-[32px] leading-none">{icon}</div>}
      <p className="leading-[1.6]">{children}</p>
    </div>
  )
}

export { PlaceholderPanel }
