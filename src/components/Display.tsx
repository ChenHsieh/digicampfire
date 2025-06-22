import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit3, Copy, Check, Download, Image } from 'lucide-react';
import { validateSkinnyPoem } from '../utils/openai';
import { generateRandomOrbColor } from '../utils/helpers';

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
  isDarkMode: boolean;
}

const Display: React.FC<DisplayProps> = ({ poem, onBack, onNavigate, isDarkMode }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCuratorTweak, setShowCuratorTweak] = useState(false);
  const [editedPoem, setEditedPoem] = useState(poem.text);
  const [currentPoem, setCurrentPoem] = useState(poem.text);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
    const shareText = `${currentPoem}\n\n— Created at Digital Campfire\nCreate your own poem at: https://vibepoem.netlify.app/`;
    
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

  const generatePictureCard = async () => {
    setIsGeneratingCard(true);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set canvas size for Instagram square format
      canvas.width = 1080;
      canvas.height = 1080;
      
      // Generate orb colors for background
      const orbColor = generateRandomOrbColor();
      
      // Create 30° linear gradient background
      const gradient = ctx.createLinearGradient(0, 0, Math.cos(30 * Math.PI / 180) * 1080, Math.sin(30 * Math.PI / 180) * 1080);
      gradient.addColorStop(0, orbColor.primary.replace('0.6', '0.9'));
      gradient.addColorStop(0.5, orbColor.secondary.replace('0.5', '0.7'));
      gradient.addColorStop(1, orbColor.dark.replace('0.8', '0.8'));
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1080);
      
      // Add particle noise texture overlay
      ctx.globalAlpha = 0.15;
      
      // Create more sophisticated particle noise pattern
      for (let i = 0; i < 2000; i++) {
        const x = Math.random() * 1080;
        const y = Math.random() * 1080;
        const size = Math.random() * 3 + 0.5;
        const opacity = Math.random() * 0.8 + 0.2;
        
        ctx.globalAlpha = opacity * 0.15;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Add some larger particles for depth
      for (let i = 0; i < 300; i++) {
        const x = Math.random() * 1080;
        const y = Math.random() * 1080;
        const size = Math.random() * 2 + 1;
        const opacity = Math.random() * 0.4 + 0.1;
        
        ctx.globalAlpha = opacity * 0.1;
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.globalAlpha = 1;
      
      // Add orb in upper area
      const orbGradient = ctx.createRadialGradient(540, 250, 0, 540, 250, 100);
      orbGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      orbGradient.addColorStop(0.3, orbColor.secondary.replace('0.5', '0.7'));
      orbGradient.addColorStop(1, orbColor.primary.replace('0.6', '0.3'));
      
      ctx.fillStyle = orbGradient;
      ctx.beginPath();
      ctx.arc(540, 250, 100, 0, Math.PI * 2);
      ctx.fill();
      
      // Add inner glow
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = orbColor.secondary.replace('0.5', '0.8');
      ctx.beginPath();
      ctx.arc(540, 250, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // Add poem text - LEFT ALIGNED
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left'; // Changed from 'center' to 'left'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 3;
      
      // Title - centered
      ctx.textAlign = 'center';
      ctx.font = 'bold 36px serif';
      ctx.fillText('Digital Campfire', 540, 420);
      
      // Poem lines - left aligned
      ctx.textAlign = 'left';
      ctx.font = '32px serif';
      const poemLines = currentPoem.split('\n').filter(line => line.trim() !== '');
      const startY = 480;
      const lineHeight = 42;
      const leftMargin = 120; // Left margin for poem text
      
      poemLines.forEach((line, index) => {
        const y = startY + (index * lineHeight);
        if (y < 920) { // Ensure text doesn't go off canvas
          ctx.fillText(line.trim(), leftMargin, y);
        }
      });
      
      // Add website URL at bottom - centered
      ctx.textAlign = 'center';
      ctx.font = '22px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowBlur = 4;
      ctx.fillText('vibepoem.netlify.app', 540, 1040);
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'digital-campfire-poem.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
      
    } catch (error) {
      console.error('Error generating picture card:', error);
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        primary: '#EA580C',
        secondary: '#C2410C',
        text: '#E5E5E5',
        textSecondary: 'rgba(229, 229, 229, 0.7)',
        background: 'rgba(229, 229, 229, 0.05)',
        border: 'rgba(234, 88, 12, 0.3)',
        shadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(234, 88, 12, 0.1)',
        glowShadow: '0 0 60px rgba(234, 88, 12, 0.3), 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(234, 88, 12, 0.2)'
      };
    } else {
      return {
        primary: '#C2410C',
        secondary: '#EA580C',
        text: '#1a1a1a',
        textSecondary: 'rgba(26, 26, 26, 0.7)',
        background: 'rgba(26, 26, 26, 0.05)',
        border: 'rgba(194, 65, 12, 0.4)',
        shadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(194, 65, 12, 0.2)',
        glowShadow: '0 0 60px rgba(194, 65, 12, 0.2), 0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(194, 65, 12, 0.3)'
      };
    }
  };

  const colors = getThemeColors();

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
            color: colors.primary,
            fontSize: '0.9rem',
            padding: '8px 16px',
            borderRadius: '20px',
            marginBottom: '40px',
            marginLeft: 'auto',
            marginRight: 'auto',
            background: colors.background,
            border: `1px solid ${colors.border}`,
            cursor: 'pointer',
            backdropFilter: 'blur(15px)',
            fontFamily: "'Courier Prime', monospace",
            boxShadow: colors.shadow
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
              radial-gradient(circle at center, rgba(${isDarkMode ? '234, 88, 12' : '194, 65, 12'}, 0.08) 0%, transparent 70%),
              ${colors.background}
            `,
            padding: '48px',
            borderRadius: '20px',
            boxShadow: colors.glowShadow,
            border: `1px solid ${colors.border}`,
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
            background: `rgba(${isDarkMode ? '234, 88, 12' : '194, 65, 12'}, 0.6)`,
            borderRadius: '50%',
            animation: 'float 3s ease-in-out infinite'
          }} />
          
          <h1 style={{
            fontSize: '1.8rem',
            textAlign: 'center',
            marginBottom: '16px',
            color: colors.text,
            fontWeight: 400,
            fontFamily: "'EB Garamond', serif"
          }}>
            Your Verse by the Fire
          </h1>
          
          {/* Divider */}
          <div style={{
            width: '60px',
            height: '2px',
            background: `linear-gradient(90deg, transparent 0%, ${colors.primary} 50%, transparent 100%)`,
            margin: '0 auto 32px',
            borderRadius: '1px'
          }} />
          
          <div style={{
            fontSize: '1.2rem',
            lineHeight: 1.8,
            color: colors.text,
            whiteSpace: 'pre-wrap',
            textAlign: 'left', // Changed from center to left
            fontFamily: "'EB Garamond', serif",
            maxWidth: '500px',
            margin: '0 auto'
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
            background: colors.background,
            padding: '20px',
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            backdropFilter: 'blur(15px)',
            boxShadow: colors.shadow
          }}>
            <div style={{
              fontSize: '0.8rem',
              color: colors.primary,
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
              color: colors.text,
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic'
            }}>
              {poem.whisper}
            </div>
          </div>
          
          <div style={{
            background: colors.background,
            padding: '20px',
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            backdropFilter: 'blur(15px)',
            boxShadow: colors.shadow
          }}>
            <div style={{
              fontSize: '0.8rem',
              color: colors.primary,
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
              color: colors.text,
              fontFamily: "'EB Garamond', serif", // Changed to match whisper font
              fontStyle: 'italic'
            }}>
              {poem.anchor}
            </div>
          </div>
          
          {poem.feeling && (
            <div style={{
              background: colors.background,
              padding: '20px',
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              backdropFilter: 'blur(15px)',
              gridColumn: 'span 2',
              boxShadow: colors.shadow
            }}>
              <div style={{
                fontSize: '0.8rem',
                color: colors.primary,
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
                color: colors.text,
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
              background: colors.background,
              padding: '24px',
              borderRadius: '16px',
              border: `2px solid ${colors.border}`,
              backdropFilter: 'blur(20px)',
              marginBottom: '40px',
              boxShadow: colors.shadow
            }}
          >
            <h3 style={{
              fontSize: '1.2rem',
              marginBottom: '16px',
              color: colors.text,
              fontFamily: "'EB Garamond', serif",
              fontWeight: 500
            }}>
              Small Revisions in the Dusk
            </h3>
            <p style={{
              fontSize: '0.9rem',
              color: colors.primary,
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
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                fontSize: '1rem',
                lineHeight: 1.6,
                resize: 'vertical',
                background: colors.background,
                fontFamily: "'EB Garamond', serif",
                color: colors.text,
                outline: 'none',
                backdropFilter: 'blur(10px)',
                boxShadow: colors.shadow
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
                  background: `rgba(${isDarkMode ? '234, 88, 12' : '194, 65, 12'}, 0.15)`,
                  border: `1px solid ${colors.border}`,
                  color: colors.primary,
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
                  background: `linear-gradient(135deg, ${isDarkMode ? '#2D2D37' : '#f1f5f9'} 0%, ${colors.primary} 100%)`,
                  border: 'none',
                  color: colors.text,
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
              background: `rgba(${isDarkMode ? '26, 26, 26' : '248, 250, 252'}, 0.9)`,
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
                background: colors.background,
                padding: '32px',
                borderRadius: '20px',
                border: `1px solid ${colors.border}`,
                backdropFilter: 'blur(25px)',
                maxWidth: '400px',
                width: '100%',
                boxShadow: colors.shadow
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{
                fontSize: '1.4rem',
                marginBottom: '24px',
                color: colors.text,
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
                    background: copySuccess ? 'rgba(34, 197, 94, 0.15)' : `rgba(${isDarkMode ? '234, 88, 12' : '194, 65, 12'}, 0.15)`,
                    border: `1px solid ${copySuccess ? 'rgba(34, 197, 94, 0.4)' : colors.border}`,
                    color: copySuccess ? '#22c55e' : colors.text,
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
                  {copySuccess ? 'Copied with link!' : 'Copy text with link'}
                </motion.button>
                
                <motion.button
                  onClick={generatePictureCard}
                  disabled={isGeneratingCard}
                  whileHover={{ scale: isGeneratingCard ? 1 : 1.02 }}
                  whileTap={{ scale: isGeneratingCard ? 1 : 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    background: `rgba(${isDarkMode ? '234, 88, 12' : '194, 65, 12'}, 0.15)`,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    cursor: isGeneratingCard ? 'not-allowed' : 'pointer',
                    fontFamily: "'Courier Prime', monospace",
                    fontSize: '0.95rem',
                    width: '100%',
                    justifyContent: 'flex-start',
                    backdropFilter: 'blur(10px)',
                    opacity: isGeneratingCard ? 0.7 : 1,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isGeneratingCard ? <Download size={18} /> : <Image size={18} />}
                  {isGeneratingCard ? 'Generating card...' : 'Download picture card'}
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
                  background: `rgba(${isDarkMode ? '234, 88, 12' : '194, 65, 12'}, 0.15)`,
                  border: `1px solid ${colors.border}`,
                  color: colors.primary,
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
              background: showCuratorTweak ? `rgba(${isDarkMode ? '234, 88, 12' : '194, 65, 12'}, 0.25)` : `rgba(${isDarkMode ? '234, 88, 12' : '194, 65, 12'}, 0.15)`,
              border: `1px solid ${colors.border}`,
              color: colors.text,
              cursor: 'pointer',
              backdropFilter: 'blur(15px)',
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.9rem',
              boxShadow: colors.shadow
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
              background: `rgba(${isDarkMode ? '234, 88, 12' : '194, 65, 12'}, 0.15)`,
              border: `1px solid ${colors.border}`,
              color: colors.text,
              cursor: 'pointer',
              backdropFilter: 'blur(15px)',
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.9rem',
              boxShadow: colors.shadow
            }}
          >
            <Copy size={16} />
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
            color: colors.primary,
            fontSize: '0.9rem',
            fontStyle: 'italic',
            fontFamily: "'EB Garamond', serif"
          }}>
            Thank you for sharing your light with us
          </p>
        </motion.div>
      </div>
      
      {/* Hidden canvas for generating picture cards */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
      
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