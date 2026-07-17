import * as React from "react"
import { cn } from "../lib/utils"

/**
 * Scroll Area — pure CSS, no JS. A native `overflow: auto` container styled with
 * `.scroll-area` (cross-browser thin scrollbar via `scrollbar-*` + `::-webkit-scrollbar`).
 */
const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("scroll-area", className)} {...props}>
    {children}
  </div>
))
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
