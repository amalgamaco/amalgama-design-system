import { useState } from "react"
import { Slider } from "../components/ui/slider"

const lbl: React.CSSProperties = { fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }

export function SliderShowcase() {
  const [v, setV] = useState([40])
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 360 }}>
      <div>
        <div style={lbl}>Continuo</div>
        <Slider defaultValue={[50]} aria-label="Continuo" />
      </div>
      <div>
        <div style={lbl}>Con pasos + etiqueta · {v[0]}</div>
        <Slider value={v} onValueChange={setV} step={10} aria-label="Con pasos" />
      </div>
      <div>
        <div style={lbl}>Rango</div>
        <Slider defaultValue={[20, 70]} aria-label="Rango" />
      </div>
      <div>
        <div style={lbl}>Deshabilitado</div>
        <Slider defaultValue={[30]} disabled aria-label="Deshabilitado" />
      </div>
    </div>
  )
}
