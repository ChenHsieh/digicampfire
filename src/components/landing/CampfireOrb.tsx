import React from 'react';
import { motion } from 'framer-motion';

interface CampfireOrbProps {
  orbRef: React.RefObject<HTMLDivElement>;
  mousePosition: { x: number; y: number };
  isOrbHovered: boolean;
  setIsOrbHovered: (hovered: boolean) => void;
  isDarkMode: boolean;
}

const CampfireOrb: React.FC<CampfireOrbProps> = ({
  orbRef,
  mousePosition,
  isOrbHovered,
  setIsOrbHovered,
  isDarkMode
}) => {
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

  return (
    <div 
      ref={orbRef}
      onMouseEnter={() => setIsOrbHovered(true)}
      onMouseLeave={() => setIsOrbHovered(false)}
      className="w-40 h-40 rounded-full mx-auto mb-12 flex items-center justify-center cursor-pointer relative transition-all duration-300"
      style={{
        background: getOrbBackground(),
        boxShadow: getOrbShadow(isOrbHovered),
        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(${isOrbHovered ? 1.1 : 1})`
      }}
    >
      {/* Inner flame effect - more intense in dark mode */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-20 h-20 rounded-full"
        style={{ background: getInnerFlameBackground() }}
      />
    </div>
  );
};

export default CampfireOrb;