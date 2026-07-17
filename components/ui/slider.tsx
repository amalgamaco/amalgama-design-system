import * as React from "react"
import { cn } from "../lib/utils"

export interface SliderProps {
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  onValueChange?: (value: number[]) => void
  className?: string
  "aria-label"?: string
}

/** Native <input type="range"> — drag physics + keyboard step come for free.
 *  Range mode (two thumbs) stacks two inputs sharing one visual track. */
export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      value,
      defaultValue = [0],
      min = 0,
      max = 100,
      step = 1,
      disabled,
      onValueChange,
      className,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const isControlled = value !== undefined
    const [internal, setInternal] = React.useState(defaultValue)
    const current = isControlled ? value! : internal
    const isRange = current.length > 1

    const setAt = (index: number, raw: number) => {
      const next = [...current]
      next[index] = raw
      if (isRange) {
        if (index === 0) next[0] = Math.min(next[0], next[1] - step)
        else next[1] = Math.max(next[1], next[0] + step)
      }
      if (!isControlled) setInternal(next)
      onValueChange?.(next)
    }

    const pct = (v: number) => ((v - min) / (max - min)) * 100

    return (
      <div ref={ref} className={cn("slider", className)} data-disabled={disabled || undefined}>
        <div className="slider-track" />
        <div
          className="slider-range"
          style={
            isRange
              ? { left: `${pct(current[0])}%`, right: `${100 - pct(current[1])}%` }
              : { left: 0, width: `${pct(current[0])}%` }
          }
        />
        {current.map((v, i) => (
          <input
            key={i}
            type="range"
            className="slider-input"
            min={min}
            max={max}
            step={step}
            value={v}
            disabled={disabled}
            onChange={(e) => setAt(i, Number(e.target.value))}
            aria-label={ariaLabel ?? (isRange ? `Valor ${i === 0 ? "mínimo" : "máximo"}` : "Valor")}
          />
        ))}
      </div>
    )
  }
)
Slider.displayName = "Slider"
