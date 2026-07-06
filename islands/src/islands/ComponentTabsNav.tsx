import * as React from "react"
import { Tabs, TabsList, TabsTrigger } from "@ds/tabs"

/**
 * Canonical tab switcher for every Component page's Overview / Specs /
 * Guidelines / Accessibility / Code pattern.
 *
 * Replaces the legacy `.ds-comp-tabs` / `.ds-comp-tab-btn` / `switchCompTab()`
 * vanilla-JS system so every page shares one real @ds/tabs instance — same
 * selected state, hover/focus/pressed, sliding indicator, Expressive motion,
 * and tokens everywhere, instead of 39 independent hand-styled copies.
 *
 * The panels this controls stay as plain static HTML (`.ds-comp-tab-panel`,
 * authored directly in index.html) — porting that much content into React
 * across every page is a separate, much larger effort with no bearing on the
 * actual ask here (visual/motion consistency of the switcher). This component
 * discovers its sibling panels at runtime and toggles the same `.active`
 * class switchCompTab() used to, so it's a drop-in replacement.
 */
const LABELS: Record<string, string> = {
  overview: "Overview",
  specs: "Specs",
  guidelines: "Guidelines",
  accessibility: "Accessibility",
  code: "Code",
}

export function ComponentTabsNav() {
  const anchorRef = React.useRef<HTMLDivElement | null>(null)
  const [tabIds, setTabIds] = React.useState<string[]>([])
  const [initialValue, setInitialValue] = React.useState<string>("")

  React.useLayoutEffect(() => {
    const section = anchorRef.current?.closest(".ds-section")
    if (!section) return
    const panels = Array.from(section.querySelectorAll<HTMLElement>(".ds-comp-tab-panel"))
    const ids = panels.map((p) => p.dataset.tab || "").filter(Boolean)
    setTabIds(ids)
    const activePanel = panels.find((p) => p.classList.contains("active"))
    setInitialValue(activePanel?.dataset.tab || ids[0] || "")
  }, [])

  // Uncontrolled Tabs — Radix owns the selected state internally (matches every
  // other @ds/tabs usage in the library) — we just listen for changes to sync
  // the legacy static panels via the same class toggle switchCompTab() used.
  const handleChange = (value: string) => {
    if (!value) return
    const section = anchorRef.current?.closest(".ds-section")
    if (!section) return
    section.querySelectorAll<HTMLElement>(".ds-comp-tab-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.tab === value)
    })
  }

  if (!tabIds.length) return <div ref={anchorRef} />

  return (
    <Tabs ref={anchorRef} defaultValue={initialValue} onValueChange={handleChange}>
      <TabsList>
        {tabIds.map((id) => (
          <TabsTrigger key={id} value={id}>
            {LABELS[id] ?? id}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
