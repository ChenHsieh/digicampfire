export const getLandingStyles = (isDarkMode: boolean) => {
  const getCardBackground = (isSelected: boolean) => {
    if (isDarkMode) {
      return isSelected ? 'rgba(180, 83, 9, 0.25)' : 'rgba(28, 25, 23, 0.8)';
    }
    return isSelected ? 'rgba(244, 194, 194, 0.15)' : 'rgba(254, 254, 254, 0.8)';
  };

  const getCardBorder = (isSelected: boolean) => {
    if (isDarkMode) {
      return isSelected ? '#FDBA74' : 'rgba(180, 83, 9, 0.3)';
    }
    return isSelected ? '#8B7DA1' : 'rgba(139, 125, 161, 0.2)';
  };

  const getTextColor = () => isDarkMode ? '#FEF7ED' : '#2D2D37';
  const getSecondaryTextColor = () => isDarkMode ? '#FDBA74' : '#8B7DA1';
  const getButtonBackground = () => isDarkMode ? 'rgba(28, 25, 23, 0.8)' : 'rgba(254, 254, 254, 0.8)';
  const getButtonBorder = () => isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.2)';

  const getOrbBackground = () => {
    if (isDarkMode) {
      return `
        radial-gradient(circle at 30% 30%, rgba(254, 247, 237, 0.1) 0%, transparent 30%),
        radial-gradient(circle at 70% 70%, rgba(251, 146, 60, 0.8) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(180, 83, 9, 0.7) 0%, transparent 70%),
        linear-gradient(135deg, rgba(28, 25, 23, 0.9) 0%, rgba(180, 83, 9, 0.7) 50%, rgba(251, 146, 60, 0.6) 100%)
      `;
    }
    return `
      radial-gradient(circle at 30% 30%, rgba(254, 254, 254, 0.9) 0%, transparent 30%),
      radial-gradient(circle at 70% 70%, rgba(244, 194, 194, 0.7) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(139, 125, 161, 0.6) 0%, transparent 70%),
      linear-gradient(135deg, rgba(45, 45, 55, 0.8) 0%, rgba(139, 125, 161, 0.6) 50%, rgba(244, 194, 194, 0.5) 100%)
    `;
  };

  const getOrbShadow = (isHovered: boolean) => {
    return `
      0 0 60px rgba(${isDarkMode ? '251, 146, 60' : '139, 125, 161'}, ${isHovered ? (isDarkMode ? 0.8 : 0.6) : (isDarkMode ? 0.6 : 0.4)}),
      0 0 120px rgba(${isDarkMode ? '180, 83, 9' : '244, 194, 194'}, ${isHovered ? (isDarkMode ? 0.6 : 0.4) : (isDarkMode ? 0.4 : 0.2)}),
      inset 0 0 60px rgba(254, 254, 254, ${isDarkMode ? 0.05 : 0.1})
    `;
  };

  const getInnerFlameBackground = () => {
    return isDarkMode ? 
      'radial-gradient(circle, rgba(251, 146, 60, 0.9) 0%, transparent 70%)' :
      'radial-gradient(circle, rgba(244, 194, 194, 0.8) 0%, transparent 70%)';
  };

  return {
    getCardBackground,
    getCardBorder,
    getTextColor,
    getSecondaryTextColor,
    getButtonBackground,
    getButtonBorder,
    getOrbBackground,
    getOrbShadow,
    getInnerFlameBackground
  };
};