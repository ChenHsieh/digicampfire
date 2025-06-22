import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Edit3, Copy, Check } from 'lucide-react';
import { validateSkinnyPoem } from '../utils/openai';

interface Poem {
  whisper: string;
  anchor: string;
  feeling: string;
  text: string;
}

interface DisplayProps {
  poem: Poem;
  onBack: () => void;
  onNavigate: (page: 'landing' | 'display' | 'privacy' | 'about') => void;
}

const Display: React.FC<DisplayProps> = ({ poem, onBack, onNavigate }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCuratorTweak, setShowCuratorTweak] = useState(false);
  const [editedPoem, setEditedPoem] = useState(poem.text);
  const [currentPoem, setCurrentPoem] = useState(poem.text);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
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
            color: '#EA580C',
            fontSize: '0.9rem',
            padding: '8px 16px',
            borderRadius: '20px',
            marginBottom: '40px',
            background: 'rgba(229, 229, 229, 0.08)',
            border: '1px solid rgba(234, 88, 12, 0.3)',
            cursor: 'pointer',
            backdropFilter: 'blur(15px)',
            fontFamily: "'Courier Prime', monospace",
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(234, 88, 12, 0.1)'
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
            background: `
              radial-gradient(circle at center, rgba(234, 88, 12, 0.08) 0%, transparent 70%),
              rgba(229, 229, 229, 0.05)
            `,
            padding: '48px',
            borderRadius: '20px',
            boxShadow: `
              0 0 60px rgba(234, 88, 12, 0.3),
              0 8px 32px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(234, 88, 12, 0.2)
            `,
            border: '1px solid rgba(234, 88, 12, 0.2)',
            backdropFilter: 'blur(20px)',
            marginBottom: '40px',
            position: 'relative'
          }}
        >
          {/* Floating embers effect */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '4px',
            height: '4px',
            background: 'rgba(234, 88, 12, 0.6)',
            borderRadius: '50%',
            animation: 'float 3s ease-in-out infinite'
          }} />
          
          <h1 style={{
            fontSize: '1.8rem',
            textAlign: 'center',
            marginBottom: '32px',
            color: '#E5E5E5',
            fontWeight: 400,
            fontFamily: "'EB Garamond', serif"
          }}>
            Your Verse by the Fire
          </h1>
          
          <div style={{
            fontSize: '1.2rem',
            lineHeight: 1.8,
            color: '#E5E5E5',
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
            background: 'rgba(229, 229, 229, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(234, 88, 12, 0.2)',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(234, 88, 12, 0.1)'
          }}>
            <div style={{
              fontSize: '0.8rem',
              color: '#EA580C',
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
              color: '#E5E5E5',
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic'
            }}>
              {poem.whisper}
            </div>
          </div>
          
          <div style={{
            background: 'rgba(229, 229, 229, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(234, 88, 12, 0.2)',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(234, 88, 12, 0.1)'
          }}>
            <div style={{
              fontSize: '0.8rem',
              color: '#EA580C',
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
              color: '#E5E5E5',
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic'
            }}>
              {poem.anchor}
            </div>
          </div>
          
          {poem.feeling && (
            <div style={{
              background: 'rgba(229, 229, 229, 0.05)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid rgba(234, 88, 12, 0.2)',
              backdropFilter: 'blur(15px)',
              gridColumn: 'span 2',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(234, 88, 12, 0.1)'
            }}>
              <div style={{
                fontSize: '0.8rem',
                color: '#EA580C',
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
                color: '#E5E5E5',
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
              background: 'rgba(229, 229, 229, 0.08)',
              padding: '24px',
              borderRadius: '16px',
              border: '2px solid rgba(234, 88, 12, 0.3)',
              backdropFilter: 'blur(20px)',
              marginBottom: '40px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(234, 88, 12, 0.2)'
            }}
          >
            <h3 style={{
              fontSize: '1.2rem',
              marginBottom: '16px',
              color: '#E5E5E5',
              fontFamily: "'EB Garamond', serif",
              fontWeight: 500
            }}>
              Small Revisions in the Dusk
            </h3>
            <p style={{
              fontSize: '0.9rem',
              color: '#EA580C',
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
                border: '1px solid rgba(234, 88, 12, 0.4)',
                borderRadius: '8px',
                fontSize: '1rem',
                lineHeight: 1.6,
                resize: 'vertical',
                background: 'rgba(229, 229, 229, 0.05)',
                fontFamily: "'EB Garamond', serif",
                color: '#E5E5E5',
                outline: 'none',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(234, 88, 12, 0.1)'
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
                  background: 'rgba(234, 88, 12, 0.15)',
                  border: '1px solid rgba(234, 88, 12, 0.4)',
                  color: '#EA580C',
                  cursor: 'pointer',
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: '0.9rem',
                  backdropFilter: 'blur(10px)'
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
                  background: 'linear-gradient(135deg, #2D2D37 0%, #EA580C 100%)',
                  border: 'none',
                  color: '#E5E5E5',
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
              background: 'rgba(26, 26, 26, 0.9)',
              backdropFilter: 'blur(15px)',
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
                background: 'rgba(229, 229, 229, 0.08)',
                padding: '32px',
                borderRadius: '20px',
                border: '1px solid rgba(234, 88, 12, 0.3)',
                backdropFilter: 'blur(25px)',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(234, 88, 12, 0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{
                fontSize: '1.4rem',
                marginBottom: '24px',
                color: '#E5E5E5',
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
                    background: copySuccess ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 88, 12, 0.15)',
                    border: `1px solid ${copySuccess ? 'rgba(34, 197, 94, 0.4)' : 'rgba(234, 88, 12, 0.4)'}`,
                    color: copySuccess ? '#22c55e' : '#E5E5E5',
                    cursor: 'pointer',
                    fontFamily: "'Courier Prime', monospace",
                    fontSize: '0.95rem',
                    width: '100%',
                    justifyContent: 'flex-start',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
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
                    background: 'rgba(234, 88, 12, 0.15)',
                    border: '1px solid rgba(234, 88, 12, 0.4)',
                    color: '#E5E5E5',
                    cursor: 'pointer',
                    fontFamily: "'Courier Prime', monospace",
                    fontSize: '0.95rem',
                    width: '100%',
                    justifyContent: 'flex-start',
                    backdropFilter: 'blur(10px)'
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
                  background: 'rgba(234, 88, 12, 0.15)',
                  border: '1px solid rgba(234, 88, 12, 0.4)',
                  color: '#EA580C',
                  cursor: 'pointer',
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: '0.9rem',
                  width: '100%',
                  backdropFilter: 'blur(10px)'
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
              background: showCuratorTweak ? 'rgba(234, 88, 12, 0.25)' : 'rgba(234, 88, 12, 0.15)',
              border: '1px solid rgba(234, 88, 12, 0.4)',
              color: '#E5E5E5',
              cursor: 'pointer',
              backdropFilter: 'blur(15px)',
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.9rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(234, 88, 12, 0.1)'
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
              background: 'rgba(234, 88, 12, 0.15)',
              border: '1px solid rgba(234, 88, 12, 0.4)',
              color: '#E5E5E5',
              cursor: 'pointer',
              backdropFilter: 'blur(15px)',
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.9rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(234, 88, 12, 0.1)'
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
            color: '#EA580C',
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