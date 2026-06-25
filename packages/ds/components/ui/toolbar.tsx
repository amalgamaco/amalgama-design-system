import * as React from "react"
import { cn } from "../lib/utils"

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
      className={cn(
        "group flex-1 flex items-center gap-2 px-4 py-2 bg-surface-container-high border border-border rounded-md text-on-surface-variant cursor-text transition-[background,border-color] duration-fast ease-in-out hover:bg-search-field-hover hover:border-search-field-border-hover focus-within:bg-search-field-focus focus-within:border-secondary",
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

const ToolbarButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline rounded-md font-body text-body-md font-medium text-on-surface-variant cursor-pointer whitespace-nowrap transition-[background,border-color,color] duration-fast ease-in-out hover:bg-surface-variant hover:border-outline-variant hover:text-on-surface active:opacity-85 focus-visible:focus-ring [&_svg]:w-[18px] [&_svg]:h-[18px]",
        className
      )}
      {...props}
    >
      {children}
    </button>
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
