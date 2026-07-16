/**
 * Combobox — a filterable single-select: a Button trigger opening a searchable Command list
 * inside a Popover. This is the composition shadcn documents (Popover + Command), exported here
 * as a first-class, controllable component.
 *
 * Cuándo usar: elegir 1 opción de una lista larga donde hace falta buscar/filtrar (país, usuario,
 * repo). Cuándo no: listas cortas sin búsqueda (usar Select); multi-select con tags (usar Chips +
 * Command). Reemplaza a: selects con búsqueda hechos a mano.
 */
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "./button"
import { Popover, PopoverTrigger, PopoverContent } from "./popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command"
import { cn } from "../lib/utils"

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  "aria-label"?: string
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Seleccionar…",
  searchPlaceholder = "Buscar…",
  emptyText = "Sin resultados.",
  disabled,
  className,
  "aria-label": ariaLabel,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const selected = options.find((o) => o.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="tertiary"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel ?? (selected ? undefined : placeholder)}
          disabled={disabled}
          className={cn("w-[240px] justify-between font-normal", !selected && "text-[var(--text-muted)]", className)}
        >
          {selected ? selected.label : placeholder}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  disabled={option.disabled}
                  onSelect={() => {
                    onChange?.(option.value === value ? "" : option.value)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-1 size-4", value === option.value ? "opacity-100" : "opacity-0")} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
