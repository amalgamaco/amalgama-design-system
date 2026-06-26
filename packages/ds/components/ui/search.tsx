/**
 * Search — búsqueda de contenido (search-bar standalone + search-view expandida).
 *
 * Cuándo usar: search-bar standalone para vistas de búsqueda (desktop y mobile). Acompañar con .search-icon-btn para acciones contextuales (Filtros, Ordenar, Vista).
 * Cuándo no: reemplazar search-bar con un input de formulario (usar .form-input).
 * Reemplaza a: inputs de búsqueda legacy, toolbar search-field.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/search.css.
 */
import * as React from "react"
import { cn } from "../lib/utils"

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  trailing?: React.ReactNode
  containerClassName?: string
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, containerClassName, icon, trailing, ...props }, ref) => (
    <div
      className={cn(
        "flex items-center gap-4 h-14 px-4 rounded-full bg-surface-container-high border border-border min-w-[min(360px,100%)] max-w-[720px] w-full transition-[background,border-color] duration-fast ease-in-out hover:bg-search-field-hover hover:border-search-field-border-hover focus-within:bg-search-field-focus focus-within:border-secondary",
        containerClassName
      )}
      role="search"
    >
      <span className="inline-flex items-center justify-center w-6 h-6 flex-shrink-0 text-on-surface [&_svg]:w-6 [&_svg]:h-6">
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
          "flex-1 min-w-0 border-none outline-none bg-transparent text-on-surface font-body text-body-lg font-normal leading-[1.4] caret-secondary placeholder:text-on-surface-variant [&::-webkit-search-cancel-button]:hidden",
          className
        )}
        {...props}
      />
      {trailing}
    </div>
  )
)
SearchBar.displayName = "SearchBar"

const SearchBarTrailing = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn("inline-flex items-center justify-center w-6 h-6 p-0 border-none bg-transparent text-on-surface-variant cursor-pointer flex-shrink-0 [&_svg]:w-6 [&_svg]:h-6", className)}
      {...props}
    />
  )
)
SearchBarTrailing.displayName = "SearchBarTrailing"

const SearchBarAvatar = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("inline-flex items-center justify-center w-[30px] h-[30px] rounded-full bg-primary-container text-on-primary-container font-bold text-[11px] flex-shrink-0 overflow-hidden [&_img]:w-full [&_img]:h-full [&_img]:object-cover", className)}
      {...props}
    />
  )
)
SearchBarAvatar.displayName = "SearchBarAvatar"

export interface SearchViewProps extends React.HTMLAttributes<HTMLDivElement> {
  fullscreen?: boolean
}

const SearchView = React.forwardRef<HTMLDivElement, SearchViewProps>(
  ({ className, fullscreen, ...props }, ref) => (
    <div
      ref={ref}
      role="search"
      className={cn(
        "relative border border-border rounded-[28px] bg-card shadow-lg",
        fullscreen && "fixed inset-0 rounded-none z-[200]",
        className
      )}
      {...props}
    />
  )
)
SearchView.displayName = "SearchView"

export interface SearchViewHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  onBack?: () => void
  backLabel?: string
}

const SearchViewHeader = React.forwardRef<HTMLDivElement, SearchViewHeaderProps>(
  ({ className, onBack, backLabel = "Cerrar búsqueda", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("h-[72px] flex items-center gap-2 px-4 border-b border-border", className)}
      {...props}
    >
      {onBack && (
        <button
          type="button"
          aria-label={backLabel}
          onClick={onBack}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full border-none bg-transparent text-on-surface-variant cursor-pointer hover:bg-on-surface-state-hover focus-visible:focus-ring [&_svg]:w-6 [&_svg]:h-6"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
      )}
      {children}
    </div>
  )
)
SearchViewHeader.displayName = "SearchViewHeader"

const SearchViewResults = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("list-none p-0 m-0", className)} {...props} />
  )
)
SearchViewResults.displayName = "SearchViewResults"

export interface SearchViewResultProps extends React.LiHTMLAttributes<HTMLLIElement> {
  icon?: React.ReactNode
}

const SearchViewResult = React.forwardRef<HTMLLIElement, SearchViewResultProps>(
  ({ className, icon, children, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(
        "flex items-center gap-3 px-4 py-3 cursor-pointer text-on-surface text-body-md transition-colors duration-fast ease-in-out hover:bg-on-surface-state-hover first:rounded-t-[27px] last:rounded-b-[27px]",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="inline-flex items-center justify-center w-6 h-6 flex-shrink-0 text-on-surface-variant [&_svg]:w-6 [&_svg]:h-6">
          {icon}
        </span>
      )}
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
