import { useState } from "react"
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
import { ToggleGroup, ToggleGroupItem } from "@ds/toggle-group"
import { Clock } from "lucide-react"

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

/* ────────────────────────────────────────────────────────────
 * Functional example — time-slot picker (à la shadcn scheduling).
 * Slots use ToggleGroup (single-select): the DS's canonical "elegir 1 de N",
 * which gives default / hover / focus-visible / selected (secondary-container)
 * / disabled states out of the box. Responsive grid; Confirm (primary, gated
 * on a selection) + Cancel (secondary). DS components + tokens only.
 * ──────────────────────────────────────────────────────────── */
const TIME_SLOTS = [
  { value: "09:00", disabled: false },
  { value: "09:30", disabled: false },
  { value: "10:00", disabled: false },
  { value: "10:30", disabled: true }, // ya reservado
  { value: "11:00", disabled: false },
  { value: "11:30", disabled: false },
  { value: "13:00", disabled: false },
  { value: "13:30", disabled: true }, // ya reservado
  { value: "14:00", disabled: false },
  { value: "14:30", disabled: false },
  { value: "15:00", disabled: false },
  { value: "15:30", disabled: false },
]

export function DrawerTimeSlotShowcase() {
  const [open, setOpen] = useState(false)
  const [slot, setSlot] = useState<string>("")
  const [confirmed, setConfirmed] = useState<string>("")

  return (
    <div className="flex flex-col items-start gap-3">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="secondary">
            <Clock className="size-[18px]" />
            Elegir horario
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto flex w-full max-w-md flex-col">
            <DrawerHeader>
              <DrawerTitle>Elegir horario</DrawerTitle>
              <DrawerDescription>
                Seleccioná un horario disponible para tu entrevista. Los horarios en gris ya están reservados.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerBody className="pb-2">
              <ToggleGroup
                type="single"
                value={slot}
                onValueChange={(v) => v && setSlot(v)}
                aria-label="Horarios disponibles"
                className="grid grid-cols-3 gap-2 sm:grid-cols-4"
              >
                {TIME_SLOTS.map((s) => (
                  <ToggleGroupItem
                    key={s.value}
                    value={s.value}
                    variant="outline"
                    size="lg"
                    disabled={s.disabled}
                    aria-label={`${s.value} horas`}
                    className="w-full"
                  >
                    {s.value}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </DrawerBody>
            <DrawerFooter>
              <Button
                variant="primary"
                disabled={!slot}
                onClick={() => {
                  setConfirmed(slot)
                  setOpen(false)
                }}
              >
                {slot ? `Confirmar ${slot}` : "Confirmar"}
              </Button>
              <DrawerClose asChild>
                <Button variant="secondary">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
      {confirmed && (
        <p className="text-body-sm text-fg-subtle">
          Entrevista agendada a las <span className="font-medium text-fg">{confirmed}</span> hs.
        </p>
      )}
    </div>
  )
}
