/**
 * Item — "Basic Card" (primitivo de fila de contenido flexible).
 *
 * Cuándo usar: filas ricas y reutilizables (settings rows, resultados, notificaciones
 *   con ícono/avatar + texto + acción), personas en grilla, listas con separadores.
 * Cuándo no: tabla de datos (Table); panel con header/footer (Card).
 * Reemplaza a: divs flex ad-hoc con ícono + texto + botón.
 *
 * Official shadcn/ui component (Item). Canonical composition preserved:
 * Item · ItemGroup · ItemSeparator · ItemMedia · ItemContent · ItemTitle ·
 * ItemDescription · ItemActions · ItemHeader · ItemFooter. `asChild` renders the
 * row as a link/button. Styling is Tailwind mapped to Embassy tokens; decision
 * rule migrated from the (now buildless) css/components/item.css.
 */
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const itemVariants = cva(
  "flex flex-wrap items-center gap-4 p-4 rounded-md border border-transparent text-body-md text-fg transition-[background-color,border-color] duration-fast ease-default focus-visible:outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring)] data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-border",
        muted: "bg-[color-mix(in_srgb,var(--color-surface-variant)_50%,transparent)]",
      },
      size: {
        default: "",
        sm: "gap-[10px] py-3 px-4",
      },
      clickable: {
        true: "cursor-pointer no-underline text-inherit hover:bg-surface-variant",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof itemVariants> {
  /** Render as the child element (e.g. an `<a>`) instead of a `<div>`. */
  asChild?: boolean
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, variant, size, clickable, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    // An <a>/<button> row is inherently clickable — default the interaction styles on.
    const isClickable = clickable ?? asChild
    return (
      <Comp
        ref={ref}
        className={cn(itemVariants({ variant, size, clickable: isClickable }), className)}
        {...props}
      />
    )
  }
)
Item.displayName = "Item"

const ItemGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="list" className={cn("flex flex-col", className)} {...props} />
  )
)
ItemGroup.displayName = "ItemGroup"

const ItemSeparator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => (
    <hr ref={ref} className={cn("h-px border-0 m-0 bg-border", className)} {...props} />
  )
)
ItemSeparator.displayName = "ItemSeparator"

const itemMediaVariants = cva(
  "inline-flex items-center justify-center gap-2 shrink-0 self-start",
  {
    variants: {
      variant: {
        default: "",
        icon: "size-8 rounded-sm border border-border bg-surface-variant text-on-surface-variant [&>svg]:size-4",
        image: "size-10 rounded-sm overflow-hidden [&>img]:size-full [&>img]:object-cover",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface ItemMediaProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof itemMediaVariants> {}

const ItemMedia = React.forwardRef<HTMLDivElement, ItemMediaProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(itemMediaVariants({ variant }), className)} {...props} />
  )
)
ItemMedia.displayName = "ItemMedia"

const ItemContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    // A second contiguous ItemContent doesn't grow (shadcn parity).
    <div ref={ref} className={cn("flex flex-col gap-1 flex-1 min-w-0 [&+&]:flex-none", className)} {...props} />
  )
)
ItemContent.displayName = "ItemContent"

const ItemTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex w-fit items-center gap-2 font-medium text-fg leading-[1.4]", className)} {...props} />
  )
)
ItemTitle.displayName = "ItemTitle"

const ItemDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "text-fg-subtle text-body-sm leading-[1.5] line-clamp-2 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
)
ItemDescription.displayName = "ItemDescription"

const ItemActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("inline-flex items-center gap-2 shrink-0", className)} {...props} />
  )
)
ItemActions.displayName = "ItemActions"

const ItemHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex basis-full items-center justify-between gap-2", className)} {...props} />
  )
)
ItemHeader.displayName = "ItemHeader"

const ItemFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex basis-full items-center justify-between gap-2", className)} {...props} />
  )
)
ItemFooter.displayName = "ItemFooter"

export {
  Item,
  itemVariants,
  ItemGroup,
  ItemSeparator,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemHeader,
  ItemFooter,
}
