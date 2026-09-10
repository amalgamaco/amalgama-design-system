/* Sheet — el bottom sheet. En nativo reemplaza al sheet lateral y, casi
   siempre, al modal chico centrado (M4).
   La safe area de abajo se lee, no se escribe (M3). */

import React from 'react';
import { Modal, View, Text, Pressable, ScrollView, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEmbassy, px, family, lh } from './lib/theme';

export interface SheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  style?: ViewStyle;
}

export function Sheet({ visible, onClose, title, children, footer, style }: SheetProps) {
  const t = useEmbassy();
  const insets = useSafeAreaInsets();
  const fs = px(t.fontSizeHeadingSm);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        accessibilityLabel="Cerrar"
        onPress={onClose}
        style={{ flex: 1, backgroundColor: t.colorScrim ?? 'rgba(0,0,0,0.45)' }}
      />
      <View style={[{
        backgroundColor: t.colorSurfaceContainer,
        borderTopLeftRadius: px(t.radiusLg),
        borderTopRightRadius: px(t.radiusLg),
        paddingHorizontal: px(t.screenGutter),
        paddingTop: px(t.space4),
        paddingBottom: insets.bottom + px(t.space4),
        maxHeight: '85%',
        gap: px(t.space4),
      }, style]}>
        <View style={{
          alignSelf: 'center', width: 36, height: 4,
          borderRadius: px(t.radiusFull), backgroundColor: t.colorOutlineVariant,
        }} />

        {title ? (
          <Text accessibilityRole="header" style={{
            color: t.textPrimary, fontFamily: family(t.fontHeading),
            fontSize: fs, lineHeight: lh(fs, t.lineHeightHeadingSm), fontWeight: '600',
          }}>
            {title}
          </Text>
        ) : null}

        <ScrollView>{children}</ScrollView>
        {footer ? <View style={{ gap: px(t.space2) }}>{footer}</View> : null}
      </View>
    </Modal>
  );
}
