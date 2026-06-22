import { Checkbox } from '@embassy/ui'
import { ComponentPage, Bullets, Showcase, References, Bullets as G, A11yList, Code } from '../components/ComponentPage'

const states = [
  { label: 'Sin marcar', props: {} },
  { label: 'Marcado', props: { defaultChecked: true } },
  { label: 'Indeterminado', props: { checked: 'indeterminate' as const } },
  { label: 'Deshabilitado', props: { disabled: true } },
]

export function CheckboxPage() {
  return (
    <ComponentPage
      category="Selección"
      title="Checkbox"
      subtitle="Permite seleccionar uno o varios elementos de un conjunto, o alternar una opción que se aplica al confirmar."
      overview={
        <section>
          <Bullets items={[
            <>Selección múltiple e independiente dentro de un grupo.</>,
            <>Estados: sin marcar, marcado, indeterminado y deshabilitado.</>,
            <>El cambio suele confirmarse con una acción (a diferencia del Switch).</>,
          ]} />
          <Showcase>
            {states.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <Checkbox {...s.props} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </Showcase>
          <References items={[
            <><b>Marcado</b> — relleno <code>--color-primary</code> con check.</>,
            <><b>Indeterminado</b> — estado parcial de un grupo (guion).</>,
            <><b>Deshabilitado</b> — no interactivo, opacidad reducida.</>,
          ]} />
        </section>
      }
      guidelines={<G items={[<>Selección múltiple en formularios.</>, <>Para on/off inmediato → <b>Switch</b>.</>, <>Para una opción entre varias → <b>Radio</b>.</>]} />}
      accessibility={<A11yList items={[<>Asociá una etiqueta clicable.</>, <>Operable por teclado (Espacio); foco visible.</>, <>El estado indeterminado se expone vía <code>aria-checked="mixed"</code> (Radix).</>]} />}
      code={<Code>{`import { Checkbox } from "@embassy/ui"

<Checkbox />
<Checkbox defaultChecked />
<Checkbox checked="indeterminate" />
<Checkbox disabled />`}</Code>}
    />
  )
}
