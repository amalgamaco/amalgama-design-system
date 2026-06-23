import { VacancyCard } from "../components/ui/vacancy-card"

const vacancies = [
  {
    name: "Diseñador UX Senior",
    department: "Producto · Buenos Aires",
    badgeLabel: "Abierta",
    badgeVariant: "open" as const,
    meta: "12 candidatos",
  },
  {
    name: "Frontend Engineer",
    department: "Tecnología · Remoto",
    badgeLabel: "En revisión",
    badgeVariant: "warning" as const,
    meta: "5 candidatos",
  },
  {
    name: "Product Manager",
    department: "Producto · Híbrido",
    badgeLabel: "Cerrada",
    badgeVariant: "closed" as const,
    meta: "0 candidatos",
  },
  {
    name: "Data Analyst",
    department: "Datos · Remoto",
    badgeLabel: "Borrador",
    badgeVariant: "draft" as const,
    meta: "",
  },
]

export function VacancyCardShowcase() {
  return (
    <div className="flex flex-col gap-2 max-w-lg">
      {vacancies.map((v) => (
        <VacancyCard key={v.name} {...v} />
      ))}
    </div>
  )
}
