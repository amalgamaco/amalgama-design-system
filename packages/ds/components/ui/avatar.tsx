import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full font-semibold select-none",
  {
    variants: {
      size: {
        sm: "h-7 w-7 text-[11px]",
        md: "h-9 w-9 text-[13px]",
        lg: "h-11 w-11 text-base",
        xl: "h-14 w-14 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size }), className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-primary text-on-primary",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// AvatarGroup — overlapping stack (assignees, participants). Negative margin
// overlaps siblings; each avatar gets a surface-colored ring so the overlap reads
// as separate discs. Mirrors shadcn's newer AvatarGroup composition.
const AvatarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center -space-x-2 [&>*]:ring-2 [&>*]:ring-surface [&>*]:rounded-full",
        className
      )}
      {...props}
    />
  )
)
AvatarGroup.displayName = "AvatarGroup"

// AvatarGroupCount — the "+N" overflow disc that closes a stack. Matches Avatar
// sizing; consumers pass the same `size` used on the group's avatars.
const AvatarGroupCount = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof avatarVariants>>(
  ({ className, size, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        avatarVariants({ size }),
        "items-center justify-center bg-surface-variant text-on-surface-variant",
        className
      )}
      {...props}
    />
  )
)
AvatarGroupCount.displayName = "AvatarGroupCount"

// AvatarBadge — status dot / small indicator anchored to a corner of an Avatar.
// Place inside a `relative` Avatar. `tone` maps to semantic Embassy roles.
const badgeToneMap = {
  online: "bg-success",
  busy: "bg-error",
  away: "bg-warning",
  neutral: "bg-outline",
} as const

interface AvatarBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof badgeToneMap
}

const AvatarBadge = React.forwardRef<HTMLSpanElement, AvatarBadgeProps>(
  ({ className, tone = "online", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "absolute bottom-0 right-0 block size-[28%] min-w-2.5 min-h-2.5 rounded-full ring-2 ring-surface",
        badgeToneMap[tone],
        className
      )}
      {...props}
    />
  )
)
AvatarBadge.displayName = "AvatarBadge"

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarBadge, avatarVariants }
