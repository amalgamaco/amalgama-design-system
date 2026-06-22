import { DocPage, H3, Code } from '../components/ComponentPage'

const scale = [
  { name: 'Display', size: 'var(--font-size-display, 36px)', font: 'var(--font-heading)', weight: 800, sample: 'Embassy Design System' },
  { name: 'Heading', size: 'var(--font-size-heading-lg, 24px)', font: 'var(--font-heading)', weight: 700, sample: 'Sección de componentes' },
  { name: 'Body large', size: 'var(--font-size-body-lg, 16px)', font: 'var(--font-body)', weight: 400, sample: 'Texto de cuerpo para lectura cómoda en interfaces.' },
  { name: 'Body medium', size: 'var(--font-size-body-md, 14px)', font: 'var(--font-body)', weight: 400, sample: 'Texto de UI estándar en formularios y tablas.' },
  { name: 'Label', size: 'var(--font-size-label, 12px)', font: 'var(--font-body)', weight: 600, sample: 'ETIQUETA DE CONTROL' },
  { name: 'Mono', size: 'var(--font-size-body-md, 14px)', font: 'var(--font-mono)', weight: 500, sample: '--color-primary' },
]

export function TypographyPage() {
  return (
    <DocPage
      category="Foundations"
      title="Typography"
      subtitle="Tres familias: Epilogue para títulos, Inter para UI y cuerpo, DM Mono para código y tokens. Todo tamaño pasa por un token --font-size-*."
    >
      <H3>Escala</H3>
      <div className="flex flex-col divide-y divide-border border border-border rounded-[12px] overflow-hidden">
        {scale.map((s) => (
          <div key={s.name} className="flex items-baseline gap-6 px-5 py-5">
            <div className="w-28 shrink-0 text-xs uppercase tracking-wide text-muted-foreground">{s.name}</div>
            <div style={{ fontFamily: s.font, fontSize: s.size, fontWeight: s.weight, color: 'var(--color-on-surface)', lineHeight: 1.2 }}>
              {s.sample}
            </div>
          </div>
        ))}
      </div>
      <H3>Familias</H3>
      <ul className="my-0 mb-8 pl-5 text-sm leading-loose text-muted-foreground list-disc [&_b]:text-foreground">
        <li><b>Epilogue</b> — <code>var(--font-heading)</code> · títulos y display.</li>
        <li><b>Inter</b> — <code>var(--font-body)</code> · UI, cuerpo, labels.</li>
        <li><b>DM Mono</b> — <code>var(--font-mono)</code> · código, tokens.</li>
      </ul>
      <Code>{`font-family: var(--font-heading); /* Epilogue */
font-family: var(--font-body);    /* Inter */
font-family: var(--font-mono);    /* DM Mono */
font-size:   var(--font-size-body-md);`}</Code>
    </DocPage>
  )
}
