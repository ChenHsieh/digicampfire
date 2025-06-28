import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

type AppState = 'landing' | 'display' | 'about' | 'privacy';

interface AppFooterProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  getFooterBackground: () => string;
  getFooterBorder: () => string;
  getLinkColor: () => string;
  getLinkHoverColor: () => string;
  onNavigateToPage: (page: AppState) => void;
}

const AppFooter: React.FC<AppFooterProps> = ({
  isDarkMode,
  toggleDarkMode,
  getFooterBackground,
  getFooterBorder,
  getLinkColor,
  getLinkHoverColor,
  onNavigateToPage
}) => {
  return (
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
        <button
          onClick={(e) => {
            e.preventDefault();
            onNavigateToPage('about');
          }}
          style={{
            color: getLinkColor(),
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontFamily: "'Courier Prime', monospace",
            transition: 'color 0.3s ease',
            cursor: 'pointer',
            background: 'none',
            border: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = getLinkHoverColor();
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = getLinkColor();
          }}
        >
          About
        </button>
        
        <div style={{
          width: '1px',
          height: '12px',
          background: isDarkMode ? 'rgba(180, 83, 9, 0.4)' : 'rgba(139, 125, 161, 0.3)',
          transition: 'background 0.5s ease'
        }} />
        
        <button
          onClick={(e) => {
            e.preventDefault();
            onNavigateToPage('privacy');
          }}
          style={{
            color: getLinkColor(),
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontFamily: "'Courier Prime', monospace",
            transition: 'color 0.3s ease',
            cursor: 'pointer',
            background: 'none',
            border: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = getLinkHoverColor();
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = getLinkColor();
          }}
        >
          Privacy
        </button>
      </div>

      {/* Right side - Theme toggle only */}
      <div style={{
        display: 'flex',
        alignItems: 'center'
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
            background: isDarkMode ? 'rgba(251, 146, 60, 0.2)' : 'rgba(139, 125, 161, 0.15)',
            border: `1px solid ${isDarkMode ? 'rgba(251, 146, 60, 0.4)' : 'rgba(139, 125, 161, 0.3)'}`,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <Sun size={18} color="#FB923C" />
          ) : (
            <Moon size={18} color="#8B7DA1" />
          )}
        </motion.button>
      </div>
    </footer>
  );
};

export default AppFooter;