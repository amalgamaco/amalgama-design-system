import * as React from "react"
import { cn } from "../lib/utils"

export interface DescriptionSectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  placeholder?: string
  onTitleChange?: (value: string) => void
  onDelete?: () => void
}

const DescriptionSection = React.forwardRef<HTMLDivElement, DescriptionSectionProps>(
  ({ className, title, placeholder = "Escribe aqui...", onTitleChange, onDelete, children, ...props }, ref) => (
    <div ref={ref} className={cn("desc-section", className)} {...props}>
      <div className="desc-section-header">
        <input
          className="desc-title-input"
          defaultValue={title}
          onChange={onTitleChange ? (e) => onTitleChange(e.target.value) : undefined}
        />
        {onDelete && (
          <button className="desc-delete-btn" onClick={onDelete}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
      <div
        className="desc-editor"
        contentEditable
        data-placeholder={placeholder}
        suppressContentEditableWarning
      >
        {children}
      </div>
    </div>
  )
)
DescriptionSection.displayName = "DescriptionSection"

export { DescriptionSection }
