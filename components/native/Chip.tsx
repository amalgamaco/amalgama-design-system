/* Chip — Embassy nativo
   Clasificador interactivo, NO una acción: por eso se dibuja a 40 y llega al
   piso táctil de 48 con hitSlop, en vez de agrandarse. MOBILE.md §3.
   Para estado de solo lectura va Badge, no esto. */

import React from 'react';
import { Pressable, Text, View, type ViewStyle } from 'react-native';
import { useEmbassy, px, family, lh, hitSlopTo } from './lib/theme';

const DRAWN = 40;

export interface ChipProps {
  selected?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  children: React.ReactNode;
}

export function Chip({ selected = false, disabled, icon, onPress, style, children }: ChipProps) {
  const t = useEmbassy();
  const fontSize = px(t.fontSizeLabel);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={hitSlopTo(DRAWN, px(t.targetMin))}
      style={({ pressed }) => [
        {
          height: DRAWN,
          flexDirection: 'row',
          alignItems: 'center',
          gap: px(t.space2),
          paddingHorizontal: px(t.space4),
          borderRadius: px(t.radiusFull),
          borderWidth: 1,
          borderColor: selected ? 'transparent' : t.colorOutlineVariant,
          backgroundColor: selected ? t.colorSecondaryContainer : 'transparent',
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {icon ? <View>{icon}</View> : null}
      <Text
        style={{
          color: selected ? t.colorOnSecondaryContainer : t.colorOnSurface,
          fontFamily: family(t.fontBody),
          fontSize,
          lineHeight: lh(fontSize, t.lineHeightLabel),
          fontWeight: '500',
        }}
        numberOfLines={1}
      >
        {children}
      </Text>
    </Pressable>
  );
}
