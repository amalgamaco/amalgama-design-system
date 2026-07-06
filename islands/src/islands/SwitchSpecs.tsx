import * as React from "react"
import { Switch } from "@ds/switch"
import { Anatomy, Stage, useMeasured, HBracket, VBracket } from "./lib/Annotated"

/* ──────────────────────────────────────────────────────────────
 * Switch — Specs depiction islands (MD3 documentation model,
 * Embassy values). Every example is the real @ds/switch (Radix),
 * so anatomy/states/measures cannot drift from the implementation.
 * Embassy switch: 44×24 track, 20px thumb (fixed — no MD3 grow),
 * no thumb icon; off = surface-variant + outline, on = primary /
 * on-primary; focus = focus-ring; disabled = 40% opacity.
 * ────────────────────────────────────────────────────────────── */

const NOINT = "pointer-events-none"

export function SwitchAnatomy() {
  return (
    <Anatomy
      pad={72}
      pins={[
        { n: 1, side: "top" },
        { n: 2, side: "bottom", at: "76%" },
      ]}
    >
      <Switch defaultChecked aria-label="Anatomía del switch" className={NOINT} />
    </Anatomy>
  )
}

/* States matrix — off/on × enabled/focus/disabled (real component). */
const COL: React.CSSProperties = { font: "400 10px 'Inter',sans-serif", color: "var(--color-on-surface-variant)", textAlign: "center" }
const ROW: React.CSSProperties = { font: "500 11px 'Inter',sans-serif", color: "var(--color-on-surface-variant)" }

function Cell({ on, focus, disabled }: { on?: boolean; focus?: boolean; disabled?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Switch
        defaultChecked={on}
        disabled={disabled}
        aria-hidden="true"
        tabIndex={-1}
        className={focus ? "pointer-events-none bd-sim-focus" : "pointer-events-none"}
      />
    </div>
  )
}

export function SwitchStates() {
  const cols = ["Habilitado", "Enfocado", "Deshabilitado"]
  return (
    <div style={{ background: "var(--color-surface-container-lowest)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "88px repeat(3,1fr)", gap: "16px 8px", maxWidth: 460, alignItems: "center" }}>
        <div style={ROW}>Apagado</div>
        <Cell /><Cell focus /><Cell disabled />
        <div style={ROW}>Encendido</div>
        <Cell on /><Cell on focus /><Cell on disabled />
        <div />
        {cols.map((c) => <div key={c} style={COL}>{c}</div>)}
      </div>
    </div>
  )
}

/* Measurements — real switch with measured track dimensions. */
export function SwitchMeasures() {
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
    brackets.push(<VBracket key="h" x={cL - 26} y1={cT} y2={cB} label="24dp" />)
    brackets.push(<HBracket key="w" x1={cL} x2={cR} y={cB + 16} label="44dp" />)
  }
  return (
    <Stage pad={0} style={{ position: "relative", padding: "44px 80px 56px" }}>
      <div ref={ref} style={{ position: "relative", display: "flex", justifyContent: "center", width: "100%" }}>
        <Switch defaultChecked aria-hidden="true" tabIndex={-1} className={NOINT} {...({ "data-mz-chip": "" } as Record<string, string>)} />
        {brackets}
      </div>
    </Stage>
  )
}
