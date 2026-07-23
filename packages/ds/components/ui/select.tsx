/**
 * Select — campo de selección de formulario (select). Parte de la familia Form (input / select / textarea).
 *
 * Cuándo usar: todo campo de entrada — input, select, textarea, number, date — con label, hint y error.
 * Cuándo no: búsqueda (usar `SearchField` de toolbar.tsx en desktop, `SearchBar` de search.tsx en mobile).
 * Reemplaza a: cualquier form control legacy; nunca inventar campos custom.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/form.css (shared across input/select/textarea).
 */
import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "../lib/utils"

// shadcn Select (Radix) — trigger mirrors Embassy `.field-input`; content uses
// the popover surface tokens.
export const Select = SelectPrimitive.Root
export const SelectValue = SelectPrimitive.Value
export const SelectGroup = SelectPrimitive.Group

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between rounded-md border border-border bg-[var(--card-bg)] px-3.5 py-2.5 text-[13.5px] text-[var(--text-primary)] outline-none transition-[border-color,box-shadow] duration-fast ease-default data-[placeholder]:text-[var(--text-muted)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 shrink-0 text-[var(--text-muted)]" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = "SelectTrigger"

export const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1 text-on-surface-variant", className)}
    {...props}
  >
    <ChevronUp className="size-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = "SelectScrollUpButton"

export const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1 text-on-surface-variant", className)}
    {...props}
  >
    <ChevronDown className="size-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = "SelectScrollDownButton"

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        // Surface token (white in light, lifted #1C202C in dark) — shadcn's `bg-popover`. The menu
        // reads light/clean; emphasis comes from the hover + selected item states, not a grey fill.
        // Depth is carried by the border + shadow (shadow now dark-mode-visible), not the container color.
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-border bg-surface-container text-on-surface shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
        "data-[state=open]:duration-fast data-[state=open]:ease-expressive-enter data-[state=closed]:duration-fast data-[state=closed]:ease-exit",
        position === "popper" && "data-[side=bottom]:translate-y-1",
        className
      )}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn("p-1.5", position === "popper" && "w-full min-w-[var(--radix-select-trigger-width)]")}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = "SelectContent"

export const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-3 py-1.5 text-caption font-medium text-on-surface-variant", className)}
    {...props}
  />
))
SelectLabel.displayName = "SelectLabel"

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      // Base geometry — check indicator on the right (pr-8), the canonical Radix/shadcn Select layout.
      // NO transition on the highlight: shadcn Select items highlight instantly, and a
      // background-color transition here gets stuck at its transparent start value on Radix's
      // portaled items (the fill only appeared after a real repaint), so the selected/hover
      // states didn't render on open. Instant = canonical AND correct.
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-3 pr-8 text-sm outline-none",
      // Selected value — persistent Embassy selected-state fill (Secondary-container), same token as
      // Dropdown Menu's checked items. The check indicator still marks it; this gives the chosen row
      // a clear resting emphasis against the now-white surface.
      "data-[state=checked]:bg-[var(--color-nav-selected)] data-[state=checked]:text-[var(--color-nav-selected-content)] data-[state=checked]:font-medium",
      // Highlight is Radix's data-[highlighted] — it fires on BOTH pointer hover and keyboard roving,
      // which is the canonical shadcn Select interaction (the previous focus:bg-surface-variant only
      // reacted to DOM focus, so hover did nothing). Uses the shared Embassy "blue hover" menu tokens
      // (identical to Dropdown Menu / List / Menu) instead of a one-off grey; focus: kept as a fallback.
      "data-[highlighted]:bg-[var(--color-nav-hover)] data-[highlighted]:text-[var(--color-nav-hover-content)] focus:bg-[var(--color-nav-hover)] focus:text-[var(--color-nav-hover-content)]",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <span className="absolute right-2 flex size-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
))
SelectItem.displayName = "SelectItem"

export const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-outline-variant", className)}
    {...props}
  />
))
SelectSeparator.displayName = "SelectSeparator"
