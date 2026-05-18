import * as React from "react"
import { cn } from "../lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("card", className)} {...props} />
))
Card.displayName = "Card"

const FormCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("form-card", className)} {...props} />
))
FormCard.displayName = "FormCard"

const FormCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("form-card-title", className)} {...props} />
))
FormCardTitle.displayName = "FormCardTitle"

const FormCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("form-card-desc", className)} {...props} />
))
FormCardDescription.displayName = "FormCardDescription"

export { Card, FormCard, FormCardTitle, FormCardDescription }
