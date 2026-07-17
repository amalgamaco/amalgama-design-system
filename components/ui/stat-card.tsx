import * as React from "react"
import { cn } from "../lib/utils"

const StatsGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("stats-grid", className)} {...props} />
))
StatsGrid.displayName = "StatsGrid"

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  change?: string
  /** Token-bound color for the change indicator — prefer this over `changeColor`. */
  trend?: "positive" | "negative" | "neutral"
  /** @deprecated arbitrary CSS color escape hatch — prefer `trend` for token-bound colors. */
  changeColor?: string
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, change, trend, changeColor, ...props }, ref) => (
    <div ref={ref} className={cn("stat-card", className)} {...props}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {change && (
        <div
          className={cn("stat-change", trend && `stat-change-${trend}`)}
          style={!trend && changeColor ? { color: changeColor } : undefined}
        >
          {change}
        </div>
      )}
    </div>
  )
)
StatCard.displayName = "StatCard"

export { StatsGrid, StatCard }
