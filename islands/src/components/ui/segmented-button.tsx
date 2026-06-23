import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const segGroupVariants = cva(
  "inline-flex items-stretch overflow-hidden rounded-full border border-outline",
  {
    variants: {
      size: {
        sm: "h-8",
        md: "h-10",
        lg: "h-12",
      },
    },
    defaultVariants: { size: "md" },
  }
)

const segItemVariants = cva(
  [
    "relative flex-1 flex items-center justify-center gap-1.5 font-medium transition-colors select-none cursor-pointer",
    "border-r border-outline last:border-r-0",
    "text-on-surface bg-surface hover:bg-surface-variant",
    "data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container data-[state=on]:font-semibold",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:z-10",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "text-[12px] px-3",
        md: "text-[13px] px-4",
        lg: "text-[14px] px-5",
      },
    },
    defaultVariants: { size: "md" },
  }
)

interface SegmentedButtonGroupProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>, "type">,
    VariantProps<typeof segGroupVariants> {
  type?: "single" | "multiple"
}

const SegmentedButtonGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  SegmentedButtonGroupProps
>(({ className, size, type = "single", ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    type={type as "single"}
    className={cn(segGroupVariants({ size }), className)}
    {...props}
  />
))
SegmentedButtonGroup.displayName = "SegmentedButtonGroup"

interface SegmentedButtonItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof segItemVariants> {}

const SegmentedButtonItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  SegmentedButtonItemProps
>(({ className, size, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(segItemVariants({ size }), className)}
    {...props}
  />
))
SegmentedButtonItem.displayName = "SegmentedButtonItem"

export { SegmentedButtonGroup, SegmentedButtonItem }
