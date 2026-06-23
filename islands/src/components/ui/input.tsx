import * as React from "react"
import { cn } from "../../lib/utils"

// shadcn Input/Textarea restyled to Embassy `.field-input`: padding 10/14, border
// --border, radius-md, body-md text, --card-bg surface, focus = primary border +
// 3px focus-ring.
const fieldBase =
  "w-full rounded-md border border-border bg-[var(--card-bg)] px-3.5 py-2.5 text-[13.5px] text-[var(--text-primary)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--text-muted)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-focus-ring)] disabled:cursor-not-allowed disabled:bg-muted disabled:text-[var(--color-on-disabled)]"

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input ref={ref} type={type} className={cn(fieldBase, className)} {...props} />
))
Input.displayName = "Input"

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(fieldBase, "min-h-20 resize-y leading-normal", className)} {...props} />
))
Textarea.displayName = "Textarea"
