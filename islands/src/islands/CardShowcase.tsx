import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"

export function CardShowcase() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, maxWidth: 720 }}>
      <Card style={{ flex: "1 1 300px" }}>
        <CardHeader>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <CardTitle>Diseñadora UX Senior</CardTitle>
            <Badge variant="open">Abierta</Badge>
          </div>
          <CardDescription>Amalgama · Buenos Aires</CardDescription>
        </CardHeader>
        <CardContent>
          Buscamos una Diseñadora UX con experiencia en sistemas de diseño y productos B2B.
        </CardContent>
        <CardFooter>
          <Button variant="primary" size="sm">Ver vacante</Button>
          <Button variant="text" size="sm">Guardar</Button>
        </CardFooter>
      </Card>

      <Card style={{ flex: "1 1 300px" }}>
        <CardHeader>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <CardTitle>Frontend Developer</CardTitle>
            <Badge variant="draft">Borrador</Badge>
          </div>
          <CardDescription>Amalgama · Remoto</CardDescription>
        </CardHeader>
        <CardContent>
          React, TypeScript y Tailwind. Trabajarás en el stack de productos internos de Amalgama.
        </CardContent>
        <CardFooter>
          <Button variant="primary" size="sm">Ver vacante</Button>
          <Button variant="text" size="sm">Guardar</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
