import { Button, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, Input } from '@embassy/ui'
import { ComponentPage, Bullets, Showcase, References, DoDont, A11yList, Code } from '../components/ComponentPage'

export function DialogPage() {
  return (
    <ComponentPage
      category="Overlays"
      title="Dialog"
      subtitle="Interrumpe el flujo para comunicar información crítica o pedir una decisión, sobre un scrim que bloquea el contenido."
      overview={
        <section>
          <Bullets items={[
            <>Bloquea el flujo hasta resolverse; aparece sobre un scrim.</>,
            <>Estructura por slots: título, contenido y acciones.</>,
            <>Atrapa el foco y se cierra con Escape, el scrim o una acción (Radix).</>,
          ]} />
          <Showcase>
            <Dialog>
              <DialogTrigger asChild><Button>Abrir diálogo</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Renombrar vacante</DialogTitle>
                  <DialogDescription>Elegí un nombre claro para identificar la vacante.</DialogDescription>
                </DialogHeader>
                <Input placeholder="Nombre de la vacante" />
                <DialogFooter>
                  <DialogClose asChild><Button variant="text">Cancelar</Button></DialogClose>
                  <DialogClose asChild><Button>Guardar</Button></DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Showcase>
          <References items={[
            <><b>Título + descripción</b> — nombran el diálogo para lectores de pantalla.</>,
            <><b>Acciones</b> — máx. 2–3; la confirmación a la derecha.</>,
          ]} />
        </section>
      }
      guidelines={
        <DoDont
          doItems={[<>Confirmar acciones destructivas o irreversibles.</>, <>Pedir una decisión que el flujo necesita ya.</>]}
          dontItems={[<>Avisos breves no bloqueantes → <b>Snackbar</b>.</>, <>Contenido extenso/multi-paso → una <b>vista</b> o <b>Sheet</b>.</>]}
        />
      }
      accessibility={<A11yList items={[<>Atrapa el foco y lo devuelve al disparador al cerrar (Radix).</>, <>Escape cierra; el título nombra el diálogo.</>, <>Scrim bloquea la interacción con el fondo.</>]} />}
      code={<Code>{`import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, Button } from "@embassy/ui"

<Dialog>
  <DialogTrigger asChild><Button>Abrir</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Título</DialogTitle></DialogHeader>
    …
    <DialogFooter><DialogClose asChild><Button>Guardar</Button></DialogClose></DialogFooter>
  </DialogContent>
</Dialog>`}</Code>}
    />
  )
}
