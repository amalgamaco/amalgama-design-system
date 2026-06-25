import { useState } from "react"
import { SegmentedButtonGroup, SegmentedButtonItem } from "@ds/segmented-button"

/* ── Specs · Configuraciones (sizes) ── */

export function SegBtnSizeSm() {
  const [v, setV] = useState("a")
  return (
    <SegmentedButtonGroup size="sm" value={v} onValueChange={(x) => x && setV(x)} aria-label="Tamaño small">
      <SegmentedButtonItem value="a">Opción A</SegmentedButtonItem>
      <SegmentedButtonItem value="b">Opción B</SegmentedButtonItem>
    </SegmentedButtonGroup>
  )
}

export function SegBtnSizeMd() {
  const [v, setV] = useState("a")
  return (
    <SegmentedButtonGroup value={v} onValueChange={(x) => x && setV(x)} aria-label="Tamaño medium">
      <SegmentedButtonItem value="a">Opción A</SegmentedButtonItem>
      <SegmentedButtonItem value="b">Opción B</SegmentedButtonItem>
    </SegmentedButtonGroup>
  )
}

export function SegBtnSizeLg() {
  const [v, setV] = useState("a")
  return (
    <SegmentedButtonGroup size="lg" value={v} onValueChange={(x) => x && setV(x)} aria-label="Tamaño large">
      <SegmentedButtonItem value="a">Opción A</SegmentedButtonItem>
      <SegmentedButtonItem value="b">Opción B</SegmentedButtonItem>
    </SegmentedButtonGroup>
  )
}

/* ── Specs · Estados ── */

export function SegBtnStateDefault() {
  const [v, setV] = useState("")
  return (
    <SegmentedButtonGroup value={v} onValueChange={(x) => setV(x ?? "")} aria-label="Estado default">
      <SegmentedButtonItem value="a">Opción A</SegmentedButtonItem>
      <SegmentedButtonItem value="b">Opción B</SegmentedButtonItem>
    </SegmentedButtonGroup>
  )
}

export function SegBtnStateSelected() {
  const [v, setV] = useState("a")
  return (
    <SegmentedButtonGroup value={v} onValueChange={(x) => x && setV(x)} aria-label="Estado seleccionado">
      <SegmentedButtonItem value="a">Opción A</SegmentedButtonItem>
      <SegmentedButtonItem value="b">Opción B</SegmentedButtonItem>
    </SegmentedButtonGroup>
  )
}

export function SegBtnStateDisabled() {
  return (
    <SegmentedButtonGroup value="a" onValueChange={() => {}} aria-label="Estado deshabilitado">
      <SegmentedButtonItem value="a" disabled>Opción A</SegmentedButtonItem>
      <SegmentedButtonItem value="b" disabled>Opción B</SegmentedButtonItem>
    </SegmentedButtonGroup>
  )
}

/* ── Guidelines · Hacer y no hacer ── */

export function SegBtnDoViews() {
  const [v, setV] = useState("lista")
  return (
    <SegmentedButtonGroup value={v} onValueChange={(x) => x && setV(x)} aria-label="Vista de candidatos">
      <SegmentedButtonItem value="lista">Lista</SegmentedButtonItem>
      <SegmentedButtonItem value="cuadricula">Cuadrícula</SegmentedButtonItem>
    </SegmentedButtonGroup>
  )
}

/* DON'T — actions as segments. Still the real component, just misused as CTAs. */
export function SegBtnDontActions() {
  const [v, setV] = useState("guardar")
  return (
    <SegmentedButtonGroup value={v} onValueChange={(x) => x && setV(x)} aria-label="Acciones">
      <SegmentedButtonItem value="guardar">Guardar</SegmentedButtonItem>
      <SegmentedButtonItem value="cancelar">Cancelar</SegmentedButtonItem>
    </SegmentedButtonGroup>
  )
}

export function SegBtnDoPeriod() {
  const [v, setV] = useState("30d")
  return (
    <SegmentedButtonGroup value={v} onValueChange={(x) => x && setV(x)} aria-label="Período">
      <SegmentedButtonItem value="7d">7D</SegmentedButtonItem>
      <SegmentedButtonItem value="30d">30D</SegmentedButtonItem>
      <SegmentedButtonItem value="90d">90D</SegmentedButtonItem>
    </SegmentedButtonGroup>
  )
}

/* DON'T — too many options. Still the real component, just misused with 5 segments. */
export function SegBtnDontTooMany() {
  const [v, setV] = useState("lunes")
  return (
    <SegmentedButtonGroup value={v} onValueChange={(x) => x && setV(x)} aria-label="Días">
      <SegmentedButtonItem value="lunes">Lunes</SegmentedButtonItem>
      <SegmentedButtonItem value="martes">Martes</SegmentedButtonItem>
      <SegmentedButtonItem value="miercoles">Miércoles</SegmentedButtonItem>
      <SegmentedButtonItem value="jueves">Jueves</SegmentedButtonItem>
      <SegmentedButtonItem value="viernes">Viernes</SegmentedButtonItem>
    </SegmentedButtonGroup>
  )
}
