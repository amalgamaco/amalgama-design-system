import { StatsGrid, StatCard } from "@ds/stat-card"

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

// Specs-tab Stats Grid demo (was inline `class="stat-card"` markup).
export function StatCardGrid() {
  return (
    <StatsGrid>
      <StatCard label="Vacantes activas" value="24" change="+3 este mes" changeColor="var(--color-success)" />
      <StatCard label="Candidatos" value="156" change="+12 esta semana" changeColor="var(--color-success)" />
      <StatCard label="Entrevistas hoy" value="8" change="Sin cambios" changeColor="var(--text-muted)" />
      <StatCard label="Tiempo promedio" value="18d" change="+2d vs anterior" changeColor="var(--color-error)" />
    </StatsGrid>
  )
}
