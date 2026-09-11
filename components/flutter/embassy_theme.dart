// ═══════════════════════════════════════════════════════════════════════════
// embassy_theme.dart — el puente entre los tokens y Flutter
//
// El análogo de components/native/lib/theme.ts, pero acá el puente hace mucho
// más trabajo: en Flutter el ThemeData ES la librería. Material 3 ya trae los
// widgets con su comportamiento y su accesibilidad; lo que falta es que se vean
// como Amalgama, y eso se decide una sola vez acá.
//
// Por eso del lado Flutter casi no hay componentes propios: hay un tema. Ese es
// el argumento más fuerte a favor de Flutter y conviene no desperdiciarlo
// escribiendo widgets que Material ya resuelve.
//
// Los valores salen de tokens/embassy_tokens.dart, que es GENERADO desde
// css/variables.css. Acá no se declara un color ni un tamaño.
// ═══════════════════════════════════════════════════════════════════════════

import 'package:flutter/material.dart';
import '../../tokens/embassy_tokens.dart';

/// Embassy adoptó la estructura de tokens de MD3 (ver css/md-sys-bridge.css),
/// así que el mapeo contra ColorScheme es casi 1:1. Donde no lo es, está dicho.
ColorScheme embassyColorScheme(Brightness brightness) {
  final dark = brightness == Brightness.dark;
  return ColorScheme(
    brightness: brightness,
    primary:              dark ? EmbassyColors.colorPrimaryDark              : EmbassyColors.colorPrimary,
    onPrimary:            dark ? EmbassyColors.colorOnPrimaryDark            : EmbassyColors.colorOnPrimary,
    primaryContainer:     dark ? EmbassyColors.colorPrimaryContainerDark     : EmbassyColors.colorPrimaryContainer,
    onPrimaryContainer:   dark ? EmbassyColors.colorOnPrimaryContainerDark   : EmbassyColors.colorOnPrimaryContainer,
    secondary:            dark ? EmbassyColors.colorSecondaryDark            : EmbassyColors.colorSecondary,
    onSecondary:          dark ? EmbassyColors.colorOnSecondaryDark          : EmbassyColors.colorOnSecondary,
    secondaryContainer:   dark ? EmbassyColors.colorSecondaryContainerDark   : EmbassyColors.colorSecondaryContainer,
    onSecondaryContainer: dark ? EmbassyColors.colorOnSecondaryContainerDark : EmbassyColors.colorOnSecondaryContainer,
    tertiary:             dark ? EmbassyColors.colorTertiaryDark             : EmbassyColors.colorTertiary,
    onTertiary:           dark ? EmbassyColors.colorOnTertiaryDark           : EmbassyColors.colorOnTertiary,
    tertiaryContainer:    dark ? EmbassyColors.colorTertiaryContainerDark    : EmbassyColors.colorTertiaryContainer,
    onTertiaryContainer:  dark ? EmbassyColors.colorOnTertiaryContainerDark  : EmbassyColors.colorOnTertiaryContainer,
    error:                dark ? EmbassyColors.colorErrorDark                : EmbassyColors.colorError,
    onError:              dark ? EmbassyColors.colorOnErrorDark              : EmbassyColors.colorOnError,
    errorContainer:       dark ? EmbassyColors.colorErrorContainerDark       : EmbassyColors.colorErrorContainer,
    onErrorContainer:     dark ? EmbassyColors.colorOnErrorContainerDark     : EmbassyColors.colorOnErrorContainer,
    surface:              dark ? EmbassyColors.colorSurfaceDark              : EmbassyColors.colorSurface,
    onSurface:            dark ? EmbassyColors.colorOnSurfaceDark            : EmbassyColors.colorOnSurface,
    surfaceDim:           dark ? EmbassyColors.colorSurfaceDimDark           : EmbassyColors.colorSurfaceDim,
    surfaceBright:        dark ? EmbassyColors.colorSurfaceBrightDark        : EmbassyColors.colorSurfaceBright,
    surfaceContainerLowest:  dark ? EmbassyColors.colorSurfaceContainerLowestDark  : EmbassyColors.colorSurfaceContainerLowest,
    surfaceContainerLow:     dark ? EmbassyColors.colorSurfaceContainerLowDark     : EmbassyColors.colorSurfaceContainerLow,
    surfaceContainer:        dark ? EmbassyColors.colorSurfaceContainerDark        : EmbassyColors.colorSurfaceContainer,
    surfaceContainerHigh:    dark ? EmbassyColors.colorSurfaceContainerHighDark    : EmbassyColors.colorSurfaceContainerHigh,
    surfaceContainerHighest: dark ? EmbassyColors.colorSurfaceContainerHighestDark : EmbassyColors.colorSurfaceContainerHighest,
    onSurfaceVariant:     dark ? EmbassyColors.colorOnSurfaceVariantDark     : EmbassyColors.colorOnSurfaceVariant,
    outline:              dark ? EmbassyColors.colorOutlineDark              : EmbassyColors.colorOutline,
    outlineVariant:       dark ? EmbassyColors.colorOutlineVariantDark       : EmbassyColors.colorOutlineVariant,
    inverseSurface:       dark ? EmbassyColors.colorInverseSurfaceDark       : EmbassyColors.colorInverseSurface,
    onInverseSurface:     dark ? EmbassyColors.colorInverseOnSurfaceDark     : EmbassyColors.colorInverseOnSurface,
    inversePrimary:       dark ? EmbassyColors.colorInversePrimaryDark       : EmbassyColors.colorInversePrimary,
    scrim:                dark ? EmbassyColors.colorScrimDark                : EmbassyColors.colorScrim,
    // Embassy no tiene rol de shadow ni surfaceTint: la elevación es un eje de
    // personalidad de marca, no un color. Se dejan en el neutro más oscuro.
    shadow:               EmbassyColors.neutralBlack,
    surfaceTint:          dark ? EmbassyColors.colorPrimaryDark : EmbassyColors.colorPrimary,
  );
}

/// TextTheme. En Flutter `height` SÍ es un múltiplo del fontSize —a diferencia
/// de RN, donde hay que multiplicar— así que los line-height van tal cual.
///
/// El mapeo de las trece ranuras de MD3 contra nuestra escala, por lo que cada
/// una ES y no por cómo se llama:
///   display* → nuestro registro editorial (la apertura de una pantalla)
///   headline* → títulos de pantalla
///   title*    → títulos de sección y de card
///   body*     → cuerpo
///   label*    → botones, chips y texto auxiliar
TextTheme embassyTextTheme(Color onSurface) {
  TextStyle s(double size, double height, {FontWeight w = FontWeight.w400, String? font, double? tracking}) =>
      TextStyle(
        fontFamily: font ?? EmbassyFonts.fontBody,
        fontSize: size,
        height: height,
        fontWeight: w,
        letterSpacing: tracking,
        color: onSurface,
      );

  const h = EmbassyFonts.fontHeading;
  return TextTheme(
    displayLarge:  s(EmbassyDims.fontSizeEditorialLgNative, EmbassyDims.lineHeightEditorialLgNative, w: FontWeight.w700, font: h, tracking: EmbassyDims.fontSizeEditorialLgNative * -0.02),
    displayMedium: s(EmbassyDims.fontSizeEditorialMdNative, EmbassyDims.lineHeightEditorialMdNative, w: FontWeight.w700, font: h, tracking: EmbassyDims.fontSizeEditorialMdNative * -0.02),
    displaySmall:  s(EmbassyDims.fontSizeEditorialSmNative, EmbassyDims.lineHeightEditorialSmNative, w: FontWeight.w700, font: h, tracking: EmbassyDims.fontSizeEditorialSmNative * -0.02),

    headlineLarge:  s(EmbassyDims.fontSizeDisplayNative,   EmbassyDims.lineHeightDisplayNative,   w: FontWeight.w700, font: h),
    headlineMedium: s(EmbassyDims.fontSizeHeadingXlNative, EmbassyDims.lineHeightHeadingXlNative, w: FontWeight.w600, font: h),
    headlineSmall:  s(EmbassyDims.fontSizeHeadingLgNative, EmbassyDims.lineHeightHeadingLgNative, w: FontWeight.w600, font: h),

    titleLarge:  s(EmbassyDims.fontSizeHeadingMdNative, EmbassyDims.lineHeightHeadingMdNative, w: FontWeight.w600, font: h),
    titleMedium: s(EmbassyDims.fontSizeHeadingSmNative, EmbassyDims.lineHeightHeadingSmNative, w: FontWeight.w600, font: h),
    titleSmall:  s(EmbassyDims.fontSizeHeadingXsNative, EmbassyDims.lineHeightHeadingXsNative, w: FontWeight.w600, font: h),

    bodyLarge:  s(EmbassyDims.fontSizeBodyLgNative, EmbassyDims.lineHeightBodyLgNative),
    bodyMedium: s(EmbassyDims.fontSizeBodyMdNative, EmbassyDims.lineHeightBodyMdNative),
    bodySmall:  s(EmbassyDims.fontSizeBodySmNative, EmbassyDims.lineHeightBodySmNative),

    labelLarge:  s(EmbassyDims.fontSizeLabelNative,   EmbassyDims.lineHeightLabelNative,   w: FontWeight.w500),
    labelMedium: s(EmbassyDims.fontSizeCaptionNative, EmbassyDims.lineHeightCaptionNative, w: FontWeight.w500),
    labelSmall:  s(EmbassyDims.fontSizeBadgeNative,   EmbassyDims.lineHeightBadgeNative,   w: FontWeight.w600),
  );
}

/// El tema completo. Con esto, los widgets de Material ya salen como Amalgama.
///
/// La densidad se fija acá una sola vez: todo lo tocable llega a
/// --target-min (48 en nativo). Es la falla M2 y es bloqueante, así que no
/// puede quedar librado a cada pantalla.
ThemeData embassyTheme(Brightness brightness) {
  final scheme = embassyColorScheme(brightness);
  final text = embassyTextTheme(scheme.onSurface);
  final radius = BorderRadius.circular(EmbassyDims.radiusMdNative);
  final target = Size(EmbassyDims.targetMinNative, EmbassyDims.targetMinNative);

  ButtonStyle base(Color bg, Color fg) => ButtonStyle(
        minimumSize: WidgetStatePropertyAll(Size(0, EmbassyDims.controlHeightNative)),
        padding: WidgetStatePropertyAll(EdgeInsets.symmetric(horizontal: EmbassyDims.space6Native)),
        shape: WidgetStatePropertyAll(RoundedRectangleBorder(borderRadius: radius)),
        backgroundColor: WidgetStatePropertyAll(bg),
        foregroundColor: WidgetStatePropertyAll(fg),
        textStyle: WidgetStatePropertyAll(text.bodyMedium?.copyWith(fontWeight: FontWeight.w600)),
      );

  return ThemeData(
    useMaterial3: true,
    brightness: brightness,
    colorScheme: scheme,
    textTheme: text,
    scaffoldBackgroundColor: scheme.surface,
    fontFamily: EmbassyFonts.fontBody,

    // El piso táctil, una sola vez para toda la app.
    materialTapTargetSize: MaterialTapTargetSize.padded,

    filledButtonTheme:   FilledButtonThemeData(style: base(scheme.primary, scheme.onPrimary)),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: base(Colors.transparent, scheme.onSurface).copyWith(
        side: WidgetStatePropertyAll(BorderSide(color: scheme.outline)),
      ),
    ),
    textButtonTheme: TextButtonThemeData(style: base(Colors.transparent, scheme.primary)),

    // El chip se dibuja a 40 y llega a 48 por el tap target, no agrandándose:
    // es un clasificador, no una acción. MOBILE.md §3.
    chipTheme: ChipThemeData(
      labelStyle: text.labelLarge,
      backgroundColor: Colors.transparent,
      selectedColor: scheme.secondaryContainer,
      side: BorderSide(color: scheme.outlineVariant),
      shape: const StadiumBorder(),
      padding: EdgeInsets.symmetric(horizontal: EmbassyDims.space4Native),
      materialTapTargetSize: MaterialTapTargetSize.padded,
    ),

    inputDecorationTheme: InputDecorationTheme(
      constraints: BoxConstraints(minHeight: EmbassyDims.controlHeightNative),
      contentPadding: EdgeInsets.symmetric(
        horizontal: EmbassyDims.space4Native, vertical: EmbassyDims.space2Native),
      border: OutlineInputBorder(borderRadius: radius, borderSide: BorderSide(color: scheme.outline)),
      filled: true,
      fillColor: scheme.surfaceContainer,
      hintStyle: text.bodyMedium?.copyWith(color: scheme.onSurfaceVariant),
    ),

    listTileTheme: ListTileThemeData(
      minVerticalPadding: EmbassyDims.space2Native,
      minTileHeight: EmbassyDims.rowHeightNative,
      titleTextStyle: text.bodyMedium?.copyWith(fontWeight: FontWeight.w500),
      subtitleTextStyle: text.bodySmall?.copyWith(color: scheme.onSurfaceVariant),
      contentPadding: EdgeInsets.symmetric(horizontal: EmbassyDims.screenGutterNative),
    ),

    // La elevación es un eje de personalidad de marca: por defecto, plano.
    cardTheme: CardThemeData(
      elevation: 0,
      color: scheme.surfaceContainer,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(EmbassyDims.radiusLgNative),
        side: BorderSide(color: scheme.outlineVariant),
      ),
      margin: EdgeInsets.zero,
    ),

    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: scheme.surfaceContainer,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(EmbassyDims.radiusLgNative)),
      ),
      showDragHandle: true,
    ),

    snackBarTheme: SnackBarThemeData(
      backgroundColor: scheme.inverseSurface,
      contentTextStyle: text.bodyMedium?.copyWith(color: scheme.onInverseSurface),
      actionTextColor: scheme.inversePrimary,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: radius),
    ),

    tabBarTheme: TabBarThemeData(
      labelColor: scheme.primary,
      unselectedLabelColor: scheme.onSurfaceVariant,
      labelStyle: text.bodyMedium?.copyWith(fontWeight: FontWeight.w600),
      unselectedLabelStyle: text.bodyMedium,
      indicatorSize: TabBarIndicatorSize.tab,
      dividerColor: scheme.outlineVariant,
    ),

    dividerTheme: DividerThemeData(color: scheme.outlineVariant, space: 1, thickness: 1),

    segmentedButtonTheme: SegmentedButtonThemeData(
      style: ButtonStyle(
        minimumSize: WidgetStatePropertyAll(Size(0, EmbassyDims.controlHeightNative)),
        textStyle: WidgetStatePropertyAll(text.bodyMedium),
      ),
    ),
  );
}
