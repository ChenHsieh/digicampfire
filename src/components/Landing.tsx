import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { fetchPoeticWhispersWithSources } from '../utils/rssParser';
import { generateSkinnyPoem, generateAnchorWords } from '../utils/openai';
import { baseAnchorWords, feelingPrompts } from '../constants/appConstants';
import { useTheme } from '../hooks/useTheme';
import WhisperSelection from './landing/WhisperSelection';
import AnchorSelection from './landing/AnchorSelection';
import FeelingInput from './landing/FeelingInput';

interface WhisperWithSource {
  poetic: string;
  headline: string;
  link: string;
}

interface LandingProps {
  onComplete: (poem: { whisper: string; anchor: string; feeling: string; text: string; headline: string; link: string }) => void;
  isDarkMode: boolean;
}

const Landing: React.FC<LandingProps> = ({ onComplete, isDarkMode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedWhisper, setSelectedWhisper] = useState<WhisperWithSource | null>(null);
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
    getTextColor,
    getSecondaryTextColor,
    getCardBackground,
    getCardBorder
  } = useTheme();

  const getButtonBackground = () => isDarkMode ? 'rgba(28, 25, 23, 0.8)' : 'rgba(254, 254, 254, 0.8)';
  const getButtonBorder = () => isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.2)';

  const getOrbBackground = () => {
    if (isDarkMode) {
      return `
        radial-gradient(circle at 30% 30%, rgba(254, 247, 237, 0.1) 0%, transparent 30%),
        radial-gradient(circle at 70% 70%, rgba(251, 146, 60, 0.8) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(180, 83, 9, 0.7) 0%, transparent 70%),
        linear-gradient(135deg, rgba(28, 25, 23, 0.9) 0%, rgba(180, 83, 9, 0.7) 50%, rgba(251, 146, 60, 0.6) 100%)
      `;
    }
    return `
      radial-gradient(circle at 30% 30%, rgba(254, 254, 254, 0.9) 0%, transparent 30%),
      radial-gradient(circle at 70% 70%, rgba(244, 194, 194, 0.7) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(139, 125, 161, 0.6) 0%, transparent 70%),
      linear-gradient(135deg, rgba(45, 45, 55, 0.8) 0%, rgba(139, 125, 161, 0.6) 50%, rgba(244, 194, 194, 0.5) 100%)
    `;
  };

  const getOrbShadow = (isHovered: boolean) => {
    return `
      0 0 60px rgba(${isDarkMode ? '251, 146, 60' : '139, 125, 161'}, ${isHovered ? (isDarkMode ? 0.8 : 0.6) : (isDarkMode ? 0.6 : 0.4)}),
      0 0 120px rgba(${isDarkMode ? '180, 83, 9' : '244, 194, 194'}, ${isHovered ? (isDarkMode ? 0.6 : 0.4) : (isDarkMode ? 0.4 : 0.2)}),
      inset 0 0 60px rgba(254, 254, 254, ${isDarkMode ? 0.05 : 0.1})
    `;
  };

  const getInnerFlameBackground = () => {
    return isDarkMode ? 
      'radial-gradient(circle, rgba(251, 146, 60, 0.9) 0%, transparent 70%)' :
      'radial-gradient(circle, rgba(244, 194, 194, 0.8) 0%, transparent 70%)';
  };

  // Ember styling functions
  const getEmberBackground = (step: number, isActive: boolean) => {
    if (isActive) {
      return isDarkMode ? 
        'radial-gradient(circle, rgba(251, 146, 60, 0.9) 0%, rgba(180, 83, 9, 0.7) 70%, transparent 100%)' :
        'radial-gradient(circle, rgba(139, 125, 161, 0.8) 0%, rgba(244, 194, 194, 0.6) 70%, transparent 100%)';
    }
    return isDarkMode ? 
      'rgba(100, 100, 100, 0.3)' : 
      'rgba(200, 200, 200, 0.4)';
  };

  const getEmberShadow = (step: number, isActive: boolean) => {
    if (isActive) {
      return isDarkMode ?
        `0 0 20px rgba(251, 146, 60, 0.6), 0 0 40px rgba(180, 83, 9, 0.4)` :
        `0 0 20px rgba(139, 125, 161, 0.5), 0 0 40px rgba(244, 194, 194, 0.3)`;
    }
    return 'none';
  };

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
    if (!selectedWhisper) return;
    
    setIsGenerating(true);
    
    try {
      const generatedPoem = await generateSkinnyPoem(selectedWhisper.poetic, selectedAnchor, feeling);
      
      onComplete({
        whisper: selectedWhisper.poetic,
        anchor: selectedAnchor,
        feeling: feeling,
        text: generatedPoem,
        headline: selectedWhisper.headline,
        link: selectedWhisper.link
      });
    } catch (error) {
      console.error('Error generating poem:', error);
      // Fallback poem
      const fallbackPoem = `${selectedWhisper.poetic}
${selectedAnchor}
silence
holds
what
${selectedAnchor}
cannot
say
in
${selectedAnchor}
${selectedWhisper.poetic}`;
      
      onComplete({
        whisper: selectedWhisper.poetic,
        anchor: selectedAnchor,
        feeling: feeling,
        text: fallbackPoem,
        headline: selectedWhisper.headline,
        link: selectedWhisper.link
      });
    }
    
    setIsGenerating(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedWhisper !== null;
      case 2: return selectedAnchor !== '';
      case 3: return true; // Always allow proceeding from step 3 (feeling is optional)
      default: return false;
    }
  };

  const handleSelection = (value: string | WhisperWithSource, type: 'whisper' | 'anchor') => {
    if (type === 'whisper') {
      setSelectedWhisper(value as WhisperWithSource);
    } else {
      setSelectedAnchor(value as string);
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
      <div className="min-h-screen flex flex-col justify-center items-center py-10 px-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-6 w-12 h-12 rounded-full"
          style={{ 
            border: `3px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.2)'}`,
            borderTop: `3px solid ${isDarkMode ? '#FDBA74' : '#8B7DA1'}`
          }}
        />
        <p 
          className="text-xl font-['EB_Garamond'] text-center"
          style={{ color: getTextColor() }}
        >
          The poem is arriving...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full"
      >
        {/* Responsive Campfire Orb - enhanced for dark mode */}
        <div 
          ref={orbRef}
          onMouseEnter={() => setIsOrbHovered(true)}
          onMouseLeave={() => setIsOrbHovered(false)}
          className="w-40 h-40 rounded-full mx-auto mb-12 flex items-center justify-center cursor-pointer relative transition-all duration-300"
          style={{
            background: getOrbBackground(),
            boxShadow: getOrbShadow(isOrbHovered),
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(${isOrbHovered ? 1.1 : 1})`
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
            className="w-20 h-20 rounded-full"
            style={{ background: getInnerFlameBackground() }}
          />
        </div>
        
        <h1 
          className="text-4xl md:text-6xl mb-4 font-normal font-['EB_Garamond'] text-center"
          style={{ color: getTextColor() }}
        >
          Digital Campfire
        </h1>
        
        <p 
          className="text-lg mb-12 max-w-lg mx-auto leading-relaxed text-center italic"
          style={{ color: getSecondaryTextColor() }}
        >
          A space for strangers to sit by and share one line of feeling
        </p>

        {/* Ember Progress Indicator */}
        <div className="flex justify-center items-center gap-6 mb-10">
          {[1, 2, 3].map((step) => {
            const isActive = currentStep >= step;
            return (
              <motion.div
                key={step}
                className="relative"
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ 
                  scale: isActive ? 1.2 : 0.8,
                  opacity: isActive ? 1 : 0.6
                }}
                transition={{ 
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                {/* Ember glow effect */}
                <motion.div
                  className="w-4 h-4 rounded-full absolute inset-0"
                  style={{
                    background: getEmberBackground(step, isActive),
                    boxShadow: getEmberShadow(step, isActive)
                  }}
                  animate={isActive ? {
                    scale: [1, 1.3, 1],
                    opacity: [0.8, 1, 0.8]
                  } : {}}
                  transition={isActive ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  } : {}}
                />
                
                {/* Ember core */}
                <div
                  className="w-4 h-4 rounded-full relative z-10 transition-all duration-500"
                  style={{
                    background: isActive ? 
                      (isDarkMode ? '#FB923C' : '#8B7DA1') : 
                      (isDarkMode ? 'rgba(100, 100, 100, 0.5)' : 'rgba(200, 200, 200, 0.6)'),
                    border: `2px solid ${isActive ? 
                      (isDarkMode ? '#FDBA74' : '#A78BFA') : 
                      (isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.3)')}`
                  }}
                />
                
                {/* Floating sparks for active embers */}
                {isActive && (
                  <>
                    <motion.div
                      className="absolute w-1 h-1 rounded-full"
                      style={{
                        background: isDarkMode ? '#FDBA74' : '#A78BFA',
                        top: '-8px',
                        left: '50%',
                        transform: 'translateX(-50%)'
                      }}
                      animate={{
                        y: [-8, -16, -8],
                        opacity: [0.8, 0.3, 0.8],
                        scale: [1, 0.5, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: step * 0.5
                      }}
                    />
                    <motion.div
                      className="absolute w-0.5 h-0.5 rounded-full"
                      style={{
                        background: isDarkMode ? '#FB923C' : '#8B7DA1',
                        top: '-6px',
                        right: '-6px'
                      }}
                      animate={{
                        y: [-6, -12, -6],
                        x: [0, 4, 0],
                        opacity: [0.6, 0.2, 0.6],
                        scale: [1, 0.3, 1]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: step * 0.3
                      }}
                    />
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-10">
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-3 rounded-3xl font-medium flex items-center gap-2 backdrop-blur-md font-['Courier_Prime'] transition-opacity duration-300"
            style={{
              background: getButtonBackground(),
              color: getSecondaryTextColor(),
              border: `1px solid ${getButtonBorder()}`,
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              opacity: currentStep === 1 ? 0.5 : 1,
              pointerEvents: currentStep === 1 ? 'none' : 'auto'
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
            className="px-5 py-3 rounded-3xl font-medium flex items-center gap-2 border-none text-white font-['Courier_Prime'] transition-all duration-300"
            style={{
              background: canProceed() ? 
                (isDarkMode ? 'linear-gradient(135deg, #1C1917 0%, #B45309 100%)' : 'linear-gradient(135deg, #2D2D37 0%, #8B7DA1 100%)') : 
                (isDarkMode ? 'rgba(100, 100, 100, 0.5)' : 'rgba(200, 200, 200, 0.5)'),
              cursor: canProceed() ? 'pointer' : 'not-allowed',
              opacity: canProceed() ? 1 : 0.5,
              boxShadow: canProceed() ? (isDarkMode ? '0 4px 20px rgba(180, 83, 9, 0.4)' : '0 4px 20px rgba(45, 45, 55, 0.3)') : 'none'
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