import * as React from "react"
import { cn } from "../lib/utils"

export type RichTooltipSide = "top" | "right" | "bottom" | "left"

export interface RichTooltipProps {
  /** The element that opens the tooltip. */
  trigger: React.ReactNode
  title: string
  /** Supporting text shown under the title. */
  subtitle?: React.ReactNode
  /** Optional action row (e.g. text buttons). */
  actions?: React.ReactNode
  /** Hide the close (×) button. Defaults to shown. */
  hideClose?: boolean
  side?: RichTooltipSide
  className?: string
}

/**
 * Rich Tooltip — click/focus-triggered, persistent, dismissible. Self-managed
 * open state (click trigger to toggle, click outside or Escape to close) since
 * there's no Popover primitive underneath in this build.
 */
function RichTooltip({
  trigger,
  title,
  subtitle,
  actions,
  hideClose = false,
  side = "top",
  className,
}: RichTooltipProps) {
  const [open, setOpen] = React.useState(false)
  const wrapRef = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    if (!open) return
    const handlePointer = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handlePointer)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handlePointer)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  return (
    <span className="rich-tooltip-wrap" ref={wrapRef}>
      {React.isValidElement(trigger)
        ? React.cloneElement(trigger as React.ReactElement<any>, {
            onClick: (e: React.MouseEvent) => {
              ;(trigger as React.ReactElement<any>).props.onClick?.(e)
              setOpen((v) => !v)
            },
          })
        : trigger}
      <div
        className={cn("rich-tooltip-content", `rich-tooltip-${side}`, open && "open", className)}
        role="dialog"
      >
        <div className="rich-tooltip-row">
          <div className="rich-tooltip-body">
            <p className="rich-tooltip-title">{title}</p>
            {subtitle ? <p className="rich-tooltip-subtitle">{subtitle}</p> : null}
          </div>
          {!hideClose ? (
            <button
              type="button"
              aria-label="Cerrar"
              className="rich-tooltip-close"
              onClick={() => setOpen(false)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ) : null}
        </div>
        {actions ? <div className="rich-tooltip-actions">{actions}</div> : null}
      </div>
    </span>
  )
}

RichTooltip.displayName = "RichTooltip"

export { RichTooltip }
