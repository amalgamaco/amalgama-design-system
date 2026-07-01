import * as React from "react"
import { Button } from "@ds/button"
import { useMeasured, VBracket, ANNOT } from "./lib/Annotated"

/* ──────────────────────────────────────────────────────────────
 * Button — Specs depiction islands.
 *
 * Real @ds/button replaces the static measurement-matrix and
 * touch-target SVGs. Heights/radii are measured from the real
 * rendered button so the diagram cannot drift from the component.
 * ────────────────────────────────────────────────────────────── */

const SIZES: Array<{ size?: "xs" | "sm" | "lg" | "xl"; name: string; radius: string }> = [
  { size: "xs", name: "XS", radius: "--radius-sm" },
  { size: "sm", name: "SM", radius: "--radius-sm" },
  { size: undefined, name: "MD", radius: "--radius-md" },
  { size: "lg", name: "LG", radius: "--radius-md" },
  { size: "xl", name: "XL", radius: "--radius-lg" },
]

function SizeRow({ size, name, radius }: { size?: "xs" | "sm" | "lg" | "xl"; name: string; radius: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const m = useMeasured(ref)
  let bracket: React.ReactNode = null
  let hpx: number | null = null
  if (m) {
    const cT = m.chip.top - m.host.top
    const cB = m.chip.bottom - m.host.top
    const cL = m.chip.left - m.host.left
    hpx = Math.round(m.chip.height)
    bracket = <VBracket x={cL - 24} y1={cT} y2={cB} label={`${hpx}dp`} />
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "48px minmax(0,1fr) 130px", alignItems: "center", gap: 16 }}>
      <div style={{ font: "700 12px 'Inter',sans-serif", color: "var(--color-on-surface-variant)" }}>{name}</div>
      <div ref={ref} style={{ position: "relative", display: "flex", justifyContent: "flex-start", paddingLeft: 40 }}>
        <Button variant="primary" size={size} {...({ "data-mz-chip": "" } as Record<string, string>)}>Botón</Button>
        {bracket}
      </div>
      <code style={{ font: "500 11px var(--font-mono, monospace)", color: ANNOT }}>{radius}</code>
    </div>
  )
}

export function ButtonSizeMatrix() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, background: "var(--color-surface-container-lowest)", border: "1px solid var(--border)", borderRadius: 12, padding: "28px 24px" }}>
      {SIZES.map((s) => (
        <SizeRow key={s.name} {...s} />
      ))}
    </div>
  )
}

/** Touch-target diagram — button vs 48×48dp minimum touch area. */
export function ButtonTouchTarget() {
  const Zone = ({ children, label }: { children: React.ReactNode; label: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 48, minHeight: 48 }}>
        <span aria-hidden="true" style={{ position: "absolute", inset: 0, border: `1px dashed ${ANNOT}`, borderRadius: 8, minWidth: 48, minHeight: 48 }} />
        {children}
      </div>
      <span style={{ font: "400 12px 'Inter',sans-serif", color: "var(--color-on-surface-variant)" }}>{label}</span>
    </div>
  )
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, background: "var(--color-surface-container-lowest)", border: "1px solid var(--border)", borderRadius: 12, padding: "28px 24px" }}>
      <Zone label="Fila A — el botón mide ≥ 48dp: la zona táctil coincide con el componente.">
        <Button variant="primary" size="xl">Botón</Button>
      </Zone>
      <Zone label="Fila B — el botón mide < 48dp: la zona táctil (punteada) se extiende más allá del componente.">
        <Button variant="primary" size="sm">Botón</Button>
      </Zone>
    </div>
  )
}
