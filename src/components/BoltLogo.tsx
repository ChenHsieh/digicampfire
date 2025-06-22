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
        transition: 'all 0.3s ease'
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
      />
    </motion.a>
  );
};

export default BoltLogo;