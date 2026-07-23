import * as React from "react"
import { Input } from "@ds/input"
import { Calendar, Mail, Phone, Eye } from "lucide-react"

// Specs tab — every live Input variant/state example rendered via the real
// @ds Input component. Variants the base component does not cover by prop
// (number stepper, date wrapper, grid) compose Input + Embassy token utilities.

// 1. Basico — label + input
export function InputBasic() {
  return <Input label="Nombre completo" type="text" />
}

// 2. Con placeholder — bare input, no label
export function InputPlaceholder() {
  return <Input type="text" placeholder="Escribe aqui..." />
}

// 3. Required — label with asterisk
export function InputRequired() {
  return <Input label="Correo electronico" type="email" required />
}

// 4. Disabled — non-editable input
export function InputDisabled() {
  return <Input type="text" disabled value="No editable" readOnly />
}

// 5. Focus state — bare input; focus ring is intrinsic to the component
export function InputFocus() {
  return <Input type="text" placeholder="Haz clic aqui para ver el focus..." />
}

// 6. Grid de formulario — two real Inputs in a 2-column grid
export function InputGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-4">
      <Input label="Nombre" type="text" />
      <Input label="Apellido" type="text" />
    </div>
  )
}

// 7. Number Input — real Input typed as number with stepper controls.
// Composed: base component has no stepper variant, so the steppers are
// token-driven chrome around the real <Input>.
export function InputNumber() {
  const [value, setValue] = React.useState(3)
  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value) || 0)}
        className="w-20 text-center"
        aria-label="Cantidad"
      />
      <div className="flex flex-col gap-1">
        <button
          type="button"
          aria-label="Disminuir"
          onClick={() => setValue((v) => v - 1)}
          className="flex items-center justify-center w-7 h-6 rounded-sm border border-border bg-card text-fg hover:border-outline"
        >
          −
        </button>
        <button
          type="button"
          aria-label="Aumentar"
          onClick={() => setValue((v) => v + 1)}
          className="flex items-center justify-center w-7 h-6 rounded-sm border border-border bg-card text-fg hover:border-outline"
        >
          +
        </button>
      </div>
    </div>
  )
}

// 8. Date Input — real Input typed as date with a trailing calendar icon.
export function InputDate() {
  return (
    <div className="relative inline-flex items-center">
      <Input type="date" className="pr-[42px]" aria-label="Fecha" />
      <Calendar
        size={16}
        className="absolute right-[14px] text-on-surface-variant pointer-events-none"
      />
    </div>
  )
}


// ─── MD3 Text Fields — state matrix (Overview/Specs). Real <Input>, states pinned via token classes. ───
function StateCell({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-caption font-medium text-fg-subtle">{caption}</span>
      {children}
    </div>
  )
}

export function InputStates() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
      <StateCell caption="Enabled">
        <Input defaultValue="Texto ingresado" aria-label="Enabled" />
      </StateCell>
      <StateCell caption="Hover">
        <Input defaultValue="Texto ingresado" className="border-outline" aria-label="Hover" />
      </StateCell>
      <StateCell caption="Focus">
        <Input defaultValue="Texto ingresado" className="border-link shadow-[0_0_0_3px_var(--color-focus-ring)]" aria-label="Focus" />
      </StateCell>
      <StateCell caption="Disabled">
        <Input defaultValue="Texto ingresado" disabled aria-label="Disabled" />
      </StateCell>
      <StateCell caption="Error">
        <Input defaultValue="valor@" error="Ingresá un email válido." aria-label="Error" />
      </StateCell>
      <StateCell caption="Error + focus">
        <Input defaultValue="valor@" error="Ingresá un email válido." className="shadow-[0_0_0_3px_var(--color-error-ring)]" aria-label="Error con foco" />
      </StateCell>
    </div>
  )
}

// ─── MD3 Text Fields — features (label, supporting, required/optional, icons, validation) ───
export function InputFeatures() {
  return (
    <div className="flex flex-col gap-1 max-w-md">
      <Input
        label="Correo electrónico"
        type="email"
        required
        placeholder="maria@empresa.com"
        hint="Usá tu correo de trabajo."
        leadingIcon={<Mail />}
      />
      <Input
        label="Teléfono"
        type="tel"
        placeholder="+54 9 11 …"
        hint="Opcional — para contacto rápido."
        leadingIcon={<Phone />}
      />
      <Input
        label="Contraseña"
        type="password"
        required
        defaultValue="123"
        error="La contraseña debe tener al menos 8 caracteres."
        leadingIcon={<Mail />}
        trailingIcon={<Eye />}
      />
    </div>
  )
}

// ─── Anatomy — one field showing every part (label, leading icon, input, supporting text) ───
export function InputAnatomy() {
  return (
    <div className="max-w-md">
      <Input
        label="Correo electrónico"
        required
        type="email"
        placeholder="maria@empresa.com"
        hint="Texto de ayuda (supporting text)."
        leadingIcon={<Mail />}
      />
    </div>
  )
}
