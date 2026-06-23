import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../components/ui/carousel"

const slides = [
  { label: "Slide 1", color: "bg-primary-container text-on-primary-container" },
  { label: "Slide 2", color: "bg-secondary-container text-on-secondary-container" },
  { label: "Slide 3", color: "bg-tertiary-container text-on-tertiary-container" },
  { label: "Slide 4", color: "bg-success-container text-on-success-container" },
]

export function CarouselShowcase() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-label text-fg-subtle mb-3">Un ítem por slide</p>
        <Carousel className="max-w-sm mx-auto">
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.label}>
                <div className={`flex h-32 items-center justify-center rounded-lg font-heading font-semibold text-body-lg ${slide.color}`}>
                  {slide.label}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div>
        <p className="text-label text-fg-subtle mb-3">Múltiples ítems (basis-1/2)</p>
        <Carousel opts={{ align: "start" }} className="max-w-lg mx-auto">
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.label} className="basis-1/2">
                <div className={`flex h-24 items-center justify-center rounded-lg font-semibold text-body-sm ${slide.color}`}>
                  {slide.label}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}
