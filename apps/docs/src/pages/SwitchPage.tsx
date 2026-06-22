import { Switch } from '@embassy/ui'
import { ComponentPage, Bullets, Showcase, References, A11yList, Code } from '../components/ComponentPage'

const states = [
  { label: 'Apagado', props: {} },
  { label: 'Encendido', props: { defaultChecked: true } },
  { label: 'Deshab. off', props: { disabled: true } },
  { label: 'Deshab. on', props: { disabled: true, defaultChecked: true } },
] as const

export function SwitchPage() {
  return (
    <ComponentPage
      category="Selección"
      title="Switch"
      subtitle="Alterna un único estado encendido/apagado con efecto inmediato, sin paso de confirmación."
      overview={
        <section>
          <Bullets items={[
            <>Activa o desactiva una opción con <b>efecto inmediato</b>.</>,
            <>Un único estado binario, independiente de otros.</>,
            <>Estados: apagado, encendido, deshabilitado.</>,
          ]} />
          <Showcase>
            {states.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <Switch {...s.props} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </Showcase>
          <References items={[
            <><b>Encendido</b> — pista en <code>--color-primary</code>, thumb a la derecha.</>,
            <><b>Apagado</b> — pista en <code>--color-outline</code>, thumb a la izquierda.</>,
            <><b>Deshabilitado</b> — opacidad reducida, no interactivo.</>,
          ]} />
        </section>
      }
      guidelines={
        <Bullets items={[
          <>Usar para ajustes que se aplican al instante (modo oscuro, notificaciones).</>,
          <>Si el cambio necesita confirmación → <b>Checkbox</b>.</>,
          <>Para elegir entre opciones → <b>Radio</b> o <b>Segmented Button</b>.</>,
        ]} />
      }
      accessibility={
        <A11yList items={[
          <>Asociá una etiqueta (envolver en <code>&lt;label&gt;</code> o <code>aria-label</code>).</>,
          <>Expone <code>role="switch"</code>; operable por teclado (Espacio).</>,
          <>El estado no se comunica solo por color — la posición del thumb lo refuerza.</>,
        ]} />
      }
      code={<Code>{`import { Switch } from "@embassy/ui"

<label className="flex items-center gap-2">
  <Switch /> Notificaciones
</label>
<Switch defaultChecked />
<Switch disabled />`}</Code>}
    />
  )
}
