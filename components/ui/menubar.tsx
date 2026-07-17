import * as React from "react"
import { cn } from "../lib/utils"
import { useFlyout } from "../lib/use-flyout"
import {
  DropdownMenuLabel as MenuLabelBase,
  DropdownMenuSeparator as MenuSeparatorBase,
  DropdownMenuShortcut as MenuShortcutBase,
  DropdownMenuGroup as MenuGroupBase,
  DropdownMenuRadioGroup as MenuRadioGroup,
  RadioGroupContext,
} from "./dropdown-menu"

/**
 * Menubar: a horizontal row of top-level triggers, each opening a Dropdown
 * Menu-shaped panel (reuses `.dropdown-*` CSS/items). Simplification vs.
 * Radix: no nested Sub menus. Behavior: once one menu is open, hovering a
 * sibling trigger switches to it; ←/→ move focus between top-level triggers.
 */

interface MenubarContextValue {
  openIndex: number | null
  setOpenIndex: (i: number | null) => void
  registerTrigger: (el: HTMLButtonElement | null, index: number) => void
  triggerCount: React.MutableRefObject<number>
}
const MenubarContext = React.createContext<MenubarContextValue | null>(null)
function useMenubarContext() {
  const ctx = React.useContext(MenubarContext)
  if (!ctx) throw new Error("Menubar.* must be used within <Menubar>")
  return ctx
}

const Menubar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, onKeyDown, ...props }, ref) => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(null)
    const triggersRef = React.useRef<(HTMLButtonElement | null)[]>([])
    const triggerCount = React.useRef(0)
    const registerTrigger = React.useCallback((el: HTMLButtonElement | null, index: number) => {
      triggersRef.current[index] = el
    }, [])

    return (
      <MenubarContext.Provider value={{ openIndex, setOpenIndex, registerTrigger, triggerCount }}>
        <div
          ref={ref}
          role="menubar"
          className={cn("menubar", className)}
          onKeyDown={(e) => {
            onKeyDown?.(e)
            const triggers = triggersRef.current.filter((el): el is HTMLButtonElement => !!el)
            const current = triggers.findIndex((el) => el === document.activeElement)
            if (e.key === "ArrowRight") {
              e.preventDefault()
              const next = triggers[(current + 1) % triggers.length]
              next?.focus()
            } else if (e.key === "ArrowLeft") {
              e.preventDefault()
              const prev = triggers[(current - 1 + triggers.length) % triggers.length]
              prev?.focus()
            }
          }}
          {...props}
        />
      </MenubarContext.Provider>
    )
  }
)
Menubar.displayName = "Menubar"

const MenubarGroup = MenuGroupBase
const MenubarRadioGroup = MenuRadioGroup

interface MenubarMenuContextValue {
  flyout: ReturnType<typeof useFlyout>
  index: number
  nextItemIndex: () => number
}
const MenubarMenuContext = React.createContext<MenubarMenuContextValue | null>(null)
function useMenubarMenuContext() {
  const ctx = React.useContext(MenubarMenuContext)
  if (!ctx) throw new Error("MenubarMenu.* must be used within <MenubarMenu>")
  return ctx
}

const MenubarMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { openIndex, setOpenIndex, triggerCount } = useMenubarContext()
  const index = React.useMemo(() => triggerCount.current++, []) // eslint-disable-line react-hooks/exhaustive-deps
  const isOpen = openIndex === index
  const flyout = useFlyout({
    onOpenChange: (open) => setOpenIndex(open ? index : null),
  })
  // Defer to the Menubar's shared openIndex as the source of truth.
  React.useEffect(() => {
    if (isOpen && !flyout.open) flyout.openFromTrigger()
    if (!isOpen && flyout.open) flyout.close()
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps
  const itemCounter = React.useRef(0)
  itemCounter.current = 0
  const nextItemIndex = React.useCallback(() => itemCounter.current++, [])
  return (
    <MenubarMenuContext.Provider value={{ flyout, index, nextItemIndex }}>{children}</MenubarMenuContext.Provider>
  )
}

const MenubarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, onClick, onMouseEnter, ...props }, ref) => {
    const { openIndex, setOpenIndex, registerTrigger } = useMenubarContext()
    const { flyout, index } = useMenubarMenuContext()
    const isOpen = openIndex === index
    return (
      <button
        ref={(el) => {
          flyout.triggerRef.current = el
          registerTrigger(el, index)
          if (typeof ref === "function") ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el
        }}
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        data-state={isOpen ? "open" : "closed"}
        className={cn("menubar-trigger", className)}
        onClick={(e) => {
          onClick?.(e)
          setOpenIndex(isOpen ? null : index)
        }}
        onMouseEnter={(e) => {
          onMouseEnter?.(e)
          // Hover-to-switch: only takes effect once some menu is already open.
          if (openIndex !== null && openIndex !== index) setOpenIndex(index)
        }}
        {...props}
      />
    )
  }
)
MenubarTrigger.displayName = "MenubarTrigger"

const MenubarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, onKeyDown, children, ...props }, ref) => {
    const { flyout } = useMenubarMenuContext()
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
MenubarContent.displayName = "MenubarContent"

interface MenubarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean
  variant?: "default" | "danger"
}

const MenubarItem = React.forwardRef<HTMLButtonElement, MenubarItemProps>(
  ({ className, disabled, variant = "default", onClick, ...props }, ref) => {
    const { nextItemIndex, flyout } = useMenubarMenuContext()
    const index = React.useMemo(() => nextItemIndex(), []) // eslint-disable-line react-hooks/exhaustive-deps
    return (
      <button
        ref={(el) => {
          flyout.registerItem(el, index)
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
      />
    )
  }
)
MenubarItem.displayName = "MenubarItem"

const MenubarCheckboxItem = React.forwardRef<
  HTMLButtonElement,
  MenubarItemProps & { checked?: boolean; onCheckedChange?: (checked: boolean) => void }
>(({ checked, onCheckedChange, children, ...props }, ref) => (
  <MenubarItem ref={ref} onClick={() => onCheckedChange?.(!checked)} {...props}>
    <span className="dropdown-item-indicator">{checked ? "✓" : ""}</span>
    {children}
  </MenubarItem>
))
MenubarCheckboxItem.displayName = "MenubarCheckboxItem"

const MenubarRadioItem = React.forwardRef<HTMLButtonElement, MenubarItemProps & { value: string }>(
  ({ value, children, ...props }, ref) => {
    const { value: groupValue, onValueChange } = React.useContext(RadioGroupContext)
    return (
      <MenubarItem ref={ref} onClick={() => onValueChange?.(value)} {...props}>
        <span className="dropdown-item-indicator">{groupValue === value ? "●" : ""}</span>
        {children}
      </MenubarItem>
    )
  }
)
MenubarRadioItem.displayName = "MenubarRadioItem"

const MenubarLabel = MenuLabelBase
const MenubarSeparator = MenuSeparatorBase
const MenubarShortcut = MenuShortcutBase

export {
  Menubar,
  MenubarMenu,
  MenubarGroup,
  MenubarRadioGroup,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
}
