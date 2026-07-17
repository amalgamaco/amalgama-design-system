import * as React from "react"
import { cn } from "../lib/utils"

export interface CalendarProps {
  /** "single" (default) or "range" selection. */
  mode?: "single" | "range"
  /** Selected date (mode="single"). */
  selected?: Date
  /** Selected range (mode="range"). */
  selectedRange?: { from?: Date; to?: Date }
  /** Fires on day click — receives the picked Date (single mode). */
  onSelect?: (date: Date) => void
  /** Fires on day click — receives the updated range (range mode). */
  onSelectRange?: (range: { from?: Date; to?: Date }) => void
  /** Month currently displayed; uncontrolled if omitted. */
  defaultMonth?: Date
  disabled?: (date: Date) => boolean
  className?: string
}

const WEEKDAY_FMT = new Intl.DateTimeFormat(undefined, { weekday: "short" })
const CAPTION_FMT = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" })

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
function isSameDay(a?: Date, b?: Date) {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const gridStart = new Date(year, month, 1 - first.getDay())
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    return d
  })
}

/**
 * Calendar — month grid for single/range date selection. Plain Date math, no
 * date-fns/react-day-picker; weekday/month labels use the browser's Intl API
 * (no explicit locale prop — this is a simplified vanilla equivalent, see the
 * "Nota de alcance" in calendar.css).
 */
function Calendar({
  mode = "single",
  selected,
  selectedRange,
  onSelect,
  onSelectRange,
  defaultMonth,
  disabled,
  className,
}: CalendarProps) {
  const initial = defaultMonth ?? selected ?? selectedRange?.from ?? new Date()
  const [viewYear, setViewYear] = React.useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = React.useState(initial.getMonth())
  const today = startOfDay(new Date())

  const days = buildMonthGrid(viewYear, viewMonth)
  const weekdayLabels = days.slice(0, 7).map((d) => WEEKDAY_FMT.format(d))

  function goMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  function handleDayClick(day: Date) {
    if (disabled?.(day)) return
    if (mode === "range") {
      const range = selectedRange ?? {}
      if (!range.from || (range.from && range.to)) {
        onSelectRange?.({ from: day, to: undefined })
      } else if (day < range.from) {
        onSelectRange?.({ from: day, to: range.from })
      } else {
        onSelectRange?.({ from: range.from, to: day })
      }
    } else {
      onSelect?.(day)
    }
  }

  function dayState(day: Date) {
    const outside = day.getMonth() !== viewMonth
    const isToday = isSameDay(day, today)
    const isDisabled = disabled?.(day) ?? false
    if (mode === "range" && selectedRange?.from) {
      const { from, to } = selectedRange
      const isStart = isSameDay(day, from)
      const isEnd = to ? isSameDay(day, to) : false
      const inMiddle = !!to && day > from && day < to
      return { outside, isToday, isDisabled, isSelected: isStart || isEnd, isStart, isEnd, inMiddle }
    }
    return { outside, isToday, isDisabled, isSelected: isSameDay(day, selected), isStart: false, isEnd: false, inMiddle: false }
  }

  return (
    <div className={cn("calendar", className)}>
      <div className="calendar-header">
        <button type="button" className="calendar-nav-btn prev" aria-label="Mes anterior" onClick={() => goMonth(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <span className="calendar-caption">{CAPTION_FMT.format(new Date(viewYear, viewMonth, 1))}</span>
        <button type="button" className="calendar-nav-btn next" aria-label="Mes siguiente" onClick={() => goMonth(1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
      <div className="calendar-weekdays">
        {weekdayLabels.map((label, i) => (
          <span key={i} className="calendar-weekday">{label}</span>
        ))}
      </div>
      <div className="calendar-grid" role="grid">
        {days.map((day, i) => {
          const { outside, isToday, isDisabled, isSelected, isStart, isEnd, inMiddle } = dayState(day)
          return (
            <button
              key={i}
              type="button"
              role="gridcell"
              disabled={isDisabled}
              aria-current={isToday ? "date" : undefined}
              aria-selected={isSelected || undefined}
              className={cn(
                "calendar-day",
                outside && "calendar-day-outside",
                isToday && "calendar-day-today",
                isSelected && "calendar-day-selected",
                isDisabled && "calendar-day-disabled",
                inMiddle && "calendar-day-range-middle",
                isStart && !isEnd && "calendar-day-range-start",
                isEnd && !isStart && "calendar-day-range-end"
              )}
              onClick={() => handleDayClick(day)}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
