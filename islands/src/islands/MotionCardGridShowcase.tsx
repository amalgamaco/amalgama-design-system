import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@ds/card"
import { SegmentedButtonGroup, SegmentedButtonItem } from "@ds/segmented-button"
import { Button } from "@ds/button"

const CARDS = [
  { title: "Reclutamiento", desc: "Pipeline de candidatos activos." },
  { title: "Onboarding", desc: "Checklist de nuevos ingresos." },
  { title: "Performance", desc: "Revisiones del trimestre." },
  { title: "Compensación", desc: "Bandas salariales por rol." },
  { title: "Beneficios", desc: "Programas activos del equipo." },
  { title: "Cultura", desc: "Encuestas de clima reciente." },
]

const STAGGER_MS = 60

export function MotionCardGridShowcase() {
  const [scheme, setScheme] = useState<"expressive" | "standard">("expressive")
  const [playKey, setPlayKey] = useState(0)

  // Spatial (translateY + scale) — the only place bounce is allowed to live.
  // Duration comes from the same --duration-medium token regardless of scheme;
  // only the curve changes. That IS the scheme difference per MD3, not an
  // extra hand-tuned "restrained" duration.
  const easeClass = scheme === "expressive" ? "ease-expressive-enter" : "ease-enter"

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <SegmentedButtonGroup
          size="sm"
          value={scheme}
          onValueChange={(v) => v && setScheme(v as "expressive" | "standard")}
        >
          <SegmentedButtonItem value="expressive">Expressive</SegmentedButtonItem>
          <SegmentedButtonItem value="standard">Standard</SegmentedButtonItem>
        </SegmentedButtonGroup>
        <Button variant="tertiary" size="sm" onClick={() => setPlayKey((k) => k + 1)}>
          Repetir animación
        </Button>
      </div>

      <div key={playKey} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {CARDS.map((c, i) => (
          <Card
            key={i}
            className={`animate-grid-enter duration-medium ${easeClass} opacity-0`}
            style={{ animationDelay: `${i * STAGGER_MS}ms` }}
          >
            <CardHeader>
              <CardTitle>{c.title}</CardTitle>
            </CardHeader>
            <CardDescription>{c.desc}</CardDescription>
          </Card>
        ))}
      </div>
    </div>
  )
}
