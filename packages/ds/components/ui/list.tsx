import * as React from "react"
import { cn } from "../lib/utils"

// List has no first-class shadcn primitive, so this is a custom component in the
// shadcn idiom (cn + forwardRef), themed with Embassy surface tokens. Mirrors the
// MD3 list-item anatomy: headline + optional supporting text, optional button row.
export const List = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} role="list" className={cn("flex flex-col bg-card text-on-surface", className)} {...props} />
))
List.displayName = "List"

export interface ListItemProps extends React.HTMLAttributes<HTMLElement> {
  headline: React.ReactNode
  supporting?: React.ReactNode
  /** Render an interactive item that activates on click AND Enter/Space. */
  asButton?: boolean
  /** Render the item as a link (takes precedence over asButton for real URL semantics). */
  href?: string
}

// An interactive list item renders a real <button> (or <a> when href is given) so it
// gets native keyboard activation (Enter/Space), focus, and AT semantics — the previous
// `<div tabIndex={0}>` was focusable but not operable by keyboard (an a11y defect).
export const ListItem = React.forwardRef<HTMLElement, ListItemProps>(
  ({ className, headline, supporting, asButton, href, ...props }, ref) => {
    const interactive = asButton || href != null
    const classes = cn(
      "flex min-h-14 w-full flex-col justify-center gap-0.5 px-4 py-2.5 text-left outline-none",
      interactive &&
        "cursor-pointer transition-colors hover:bg-[var(--color-nav-hover)] hover:text-[var(--color-nav-hover-content)] focus-visible:bg-[var(--color-nav-hover)] focus-visible:text-[var(--color-nav-hover-content)] active:bg-[var(--color-nav-press)]",
      className
    )
    const content = (
      <>
        <span className="text-sm leading-tight">{headline}</span>
        {supporting && (
          <span className="text-[12.5px] leading-tight text-on-surface-variant">{supporting}</span>
        )}
      </>
    )
    if (href != null) {
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} role="listitem" href={href} className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {content}
        </a>
      )
    }
    if (asButton) {
      return (
        <button ref={ref as React.Ref<HTMLButtonElement>} type="button" role="listitem" className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
          {content}
        </button>
      )
    }
    return (
      <div ref={ref as React.Ref<HTMLDivElement>} role="listitem" className={classes} {...props}>
        {content}
      </div>
    )
  }
)
ListItem.displayName = "ListItem"
