import * as React from "react"
import { cn } from "../lib/utils"

type CarouselOrientation = "horizontal" | "vertical"

interface CarouselContextValue {
  scrollRef: React.RefObject<HTMLDivElement>
  canScrollPrev: boolean
  canScrollNext: boolean
  scrollPrev: () => void
  scrollNext: () => void
  orientation: CarouselOrientation
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

function useCarousel() {
  const ctx = React.useContext(CarouselContext)
  if (!ctx) throw new Error("useCarousel must be used inside <Carousel>")
  return ctx
}

interface CarouselProps {
  className?: string
  children?: React.ReactNode
  /** Scroll axis. `vertical` stacks items and scrolls on Y — the parent must
   *  give the carousel a bounded height (par shadcn orientation="vertical"). */
  orientation?: CarouselOrientation
}

/** Native CSS scroll-snap + scrollBy() buttons — no drag physics, autoplay,
 *  or infinite loop (simplified vs. the embla-carousel-backed version).
 *  Native touch-scroll still works on mobile. */
function Carousel({ className, children, orientation = "horizontal" }: CarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const isVertical = orientation === "vertical"
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const updateScrollState = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const pos = isVertical ? el.scrollTop : el.scrollLeft
    const max = isVertical
      ? el.scrollHeight - el.clientHeight
      : el.scrollWidth - el.clientWidth
    setCanScrollPrev(pos > 4)
    setCanScrollNext(pos < max - 4)
  }, [isVertical])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)
    return () => {
      el.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [updateScrollState])

  const scrollByItem = (dir: 1 | -1) => {
    const el = scrollRef.current
    if (!el) return
    const item = el.querySelector<HTMLElement>(".carousel-item")
    const rect = item?.getBoundingClientRect()
    if (isVertical) {
      const amount = (rect?.height ?? el.clientHeight) + 16
      el.scrollBy({ top: amount * dir, behavior: "smooth" })
    } else {
      const amount = (rect?.width ?? el.clientWidth) + 16
      el.scrollBy({ left: amount * dir, behavior: "smooth" })
    }
  }

  return (
    <CarouselContext.Provider
      value={{
        scrollRef,
        canScrollPrev,
        canScrollNext,
        scrollPrev: () => scrollByItem(-1),
        scrollNext: () => scrollByItem(1),
        orientation,
      }}
    >
      <div
        className={cn("carousel", isVertical && "carousel-vertical", className)}
        role="region"
        aria-roledescription="carousel"
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { scrollRef } = useCarousel()
  return <div ref={scrollRef} className={cn("carousel-content", className)} {...props} />
}

function CarouselItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="group" aria-roledescription="slide" className={cn("carousel-item", className)} {...props} />
}

function CarouselPrevious({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { scrollPrev, canScrollPrev, orientation } = useCarousel()
  return (
    <button
      className={cn("carousel-btn carousel-btn-prev", className)}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="Anterior"
      {...props}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {orientation === "vertical" ? <path d="M18 15l-6-6-6 6" /> : <path d="M15 18l-6-6 6-6" />}
      </svg>
    </button>
  )
}

function CarouselNext({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { scrollNext, canScrollNext, orientation } = useCarousel()
  return (
    <button
      className={cn("carousel-btn carousel-btn-next", className)}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="Siguiente"
      {...props}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {orientation === "vertical" ? <path d="M6 9l6 6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>
  )
}

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext }
