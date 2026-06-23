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
  // Every RadioGroupItem must live inside its own RadioGroup — a bare item throws
  // (Radix requires the RadioGroup context) and takes the whole island down.
  return (
    <div className="bd-states" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}>
      <div className="bd-state"><RadioGroup><label style={lbl}><RadioGroupItem value="x1" /> Sin seleccionar</label></RadioGroup></div>
      <div className="bd-state"><RadioGroup defaultValue="x2"><label style={lbl}><RadioGroupItem value="x2" /> Seleccionado</label></RadioGroup></div>
      <div className="bd-state"><RadioGroup><label style={{ ...lbl, opacity: 0.6 }}><RadioGroupItem value="d1" disabled /> Deshabilitado</label></RadioGroup></div>
      <div className="bd-state"><RadioGroup defaultValue="d2"><label style={{ ...lbl, opacity: 0.6 }}><RadioGroupItem value="d2" disabled /> Deshab. selec.</label></RadioGroup></div>
    </div>
  )
}
