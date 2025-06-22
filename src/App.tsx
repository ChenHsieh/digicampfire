import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './components/Landing';
import Display from './components/Display';
import About from './components/About';
import Privacy from './components/Privacy';
import Archive from './components/Archive';
import BoltLogo from './components/BoltLogo';
import Navigation from './components/Navigation';

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

  const MainApp = () => {
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
          radial-gradient(circle at 20% 80%, rgba(139, 125, 161, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(244, 194, 194, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(45, 45, 55, 0.08) 0%, transparent 50%),
          linear-gradient(135deg, #FEFEFE 0%, #F8F8F8 100%)
        `,
        fontFamily: "'Courier Prime', monospace",
        position: 'relative',
        color: '#2D2D37'
      }}>
        {/* Enhanced noise grain overlay */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.04,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
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
  };

  return (
    <Router>
      <div style={{ 
        minHeight: '100vh', 
        background: `
          radial-gradient(circle at 20% 80%, rgba(139, 125, 161, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(244, 194, 194, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(45, 45, 55, 0.08) 0%, transparent 50%),
          linear-gradient(135deg, #FEFEFE 0%, #F8F8F8 100%)
        `,
        fontFamily: "'Courier Prime', monospace",
        position: 'relative',
        color: '#2D2D37'
      }}>
        {/* Enhanced noise grain overlay */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.04,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          zIndex: 1
        }} />
        
        {/* Bolt Logo - appears on all pages */}
        <BoltLogo />
        
        {/* Navigation - appears on static pages */}
        <Navigation />
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Routes>
            <Route path="/" element={<MainApp />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/archive" element={<Archive />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;