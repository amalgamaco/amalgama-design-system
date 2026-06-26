/**
 * Skeleton — animación de carga shimmer para placeholders.
 *
 * Cuándo usar: carga de contenido con estructura conocida (mientras llega la data).
 * Cuándo no: estados vacíos (usar Empty State). No usar spinners ad-hoc.
 * Reemplaza a: spinners/loaders custom.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/skeleton.css.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const skeletonVariants = cva(
  "skeleton-shimmer rounded-md",
  {
    variants: {
      variant: {
        text:  "h-[14px] mb-2",
        title: "h-[22px] w-3/5 mb-3",
        card:  "h-[80px] mb-2",
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
