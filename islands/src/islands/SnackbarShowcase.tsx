import { Button } from "@ds/button"
import { Toaster, toast } from "@ds/sonner"

// Live Sonner demo. The triggers fire real toasts (bottom-center) themed with
// Embassy inverse-surface tokens — the actual shadcn/Sonner implementation, not
// a static illustration.
export function SnackbarShowcase() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <Button
        variant="tertiary"
        size="sm"
        onClick={() => toast("Archivo eliminado correctamente")}
      >
        Mostrar snackbar
      </Button>
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
      <Button
        variant="tertiary"
        size="sm"
        onClick={() =>
          toast("No se pudo guardar el cambio", {
            duration: Infinity,
            action: { label: "Reintentar", onClick: () => {} },
          })
        }
      >
        Persistente
      </Button>
      <Toaster />
    </div>
  )
}
