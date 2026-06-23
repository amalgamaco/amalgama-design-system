import { StatsGrid, StatCard } from "../components/ui/stat-card"

export function StatCardShowcase() {
  return (
    <StatsGrid>
      <StatCard
        label="Vacantes activas"
        value="24"
        change="↑ 4 desde el mes pasado"
        changeColor="var(--color-success)"
      />
      <StatCard
        label="Candidatos en proceso"
        value="138"
        change="↓ 12 desde la semana pasada"
        changeColor="var(--color-error)"
      />
      <StatCard
        label="Posiciones cubiertas"
        value="91%"
        change="↑ 3% vs. trimestre anterior"
        changeColor="var(--color-success)"
      />
    </StatsGrid>
  )
}
