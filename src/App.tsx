import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import Landing from './components/Landing';
import Display from './components/Display';
import BoltLogo from './components/BoltLogo';

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('digitalCampfire_darkMode');
    const savedSoundOn = localStorage.getItem('digitalCampfire_soundOn');
    
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
    if (savedSoundOn !== null) {
      setIsSoundOn(JSON.parse(savedSoundOn));
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('digitalCampfire_darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('digitalCampfire_soundOn', JSON.stringify(isSoundOn));
  }, [isSoundOn]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
  };

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

  // Dynamic styles based on dark mode
  const getBackgroundStyle = () => {
    if (isDarkMode) {
      return `
        radial-gradient(circle at 20% 80%, rgba(139, 125, 161, 0.25) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(244, 194, 194, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(45, 45, 55, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #1A1A1A 0%, #2D2D37 100%)
      `;
    }
    return `
      radial-gradient(circle at 20% 80%, rgba(139, 125, 161, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(244, 194, 194, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(45, 45, 55, 0.08) 0%, transparent 50%),
      linear-gradient(135deg, #FEFEFE 0%, #F8F8F8 100%)
    `;
  };

  const getTextColor = () => isDarkMode ? '#E5E5E5' : '#2D2D37';
  const getFooterBackground = () => isDarkMode ? 'rgba(45, 45, 55, 0.8)' : 'rgba(254, 254, 254, 0.8)';
  const getFooterBorder = () => isDarkMode ? 'rgba(139, 125, 161, 0.2)' : 'rgba(139, 125, 161, 0.1)';
  const getLinkColor = () => isDarkMode ? '#B8A8C8' : '#8B7DA1';
  const getLinkHoverColor = () => isDarkMode ? '#E5E5E5' : '#2D2D37';

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
        opacity: isDarkMode ? 0.06 : 0.04,
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
      <footer style={{
        position: 'relative',
        zIndex: 2,
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: `1px solid ${getFooterBorder()}`,
        background: getFooterBackground(),
        backdropFilter: 'blur(10px)',
        transition: 'all 0.5s ease'
      }}>
        {/* Left side - About and Privacy links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          <a
            href="/about"
            style={{
              color: getLinkColor(),
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontFamily: "'Courier Prime', monospace",
              transition: 'color 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = getLinkHoverColor();
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = getLinkColor();
            }}
          >
            About
          </a>
          
          <div style={{
            width: '1px',
            height: '12px',
            background: isDarkMode ? 'rgba(139, 125, 161, 0.4)' : 'rgba(139, 125, 161, 0.3)',
            transition: 'background 0.5s ease'
          }} />
          
          <a
            href="/privacy"
            style={{
              color: getLinkColor(),
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontFamily: "'Courier Prime', monospace",
              transition: 'color 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = getLinkHoverColor();
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = getLinkColor();
            }}
          >
            Privacy
          </a>
        </div>

        {/* Right side - Theme and Sound toggles */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* Dark/Light mode toggle */}
          <motion.button
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: isDarkMode ? 'rgba(244, 194, 194, 0.15)' : 'rgba(139, 125, 161, 0.15)',
              border: `1px solid ${isDarkMode ? 'rgba(244, 194, 194, 0.3)' : 'rgba(139, 125, 161, 0.3)'}`,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun size={18} color="#F4C2C2" />
            ) : (
              <Moon size={18} color="#8B7DA1" />
            )}
          </motion.button>

          {/* Sound toggle */}
          <motion.button
            onClick={toggleSound}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: isSoundOn ? 
                (isDarkMode ? 'rgba(139, 125, 161, 0.15)' : 'rgba(139, 125, 161, 0.15)') : 
                (isDarkMode ? 'rgba(244, 194, 194, 0.15)' : 'rgba(244, 194, 194, 0.15)'),
              border: `1px solid ${isSoundOn ? 
                (isDarkMode ? 'rgba(139, 125, 161, 0.3)' : 'rgba(139, 125, 161, 0.3)') : 
                (isDarkMode ? 'rgba(244, 194, 194, 0.3)' : 'rgba(244, 194, 194, 0.3)')}`,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            title={isSoundOn ? 'Turn sound off' : 'Turn sound on'}
          >
            {isSoundOn ? (
              <Volume2 size={18} color={isDarkMode ? '#B8A8C8' : '#8B7DA1'} />
            ) : (
              <VolumeX size={18} color={isDarkMode ? '#F4C2C2' : '#F4C2C2'} />
            )}
          </motion.button>
        </div>
      </footer>
    </div>
  );
}

export default App;