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
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <Button variant="tertiary" size="sm"><ChevronLeft className="size-4" /> Anterior</Button>
        <Button variant="tertiary" size="sm">Siguiente <ChevronRight className="size-4" /></Button>
      </ButtonGroup>
      <ButtonGroup>
        <ButtonGroupText>https://</ButtonGroupText>
        <Button variant="tertiary" size="sm">tu-sitio.com</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="tertiary" size="sm">Uno</Button>
        <ButtonGroupSeparator />
        <Button variant="tertiary" size="sm">Dos</Button>
      </ButtonGroup>
    </div>
  )
}

export function InputGroupShowcase() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <InputGroup>
        <InputGroupAddon><Search /></InputGroupAddon>
        <InputGroupInput placeholder="Buscar…" />
        <InputGroupAddon align="inline-end"><InputGroupText>⌘K</InputGroupText></InputGroupAddon>
      </InputGroup>
      <InputGroup aria-invalid>
        <InputGroupAddon><Search /></InputGroupAddon>
        <InputGroupInput placeholder="Estado de error" defaultValue="valor inválido" />
      </InputGroup>
    </div>
  )
}

export function SpinnerShowcase() {
  return (
    <div className="flex items-center gap-6">
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" />
      <Button variant="primary" size="sm" disabled>
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
