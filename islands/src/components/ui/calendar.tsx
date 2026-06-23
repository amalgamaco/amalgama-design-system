import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "../../lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-surface border border-border rounded-lg inline-block", className)}
      classNames={{
        months: "flex gap-4",
        month: "space-y-3",
        month_caption: "flex items-center justify-between px-1 pb-1",
        caption_label: "font-heading text-body-md font-semibold text-fg",
        nav: "flex items-center gap-1",
        button_previous: [
          "flex h-7 w-7 items-center justify-center rounded hover:bg-surface-variant text-fg",
          "disabled:opacity-30 disabled:cursor-not-allowed transition-colors",
        ].join(" "),
        button_next: [
          "flex h-7 w-7 items-center justify-center rounded hover:bg-surface-variant text-fg",
          "disabled:opacity-30 disabled:cursor-not-allowed transition-colors",
        ].join(" "),
        month_grid: "border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-center text-label text-fg-subtle pb-1",
        week: "flex w-full mt-0.5",
        day: "w-9 h-9 p-0 text-center",
        day_button: [
          "h-9 w-9 rounded text-body-sm text-fg transition-colors",
          "hover:bg-surface-variant focus:outline-none focus-visible:focus-ring",
        ].join(" "),
        // `selected` must beat `today` when a day is both — important keeps the
        // on-primary label legible on the primary fill (equal-specificity utilities
        // otherwise resolve by source order, which `text-primary` was winning).
        selected: "[&>button]:bg-primary! [&>button]:text-on-primary! [&>button]:hover:bg-primary",
        today: "[&>button]:font-bold [&>button]:text-primary",
        outside: "[&>button]:text-fg-subtle [&>button]:opacity-40",
        disabled: "[&>button]:opacity-30 [&>button]:cursor-not-allowed",
        range_middle: "[&>button]:bg-primary-container [&>button]:text-on-primary-container [&>button]:rounded-none",
        range_start: "[&>button]:rounded-r-none",
        range_end: "[&>button]:rounded-l-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
