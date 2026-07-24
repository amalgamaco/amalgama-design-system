/**
 * Data Table — tabla con columnas ordenables + filtro de texto + selección de
 * filas + visibilidad de columnas + paginación, sobre los primitivos Table +
 * Pagination + Checkbox + DropdownMenu.
 *
 * Cuándo usar: tablas con datos reales que necesitan ordenar/filtrar/paginar y,
 * opcionalmente, seleccionar filas o esconder columnas.
 * Cuándo no: una tabla estática de layout (usar Table directamente).
 * Reemplaza a: tablas con lógica de sort/filtro/selección cableada a mano.
 *
 * Versión simplificada (revert a plain CSS/vanilla JS): todo opera en memoria
 * sobre un array ya cargado en el cliente — sort (array.sort), filtro (substring
 * sobre los valores crudos de cada columna), selección (Set de row-ids) y
 * paginación por slice. Espeja el feature set del enhancer vanilla initDataTable()
 * de index.html. Fuera de alcance a propósito: resize/pin/drag de columnas,
 * filtros facetados, virtualización de filas.
 */
import * as React from "react"
import { cn } from "../lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
import { Checkbox } from "./checkbox"
import { Input } from "./input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "./dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "./pagination"

export interface DataTableColumn<T> {
  key: keyof T & string
  header: React.ReactNode
  sortable?: boolean
  cell?: (row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  pageSize?: number
  emptyText?: string
  className?: string
  /** Show a text filter above the table (matches, case-insensitive, against every column's raw value). */
  filterable?: boolean
  filterPlaceholder?: string
  /** Add a leading selection column (select-all + per-row) and a "N de M" count. */
  selectable?: boolean
  /** Called with the currently selected rows whenever selection changes. */
  onSelectionChange?: (rows: T[]) => void
  /** Show a column-visibility dropdown that hides/shows columns. */
  columnToggle?: boolean
  columnToggleLabel?: string
  /** Stable id per row (defaults to its index in `data`); keeps selection stable across sort/filter. */
  getRowId?: (row: T, index: number) => string
}

type SortState<T> = { key: keyof T & string; direction: "asc" | "desc" } | null

const SortIcon = ({ direction }: { direction: "asc" | "desc" | null }) => {
  if (direction === "asc") {
    return (
      <svg className="data-table-sort-icon is-active" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    )
  }
  if (direction === "desc") {
    return (
      <svg className="data-table-sort-icon is-active" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    )
  }
  return (
    <svg className="data-table-sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
    </svg>
  )
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  pageSize = 10,
  emptyText = "Sin resultados.",
  className,
  filterable = false,
  filterPlaceholder = "Filtrar…",
  selectable = false,
  onSelectionChange,
  columnToggle = false,
  columnToggleLabel = "Columnas",
  getRowId,
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<SortState<T>>(null)
  const [page, setPage] = React.useState(1)
  const [filter, setFilter] = React.useState("")
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [hiddenCols, setHiddenCols] = React.useState<Set<string>>(new Set())

  // Wrap each datum with a stable id so selection survives sort/filter reorders.
  const rows = React.useMemo(
    () => data.map((row, index) => ({ row, id: getRowId ? getRowId(row, index) : String(index) })),
    [data, getRowId]
  )

  const filtered = React.useMemo(() => {
    if (!filter) return rows
    const q = filter.toLowerCase()
    return rows.filter(({ row }) =>
      columns.some((c) => String(row[c.key] ?? "").toLowerCase().includes(q))
    )
  }, [rows, filter, columns])

  const sorted = React.useMemo(() => {
    if (!sort) return filtered
    const { key, direction } = sort
    return [...filtered].sort((a, b) => {
      const av = a.row[key]
      const bv = b.row[key]
      if (av === bv) return 0
      const cmp = av! > bv! ? 1 : -1
      return direction === "asc" ? cmp : -cmp
    })
  }, [filtered, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const clampedPage = Math.min(page, totalPages)
  const paged = sorted.slice((clampedPage - 1) * pageSize, clampedPage * pageSize)

  const visibleColumns = columns.filter((c) => !hiddenCols.has(c.key))
  const colSpan = visibleColumns.length + (selectable ? 1 : 0)

  // Selection is scoped to the current filter, matching the vanilla enhancer.
  const filteredIds = filtered.map((r) => r.id)
  const selectedInView = filteredIds.filter((id) => selected.has(id)).length
  const allSelected = filtered.length > 0 && selectedInView === filtered.length
  const someSelected = selectedInView > 0 && !allSelected

  const toggleSort = (key: keyof T & string) => {
    setPage(1)
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: "asc" }
      if (prev.direction === "asc") return { key, direction: "desc" }
      return null
    })
  }

  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (allSelected) filteredIds.forEach((id) => next.delete(id))
      else filteredIds.forEach((id) => next.add(id))
      return next
    })

  const toggleColumn = (key: string) =>
    setHiddenCols((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  React.useEffect(() => {
    if (!onSelectionChange) return
    onSelectionChange(rows.filter((r) => selected.has(r.id)).map((r) => r.row))
    // Re-run only when the selection set changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  const showToolbar = filterable || columnToggle

  return (
    <div className={className}>
      {showToolbar && (
        <div className="data-table-toolbar">
          {filterable ? (
            <Input
              className="data-table-filter"
              type="text"
              placeholder={filterPlaceholder}
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value)
                setPage(1)
              }}
              aria-label={filterPlaceholder}
            />
          ) : (
            <span />
          )}
          {columnToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger className="btn-tertiary btn-sm">
                {columnToggleLabel}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {columns.map((col) => {
                  const visible = !hiddenCols.has(col.key)
                  return (
                    <button
                      key={col.key}
                      type="button"
                      role="menuitemcheckbox"
                      aria-checked={visible}
                      className="dropdown-item dropdown-checkbox-item"
                      onClick={() => toggleColumn(col.key)}
                    >
                      <span className="dropdown-item-indicator">{visible ? "✓" : ""}</span>
                      {col.header}
                    </button>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="data-table-select">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                  aria-label="Seleccionar todo"
                />
              </TableHead>
            )}
            {visibleColumns.map((col) => (
              <TableHead
                key={col.key}
                aria-sort={
                  sort?.key === col.key
                    ? sort.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                {col.sortable ? (
                  <button
                    type="button"
                    className="data-table-sort-btn"
                    onClick={() => toggleSort(col.key)}
                  >
                    {col.header}
                    <SortIcon direction={sort?.key === col.key ? sort.direction : null} />
                  </button>
                ) : (
                  col.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.length ? (
            paged.map(({ row, id }) => (
              <TableRow key={id} selected={selectable && selected.has(id)}>
                {selectable && (
                  <TableCell className="data-table-select">
                    <Checkbox
                      checked={selected.has(id)}
                      onChange={() => toggleRow(id)}
                      aria-label="Seleccionar fila"
                    />
                  </TableCell>
                )}
                {visibleColumns.map((col) => (
                  <TableCell key={col.key}>
                    {col.cell ? col.cell(row) : String(row[col.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={colSpan} className="data-table-empty">
                {emptyText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {(selectable || totalPages > 1) && (
        <div className="data-table-footer">
          <span className="data-table-count">
            {selectable
              ? `${selectedInView} de ${filtered.length} fila(s) seleccionada(s).`
              : `Página ${clampedPage} de ${totalPages} · ${sorted.length} filas`}
          </span>
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setPage((p) => Math.max(1, p - 1))
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <PaginationItem key={n}>
                    <PaginationLink
                      href="#"
                      isActive={n === clampedPage}
                      onClick={(e) => {
                        e.preventDefault()
                        setPage(n)
                      }}
                    >
                      {n}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setPage((p) => Math.min(totalPages, p + 1))
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  )
}
