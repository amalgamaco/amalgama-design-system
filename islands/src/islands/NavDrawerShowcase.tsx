import { useState } from "react"

const sections = [
  {
    title: "Reclutamiento",
    items: [
      { label: "Dashboard", active: true, count: null },
      { label: "Vacantes", active: false, count: 12 },
      { label: "Candidatos", active: false, count: null },
    ],
  },
  {
    title: "Organización",
    items: [
      { label: "People", active: false, count: null },
      { label: "Equipos", active: false, count: null },
    ],
  },
]

export function NavDrawerShowcase() {
  const [activeItem, setActiveItem] = useState("Dashboard")

  return (
    <div
      style={{
        width: 220,
        background: "var(--ds-sidebar-bg, var(--color-surface-container))",
        border: "1px solid var(--ds-sidebar-border, var(--color-outline-variant))",
        borderRadius: 8,
        overflow: "hidden",
        fontFamily: "var(--font-body)",
      }}
    >
      {sections.map((section) => (
        <div key={section.title}>
          <div
            style={{
              padding: "12px 16px 4px",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--color-on-surface-variant)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {section.title}
          </div>
          <div style={{ padding: "4px 8px 8px" }}>
            {section.items.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveItem(item.label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "7px 8px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: activeItem === item.label ? 600 : 400,
                  background:
                    activeItem === item.label
                      ? "var(--color-secondary-container)"
                      : "transparent",
                  color:
                    activeItem === item.label
                      ? "var(--color-on-secondary-container)"
                      : "var(--color-on-surface-variant)",
                  textAlign: "left",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (activeItem !== item.label)
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--color-surface-variant)"
                }}
                onMouseLeave={(e) => {
                  if (activeItem !== item.label)
                    (e.currentTarget as HTMLElement).style.background = "transparent"
                }}
              >
                <span style={{ fontSize: 13 }}>
                  {item.label === "Dashboard" && "⊞"}
                  {item.label === "Vacantes" && "💼"}
                  {item.label === "Candidatos" && "👤"}
                  {item.label === "People" && "👥"}
                  {item.label === "Equipos" && "🏢"}
                </span>
                {item.label}
                {item.count !== null && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      fontWeight: 600,
                      background: "var(--color-secondary-container)",
                      color: "var(--color-on-secondary-container)",
                      padding: "1px 7px",
                      borderRadius: 999,
                    }}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
