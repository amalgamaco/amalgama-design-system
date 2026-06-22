import { Switch } from "../components/ui/switch"

const lbl: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, fontSize: 14 }

export function SwitchShowcase() {
  return (
    <div className="bd-states" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}>
      <div className="bd-state"><label style={lbl}><Switch aria-label="Apagado" /> Apagado</label></div>
      <div className="bd-state"><label style={lbl}><Switch defaultChecked aria-label="Encendido" /> Encendido</label></div>
      <div className="bd-state"><label style={lbl}><Switch disabled aria-label="Deshabilitado apagado" /> Deshab. off</label></div>
      <div className="bd-state"><label style={lbl}><Switch defaultChecked disabled aria-label="Deshabilitado encendido" /> Deshab. on</label></div>
    </div>
  )
}
