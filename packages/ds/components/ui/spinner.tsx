/**
 * Spinner — indicador de carga rotatorio indeterminado.
 *
 * Cuándo usar: carga breve/indeterminada dentro de botones, inputs, celdas, o
 *   junto a un texto ("Guardando…").
 * Cuándo no: carga con estructura conocida (Skeleton); progreso medible (Progress).
 * Reemplaza a: spinners custom ad-hoc.
 *
 * Official shadcn/ui component (Spinner). Embassy keeps its established bordered-ring
 * visual (border-top accent) instead of shadcn's Loader2 icon — both are indeterminate
 * spinners; the ring is Embassy's identity. Uses Tailwind `animate-spin` (canonical),
 * a slight timing divergence from the buildless spec's 0.7s. Tokens throughout.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const spinnerVariants = cva(
  "inline-block shrink-0 rounded-full border-outline-variant border-t-primary animate-spin align-[-3px] motion-reduce:[animation-duration:1.6s]",
  {
    variants: {
      size: {
        sm: "size-3 border-2",
        default: "size-4 border-2",
        lg: "size-6 border-[3px]",
      },
      /** On a filled/color surface (button, snackbar): ring contrasts via on-primary. */
      onPrimary: {
        true: "border-[color-mix(in_srgb,var(--color-on-primary)_35%,transparent)] border-t-on-primary",
      },
    },
    defaultVariants: { size: "default" },
  }
)

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, onPrimary, role = "status", ...props }, ref) => (
    <span
      ref={ref}
      role={role}
      aria-label={props["aria-label"] ?? "Cargando"}
      className={cn(spinnerVariants({ size, onPrimary }), className)}
      {...props}
    />
  )
)
Spinner.displayName = "Spinner"

export { Spinner, spinnerVariants }
