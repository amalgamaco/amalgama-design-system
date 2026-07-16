import * as React from "react"
import { Toggle } from "@ds/toggle"
import { Label } from "@ds/label"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@ds/accordion"
import { Alert, AlertTitle, AlertDescription } from "@ds/alert"
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from "@ds/breadcrumb"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@ds/collapsible"
import { ScrollArea } from "@ds/scroll-area"
import { AspectRatio } from "@ds/aspect-ratio"
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis,
} from "@ds/pagination"
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
} from "@ds/alert-dialog"
import { Checkbox } from "@ds/checkbox"
import { Button } from "@ds/button"
import { Bold, Italic, Info, ChevronsUpDown } from "lucide-react"

/* ── Toggle ── */
export function ToggleShowcase() {
  return (
    <div className="flex items-center gap-3">
      <Toggle aria-label="Negrita"><Bold /></Toggle>
      <Toggle aria-label="Itálica" defaultPressed><Italic /></Toggle>
      <Toggle variant="outline" aria-label="Negrita con borde"><Bold /> Negrita</Toggle>
    </div>
  )
}

/* ── Label ── */
export function LabelShowcase() {
  const id = React.useId()
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} defaultChecked />
      <Label htmlFor={id}>Recibir notificaciones por email</Label>
    </div>
  )
}

/* ── Accordion ── */
export function AccordionShowcase() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="a">
        <AccordionTrigger>¿Cómo aplico el Design System?</AccordionTrigger>
        <AccordionContent>Importá el theme <code>@amalgama/ds/tailwind.theme.css</code> y copiá el componente que necesites — resuelve solo a tokens Embassy.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>¿Funciona en dark mode?</AccordionTrigger>
        <AccordionContent>Sí. Poné <code>data-theme="dark"</code> en el <code>&lt;html&gt;</code> — la capa semántica de color se recalibra sola, sin overrides por componente.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>¿Necesito Radix?</AccordionTrigger>
        <AccordionContent>Los componentes interactivos envuelven primitivas de Radix, igual que shadcn/ui.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

/* ── Alert ── */
export function AlertShowcase() {
  return (
    <div className="flex flex-col gap-3 w-full max-w-lg">
      <Alert>
        <Info />
        <AlertTitle>Actualización disponible</AlertTitle>
        <AlertDescription>Hay una nueva versión del Design System. Revisá el changelog antes de actualizar.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <Info />
        <AlertTitle>Cambios guardados</AlertTitle>
        <AlertDescription>La vacante se publicó correctamente.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <Info />
        <AlertTitle>Revisá los campos</AlertTitle>
        <AlertDescription>Faltan datos obligatorios en el formulario.</AlertDescription>
      </Alert>
      <Alert variant="error">
        <Info />
        <AlertTitle>No se pudo guardar</AlertTitle>
        <AlertDescription>Verificá tu conexión e intentá de nuevo.</AlertDescription>
      </Alert>
    </div>
  )
}

/* ── Breadcrumb ── */
export function BreadcrumbShowcase() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink href="#">Inicio</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink href="#">Vacantes</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>Diseñador/a UX</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

/* ── Collapsible ── */
export function CollapsibleShowcase() {
  const [open, setOpen] = React.useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-md">
      <div className="flex items-center justify-between rounded-md border border-border px-4 py-2.5">
        <span className="text-body-md font-medium text-fg">3 requisitos del puesto</span>
        <CollapsibleTrigger asChild>
          <Button variant="icon" aria-label="Mostrar/ocultar"><ChevronsUpDown /></Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="flex flex-col gap-2 px-4 pt-2 text-body-sm text-on-surface-variant">
          <div>· 5+ años de experiencia en producto</div>
          <div>· Portfolio con casos end-to-end</div>
          <div>· Inglés avanzado</div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

/* ── Scroll Area ── */
export function ScrollAreaShowcase() {
  return (
    <ScrollArea className="h-40 w-64 rounded-md border border-border">
      <div className="flex flex-col p-3">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="py-1.5 text-body-sm text-on-surface border-b border-border last:border-0">
            Candidato #{i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

/* ── Aspect Ratio ── */
export function AspectRatioShowcase() {
  return (
    <div className="w-72">
      <AspectRatio ratio={16 / 9}>
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-secondary-container text-on-secondary-container text-body-md font-medium">
          16 : 9
        </div>
      </AspectRatio>
    </div>
  )
}

/* ── Pagination ── */
export function PaginationShowcase() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
        <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
        <PaginationItem><PaginationEllipsis /></PaginationItem>
        <PaginationItem><PaginationNext href="#" /></PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

/* ── Alert Dialog ── */
export function AlertDialogShowcase() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="danger">Eliminar vacante</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar esta vacante?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminarán también las postulaciones asociadas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="danger">Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
