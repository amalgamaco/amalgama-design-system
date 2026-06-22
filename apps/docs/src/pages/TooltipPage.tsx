import { Button, Tooltip, TooltipTrigger, TooltipContent } from '@embassy/ui'
import { ComponentPage, Bullets, Showcase, References, Bullets as G, A11yList, Code } from '../components/ComponentPage'

export function TooltipPage() {
  return (
    <ComponentPage
      category="Overlays"
      title="Tooltip"
      subtitle="Muestra una etiqueta breve y contextual al posar el cursor o el foco sobre un elemento, sin interrumpir el flujo."
      overview={
        <section>
          <Bullets items={[
            <>Texto breve y aclaratorio sobre un control (no contenido esencial).</>,
            <>Aparece en hover y en foco de teclado; usa superficie inversa.</>,
            <>Una sola línea idealmente; nunca para información crítica.</>,
          ]} />
          <Showcase>
            <Tooltip>
              <TooltipTrigger asChild><Button variant="outline">Hover / focus</Button></TooltipTrigger>
              <TooltipContent>Etiqueta contextual</TooltipContent>
            </Tooltip>
          </Showcase>
          <References items={[
            <><b>Contenido</b> — sobre <code>--color-inverse-surface</code>, texto inverse-on-surface.</>,
            <><b>Disparo</b> — hover + focus, con delay (Radix Provider).</>,
          ]} />
        </section>
      }
      guidelines={<G items={[<>Aclarar íconos o controles ambiguos.</>, <>No para info esencial o accionable.</>, <>Mantener el texto corto.</>]} />}
      accessibility={<A11yList items={[<>Se dispara también con foco de teclado (no solo hover).</>, <>Asociado al control vía <code>aria-describedby</code> (Radix).</>, <>No colocar elementos interactivos dentro del tooltip.</>]} />}
      code={<Code>{`import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@embassy/ui"

// Envolver la app una vez en <TooltipProvider>
<Tooltip>
  <TooltipTrigger asChild><Button>Hover</Button></TooltipTrigger>
  <TooltipContent>Etiqueta</TooltipContent>
</Tooltip>`}</Code>}
    />
  )
}
