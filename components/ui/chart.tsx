/**
 * Chart — línea, barra y torta, dibujados a mano en SVG (línea/barra) y
 * CSS conic-gradient (torta). Sin librería de charting.
 *
 * Cuándo usar: series temporales o categóricas en dashboards y analytics.
 * Cuándo no: una sola métrica puntual (usar Stat Card); tablas de datos exactos (usar Table).
 * Reemplaza a: gráficos armados con imágenes estáticas o librerías ad-hoc sin theming.
 *
 * Versión simplificada (revert a plain CSS/vanilla JS): cubre línea/barra/torta
 * básicos con datos estáticos. No tiene brush/zoom, ni tooltip posicionado por
 * JS — usa <title> nativo del navegador como tooltip de valor por punto/barra/
 * sector. La paleta categórica (--chart-1..5) vive en css/components/chart.css,
 * mapeada a Secondary/Tertiary/Success/Warning/Info (nunca Primary — invierte a
 * blanco en dark mode).
 */
import * as React from "react"
import { cn } from "../lib/utils"

export type ChartConfig = Record<string, { label?: string; color?: string }>

function seriesColor(config: ChartConfig | undefined, key: string, index: number) {
  const explicit = config?.[key]?.color
  if (explicit) return explicit
  return `var(--chart-${(index % 5) + 1})`
}

function seriesLabel(config: ChartConfig | undefined, key: string) {
  return config?.[key]?.label ?? key
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("chart-container", className)} {...props}>
    {children}
  </div>
))
ChartContainer.displayName = "ChartContainer"

const ChartLegend = ({ config, keys }: { config?: ChartConfig; keys: string[] }) => (
  <div className="chart-legend">
    {keys.map((key, i) => (
      <div className="chart-legend-item" key={key}>
        <span
          className="chart-legend-swatch"
          style={{ background: seriesColor(config, key, i) }}
        />
        {seriesLabel(config, key)}
      </div>
    ))}
  </div>
)

/* ── Line chart ── */
export interface LineChartProps {
  data: Array<Record<string, number | string>>
  categoryKey: string
  series: string[]
  config?: ChartConfig
  className?: string
  showArea?: boolean
}

const VB_W = 600
const VB_H = 280
const PAD = { top: 12, right: 12, bottom: 28, left: 12 }

function scaleLinear(value: number, min: number, max: number, rangeMin: number, rangeMax: number) {
  if (max === min) return (rangeMin + rangeMax) / 2
  return rangeMin + ((value - min) / (max - min)) * (rangeMax - rangeMin)
}

const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  ({ data, categoryKey, series, config, className, showArea = true }, ref) => {
    const allValues = data.flatMap((d) => series.map((k) => Number(d[k]) || 0))
    const max = Math.max(...allValues, 0)
    const min = Math.min(...allValues, 0)
    const innerW = VB_W - PAD.left - PAD.right
    const innerH = VB_H - PAD.top - PAD.bottom

    const xFor = (i: number) =>
      PAD.left + (data.length <= 1 ? innerW / 2 : (i / (data.length - 1)) * innerW)
    const yFor = (v: number) => PAD.top + innerH - scaleLinear(v, min, max, 0, innerH)

    const gridLines = 4
    const gridY = Array.from({ length: gridLines + 1 }, (_, i) => PAD.top + (innerH / gridLines) * i)

    return (
      <ChartContainer ref={ref} className={className}>
        <svg className="chart-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none">
          <g className="chart-grid">
            {gridY.map((y, i) => (
              <line key={i} x1={PAD.left} x2={VB_W - PAD.right} y1={y} y2={y} />
            ))}
          </g>

          {series.map((key, si) => {
            const color = seriesColor(config, key, si)
            const points = data.map((d, i) => [xFor(i), yFor(Number(d[key]) || 0)] as const)
            const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ")
            const areaPath = `${linePath} L${points[points.length - 1][0]},${PAD.top + innerH} L${points[0][0]},${PAD.top + innerH} Z`

            return (
              <g key={key}>
                {showArea && <path className="chart-area" d={areaPath} fill={color} stroke="none" />}
                <path className="chart-line" d={linePath} stroke={color} />
                {points.map(([x, y], i) => (
                  <circle className="chart-dot" key={i} cx={x} cy={y} r={3.5} fill={color}>
                    <title>{`${seriesLabel(config, key)} · ${String(data[i][categoryKey])}: ${data[i][key]}`}</title>
                  </circle>
                ))}
              </g>
            )
          })}

          {data.map((d, i) => (
            <text
              key={i}
              className="chart-axis-label"
              x={xFor(i)}
              y={VB_H - 8}
              textAnchor="middle"
            >
              {String(d[categoryKey])}
            </text>
          ))}
        </svg>
        <ChartLegend config={config} keys={series} />
      </ChartContainer>
    )
  }
)
LineChart.displayName = "LineChart"

/* ── Bar chart ── */
export interface BarChartProps {
  data: Array<Record<string, number | string>>
  categoryKey: string
  series: string[]
  config?: ChartConfig
  className?: string
}

const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  ({ data, categoryKey, series, config, className }, ref) => {
    const allValues = data.flatMap((d) => series.map((k) => Number(d[k]) || 0))
    const max = Math.max(...allValues, 0)
    const innerW = VB_W - PAD.left - PAD.right
    const innerH = VB_H - PAD.top - PAD.bottom

    const groupW = innerW / data.length
    const barGap = 4
    const barW = (groupW - barGap * 2) / series.length

    const gridLines = 4
    const gridY = Array.from({ length: gridLines + 1 }, (_, i) => PAD.top + (innerH / gridLines) * i)

    return (
      <ChartContainer ref={ref} className={className}>
        <svg className="chart-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none">
          <g className="chart-grid">
            {gridY.map((y, i) => (
              <line key={i} x1={PAD.left} x2={VB_W - PAD.right} y1={y} y2={y} />
            ))}
          </g>

          {data.map((d, gi) => {
            const groupX = PAD.left + gi * groupW + barGap
            return series.map((key, si) => {
              const value = Number(d[key]) || 0
              const h = max === 0 ? 0 : (value / max) * innerH
              const x = groupX + si * barW
              const y = PAD.top + innerH - h
              return (
                <rect
                  key={key}
                  className="chart-bar"
                  x={x}
                  y={y}
                  width={Math.max(barW - 2, 1)}
                  height={h}
                  fill={seriesColor(config, key, si)}
                  rx={2}
                >
                  <title>{`${seriesLabel(config, key)} · ${String(d[categoryKey])}: ${value}`}</title>
                </rect>
              )
            })
          })}

          {data.map((d, i) => (
            <text
              key={i}
              className="chart-axis-label"
              x={PAD.left + i * groupW + groupW / 2}
              y={VB_H - 8}
              textAnchor="middle"
            >
              {String(d[categoryKey])}
            </text>
          ))}
        </svg>
        <ChartLegend config={config} keys={series} />
      </ChartContainer>
    )
  }
)
BarChart.displayName = "BarChart"

/* ── Pie chart (CSS conic-gradient, no trig) ── */
export interface PieChartProps {
  data: Array<{ name: string; value: number; color?: string }>
  className?: string
}

const PieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  ({ data, className }, ref) => {
    const total = data.reduce((sum, d) => sum + d.value, 0) || 1
    let cursor = 0
    const stops = data.map((d, i) => {
      const color = d.color ?? `var(--chart-${(i % 5) + 1})`
      const start = (cursor / total) * 360
      cursor += d.value
      const end = (cursor / total) * 360
      return `${color} ${start}deg ${end}deg`
    })

    return (
      <ChartContainer ref={ref} className={cn("chart-pie-wrap", className)}>
        <div
          className="chart-pie"
          role="img"
          aria-label={data.map((d) => `${d.name}: ${d.value}`).join(", ")}
          style={{ background: `conic-gradient(${stops.join(", ")})` }}
        />
        <div className="chart-legend">
          {data.map((d, i) => (
            <div className="chart-legend-item" key={d.name}>
              <span
                className="chart-legend-swatch"
                style={{ background: d.color ?? `var(--chart-${(i % 5) + 1})` }}
              />
              {d.name} · {d.value}
            </div>
          ))}
        </div>
      </ChartContainer>
    )
  }
)
PieChart.displayName = "PieChart"

export { ChartContainer, ChartLegend, LineChart, BarChart, PieChart }
