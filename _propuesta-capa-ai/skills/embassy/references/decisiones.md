# Tablas de decisión — los componentes que más se eligen mal

Se lee **bajo demanda**, cuando el componente que estás por usar aparece acá. Confirmá siempre
contra `not_to_confuse_with` de `component-rules/<id>.md`; esto es el atajo, no la fuente.

---

## Botones — jerarquía, tamaños, modificadores

Escala de énfasis: **primary → elevated → secondary → tertiary → text → icon**.
**Un solo `btn-primary` por contexto.** El disparador de un overlay es `btn-secondary` (la acción
primaria real vive adentro del overlay).

| Rol MD3 | Clase | Para qué |
|---|---|---|
| Filled | `.btn-primary` | la acción más importante del contexto |
| Elevated (tonal + sombra) | `.btn-elevated` | acción primary-container que tiene que despegar de un fondo cargado u oscuro |
| Tonal neutro | `.btn-secondary` | alternativas de igual peso; disparador de overlay que va solo |
| Outlined | `.btn-tertiary` | menor énfasis / alternativa (Cancelar) |
| Text | `.btn-text` | mínimo énfasis, inline en contenido denso |
| Link | `.btn-link` | link de acción inline (subrayado, sin bloque de fondo) |
| Solo ícono | `.icon-btn` | acción compacta — **requiere `aria-label`** |

**Regla de adyacencia.** El botón que está al lado del primario no puede competir con él. Una acción
secundaria de *menor* prioridad —sobre todo navegación secundaria: "Carpetas", "Ver todo",
"Configuración"— va **`.btn-tertiary` (outline)**, no `.btn-secondary` (tonal). El tonal llena un
bloque `--color-secondary-container` que pesa casi como el primario; al lado del filled crea dos
énfasis y el ojo no encuentra la acción. Reservá el tonal para alternativas genuinamente
equivalentes o para un disparador de overlay que está solo.

Tamaños (el radio escala con el **tamaño**, nunca con la variante): `.btn-xs` 24px `--radius-sm` ·
`.btn-sm` 32px `--radius-sm` · default 36px `--radius-md` · `.btn-lg` 44px `--radius-md` (primaria
en mobile) · `.btn-xl` 52px `--radius-lg` (solo hero).
Modificadores: `.btn-danger`, `.btn-success`, `.btn-compact`. Alias de compatibilidad:
`.btn-ghost` = tertiary, `.btn-next` = primary.

Prohibido: full-width, contenido alineado a la izquierda, radio píldora.

---

## Búsqueda — tres usos, nunca un input genérico

Se decide por **sobre qué actúa la búsqueda**, no por qué tan prominente se ve.

| Uso | Clase | Fondo | Radio | Tamaño |
|---|---|---|---|---|
| Filtra una lista/tabla/colección de escritorio que está en esta pantalla | `.search-field` (`toolbar.css`) | `--color-surface` (blanco, nunca gris) | `--radius-md` | compacto · ícono 18px · `flex:1` en el toolbar |
| Global / hero / landing / tipo comando · **o cualquier búsqueda en mobile** | `.search-bar` (`search.css`) | `--color-surface-container-high` (gris, nunca surface) | `--radius-full` | 56px · ícono 24px · 360–720px |
| Barra + acciones de ícono al lado | `.search-row` › `.search-bar` + `.search-icon-btn` | igual que Search Bar | igual | barra 40px · botón 40×40 · ícono 20px |

`.search-field` y `.search-bar` son **hermanos**, no uno el legacy del otro. Una búsqueda que
encabeza una lista sigue siendo `.search-field` **aunque sea el control más prominente de la
pantalla**. Centrar una `.search-bar` sobre una lista de la misma pantalla es un defecto.
Siempre `role="search"` con nombre accesible.

---

## Select vs Dropdown Menu vs Combobox vs Command

| Componente | Regla | Para qué |
|---|---|---|
| **Select** (`.select*`) | `select.md` | elegir UN valor de una lista fija (`role=listbox`); es un campo de formulario |
| **Dropdown Menu** (`.dropdown-*`) | `menu.md` | lista de **acciones/comandos** (`role=menu`), disparada por click |
| **Combobox** (`.combobox*`) | `combobox.md` | selección única **con typeahead** que devuelve un valor de formulario |
| **Command** (`.command*`) | `command.md` | paleta ⌘K (acciones/navegación); el motor sobre el que se construye Combobox |

Select ≠ Dropdown Menu: el Select captura un valor, el menú dispara acciones. Combobox ≠ Select:
Combobox tiene typeahead (listas largas), Select es para listas cortas y acotadas.
**Selección múltiple → Chip**, ninguno de estos.

---

## Familia de overlays — modalidad y descarte

| Componente | Regla | Cuándo | Modalidad |
|---|---|---|---|
| Dropdown Menu | `menu.md` | acciones contextuales sobre un disparador visible | no modal; Esc + clic afuera |
| Popover | `menu.md` | contenido libre al lado de un elemento (mini-form, picker propio) | no modal; Esc + clic afuera |
| Context Menu | `context-menu.md` | click derecho / long-press (tiene que existir también un camino visible) | no modal, anclado al cursor |
| Dialog | `dialog.md` | tarea o decisión focalizada que bloquea, centrada | modal; focus-trap; Esc + clic afuera |
| **Alert Dialog** | `dialog.md` | confirmación destructiva e irreversible | modal, **sin** Esc ni clic afuera; Cancelar es el foco por defecto; sin X |
| Side / Bottom Sheet | `sheet-side.md` / `sheet-bottom.md` | filtros, detalle, formulario secundario (side en desktop, bottom en mobile) | modal; focus-trap; Esc + clic en scrim |

Sheet es **el único panel anclado a un borde**. No inventes otro.

---

## Calendar vs Date Picker

- **Calendar** (`.calendar*`) — grilla de mes **inline, siempre visible**. Cuando elegir fecha es la
  tarea principal, o para rango / fechas bloqueadas / presets.
  Config: `data-cal-mode="range"`, `data-cal-caption="dropdown"`, `data-cal-booked`, `data-cal-weeknumbers`.
- **Date Picker** (`.date-picker*`) — disparador + popover que aloja un Calendar. Es el default en
  formularios y toolbars, donde no conviene ocupar espacio permanente.
- En mobile, el Calendar va en un bottom Sheet, no en el popover chico.

---

## Familia de carga

| Tratamiento | Clases | Cuándo |
|---|---|---|
| **Skeleton** | `.skeleton`, `.skeleton-{text,title,card,circle,avatar}` | conocés el layout destino y la espera supera ~300ms. `aria-busy` en el wrapper, `aria-hidden` en las formas |
| **Progress** | `.progress`/`.progress-fill`, `.progress-circular*`, `-indeterminate` | existe un **porcentaje real** (uploads). `role=progressbar` + `aria-valuenow` |
| **Spinner** | `.spinner`, `.spinner-sm` (dentro de botones), `.spinner-lg`, `.spinner-on-primary` | espera corta inline dentro de un botón, input o celda. `role=status` + `aria-label` |
| **Sin datos** | `.empty-state` | nunca un spinner eterno |
| **< ~300ms** | nada | no pongas indicador |

Nunca skeleton y spinner en el mismo contexto. Nunca skeleton sobre un botón o control. Nunca
alternar determinado ↔ indeterminado a mitad de operación.

---

## Toolbar y sus variantes · Segmented Button · Checkbox

**Toolbar es un componente con variantes** (`toolbar.md`). Encabeza una lista, tabla o dashboard.
Componé las variantes; nunca armes una barra a mano por página.

- `.toolbar` + `.toolbar-actions` (slot derecho, `margin-left:auto`, con **una sola** primaria) +
  `.result-count` (`aria-live="polite"`, "Mostrando N de M").
- `.search-field` (crece `flex:1`) + `.toolbar-btn` (filtro/orden/reset outlined, con
  `.toolbar-btn-count` opcional).
- **`.toolbar-filters`** — unifica **2 o más controles de filtro de igual jerarquía** (Select +
  Segmented Button + Date Picker) bajo un mismo tratamiento de campo, vía la capa `--tb-*`. Re-skinea
  solo **dentro** de `.toolbar-filters`, nunca los componentes standalone. El segmento seleccionado
  conserva su `--color-secondary-container` y su anillo de foco.
  *No existe un componente "Filter Toolbar" separado — se fusionó acá.*
- **`.toolbar-selection`** — variante de acciones masivas cuando hay ítems seleccionados.
- **`.toolbar-overflow-btn`** — "Más" (`aria-haspopup="menu"`) para lo que no entra ·
  **`.toolbar-sticky`** (+ `.is-stuck`) para fijarla al hacer scroll.
- Orden izquierda → derecha por frecuencia: búsqueda → filtros → orden → acción. Izquierda define la
  vista; derecha son las acciones, **una primaria como máximo**. Acciones globales → Top Bar.
  Navegación entre sub-vistas → Tabs.

**Segmented Button** (`.seg-btn-group`, `.seg-btn`, `.selected`; tamaños `-sm`/`-lg`) — alterna
entre 2–5 **vistas o modos mutuamente excluyentes de la misma pantalla** (Lista/Cuadrícula,
Día/Semana/Mes). Distinto de Tabs (navegan a vistas distintas) y de Toggle Group (on/off
independientes).

**Checkbox** (`.checkbox`, `.checkbox-label`, `.checkbox-card`) — multi-selección de formulario y
"seleccionar todo" de tabla (el header usa el guion indeterminado: `el.indeterminate = true` por DOM,
no por clase). **No** para filtrar desde un toolbar — eso es un Chip. Elección exclusiva → Radio.
On/off inmediato → Switch.

---

## Pares de alta frecuencia

- **badge** = estado o categoría de solo lectura (nunca texto de color a mano) · **chip** =
  interactivo (filtro, selección, input).
- **card** = contenedor genérico · **stat-card** = KPI (número + label + variación) ·
  **item** (Basic Card) = la fila compacta reutilizable, base de las cards de dominio ·
  **person-card** / **vacancy-card** / **kanban-card** = dominio.
- **toast/snackbar** = feedback pasivo y efímero · **alert** = error o guía inline que persiste hasta
  que se resuelve · **dialog / alert-dialog** = decisión que bloquea.
- **placeholder panel** ("seleccioná…", "próximamente") ≠ **empty-state** ("todavía no hay datos").
- **Sin permiso no es un estado propio de Embassy.** No hay componente dedicado: componelo con
  `.empty-state` (variante de error, explicando la falta de acceso y cómo pedirlo) o un `.alert`
  persistente. Si un producto necesita una superficie de permisos de primera clase, marcalo como gap
  del DS — no inventes una.

---

## Cuando algo falta de verdad

1. Revisá las `variants` de la regla y el bloque `Uso:` del CSS por una variante compuesta.
2. Revisá el mapeo legacy → DS de `MIGRATION.md` (y `GAMAFORCE-MIGRATION.md` si aplica).
3. Consultá `manifest.json` / `ls css/components/` — confirmá que de verdad no existe. El catálogo
   creció mucho: no asumas "roadmap" de memoria.
4. Si es genuinamente nuevo: seguí "Adding a new component" de `CLAUDE.md` (o usá
   `embassy-contribute`) y marcalo como extensión del DS.
5. **Nunca** esquives los tokens con hex ad-hoc, y **nunca** inventes o aproximes un componente que
   ya existe.
