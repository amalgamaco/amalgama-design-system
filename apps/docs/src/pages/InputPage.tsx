import { Input, Textarea, Label } from '@embassy/ui'
import { ComponentPage, Bullets, Showcase, References, Bullets as G, A11yList, Code } from '../components/ComponentPage'

export function InputPage() {
  return (
    <ComponentPage
      category="Inputs"
      title="Text field"
      subtitle="Permite ingresar y editar texto. Combina label, contenido, texto de apoyo y estados de validación."
      overview={
        <section>
          <Bullets items={[
            <>Captura texto libre dentro de un formulario.</>,
            <>Acompañar siempre con un label visible y persistente.</>,
            <>Soporta foco, error (<code>aria-invalid</code>) y multilínea (textarea).</>,
          ]} />
          <Showcase>
            <div className="flex flex-col gap-1.5 w-56">
              <Label htmlFor="n">Nombre</Label>
              <Input id="n" placeholder="Ana Borthagaray" />
            </div>
            <div className="flex flex-col gap-1.5 w-56">
              <Label htmlFor="e">Email (error)</Label>
              <Input id="e" defaultValue="ana@" aria-invalid />
            </div>
            <Textarea placeholder="Notas…" className="w-56" />
          </Showcase>
          <References items={[
            <><b>Input</b> — campo de una línea; borde <code>--color-outline</code>, foco <code>--color-focus</code>.</>,
            <><b>Error</b> — borde y anillo en <code>--color-error</code> vía <code>aria-invalid</code>.</>,
            <><b>Textarea</b> — multilínea para texto extenso.</>,
          ]} />
        </section>
      }
      guidelines={<G items={[<>Label visible, no placeholder como única etiqueta.</>, <>Elegir opciones predefinidas → <b>Select</b>/<b>Radio</b>.</>, <>El error se comunica con texto, no solo color.</>]} />}
      accessibility={<A11yList items={[<>Asociá <code>label</code> con <code>htmlFor</code>/<code>id</code>.</>, <>Error vía <code>aria-invalid</code> + texto descriptivo.</>, <>Foco visible oficial.</>]} />}
      code={<Code>{`import { Input, Textarea, Label } from "@embassy/ui"

<Label htmlFor="n">Nombre</Label>
<Input id="n" placeholder="Ana" />
<Input aria-invalid defaultValue="ana@" />
<Textarea placeholder="Notas…" />`}</Code>}
    />
  )
}
