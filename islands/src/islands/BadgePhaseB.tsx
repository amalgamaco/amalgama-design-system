import { Badge } from "@ds/badge"

// Specs › Variantes de estado — 8 semantic state variants
const stateVariants = [
  { variant: "open",     label: "Abierta" },
  { variant: "active",   label: "Activa" },
  { variant: "closed",   label: "Cerrada" },
  { variant: "draft",    label: "Borrador" },
  { variant: "archived", label: "Archivada" },
  { variant: "warning",  label: "Pendiente" },
  { variant: "tertiary", label: "Nueva" },
  { variant: "info",     label: "Información" },
] as const

export function BadgeStateShowcase() {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      {stateVariants.map(({ variant, label }) => (
        <Badge key={variant} variant={variant}>{label}</Badge>
      ))}
    </div>
  )
}

// Specs › Modificador Label — badge-label (monospace, uppercase) category tags
export function BadgeLabelShowcase() {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      <Badge variant="info" label>Styles · Color</Badge>
      <Badge variant="info" label>Components · Actions</Badge>
      <Badge variant="draft" label>Foundations · Tokens</Badge>
    </div>
  )
}

// Specs › Uso en contexto — badges embedded in context rows
export function BadgeContextShowcase() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
        Diseñador UX <Badge variant="open">Abierta</Badge>
      </div>
      <div
        className="text-on-surface-variant"
        style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}
      >
        <Badge variant="info" label>Components · Buttons</Badge>
      </div>
    </div>
  )
}
