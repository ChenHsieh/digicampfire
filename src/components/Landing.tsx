import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { feelingPrompts } from '../constants/appConstants';
import { useTheme } from '../hooks/useTheme';
import { useCampfireOrbAnimation } from '../hooks/useCampfireOrbAnimation';
import { usePoemGenerationFlow } from '../hooks/usePoemGenerationFlow';
import WhisperSelection from './landing/WhisperSelection';
import AnchorSelection from './landing/AnchorSelection';
import FeelingInput from './landing/FeelingInput';
import CampfireOrb from './landing/CampfireOrb';
import PoemGeneratingLoader from './PoemGeneratingLoader';

interface Poem {
  whisper: string;
  anchor: string;
  feeling: string;
  text: string;
  headline: string;
  link: string;
}

interface LandingProps {
  onComplete: (poem: Poem) => void;
  isDarkMode: boolean;
}

const Landing: React.FC<LandingProps> = ({ onComplete, isDarkMode }) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  const {
    getTextColor,
    getSecondaryTextColor,
    getCardBackground,
    getCardBorder,
    getHaloTextStyle
  } = useTheme();

  const {
    mousePosition,
    isOrbHovered,
    setIsOrbHovered,
    orbRef
  } = useCampfireOrbAnimation();

  const {
    currentStep,
    selectedWhisper,
    selectedAnchor,
    feeling,
    setFeeling,
    isGenerating,
    anchorWords,
    loadingAnchors,
    whisperOptions,
    loadingWhispers,
    handleNext,
    handleBack,
    canProceed,
    handleSelection,
    loadWhispers,
    loadNewAnchors
  } = usePoemGenerationFlow(onComplete);

  const getButtonBackground = () => isDarkMode ? 'rgba(28, 25, 23, 0.8)' : 'rgba(254, 254, 254, 0.8)';
  const getButtonBorder = () => isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.2)';

  // Animate prompt rotation
  useEffect(() => {
    if (currentStep === 3) {
      const interval = setInterval(() => {
        setCurrentPromptIndex((prev) => (prev + 1) % feelingPrompts.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

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
            getHaloTextStyle={getHaloTextStyle}
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
            getHaloTextStyle={getHaloTextStyle}
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
            getHaloTextStyle={getHaloTextStyle}
          />
        );
      
      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <PoemGeneratingLoader
        isDarkMode={isDarkMode}
        getTextColor={getTextColor}
      />
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
        <CampfireOrb
          orbRef={orbRef}
          mousePosition={mousePosition}
          isOrbHovered={isOrbHovered}
          setIsOrbHovered={setIsOrbHovered}
          isDarkMode={isDarkMode}
        />
        
        <h1 
          className="text-4xl md:text-6xl mb-4 font-normal font-['EB_Garamond'] text-center"
          style={{ 
            color: getTextColor(),
            ...getHaloTextStyle()
          }}
        >
          Digital Campfire
        </h1>
        
        <p 
          className="text-lg mb-12 max-w-lg mx-auto leading-relaxed text-center italic"
          style={{ color: getSecondaryTextColor() }}
        >
          Read the world. Write your flame.
        </p>

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