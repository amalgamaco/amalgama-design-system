/**
 * Command — a command palette / fast filterable list, built on cmdk.
 *
 * Cuándo usar: búsqueda-y-ejecución rápida de comandos o navegación (⌘K), pickers filtrables,
 * y es la base del Combobox. Cuándo no: un select de formulario (usar Select); búsqueda de
 * contenido de la página (usar Search). Reemplaza a: menús filtrables hechos a mano.
 *
 * shadcn Command structure (cmdk), Embassy tokens — item highlight uses the shared "blue hover"
 * menu language; the palette surface is the white Surface container. CommandDialog composes the
 * Embassy Dialog. Canonical implementation.
 */
import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"
import { Dialog, DialogContent } from "./dialog"
import { cn } from "../lib/utils"

export const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-surface-container text-on-surface", className)}
    {...props}
  />
))
Command.displayName = "Command"

export function CommandDialog({ children, ...props }: React.ComponentProps<typeof Dialog>) {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-on-surface-variant [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

export const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b border-border px-3" cmdk-input-wrapper="">
    <Search className="mr-2 size-[18px] shrink-0 text-on-surface-variant opacity-70" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm text-on-surface outline-none placeholder:text-fg-muted disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))
CommandInput.displayName = "CommandInput"

export const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden p-1.5", className)}
    {...props}
  />
))
CommandList.displayName = "CommandList"

export const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm text-on-surface-variant" {...props} />
))
CommandEmpty.displayName = "CommandEmpty"

export const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-on-surface [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-caption [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-on-surface-variant",
      className
    )}
    {...props}
  />
))
CommandGroup.displayName = "CommandGroup"

export const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
))
CommandSeparator.displayName = "CommandSeparator"

export const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      // cmdk drives the highlight via data-[selected]=true (pointer + keyboard). No transition:
      // instant is canonical and avoids the portaled stuck-transparent bug. Shared "blue hover".
      "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm text-on-surface outline-none [&_svg]:size-[18px] [&_svg]:shrink-0 [&_svg]:opacity-70",
      "data-[selected=true]:bg-[var(--color-nav-hover)] data-[selected=true]:text-[var(--color-nav-hover-content)]",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40",
      className
    )}
    {...props}
  />
))
CommandItem.displayName = "CommandItem"

export const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ml-auto text-mono-sm tracking-widest text-on-surface-variant opacity-70", className)} {...props} />
)
CommandShortcut.displayName = "CommandShortcut"
