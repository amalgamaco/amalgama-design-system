import * as React from "react"
import { cn } from "../lib/utils"
import { useFlyout, type FlyoutSide, type FlyoutAlign } from "../lib/use-flyout"

interface PopoverContextValue {
  flyout: ReturnType<typeof useFlyout>
}
const PopoverContext = React.createContext<PopoverContextValue | null>(null)
function usePopoverContext() {
  const ctx = React.useContext(PopoverContext)
  if (!ctx) throw new Error("Popover.* must be used within <Popover>")
  return ctx
}

export interface PopoverProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}

const Popover: React.FC<PopoverProps> = ({ children, open, onOpenChange, defaultOpen }) => {
  const flyout = useFlyout({ onOpenChange })
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(!!defaultOpen)
  const isControlled = open !== undefined
  const resolvedOpen = isControlled ? open : uncontrolledOpen

  // Bridge controlled/uncontrolled open state into the shared hook.
  React.useEffect(() => {
    if (isControlled && open !== flyout.open) {
      if (open) flyout.openFromTrigger()
      else flyout.close()
    }
  }, [isControlled, open]) // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (!isControlled) setUncontrolledOpen(flyout.open)
  }, [flyout.open, isControlled])

  return (
    <PopoverContext.Provider value={{ flyout: { ...flyout, open: resolvedOpen } as typeof flyout }}>
      {children}
    </PopoverContext.Provider>
  )
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, onClick, ...props }, ref) => {
    const { flyout } = usePopoverContext()
    return (
      <button
        ref={(el) => {
          flyout.triggerRef.current = el
          if (typeof ref === "function") ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el
        }}
        type="button"
        aria-expanded={flyout.open}
        className={cn("popover-trigger", className)}
        onClick={(e) => {
          onClick?.(e)
          flyout.open ? flyout.close() : flyout.openFromTrigger()
        }}
        {...props}
      />
    )
  }
)
PopoverTrigger.displayName = "PopoverTrigger"

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: FlyoutSide
  align?: FlyoutAlign
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, style, children, ...props }, ref) => {
    const { flyout } = usePopoverContext()
    if (!flyout.open) return null
    return (
      <div
        ref={(el) => {
          flyout.contentRef.current = el
          if (typeof ref === "function") ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
        }}
        role="dialog"
        className={cn("popover-content", className)}
        style={{ top: flyout.position.top, left: flyout.position.left, ...style }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
PopoverContent.displayName = "PopoverContent"

const PopoverAnchor: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>

const PopoverClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ onClick, ...props }, ref) => {
    const { flyout } = usePopoverContext()
    return (
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          onClick?.(e)
          flyout.close()
        }}
        {...props}
      />
    )
  }
)
PopoverClose.displayName = "PopoverClose"

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverClose }
