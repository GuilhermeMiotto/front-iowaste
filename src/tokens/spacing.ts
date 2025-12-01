/**
 * Design Tokens - Espaçamento ESG IoWaste
 * Sistema de espaçamento base 8px para consistência visual
 */

export const spacing = {
  // Base spacing scale (8px base)
  0: '0',
  0.5: '0.125rem',    // 2px
  1: '0.25rem',       // 4px
  1.5: '0.375rem',    // 6px
  2: '0.5rem',        // 8px  - Base
  2.5: '0.625rem',    // 10px
  3: '0.75rem',       // 12px
  3.5: '0.875rem',    // 14px
  4: '1rem',          // 16px
  5: '1.25rem',       // 20px
  6: '1.5rem',        // 24px
  7: '1.75rem',       // 28px
  8: '2rem',          // 32px
  9: '2.25rem',       // 36px
  10: '2.5rem',       // 40px
  11: '2.75rem',      // 44px
  12: '3rem',         // 48px
  14: '3.5rem',       // 56px
  16: '4rem',         // 64px
  20: '5rem',         // 80px
  24: '6rem',         // 96px
  28: '7rem',         // 112px
  32: '8rem',         // 128px
  
  // Semantic spacing (named for purpose)
  semantic: {
    // Component spacing
    xs: '0.25rem',      // 4px
    sm: '0.5rem',       // 8px
    md: '1rem',         // 16px
    lg: '1.5rem',       // 24px
    xl: '2rem',         // 32px
    '2xl': '2.5rem',    // 40px
    '3xl': '3rem',      // 48px
    '4xl': '4rem',      // 64px
    
    // Gaps
    gapXs: '0.5rem',    // 8px
    gapSm: '0.75rem',   // 12px
    gapMd: '1rem',      // 16px
    gapLg: '1.5rem',    // 24px
    gapXl: '2rem',      // 32px
    
    // Padding
    paddingXs: '0.5rem',    // 8px
    paddingSm: '0.75rem',   // 12px
    paddingMd: '1rem',      // 16px
    paddingLg: '1.5rem',    // 24px
    paddingXl: '2rem',      // 32px
    
    // Margin
    marginXs: '0.5rem',     // 8px
    marginSm: '0.75rem',    // 12px
    marginMd: '1rem',       // 16px
    marginLg: '1.5rem',     // 24px
    marginXl: '2rem',       // 32px
    
    // Layout spacing
    sectionGap: '3rem',     // 48px - Gap between major sections
    cardGap: '1.5rem',      // 24px - Gap between cards
    elementGap: '1rem',     // 16px - Gap between elements
    
    // Container padding
    containerPaddingMobile: '1rem',    // 16px
    containerPaddingTablet: '1.5rem',  // 24px
    containerPaddingDesktop: '2rem',   // 32px
  },
} as const;

export type SpacingToken = typeof spacing;
