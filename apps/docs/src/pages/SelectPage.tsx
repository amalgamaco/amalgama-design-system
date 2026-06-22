import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@embassy/ui'
import { ComponentPage, Bullets, Showcase, References, A11yList, Code } from '../components/ComponentPage'

export function SelectPage() {
  return (
    <ComponentPage
      category="Inputs"
      title="Select"
      subtitle="Permite elegir una opción de una lista en un menú desplegable, mostrando el valor elegido en un campo."
      overview={
        <section>
          <Bullets items={[
            <>Elegí una única opción de una lista predefinida.</>,
            <>El valor elegido se muestra en el campo; el resto se despliega en un menú.</>,
            <>Soporta label, estados de error y deshabilitado; teclado completo (Radix).</>,
          ]} />
          <Showcase>
            <div className="w-60">
              <Select defaultValue="ar">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">Argentina</SelectItem>
                  <SelectItem value="uy">Uruguay</SelectItem>
                  <SelectItem value="cl">Chile</SelectItem>
                  <SelectItem value="mx">México</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Showcase>
          <References items={[
            <><b>Trigger</b> — campo con la misma anatomía que un text field; chevron al final.</>,
            <><b>Menú</b> — opciones sobre <code>popover</code>; la seleccionada lleva check.</>,
          ]} />
        </section>
      }
      guidelines={
        <Bullets items={[
          <>Para listas de longitud media (≈5–15 opciones).</>,
          <>Pocas opciones excluyentes y visibles → <b>Radio</b> / <b>Segmented Button</b>.</>,
          <>Selección múltiple → grupo de <b>Checkbox</b> o filter chips.</>,
        ]} />
      }
      accessibility={
        <A11yList items={[
          <>Expone roles <code>combobox</code>/<code>listbox</code>/<code>option</code> nativos (Radix).</>,
          <>Teclado: Enter/Espacio abre, flechas navegan, Escape cierra; foco visible.</>,
          <>Cada opción requiere un <code>value</code> y texto visible.</>,
        ]} />
      }
      code={<Code>{`import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@embassy/ui"

<Select defaultValue="ar">
  <SelectTrigger><SelectValue /></SelectTrigger>
  <SelectContent>
    <SelectItem value="ar">Argentina</SelectItem>
    <SelectItem value="uy">Uruguay</SelectItem>
  </SelectContent>
</Select>`}</Code>}
    />
  )
}
