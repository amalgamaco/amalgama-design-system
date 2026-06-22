import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"

const lbl: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, fontSize: 14 }

export function RadioGroupShowcase() {
  return (
    <RadioGroup defaultValue="m" style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320 }}>
      <label style={lbl}><RadioGroupItem value="m" /> Mensual</label>
      <label style={lbl}><RadioGroupItem value="a" /> Anual</label>
      <label style={lbl}><RadioGroupItem value="t" /> Trimestral</label>
    </RadioGroup>
  )
}

export function RadioStatesShowcase() {
  return (
    <div className="bd-states" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}>
      <RadioGroup defaultValue="x2" style={{ display: "contents" }}>
        <div className="bd-state"><label style={lbl}><RadioGroupItem value="x1" /> Sin seleccionar</label></div>
        <div className="bd-state"><label style={lbl}><RadioGroupItem value="x2" /> Seleccionado</label></div>
      </RadioGroup>
      <div className="bd-state"><label style={{ ...lbl, opacity: 0.6 }}><RadioGroupItem value="d1" disabled /> Deshabilitado</label></div>
      <div className="bd-state"><label style={{ ...lbl, opacity: 0.6 }}><RadioGroup defaultValue="d2" style={{ display: "contents" }}><RadioGroupItem value="d2" disabled /></RadioGroup> Deshab. selec.</label></div>
    </div>
  )
}
