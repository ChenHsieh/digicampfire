import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Edit3 } from 'lucide-react';

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
  const lines = poem.text.split('\n').filter(line => line.trim() !== '');
  
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

  const handleSaveTweak = () => {
    setShowCuratorTweak(false);
    // Here you could update the poem state if needed
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
            color: '#8B7DA1',
            fontSize: '0.9rem',
            padding: '8px 16px',
            borderRadius: '20px',
            marginBottom: '40px',
            background: 'rgba(254, 254, 254, 0.8)',
            border: '1px solid rgba(139, 125, 161, 0.2)',
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
            background: `
              radial-gradient(circle at center, rgba(244, 194, 194, 0.1) 0%, transparent 70%),
              rgba(254, 254, 254, 0.9)
            `,
            padding: '48px',
            borderRadius: '20px',
            boxShadow: `
              0 0 60px rgba(139, 125, 161, 0.2),
              0 8px 32px rgba(45, 45, 55, 0.1)
            `,
            border: '1px solid rgba(139, 125, 161, 0.15)',
            backdropFilter: 'blur(15px)',
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
            background: 'rgba(244, 194, 194, 0.6)',
            borderRadius: '50%',
            animation: 'float 3s ease-in-out infinite'
          }} />
          
          <h1 style={{
            fontSize: '1.8rem',
            textAlign: 'center',
            marginBottom: '32px',
            color: '#2D2D37',
            fontWeight: 400,
            fontFamily: "'EB Garamond', serif"
          }}>
            Your Verse by the Fire
          </h1>
          
          <div style={{
            fontSize: '1.2rem',
            lineHeight: 1.8,
            color: '#2D2D37',
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
            background: 'rgba(254, 254, 254, 0.8)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(139, 125, 161, 0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '0.8rem',
              color: '#8B7DA1',
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
              color: '#2D2D37',
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic'
            }}>
              {poem.whisper}
            </div>
          </div>
          
          <div style={{
            background: 'rgba(254, 254, 254, 0.8)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(139, 125, 161, 0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '0.8rem',
              color: '#8B7DA1',
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
              color: '#2D2D37',
              fontFamily: "'Courier Prime', monospace",
              fontWeight: 600
            }}>
              {poem.anchor}
            </div>
          </div>
          
          {poem.feeling && (
            <div style={{
              background: 'rgba(254, 254, 254, 0.8)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid rgba(139, 125, 161, 0.15)',
              backdropFilter: 'blur(10px)',
              gridColumn: 'span 2'
            }}>
              <div style={{
                fontSize: '0.8rem',
                color: '#8B7DA1',
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
                color: '#2D2D37',
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
              background: 'rgba(254, 254, 254, 0.9)',
              padding: '24px',
              borderRadius: '16px',
              border: '2px solid rgba(139, 125, 161, 0.2)',
              backdropFilter: 'blur(15px)',
              marginBottom: '40px'
            }}
          >
            <h3 style={{
              fontSize: '1.2rem',
              marginBottom: '16px',
              color: '#2D2D37',
              fontFamily: "'EB Garamond', serif",
              fontWeight: 500
            }}>
              Curator Tweak
            </h3>
            <textarea
              value={editedPoem}
              onChange={(e) => setEditedPoem(e.target.value)}
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '16px',
                border: '1px solid rgba(139, 125, 161, 0.3)',
                borderRadius: '8px',
                fontSize: '1rem',
                lineHeight: 1.6,
                resize: 'vertical',
                background: 'rgba(254, 254, 254, 0.8)',
                fontFamily: "'EB Garamond', serif",
                color: '#2D2D37',
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
                onClick={() => setShowCuratorTweak(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: 'rgba(139, 125, 161, 0.1)',
                  border: '1px solid rgba(139, 125, 161, 0.3)',
                  color: '#8B7DA1',
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
                  background: 'linear-gradient(135deg, #2D2D37 0%, #8B7DA1 100%)',
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '25px',
              background: 'rgba(244, 194, 194, 0.2)',
              border: '1px solid rgba(244, 194, 194, 0.4)',
              color: '#2D2D37',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.9rem'
            }}
          >
            <Heart size={16} />
            Keep this close
          </motion.button>
          
          <motion.button
            onClick={() => setShowCuratorTweak(!showCuratorTweak)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '25px',
              background: 'rgba(139, 125, 161, 0.2)',
              border: '1px solid rgba(139, 125, 161, 0.4)',
              color: '#2D2D37',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.9rem'
            }}
          >
            <Edit3 size={16} />
            Curator tweak
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '25px',
              background: 'rgba(139, 125, 161, 0.2)',
              border: '1px solid rgba(139, 125, 161, 0.4)',
              color: '#2D2D37',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.9rem'
            }}
          >
            <Share2 size={16} />
            Share with others
          </motion.button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          style={{ textAlign: 'center', marginTop: '40px' }}
        >
          <p style={{
            color: '#8B7DA1',
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