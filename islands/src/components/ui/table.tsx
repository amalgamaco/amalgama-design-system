import * as React from "react"
import { cn } from "../../lib/utils"

const DataTable = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <table
      ref={ref}
      className={cn("w-full border-collapse bg-card border border-border rounded-lg overflow-hidden", className)}
      {...props}
    />
  )
)
DataTable.displayName = "DataTable"

const DataTableHead = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn("bg-surface-variant border-b border-border", className)}
      {...props}
    />
  )
)
DataTableHead.displayName = "DataTableHead"

const DataTableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn(className)} {...props} />
  )
)
DataTableBody.displayName = "DataTableBody"

export interface DataTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  clickable?: boolean
}

const DataTableRow = React.forwardRef<HTMLTableRowElement, DataTableRowProps>(
  ({ className, clickable, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "transition-colors duration-fast hover:bg-surface-variant",
        clickable && "cursor-pointer focus-visible:focus-ring",
        className
      )}
      {...props}
    />
  )
)
DataTableRow.displayName = "DataTableRow"

const DataTableHeaderCell = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn("px-4 py-[10px] text-overline font-semibold text-fg-muted uppercase tracking-[0.5px] text-left", className)}
      {...props}
    />
  )
)
DataTableHeaderCell.displayName = "DataTableHeaderCell"

const DataTableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn("px-4 py-3 text-body-md text-fg border-t border-border", className)}
      {...props}
    />
  )
)
DataTableCell.displayName = "DataTableCell"

export {
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableHeaderCell,
  DataTableCell,
}
