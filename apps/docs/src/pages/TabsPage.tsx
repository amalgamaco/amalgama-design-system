import { Tabs, TabsList, TabsTrigger, TabsContent } from '@embassy/ui'
import { ComponentPage, Bullets, Showcase, References, Bullets as G, A11yList, Code } from '../components/ComponentPage'

export function TabsPage() {
  return (
    <ComponentPage
      category="Navigation"
      title="Tabs"
      subtitle="Organizan contenido en grupos paralelos dentro de una misma vista y permiten alternar entre ellos sin cambiar de pantalla."
      overview={
        <section>
          <Bullets items={[
            <>Alternan vistas paralelas del mismo nivel jerárquico.</>,
            <>La pestaña activa se marca con un indicador inferior.</>,
            <>Cantidad fija y visible — no para navegación entre páginas (eso es del sidebar).</>,
          ]} />
          <Showcase>
            <Tabs defaultValue="general" className="w-[360px]">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="req">Requisitos</TabsTrigger>
                <TabsTrigger value="proc">Proceso</TabsTrigger>
              </TabsList>
              <TabsContent value="general"><span className="text-sm text-muted-foreground">Información básica de la vacante.</span></TabsContent>
              <TabsContent value="req"><span className="text-sm text-muted-foreground">Requisitos del puesto.</span></TabsContent>
              <TabsContent value="proc"><span className="text-sm text-muted-foreground">Etapas del proceso.</span></TabsContent>
            </Tabs>
          </Showcase>
          <References items={[
            <><b>Tab activa</b> — texto <code>--color-primary</code> + borde inferior de 2px.</>,
            <><b>Tabs inactivas</b> — <code>--color-on-surface-variant</code>, hover a on-surface.</>,
          ]} />
        </section>
      }
      guidelines={<G items={[<>Contenido paralelo del mismo nivel.</>, <>Navegación entre páginas → <b>sidebar</b>/<b>Nav Bar</b>.</>, <>Dos estados cortos → <b>Segmented Button</b>.</>]} />}
      accessibility={<A11yList items={[<>Expone <code>tablist</code>/<code>tab</code>/<code>tabpanel</code> (Radix); flechas navegan.</>, <>La pestaña activa no se comunica solo por color (indicador inferior).</>]} />}
      code={<Code>{`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@embassy/ui"

<Tabs defaultValue="general">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="req">Requisitos</TabsTrigger>
  </TabsList>
  <TabsContent value="general">…</TabsContent>
</Tabs>`}</Code>}
    />
  )
}
