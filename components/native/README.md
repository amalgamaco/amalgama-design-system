# components/native — la librería nativa

El análogo de `components/ui/*.tsx`, para React Native. **Copy-paste, no
dependencia:** se copia la carpeta al proyecto y es suya, igual que en web.

```
components/native/
├── lib/theme.ts     el puente entre tokens/ y RN — px(), family(), lh(), useEmbassy()
├── Button.tsx       Chip.tsx     Field.tsx    Card.tsx
├── ListItem.tsx     Sheet.tsx    Toast.tsx    Tabs.tsx
└── index.ts
```

Con estos ocho se arma una pantalla entera. Es la primera tanda a propósito:
son los que revelan si los tokens alcanzan.

## Cómo se usa

```tsx
import { Button, Chip, Field, ListItem } from '@/components/native';

<Field label="Centro médico" required placeholder="Ej: Clínica del Sol" />
<Chip selected onPress={…}>Todas</Chip>
<ListItem headline="Clínica del Sol" supporting="Alta completa · 3 min" />
<Button fullWidth onPress={…}>Procesar pendientes</Button>
```

No hay provider que montar: `useEmbassy()` lee `useColorScheme()` y devuelve
`native` o `nativeDark`. La plataforma ya está fijada — estos son los tokens
nativos — y el tema lo decide el sistema. Son **dos ejes independientes**:
claro/oscuro es color, escritorio/nativo es tamaño (`TOKENS.md` §9c).

**Dependencias:** `react-native` y, para `Sheet` y `Toast`,
`react-native-safe-area-context` (envolvé la app en `SafeAreaProvider`).
Nada más. No dependen de gluestack ni de NativeWind: cuando el proyecto sume
gluestack, se copian sus componentes para lo que acá no está y se les reemplaza
el styling por estos mismos tokens.

## Las reglas que ya cumplen

- **Ningún tamaño escrito a mano.** Todo sale de `native`/`nativeDark` vía `px()` (`M1`).
- **`lineHeight` y `letterSpacing` en puntos**, con `lh()` y `ls()`. Pasarlos como
  multiplicador no da error en RN: dibuja mal en silencio (`M7`).
- **Piso táctil de 48.** Lo que ES la caja llega dibujado; lo que no —`Chip`, la
  acción del `Toast`— se dibuja chico y llega con `hitSlop()` (`M2`, `MOBILE.md` §3).
- **Safe area leída, nunca fija**, en `Sheet` y `Toast` (`M3`).
- **Cero utilities sin traducir** (`M8`).

Verificado: `node scripts/check-output.mjs components/native/*.tsx components/native/lib/theme.ts`
da **0 hallazgos**, y se probó plantando errores a mano para confirmar que los
chequeos corren de verdad sobre estos archivos.

## Lo que NO está verificado, y hay que decirlo

**Nunca corrieron.** Se escribieron contra los tokens, no contra un simulador.
Falta comprobar en iOS y Android: que las fuentes carguen con el nombre que
devuelve `family()`, la sombra y el `elevation`, el ripple de Android, el rebote
del scroll, el `Modal` del `Sheet` con teclado abierto, y que `Toast` en
`position: absolute` quede donde tiene que quedar dentro de cada pantalla.

Es la falla `M9` y es la primera tarea del proyecto RN, no un detalle.

## Lo que falta

Los otros 29 que se portan tal cual (`MOBILE.md` §5). Y los 23 que cambian de
patrón: ahí lo que se escribe no es el componente sino su reemplazo — una tabla
se vuelve una lista de `ListItem`, un dropdown un `Sheet`.
