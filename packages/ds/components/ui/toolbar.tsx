/**
 * Toolbar — barra de búsqueda con filtros y acciones para listas de datos.
 *
 * Cuándo usar: barra de controles sobre listas/tablas — SearchField compacto + Select/
 * ToolbarButton para filtros y acciones, todo a la misma altura de fila.
 * Cuándo no: búsqueda standalone de página, sin filtros vecinos (usar `SearchBar` de
 * search.tsx — mobile/hero, forma píldora 56px).
 * Reemplaza a: filter bars legacy.
 *
 * Search Bar / Search Field (2026-07): `SearchField` (abajo) es la variante desktop
 * oficial de Search — reutiliza los mismos tokens de estado que `SearchBar`
 * (--search-field-hover/-focus/-border-hover) y la misma tier de borde `--border` que
 * Select/Input/Textarea. Solo cambia forma (`--radius-md` vs. píldora) y altura (por
 * padding, no fija) para integrarse con sus vecinos de toolbar. No tiene slot trailing ni
 * abre una search view — ver Search → Guidelines → "Ubicación".
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/toolbar.css.
 */
import * as React from "react"
import { cn } from "../lib/utils"
import { Button } from "./button"

const Toolbar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-2 mb-4", className)} {...props} />
  )
)
Toolbar.displayName = "Toolbar"

export interface SearchFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string
  icon?: React.ReactNode
}

const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ className, containerClassName, icon, ...props }, ref) => (
    <div
      role="search"
      className={cn(
        // Desktop SearchField rests on --color-surface (white in light) — par shadcn;
        // distinct from the mobile SearchBar (search.tsx), which is gray (surface-container-high).
        "group flex-1 flex items-center gap-2 min-h-10 px-4 py-2 bg-surface border border-border rounded-md text-on-surface-variant cursor-text transition-[background,border-color] duration-fast ease-default hover:bg-search-field-hover hover:border-search-field-border-hover focus-within:bg-search-field-focus focus-within:border-secondary",
        containerClassName
      )}
    >
      <span className="inline-flex items-center justify-center w-[18px] h-[18px] flex-shrink-0 [&_svg]:w-[18px] [&_svg]:h-[18px] text-inherit">
        {icon ?? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
        )}
      </span>
      <input
        ref={ref}
        type="search"
        className={cn(
          "flex-1 min-w-0 border-none outline-none bg-transparent font-body text-body-md text-on-surface caret-secondary placeholder:text-on-surface-variant [&::-webkit-search-cancel-button]:hidden",
          className
        )}
        {...props}
      />
    </div>
  )
)
SearchField.displayName = "SearchField"

// ToolbarButton composes the canonical Button (variant="icon" is the only variant
// whose neutral coloring — surface-container fill, on-surface-variant label, neutral
// hover — matches the toolbar filter aesthetic) and overrides its square icon geometry
// for a labeled, min-h-10 (SearchField-parity) shape. No hand-rolled class string.
const ToolbarButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <Button
      ref={ref}
      variant="icon"
      className={cn(
        "w-auto h-auto min-h-10 px-4 py-2 gap-2 rounded-md text-body-md font-medium whitespace-nowrap active:scale-[0.98] [&_svg]:w-[18px] [&_svg]:h-[18px]",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
)
ToolbarButton.displayName = "ToolbarButton"

export interface ResultCountProps
  extends React.HTMLAttributes<HTMLDivElement> {
  count?: number
  label?: string
}

const ResultCount = React.forwardRef<HTMLDivElement, ResultCountProps>(
  ({ className, count, label, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-caption text-fg-muted mt-2 [&_strong]:font-semibold [&_strong]:text-fg-subtle", className)}
      {...props}
    >
      {count !== undefined && label ? (
        <>
          Mostrando <strong>{count}</strong> {label}
        </>
      ) : null}
    </div>
  )
)
ResultCount.displayName = "ResultCount"

export { Toolbar, SearchField, ToolbarButton, ResultCount }
