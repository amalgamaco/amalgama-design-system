import { useState, useEffect } from "react"
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
} from "@ds/sheet"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@ds/dialog"
import { Button } from "@ds/button"
import { ToggleGroup, ToggleGroupItem } from "@ds/toggle-group"
import { Clock } from "lucide-react"

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

// Focused single-side showcases for the split Bottom Sheet / Side Sheet pages.
function OneSheet({ side, trigger }: { side: "bottom" | "right"; trigger: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="sm">{trigger}</Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>{side === "bottom" ? "Acciones" : "Filtros"}</SheetTitle>
          <SheetDescription>
            {side === "bottom"
              ? "Bottom sheet — anclado al borde inferior, ideal en mobile."
              : "Side sheet — anclado al lateral, para filtros o detalle en desktop."}
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <p className="text-body-sm text-fg leading-relaxed">
            Panel modal con scrim, compuesto sobre el primitivo Dialog de Radix y tematizado con tokens de Embassy.
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
            <Button variant="primary" size="sm">Aplicar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function BottomSheetShowcase() {
  return <OneSheet side="bottom" trigger="Abrir bottom sheet" />
}

export function SideSheetShowcase() {
  return <OneSheet side="right" trigger="Abrir side sheet" />
}

/* ────────────────────────────────────────────────────────────
 * Functional example — time-slot picker, from the RIGHT (Sheet side="right").
 * Slots use ToggleGroup (single-select): default / hover / focus-visible /
 * selected (secondary-container) / disabled out of the box. Confirm (primary,
 * gated on a selection) + Cancel (secondary). DS components + tokens only.
 * ──────────────────────────────────────────────────────────── */
const TIME_SLOTS = [
  { value: "09:00" }, { value: "09:30" }, { value: "10:00" },
  { value: "10:30", disabled: true }, { value: "11:00" }, { value: "11:30" },
  { value: "13:00" }, { value: "13:30", disabled: true }, { value: "14:00" },
  { value: "14:30" }, { value: "15:00" }, { value: "15:30" },
]

export function SheetTimeSlotShowcase() {
  const [open, setOpen] = useState(false)
  const [slot, setSlot] = useState<string>("")
  const [confirmed, setConfirmed] = useState<string>("")

  return (
    <div className="flex flex-col items-start gap-3">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="secondary">
            <Clock className="size-[18px]" />
            Elegir horario
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Elegir horario</SheetTitle>
            <SheetDescription>Seleccioná un horario disponible. Los horarios en gris ya están reservados.</SheetDescription>
          </SheetHeader>
          <SheetBody>
            <ToggleGroup
              type="single"
              value={slot}
              onValueChange={(v) => v && setSlot(v)}
              aria-label="Horarios disponibles"
              className="grid grid-cols-3 gap-2"
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
          </SheetBody>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="secondary">Cancelar</Button>
            </SheetClose>
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
          </SheetFooter>
        </SheetContent>
      </Sheet>
      {confirmed && (
        <p className="text-body-sm text-fg-subtle">
          Entrevista agendada a las <span className="font-medium text-fg">{confirmed}</span> hs.
        </p>
      )}
    </div>
  )
}

/* ── Responsive: Dialog on desktop (≥768px), Sheet (bottom) on mobile. ── */
function useIsDesktop() {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const update = () => setDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return desktop
}

export function SheetResponsiveShowcase() {
  const isDesktop = useIsDesktop()
  const title = "Editar perfil"
  const desc = "Actualizá tus datos. En desktop es un Dialog; en mobile, un Sheet."
  const body = <p className="text-body-sm text-fg leading-relaxed">El mismo contenido se presenta como Dialog centrado en pantallas anchas y como Sheet anclado abajo en compacto.</p>

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild><Button variant="secondary" size="sm">Editar perfil</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{desc}</DialogDescription></DialogHeader>
          <DialogBody>{body}</DialogBody>
          <DialogFooter>
            <DialogClose asChild><Button variant="secondary" size="sm">Cancelar</Button></DialogClose>
            <Button variant="primary" size="sm">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Sheet>
      <SheetTrigger asChild><Button variant="secondary" size="sm">Editar perfil</Button></SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader><SheetTitle>{title}</SheetTitle><SheetDescription>{desc}</SheetDescription></SheetHeader>
        <SheetBody>{body}</SheetBody>
        <SheetFooter>
          <SheetClose asChild><Button variant="secondary" size="sm">Cancelar</Button></SheetClose>
          <Button variant="primary" size="sm">Guardar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
