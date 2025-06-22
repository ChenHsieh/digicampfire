import React from 'react';
import { motion } from 'framer-motion';

interface NavigationProps {
  currentPage: 'landing' | 'display' | 'privacy' | 'about';
  onNavigate: (page: 'landing' | 'display' | 'privacy' | 'about') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        padding: '8px 16px',
        background: 'rgba(229, 229, 229, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(234, 88, 12, 0.15)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(234, 88, 12, 0.05)',
        zIndex: 100
      }}
    >
      <motion.button
        onClick={() => onNavigate('about')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: '4px 10px',
          borderRadius: '12px',
          background: currentPage === 'about' ? 'rgba(234, 88, 12, 0.15)' : 'transparent',
          border: 'none',
          color: currentPage === 'about' ? '#E5E5E5' : 'rgba(234, 88, 12, 0.7)',
          cursor: 'pointer',
          fontFamily: "'Courier Prime', monospace",
          fontSize: '0.75rem',
          fontWeight: 500,
          transition: 'all 0.2s ease',
          opacity: 0.8
        }}
      >
        About
      </motion.button>
      
      <motion.button
        onClick={() => onNavigate('privacy')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: '4px 10px',
          borderRadius: '12px',
          background: currentPage === 'privacy' ? 'rgba(234, 88, 12, 0.15)' : 'transparent',
          border: 'none',
          color: currentPage === 'privacy' ? '#E5E5E5' : 'rgba(234, 88, 12, 0.7)',
          cursor: 'pointer',
          fontFamily: "'Courier Prime', monospace",
          fontSize: '0.75rem',
          fontWeight: 500,
          transition: 'all 0.2s ease',
          opacity: 0.8
        }}
      >
        Privacy
      </motion.button>
    </motion.div>
  );
};

export default Navigation;