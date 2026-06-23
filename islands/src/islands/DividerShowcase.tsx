import { Separator } from "../components/ui/separator"

export function DividerShowcase() {
  return (
    <div style={{ maxWidth: 380, border: "1px solid var(--border)", borderRadius: 12, padding: "14px 0" }}>
      <div style={{ padding: "6px 16px" }}>Sección A</div>
      <Separator />
      <div style={{ padding: "6px 16px" }}>Sección B</div>
      <Separator inset />
      <div style={{ padding: "6px 16px" }}>Sección C (divisor inset)</div>
    </div>
  )
}
