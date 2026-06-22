import { SegmentedButton, SegmentedItem } from '@embassy/ui'
import { ComponentPage, Bullets, Showcase, References, Bullets as G, A11yList, Code } from '../components/ComponentPage'

export function SegmentedButtonPage() {
  return (
    <ComponentPage
      category="Actions"
      title="Segmented Button"
      subtitle="Agrupa dos o más opciones mutuamente excluyentes en un contenedor compacto; el usuario activa una a la vez."
      overview={
        <section>
          <Bullets items={[
            <>Alterna entre opciones excluyentes dentro del mismo contexto.</>,
            <>La selección se marca con un fondo de acento (secondary-container).</>,
            <>Ideal para alternar vistas, modos o filtros de categoría.</>,
          ]} />
          <Showcase>
            <SegmentedButton defaultValue="list">
              <SegmentedItem value="list">Lista</SegmentedItem>
              <SegmentedItem value="grid">Cuadrícula</SegmentedItem>
            </SegmentedButton>
            <SegmentedButton defaultValue="week">
              <SegmentedItem value="day">Día</SegmentedItem>
              <SegmentedItem value="week">Semana</SegmentedItem>
              <SegmentedItem value="month">Mes</SegmentedItem>
            </SegmentedButton>
          </Showcase>
          <References items={[
            <><b>Seleccionado</b> — fondo <code>--color-secondary-container</code>.</>,
            <><b>Sin seleccionar</b> — transparente, contorno <code>--color-outline</code>.</>,
          ]} />
        </section>
      }
      guidelines={<G items={[<>2–5 opciones excluyentes y cortas.</>, <>Muchas opciones → <b>Select</b>.</>, <>Cambiar de vista/sección con contenido → <b>Tabs</b>.</>]} />}
      accessibility={<A11yList items={[<>Toggle group de selección única (Radix); flechas navegan.</>, <>Foco visible oficial; el estado no es solo color.</>]} />}
      code={<Code>{`import { SegmentedButton, SegmentedItem } from "@embassy/ui"

<SegmentedButton defaultValue="list">
  <SegmentedItem value="list">Lista</SegmentedItem>
  <SegmentedItem value="grid">Cuadrícula</SegmentedItem>
</SegmentedButton>`}</Code>}
    />
  )
}
