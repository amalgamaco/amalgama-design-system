import * as React from "react"
import { Button } from "@ds/button"
import {
  Plus,
  Pencil,
  Trash2,
  Settings,
  ChevronRight,
  ChevronDown,
  Search,
  Heart,
  Loader2,
} from "lucide-react"

/* ──────────────────────────────────────────────────────────────────────────
   Phase-B Button islands — every variant/state/do-don't/live-preview example
   on the s-c-button page rendered via the real @ds Button component.

   Notes on STATE simulation:
   The original States section rendered enabled/hover/focus/pressed/disabled via
   bespoke .bst-btn swatches with hardcoded hex + manual state layers, shown in
   light AND dark side by side. Per the canonical "one color mode at a time"
   rule we render a single mode (follows the global theme toggle) with the REAL
   Button. Enabled + disabled use the real component states. Hover/focus/pressed
   are interactive pseudo-states that cannot be forced on a real DOM button
   without page CSS, so each is approximated by applying the variant's own
   hover/active utility classes (the same tokens the component uses) — the
   button stays the real @ds Button.
   ────────────────────────────────────────────────────────────────────────── */

type Variant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "text"

const stateLabels = ["Habilitado", "Deshabilitado", "Hover", "Enfocado", "Presionado"] as const

// Per-variant utility class that approximates the hover/pressed state layer using
// the real component's own state tokens.
const stateSim: Record<Variant, { hover: string; press: string }> = {
  primary: { hover: "bg-primary-hover -translate-y-px", press: "brightness-[0.88]" },
  secondary: { hover: "bg-secondary-container-hover -translate-y-px", press: "brightness-[0.92]" },
  tertiary: { hover: "bg-surface-variant border-primary", press: "bg-surface-container-high" },
  text: { hover: "bg-primary-state-hover", press: "bg-primary-state-press" },
}

function StateStrip({ variant }: { variant: Variant }) {
  const sim = stateSim[variant]
  const cells: { label: (typeof stateLabels)[number]; node: React.ReactNode }[] = [
    { label: "Habilitado", node: <Button variant={variant}>Action</Button> },
    {
      label: "Deshabilitado",
      node: (
        <Button variant={variant} disabled>
          <Pencil width={14} height={14} /> Action
        </Button>
      ),
    },
    { label: "Hover", node: <Button variant={variant} className={sim.hover}>Action</Button> },
    {
      label: "Enfocado",
      node: <Button variant={variant} className="focus-ring">Action</Button>,
    },
    { label: "Presionado", node: <Button variant={variant} className={sim.press}>Action</Button> },
  ]
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "24px",
        padding: "20px",
        background: "var(--color-surface-variant)",
        borderRadius: "var(--radius-md)",
      }}
    >
      {cells.map((c) => (
        <div
          key={c.label}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
        >
          {c.node}
          <span
            style={{
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
              color: "var(--text-secondary)",
            }}
          >
            {c.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function VariantStateBlock({
  title,
  desc,
  variant,
}: {
  title: string
  desc?: string
  variant: Variant
}) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <h3 className="bst-variant-title">{title}</h3>
      {desc && <p className="bst-variant-desc">{desc}</p>}
      <p className="bst-sub-head">Predeterminado</p>
      <StateStrip variant={variant} />
    </div>
  )
}

// ─── States: one block per variant (single mode at a time) ───
export function ButtonStatesShowcase() {
  return (
    <div>
      <VariantStateBlock
        title="Botón relleno"
        desc="La acción de mayor jerarquía. Una por contexto de pantalla."
        variant="primary"
      />
      <VariantStateBlock
        title="Botón tonal"
        desc="Acción de apoyo que acompaña a un Relleno sin competir."
        variant="secondary"
      />
      <VariantStateBlock
        title="Botón con borde"
        desc="Alternativa, cancelar o volver junto a un Relleno o Tonal."
        variant="tertiary"
      />
      <VariantStateBlock
        title="Botón de texto"
        desc="Acción de baja prioridad en diálogos o superficies saturadas."
        variant="text"
      />
    </div>
  )
}

// ─── Shape & radius scale (Specs) ───
export function ButtonShapeShowcase() {
  const items: { size: any; label: React.ReactNode; text: string }[] = [
    { size: "xs", text: "Acción", label: <>XS · <code>--radius-sm</code> · 4px</> },
    { size: "sm", text: "Acción", label: <>SM · <code>--radius-sm</code> · 4px</> },
    { size: "default", text: "Acción MD", label: <>MD · <code>--radius-md</code> · 8px</> },
    { size: "lg", text: "Acción LG", label: <>LG · <code>--radius-md</code> · 8px</> },
    { size: "xl", text: "Acción XL", label: <>XL · <code>--radius-lg</code> · 12px</> },
  ]
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "16px", padding: "20px 0" }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <Button variant="primary" size={it.size} style={{ pointerEvents: "none" }}>
            {it.text}
          </Button>
          <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
            {it.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Hierarchy table buttons (Guidelines) ───
// Each export is a single cell button so the surrounding <code> labels stay in the table.
export function ButtonHierarchyFilled() {
  return <Button variant="primary" size="sm" style={{ pointerEvents: "none" }}>Relleno</Button>
}
export function ButtonHierarchyTonal() {
  return <Button variant="secondary" size="sm" style={{ pointerEvents: "none" }}>Tonal</Button>
}
export function ButtonHierarchyOutlined() {
  return <Button variant="tertiary" size="sm" style={{ pointerEvents: "none" }}>Con borde</Button>
}
export function ButtonHierarchyText() {
  return <Button variant="text" size="sm" style={{ pointerEvents: "none" }}>Texto</Button>
}
export function ButtonHierarchyIcon() {
  return (
    <Button variant="icon" size="sm" aria-label="Acción" style={{ pointerEvents: "none" }}>
      <Pencil width={13} height={13} />
    </Button>
  )
}

// ─── Toggle pattern (Guidelines) ───
// btn-toggle-off/-on are page-local, not Embassy classes. Render the real Button:
// off = tertiary (outlined, no fill), on = secondary (tonal fill / active).
export function ButtonToggleOff() {
  return (
    <Button variant="tertiary" aria-pressed={false}>
      <Heart width={13} height={13} /> Guardar vacante
    </Button>
  )
}
export function ButtonToggleOn() {
  return (
    <Button variant="secondary" aria-pressed>
      <Heart width={13} height={13} fill="currentColor" stroke="none" /> Guardado
    </Button>
  )
}

// ─── Ancho y layout do/don't (Guidelines) ───
export function ButtonLayoutDo() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      <Button variant="primary">
        <Plus width={15} height={15} /> Pedir licencia
      </Button>
      <Button variant="tertiary">Cargar factura</Button>
    </div>
  )
}
export function ButtonLayoutDont() {
  // Misuse: full-width + left-aligned content (reads like a form field).
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "stretch" }}>
      <Button variant="tertiary" className="w-full justify-start">+ &nbsp;Pedir licencia</Button>
      <Button variant="tertiary" className="w-full justify-start">Cargar factura</Button>
    </div>
  )
}

// ─── Diseño adaptativo cards (Guidelines) ───
export function ButtonAdaptiveMobile() {
  return (
    <Button variant="primary" className="w-full">Comenzar</Button>
  )
}
export function ButtonAdaptiveDense() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <Button variant="primary" size="sm">Guardar</Button>
      <Button variant="tertiary" size="sm">Cancelar</Button>
      <Button variant="icon" size="sm" aria-label="Editar">
        <Pencil width={13} height={13} />
      </Button>
    </div>
  )
}
export function ButtonAdaptiveHero() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Button variant="primary" size="lg">Comenzar</Button>
      <Button variant="tertiary" size="lg">Saber más</Button>
    </div>
  )
}

// ─── Uso de íconos do/don't (Guidelines) ───
export function ButtonIconsDo() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      <Button variant="primary">
        <Plus width={15} height={15} /> Crear vacante
      </Button>
      <Button variant="icon" aria-label="Editar perfil">
        <Pencil width={16} height={16} />
      </Button>
    </div>
  )
}
export function ButtonIconsDont() {
  // Misuse: generic trailing chevron + icon-only button without aria-label.
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      <Button variant="primary">
        Crear vacante <ChevronRight width={15} height={15} style={{ marginLeft: 2 }} />
      </Button>
      <Button variant="secondary">
        <Search width={16} height={16} />
      </Button>
    </div>
  )
}

// ─── Shape & radius do/don't (Guidelines) ───
export function ButtonShapeDo() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
      <Button variant="primary" size="xs" style={{ pointerEvents: "none" }}>Acción XS</Button>
      <Button variant="primary" size="sm" style={{ pointerEvents: "none" }}>Acción SM</Button>
      <Button variant="primary" style={{ pointerEvents: "none" }}>Acción MD</Button>
      <Button variant="primary" size="xl" style={{ pointerEvents: "none" }}>Acción XL</Button>
    </div>
  )
}
export function ButtonShapeDont() {
  // Misuse: pill radius (reserved for chips/badges).
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
      <Button variant="primary" size="xs" style={{ pointerEvents: "none", borderRadius: 9999 }}>Acción</Button>
      <Button variant="primary" style={{ pointerEvents: "none", borderRadius: 9999 }}>Acción</Button>
      <Button variant="secondary" style={{ pointerEvents: "none", borderRadius: 9999 }}>Acción</Button>
    </div>
  )
}

// ─── Modificadores semánticos / etiquetas do/don't (Guidelines · Buenas prácticas) ───
export function ButtonSemanticDo() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      <Button variant="primary">Publicar vacante</Button>
      <Button variant="secondary">Guardar borrador</Button>
      <Button variant="danger">Eliminar cuenta</Button>
    </div>
  )
}
export function ButtonSemanticDont() {
  // Misuse: vague label, forced uppercase, overly long label.
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      <Button variant="primary">OK</Button>
      <Button variant="secondary" style={{ textTransform: "uppercase", letterSpacing: ".05em" }}>GUARDAR</Button>
      <Button variant="danger">Sí, estoy seguro de que quiero hacer esto</Button>
    </div>
  )
}

// ─── Qué hacer y qué evitar grid (Guidelines) ───
export function ButtonDoSinglePrimary() {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Button variant="primary">Publicar</Button>
      <Button variant="tertiary">Guardar borrador</Button>
      <Button variant="text">Cancelar</Button>
    </div>
  )
}
export function ButtonDontMultiPrimary() {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Button variant="primary">Publicar</Button>
      <Button variant="primary">Guardar borrador</Button>
      <Button variant="primary">Cancelar</Button>
    </div>
  )
}
export function ButtonDoSpecificLabel() {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Button variant="primary">Eliminar cuenta</Button>
      <Button variant="primary">Crear postulante</Button>
    </div>
  )
}
export function ButtonDontGenericLabel() {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Button variant="primary">OK</Button>
      <Button variant="danger">Sí</Button>
    </div>
  )
}
export function ButtonDoIconAria() {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Button variant="icon" aria-label="Editar vacante">
        <Pencil width={16} height={16} />
      </Button>
      <Button variant="icon" aria-label="Eliminar vacante">
        <Trash2 width={16} height={16} />
      </Button>
    </div>
  )
}
export function ButtonDontNavLinks() {
  // Misuse: text buttons used for navigation (should be <a href>).
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Button variant="text">Ir al perfil →</Button>
      <Button variant="text">Ver todas las vacantes</Button>
    </div>
  )
}

// ─── Accessibility: focus ring demo ───
export function ButtonFocusShowcase() {
  return (
    <Button variant="primary" className="focus-ring">Enfocado</Button>
  )
}

// ─── Code tab live previews ───
export function ButtonSemanticPreview() {
  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <Button variant="danger">Eliminar</Button>
      <Button variant="success">Aprobar</Button>
    </div>
  )
}

export function ButtonSizesPreview() {
  const item = (node: React.ReactNode, label: string) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      {node}
      <span className="bd-state-lbl">{label}</span>
    </div>
  )
  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
      {item(<Button variant="primary">Default</Button>, "36px")}
      {item(<Button variant="primary" size="sm">Small</Button>, "30px")}
      {item(<Button variant="secondary">Default</Button>, "36px")}
      {item(<Button variant="secondary" size="sm">Small</Button>, "30px")}
      {item(
        <Button variant="icon" aria-label="Ajustes">
          <Settings width={18} height={18} />
        </Button>,
        "36×36"
      )}
      {item(
        <Button variant="icon" size="sm" aria-label="Ajustes">
          <Settings width={15} height={15} />
        </Button>,
        "30×30"
      )}
    </div>
  )
}

export function ButtonIconPreview() {
  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <Button variant="primary">
        <Plus width={15} height={15} /> Nueva vacante
      </Button>
      <Button variant="secondary">
        Exportar <ChevronDown width={15} height={15} />
      </Button>
      <Button variant="tertiary">
        <Pencil width={15} height={15} /> Editar
      </Button>
    </div>
  )
}

export function ButtonDisabledPreview() {
  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <Button variant="primary" disabled>Publicar</Button>
      <Button variant="secondary" disabled>Guardar</Button>
      <Button variant="tertiary" disabled>Cancelar</Button>
      <Button variant="icon" disabled aria-label="Ajustes">
        <Settings width={18} height={18} />
      </Button>
    </div>
  )
}

export function ButtonLoadingPreview() {
  return (
    <Button variant="primary" disabled aria-busy className="gap-2">
      <Loader2 width={14} height={14} className="animate-spin" />
      Publicando…
    </Button>
  )
}

export function ButtonFormFooterPreview() {
  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
      <Button variant="tertiary">Cancelar</Button>
      <Button variant="primary">Publicar vacante</Button>
    </div>
  )
}

export function ButtonDestructivePreview() {
  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
      <Button variant="tertiary">Cancelar</Button>
      <Button variant="danger">Eliminar</Button>
    </div>
  )
}
