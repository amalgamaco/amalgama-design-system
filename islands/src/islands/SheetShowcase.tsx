import { useState } from "react"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
  SheetClose,
} from "../components/ui/sheet"
import { Button } from "../components/ui/button"

export function SheetShowcase() {
  const [side, setSide] = useState<"right" | "left" | "bottom">("right")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        {(["right", "left", "bottom"] as const).map((s) => (
          <Sheet key={s}>
            <SheetTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSide(s)}
              >
                Abrir desde {s === "right" ? "la derecha" : s === "left" ? "la izquierda" : "abajo"}
              </Button>
            </SheetTrigger>
            <SheetContent side={s}>
              <SheetHeader>
                <SheetTitle>Panel lateral</SheetTitle>
                <SheetDescription>
                  {s === "right" ? "Desde la derecha" : s === "left" ? "Desde la izquierda" : "Desde abajo"} — Radix Dialog reposicionado como Sheet.
                </SheetDescription>
              </SheetHeader>
              <SheetBody>
                <p className="text-body-sm text-fg leading-relaxed">
                  El Sheet usa el mismo primitivo que el Dialog pero se ancla al borde de la pantalla.
                  Ideal para filtros, detalles de ítem o formularios secundarios.
                </p>
                <p className="text-body-sm text-fg-subtle leading-relaxed mt-3">
                  Cierre con Escape, clic en el overlay o el botón de abajo.
                </p>
              </SheetBody>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="secondary" size="sm">Cancelar</Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="primary" size="sm">Confirmar</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  )
}
