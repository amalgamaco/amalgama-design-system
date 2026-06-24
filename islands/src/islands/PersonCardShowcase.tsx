import { PersonCard } from "@ds/person-card"
import { Button } from "@ds/button"

const people = [
  { name: "María González", role: "Diseñadora UX", meta: "Buenos Aires" },
  { name: "Carlos López", role: "Frontend Engineer", meta: "Remoto" },
  { name: "Ana Martínez", role: "Product Manager", meta: "Córdoba" },
  { name: "Juan Pérez", role: "Data Analyst", meta: "Remoto" },
]

export function PersonCardShowcase() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 12,
      }}
    >
      {people.map((p) => (
        <PersonCard
          key={p.name}
          {...p}
          actions={
            <Button variant="tertiary" size="sm">Ver perfil</Button>
          }
        />
      ))}
    </div>
  )
}
