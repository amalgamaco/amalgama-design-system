import * as React from "react"

/**
 * Shared positioning/dismissal/keyboard-nav behavior for every flyout-shaped
 * component (Popover, Dropdown Menu, Context Menu, Menubar, Navigation Menu).
 *
 * Simplified vanilla equivalent of Radix's Popper + focus-trap + roving-tabindex
 * stack: real viewport-edge flipping via getBoundingClientRect (not a shortcut —
 * cheap to hand-roll and shared across five components), but no true focus trap
 * (Tab cycling inside the panel) — instead focus moves to the first item on open
 * and returns to the trigger on close, which covers the common case.
 */

export type FlyoutSide = "top" | "bottom" | "left" | "right"
export type FlyoutAlign = "start" | "center" | "end"

export interface UseFlyoutOptions {
  side?: FlyoutSide
  align?: FlyoutAlign
  /** Gap in px between trigger and panel. */
  offset?: number
  onOpenChange?: (open: boolean) => void
}

export interface FlyoutPosition {
  top: number
  left: number
}

export function useFlyout(options: UseFlyoutOptions = {}) {
  const { side = "bottom", align = "start", offset = 6, onOpenChange } = options

  const [open, setOpenState] = React.useState(false)
  const [position, setPosition] = React.useState<FlyoutPosition>({ top: -9999, left: -9999 })
  const [activeIndex, setActiveIndex] = React.useState(-1)

  const triggerRef = React.useRef<HTMLElement | null>(null)
  const contentRef = React.useRef<HTMLElement | null>(null)
  const itemsRef = React.useRef<(HTMLElement | null)[]>([])
  const coordsRef = React.useRef<FlyoutPosition | null>(null) // explicit open-at coords (context menu)

  const setOpen = React.useCallback(
    (next: boolean) => {
      setOpenState(next)
      onOpenChange?.(next)
    },
    [onOpenChange]
  )

  const reposition = React.useCallback(() => {
    const content = contentRef.current
    if (!content) return
    const panel = content.getBoundingClientRect()

    // Explicit coordinates (context menu at cursor) skip trigger-relative math.
    if (coordsRef.current) {
      const { top, left } = coordsRef.current
      setPosition({
        top: Math.max(8, Math.min(top, window.innerHeight - panel.height - 8)),
        left: Math.max(8, Math.min(left, window.innerWidth - panel.width - 8)),
      })
      return
    }

    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    let top = 0
    let left = 0

    if (side === "bottom" || side === "top") {
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      const wantsBottom = side === "bottom"
      const resolvedBottom = wantsBottom
        ? !(spaceBelow < panel.height && spaceAbove > spaceBelow)
        : spaceAbove < panel.height && spaceBelow > spaceAbove
      top = resolvedBottom ? rect.bottom + offset : rect.top - panel.height - offset
      left =
        align === "end"
          ? rect.right - panel.width
          : align === "center"
          ? rect.left + rect.width / 2 - panel.width / 2
          : rect.left
    } else {
      const spaceRight = window.innerWidth - rect.right
      const spaceLeft = rect.left
      const wantsRight = side === "right"
      const resolvedRight = wantsRight
        ? !(spaceRight < panel.width && spaceLeft > spaceRight)
        : spaceLeft < panel.width && spaceRight > spaceLeft
      left = resolvedRight ? rect.right + offset : rect.left - panel.width - offset
      top = rect.top
    }

    setPosition({
      top: Math.max(8, Math.min(top, window.innerHeight - panel.height - 8)),
      left: Math.max(8, Math.min(left, window.innerWidth - panel.width - 8)),
    })
  }, [side, align, offset])

  /** Open anchored to the trigger element (default flow). */
  const openFromTrigger = React.useCallback(() => {
    coordsRef.current = null
    setOpen(true)
  }, [setOpen])

  /** Open anchored to explicit viewport coordinates (context menu). */
  const openAt = React.useCallback(
    (coords: FlyoutPosition) => {
      coordsRef.current = coords
      setOpen(true)
    },
    [setOpen]
  )

  const close = React.useCallback(() => {
    setOpen(false)
    coordsRef.current = null
  }, [setOpen])

  // Reposition on open, and keep in sync with scroll/resize while open.
  React.useEffect(() => {
    if (!open) return
    // Two rAF ticks: first paints the panel so getBoundingClientRect has real
    // dimensions, second applies the computed position without a visible jump.
    const raf = requestAnimationFrame(() => requestAnimationFrame(reposition))
    const onScroll = () => reposition()
    const onResize = () => reposition()
    window.addEventListener("scroll", onScroll, true)
    window.addEventListener("resize", onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll, true)
      window.removeEventListener("resize", onResize)
    }
  }, [open, reposition])

  // Click-outside + Escape dismissal.
  React.useEffect(() => {
    if (!open) return
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node
      if (contentRef.current?.contains(target)) return
      if (triggerRef.current?.contains(target)) return
      close()
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close()
        triggerRef.current?.focus()
      }
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open, close])

  // Focus the first item on open (no full focus trap — see file header).
  React.useEffect(() => {
    if (!open) {
      setActiveIndex(-1)
      return
    }
    const id = requestAnimationFrame(() => {
      const first = itemsRef.current.find(Boolean)
      first?.focus()
      setActiveIndex(first ? 0 : -1)
    })
    return () => cancelAnimationFrame(id)
  }, [open])

  const registerItem = React.useCallback((el: HTMLElement | null, index: number) => {
    itemsRef.current[index] = el
  }, [])

  /** Roving ArrowUp/Down/Home/End/Enter/Space nav across registered items. */
  const onItemsKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      const items = itemsRef.current.filter((el): el is HTMLElement => !!el)
      if (!items.length) return
      let next = activeIndex
      if (e.key === "ArrowDown") {
        next = (activeIndex + 1) % items.length
      } else if (e.key === "ArrowUp") {
        next = (activeIndex - 1 + items.length) % items.length
      } else if (e.key === "Home") {
        next = 0
      } else if (e.key === "End") {
        next = items.length - 1
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        items[activeIndex]?.click()
        return
      } else {
        return
      }
      e.preventDefault()
      setActiveIndex(next)
      items[next]?.focus()
    },
    [activeIndex]
  )

  return {
    open,
    setOpen,
    openFromTrigger,
    openAt,
    close,
    position,
    reposition,
    triggerRef,
    contentRef,
    activeIndex,
    setActiveIndex,
    registerItem,
    onItemsKeyDown,
  }
}
