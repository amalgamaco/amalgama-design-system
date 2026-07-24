import * as React from "react"
import { cn } from "../lib/utils"

type TabsOrientation = "horizontal" | "vertical"

interface TabsContextValue {
  activeTab: string
  setActiveTab: (id: string) => void
  baseId: string
  orientation: TabsOrientation
}

const TabsContext = React.createContext<TabsContextValue>({
  activeTab: "",
  setActiveTab: () => {},
  baseId: "tabs",
  orientation: "horizontal",
})

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string
  /** Prefix used to derive each tab/panel's id pair (tab-<baseId>-<value> / panel-<baseId>-<value>). */
  id?: string
  /** Lays the tab list out as a column with the active border on the right (par shadcn orientation). */
  orientation?: TabsOrientation
}

function Tabs({ defaultValue, id, orientation = "horizontal", children, ...props }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue)
  const baseId = React.useId()
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId: id ?? baseId, orientation }}>
      <div {...props}>{children}</div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `underline` (default, sliding indicator) or `pill` (tonal container, active tab as an elevated surface). */
  variant?: "underline" | "pill"
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant = "underline", children, ...props }, ref) => {
    const { orientation } = React.useContext(TabsContext)
    const listRef = React.useRef<HTMLDivElement | null>(null)
    const [indicator, setIndicator] = React.useState<{ left: number; width: number } | null>(null)

    // The sliding indicator only applies to the horizontal underline variant; the
    // pill and vertical variants use a static active surface/border (indicator is
    // display:none in CSS), so skip measuring for them.
    const hasIndicator = variant === "underline" && orientation === "horizontal"

    const measure = React.useCallback(() => {
      const list = listRef.current
      if (!list) return
      const active = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
      if (!active || active.offsetWidth === 0) return
      setIndicator({ left: active.offsetLeft, width: active.offsetWidth })
    }, [])

    React.useLayoutEffect(() => {
      if (hasIndicator) measure()
    })

    React.useEffect(() => {
      if (!hasIndicator) return
      window.addEventListener("resize", measure)
      return () => window.removeEventListener("resize", measure)
    }, [measure, hasIndicator])

    return (
      <div
        ref={(node) => {
          listRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        role="tablist"
        aria-orientation={orientation}
        className={cn(
          "tabs",
          variant === "pill" && "tabs-pill",
          orientation === "vertical" && "tabs-vertical",
          className
        )}
        {...props}
      >
        {children}
        {hasIndicator && indicator && (
          <span
            className="tab-indicator"
            aria-hidden
            style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
          />
        )}
      </div>
    )
  }
)
TabsList.displayName = "TabsList"

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ className, value, onKeyDown, ...props }, ref) => {
    const { activeTab, setActiveTab, baseId, orientation } = React.useContext(TabsContext)
    const isActive = activeTab === value

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e)
      if (e.defaultPrevented) return
      const list = e.currentTarget.closest('[role="tablist"]')
      if (!list) return
      const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
      const i = tabs.indexOf(e.currentTarget)
      const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight"
      const prevKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft"
      let next = -1
      if (e.key === nextKey) next = (i + 1) % tabs.length
      else if (e.key === prevKey) next = (i - 1 + tabs.length) % tabs.length
      else if (e.key === "Home") next = 0
      else if (e.key === "End") next = tabs.length - 1
      if (next !== -1) {
        e.preventDefault()
        tabs[next].focus()
        tabs[next].click()
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={`tab-${baseId}-${value}`}
        aria-controls={`panel-${baseId}-${value}`}
        aria-selected={isActive}
        tabIndex={isActive ? 0 : -1}
        className={cn("tab", isActive && "active", className)}
        onClick={() => setActiveTab(value)}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  }
)
Tab.displayName = "Tab"

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  ({ className, value, ...props }, ref) => {
    const { activeTab, baseId } = React.useContext(TabsContext)
    const isActive = activeTab === value
    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`panel-${baseId}-${value}`}
        aria-labelledby={`tab-${baseId}-${value}`}
        hidden={!isActive}
        className={cn("tab-panel", isActive && "active", className)}
        {...props}
      />
    )
  }
)
TabPanel.displayName = "TabPanel"

export { Tabs, TabsList, Tab, TabPanel }
