import { Badge } from '@embassy/ui'
import { ComponentPage, Bullets, Showcase, References, Bullets as G, A11yList, Code } from '../components/ComponentPage'

export function BadgePage() {
  return (
    <ComponentPage
      category="Display"
      title="Badge"
      subtitle="Indicador compacto y no interactivo que comunica estado, categoría o un conteo asociado a un elemento."
      overview={
        <section>
          <Bullets items={[
            <>Comunica estado o categoría de forma pasiva (no interactivo).</>,
            <>Variantes por estado, mapeadas a los roles container de Embassy.</>,
            <>Para acciones/filtros usá <b>Chip</b>; para conteos en íconos, un badge numérico.</>,
          ]} />
          <Showcase>
            <Badge>Neutral</Badge>
            <Badge variant="success">Activo</Badge>
            <Badge variant="warning">Pendiente</Badge>
            <Badge variant="error">Cerrado</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="outline">Borrador</Badge>
          </Showcase>
          <References items={[
            <><b>success / warning / error / info</b> — roles container de estado.</>,
            <><b>neutral</b> — contenedor secundario; <b>outline</b> — solo contorno.</>,
          ]} />
        </section>
      }
      guidelines={<G items={[<>Estado no interactivo (abierto, activo, cerrado).</>, <>Si es accionable o filtra → <b>Chip</b>.</>, <>Texto breve, una o dos palabras.</>]} />}
      accessibility={<A11yList items={[<>El color no es el único indicador — el texto comunica el estado.</>, <>Contraste AA sobre el contenedor.</>]} />}
      code={<Code>{`import { Badge } from "@embassy/ui"

<Badge>Neutral</Badge>
<Badge variant="success">Activo</Badge>
<Badge variant="error">Cerrado</Badge>
<Badge variant="outline">Borrador</Badge>`}</Code>}
    />
  )
}
