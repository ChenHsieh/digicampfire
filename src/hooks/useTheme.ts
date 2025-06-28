import { useState, useEffect, useRef } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Initialize campfire sound
  useEffect(() => {
    // Create audio element for campfire sound
    const audio = new Audio('/campfire-sound.mp3');
    audio.loop = true;
    audio.volume = 0.3; // Keep it subtle
    audioRef.current = audio;

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Control sound playback based on isSoundOn state
  useEffect(() => {
    if (audioRef.current) {
      if (isSoundOn) {
        // Use a promise to handle potential autoplay restrictions
        audioRef.current.play().catch(error => {
          console.log('Audio autoplay prevented:', error);
          // This is normal behavior in many browsers
        });
      } else {
        audioRef.current.pause();
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
    getCardBorder
  };
};