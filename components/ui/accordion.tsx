import * as React from "react"
import { cn } from "../lib/utils"

interface AccordionContextValue {
  isOpen: (value: string) => boolean
  toggle: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue>({
  isOpen: () => false,
  toggle: () => {},
})

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "single" | "multiple"
  /** Only used when type="single" */
  collapsible?: boolean
  defaultValue?: string | string[]
}

function Accordion({ type, collapsible, defaultValue, className, children, ...props }: AccordionProps) {
  const [openValues, setOpenValues] = React.useState<string[]>(() => {
    if (!defaultValue) return []
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
  })

  const isOpen = React.useCallback((value: string) => openValues.includes(value), [openValues])

  const toggle = React.useCallback(
    (value: string) => {
      setOpenValues((prev) => {
        const currentlyOpen = prev.includes(value)
        if (type === "multiple") {
          return currentlyOpen ? prev.filter((v) => v !== value) : [...prev, value]
        }
        // single mode
        if (currentlyOpen) return collapsible ? [] : prev
        return [value]
      })
    },
    [type, collapsible]
  )

  return (
    <AccordionContext.Provider value={{ isOpen, toggle }}>
      <div className={cn("accordion", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, ...props }, ref) => (
    <div ref={ref} className={cn("accordion-item", className)} data-value={value} {...props} />
  )
)
AccordionItem.displayName = "AccordionItem"

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const { isOpen, toggle } = React.useContext(AccordionContext)
    const open = isOpen(value)
    return (
      <h3 className="m-0">
        <button
          ref={ref}
          type="button"
          aria-expanded={open}
          className={cn("accordion-trigger", className)}
          onClick={() => toggle(value)}
          {...props}
        >
          {children}
          <svg
            className="accordion-chevron"
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </h3>
    )
  }
)
AccordionTrigger.displayName = "AccordionTrigger"

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { isOpen } = React.useContext(AccordionContext)
    const open = isOpen(value)
    return (
      <div
        ref={ref}
        role="region"
        data-state={open ? "open" : "closed"}
        className="accordion-content"
        {...props}
      >
        <div className={cn("accordion-content-inner", className)}>{children}</div>
      </div>
    )
  }
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
