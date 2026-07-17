import * as React from "react"
import { Checkbox } from "@ds/checkbox"
import { RadioGroup, RadioGroupItem } from "@ds/radio-group"
import { Slider } from "@ds/slider"
import { Progress, CircularProgress } from "@ds/progress"
import { Anatomy, Stage, useMeasured, HBracket, VBracket } from "./lib/Annotated"

/* ──────────────────────────────────────────────────────────────
 * Selection & progress controls — Specs depiction islands.
 * MD3 documentation model, Embassy values, real @ds components.
 * Checkbox 18dp/4dp radius/2dp border, Radio 20dp/10dp dot, Slider
 * 4dp track + 20dp thumb, Progress 4dp linear / 44dp circular —
 * track surface-variant, fill/primary, focus-ring, 40% disabled.
 * None of these implement MD3 state-layers (documented deviation).
 * ────────────────────────────────────────────────────────────── */

const NOINT = "pointer-events-none"
const COL: React.CSSProperties = { font: "400 10px 'Inter',sans-serif", color: "var(--color-on-surface-variant)", textAlign: "center" }
const ROW: React.CSSProperties = { font: "500 11px 'Inter',sans-serif", color: "var(--color-on-surface-variant)" }

function StatesGrid({ cols, children }: { cols: string[]; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--color-surface-container-lowest)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px 20px", overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: `96px repeat(${cols.length},1fr)`, gap: "16px 8px", minWidth: 120 + cols.length * 90, alignItems: "center" }}>
        {children}
        <div />
        {cols.map((c) => <div key={c} style={COL}>{c}</div>)}
      </div>
    </div>
  )
}
function Cell({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", justifyContent: "center" }}>{children}</div>
}

/* Generic measured square (checkbox/radio) — height+width bracket. */
function MeasuredSquare({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const m = useMeasured(ref)
  const br: React.ReactNode[] = []
  if (m) {
    const cL = m.chip.left - m.host.left, cR = m.chip.right - m.host.left, cT = m.chip.top - m.host.top, cB = m.chip.bottom - m.host.top
    br.push(<VBracket key="h" x={cL - 22} y1={cT} y2={cB} label={label} />)
    br.push(<HBracket key="w" x1={cL} x2={cR} y={cB + 14} label={label} />)
  }
  return (
    <Stage pad={0} style={{ padding: "40px 72px 48px" }}>
      <div ref={ref} style={{ position: "relative", display: "flex", justifyContent: "center" }}>
        {children}
        {br}
      </div>
    </Stage>
  )
}

/* ═══ CHECKBOX ═══ */
export function CheckboxAnatomy() {
  return (
    <Anatomy pad={64} pins={[{ n: 1, side: "top" }, { n: 2, side: "right" }]}>
      <Checkbox checked aria-label="Anatomía del checkbox" className={NOINT} />
    </Anatomy>
  )
}
function Cb({ state, focus, disabled, error }: { state?: boolean | "indeterminate"; focus?: boolean; disabled?: boolean; error?: boolean }) {
  return <Cell><Checkbox checked={state} disabled={disabled} aria-invalid={error || undefined} aria-hidden="true" tabIndex={-1} className={`${NOINT}${focus ? " bd-sim-focus" : ""}`} /></Cell>
}
export function CheckboxStates() {
  return (
    <StatesGrid cols={["Habilitado", "Enfocado", "Deshabilitado", "Error"]}>
      <div style={ROW}>Sin marcar</div><Cb /><Cb focus /><Cb disabled /><Cb error />
      <div style={ROW}>Marcado</div><Cb state /><Cb state focus /><Cb state disabled /><Cb state error />
      <div style={ROW}>Indeterminado</div><Cb state="indeterminate" /><Cb state="indeterminate" focus /><Cb state="indeterminate" disabled /><Cb state="indeterminate" error />
    </StatesGrid>
  )
}
export function CheckboxMeasures() {
  return <MeasuredSquare label="18dp"><Checkbox checked aria-hidden="true" tabIndex={-1} className={NOINT} {...({ "data-mz-chip": "" } as Record<string, string>)} /></MeasuredSquare>
}

/* ═══ RADIO ═══ */
export function RadioAnatomy() {
  return (
    <Anatomy pad={64} pins={[{ n: 1, side: "top" }, { n: 2, side: "right" }]}>
      <RadioGroup value="a" className={NOINT}><RadioGroupItem value="a" aria-label="Anatomía del radio" /></RadioGroup>
    </Anatomy>
  )
}
function Rb({ on, focus, disabled, error }: { on?: boolean; focus?: boolean; disabled?: boolean; error?: boolean }) {
  return (
    <Cell>
      <RadioGroup value={on ? "a" : "b"} className={NOINT} aria-hidden="true">
        <RadioGroupItem value="a" disabled={disabled} aria-invalid={error || undefined} tabIndex={-1} className={focus ? "bd-sim-focus" : undefined} />
      </RadioGroup>
    </Cell>
  )
}
export function RadioStates() {
  return (
    <StatesGrid cols={["Habilitado", "Enfocado", "Deshabilitado", "Error"]}>
      <div style={ROW}>No seleccionado</div><Rb /><Rb focus /><Rb disabled /><Rb error />
      <div style={ROW}>Seleccionado</div><Rb on /><Rb on focus /><Rb on disabled /><Rb on error />
    </StatesGrid>
  )
}
export function RadioMeasures() {
  return (
    <MeasuredSquare label="20dp">
      <RadioGroup value="a" aria-hidden="true" className={NOINT}>
        <RadioGroupItem value="a" tabIndex={-1} {...({ "data-mz-chip": "" } as Record<string, string>)} />
      </RadioGroup>
    </MeasuredSquare>
  )
}

/* ═══ SLIDER ═══ */
export function SliderAnatomy() {
  return (
    <Stage pad={56}>
      <Anatomy pad={0} pins={[{ n: 1, side: "top", at: "30%" }, { n: 2, side: "top", at: "12%" }, { n: 3, side: "bottom", at: "60%" }]} anchorStyle={{ width: 280 }}>
        <Slider defaultValue={[60]} aria-label="Anatomía del slider" className={NOINT} style={{ width: 280 }} />
      </Anatomy>
    </Stage>
  )
}
export function SliderStates() {
  const row = (label: string, el: React.ReactNode) => (
    <>
      <div style={ROW}>{label}</div>
      <div style={{ width: "100%", maxWidth: 320 }}>{el}</div>
    </>
  )
  return (
    <div style={{ background: "var(--color-surface-container-lowest)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "120px minmax(0,1fr)", gap: "20px 16px", maxWidth: 520, alignItems: "center" }}>
        {row("Habilitado", <Slider defaultValue={[50]} aria-label="Habilitado" className={NOINT} />)}
        {row("Rango (2 thumbs)", <Slider defaultValue={[25, 75]} aria-label="Rango" className={NOINT} />)}
        {row("Deshabilitado", <Slider defaultValue={[50]} disabled aria-label="Deshabilitado" className={NOINT} />)}
      </div>
    </div>
  )
}
export function SliderMeasures() {
  return (
    <Stage pad={40}>
      <div style={{ width: "min(320px,100%)" }}>
        <Slider defaultValue={[50]} aria-hidden="true" className={NOINT} />
      </div>
    </Stage>
  )
}

/* ═══ PROGRESS ═══ */
export function ProgressAnatomy() {
  return (
    <Stage pad={56}>
      <Anatomy pad={0} pins={[{ n: 1, side: "top", at: "85%" }, { n: 2, side: "bottom", at: "30%" }]} anchorStyle={{ width: 280 }}>
        <Progress value={60} aria-label="Anatomía del progress" style={{ width: 280 }} />
      </Anatomy>
    </Stage>
  )
}
export function ProgressStates() {
  const row = (label: string, el: React.ReactNode) => (
    <>
      <div style={ROW}>{label}</div>
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>{el}</div>
    </>
  )
  return (
    <div style={{ background: "var(--color-surface-container-lowest)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "150px minmax(0,1fr)", gap: "20px 16px", maxWidth: 520, alignItems: "center" }}>
        {row("Lineal determinado", <div style={{ width: "min(280px,100%)" }}><Progress value={65} aria-label="Determinado 65%" /></div>)}
        {row("Lineal indeterminado", <div style={{ width: "min(280px,100%)" }}><Progress indeterminate aria-label="Cargando" /></div>)}
        {row("Circular determinado", <CircularProgress value={70} aria-label="Determinado 70%" />)}
        {row("Circular indeterminado", <CircularProgress indeterminate aria-label="Cargando" />)}
      </div>
    </div>
  )
}
export function ProgressMeasures() {
  return (
    <Stage pad={36} style={{ gap: 40, flexWrap: "wrap" }}>
      <div style={{ width: "min(280px,100%)" }}><Progress value={60} aria-hidden="true" /></div>
      <CircularProgress value={60} aria-hidden="true" />
    </Stage>
  )
}
