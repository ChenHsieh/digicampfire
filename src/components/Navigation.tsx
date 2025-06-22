import React from 'react';
import { motion } from 'framer-motion';

interface NavigationProps {
  currentPage: 'landing' | 'display' | 'privacy' | 'about';
  onNavigate: (page: 'landing' | 'display' | 'privacy' | 'about') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '16px',
        padding: '12px 20px',
        background: 'rgba(229, 229, 229, 0.08)',
        backdropFilter: 'blur(20px)',
        borderRadius: '25px',
        border: '1px solid rgba(194, 65, 12, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(194, 65, 12, 0.1)',
        zIndex: 100
      }}
    >
      <motion.button
        onClick={() => onNavigate('about')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: '6px 12px',
          borderRadius: '15px',
          background: currentPage === 'about' ? 'rgba(194, 65, 12, 0.2)' : 'transparent',
          border: 'none',
          color: currentPage === 'about' ? '#E5E5E5' : '#C2410C',
          cursor: 'pointer',
          fontFamily: "'Courier Prime', monospace",
          fontSize: '0.8rem',
          fontWeight: 500,
          transition: 'all 0.2s ease'
        }}
      >
        About
      </motion.button>
      
      <motion.button
        onClick={() => onNavigate('privacy')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: '6px 12px',
          borderRadius: '15px',
          background: currentPage === 'privacy' ? 'rgba(194, 65, 12, 0.2)' : 'transparent',
          border: 'none',
          color: currentPage === 'privacy' ? '#E5E5E5' : '#C2410C',
          cursor: 'pointer',
          fontFamily: "'Courier Prime', monospace",
          fontSize: '0.8rem',
          fontWeight: 500,
          transition: 'all 0.2s ease'
        }}
      >
        Privacy
      </motion.button>
    </motion.div>
  );
};

export default Navigation;