import * as React from "react"
import { Chip, InputChip, ChipSet } from "@ds/chip"
import { Button } from "@ds/button"
import { Check, Plane, CalendarPlus, ChevronDown, MapPin, Heart, BookOpen, Lightbulb, Bell, PanelTop, MessageCircle } from "lucide-react"

/* ──────────────────────────────────────────────────────────────
 * Chip — Guidelines contextual scenes.
 *
 * The do/don't usage scenes are rebuilt as lightweight HTML scene
 * chrome with the REAL @ds components embedded (Chip where a chip is
 * the subject, Button where the lesson is "use a button, not a
 * chip"). Replaces the hand-drawn scene SVGs so the depicted
 * controls match the implementation. Theme-aware via tokens.
 * ────────────────────────────────────────────────────────────── */

const NOINT = "pointer-events-none cursor-default select-none"
const card: React.CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  overflow: "hidden",
  width: "100%",
  maxWidth: 280,
}
const title: React.CSSProperties = { font: "700 13px 'Inter',sans-serif", color: "var(--color-on-surface)" }
const meta: React.CSSProperties = { font: "400 11px 'Inter',sans-serif", color: "var(--color-on-surface-variant)" }
const stage: React.CSSProperties = { display: "flex", justifyContent: "center", padding: 20, background: "var(--color-surface-container-lowest)" }

/* Row 2 · Do — restaurant card with assist chips */
export function ChipSceneRestaurant() {
  return (
    <div style={stage}>
      <div style={card}>
        <div style={{ height: 76, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, background: "var(--color-tertiary-container)" }}>🌮</div>
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={title}>Los Cantantes</span>
          <span style={meta}>Restaurante oaxaqueño · $$ · 4.5 ★</span>
          <span style={{ ...meta, marginBottom: 6 }}>Recomendado porque te gustó Fonda</span>
          <ChipSet aria-label="Acciones del restaurante">
            <Chip className={NOINT}>Reservar mesa</Chip>
            <Chip className={NOINT}>Pedir delivery</Chip>
          </ChipSet>
        </div>
      </div>
    </div>
  )
}

/* Row 2 · Don't — dialog whose primary actions are real Buttons (not chips) */
export function ChipSceneDialog() {
  return (
    <div style={{ ...stage, background: "var(--color-surface-container)" }}>
      <div style={{ ...card, maxWidth: 240, padding: 16 }}>
        <div style={{ textAlign: "center", color: "var(--color-link)", fontSize: 15 }}>✦</div>
        <div style={{ textAlign: "center", font: "600 13px 'Inter',sans-serif", color: "var(--color-on-surface)", margin: "4px 0 12px" }}>Nueva lista de deseos</div>
        <div style={{ border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", ...meta, marginBottom: 12 }}>Cumpleaños 2021</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ font: "400 11px 'Inter',sans-serif", color: "var(--color-on-surface)" }}>Compartir en público</span>
          <span style={{ width: 26, height: 14, borderRadius: 7, background: "var(--color-link)", position: "relative" }}><span style={{ position: "absolute", right: 1, top: 1, width: 12, height: 12, borderRadius: "50%", background: "#fff" }} /></span>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button className={NOINT} variant="tertiary" size="sm">Cancelar</Button>
          <Button className={NOINT} variant="primary" size="sm">Guardar</Button>
        </div>
      </div>
    </div>
  )
}

function TaskList() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {["Agendar corte", "Agendar turno de peluquería", "Compras después del trabajo"].map((t, i) => (
        <div key={i} style={{ padding: "7px 0", borderBottom: "1px solid var(--border)", font: "400 11px 'Inter',sans-serif", color: i === 2 ? "var(--color-on-surface)" : "var(--color-on-surface-variant)" }}>{t}</div>
      ))}
    </div>
  )
}

/* Row 3 · Do — final step of a task is a real Button */
export function ChipSceneTaskButton() {
  return (
    <div style={stage}>
      <div style={{ ...card, maxWidth: 220, padding: 14 }}>
        <TaskList />
        <div style={{ marginTop: 14 }}>
          <Button className={NOINT} variant="primary" size="sm" style={{ width: "100%" }}>Guardar tarea</Button>
        </div>
      </div>
    </div>
  )
}

/* Row 3 · Don't — using a chip for the final/committing step */
export function ChipSceneTaskChip() {
  return (
    <div style={stage}>
      <div style={{ ...card, maxWidth: 220, padding: 14 }}>
        <TaskList />
        <div style={{ marginTop: 14 }}>
          <Chip className={NOINT} icon={<Check />}>Guardar tarea</Chip>
        </div>
      </div>
    </div>
  )
}

function MeetingCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={card}>
      <div style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, background: "var(--color-secondary-container)" }}>🥗</div>
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={meta}>Hoy 11:30 – 12:00</span>
        <span style={{ ...title, marginBottom: 8 }}>Reunión para almorzar</span>
        {children}
      </div>
    </div>
  )
}

/* Row 4 · Do — chip set that scrolls horizontally (clipped) */
export function ChipSceneScroll() {
  return (
    <div style={stage}>
      <MeetingCard>
        <div style={{ display: "flex", gap: 8, overflow: "hidden", maskImage: "linear-gradient(to right, #000 80%, transparent)" }}>
          <Chip className={NOINT}>¡En camino!</Chip>
          <Chip className={NOINT}>Llego tarde</Chip>
          <Chip className={NOINT}>Aviso</Chip>
        </div>
      </MeetingCard>
    </div>
  )
}

/* Row 4 · Don't — a single chip shown alone */
export function ChipSceneSingle() {
  return (
    <div style={stage}>
      <MeetingCard>
        <div style={{ display: "flex" }}>
          <Chip className={NOINT}>¡En camino!</Chip>
        </div>
      </MeetingCard>
    </div>
  )
}

/* ── Sombras y elevación ── */

const darkStage: React.CSSProperties = { ...stage, background: "linear-gradient(160deg, #2B3A52, #151B28)" }

/* Hero — elevated assist chips over a complex image background */
export function ChipSceneElevHero() {
  return (
    <div style={darkStage}>
      <div style={{ width: "100%", maxWidth: 320, color: "#fff", display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ font: "600 18px 'Inter',sans-serif" }}>Bariloche</span>
        <span style={{ font: "400 11px 'Inter',sans-serif", color: "#B9C2D1" }}>★ 4.6 · Patagonia, Argentina · 10 h 35 m</span>
        <span style={{ font: "400 11px 'Inter',sans-serif", color: "#D5DAE3", marginBottom: 12 }}>Lagos cristalinos y montañas nevadas — ideal para esquí y fotografía.</span>
        <div style={{ display: "flex", gap: 8, overflow: "hidden", maskImage: "linear-gradient(to right,#000 86%,transparent)" }}>
          <Chip className={NOINT} variant="elevated" icon={<Plane />}>Comprar pasajes</Chip>
          <Chip className={NOINT} variant="elevated" icon={<CalendarPlus />}>Agregar al itinerario</Chip>
          <Chip className={NOINT} variant="elevated">Buscar reseñas</Chip>
        </div>
      </div>
    </div>
  )
}

function ThreeRoles({ variant }: { variant?: "elevated" }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
      <Chip className={NOINT} variant={variant} icon={<CalendarPlus />}>Assist</Chip>
      <Chip className={NOINT} variant={variant}>Filter</Chip>
      <Chip className={NOINT} variant={variant}>Suggestion</Chip>
    </div>
  )
}

/* Do — bordered chips on a regular surface */
export function ChipSceneElevDoBorder() {
  return <div style={stage}><ThreeRoles /></div>
}
/* Do — elevated chips on an image */
export function ChipSceneElevDoImage() {
  return <div style={{ ...stage, background: "linear-gradient(135deg, #6B5A3A, #2E2417)" }}><ThreeRoles variant="elevated" /></div>
}

function FoodThumbs({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...card, maxWidth: 260, padding: 14, background: "var(--color-surface)" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <div style={{ flex: 1, height: 44, borderRadius: 6, background: "var(--color-tertiary-container)" }} />
        <div style={{ flex: 1, height: 44, borderRadius: 6, background: "var(--color-secondary-container)" }} />
      </div>
      {children}
    </div>
  )
}

/* Don't — elevation used directly on the page */
export function ChipSceneElevDontPage() {
  return (
    <div style={stage}>
      <FoodThumbs>
        <ChipSet aria-label="Chips elevados sobre la página">
          <Chip className={NOINT} variant="elevated">Recetas matcha</Chip>
          <Chip className={NOINT} variant="elevated">Latte matcha</Chip>
        </ChipSet>
      </FoodThumbs>
    </div>
  )
}
/* Don't — elevation used to convey the pressed state */
export function ChipSceneElevDontPressed() {
  return (
    <div style={stage}>
      <FoodThumbs>
        <ChipSet aria-label="Elevación como estado presionado">
          <Chip className={NOINT}>Recetas matcha</Chip>
          <Chip className={NOINT} variant="elevated" style={{ boxShadow: "0 4px 12px rgba(0,0,0,.3)" }}>Latte matcha</Chip>
        </ChipSet>
      </FoodThumbs>
    </div>
  )
}

/* ── Texto de etiqueta ── */
function FilterRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...card, maxWidth: 260, padding: 14, background: "var(--color-surface)" }}>
      <div style={{ ...title, marginBottom: 10 }}>Cronología</div>
      <div style={{ display: "flex", gap: 8, overflow: "hidden", maskImage: "linear-gradient(to right,#000 88%,transparent)", marginBottom: 12 }}>{children}</div>
      <div style={{ height: 70, borderRadius: 8, background: "var(--color-surface-variant)" }} />
    </div>
  )
}
/* Do — short labels */
export function ChipSceneLabelShort() {
  return (
    <div style={stage}>
      <FilterRow>
        <Chip className={NOINT} selected icon={<Check />}>Caminando</Chip>
        <Chip className={NOINT}>Precio</Chip>
      </FilterRow>
    </div>
  )
}
/* Don't — label over ~20 chars */
export function ChipSceneLabelLong() {
  return (
    <div style={stage}>
      <FilterRow>
        <Chip className={NOINT} selected icon={<Check />}>Sesión de navegación a pie</Chip>
      </FilterRow>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
 * Assist / Filter usage scenes — phone/app mockups. Lightweight
 * card chrome (photo bands, headers) with REAL chips in context.
 * Dark scenes are wrapped in data-theme="dark" so the real chips
 * recalibrate to dark-mode styling automatically.
 * ────────────────────────────────────────────────────────────── */

function Phone({ children, band, dark, maxWidth = 264 }: { children: React.ReactNode; band?: React.CSSProperties; dark?: boolean; maxWidth?: number }) {
  const inner = (
    <div style={{ ...card, maxWidth, background: "var(--color-surface)" }}>
      {band && <div style={{ height: 64, ...band }} />}
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  )
  return (
    <div style={{ ...stage, ...(dark ? { background: "#23222B" } : null) }} {...(dark ? { "data-theme": "dark" } : {})}>
      {inner}
    </div>
  )
}

function Header({ children }: { children: React.ReactNode }) {
  return <div style={{ font: "600 13px 'Inter',sans-serif", color: "var(--color-on-surface)" }}>{children}</div>
}
function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{children}</div>
}
function FChip({ sel, menu, icon, children }: { sel?: boolean; menu?: boolean; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Chip className={NOINT} selected={sel} icon={sel ? <Check /> : icon}>
      {children}
      {menu && <ChevronDown style={{ width: 16, height: 16, marginLeft: 2 }} />}
    </Chip>
  )
}

/* ASSIST · hero — verb-first assist chips on a place card */
export function ChipSceneAssistHero() {
  return (
    <Phone band={{ background: "linear-gradient(180deg,#9E4F63,#7A3B4D)" }}>
      <Header>Los Cantantes</Header>
      <span style={meta}>Restaurante oaxaqueño · 4.0 ★ · 1.185 reseñas</span>
      <Row>
        <Chip className={NOINT} icon={<CalendarPlus />}>Agregar al itinerario</Chip>
        <Chip className={NOINT} icon={<MapPin />}>A 12 min del hotel</Chip>
      </Row>
    </Phone>
  )
}

/* ASSIST · behavior — supplemental info + contextual actions (dark) */
export function ChipSceneAssistInfo() {
  return (
    <Phone dark>
      <span style={{ font: "400 11px 'Inter',sans-serif", color: "var(--color-on-surface-variant)" }}>en 10 min</span>
      <Header>Sesión con Thea</Header>
      <span style={meta}>Videollamada</span>
      <Row>
        <Chip className={NOINT} icon={<MapPin />}>Ubicación del evento</Chip>
        <Chip className={NOINT} icon={<MessageCircle />}>Chat</Chip>
      </Row>
    </Phone>
  )
}

/* ASSIST · behavior — chip transforms into a modal (dark) */
export function ChipSceneAssistModal() {
  return (
    <Phone dark maxWidth={240}>
      <Row>
        <Chip className={NOINT} selected>Distancia</Chip>
      </Row>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
        {["17:30", "18:00", "18:30", "19:00"].map((t) => (
          <span key={t} style={{ font: "400 12px 'Inter',sans-serif", color: "var(--color-on-surface)" }}>○ {t}</span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, justifyContent: "flex-end", marginTop: 4 }}>
        <span style={{ font: "500 12px 'Inter',sans-serif", color: "var(--color-primary)" }}>Borrar</span>
        <span style={{ font: "500 12px 'Inter',sans-serif", color: "var(--color-primary)" }}>Listo</span>
      </div>
    </Phone>
  )
}

/* ASSIST · actions A — share + read */
export function ChipSceneAssistActionsA() {
  return (
    <Phone band={{ background: "linear-gradient(90deg,#9E4F63,#B86A56)" }}>
      <span style={meta}>4.0 ★ · 1.185 reseñas</span>
      <Header>Estos son los mejores tacos de la zona</Header>
      <Row>
        <Chip className={NOINT} icon={<span style={{ display: "inline-flex", width: 18, height: 18, borderRadius: "50%", background: "var(--color-secondary-container)", color: "var(--color-on-secondary-container)", alignItems: "center", justifyContent: "center", font: "700 8px 'Inter',sans-serif" }}>AV</span>}>Compartir con Ana</Chip>
        <Chip className={NOINT} icon={<BookOpen />}>Leer reseñas</Chip>
      </Row>
    </Phone>
  )
}

/* ASSIST · actions B — save + schedule */
export function ChipSceneAssistActionsB() {
  return (
    <Phone band={{ background: "linear-gradient(90deg,#9E4F63,#B86A56)" }}>
      <span style={meta}>$ · Mexicano, Tacos</span>
      <Header>Tapas, tacos y quesadillas</Header>
      <Row>
        <Chip className={NOINT} icon={<Heart />}>Guardar en favoritos</Chip>
        <Chip className={NOINT} icon={<CalendarPlus />}>Agendar</Chip>
      </Row>
    </Phone>
  )
}

/* ASSIST · placement — persistent assist chips below content */
export function ChipSceneAssistPlacement() {
  return (
    <Phone band={{ background: "linear-gradient(90deg,#5B6B4A,#7A6A4F)" }} maxWidth={340}>
      <Header>Bienvenido a casa</Header>
      <span style={meta}>Lunes, 12:30 p. m. · Mayormente soleado · 27°</span>
      <div style={{ display: "flex", gap: 8, overflow: "hidden", maskImage: "linear-gradient(to right,#000 88%,transparent)" }}>
        <Chip className={NOINT} icon={<Lightbulb />}>Encender luces</Chip>
        <Chip className={NOINT} icon={<Bell />}>Activar alarma</Chip>
        <Chip className={NOINT} icon={<PanelTop />}>Cerrar persianas</Chip>
      </div>
    </Phone>
  )
}

/* FILTER · hero — search + filter chips + result */
function SearchField({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--border)", borderRadius: 10, padding: "8px 12px", marginBottom: 4 }}>
      <span style={{ width: 12, height: 12, borderRadius: "50%", border: "1.5px solid var(--color-on-surface-variant)", display: "inline-block" }} />
      <span style={{ flex: 1, ...meta }}>{children}</span>
    </div>
  )
}
export function ChipSceneFilterHero() {
  return (
    <Phone maxWidth={340}>
      <SearchField>Adopción del design system</SearchField>
      <div style={{ display: "flex", gap: 8, overflow: "hidden", maskImage: "linear-gradient(to right,#000 90%,transparent)" }}>
        <FChip>Docs</FChip><FChip sel>Diapositivas</FChip><FChip sel>Planillas</FChip><FChip>Imágenes</FChip>
      </div>
      <span style={{ ...meta, marginTop: 4 }}>Cerca de 302 resultados</span>
    </Phone>
  )
}

/* FILTER · examples — shopping */
export function ChipSceneFilterShopping() {
  return (
    <Phone>
      <Header>Electrónica</Header>
      <span style={meta}>Categorías populares:</span>
      <Row><FChip>Cámaras</FChip><FChip sel>Consolas</FChip></Row>
      <Row><FChip>Laptops</FChip><FChip>Teléfonos</FChip><FChip>Tablets</FChip></Row>
    </Phone>
  )
}

/* FILTER · examples — real estate */
export function ChipSceneFilterRealEstate() {
  return (
    <Phone>
      <Header>Comodidades</Header>
      <Row><FChip>Lavadero</FChip><FChip sel>Ascensor</FChip><FChip>Rampa</FChip></Row>
      <Row><FChip sel>Acepta gatos</FChip><FChip>Acepta perros</FChip></Row>
      <Header>Barrios</Header>
      <Row><FChip sel>Palermo</FChip><FChip sel>Belgrano</FChip></Row>
    </Phone>
  )
}

/* FILTER · multi-select — selected indicator */
export function ChipSceneFilterMultiSelected() {
  return (
    <Phone maxWidth={240}>
      <Header>Comodidades</Header>
      <Row><FChip sel>Lavarropas</FChip><FChip>Mascotas</FChip></Row>
      <Header>Barrios</Header>
      <Row><FChip sel>Palermo</FChip><FChip sel>Belgrano</FChip></Row>
    </Phone>
  )
}

/* FILTER · multi-select — dynamic suggestions */
export function ChipSceneFilterMultiDynamic() {
  return (
    <Phone maxWidth={240}>
      <Header>Comodidades</Header>
      <Row><FChip sel>Lavarropas</FChip><FChip sel>Mascotas</FChip></Row>
      <Row><FChip sel>Acepta gatos</FChip><FChip>Acepta perros</FChip></Row>
      <Header>Barrios</Header>
      <Row><FChip sel>Palermo</FChip><FChip sel>Belgrano</FChip></Row>
    </Phone>
  )
}

/* FILTER · single-select — radio-like + commit button */
export function ChipSceneFilterSingle() {
  return (
    <Phone maxWidth={340}>
      <Header>Elegir tipo</Header>
      <Row><FChip sel>Extra suave</FChip><FChip>Suave</FChip><FChip>Medio</FChip><FChip>Firme</FChip></Row>
      <div style={{ marginTop: 4 }}><Button className={NOINT} variant="primary" size="sm">Agregar al carrito</Button></div>
    </Phone>
  )
}

/* FILTER · trailing — close removes the filter */
export function ChipSceneFilterTrailingClose() {
  return (
    <div style={stage}>
      <InputChip className={NOINT} onRemove={() => {}} removeLabel="Eliminar filtro">Filtro</InputChip>
    </div>
  )
}
/* FILTER · trailing — chevron opens a menu */
export function ChipSceneFilterTrailingMenu() {
  return (
    <div style={stage}>
      <FChip menu>Filtro</FChip>
    </div>
  )
}

/* FILTER · accessibility — chip + menu over a map */
export function ChipSceneFilterCaution() {
  return (
    <Phone band={{ background: "var(--color-surface-variant)" }} maxWidth={340}>
      <Header>Selector de rutas</Header>
      <Row><FChip menu>Tiempo</FChip><FChip sel menu>Caminata</FChip><FChip>Pendiente</FChip></Row>
    </Phone>
  )
}

/* FILTER · integration — filter chips below a search field */
export function ChipSceneFilterIntegration() {
  return (
    <Phone maxWidth={340}>
      <SearchField>Buscar rutas</SearchField>
      <Row><FChip sel>Caminata</FChip><FChip>En bici</FChip><FChip menu>Dificultad</FChip></Row>
    </Phone>
  )
}

/* ── Ícono final · área táctil ── */
export function ChipSceneTrailingTouch() {
  const zone: React.CSSProperties = { position: "absolute", inset: "50% auto auto 50%", transform: "translate(-50%,-50%)", width: 48, height: 48, border: "1px dashed #C4277A", borderRadius: 10, pointerEvents: "none" }
  return (
    <div style={{ ...stage, gap: 40, flexWrap: "wrap" }}>
      <div style={{ position: "relative", display: "inline-flex" }}>
        <InputChip className={NOINT} onRemove={() => {}} removeLabel="Eliminar">Editar</InputChip>
        {/* dashed 48×48 touch zone over the remove icon */}
        <span aria-hidden="true" style={{ ...zone, left: "auto", right: -8 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <InputChip className={NOINT} onRemove={() => {}} removeLabel="Eliminar" style={{ minWidth: 88, justifyContent: "space-between" }}>Editar</InputChip>
        <span style={{ font: "700 10px 'Inter',sans-serif", color: "#C4277A" }}>88dp ancho mínimo</span>
      </div>
    </div>
  )
}
