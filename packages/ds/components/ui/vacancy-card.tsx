/**
 * Vacancy Card — tarjeta de vacante con ícono, título, metadata, stats y asignados.
 *
 * Cuándo usar: ítem de vacante en listas de recruiting (ícono + nombre + meta + stats).
 * Cuándo no: personas (person-card); otros dominios (usar Card genérica).
 * Reemplaza a: rows/cards de vacante custom.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/vacancy-card.css.
 */
import * as React from "react"
import { cn } from "../lib/utils"
import { Card } from "./card"
import { Badge, type BadgeProps } from "./badge"

interface VacancyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  name: string
  department?: string
  badgeLabel?: string
  badgeVariant?: BadgeProps["variant"]
  meta?: string
}

function VacancyCard({
  icon,
  name,
  department,
  badgeLabel,
  badgeVariant = "open",
  meta,
  className,
  ...props
}: VacancyCardProps) {
  return (
    <Card
      className={cn(
        "flex items-center gap-3 bg-surface px-4 py-3 hover:bg-surface-variant transition-colors cursor-default",
        className
      )}
      {...props}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container text-body-sm font-semibold">
        {icon ?? name.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex flex-1 min-w-0 flex-col gap-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-body-sm text-fg truncate">{name}</span>
          {badgeLabel && <Badge variant={badgeVariant}>{badgeLabel}</Badge>}
        </div>
        {department && <span className="text-label text-fg-subtle">{department}</span>}
      </div>
      {meta && <span className="text-label text-fg-subtle whitespace-nowrap">{meta}</span>}
    </Card>
  )
}

export { VacancyCard }
