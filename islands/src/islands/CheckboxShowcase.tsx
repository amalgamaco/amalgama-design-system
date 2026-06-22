import { Checkbox } from "../components/ui/checkbox"

const lbl: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, fontSize: 14 }

export function CheckboxShowcase() {
  return (
    <div className="bd-states" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}>
      <div className="bd-state"><label style={lbl}><Checkbox aria-label="Sin marcar" /> Sin marcar</label></div>
      <div className="bd-state"><label style={lbl}><Checkbox defaultChecked aria-label="Marcado" /> Marcado</label></div>
      <div className="bd-state"><label style={lbl}><Checkbox checked="indeterminate" aria-label="Indeterminado" /> Indeterminado</label></div>
      <div className="bd-state"><label style={lbl}><Checkbox disabled aria-label="Deshabilitado" /> Deshabilitado</label></div>
      <div className="bd-state"><label style={lbl}><Checkbox defaultChecked disabled aria-label="Deshabilitado marcado" /> Deshab. marcado</label></div>
    </div>
  )
}
