import { Button } from "@ds/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@ds/dropdown-menu"

export function MenuShowcase() {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="primary" size="sm">Opciones</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>Editar</DropdownMenuItem>
          <DropdownMenuItem>Duplicar</DropdownMenuItem>
          <DropdownMenuItem>Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="docs-section-desc" style={{ marginTop: 14 }}>
        Hacé clic en el botón para abrir el menú. Posicionamiento, foco y navegación por teclado vienen de Radix UI.
      </p>
    </div>
  )
}
