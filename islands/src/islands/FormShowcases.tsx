import { Input } from "@ds/input"
import { Textarea } from "@ds/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "@ds/select"

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
    <div style={{ width: 220 }}>
      <Select>
        <SelectTrigger aria-label="Fruta">
          <SelectValue placeholder="Seleccioná una fruta" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Frutas</SelectLabel>
            <SelectItem value="manzana">Manzana</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="arandano">Arándano</SelectItem>
            <SelectItem value="uvas">Uvas</SelectItem>
            <SelectItem value="anana">Ananá</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
