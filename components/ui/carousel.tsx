import * as React from "react"
import { cn } from "../lib/utils"

interface CarouselContextValue {
  scrollRef: React.RefObject<HTMLDivElement>
  canScrollPrev: boolean
  canScrollNext: boolean
  scrollPrev: () => void
  scrollNext: () => void
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
}

/** Native CSS scroll-snap + scrollBy() buttons — no drag physics, autoplay,
 *  or infinite loop (simplified vs. the embla-carousel-backed version).
 *  Native touch-scroll still works on mobile. */
function Carousel({ className, children }: CarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const updateScrollState = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollPrev(el.scrollLeft > 4)
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

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
    const amount = (item?.getBoundingClientRect().width ?? el.clientWidth) + 16
    el.scrollBy({ left: amount * dir, behavior: "smooth" })
  }

  return (
    <CarouselContext.Provider
      value={{
        scrollRef,
        canScrollPrev,
        canScrollNext,
        scrollPrev: () => scrollByItem(-1),
        scrollNext: () => scrollByItem(1),
      }}
    >
      <div className={cn("carousel", className)} role="region" aria-roledescription="carousel">
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
  const { scrollPrev, canScrollPrev } = useCarousel()
  return (
    <button
      className={cn("carousel-btn carousel-btn-prev", className)}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="Anterior"
      {...props}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
  )
}

function CarouselNext({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { scrollNext, canScrollNext } = useCarousel()
  return (
    <button
      className={cn("carousel-btn carousel-btn-next", className)}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="Siguiente"
      {...props}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </button>
  )
}

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext }
