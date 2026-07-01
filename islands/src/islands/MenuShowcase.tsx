import * as React from "react"
import { Button } from "@ds/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@ds/dropdown-menu"
import { Pencil, Copy, Archive, Trash2, Check } from "lucide-react"

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


// ── Configurations — a REAL interactive menu: leading icons, shortcut, separator,
// disabled item and a destructive item. Click the trigger to open. ──
export function MenuConfig() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm">Acciones</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[220px]">
        <DropdownMenuItem className="gap-2 [&_svg]:size-[18px]">
          <Pencil /> Editar
          <span className="ml-auto text-caption text-on-surface-variant">⌘E</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 [&_svg]:size-[18px]">
          <Copy /> Duplicar
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="gap-2 [&_svg]:size-[18px]">
          <Archive /> Archivar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 [&_svg]:size-[18px] text-error focus:bg-error-container focus:text-on-error-container">
          <Trash2 /> Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── States — the six item states rendered on the real menu surface with Embassy
// tokens. A live popover can only show one highlight at a time, so each state is
// pinned on its own menu surface using the canonical item token classes. ──
const MENU_SURFACE =
  "w-full rounded-md border border-border bg-surface-container-high p-1.5 text-on-surface shadow-lg"
const MENU_ITEM =
  "relative flex select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none [&_svg]:size-[18px] [&_svg]:opacity-70"

function StateCell({ caption, itemClass, icon, label, trailing }: { caption: string; itemClass?: string; icon: React.ReactNode; label: string; trailing?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-caption font-medium text-fg-subtle">{caption}</span>
      <div className={MENU_SURFACE}>
        <div className={MENU_ITEM + (itemClass ? " " + itemClass : "")}>
          {icon}
          {label}
          {trailing && <span className="ml-auto">{trailing}</span>}
        </div>
      </div>
    </div>
  )
}

export function MenuStates() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <StateCell caption="Default" icon={<Pencil />} label="Editar" />
      <StateCell caption="Hover" itemClass="bg-[var(--color-nav-hover)] text-[var(--color-nav-hover-content)]" icon={<Copy />} label="Duplicar" />
      <StateCell caption="Focus" itemClass="bg-[var(--color-nav-hover)] text-[var(--color-nav-hover-content)] shadow-[inset_0_0_0_2px_var(--color-focus-ring)]" icon={<Pencil />} label="Mover" />
      <StateCell caption="Pressed" itemClass="bg-[var(--color-nav-press)] text-[var(--color-nav-hover-content)]" icon={<Pencil />} label="Renombrar" />
      <StateCell caption="Disabled" itemClass="opacity-40" icon={<Archive />} label="Archivar" />
      <StateCell caption="Selected" itemClass="bg-[var(--color-nav-selected)] text-[var(--color-nav-selected-content)] font-medium" icon={<Check />} label="Vista compacta" />
    </div>
  )
}
