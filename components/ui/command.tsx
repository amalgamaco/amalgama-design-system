/**
 * Command — a plain filterable list (substring match, not fuzzy search).
 *
 * Cuándo usar: búsqueda-y-ejecución rápida de comandos o navegación, pickers filtrables,
 * y es la base del Combobox. Cuándo no: un select de formulario corto (usar Select);
 * búsqueda de contenido de la página (usar Search). Reemplaza a: menús filtrables hechos a mano.
 *
 * Vanilla implementation: filtering is `.toLowerCase().includes()` against each
 * CommandItem's `value` prop — no fuzzy scoring. Keyboard nav (Arrow/Enter) is driven
 * by a flat, filtered index computed from the registered items.
 */
import * as React from "react"
import { cn } from "../lib/utils"

interface RegisteredItem {
  value: string
  disabled?: boolean
  onSelect?: (value: string) => void
}

interface CommandContextValue {
  query: string
  setQuery: (q: string) => void
  activeIndex: number
  setActiveIndex: (i: number) => void
  register: (item: RegisteredItem) => void
  unregister: (value: string) => void
  visibleValues: string[]
  selectActive: () => void
}

const CommandContext = React.createContext<CommandContextValue | null>(null)

function useCommand() {
  const ctx = React.useContext(CommandContext)
  if (!ctx) throw new Error("Command.* must be used within <Command>")
  return ctx
}

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {}

const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ className, ...props }, ref) => {
    const [query, setQuery] = React.useState("")
    const [activeIndex, setActiveIndex] = React.useState(0)
    const itemsRef = React.useRef<RegisteredItem[]>([])

    const register = React.useCallback((item: RegisteredItem) => {
      const existing = itemsRef.current.findIndex((i) => i.value === item.value)
      if (existing >= 0) itemsRef.current[existing] = item
      else itemsRef.current.push(item)
    }, [])

    const unregister = React.useCallback((value: string) => {
      itemsRef.current = itemsRef.current.filter((i) => i.value !== value)
    }, [])

    const visibleValues = React.useMemo(() => {
      const q = query.trim().toLowerCase()
      return itemsRef.current
        .filter((i) => !i.disabled && (q === "" || i.value.toLowerCase().includes(q)))
        .map((i) => i.value)
      // itemsRef mutates in place; query is the reactive trigger for recomputation
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, itemsRef.current.length])

    const selectActive = React.useCallback(() => {
      const value = visibleValues[activeIndex]
      const item = itemsRef.current.find((i) => i.value === value)
      item?.onSelect?.(value)
    }, [visibleValues, activeIndex])

    React.useEffect(() => {
      if (activeIndex >= visibleValues.length) setActiveIndex(0)
    }, [visibleValues, activeIndex])

    return (
      <CommandContext.Provider
        value={{ query, setQuery, activeIndex, setActiveIndex, register, unregister, visibleValues, selectActive }}
      >
        <div ref={ref} className={cn("command", className)} {...props} />
      </CommandContext.Provider>
    )
  }
)
Command.displayName = "Command"

export interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, onKeyDown, ...props }, ref) => {
    const { query, setQuery, activeIndex, setActiveIndex, visibleValues, selectActive } = useCommand()

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex(Math.min(activeIndex + 1, Math.max(visibleValues.length - 1, 0)))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex(Math.max(activeIndex - 1, 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        selectActive()
      }
      onKeyDown?.(e)
    }

    return (
      <div className="command-input-wrapper" cmdk-input-wrapper="">
        <span className="command-input-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>
        <input
          ref={ref}
          type="text"
          className={cn("command-input", className)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          {...props}
        />
      </div>
    )
  }
)
CommandInput.displayName = "CommandInput"

export interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("command-list", className)} role="listbox" {...props} />
  )
)
CommandList.displayName = "CommandList"

export interface CommandEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(
  ({ className, ...props }, ref) => {
    const { visibleValues } = useCommand()
    if (visibleValues.length > 0) return null
    return <div ref={ref} className={cn("command-empty", className)} {...props} />
  }
)
CommandEmpty.displayName = "CommandEmpty"

export interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode
}

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, heading, children, ...props }, ref) => {
    const { visibleValues } = useCommand()
    // A group is hidden only when every CommandItem child is a value not present
    // in visibleValues — walk children shallowly to check.
    const values = React.Children.toArray(children)
      .filter((c): c is React.ReactElement<{ value?: string }> => React.isValidElement(c))
      .map((c) => c.props.value)
      .filter(Boolean) as string[]
    const anyVisible = values.length === 0 || values.some((v) => visibleValues.includes(v))

    return (
      <div ref={ref} className={cn("command-group", className)} hidden={!anyVisible} {...props}>
        {heading && <div className="command-group-heading">{heading}</div>}
        {children}
      </div>
    )
  }
)
CommandGroup.displayName = "CommandGroup"

const CommandSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("command-separator", className)} role="separator" {...props} />
  )
)
CommandSeparator.displayName = "CommandSeparator"

export interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  disabled?: boolean
  onSelect?: (value: string) => void
}

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, value, disabled, onSelect, children, ...props }, ref) => {
    const { register, unregister, visibleValues, activeIndex } = useCommand()

    React.useEffect(() => {
      register({ value, disabled, onSelect })
      return () => unregister(value)
    }, [value, disabled, onSelect, register, unregister])

    const visibleIndex = visibleValues.indexOf(value)
    const isVisible = visibleIndex >= 0
    const isActive = isVisible && visibleIndex === activeIndex

    return (
      <div
        ref={ref}
        className={cn("command-item", className)}
        role="option"
        aria-selected={isActive}
        aria-disabled={disabled}
        data-active={isActive ? "true" : undefined}
        hidden={!isVisible}
        onClick={() => !disabled && onSelect?.(value)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CommandItem.displayName = "CommandItem"

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("command-shortcut", className)} {...props} />
)
CommandShortcut.displayName = "CommandShortcut"

export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandSeparator, CommandItem, CommandShortcut }
