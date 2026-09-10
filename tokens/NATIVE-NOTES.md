# Lo que no cruza de CSS a React Native

> Generado por scripts/build-tokens.mjs desde css/variables.css.

39 de 284 tokens no se copian tal cual. El valor sigue siendo el mismo — cambia como se aplica.

| Token | Valor | Por que | En RN |
|---|---|---|---|
| `--font-size-editorial-lg` | `52px` | `clamp` | Congelado en 52px (telefono). El maximo 96px vale para tablet. |
| `--line-height-editorial-lg` | `1.02` | `multiplicador` | RN mide lineHeight en puntos: lineHeight = fontSize * 1.02 |
| `--font-size-editorial-md` | `40px` | `clamp` | Congelado en 40px (telefono). El maximo 68px vale para tablet. |
| `--line-height-editorial-md` | `1.06` | `multiplicador` | RN mide lineHeight en puntos: lineHeight = fontSize * 1.06 |
| `--font-size-editorial-sm` | `32px` | `clamp` | Congelado en 32px (telefono). El maximo 46px vale para tablet. |
| `--line-height-editorial-sm` | `1.1` | `multiplicador` | RN mide lineHeight en puntos: lineHeight = fontSize * 1.1 |
| `--letter-spacing-editorial` | `-0.02em` | `em` | RN mide letterSpacing en puntos: letterSpacing = fontSize * -0.02 |
| `--line-height-display` | `1.15` | `multiplicador` | RN mide lineHeight en puntos: lineHeight = fontSize * 1.15 |
| `--line-height-heading-xl` | `1.2` | `multiplicador` | RN mide lineHeight en puntos: lineHeight = fontSize * 1.2 |
| `--line-height-heading-lg` | `1.25` | `multiplicador` | RN mide lineHeight en puntos: lineHeight = fontSize * 1.25 |
| `--line-height-heading-md` | `1.3` | `multiplicador` | RN mide lineHeight en puntos: lineHeight = fontSize * 1.3 |
| `--line-height-heading-sm` | `1.35` | `multiplicador` | RN mide lineHeight en puntos: lineHeight = fontSize * 1.35 |
| `--line-height-heading-xs` | `1.4` | `multiplicador` | RN mide lineHeight en puntos: lineHeight = fontSize * 1.4 |
| `--line-height-body-lg` | `1.5` | `multiplicador` | RN mide lineHeight en puntos: lineHeight = fontSize * 1.5 |
| `--line-height-body-md` | `1.5` | `multiplicador` | RN mide lineHeight en puntos: lineHeight = fontSize * 1.5 |
| `--line-height-body-sm` | `1.6` | `multiplicador` | RN mide lineHeight en puntos: lineHeight = fontSize * 1.6 |
| `--line-height-label` | `1.4` | `multiplicador` | RN mide lineHeight en puntos: lineHeight = fontSize * 1.4 |
| `--line-height-caption` | `1.4` | `multiplicador` | RN mide lineHeight en puntos: lineHeight = fontSize * 1.4 |
| `--line-height-badge` | `1.2` | `multiplicador` | RN mide lineHeight en puntos: lineHeight = fontSize * 1.2 |
| `--line-height-overline` | `1.2` | `multiplicador` | RN mide lineHeight en puntos: lineHeight = fontSize * 1.2 |
| `--line-height-mono-md` | `1.5` | `multiplicador` | RN mide lineHeight en puntos: lineHeight = fontSize * 1.5 |
| `--line-height-mono-sm` | `1.4` | `multiplicador` | RN mide lineHeight en puntos: lineHeight = fontSize * 1.4 |
| `--letter-spacing-overline` | `0.04em` | `em` | RN mide letterSpacing en puntos: letterSpacing = fontSize * 0.04 |
| `--letter-spacing-label` | `0.08em` | `em` | RN mide letterSpacing en puntos: letterSpacing = fontSize * 0.08 |
| `--breakpoint-md` | `768px` | equivalente directo | `useWindowDimensions().width` |
| `--breakpoint-lg` | `1024px` | equivalente directo | `useWindowDimensions().width` |
| `--shadow-sm` | `0 1px 3px rgba(28,36,56,.06)` | no existe en RN | RN no tiene box-shadow multi-capa: iOS usa shadowColor/Offset/Opacity/Radius y Android solo elevation. |
| `--shadow-md` | `0 4px 16px rgba(28,36,56,.08)` | no existe en RN | RN no tiene box-shadow multi-capa: iOS usa shadowColor/Offset/Opacity/Radius y Android solo elevation. |
| `--shadow-lg` | `0 8px 32px rgba(28,36,56,.12)` | no existe en RN | RN no tiene box-shadow multi-capa: iOS usa shadowColor/Offset/Opacity/Radius y Android solo elevation. |
| `--gradient-brand` | `linear-gradient(135deg, #01164D 0%, #3A5BB0 100%)` | no existe en RN | RN no tiene gradientes nativos: expo-linear-gradient con los stops ya resueltos. |
| `--measure` | `68ch` | `ch` | RN no tiene ch. En nativo la medida de linea se acota con maxWidth en puntos o con el ancho de la columna. |
| `--measure-lead` | `52ch` | `ch` | RN no tiene ch. En nativo la medida de linea se acota con maxWidth en puntos o con el ancho de la columna. |
| `--ease-default` | `cubic-bezier(.4,0,.2,1)` | equivalente directo | `Easing.bezier(0.4, 0, 0.2, 1)` |
| `--ease-enter` | `cubic-bezier(0,0,0,1)` | equivalente directo | `Easing.bezier(0, 0, 0, 1)` |
| `--ease-exit` | `cubic-bezier(.3,0,1,1)` | equivalente directo | `Easing.bezier(0.3, 0, 1, 1)` |
| `--ease-expressive` | `cubic-bezier(.34,1.56,.64,1)` | equivalente directo | `Easing.bezier(0.34, 1.56, 0.64, 1)` |
| `--ease-expressive-enter` | `cubic-bezier(.175,.885,.32,1.4)` | equivalente directo | `Easing.bezier(0.175, 0.885, 0.32, 1.4)` |
| `--ease-expressive-exit` | `cubic-bezier(.3,0,.8,.15)` | equivalente directo | `Easing.bezier(0.3, 0, 0.8, 0.15)` |
| `--ease-emphasized` | `cubic-bezier(.32,.72,0,1)` | equivalente directo | `Easing.bezier(0.32, 0.72, 0, 1)` |
