import { KanbanCard, KanbanColumn } from "../components/ui/kanban-card"

export function KanbanShowcase() {
  return (
    <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
      <KanbanColumn title="Aplicados" count={3}>
        <KanbanCard
          title="María González"
          badgeLabel="Nuevo"
          badgeVariant="info"
          meta="Hace 2 h"
          avatarLabel="MG"
        />
        <KanbanCard
          title="Carlos López"
          badgeLabel="Nuevo"
          badgeVariant="info"
          meta="Hace 5 h"
          avatarLabel="CL"
        />
        <KanbanCard
          title="Ana Martínez"
          meta="Ayer"
          avatarLabel="AM"
        />
      </KanbanColumn>

      <KanbanColumn title="En revisión" count={2}>
        <KanbanCard
          title="Juan Pérez"
          badgeLabel="Activa"
          badgeVariant="active"
          meta="3 días"
          avatarLabel="JP"
        />
        <KanbanCard
          title="Laura Sánchez"
          meta="4 días"
          avatarLabel="LS"
        />
      </KanbanColumn>

      <KanbanColumn title="Entrevistas" count={1}>
        <KanbanCard
          title="Roberto Díaz"
          badgeLabel="Entrevista"
          badgeVariant="tertiary"
          meta="Hoy 15:00"
          avatarLabel="RD"
        />
      </KanbanColumn>

      <KanbanColumn title="Oferta" count={0}>
        <div className="text-label text-fg-subtle text-center py-4 px-2">
          Sin candidatos
        </div>
      </KanbanColumn>
    </div>
  )
}
