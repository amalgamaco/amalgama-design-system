import * as React from "react"
import { cn } from "../lib/utils"

const DescSection = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("desc-section", className)} {...props} />
  )
)
DescSection.displayName = "DescSection"

const DescSectionHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("desc-section-header", className)} {...props} />
  )
)
DescSectionHeader.displayName = "DescSectionHeader"

const DescTitleInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn("desc-title-input", className)} {...props} />
  )
)
DescTitleInput.displayName = "DescTitleInput"

const DescDeleteBtn = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <button ref={ref} type="button" className={cn("desc-delete-btn", className)} {...props}>
      {children ?? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
    </button>
  )
)
DescDeleteBtn.displayName = "DescDeleteBtn"

export interface DescEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string
}

const DescEditor = React.forwardRef<HTMLDivElement, DescEditorProps>(
  ({ className, placeholder, ...props }, ref) => (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      className={cn("desc-editor", className)}
      {...props}
    />
  )
)
DescEditor.displayName = "DescEditor"

export interface DescriptionSectionProps {
  title?: string
  placeholder?: string
  onTitleChange?: (value: string) => void
  onDelete?: () => void
  className?: string
}

const DescriptionSection = React.forwardRef<HTMLDivElement, DescriptionSectionProps>(
  ({ title, placeholder = "Escribe aqui...", onTitleChange, onDelete, className }, ref) => (
    <DescSection ref={ref} className={className}>
      <DescSectionHeader>
        <DescTitleInput
          defaultValue={title}
          onChange={onTitleChange ? (e) => onTitleChange(e.target.value) : undefined}
        />
        {onDelete && <DescDeleteBtn onClick={onDelete} />}
      </DescSectionHeader>
      <DescEditor placeholder={placeholder} />
    </DescSection>
  )
)
DescriptionSection.displayName = "DescriptionSection"

export { DescSection, DescSectionHeader, DescTitleInput, DescDeleteBtn, DescEditor, DescriptionSection }
