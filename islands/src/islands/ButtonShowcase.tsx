import { Button } from "../components/ui/button"

// Reuses the page's .bd-family-* layout so the Overview diagram is unchanged —
// only the rendered buttons are now the shadcn <Button> component.
const families = [
  { variant: "ghost", label: "Elevado" },
  { variant: "primary", label: "Relleno" },
  { variant: "secondary", label: "Tonal" },
  { variant: "tertiary", label: "Con borde" },
  { variant: "text", label: "Texto" },
] as const

export function ButtonShowcase() {
  return (
    <div className="bd-family-stage">
      {families.map((f, i) => (
        <div className="bd-family-col" key={f.variant}>
          <Button variant={f.variant} className="bd-family-btn">{f.label}</Button>
          <div className="bd-family-num">{i + 1}</div>
        </div>
      ))}
    </div>
  )
}
