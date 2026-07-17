import * as React from "react"
import { cn } from "../lib/utils"

interface TabsContextValue {
  activeTab: string
  setActiveTab: (id: string) => void
  baseId: string
}

const TabsContext = React.createContext<TabsContextValue>({
  activeTab: "",
  setActiveTab: () => {},
  baseId: "tabs",
})

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string
  /** Prefix used to derive each tab/panel's id pair (tab-<baseId>-<value> / panel-<baseId>-<value>). */
  id?: string
}

function Tabs({ defaultValue, id, children, ...props }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue)
  const baseId = React.useId()
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId: id ?? baseId }}>
      <div {...props}>{children}</div>
    </TabsContext.Provider>
  )
}

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const listRef = React.useRef<HTMLDivElement | null>(null)
    const [indicator, setIndicator] = React.useState<{ left: number; width: number } | null>(null)

    const measure = React.useCallback(() => {
      const list = listRef.current
      if (!list) return
      const active = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
      if (!active || active.offsetWidth === 0) return
      setIndicator({ left: active.offsetLeft, width: active.offsetWidth })
    }, [])

    React.useLayoutEffect(() => {
      measure()
    })

    React.useEffect(() => {
      window.addEventListener("resize", measure)
      return () => window.removeEventListener("resize", measure)
    }, [measure])

    return (
      <div
        ref={(node) => {
          listRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        role="tablist"
        className={cn("tabs", className)}
        {...props}
      >
        {children}
        {indicator && (
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
    const { activeTab, setActiveTab, baseId } = React.useContext(TabsContext)
    const isActive = activeTab === value

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e)
      if (e.defaultPrevented) return
      const list = e.currentTarget.closest('[role="tablist"]')
      if (!list) return
      const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
      const i = tabs.indexOf(e.currentTarget)
      let next = -1
      if (e.key === "ArrowRight") next = (i + 1) % tabs.length
      else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length
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
