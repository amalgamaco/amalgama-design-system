/**
 * Menubar — a persistent horizontal bar of menus (File / Edit / View …), built on
 * @radix-ui/react-menubar.
 *
 * Cuándo usar: apps tipo escritorio/editor con muchas acciones agrupadas en menús siempre
 * visibles en una barra superior. Cuándo no: navegación entre secciones (usar nav/tabs); una
 * sola lista de acciones (usar Dropdown Menu). Reemplaza a: barras de menú custom.
 *
 * shadcn Menubar structure, Embassy tokens — item language shared with Dropdown/Context Menu
 * (white Surface, blue hover, no transition on portaled items). Canonical implementation.
 */
import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "../lib/utils"

export const MenubarMenu = MenubarPrimitive.Menu
export const MenubarGroup = MenubarPrimitive.Group
export const MenubarPortal = MenubarPrimitive.Portal
export const MenubarSub = MenubarPrimitive.Sub
export const MenubarRadioGroup = MenubarPrimitive.RadioGroup

const ITEM_CLASSES = cn(
  "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none [&_svg]:size-[18px] [&_svg]:shrink-0 [&_svg]:opacity-70",
  "focus:bg-[var(--color-nav-hover)] focus:text-[var(--color-nav-hover-content)] data-[highlighted]:bg-[var(--color-nav-hover)] data-[highlighted]:text-[var(--color-nav-hover-content)]",
  "focus-visible:shadow-[inset_0_0_0_2px_var(--color-focus-ring)] active:bg-[var(--color-nav-press)]",
  "data-[state=checked]:bg-[var(--color-nav-selected)] data-[state=checked]:text-[var(--color-nav-selected-content)] data-[state=checked]:font-medium",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-40"
)

const CONTENT_CLASSES = cn(
  "z-50 min-w-[12rem] overflow-hidden rounded-md border border-border bg-surface-container p-1.5 text-on-surface shadow-lg",
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
  "data-[state=open]:duration-fast data-[state=open]:ease-expressive-enter data-[state=closed]:duration-fast data-[state=closed]:ease-exit"
)

export const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn("flex h-10 items-center gap-1 rounded-md border border-border bg-surface-container p-1", className)}
    {...props}
  />
))
Menubar.displayName = "Menubar"

export const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-pointer select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium text-on-surface outline-none",
      "data-[highlighted]:bg-[var(--color-nav-hover)] data-[highlighted]:text-[var(--color-nav-hover-content)]",
      "data-[state=open]:bg-[var(--color-nav-hover)] data-[state=open]:text-[var(--color-nav-hover-content)]",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = "MenubarTrigger"

export const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(CONTENT_CLASSES, className)}
      {...props}
    />
  </MenubarPrimitive.Portal>
))
MenubarContent.displayName = "MenubarContent"

export const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item ref={ref} className={cn(ITEM_CLASSES, inset && "pl-8", className)} {...props} />
))
MenubarItem.displayName = "MenubarItem"

export const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem ref={ref} checked={checked} className={cn(ITEM_CLASSES, "pl-8", className)} {...props}>
    <span className="absolute left-2 flex size-[18px] items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="size-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = "MenubarCheckboxItem"

export const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem ref={ref} className={cn(ITEM_CLASSES, "pl-8", className)} {...props}>
    <span className="absolute left-2 flex size-[18px] items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="size-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = "MenubarRadioItem"

export const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn("px-3 py-1.5 text-caption font-medium text-on-surface-variant", inset && "pl-8", className)}
    {...props}
  />
))
MenubarLabel.displayName = "MenubarLabel"

export const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator ref={ref} className={cn("-mx-1.5 my-1.5 h-px bg-border", className)} {...props} />
))
MenubarSeparator.displayName = "MenubarSeparator"

export const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ml-auto text-mono-sm tracking-widest text-on-surface-variant opacity-70", className)} {...props} />
)
MenubarShortcut.displayName = "MenubarShortcut"

export const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(ITEM_CLASSES, "data-[state=open]:bg-[var(--color-nav-hover)]", inset && "pl-8", className)}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto size-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = "MenubarSubTrigger"

export const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent ref={ref} className={cn(CONTENT_CLASSES, className)} {...props} />
))
MenubarSubContent.displayName = "MenubarSubContent"
