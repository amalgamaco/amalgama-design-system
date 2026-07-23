import * as React from "react"
import { Calendar } from "@ds/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@ds/popover"
import { Button } from "@ds/button"
import { cn } from "@ds/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

/* ────────────────────────────────────────────────────────────
 * Date Picker Field — the "docked" composition shadcn/shadcnstudio
 * document: Popover + a Button trigger (outline-equivalent = Embassy's
 * `tertiary`) showing the selected date, opening a Calendar with zero
 * popover padding (`p-0`) so Calendar's own `p-3` controls spacing —
 * same override shadcn/ui uses. Closes automatically on select.
 *
 * This is an islands-layer composition, not a new packages/ds
 * primitive — Popover/Button/Calendar are the only building blocks,
 * exactly as documented in Date Picker → Guidelines → "Docked date picker".
 * ──────────────────────────────────────────────────────────── */

export function DatePickerFieldShowcase() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="tertiary"
          className={cn("w-[240px] justify-start font-normal", !date && "text-fg-subtle")}
        >
          <CalendarIcon className="mr-2 size-[18px]" />
          {date ? format(date, "d 'de' MMMM, yyyy", { locale: es }) : "Elegir fecha"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            setDate(d)
            setOpen(false)
          }}
          locale={es}
        />
      </PopoverContent>
    </Popover>
  )
}
