# components/flutter — la capa de Flutter

Un solo archivo, y no es un descuido: **en Flutter el `ThemeData` es la librería.**

```
components/flutter/
└── embassy_theme.dart    embassyTheme(Brightness) → ThemeData
```

Material 3 ya trae los widgets con su comportamiento y su accesibilidad. Lo
único que falta es que se vean como Amalgama, y eso se decide una sola vez acá.
Comparado con React Native —donde gluestack no llega a la mitad del set y hay
que escribir ocho componentes— esto es bastante menos trabajo.

## Cómo se usa

```dart
import 'package:flutter/material.dart';
import 'components/flutter/embassy_theme.dart';

MaterialApp(
  theme: embassyTheme(Brightness.light),
  darkTheme: embassyTheme(Brightness.dark),
  home: const Altas(),
);
```

Y desde ahí, **los widgets de Material salen solos**:

```dart
final t = Theme.of(context);

Text('Altas del trimestre', style: t.textTheme.headlineLarge);
FilledButton(onPressed: () {}, child: const Text('Procesar pendientes'));
FilterChip(label: const Text('Todas'), selected: true, onSelected: (_) {});
ListTile(title: Text('Clínica del Sol'), subtitle: Text('Alta completa · 3 min'));
```

Los valores salen de `tokens/embassy_tokens.dart`, que es **generado** desde
`css/variables.css` por `scripts/build-tokens.mjs`. Acá no se declara un color
ni un tamaño: 106 referencias a tokens, cero literales.

## Las reglas que ya cumple

- **La densidad, una sola vez.** Botones, campos, chips, filas y segmentos
  llegan a `--target-min` / `--control-height` desde el tema, no pantalla por
  pantalla (`M2`).
- **Siempre `EmbassyDims.*Native`.** Usar la escala de web en una app es `M5`,
  y el chequeo lo marca por el sufijo que falta.
- **`ColorScheme` completo**, no la paleta de Material. Un `Colors.blue` suelto
  es `M8`.
- **Elevación cero por defecto** en `Card`: la elevación es un eje de
  personalidad de marca (`build-brand-theme.mjs`), no una decisión por widget.

Verificado: `node scripts/check-output.mjs components/flutter/embassy_theme.dart`
da **0 hallazgos**, y las 106 referencias a tokens se chequearon una por una
contra lo que exporta `embassy_tokens.dart`.

## Lo que NO está verificado

**Nunca corrió.** No hay proyecto Flutter todavía, así que falta `flutter analyze`
—que va a marcar cualquier API que haya cambiado de nombre entre versiones— y
después el simulador. `TabBarThemeData`, `CardThemeData` y `minTileHeight` son
de las que más se movieron entre versiones de Flutter: revisar esas primero.

Es la falla `M9` y es la primera tarea del proyecto, no un detalle.

## Una diferencia con RN al escribir

`TextStyle.height` en Flutter **sí** es un múltiplo del `fontSize`, así que los
line-height van tal cual. En React Native hay que multiplicar, y no hacerlo es
la falla `M7` — que por eso no aplica en Dart.
