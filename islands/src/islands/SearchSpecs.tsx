import * as React from "react"
import { SearchBar, SearchBarAvatar, SearchView, SearchViewHeader, SearchViewResults, SearchViewResult } from "@ds/search"
import { Mic, Clock, FileText, Briefcase } from "lucide-react"
import { Stage, Anchor, useMeasured, VBracket } from "./lib/Annotated"

/* ──────────────────────────────────────────────────────────────
 * Search — Specs depiction islands.
 *
 * Real @ds/search components (SearchBar / SearchView) replace the
 * static anatomy / color / states / measure SVGs. The real bar is
 * 56dp tall (the old SVGs drew 40dp); converting corrects that drift.
 * Color is one theme-aware bar instead of a baked light/dark pair.
 * ────────────────────────────────────────────────────────────── */

function BarTrailing() {
  return (
    <span className="inline-flex items-center gap-3">
      <Mic className="w-6 h-6 text-on-surface-variant" />
      <SearchBarAvatar>AV</SearchBarAvatar>
    </span>
  )
}

export function SearchBarAnatomy() {
  return (
    <Stage pad={72}>
      <Anchor
        style={{ width: "min(460px, 100%)" }}
        pins={[
          { n: 1, side: "top" },
          { n: 2, side: "left" },
          { n: 3, side: "top", at: "34%" },
          { n: 4, side: "bottom", at: "78%" },
          { n: 5, side: "right" },
        ]}
      >
        <SearchBar placeholder="Buscar vacantes..." aria-label="Buscar vacantes" trailing={<BarTrailing />} />
      </Anchor>
    </Stage>
  )
}

export function SearchColor() {
  return (
    <Stage pad={48}>
      <div style={{ width: "min(460px, 100%)" }}>
        <SearchBar placeholder="Buscar en Embassy" aria-label="Buscar en Embassy" trailing={<SearchBarAvatar>AV</SearchBarAvatar>} />
      </div>
    </Stage>
  )
}

export function SearchViewAnatomy() {
  return (
    <Stage pad={40}>
      <div style={{ width: "min(460px, 100%)" }}>
        <Anchor
          style={{ width: "100%" }}
          pins={[
            { n: 2, side: "top", at: "85%" },
            { n: 1, side: "left", at: "85%" },
          ]}
        >
          <SearchView style={{ width: "100%" }}>
            <SearchViewHeader onBack={() => {}}>
              <SearchBar placeholder="Texto de apoyo" aria-label="Buscar" containerClassName="border-none bg-transparent" trailing={<Mic className="w-6 h-6 text-on-surface-variant" />} />
            </SearchViewHeader>
            <SearchViewResults>
              <SearchViewResult icon={<Clock />}>Diseñador/a UX</SearchViewResult>
              <SearchViewResult icon={<FileText />}>Diseñador/a de producto</SearchViewResult>
              <SearchViewResult icon={<Briefcase />}>Diseñador/a visual</SearchViewResult>
            </SearchViewResults>
          </SearchView>
        </Anchor>
      </div>
    </Stage>
  )
}

const ROW_LABEL: React.CSSProperties = { font: "600 11px 'Inter',sans-serif", color: "var(--color-on-surface-variant)", alignSelf: "center" }

function StateRow({ label, container, disabled, layer }: { label: string; container?: string; disabled?: boolean; layer?: string }) {
  return (
    <>
      <div style={ROW_LABEL}>{label}</div>
      <div style={{ position: "relative", display: "flex" }}>
        <SearchBar
          placeholder="Buscar"
          aria-label={`Buscar — ${label}`}
          disabled={disabled}
          containerClassName={(container ?? "") + (disabled ? " opacity-[0.38] pointer-events-none" : "")}
          trailing={<SearchBarAvatar>AV</SearchBarAvatar>}
        />
        {layer && <span aria-hidden="true" style={{ position: "absolute", inset: 0, borderRadius: 999, background: layer, pointerEvents: "none" }} />}
      </div>
    </>
  )
}

export function SearchStates() {
  const tint = (p: number) => `color-mix(in srgb, var(--color-on-surface) ${p}%, transparent)`
  return (
    <div style={{ background: "var(--color-surface-container-lowest)", border: "1px solid var(--border)", borderRadius: 12, padding: "28px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "110px minmax(0,1fr)", gap: "16px 16px", maxWidth: 560 }}>
        <StateRow label="Habilitado" />
        <StateRow label="Hover" container="bg-search-field-hover border-search-field-border-hover" layer={tint(8)} />
        <StateRow label="Enfocado" container="bg-search-field-focus border-secondary bd-sim-focus" />
        <StateRow label="Presionado" container="bg-search-field-focus border-secondary" layer={tint(12)} />
        <StateRow label="Deshabilitado" disabled />
      </div>
    </div>
  )
}


/* Medidas · Search bar — real bar with measured 56dp height bracket */
export function SearchBarMeasures() {
  const ref = React.useRef<HTMLDivElement>(null)
  const m = useMeasured(ref)
  let bracket: React.ReactNode = null
  if (m) {
    const cT = m.chip.top - m.host.top
    const cB = m.chip.bottom - m.host.top
    const cL = m.chip.left - m.host.left
    bracket = <VBracket x={cL - 26} y1={cT} y2={cB} label="56dp" />
  }
  return (
    <div ref={ref} style={{ position: "relative", display: "flex", justifyContent: "center", padding: "20px 80px" }}>
      <div style={{ width: "min(420px, 100%)" }} {...({ "data-mz-chip": "" } as Record<string, string>)}>
        <SearchBar placeholder="Buscar vacantes..." aria-label="Buscar" trailing={<SearchBarAvatar>AV</SearchBarAvatar>} />
      </div>
      {bracket}
    </div>
  )
}

/* Medidas · Search view — real view with measured 72dp header bracket */
export function SearchViewMeasures() {
  const ref = React.useRef<HTMLDivElement>(null)
  const m = useMeasured(ref)
  let bracket: React.ReactNode = null
  if (m) {
    const cT = m.chip.top - m.host.top
    const cB = m.chip.bottom - m.host.top
    const cL = m.chip.left - m.host.left
    bracket = <VBracket x={cL - 26} y1={cT} y2={cB} label="72dp" />
  }
  return (
    <div ref={ref} style={{ position: "relative", display: "flex", justifyContent: "center", padding: "20px 80px" }}>
      <div style={{ width: "min(440px, 100%)" }}>
        <SearchView style={{ width: "100%" }}>
          <SearchViewHeader onBack={() => {}} {...({ "data-mz-chip": "" } as Record<string, string>)}>
            <SearchBar placeholder="Buscar" aria-label="Buscar" containerClassName="border-none bg-transparent" />
          </SearchViewHeader>
          <SearchViewResults>
            <SearchViewResult icon={<Clock />}>Resultado reciente</SearchViewResult>
            <SearchViewResult icon={<FileText />}>Sugerencia</SearchViewResult>
          </SearchViewResults>
        </SearchView>
      </div>
      {bracket}
    </div>
  )
}
