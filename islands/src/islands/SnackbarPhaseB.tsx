import { Button } from "@ds/button"
import { Toaster, toast } from "@ds/sonner"

// Phase B — Code tab "Demos en vivo".
// The four documented snackbar variants are driven by the real shadcn/Sonner
// component (@ds/sonner): each trigger fires a real toast (bottom-center) themed
// with Embassy inverse-surface tokens, replacing the former static .snackbar
// CSS-class markup. The <Toaster /> live region is mounted once (in the first
// demo) so the four islands share a single bottom-center region.

// Demo 1: solo mensaje. Mounts the shared Toaster.
export function SnackbarMessageDemo() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Button
        variant="tertiary"
        size="sm"
        onClick={() => toast("Archivo eliminado correctamente")}
      >
        Mostrar snackbar
      </Button>
      <Toaster />
    </div>
  )
}

// Demo 2: mensaje + botón de acción.
export function SnackbarActionDemo() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Button
        variant="tertiary"
        size="sm"
        onClick={() =>
          toast("Archivo eliminado", {
            action: { label: "Deshacer", onClick: () => {} },
          })
        }
      >
        Con acción
      </Button>
    </div>
  )
}

// Demo 3: mensaje + acción + cierre manual (persistente hasta descartar).
export function SnackbarCloseDemo() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Button
        variant="tertiary"
        size="sm"
        onClick={() =>
          toast("Invitación enviada", {
            duration: Infinity,
            action: { label: "Ver", onClick: () => {} },
            cancel: { label: "Cerrar", onClick: () => {} },
          })
        }
      >
        Con acción y cierre
      </Button>
    </div>
  )
}

// Demo 4: mensaje largo apilado (acción debajo del texto).
export function SnackbarMultilineDemo() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Button
        variant="tertiary"
        size="sm"
        onClick={() =>
          toast("No se pudo completar la operación en el servidor remoto", {
            action: { label: "Reintentar", onClick: () => {} },
          })
        }
      >
        Mensaje largo
      </Button>
    </div>
  )
}
