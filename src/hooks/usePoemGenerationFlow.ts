import { useState, useEffect } from 'react';
import { fetchPoeticWhispersWithSources } from '../utils/rssParser';
import { generateSkinnyPoem, generateAnchorWords } from '../utils/openai';
import { baseAnchorWords } from '../constants/appConstants';

interface WhisperWithSource {
  poetic: string;
  headline: string;
  link: string;
}

interface Poem {
  whisper: string;
  anchor: string;
  feeling: string;
  text: string;
  headline: string;
  link: string;
}

export const usePoemGenerationFlow = (onComplete: (poem: Poem) => void) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedWhisper, setSelectedWhisper] = useState<WhisperWithSource | null>(null);
  const [selectedAnchor, setSelectedAnchor] = useState<string>('');
  const [feeling, setFeeling] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
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

  useEffect(() => {
    loadWhispers();
  }, []);

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

  return {
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
  };
};