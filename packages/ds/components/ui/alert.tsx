/**
 * Alert — inline, static message calling out information in context.
 *
 * Cuándo usar: mensajes persistentes en la página (aviso de sistema, validación de un
 * formulario completo, nota informativa). Cuándo no: feedback efímero de una acción (usar
 * Snackbar/Sonner), confirmación que interrumpe (usar Alert Dialog).
 * Reemplaza a: banners de aviso ad-hoc.
 *
 * Alert vs Snackbar (NO son duplicados): Alert es INLINE y PERSISTENTE — queda en el flujo
 * de la página hasta que se resuelve (resumen de errores de un form, aviso de mantenimiento).
 * Snackbar es FLOTANTE y EFÍMERO — se auto-descarta tras confirmar que algo ya pasó. Regla:
 * si debe seguir visible hasta que la persona actúe → Alert; si solo confirma un hecho → Snackbar.
 *
 * shadcn Alert structure (Alert / AlertTitle / AlertDescription, `role="alert"`, grid with
 * an optional leading icon), Embassy tokens. Adds semantic variants (info/success/warning/
 * error) mapped to Embassy container roles — MD3-flavored, still the shadcn skeleton.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 grid has-[>svg]:grid-cols-[auto_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 items-start [&>svg]:size-[18px] [&>svg]:translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-surface-container border-border text-on-surface [&>svg]:text-on-surface-variant",
        info: "bg-info-container border-transparent text-on-info-container [&>svg]:text-on-info-container",
        success: "bg-success-container border-transparent text-on-success-container [&>svg]:text-on-success-container",
        warning: "bg-warning-container border-transparent text-on-warning-container [&>svg]:text-on-warning-container",
        error: "bg-error-container border-transparent text-on-error-container [&>svg]:text-on-error-container",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
  )
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("col-start-2 text-body-md font-semibold leading-snug tracking-tight", className)} {...props} />
  )
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("col-start-2 text-body-sm leading-[1.6] [&_p]:leading-[1.6] opacity-90 mt-0.5", className)} {...props} />
  )
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription, alertVariants }
