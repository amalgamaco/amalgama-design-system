import { PersonCard } from "@ds/person-card"

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
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 12,
      }}
    >
      {/* The whole card is the clickable target — no nested "Ver perfil" button.
          A nested action inside a clickable row caused overlapping/clipped text in
          narrow grid cells (buildless fix 41f6153). */}
      {people.map((p) => (
        <PersonCard key={p.name} {...p} />
      ))}
    </div>
  )
}
