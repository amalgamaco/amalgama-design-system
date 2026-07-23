/**
 * Data Table — the shadcn Data Table recipe made reusable: TanStack Table (@tanstack/react-table)
 * headless logic rendered through the Embassy Table primitives, with built-in sorting.
 *
 * Cuándo usar: tablas con datos reales que necesitan ordenar / paginar / filtrar por columnas.
 * Cuándo no: una tabla estática de layout (usar Table directamente). Reemplaza a: tablas con lógica
 * de sort/paginado cableada a mano.
 *
 * shadcn Data Table structure (TanStack), rendered with Embassy `Table*`. Column definitions and
 * server/client paging are the consumer's — this owns the render + sortable headers. Canonical.
 */
import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
import { cn } from "../lib/utils"

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  /** Message shown when there are no rows. */
  emptyText?: string
}

export function DataTable<TData, TValue>({ columns, data, emptyText = "Sin resultados." }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const canSort = header.column.getCanSort()
              const sorted = header.column.getIsSorted()
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : canSort ? (
                    <button
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      className={cn(
                        "-mx-2 inline-flex items-center gap-1.5 rounded-sm px-2 py-1 font-medium text-on-surface outline-none",
                        "hover:bg-[var(--color-nav-hover)] hover:text-[var(--color-nav-hover-content)] focus-visible:focus-ring"
                      )}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {sorted === "asc" ? (
                        <ArrowUp className="size-3.5" />
                      ) : sorted === "desc" ? (
                        <ArrowDown className="size-3.5" />
                      ) : (
                        <ChevronsUpDown className="size-3.5 opacity-50" />
                      )}
                    </button>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center text-on-surface-variant">
              {emptyText}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
