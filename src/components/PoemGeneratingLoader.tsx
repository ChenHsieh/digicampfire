import React from 'react';
import { motion } from 'framer-motion';

interface PoemGeneratingLoaderProps {
  isDarkMode: boolean;
  getTextColor: () => string;
}

const PoemGeneratingLoader: React.FC<PoemGeneratingLoaderProps> = ({
  isDarkMode,
  getTextColor
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-10 px-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-6 w-12 h-12 rounded-full"
        style={{ 
          border: `3px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.2)'}`,
          borderTop: `3px solid ${isDarkMode ? '#FDBA74' : '#8B7DA1'}`
        }}
      />
      <p 
        className="text-xl font-['EB_Garamond'] text-center"
        style={{ color: getTextColor() }}
      >
        The poem is arriving...
      </p>
    </div>
  );
};

export default PoemGeneratingLoader;