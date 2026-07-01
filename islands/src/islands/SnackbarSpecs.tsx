import * as React from "react"
import { X } from "lucide-react"
import { Stage, Anchor, useMeasured, VBracket, HBracket } from "./lib/Annotated"

/* ──────────────────────────────────────────────────────────────
 * Snackbar — Specs depiction islands.
 *
 * The Sonner snackbar is transient/bottom-center, so for anatomy/
 * color/measure diagrams we render the snackbar's REAL surface
 * statically with the same inverse-* tokens the @ds/sonner Toaster
 * uses (mirrors SnackbarConfigShowcase). Theme-aware: inverse-*
 * auto-flips with [data-theme], replacing the baked light/dark SVGs.
 * ────────────────────────────────────────────────────────────── */

const SURFACE =
  "flex items-center gap-3 min-h-12 px-4 py-2.5 rounded-sm shadow-lg bg-inverse-surface text-inverse-on-surface font-body text-body-sm"

function Snackbar({ width = 320, mzChip }: { width?: number; mzChip?: boolean }) {
  return (
    <div className={SURFACE} style={{ width }} {...(mzChip ? ({ "data-mz-chip": "" } as Record<string, string>) : {})}>
      <span className="flex-1" data-mz="label">Invitación enviada</span>
      <button className="shrink-0 font-semibold uppercase tracking-wide text-inverse-primary text-label bg-transparent border-0 cursor-pointer">VER</button>
      <button aria-label="Cerrar" className="shrink-0 grid place-items-center w-6 h-6 rounded-full text-inverse-on-surface/80 bg-transparent border-0 cursor-pointer">
        <X className="w-[18px] h-[18px]" />
      </button>
    </div>
  )
}

export function SnackbarAnatomy() {
  return (
    <Stage pad={72}>
      <Anchor
        pins={[
          { n: 1, side: "top" },
          { n: 2, side: "bottom", at: "22%" },
          { n: 3, side: "bottom", at: "70%" },
          { n: 4, side: "right" },
        ]}
      >
        <Snackbar />
      </Anchor>
    </Stage>
  )
}

export function SnackbarColor() {
  return (
    <Stage pad={56}>
      <Snackbar />
    </Stage>
  )
}

export function SnackbarMeasures() {
  const ref = React.useRef<HTMLDivElement>(null)
  const m = useMeasured(ref)
  const brackets: React.ReactNode[] = []
  if (m) {
    const hx = m.host.left
    const hy = m.host.top
    const cL = m.chip.left - hx
    const cR = m.chip.right - hx
    const cT = m.chip.top - hy
    const cB = m.chip.bottom - hy
    const lab = m.zones.label
    brackets.push(<VBracket key="h" x={cL - 26} y1={cT} y2={cB} label="48dp" />)
    if (lab) {
      brackets.push(<HBracket key="lp" x1={cL} x2={lab.left - hx} y={cB + 16} label="16dp" />)
    }
  }
  return (
    <div ref={ref} style={{ position: "relative", display: "flex", justifyContent: "center", padding: "44px 80px 56px", background: "var(--color-surface-container-lowest)", border: "1px solid var(--border)", borderRadius: 12 }}>
      <Snackbar width={300} mzChip />
      {brackets}
    </div>
  )
}

/* Estados y animación — three motion phases, real snackbar surface */
export function SnackbarAnimation() {
  const phases: Array<{ label: string; dur: string; style: React.CSSProperties }> = [
    { label: "Entrada", dur: "250ms ease-out", style: { opacity: 0.5, transform: "translateY(10px)" } },
    { label: "Visible", dur: "4000ms", style: {} },
    { label: "Salida", dur: "200ms ease-in", style: { opacity: 0.35 } },
  ]
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 0", width: "100%" }}>
      {phases.map((p) => (
        <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 96, flexShrink: 0, font: "600 11px 'Inter',sans-serif", color: "var(--color-on-surface-variant)" }}>
            {p.label}
            <div style={{ font: "400 10px 'Inter',sans-serif", color: "var(--color-on-surface-variant)" }}>{p.dur}</div>
          </div>
          <div style={{ ...p.style, transition: "none" }}>
            <Snackbar width={300} />
          </div>
        </div>
      ))}
    </div>
  )
}
