import { RadioGroup, RadioGroupItem } from '@embassy/ui'
import { ComponentPage, Bullets, Showcase, References, Bullets as G, A11yList, Code } from '../components/ComponentPage'

const lbl = { display: 'flex', gap: 10, alignItems: 'center', font: '400 14px var(--font-body)', color: 'var(--color-on-surface)' } as React.CSSProperties

export function RadioPage() {
  return (
    <ComponentPage
      category="Selección"
      title="Radio button"
      subtitle="Selección exclusiva — una sola opción activa dentro de un grupo de valores mutuamente excluyentes."
      overview={
        <section>
          <Bullets items={[
            <>Una sola opción entre un grupo mutuamente excluyente.</>,
            <>Todas las opciones comparten el mismo grupo (<code>name</code>).</>,
            <>Útil cuando ver todas las opciones a la vez ayuda a comparar.</>,
          ]} />
          <Showcase>
            <RadioGroup defaultValue="m" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={lbl}><RadioGroupItem value="m" /> Mensual</label>
              <label style={lbl}><RadioGroupItem value="a" /> Anual</label>
              <label style={lbl}><RadioGroupItem value="t" /> Trimestral</label>
            </RadioGroup>
          </Showcase>
          <References items={[
            <><b>Seleccionado</b> — borde <code>--color-primary</code> + punto interior.</>,
            <><b>Sin seleccionar</b> — borde <code>--color-outline</code>.</>,
          ]} />
        </section>
      }
      guidelines={<G items={[<>2–5 opciones excluyentes y visibles.</>, <>Más de 5 → <b>Select</b>.</>, <>Selección múltiple → <b>Checkbox</b>.</>]} />}
      accessibility={<A11yList items={[<>Expone <code>radiogroup</code>/<code>radio</code> (Radix); flechas navegan el grupo.</>, <>Cada opción con etiqueta clicable.</>, <>Foco visible oficial.</>]} />}
      code={<Code>{`import { RadioGroup, RadioGroupItem } from "@embassy/ui"

<RadioGroup defaultValue="m">
  <label><RadioGroupItem value="m" /> Mensual</label>
  <label><RadioGroupItem value="a" /> Anual</label>
</RadioGroup>`}</Code>}
    />
  )
}
