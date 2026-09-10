/* Toast — el snackbar. Confirma algo que YA pasó, con una sola acción de
   recuperación como máximo. Si hay que decidir algo, va un Sheet.
   Familia inverse: contrasta solo en claro y en oscuro, sin overrides. */

import React from 'react';
import { View, Text, Pressable, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEmbassy, px, family, lh, hitSlopTo } from './lib/theme';

export interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function Toast({ message, actionLabel, onAction, style }: ToastProps) {
  const t = useEmbassy();
  const insets = useSafeAreaInsets();
  const fs = px(t.fontSizeBodyMd);
  const ACTION_DRAWN = 36;

  return (
    <View
      accessibilityLiveRegion="polite"
      style={[{
        position: 'absolute',
        left: px(t.screenGutter),
        right: px(t.screenGutter),
        bottom: insets.bottom + px(t.space4),
        minHeight: px(t.controlHeight),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: px(t.space3),
        paddingLeft: px(t.space4),
        paddingRight: actionLabel ? px(t.space2) : px(t.space4),
        borderRadius: px(t.radiusMd),
        backgroundColor: t.colorInverseSurface,
      }, style]}
    >
      <Text style={{
        flex: 1, color: t.colorInverseOnSurface, fontFamily: family(t.fontBody),
        fontSize: fs, lineHeight: lh(fs, t.lineHeightBodyMd),
      }}>
        {message}
      </Text>

      {actionLabel ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          hitSlop={hitSlopTo(ACTION_DRAWN, px(t.targetMin))}
          style={({ pressed }) => ({
            height: ACTION_DRAWN, justifyContent: 'center',
            paddingHorizontal: px(t.space3), opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{
            color: t.colorInversePrimary, fontFamily: family(t.fontBody),
            fontSize: fs, fontWeight: '600',
          }}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
