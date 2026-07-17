import * as React from "react"
import { cn } from "../lib/utils"
import { useFlyout } from "../lib/use-flyout"
import {
  DropdownMenuRadioGroup as MenuRadioGroup,
  DropdownMenuLabel as MenuLabelBase,
  DropdownMenuSeparator as MenuSeparatorBase,
  DropdownMenuShortcut as MenuShortcutBase,
  DropdownMenuGroup as MenuGroupBase,
  RadioGroupContext,
} from "./dropdown-menu"

/**
 * Context Menu reuses Dropdown Menu's `.dropdown-*` CSS and its
 * context-free parts (Label/Separator/Shortcut/Group/RadioGroup verbatim).
 * CheckboxItem/RadioItem are re-declared locally on top of ContextMenuItem
 * (not imported from dropdown-menu.tsx) because Dropdown's versions reach
 * into DropdownMenuContext, which doesn't exist inside a ContextMenu tree.
 * The only real behavioral difference from Dropdown Menu: it opens at the
 * cursor's coordinates on a `contextmenu` event instead of below a trigger
 * button on click. Simplification vs. Radix: no nested submenus.
 */

interface ContextMenuContextValue {
  flyout: ReturnType<typeof useFlyout>
  nextIndex: () => number
}
const ContextMenuContext = React.createContext<ContextMenuContextValue | null>(null)
function useContextMenuContext() {
  const ctx = React.useContext(ContextMenuContext)
  if (!ctx) throw new Error("ContextMenu.* must be used within <ContextMenu>")
  return ctx
}

const ContextMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const flyout = useFlyout()
  const counter = React.useRef(0)
  counter.current = 0
  const nextIndex = React.useCallback(() => counter.current++, [])
  return <ContextMenuContext.Provider value={{ flyout, nextIndex }}>{children}</ContextMenuContext.Provider>
}

const ContextMenuTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, onContextMenu, children, ...props }, ref) => {
    const { flyout } = useContextMenuContext()
    return (
      <div
        ref={(el) => {
          flyout.triggerRef.current = el
          if (typeof ref === "function") ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
        }}
        className={cn("context-menu-trigger", className)}
        onContextMenu={(e) => {
          e.preventDefault()
          onContextMenu?.(e)
          flyout.openAt({ top: e.clientY, left: e.clientX })
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ContextMenuTrigger.displayName = "ContextMenuTrigger"

const ContextMenuGroup = MenuGroupBase
const ContextMenuRadioGroup = MenuRadioGroup

const ContextMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, onKeyDown, children, ...props }, ref) => {
    const { flyout } = useContextMenuContext()
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
ContextMenuContent.displayName = "ContextMenuContent"

interface ContextMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean
  variant?: "default" | "danger"
}

const ContextMenuItem = React.forwardRef<HTMLButtonElement, ContextMenuItemProps>(
  ({ onClick, ...props }, ref) => {
    const { nextIndex, flyout } = useContextMenuContext()
    const index = React.useMemo(() => nextIndex(), []) // eslint-disable-line react-hooks/exhaustive-deps
    return (
      <MenuItemBase
        ref={(el) => {
          flyout.registerItem(el, index)
          if (typeof ref === "function") ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el
        }}
        onClick={(e) => {
          onClick?.(e)
          flyout.close()
        }}
        {...props}
      />
    )
  }
)
ContextMenuItem.displayName = "ContextMenuItem"

const ContextMenuCheckboxItem = React.forwardRef<
  HTMLButtonElement,
  ContextMenuItemProps & { checked?: boolean; onCheckedChange?: (checked: boolean) => void }
>(({ checked, onCheckedChange, children, ...props }, ref) => (
  <ContextMenuItem ref={ref} onClick={() => onCheckedChange?.(!checked)} {...props}>
    <span className="dropdown-item-indicator">{checked ? "✓" : ""}</span>
    {children}
  </ContextMenuItem>
))
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem"

const ContextMenuRadioItem = React.forwardRef<HTMLButtonElement, ContextMenuItemProps & { value: string }>(
  ({ value, children, ...props }, ref) => {
    const { value: groupValue, onValueChange } = React.useContext(RadioGroupContext)
    return (
      <ContextMenuItem ref={ref} onClick={() => onValueChange?.(value)} {...props}>
        <span className="dropdown-item-indicator">{groupValue === value ? "●" : ""}</span>
        {children}
      </ContextMenuItem>
    )
  }
)
ContextMenuRadioItem.displayName = "ContextMenuRadioItem"
const ContextMenuLabel = MenuLabelBase
const ContextMenuSeparator = MenuSeparatorBase
const ContextMenuShortcut = MenuShortcutBase

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuGroup,
  ContextMenuRadioGroup,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
}
