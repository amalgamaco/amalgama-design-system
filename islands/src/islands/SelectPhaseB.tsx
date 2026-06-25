import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@ds/select"

// Specs · Basico — Radix Select composite themed with Embassy tokens.
export function SelectSpecBasic() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Select>
        <SelectTrigger aria-label="Seleccionar opción">
          <SelectValue placeholder="Seleccionar..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Opcion 1</SelectItem>
          <SelectItem value="2">Opcion 2</SelectItem>
          <SelectItem value="3">Opcion 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

// Specs · Con label — wrapped in the page's .field-group/.field-label anatomy.
export function SelectSpecLabeled() {
  return (
    <div className="field-group" style={{ maxWidth: 320 }}>
      <label className="field-label">Departamento</label>
      <Select>
        <SelectTrigger aria-label="Departamento">
          <SelectValue placeholder="Seleccionar..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rh">Recursos Humanos</SelectItem>
          <SelectItem value="tech">Tecnologia</SelectItem>
          <SelectItem value="mkt">Marketing</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

// Specs · Disabled — disabled prop on the Radix root.
export function SelectSpecDisabled() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Select disabled>
        <SelectTrigger aria-label="Seleccionar opción">
          <SelectValue placeholder="Seleccionar..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Opcion 1</SelectItem>
          <SelectItem value="2">Opcion 2</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
