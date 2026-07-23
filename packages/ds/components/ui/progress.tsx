import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "../lib/utils"

// Linear: shadcn Progress (Radix). Track = surface-variant, indicator = primary.
// `indeterminate` (value omitted) animates a sliding bar.
export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indeterminate?: boolean
}

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indeterminate, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-1 w-full overflow-hidden rounded-full bg-surface-variant", className)}
    value={indeterminate ? null : value}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full rounded-full bg-primary transition-transform",
        indeterminate && "w-2/5 animate-[emb-linear_1.4s_ease-in-out_infinite]"
      )}
      style={indeterminate ? undefined : { transform: `translateX(-${100 - (value ?? 0)}%)`, width: "100%" }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = "Progress"

// Circular has no shadcn/Radix primitive → custom SVG. Determinate uses
// stroke-dashoffset; indeterminate spins a partial arc.
export interface CircularProgressProps {
  value?: number
  indeterminate?: boolean
  size?: number
  strokeWidth?: number
  "aria-label"?: string
}

export function CircularProgress({
  value = 0,
  indeterminate,
  size = 44,
  strokeWidth = 4,
  ...props
}: CircularProgressProps) {
  const r = (size - strokeWidth) / 2
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      className={indeterminate ? "animate-spin" : undefined}
      {...props}
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-variant)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={indeterminate ? c * 0.75 : offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: indeterminate ? undefined : "stroke-dashoffset var(--duration-medium, .3s) var(--ease-default, ease)" }}
      />
    </svg>
  )
}
