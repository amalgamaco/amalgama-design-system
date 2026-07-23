import { useState } from "react"
import { SegmentedButtonGroup, SegmentedButtonItem } from "@ds/segmented-button"

export function SegmentedButtonShowcase() {
  const [view, setView] = useState("lista")
  const [period, setPeriod] = useState("semana")
  const [align, setAlign] = useState("izquierda")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-label text-fg-subtle mb-2">Vista</p>
        <SegmentedButtonGroup value={view} onValueChange={(v) => v && setView(v)}>
          <SegmentedButtonItem value="lista">Lista</SegmentedButtonItem>
          <SegmentedButtonItem value="cuadricula">Cuadrícula</SegmentedButtonItem>
        </SegmentedButtonGroup>
      </div>

      <div>
        <p className="text-label text-fg-subtle mb-2">Período</p>
        <SegmentedButtonGroup value={period} onValueChange={(v) => v && setPeriod(v)}>
          <SegmentedButtonItem value="dia">Día</SegmentedButtonItem>
          <SegmentedButtonItem value="semana">Semana</SegmentedButtonItem>
          <SegmentedButtonItem value="mes">Mes</SegmentedButtonItem>
        </SegmentedButtonGroup>
      </div>

      <div>
        <p className="text-label text-fg-subtle mb-2">Tamaño pequeño</p>
        <SegmentedButtonGroup size="sm" value={align} onValueChange={(v) => v && setAlign(v)}>
          <SegmentedButtonItem value="izquierda">Izquierda</SegmentedButtonItem>
          <SegmentedButtonItem value="centro">Centro</SegmentedButtonItem>
          <SegmentedButtonItem value="derecha">Derecha</SegmentedButtonItem>
        </SegmentedButtonGroup>
      </div>

      <div>
        <p className="text-label text-fg-subtle mb-2">Deshabilitado</p>
        <SegmentedButtonGroup value="lista" onValueChange={() => {}}>
          <SegmentedButtonItem value="lista" disabled>Lista</SegmentedButtonItem>
          <SegmentedButtonItem value="cuadricula" disabled>Cuadrícula</SegmentedButtonItem>
        </SegmentedButtonGroup>
      </div>
    </div>
  )
}
