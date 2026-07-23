import { KanbanCard, KanbanColumn } from "@ds/kanban-card"

/**
 * Specs-tab "Kanban Board" live example.
 * Reproduces the original static .kanban-board markup (Aplicados / Entrevista /
 * Oferta) using the real @ds/kanban-card components instead of CSS-class markup.
 */
export function KanbanSpecsBoard() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      <KanbanColumn title="Aplicados" count={3}>
        <KanbanCard title="Maria Lopez" meta="Disenadora UX · hace 2d" avatarLabel="ML" />
        <KanbanCard title="Pedro Ruiz" meta="Frontend Dev · hace 3d" avatarLabel="PR" />
        <KanbanCard title="Sofia Torres" meta="PM · hace 5d" avatarLabel="ST" />
      </KanbanColumn>

      <KanbanColumn title="Entrevista" count={2}>
        <KanbanCard title="Carlos Vega" meta="Backend Dev · hace 1d" avatarLabel="CV" />
        <KanbanCard title="Ana Garcia" meta="QA · hace 4d" avatarLabel="AG" />
      </KanbanColumn>

      <KanbanColumn title="Oferta" count={1}>
        <KanbanCard title="Luis Mendoza" meta="Data Analyst · hace 1d" avatarLabel="LM" />
      </KanbanColumn>
    </div>
  )
}
