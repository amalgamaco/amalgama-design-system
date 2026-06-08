import * as React from "react"
import { cn } from "../lib/utils"

interface TabsContextValue {
  activeTab: string
  setActiveTab: (id: string) => void
}

const TabsContext = React.createContext<TabsContextValue>({
  activeTab: "",
  setActiveTab: () => {},
})

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string
}

function Tabs({ defaultValue, children, ...props }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue)
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div {...props}>{children}</div>
    </TabsContext.Provider>
  )
}

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("tabs", className)} {...props} />
))
TabsList.displayName = "TabsList"

export interface TabProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const Tab = React.forwardRef<HTMLDivElement, TabProps>(
  ({ className, value, ...props }, ref) => {
    const { activeTab, setActiveTab } = React.useContext(TabsContext)
    return (
      <div
        ref={ref}
        className={cn("tab", activeTab === value && "active", className)}
        onClick={() => setActiveTab(value)}
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
    const { activeTab } = React.useContext(TabsContext)
    return (
      <div
        ref={ref}
        className={cn("tab-panel", activeTab === value && "active", className)}
        {...props}
      />
    )
  }
)
TabPanel.displayName = "TabPanel"

export { Tabs, TabsList, Tab, TabPanel }
