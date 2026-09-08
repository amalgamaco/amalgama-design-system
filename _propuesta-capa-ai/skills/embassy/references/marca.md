# Capa de marca — logo, voz, tema

Esta capa **no está en el repo del design system**: el repo tiene tokens y componentes, no identidad.
Es la única parte que las skills sí son dueñas de mantener. La versión pública y autocontenida de
esto vive en `design.md`; **si las dos se contradicen, alineá `design.md` y arreglá acá.**

---

## Logo

Bombita + anillo de Saturno, con el wordmark `amalgama` en minúscula.

Los assets son **SVG con fondo transparente** (preferilos siempre sobre cualquier copia raster),
servidos desde:

`https://amalgama-static-sites.s3.us-east-1.amazonaws.com/amalgama-logos/svgs/`

| Archivo | Uso |
|---|---|
| `amalgama-logo-navy-text-blue-icon.svg` | lockup completo, wordmark navy + ícono azul — **default, fondos claros** |
| `amalgama-logo-navy-text-navy-blue-icon.svg` | lockup completo, más contenido — fondos claros |
| `amalgama-logo-blue-text-blue-icon.svg` | lockup monocromo azul — fondos oscuros / navy |
| `amalgama-logo-white-text-blue-icon.svg` | wordmark blanco + ícono azul — fondos oscuros con acento |
| `amalgama-logo-white-text-white-icon.svg` | lockup monocromo blanco — fondos oscuros |
| `amalgama-icon-blue.svg` · `-navy.svg` · `-white.svg` | solo ícono — favicons, avatares, acentos cuadrados |
| `amalgama-wordmark-blue.svg` · `-navy.svg` · `-white.svg` | solo wordmark |

**Los PNG están retirados.** No uses los nombres viejos (`Amalgama-Logo+Text-*.png`,
`-Horizontal-*.png`) ni los archivos de `logos/` del repo, que quedaron de antes.
*(Pendiente de resolver: `logos/` del repo todavía tiene PNGs; hay que decidir si se reemplazan por
los SVG o se borran, para que no haya dos fuentes.)*

**Sin variantes con fondo incrustado.** Si una superficie necesita fondo detrás del logo, dibujalo
con CSS —un token navy, esquinas redondeadas, padding— y poné el SVG transparente encima.

Nunca estirar, recolorear, sombrear ni apoyar sobre patrones cargados. Clearspace ≥ 16px; ancho
mínimo 120px en horizontal. Si un caso no está cubierto acá, **pedí el archivo al usuario — no
inventes un nombre ni aproximes el logo dibujándolo.**

---

## Voz y tono

Directa, segura, orientada a la acción. Calidez sin relleno.

- Sin signos de exclamación, sin emojis, sin entusiasmo publicitario.
- CTAs cortos y concretos: *"Hablemos"*, *"Ver el trabajo"*, *"Crear vacante"*.
- Nada de copy de relleno: *"Bienvenido a nuestra plataforma"*, *"Impulsá tu negocio"*,
  *"Descubrí más"* no dicen nada.

**Idioma:**

- **UI de producto e interno** → español rioplatense, voseo. "Guardá los cambios".
- **Material comercial hacia afuera** → inglés.
- Términos técnicos en inglés (dashboard, onboarding, empty state).

Profundidad de microcopy: `guidelines/content-and-writing.md` del repo.

---

## Estrategia de tema

| Superficie | Tema |
|---|---|
| Hero / landing | banda oscura (`--primary-900` / `--primary-700`) |
| Dashboards y herramientas internas | light |
| Tablas y formularios de datos | light, con el token interactivo solo en lo accionable |
| Decks y propuestas de cliente | página light con banda de header oscura |

En dark, **`--color-primary` se invierte a blanco**: nunca lo uses para series de chart ni rellenos
grandes de color.

---

## Encuadre

Amalgama es un estudio de producto digital **Welltech** — salud, fitness, bienestar. Precisión
técnica con cercanía; seguro y un poco audaz, nunca frío ni corporativo genérico.
