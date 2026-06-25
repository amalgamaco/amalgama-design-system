import { useState } from "react"
import { Calendar } from "@ds/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function DatePickerShowcase() {
  const [selected, setSelected] = useState<Date | undefined>(new Date())
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({})

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-label text-fg-subtle mb-3">Selección de día</p>
        <div className="flex items-start gap-6 flex-wrap">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={setSelected}
            locale={es}
          />
          {selected && (
            <div className="text-body-sm text-fg-subtle self-center">
              Seleccionado:{" "}
              <strong className="text-fg">{format(selected, "d 'de' MMMM, yyyy", { locale: es })}</strong>
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="text-label text-fg-subtle mb-3">Selección de rango</p>
        <div className="flex items-start gap-6 flex-wrap">
          <Calendar
            mode="range"
            selected={{ from: range.from, to: range.to }}
            onSelect={(r) => setRange(r ?? {})}
            locale={es}
            numberOfMonths={2}
          />
          {range.from && (
            <div className="text-body-sm text-fg-subtle self-center">
              Desde: <strong className="text-fg">{format(range.from, "d MMM yyyy", { locale: es })}</strong>
              {range.to && (
                <> — Hasta: <strong className="text-fg">{format(range.to, "d MMM yyyy", { locale: es })}</strong></>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
