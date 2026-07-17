import * as React from "react"
import { cn } from "../lib/utils"

const Toolbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("toolbar", className)} {...props} />
))
Toolbar.displayName = "Toolbar"

export interface SearchFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string
  icon?: React.ReactNode
}

const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ className, containerClassName, icon, ...props }, ref) => (
    <div role="search" className={cn("search-field", containerClassName)}>
      {icon ?? (
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      )}
      <input ref={ref} type="search" className={className} {...props} />
    </div>
  )
)
SearchField.displayName = "SearchField"

const ToolbarButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("toolbar-btn", className)} {...props} />
))
ToolbarButton.displayName = "ToolbarButton"

export interface ResultCountProps
  extends React.HTMLAttributes<HTMLDivElement> {
  count: number
  label: string
}

const ResultCount = React.forwardRef<HTMLDivElement, ResultCountProps>(
  ({ className, count, label, ...props }, ref) => (
    <div ref={ref} className={cn("result-count", className)} {...props}>
      Mostrando <strong>{count}</strong> {label}
    </div>
  )
)
ResultCount.displayName = "ResultCount"

export { Toolbar, SearchField, ToolbarButton, ResultCount }
