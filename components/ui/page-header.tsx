import * as React from "react"
import { cn } from "../lib/utils"

const PageHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("page-header", className)} {...props} />
))
PageHeader.displayName = "PageHeader"

const PageTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1 ref={ref} className={cn("page-title", className)} {...props} />
))
PageTitle.displayName = "PageTitle"

const HeaderActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("header-actions", className)} {...props} />
))
HeaderActions.displayName = "HeaderActions"

export { PageHeader, PageTitle, HeaderActions }
