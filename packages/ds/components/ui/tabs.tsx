/**
 * Tabs — pestañas para organizar contenido en secciones.
 *
 * Cuándo usar: alternar vistas dentro del MISMO contexto/página.
 * Cuándo no: navegación entre páginas (usar sidebar de layout.css).
 * Reemplaza a: tab bars legacy.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/tabs.css.
 */
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "../lib/utils"

// shadcn Tabs (Radix) — Embassy underline style.
//
// Token mapping (see GOVERNANCE.md §5.6 "Selected state"):
//   default   text-on-surface-variant
//   hover     text-on-surface
//   focus     focus-visible:focus-ring (--color-focus / --color-focus-ring)
//   pressed   active:text-secondary (early feedback, same hue as selected)
//   selected  text-secondary + secondary indicator — Secondary family, matching
//             Chip/Segmented Button's selected treatment (secondary-container
//             family). Deliberately NOT --color-primary: Primary flips to white
//             in dark mode, which reads as "no color" for a passive selection
//             indicator and breaks visual consistency with every other
//             selected/active state in the library. Secondary stays blue in
//             both themes.
//   disabled  disabled:opacity-40 disabled:pointer-events-none
export const Tabs = TabsPrimitive.Root

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const listRef = React.useRef<HTMLDivElement | null>(null)
  const [indicator, setIndicator] = React.useState<{ left: number; width: number } | null>(null)

  const measure = React.useCallback(() => {
    const list = listRef.current
    if (!list) return
    const active = list.querySelector<HTMLElement>('[role="tab"][data-state="active"]')
    if (!active) return
    // A hidden ancestor (e.g. an inactive docs-site page, display:none) reports
    // 0×0 — skip measuring rather than lock in a degenerate indicator.
    if (active.offsetWidth === 0) return
    const next = { left: active.offsetLeft, width: active.offsetWidth }
    setIndicator((prev) =>
      prev && prev.left === next.left && prev.width === next.width ? prev : next
    )
  }, [])

  React.useLayoutEffect(() => {
    measure()
  })

  React.useEffect(() => {
    const list = listRef.current
    if (!list) return
    const mutationObs = new MutationObserver(measure)
    mutationObs.observe(list, { attributes: true, subtree: true, attributeFilter: ["data-state"] })
    // ResizeObserver catches the list going from 0×0 (hidden ancestor) to its
    // real size — e.g. navigating to this page after it mounted while hidden,
    // which a data-state-only MutationObserver never sees.
    const resizeObs = new ResizeObserver(measure)
    resizeObs.observe(list)
    window.addEventListener("resize", measure)
    return () => {
      mutationObs.disconnect()
      resizeObs.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [measure])

  return (
    <TabsPrimitive.List
      ref={(node) => {
        listRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      }}
      className={cn("relative inline-flex w-full items-center gap-1 border-b border-border", className)}
      {...props}
    >
      {children}
      {indicator && (
        <span
          aria-hidden
          // Spatial: the indicator sliding + settling is the Expressive overshoot moment.
          className="absolute bottom-0 h-0.5 bg-secondary transition-[transform,width] duration-normal ease-expressive pointer-events-none"
          style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
        />
      )}
    </TabsPrimitive.List>
  )
})
TabsList.displayName = "TabsList"

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "-mb-px cursor-pointer border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-on-surface-variant outline-none transition-colors duration-fast ease-default",
      "hover:text-on-surface",
      "focus-visible:focus-ring focus-visible:text-on-surface",
      "active:text-secondary",
      "disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed",
      "data-[state=active]:text-secondary data-[state=active]:font-semibold",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = "TabsTrigger"

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("py-4 text-sm text-on-surface-variant outline-none", className)}
    {...props}
  />
))
TabsContent.displayName = "TabsContent"
