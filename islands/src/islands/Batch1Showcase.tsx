import * as React from "react"
import {
  Item, ItemGroup, ItemSeparator, ItemMedia, ItemContent, ItemTitle,
  ItemDescription, ItemActions,
} from "@ds/item"
import { ButtonGroup, ButtonGroupText, ButtonGroupSeparator } from "@ds/button-group"
import {
  InputGroup, InputGroupInput, InputGroupAddon, InputGroupText,
} from "@ds/input-group"
import { Spinner } from "@ds/spinner"
import {
  AttachmentList, Attachment, AttachmentIcon, AttachmentBody,
  AttachmentName, AttachmentMeta, AttachmentRemove, AttachmentProgress,
} from "@ds/attachment"
import { Button } from "@ds/button"
import { Bell, Settings, Search, FileText, X, ChevronLeft, ChevronRight } from "lucide-react"

export function ItemShowcase() {
  return (
    <ItemGroup className="w-full max-w-md gap-2">
      <Item variant="outline">
        <ItemMedia variant="icon"><Bell /></ItemMedia>
        <ItemContent>
          <ItemTitle>Notificaciones</ItemTitle>
          <ItemDescription>Recibí avisos por email cuando algo cambie.</ItemDescription>
        </ItemContent>
        <ItemActions><Button variant="tertiary" size="sm">Configurar</Button></ItemActions>
      </Item>
      <ItemSeparator />
      <Item variant="muted">
        <ItemMedia variant="icon"><Settings /></ItemMedia>
        <ItemContent>
          <ItemTitle>Preferencias</ItemTitle>
          <ItemDescription>Idioma, zona horaria y formato.</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}

export function ButtonGroupShowcase() {
  return (
    <ButtonGroup>
      <Button variant="tertiary" size="sm">Día</Button>
      <Button variant="tertiary" size="sm">Semana</Button>
      <Button variant="tertiary" size="sm">Mes</Button>
    </ButtonGroup>
  )
}

export function InputGroupShowcase() {
  return (
    <InputGroup style={{ maxWidth: 340 }}>
      <InputGroupAddon><Search /></InputGroupAddon>
      <InputGroupInput placeholder="Buscar…" />
      <InputGroupAddon align="inline-end"><InputGroupText>⌘K</InputGroupText></InputGroupAddon>
    </InputGroup>
  )
}

export function SpinnerBasic() {
  return <Spinner role="status" aria-label="Cargando" />
}

export function SpinnerShowcase() {
  return (
    <div className="flex items-center gap-5 flex-wrap">
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" />
      <Button variant="primary" size="sm">
        <Spinner size="sm" onPrimary /> Guardando…
      </Button>
    </div>
  )
}

export function AttachmentShowcase() {
  return (
    <AttachmentList className="w-full max-w-md">
      <Attachment>
        <AttachmentIcon><FileText /></AttachmentIcon>
        <AttachmentBody>
          <AttachmentName>CV_Ana_Torres.pdf</AttachmentName>
          <AttachmentMeta>240 KB · PDF</AttachmentMeta>
        </AttachmentBody>
        <AttachmentRemove aria-label="Quitar"><X className="size-4" /></AttachmentRemove>
      </Attachment>
      <Attachment>
        <AttachmentIcon><FileText /></AttachmentIcon>
        <AttachmentBody>
          <AttachmentName>Portfolio.zip</AttachmentName>
          <AttachmentMeta>Subiendo… 60%</AttachmentMeta>
          <AttachmentProgress value={60} />
        </AttachmentBody>
      </Attachment>
      <Attachment error>
        <AttachmentIcon><FileText /></AttachmentIcon>
        <AttachmentBody>
          <AttachmentName>demasiado-grande.mov</AttachmentName>
          <AttachmentMeta>Error: supera 25 MB</AttachmentMeta>
        </AttachmentBody>
        <AttachmentRemove aria-label="Quitar"><X className="size-4" /></AttachmentRemove>
      </Attachment>
    </AttachmentList>
  )
}
