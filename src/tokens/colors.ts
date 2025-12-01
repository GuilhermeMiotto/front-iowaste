/**
 * Design Tokens - Paleta de Cores ESG IoWaste
 * Sistema de cores sustentável com foco em acessibilidade WCAG 2.1 AA
 */

export const colors = {
  // Primary Green (ESG Verde Sustentável)
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#16a34a',  // Verde principal ESG
    600: '#15803d',
    700: '#166534',
    800: '#14532d',
    900: '#052e16',
  },
  
  // Secondary Blue (Água e Limpeza)
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Warning Amber (Alertas Médios)
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Danger Red (Alertas Críticos)
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Purple (Relatórios e Analytics)
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  // Gray (Neutral Scale)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Status Colors (Bombonas)
  status: {
    vazia: '#9ca3af',        // gray-400
    normal: '#16a34a',       // primary-500
    alerta: '#f59e0b',       // warning-500
    cheia: '#dc2626',        // danger-600
    critica: '#991b1b',      // danger-800
  },
  
  // Waste Type Colors (Tipos de Resíduos)
  wasteType: {
    hospitalar_infectante: '#dc2626',    // Red (Perigo biológico)
    hospitalar_quimico: '#f59e0b',       // Amber (Químico)
    hospitalar_perfurocortante: '#ef4444', // Red light (Perfuro)
    industrial_toxico: '#991b1b',        // Dark red (Tóxico)
    solventes_organicos: '#d97706',      // Orange (Solvente)
    metais_pesados: '#6b7280',           // Gray (Metal)
    farmaceutico: '#3b82f6',             // Blue (Farmácia)
    outros_perigosos: '#fbbf24',         // Yellow (Outros)
  },
  
  // Background
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',    // gray-50
    tertiary: '#f3f4f6',     // gray-100
  },
  
  // Text
  text: {
    primary: '#111827',      // gray-900
    secondary: '#4b5563',    // gray-600
    tertiary: '#9ca3af',     // gray-400
    inverse: '#ffffff',
  },
  
  // Border
  border: {
    light: '#e5e7eb',        // gray-200
    medium: '#d1d5db',       // gray-300
    dark: '#9ca3af',         // gray-400
  },
} as const;

export type ColorToken = typeof colors;
