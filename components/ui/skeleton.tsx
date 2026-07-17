import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const skeletonVariants = cva(
  "skeleton",
  {
    variants: {
      variant: {
        text: "skeleton-text",
        title: "skeleton-title",
        card: "skeleton-card",
      },
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(skeletonVariants({ variant, className }))}
      {...props}
    />
  )
)
Skeleton.displayName = "Skeleton"

export { Skeleton, skeletonVariants }
