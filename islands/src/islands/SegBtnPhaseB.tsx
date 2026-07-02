import { useState, useRef } from "react"
import { SegmentedButtonGroup, SegmentedButtonItem } from "@ds/segmented-button"
import { Sun, Moon, List, LayoutGrid } from "lucide-react"
import { Anatomy } from "./lib/Annotated"

/* ── Styles → Color Roles · Light/Dark preview toggle ──
 * The canonical Segmented Button, reused as the role-board mode switch
 * (was the bespoke .ds-role-modes / .ds-role-mode-btn clone). Flips
 * .is-dark on the parent .ds-role-demo — same behavior as the old
 * setRoleBoardMode(), now driven by the real component. */
export function RoleBoardMode() {
  const ref = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState("light")
  const apply = (m: string) => {
    setMode(m)
    const demo = ref.current?.closest(".ds-role-demo")
    if (demo) demo.classList.toggle("is-dark", m === "dark")
  }
  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <SegmentedButtonGroup size="sm" value={mode} onValueChange={(v) => v && apply(v)} aria-label="Modo de previsualización">
        <SegmentedButtonItem value="light"><Sun aria-hidden="true" />Light</SegmentedButtonItem>
        <SegmentedButtonItem value="dark"><Moon aria-hidden="true" />Dark</SegmentedButtonItem>
      </SegmentedButtonGroup>
    </div>
  )
}

/* ── Button page · token-explorer switchers ──
 * The canonical Segmented Button reused for the Button token explorer's
 * Category / Variant / Size switchers (were .seg-btn-group clones).
 * The three islands share btState so switching category shows the panel
 * matching that category's current variant; they drive the existing
 * .bt-tok-panel / .bt-subvar-row DOM (no .seg-btn CSS clone needed). */
const btState = { color: "elevated", size: "xs" }
let btCat = "color"
function btShowRows(cat: string) {
  document.querySelectorAll<HTMLElement>(".bt-subvar-row").forEach((r) => {
    r.style.display = r.dataset.btSubvar === cat ? "flex" : "none"
  })
}
function btShowPanel(cat: string, variant: string) {
  document.querySelectorAll<HTMLElement>(".bt-tok-panel").forEach((p) => {
    const on = p.dataset.btCat === cat && p.dataset.btPanel === variant
    if (on) { p.classList.add("active"); p.style.removeProperty("display") }
    else { p.classList.remove("active"); if (p.dataset.btCat === "size") p.style.display = "none" }
  })
}

export function BtCatTabs() {
  const [cat, setCat] = useState("color")
  return (
    <SegmentedButtonGroup size="sm" value={cat} onValueChange={(c) => { if (!c) return; setCat(c); btCat = c; btShowRows(c); btShowPanel(c, c === "color" ? btState.color : btState.size) }} aria-label="Categoría de token">
      <SegmentedButtonItem value="color">Color</SegmentedButtonItem>
      <SegmentedButtonItem value="size">Tamaño</SegmentedButtonItem>
    </SegmentedButtonGroup>
  )
}

const COLOR_VARIANTS: Array<[string, string]> = [["elevated", "Elevado"], ["filled", "Relleno"], ["tonal", "Tonal"], ["outlined", "Con borde"], ["text", "Texto"], ["icon", "Ícono"]]
export function BtColorVariants() {
  const [v, setV] = useState("elevated")
  return (
    <SegmentedButtonGroup size="sm" value={v} onValueChange={(x) => { if (!x) return; setV(x); btState.color = x; if (btCat === "color") btShowPanel("color", x) }} aria-label="Variante de color de botón">
      {COLOR_VARIANTS.map(([val, label]) => <SegmentedButtonItem key={val} value={val}>{label}</SegmentedButtonItem>)}
    </SegmentedButtonGroup>
  )
}

const SIZE_VARIANTS: Array<[string, string]> = [["xs", "XPequeño"], ["sm", "Pequeño"], ["md", "Mediano"], ["lg", "Grande"], ["xl", "XGrande"]]
export function BtSizeVariants() {
  const [v, setV] = useState("xs")
  return (
    <SegmentedButtonGroup size="sm" value={v} onValueChange={(x) => { if (!x) return; setV(x); btState.size = x; if (btCat === "size") btShowPanel("size", x) }} aria-label="Variante de tamaño de botón">
      {SIZE_VARIANTS.map(([val, label]) => <SegmentedButtonItem key={val} value={val}>{label}</SegmentedButtonItem>)}
    </SegmentedButtonGroup>
  )
}

/* ── Con íconos (Light / Dark switch, like Styles → Color Roles) ── */
export function SegBtnIcons() {
  const [v, setV] = useState("light")
  return (
    <SegmentedButtonGroup value={v} onValueChange={(x) => x && setV(x)} aria-label="Tema">
      <SegmentedButtonItem value="light"><Sun aria-hidden="true" />Light</SegmentedButtonItem>
      <SegmentedButtonItem value="dark"><Moon aria-hidden="true" />Dark</SegmentedButtonItem>
    </SegmentedButtonGroup>
  )
}

/* ── Con íconos — icon-only (requires aria-label per item) ── */
export function SegBtnIconsOnly() {
  const [v, setV] = useState("list")
  return (
    <SegmentedButtonGroup value={v} onValueChange={(x) => x && setV(x)} aria-label="Vista">
      <SegmentedButtonItem value="list" aria-label="Lista"><List aria-hidden="true" /></SegmentedButtonItem>
      <SegmentedButtonItem value="grid" aria-label="Cuadrícula"><LayoutGrid aria-hidden="true" /></SegmentedButtonItem>
    </SegmentedButtonGroup>
  )
}

/* ── Specs · Anatomía (real segmented control + overlay pins) ── */
export function SegBtnAnatomy() {
  return (
    <Anatomy
      pad={72}
      pins={[
        { n: 1, side: "left" },
        { n: 2, side: "top", at: "72%" },
        { n: 3, side: "bottom", at: "28%" },
      ]}
    >
      <SegmentedButtonGroup value="cuad" onValueChange={() => {}} aria-label="Anatomía de segmented button">
        <SegmentedButtonItem value="lista">Lista</SegmentedButtonItem>
        <SegmentedButtonItem value="cuad">Cuadrícula</SegmentedButtonItem>
      </SegmentedButtonGroup>
    </Anatomy>
  )
}

/* ── Guidelines · Single-select vs Multi-select ── */

export function SegBtnSingle() {
  const [v, setV] = useState("semana")
  return (
    <SegmentedButtonGroup value={v} onValueChange={(x) => x && setV(x)} aria-label="Período">
      <SegmentedButtonItem value="dia">Día</SegmentedButtonItem>
      <SegmentedButtonItem value="semana">Semana</SegmentedButtonItem>
      <SegmentedButtonItem value="mes">Mes</SegmentedButtonItem>
    </SegmentedButtonGroup>
  )
}

export function SegBtnMulti() {
  const [v, setV] = useState<string[]>(["lun", "mie"])
  return (
    <SegmentedButtonGroup
      type="multiple"
      value={v}
      onValueChange={(x) => setV(x as string[])}
      aria-label="Días laborables"
    >
      <SegmentedButtonItem value="lun">Lun</SegmentedButtonItem>
      <SegmentedButtonItem value="mar">Mar</SegmentedButtonItem>
      <SegmentedButtonItem value="mie">Mié</SegmentedButtonItem>
      <SegmentedButtonItem value="jue">Jue</SegmentedButtonItem>
      <SegmentedButtonItem value="vie">Vie</SegmentedButtonItem>
    </SegmentedButtonGroup>
  )
}

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
