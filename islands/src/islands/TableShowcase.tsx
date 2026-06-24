import { Badge } from "@ds/badge"
import {
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableHeaderCell,
  DataTableCell,
} from "@ds/table"

const rows = [
  { name: "Ana García",    role: "Diseñadora UX",   status: "active"  as const, date: "12 jun 2025" },
  { name: "Luis Ramírez",  role: "Frontend Dev",     status: "open"    as const, date: "08 jun 2025" },
  { name: "María López",   role: "Product Manager",  status: "draft"   as const, date: "01 jun 2025" },
  { name: "Carlos Pérez",  role: "Backend Dev",      status: "closed"  as const, date: "25 may 2025" },
]

const statusLabel: Record<string, string> = {
  active:  "Activo",
  open:    "En proceso",
  draft:   "Pendiente",
  closed:  "Cerrado",
}

export function TableShowcase() {
  return (
    <DataTable>
      <DataTableHead>
        <DataTableRow>
          <DataTableHeaderCell>Candidato</DataTableHeaderCell>
          <DataTableHeaderCell>Rol</DataTableHeaderCell>
          <DataTableHeaderCell>Estado</DataTableHeaderCell>
          <DataTableHeaderCell>Fecha</DataTableHeaderCell>
        </DataTableRow>
      </DataTableHead>
      <DataTableBody>
        {rows.map((row) => (
          <DataTableRow key={row.name} clickable>
            <DataTableCell className="font-medium text-fg">{row.name}</DataTableCell>
            <DataTableCell>{row.role}</DataTableCell>
            <DataTableCell>
              <Badge variant={row.status}>{statusLabel[row.status]}</Badge>
            </DataTableCell>
            <DataTableCell className="text-fg-muted">{row.date}</DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  )
}

// ── Specs-tab demos (were inline `class="data-table"` markup) ──────────────
const specsRows = [
  { name: "Mercedes Garcia", role: "Disenadora UX", dept: "Producto",   status: "active"  as const, label: "Activa" },
  { name: "Carlos Lopez",    role: "Desarrollador", dept: "Ingenieria", status: "active"  as const, label: "Activa" },
  { name: "Ana Martinez",    role: "PM",            dept: "Producto",   status: "warning" as const, label: "Pendiente" },
]

function SpecsTable({ clickable = false }: { clickable?: boolean }) {
  return (
    <DataTable>
      <DataTableHead>
        <DataTableRow>
          <DataTableHeaderCell>Nombre</DataTableHeaderCell>
          <DataTableHeaderCell>Puesto</DataTableHeaderCell>
          <DataTableHeaderCell>Departamento</DataTableHeaderCell>
          <DataTableHeaderCell>Estado</DataTableHeaderCell>
        </DataTableRow>
      </DataTableHead>
      <DataTableBody>
        {specsRows.map((r) => (
          <DataTableRow key={r.name} clickable={clickable} tabIndex={clickable ? 0 : undefined}>
            <DataTableCell>{r.name}</DataTableCell>
            <DataTableCell>{r.role}</DataTableCell>
            <DataTableCell>{r.dept}</DataTableCell>
            <DataTableCell><Badge variant={r.status}>{r.label}</Badge></DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  )
}

export function TableBasic() { return <SpecsTable /> }
export function TableClickable() { return <SpecsTable clickable /> }
