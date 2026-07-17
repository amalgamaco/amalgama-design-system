import * as React from "react"
import { cn } from "../lib/utils"

export interface InputOTPProps {
  length?: number
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  numeric?: boolean
  disabled?: boolean
  className?: string
  containerClassName?: string
  "aria-label"?: string
}

/** Real <input maxlength="1"> per slot — auto-advance, backspace-back, paste-splitting. */
export const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  (
    {
      length = 6,
      value,
      defaultValue = "",
      onChange,
      onComplete,
      numeric = true,
      disabled,
      className,
      containerClassName,
      "aria-label": ariaLabel = "Código de verificación",
    },
    ref
  ) => {
    const isControlled = value !== undefined
    const [internal, setInternal] = React.useState(defaultValue)
    const current = isControlled ? value! : internal
    const chars = current.padEnd(length, " ").slice(0, length).split("")
    const inputsRef = React.useRef<(HTMLInputElement | null)[]>([])

    const setValue = (next: string) => {
      const trimmed = next.replace(/ +$/, "")
      if (!isControlled) setInternal(trimmed)
      onChange?.(trimmed)
      if (trimmed.length === length) onComplete?.(trimmed)
    }

    const updateChar = (index: number, char: string) => {
      const next = [...chars]
      next[index] = char || " "
      setValue(next.join(""))
    }

    const handleChange = (index: number, raw: string) => {
      const char = raw.slice(-1)
      if (numeric && char && !/[0-9]/.test(char)) return
      updateChar(index, char)
      if (char && index < length - 1) inputsRef.current[index + 1]?.focus()
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (!chars[index]?.trim() && index > 0) {
          inputsRef.current[index - 1]?.focus()
          updateChar(index - 1, "")
        } else {
          updateChar(index, "")
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        inputsRef.current[index - 1]?.focus()
      } else if (e.key === "ArrowRight" && index < length - 1) {
        inputsRef.current[index + 1]?.focus()
      }
    }

    const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const pasted = e.clipboardData.getData("text").replace(numeric ? /[^0-9]/g : /\s/g, "")
      if (!pasted) return
      const next = [...chars]
      for (let i = 0; i < pasted.length && index + i < length; i++) {
        next[index + i] = pasted[i]
      }
      setValue(next.join(""))
      inputsRef.current[Math.min(index + pasted.length, length - 1)]?.focus()
    }

    return (
      <div
        ref={ref}
        className={cn("otp-group", disabled && "is-disabled", containerClassName)}
        role="group"
        aria-label={ariaLabel}
      >
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el
            }}
            className={cn("otp-slot", className)}
            inputMode={numeric ? "numeric" : "text"}
            maxLength={1}
            autoComplete="one-time-code"
            disabled={disabled}
            value={chars[i]?.trim() ?? ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
            aria-label={`Dígito ${i + 1} de ${length}`}
          />
        ))}
      </div>
    )
  }
)
InputOTP.displayName = "InputOTP"
