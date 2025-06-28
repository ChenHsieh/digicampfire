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
    <div style={{ 
      minHeight: '100vh', 
      background: getBackgroundStyle(),
      fontFamily: "'Courier Prime', monospace",
      position: 'relative',
      color: getTextColor(),
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.5s ease'
    }}>
      {/* Bolt Logo - appears on all pages */}
      <BoltLogo />
      
      {/* Main content area */}
      <div style={{ position: 'relative', zIndex: 2, flex: 1 }}>
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