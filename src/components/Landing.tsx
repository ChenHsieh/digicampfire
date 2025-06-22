import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, RefreshCw, ExternalLink } from 'lucide-react';
import { fetchPoeticWhispersWithSources } from '../utils/rssParser';
import { generateSkinnyPoem, generateAnchorWords } from '../utils/openai';
import { generateRandomOrbColor, getRandomBaseAnchors } from '../utils/helpers';
import { useTheme } from '../hooks/useTheme';
import ThemedButton from './ThemedButton';

const baseAnchorWords = [
  "breathe",
  "release", 
  "become",
  "hold",
  "listen",
  "remember",
  "forgive",
  "trust",
  "surrender",
  "witness"
];

const feelingPrompts = [
  "I am holding...",
  "Today I carry...",
  "In my chest lives...",
  "What weighs on me is...",
  "I cannot shake...",
  "My heart knows...",
  "The silence holds..."
];

interface WhisperWithSource {
  poetic: string;
  headline: string;
  link: string;
}

interface LandingProps {
  onComplete: (poem: { whisper: string; anchor: string; feeling: string; text: string }) => void;
  onNavigate: (page: 'landing' | 'display' | 'privacy' | 'about') => void;
  isDarkMode: boolean;
}

const Landing: React.FC<LandingProps> = ({ onComplete, onNavigate, isDarkMode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedWhisper, setSelectedWhisper] = useState<string>('');
  const [selectedAnchor, setSelectedAnchor] = useState<string>('');
  const [feeling, setFeeling] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isOrbHovered, setIsOrbHovered] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [anchorWords, setAnchorWords] = useState(baseAnchorWords);
  const [loadingAnchors, setLoadingAnchors] = useState(false);
  const [orbColor, setOrbColor] = useState(generateRandomOrbColor());
  const [whisperOptions, setWhisperOptions] = useState<WhisperWithSource[]>([
    {
      poetic: "The weight of unspoken words",
      headline: "Global tensions continue to shape international discourse",
      link: "https://www.theguardian.com"
    },
    {
      poetic: "A memory that refuses to fade", 
      headline: "Historical events continue to influence modern society",
      link: "https://www.theguardian.com"
    },
    {
      poetic: "The space between what was and what could be",
      headline: "Future possibilities emerge from current challenges",
      link: "https://www.theguardian.com"
    }
  ]);
  const [loadingWhispers, setLoadingWhispers] = useState(false);
  const orbRef = useRef<HTMLDivElement>(null);

  const colors = useTheme(isDarkMode);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (orbRef.current) {
        const rect = orbRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // Reduced movement sensitivity from /10 to /30 for more subtle effect
        const deltaX = (e.clientX - centerX) / 30;
        const deltaY = (e.clientY - centerY) / 30;
        setMousePosition({ x: deltaX, y: deltaY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    loadWhispers();
  }, []);

  // Animate prompt rotation
  useEffect(() => {
    if (currentStep === 3) {
      const interval = setInterval(() => {
        setCurrentPromptIndex((prev) => (prev + 1) % feelingPrompts.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const loadWhispers = async () => {
    setLoadingWhispers(true);
    try {
      const poeticWhispers = await fetchPoeticWhispersWithSources();
      setWhisperOptions(poeticWhispers);
    } catch (error) {
      console.error('Failed to load poetic whispers:', error);
    } finally {
      setLoadingWhispers(false);
    }
  };

  const loadNewAnchors = async () => {
    setLoadingAnchors(true);
    try {
      const newAnchors = await generateAnchorWords();
      setAnchorWords(newAnchors);
    } catch (error) {
      console.error('Failed to generate new anchor words:', error);
      setAnchorWords(getRandomBaseAnchors());
    } finally {
      setLoadingAnchors(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const generatedPoem = await generateSkinnyPoem(selectedWhisper, selectedAnchor, feeling);
      
      onComplete({
        whisper: selectedWhisper,
        anchor: selectedAnchor,
        feeling: feeling,
        text: generatedPoem
      });
    } catch (error) {
      console.error('Error generating poem:', error);
      // Fallback poem
      const fallbackPoem = `${selectedWhisper}
${selectedAnchor}
silence
holds
what
${selectedAnchor}
cannot
say
in
${selectedAnchor}
${selectedWhisper}`;
      
      onComplete({
        whisper: selectedWhisper,
        anchor: selectedAnchor,
        feeling: feeling,
        text: fallbackPoem
      });
    }
    
    setIsGenerating(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedWhisper !== '';
      case 2: return selectedAnchor !== '';
      case 3: return true; // Always allow proceeding from step 3 (feeling is optional)
      default: return false;
    }
  };

  const handleSelection = (value: string, type: 'whisper' | 'anchor') => {
    if (type === 'whisper') {
      setSelectedWhisper(value);
    } else {
      setSelectedAnchor(value);
    }
    
    // Auto-advance after selection with shimmer effect
    setTimeout(() => {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    }, 800);
  };

  const handleOrbHover = () => {
    setIsOrbHovered(true);
    setOrbColor(generateRandomOrbColor());
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
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
                color: colors.text,
                fontFamily: "'EB Garamond', serif",
                fontWeight: 400
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
                  background: colors.background,
                  border: `1px solid ${colors.border}`,
                  cursor: loadingWhispers ? 'not-allowed' : 'pointer',
                  opacity: loadingWhispers ? 0.5 : 1,
                  backdropFilter: 'blur(10px)',
                  boxShadow: colors.shadow
                }}
              >
                <RefreshCw 
                  size={16} 
                  color={colors.primary}
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
                color: colors.primary,
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
                    animate={selectedWhisper === whisper.poetic ? {
                      background: [
                        `rgba(${isDarkMode ? '194, 65, 12' : '234, 88, 12'}, 0.15)`,
                        `rgba(${isDarkMode ? '194, 65, 12' : '234, 88, 12'}, 0.25)`,
                        `rgba(${isDarkMode ? '194, 65, 12' : '234, 88, 12'}, 0.15)`
                      ]
                    } : {}}
                    transition={{ 
                      scale: { duration: 0.2 },
                      background: { duration: 0.6, repeat: selectedWhisper === whisper.poetic ? 2 : 0 }
                    }}
                    onClick={() => handleSelection(whisper.poetic, 'whisper')}
                    style={{
                      padding: '28px 32px',
                      border: `2px solid ${selectedWhisper === whisper.poetic ? colors.primary : colors.border}`,
                      borderRadius: '16px',
                      background: selectedWhisper === whisper.poetic ? 
                        `rgba(${isDarkMode ? '194, 65, 12' : '234, 88, 12'}, 0.1)` : 
                        colors.background,
                      cursor: 'pointer',
                      boxShadow: selectedWhisper === whisper.poetic ? 
                        `0 8px 32px rgba(${isDarkMode ? '194, 65, 12' : '234, 88, 12'}, 0.3), 0 0 0 1px rgba(${isDarkMode ? '194, 65, 12' : '234, 88, 12'}, 0.1)` : 
                        colors.shadow,
                      backdropFilter: 'blur(15px)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {/* Main poetic phrase */}
                    <div style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: '1.4rem',
                      color: colors.text,
                      lineHeight: 1.4,
                      fontWeight: 500,
                      textAlign: 'center',
                      marginBottom: '16px'
                    }}>
                      {whisper.poetic}
                    </div>
                    
                    {/* Source headline with link */}
                    <div style={{
                      borderTop: `1px solid ${colors.border}`,
                      paddingTop: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}>
                      <div style={{
                        fontSize: '0.85rem',
                        color: colors.primary,
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
                          background: `rgba(${isDarkMode ? '194, 65, 12' : '234, 88, 12'}, 0.15)`,
                          border: `1px solid ${colors.border}`,
                          color: colors.primary,
                          textDecoration: 'none',
                          fontSize: '0.75rem',
                          fontFamily: "'Courier Prime', monospace",
                          fontWeight: 500,
                          transition: 'all 0.2s ease',
                          flexShrink: 0
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
      
      case 2:
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
                color: colors.text,
                fontFamily: "'EB Garamond', serif",
                fontWeight: 400
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
                  background: colors.background,
                  border: `1px solid ${colors.border}`,
                  cursor: loadingAnchors ? 'not-allowed' : 'pointer',
                  opacity: loadingAnchors ? 0.5 : 1,
                  backdropFilter: 'blur(10px)',
                  boxShadow: colors.shadow
                }}
              >
                <RefreshCw 
                  size={16} 
                  color={colors.primary}
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
                      `rgba(${isDarkMode ? '234, 88, 12' : '194, 65, 12'}, 0.2)`,
                      `rgba(${isDarkMode ? '234, 88, 12' : '194, 65, 12'}, 0.4)`,
                      `rgba(${isDarkMode ? '234, 88, 12' : '194, 65, 12'}, 0.2)`
                    ]
                  } : {}}
                  transition={{ 
                    scale: { duration: 0.2 },
                    background: { duration: 0.6, repeat: selectedAnchor === word ? 2 : 0 }
                  }}
                  style={{
                    padding: '16px 24px',
                    border: `3px solid ${selectedAnchor === word ? colors.text : colors.border}`,
                    borderRadius: '50px',
                    background: selectedAnchor === word ? 
                      `rgba(${isDarkMode ? '234, 88, 12' : '194, 65, 12'}, 0.2)` : 
                      colors.background,
                    cursor: 'pointer',
                    boxShadow: selectedAnchor === word ? 
                      `0 8px 24px rgba(${isDarkMode ? '234, 88, 12' : '194, 65, 12'}, 0.4), 0 0 0 1px rgba(${isDarkMode ? '234, 88, 12' : '194, 65, 12'}, 0.2)` : 
                      colors.shadow,
                    backdropFilter: 'blur(15px)',
                    transition: 'all 0.3s ease',
                    fontFamily: "'Courier Prime', monospace",
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: colors.text,
                    textTransform: 'lowercase'
                  }}
                >
                  {word}
                </motion.button>
              ))}
            </div>
          </motion.div>
        );
      
      case 3:
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
              color: colors.text,
              fontFamily: "'EB Garamond', serif",
              fontWeight: 400
            }}>
              How are you feeling now?
            </h2>
            
            <p style={{
              textAlign: 'center',
              color: colors.primary,
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
                  border: `2px solid ${colors.border}`,
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  resize: 'vertical',
                  background: colors.background,
                  fontFamily: "'EB Garamond', serif",
                  backdropFilter: 'blur(15px)',
                  color: colors.text,
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  boxShadow: colors.shadow
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border;
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
                    color: colors.primary,
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
      
      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 24px'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ 
            marginBottom: '24px',
            width: '48px',
            height: '48px',
            border: `3px solid ${colors.border}`,
            borderTop: `3px solid ${colors.primary}`,
            borderRadius: '50%'
          }}
        />
        <p style={{
          fontSize: '1.2rem',
          color: colors.text,
          fontFamily: "'EB Garamond', serif",
          textAlign: 'center'
        }}>
          The poem is arriving...
        </p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 24px'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ maxWidth: '800px', width: '100%' }}
      >
        {/* Enhanced Campfire Orb with theme-aware colors */}
        <div 
          ref={orbRef}
          onMouseEnter={handleOrbHover}
          onMouseLeave={() => setIsOrbHovered(false)}
          style={{
            width: '160px',
            height: '160px',
            background: `
              radial-gradient(circle at 30% 30%, rgba(254, 254, 254, ${isDarkMode ? '0.9' : '0.7'}) 0%, transparent 30%),
              radial-gradient(circle at 70% 70%, ${orbColor.secondary} 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, ${orbColor.primary} 0%, transparent 70%),
              linear-gradient(135deg, ${orbColor.dark} 0%, ${orbColor.primary} 50%, ${orbColor.secondary} 100%)
            `,
            borderRadius: '50%',
            margin: '0 auto 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `
              0 0 60px ${orbColor.primary.replace('0.6', isOrbHovered ? '0.8' : '0.4')},
              0 0 120px ${orbColor.secondary.replace('0.5', isOrbHovered ? '0.6' : '0.2')},
              inset 0 0 60px rgba(254, 254, 254, ${isDarkMode ? '0.1' : '0.2'})
            `,
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(${isOrbHovered ? 1.1 : 1})`,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          {/* Enhanced inner flame effect */}
          <motion.div 
            animate={{
              scale: isOrbHovered ? [1, 1.4, 1] : [1, 1.2, 1],
              opacity: isOrbHovered ? [0.4, 0.9, 0.4] : [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: isOrbHovered ? 1.5 : 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '80px',
              height: '80px',
              background: `radial-gradient(circle, ${orbColor.secondary.replace('0.5', '0.8')} 0%, transparent 70%)`,
              borderRadius: '50%'
            }} 
          />
          
          {/* Additional pulsing layer */}
          <motion.div 
            animate={{
              scale: isOrbHovered ? [1.2, 1.6, 1.2] : [1.1, 1.3, 1.1],
              opacity: isOrbHovered ? [0.2, 0.5, 0.2] : [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: isOrbHovered ? 1.8 : 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              background: `radial-gradient(circle, ${orbColor.primary.replace('0.6', '0.4')} 0%, transparent 60%)`,
              borderRadius: '50%'
            }} 
          />
        </div>
        
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          marginBottom: '16px',
          color: colors.text,
          fontWeight: 400,
          fontFamily: "'EB Garamond', serif",
          textAlign: 'center'
        }}>
          Digital Campfire
        </h1>
        
        <p style={{
          fontSize: '1.1rem',
          color: colors.primary,
          marginBottom: '48px',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.6,
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          A space for strangers to sit by and share one line of feeling
        </p>

        {/* Step indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '40px'
        }}>
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: currentStep >= step ? colors.primary : colors.border,
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '40px'
        }}>
          <ThemedButton
            onClick={handleBack}
            isDarkMode={isDarkMode}
            variant="outline"
            disabled={currentStep === 1}
            icon={<ArrowLeft size={16} />}
          >
            Back
          </ThemedButton>
          
          <ThemedButton
            onClick={handleNext}
            disabled={!canProceed()}
            isDarkMode={isDarkMode}
            variant="primary"
            icon={currentStep === 3 ? undefined : <ArrowRight size={16} />}
          >
            {currentStep === 3 ? 'Let the poem arrive' : 'Next'}
          </ThemedButton>
        </div>
      </motion.div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Landing;