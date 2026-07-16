/**
 * Resizable — draggable split panels (horizontal or vertical), built on react-resizable-panels.
 *
 * Cuándo usar: layouts donde el usuario ajusta el tamaño relativo de dos+ áreas (lista/detalle,
 * editor/preview, sidebar redimensionable). Cuándo no: layout fijo (usar grid/flex); mostrar/ocultar
 * un panel (usar Collapsible/Sheet). Reemplaza a: splitters custom con listeners de drag a mano.
 *
 * shadcn Resizable structure, Embassy tokens — the handle uses the border token at rest and the
 * focus ring on keyboard focus. Canonical implementation.
 */
import * as React from "react"
import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"
import { cn } from "../lib/utils"

export const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
    {...props}
  />
)

export const ResizablePanel = ResizablePrimitive.Panel

export const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & { withHandle?: boolean }) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border",
      "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-1",
      "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0",
      "[&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-border bg-surface-container">
        <GripVertical className="size-2.5 text-on-surface-variant" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)
