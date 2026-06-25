import { VacancyCard } from "@ds/vacancy-card"

// Specs tab — single live Vacancy Card example, rendered via the real
// @ds VacancyCard component (replaces the static .vacancy-card CSS markup).
// The package wrapper is the simplified variant: single icon + name + badge +
// department meta line + trailing meta (age). No stat-pills / multi-assignee,
// matching the documented "wrapper es una variante simplificada" note.
export function VacancySpecExample() {
  return (
    <VacancyCard
      icon="💼"
      name="Diseñador UX Senior"
      department="Producto · Remoto · Senior"
      badgeLabel="Abierta"
      badgeVariant="open"
      meta="5d"
    />
  )
}
