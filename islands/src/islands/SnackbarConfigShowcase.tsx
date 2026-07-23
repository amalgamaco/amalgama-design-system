import { X } from "lucide-react"

// Specs › Configuraciones — the four snackbar configurations rendered as live,
// token-driven surfaces (was static SVG mockups). These mirror exactly what the
// real @ds/sonner Toaster renders (inverse-surface container, inverse-on-surface
// text, inverse-primary action) — but shown statically, side by side, since the
// Sonner toast itself is transient/bottom-center and unsuitable for an anatomy
// comparison. Theme-aware: the inverse-* tokens auto-flip with [data-theme].

const surface =
  "flex items-center gap-3 min-h-12 px-4 py-2.5 rounded-sm shadow-lg bg-inverse-surface text-inverse-on-surface font-body text-body-sm w-full"

function Message({ children }: { children: React.ReactNode }) {
  return <span className="flex-1">{children}</span>
}

function Action({ children }: { children: React.ReactNode }) {
  return (
    <button className="shrink-0 font-semibold uppercase tracking-wide text-inverse-primary text-label bg-transparent border-0 cursor-pointer">
      {children}
    </button>
  )
}

function Close() {
  return (
    <button
      aria-label="Cerrar notificación"
      className="shrink-0 grid place-items-center w-6 h-6 rounded-full text-inverse-on-surface/80 hover:text-inverse-on-surface bg-transparent border-0 cursor-pointer"
    >
      <X className="w-[18px] h-[18px]" />
    </button>
  )
}

// Config 1: solo mensaje
export function SnackbarConfigMessage() {
  return (
    <div className={surface}>
      <Message>Archivo eliminado correctamente</Message>
    </div>
  )
}

// Config 2: mensaje + botón de acción
export function SnackbarConfigAction() {
  return (
    <div className={surface}>
      <Message>Archivo eliminado</Message>
      <Action>Deshacer</Action>
    </div>
  )
}

// Config 3: mensaje + botón de cierre
export function SnackbarConfigClose() {
  return (
    <div className={surface}>
      <Message>Cambios guardados</Message>
      <Close />
    </div>
  )
}

// Config 4: mensaje largo + acción (apilado)
export function SnackbarConfigMultiline() {
  return (
    <div className="flex flex-col gap-1 min-h-12 px-4 py-3 rounded-sm shadow-lg bg-inverse-surface text-inverse-on-surface font-body text-body-sm w-full">
      <span>No se pudo completar la operación en el servidor remoto</span>
      <div className="flex justify-end">
        <Action>Reintentar</Action>
      </div>
    </div>
  )
}
