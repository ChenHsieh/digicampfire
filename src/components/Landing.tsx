import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { fetchPoeticWhispersWithSources } from '../utils/rssParser';
import { generateSkinnyPoem, generateAnchorWords } from '../utils/openai';
import { baseAnchorWords, feelingPrompts } from '../constants/appConstants';
import { getLandingStyles } from '../utils/styles/landingStyles';
import WhisperSelection from './landing/WhisperSelection';
import AnchorSelection from './landing/AnchorSelection';
import FeelingInput from './landing/FeelingInput';

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

  const {
    getCardBackground,
    getCardBorder,
    getTextColor,
    getSecondaryTextColor,
    getButtonBackground,
    getButtonBorder,
    getOrbBackground,
    getOrbShadow,
    getInnerFlameBackground
  } = getLandingStyles(isDarkMode);

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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <WhisperSelection
            whisperOptions={whisperOptions}
            selectedWhisper={selectedWhisper}
            loadingWhispers={loadingWhispers}
            loadWhispers={loadWhispers}
            handleSelection={handleSelection}
            isDarkMode={isDarkMode}
            getCardBackground={getCardBackground}
            getCardBorder={getCardBorder}
            getTextColor={getTextColor}
            getSecondaryTextColor={getSecondaryTextColor}
            getButtonBackground={getButtonBackground}
            getButtonBorder={getButtonBorder}
          />
        );
      
      case 2:
        return (
          <AnchorSelection
            anchorWords={anchorWords}
            selectedAnchor={selectedAnchor}
            loadingAnchors={loadingAnchors}
            loadNewAnchors={loadNewAnchors}
            handleSelection={handleSelection}
            isDarkMode={isDarkMode}
            getCardBackground={getCardBackground}
            getCardBorder={getCardBorder}
            getTextColor={getTextColor}
            getSecondaryTextColor={getSecondaryTextColor}
            getButtonBackground={getButtonBackground}
            getButtonBorder={getButtonBorder}
          />
        );
      
      case 3:
        return (
          <FeelingInput
            feeling={feeling}
            setFeeling={setFeeling}
            currentPromptIndex={currentPromptIndex}
            feelingPrompts={feelingPrompts}
            isDarkMode={isDarkMode}
            getTextColor={getTextColor}
            getSecondaryTextColor={getSecondaryTextColor}
          />
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
            border: `3px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.2)'}`,
            borderTop: `3px solid ${isDarkMode ? '#FDBA74' : '#8B7DA1'}`,
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
        {/* Responsive Campfire Orb - enhanced for dark mode */}
        <div 
          ref={orbRef}
          onMouseEnter={() => setIsOrbHovered(true)}
          onMouseLeave={() => setIsOrbHovered(false)}
          style={{
            width: '160px',
            height: '160px',
            background: getOrbBackground(),
            borderRadius: '50%',
            margin: '0 auto 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: getOrbShadow(isOrbHovered),
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(${isOrbHovered ? 1.1 : 1})`,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
            position: 'relative'
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
            style={{
              width: '80px',
              height: '80px',
              background: getInnerFlameBackground(),
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
                background: currentStep >= step ? (isDarkMode ? '#FDBA74' : '#8B7DA1') : (isDarkMode ? 'rgba(180, 83, 9, 0.4)' : 'rgba(139, 125, 161, 0.3)'),
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
                (isDarkMode ? 'linear-gradient(135deg, #1C1917 0%, #B45309 100%)' : 'linear-gradient(135deg, #2D2D37 0%, #8B7DA1 100%)') : 
                (isDarkMode ? 'rgba(100, 100, 100, 0.5)' : 'rgba(200, 200, 200, 0.5)'),
              color: '#FEFEFE',
              border: 'none',
              cursor: canProceed() ? 'pointer' : 'not-allowed',
              opacity: canProceed() ? 1 : 0.5,
              boxShadow: canProceed() ? (isDarkMode ? '0 4px 20px rgba(180, 83, 9, 0.4)' : '0 4px 20px rgba(45, 45, 55, 0.3)') : 'none',
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