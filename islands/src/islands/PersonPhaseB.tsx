import { PersonCard } from "@ds/person-card"

// Specs tab — "People Grid" live preview.
// Replaces the static .people-grid / .person-card CSS-class markup (which
// hardcoded hex avatar gradients) with the real @ds PersonCard. The avatar
// initials + brand gradient come from the component itself.
const people = [
  { name: "Mercedes Garcia", role: "Diseñadora UX" },
  { name: "Carlos Lopez", role: "Desarrollador Frontend" },
  { name: "Ana Martinez", role: "Product Manager" },
]

export function PersonGridSpecsShowcase() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 12,
      }}
    >
      {people.map((p) => (
        <PersonCard key={p.name} name={p.name} role={p.role} />
      ))}
    </div>
  )
}
