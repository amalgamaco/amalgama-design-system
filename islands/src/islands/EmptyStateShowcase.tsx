import { EmptyState } from "@ds/empty-state"
import { Button } from "@ds/button"

export function EmptyStateShowcase() {
  return (
    <EmptyState
      icon={
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 48, height: 48, color: "var(--color-on-surface-variant)" }}>
          <circle cx="24" cy="24" r="18" />
          <path d="M24 16v8M24 28v2" />
        </svg>
      }
      title="Sin resultados"
      description="No encontramos vacantes que coincidan con los filtros aplicados. Probá ajustando tu búsqueda."
    >
      <Button variant="primary" size="sm">Limpiar filtros</Button>
    </EmptyState>
  )
}

// Specs-tab canonical anatomy demo (was inline `class="empty-state"` markup).
export function EmptyStateAnatomy() {
  return (
    <EmptyState
      icon={<span aria-hidden="true">📋</span>}
      title="Sin vacantes"
      description="Aun no has creado ninguna vacante. Crea tu primera vacante para empezar a recibir candidatos."
    >
      <Button variant="primary">Crear vacante</Button>
    </EmptyState>
  )
}
