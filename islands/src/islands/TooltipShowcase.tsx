import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../components/ui/tooltip"
import { Button } from "../components/ui/button"

export function TooltipShowcase() {
  return (
    <TooltipProvider>
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
      <p className="text-label text-fg-subtle mt-4">
        Hover sobre cualquier botón para ver el tooltip. Radix gestiona posicionamiento, foco y cierre.
      </p>
    </TooltipProvider>
  )
}
