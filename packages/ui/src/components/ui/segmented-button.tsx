import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { cn } from "../../lib/utils"

// MD3 segmented button — single-select toggle group, Embassy-themed.
export interface SegmentedButtonProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
  "aria-label"?: string
}

export const SegmentedButton = React.forwardRef<HTMLDivElement, SegmentedButtonProps>(
  ({ className, ...props }, ref) => (
    <ToggleGroupPrimitive.Root
      ref={ref}
      type="single"
      className={cn("inline-flex overflow-hidden rounded-full border border-input", className)}
      {...props}
    />
  )
)
SegmentedButton.displayName = "SegmentedButton"

export const SegmentedItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(
      "h-9 border-r border-input px-4 text-sm font-medium text-foreground outline-none transition-colors last:border-r-0",
      "hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
      "data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground",
      className
    )}
    {...props}
  />
))
SegmentedItem.displayName = "SegmentedItem"
