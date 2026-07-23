import { Tabs, TabsList, TabsTrigger, TabsContent } from "@ds/tabs"

/**
 * Overview tab static showcase, islandized.
 * Replaces the static .tabs/.tab/.tab-panel markup in the Tabs page Overview
 * with the real Radix-based @ds Tabs component (underline Embassy style).
 */
export function TabsOverviewShowcase() {
  return (
    <Tabs defaultValue="general">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
        <TabsTrigger value="proceso">Proceso</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        Contenido de la pestana General. Aqui se muestra la informacion basica de la vacante.
      </TabsContent>
      <TabsContent value="requisitos">
        Contenido de la pestana Requisitos.
      </TabsContent>
      <TabsContent value="proceso">
        Contenido de la pestana Proceso.
      </TabsContent>
    </Tabs>
  )
}
