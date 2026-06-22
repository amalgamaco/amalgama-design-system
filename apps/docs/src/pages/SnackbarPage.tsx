import { Button, toast } from '@embassy/ui'
import { ComponentPage, Bullets, Showcase, References, DoDont, A11yList, Code } from '../components/ComponentPage'

export function SnackbarPage() {
  return (
    <ComponentPage
      category="Feedback"
      title="Snackbar"
      subtitle="Retroalimentación breve y transitoria sobre una operación. Aparece en el borde inferior, sin interrumpir el flujo, y se descarta solo."
      overview={
        <section>
          <Bullets items={[
            <>No interrumpe la experiencia — aparece brevemente y no exige respuesta.</>,
            <>Usa <b>superficie inversa</b> (<code>--color-inverse-surface</code>): contrasta con el fondo en cualquier tema.</>,
            <>Implementado con <b>Sonner</b> — la pieza que <code>@material/web</code> nunca tuvo.</>,
            <>Puede llevar una acción única (p. ej. "Deshacer").</>,
          ]} />
          <Showcase>
            <Button onClick={() => toast('Archivo eliminado', { action: { label: 'Deshacer', onClick: () => {} } })}>
              Mostrar snackbar
            </Button>
          </Showcase>
          <References items={[
            <><b>Contenedor</b> — <code>--color-inverse-surface</code> (oscuro sobre claro / claro sobre oscuro).</>,
            <><b>Acción</b> — una sola, opcional ("Deshacer").</>,
          ]} />
        </section>
      }
      guidelines={
        <DoDont
          doItems={[<>Confirmar acciones completadas ("Archivo eliminado").</>, <>Ofrecer un "Deshacer" inmediato.</>]}
          dontItems={[<>Decisiones que bloquean el flujo → <b>Dialog</b>.</>, <>Errores que requieren acción → <b>Dialog</b>/<b>Banner</b>.</>, <>Más de una acción.</>]}
        />
      }
      accessibility={<A11yList items={[<>Anunciado en una región live (Sonner usa <code>role="status"</code>).</>, <>El timer se pausa en hover/focus.</>, <>No mover el foco automáticamente al aparecer.</>]} />}
      code={<Code>{`import { Toaster, toast } from "@embassy/ui"

// Montar <Toaster /> una vez en la raíz
toast("Archivo eliminado", {
  action: { label: "Deshacer", onClick: () => undo() },
})`}</Code>}
    />
  )
}
