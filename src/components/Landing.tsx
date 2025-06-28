import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, RefreshCw, ExternalLink } from 'lucide-react';
import { fetchPoeticWhispersWithSources } from '../utils/rssParser';
import { generateSkinnyPoem, generateAnchorWords } from '../utils/openai';

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
  isDarkMode: boolean;
  isSoundOn: boolean;
}

const Landing: React.FC<LandingProps> = ({ onComplete, isDarkMode, isSoundOn }) => {
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (orbRef.current) {
        const rect = orbRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / 10;
        const deltaY = (e.clientY - centerY) / 10;
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
      // Rotate through base words if generation fails
      const shuffled = [...baseAnchorWords].sort(() => Math.random() - 0.5);
      setAnchorWords(shuffled.slice(0, 6));
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

  // Dynamic styles based on dark mode
  const getCardBackground = (isSelected: boolean) => {
    if (isDarkMode) {
      return isSelected ? 'rgba(139, 125, 161, 0.25)' : 'rgba(45, 45, 55, 0.8)';
    }
    return isSelected ? 'rgba(244, 194, 194, 0.15)' : 'rgba(254, 254, 254, 0.8)';
  };

  const getCardBorder = (isSelected: boolean) => {
    if (isDarkMode) {
      return isSelected ? '#B8A8C8' : 'rgba(139, 125, 161, 0.3)';
    }
    return isSelected ? '#8B7DA1' : 'rgba(139, 125, 161, 0.2)';
  };

  const getTextColor = () => isDarkMode ? '#E5E5E5' : '#2D2D37';
  const getSecondaryTextColor = () => isDarkMode ? '#B8A8C8' : '#8B7DA1';
  const getButtonBackground = () => isDarkMode ? 'rgba(45, 45, 55, 0.8)' : 'rgba(254, 254, 254, 0.8)';
  const getButtonBorder = () => isDarkMode ? 'rgba(139, 125, 161, 0.3)' : 'rgba(139, 125, 161, 0.2)';

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
                color: getTextColor(),
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
                  background: getButtonBackground(),
                  border: `1px solid ${getButtonBorder()}`,
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
                    animate={selectedWhisper === whisper.poetic ? {
                      background: [
                        getCardBackground(true),
                        isDarkMode ? 'rgba(139, 125, 161, 0.4)' : 'rgba(244, 194, 194, 0.4)',
                        getCardBackground(true)
                      ]
                    } : {}}
                    transition={{ 
                      scale: { duration: 0.2 },
                      background: { duration: 0.6, repeat: selectedWhisper === whisper.poetic ? 2 : 0 }
                    }}
                    onClick={() => handleSelection(whisper.poetic, 'whisper')}
                    style={{
                      padding: '28px 32px',
                      border: `2px solid ${getCardBorder(selectedWhisper === whisper.poetic)}`,
                      borderRadius: '16px',
                      background: getCardBackground(selectedWhisper === whisper.poetic),
                      cursor: 'pointer',
                      boxShadow: selectedWhisper === whisper.poetic ? 
                        (isDarkMode ? '0 8px 32px rgba(139, 125, 161, 0.3)' : '0 8px 32px rgba(139, 125, 161, 0.2)') : 
                        (isDarkMode ? '0 4px 16px rgba(0, 0, 0, 0.2)' : '0 4px 16px rgba(45, 45, 55, 0.08)'),
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
                      borderTop: `1px solid ${isDarkMode ? 'rgba(139, 125, 161, 0.25)' : 'rgba(139, 125, 161, 0.15)'}`,
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
                          background: isDarkMode ? 'rgba(139, 125, 161, 0.2)' : 'rgba(139, 125, 161, 0.1)',
                          border: `1px solid ${isDarkMode ? 'rgba(139, 125, 161, 0.3)' : 'rgba(139, 125, 161, 0.2)'}`,
                          color: getSecondaryTextColor(),
                          textDecoration: 'none',
                          fontSize: '0.75rem',
                          fontFamily: "'Courier Prime', monospace",
                          fontWeight: 500,
                          transition: 'all 0.2s ease',
                          flexShrink: 0
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = isDarkMode ? 'rgba(139, 125, 161, 0.3)' : 'rgba(139, 125, 161, 0.2)';
                          e.currentTarget.style.color = getTextColor();
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isDarkMode ? 'rgba(139, 125, 161, 0.2)' : 'rgba(139, 125, 161, 0.1)';
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
                color: getTextColor(),
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
                      isDarkMode ? 'rgba(139, 125, 161, 0.4)' : 'rgba(139, 125, 161, 0.4)',
                      getCardBackground(true)
                    ]
                  } : {}}
                  transition={{ 
                    scale: { duration: 0.2 },
                    background: { duration: 0.6, repeat: selectedAnchor === word ? 2 : 0 }
                  }}
                  style={{
                    padding: '16px 24px',
                    border: `3px solid ${selectedAnchor === word ? getTextColor() : (isDarkMode ? 'rgba(139, 125, 161, 0.3)' : 'rgba(45, 45, 55, 0.2)')}`,
                    borderRadius: '50px',
                    background: getCardBackground(selectedAnchor === word),
                    cursor: 'pointer',
                    boxShadow: selectedAnchor === word ? 
                      (isDarkMode ? '0 8px 24px rgba(139, 125, 161, 0.3)' : '0 8px 24px rgba(45, 45, 55, 0.2)') : 
                      (isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(45, 45, 55, 0.1)'),
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
                  border: `2px solid ${isDarkMode ? 'rgba(139, 125, 161, 0.3)' : 'rgba(139, 125, 161, 0.2)'}`,
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  resize: 'vertical',
                  background: isDarkMode ? 'rgba(45, 45, 55, 0.8)' : 'rgba(254, 254, 254, 0.9)',
                  fontFamily: "'EB Garamond', serif",
                  backdropFilter: 'blur(10px)',
                  color: getTextColor(),
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = isDarkMode ? '#B8A8C8' : '#8B7DA1';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDarkMode ? 'rgba(139, 125, 161, 0.3)' : 'rgba(139, 125, 161, 0.2)';
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
            border: `3px solid ${isDarkMode ? 'rgba(139, 125, 161, 0.3)' : 'rgba(139, 125, 161, 0.2)'}`,
            borderTop: `3px solid ${isDarkMode ? '#B8A8C8' : '#8B7DA1'}`,
            borderRadius: '50%'
          }}
        />
        <p style={{
          fontSize: '1.2rem',
          color: getTextColor(),
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
        {/* Responsive Campfire Orb */}
        <div 
          ref={orbRef}
          onMouseEnter={() => setIsOrbHovered(true)}
          onMouseLeave={() => setIsOrbHovered(false)}
          style={{
            width: '160px',
            height: '160px',
            background: isDarkMode ? `
              radial-gradient(circle at 30% 30%, rgba(254, 254, 254, 0.1) 0%, transparent 30%),
              radial-gradient(circle at 70% 70%, rgba(244, 194, 194, 0.8) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(139, 125, 161, 0.7) 0%, transparent 70%),
              linear-gradient(135deg, rgba(45, 45, 55, 0.9) 0%, rgba(139, 125, 161, 0.7) 50%, rgba(244, 194, 194, 0.6) 100%)
            ` : `
              radial-gradient(circle at 30% 30%, rgba(254, 254, 254, 0.9) 0%, transparent 30%),
              radial-gradient(circle at 70% 70%, rgba(244, 194, 194, 0.7) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(139, 125, 161, 0.6) 0%, transparent 70%),
              linear-gradient(135deg, rgba(45, 45, 55, 0.8) 0%, rgba(139, 125, 161, 0.6) 50%, rgba(244, 194, 194, 0.5) 100%)
            `,
            borderRadius: '50%',
            margin: '0 auto 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `
              0 0 60px rgba(139, 125, 161, ${isOrbHovered ? (isDarkMode ? 0.7 : 0.6) : (isDarkMode ? 0.5 : 0.4)}),
              0 0 120px rgba(244, 194, 194, ${isOrbHovered ? (isDarkMode ? 0.5 : 0.4) : (isDarkMode ? 0.3 : 0.2)}),
              inset 0 0 60px rgba(254, 254, 254, ${isDarkMode ? 0.05 : 0.1})
            `,
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(${isOrbHovered ? 1.1 : 1})`,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          {/* Inner flame effect */}
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
            style={{
              width: '80px',
              height: '80px',
              background: isDarkMode ? 
                'radial-gradient(circle, rgba(244, 194, 194, 0.9) 0%, transparent 70%)' :
                'radial-gradient(circle, rgba(244, 194, 194, 0.8) 0%, transparent 70%)',
              borderRadius: '50%'
            }} 
          />
        </div>
        
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          marginBottom: '16px',
          color: getTextColor(),
          fontWeight: 400,
          fontFamily: "'EB Garamond', serif",
          textAlign: 'center'
        }}>
          Digital Campfire
        </h1>
        
        <p style={{
          fontSize: '1.1rem',
          color: getSecondaryTextColor(),
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
                background: currentStep >= step ? (isDarkMode ? '#B8A8C8' : '#8B7DA1') : (isDarkMode ? 'rgba(139, 125, 161, 0.4)' : 'rgba(139, 125, 161, 0.3)'),
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
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '12px 20px',
              borderRadius: '25px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: getButtonBackground(),
              color: getSecondaryTextColor(),
              border: `1px solid ${getButtonBorder()}`,
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              opacity: currentStep === 1 ? 0.5 : 1,
              pointerEvents: currentStep === 1 ? 'none' : 'auto',
              fontFamily: "'Courier Prime', monospace"
            }}
          >
            <ArrowLeft size={16} />
            Back
          </motion.button>
          
          <motion.button
            onClick={handleNext}
            disabled={!canProceed()}
            whileHover={{ scale: canProceed() ? 1.05 : 1 }}
            whileTap={{ scale: canProceed() ? 0.95 : 1 }}
            style={{
              padding: '12px 20px',
              borderRadius: '25px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: canProceed() ? 
                (isDarkMode ? 'linear-gradient(135deg, #2D2D37 0%, #B8A8C8 100%)' : 'linear-gradient(135deg, #2D2D37 0%, #8B7DA1 100%)') : 
                (isDarkMode ? 'rgba(100, 100, 100, 0.5)' : 'rgba(200, 200, 200, 0.5)'),
              color: '#FEFEFE',
              border: 'none',
              cursor: canProceed() ? 'pointer' : 'not-allowed',
              opacity: canProceed() ? 1 : 0.5,
              boxShadow: canProceed() ? (isDarkMode ? '0 4px 20px rgba(45, 45, 55, 0.4)' : '0 4px 20px rgba(45, 45, 55, 0.3)') : 'none',
              fontFamily: "'Courier Prime', monospace"
            }}
          >
            {currentStep === 3 ? (
              'Let the poem arrive'
            ) : (
              <>
                Next
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
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