// Custom hook for theme management
import { useMemo } from 'react';

export interface ThemeColors {
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  background: string;
  border: string;
  shadow: string;
  glowShadow?: string;
}

export const useTheme = (isDarkMode: boolean): ThemeColors => {
  return useMemo(() => {
    if (isDarkMode) {
      return {
        primary: '#EA580C',
        secondary: '#C2410C',
        text: '#E5E5E5',
        textSecondary: 'rgba(229, 229, 229, 0.7)',
        background: 'rgba(229, 229, 229, 0.05)',
        border: 'rgba(234, 88, 12, 0.3)',
        shadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(234, 88, 12, 0.1)',
        glowShadow: '0 0 60px rgba(234, 88, 12, 0.3), 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(234, 88, 12, 0.2)'
      };
    } else {
      return {
        primary: '#C2410C',
        secondary: '#EA580C',
        text: '#1a1a1a',
        textSecondary: 'rgba(26, 26, 26, 0.7)',
        background: 'rgba(26, 26, 26, 0.05)',
        border: 'rgba(194, 65, 12, 0.4)',
        shadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(194, 65, 12, 0.2)',
        glowShadow: '0 0 60px rgba(194, 65, 12, 0.2), 0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(194, 65, 12, 0.3)'
      };
    }
  }, [isDarkMode]);
};