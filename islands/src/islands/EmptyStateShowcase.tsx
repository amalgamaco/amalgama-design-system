import { EmptyState } from "../components/ui/empty-state"
import { Button } from "../components/ui/button"

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
