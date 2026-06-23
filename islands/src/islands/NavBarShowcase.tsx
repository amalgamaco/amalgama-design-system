import { useState } from "react"

const navItems = [
  { label: "Inicio", icon: "home" },
  { label: "Vacantes", icon: "briefcase", badge: 3 },
  { label: "Candidatos", icon: "users" },
  { label: "Más", icon: "more-horizontal" },
]

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? "var(--color-primary)" : "var(--color-on-surface-variant)"
  const fill = active ? "var(--color-primary)" : "none"
  const svgProps = { width: 24, height: 24, viewBox: "0 0 24 24", stroke, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill }

  if (name === "home") return (
    <svg {...svgProps} fill={active ? fill : "none"}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
  if (name === "briefcase") return (
    <svg {...svgProps} fill="none">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    </svg>
  )
  if (name === "users") return (
    <svg {...svgProps} fill="none">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
  return (
    <svg {...svgProps} fill={active ? fill : "none"}>
      <circle cx="12" cy="12" r="1" fill={stroke}/><circle cx="19" cy="12" r="1" fill={stroke}/><circle cx="5" cy="12" r="1" fill={stroke}/>
    </svg>
  )
}

export function NavBarShowcase() {
  const [active, setActive] = useState("Inicio")

  return (
    <div
      style={{
        width: 400,
        border: "1px solid var(--color-outline-variant)",
        borderRadius: 8,
        overflow: "hidden",
        fontFamily: "var(--font-body)",
      }}
    >
      <div
        style={{
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          borderBottom: "1px solid var(--color-outline-variant)",
          fontSize: 13,
          color: "var(--color-on-surface-variant)",
        }}
      >
        Contenido de la vista activa: {active}
      </div>
      <nav
        aria-label="Navegación principal"
        style={{
          display: "flex",
          height: 80,
          background: "var(--color-surface-container)",
          borderTop: "1px solid var(--color-outline-variant)",
        }}
      >
        {navItems.map((item) => {
          const isActive = active === item.label
          return (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              aria-current={isActive ? "page" : undefined}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 12,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isActive ? "var(--color-secondary-container)" : "transparent",
                  borderRadius: 16,
                  marginBottom: 4,
                  position: "relative",
                }}
              >
                <NavIcon name={item.icon} active={isActive} />
                {item.badge && !isActive && (
                  <span
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 6,
                      background: "var(--color-primary)",
                      color: "var(--color-on-primary)",
                      fontSize: 9,
                      fontWeight: 700,
                      lineHeight: 1,
                      borderRadius: 99,
                      padding: "2px 5px",
                      minWidth: 16,
                      textAlign: "center",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--color-primary)" : "var(--color-on-surface-variant)",
                  lineHeight: 1,
                }}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
