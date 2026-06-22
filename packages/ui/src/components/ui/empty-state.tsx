import * as React from "react"
import { cn } from "../../lib/utils"

export function EmptyState({
  icon, title, description, action, className, ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className={cn("flex flex-col items-center text-center gap-3 px-6 py-12", className)} {...props}>
      {icon && <div className="text-muted-foreground [&>svg]:size-10">{icon}</div>}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
