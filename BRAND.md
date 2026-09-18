# BRAND.md — la marca de Amalgama

`design.md` dice **cómo se ve** el sistema. `COMPOSICION.md` dice **qué forma tiene** la página.
Este archivo dice **qué significa**: de dónde sale el color, cómo hablamos, qué es el logo y qué
no se toca. Es la capa que antes vivía aparte, en el design system de marca sobre el
*Manual de Marca Amalgama* (rediseño 2022). Desde septiembre de 2026 vive acá, y Embassy es el
único sistema.

Orden de lectura: `CLAUDE.md` → **`BRAND.md`** → `design.md` → `COMPOSICION.md`.

---

## 1. Quiénes somos

Amalgama es un estudio de producto digital argentino / latinoamericano especializado en
**Welltech** — salud, fitness y bienestar. Trabaja con coaches, clínicas, plataformas de salud y
marcas de entrenamiento: apps mobile, dashboards SaaS, sitios, plataformas de cursos, companions de
dispositivos.

El rediseño de 2022 trajo una **metáfora de galaxia**: la marca es un planetita con sombrero — un
anillo que se lee como una sonrisa de costado — y todo lo demás cuelga de esa historia de construir
universos. La marca es **precisión técnica con cercanía**: segura, un poco audaz, nunca fría ni
corporativa genérica.

De la encuesta interna que originó el rediseño salieron cinco palabras, y siguen siendo la vara:
**innovadores, tecnológicos, de calidad, cercanos y divertidos.**

---

## 2. Voz y contenido

Una voz de humor suave, bilingüe por default, en primera persona del plural. Suena a un equipo de
amigos que además hace software.

- **Idioma.** El español es la lengua madre; el inglés se usa para nombres de producto, títulos de
  sección y trabajo hacia clientes. La marca cambia de idioma a mitad de frase sin pedir permiso
  («Color · Do's and Dont's», «para entregables»). En **UI de producto e interno**: español
  rioplatense — *«Guardá los cambios»*, no *«Guarde los cambios»*.
- **Persona.** *Nosotros*. Nunca *yo*, casi nunca *vos* directo. La marca habla como colectivo:
  *«somos»*, *«queríamos mostrarnos»*.
- **Casing.** Sentence case en todo, títulos incluidos. Las MAYÚSCULAS quedan para dos cosas y
  ninguna más: el overline tracked de una lámina (`PIVOT`, `SWISH 365`) y los logotipos de cliente.
  Un label de UI va en sentence case.
- **Puntuación.** Apóstrofe tipográfica curva (’). Rayas y dos puntos antes que paréntesis.
- **Humor.** Suave, de adentro, consciente de sí mismo. El ejemplo canónico está en las reglas de
  color del Manual: *«No utilizar el amarillo sobre el azul o celeste. No todos somos hinchas de
  Boca :)»*. Cortos, nunca a costa de quien lee, siempre en contexto.
- **Emoticón.** Un `:)` de texto, ocasional, para cerrar. **Nunca emoji** — ni en UI ni en
  material. Y nunca un `:)` en un mensaje de error.
- **CTAs.** Verbo primero, cortos y concretos: *Inscribirme*, *Empezar*, *Explorar proyectos*,
  *Hablemos*, *Crear vacante*.
- **Estados vacíos.** Ofrecen la acción siguiente, nunca culpan.
- **Errores.** Diagnóstico + arreglo, una oración. Sin disculpas y sin `:)`.
- **Sin relleno.** *«Bienvenido a nuestra plataforma»*, *«Impulsá tu negocio»*, *«Descubrí más»*
  son placeholders que nadie reemplazó.

---

## 3. Los nombres del color

Los colores de Amalgama tienen nombre propio, y el nombre es parte de la marca: es como los
nombramos en voz alta. El **token** es la fuente de verdad técnica; el nombre vive acá y en la nota
de uso del token.

| Nombre | Hex | Token de Embassy |
|---|---|---|
| **Black Hole** | `#01164D` | `--primary-900` → `--color-primary`, `--text-primary` |
| **Agile Blue** | `#4F80FF` | `--secondary-900` → `--color-secondary`, `--interactive`, `--color-focus` |
| **Dusk** | `#1C2438` | `--neutral-700` (`#1C202C`) |
| **Ink** | `#2A2F32` | primitiva `--ink` → rol `--text-prose` — prosa larga de colateral |
| **Moon Grey** | `#B0B4CD` | `--neutral-100` (`#BFC1C8`) |
| **Mist** | `#E4E7EC` | `--neutral-50` (`#EAEBED`) |
| **Fog** | `#F1F3FA` | `--neutral-30` (`#F3F4F6`) |
| **Slate** | `#7A8390` | `--neutral-300` (`#747989`) |
| **Milky Way** | `#FFFFFF` | `--neutral-white` |
| **Hot Pink** | `#FE566A` | `--color-accent-hot-pink` |
| **Chelo Yellow** | `#FFC700` | `--color-accent-chelo-yellow` |
| **Kika Green** | `#67B9A4` | `--color-accent-kika-green` |
| **Pink Sebiche** | `#F1A7A3` | `--accent-pink-sebiche` — documentado, no sancionado |
| **Wish** | `#7158F4` | `--tertiary-900` |

> Los neutrales del Manual y los de Embassy **no son el mismo hex**: la rampa de Embassy está
> calibrada para pasar AA en claro y en oscuro, y esa calibración gana. El nombre sobrevive, el
> valor se alinea. Si una pieza impresa necesita el hex exacto del Manual, está en §7.

### Reglas de color (del Manual, y son normativas)

- **Máximo dos acentos** en una composición. Uno si es para tipografía.
- Un acento **nunca es fondo dominante** ni color de texto corrido.
- **Nunca amarillo sobre azul o celeste.** *No todos somos hinchas de Boca :)*
- El azul es el primario y manda la jerarquía. El navy ancla; el acento puntúa.
- El color **nunca es el único portador de significado**: un estado lleva palabra o ícono.

---

## 4. Tipografía de marca

| Rol | Familia | Token |
|---|---|---|
| Títulos, overline, botones | **Epilogue** | `--font-heading` |
| Párrafos y UI | **Manrope** | `--font-body` |
| Código y labels técnicos | **DM Mono** | `--font-mono` |
| **Logotipo, y sólo el logotipo** | **Poppins** SemiBold / Bold | — *(no hay token: el logo es un archivo)* |

El Manual es explícito en la p. 23: *«La tipografía Poppins solo se utiliza para el logo de
marca.»* No hay un caso en que Poppins sea correcta en otro lado.

**Karla Italic** aparece en el Manual para pull-quotes y call-outs de portfolio. **No entró al
sistema.** Si una pieza la necesita, es una excepción de esa pieza y se declara ahí, no un token.

**Manrope no tiene itálica.** Un `<em>` sale oblicuo sintético. Ver `design.md` §6.2.

---

## 5. El logo

El lockup es **el planeta con sombrero** más el wordmark `amalgama` en minúscula.

Los archivos canónicos son SVG con fondo transparente:
`https://amalgama-static-sites.s3.us-east-1.amazonaws.com/amalgama-logos/svgs/`

| Archivo | Uso |
|---|---|
| `amalgama-logo-navy-text-blue-icon.svg` | **default**, fondos claros |
| `amalgama-logo-navy-text-navy-blue-icon.svg` | fondos claros, más contenido |
| `amalgama-logo-blue-text-blue-icon.svg` | monocromo azul, fondos oscuros / navy |
| `amalgama-logo-white-text-blue-icon.svg` | fondos oscuros con acento de color |
| `amalgama-logo-white-text-white-icon.svg` | monocromo blanco, fondos oscuros |
| `amalgama-icon-{blue,navy,white}.svg` | sólo ícono — favicons, avatares, acentos cuadrados |
| `amalgama-wordmark-{blue,navy,white}.svg` | sólo wordmark |

En el repo hay copias PNG en `logos/` (horizontal, vertical, wordmark, icon).

**Reglas.** Nunca estirar, recolorear, sombrear ni apoyar sobre un patrón. Nunca una variante con
fondo incrustado: si hace falta fondo, se dibuja con CSS (token navy, radio del sistema, padding) y
el SVG transparente va encima. Clearspace ≥ 16px; ancho mínimo 120px en horizontal. Si un caso no
está cubierto, **se pide el archivo** — no se inventa un nombre ni se aproxima la marca a mano.

Para que el logo siga el modo oscuro se mira **`data-theme`, no `prefers-color-scheme`**: el tema en
Embassy es el atributo en `<html>`, así que un `<picture>` con media query se queda en la variante
equivocada cada vez que alguien cambia el tema a mano. Ver `design.md` §6.6 para el patrón.

---

## 6. Ilustración, imagen y lámina

- **La galaxia es nuestra única ilustración repetible.** Órbitas, anillos, un planetita sonriente,
  líneas de construcción punteadas. Dibujo a mano, ocasional, nunca de relleno. Texturas y grano
  **no** son un motivo de la marca.
- **Degradés:** tres, y salen de las primitivas de marca (`--gradient-brand`, `--gradient-surface`,
  `--gradient-glow`). Un degradé es una **superficie**. El *soft-spot* radial que se junta detrás de
  un producto en un hero es la excepción documentada.
- **La capa espacial** (`css/space.css`) es identidad de estudio y va sólo en **nuestras**
  superficies. **Nunca en producto de cliente** — es la falla `H12` y es bloqueante.
- **Imágenes: sólo material real.** Capturas de producto, fotos del trabajo o del equipo, diagramas
  propios. Nunca stock, isométrico, render 3D ni un degradé haciendo de foto. Todas llevan el marco
  `.media`.
- **Galería.** Cada trabajo de cliente es una foto monocroma teñida sobre una tarjeta de color
  (bordó, teal, ocre, bosque, crema). La paleta de la Galería es cálida y saturada, con el navy de
  ancla. Los mockups de dispositivo llevan un borde interior blanco de 3px.
- **Anatomía de una lámina.** Master 1920×1080 para marketing y decks; 1440×1024 para páginas de
  manual; 390×844 para mobile. Márgenes laterales generosos: 148–167px sobre 1920 (~8%). Una regla
  horizontal de 1px `--color-outline` separa el bloque de título del cuerpo, y una **pestaña de
  42×4px** en Hot Pink o navy, al ras de la izquierda, marca la sección actual. El número de página
  vive en la esquina, en caption navy («p. 04»).

---

## 7. Imprenta

Capturados del Manual. **Verificar antes de cualquier aplicación física.**

| Color | Pantone |
|---|---|
| Agile Blue | Pantone Blue Process (CMYK 85 35 0 0) |
| Hot Pink | Pantone 282c |
| Chelo Yellow | Pantone 184c |
| Kika Green | Pantone 3258c |

---

## 8. El design system de marca, jubilado

Hasta septiembre de 2026 convivían dos sistemas: éste (marca, en Claude Design, con su
`colors_and_type.css` y tokens `--amg-*`) y Embassy (producto). Se fusionaron en **uno**, y el
`colors_and_type.css` **ya no es fuente de nada**: lo que decía está repartido entre
`css/variables.css` (los valores) y este archivo (el significado).

Las rampas azules de los dos sistemas ya eran **los mismos hexes** con otro índice; no hubo que
elegir nada ahí. Lo que sigue es el mapa para portar cualquier pieza que todavía lo consuma —
decks, los tres UI kits, una landing vieja.

### Paleta

| `--amg-*` | Valor | Embassy |
|---|---|---|
| `primary-base`, `primary-800` | `#01164D` | `--primary-900` |
| `primary-600` | `#1C2438` | `--neutral-700` (`#1C202C`) |
| `primary-400` | `#7299FF` | `--secondary-700` |
| `primary-200` | `#B9CCFF` | `--secondary-300` |
| `primary-100` | `#DCE6FF` | `--secondary-100` |
| `primary-050` | `#EDF2FF` | `--secondary-50` |
| `secondary-base`, `secondary-800` | `#4F80FF` | `--secondary-900` |
| `secondary-600` | `#7299FF` | `--secondary-700` |
| `secondary-400` | `#95B3FF` | `--secondary-500` |
| `secondary-200` / `-100` / `-050` | — | `--secondary-300` / `-100` / `-50` |
| `hot-pink` | `#FE566A` | `--color-accent-hot-pink` |
| `hot-pink-soft` | `#FE7888` | derivar con `color-mix()` del acento |
| `chelo-yellow` | `#FFC700` | `--color-accent-chelo-yellow` |
| `kika-green` | `#67B9A4` | `--color-accent-kika-green` |
| `pink-sebiche` | `#F1A7A3` | `--accent-pink-sebiche` *(no sancionado)* |
| `sky`, `data` | `#49A4FF` | `--accent-sky` *(no sancionado)* · en charts, `--chart-1` |
| `lime` | `#E0FF4F` | `--accent-lime` *(no sancionado)* |
| `moon-grey` | `#B0B4CD` | `--neutral-100` |
| `dusk` | `#1C2438` | `--neutral-700` |
| `white` | `#FFFFFF` | `--neutral-white` |
| `off-white`, `cloud` | `#FDFDFE`, `#FAFBFD` | `--neutral-10` |
| `fog` | `#F1F3FA` | `--neutral-30` |
| `mist` | `#E4E7EC` | `--neutral-50` |
| `stone` | `#D9D9D9` | `--neutral-100` |
| `slate` | `#7A8390` | `--neutral-300` |
| `slate-dark` | `#4A536E` | `--neutral-400` |
| `ink` | `#2A2F32` | `--text-prose` *(prosa)* · `--color-on-surface` *(dentro de componentes)* — la primitiva es `--ink` |
| `ink-soft` | `#1F2025` | `--neutral-800` |
| `night` | `#0F1217` | `--neutral-900` |
| `positive`, `positive-alt` | `#28CB7D`, `#24CC71` | `--success-400` (`#28CB7C`) |
| `negative` | `#F64F5D` | `--error-400` *(exacto)* |
| `negative-alt` | `#CF122C` | `--error-900` |
| `wish` | `#7158F4` | `--tertiary-900` *(exacto)* |

### Capa semántica

| `--amg-*` semántico | Embassy |
|---|---|
| `--bg` *(blanco)* | `--card-bg` / `--color-surface-container` |
| `--bg-muted` | `--color-surface-container-low` |
| `--bg-subtle` | `--color-surface` |
| `--bg-inverse` | `--color-primary` |
| `--bg-accent-soft` | `--secondary-50` |
| `--fg` | `--text-primary` |
| `--fg-body` | `--text-prose` |
| `--fg-muted` | `--text-muted` |
| `--fg-subtle` | `--color-on-disabled` |
| `--fg-inverse` | `--text-on-dark` |
| `--fg-accent` | `--color-secondary-text` *(texto)* · `--color-secondary` *(objeto)* |
| `--fg-danger` | `--color-error-text` |
| `--border` | `--border` |
| `--border-strong` | `--color-outline` |
| `--border-accent` | `--color-secondary` |
| `--link` | `--interactive` |
| `--link-visited` `#3E66D8` | sin equivalente — Embassy no distingue visitados |
| `--focus-ring` | `--color-focus` + `--color-focus-ring` |

### Forma, espacio, sombra, tipo

| `--amg-*` | Embassy | Nota |
|---|---|---|
| `--r-xs` 4 · `--r-md` 8 · `--r-lg` 12 · `--r-xl` 16 | `--radius-sm` · `-md` · `-lg` · `-xl` | |
| `--r-sm` 6 | — | **no entra.** Usar 4 u 8 |
| `--r-2xl` 24 | `--radius-2xl` | |
| `--r-3xl` 40 | — | **no entra.** Redibujar a 24 |
| `--r-pill` 999 | `--radius-full` | en botones, vía `--radius-button` |
| `--space-1…4` | `--space-1…4` | idénticos |
| `--space-5` 24 | `--space-6` | ⚠️ el índice cambia |
| `--space-6` 32 | `--space-8` | |
| `--space-7` 48 | `--space-12` | |
| `--space-8` 64 | `--space-16` | |
| `--space-9` 96 | `--space-24` | |
| `--shadow-xs`, `--shadow-sm` | `--shadow-sm` | |
| `--shadow-md`, `--shadow-lg` | `--shadow-md`, `--shadow-lg` | valores de Embassy, con tinte navy |
| `--shadow-xl` | — | **no entra.** Usar `--shadow-lg` |
| `--font-display` | `--font-heading` | |
| `--font-body`, `--font-label` | `--font-body` | Manrope hace los dos trabajos |
| `--font-mono` *(JetBrains Mono)* | `--font-mono` *(DM Mono)* | |
| `--font-logo`, `--font-editorial` | — | Poppins sólo logo; Karla no entra |
| `--fs-display-*` | `--font-size-editorial-lg/-md/-sm` | por **rol**, no por px |
| `--fs-headline-*`, `--fs-title-*` | `--font-size-heading-xl … -xs` | idem |
| `--fs-body` 16 | `--font-size-body-editorial` *(colateral)* · `--font-size-body-md` *(producto)* | |
| `--fs-small` 14 · `--fs-caption` 12 | `--font-size-body-lg` · `--font-size-caption` | |
| `--tracking-wide`, `--tracking-button` | `--letter-spacing-overline`, `--letter-spacing-label` | escala cerrada |

> **El único cambio que puede romper en silencio es `--space-*`.** Los dos sistemas usan los mismos
> nombres del 1 al 9 y coinciden sólo hasta el 4. Una hoja vieja cargada junto a `variables.css`
> no da error: da un layout distinto. Al portar una pieza, ese es el primer grep.

### Clases

`.button` → `btn-primary` / `btn-secondary` / `btn-tertiary` · `.eyebrow` → `.overline` ·
`.link-pill`, `.logotype`, `.galeria-card` → `css/brand-collateral.css`.
