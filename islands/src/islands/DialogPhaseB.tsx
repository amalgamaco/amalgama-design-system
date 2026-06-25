import * as React from "react"
import { Button } from "@ds/button"
import { Input } from "@ds/input"
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter,
} from "@ds/modal"

/**
 * Specs › "Demo interactiva".
 * Replaces the hand-wired trigger button + static .modal-overlay/.modal markup
 * with the real @ds/modal component, opened from a real @ds Button.
 */
export function DialogDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Abrir modal
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalHeader>
          <ModalTitle>Agendar entrevista</ModalTitle>
          <ModalClose onClick={() => setOpen(false)} />
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Input label="Candidato" placeholder="Nombre del candidato" />
            <Input label="Fecha" type="date" />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="tertiary" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Agendar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
