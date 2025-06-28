import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Edit3, Copy, Check } from 'lucide-react';
import { validateSkinnyPoem } from '../utils/openai';
import { useTheme } from '../hooks/useTheme';

interface Poem {
  whisper: string;
  anchor: string;
  feeling: string;
  text: string;
}

interface DisplayProps {
  poem: Poem;
  onBack: () => void;
}

const Display: React.FC<DisplayProps> = ({ poem, onBack }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCuratorTweak, setShowCuratorTweak] = useState(false);
  const [editedPoem, setEditedPoem] = useState(poem.text);
  const [currentPoem, setCurrentPoem] = useState(poem.text);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const {
    isDarkMode,
    isSoundOn,
    getTextColor,
    getSecondaryTextColor,
    getCardBackground,
    getCardBorder,
    getPoemBackground,
    getPoemShadow
  } = useTheme();
  
  const lines = currentPoem.split('\n').filter(line => line.trim() !== '');
  
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines(prev => {
        if (prev < lines.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 600);
    
    return () => clearInterval(timer);
  }, [lines.length]);

  const handleSaveTweak = async () => {
    // Validate the edited poem follows Skinny poem rules
    const validation = await validateSkinnyPoem(editedPoem, poem.anchor);
    
    if (!validation.isValid) {
      alert(`Please check the Skinny poem structure:\n${validation.issues.join('\n')}`);
      return;
    }
    
    setCurrentPoem(editedPoem);
    setShowCuratorTweak(false);
  };

  const handleCopyToClipboard = async () => {
    const shareText = `${currentPoem}\n\n— Created at Digital Campfire`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleShareViaEmail = () => {
    const subject = encodeURIComponent('A poem from Digital Campfire');
    const body = encodeURIComponent(`${currentPoem}\n\n— Created at Digital Campfire\n\nCreate your own poem at: ${window.location.origin}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px 0 80px',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '0 24px',
        width: '100%',
        position: 'relative'
      }}>
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: getSecondaryTextColor(),
            fontSize: '0.9rem',
            padding: '8px 16px',
            borderRadius: '20px',
            marginBottom: '40px',
            background: getCardBackground(),
            border: `1px solid ${getCardBorder()}`,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            fontFamily: "'Courier Prime', monospace"
          }}
        >
          <ArrowLeft size={16} />
          Return to the fire
        </motion.button>
        
        {/* Campfire glow for the poem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            background: getPoemBackground(),
            padding: '48px',
            borderRadius: '20px',
            boxShadow: getPoemShadow(),
            border: `1px solid ${getCardBorder()}`,
            backdropFilter: 'blur(15px)',
            marginBottom: '40px',
            position: 'relative'
          }}
        >
          {/* Floating embers effect - warmer in dark mode */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '4px',
            height: '4px',
            background: isDarkMode ? 'rgba(251, 146, 60, 0.9)' : 'rgba(244, 194, 194, 0.6)',
            borderRadius: '50%',
            animation: 'float 3s ease-in-out infinite'
          }} />
          
          <h1 style={{
            fontSize: '1.8rem',
            textAlign: 'center',
            marginBottom: '32px',
            color: getTextColor(),
            fontWeight: 400,
            fontFamily: "'EB Garamond', serif"
          }}>
            Your Verse by the Fire
          </h1>
          
          <div style={{
            fontSize: '1.2rem',
            lineHeight: 1.8,
            color: getTextColor(),
            whiteSpace: 'pre-wrap',
            textAlign: 'center',
            fontFamily: "'EB Garamond', serif"
          }}>
            {lines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ 
                  opacity: index < visibleLines ? 1 : 0,
                  y: index < visibleLines ? 0 : 15
                }}
                transition={{ 
                  duration: 0.8,
                  delay: index * 0.2
                }}
                style={{ marginBottom: '12px' }}
              >
                {line}
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Poem metadata */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}
        >
          <div style={{
            background: getCardBackground(),
            padding: '20px',
            borderRadius: '12px',
            border: `1px solid ${getCardBorder()}`,
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '0.8rem',
              color: getSecondaryTextColor(),
              marginBottom: '8px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontFamily: "'Courier Prime', monospace"
            }}>
              Whisper
            </div>
            <div style={{
              fontSize: '0.95rem',
              color: getTextColor(),
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic'
            }}>
              {poem.whisper}
            </div>
          </div>
          
          <div style={{
            background: getCardBackground(),
            padding: '20px',
            borderRadius: '12px',
            border: `1px solid ${getCardBorder()}`,
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '0.8rem',
              color: getSecondaryTextColor(),
              marginBottom: '8px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontFamily: "'Courier Prime', monospace"
            }}>
              Anchor
            </div>
            <div style={{
              fontSize: '1.1rem',
              color: getTextColor(),
              fontFamily: "'Courier Prime', monospace",
              fontWeight: 600
            }}>
              {poem.anchor}
            </div>
          </div>
          
          {poem.feeling && (
            <div style={{
              background: getCardBackground(),
              padding: '20px',
              borderRadius: '12px',
              border: `1px solid ${getCardBorder()}`,
              backdropFilter: 'blur(10px)',
              gridColumn: 'span 2'
            }}>
              <div style={{
                fontSize: '0.8rem',
                color: getSecondaryTextColor(),
                marginBottom: '8px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontFamily: "'Courier Prime', monospace"
              }}>
                What you carried
              </div>
              <div style={{
                fontSize: '1rem',
                color: getTextColor(),
                fontFamily: "'EB Garamond', serif",
                fontStyle: 'italic'
              }}>
                "{poem.feeling}"
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Curator Tweak Section */}
        {showCuratorTweak && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: isDarkMode ? 'rgba(28, 25, 23, 0.9)' : 'rgba(254, 254, 254, 0.9)',
              padding: '24px',
              borderRadius: '16px',
              border: `2px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.4)' : 'rgba(139, 125, 161, 0.2)'}`,
              backdropFilter: 'blur(15px)',
              marginBottom: '40px'
            }}
          >
            <h3 style={{
              fontSize: '1.2rem',
              marginBottom: '16px',
              color: getTextColor(),
              fontFamily: "'EB Garamond', serif",
              fontWeight: 500
            }}>
              Small Revisions in the Dusk
            </h3>
            <p style={{
              fontSize: '0.9rem',
              color: getSecondaryTextColor(),
              marginBottom: '16px',
              fontStyle: 'italic'
            }}>
              Edit carefully - changes will be validated against Skinny poem structure
            </p>
            <textarea
              value={editedPoem}
              onChange={(e) => setEditedPoem(e.target.value)}
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '16px',
                border: `1px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.5)' : 'rgba(139, 125, 161, 0.3)'}`,
                borderRadius: '8px',
                fontSize: '1rem',
                lineHeight: 1.6,
                resize: 'vertical',
                background: isDarkMode ? 'rgba(28, 25, 23, 0.8)' : 'rgba(254, 254, 254, 0.8)',
                fontFamily: "'EB Garamond', serif",
                color: getTextColor(),
                outline: 'none'
              }}
            />
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '16px',
              justifyContent: 'flex-end'
            }}>
              <motion.button
                onClick={() => {
                  setShowCuratorTweak(false);
                  setEditedPoem(currentPoem); // Reset to current poem
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: isDarkMode ? 'rgba(180, 83, 9, 0.2)' : 'rgba(139, 125, 161, 0.1)',
                  border: `1px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.4)' : 'rgba(139, 125, 161, 0.3)'}`,
                  color: getSecondaryTextColor(),
                  cursor: 'pointer',
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: '0.9rem'
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSaveTweak}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: isDarkMode ? 'linear-gradient(135deg, #1C1917 0%, #B45309 100%)' : 'linear-gradient(135deg, #2D2D37 0%, #8B7DA1 100%)',
                  border: 'none',
                  color: '#FEFEFE',
                  cursor: 'pointer',
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: '0.9rem'
                }}
              >
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        )}
        
        {/* Share Options Modal */}
        {showShareOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(45, 45, 55, 0.8)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={() => setShowShareOptions(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: isDarkMode ? 'rgba(28, 25, 23, 0.95)' : 'rgba(254, 254, 254, 0.95)',
                padding: '32px',
                borderRadius: '20px',
                border: `1px solid ${getCardBorder()}`,
                backdropFilter: 'blur(20px)',
                maxWidth: '400px',
                width: '100%',
                boxShadow: isDarkMode ? '0 20px 60px rgba(0, 0, 0, 0.5)' : '0 20px 60px rgba(45, 45, 55, 0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{
                fontSize: '1.4rem',
                marginBottom: '24px',
                color: getTextColor(),
                fontFamily: "'EB Garamond', serif",
                fontWeight: 500,
                textAlign: 'center'
              }}>
                Share Your Poem
              </h3>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <motion.button
                  onClick={handleCopyToClipboard}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    background: copySuccess ? 
                      (isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)') : 
                      (isDarkMode ? 'rgba(180, 83, 9, 0.2)' : 'rgba(139, 125, 161, 0.1)'),
                    border: `1px solid ${copySuccess ? 
                      (isDarkMode ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.3)') : 
                      (isDarkMode ? 'rgba(180, 83, 9, 0.4)' : 'rgba(139, 125, 161, 0.3)')}`,
                    color: copySuccess ? '#059669' : getTextColor(),
                    cursor: 'pointer',
                    fontFamily: "'Courier Prime', monospace",
                    fontSize: '0.95rem',
                    width: '100%',
                    justifyContent: 'flex-start',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {copySuccess ? <Check size={18} /> : <Copy size={18} />}
                  {copySuccess ? 'Copied to clipboard!' : 'Copy to clipboard'}
                </motion.button>
                
                <motion.button
                  onClick={handleShareViaEmail}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    background: isDarkMode ? 'rgba(180, 83, 9, 0.2)' : 'rgba(139, 125, 161, 0.1)',
                    border: `1px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.4)' : 'rgba(139, 125, 161, 0.3)'}`,
                    color: getTextColor(),
                    cursor: 'pointer',
                    fontFamily: "'Courier Prime', monospace",
                    fontSize: '0.95rem',
                    width: '100%',
                    justifyContent: 'flex-start'
                  }}
                >
                  <Share2 size={18} />
                  Share via email
                </motion.button>
              </div>
              
              <motion.button
                onClick={() => setShowShareOptions(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  marginTop: '24px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: isDarkMode ? 'rgba(180, 83, 9, 0.2)' : 'rgba(139, 125, 161, 0.1)',
                  border: `1px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.4)' : 'rgba(139, 125, 161, 0.3)'}`,
                  color: getSecondaryTextColor(),
                  cursor: 'pointer',
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: '0.9rem',
                  width: '100%'
                }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
        
        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <motion.button
            onClick={() => {
              setShowCuratorTweak(!showCuratorTweak);
              if (!showCuratorTweak) {
                setEditedPoem(currentPoem); // Initialize with current poem
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '25px',
              background: showCuratorTweak ? 
                (isDarkMode ? 'rgba(180, 83, 9, 0.4)' : 'rgba(139, 125, 161, 0.3)') : 
                (isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.2)'),
              border: `1px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.5)' : 'rgba(139, 125, 161, 0.4)'}`,
              color: getTextColor(),
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.9rem'
            }}
          >
            <Edit3 size={16} />
            Small revisions in the dusk
          </motion.button>
          
          <motion.button
            onClick={() => setShowShareOptions(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '25px',
              background: isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.2)',
              border: `1px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.5)' : 'rgba(139, 125, 161, 0.4)'}`,
              color: getTextColor(),
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.9rem'
            }}
          >
            <Share2 size={16} />
            Offer your spark
          </motion.button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          style={{ textAlign: 'center', marginTop: '40px' }}
        >
          <p style={{
            color: getSecondaryTextColor(),
            fontSize: '0.9rem',
            fontStyle: 'italic',
            fontFamily: "'EB Garamond', serif"
          }}>
            Thank you for sharing your light with us
          </p>
        </motion.div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateX(-50%) translateY(0px);
            opacity: 0.6;
          }
          50% { 
            transform: translateX(-50%) translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Display;