import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from './hooks/useTheme';
import Landing from './components/Landing';
import Display from './components/Display';
import BoltLogo from './components/BoltLogo';
import AppFooter from './components/common/AppFooter';

type AppState = 'landing' | 'display';

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
    isSoundOn,
    toggleDarkMode,
    toggleSound,
    getBackgroundStyle,
    getTextColor,
    getFooterBackground,
    getFooterBorder,
    getLinkColor,
    getLinkHoverColor
  } = useTheme();

  const handlePoemComplete = (poem: Poem) => {
    setCurrentPoem(poem);
    setCurrentState('display');
  };

  const handleBackToLanding = () => {
    setCurrentState('landing');
    setCurrentPoem(null);
  };

  const renderCurrentComponent = () => {
    switch (currentState) {
      case 'landing':
        return <Landing onComplete={handlePoemComplete} isDarkMode={isDarkMode} isSoundOn={isSoundOn} />;
      case 'display':
        return currentPoem ? (
          <Display 
            poem={currentPoem}
            onBack={handleBackToLanding}
            isDarkMode={isDarkMode}
            isSoundOn={isSoundOn}
          />
        ) : null;
      default:
        return <Landing onComplete={handlePoemComplete} isDarkMode={isDarkMode} isSoundOn={isSoundOn} />;
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
      {/* Enhanced noise grain overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: isDarkMode ? 0.08 : 0.04,
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        zIndex: 1,
        transition: 'opacity 0.5s ease'
      }} />
      
      {/* Bolt Logo - appears on all pages */}
      <BoltLogo />
      
      {/* Main content area */}
      <div style={{ position: 'relative', zIndex: 2, flex: 1 }}>
        <AnimatePresence mode="wait">
          {renderCurrentComponent()}
        </AnimatePresence>
      </div>

      {/* Footer with About, Privacy links and toggles */}
      <AppFooter
        isDarkMode={isDarkMode}
        isSoundOn={isSoundOn}
        toggleDarkMode={toggleDarkMode}
        toggleSound={toggleSound}
        getFooterBackground={getFooterBackground}
        getFooterBorder={getFooterBorder}
        getLinkColor={getLinkColor}
        getLinkHoverColor={getLinkHoverColor}
      />
    </div>
  );
}

export default App;