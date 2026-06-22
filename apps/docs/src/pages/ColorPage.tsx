import { DocPage, Swatch, H3 } from '../components/ComponentPage'

const groups: { title: string; desc: string; tokens: { token: string; name: string }[] }[] = [
  {
    title: 'Primary / Secondary',
    desc: 'Roles de marca. La acción principal usa Primary; Secondary aporta una alternativa de menor énfasis.',
    tokens: [
      { token: '--color-primary', name: 'Primary' },
      { token: '--color-on-primary', name: 'On primary' },
      { token: '--color-secondary-container', name: 'Secondary container' },
      { token: '--color-on-secondary-container', name: 'On secondary container' },
    ],
  },
  {
    title: 'Surfaces',
    desc: 'Superficies del esquema, de la más recesada a la más elevada. Se recalibran solas en dark.',
    tokens: [
      { token: '--color-surface', name: 'Surface' },
      { token: '--color-surface-container-low', name: 'Container low' },
      { token: '--color-surface-container', name: 'Container' },
      { token: '--color-surface-container-high', name: 'Container high' },
      { token: '--color-surface-variant', name: 'Surface variant' },
      { token: '--color-on-surface', name: 'On surface' },
    ],
  },
  {
    title: 'Status',
    desc: 'Colores de estado (contenedores suaves para badges, fuertes para acciones).',
    tokens: [
      { token: '--color-success-container', name: 'Success' },
      { token: '--color-warning-container', name: 'Warning' },
      { token: '--color-error', name: 'Error' },
      { token: '--color-info-container', name: 'Info' },
    ],
  },
  {
    title: 'Inverse (Snackbar / Tooltip)',
    desc: 'Superficie inversa: siempre contrasta con el fondo, independientemente del tema.',
    tokens: [
      { token: '--color-inverse-surface', name: 'Inverse surface' },
      { token: '--color-inverse-on-surface', name: 'Inverse on surface' },
      { token: '--color-inverse-primary', name: 'Inverse primary' },
    ],
  },
]

export function ColorPage() {
  return (
    <DocPage
      category="Foundations"
      title="Color"
      subtitle="El sistema de color de Embassy es semántico: los componentes consumen roles (--color-*), no valores. Los roles se recalibran automáticamente en dark mode — cambiá el tema y mirá estos swatches."
    >
      {groups.map((g) => (
        <section key={g.title} className="mb-10">
          <H3>{g.title}</H3>
          <p className="text-sm text-muted-foreground mb-5 max-w-[60ch]">{g.desc}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {g.tokens.map((t) => <Swatch key={t.token} token={t.token} name={t.name} />)}
          </div>
        </section>
      ))}
    </DocPage>
  )
}
