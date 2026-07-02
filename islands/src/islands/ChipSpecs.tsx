import * as React from "react"
import { Chip, InputChip } from "@ds/chip"
import { Calendar, Check, Clock, Camera, Tag, UserRound, Utensils, Star, Image as ImageIcon } from "lucide-react"
import { Anatomy, Stage, useMeasured, HBracket, VBracket } from "./lib/Annotated"

/* ──────────────────────────────────────────────────────────────
 * Chip — Specs & Guidelines depiction islands.
 *
 * Every block here renders the REAL @ds/chip component; numbered
 * pins, color-role callouts and dimension brackets are overlaid via
 * ./lib/Annotated. Replaces the hand-drawn SVG anatomy/color/measure
 * diagrams and the .cs-st-chip / .cs-meas-chip HTML approximations
 * that had drifted from the implementation.
 *
 * Numbered legend lists stay in index.html next to each slot.
 * ────────────────────────────────────────────────────────────── */

const NOINT = "pointer-events-none cursor-default select-none"

/* ════════════════ ASSIST ════════════════ */

export function ChipAssistAnatomy() {
  return (
    <Anatomy
      pins={[
        { n: 1, side: "top" },
        { n: 2, side: "right" },
        { n: 3, side: "left" },
      ]}
    >
      <Chip className={NOINT} icon={<Calendar />}>Reunión</Chip>
    </Anatomy>
  )
}

export function ChipAssistColor() {
  return (
    <Anatomy
      pad={88}
      pins={[
        { n: 1, side: "top" },
        { n: 2, side: "right" },
        { n: 3, side: "bottom" },
        { n: 4, side: "left" },
      ]}
    >
      <Chip className={NOINT} icon={<Calendar />}>Reunión</Chip>
    </Anatomy>
  )
}

/* ════════════════ FILTER ════════════════ */

export function ChipFilterAnatomyUnselected() {
  return (
    <Anatomy
      pins={[
        { n: 1, side: "top" },
        { n: 2, side: "right" },
        { n: 3, side: "left" },
      ]}
    >
      <Chip className={NOINT}>Remoto</Chip>
    </Anatomy>
  )
}

export function ChipFilterAnatomySelected() {
  return (
    <Anatomy
      pins={[
        { n: 1, side: "top" },
        { n: 2, side: "left" },
        { n: 3, side: "right" },
      ]}
    >
      <Chip className={NOINT} selected icon={<Check />}>Remoto</Chip>
    </Anatomy>
  )
}

export function ChipFilterAnatomyLeading() {
  return (
    <Anatomy
      pins={[
        { n: 1, side: "top" },
        { n: 2, side: "left" },
        { n: 3, side: "right" },
      ]}
    >
      <Chip className={NOINT} icon={<Clock />}>Tiempo completo</Chip>
    </Anatomy>
  )
}

export function ChipFilterColor() {
  return (
    <Stage pad={88} style={{ gap: 28, flexWrap: "wrap" }}>
      <div style={{ position: "relative", display: "inline-flex" }}>
        <Chip className={NOINT}>Remoto</Chip>
      </div>
      <div style={{ position: "relative", display: "inline-flex" }}>
        <Chip className={NOINT} selected icon={<Check />}>Remoto</Chip>
      </div>
    </Stage>
  )
}

/* ════════════════ INPUT ════════════════ */

export function ChipInputAnatomyAvatar() {
  return (
    <Anatomy
      pad={88}
      pins={[
        { n: 1, side: "top" },
        { n: 2, side: "left" },
        { n: 3, side: "top", at: "62%" },
        { n: 4, side: "right" },
      ]}
    >
      <InputChip className={NOINT} icon={<UserRound />} onRemove={() => {}} removeLabel="Quitar ana@amalgama.co">
        ana@amalgama.co
      </InputChip>
    </Anatomy>
  )
}

export function ChipInputAnatomyLeading() {
  return (
    <Anatomy
      pins={[
        { n: 1, side: "top" },
        { n: 2, side: "left" },
        { n: 3, side: "bottom" },
        { n: 4, side: "right" },
      ]}
    >
      <InputChip className={NOINT} icon={<Tag />} onRemove={() => {}} removeLabel="Quitar diseño-ui">
        diseño-ui
      </InputChip>
    </Anatomy>
  )
}

/* ════════════════ SUGGESTION ════════════════ */

export function ChipSuggestionAnatomy() {
  return (
    <Anatomy
      pins={[
        { n: 1, side: "top" },
        { n: 2, side: "right" },
      ]}
    >
      <Chip className={NOINT}>Buscar proyectos</Chip>
    </Anatomy>
  )
}

/* ════════════════ MEASURES ════════════════ */

function MeasuredChip({
  icon,
  label,
  full,
  caption,
}: {
  icon?: React.ReactNode
  label: string
  full?: boolean
  caption?: string
}) {
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
    const ic = m.zones.icon
    const yb = cB + 16
    brackets.push(<VBracket key="h" x={cL - 26} y1={cT} y2={cB} label="32dp" />)
    if (full && lab) {
      const lL = lab.left - hx
      const lR = lab.right - hx
      if (icon && ic) {
        const iL = ic.left - hx
        const iR = ic.right - hx
        brackets.push(<HBracket key="lp" x1={cL} x2={iL} y={yb} label="8" />)
        brackets.push(<HBracket key="gap" x1={iR} x2={lL} y={yb} label="8" />)
        brackets.push(<HBracket key="rp" x1={lR} x2={cR} y={yb} label="16" />)
        brackets.push(<HBracket key="iw" x1={iL} x2={iR} y={cT - 16} label="18" />)
      } else {
        brackets.push(<HBracket key="lp" x1={cL} x2={lL} y={yb} label="16" />)
        brackets.push(<HBracket key="rp" x1={lR} x2={cR} y={yb} label="16" />)
      }
    }
  }
  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: full ? "52px 72px 60px" : "44px 72px 28px",
      }}
    >
      <Chip className={NOINT} icon={icon ? <span data-mz="icon" style={{ display: "inline-flex" }}>{icon}</span> : undefined} {...({ "data-mz-chip": "" } as Record<string, string>)}>
        <span data-mz="label">{label}</span>
      </Chip>
      {brackets}
      {caption && (
        <div style={{ marginTop: 18, font: "400 11px 'Inter',sans-serif", color: "var(--color-on-surface-variant)" }}>{caption}</div>
      )}
    </div>
  )
}

export function ChipAssistMeasures() {
  return (
    <Stage pad={0} style={{ gap: 24, flexWrap: "wrap", padding: "8px 16px" }}>
      <MeasuredChip label="Etiqueta" full caption="sin ícono" />
      <MeasuredChip icon={<Calendar />} label="Etiqueta" full caption="con ícono" />
    </Stage>
  )
}

const bareRow: React.CSSProperties = { display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", alignItems: "flex-end" }

export function ChipFilterMeasures() {
  return (
    <div style={bareRow}>
      <MeasuredChip label="Remoto" caption="No seleccionado" />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", padding: "44px 24px 28px" }}>
        <Chip className={NOINT} selected icon={<Check />}>Remoto</Chip>
        <div style={{ marginTop: 18, font: "400 11px 'Inter',sans-serif", color: "var(--color-on-surface-variant)" }}>Seleccionado</div>
      </div>
    </div>
  )
}

export function ChipInputMeasures() {
  return (
    <div style={bareRow}>
      <MeasuredChip icon={<UserRound />} label="Etiqueta" caption="con avatar + ícono de eliminación" />
    </div>
  )
}

export function ChipSuggestionMeasures() {
  return (
    <div style={bareRow}>
      <MeasuredChip label="Buscar proyectos" />
    </div>
  )
}

/* ════════════════ STATES ════════════════ */

type LayerBase = "surface" | "secondary"

function layerColor(base: LayerBase, pct: number) {
  const tok = base === "secondary" ? "--color-on-secondary-container" : "--color-on-surface"
  return `color-mix(in srgb, var(${tok}) ${pct}%, transparent)`
}

function StateCell({
  children,
  layer,
  focus,
  drag,
}: {
  children: React.ReactNode
  layer?: string
  focus?: boolean
  drag?: boolean
}) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <span
        style={{
          position: "relative",
          display: "inline-flex",
          borderRadius: 999,
          boxShadow: drag ? "0 4px 12px rgba(0,0,0,.22)" : undefined,
        }}
        className={focus ? "bd-sim-focus" : undefined}
      >
        {children}
        {layer && (
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, borderRadius: "inherit", background: layer, pointerEvents: "none" }} />
        )}
      </span>
    </div>
  )
}

const COL_LABEL: React.CSSProperties = { font: "400 10px 'Inter',sans-serif", color: "var(--color-on-surface-variant)", textAlign: "center" }
const ROW_LABEL: React.CSSProperties = { font: "500 11px 'Inter',sans-serif", color: "var(--color-on-surface-variant)" }

function StatesGrid({ rows, cols, children }: { rows: number; cols: string[]; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--color-surface-container-lowest)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px 20px", overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: `72px repeat(${cols.length}, 1fr)`, gap: "14px 8px", minWidth: 120 + cols.length * 96, alignItems: "center" }}>
        {children}
        <div />
        {cols.map((c) => (
          <div key={c} style={COL_LABEL}>{c}</div>
        ))}
      </div>
    </div>
  )
}

export function ChipAssistStates() {
  const make = (variant: "outlined" | "elevated") => {
    const chip = (extra?: React.ComponentProps<typeof Chip>) => (
      <Chip className={NOINT} variant={variant} icon={<Calendar />} {...extra}>Etiqueta</Chip>
    )
    return [
      <StateCell key="en">{chip()}</StateCell>,
      <StateCell key="dis">{chip({ disabled: true, style: { opacity: 0.38 } })}</StateCell>,
      <StateCell key="hov" layer={layerColor("surface", 8)}>{chip()}</StateCell>,
      <StateCell key="foc" focus layer={layerColor("surface", 12)}>{chip()}</StateCell>,
      <StateCell key="prs" layer={layerColor("surface", 12)}>{chip()}</StateCell>,
      <StateCell key="drg" drag layer={layerColor("surface", 16)}>{chip()}</StateCell>,
    ]
  }
  return (
    <StatesGrid rows={2} cols={["Habilitado", "Deshabilitado", "Hover", "Enfocado", "Presionado", "Arrastrado"]}>
      <div style={ROW_LABEL}>Plano</div>
      {make("outlined")}
      <div style={ROW_LABEL}>Elevado</div>
      {make("elevated")}
    </StatesGrid>
  )
}

export function ChipFilterStates() {
  const unsel = () => <Chip className={NOINT}>Remoto</Chip>
  const sel = () => <Chip className={NOINT} selected icon={<Check />}>Remoto</Chip>
  return (
    <StatesGrid rows={2} cols={["Habilitado", "Deshabilitado", "Hover", "Enfocado", "Presionado"]}>
      <div style={ROW_LABEL}>No sel.</div>
      <StateCell>{unsel()}</StateCell>
      <StateCell><Chip className={NOINT} disabled style={{ opacity: 0.38 }}>Remoto</Chip></StateCell>
      <StateCell layer={layerColor("surface", 8)}>{unsel()}</StateCell>
      <StateCell focus layer={layerColor("surface", 12)}>{unsel()}</StateCell>
      <StateCell layer={layerColor("surface", 12)}>{unsel()}</StateCell>
      <div style={ROW_LABEL}>Sel.</div>
      <StateCell>{sel()}</StateCell>
      <StateCell><Chip className={NOINT} selected icon={<Check />} disabled style={{ opacity: 0.38 }}>Remoto</Chip></StateCell>
      <StateCell layer={layerColor("secondary", 8)}>{sel()}</StateCell>
      <StateCell focus layer={layerColor("secondary", 12)}>{sel()}</StateCell>
      <StateCell layer={layerColor("secondary", 12)}>{sel()}</StateCell>
    </StatesGrid>
  )
}

/* ════════════════ GUIDELINES ════════════════ */

/** Main anatomy diagram: leading icon + label + trailing remove. */
export function ChipGuidelinesAnatomy() {
  return (
    <Anatomy
      pad={88}
      pins={[
        { n: 1, side: "top" },
        { n: 2, side: "top", at: "62%" },
        { n: 3, side: "left" },
        { n: 4, side: "right" },
      ]}
    >
      <InputChip className={NOINT} icon={<Camera />} onRemove={() => {}} removeLabel="Quitar Agregar fotos">
        Agregar fotos
      </InputChip>
    </Anatomy>
  )
}

/** Container / pill-radius diagram. */
export function ChipGuidelinesContainer() {
  return (
    <Stage pad={72}>
      <InputChip className={NOINT} icon={<UserRound />} onRemove={() => {}} removeLabel="Quitar Ana Vega">
        Ana Vega
      </InputChip>
    </Stage>
  )
}

/** Leading icon / image — real avatar input chip + icon filter chip. */
export function ChipGlLeadingIcon() {
  return (
    <Stage pad={40} style={{ gap: 12, flexWrap: "wrap" }}>
      <InputChip className={NOINT} icon={<UserRound />} onRemove={() => {}} removeLabel="Quitar Ana Vega">
        Ana Vega
      </InputChip>
      <Chip className={NOINT} icon={<ImageIcon />}>Tipo: Imágenes</Chip>
    </Stage>
  )
}

/**
 * Usage scene — chips appear as a group of interactive elements.
 * The phone chrome is lightweight HTML illustration; the three
 * assist chips are the real component.
 */
export function ChipGuidelinesUsageScene() {
  const muted = "var(--color-on-surface-variant)"
  return (
    <div style={{ background: "var(--color-surface-container)", borderRadius: 12, overflow: "hidden" }}>
      {/* status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px", background: "var(--color-surface)", font: "600 11px 'Inter',sans-serif", color: "var(--color-on-surface)" }}>
        <span>9:30</span>
        <span style={{ width: 22, height: 11, border: "1.2px solid currentColor", borderRadius: 3, position: "relative" }}>
          <span style={{ position: "absolute", inset: 2, right: 3, background: "currentColor", borderRadius: 1 }} />
        </span>
      </div>
      {/* nav bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "var(--color-surface)" }}>
        <span style={{ font: "400 18px 'Inter',sans-serif", color: muted }}>≡</span>
        <span style={{ flex: 1, textAlign: "center", font: "600 15px 'Inter',sans-serif", color: "var(--color-on-surface)" }}>Compartí tus experiencias</span>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", background: "var(--color-secondary-container)", color: "var(--color-on-secondary-container)", font: "700 11px 'Inter',sans-serif" }}>AV</span>
      </div>
      <div style={{ textAlign: "center", font: "400 11px 'Inter',sans-serif", color: "var(--color-on-surface-variant)", padding: "2px 0 8px", background: "var(--color-surface)" }}>Publicando públicamente ⓘ</div>
      {/* chips row — real components */}
      <div style={{ display: "flex", gap: 8, padding: "0 16px 14px", background: "var(--color-surface)", flexWrap: "wrap" }}>
        <Chip className={NOINT} icon={<Camera />}>Agregar fotos</Chip>
        <Chip className={NOINT} icon={<Utensils />}>Agregar platos</Chip>
        <Chip className={NOINT} icon={<Star />}>Calificar lugar</Chip>
      </div>
      {/* photo placeholder */}
      <div style={{ height: 96, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, background: "var(--color-surface-variant)" }}>🌮</div>
    </div>
  )
}
