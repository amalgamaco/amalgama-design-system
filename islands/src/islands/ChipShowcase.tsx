import { useState } from "react"
import { Calendar, Check } from "lucide-react"
import { Chip } from "../components/ui/chip"

// Reuses the page's existing .ch-family-* layout classes so the showcase is
// pixel-identical to the original — only the chip itself is now shadcn.
export function ChipShowcase() {
  const [on, setOn] = useState(true)
  return (
    <div className="ch-family-stage">
      <div className="ch-family-col">
        <Chip icon={<Calendar />}>Assist</Chip>
        <div className="ch-family-num">1</div>
      </div>
      <div className="ch-family-col">
        <Chip selected={on} icon={on ? <Check /> : undefined} onClick={() => setOn(!on)}>Filter</Chip>
        <div className="ch-family-num">2</div>
      </div>
      <div className="ch-family-col">
        <Chip onRemove={() => {}}>Input</Chip>
        <div className="ch-family-num">3</div>
      </div>
      <div className="ch-family-col">
        <Chip>Suggestion</Chip>
        <div className="ch-family-num">4</div>
      </div>
    </div>
  )
}
