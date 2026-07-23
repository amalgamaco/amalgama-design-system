import { StatsGrid, StatCard } from "@ds/stat-card"

export function StatCardShowcase() {
  return (
    <StatsGrid>
      <StatCard
        label="Vacantes activas"
        value="24"
        change="↑ 4 desde el mes pasado"
        trend="positive"
      />
      <StatCard
        label="Candidatos en proceso"
        value="138"
        change="↓ 12 desde la semana pasada"
        trend="negative"
      />
      <StatCard
        label="Posiciones cubiertas"
        value="91%"
        change="↑ 3% vs. trimestre anterior"
        trend="positive"
      />
    </StatsGrid>
  )
}

// Specs-tab Stats Grid demo (was inline `class="stat-card"` markup).
export function StatCardGrid() {
  return (
    <StatsGrid>
      <StatCard label="Vacantes activas" value="24" change="+3 este mes" trend="positive" />
      <StatCard label="Candidatos" value="156" change="+12 esta semana" trend="positive" />
      <StatCard label="Entrevistas hoy" value="8" change="Sin cambios" trend="neutral" />
      <StatCard label="Tiempo promedio" value="18d" change="+2d vs anterior" trend="negative" />
    </StatsGrid>
  )
}
