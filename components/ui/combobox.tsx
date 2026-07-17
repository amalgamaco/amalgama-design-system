/**
 * Combobox — a filterable single-select: a Button trigger opening a searchable Command
 * list in an absolutely-positioned panel (no Popover primitive; simple anchor + outside-click).
 *
 * Cuándo usar: elegir 1 opción de una lista larga donde hace falta buscar/filtrar (país,
 * usuario, repo). Cuándo no: listas cortas sin búsqueda (usar Select); multi-select con
 * tags (usar Chips + Command). Reemplaza a: selects con búsqueda hechos a mano.
 */
import * as React from "react"
import { cn } from "../lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command"

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
  const rootRef = React.useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  React.useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className={cn("combobox", className)}>
      <button
        type="button"
        className={cn("btn-tertiary", "combobox-trigger", !selected && "is-placeholder")}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel ?? (selected ? undefined : placeholder)}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
      >
        {selected ? selected.label : placeholder}
        <span className="combobox-chevron" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="combobox-panel">
          <Command>
            <CommandInput placeholder={searchPlaceholder} autoFocus />
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
                    <span className={cn("combobox-check", value === option.value && "is-selected")} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}
