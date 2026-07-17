import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

/**
 * Navigation Menu: horizontal row of nav triggers revealing rich content
 * panels, with hover-intent (small open/close delay) and a Tabs-style
 * sliding indicator under the active trigger. Simplification vs. Radix: the
 * viewport re-measures instantly on content swap rather than animating
 * between two different panel heights.
 */

const OPEN_DELAY = 150
const CLOSE_DELAY = 200

interface NavMenuContextValue {
  activeIndex: number | null
  scheduleOpen: (index: number) => void
  scheduleClose: () => void
  cancelClose: () => void
  registerTrigger: (el: HTMLElement | null, index: number) => void
  nextIndex: () => number
  listRef: React.RefObject<HTMLDivElement>
}
const NavMenuContext = React.createContext<NavMenuContextValue | null>(null)
function useNavMenuContext() {
  const ctx = React.useContext(NavMenuContext)
  if (!ctx) throw new Error("NavigationMenu.* must be used within <NavigationMenu>")
  return ctx
}

const NavigationMenu = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }>(
  ({ className, children, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
    const openTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
    const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
    const triggersRef = React.useRef<(HTMLElement | null)[]>([])
    const counter = React.useRef(0)
    const listRef = React.useRef<HTMLDivElement>(null)

    const scheduleOpen = React.useCallback((index: number) => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
      if (openTimer.current) clearTimeout(openTimer.current)
      openTimer.current = setTimeout(() => setActiveIndex(index), OPEN_DELAY)
    }, [])
    const scheduleClose = React.useCallback(() => {
      if (openTimer.current) clearTimeout(openTimer.current)
      closeTimer.current = setTimeout(() => setActiveIndex(null), CLOSE_DELAY)
    }, [])
    const cancelClose = React.useCallback(() => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }, [])
    const registerTrigger = React.useCallback((el: HTMLElement | null, index: number) => {
      triggersRef.current[index] = el
    }, [])
    const nextIndex = React.useCallback(() => counter.current++, [])

    React.useEffect(() => {
      function onDocKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") setActiveIndex(null)
      }
      document.addEventListener("keydown", onDocKeyDown)
      return () => document.removeEventListener("keydown", onDocKeyDown)
    }, [])

    counter.current = 0 // items re-register/count each render, in DOM order

    return (
      <NavMenuContext.Provider
        value={{ activeIndex, scheduleOpen, scheduleClose, cancelClose, registerTrigger, nextIndex, listRef }}
      >
        <nav ref={ref} className={cn("nav-menu", className)} {...props}>
          {children}
        </nav>
      </NavMenuContext.Provider>
    )
  }
)
NavigationMenu.displayName = "NavigationMenu"

const NavigationMenuList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { listRef } = useNavMenuContext()
    return (
      <div
        ref={(el) => {
          ;(listRef as React.MutableRefObject<HTMLDivElement | null>).current = el
          if (typeof ref === "function") ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
        }}
        className={cn("nav-menu-list", className)}
        {...props}
      >
        {children}
        <NavigationMenuIndicator />
      </div>
    )
  }
)
NavigationMenuList.displayName = "NavigationMenuList"

interface NavItemContextValue {
  index: number
}
const NavItemContext = React.createContext<NavItemContextValue | null>(null)

const NavigationMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    const { nextIndex } = useNavMenuContext()
    const index = React.useMemo(() => nextIndex(), []) // eslint-disable-line react-hooks/exhaustive-deps
    return (
      <NavItemContext.Provider value={{ index }}>
        <div ref={ref} {...props}>
          {children}
        </div>
      </NavItemContext.Provider>
    )
  }
)
NavigationMenuItem.displayName = "NavigationMenuItem"

function useNavItemIndex() {
  const ctx = React.useContext(NavItemContext)
  if (!ctx) throw new Error("Must be used within <NavigationMenuItem>")
  return ctx.index
}

const navigationMenuTriggerStyle = cva("nav-menu-trigger")

const NavigationMenuTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const { activeIndex, scheduleOpen, scheduleClose, registerTrigger } = useNavMenuContext()
    const index = useNavItemIndex()
    const isOpen = activeIndex === index
    return (
      <button
        ref={(el) => {
          registerTrigger(el, index)
          if (typeof ref === "function") ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el
        }}
        type="button"
        data-state={isOpen ? "open" : "closed"}
        className={cn(navigationMenuTriggerStyle(), className)}
        onMouseEnter={() => scheduleOpen(index)}
        onMouseLeave={() => scheduleClose()}
        onClick={() => scheduleOpen(index)}
        {...props}
      >
        {children}
        <svg className="nav-menu-trigger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    )
  }
)
NavigationMenuTrigger.displayName = "NavigationMenuTrigger"

const NavigationMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, onMouseEnter, onMouseLeave, children, ...props }, ref) => {
    const { activeIndex, cancelClose, scheduleClose } = useNavMenuContext()
    const index = useNavItemIndex()
    if (activeIndex !== index) return null
    return (
      <div className="nav-menu-viewport-wrap">
        <div
          ref={ref}
          className={cn("nav-menu-viewport", className)}
          onMouseEnter={(e) => {
            onMouseEnter?.(e)
            cancelClose()
          }}
          onMouseLeave={(e) => {
            onMouseLeave?.(e)
            scheduleClose()
          }}
        >
          <div className="nav-menu-content" {...props}>
            {children}
          </div>
        </div>
      </div>
    )
  }
)
NavigationMenuContent.displayName = "NavigationMenuContent"

interface NavigationMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  title?: string
  description?: string
}
const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  ({ className, title, description, children, ...props }, ref) => (
    <a ref={ref} className={cn("nav-menu-link", className)} {...props}>
      {title ? <span className="nav-menu-link-title">{title}</span> : children}
      {description ? <span className="nav-menu-link-desc">{description}</span> : null}
    </a>
  )
)
NavigationMenuLink.displayName = "NavigationMenuLink"

const NavigationMenuIndicator = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    const { activeIndex, listRef } = useNavMenuContext()
    const spanRef = React.useRef<HTMLSpanElement>(null)

    React.useEffect(() => {
      const list = listRef.current
      const span = spanRef.current
      if (!list || !span) return
      if (activeIndex === null) {
        span.style.opacity = "0"
        return
      }
      const trigger = list.querySelectorAll<HTMLElement>(".nav-menu-trigger")[activeIndex]
      if (!trigger) return
      span.style.opacity = "1"
      span.style.transform = `translateX(${trigger.offsetLeft}px)`
      span.style.width = `${trigger.offsetWidth}px`
    }, [activeIndex, listRef])

    return (
      <span
        ref={(el) => {
          ;(spanRef as React.MutableRefObject<HTMLSpanElement | null>).current = el
          if (typeof ref === "function") ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = el
        }}
        data-visible={activeIndex !== null}
        className={cn("nav-menu-indicator", className)}
        {...props}
      />
    )
  }
)
NavigationMenuIndicator.displayName = "NavigationMenuIndicator"

/** Kept for API parity with the current version; NavigationMenuContent already
 *  renders its own viewport wrapper per-item (see simplification note above),
 *  so this is a no-op passthrough rather than a second shared container. */
const NavigationMenuViewport: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
