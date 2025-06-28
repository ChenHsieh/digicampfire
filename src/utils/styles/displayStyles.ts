export const getDisplayStyles = (isDarkMode: boolean) => {
  const getTextColor = () => isDarkMode ? '#FEF7ED' : '#2D2D37';
  const getSecondaryTextColor = () => isDarkMode ? '#FDBA74' : '#8B7DA1';
  const getCardBackground = () => isDarkMode ? 'rgba(28, 25, 23, 0.8)' : 'rgba(254, 254, 254, 0.8)';
  const getCardBorder = () => isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.15)';
  
  const getPoemBackground = () => {
    if (isDarkMode) {
      return `
        radial-gradient(circle at center, rgba(251, 146, 60, 0.15) 0%, transparent 70%),
        rgba(28, 25, 23, 0.9)
      `;
    }
    return `
      radial-gradient(circle at center, rgba(244, 194, 194, 0.1) 0%, transparent 70%),
      rgba(254, 254, 254, 0.9)
    `;
  };
  
  const getPoemShadow = () => {
    if (isDarkMode) {
      return `
        0 0 60px rgba(251, 146, 60, 0.2),
        0 8px 32px rgba(0, 0, 0, 0.4)
      `;
    }
    return `
      0 0 60px rgba(139, 125, 161, 0.2),
      0 8px 32px rgba(45, 45, 55, 0.1)
    `;
  };

  return {
    getTextColor,
    getSecondaryTextColor,
    getCardBackground,
    getCardBorder,
    getPoemBackground,
    getPoemShadow
  };
};