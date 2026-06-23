import { Badge } from "../components/ui/badge"

const variants = [
  { variant: "open",     label: "Abierta" },
  { variant: "active",   label: "Activa" },
  { variant: "closed",   label: "Cerrada" },
  { variant: "draft",    label: "Borrador" },
  { variant: "archived", label: "Archivada" },
  { variant: "warning",  label: "En revisión" },
  { variant: "tertiary", label: "Terciaria" },
  { variant: "info",     label: "Info" },
] as const

export function BadgeShowcase() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {variants.map(({ variant, label }) => (
        <Badge key={variant} variant={variant}>{label}</Badge>
      ))}
    </div>
  )
}
