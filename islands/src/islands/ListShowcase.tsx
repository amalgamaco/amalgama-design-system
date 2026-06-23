import { List, ListItem } from "../components/ui/list"
import { Separator } from "../components/ui/separator"

export function ListShowcase() {
  return (
    <List style={{ maxWidth: 380, border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      <ListItem headline="Bandeja de entrada" supporting="128 mensajes sin leer" />
      <Separator />
      <ListItem headline="Destacados" supporting="12 mensajes" />
      <Separator />
      <ListItem headline="Enviados" asButton />
    </List>
  )
}
