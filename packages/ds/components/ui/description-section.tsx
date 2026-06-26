/**
 * Description Section — secciones colapsables con editor de texto y botón eliminar.
 *
 * Cuándo usar: secciones de descripción editables (título + editor rich-text).
 * Cuándo no: campos simples de formulario (usar form.css).
 * Reemplaza a: editores de descripción ad-hoc.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/description.css.
 */
import * as React from "react"
import { cn } from "../lib/utils"

const DescSection = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("group mb-4 border border-border rounded-md overflow-hidden", className)}
      {...props}
    />
  )
)
DescSection.displayName = "DescSection"

const DescSectionHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-4 py-[10px] pr-3 bg-canvas border-b border-border flex items-center gap-2", className)}
      {...props}
    />
  )
)
DescSectionHeader.displayName = "DescSectionHeader"

const DescTitleInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex-1 border-none bg-transparent text-body-md font-semibold font-body text-fg outline-none p-0 min-w-0 focus:text-link",
        className
      )}
      {...props}
    />
  )
)
DescTitleInput.displayName = "DescTitleInput"

const DescDeleteBtn = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "w-7 h-7 rounded-md border-none bg-transparent inline-flex items-center justify-center text-fg-muted cursor-pointer transition-[background,color] duration-fast ease-in-out flex-shrink-0 opacity-0 group-hover:opacity-100 hover:bg-error-container hover:text-error",
        className
      )}
      {...props}
    />
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
      className={cn(
        "min-h-[100px] px-4 py-[14px] text-body-md font-body text-fg leading-[1.6] outline-none bg-card transition-shadow duration-fast focus:shadow-[inset_0_0_0_2px_var(--color-focus-ring)] desc-placeholder",
        className
      )}
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
  ({ title, placeholder, onTitleChange, onDelete, className }, ref) => (
    <DescSection ref={ref} className={className}>
      <DescSectionHeader>
        <DescTitleInput
          value={title}
          onChange={(e) => onTitleChange?.(e.target.value)}
        />
        {onDelete && <DescDeleteBtn onClick={onDelete} />}
      </DescSectionHeader>
      <DescEditor placeholder={placeholder} />
    </DescSection>
  )
)
DescriptionSection.displayName = "DescriptionSection"

export { DescSection, DescSectionHeader, DescTitleInput, DescDeleteBtn, DescEditor, DescriptionSection }
