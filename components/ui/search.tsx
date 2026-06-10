import * as React from "react"
import { cn } from "../lib/utils"

export interface SearchBarProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Ícono inicial. Por defecto, lupa de 24px. */
  icon?: React.ReactNode
  /** Elemento final opcional: avatar (`SearchBarAvatar`) o botón de acción (`SearchBarTrailing`). */
  trailing?: React.ReactNode
  /** className para el contenedor (el resto de props van al input). */
  containerClassName?: string
}

/**
 * Search bar: campo de búsqueda persistente de 56px con forma de píldora.
 * El componente Search independiente — para búsqueda embebida en una
 * Tool Bar usá `SearchField` (toolbar.tsx).
 */
const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, containerClassName, icon, trailing, ...props }, ref) => (
    <div className={cn("search-bar", containerClassName)} role="search">
      <span className="search-bar-icon">
        {icon ?? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
        )}
      </span>
      <input
        ref={ref}
        type="search"
        className={cn("search-bar-input", className)}
        {...props}
      />
      {trailing}
    </div>
  )
)
SearchBar.displayName = "SearchBar"

/** Botón de ícono final de la search bar (micrófono, limpiar…). Requiere `aria-label`. */
const SearchBarTrailing = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button ref={ref} type="button" className={cn("search-bar-trailing", className)} {...props} />
))
SearchBarTrailing.displayName = "SearchBarTrailing"

/** Avatar de cuenta en la search bar (30px). Pasá iniciales o un <img>. */
const SearchBarAvatar = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("search-bar-avatar", className)} {...props} />
))
SearchBarAvatar.displayName = "SearchBarAvatar"

export interface SearchViewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Ocupa toda la pantalla (ventanas compactas). Por defecto, docked. */
  fullscreen?: boolean
}

/** Search view: experiencia expandida con sugerencias y resultados. */
const SearchView = React.forwardRef<HTMLDivElement, SearchViewProps>(
  ({ className, fullscreen, ...props }, ref) => (
    <div
      ref={ref}
      role="search"
      className={cn("search-view", fullscreen && "search-view-fullscreen", className)}
      {...props}
    />
  )
)
SearchView.displayName = "SearchView"

export interface SearchViewHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Callback del botón de volver/cerrar. Si no se pasa, no se renderiza. */
  onBack?: () => void
  /** Nombre accesible del botón de volver. */
  backLabel?: string
}

/** Encabezado de 72px de la search view: volver + input + acciones. */
const SearchViewHeader = React.forwardRef<HTMLDivElement, SearchViewHeaderProps>(
  ({ className, onBack, backLabel = "Cerrar búsqueda", children, ...props }, ref) => (
    <div ref={ref} className={cn("search-view-header", className)} {...props}>
      {onBack && (
        <button type="button" className="search-view-back" aria-label={backLabel} onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
      )}
      {children}
    </div>
  )
)
SearchViewHeader.displayName = "SearchViewHeader"

/** Lista de resultados de la search view. */
const SearchViewResults = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("search-view-results", className)} {...props} />
))
SearchViewResults.displayName = "SearchViewResults"

export interface SearchViewResultProps
  extends React.LiHTMLAttributes<HTMLLIElement> {
  /** Ícono inicial opcional (24px, p. ej. reloj para búsquedas recientes). */
  icon?: React.ReactNode
}

/** Ítem de resultado de la search view. */
const SearchViewResult = React.forwardRef<HTMLLIElement, SearchViewResultProps>(
  ({ className, icon, children, ...props }, ref) => (
    <li ref={ref} className={cn("search-view-result", className)} {...props}>
      {icon && <span className="search-view-result-icon">{icon}</span>}
      {children}
    </li>
  )
)
SearchViewResult.displayName = "SearchViewResult"

export {
  SearchBar,
  SearchBarTrailing,
  SearchBarAvatar,
  SearchView,
  SearchViewHeader,
  SearchViewResults,
  SearchViewResult,
}
