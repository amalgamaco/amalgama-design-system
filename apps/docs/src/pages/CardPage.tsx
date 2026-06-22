import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from '@embassy/ui'
import { ComponentPage, Bullets, Showcase, References, Bullets as G, A11yList, Code } from '../components/ComponentPage'

export function CardPage() {
  return (
    <ComponentPage
      category="Display"
      title="Card"
      subtitle="Contenedor de superficie que agrupa información y acciones relacionadas sobre un único elemento."
      overview={
        <section>
          <Bullets items={[
            <>Agrupa contenido relacionado sobre una superficie elevada.</>,
            <>Anatomía: header (título + descripción), content y footer de acciones.</>,
            <>Usa <code>--color-surface-container</code> + borde sutil; recalibra en dark.</>,
          ]} />
          <Showcase>
            <Card className="w-80">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Desarrollador/a Frontend</CardTitle>
                  <Badge variant="success">Activa</Badge>
                </div>
                <CardDescription>Equipo de Producto · Remoto</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">12 postulaciones · publicada hace 3 días.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Ver vacante</Button>
                <Button size="sm" variant="text">Compartir</Button>
              </CardFooter>
            </Card>
          </Showcase>
          <References items={[
            <><b>Header</b> — título + descripción (y aquí, un Badge de estado).</>,
            <><b>Content</b> — el cuerpo del card.</>,
            <><b>Footer</b> — acciones, con jerarquía (una primary).</>,
          ]} />
        </section>
      }
      guidelines={<G items={[<>Agrupar info de un mismo objeto (vacante, persona).</>, <>Una acción primary por card.</>, <>Para métricas sueltas → <b>Stat Card</b>.</>]} />}
      accessibility={<A11yList items={[<>El card es un contenedor; los controles internos mantienen su propia semántica.</>, <>Si todo el card es clicable, exponé un enlace/acción accesible.</>]} />}
      code={<Code>{`import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button } from "@embassy/ui"

<Card>
  <CardHeader><CardTitle>Título</CardTitle></CardHeader>
  <CardContent>…</CardContent>
  <CardFooter><Button size="sm">Acción</Button></CardFooter>
</Card>`}</Code>}
    />
  )
}
