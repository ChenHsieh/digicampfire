import React from 'react';
import { motion } from 'framer-motion';

interface BoltLogoProps {
  onNavigate?: (page: 'landing' | 'display' | 'privacy' | 'about') => void;
  currentPage?: 'landing' | 'display' | 'privacy' | 'about';
}

const BoltLogo: React.FC<BoltLogoProps> = ({ onNavigate, currentPage }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      {/* Navigation Links */}
      {onNavigate && (
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '6px 12px',
          background: 'rgba(229, 229, 229, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(234, 88, 12, 0.15)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(234, 88, 12, 0.05)'
        }}>
          <motion.button
            onClick={() => onNavigate('about')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '4px 8px',
              borderRadius: '8px',
              background: currentPage === 'about' ? 'rgba(234, 88, 12, 0.15)' : 'transparent',
              border: 'none',
              color: currentPage === 'about' ? '#E5E5E5' : 'rgba(234, 88, 12, 0.8)',
              cursor: 'pointer',
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.7rem',
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
              padding: '4px 8px',
              borderRadius: '8px',
              background: currentPage === 'privacy' ? 'rgba(234, 88, 12, 0.15)' : 'transparent',
              border: 'none',
              color: currentPage === 'privacy' ? '#E5E5E5' : 'rgba(234, 88, 12, 0.8)',
              cursor: 'pointer',
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.7rem',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
          >
            Privacy
          </motion.button>
        </div>
      )}

      {/* Bolt Logo */}
      <motion.a
        href="https://bolt.new/"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'block',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          background: '#000000' // Fallback background
        }}
      >
        <img
          src="/black_circle_360x360.png"
          alt="Powered by Bolt"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div style="
                  width: 100%;
                  height: 100%;
                  background: #000000;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-family: 'Courier Prime', monospace;
                  font-size: 16px;
                  font-weight: bold;
                ">b</div>
              `;
            }
          }}
        />
      </motion.a>
    </motion.div>
  );
};

export default BoltLogo;