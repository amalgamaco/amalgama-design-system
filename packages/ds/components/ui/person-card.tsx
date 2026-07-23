/**
 * Person Card — variante de dominio "Person" de la Basic Card (Item).
 *
 * Cuándo usar: ítem de persona en grillas (avatar + nombre + rol).
 * Cuándo no: vacantes (vacancy-card); datos tabulares de personas (Table).
 * Reemplaza a: cards de perfil custom.
 *
 * NOT a standalone primitive — it's the Person variant of Basic Card, composed on the
 * Item primitive (horizontal row: avatar in ItemMedia + name/role in ItemContent). Only
 * adds the tonal Secondary avatar + surface bg + hover-shadow. Reconciled from the
 * buildless rebuild (Item composition) + color audit (avatar → secondary-container pair).
 */
import * as React from "react"
import { cn } from "../lib/utils"
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from "./item"

interface PersonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  role?: string
  avatarSrc?: string
  avatarFallback?: string
  meta?: string
  actions?: React.ReactNode
}

function PersonCard({
  name,
  role,
  avatarSrc,
  avatarFallback,
  meta,
  actions,
  className,
  ...props
}: PersonCardProps) {
  const fallback =
    avatarFallback ??
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()

  return (
    <Item
      variant="outline"
      clickable
      className={cn("bg-card hover:shadow-md", className)}
      {...props}
    >
      <ItemMedia className="self-center">
        <span className="flex items-center justify-center size-11 rounded-full overflow-hidden bg-secondary-container text-on-secondary-container text-heading-xs font-semibold">
          {avatarSrc ? (
            <img src={avatarSrc} alt={name} className="size-full object-cover" />
          ) : (
            fallback
          )}
        </span>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{name}</ItemTitle>
        {role && <ItemDescription>{role}</ItemDescription>}
        {meta && <ItemDescription>{meta}</ItemDescription>}
      </ItemContent>
      {actions && <ItemActions>{actions}</ItemActions>}
    </Item>
  )
}

export { PersonCard }
