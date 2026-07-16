import { Button } from "@ds/button"
import { Input } from "@ds/input"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@ds/dialog"

/**
 * Specs › "Demo interactiva".
 * Uses the canonical shadcn Dialog (Radix) — the former custom @ds/modal
 * was a duplicate of this and has been removed. Trigger/Close are the
 * uncontrolled shadcn pattern (focus trap, Esc, scrim handled by Radix).
 */
export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Abrir modal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agendar entrevista</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input label="Candidato" placeholder="Nombre del candidato" />
            <Input label="Fecha" type="date" />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="tertiary">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="primary">Agendar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
