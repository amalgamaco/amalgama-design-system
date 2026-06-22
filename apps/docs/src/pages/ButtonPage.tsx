import { Button } from '@embassy/ui'
import { ComponentPage, Bullets, Showcase, References, H3, DoDont, A11yList, Code } from '../components/ComponentPage'

const variants = [
  { v: 'primary', label: 'Primary' },
  { v: 'secondary', label: 'Secondary' },
  { v: 'outline', label: 'Outline' },
  { v: 'text', label: 'Text' },
  { v: 'danger', label: 'Danger' },
] as const

export function ButtonPage() {
  return (
    <ComponentPage
      category="Actions"
      title="Button"
      subtitle="Los botones disparan acciones. La jerarquía visual comunica la importancia de cada acción en un contexto."
      overview={
        <section>
          <Bullets items={[
            <>Disparan una acción inmediata; el texto es un verbo claro.</>,
            <><b>Cinco variantes</b> por jerarquía: primary, secondary, outline, text y danger.</>,
            <>El radio escala con el tamaño (sm→<code>radius-sm</code>, md→<code>radius-md</code>, lg→<code>radius-lg</code>).</>,
            <>Una sola acción primary por contexto.</>,
          ]} />
          <Showcase>
            {variants.map((it, i) => (
              <div key={it.v} className="flex flex-col items-center gap-4">
                <Button variant={it.v}>{it.label}</Button>
                <span className="flex size-[22px] items-center justify-center rounded-full border-[1.5px] border-muted-foreground text-[11px] font-semibold text-muted-foreground">{i + 1}</span>
              </div>
            ))}
          </Showcase>
          <References items={[
            <><b>Primary</b> — la acción principal del contexto. Una sola por pantalla.</>,
            <><b>Secondary</b> — acción alternativa de menor énfasis (contenedor tonal).</>,
            <><b>Outline</b> — acción terciaria; contorno sin relleno.</>,
            <><b>Text</b> — acción de baja prominencia, inline.</>,
            <><b>Danger</b> — acción destructiva (eliminar, descartar).</>,
          ]} />
        </section>
      }
      guidelines={
        <section>
          <H3>Cuándo usar / Cuándo no</H3>
          <DoDont
            doItems={[<>Una <b>primary</b> por contexto; el resto, jerarquías menores.</>, <>Verbos concretos ("Guardar", "Enviar").</>, <>Ancho intrínseco, contenido centrado.</>]}
            dontItems={[<>Botón full-width que parece campo de formulario.</>, <>Varias primary del mismo peso.</>, <>Usar un botón para navegar entre páginas → enlace/nav.</>]}
          />
        </section>
      }
      accessibility={
        <A11yList items={[
          <>Usá <code>&lt;button&gt;</code> nativo; operable por teclado con foco visible (anillo <code>--color-focus</code>).</>,
          <>El texto del botón describe la acción — no "Aceptar"/"OK" genéricos.</>,
          <>Estado deshabilitado vía atributo nativo, nunca solo color.</>,
        ]} />
      }
      code={<Code>{`import { Button } from "@embassy/ui"

<Button>Guardar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="outline">Más opciones</Button>
<Button variant="text">Saltar</Button>
<Button variant="danger">Eliminar</Button>

<Button size="sm" /> <Button size="lg" />
<Button disabled>Bloqueado</Button>`}</Code>}
    />
  )
}
