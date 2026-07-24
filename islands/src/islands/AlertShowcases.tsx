import { Alert, AlertTitle, AlertDescription } from "@ds/alert"

// Exact docs SVGs (check-circle / alert-circle / info / warning-triangle) so the
// islandized alerts render identically to the buildless inline examples.
const CheckCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" /><path d="M9 12l2 2 4-4" /></svg>
)
const AlertCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
)
const InfoCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
)
const WarningTriangle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /><path d="M12 9v4M12 17h.01" /></svg>
)

// Overview — single basic alert.
export function AlertBasic() {
  return (
    <div style={{ width: "100%", maxWidth: "32rem" }}>
      <Alert>
        <CheckCircle />
        <AlertTitle>Cambios guardados</AlertTitle>
        <AlertDescription>Un alert básico con ícono, título y descripción.</AlertDescription>
      </Alert>
    </div>
  )
}

// Specs — Destructive (error + bulleted list in description).
export function AlertDestructive() {
  return (
    <div style={{ width: "100%", maxWidth: "32rem" }}>
      <Alert variant="error">
        <AlertCircle />
        <AlertTitle>No se pudo procesar el pago.</AlertTitle>
        <AlertDescription>
          Verificá los datos de facturación e intentá de nuevo.
          <ul style={{ listStyle: "disc", margin: "6px 0 0", paddingLeft: 18 }}>
            <li>Revisá los datos de la tarjeta</li>
            <li>Asegurá fondos suficientes</li>
            <li>Verificá la dirección de facturación</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}

// Specs — Colores semánticos (info / success / warning).
export function AlertSemantic() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: "32rem" }}>
      <Alert variant="info">
        <InfoCircle />
        <AlertTitle>Actualización disponible</AlertTitle>
        <AlertDescription>Hay una nueva versión del Design System. Revisá el changelog antes de actualizar.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <CheckCircle />
        <AlertTitle>Cambios guardados</AlertTitle>
        <AlertDescription>La vacante se publicó correctamente.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <WarningTriangle />
        <AlertTitle>Revisá los campos</AlertTitle>
        <AlertDescription>Faltan datos obligatorios en el formulario.</AlertDescription>
      </Alert>
    </div>
  )
}
