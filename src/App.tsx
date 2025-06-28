import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from './hooks/useTheme';
import Landing from './components/Landing';
import Display from './components/Display';
import AboutPage from './components/AboutPage';
import PrivacyPage from './components/PrivacyPage';
import BoltLogo from './components/BoltLogo';
import AppFooter from './components/common/AppFooter';

type AppState = 'landing' | 'display' | 'about' | 'privacy';

interface Poem {
  whisper: string;
  anchor: string;
  feeling: string;
  text: string;
}

function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [currentPoem, setCurrentPoem] = useState<Poem | null>(null);
  
  const {
    isDarkMode,
    toggleDarkMode,
    getBackgroundStyle,
    getTextColor,
    getFooterBackground,
    getFooterBorder,
    getLinkColor,
    getLinkHoverColor,
    getCardBackground,
    getCardBorder,
    getSecondaryTextColor
  } = useTheme();

  const handlePoemComplete = (poem: Poem) => {
    setCurrentPoem(poem);
    setCurrentState('display');
  };

  const handleBackToLanding = () => {
    setCurrentState('landing');
    setCurrentPoem(null);
  };

  const handleNavigateToPage = (page: AppState) => {
    setCurrentState(page);
  };

  const renderCurrentComponent = () => {
    switch (currentState) {
      case 'landing':
        return <Landing onComplete={handlePoemComplete} isDarkMode={isDarkMode} />;
      case 'display':
        return currentPoem ? (
          <Display 
            poem={currentPoem}
            onBack={handleBackToLanding}
          />
        ) : null;
      case 'about':
        return (
          <AboutPage
            onBack={handleBackToLanding}
            isDarkMode={isDarkMode}
            getTextColor={getTextColor}
            getSecondaryTextColor={getSecondaryTextColor}
            getCardBackground={getCardBackground}
            getCardBorder={getCardBorder}
          />
        );
      case 'privacy':
        return (
          <PrivacyPage
            onBack={handleBackToLanding}
            isDarkMode={isDarkMode}
            getTextColor={getTextColor}
            getSecondaryTextColor={getSecondaryTextColor}
            getCardBackground={getCardBackground}
            getCardBorder={getCardBorder}
          />
        );
      default:
        return <Landing onComplete={handlePoemComplete} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div 
      className="min-h-screen font-['Courier_Prime'] relative flex flex-col transition-all duration-500 ease-in-out"
      style={{ 
        background: getBackgroundStyle(),
        color: getTextColor()
      }}
    >
      {/* Enhanced noise grain overlay */}
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none z-10 transition-opacity duration-500 ease-in-out"
        style={{
          opacity: isDarkMode ? 0.08 : 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* Bolt Logo - appears on all pages */}
      <BoltLogo />
      
      {/* Main content area */}
      <div className="relative z-20 flex-1">
        <AnimatePresence mode="wait">
          {renderCurrentComponent()}
        </AnimatePresence>
      </div>

      {/* Footer with About, Privacy links and theme toggle */}
      <AppFooter
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        getFooterBackground={getFooterBackground}
        getFooterBorder={getFooterBorder}
        getLinkColor={getLinkColor}
        getLinkHoverColor={getLinkHoverColor}
        onNavigateToPage={handleNavigateToPage}
      />
    </div>
  );
}

export default App;