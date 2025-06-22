import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
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
        return <Landing onComplete={handlePoemComplete} />;
      case 'display':
        return currentPoem ? (
          <Display 
            poem={currentPoem}
            onBack={handleBackToLanding}
          />
        ) : null;
      default:
        return <Landing onComplete={handlePoemComplete} />;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: `
        radial-gradient(circle at 20% 80%, rgba(139, 125, 161, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(244, 194, 194, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(45, 45, 55, 0.12) 0%, transparent 50%),
        linear-gradient(135deg, #1a1a1a 0%, #2d2d37 100%)
      `,
      fontFamily: "'Courier Prime', monospace",
      position: 'relative',
      color: '#E5E5E5'
    }}>
      {/* Enhanced noise grain overlay with stronger texture */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.15,
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        zIndex: 1
      }} />
      
      {/* Additional subtle texture overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.08,
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3Ccircle cx='17' cy='37' r='1'/%3E%3Ccircle cx='37' cy='17' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        zIndex: 1
      }} />
      
      {/* Bolt Logo - appears on all pages */}
      <BoltLogo />
      
      <div style={{ position: 'relative', zIndex: 2 }}>
        <AnimatePresence mode="wait">
          {renderCurrentComponent()}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;