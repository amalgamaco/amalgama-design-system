import { useState } from "react"
import { Calendar, Check } from "lucide-react"
import { Chip, InputChip } from "../components/ui/chip"

export function ChipShowcase() {
  const [on, setOn] = useState(true)
  return (
    <div className="ch-family-stage">
      <div className="ch-family-col">
        <Chip icon={<Calendar />}>Assist</Chip>
        <div className="ch-family-num">1</div>
      </div>
      <div className="ch-family-col">
        <Chip selected={on} icon={on ? <Check /> : undefined} onClick={() => setOn(v => !v)}>Filter</Chip>
        <div className="ch-family-num">2</div>
      </div>
      <div className="ch-family-col">
        <InputChip onRemove={() => {}}>Input</InputChip>
        <div className="ch-family-num">3</div>
      </div>
      <div className="ch-family-col">
        <Chip>Suggestion</Chip>
        <div className="ch-family-num">4</div>
      </div>
    </div>
  )
}
