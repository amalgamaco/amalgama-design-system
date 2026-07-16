import { Button } from "@ds/button"
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

export function DialogShowcase() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary" size="sm">Abrir diálogo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar acción</DialogTitle>
        </DialogHeader>
        <DialogBody>¿Estás seguro de continuar?</DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="tertiary" size="sm">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="primary" size="sm">Confirmar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
