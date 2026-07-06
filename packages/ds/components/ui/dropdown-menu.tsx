import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cn } from "../lib/utils"

// shadcn DropdownMenu (Radix) — Embassy popover surface + on-surface tokens.
export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[10rem] overflow-hidden rounded-md border border-border bg-surface-container-high p-1.5 text-on-surface shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "data-[state=open]:duration-fast data-[state=open]:ease-expressive-enter data-[state=closed]:duration-fast data-[state=closed]:ease-exit",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = "DropdownMenuContent"

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      // Item base — DS navigation item geometry: 8px radius, 8px gap, 18px icons at .7 opacity.
      "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors duration-fast ease-default [&_svg]:size-[18px] [&_svg]:shrink-0 [&_svg]:opacity-70",
      // Hover / keyboard highlight — shared Embassy "blue hover": soft secondary tint + blue label/icon (weaker than selected).
      "focus:bg-[var(--color-nav-hover)] focus:text-[var(--color-nav-hover-content)] data-[highlighted]:bg-[var(--color-nav-hover)] data-[highlighted]:text-[var(--color-nav-hover-content)]",
      // Keyboard focus — its own ring; Pressed — stronger secondary tint (transient, still < selected fill).
      "focus-visible:shadow-[inset_0_0_0_2px_var(--color-focus-ring)] active:bg-[var(--color-nav-press)]",
      // Selected (checkbox/radio menu items) — secondary-container fill + on-secondary-container label/icon, bolder (like nav .active).
      "data-[state=checked]:bg-[var(--color-nav-selected)] data-[state=checked]:text-[var(--color-nav-selected-content)] data-[state=checked]:font-medium",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn("-mx-1.5 my-1.5 h-px bg-border", className)} {...props} />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"
