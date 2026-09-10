/* Field — Embajada nativa del par label + input + ayuda/error.
   El campo llega a --control-height completo: en un teléfono no hay input chico. */

import React from 'react';
import { View, Text, TextInput, type TextInputProps, type ViewStyle } from 'react-native';
import { useEmbassy, px, family, lh } from './lib/theme';

export interface FieldProps extends TextInputProps {
  label?: string;
  required?: boolean;
  help?: string;
  error?: string;
  style?: ViewStyle;
}

export function Field({ label, required, help, error, style, ...rest }: FieldProps) {
  const t = useEmbassy();
  const labelSize = px(t.fontSizeLabel);
  const inputSize = px(t.fontSizeBodyMd);
  const capSize   = px(t.fontSizeCaption);
  const invalid   = !!error;

  return (
    <View style={[{ gap: px(t.space2) }, style]}>
      {label ? (
        <Text style={{
          color: t.textSecondary, fontFamily: family(t.fontBody),
          fontSize: labelSize, lineHeight: lh(labelSize, t.lineHeightLabel), fontWeight: '500',
        }}>
          {label}
          {required ? <Text style={{ color: t.colorError }}> *</Text> : null}
        </Text>
      ) : null}

      <TextInput
        accessibilityLabel={label}
        accessibilityState={{ disabled: rest.editable === false }}
        placeholderTextColor={t.textMuted}
        style={{
          minHeight: px(t.controlHeight),
          paddingHorizontal: px(t.space4),
          paddingVertical: px(t.space2),
          borderRadius: px(t.radiusMd),
          borderWidth: 1,
          borderColor: invalid ? t.colorError : t.colorOutline,
          backgroundColor: t.colorSurfaceContainer,
          color: t.textPrimary,
          fontFamily: family(t.fontBody),
          fontSize: inputSize,
        }}
        {...rest}
      />

      {error || help ? (
        <Text style={{
          color: invalid ? t.colorError : t.textMuted,
          fontFamily: family(t.fontBody),
          fontSize: capSize, lineHeight: lh(capSize, t.lineHeightCaption),
        }}>
          {error || help}
        </Text>
      ) : null}
    </View>
  );
}
