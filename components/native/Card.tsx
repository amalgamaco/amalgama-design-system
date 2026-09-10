/* Card — contenedor con borde, sin sombra por defecto.
   La elevación es un eje de personalidad de la marca (build-brand-theme), no
   una decisión por componente. */

import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import { useEmbassy, px, family, lh } from './lib/theme';

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const t = useEmbassy();
  return (
    <View style={[{
      backgroundColor: t.colorSurfaceContainer,
      borderRadius: px(t.radiusLg),
      borderWidth: 1,
      borderColor: t.border,
      padding: px(t.space5),
      gap: px(t.space3),
    }, style]}>
      {children}
    </View>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  const t = useEmbassy();
  const fs = px(t.fontSizeHeadingSm);
  return (
    <Text style={{
      color: t.textPrimary, fontFamily: family(t.fontHeading),
      fontSize: fs, lineHeight: lh(fs, t.lineHeightHeadingSm), fontWeight: '600',
    }}>
      {children}
    </Text>
  );
}

export function CardDesc({ children }: { children: React.ReactNode }) {
  const t = useEmbassy();
  const fs = px(t.fontSizeBodyMd);
  return (
    <Text style={{
      color: t.textSecondary, fontFamily: family(t.fontBody),
      fontSize: fs, lineHeight: lh(fs, t.lineHeightBodyMd),
    }}>
      {children}
    </Text>
  );
}
