import * as React from "react"
import { cn } from "../lib/utils"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, children, ...props }, ref) => (
    <div ref={ref} className={cn("text-center py-12 px-6 text-fg-muted", className)} {...props}>
      {icon && <div className="text-[48px] mb-4">{icon}</div>}
      <div className="font-heading text-heading-md font-semibold text-fg-subtle mb-2">{title}</div>
      {description && (
        <p className="text-body-lg text-fg-muted max-w-[400px] mx-auto mb-5 leading-[1.6]">
          {description}
        </p>
      )}
      {children}
    </div>
  )
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
