import * as React from "react"
import { cn } from "../lib/utils"

export type TooltipSide = "top" | "right" | "bottom" | "left"

export interface TooltipProps {
  /** The trigger element the tooltip is anchored to. */
  children: React.ReactNode
  /** Tooltip text. */
  content: React.ReactNode
  side?: TooltipSide
  className?: string
}

/**
 * Tooltip — CSS-only (hover/focus-within), no viewport collision detection.
 * Wraps the trigger + a `role="tooltip"` span, linked via `aria-describedby`.
 */
function Tooltip({ children, content, side = "top", className }: TooltipProps) {
  const id = React.useId()
  return (
    <span className={cn("tooltip-wrap", className)}>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            "aria-describedby": id,
          })
        : children}
      <span className={cn("tooltip-content", `tooltip-${side}`)} role="tooltip" id={id}>
        {content}
      </span>
    </span>
  )
}

export { Tooltip }
