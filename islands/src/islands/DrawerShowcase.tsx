import { useState, useEffect } from "react"
import {
  Drawer,
  DrawerNestedRoot,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
} from "@ds/drawer"
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

type Dir = "right" | "left" | "top" | "bottom"
const isSide = (d: Dir) => d === "right" || d === "left"

/* ────────────────────────────────────────────────────────────
 * Drawer — the vaul-based, gesture-driven panel (swipe-to-dismiss + snap points).
 * shadcn's default-registry Drawer, themed with Embassy tokens. Supports all four
 * directions via `direction`; side panels fill the height, vertical panels are
 * content-sized and centered. Distinct from Sheet (static Radix Dialog side panel).
 * ──────────────────────────────────────────────────────────── */

/** Layout wrapper: side drawers are full-height columns; vertical drawers are centered + content-sized. */
function DrawerLayout({ direction, children }: { direction: Dir; children: React.ReactNode }) {
  return <div className={isSide(direction) ? "flex h-full flex-col" : "mx-auto flex w-full max-w-md flex-col"}>{children}</div>
}

function DrawerDemo({ direction, trigger }: { direction: Dir; trigger: string }) {
  const from = { right: "la derecha", left: "la izquierda", top: "arriba", bottom: "abajo" }[direction]
  return (
    <Drawer direction={direction}>
      <DrawerTrigger asChild>
        <Button variant="secondary" size="sm">{trigger}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerLayout direction={direction}>
          <DrawerHeader>
            <DrawerTitle>Panel — desde {from}</DrawerTitle>
            <DrawerDescription>
              {isSide(direction)
                ? "Panel lateral arrastrable. Ideal para filtros o detalle."
                : "Panel arrastrable con manija de swipe. Ideal para acciones en mobile."}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody className="py-2">
            <p className="text-body-sm text-fg leading-relaxed">
              Se construye sobre <span className="font-mono text-mono-sm">vaul</span>: swipe-to-dismiss, con la
              misma superficie, scrim y movimiento (<span className="font-mono text-mono-sm">--ease-emphasized</span>, 500&nbsp;ms) del resto del sistema.
            </p>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="primary" size="sm">Guardar</Button>
            <DrawerClose asChild>
              <Button variant="secondary" size="sm">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerLayout>
      </DrawerContent>
    </Drawer>
  )
}

export function DrawerShowcase() {
  return (
    <div className="flex flex-wrap gap-2">
      <DrawerDemo direction="right" trigger="Derecha" />
      <DrawerDemo direction="left" trigger="Izquierda" />
      <DrawerDemo direction="bottom" trigger="Abajo" />
      <DrawerDemo direction="top" trigger="Arriba" />
    </div>
  )
}

// Individual direction showcases (docs variant sections)
export function DrawerRightShowcase() { return <DrawerDemo direction="right" trigger="Abrir right drawer" /> }
export function DrawerLeftShowcase() { return <DrawerDemo direction="left" trigger="Abrir left drawer" /> }
export function DrawerTopShowcase() { return <DrawerDemo direction="top" trigger="Abrir top drawer" /> }
export function DrawerBottomShowcase() { return <DrawerDemo direction="bottom" trigger="Abrir bottom drawer" /> }

/* ────────────────────────────────────────────────────────────
 * Functional example — time-slot picker, from the RIGHT (the shadcn pattern).
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

export function DrawerTimeSlotShowcase() {
  const [open, setOpen] = useState(false)
  const [slot, setSlot] = useState<string>("")
  const [confirmed, setConfirmed] = useState<string>("")

  return (
    <div className="flex flex-col items-start gap-3">
      <Drawer direction="right" open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="secondary">
            <Clock className="size-[18px]" />
            Elegir horario
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="flex h-full flex-col">
            <DrawerHeader>
              <DrawerTitle>Elegir horario</DrawerTitle>
              <DrawerDescription>
                Seleccioná un horario disponible para tu entrevista. Los horarios en gris ya están reservados.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerBody className="py-2">
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

/* ── Non-modal: page stays interactive while the drawer is open (modal={false}). ── */
export function DrawerNonModalShowcase() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Drawer direction="right" modal={false}>
        <DrawerTrigger asChild>
          <Button variant="secondary" size="sm">Abrir drawer no-modal</Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="flex h-full flex-col">
            <DrawerHeader>
              <DrawerTitle>Panel no-modal</DrawerTitle>
              <DrawerDescription>Sin scrim bloqueante: podés seguir usando la página con el panel abierto.</DrawerDescription>
            </DrawerHeader>
            <DrawerBody className="py-2">
              <p className="text-body-sm text-fg leading-relaxed">Útil para paneles de ayuda, filtros persistentes o inspectores que acompañan la tarea.</p>
            </DrawerBody>
            <DrawerFooter>
              <DrawerClose asChild><Button variant="secondary" size="sm">Cerrar</Button></DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
      <p className="text-caption text-fg-subtle">Este texto sigue siendo interactivo con el drawer abierto.</p>
    </div>
  )
}

/* ── Nested: open a drawer from inside another (parent stays mounted, stacks behind). ── */
export function DrawerNestedShowcase() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="secondary" size="sm">Abrir drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="flex h-full flex-col">
          <DrawerHeader>
            <DrawerTitle>Detalle de vacante</DrawerTitle>
            <DrawerDescription>Abrí un segundo drawer para editar sin perder este contexto.</DrawerDescription>
          </DrawerHeader>
          <DrawerBody className="py-2">
            <DrawerNestedRoot direction="right">
              <DrawerTrigger asChild>
                <Button variant="tertiary" size="sm">Editar postulante</Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="flex h-full flex-col">
                  <DrawerHeader>
                    <DrawerTitle>Editar postulante</DrawerTitle>
                    <DrawerDescription>El drawer padre queda montado, apilado detrás.</DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>
                    <DrawerClose asChild><Button variant="secondary" size="sm">Volver</Button></DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </DrawerNestedRoot>
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose asChild><Button variant="secondary" size="sm">Cerrar</Button></DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

/* ── Snap points: a bottom drawer that snaps between preset heights (vaul snapPoints). ── */
export function DrawerSnapPointsShowcase() {
  const [snap, setSnap] = useState<number | string | null>(0.4)
  return (
    <Drawer snapPoints={[0.4, 0.9]} activeSnapPoint={snap} setActiveSnapPoint={setSnap}>
      <DrawerTrigger asChild>
        <Button variant="secondary" size="sm">Abrir con snap points</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-md flex-col">
          <DrawerHeader>
            <DrawerTitle>Snap points</DrawerTitle>
            <DrawerDescription>Arrastrá la manija para saltar entre 40% y 90% del alto.</DrawerDescription>
          </DrawerHeader>
          <DrawerBody className="py-2">
            <p className="text-body-sm text-fg leading-relaxed">
              Los snap points muestran un resumen a media altura y el detalle completo al expandir —
              patrón típico de mapas, reproductores o listas de resultados en mobile.
            </p>
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose asChild><Button variant="secondary" size="sm">Cerrar</Button></DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

/* ── Responsive: Dialog on desktop (≥768px), Drawer (bottom) on mobile. ── */
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

export function DrawerResponsiveShowcase() {
  const isDesktop = useIsDesktop()
  const title = "Editar perfil"
  const desc = "Actualizá tus datos. En desktop es un Dialog; en mobile, un Drawer."
  const body = <p className="text-body-sm text-fg leading-relaxed">El mismo contenido se presenta como Dialog centrado en pantallas anchas y como Drawer anclado abajo en compacto.</p>

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
    <Drawer>
      <DrawerTrigger asChild><Button variant="secondary" size="sm">Editar perfil</Button></DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-md flex-col">
          <DrawerHeader><DrawerTitle>{title}</DrawerTitle><DrawerDescription>{desc}</DrawerDescription></DrawerHeader>
          <DrawerBody className="py-2">{body}</DrawerBody>
          <DrawerFooter>
            <Button variant="primary" size="sm">Guardar</Button>
            <DrawerClose asChild><Button variant="secondary" size="sm">Cancelar</Button></DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
