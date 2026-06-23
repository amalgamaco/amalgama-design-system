import { type ComponentType } from "react"
import { createRoot } from "react-dom/client"
import "./styles.css"
import { ChipShowcase } from "./islands/ChipShowcase"
import { ButtonShowcase } from "./islands/ButtonShowcase"
import { SnackbarShowcase } from "./islands/SnackbarShowcase"
import { SwitchShowcase } from "./islands/SwitchShowcase"
import { CheckboxShowcase } from "./islands/CheckboxShowcase"
import { RadioGroupShowcase, RadioStatesShowcase } from "./islands/RadioShowcase"
import { DividerShowcase } from "./islands/DividerShowcase"
import { ListShowcase } from "./islands/ListShowcase"
import { ProgressCircularShowcase, ProgressLinearShowcase } from "./islands/ProgressShowcase"
import { MenuShowcase } from "./islands/MenuShowcase"
import { SliderShowcase } from "./islands/SliderShowcase"
import { InputShowcase, TextareaShowcase, SelectShowcase } from "./islands/FormShowcases"
import { TabsShowcase } from "./islands/TabsShowcase"
import { DialogShowcase } from "./islands/DialogShowcase"
import { BadgeShowcase } from "./islands/BadgeShowcase"
import { SkeletonShowcase } from "./islands/SkeletonShowcase"
import { EmptyStateShowcase } from "./islands/EmptyStateShowcase"
import { TableShowcase } from "./islands/TableShowcase"
import { SearchShowcase } from "./islands/SearchShowcase"
import { CardShowcase } from "./islands/CardShowcase"
import { StatCardShowcase } from "./islands/StatCardShowcase"

const registry: Record<string, ComponentType> = {
  "chip-showcase": ChipShowcase,
  "button-showcase": ButtonShowcase,
  "snackbar-showcase": SnackbarShowcase,
  "switch-showcase": SwitchShowcase,
  "checkbox-showcase": CheckboxShowcase,
  "radio-group": RadioGroupShowcase,
  "radio-states": RadioStatesShowcase,
  "divider-showcase": DividerShowcase,
  "list-showcase": ListShowcase,
  "progress-circular": ProgressCircularShowcase,
  "progress-linear": ProgressLinearShowcase,
  "menu-showcase": MenuShowcase,
  "slider-showcase": SliderShowcase,
  "input-showcase": InputShowcase,
  "textarea-showcase": TextareaShowcase,
  "select-showcase": SelectShowcase,
  "tabs-showcase": TabsShowcase,
  "dialog-showcase": DialogShowcase,
  "badge-showcase": BadgeShowcase,
  "skeleton-showcase": SkeletonShowcase,
  "empty-state-showcase": EmptyStateShowcase,
  "table-showcase": TableShowcase,
  "search-showcase": SearchShowcase,
  "card-showcase": CardShowcase,
  "stat-card-showcase": StatCardShowcase,
}

function mountIslands() {
  document.querySelectorAll<HTMLElement>("[data-island]").forEach((el) => {
    const name = el.dataset.island
    if (!name || el.dataset.mounted) return
    const Comp = registry[name]
    if (!Comp) return
    el.dataset.mounted = "1"
    el.style.flex = "1 1 auto"
    createRoot(el).render(<Comp />)
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountIslands)
} else {
  mountIslands()
}
