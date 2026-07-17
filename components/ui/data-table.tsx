/**
 * Data Table — tabla con columnas ordenables + paginación, sobre los
 * primitivos Table + Pagination.
 *
 * Cuándo usar: tablas con datos reales que necesitan ordenar/paginar por columna.
 * Cuándo no: una tabla estática de layout (usar Table directamente).
 * Reemplaza a: tablas con lógica de sort/paginado cableada a mano.
 *
 * Versión simplificada (revert a plain CSS/vanilla JS): sort en memoria
 * (array.sort) + paginación por slice de un array ya cargado en el cliente.
 * Sin resize/pin/drag de columnas, sin filtros facetados, sin virtualización.
 * Config de columnas simple ({ key, header, sortable?, cell? }) — cubre el
 * 80% de uso real, no un sistema genérico de render-props por columna.
 */
import * as React from "react"
import { cn } from "../lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
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
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<SortState<T>>(null)
  const [page, setPage] = React.useState(1)

  const sorted = React.useMemo(() => {
    if (!sort) return data
    const { key, direction } = sort
    return [...data].sort((a, b) => {
      const av = a[key]
      const bv = b[key]
      if (av === bv) return 0
      const cmp = av! > bv! ? 1 : -1
      return direction === "asc" ? cmp : -cmp
    })
  }, [data, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const clampedPage = Math.min(page, totalPages)
  const paged = sorted.slice((clampedPage - 1) * pageSize, clampedPage * pageSize)

  const toggleSort = (key: keyof T & string) => {
    setPage(1)
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: "asc" }
      if (prev.direction === "asc") return { key, direction: "desc" }
      return null
    })
  }

  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>
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
            paged.map((row, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.cell ? col.cell(row) : String(row[col.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} style={{ textAlign: "center", height: 96 }}>
                {emptyText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="data-table-footer">
          <span className="data-table-count">
            Página {clampedPage} de {totalPages} · {sorted.length} filas
          </span>
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
        </div>
      )}
    </div>
  )
}
