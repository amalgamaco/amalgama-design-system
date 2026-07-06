import { useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
  type ChartConfig,
} from "@ds/chart"
import { SegmentedButtonGroup, SegmentedButtonItem } from "@ds/segmented-button"
import { Button } from "@ds/button"
import { RefreshCw } from "lucide-react"

const weeklyData = [
  { label: "Lun", ingresos: 1200, gastos: 900 },
  { label: "Mar", ingresos: 1800, gastos: 1100 },
  { label: "Mié", ingresos: 1600, gastos: 1300 },
  { label: "Jue", ingresos: 2100, gastos: 1400 },
  { label: "Vie", ingresos: 2600, gastos: 1500 },
  { label: "Sáb", ingresos: 1900, gastos: 1000 },
  { label: "Dom", ingresos: 1400, gastos: 700 },
]

const monthlyData = [
  { label: "Sem 1", ingresos: 8200, gastos: 5400 },
  { label: "Sem 2", ingresos: 9600, gastos: 6100 },
  { label: "Sem 3", ingresos: 11200, gastos: 6800 },
  { label: "Sem 4", ingresos: 10300, gastos: 7200 },
]

const annualData = [
  { label: "Ene", ingresos: 32000, gastos: 21000 },
  { label: "Feb", ingresos: 34500, gastos: 22500 },
  { label: "Mar", ingresos: 38200, gastos: 24000 },
  { label: "Abr", ingresos: 36800, gastos: 25100 },
  { label: "May", ingresos: 41200, gastos: 26400 },
  { label: "Jun", ingresos: 44900, gastos: 27800 },
  { label: "Jul", ingresos: 43100, gastos: 28200 },
  { label: "Ago", ingresos: 45600, gastos: 29000 },
  { label: "Sep", ingresos: 48300, gastos: 30100 },
  { label: "Oct", ingresos: 50200, gastos: 31200 },
  { label: "Nov", ingresos: 52800, gastos: 32400 },
  { label: "Dic", ingresos: 58900, gastos: 34800 },
]

const vacanciesData = [
  { label: "Ingeniería", vacantes: 24 },
  { label: "Producto", vacantes: 12 },
  { label: "Diseño", vacantes: 8 },
  { label: "Ventas", vacantes: 18 },
  { label: "Soporte", vacantes: 6 },
]

const sourceData = [
  { name: "LinkedIn", value: 42 },
  { name: "Referidos", value: 28 },
  { name: "Sitio web", value: 18 },
  { name: "Otros", value: 12 },
]

const lineConfig = {
  ingresos: { label: "Ingresos", color: "var(--color-chart-1)" },
  gastos: { label: "Gastos", color: "var(--color-chart-4)" },
} satisfies ChartConfig

const barConfig = {
  vacantes: { label: "Vacantes abiertas", color: "var(--color-chart-1)" },
} satisfies ChartConfig

const pieConfig = {
  LinkedIn: { label: "LinkedIn", color: "var(--color-chart-1)" },
  Referidos: { label: "Referidos", color: "var(--color-chart-2)" },
  "Sitio web": { label: "Sitio web", color: "var(--color-chart-3)" },
  Otros: { label: "Otros", color: "var(--color-chart-5)" },
} satisfies ChartConfig

const PIE_COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-5)"]

function axisProps() {
  return {
    tickLine: false,
    axisLine: false,
    tickMargin: 8,
    className: "text-caption",
  }
}

export function LineChartShowcase() {
  return (
    <ChartContainer config={lineConfig} className="aspect-auto h-[280px] w-full">
      <LineChart data={weeklyData} margin={{ left: 4, right: 4 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" {...axisProps()} />
        <YAxis {...axisProps()} width={40} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Legend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="ingresos"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="gastos"
          stroke="var(--color-chart-4)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

export function BarChartShowcase() {
  return (
    <ChartContainer config={barConfig} className="aspect-auto h-[280px] w-full">
      <BarChart data={vacanciesData} margin={{ left: 4, right: 4 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" {...axisProps()} />
        <YAxis {...axisProps()} width={32} />
        <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
        <Bar dataKey="vacantes" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  )
}

export function PieChartShowcase() {
  return (
    <ChartContainer config={pieConfig} className="mx-auto aspect-square h-[280px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={sourceData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={4}
          isAnimationActive={false}
        >
          {sourceData.map((entry, index) => (
            <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="var(--color-card)" />
          ))}
        </Pie>
        <Legend content={<ChartLegendContent nameKey="name" />} />
      </PieChart>
    </ChartContainer>
  )
}

const RANGE_DATA = { weekly: weeklyData, monthly: monthlyData, annual: annualData } as const
type Range = keyof typeof RANGE_DATA

export function ChartTimeRangeShowcase() {
  const [range, setRange] = useState<Range>("weekly")
  const data = RANGE_DATA[range]

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-body-sm text-fg-muted">Ingresos vs. gastos</div>
          <div className="font-heading text-heading-sm font-semibold text-fg">
            {range === "weekly" ? "Esta semana" : range === "monthly" ? "Este mes" : "Este año"}
          </div>
        </div>
        <SegmentedButtonGroup
          size="sm"
          value={range}
          onValueChange={(v) => v && setRange(v as Range)}
          aria-label="Rango de tiempo"
        >
          <SegmentedButtonItem value="weekly">Semanal</SegmentedButtonItem>
          <SegmentedButtonItem value="monthly">Mensual</SegmentedButtonItem>
          <SegmentedButtonItem value="annual">Anual</SegmentedButtonItem>
        </SegmentedButtonGroup>
      </div>
      <ChartContainer config={lineConfig} className="aspect-auto h-[280px] w-full">
        <BarChart data={data} margin={{ left: 4, right: 4 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" {...axisProps()} />
          <YAxis {...axisProps()} width={44} />
          <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
          <Legend content={<ChartLegendContent />} />
          <Bar dataKey="ingresos" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
          <Bar dataKey="gastos" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export function ChartEmptyState() {
  return (
    <div className="flex h-[280px] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-center">
      <div className="text-body-md font-medium text-fg-subtle">Sin datos para este período</div>
      <p className="max-w-[280px] text-body-sm text-fg-muted">
        Cuando haya actividad registrada, el gráfico va a aparecer acá.
      </p>
    </div>
  )
}

export function ChartLoadingState() {
  return (
    <div className="flex h-[280px] w-full flex-col justify-end gap-3 rounded-lg border border-border p-4">
      <div className="flex flex-1 items-end gap-3">
        {[40, 70, 55, 90, 65, 80, 50].map((h, i) => (
          <div
            key={i}
            className="flex-1 animate-pulse rounded-t-sm bg-surface-variant"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="h-2 w-1/3 animate-pulse rounded-full bg-surface-variant" />
    </div>
  )
}

export function ChartErrorState() {
  return (
    <div className="flex h-[280px] w-full flex-col items-center justify-center gap-3 rounded-lg border border-border text-center">
      <div>
        <div className="text-body-md font-medium text-error">No se pudo cargar el gráfico</div>
        <p className="mt-1 max-w-[280px] text-body-sm text-fg-muted">
          Hubo un error al traer los datos. Probá de nuevo en unos segundos.
        </p>
      </div>
      <Button variant="tertiary" size="sm">
        <RefreshCw className="size-4" aria-hidden />
        Reintentar
      </Button>
    </div>
  )
}
