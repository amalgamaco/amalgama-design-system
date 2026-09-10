/* Button — Embassy nativo
   Jerarquía por color, densidad por tamaño. UN solo primary por contexto (C1).
   El alto sale de --control-height (48 en nativo), nunca de un número. */

import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';
import { useEmbassy, px, family, lh } from './lib/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'text' | 'danger';
export type ButtonSize = 'default' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary', size = 'default', loading = false, fullWidth = false,
  disabled, style, children, ...rest
}: ButtonProps) {
  const t = useEmbassy();
  const off = disabled || loading;

  const fontSize = px(size === 'lg' ? t.fontSizeBodyLg : t.fontSizeBodyMd);
  const height   = px(t.controlHeight) + (size === 'lg' ? px(t.space2) : 0);

  const fill: Record<ButtonVariant, { bg: string; fg: string; border?: string }> = {
    primary:   { bg: t.colorPrimary,           fg: t.colorOnPrimary },
    secondary: { bg: t.colorSecondaryContainer, fg: t.colorOnSecondaryContainer },
    tertiary:  { bg: 'transparent',             fg: t.textPrimary, border: t.buttonSecondaryBorder },
    text:      { bg: 'transparent',             fg: t.colorPrimary },
    danger:    { bg: t.colorError,              fg: t.colorOnError },
  };
  const c = fill[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!off, busy: loading }}
      disabled={off}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: height,
          paddingHorizontal: px(t.space6),
          borderRadius: px(t.radiusMd),
          backgroundColor: off && variant !== 'text' && variant !== 'tertiary' ? t.colorDisabled : c.bg,
          borderWidth: c.border ? 1 : 0,
          borderColor: c.border ?? 'transparent',
          opacity: pressed ? 0.86 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
      {...rest}
    >
      {loading && <ActivityIndicator size="small" color={c.fg} style={{ marginRight: px(t.space2) }} />}
      <Text
        style={{
          color: off ? t.colorOnDisabled : c.fg,
          fontFamily: family(t.fontBody),
          fontSize,
          lineHeight: lh(fontSize, t.lineHeightBodyMd),
          fontWeight: '600',
        }}
        numberOfLines={1}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
