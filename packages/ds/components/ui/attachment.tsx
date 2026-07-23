/**
 * Attachment — fila de archivo adjunto: ícono/miniatura + nombre + metadata +
 * acción/estado. Se apilan en un AttachmentList.
 *
 * Cuándo usar: listar archivos subidos o por subir (CV de candidatos, adjuntos de
 *   un mensaje), con progreso o botón de quitar.
 * Cuándo no: subir el archivo (<input type="file">, ver Input); galería (Carousel).
 * Reemplaza a: filas de archivo custom ad-hoc.
 *
 * 🧩 Embassy composition — there is NO official shadcn "Attachment" component. Built
 * from the same primitives (an Item-like row + a Progress-style bar + an icon Button
 * for remove), expressed as Tailwind utilities mapped to Embassy tokens. Composition:
 * AttachmentList · Attachment · AttachmentIcon · AttachmentBody · AttachmentName ·
 * AttachmentMeta · AttachmentRemove · AttachmentProgress.
 */
import * as React from "react"
import { cn } from "../lib/utils"

const AttachmentList = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-col gap-2 list-none m-0 p-0", className)} {...props} />
  )
)
AttachmentList.displayName = "AttachmentList"

export interface AttachmentProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /** Error state — red frame + red icon chip. */
  error?: boolean
}

const Attachment = React.forwardRef<HTMLLIElement, AttachmentProps>(
  ({ className, error, ...props }, ref) => (
    <li
      ref={ref}
      data-error={error || undefined}
      className={cn(
        "group/att flex items-center gap-3 py-[10px] px-3 rounded-md border border-border bg-card",
        "data-[error=true]:border-error",
        className
      )}
      {...props}
    />
  )
)
Attachment.displayName = "Attachment"

export interface AttachmentIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Render an image thumbnail instead of an icon chip. */
  image?: boolean
}

const AttachmentIcon = React.forwardRef<HTMLSpanElement, AttachmentIconProps>(
  ({ className, image, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center size-9 shrink-0 rounded-sm bg-surface-variant text-on-surface-variant [&>svg]:size-[18px]",
        // error row recolors its icon chip (matches buildless .attachment-error .attachment-icon)
        "group-data-[error=true]/att:bg-error-container group-data-[error=true]/att:text-on-error-container",
        image && "overflow-hidden [&>img]:size-full [&>img]:object-cover",
        className
      )}
      {...props}
    />
  )
)
AttachmentIcon.displayName = "AttachmentIcon"

const AttachmentBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 min-w-0 flex flex-col gap-0.5", className)} {...props} />
  )
)
AttachmentBody.displayName = "AttachmentBody"

const AttachmentName = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-body-sm font-medium text-fg truncate", className)} {...props} />
  )
)
AttachmentName.displayName = "AttachmentName"

const AttachmentMeta = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-caption text-fg-muted", className)} {...props} />
  )
)
AttachmentMeta.displayName = "AttachmentMeta"

const AttachmentRemove = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button ref={ref} type="button" className={cn("shrink-0 icon-btn", className)} {...props} />
  )
)
AttachmentRemove.displayName = "AttachmentRemove"

export interface AttachmentProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100. */
  value?: number
}

const AttachmentProgress = React.forwardRef<HTMLDivElement, AttachmentProgressProps>(
  ({ className, value = 0, ...props }, ref) => (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1 mt-1.5 rounded-full bg-surface-variant overflow-hidden", className)}
      {...props}
    >
      <div
        className="h-full rounded-[inherit] bg-primary transition-[width] duration-normal ease-default"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
)
AttachmentProgress.displayName = "AttachmentProgress"

export {
  AttachmentList,
  Attachment,
  AttachmentIcon,
  AttachmentBody,
  AttachmentName,
  AttachmentMeta,
  AttachmentRemove,
  AttachmentProgress,
}
