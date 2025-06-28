import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeelingInputProps {
  feeling: string;
  setFeeling: (feeling: string) => void;
  currentPromptIndex: number;
  feelingPrompts: string[];
  isDarkMode: boolean;
  getTextColor: () => string;
  getSecondaryTextColor: () => string;
}

const FeelingInput: React.FC<FeelingInputProps> = ({
  feeling,
  setFeeling,
  currentPromptIndex,
  feelingPrompts,
  isDarkMode,
  getTextColor,
  getSecondaryTextColor
}) => {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      <h2 style={{
        fontSize: '1.5rem',
        marginBottom: '24px',
        textAlign: 'center',
        color: getTextColor(),
        fontFamily: "'EB Garamond', serif",
        fontWeight: 400
      }}>
        How are you feeling now?
      </h2>
      
      <p style={{
        textAlign: 'center',
        color: getSecondaryTextColor(),
        fontSize: '1rem',
        marginBottom: '32px',
        fontStyle: 'italic'
      }}>
        A sentence, a sigh, a scream — write what you carry. <span style={{ opacity: 0.7 }}>(or skip)</span>
      </p>
      
      <div style={{ position: 'relative' }}>
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '24px',
            border: `2px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.2)'}`,
            borderRadius: '12px',
            fontSize: '1.1rem',
            lineHeight: 1.6,
            resize: 'vertical',
            background: isDarkMode ? 'rgba(28, 25, 23, 0.8)' : 'rgba(254, 254, 254, 0.9)',
            fontFamily: "'EB Garamond', serif",
            backdropFilter: 'blur(10px)',
            color: getTextColor(),
            outline: 'none',
            transition: 'border-color 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = isDarkMode ? '#FDBA74' : '#8B7DA1';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.2)';
          }}
        />
        
        {/* Animated placeholder when empty */}
        {feeling === '' && (
          <motion.div
            key={currentPromptIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 0.6, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              top: '24px',
              left: '24px',
              fontSize: '1.1rem',
              color: getSecondaryTextColor(),
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic',
              pointerEvents: 'none'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={currentPromptIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {feelingPrompts[currentPromptIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FeelingInput;