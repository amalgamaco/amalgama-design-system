/**
 * Stat Card — tarjetas KPI con etiqueta, valor grande y cambio porcentual.
 *
 * Cuándo usar: métricas numéricas con label y variación (KPIs en dashboards).
 * Cuándo no: contenido no numérico (usar Card).
 * Reemplaza a: widgets de métricas legacy.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/stat-card.css.
 */
import * as React from "react"
import { cn } from "../lib/utils"

const StatsGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("grid gap-4 mb-6 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]", className)}
      {...props}
    />
  )
)
StatsGrid.displayName = "StatsGrid"

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  change?: string
  changeColor?: string
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, change, changeColor, ...props }, ref) => (
    <div ref={ref} className={cn("bg-card border border-border rounded-lg p-5", className)} {...props}>
      <div className="text-body-sm text-fg-muted mb-2">{label}</div>
      <div className="font-heading text-display font-bold text-fg tracking-[-0.5px]">{value}</div>
      {change && (
        <div
          className="text-caption mt-1"
          style={changeColor ? { color: changeColor } : undefined}
        >
          {change}
        </div>
      )}
    </div>
  )
)
StatCard.displayName = "StatCard"

export { StatsGrid, StatCard }
