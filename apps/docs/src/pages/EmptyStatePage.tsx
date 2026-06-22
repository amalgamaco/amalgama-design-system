import { EmptyState, Button } from '@embassy/ui'
import { Inbox } from 'lucide-react'
import { ComponentPage, Bullets, Showcase, References, Bullets as G, A11yList, Code } from '../components/ComponentPage'

export function EmptyStatePage() {
  return (
    <ComponentPage
      category="Feedback"
      title="Empty State"
      subtitle="Comunica que no hay contenido todavía y orienta a la persona hacia la acción que llenará el espacio."
      overview={
        <section>
          <Bullets items={[
            <>Explica por qué el área está vacía y qué hacer al respecto.</>,
            <>Anatomía: ícono, título, descripción y una acción primaria opcional.</>,
            <>Distinto de un error: es un estado normal, no un fallo.</>,
          ]} />
          <Showcase>
            <div className="w-96 rounded-[12px] border border-border">
              <EmptyState
                icon={<Inbox />}
                title="Sin vacantes activas"
                description="Cuando publiques una vacante, vas a verla acá."
                action={<Button size="sm">Crear vacante</Button>}
              />
            </div>
          </Showcase>
          <References items={[
            <><b>Ícono + título</b> — nombran el estado de forma amable.</>,
            <><b>Acción</b> — un único CTA que resuelve el vacío.</>,
          ]} />
        </section>
      }
      guidelines={<G items={[<>Primera vez / sin resultados de búsqueda / lista vaciada.</>, <>Un solo CTA claro.</>, <>Para fallos de carga usá un estado de error, no este.</>]} />}
      accessibility={<A11yList items={[<>El ícono es decorativo (<code>aria-hidden</code>); el título comunica el estado.</>, <>El CTA es un control accesible con etiqueta clara.</>]} />}
      code={<Code>{`import { EmptyState, Button } from "@embassy/ui"
import { Inbox } from "lucide-react"

<EmptyState
  icon={<Inbox />}
  title="Sin vacantes activas"
  description="Cuando publiques una vacante, vas a verla acá."
  action={<Button size="sm">Crear vacante</Button>}
/>`}</Code>}
    />
  )
}
