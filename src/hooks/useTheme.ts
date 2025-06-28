import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load preferences from localStorage on mount, with system preference fallback
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('digitalCampfire_darkMode');
    
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    } else {
      // Use system preference if no saved preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemPrefersDark);
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('digitalCampfire_darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Dynamic styles based on dark mode - campfire themed
  const getBackgroundStyle = () => {
    if (isDarkMode) {
      return `
        radial-gradient(circle at 20% 80%, rgba(180, 83, 9, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(92, 51, 23, 0.2) 0%, transparent 50%),
        linear-gradient(135deg, #1C1917 0%, #292524 50%, #1C1917 100%)
      `;
    }
    return `
      radial-gradient(circle at 20% 80%, rgba(139, 125, 161, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(244, 194, 194, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(45, 45, 55, 0.08) 0%, transparent 50%),
      linear-gradient(135deg, #FEFEFE 0%, #F8F8F8 100%)
    `;
  };

  // Particle noise background for both modes
  const getParticleNoiseStyle = () => {
    const particleColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    return {
      backgroundImage: `radial-gradient(circle at center, ${particleColor} 1px, transparent 1px)`,
      backgroundSize: '4px 4px'
    };
  };

  const getTextColor = () => isDarkMode ? '#FFFFFF' : '#2D2D37';
  
  // Updated adaptive secondary text color - more neutral and works in both modes
  const getSecondaryTextColor = () => {
    const baseColor = isDarkMode ? '255, 255, 255' : '45, 45, 55';
    return `rgba(${baseColor}, 0.7)`;
  };

  const getFooterBackground = () => isDarkMode ? 'rgba(28, 25, 23, 0.9)' : 'rgba(254, 254, 254, 0.8)';
  const getFooterBorder = () => isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.1)';
  
  // Updated adaptive link colors
  const getLinkColor = () => {
    const baseColor = isDarkMode ? '255, 255, 255' : '45, 45, 55';
    return `rgba(${baseColor}, 0.8)`;
  };
  
  const getLinkHoverColor = () => getTextColor();

  // Centralized card styling functions
  const getCardBackground = (isSelected: boolean = false) => {
    if (isDarkMode) {
      return isSelected ? 'rgba(180, 83, 9, 0.25)' : 'rgba(28, 25, 23, 0.8)';
    }
    return isSelected ? 'rgba(244, 194, 194, 0.15)' : 'rgba(254, 254, 254, 0.8)';
  };

  const getCardBorder = (isSelected: boolean = false) => {
    if (isDarkMode) {
      return isSelected ? '#FFC880' : 'rgba(180, 83, 9, 0.3)';
    }
    return isSelected ? '#8B7DA1' : 'rgba(139, 125, 161, 0.2)';
  };

  // New adaptive button styling functions
  const getAdaptiveButtonBackground = (opacity: number = 0.2) => {
    const baseColor = isDarkMode ? '255, 255, 255' : '45, 45, 55';
    return `rgba(${baseColor}, ${opacity})`;
  };

  const getAdaptiveButtonBorder = (opacity: number = 0.4) => {
    const baseColor = isDarkMode ? '255, 255, 255' : '45, 45, 55';
    return `rgba(${baseColor}, ${opacity})`;
  };

  // Display-specific styling functions
  const getPoemBackground = () => {
    if (isDarkMode) {
      return `
        radial-gradient(circle at center, rgba(180, 83, 9, 0.15) 0%, rgba(28, 25, 23, 0.9) 70%),
        rgba(28, 25, 23, 0.95)
      `;
    }
    return `
      radial-gradient(circle at center, rgba(244, 194, 194, 0.2) 0%, rgba(254, 254, 254, 0.9) 70%),
      rgba(254, 254, 254, 0.95)
    `;
  };

  const getPoemShadow = () => {
    if (isDarkMode) {
      return `
        0 0 60px rgba(180, 83, 9, 0.3),
        0 20px 40px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(251, 146, 60, 0.2)
      `;
    }
    return `
      0 0 40px rgba(139, 125, 161, 0.2),
      0 20px 40px rgba(45, 45, 55, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.8)
    `;
  };

  return {
    isDarkMode,
    toggleDarkMode,
    getBackgroundStyle,
    getParticleNoiseStyle,
    getTextColor,
    getSecondaryTextColor,
    getFooterBackground,
    getFooterBorder,
    getLinkColor,
    getLinkHoverColor,
    getCardBackground,
    getCardBorder,
    getAdaptiveButtonBackground,
    getAdaptiveButtonBorder,
    getPoemBackground,
    getPoemShadow
  };
};