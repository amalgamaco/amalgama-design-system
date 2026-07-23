/**
 * InputGroup — input con addons (íconos, texto, botones) dentro de un contenedor
 * con borde único. El foco/error viven en el contenedor, no en el control interno.
 *
 * Cuándo usar: input con prefijo/sufijo (íconos, unidades, botón de acción), o un
 *   textarea con toolbar arriba/abajo.
 * Cuándo no: input simple (Input); búsqueda filtrable (Combobox).
 * Reemplaza a: wrappers ad-hoc con position:absolute para íconos.
 *
 * Official shadcn/ui component (InputGroup). Canonical composition preserved:
 * InputGroup · InputGroupInput · InputGroupTextarea · InputGroupAddon (align) ·
 * InputGroupText. Ring/error state via aria-invalid on the container. Tokens throughout.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const inputGroupVariants = cva(
  "flex w-full min-w-0 rounded-md border border-border bg-card transition-[border-color,box-shadow] duration-fast focus-within:border-focus focus-within:shadow-[0_0_0_3px_var(--color-focus-ring)] aria-[invalid=true]:border-error aria-[invalid=true]:focus-within:shadow-[0_0_0_3px_var(--color-error-ring)] has-[:disabled]:opacity-50 has-[:disabled]:pointer-events-none",
  {
    variants: {
      block: {
        false: "items-center h-10",
        true: "flex-col items-stretch h-auto",
      },
    },
    defaultVariants: { block: false },
  }
)

export interface InputGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputGroupVariants> {}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, block, ...props }, ref) => (
    <div ref={ref} className={cn(inputGroupVariants({ block }), className)} {...props} />
  )
)
InputGroup.displayName = "InputGroup"

const InputGroupInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex-1 min-w-0 h-full border-0 bg-transparent outline-none shadow-none px-3 font-body text-body-md text-fg placeholder:text-fg-muted",
        className
      )}
      {...props}
    />
  )
)
InputGroupInput.displayName = "InputGroupInput"

const InputGroupTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex-1 min-w-0 border-0 bg-transparent outline-none shadow-none resize-none py-[10px] px-3 font-body text-body-md text-fg placeholder:text-fg-muted",
        className
      )}
      {...props}
    />
  )
)
InputGroupTextarea.displayName = "InputGroupTextarea"

const inputGroupAddonVariants = cva(
  "inline-flex items-center gap-2 text-on-surface-variant text-body-sm whitespace-nowrap [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      align: {
        "inline-start": "pl-3",
        "inline-end": "order-[99] pr-3",
        "block-start": "w-full px-3 pt-2",
        "block-end": "w-full px-3 pb-2 order-[99]",
      },
    },
    defaultVariants: { align: "inline-start" },
  }
)

export interface InputGroupAddonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputGroupAddonVariants> {}

const InputGroupAddon = React.forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className, align, ...props }, ref) => (
    <div ref={ref} className={cn(inputGroupAddonVariants({ align }), className)} {...props} />
  )
)
InputGroupAddon.displayName = "InputGroupAddon"

const InputGroupText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn("text-on-surface-variant text-body-sm", className)} {...props} />
  )
)
InputGroupText.displayName = "InputGroupText"

export {
  InputGroup,
  inputGroupVariants,
  InputGroupInput,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupText,
}
