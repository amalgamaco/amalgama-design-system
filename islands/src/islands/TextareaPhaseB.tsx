import { Textarea } from "@ds/textarea"

// Specs tab — live Textarea variant examples rendered via the real
// @ds Textarea component (label/required props + intrinsic field-input styling).

// 1. Basico — label + multiline textarea with placeholder
export function TextareaBasic() {
  return (
    <Textarea
      label="Descripcion"
      placeholder="Describe los requisitos del puesto..."
    />
  )
}

// 2. Deshabilitado — non-editable textarea with default value
export function TextareaDisabled() {
  return (
    <Textarea label="Notas" disabled defaultValue="Este campo no es editable." />
  )
}
