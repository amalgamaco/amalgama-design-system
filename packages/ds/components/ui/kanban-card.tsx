/**
 * Kanban — tablero kanban con columnas y tarjetas arrastrables.
 *
 * Cuándo usar: tableros de flujo por columnas (pipelines de recruiting/HR).
 * Cuándo no: datos tabulares (usar Table); listas simples (usar cards).
 * Reemplaza a: boards custom.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/kanban.css.
 */
import * as React from "react"
import { cn } from "../lib/utils"
import { Badge, type BadgeProps } from "./badge"

interface KanbanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  badgeLabel?: string
  badgeVariant?: BadgeProps["variant"]
  meta?: React.ReactNode
  avatarLabel?: string
}

function KanbanCard({
  title,
  badgeLabel,
  badgeVariant = "draft",
  meta,
  avatarLabel,
  className,
  ...props
}: KanbanCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface px-3 py-3 cursor-default hover:shadow-sm transition-shadow",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-body-sm font-semibold text-fg leading-snug">{title}</p>
        {badgeLabel && <Badge variant={badgeVariant} className="shrink-0">{badgeLabel}</Badge>}
      </div>
      <div className="flex items-center justify-between gap-2">
        {meta && <div className="text-label text-fg-subtle">{meta}</div>}
        {avatarLabel && (
          <div className="h-6 w-6 rounded-full bg-primary-container text-on-primary-container text-[10px] font-semibold flex items-center justify-center ml-auto">
            {avatarLabel}
          </div>
        )}
      </div>
    </div>
  )
}

interface KanbanColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  count?: number
  children?: React.ReactNode
}

function KanbanColumn({ title, count, children, className, ...props }: KanbanColumnProps) {
  return (
    <div className={cn("flex flex-col gap-2 min-w-[180px] flex-1", className)} {...props}>
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-label font-semibold text-fg-subtle uppercase tracking-wide text-[11px]">
          {title}
        </span>
        {count !== undefined && (
          <span className="text-[11px] font-semibold bg-surface-variant text-fg-subtle rounded-full px-2 py-0.5">
            {count}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

export { KanbanCard, KanbanColumn }
