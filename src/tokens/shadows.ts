/**
 * Design Tokens - Sombras ESG IoWaste
 * Sistema de elevação com sombras sutis e profissionais
 */

export const shadows = {
  // Elevation levels
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Inner shadow
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  
  // Semantic shadows (named for purpose)
  semantic: {
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    cardHover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    button: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    buttonHover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    tooltip: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    input: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  
  // Focus states (green themed for ESG)
  focus: {
    primary: '0 0 0 3px rgba(22, 163, 74, 0.1)',      // primary-500 with 10% opacity
    secondary: '0 0 0 3px rgba(59, 130, 246, 0.1)',   // secondary-500 with 10% opacity
    danger: '0 0 0 3px rgba(239, 68, 68, 0.1)',       // danger-500 with 10% opacity
  },
} as const;

export type ShadowToken = typeof shadows;
