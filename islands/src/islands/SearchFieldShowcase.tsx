import * as React from "react"
import { SearchBar } from "@ds/search"
import { Toolbar, SearchField, ToolbarButton } from "@ds/toolbar"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@ds/select"
import { Stage, Anchor, useMeasured, VBracket } from "./lib/Annotated"

/* ────────────────────────────────────────────────────────────
 * Search Field — the desktop/toolbar variant of Search.
 *
 * SearchField (packages/ds/components/ui/toolbar.tsx) shares its state-layer
 * tokens 1:1 with SearchBar (--search-field-hover/-focus/-border-hover) and
 * the same --border container tier as Select/Input/Textarea — it is not a
 * separate token system, just a different shape/height for a different
 * context (row of controls vs. standalone hero field).
 * ──────────────────────────────────────────────────────────── */

function RotateIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="6" y1="18" x2="18" y2="6" />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════
 * OVERVIEW · platform-variant comparison — Search Bar (mobile)
 * vs Search Field (desktop). registryKey: search-variants-showcase
 * ════════════════════════════════════════════════════════════ */

export function SearchVariantsShowcase() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <p style={{ font: "600 12px 'Inter',sans-serif", color: "var(--color-on-surface-variant)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: ".02em" }}>
          Search Bar — Mobile
        </p>
        <SearchBar placeholder="Buscar vacantes, personas, empresas…" aria-label="Buscar" containerClassName="max-w-full" />
      </div>
      <div>
        <p style={{ font: "600 12px 'Inter',sans-serif", color: "var(--color-on-surface-variant)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: ".02em" }}>
          Search Field — Desktop
        </p>
        <Toolbar className="!mb-0">
          <SearchField placeholder="Buscar por nombre o link" aria-label="Buscar por nombre o link" />
          <Select>
            <SelectTrigger aria-label="Todos los estados" className="w-[170px] shrink-0">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="draft">Borrador</SelectItem>
            </SelectContent>
          </Select>
          <ToolbarButton>
            <RotateIcon />
            Restablecer filtros
          </ToolbarButton>
        </Toolbar>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
 * GUIDELINES · Search Field inside a real filter toolbar.
 * registryKey: search-field-toolbar-showcase
 * ════════════════════════════════════════════════════════════ */

export function SearchFieldToolbarShowcase() {
  return (
    <Toolbar className="!mb-0">
      <SearchField placeholder="Buscar por nombre o link" aria-label="Buscar por nombre o link" />
      <Select>
        <SelectTrigger aria-label="Todos los estados" className="w-[170px] shrink-0">
          <SelectValue placeholder="Todos los estados" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="active">Activo</SelectItem>
          <SelectItem value="draft">Borrador</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger aria-label="Filtrar por etiqueta" className="w-[190px] shrink-0">
          <SelectValue placeholder="Filtrar por etiqueta" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="urgent">Urgente</SelectItem>
          <SelectItem value="remote">Remoto</SelectItem>
        </SelectContent>
      </Select>
      <ToolbarButton>
        <RotateIcon />
        Restablecer filtros
      </ToolbarButton>
    </Toolbar>
  )
}

/* ════════════════════════════════════════════════════════════
 * SPECS · Anatomía — Search Field
 * registryKey: search-field-anatomy
 * ════════════════════════════════════════════════════════════ */

export function SearchFieldAnatomy() {
  return (
    <Stage pad={72}>
      <Anchor
        style={{ width: "min(360px, 100%)" }}
        pins={[
          { n: 1, side: "top" },
          { n: 2, side: "left" },
          { n: 3, side: "bottom", at: "60%" },
        ]}
      >
        <SearchField placeholder="Buscar por nombre o link" aria-label="Buscar por nombre o link" containerClassName="w-full" />
      </Anchor>
    </Stage>
  )
}

/* ════════════════════════════════════════════════════════════
 * SPECS · Medidas — Search Field (measured height bracket)
 * registryKey: search-field-measures
 * ════════════════════════════════════════════════════════════ */

export function SearchFieldMeasures() {
  const ref = React.useRef<HTMLDivElement>(null)
  const m = useMeasured(ref)
  let bracket: React.ReactNode = null
  if (m) {
    const cT = m.chip.top - m.host.top
    const cB = m.chip.bottom - m.host.top
    const cL = m.chip.left - m.host.left
    bracket = <VBracket x={cL - 26} y1={cT} y2={cB} label="40dp" />
  }
  return (
    <div ref={ref} style={{ position: "relative", display: "flex", justifyContent: "center", padding: "20px 80px" }}>
      <div style={{ width: "min(360px, 100%)" }} {...({ "data-mz-chip": "" } as Record<string, string>)}>
        <SearchField placeholder="Buscar por nombre o link" aria-label="Buscar por nombre o link" containerClassName="w-full" />
      </div>
      {bracket}
    </div>
  )
}
