import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ExternalLink } from 'lucide-react';

interface WhisperWithSource {
  poetic: string;
  headline: string;
  link: string;
}

interface WhisperSelectionProps {
  whisperOptions: WhisperWithSource[];
  selectedWhisper: WhisperWithSource | null;
  loadingWhispers: boolean;
  loadWhispers: () => void;
  handleSelection: (value: WhisperWithSource, type: 'whisper' | 'anchor') => void;
  isDarkMode: boolean;
  getCardBackground: (isSelected: boolean) => string;
  getCardBorder: (isSelected: boolean) => string;
  getTextColor: () => string;
  getSecondaryTextColor: () => string;
  getAdaptiveButtonBackground: (opacity: number) => string;
  getAdaptiveButtonBorder: (opacity: number) => string;
}

const WhisperSelection: React.FC<WhisperSelectionProps> = ({
  whisperOptions,
  selectedWhisper,
  loadingWhispers,
  loadWhispers,
  handleSelection,
  isDarkMode,
  getCardBackground,
  getCardBorder,
  getTextColor,
  getSecondaryTextColor,
  getAdaptiveButtonBackground,
  getAdaptiveButtonBorder
}) => {
  return (
    <motion.div
      key="step1"
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
          fontWeight: 500
        }}>
          Which whisper echoes loudest today?
        </h2>
        <motion.button
          onClick={loadWhispers}
          disabled={loadingWhispers}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            padding: '8px',
            borderRadius: '50%',
            background: getAdaptiveButtonBackground(0.1),
            border: `1px solid ${getAdaptiveButtonBorder(0.2)}`,
            cursor: loadingWhispers ? 'not-allowed' : 'pointer',
            opacity: loadingWhispers ? 0.5 : 1,
            backdropFilter: 'blur(10px)'
          }}
        >
          <RefreshCw 
            size={16} 
            color={getSecondaryTextColor()}
            style={{
              animation: loadingWhispers ? 'spin 1s linear infinite' : 'none'
            }}
          />
        </motion.button>
      </div>
      
      {loadingWhispers ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
          color: getSecondaryTextColor(),
          fontSize: '1rem',
          fontStyle: 'italic'
        }}>
          Transforming today's currents into whispers...
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          marginBottom: '40px',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          {whisperOptions.map((whisper, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.01, y: -2 }}
              animate={selectedWhisper?.poetic === whisper.poetic ? {
                background: [
                  getCardBackground(true),
                  isDarkMode ? 'rgba(180, 83, 9, 0.4)' : 'rgba(244, 194, 194, 0.4)',
                  getCardBackground(true)
                ]
              } : {}}
              transition={{ 
                scale: { duration: 0.2 },
                background: { duration: 0.6, repeat: selectedWhisper?.poetic === whisper.poetic ? 2 : 0 }
              }}
              onClick={() => handleSelection(whisper, 'whisper')}
              style={{
                padding: '28px 32px',
                border: `2px solid ${getCardBorder(selectedWhisper?.poetic === whisper.poetic)}`,
                borderRadius: '16px',
                background: getCardBackground(selectedWhisper?.poetic === whisper.poetic),
                cursor: 'pointer',
                boxShadow: selectedWhisper?.poetic === whisper.poetic ? 
                  (isDarkMode ? '0 8px 32px rgba(251, 146, 60, 0.3)' : '0 8px 32px rgba(139, 125, 161, 0.2)') : 
                  (isDarkMode ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(45, 45, 55, 0.08)'),
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Main poetic phrase */}
              <div style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: '1.4rem',
                color: getTextColor(),
                lineHeight: 1.4,
                fontWeight: 500,
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                {whisper.poetic}
              </div>
              
              {/* Source headline with link */}
              <div style={{
                borderTop: `1px solid ${getAdaptiveButtonBorder(0.25)}`,
                paddingTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div style={{
                  fontSize: '0.85rem',
                  color: getSecondaryTextColor(),
                  fontFamily: "'Courier Prime', monospace",
                  lineHeight: 1.3,
                  flex: 1
                }}>
                  {whisper.headline}
                </div>
                <motion.a
                  href={whisper.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    background: getAdaptiveButtonBackground(0.15),
                    border: `1px solid ${getAdaptiveButtonBorder(0.3)}`,
                    color: getSecondaryTextColor(),
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                    fontFamily: "'Courier Prime', monospace",
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = getAdaptiveButtonBackground(0.25);
                    e.currentTarget.style.color = getTextColor();
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = getAdaptiveButtonBackground(0.15);
                    e.currentTarget.style.color = getSecondaryTextColor();
                  }}
                >
                  <ExternalLink size={12} />
                  Source
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default WhisperSelection;