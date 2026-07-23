/**
 * Pagination — navigate between pages of a result set.
 *
 * Cuándo usar: dividir listas/tablas largas en páginas navegables. Cuándo no: scroll
 * infinito, o conjuntos chicos que caben en una vista.
 *
 * shadcn Pagination structure (nav > ul > li, Link/Previous/Next/Ellipsis). Composes the
 * canonical Button styling via `buttonVariants` instead of a parallel implementation — the
 * active page uses Embassy's Secondary-container selection language (shared with Chip / nav).
 */
import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "../lib/utils"
import { buttonVariants } from "./button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav role="navigation" aria-label="Paginación" className={cn("mx-auto flex w-full justify-center", className)} {...props} />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1 list-none m-0 p-0", className)} {...props} />
  )
)
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />
)
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = { isActive?: boolean } & React.ComponentProps<"a">

const PaginationLink = ({ className, isActive, ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-body-md font-medium cursor-pointer transition-colors duration-fast ease-default focus-visible:focus-ring",
      isActive
        ? "bg-secondary-container text-on-secondary-container"
        : "text-on-surface hover:bg-on-surface-state-hover",
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<"a">) => (
  <a
    aria-label="Ir a la página anterior"
    className={cn(buttonVariants({ variant: "text" }), "gap-1 pl-2.5 [&_svg]:size-[18px] cursor-pointer", className)}
    {...props}
  >
    <ChevronLeft />
    <span>Anterior</span>
  </a>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({ className, ...props }: React.ComponentProps<"a">) => (
  <a
    aria-label="Ir a la página siguiente"
    className={cn(buttonVariants({ variant: "text" }), "gap-1 pr-2.5 [&_svg]:size-[18px] cursor-pointer", className)}
    {...props}
  >
    <span>Siguiente</span>
    <ChevronRight />
  </a>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span aria-hidden="true" className={cn("flex h-9 w-9 items-center justify-center text-fg-muted", className)} {...props}>
    <MoreHorizontal className="size-4" />
    <span className="sr-only">Más páginas</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
