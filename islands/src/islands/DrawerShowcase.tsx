import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
} from "@ds/drawer"
import { Button } from "@ds/button"

/* ────────────────────────────────────────────────────────────
 * Drawer — the vaul-based, gesture-driven panel (drag-to-dismiss).
 * Distinct from Sheet (Radix Dialog side panel): the Drawer's hero
 * behavior is the drag handle + swipe-to-close on the bottom variant.
 * Themed with Embassy tokens (bg-surface, bg-scrim, heading/label).
 * ──────────────────────────────────────────────────────────── */

function DrawerDemo({ direction, trigger }: { direction: "bottom" | "right" | "left"; trigger: string }) {
  return (
    <Drawer direction={direction}>
      <DrawerTrigger asChild>
        <Button variant="secondary" size="sm">{trigger}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-sm flex-col">
          <DrawerHeader>
            <DrawerTitle>Ajustar objetivo</DrawerTitle>
            <DrawerDescription>
              {direction === "bottom"
                ? "Arrastrá hacia abajo o tocá fuera para cerrar."
                : "Panel arrastrable anclado al lateral."}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <p className="text-body-sm text-fg leading-relaxed">
              El Drawer se construye sobre <span className="font-mono text-mono-sm">vaul</span> y suma el gesto de
              arrastrar-para-cerrar. Ideal para filtros, detalle o acciones en mobile.
            </p>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="primary" size="sm">Guardar</Button>
            <DrawerClose asChild>
              <Button variant="secondary" size="sm">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export function DrawerShowcase() {
  return (
    <div className="flex flex-wrap gap-2">
      <DrawerDemo direction="bottom" trigger="Abrir desde abajo" />
      <DrawerDemo direction="right" trigger="Abrir desde la derecha" />
      <DrawerDemo direction="left" trigger="Abrir desde la izquierda" />
    </div>
  )
}

export function DrawerBottomShowcase() {
  return <DrawerDemo direction="bottom" trigger="Abrir bottom drawer" />
}
