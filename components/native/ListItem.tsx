/* ListItem — la fila. Reemplaza a la tabla en nativo (M4).
   Alto mínimo --row-height, que en nativo es el piso táctil. */

import React from 'react';
import { Pressable, View, Text, type ViewStyle } from 'react-native';
import { useEmbassy, px, family, lh } from './lib/theme';

export interface ListItemProps {
  headline: string;
  supporting?: string;
  trailing?: React.ReactNode;
  leading?: React.ReactNode;
  onPress?: () => void;
  divider?: boolean;
  style?: ViewStyle;
}

export function ListItem({ headline, supporting, trailing, leading, onPress, divider = true, style }: ListItemProps) {
  const t = useEmbassy();
  const h = px(t.fontSizeBodyMd);
  const s = px(t.fontSizeBodySm);

  const body = (
    <View style={[{
      minHeight: px(t.rowHeight),
      flexDirection: 'row',
      alignItems: 'center',
      gap: px(t.space3),
      paddingVertical: px(t.space2),
      borderBottomWidth: divider ? 1 : 0,
      borderBottomColor: t.border,
    }, style]}>
      {leading ? <View>{leading}</View> : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Text numberOfLines={1} style={{
          color: t.textPrimary, fontFamily: family(t.fontBody),
          fontSize: h, lineHeight: lh(h, t.lineHeightBodyMd), fontWeight: '500',
        }}>
          {headline}
        </Text>
        {supporting ? (
          <Text numberOfLines={2} style={{
            color: t.textSecondary, fontFamily: family(t.fontBody),
            fontSize: s, lineHeight: lh(s, t.lineHeightBodySm),
          }}>
            {supporting}
          </Text>
        ) : null}
      </View>
      {trailing ? <View>{trailing}</View> : null}
    </View>
  );

  if (!onPress) return body;
  return (
    <Pressable accessibilityRole="button" onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
      {body}
    </Pressable>
  );
}
