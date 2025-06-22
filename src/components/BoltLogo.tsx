import React from 'react';
import { motion } from 'framer-motion';

const BoltLogo: React.FC = () => {
  return (
    <motion.a
      href="https://bolt.new/"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'block',
        width: '48px',
        height: '48px',
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
                font-size: 18px;
                font-weight: bold;
              ">b</div>
            `;
          }
        }}
      />
    </motion.a>
  );
};

export default BoltLogo;