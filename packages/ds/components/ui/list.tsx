import * as React from "react"
import { cn } from "../lib/utils"

// List has no first-class shadcn primitive, so this is a custom component in the
// shadcn idiom (cn + forwardRef), themed with Embassy surface tokens. Mirrors the
// MD3 list-item anatomy: headline + optional supporting text, optional button row.
export const List = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} role="list" className={cn("flex flex-col bg-card text-foreground", className)} {...props} />
))
List.displayName = "List"

export interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  headline: React.ReactNode
  supporting?: React.ReactNode
  asButton?: boolean
}

export const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  ({ className, headline, supporting, asButton, ...props }, ref) => (
    <div
      ref={ref}
      role="listitem"
      tabIndex={asButton ? 0 : undefined}
      className={cn(
        "flex min-h-14 flex-col justify-center gap-0.5 px-4 py-2.5 outline-none",
        asButton &&
          "cursor-pointer transition-colors hover:bg-muted focus-visible:bg-muted",
        className
      )}
      {...props}
    >
      <span className="text-sm leading-tight">{headline}</span>
      {supporting && (
        <span className="text-[12.5px] leading-tight text-muted-foreground">{supporting}</span>
      )}
    </div>
  )
)
ListItem.displayName = "ListItem"
