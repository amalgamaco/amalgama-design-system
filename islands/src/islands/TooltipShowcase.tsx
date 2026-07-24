import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@ds/tooltip"
import { RichTooltip } from "@ds/rich-tooltip"
import { Button } from "@ds/button"

export function TooltipShowcase() {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-8">
        {/* Plain tooltips — hover/focus, short label on inverse-surface */}
        <div>
          <p className="text-label text-fg-subtle mb-3 uppercase tracking-wide">Plain tooltip</p>
          <div className="flex items-center gap-6 flex-wrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="sm">Arriba (default)</Button>
              </TooltipTrigger>
              <TooltipContent side="top">Tooltip en la parte superior</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="sm">Abajo</Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Tooltip en la parte inferior</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="sm">Derecha</Button>
              </TooltipTrigger>
              <TooltipContent side="right">Tooltip a la derecha</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="sm">Izquierda</Button>
              </TooltipTrigger>
              <TooltipContent side="left">Tooltip a la izquierda</TooltipContent>
            </Tooltip>
          </div>
          <p className="text-label text-fg-subtle mt-3">
            Hover sobre cualquier botón para ver el tooltip.
          </p>
        </div>

        {/* Rich tooltip — persistent, with title + subtitle + close + actions */}
        <div>
          <p className="text-label text-fg-subtle mb-3 uppercase tracking-wide">Rich tooltip</p>
          <div className="flex items-center gap-6 flex-wrap">
            <RichTooltip
              trigger={
                <Button variant="secondary" size="sm">
                  ¿Qué es una vacante?
                </Button>
              }
              title="Vacante"
              subtitle="Una posición abierta dentro de una búsqueda. Agrupa candidatos, etapas y responsables del proceso de selección."
              actions={
                <Button variant="text" size="sm">Saber más</Button>
              }
            />
          </div>
          <p className="text-label text-fg-subtle mt-3">
            Click para abrir. Persiste hasta cerrar con el botón ×, Escape o un click afuera.
          </p>
        </div>
      </div>
    </TooltipProvider>
  )
}
