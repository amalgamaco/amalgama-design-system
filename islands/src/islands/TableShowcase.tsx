import { Badge } from "../components/ui/badge"
import {
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableHeaderCell,
  DataTableCell,
} from "../components/ui/table"

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
