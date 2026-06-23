import * as React from "react"
import { cn } from "../../lib/utils"

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

export { SearchBar, SearchBarTrailing }
