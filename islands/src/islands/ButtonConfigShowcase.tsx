import { Button } from "../components/ui/button"

/* Reproduces the Button page's "Configuraciones" diagram (size · color · padding)
   with the live island Button, reusing the page's .bd-cfg-* layout classes so the
   numbered diagram + legend stay visually identical — only the rendered buttons are
   now the shadcn-based component. Buttons are non-interactive spec illustrations. */

const noPtr = { pointerEvents: "none" as const }

export function ButtonConfigShowcase() {
  return (
    <div className="bd-cfg-diagram">
      {/* 1. Size */}
      <div className="bd-cfg-row">
        <div className="bd-cfg-num">1</div>
        <div className="bd-cfg-items" style={{ alignItems: "flex-end" }}>
          <div className="bd-cfg-item-col"><Button variant="primary" size="xs" style={noPtr}>Extra pequeño</Button></div>
          <div className="bd-cfg-item-col"><Button variant="primary" size="sm" style={noPtr}>Pequeño</Button></div>
          <div className="bd-cfg-item-col"><Button variant="primary" style={noPtr}>Mediano</Button></div>
          <div className="bd-cfg-item-col"><Button variant="primary" size="lg" style={noPtr}>Grande</Button></div>
          <div className="bd-cfg-item-col"><Button variant="primary" size="xl" style={noPtr}>Extra grande</Button></div>
        </div>
      </div>

      {/* 2. Color */}
      <div className="bd-cfg-row">
        <div className="bd-cfg-num">2</div>
        <div className="bd-cfg-items">
          <div className="bd-cfg-item-col"><Button variant="primary" style={noPtr}>Relleno</Button></div>
          <div className="bd-cfg-item-col"><Button variant="secondary" style={noPtr}>Tonal</Button></div>
          <div className="bd-cfg-item-col"><Button variant="tertiary" style={noPtr}>Con borde</Button></div>
          <div className="bd-cfg-item-col"><Button variant="text" style={noPtr}>Texto</Button></div>
        </div>
      </div>

      {/* 3. Padding */}
      <div className="bd-cfg-row">
        <div className="bd-cfg-num">3</div>
        <div className="bd-cfg-items">
          <div className="bd-cfg-item-col"><Button variant="secondary" style={noPtr}>24px padding</Button></div>
          <div className="bd-cfg-item-col"><Button variant="secondary" compact style={noPtr}>16px padding</Button></div>
        </div>
      </div>
    </div>
  )
}
