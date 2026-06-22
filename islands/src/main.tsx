import { type ComponentType } from "react"
import { createRoot } from "react-dom/client"
import "./styles.css"
import { ChipShowcase } from "./islands/ChipShowcase"
import { SwitchShowcase } from "./islands/SwitchShowcase"
import { CheckboxShowcase } from "./islands/CheckboxShowcase"
import { RadioGroupShowcase, RadioStatesShowcase } from "./islands/RadioShowcase"

// Map of data-island name → showcase component. Add entries as components migrate.
const registry: Record<string, ComponentType> = {
  "chip-showcase": ChipShowcase,
  "switch-showcase": SwitchShowcase,
  "checkbox-showcase": CheckboxShowcase,
  "radio-group": RadioGroupShowcase,
  "radio-states": RadioStatesShowcase,
}

function mountIslands() {
  document.querySelectorAll<HTMLElement>("[data-island]").forEach((el) => {
    const name = el.dataset.island
    if (!name || el.dataset.mounted) return
    const Comp = registry[name]
    if (!Comp) return
    el.dataset.mounted = "1"
    createRoot(el).render(<Comp />)
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountIslands)
} else {
  mountIslands()
}
