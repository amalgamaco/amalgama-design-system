import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@ds/card"
import { Button } from "@ds/button"

// The three MD3 card variants rendered as real <Card variant> — one per Specs section.
function VariantDemo({ variant }: { variant: "elevated" | "filled" | "outlined" }) {
  return (
    <div className="flex justify-center py-2">
      <Card variant={variant} className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Título de la card</CardTitle>
          <CardDescription>Texto de apoyo que describe el contenido agrupado.</CardDescription>
        </CardHeader>
        <CardContent>Contenido de la card sobre la superficie del contenedor.</CardContent>
        <CardFooter>
          <Button variant="text" size="sm">Acción</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export function CardElevated() { return <VariantDemo variant="elevated" /> }
export function CardFilled() { return <VariantDemo variant="filled" /> }
export function CardOutlined() { return <VariantDemo variant="outlined" /> }
