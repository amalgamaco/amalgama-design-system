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
        "inline-flex items-center gap-1.5 text-body-md text-fg-subtle cursor-pointer transition-colors duration-fast ease-in-out mb-1.5 bg-transparent border-none p-0 font-body hover:text-fg focus-visible:focus-ring",
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
