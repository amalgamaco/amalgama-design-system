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

// Exact docs SVGs so the islandized attachments render identically.
const FileFold = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
)
const FilePlain = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /></svg>
)
const AlertCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12" y2="16" /></svg>
)

// Overview — single attachment.
export function AttachmentBasic() {
  return (
    <AttachmentList style={{ maxWidth: 420, width: "100%" }}>
      <Attachment>
        <AttachmentIcon><FileFold /></AttachmentIcon>
        <AttachmentBody>
          <AttachmentName>CV_Ana_Torres.pdf</AttachmentName>
          <AttachmentMeta>240 KB · PDF</AttachmentMeta>
        </AttachmentBody>
        <AttachmentRemove className="btn-sm" aria-label="Quitar">✕</AttachmentRemove>
      </Attachment>
    </AttachmentList>
  )
}

// Specs — Variantes / estados (upload progress + error).
export function AttachmentShowcase() {
  return (
    <AttachmentList style={{ maxWidth: 420, width: "100%" }}>
      <Attachment>
        <AttachmentIcon><FileFold /></AttachmentIcon>
        <AttachmentBody>
          <AttachmentName>CV_Ana_Torres.pdf</AttachmentName>
          <AttachmentMeta>240 KB · PDF</AttachmentMeta>
        </AttachmentBody>
        <AttachmentRemove className="btn-sm" aria-label="Quitar">✕</AttachmentRemove>
      </Attachment>
      <Attachment>
        <AttachmentIcon><FilePlain /></AttachmentIcon>
        <AttachmentBody>
          <AttachmentName>portfolio.zip</AttachmentName>
          <AttachmentMeta>Subiendo… 60%</AttachmentMeta>
          <AttachmentProgress value={60} />
        </AttachmentBody>
      </Attachment>
      <Attachment error>
        <AttachmentIcon><AlertCircleIcon /></AttachmentIcon>
        <AttachmentBody>
          <AttachmentName>imagen.psd</AttachmentName>
          <AttachmentMeta>Formato no permitido</AttachmentMeta>
        </AttachmentBody>
        <AttachmentRemove className="btn-sm" aria-label="Quitar">✕</AttachmentRemove>
      </Attachment>
    </AttachmentList>
  )
}
