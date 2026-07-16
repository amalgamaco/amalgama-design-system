/**
 * Date Picker — the "docked" composition shadcn documents: a Popover + a trigger Button
 * showing the selected date, opening a Calendar. Not a new Radix primitive — it composes
 * Popover + Button + Calendar, which is exactly how shadcn ships Date Picker (a recipe, not
 * a primitive). Exported here as a first-class, copy-paste component.
 *
 * Cuándo usar: elegir una fecha (o rango) desde un campo de formulario o toolbar.
 * Cuándo no: entrada de texto libre de fecha (usar Input type="date" nativo si no hace falta
 * calendario); elegir mes/año sueltos (usar Select).
 * Reemplaza a: inputs de fecha ad-hoc sin calendario accesible.
 */
import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "./calendar"
import { Popover, PopoverTrigger, PopoverContent } from "./popover"
import { Button } from "./button"
import { cn } from "../lib/utils"

export interface DatePickerProps {
  /** Controlled selected date. */
  value?: Date
  /** Called when a day is picked; the popover closes automatically. */
  onChange?: (date: Date | undefined) => void
  /** Placeholder shown when no date is selected. */
  placeholder?: string
  /** date-fns format string for the trigger label. */
  displayFormat?: string
  disabled?: boolean
  className?: string
  /** Accessible label for the trigger when there's no visible field label. */
  "aria-label"?: string
}

/**
 * Docked single-date picker. For a form field with label/hint/error, wrap this trigger in the
 * Form field pattern; this component owns only the calendar-in-a-popover behavior.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = "Elegir fecha",
  displayFormat = "d 'de' MMMM, yyyy",
  disabled,
  className,
  "aria-label": ariaLabel,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="tertiary"
          disabled={disabled}
          aria-label={ariaLabel ?? (value ? undefined : placeholder)}
          className={cn("w-[240px] justify-start font-normal", !value && "text-[var(--text-muted)]", className)}
        >
          <CalendarIcon className="mr-2 size-[18px]" />
          {value ? format(value, displayFormat, { locale: es }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => {
            onChange?.(d)
            setOpen(false)
          }}
          locale={es}
        />
      </PopoverContent>
    </Popover>
  )
}
