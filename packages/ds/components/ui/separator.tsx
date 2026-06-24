import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "../lib/utils"

// shadcn Separator (Radix) — Embassy `--border` token. `inset` adds the MD3
// inset offset (16px) so it aligns past list-item leading content.
export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  inset?: boolean
}

export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(({ className, orientation = "horizontal", decorative = true, inset, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
      inset && orientation === "horizontal" && "ml-4 w-[calc(100%-1rem)]",
      className
    )}
    {...props}
  />
))
Separator.displayName = "Separator"
