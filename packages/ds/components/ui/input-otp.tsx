/**
 * Input OTP — one-time-code / PIN entry with individual character slots, built on input-otp.
 *
 * Cuándo usar: códigos de verificación (2FA, SMS, email), PIN. Cuándo no: texto libre (usar Input);
 * un solo dígito (usar Input). Reemplaza a: inputs de código hechos con N campos separados.
 *
 * shadcn InputOTP structure, Embassy tokens — slots use the Form field border/focus language
 * (focus ring, active caret). Canonical implementation.
 */
import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Minus } from "lucide-react"
import { cn } from "../lib/utils"

export const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

export const InputOTPGroup = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center gap-1.5", className)} {...props} />
)
InputOTPGroup.displayName = "InputOTPGroup"

export const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const slot = inputOTPContext.slots[index]
  const { char, hasFakeCaret, isActive } = slot ?? { char: null, hasFakeCaret: false, isActive: false }

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex size-10 items-center justify-center rounded-md border border-border text-body-md font-medium text-fg",
        "transition-[border-color,box-shadow] duration-fast ease-default",
        isActive && "z-10 border-link shadow-[0_0_0_3px_var(--color-focus-ring)]",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-fg duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

export const InputOTPSeparator = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ ...props }, ref) => (
    <div ref={ref} role="separator" {...props}>
      <Minus className="size-4 text-on-surface-variant" />
    </div>
  )
)
InputOTPSeparator.displayName = "InputOTPSeparator"
