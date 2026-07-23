/**
 * Page Header — encabezado de página con título y acciones.
 *
 * Cuándo usar: título + acciones al tope de cada vista.
 * Cuándo no: dentro de cards o modales (tienen su propio header).
 * Reemplaza a: headers de página ad-hoc.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/page-header.css.
 */
import * as React from "react"
import { cn } from "../lib/utils"

const PageHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between mb-6", className)} {...props} />
  )
)
PageHeader.displayName = "PageHeader"

const PageTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn("font-heading text-heading-lg font-semibold tracking-[-0.3px]", className)}
      {...props}
    />
  )
)
PageTitle.displayName = "PageTitle"

const HeaderActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-[10px]", className)} {...props} />
  )
)
HeaderActions.displayName = "HeaderActions"

export { PageHeader, PageTitle, HeaderActions }
