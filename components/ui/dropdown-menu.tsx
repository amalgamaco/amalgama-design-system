import * as React from "react"
import { cn } from "../lib/utils"
import { useFlyout, type FlyoutSide, type FlyoutAlign } from "../lib/use-flyout"

interface DropdownMenuContextValue {
  flyout: ReturnType<typeof useFlyout>
  nextIndex: () => number
}
const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null)
function useDropdownMenuContext() {
  const ctx = React.useContext(DropdownMenuContext)
  if (!ctx) throw new Error("DropdownMenu.* must be used within <DropdownMenu>")
  return ctx
}

export interface DropdownMenuProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, onOpenChange }) => {
  const flyout = useFlyout({ onOpenChange })
  const counter = React.useRef(0)
  counter.current = 0 // reset each render; items re-register in DOM order
  const nextIndex = React.useCallback(() => counter.current++, [])
  return (
    <DropdownMenuContext.Provider value={{ flyout, nextIndex }}>{children}</DropdownMenuContext.Provider>
  )
}

const DropdownMenuGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="dropdown-group">{children}</div>
)

interface RadioGroupContextValue {
  value?: string
  onValueChange?: (value: string) => void
}
export const RadioGroupContext = React.createContext<RadioGroupContextValue>({})

const DropdownMenuRadioGroup: React.FC<{
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}> = ({ value, onValueChange, children }) => (
  <RadioGroupContext.Provider value={{ value, onValueChange }}>{children}</RadioGroupContext.Provider>
)

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, onClick, ...props }, ref) => {
    const { flyout } = useDropdownMenuContext()
    return (
      <button
        ref={(el) => {
          flyout.triggerRef.current = el
          if (typeof ref === "function") ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el
        }}
        type="button"
        aria-haspopup="menu"
        aria-expanded={flyout.open}
        className={cn("dropdown-trigger", className)}
        onClick={(e) => {
          onClick?.(e)
          flyout.open ? flyout.close() : flyout.openFromTrigger()
        }}
        {...props}
      />
    )
  }
)
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: FlyoutSide
  align?: FlyoutAlign
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, style, onKeyDown, children, ...props }, ref) => {
    const { flyout } = useDropdownMenuContext()
    if (!flyout.open) return null
    return (
      <div
        ref={(el) => {
          flyout.contentRef.current = el
          if (typeof ref === "function") ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
        }}
        role="menu"
        className={cn("dropdown-content", className)}
        style={{ top: flyout.position.top, left: flyout.position.left, ...style }}
        onKeyDown={(e) => {
          onKeyDown?.(e)
          flyout.onItemsKeyDown(e)
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
DropdownMenuContent.displayName = "DropdownMenuContent"

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean
  variant?: "default" | "danger"
  inset?: boolean
}

function useMenuItemRef(index: number) {
  const { flyout } = useDropdownMenuContext()
  return React.useCallback((el: HTMLButtonElement | null) => flyout.registerItem(el, index), [flyout, index])
}

const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ className, disabled, variant = "default", onClick, children, ...props }, ref) => {
    const { nextIndex, flyout } = useDropdownMenuContext()
    const index = React.useMemo(() => nextIndex(), []) // eslint-disable-line react-hooks/exhaustive-deps
    const itemRef = useMenuItemRef(index)
    return (
      <button
        ref={(el) => {
          itemRef(el)
          if (typeof ref === "function") ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el
        }}
        type="button"
        role="menuitem"
        data-disabled={disabled || undefined}
        data-variant={variant === "danger" ? "danger" : undefined}
        disabled={disabled}
        className={cn("dropdown-item", className)}
        onClick={(e) => {
          onClick?.(e)
          flyout.close()
        }}
        {...props}
      >
        {children}
      </button>
    )
  }
)
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuItemProps & { checked?: boolean; onCheckedChange?: (checked: boolean) => void }
>(({ className, checked, onCheckedChange, children, ...props }, ref) => (
  <DropdownMenuItem
    ref={ref}
    className={className}
    onClick={() => onCheckedChange?.(!checked)}
    {...props}
  >
    <span className="dropdown-item-indicator">{checked ? "✓" : ""}</span>
    {children}
  </DropdownMenuItem>
))
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

const DropdownMenuRadioItem = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuItemProps & { value: string }
>(({ className, value, children, ...props }, ref) => {
  const { value: groupValue, onValueChange } = React.useContext(RadioGroupContext)
  return (
    <DropdownMenuItem ref={ref} className={className} onClick={() => onValueChange?.(value)} {...props}>
      <span className="dropdown-item-indicator">{groupValue === value ? "●" : ""}</span>
      {children}
    </DropdownMenuItem>
  )
})
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("dropdown-label", className)} {...props} />
)
DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="separator" className={cn("dropdown-separator", className)} {...props} />
  )
)
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("dropdown-shortcut", className)} {...props} />
)

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
}
