import * as React from "react"
import { X } from "lucide-react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "./popover"
import { cn } from "../lib/utils"

// Rich tooltip (MD3 "rich tooltip"): a persistent, dismissible surface with a
// title, supporting text (subtitle) and an optional action row — unlike the plain
// hover Tooltip, it is click/focus-triggered (Popover-based) so the pointer can
// enter it to read or interact. Themed with Embassy surface tokens.

export interface RichTooltipProps {
  /** The element that opens the tooltip (rendered via Radix `asChild`). */
  trigger: React.ReactNode
  title: string
  /** Supporting text shown under the title. */
  subtitle?: React.ReactNode
  /** Optional action row (e.g. text buttons). */
  actions?: React.ReactNode
  /** Hide the close (×) button. Defaults to shown. */
  hideClose?: boolean
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  className?: string
}

export function RichTooltip({
  trigger,
  title,
  subtitle,
  actions,
  hideClose = false,
  side = "top",
  align = "center",
  className,
}: RichTooltipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent side={side} align={align} className={cn("p-0", className)}>
        <div className="flex items-start gap-2 p-4">
          <div className="flex-1 min-w-0">
            <p className="font-heading text-body-md font-semibold text-on-surface">
              {title}
            </p>
            {subtitle ? (
              <p className="mt-1 text-body-sm text-on-surface-variant">{subtitle}</p>
            ) : null}
          </div>
          {!hideClose ? (
            <PopoverClose
              aria-label="Cerrar"
              className="shrink-0 grid place-items-center -mr-1 -mt-1 w-7 h-7 rounded-full text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors outline-none focus-visible:focus-ring"
            >
              <X className="w-[18px] h-[18px]" />
            </PopoverClose>
          ) : null}
        </div>
        {actions ? (
          <div className="flex justify-end gap-2 px-4 pb-3 -mt-1">{actions}</div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

RichTooltip.displayName = "RichTooltip"
