import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface AnchorSelectionProps {
  anchorWords: string[];
  selectedAnchor: string;
  loadingAnchors: boolean;
  loadNewAnchors: () => void;
  handleSelection: (value: string, type: 'whisper' | 'anchor') => void;
  isDarkMode: boolean;
  getCardBackground: (isSelected: boolean) => string;
  getCardBorder: (isSelected: boolean) => string;
  getTextColor: () => string;
  getSecondaryTextColor: () => string;
  getButtonBackground: () => string;
  getButtonBorder: () => string;
  getHaloTextStyle: () => { textShadow: string };
}

const AnchorSelection: React.FC<AnchorSelectionProps> = ({
  anchorWords,
  selectedAnchor,
  loadingAnchors,
  loadNewAnchors,
  handleSelection,
  isDarkMode,
  getCardBackground,
  getCardBorder,
  getTextColor,
  getSecondaryTextColor,
  getButtonBackground,
  getButtonBorder,
  getHaloTextStyle
}) => {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
        <h2 style={{
          fontSize: '1.5rem',
          textAlign: 'center',
          color: getTextColor(),
          fontFamily: "'EB Garamond', serif",
          fontWeight: 500,
          ...getHaloTextStyle()
        }}>
          Choose the word that anchors us.
        </h2>
        <motion.button
          onClick={loadNewAnchors}
          disabled={loadingAnchors}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            padding: '8px',
            borderRadius: '50%',
            background: getButtonBackground(),
            border: `1px solid ${getButtonBorder()}`,
            cursor: loadingAnchors ? 'not-allowed' : 'pointer',
            opacity: loadingAnchors ? 0.5 : 1,
            backdropFilter: 'blur(10px)'
          }}
        >
          <RefreshCw 
            size={16} 
            color={getSecondaryTextColor()}
            style={{
              animation: loadingAnchors ? 'spin 1s linear infinite' : 'none'
            }}
          />
        </motion.button>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
        maxWidth: '600px',
        margin: '0 auto 40px'
      }}>
        {anchorWords.slice(0, 6).map((word, index) => (
          <motion.button
            key={`${word}-${index}`}
            onClick={() => handleSelection(word, 'anchor')}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            animate={selectedAnchor === word ? {
              background: [
                getCardBackground(true),
                isDarkMode ? 'rgba(180, 83, 9, 0.4)' : 'rgba(139, 125, 161, 0.4)',
                getCardBackground(true)
              ]
            } : {}}
            transition={{ 
              scale: { duration: 0.2 },
              background: { duration: 0.6, repeat: selectedAnchor === word ? 2 : 0 }
            }}
            style={{
              padding: '16px 24px',
              border: `3px solid ${selectedAnchor === word ? getTextColor() : (isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(45, 45, 55, 0.2)')}`,
              borderRadius: '50px',
              background: getCardBackground(selectedAnchor === word),
              cursor: 'pointer',
              boxShadow: selectedAnchor === word ? 
                (isDarkMode ? '0 8px 24px rgba(251, 146, 60, 0.3)' : '0 8px 24px rgba(45, 45, 55, 0.2)') : 
                (isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(45, 45, 55, 0.1)'),
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              fontFamily: "'Courier Prime', monospace",
              fontSize: '1rem',
              fontWeight: 600,
              color: getTextColor(),
              textTransform: 'lowercase'
            }}
          >
            {word}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default AnchorSelection;