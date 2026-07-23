/**
 * Card — contenedor básico de contenido agrupado sobre una superficie.
 *
 * Cuándo usar: contenedor genérico de contenido agrupado sobre superficie.
 * Cuándo no: métricas (stat-card), personas (person-card), vacantes (vacancy-card).
 * Reemplaza a: paneles/boxes legacy con borde o sombra.
 *
 * MD3 tiene tres variantes de card, todas expresadas con roles Embassy:
 *   - outlined (predeterminado): superficie + borde 1px. Bajo énfasis, sin elevación.
 *   - elevated: surface-container-low + sombra sm, sin borde. Separación por elevación.
 *   - filled: surface-container-highest, sin borde ni sombra. Agrupación sutil.
 * Dark mode automático vía los roles --color-*; sin overrides por tema.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/card.css.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const cardVariants = cva("rounded-lg py-4 px-5", {
  variants: {
    variant: {
      outlined: "bg-card border border-border",
      elevated: "bg-surface-container-low border border-transparent shadow-sm",
      filled: "bg-surface-container-highest border border-transparent",
    },
  },
  defaultVariants: { variant: "outlined" },
})

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-3", className)} {...props} />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("font-heading text-heading-xs font-semibold text-fg", className)} {...props} />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-label text-fg-subtle leading-[1.55]", className)} {...props} />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-body-md text-fg", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-4 flex items-center gap-2", className)} {...props} />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, cardVariants, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
