import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "../lib/utils"

// shadcn DropdownMenu (Radix) — Embassy popover surface + on-surface tokens.
export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuGroup = DropdownMenuPrimitive.Group
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup
export const DropdownMenuSub = DropdownMenuPrimitive.Sub

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        // Surface token (white in light, lifted #1C202C in dark) — shadcn's `bg-popover`, same as Select.
        // The menu reads light/clean; emphasis comes from hover + selected item states, not a grey fill.
        "z-50 min-w-[10rem] overflow-hidden rounded-md border border-border bg-surface-container p-1.5 text-on-surface shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "data-[state=open]:duration-fast data-[state=open]:ease-expressive-enter data-[state=closed]:duration-fast data-[state=closed]:ease-exit",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = "DropdownMenuContent"

// Item base — DS navigation item geometry: 8px radius, 8px gap, 18px icons at .7 opacity.
// Shared by Item/CheckboxItem/RadioItem/SubTrigger so every row in the menu reads identically.
const ITEM_CLASSES = cn(
  // NO transition on the highlight: on Radix's portaled items a background-color transition can stick at
  // its transparent start value (the fill only paints after a real repaint), so states didn't render on
  // open. Instant is canonical shadcn AND correct — same fix applied to Select.
  "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none [&_svg]:size-[18px] [&_svg]:shrink-0 [&_svg]:opacity-70",
  // Hover / keyboard highlight — shared Embassy "blue hover": soft secondary tint + blue label/icon (weaker than selected).
  "focus:bg-[var(--color-nav-hover)] focus:text-[var(--color-nav-hover-content)] data-[highlighted]:bg-[var(--color-nav-hover)] data-[highlighted]:text-[var(--color-nav-hover-content)]",
  // Keyboard focus — its own ring; Pressed — stronger secondary tint (transient, still < selected fill).
  "focus-visible:shadow-[inset_0_0_0_2px_var(--color-focus-ring)] active:bg-[var(--color-nav-press)]",
  // Selected (checkbox/radio menu items) — secondary-container fill + on-secondary-container label/icon, bolder (like nav .active).
  "data-[state=checked]:bg-[var(--color-nav-selected)] data-[state=checked]:text-[var(--color-nav-selected-content)] data-[state=checked]:font-medium",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-40"
)

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item ref={ref} className={cn(ITEM_CLASSES, className)} {...props} />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    checked={checked}
    className={cn(ITEM_CLASSES, "pl-8", className)}
    {...props}
  >
    <span className="absolute left-2 flex size-[18px] items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="size-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

export const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem ref={ref} className={cn(ITEM_CLASSES, "pl-8", className)} {...props}>
    <span className="absolute left-2 flex size-[18px] items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="size-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

export const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-3 py-1.5 text-caption font-medium text-on-surface-variant", className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn("-mx-1.5 my-1.5 h-px bg-border", className)} {...props} />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

export const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ml-auto text-mono-sm tracking-widest text-on-surface-variant opacity-70", className)} {...props} />
)
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger ref={ref} className={cn(ITEM_CLASSES, "data-[state=open]:bg-[var(--color-nav-hover)]", className)} {...props}>
    {children}
    <ChevronRight className="ml-auto size-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger"

export const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-surface-container p-1.5 text-on-surface shadow-lg",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
      "data-[state=open]:duration-fast data-[state=open]:ease-expressive-enter data-[state=closed]:duration-fast data-[state=closed]:ease-exit",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName = "DropdownMenuSubContent"
