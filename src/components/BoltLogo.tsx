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
      <picture>
        {/* WebP version for modern browsers - pointing to optimized directory */}
        <source 
          srcSet="/optimized/black_circle_360x360.webp" 
          type="image/webp"
        />
        {/* Fallback PNG */}
        <img
          src="/black_circle_360x360.png"
          alt="Powered by Bolt"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          loading="lazy"
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement?.parentElement;
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
                  font-size: 8px;
                  font-weight: bold;
                  text-align: center;
                  line-height: 1.1;
                  padding: 4px;
                  box-sizing: border-box;
                ">Built with<br/>Bolt.new</div>
              `;
            }
          }}
        />
      </picture>
    </motion.a>
  );
};

export default BoltLogo;