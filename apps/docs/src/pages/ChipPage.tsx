import { useState } from 'react'
import { Chip } from '@embassy/ui'
import { Calendar, Check } from 'lucide-react'
import { ComponentPage, Bullets, Showcase, References, DoDont, A11yList, Code } from '../components/ComponentPage'

export function ChipPage() {
  const [on, setOn] = useState(true)
  return (
    <ComponentPage
      category="Selección"
      title="Chips"
      subtitle="Elementos compactos e interactivos que ayudan a ingresar información, hacer selecciones, filtrar contenido o disparar acciones."
      overview={
        <section>
          <Bullets items={[
            <>Representan opciones, filtros, entradas o acciones en un contexto.</>,
            <><b>Cuatro variantes:</b> assist, filter, input y suggestion.</>,
            <>Pueden incluir ícono inicial y, según la variante, estado seleccionado o botón de eliminar.</>,
          ]} />
          <Showcase>
            <div className="flex flex-col items-center gap-4">
              <Chip icon={<Calendar />}>Assist</Chip>
              <span className="flex size-[22px] items-center justify-center rounded-full border-[1.5px] border-muted-foreground text-[11px] font-semibold text-muted-foreground">1</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Chip selected={on} icon={on ? <Check /> : undefined} onClick={() => setOn(!on)}>Filter</Chip>
              <span className="flex size-[22px] items-center justify-center rounded-full border-[1.5px] border-muted-foreground text-[11px] font-semibold text-muted-foreground">2</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Chip onRemove={() => {}}>Input</Chip>
              <span className="flex size-[22px] items-center justify-center rounded-full border-[1.5px] border-muted-foreground text-[11px] font-semibold text-muted-foreground">3</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Chip>Suggestion</Chip>
              <span className="flex size-[22px] items-center justify-center rounded-full border-[1.5px] border-muted-foreground text-[11px] font-semibold text-muted-foreground">4</span>
            </div>
          </Showcase>
          <References items={[
            <><b>Assist</b> — dispara una acción contextual; suele llevar ícono inicial.</>,
            <><b>Filter</b> — alterna un filtro; muestra check al seleccionar (clic para probar).</>,
            <><b>Input</b> — representa información ingresada; incluye botón de eliminar.</>,
            <><b>Suggestion</b> — propone respuestas o acciones dinámicas.</>,
          ]} />
        </section>
      }
      guidelines={
        <DoDont
          doItems={[<>Filtrar resultados o mostrar entradas seleccionadas.</>, <>Ofrecer acciones contextuales junto a un contenido.</>]}
          dontItems={[<>Acción principal de la pantalla → <b>Button</b>.</>, <>Estado pasivo no interactivo → <b>Badge</b>.</>, <>Navegar entre vistas → <b>Tabs</b>.</>]}
        />
      }
      accessibility={<A11yList items={[<>Cada chip es un control enfocable; el de eliminar expone su propia etiqueta.</>, <>El estado seleccionado no se comunica solo por color (check).</>, <>Agrupá chips relacionados para navegación por teclado.</>]} />}
      code={<Code>{`import { Chip } from "@embassy/ui"
import { Calendar, Check } from "lucide-react"

<Chip icon={<Calendar />}>Assist</Chip>
<Chip selected icon={<Check />}>Filter</Chip>
<Chip onRemove={() => {}}>Input</Chip>
<Chip>Suggestion</Chip>`}</Code>}
    />
  )
}
