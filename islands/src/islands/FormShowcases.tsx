import { Input } from "@ds/input"
import { Textarea } from "@ds/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@ds/select"

// Reuse the page's .field-group/.field-label so only the control is shadcn.
export function InputShowcase() {
  return (
    <div className="field-group">
      <label className="field-label">Nombre completo</label>
      <Input />
    </div>
  )
}

export function TextareaShowcase() {
  return (
    <div className="field-group">
      <label className="field-label">Descripción</label>
      <Textarea placeholder="Describe los requisitos del puesto..." />
    </div>
  )
}

export function SelectShowcase() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Select>
        <SelectTrigger aria-label="Seleccionar opción">
          <SelectValue placeholder="Seleccionar..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Opción 1</SelectItem>
          <SelectItem value="2">Opción 2</SelectItem>
          <SelectItem value="3">Opción 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
