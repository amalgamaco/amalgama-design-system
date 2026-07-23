/**
 * Table — tabla de datos con encabezados, filas hover y variante clickable.
 *
 * Cuándo usar: datos tabulares; filas navegables con tr.clickable.
 * Cuándo no: layouts (usar grid); tableros de flujo (usar Kanban).
 * Reemplaza a: tablas legacy.
 *
 * Canonical implementation. Decision rule migrated from the (now deleted) buildless css/components/table.css.
 */
import * as React from "react"
import { cn } from "../lib/utils"

// shadcn wraps <table> in an overflow-auto container so wide tables scroll inside
// their own box instead of pushing the page sideways. Embassy keeps the card
// chrome (bg/border/rounded) on that wrapper so rounded corners still clip the
// header fill. `ref` stays on the <table>, matching shadcn.
const DataTable = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-x-auto bg-card border border-border rounded-lg">
      <table
        ref={ref}
        className={cn("w-full border-collapse caption-bottom", className)}
        {...props}
      />
    </div>
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

const DataTableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn("bg-surface-variant border-t border-border font-medium text-fg [&>tr]:last:border-b-0", className)}
      {...props}
    />
  )
)
DataTableFooter.displayName = "DataTableFooter"

const DataTableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 px-4 pb-3 text-caption text-fg-muted text-left", className)} {...props} />
  )
)
DataTableCaption.displayName = "DataTableCaption"

/* Backward-compatible aliases (used in index.html code examples) */
const Table = DataTable
const TableHeader = DataTableHead
const TableBody = DataTableBody
const TableFooter = DataTableFooter
const TableRow = DataTableRow
const TableHead = DataTableHeaderCell
const TableCell = DataTableCell
const TableCaption = DataTableCaption

export {
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableFooter,
  DataTableRow,
  DataTableHeaderCell,
  DataTableCell,
  DataTableCaption,
  /* aliases */
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
}
