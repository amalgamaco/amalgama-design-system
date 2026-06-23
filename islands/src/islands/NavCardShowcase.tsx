import { useState } from "react"

interface NavCardProps {
  href: string
  icon: string
  title: string
  description?: string
  onClick?: () => void
}

function NavCard({ href, icon, title, description, onClick }: NavCardProps) {
  return (
    <a
      href={href}
      onClick={(e) => { e.preventDefault(); onClick?.() }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderRadius: 8,
        border: "1px solid var(--color-outline-variant)",
        background: "var(--color-surface)",
        textDecoration: "none",
        cursor: "pointer",
        transition: "background 0.15s",
        fontFamily: "var(--font-body)",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-surface-variant)" }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-surface)" }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>{title}</p>
        {description && (
          <p style={{ margin: 0, fontSize: 12, color: "var(--color-on-surface-variant)", marginTop: 2 }}>{description}</p>
        )}
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-on-surface-variant)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "auto" }}>
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </a>
  )
}

const navCards = [
  { href: "#button", icon: "🔘", title: "Button", description: "Acciones primarias, secundarias y variantes" },
  { href: "#badge", icon: "🏷", title: "Badge", description: "Estado y categoría de ítems" },
  { href: "#chip", icon: "🔖", title: "Chips", description: "Filtros, etiquetas y selección múltiple" },
  { href: "#card", icon: "🃏", title: "Card", description: "Contenedor de información agrupada" },
]

export function NavCardShowcase() {
  const [clicked, setClicked] = useState<string | null>(null)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 400 }}>
      {navCards.map((card) => (
        <NavCard key={card.href} {...card} onClick={() => setClicked(card.title)} />
      ))}
      {clicked && (
        <p style={{ marginTop: 4, fontSize: 12, color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)" }}>
          Clic en: <strong style={{ color: "var(--color-on-surface)" }}>{clicked}</strong>
        </p>
      )}
    </div>
  )
}
