import * as React from "react"
import { Chip, InputChip, ChipSet } from "@ds/chip"
import { Calendar, Check, Search } from "lucide-react"

/* ──────────────────────────────────────────────────────────────
 * Chip — Phase B islands
 * Real @ds/chip components replacing static .cs-chip / .chip
 * CSS-class markup across Guidelines, Accessibility and Code tabs.
 * ────────────────────────────────────────────────────────────── */

/**
 * Guidelines · "Variantes" — the canonical four chip variants
 * (Assist / Filter selected / Input / Suggestion), each under a
 * numbered marker. Replaces the inner cs-chip flex row; the
 * numbered legend below it stays in the HTML.
 */
export function ChipVariantsGuidelines() {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: 20,
      }}
    >
      {/* 1 Assist */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span className="cg-num">1</span>
        <Chip icon={<Calendar />}>Assist</Chip>
      </div>
      {/* 2 Filter selected */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span className="cg-num">2</span>
        <Chip selected icon={<Check />}>Filter</Chip>
      </div>
      {/* 3 Input */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span className="cg-num">3</span>
        <InputChip onRemove={() => {}} removeLabel="Quitar Input">Input</InputChip>
      </div>
      {/* 4 Suggestion */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span className="cg-num">4</span>
        <Chip>Suggestion</Chip>
      </div>
    </div>
  )
}

/**
 * Accessibility · "Foco visible" — a chip showing its focus ring.
 * The real component uses focus-visible:focus-ring, which only
 * appears on keyboard nav, so we force the ring with the page's
 * .bd-sim-focus simulation class for an always-visible demo.
 */
export function ChipFocusState() {
  return <Chip className="bd-sim-focus">Enfocado</Chip>
}

/**
 * Code · "Las cuatro variantes" — live preview above the escaped
 * HTML <code> block. Assist (leading icon), Filter (unselected +
 * selected), Input (removable) and Suggestion.
 */
export function ChipCodeVariants() {
  const [fullTime, setFullTime] = React.useState(true)
  const [remote, setRemote] = React.useState(false)
  return (
    <ChipSet aria-label="Variantes de chip">
      <Chip icon={<Calendar />}>Agendar entrevista</Chip>
      <Chip selected={remote} onClick={() => setRemote((v) => !v)}>Remoto</Chip>
      <Chip selected={fullTime} onClick={() => setFullTime((v) => !v)}>Full-time</Chip>
      <InputChip onRemove={() => {}} removeLabel="Quitar ana@amalgama.co">
        ana@amalgama.co
      </InputChip>
      <Chip icon={<Search />}>Buscar diseñadores</Chip>
    </ChipSet>
  )
}

/**
 * Code · "Elevado y deshabilitado" — live preview above its
 * escaped <code> block. Elevated chip (border → shadow) and a
 * disabled chip (native disabled attribute).
 */
export function ChipElevatedDisabled() {
  return (
    <ChipSet aria-label="Elevado y deshabilitado">
      <Chip variant="elevated">Elevado</Chip>
      <Chip disabled className="opacity-[0.38] cursor-not-allowed">Deshabilitado</Chip>
    </ChipSet>
  )
}
