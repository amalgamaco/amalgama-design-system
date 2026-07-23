/**
 * Aspect Ratio — constrains content to a fixed width/height ratio, built on
 * @radix-ui/react-aspect-ratio.
 *
 * Cuándo usar: mantener una proporción constante (thumbnails, video, imágenes de card)
 * mientras el ancho es fluido. Cuándo no: contenido cuya altura depende del texto.
 *
 * shadcn Aspect Ratio = thin re-export of the Radix primitive. Pass `ratio={16/9}`.
 * Canonical implementation.
 */
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

const AspectRatio = AspectRatioPrimitive.Root

export { AspectRatio }
