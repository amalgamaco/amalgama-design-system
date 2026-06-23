import { Progress, CircularProgress } from "../components/ui/progress"

const cap: React.CSSProperties = { fontSize: 12, color: "var(--text-secondary)", marginTop: 8 }

export function ProgressCircularShowcase() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <CircularProgress indeterminate aria-label="Indeterminado" />
        <div style={cap}>Indeterminado</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <CircularProgress value={65} aria-label="65 por ciento" />
        <div style={cap}>Determinado 65%</div>
      </div>
    </div>
  )
}

export function ProgressLinearShowcase() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 300 }}>
      <div>
        <Progress indeterminate aria-label="Indeterminado" />
        <div style={cap}>Indeterminado</div>
      </div>
      <div>
        <Progress value={40} aria-label="40 por ciento" />
        <div style={cap}>Determinado 40%</div>
      </div>
    </div>
  )
}
