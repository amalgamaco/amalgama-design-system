import {
  Button, Switch, Toaster, toast, Checkbox, RadioGroup, RadioGroupItem, Label,
  Input, Textarea, Badge, Tabs, TabsList, TabsTrigger, TabsContent,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  useTheme,
} from '@embassy/ui'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ font: '700 13px/1 var(--font-body)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-on-surface-variant)', margin: '0 0 16px' }}>{title}</h2>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
    </section>
  )
}
const lbl = { display: 'flex', gap: 10, alignItems: 'center', font: '400 14px var(--font-body)', color: 'var(--color-on-surface)' } as React.CSSProperties

export default function App() {
  const { theme, toggle } = useTheme()
  return (
    <TooltipProvider>
      <div style={{ minHeight: '100vh', background: 'var(--color-surface)', padding: '40px clamp(20px,5vw,64px)' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, maxWidth: 760 }}>
          <div>
            <p style={{ font: '600 11px/1 var(--font-body)', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--color-secondary)', margin: '0 0 8px' }}>Embassy · React + shadcn + Embassy tokens</p>
            <h1 style={{ font: '800 32px/1.1 var(--font-heading)', color: 'var(--color-on-surface)', margin: 0 }}>@embassy/ui — kitchen sink</h1>
          </div>
          <Button variant="outline" size="sm" onClick={toggle}>{theme === 'dark' ? '☀ Light' : '☾ Dark'}</Button>
        </header>

        <div style={{ maxWidth: 760 }}>
          <Section title="Buttons">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="text">Text</Button>
            <Button variant="danger">Danger</Button>
            <Button disabled>Disabled</Button>
          </Section>

          <Section title="Switch / Checkbox / Radio">
            <label style={lbl}><Switch defaultChecked /> Switch</label>
            <label style={lbl}><Checkbox defaultChecked /> Checkbox</label>
            <RadioGroup defaultValue="a" style={{ display: 'flex', gap: 16 }}>
              <label style={lbl}><RadioGroupItem value="a" /> One</label>
              <label style={lbl}><RadioGroupItem value="b" /> Two</label>
            </RadioGroup>
          </Section>

          <Section title="Badges">
            <Badge>Neutral</Badge>
            <Badge variant="success">Activo</Badge>
            <Badge variant="warning">Pendiente</Badge>
            <Badge variant="error">Cerrado</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="outline">Outline</Badge>
          </Section>

          <Section title="Input / Textarea / Select">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 220 }}>
              <Label htmlFor="n">Nombre</Label>
              <Input id="n" placeholder="Ana Borthagaray" />
            </div>
            <div style={{ width: 220 }}>
              <Select defaultValue="ar">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">Argentina</SelectItem>
                  <SelectItem value="uy">Uruguay</SelectItem>
                  <SelectItem value="cl">Chile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea placeholder="Notas…" style={{ width: 220 }} />
          </Section>

          <Section title="Tabs">
            <Tabs defaultValue="general" style={{ width: 360 }}>
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="req">Requisitos</TabsTrigger>
                <TabsTrigger value="proc">Proceso</TabsTrigger>
              </TabsList>
              <TabsContent value="general"><span style={lbl}>Contenido General</span></TabsContent>
              <TabsContent value="req"><span style={lbl}>Contenido Requisitos</span></TabsContent>
              <TabsContent value="proc"><span style={lbl}>Contenido Proceso</span></TabsContent>
            </Tabs>
          </Section>

          <Section title="Dialog / Tooltip / Toast">
            <Dialog>
              <DialogTrigger asChild><Button>Abrir diálogo</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Renombrar vacante</DialogTitle>
                  <DialogDescription>Elegí un nombre claro para identificar la vacante.</DialogDescription>
                </DialogHeader>
                <Input placeholder="Nombre de la vacante" />
                <DialogFooter>
                  <DialogClose asChild><Button variant="text">Cancelar</Button></DialogClose>
                  <DialogClose asChild><Button>Guardar</Button></DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Tooltip>
              <TooltipTrigger asChild><Button variant="outline">Hover me</Button></TooltipTrigger>
              <TooltipContent>Tooltip de Embassy</TooltipContent>
            </Tooltip>
            <Button variant="secondary" onClick={() => toast('Archivo eliminado', { action: { label: 'Deshacer', onClick: () => {} } })}>Show toast</Button>
          </Section>
        </div>

        <Toaster />
      </div>
    </TooltipProvider>
  )
}
