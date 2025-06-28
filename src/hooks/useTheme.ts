import { useState, useEffect, useRef } from 'react';
import { createCampfireMusicGenerator, MusicGenerator } from '../utils/musicGenerator';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const musicGeneratorRef = useRef<MusicGenerator | null>(null);

  // Load preferences from localStorage on mount, with system preference fallback
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('digitalCampfire_darkMode');
    const savedSoundOn = localStorage.getItem('digitalCampfire_soundOn');
    
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    } else {
      // Use system preference if no saved preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemPrefersDark);
    }
    
    if (savedSoundOn !== null) {
      setIsSoundOn(JSON.parse(savedSoundOn));
    }
  }, []);

  // Initialize campfire music generator
  useEffect(() => {
    // Create the music generator
    musicGeneratorRef.current = createCampfireMusicGenerator();

    // Cleanup function
    return () => {
      if (musicGeneratorRef.current) {
        musicGeneratorRef.current.cleanup();
        musicGeneratorRef.current = null;
      }
    };
  }, []);

  // Control sound playback based on isSoundOn state
  useEffect(() => {
    if (musicGeneratorRef.current) {
      if (isSoundOn) {
        // Start the music generator
        musicGeneratorRef.current.start();
      } else {
        // Stop the music generator
        musicGeneratorRef.current.stop();
      }
    }
  }, [isSoundOn]);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('digitalCampfire_darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('digitalCampfire_soundOn', JSON.stringify(isSoundOn));
  }, [isSoundOn]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
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

  const getTextColor = () => isDarkMode ? '#FEF7ED' : '#2D2D37';
  const getSecondaryTextColor = () => isDarkMode ? '#FDBA74' : '#8B7DA1';
  const getFooterBackground = () => isDarkMode ? 'rgba(28, 25, 23, 0.9)' : 'rgba(254, 254, 254, 0.8)';
  const getFooterBorder = () => isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.1)';
  const getLinkColor = () => isDarkMode ? '#FDBA74' : '#8B7DA1';
  const getLinkHoverColor = () => isDarkMode ? '#FED7AA' : '#2D2D37';

  // Centralized card styling functions
  const getCardBackground = (isSelected: boolean = false) => {
    if (isDarkMode) {
      return isSelected ? 'rgba(180, 83, 9, 0.25)' : 'rgba(28, 25, 23, 0.8)';
    }
    return isSelected ? 'rgba(244, 194, 194, 0.15)' : 'rgba(254, 254, 254, 0.8)';
  };

  const getCardBorder = (isSelected: boolean = false) => {
    if (isDarkMode) {
      return isSelected ? '#FDBA74' : 'rgba(180, 83, 9, 0.3)';
    }
    return isSelected ? '#8B7DA1' : 'rgba(139, 125, 161, 0.2)';
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
    isSoundOn,
    toggleDarkMode,
    toggleSound,
    getBackgroundStyle,
    getTextColor,
    getSecondaryTextColor,
    getFooterBackground,
    getFooterBorder,
    getLinkColor,
    getLinkHoverColor,
    getCardBackground,
    getCardBorder,
    getPoemBackground,
    getPoemShadow
  };
};