/* Tabs — cambiar de vista dentro de una pantalla. NO es navegación entre
   pantallas: eso es el tab bar del navigator.
   Cada tab llega al piso táctil dibujado, porque el tab ES la caja. */

import React from 'react';
import { View, Text, Pressable, ScrollView, type ViewStyle } from 'react-native';
import { useEmbassy, px, family, lh } from './lib/theme';

export interface TabsProps {
  items: { key: string; label: string }[];
  value: string;
  onChange: (key: string) => void;
  scrollable?: boolean;
  style?: ViewStyle;
}

export function Tabs({ items, value, onChange, scrollable = false, style }: TabsProps) {
  const t = useEmbassy();
  const fs = px(t.fontSizeBodyMd);

  const row = (
    <View
      accessibilityRole="tablist"
      style={[{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: t.border }, style]}
    >
      {items.map((it) => {
        const on = it.key === value;
        return (
          <Pressable
            key={it.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(it.key)}
            style={({ pressed }) => ({
              minHeight: px(t.controlHeight),
              flex: scrollable ? undefined : 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: px(t.space4),
              borderBottomWidth: 2,
              borderBottomColor: on ? t.colorPrimary : 'transparent',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text
              numberOfLines={1}
              style={{
                color: on ? t.colorPrimary : t.textSecondary,
                fontFamily: family(t.fontBody),
                fontSize: fs,
                lineHeight: lh(fs, t.lineHeightBodyMd),
                fontWeight: on ? '600' : '500',
              }}
            >
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return scrollable
    ? <ScrollView horizontal showsHorizontalScrollIndicator={false}>{row}</ScrollView>
    : row;
}
