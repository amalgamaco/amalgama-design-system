/**
 * Back Link — enlace de retorno con icono para navegación.
 *
 * Cuándo usar: volver a la vista padre desde una página de detalle.
 * Cuándo no: navegación principal (usar sidebar/tabs) ni acciones (usar btn-text).
 * Reemplaza a: links "‹ Volver" ad-hoc.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/back-link.css.
 */
import * as React from "react"
import { cn } from "../lib/utils"

export interface BackLinkProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const BackLink = React.forwardRef<HTMLButtonElement, BackLinkProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 text-body-md text-fg-subtle cursor-pointer transition-colors duration-fast ease-default mb-1.5 bg-transparent border-none p-0 font-body hover:text-fg focus-visible:focus-ring",
        className
      )}
      {...props}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      {children}
    </button>
  )
)
BackLink.displayName = "BackLink"

export { BackLink }
