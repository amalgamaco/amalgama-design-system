/* ═══════════════════════════════════════════════════════════════════════
   theme.ts — el puente entre los tokens y React Native

   tokens/embassy.tokens.ts es neutral: los valores vienen como los declara
   el CSS ("16px", "1.5", "'Inter', sans-serif"). RN quiere números y un
   nombre de familia pelado. Este archivo hace esa conversión y nada más.

   Es el análogo de components/lib/utils.ts en web: infraestructura mínima,
   cero decisiones de diseño.
   ═══════════════════════════════════════════════════════════════════════ */

import { useColorScheme } from 'react-native';
import { native, nativeDark } from '../../../tokens/embassy.tokens';

/** "16px" → 16 · "9999px" → 9999 */
export const px = (v: string | number): number =>
  typeof v === 'number' ? v : parseFloat(v);

/** "'Inter', sans-serif" → "Inter" — RN no entiende font stacks. */
export const family = (v: string): string =>
  v.split(',')[0].replace(/['"]/g, '').trim();

/**
 * RN mide lineHeight en PUNTOS, no en múltiplos. Pasarle 1.5 no da error:
 * dibuja mal en silencio. Es la falla M7.
 */
export const lh = (fontSize: number, multiplier: string | number): number =>
  fontSize * parseFloat(String(multiplier));

/** Ídem para letterSpacing, que en el CSS viene en em. */
export const ls = (fontSize: number, em: string | number): number =>
  fontSize * parseFloat(String(em));

/**
 * El área tocable no es la caja dibujada: un control chico se estira con
 * hitSlop hasta el piso táctil en vez de agrandarse. MOBILE.md §3.
 */
export const hitSlopTo = (drawnHeight: number, target: number) => {
  const extra = Math.max(0, (target - drawnHeight) / 2);
  return { top: extra, bottom: extra, left: 0, right: 0 };
};

export type EmbassyTheme = typeof native;

/**
 * Los dos ejes a la vez: la plataforma ya está fijada (estos son los tokens
 * nativos) y el tema lo decide el sistema. Claro/oscuro es color,
 * escritorio/nativo es tamaño — ver TOKENS.md §9c.
 */
export function useEmbassy(): EmbassyTheme {
  return useColorScheme() === 'dark' ? (nativeDark as EmbassyTheme) : native;
}

/** Para código fuera de un componente (StyleSheet a nivel módulo). */
export const tokens = { light: native, dark: nativeDark };
