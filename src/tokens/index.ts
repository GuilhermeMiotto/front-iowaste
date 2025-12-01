/**
 * Design Tokens - Índice Central IoWaste
 * Exportação centralizada de todos os tokens de design ESG
 */

export { colors, type ColorToken } from './colors';
export { typography, type TypographyToken } from './typography';
export { spacing, type SpacingToken } from './spacing';
export { radius, type RadiusToken } from './radius';
export { shadows, type ShadowToken } from './shadows';

// Export combined tokens object
export const tokens = {
  colors: require('./colors').colors,
  typography: require('./typography').typography,
  spacing: require('./spacing').spacing,
  radius: require('./radius').radius,
  shadows: require('./shadows').shadows,
} as const;

export type DesignTokens = typeof tokens;
