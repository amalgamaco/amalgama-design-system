import * as React from "react"

/**
 * TokenPanel — the canonical per-component "Tokens del componente" reference.
 * Data-driven: each component passes an ordered list of category groups, each
 * listing the specific Embassy tokens that component uses (name → role → usage).
 * Foundational scales (type/spacing/radius/shadow/motion) are documented in full
 * on the Foundations pages; this panel shows WHICH tokens a component consumes so
 * designers and developers can read a component's token contract at a glance.
 *
 * Categories (fixed order): Color · Componente · Estado · Tipografía ·
 * Espaciado · Radio · Elevación · Movimiento. Only categories that apply to the
 * component are passed in.
 */
export type TokenRow = { token: string; role?: string; usage: string }
export type TokenGroup = { category: string; note?: string; rows: TokenRow[] }

const CAT_ORDER = [
  "Color", "Componente", "Estado", "Tipografía",
  "Espaciado", "Radio", "Elevación", "Movimiento",
]

export function TokenPanel({ groups }: { groups: TokenGroup[] }) {
  const sorted = [...groups].sort(
    (a, b) => CAT_ORDER.indexOf(a.category) - CAT_ORDER.indexOf(b.category)
  )
  return (
    <div className="flex flex-col gap-5">
      {sorted.map((g) => (
        <section key={g.category} className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <h4 className="m-0 text-label font-semibold text-on-surface">{g.category}</h4>
            {g.note && <span className="text-caption text-on-surface-variant">{g.note}</span>}
          </div>
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full border-collapse text-body-sm">
              <thead>
                <tr className="bg-surface-container-low text-left text-on-surface-variant">
                  <th className="px-3 py-2 font-medium whitespace-nowrap">Token</th>
                  <th className="px-3 py-2 font-medium whitespace-nowrap">Rol</th>
                  <th className="px-3 py-2 font-medium">Uso</th>
                </tr>
              </thead>
              <tbody>
                {g.rows.map((r, i) => (
                  <tr key={i} className="border-t border-border align-top">
                    <td className="px-3 py-2">
                      <code className="font-mono text-mono-sm text-on-surface whitespace-nowrap">{r.token}</code>
                    </td>
                    <td className="px-3 py-2 text-on-surface-variant whitespace-nowrap">{r.role || "—"}</td>
                    <td className="px-3 py-2 text-on-surface">{r.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  )
}

/* ─────────────────────────── Button ─────────────────────────── */
const BUTTON_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-primary", role: "Contenedor", usage: "Fondo del botón primario (relleno)." },
    { token: "--color-on-primary", role: "Contenido", usage: "Etiqueta e ícono sobre el relleno primario." },
    { token: "--color-secondary-container", role: "Contenedor", usage: "Fondo de la variante tonal (secondary)." },
    { token: "--color-on-secondary-container", role: "Contenido", usage: "Etiqueta e ícono de la variante tonal." },
    { token: "--color-outline", role: "Borde", usage: "Borde de las variantes con borde e icon button." },
    { token: "--color-surface-container", role: "Contenedor", usage: "Fondo del icon button en reposo." },
    { token: "--color-error / --color-on-error", role: "Semántico", usage: "Variante destructiva (fondo + contenido)." },
    { token: "--color-success / --color-on-success", role: "Semántico", usage: "Variante de confirmación (fondo + contenido)." },
  ]},
  { category: "Estado", rows: [
    { token: "--color-primary-hover", role: "Hover", usage: "Oscurecido de la variante rellena al pasar el mouse." },
    { token: "--color-secondary-container-hover", role: "Hover", usage: "Oscurecido de la variante tonal." },
    { token: "--color-primary-state-hover / -state-press", role: "Hover / Pressed", usage: "Capa de estado de la variante de texto." },
    { token: "--color-surface-variant", role: "Hover", usage: "Fondo del icon/outlined en hover." },
    { token: "--color-focus-ring", role: "Foco", usage: "Anillo de foco (focus-visible)." },
    { token: "--color-disabled / --color-on-disabled", role: "Disabled", usage: "Fondo y contenido deshabilitados." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter — etiqueta del botón (semibold)." },
    { token: "--text-body-md", role: "Tamaño", usage: "Tamaño de etiqueta predeterminado (MD)." },
    { token: "--text-body-sm", role: "Tamaño", usage: "Tamaño de etiqueta en botones SM." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "px-6 · py-2", role: "Padding", usage: "24px horizontal · 8px vertical (predeterminado)." },
    { token: "px-4", role: "Padding", usage: "16px horizontal en modo compacto (.btn-compact)." },
    { token: "gap-2", role: "Gap", usage: "8px entre ícono y etiqueta." },
  ]},
  { category: "Radio", note: "escala con el tamaño, no con la variante", rows: [
    { token: "--radius-sm", role: "Radio", usage: "Botones XS y SM." },
    { token: "--radius-md", role: "Radio", usage: "Botones MD (predeterminado) y LG." },
    { token: "--radius-lg", role: "Radio", usage: "Botón XL." },
  ]},
  { category: "Elevación", rows: [
    { token: "--btn-elevation", role: "Sombra (elevación 1)", usage: "Reposo de la variante elevada — recalibra a negro en dark para seguir visible." },
    { token: "--btn-elevation-hover", role: "Sombra (elevación 2)", usage: "La elevación crece al hacer hover; vuelve a --btn-elevation al presionar." },
  ]},
  { category: "Movimiento", rows: [
    { token: "--duration-fast", role: "Duración", usage: "Transición de color/elevación en hover/press." },
    { token: "ease-in-out", role: "Curva", usage: "Aceleración estándar de la transición." },
  ]},
]
export function ButtonTokens() { return <TokenPanel groups={BUTTON_TOKENS} /> }

/* ─────────────────────────── Menu ─────────────────────────── */
const MENU_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-surface-container-high", role: "Contenedor", usage: "Superficie flotante del menú." },
    { token: "--color-on-surface", role: "Contenido", usage: "Texto del ítem en reposo." },
    { token: "--color-on-surface-variant", role: "Contenido", usage: "Ícono leading y atajo/trailing." },
    { token: "--color-border", role: "Borde", usage: "Borde del contenedor y separador." },
    { token: "--color-error", role: "Semántico", usage: "Ítem destructivo." },
  ]},
  { category: "Componente", note: "tier md.comp — familia de navegación (alias --color-nav-*)", rows: [
    { token: "--md-comp-nav-hover", role: "Hover", usage: "Fondo del ítem en hover (tinte secondary-container 45%)." },
    { token: "--md-comp-nav-hover-content", role: "Hover", usage: "Etiqueta e ícono en hover (azul secondary)." },
    { token: "--md-comp-nav-press", role: "Pressed", usage: "Fondo del ítem presionado (70%)." },
    { token: "--md-comp-nav-selected", role: "Selected", usage: "Fondo del ítem activo/marcado (secondary-container 100%)." },
    { token: "--md-comp-nav-selected-content", role: "Selected", usage: "Etiqueta e ícono del ítem activo (on-secondary-container)." },
  ]},
  { category: "Estado", note: "compartido con nav, listas y sidebars", rows: [
    { token: "--color-nav-hover (+ -content)", role: "Hover", usage: "Ítem resaltado (mouse y teclado / highlighted)." },
    { token: "--color-nav-press", role: "Pressed", usage: "Ítem mientras se presiona (transitorio)." },
    { token: "--color-focus-ring", role: "Foco", usage: "Anillo interno al navegar con teclado." },
    { token: "--color-nav-selected (+ -content)", role: "Selected", usage: "Ítem activo (checkbox/radio) + semibold." },
    { token: "opacidad 40%", role: "Disabled", usage: "Ítem deshabilitado, no interactivo." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter — texto del ítem." },
    { token: "--text-body-md", role: "Tamaño", usage: "Etiqueta del ítem." },
    { token: "--font-mono", role: "Familia", usage: "DM Mono — atajos de teclado." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "px-3 · py-2", role: "Padding", usage: "12px horizontal · 8px vertical por ítem." },
    { token: "p-1.5", role: "Padding", usage: "6px de padding interno del contenedor." },
    { token: "gap-2", role: "Gap", usage: "8px entre ícono y etiqueta." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-md", role: "Radio", usage: "Contenedor del menú y cada ítem." },
  ]},
  { category: "Elevación", rows: [
    { token: "--shadow-lg", role: "Sombra", usage: "Elevación del menú flotante." },
  ]},
  { category: "Movimiento", rows: [
    { token: "--duration-fast", role: "Duración", usage: "Transición de color del ítem entre estados." },
  ]},
]
export function MenuTokens() { return <TokenPanel groups={MENU_TOKENS} /> }

/* ─────────────────────────── Forms ─────────────────────────── */
const INPUT_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-card", role: "Contenedor", usage: "Fondo del campo (bg-card)." },
    { token: "--color-fg", role: "Contenido", usage: "Texto ingresado y label (text-fg)." },
    { token: "--color-fg-muted", role: "Placeholder", usage: "Placeholder e íconos leading/trailing." },
    { token: "--color-fg-subtle", role: "Soporte", usage: "Texto de ayuda (hint) bajo el campo." },
    { token: "--color-border", role: "Borde", usage: "Borde en reposo del campo." },
  ]},
  { category: "Estado", rows: [
    { token: "--color-outline", role: "Hover", usage: "Borde al pasar el mouse (hover:border-outline)." },
    { token: "--color-link", role: "Foco", usage: "Borde en foco y label con foco (focus-within)." },
    { token: "--color-focus-ring", role: "Foco", usage: "Anillo de foco de 3px (focus)." },
    { token: "--color-error", role: "Error", usage: "Borde rojo, asterisco de requerido y mensaje de error." },
    { token: "--color-error-ring", role: "Error", usage: "Anillo de foco de 3px en estado de error." },
    { token: "--color-surface-variant / --color-on-disabled", role: "Disabled", usage: "Fondo y contenido deshabilitados; borde en outline." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter — texto del campo." },
    { token: "--text-body-md", role: "Tamaño", usage: "Tamaño del texto ingresado." },
    { token: "--text-label", role: "Tamaño", usage: "Tamaño del label." },
    { token: "--text-caption", role: "Tamaño", usage: "Tamaño del hint y del mensaje de error." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "px-[14px] · py-[10px]", role: "Padding", usage: "14px horizontal · 10px vertical del campo." },
    { token: "pl-[42px] / pr-[42px]", role: "Padding con ícono", usage: "Reserva 42px para el ícono leading/trailing." },
    { token: "mb-2", role: "Gap label", usage: "8px entre label y campo." },
    { token: "mt-1.5", role: "Gap soporte", usage: "6px entre campo y hint/error." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-md", role: "Radio", usage: "Esquinas del campo." },
  ]},
  { category: "Movimiento", rows: [
    { token: "--duration-fast", role: "Duración", usage: "Transición de borde y sombra en hover/foco (ease-in-out)." },
  ]},
]
export function InputTokens() { return <TokenPanel groups={INPUT_TOKENS} /> }

const SELECT_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--card-bg", role: "Contenedor trigger", usage: "Fondo del disparador (trigger)." },
    { token: "--text-primary", role: "Contenido", usage: "Valor seleccionado en el trigger." },
    { token: "--text-muted", role: "Placeholder", usage: "Placeholder y chevron del trigger." },
    { token: "--color-border", role: "Borde", usage: "Borde del trigger y del panel." },
    { token: "--color-surface-container-high", role: "Panel", usage: "Fondo del popover de opciones." },
    { token: "--color-on-surface", role: "Contenido panel", usage: "Texto de las opciones." },
  ]},
  { category: "Estado", rows: [
    { token: "--color-primary", role: "Foco", usage: "Borde del trigger en foco." },
    { token: "--color-focus-ring", role: "Foco", usage: "Anillo de foco de 3px del trigger." },
    { token: "--color-surface-variant", role: "Ítem activo", usage: "Fondo de la opción con foco/hover." },
    { token: "opacidad 50%", role: "Disabled", usage: "Trigger y opciones deshabilitados (opacity-50)." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--text-body-sm", role: "Tamaño trigger", usage: "Texto del disparador (~13.5px)." },
    { token: "--text-body-sm", role: "Tamaño ítem", usage: "Texto de las opciones." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "px-3.5 · py-2.5", role: "Padding trigger", usage: "14px horizontal · 10px vertical del trigger." },
    { token: "p-1.5", role: "Padding panel", usage: "6px de relleno del viewport." },
    { token: "py-2 · pl-3 · pr-8", role: "Padding ítem", usage: "Relleno de cada opción (espacio para el check)." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-md", role: "Radio", usage: "Esquinas del trigger y del panel." },
    { token: "--radius-sm", role: "Radio ítem", usage: "Esquinas de cada opción." },
  ]},
  { category: "Elevación", rows: [
    { token: "--shadow-lg", role: "Sombra panel", usage: "Elevación del popover de opciones." },
  ]},
]
export function SelectTokens() { return <TokenPanel groups={SELECT_TOKENS} /> }

const TEXTAREA_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-card", role: "Contenedor", usage: "Fondo del campo multilínea (bg-card)." },
    { token: "--color-fg", role: "Contenido", usage: "Texto ingresado y label (text-fg)." },
    { token: "--color-fg-muted", role: "Placeholder", usage: "Placeholder del campo." },
    { token: "--color-border", role: "Borde", usage: "Borde en reposo del campo." },
    { token: "--color-error", role: "Requerido", usage: "Asterisco de campo requerido." },
  ]},
  { category: "Estado", rows: [
    { token: "--color-outline", role: "Hover", usage: "Borde al pasar el mouse (hover:border-outline)." },
    { token: "--color-link", role: "Foco", usage: "Borde en foco y label con foco (focus-within)." },
    { token: "--color-focus-ring", role: "Foco", usage: "Anillo de foco de 3px (focus)." },
    { token: "--color-surface-variant / --color-on-disabled", role: "Disabled", usage: "Fondo y contenido deshabilitados; borde en outline." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter — texto del campo." },
    { token: "--text-body-md", role: "Tamaño", usage: "Tamaño del texto ingresado." },
    { token: "--text-label", role: "Tamaño", usage: "Tamaño del label." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "px-[14px] · py-[10px]", role: "Padding", usage: "14px horizontal · 10px vertical del campo." },
    { token: "min-h-[80px]", role: "Alto mínimo", usage: "Altura mínima del área de texto (redimensionable vertical)." },
    { token: "mb-2", role: "Gap label", usage: "8px entre label y campo." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-md", role: "Radio", usage: "Esquinas del campo." },
  ]},
  { category: "Movimiento", rows: [
    { token: "--duration-fast", role: "Duración", usage: "Transición de borde y sombra en hover/foco (ease-in-out)." },
  ]},
]
export function TextareaTokens() { return <TokenPanel groups={TEXTAREA_TOKENS} /> }

const CHECKBOX_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-outline", role: "Borde", usage: "Borde de 2px en estado sin marcar." },
    { token: "--color-primary", role: "Seleccionado", usage: "Relleno cuando está marcado o indeterminado." },
    { token: "--color-on-primary", role: "Contenido", usage: "Ícono de check / guión sobre el relleno." },
  ]},
  { category: "Estado", rows: [
    { token: "--color-focus-ring", role: "Foco", usage: "Anillo de foco (focus-visible)." },
    { token: "--color-primary", role: "Checked / Indeterminate", usage: "Fondo marcado o indeterminado, borde transparente." },
    { token: "opacidad 40%", role: "Disabled", usage: "Control deshabilitado (opacity-40)." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "size-[18px]", role: "Tamaño", usage: "Caja de 18×18px." },
    { token: "size-3.5", role: "Ícono", usage: "Check / guión de 14px." },
  ]},
  { category: "Radio", rows: [
    { token: "rounded-[4px]", role: "Radio", usage: "Esquinas de la caja (4px)." },
  ]},
  { category: "Movimiento", rows: [
    { token: "transition-colors", role: "Transición", usage: "Cambio de color al marcar/desmarcar." },
  ]},
]
export function CheckboxTokens() { return <TokenPanel groups={CHECKBOX_TOKENS} /> }

const RADIO_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-outline", role: "Borde", usage: "Borde de 2px del anillo sin marcar." },
    { token: "--color-primary", role: "Seleccionado", usage: "Borde e indicador interno cuando está marcado." },
  ]},
  { category: "Estado", rows: [
    { token: "--color-focus-ring", role: "Foco", usage: "Anillo de foco (focus-visible)." },
    { token: "--color-primary", role: "Checked", usage: "Borde marcado (data-[state=checked]:border-primary)." },
    { token: "opacidad 40%", role: "Disabled", usage: "Control deshabilitado (opacity-40)." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "size-5", role: "Tamaño", usage: "Anillo de 20×20px." },
    { token: "size-2.5", role: "Indicador", usage: "Punto interno de 10px." },
    { token: "gap-2.5", role: "Gap grupo", usage: "10px entre opciones del grupo." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-full", role: "Radio", usage: "Anillo e indicador circulares." },
  ]},
  { category: "Movimiento", rows: [
    { token: "transition-colors", role: "Transición", usage: "Cambio de color al marcar/desmarcar." },
  ]},
]
export function RadioTokens() { return <TokenPanel groups={RADIO_TOKENS} /> }

const SWITCH_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-surface-variant", role: "Track apagado", usage: "Fondo del riel sin activar." },
    { token: "--color-outline", role: "Borde / Thumb", usage: "Borde del riel y thumb sin activar." },
    { token: "--color-primary", role: "Track activo", usage: "Fondo del riel activado (borde transparente)." },
    { token: "--color-on-primary", role: "Thumb activo", usage: "Thumb cuando está activado." },
  ]},
  { category: "Estado", rows: [
    { token: "--color-focus-ring", role: "Foco", usage: "Anillo de foco (focus-visible)." },
    { token: "--color-primary", role: "Checked", usage: "Riel activado (data-[state=checked])." },
    { token: "opacidad 40%", role: "Disabled", usage: "Control deshabilitado (opacity-40)." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "h-6 · w-11", role: "Tamaño riel", usage: "Riel de 24px alto · 44px ancho." },
    { token: "h-5 · w-5", role: "Tamaño thumb", usage: "Thumb de 20×20px." },
    { token: "translate-x-5", role: "Recorrido", usage: "Desplazamiento del thumb al activar (20px)." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-full", role: "Radio", usage: "Riel y thumb circulares." },
  ]},
  { category: "Elevación", rows: [
    { token: "shadow", role: "Sombra thumb", usage: "Elevación del thumb." },
  ]},
  { category: "Movimiento", rows: [
    { token: "transition-colors", role: "Track", usage: "Cambio de color del riel." },
    { token: "transition-transform", role: "Thumb", usage: "Desplazamiento del thumb." },
  ]},
]
export function SwitchTokens() { return <TokenPanel groups={SWITCH_TOKENS} /> }

const SLIDER_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-surface-variant", role: "Track", usage: "Fondo del riel (parte no seleccionada)." },
    { token: "--color-primary", role: "Range / Thumb", usage: "Tramo seleccionado, borde y relleno del thumb." },
  ]},
  { category: "Estado", rows: [
    { token: "--color-focus-ring", role: "Foco", usage: "Anillo de foco de 4px del thumb." },
    { token: "opacidad 40%", role: "Disabled", usage: "Control deshabilitado (data-[disabled]:opacity-40)." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "h-1", role: "Alto riel", usage: "Riel de 4px de alto." },
    { token: "size-5", role: "Tamaño thumb", usage: "Thumb de 20×20px." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-full", role: "Radio", usage: "Riel y thumb circulares." },
  ]},
  { category: "Elevación", rows: [
    { token: "--shadow-sm", role: "Sombra thumb", usage: "Elevación del thumb." },
  ]},
  { category: "Movimiento", rows: [
    { token: "transition-[box-shadow]", role: "Transición", usage: "Aparición del anillo de foco en el thumb." },
  ]},
]
export function SliderTokens() { return <TokenPanel groups={SLIDER_TOKENS} /> }

/* ─────────────────────────── Containers ─────────────────────────── */
const BASIC_CARD_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-card", role: "Contenedor", usage: "Fondo de la tarjeta." },
    { token: "--color-border", role: "Borde", usage: "Borde del contenedor." },
    { token: "--color-fg", role: "Texto", usage: "Título, contenido y valores." },
    { token: "--color-fg-subtle", role: "Texto secundario", usage: "Descripción de la tarjeta." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-heading", role: "Familia", usage: "Epilogue para el título." },
    { token: "--text-heading-xs", role: "Título", usage: "Título de la tarjeta (semibold)." },
    { token: "--text-body-md", role: "Cuerpo", usage: "Contenido de la tarjeta." },
    { token: "--text-label", role: "Etiqueta", usage: "Descripción de la tarjeta." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "px-5 · py-4", role: "Padding", usage: "Relleno interno (20px horizontal · 16px vertical)." },
    { token: "mb-3", role: "Header", usage: "Separación bajo el encabezado (12px)." },
    { token: "mt-4 · gap-2", role: "Footer", usage: "Margen superior (16px) y separación entre acciones (8px)." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-lg", role: "Radio", usage: "Esquinas del contenedor." },
  ]},
]
export function BasicCardTokens() { return <TokenPanel groups={BASIC_CARD_TOKENS} /> }

const DIALOG_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-card", role: "Contenedor", usage: "Superficie del diálogo." },
    { token: "--color-border", role: "Borde", usage: "Borde y divisores de header/footer." },
    { token: "--text-primary", role: "Título", usage: "Texto del título (navy de marca)." },
    { token: "--color-on-surface-variant", role: "Cuerpo", usage: "Texto del body del diálogo." },
  ]},
  { category: "Estado", rows: [
    { token: "--color-scrim", role: "Overlay", usage: "Fondo oscurecido detrás del diálogo." },
    { token: "--color-focus-ring", role: "Foco", usage: "Botón de cierre (icon button canónico)." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter para título, body y footer." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "px-5 · py-4", role: "Padding", usage: "Relleno de header, body y footer (20px / 16px)." },
    { token: "gap-2", role: "Footer", usage: "Separación entre acciones del footer (8px)." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-lg", role: "Radio", usage: "Esquinas del contenedor del diálogo." },
  ]},
  { category: "Elevación", rows: [
    { token: "--shadow-xl", role: "Sombra", usage: "Elevación del diálogo modal." },
  ]},
]
export function DialogTokens() { return <TokenPanel groups={DIALOG_TOKENS} /> }

const BOTTOM_SHEET_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-surface", role: "Contenedor", usage: "Superficie de la hoja inferior." },
    { token: "--color-border", role: "Borde", usage: "Borde superior y divisores de header/footer." },
    { token: "--color-fg", role: "Título", usage: "Texto del título (semibold)." },
    { token: "--color-fg-subtle", role: "Descripción", usage: "Texto secundario." },
  ]},
  { category: "Estado", rows: [
    { token: "--color-scrim", role: "Overlay", usage: "Fondo oscurecido al 40% con desenfoque." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-heading", role: "Familia", usage: "Epilogue para el título." },
    { token: "--text-heading-xs", role: "Título", usage: "Título de la hoja." },
    { token: "--text-label", role: "Descripción", usage: "Texto secundario." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "px-6 · py-5", role: "Padding", usage: "Relleno de header y body (24px / 20px)." },
    { token: "py-4 · gap-2", role: "Footer", usage: "Relleno vertical (16px) y separación (8px)." },
  ]},
  { category: "Radio", rows: [
    { token: "rounded-t-2xl", role: "Radio", usage: "Esquinas superiores redondeadas (variante inferior)." },
  ]},
  { category: "Elevación", rows: [
    { token: "--shadow-xl", role: "Sombra", usage: "Elevación de la hoja." },
  ]},
  { category: "Movimiento", rows: [
    { token: "--ease-emphasized", role: "Curva", usage: "Curva compartida con el Drawer (decelerate, sin overshoot)." },
    { token: "--duration-drawer", role: "Duración", usage: "500ms, simétrico apertura/cierre — igual que el Drawer." },
  ]},
]
export function BottomSheetTokens() { return <TokenPanel groups={BOTTOM_SHEET_TOKENS} /> }

const SIDE_SHEET_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-surface", role: "Contenedor", usage: "Superficie de la hoja lateral." },
    { token: "--color-border", role: "Borde", usage: "Borde lateral y divisores de header/footer." },
    { token: "--color-fg", role: "Título", usage: "Texto del título (semibold)." },
    { token: "--color-fg-subtle", role: "Descripción", usage: "Texto secundario." },
  ]},
  { category: "Estado", rows: [
    { token: "--color-scrim", role: "Overlay", usage: "Fondo oscurecido al 40% con desenfoque." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-heading", role: "Familia", usage: "Epilogue para el título." },
    { token: "--text-heading-xs", role: "Título", usage: "Título de la hoja." },
    { token: "--text-label", role: "Descripción", usage: "Texto secundario." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "px-6 · py-5", role: "Padding", usage: "Relleno de header y body (24px / 20px)." },
    { token: "py-4 · gap-2", role: "Footer", usage: "Relleno vertical (16px) y separación (8px)." },
  ]},
  { category: "Elevación", rows: [
    { token: "--shadow-xl", role: "Sombra", usage: "Elevación de la hoja (sin radio: bordes a tope)." },
  ]},
  { category: "Movimiento", rows: [
    { token: "--ease-emphasized", role: "Curva", usage: "Curva compartida con el Drawer (decelerate, sin overshoot)." },
    { token: "--duration-drawer", role: "Duración", usage: "500ms, simétrico apertura/cierre — igual que el Drawer." },
  ]},
]
export function SideSheetTokens() { return <TokenPanel groups={SIDE_SHEET_TOKENS} /> }

const DRAWER_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-surface", role: "Contenedor", usage: "Superficie del drawer (igual que Sheet)." },
    { token: "--color-border", role: "Borde", usage: "Borde del lado de anclaje." },
    { token: "--color-outline-variant", role: "Handle", usage: "Manija de arrastre (solo variante inferior)." },
    { token: "--color-fg", role: "Título", usage: "Texto del título (semibold)." },
    { token: "--color-fg-subtle", role: "Descripción", usage: "Texto secundario." },
  ]},
  { category: "Estado", rows: [
    { token: "--color-scrim", role: "Overlay", usage: "Fondo oscurecido al 40% con desenfoque." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-heading", role: "Familia", usage: "Epilogue para el título." },
    { token: "--text-heading-xs", role: "Título", usage: "Título del drawer." },
    { token: "--text-label", role: "Descripción", usage: "Texto secundario." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "p-6", role: "Padding", usage: "Relleno de header y footer (24px)." },
    { token: "gap-2", role: "Footer", usage: "Separación entre acciones (8px)." },
  ]},
  { category: "Radio", rows: [
    { token: "rounded-t-2xl / rounded-b-2xl", role: "Radio", usage: "Esquinas del borde de anclaje (top/bottom)." },
  ]},
  { category: "Elevación", rows: [
    { token: "--shadow-xl", role: "Sombra", usage: "Elevación del drawer." },
  ]},
  { category: "Movimiento", rows: [
    { token: "vaul", role: "Gesto", usage: "Arrastrar-para-cerrar con seguimiento del dedo (spring nativo de vaul)." },
    { token: "--ease-emphasized", role: "Curva", usage: "Curva de entrada/salida (cubic-bezier .32,.72,0,1) — compartida con Side/Bottom Sheet." },
    { token: "--duration-drawer", role: "Duración", usage: "500ms — la referencia que Side/Bottom Sheet replican." },
  ]},
]
export function DrawerTokens() { return <TokenPanel groups={DRAWER_TOKENS} /> }

const TABLE_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-card", role: "Contenedor", usage: "Fondo de la tabla." },
    { token: "--color-border", role: "Borde", usage: "Borde del contenedor y líneas entre filas." },
    { token: "--color-surface-variant", role: "Encabezado", usage: "Fondo de la fila de encabezado." },
    { token: "--color-fg-muted", role: "Encabezado", usage: "Texto de las celdas de encabezado." },
    { token: "--color-fg", role: "Celda", usage: "Texto de las celdas de datos." },
  ]},
  { category: "Estado", rows: [
    { token: "--color-surface-variant", role: "Hover", usage: "Fondo de la fila al pasar el cursor." },
    { token: "--color-focus-ring", role: "Foco", usage: "Anillo de foco en filas navegables." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter para encabezados y celdas." },
    { token: "--text-overline", role: "Encabezado", usage: "Texto del encabezado (mayúsculas)." },
    { token: "--text-body-md", role: "Celda", usage: "Texto de las celdas de datos." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "px-4 · py-[10px]", role: "Encabezado", usage: "Relleno de celdas de encabezado (16px / 10px)." },
    { token: "px-4 · py-3", role: "Celda", usage: "Relleno de celdas de datos (16px / 12px)." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-lg", role: "Radio", usage: "Esquinas del contenedor (overflow oculto)." },
  ]},
  { category: "Movimiento", rows: [
    { token: "--duration-fast", role: "Transición", usage: "Transición de color en el hover de fila." },
  ]},
]
export function TableTokens() { return <TokenPanel groups={TABLE_TOKENS} /> }

const TABS_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-border", role: "Borde", usage: "Línea base bajo la lista de pestañas." },
    { token: "--color-on-surface-variant", role: "Inactiva", usage: "Texto de pestañas inactivas y del contenido." },
  ]},
  { category: "Estado", rows: [
    { token: "--color-primary", role: "Activa", usage: "Texto e indicador de 2px de la pestaña activa." },
    { token: "--color-on-surface", role: "Hover", usage: "Texto de la pestaña en hover/foco." },
    { token: "--color-focus-ring", role: "Foco", usage: "Anillo de foco por teclado." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter para pestañas y contenido (sm, medium)." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "px-4 · py-2.5", role: "Pestaña", usage: "Relleno de cada trigger (16px / 10px)." },
    { token: "gap-1", role: "Lista", usage: "Separación entre pestañas (4px)." },
    { token: "py-4", role: "Contenido", usage: "Relleno vertical del panel (16px)." },
  ]},
  { category: "Movimiento", rows: [
    { token: "ease-in-out", role: "Transición", usage: "Transición de color entre estados." },
  ]},
]
export function TabsTokens() { return <TokenPanel groups={TABS_TOKENS} /> }

/* ─────────────────────────── Display ─────────────────────────── */
const BADGE_TOKENS: TokenGroup[] = [
  { category: "Color", note: "cada variante semántica usa su par contenedor / on-contenedor", rows: [
    { token: "--color-success-container / --color-on-success-container", role: "open / active", usage: "Badges de estado abierto/activo." },
    { token: "--color-error-container / --color-on-error-container", role: "closed", usage: "Badge de estado cerrado." },
    { token: "--color-warning-container / --color-on-warning-container", role: "warning", usage: "Badge de advertencia." },
    { token: "--color-tertiary-container / --color-on-tertiary-container", role: "tertiary", usage: "Badge terciario." },
    { token: "--color-info-container / --color-on-info-container", role: "info", usage: "Badge informativo." },
    { token: "--color-surface-variant / --color-on-surface-variant", role: "draft / archived", usage: "Badges neutros borrador y archivado." },
    { token: "--color-outline", role: "Borde (draft)", usage: "Borde del badge borrador." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--text-badge", role: "Etiqueta", usage: "Tamaño de la etiqueta (semibold)." },
    { token: "--font-body", role: "Familia", usage: "Inter — texto del badge." },
    { token: "--font-mono", role: "Familia (label)", usage: "DM Mono en modo `label` mayúsculas." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "px-[10px] · py-1", role: "Padding", usage: "10px horizontal · 4px vertical." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-full", role: "Radio", usage: "Forma de pastilla." },
  ]},
]
export function BadgeTokens() { return <TokenPanel groups={BADGE_TOKENS} /> }

const CHIP_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-on-surface", role: "Contenido", usage: "Texto del chip en estado base." },
    { token: "--color-outline", role: "Borde", usage: "Borde del chip outlined." },
    { token: "--color-surface-container-low", role: "Contenedor (elevated)", usage: "Fondo del chip elevated." },
    { token: "--color-secondary-container", role: "Contenedor (selected)", usage: "Fondo del chip seleccionado." },
    { token: "--color-on-secondary-container", role: "Contenido (selected)", usage: "Texto del chip seleccionado." },
    { token: "--color-on-surface-variant", role: "Contenido (remove)", usage: "Ícono de quitar del input chip." },
  ]},
  { category: "Componente", note: "tier md.comp — alias --color-chip-elevated-*", rows: [
    { token: "--md-comp-chip-elevated-hover", role: "Hover (elevated)", usage: "Fondo del chip elevated en hover." },
    { token: "--md-comp-chip-elevated-press", role: "Pressed (elevated)", usage: "Fondo del chip elevated al presionar." },
  ]},
  { category: "Estado", rows: [
    { token: "--color-on-surface-state-hover", role: "Hover (outlined)", usage: "Capa de estado en hover del chip outlined." },
    { token: "--color-on-surface-state-press", role: "Pressed (outlined)", usage: "Capa de estado al presionar; también hover del botón quitar." },
    { token: "--color-on-secondary-state-hover", role: "Hover (selected)", usage: "Capa de estado en hover del chip seleccionado." },
    { token: "--color-on-secondary-state-press", role: "Pressed (selected)", usage: "Capa de estado al presionar el chip seleccionado." },
    { token: "--color-focus-ring", role: "Focus", usage: "Anillo de foco (focus-visible)." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter — texto del chip." },
    { token: "--text-body-lg", role: "Etiqueta", usage: "Tamaño del texto (medium)." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "h-8 · px-4 · gap-2", role: "Layout", usage: "Alto 32px, padding 16px, gap 8px ícono/texto." },
    { token: "pl-2", role: "Padding con ícono", usage: "Reduce el padding izquierdo a 8px con ícono." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-full", role: "Radio", usage: "Forma de pastilla." },
  ]},
  { category: "Elevación", rows: [
    { token: "--shadow-sm", role: "Sombra (elevated)", usage: "Sombra sutil del chip elevated." },
  ]},
  { category: "Movimiento", rows: [
    { token: "--duration-fast", role: "Transición", usage: "Transición de estados (ease-in-out)." },
  ]},
]
export function ChipTokens() { return <TokenPanel groups={CHIP_TOKENS} /> }

const AVATAR_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-primary", role: "Contenedor (fallback)", usage: "Fondo del fallback sin imagen." },
    { token: "--color-on-primary", role: "Contenido (fallback)", usage: "Iniciales sobre el fallback." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter — iniciales (semibold; escala con el size)." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "h-7 / h-9 / h-11 / h-14", role: "Dimensiones", usage: "28 / 36 / 44 / 56px según size." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-full", role: "Radio", usage: "Avatar y fallback circulares." },
  ]},
]
export function AvatarTokens() { return <TokenPanel groups={AVATAR_TOKENS} /> }

const STAT_CARD_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-fg-muted", role: "Etiqueta", usage: "Etiqueta descriptiva de la métrica." },
    { token: "--color-fg", role: "Valor", usage: "Valor numérico grande." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-heading", role: "Familia (valor)", usage: "Epilogue — valor numérico (bold)." },
    { token: "--font-body", role: "Familia", usage: "Inter — etiqueta y cambio." },
    { token: "--text-display", role: "Valor", usage: "Tamaño del valor destacado." },
    { token: "--text-body-sm", role: "Etiqueta", usage: "Tamaño de la etiqueta." },
    { token: "--text-caption", role: "Cambio", usage: "Tamaño del texto de variación." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "p-5", role: "Padding", usage: "Relleno interno (20px)." },
    { token: "gap-4 · mb-6", role: "Grilla", usage: "Espaciado entre tarjetas y margen de la grilla." },
  ]},
]
export function StatCardTokens() { return <TokenPanel groups={STAT_CARD_TOKENS} /> }

const SKELETON_TOKENS: TokenGroup[] = [
  { category: "Color", note: "aplicados vía la utilidad skeleton-shimmer", rows: [
    { token: "--color-surface-variant", role: "Base", usage: "Color base del placeholder de carga." },
    { token: "--color-surface-container", role: "Brillo", usage: "Color del brillo que recorre el shimmer." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "h-[14px] / h-[22px] / h-[80px]", role: "Dimensiones", usage: "Alto de cada variante (text / title / card)." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-md", role: "Radio", usage: "Esquinas del placeholder." },
  ]},
  { category: "Movimiento", rows: [
    { token: "skeleton-shimmer", role: "Animación", usage: "Barrido shimmer del placeholder de carga." },
  ]},
]
export function SkeletonTokens() { return <TokenPanel groups={SKELETON_TOKENS} /> }

const DIVIDER_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-border", role: "Línea", usage: "Color de la línea divisoria (rol --border)." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "h-px / w-px", role: "Grosor", usage: "Grosor de 1px (horizontal o vertical)." },
    { token: "ml-4", role: "Inset", usage: "Sangría MD3 de 16px para alinear con listas (variante inset)." },
  ]},
]
export function DividerTokens() { return <TokenPanel groups={DIVIDER_TOKENS} /> }

/* ─────────────────────────── Feedback ─────────────────────────── */
const SNACKBAR_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-inverse-surface", role: "Contenedor", usage: "Fondo del snackbar (invierte contra la página)." },
    { token: "--color-inverse-on-surface", role: "Texto", usage: "Mensaje sobre el fondo invertido." },
    { token: "--color-inverse-primary", role: "Acción", usage: "Texto de la acción (patrón «DESHACER»)." },
  ]},
  { category: "Componente", note: "tier md.comp — alias --color-snackbar-*", rows: [
    { token: "--md-comp-snackbar-action-hover", role: "Acción · Hover", usage: "State layer de hover sobre la acción." },
    { token: "--md-comp-snackbar-action-press", role: "Acción · Pressed", usage: "State layer al presionar la acción." },
    { token: "--md-comp-snackbar-close-hover", role: "Cerrar · Hover", usage: "State layer de hover sobre el botón de cierre." },
    { token: "--md-comp-snackbar-close-press", role: "Cerrar · Pressed", usage: "State layer al presionar el botón de cierre." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter — mensaje (13.5px)." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-sm", role: "Contenedor", usage: "Redondeo de las esquinas." },
  ]},
  { category: "Elevación", rows: [
    { token: "--shadow-lg", role: "Contenedor", usage: "Sombra flotante del snackbar." },
  ]},
]
export function SnackbarTokens() { return <TokenPanel groups={SNACKBAR_TOKENS} /> }

const TOOLTIP_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-inverse-surface", role: "Contenedor", usage: "Fondo del tooltip." },
    { token: "--color-inverse-on-surface", role: "Texto", usage: "Texto sobre el fondo invertido." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter — texto." },
    { token: "--text-label", role: "Etiqueta", usage: "Tamaño del texto del tooltip." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "px-3 · py-1.5", role: "Padding", usage: "12px horizontal · 6px vertical." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius", role: "Contenedor", usage: "Redondeo de las esquinas." },
  ]},
  { category: "Elevación", rows: [
    { token: "--shadow-md", role: "Contenedor", usage: "Sombra del tooltip flotante." },
  ]},
  { category: "Movimiento", rows: [
    { token: "fade-in-0 / zoom-in-95", role: "Entrada", usage: "Aparición (fade + zoom); revierte al cerrar." },
  ]},
]
export function TooltipTokens() { return <TokenPanel groups={TOOLTIP_TOKENS} /> }

const SEARCH_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-surface-container-high", role: "Contenedor", usage: "Fondo base de la search-bar." },
    { token: "--color-border", role: "Borde", usage: "Borde de la barra y separadores del view." },
    { token: "--color-on-surface", role: "Texto", usage: "Texto ingresado e ícono de búsqueda." },
    { token: "--color-on-surface-variant", role: "Placeholder", usage: "Placeholder, íconos trailing y de resultados." },
    { token: "--color-secondary", role: "Foco", usage: "Caret y borde en focus-within." },
    { token: "--color-card", role: "Contenedor · View", usage: "Fondo del panel search-view." },
  ]},
  { category: "Componente", note: "tier md.comp — alias --color-search-field-*", rows: [
    { token: "--md-comp-search-field-hover", role: "Hover", usage: "Fondo de la barra en hover." },
    { token: "--md-comp-search-field-focus", role: "Focus", usage: "Fondo de la barra en focus-within." },
    { token: "--md-comp-search-field-border-hover", role: "Borde · Hover", usage: "Énfasis de borde en hover." },
    { token: "--md-comp-search-disabled-bg", role: "Disabled · Fondo", usage: "Fondo del campo deshabilitado." },
    { token: "--md-comp-search-disabled-text", role: "Disabled · Texto", usage: "Texto del campo deshabilitado." },
  ]},
  { category: "Estado", rows: [
    { token: "--color-nav-hover", role: "Resultado · Hover", usage: "Fondo azul del row de resultado en hover." },
    { token: "--color-on-surface-state-hover", role: "Back · Hover", usage: "State layer del botón de retroceso del view." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter — input." },
    { token: "--text-body-lg", role: "Input", usage: "Tamaño del texto ingresado." },
    { token: "--text-body-md", role: "Resultado", usage: "Tamaño del texto de cada resultado." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "px-4 · gap-4", role: "Barra", usage: "Padding 16px y gap 16px entre ícono, input y trailing." },
    { token: "py-3 · gap-3", role: "Resultado", usage: "Relleno vertical y gap de cada row (12px)." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-full", role: "Barra", usage: "Search-bar completamente redondeada." },
    { token: "rounded-[28px]", role: "View", usage: "Panel search-view (rows 27px en extremos)." },
  ]},
  { category: "Elevación", rows: [
    { token: "--shadow-lg", role: "View", usage: "Sombra flotante del panel search-view." },
  ]},
  { category: "Movimiento", rows: [
    { token: "--duration-fast", role: "Transición", usage: "Fondo/borde en hover y focus (ease-in-out)." },
  ]},
]
export function SearchTokens() { return <TokenPanel groups={SEARCH_TOKENS} /> }

const CAROUSEL_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-surface", role: "Botón nav", usage: "Fondo de los botones prev/next." },
    { token: "--color-surface-variant", role: "Botón nav · Hover", usage: "Fondo de los botones en hover." },
    { token: "--color-border", role: "Borde", usage: "Borde de los botones de navegación." },
    { token: "--color-fg", role: "Ícono", usage: "Chevron de los botones." },
  ]},
  { category: "Estado", rows: [
    { token: "disabled:opacity-30", role: "Disabled", usage: "Botón atenuado cuando no hay más slides." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "gap-4", role: "Gap", usage: "Separación entre slides (16px)." },
    { token: "left-2 / right-2", role: "Offset nav", usage: "Distancia de los botones a los bordes (8px)." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-full", role: "Botón nav", usage: "Botones de navegación circulares." },
  ]},
  { category: "Elevación", rows: [
    { token: "--shadow-sm", role: "Botón nav", usage: "Sombra sutil de los botones." },
  ]},
  { category: "Movimiento", rows: [
    { token: "transition-colors", role: "Nav · Hover", usage: "Transición de color de los botones." },
  ]},
]
export function CarouselTokens() { return <TokenPanel groups={CAROUSEL_TOKENS} /> }

const DATE_PICKER_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-surface", role: "Contenedor", usage: "Fondo del calendario." },
    { token: "--color-border", role: "Borde", usage: "Borde del contenedor." },
    { token: "--color-fg", role: "Texto", usage: "Mes, días y chevrons." },
    { token: "--color-fg-subtle", role: "Texto secundario", usage: "Encabezados de semana y días fuera del mes." },
    { token: "--color-primary / --color-on-primary", role: "Día seleccionado", usage: "Fondo y texto del día seleccionado." },
    { token: "--color-primary-container / --color-on-primary-container", role: "Rango", usage: "Días intermedios de un rango." },
  ]},
  { category: "Estado", rows: [
    { token: "--color-surface-variant", role: "Día · Hover", usage: "Fondo del día y de la navegación en hover." },
    { token: "--color-focus-ring", role: "Foco", usage: "Anillo de foco del día (focus-visible)." },
    { token: "disabled:opacity-30 / outside:opacity-40", role: "Disabled / fuera", usage: "Día deshabilitado o de mes adyacente atenuado." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-heading", role: "Mes", usage: "Epilogue — etiqueta del mes (semibold)." },
    { token: "--text-body-md", role: "Mes", usage: "Tamaño de la etiqueta del mes." },
    { token: "--text-body-sm", role: "Día", usage: "Tamaño del número de cada día." },
    { token: "--text-label", role: "Semana", usage: "Encabezados de día de semana." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "p-3", role: "Padding", usage: "Relleno interno (12px)." },
    { token: "w-9 · h-9", role: "Celda", usage: "Tamaño de cada celda de día (36px)." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-lg", role: "Contenedor", usage: "Redondeo del contenedor." },
    { token: "--radius", role: "Día", usage: "Redondeo de cada botón de día y navegación." },
  ]},
  { category: "Movimiento", rows: [
    { token: "transition-colors", role: "Día · Hover", usage: "Transición de color en hover." },
  ]},
]
export function DatePickerTokens() { return <TokenPanel groups={DATE_PICKER_TOKENS} /> }

/* ─────────────────────────── Actions / misc / domain ─────────────────────────── */
const SEG_BTN_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-primary-container", role: "Selección (fondo)", usage: "Fondo del segmento seleccionado." },
    { token: "--color-on-primary-container", role: "Selección (texto)", usage: "Etiqueta del segmento seleccionado." },
    { token: "--color-on-surface-variant", role: "Sin seleccionar", usage: "Etiqueta de segmentos no seleccionados." },
    { token: "--color-outline-variant", role: "Borde del grupo", usage: "Marco tenue del contenedor del grupo." },
  ]},
  { category: "Estado", rows: [
    { token: "--color-on-surface-state-hover", role: "Hover (sin selección)", usage: "State layer on-surface 8% en hover del segmento no seleccionado." },
    { token: "--color-on-surface-state-press", role: "Pressed (sin selección)", usage: "State layer on-surface 10% al presionar." },
    { token: "--color-on-primary-container (color-mix)", role: "Hover/Pressed (selección)", usage: "Capa 8/10% sobre primary-container en el segmento seleccionado." },
    { token: "--color-focus-ring", role: "Foco", usage: "Anillo de foco (focus-visible)." },
    { token: "opacidad 38%", role: "Disabled", usage: "Grupo completo atenuado vía :has(:disabled)." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter — etiqueta." },
    { token: "--text-body-sm", role: "Tamaño md", usage: "Etiqueta media; semibold al seleccionar." },
    { token: "--text-caption / --text-body-md", role: "Tamaño sm / lg", usage: "Etiqueta chica (caption) y grande (body-md)." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "p-[3px] · gap-[2px]", role: "Grupo", usage: "Padding interno 3px y separación de 2px entre segmentos." },
    { token: "px-4 · py-1.5 (md)", role: "Segmento", usage: "10/4px (sm) · 16/6px (md) · 20/8px (lg)." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-full", role: "Píldora", usage: "Grupo y segmentos con forma de píldora." },
  ]},
  { category: "Movimiento", rows: [
    { token: "transition-colors", role: "Transición", usage: "Transición de color en hover/selección." },
  ]},
]
export function SegBtnTokens() { return <TokenPanel groups={SEG_BTN_TOKENS} /> }

const LOADING_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-surface-variant", role: "Track", usage: "Fondo de la pista (barra / círculo base)." },
    { token: "--color-primary", role: "Indicador", usage: "Barra o arco de progreso." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-full", role: "Extremos", usage: "Pista e indicador con extremos redondeados." },
  ]},
  { category: "Movimiento", rows: [
    { token: "transition-transform", role: "Determinado", usage: "Barra anima translateX; circular anima stroke-dashoffset." },
    { token: "animate-[emb-linear] / animate-spin", role: "Indeterminado", usage: "Barra desliza (1.4s); circular gira." },
  ]},
]
export function LoadingTokens() { return <TokenPanel groups={LOADING_TOKENS} /> }

const EMPTY_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-fg-muted", role: "Ícono / descripción", usage: "Ícono y texto de descripción." },
    { token: "--color-fg-subtle", role: "Título", usage: "Color del título." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-heading", role: "Familia (título)", usage: "Epilogue — título (semibold)." },
    { token: "--text-heading-md", role: "Título", usage: "Tamaño del título." },
    { token: "--text-body-lg", role: "Descripción", usage: "Texto de apoyo (interlineado 1.6, máx. 400px)." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "py-12 · px-6", role: "Contenedor", usage: "48px vertical · 24px horizontal, contenido centrado." },
    { token: "mb-4 · mb-2 · mb-5", role: "Ritmo vertical", usage: "Ícono→título, título→descripción, descripción→acción." },
  ]},
]
export function EmptyTokens() { return <TokenPanel groups={EMPTY_TOKENS} /> }

const KANBAN_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-surface", role: "Tarjeta (fondo)", usage: "Fondo de la tarjeta (sobre el contenedor Card)." },
    { token: "--color-border", role: "Borde", usage: "Borde de la tarjeta (heredado de Card)." },
    { token: "--color-fg", role: "Título", usage: "Título de la tarjeta (semibold)." },
    { token: "--color-fg-subtle", role: "Meta / columna", usage: "Metadata y encabezado de columna." },
    { token: "--color-surface-variant", role: "Contador columna", usage: "Fondo del badge contador." },
    { token: "--color-primary-container / --color-on-primary-container", role: "Avatar", usage: "Fondo e iniciales del avatar." },
  ]},
  { category: "Estado", rows: [
    { token: "--shadow-sm", role: "Hover", usage: "Sombra sutil al pasar el mouse (hover:shadow-sm)." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter — título y meta." },
    { token: "--text-body-sm", role: "Título", usage: "Título de la tarjeta (semibold)." },
    { token: "--text-label", role: "Meta", usage: "Metadata de la tarjeta." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "px-3 · py-3", role: "Tarjeta", usage: "Padding de la tarjeta (12px)." },
    { token: "gap-2 · mb-2", role: "Ritmo interno", usage: "Separación entre filas y bloques (8px)." },
    { token: "h-6 · w-6", role: "Avatar", usage: "Tamaño del avatar (24px)." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-lg", role: "Contenedor", usage: "Radio de la tarjeta (heredado de Card)." },
    { token: "--radius-full", role: "Avatar / contador", usage: "Avatar y badge circulares." },
  ]},
  { category: "Movimiento", rows: [
    { token: "transition-shadow", role: "Transición", usage: "Transición de sombra en hover." },
  ]},
]
export function KanbanTokens() { return <TokenPanel groups={KANBAN_TOKENS} /> }

const VACANCY_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-surface", role: "Tarjeta (fondo)", usage: "Fondo de la tarjeta (sobre el contenedor Card)." },
    { token: "--color-border", role: "Borde", usage: "Borde de la tarjeta (heredado de Card)." },
    { token: "--color-primary-container / --color-on-primary-container", role: "Ícono", usage: "Fondo e ícono/iniciales circular." },
    { token: "--color-fg", role: "Nombre", usage: "Nombre de la vacante (semibold)." },
    { token: "--color-fg-subtle", role: "Departamento / meta", usage: "Departamento y metadata." },
    { token: "--color-surface-variant", role: "Hover (fondo)", usage: "Fondo al pasar el mouse (hover:bg-surface-variant)." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter — nombre y meta." },
    { token: "--text-body-sm", role: "Nombre", usage: "Nombre de la vacante (semibold)." },
    { token: "--text-label", role: "Meta", usage: "Departamento y metadata." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "px-4 · py-3", role: "Tarjeta", usage: "Padding de la tarjeta (16/12px)." },
    { token: "gap-3", role: "Ícono + contenido", usage: "Separación ícono/texto (12px)." },
    { token: "h-10 · w-10", role: "Ícono", usage: "Tamaño del ícono circular (40px)." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-lg", role: "Contenedor", usage: "Radio de la tarjeta (heredado de Card)." },
    { token: "--radius-full", role: "Ícono", usage: "Ícono/iniciales circular." },
  ]},
  { category: "Movimiento", rows: [
    { token: "transition-colors", role: "Hover", usage: "Transición de color de fondo en hover." },
  ]},
]
export function VacancyTokens() { return <TokenPanel groups={VACANCY_TOKENS} /> }

const PERSON_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-surface", role: "Tarjeta (fondo)", usage: "Fondo de la tarjeta (sobre el contenedor Card)." },
    { token: "--color-border", role: "Borde", usage: "Borde de la tarjeta (heredado de Card)." },
    { token: "--color-fg", role: "Nombre", usage: "Nombre de la persona (semibold)." },
    { token: "--color-fg-subtle", role: "Rol / meta", usage: "Rol y metadata." },
    { token: "--color-surface-variant", role: "Hover (fondo)", usage: "Fondo al pasar el mouse (hover:bg-surface-variant)." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter — nombre y rol." },
    { token: "--text-body-sm", role: "Nombre", usage: "Nombre de la persona (semibold)." },
    { token: "--text-label", role: "Rol / meta", usage: "Rol y metadata." },
  ]},
  { category: "Espaciado", note: "grilla de 4px", rows: [
    { token: "p-5", role: "Tarjeta", usage: "Padding de la tarjeta (20px), columna centrada." },
    { token: "gap-2", role: "Ritmo interno", usage: "Separación entre avatar, texto y acciones (8px)." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-lg", role: "Contenedor", usage: "Radio de la tarjeta (heredado de Card)." },
  ]},
  { category: "Movimiento", rows: [
    { token: "transition-colors", role: "Hover", usage: "Transición de color de fondo en hover." },
  ]},
]
export function PersonTokens() { return <TokenPanel groups={PERSON_TOKENS} /> }

/* ─────────────────────────── Navigation & shell ─────────────────────────── */
const NAV_SHARED_COMPONENT: TokenGroup = { category: "Componente", note: "tier md.comp — familia de navegación (alias --color-nav-*)", rows: [
  { token: "--md-comp-nav-hover", role: "Hover", usage: "Fondo del ítem en hover (tinte secondary-container 45%)." },
  { token: "--md-comp-nav-hover-content", role: "Hover", usage: "Etiqueta e ícono en hover (azul secondary)." },
  { token: "--md-comp-nav-press", role: "Pressed", usage: "Fondo del ítem presionado (70%)." },
  { token: "--md-comp-nav-selected", role: "Selected", usage: "Fondo del ítem activo (secondary-container 100%)." },
  { token: "--md-comp-nav-selected-content", role: "Selected", usage: "Etiqueta e ícono del ítem activo (on-secondary-container)." },
]}
const NAV_SHARED_STATE: TokenGroup = { category: "Estado", note: "compartido con menús, listas y sidebars", rows: [
  { token: "--color-nav-hover (+ -content)", role: "Hover", usage: "Ítem resaltado (fondo azul suave + etiqueta azul)." },
  { token: "--color-nav-press", role: "Pressed", usage: "Ítem presionado (transitorio)." },
  { token: "--color-focus-ring", role: "Foco", usage: "Anillo de foco por teclado." },
  { token: "--color-nav-selected (+ -content)", role: "Selected", usage: "Ítem activo." },
]}

const LIST_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-card", role: "Superficie", usage: "Fondo del contenedor de la lista." },
    { token: "--color-on-surface", role: "Contenido", usage: "Headline del ítem." },
    { token: "--color-on-surface-variant", role: "Contenido secundario", usage: "Texto de apoyo (supporting)." },
  ]},
  { ...NAV_SHARED_COMPONENT, note: "tier md.comp — familia de navegación (alias --color-nav-*); solo ítems asButton" },
  NAV_SHARED_STATE,
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter — headline y apoyo." },
    { token: "--text-body-md", role: "Headline", usage: "Headline del ítem." },
    { token: "--text-caption", role: "Apoyo", usage: "Texto de apoyo (~12.5px)." },
  ]},
  { category: "Espaciado", rows: [
    { token: "min-h-14", role: "Alto mín.", usage: "Altura mínima del ítem (56px, anatomía MD3)." },
    { token: "px-4 · py-2.5", role: "Padding", usage: "16px horizontal · 10px vertical." },
    { token: "gap-0.5", role: "Gap", usage: "2px entre headline y apoyo." },
  ]},
  { category: "Movimiento", rows: [
    { token: "transition-colors", role: "Transición", usage: "Fondo/color en hover, focus y pressed (ítems asButton)." },
  ]},
]
export function ListTokens() { return <TokenPanel groups={LIST_TOKENS} /> }

const NAV_DRAWER_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--ds-sidebar-bg", role: "Superficie", usage: "Fondo del drawer contextual (chrome del docs-shell)." },
    { token: "--ds-sidebar-border", role: "Borde", usage: "Borde derecho y separadores de sección." },
    { token: "--ds-text-2", role: "Contenido", usage: "Etiqueta base del ítem (.ds-nav-item / .ds-nav-solo)." },
    { token: "--ds-text-3", role: "Sección", usage: "Títulos de grupo (overline en mayúsculas)." },
  ]},
  NAV_SHARED_COMPONENT,
  NAV_SHARED_STATE,
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter — etiquetas de ítem." },
    { token: "--text-label", role: "Ítem", usage: "Etiqueta del ítem (~13px)." },
    { token: "--text-overline", role: "Sección", usage: "Título de grupo (~10px, mayúsculas)." },
  ]},
  { category: "Espaciado", rows: [
    { token: "6px 12px 6px 20px", role: "Padding ítem", usage: "Ítem con 20px de sangría para el ícono." },
    { token: "gap 8px", role: "Gap", usage: "Ícono (14×14) y etiqueta." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-md", role: "Ítem", usage: "Esquinas del ítem (8px) para hover/selected." },
  ]},
  { category: "Movimiento", rows: [
    { token: "--duration-fast", role: "Transición", usage: "Background y color en hover/pressed/selected (~0.12s)." },
  ]},
]
export function NavDrawerTokens() { return <TokenPanel groups={NAV_DRAWER_TOKENS} /> }

const NAV_BAR_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--sidebar-bg", role: "Superficie", usage: "Fondo de la barra lateral (app-shell)." },
    { token: "--border", role: "Borde", usage: "Borde derecho y separadores." },
    { token: "--text-secondary", role: "Contenido", usage: "Etiqueta base del ítem (.nav-item)." },
    { token: "--text-muted", role: "Sección", usage: "Etiquetas de sección (overline)." },
    { token: "--interactive-light / --interactive", role: "Badge", usage: "Contador de ítem (.nav-badge)." },
  ]},
  NAV_SHARED_COMPONENT,
  NAV_SHARED_STATE,
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter — etiquetas de ítem." },
    { token: "--font-size-body-md", role: "Ítem", usage: "Etiqueta del ítem (.nav-item)." },
    { token: "--font-size-label", role: "Sub-ítem", usage: "Etiqueta de sub-ítem." },
  ]},
  { category: "Espaciado", rows: [
    { token: "8px 12px", role: "Padding ítem", usage: "Ítem; gap 10px entre ícono (16×16) y etiqueta." },
    { token: "6px 12px", role: "Sub-ítem", usage: "Padding de sub-ítem (20px de sangría de grupo)." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-md", role: "Ítem", usage: "Esquinas del ítem para hover/selected." },
    { token: "--radius-full", role: "Badge", usage: "Contador de ítem redondeado." },
  ]},
  { category: "Movimiento", rows: [
    { token: "--duration-fast", role: "Transición", usage: "Background y color en hover/selected." },
  ]},
]
export function NavBarTokens() { return <TokenPanel groups={NAV_BAR_TOKENS} /> }

const NAV_CARD_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--color-surface-container", role: "Superficie", usage: "Fondo de la card." },
    { token: "--color-on-surface / -variant", role: "Contenido", usage: "Título y descripción/tag." },
    { token: "--color-primary", role: "Acento hover", usage: "Flecha y sombra tintada en hover." },
    { token: "--color-surface-variant", role: "Visual", usage: "Fondo del área ilustrada (variantes usan *-container)." },
  ]},
  { category: "Estado", note: "la Nav Card usa hover propio de card (elevación), NO la familia --color-nav-*", rows: [
    { token: "transform: translateY(-2px)", role: "Hover", usage: "Elevación de la card al pasar el mouse." },
    { token: "box-shadow (primary 10%)", role: "Hover", usage: "Sombra tintada de acento en hover." },
    { token: "--color-primary", role: "Hover", usage: "Flecha vira a acento (fondo primary 12% + ícono primary)." },
    { token: "--color-focus-ring", role: "Foco", usage: "Anillo de foco por teclado." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-heading", role: "Título", usage: "Epilogue — título (weight 800)." },
    { token: "--font-body", role: "Descripción", usage: "Inter — descripción (~12.5px)." },
    { token: "--font-mono", role: "Tag", usage: "DM Mono — tag/overline (mayúsculas)." },
  ]},
  { category: "Espaciado", rows: [
    { token: "20px 20px 0", role: "Header", usage: "Padding del header (tag + flecha)." },
    { token: "14px 20px 20px", role: "Content", usage: "Padding del contenido (título + descripción)." },
  ]},
  { category: "Radio", rows: [
    { token: "14px", role: "Card", usage: "Esquinas del contenedor." },
    { token: "999px", role: "Tag / flecha", usage: "Tag pill y botón de flecha circular." },
  ]},
  { category: "Elevación", rows: [
    { token: "box-shadow 0 8px 28px (primary 10%)", role: "Hover", usage: "Elevación en hover (reposo sin sombra)." },
  ]},
  { category: "Movimiento", rows: [
    { token: "transition .15s ease", role: "Transición", usage: "Transform y box-shadow en hover." },
  ]},
]
export function NavCardTokens() { return <TokenPanel groups={NAV_CARD_TOKENS} /> }

const TOPBAR_TOKENS: TokenGroup[] = [
  { category: "Color", rows: [
    { token: "--sidebar-bg", role: "Superficie", usage: "Fondo de la barra superior (comparte token con el sidebar)." },
    { token: "--border", role: "Borde", usage: "Borde inferior y bordes de botones/notif." },
    { token: "--bg", role: "Control", usage: "Fondo de botones secundarios, notif y search field." },
    { token: "--text-secondary / --text-muted", role: "Contenido", usage: "Texto de botones y breadcrumb." },
    { token: "--interactive / --color-on-primary", role: "Notif badge", usage: "Fondo del badge de notificación y su número." },
  ]},
  { category: "Tipografía", rows: [
    { token: "--font-body", role: "Familia", usage: "Inter — botones, breadcrumb y avatar." },
    { token: "--font-size-label", role: "Controles", usage: "Botones, breadcrumb y avatar-label." },
    { token: "--font-size-caption", role: "Avatar", usage: "Iniciales dentro del avatar." },
  ]},
  { category: "Espaciado", rows: [
    { token: "0 28px", role: "Padding", usage: "Padding horizontal; altura = --topbar-height." },
    { token: "gap 12px", role: "Gap", usage: "Separación entre acciones de la derecha." },
    { token: "8px 16px", role: "Botón", usage: "Padding de .topbar-btn; notif = 36×36px." },
  ]},
  { category: "Radio", rows: [
    { token: "--radius-md", role: "Controles", usage: "Botones y caja de notificación." },
    { token: "50%", role: "Avatar / badge", usage: "Avatar y badge redondos." },
  ]},
  { category: "Movimiento", rows: [
    { token: "--duration-fast", role: "Transición", usage: "Background de botones en hover." },
  ]},
]
export function TopbarTokens() { return <TokenPanel groups={TOPBAR_TOKENS} /> }
