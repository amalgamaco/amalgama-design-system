import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { Button } from "../components/ui/button"

export function TopBarShowcase() {
  return (
    <div
      style={{
        border: "1px solid var(--color-outline-variant)",
        borderRadius: 8,
        overflow: "hidden",
        fontFamily: "var(--font-body)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 16px",
          height: 56,
          background: "var(--color-surface-container)",
          borderBottom: "1px solid var(--color-outline-variant)",
        }}
      >
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, fontSize: 13 }}
        >
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              color: "var(--color-on-surface-variant)",
              textDecoration: "none",
              fontWeight: 400,
            }}
          >
            Reclutamiento
          </a>
          <span style={{ color: "var(--color-outline)", fontSize: 12 }}>/</span>
          <span style={{ color: "var(--color-on-surface)", fontWeight: 600 }}>Vacantes</span>
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Button variant="secondary" size="sm">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Nueva vacante
          </Button>

          {/* Notification bell */}
          <button
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--color-on-surface-variant)",
            }}
            aria-label="Notificaciones"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/>
            </svg>
            <span
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 8,
                height: 8,
                background: "var(--color-primary)",
                borderRadius: "50%",
                border: "2px solid var(--color-surface-container)",
              }}
            />
          </button>

          <Avatar size="sm">
            <AvatarFallback>MG</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Mock content area */}
      <div
        style={{
          padding: "20px 16px",
          background: "var(--color-surface)",
          fontSize: 13,
          color: "var(--color-on-surface-variant)",
          minHeight: 60,
        }}
      >
        Contenido de la vista — área debajo del topbar
      </div>
    </div>
  )
}
