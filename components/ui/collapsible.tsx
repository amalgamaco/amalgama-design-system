import * as React from "react"
import { cn } from "../lib/utils"

interface CollapsibleContextValue {
  open: boolean
  toggle: () => void
}

const CollapsibleContext = React.createContext<CollapsibleContextValue>({
  open: false,
  toggle: () => {},
})

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function Collapsible({ defaultOpen, open: controlledOpen, onOpenChange, className, children, ...props }: CollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(!!defaultOpen)
  const open = controlledOpen ?? uncontrolledOpen
  const toggle = React.useCallback(() => {
    const next = !open
    if (controlledOpen === undefined) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }, [open, controlledOpen, onOpenChange])

  return (
    <CollapsibleContext.Provider value={{ open, toggle }}>
      <div className={className} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
}

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { open, toggle } = React.useContext(CollapsibleContext)
    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={open}
        className={cn("collapsible-trigger", className)}
        onClick={toggle}
        {...props}
      />
    )
  }
)
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open } = React.useContext(CollapsibleContext)
    return (
      <div ref={ref} data-state={open ? "open" : "closed"} className="collapsible-content" {...props}>
        <div className={cn("collapsible-content-inner", className)}>{children}</div>
      </div>
    )
  }
)
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
