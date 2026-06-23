import * as React from "react"
import { cn } from "../../lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

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
    <div
      className={cn(
        "flex flex-col items-center text-center gap-2 rounded-lg border border-border bg-surface p-5 hover:bg-surface-variant transition-colors",
        className
      )}
      {...props}
    >
      <Avatar size="xl">
        {avatarSrc && <AvatarImage src={avatarSrc} alt={name} />}
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold text-body-sm text-fg">{name}</p>
        {role && <p className="text-label text-fg-subtle">{role}</p>}
        {meta && <p className="text-label text-fg-subtle">{meta}</p>}
      </div>
      {actions && <div className="flex gap-2 flex-wrap justify-center">{actions}</div>}
    </div>
  )
}

export { PersonCard }
