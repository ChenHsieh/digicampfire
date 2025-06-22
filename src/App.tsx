import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Landing from './components/Landing';
import Display from './components/Display';
import Privacy from './components/Privacy';
import About from './components/About';
import BoltLogo from './components/BoltLogo';

type AppState = 'landing' | 'display' | 'privacy' | 'about';

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

  const handleNavigate = (page: AppState) => {
    setCurrentState(page);
  };

  const renderCurrentComponent = () => {
    switch (currentState) {
      case 'landing':
        return <Landing onComplete={handlePoemComplete} onNavigate={handleNavigate} />;
      case 'display':
        return currentPoem ? (
          <Display 
            poem={currentPoem}
            onBack={handleBackToLanding}
            onNavigate={handleNavigate}
          />
        ) : null;
      case 'privacy':
        return <Privacy onNavigate={handleNavigate} />;
      case 'about':
        return <About onNavigate={handleNavigate} />;
      default:
        return <Landing onComplete={handlePoemComplete} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: `
        radial-gradient(circle at 20% 80%, rgba(194, 65, 12, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(45, 45, 55, 0.12) 0%, transparent 50%),
        linear-gradient(135deg, #1a1a1a 0%, #2d2d37 100%)
      `,
      fontFamily: "'Courier Prime', monospace",
      position: 'relative',
      color: '#E5E5E5'
    }}>
      {/* Enhanced particle-like noise overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.12,
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        zIndex: 1
      }} />
      
      {/* Additional particle texture overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.06,
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='12' cy='15' r='0.8'/%3E%3Ccircle cx='45' cy='8' r='0.6'/%3E%3Ccircle cx='78' cy='23' r='0.7'/%3E%3Ccircle cx='23' cy='67' r='0.5'/%3E%3Ccircle cx='67' cy='45' r='0.9'/%3E%3Ccircle cx='89' cy='78' r='0.6'/%3E%3Ccircle cx='34' cy='89' r='0.7'/%3E%3Ccircle cx='56' cy='67' r='0.5'/%3E%3Ccircle cx='8' cy='45' r='0.8'/%3E%3Ccircle cx='90' cy='12' r='0.6'/%3E%3Ccircle cx='67' cy='89' r='0.7'/%3E%3Ccircle cx='12' cy='78' r='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
        zIndex: 1
      }} />
      
      {/* Bolt Logo with Navigation - appears on all pages */}
      <BoltLogo onNavigate={handleNavigate} currentPage={currentState} />
      
      <div style={{ position: 'relative', zIndex: 2 }}>
        <AnimatePresence mode="wait">
          {renderCurrentComponent()}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;