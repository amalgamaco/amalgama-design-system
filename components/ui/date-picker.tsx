/**
 * Date Picker — trigger Button + Calendar in a floating panel ("docked" composition).
 *
 * Cuándo usar: elegir una fecha (o rango) desde un campo de formulario o toolbar.
 * Cuándo no: entrada de texto libre de fecha (usar Input type="date" nativo si no hace falta
 * calendario); elegir mes/año sueltos (usar Select).
 * Reemplaza a: inputs de fecha ad-hoc sin calendario accesible.
 *
 * Nota de alcance (revert a vanilla): sin dependencia de date-fns — el formato de fecha en el
 * trigger usa Intl.DateTimeFormat nativo. Sin detección de colisión de viewport en el panel.
 */
import * as React from "react"
import { Calendar } from "./calendar"
import { cn } from "../lib/utils"

export interface DatePickerProps {
  /** Controlled selected date. */
  value?: Date
  /** Called when a day is picked; the panel closes automatically. */
  onChange?: (date: Date | undefined) => void
  /** Placeholder shown when no date is selected. */
  placeholder?: string
  /** Intl.DateTimeFormatOptions for the trigger label (defaults to long date). */
  displayFormat?: Intl.DateTimeFormatOptions
  disabled?: boolean
  className?: string
  /** Accessible label for the trigger when there's no visible field label. */
  "aria-label"?: string
}

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }

/**
 * Docked single-date picker. For a form field with label/hint/error, wrap this trigger in the
 * Form field pattern; this component owns only the calendar-in-a-panel behavior.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = "Elegir fecha",
  displayFormat = DEFAULT_FORMAT,
  disabled,
  className,
  "aria-label": ariaLabel,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onDocClick)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const label = value ? new Intl.DateTimeFormat(undefined, displayFormat).format(value) : placeholder

  return (
    <div className={cn("date-picker", className)} ref={rootRef}>
      <button
        type="button"
        className={cn("date-picker-trigger", "btn-tertiary", !value && "date-picker-trigger-empty")}
        disabled={disabled}
        aria-label={ariaLabel ?? (value ? undefined : placeholder)}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <svg className="date-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        {label}
      </button>
      {open && (
        <div className="date-picker-panel" role="dialog">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(d) => {
              onChange?.(d)
              setOpen(false)
            }}
          />
        </div>
      )}
    </div>
  )
}
