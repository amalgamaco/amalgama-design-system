import { Tabs, TabsList, TabsTrigger, TabsContent } from "@ds/tabs"

export function TabsShowcase() {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
        <TabsTrigger value="proceso">Proceso</TabsTrigger>
      </TabsList>
      <TabsContent value="general">Contenido de la pestaña General. Aquí se muestra la información básica de la vacante.</TabsContent>
      <TabsContent value="requisitos">Contenido de la pestaña Requisitos. Lista de habilidades y experiencia necesaria.</TabsContent>
      <TabsContent value="proceso">Contenido de la pestaña Proceso. Etapas de selección y timeline.</TabsContent>
    </Tabs>
  )
}
