/**
 * Button — jerarquía de énfasis (alto → bajo).
 *
 * Cuándo usar: acciones. Jerarquía obligatoria: UN solo btn-primary por contexto; btn-secondary para alternativas; btn-tertiary menor peso; btn-text acciones inline.
 * Cuándo no: navegación (usar links/nav). NUNCA estirar a full-width ni alinear contenido a la izquierda — el botón tiene ancho intrínseco y contenido centrado; si el layout legacy lo pide, se cambia el layout, no el botón.
 * Reemplaza a: cualquier botón/CTA legacy; un "action row" plano se mapea a grupo con jerarquía (un primary + alternativas).
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/button.css.
 */
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const buttonVariants = cva(
  // Base: layout, typography, cursor, transition. No padding/radius — each variant sets its own
  // so tailwind-merge can cleanly resolve size overrides.
  // Spatial (transform: press/lift) uses the Expressive overshoot curve; effects
  // (color/background/shadow) stay on Standard — MD3 never overshoots effects.
  "inline-flex items-center justify-center gap-2 border font-semibold leading-[1.2] cursor-pointer whitespace-nowrap no-underline transition-[background-color,border-color,color,box-shadow,transform] duration-fast [transition-timing-function:var(--ease-default),var(--ease-default),var(--ease-default),var(--ease-default),var(--ease-expressive)] focus-visible:focus-ring",
  {
    variants: {
      variant: {
        primary:
          "px-6 py-2 rounded-md bg-primary text-on-primary border-transparent hover:bg-primary-hover hover:-translate-y-px active:brightness-[0.88] active:translate-y-0 active:scale-[0.96] disabled:bg-disabled disabled:text-on-disabled disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none",
        secondary:
          "px-6 py-2 rounded-md bg-secondary-container text-on-secondary-container border-transparent hover:bg-secondary-container-hover hover:-translate-y-px active:brightness-[0.92] active:translate-y-0 active:scale-[0.96] disabled:bg-disabled disabled:text-on-disabled disabled:cursor-not-allowed",
        tertiary:
          "px-6 py-2 rounded-md bg-transparent border-outline text-primary font-medium hover:bg-surface-variant hover:border-primary active:bg-surface-container-high active:scale-[0.96] disabled:bg-transparent disabled:border-outline-variant disabled:text-on-disabled disabled:cursor-not-allowed",
        text:
          "px-3 py-2 rounded-md bg-transparent border-transparent text-primary hover:bg-primary-state-hover active:bg-primary-state-press active:scale-[0.96] disabled:bg-transparent disabled:text-on-disabled disabled:cursor-not-allowed",
        icon:
          "w-9 h-9 p-0 rounded-md bg-surface-container border-outline text-on-surface-variant hover:bg-surface-variant hover:text-on-surface active:bg-surface-container-high active:scale-[0.9] disabled:bg-transparent disabled:border-outline-variant disabled:text-on-disabled disabled:cursor-not-allowed",
        danger:
          "px-6 py-2 rounded-md bg-error text-on-error border-transparent hover:bg-error-hover hover:-translate-y-px active:brightness-[0.88] active:translate-y-0 active:scale-[0.96] disabled:bg-disabled disabled:text-on-disabled disabled:cursor-not-allowed",
        success:
          "px-6 py-2 rounded-md bg-success text-on-success border-transparent hover:bg-success-hover hover:-translate-y-px active:brightness-[0.88] active:translate-y-0 active:scale-[0.96] disabled:bg-disabled disabled:text-on-disabled disabled:cursor-not-allowed",
        next:
          "px-6 py-2 rounded-md bg-primary text-on-primary border-transparent hover:bg-primary-hover active:brightness-[0.88] active:scale-[0.96] disabled:bg-disabled disabled:text-on-disabled disabled:cursor-not-allowed",
        ghost:
          "px-6 py-2 rounded-md bg-transparent border-outline text-primary font-medium hover:bg-surface-variant hover:border-primary active:bg-surface-container-high active:scale-[0.96] disabled:bg-transparent disabled:border-outline-variant disabled:text-on-disabled disabled:cursor-not-allowed",
      },
      size: {
        default: "",
        xs: "px-2 py-[3px] text-[11px] min-h-6 rounded-sm",
        sm: "px-3 py-1.5 text-body-sm min-h-8 rounded-sm",
        lg: "px-[22px] py-2.5 text-[15px] min-h-11 rounded-md",
        xl: "px-[30px] py-3.5 text-base font-bold min-h-[52px] rounded-lg",
      },
      compact: {
        true: "px-4",
      },
    },
    compoundVariants: [
      // Icon button sizes override w/h
      { variant: "icon", size: "sm", class: "w-[30px] h-[30px] rounded-sm" },
      { variant: "icon", size: "lg", class: "w-11 h-11" },
      { variant: "icon", size: "xl", class: "w-[52px] h-[52px] rounded-lg" },
      // Text button size overrides (different padding than filled buttons)
      { variant: "text", size: "xs", class: "px-1.5 py-[3px]" },
      { variant: "text", size: "sm", class: "px-2.5 py-1.5" },
      { variant: "text", size: "lg", class: "px-4 py-2.5" },
      { variant: "text", size: "xl", class: "px-5 py-3.5" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as the child element (e.g. an `<a>`/`next/link`) instead of a `<button>`, via Radix Slot — same escape hatch shadcn/ui's Button provides. */
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, compact, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, compact, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
