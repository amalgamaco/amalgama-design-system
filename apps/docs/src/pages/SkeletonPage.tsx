import { Skeleton } from '@embassy/ui'
import { ComponentPage, Bullets, Showcase, References, Bullets as G, A11yList, Code } from '../components/ComponentPage'

export function SkeletonPage() {
  return (
    <ComponentPage
      category="Feedback"
      title="Skeleton"
      subtitle="Placeholder animado que ocupa la forma del contenido mientras carga, reduciendo la sensación de espera."
      overview={
        <section>
          <Bullets items={[
            <>Muestra la estructura del contenido antes de que llegue.</>,
            <>Animación de pulso sobre <code>--color-surface-variant</code>.</>,
            <>Para progreso de una operación con duración → <b>Progress</b>.</>,
          ]} />
          <Showcase>
            <div className="w-72 flex items-center gap-3">
              <Skeleton className="size-12 rounded-full" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </Showcase>
          <References items={[
            <><b>Bloques</b> — replican avatar, títulos y líneas del contenido real.</>,
            <><b>Pulso</b> — comunica "cargando" sin un spinner.</>,
          ]} />
        </section>
      }
      guidelines={<G items={[<>Cargas de estructura conocida (listas, cards).</>, <>Operación con porcentaje → <b>Progress</b>.</>, <>No abusar: solo en la carga inicial.</>]} />}
      accessibility={<A11yList items={[<>Marcá la región como ocupada con <code>aria-busy="true"</code>.</>, <>Los skeletons son decorativos (<code>aria-hidden</code>); anunciá "cargando" aparte.</>]} />}
      code={<Code>{`import { Skeleton } from "@embassy/ui"

<Skeleton className="size-12 rounded-full" />
<Skeleton className="h-4 w-3/4" />`}</Code>}
    />
  )
}
