/**
 * Context Menu — right-click / long-press menu, built on @radix-ui/react-context-menu.
 *
 * Cuándo usar: acciones contextuales sobre un objeto (fila, tarjeta, archivo) invocadas con
 * click derecho / long-press, cuando no hay espacio para un botón visible por cada acción.
 * Cuándo no: acciones que deben ser descubribles siempre (usar Dropdown Menu con trigger visible
 * o botones); navegación (usar Menu/nav). Reemplaza a: menús de click-derecho ad-hoc.
 *
 * shadcn ContextMenu structure, Embassy tokens — shares the exact item language with Dropdown
 * Menu (white Surface container, shared "blue hover", persistent selected fill, no transition on
 * portaled items). Canonical implementation.
 */
import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "../lib/utils"

export const ContextMenu = ContextMenuPrimitive.Root
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger
export const ContextMenuGroup = ContextMenuPrimitive.Group
export const ContextMenuPortal = ContextMenuPrimitive.Portal
export const ContextMenuSub = ContextMenuPrimitive.Sub
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

// Shared item geometry — identical to Dropdown Menu so every menu row in the DS reads the same.
// No transition on the highlight (Radix portaled items get stuck at the transparent start value).
const ITEM_CLASSES = cn(
  "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none [&_svg]:size-[18px] [&_svg]:shrink-0 [&_svg]:opacity-70",
  "focus:bg-[var(--color-nav-hover)] focus:text-[var(--color-nav-hover-content)] data-[highlighted]:bg-[var(--color-nav-hover)] data-[highlighted]:text-[var(--color-nav-hover-content)]",
  "focus-visible:shadow-[inset_0_0_0_2px_var(--color-focus-ring)] active:bg-[var(--color-nav-press)]",
  "data-[state=checked]:bg-[var(--color-nav-selected)] data-[state=checked]:text-[var(--color-nav-selected-content)] data-[state=checked]:font-medium",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-40"
)

const CONTENT_CLASSES = cn(
  "z-50 min-w-[10rem] overflow-hidden rounded-md border border-border bg-surface-container p-1.5 text-on-surface shadow-lg",
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
  "data-[state=open]:duration-fast data-[state=open]:ease-expressive-enter data-[state=closed]:duration-fast data-[state=closed]:ease-exit"
)

export const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(ITEM_CLASSES, "data-[state=open]:bg-[var(--color-nav-hover)]", className)}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto size-4" />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger"

export const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent ref={ref} className={cn(CONTENT_CLASSES, "min-w-[8rem]", className)} {...props} />
))
ContextMenuSubContent.displayName = "ContextMenuSubContent"

export const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content ref={ref} className={cn(CONTENT_CLASSES, className)} {...props} />
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = "ContextMenuContent"

export const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item ref={ref} className={cn(ITEM_CLASSES, inset && "pl-8", className)} {...props} />
))
ContextMenuItem.displayName = "ContextMenuItem"

export const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem ref={ref} checked={checked} className={cn(ITEM_CLASSES, "pl-8", className)} {...props}>
    <span className="absolute left-2 flex size-[18px] items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="size-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem"

export const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem ref={ref} className={cn(ITEM_CLASSES, "pl-8", className)} {...props}>
    <span className="absolute left-2 flex size-[18px] items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="size-2 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = "ContextMenuRadioItem"

export const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn("px-3 py-1.5 text-caption font-medium text-on-surface-variant", inset && "pl-8", className)}
    {...props}
  />
))
ContextMenuLabel.displayName = "ContextMenuLabel"

export const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator ref={ref} className={cn("-mx-1.5 my-1.5 h-px bg-border", className)} {...props} />
))
ContextMenuSeparator.displayName = "ContextMenuSeparator"

export const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ml-auto text-mono-sm tracking-widest text-on-surface-variant opacity-70", className)} {...props} />
)
ContextMenuShortcut.displayName = "ContextMenuShortcut"
