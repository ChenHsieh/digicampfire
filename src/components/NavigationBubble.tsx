import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Sun, Moon, Info, Shield } from 'lucide-react';

interface NavigationBubbleProps {
  onNavigate: (page: 'landing' | 'display' | 'privacy' | 'about') => void;
  currentPage: 'landing' | 'display' | 'privacy' | 'about';
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const NavigationBubble: React.FC<NavigationBubbleProps> = ({ 
  onNavigate, 
  currentPage, 
  isDarkMode, 
  onThemeToggle 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 1000
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Main Navigation Bubble */}
      <motion.div
        animate={{
          width: isExpanded ? '200px' : '48px',
          height: isExpanded ? 'auto' : '48px'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(229, 229, 229, 0.1) 0%, rgba(234, 88, 12, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(26, 26, 26, 0.1) 0%, rgba(234, 88, 12, 0.08) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: 'none',
          boxShadow: isDarkMode
            ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(234, 88, 12, 0.1)'
            : '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(234, 88, 12, 0.2)',
          padding: isExpanded ? '16px' : '12px',
          overflow: 'hidden',
          cursor: 'pointer'
        }}
      >
        {/* Menu Icon (always visible) */}
        <motion.div
          animate={{ 
            opacity: isExpanded ? 0 : 1,
            scale: isExpanded ? 0.8 : 1
          }}
          transition={{ duration: 0.2 }}
          style={{
            position: isExpanded ? 'absolute' : 'static',
            top: isExpanded ? '16px' : 'auto',
            left: isExpanded ? '16px' : 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px'
          }}
        >
          <Menu 
            size={20} 
            color={isDarkMode ? '#EA580C' : '#C2410C'} 
          />
        </motion.div>

        {/* Expanded Menu Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {/* Theme Toggle */}
              <motion.button
                onClick={onThemeToggle}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(234, 88, 12, 0.15) 0%, rgba(234, 88, 12, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(234, 88, 12, 0.2) 0%, rgba(234, 88, 12, 0.1) 100%)',
                  border: 'none',
                  color: isDarkMode ? '#E5E5E5' : '#1a1a1a',
                  cursor: 'pointer',
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  width: '100%',
                  justifyContent: 'flex-start',
                  transition: 'all 0.3s ease'
                }}
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </motion.button>

              {/* About Button */}
              <motion.button
                onClick={() => onNavigate('about')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  background: currentPage === 'about' 
                    ? (isDarkMode 
                        ? 'linear-gradient(135deg, rgba(234, 88, 12, 0.25) 0%, rgba(234, 88, 12, 0.15) 100%)'
                        : 'linear-gradient(135deg, rgba(234, 88, 12, 0.3) 0%, rgba(234, 88, 12, 0.2) 100%)')
                    : 'transparent',
                  border: 'none',
                  color: currentPage === 'about' 
                    ? (isDarkMode ? '#E5E5E5' : '#1a1a1a')
                    : (isDarkMode ? 'rgba(234, 88, 12, 0.8)' : 'rgba(194, 65, 12, 0.8)'),
                  cursor: 'pointer',
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  width: '100%',
                  justifyContent: 'flex-start',
                  transition: 'all 0.3s ease'
                }}
              >
                <Info size={16} />
                About
              </motion.button>

              {/* Privacy Button */}
              <motion.button
                onClick={() => onNavigate('privacy')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  background: currentPage === 'privacy' 
                    ? (isDarkMode 
                        ? 'linear-gradient(135deg, rgba(234, 88, 12, 0.25) 0%, rgba(234, 88, 12, 0.15) 100%)'
                        : 'linear-gradient(135deg, rgba(234, 88, 12, 0.3) 0%, rgba(234, 88, 12, 0.2) 100%)')
                    : 'transparent',
                  border: 'none',
                  color: currentPage === 'privacy' 
                    ? (isDarkMode ? '#E5E5E5' : '#1a1a1a')
                    : (isDarkMode ? 'rgba(234, 88, 12, 0.8)' : 'rgba(194, 65, 12, 0.8)'),
                  cursor: 'pointer',
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  width: '100%',
                  justifyContent: 'flex-start',
                  transition: 'all 0.3s ease'
                }}
              >
                <Shield size={16} />
                Privacy
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default NavigationBubble;