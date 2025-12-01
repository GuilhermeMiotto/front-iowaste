/**
 * Design Tokens - Border Radius ESG IoWaste
 * Sistema de arredondamento de bordas consistente
 */

export const radius = {
  none: '0',
  sm: '0.25rem',      // 4px - Small elements (badges, tags)
  md: '0.5rem',       // 8px - Cards, inputs, buttons
  lg: '0.75rem',      // 12px - Large cards, containers
  xl: '1rem',         // 16px - Hero sections, modals
  '2xl': '1.5rem',    // 24px - Special containers
  '3xl': '2rem',      // 32px - Large containers
  full: '9999px',     // Fully rounded (pills, avatars)
  
  // Semantic radius (named for purpose)
  semantic: {
    button: '0.5rem',         // 8px
    input: '0.5rem',          // 8px
    card: '0.75rem',          // 12px
    modal: '1rem',            // 16px
    badge: '0.25rem',         // 4px
    pill: '9999px',           // Full rounded
    avatar: '9999px',         // Full rounded
    tooltip: '0.375rem',      // 6px
  },
} as const;

export type RadiusToken = typeof radius;
