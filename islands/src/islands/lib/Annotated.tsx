import * as React from "react"

/* ──────────────────────────────────────────────────────────────
 * Annotated — overlay primitives for Specs/Guidelines diagrams.
 *
 * The component being documented is rendered LIVE (real @ds
 * component); the numbered callout pins and dimension brackets are
 * drawn as absolutely-positioned HTML/CSS overlays anchored to it.
 * That keeps the depicted component pixel-accurate (it IS the
 * implementation) while preserving the instructional annotations.
 *
 * Anchoring is geometric (pins point at the live element's edges,
 * dimension brackets are measured from real bounding rects), so the
 * diagram cannot drift away from the component.
 *
 * All annotations are aria-hidden; the live component carries the
 * real semantics. The stage follows the global theme toggle, so a
 * single live example recalibrates for light/dark (one mode at a
 * time) instead of a baked light+dark SVG pair.
 * ────────────────────────────────────────────────────────────── */

/** Magenta annotation color — documented doc-chrome (not a token). */
export const ANNOT = "#C4277A"

type Side = "top" | "right" | "bottom" | "left"

const stageBase: React.CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--color-surface-container-lowest)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  boxSizing: "border-box",
}

/** Padded surface that centers the live component for annotation. */
export function Stage({
  children,
  pad = 72,
  minHeight,
  style,
}: {
  children: React.ReactNode
  pad?: number
  minHeight?: number
  style?: React.CSSProperties
}) {
  return (
    <div style={{ ...stageBase, padding: pad, minHeight, ...style }}>{children}</div>
  )
}

/**
 * A numbered callout pin pointing at one edge of its anchor.
 * Rendered as an absolute child of a `position:relative` anchor
 * wrapper, so it tracks the anchor's size automatically.
 * `at` positions the pin along the edge (default centered).
 */
export function Pin({
  n,
  side,
  length = 34,
  at = "50%",
}: {
  n: number | string
  side: Side
  length?: number
  at?: string
}) {
  const vertical = side === "top" || side === "bottom"
  const circle = (
    <span
      className="cs-legend-num"
      style={{ background: "var(--color-surface-container-lowest)", flexShrink: 0 }}
    >
      {n}
    </span>
  )
  const line = (
    <span
      aria-hidden="true"
      style={{
        flexShrink: 0,
        ...(vertical
          ? { borderLeft: "1px dashed var(--color-outline)", height: length, width: 0 }
          : { borderTop: "1px dashed var(--color-outline)", width: length, height: 0 }),
      }}
    />
  )
  const common: React.CSSProperties = {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    gap: 6,
    pointerEvents: "none",
  }
  switch (side) {
    case "top":
      return (
        <div style={{ ...common, flexDirection: "column-reverse", left: at, bottom: "100%", transform: "translateX(-50%)" }} aria-hidden="true">
          {line}
          {circle}
        </div>
      )
    case "bottom":
      return (
        <div style={{ ...common, flexDirection: "column", left: at, top: "100%", transform: "translateX(-50%)" }} aria-hidden="true">
          {line}
          {circle}
        </div>
      )
    case "left":
      return (
        <div style={{ ...common, flexDirection: "row-reverse", top: at, right: "100%", transform: "translateY(-50%)" }} aria-hidden="true">
          {line}
          {circle}
        </div>
      )
    default:
      return (
        <div style={{ ...common, flexDirection: "row", top: at, left: "100%", transform: "translateY(-50%)" }} aria-hidden="true">
          {line}
          {circle}
        </div>
      )
  }
}

/** Relative wrapper around a live element so `Pin`s can anchor to it. */
export function Anchor({
  children,
  pins,
  style,
}: {
  children: React.ReactNode
  pins: Array<{ n: number | string; side: Side; length?: number; at?: string }>
  style?: React.CSSProperties
}) {
  return (
    <div style={{ position: "relative", display: "inline-flex", ...style }}>
      {children}
      {pins.map((p, i) => (
        <Pin key={i} {...p} />
      ))}
    </div>
  )
}

/** Anatomy = Stage + Anchor. The live component goes in `children`. */
export function Anatomy({
  children,
  pins,
  pad = 80,
  stageStyle,
  anchorStyle,
}: {
  children: React.ReactNode
  pins: Array<{ n: number | string; side: Side; length?: number; at?: string }>
  pad?: number
  stageStyle?: React.CSSProperties
  anchorStyle?: React.CSSProperties
}) {
  return (
    <Stage pad={pad} style={stageStyle}>
      <Anchor pins={pins} style={anchorStyle}>
        {children}
      </Anchor>
    </Stage>
  )
}

/* ── Measured dimension brackets ──────────────────────────────── */

type Rects = { host: DOMRect; chip: DOMRect; zones: Record<string, DOMRect> }

/**
 * Measures the live chip's outer box and any marked zones
 * (elements carrying `data-mz="<name>"`) relative to the host,
 * recomputing on resize and after fonts load. Returns null until
 * the first measurement lands.
 */
export function useMeasured(hostRef: React.RefObject<HTMLElement | null>) {
  const [rects, setRects] = React.useState<Rects | null>(null)
  React.useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) return
    const measure = () => {
      const chipEl = host.querySelector<HTMLElement>("[data-mz-chip]")
      if (!chipEl) return
      const hostR = host.getBoundingClientRect()
      const chip = chipEl.getBoundingClientRect()
      const zones: Record<string, DOMRect> = {}
      host.querySelectorAll<HTMLElement>("[data-mz]").forEach((el) => {
        const name = el.dataset.mz
        if (name) zones[name] = el.getBoundingClientRect()
      })
      setRects({ host: hostR, chip, zones })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(host)
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    if (fonts?.ready) fonts.ready.then(measure)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [hostRef])
  return rects
}

/** Horizontal dimension bracket (end-caps + line + label) in host coords. */
function HBracket({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: x1, top: y, width: x2 - x1, height: 0, pointerEvents: "none" }}>
      <span style={{ position: "absolute", left: 0, top: -4, width: 1, height: 8, background: ANNOT }} />
      <span style={{ position: "absolute", right: 0, top: -4, width: 1, height: 8, background: ANNOT }} />
      <span style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1, background: ANNOT }} />
      <span style={{ position: "absolute", left: "50%", top: 6, transform: "translateX(-50%)", font: "700 9px 'Inter',sans-serif", color: ANNOT, whiteSpace: "nowrap" }}>{label}</span>
    </div>
  )
}

/** Vertical dimension bracket (end-caps + line + label) in host coords. */
function VBracket({ y1, y2, x, label }: { y1: number; y2: number; x: number; label: string }) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: x, top: y1, width: 0, height: y2 - y1, pointerEvents: "none" }}>
      <span style={{ position: "absolute", top: 0, left: -4, height: 1, width: 8, background: ANNOT }} />
      <span style={{ position: "absolute", bottom: 0, left: -4, height: 1, width: 8, background: ANNOT }} />
      <span style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 1, background: ANNOT }} />
      <span style={{ position: "absolute", top: "50%", left: -8, transform: "translate(-100%,-50%)", font: "700 11px 'Inter',sans-serif", color: ANNOT, whiteSpace: "nowrap" }}>{label}</span>
    </div>
  )
}

export { HBracket, VBracket }
