/**
 * Design Tokens - Tipografia ESG IoWaste
 * Sistema tipográfico profissional com hierarquia clara
 */

export const typography = {
  // Font Families
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Fira Code", "Courier New", monospace',
  },
  
  // Font Sizes
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },
  
  // Font Weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  // Text Styles (Semantic Combinations)
  textStyles: {
    // Headings
    h1: {
      fontSize: '2.25rem',      // 36px
      fontWeight: '700',
      lineHeight: '1.25',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '1.875rem',     // 30px
      fontWeight: '600',
      lineHeight: '1.25',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.5rem',       // 24px
      fontWeight: '600',
      lineHeight: '1.375',
      letterSpacing: '0',
    },
    h4: {
      fontSize: '1.25rem',      // 20px
      fontWeight: '600',
      lineHeight: '1.375',
      letterSpacing: '0',
    },
    h5: {
      fontSize: '1.125rem',     // 18px
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    h6: {
      fontSize: '1rem',         // 16px
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    
    // Body
    bodyLarge: {
      fontSize: '1.125rem',     // 18px
      fontWeight: '400',
      lineHeight: '1.625',
      letterSpacing: '0',
    },
    body: {
      fontSize: '1rem',         // 16px
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    bodySmall: {
      fontSize: '0.875rem',     // 14px
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    
    // Labels
    label: {
      fontSize: '0.875rem',     // 14px
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    labelSmall: {
      fontSize: '0.75rem',      // 12px
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '0.025em',
    },
    
    // Caption
    caption: {
      fontSize: '0.75rem',      // 12px
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    
    // Button
    button: {
      fontSize: '0.875rem',     // 14px
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '0.025em',
    },
    buttonLarge: {
      fontSize: '1rem',         // 16px
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '0.025em',
    },
    
    // Code
    code: {
      fontSize: '0.875rem',     // 14px
      fontWeight: '400',
      lineHeight: '1.625',
      letterSpacing: '0',
    },
  },
} as const;

export type TypographyToken = typeof typography;
