import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Edit3, Copy, Check, ExternalLink } from 'lucide-react';
import { validateSkinnyPoem } from '../utils/openai';
import { useTheme } from '../hooks/useTheme';

interface Poem {
  whisper: string;
  anchor: string;
  feeling: string;
  text: string;
  headline: string;
  link: string;
}

interface DisplayProps {
  poem: Poem;
  onBack: () => void;
}

const Display: React.FC<DisplayProps> = ({ poem, onBack }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCuratorTweak, setShowCuratorTweak] = useState(false);
  const [editedPoem, setEditedPoem] = useState(poem.text);
  const [currentPoem, setCurrentPoem] = useState(poem.text);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const {
    isDarkMode,
    getTextColor,
    getSecondaryTextColor,
    getCardBackground,
    getCardBorder,
    getPoemBackground,
    getPoemShadow
  } = useTheme();
  
  const lines = currentPoem.split('\n').filter(line => line.trim() !== '');
  
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines(prev => {
        if (prev < lines.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 600);
    
    return () => clearInterval(timer);
  }, [lines.length]);

  const handleSaveTweak = async () => {
    // Validate the edited poem follows Skinny poem rules
    const validation = await validateSkinnyPoem(editedPoem, poem.anchor);
    
    if (!validation.isValid) {
      alert(`Please check the Skinny poem structure:\n${validation.issues.join('\n')}`);
      return;
    }
    
    setCurrentPoem(editedPoem);
    setShowCuratorTweak(false);
  };

  const handleCopyToClipboard = async () => {
    const shareText = `${currentPoem}\n\n— Created at Digital Campfire\nhttps://digicampfire.xyz/`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="min-h-screen py-10 pb-20 relative">
      <div className="max-w-3xl mx-auto px-6 w-full relative">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-full mb-10 cursor-pointer backdrop-blur-md font-['Courier_Prime']"
          style={{
            color: getSecondaryTextColor(),
            background: getCardBackground(),
            border: `1px solid ${getCardBorder()}`
          }}
        >
          <ArrowLeft size={16} />
          Return to the fire
        </motion.button>
        
        {/* Campfire glow for the poem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="p-12 rounded-2xl mb-10 relative backdrop-blur-2xl"
          style={{
            background: getPoemBackground(),
            boxShadow: getPoemShadow(),
            border: `1px solid ${getCardBorder()}`
          }}
        >
          {/* Floating embers effect - warmer in dark mode */}
          <div 
            className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full animate-pulse"
            style={{
              background: isDarkMode ? 'rgba(251, 146, 60, 0.9)' : 'rgba(244, 194, 194, 0.6)',
              animation: 'float 3s ease-in-out infinite'
            }}
          />
          
          <h1 className="text-3xl text-center mb-8 font-normal font-['EB_Garamond']" style={{ color: getTextColor() }}>
            Your Verse by the Fire
          </h1>
          
          <div 
            className="text-xl leading-relaxed whitespace-pre-wrap text-center font-['EB_Garamond']"
            style={{ color: getTextColor() }}
          >
            {lines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ 
                  opacity: index < visibleLines ? 1 : 0,
                  y: index < visibleLines ? 0 : 15
                }}
                transition={{ 
                  duration: 0.8,
                  delay: index * 0.2
                }}
                className="mb-3"
              >
                {line}
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Poem metadata */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10"
        >
          <div 
            className="p-5 rounded-xl backdrop-blur-md"
            style={{
              background: getCardBackground(),
              border: `1px solid ${getCardBorder()}`
            }}
          >
            <div 
              className="text-xs mb-2 font-semibold uppercase tracking-wider font-['Courier_Prime']"
              style={{ color: getSecondaryTextColor() }}
            >
              Whisper
            </div>
            <div 
              className="text-base font-['EB_Garamond'] italic"
              style={{ color: getTextColor() }}
            >
              {poem.whisper}
            </div>
          </div>
          
          <div 
            className="p-5 rounded-xl backdrop-blur-md"
            style={{
              background: getCardBackground(),
              border: `1px solid ${getCardBorder()}`
            }}
          >
            <div 
              className="text-xs mb-2 font-semibold uppercase tracking-wider font-['Courier_Prime']"
              style={{ color: getSecondaryTextColor() }}
            >
              Anchor
            </div>
            <div 
              className="text-lg font-['Courier_Prime'] font-semibold"
              style={{ color: getTextColor() }}
            >
              {poem.anchor}
            </div>
          </div>
          
          {/* News Source Card */}
          <div 
            className="p-5 rounded-xl backdrop-blur-md md:col-span-2"
            style={{
              background: getCardBackground(),
              border: `1px solid ${getCardBorder()}`
            }}
          >
            <div 
              className="text-xs mb-2 font-semibold uppercase tracking-wider font-['Courier_Prime']"
              style={{ color: getSecondaryTextColor() }}
            >
              From Today's News
            </div>
            <div className="flex items-center justify-between gap-3">
              <div 
                className="text-base font-['EB_Garamond'] flex-1"
                style={{ color: getTextColor() }}
              >
                {poem.headline}
              </div>
              <motion.a
                href={poem.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 font-['Courier_Prime'] flex-shrink-0"
                style={{
                  background: isDarkMode ? 'rgba(180, 83, 9, 0.2)' : 'rgba(139, 125, 161, 0.1)',
                  border: `1px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.2)'}`,
                  color: getSecondaryTextColor(),
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.2)';
                  e.currentTarget.style.color = getTextColor();
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode ? 'rgba(180, 83, 9, 0.2)' : 'rgba(139, 125, 161, 0.1)';
                  e.currentTarget.style.color = getSecondaryTextColor();
                }}
              >
                <ExternalLink size={14} />
                Read Source
              </motion.a>
            </div>
          </div>
          
          {poem.feeling && (
            <div 
              className="p-5 rounded-xl backdrop-blur-md md:col-span-2"
              style={{
                background: getCardBackground(),
                border: `1px solid ${getCardBorder()}`
              }}
            >
              <div 
                className="text-xs mb-2 font-semibold uppercase tracking-wider font-['Courier_Prime']"
                style={{ color: getSecondaryTextColor() }}
              >
                What you carried
              </div>
              <div 
                className="text-base font-['EB_Garamond'] italic"
                style={{ color: getTextColor() }}
              >
                "{poem.feeling}"
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Curator Tweak Section */}
        {showCuratorTweak && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 rounded-2xl mb-10 backdrop-blur-2xl"
            style={{
              background: isDarkMode ? 'rgba(28, 25, 23, 0.9)' : 'rgba(254, 254, 254, 0.9)',
              border: `2px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.4)' : 'rgba(139, 125, 161, 0.2)'}`
            }}
          >
            <h3 
              className="text-xl mb-4 font-['EB_Garamond'] font-medium"
              style={{ color: getTextColor() }}
            >
              Small Revisions in the Dusk
            </h3>
            <p 
              className="text-sm mb-4 italic"
              style={{ color: getSecondaryTextColor() }}
            >
              Edit carefully - changes will be validated against Skinny poem structure
            </p>
            <textarea
              value={editedPoem}
              onChange={(e) => setEditedPoem(e.target.value)}
              className="w-full min-h-[200px] p-4 rounded-lg text-base leading-relaxed resize-y font-['EB_Garamond'] outline-none"
              style={{
                border: `1px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.5)' : 'rgba(139, 125, 161, 0.3)'}`,
                background: isDarkMode ? 'rgba(28, 25, 23, 0.8)' : 'rgba(254, 254, 254, 0.8)',
                color: getTextColor()
              }}
            />
            <div className="flex gap-3 mt-4 justify-end">
              <motion.button
                onClick={() => {
                  setShowCuratorTweak(false);
                  setEditedPoem(currentPoem); // Reset to current poem
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full cursor-pointer font-['Courier_Prime'] text-sm"
                style={{
                  background: getCardBackground(),
                  border: `1px solid ${getCardBorder()}`,
                  color: getSecondaryTextColor()
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSaveTweak}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full border-none text-white cursor-pointer font-['Courier_Prime'] text-sm"
                style={{
                  background: isDarkMode ? 'linear-gradient(135deg, #1C1917 0%, #B45309 100%)' : 'linear-gradient(135deg, #2D2D37 0%, #8B7DA1 100%)'
                }}
              >
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        )}
        
        {/* Share Options Modal */}
        {showShareOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-[1000] p-5 backdrop-blur-md"
            style={{
              background: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(45, 45, 55, 0.8)'
            }}
            onClick={() => setShowShareOptions(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-8 rounded-2xl backdrop-blur-2xl max-w-sm w-full"
              style={{
                background: isDarkMode ? 'rgba(28, 25, 23, 0.95)' : 'rgba(254, 254, 254, 0.95)',
                border: `1px solid ${getCardBorder()}`,
                boxShadow: isDarkMode ? '0 20px 60px rgba(0, 0, 0, 0.5)' : '0 20px 60px rgba(45, 45, 55, 0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 
                className="text-2xl mb-6 font-['EB_Garamond'] font-medium text-center"
                style={{ color: getTextColor() }}
              >
                Share Your Poem
              </h3>
              
              <div className="flex flex-col gap-4">
                <motion.button
                  onClick={handleCopyToClipboard}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 rounded-xl cursor-pointer font-['Courier_Prime'] text-sm w-full justify-start transition-all duration-300"
                  style={{
                    background: copySuccess ? 
                      (isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)') : 
                      getCardBackground(),
                    border: `1px solid ${copySuccess ? 
                      (isDarkMode ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.3)') : 
                      getCardBorder()}`,
                    color: copySuccess ? '#059669' : getTextColor()
                  }}
                >
                  {copySuccess ? <Check size={18} /> : <Copy size={18} />}
                  {copySuccess ? 'Copied to clipboard!' : 'Copy to clipboard'}
                </motion.button>
              </div>
              
              <motion.button
                onClick={() => setShowShareOptions(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-4 py-2 rounded-full cursor-pointer font-['Courier_Prime'] text-sm w-full"
                style={{
                  background: getCardBackground(),
                  border: `1px solid ${getCardBorder()}`,
                  color: getSecondaryTextColor()
                }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
        
        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          <motion.button
            onClick={() => {
              setShowCuratorTweak(!showCuratorTweak);
              if (!showCuratorTweak) {
                setEditedPoem(currentPoem); // Initialize with current poem
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-3 rounded-3xl cursor-pointer backdrop-blur-md font-['Courier_Prime'] text-sm"
            style={{
              background: showCuratorTweak ? 
                getCardBackground(true) : 
                getCardBackground(false),
              border: `1px solid ${showCuratorTweak ? getCardBorder(true) : getCardBorder(false)}`,
              color: getTextColor()
            }}
          >
            <Edit3 size={16} />
            Small revisions in the dusk
          </motion.button>
          
          <motion.button
            onClick={() => setShowShareOptions(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-3 rounded-3xl cursor-pointer backdrop-blur-md font-['Courier_Prime'] text-sm"
            style={{
              background: getCardBackground(false),
              border: `1px solid ${getCardBorder(false)}`,
              color: getTextColor()
            }}
          >
            <Share2 size={16} />
            Offer your spark
          </motion.button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="text-center mt-10"
        >
          <p 
            className="text-sm italic font-['EB_Garamond']"
            style={{ color: getSecondaryTextColor() }}
          >
            Thank you for sharing your light with us
          </p>
        </motion.div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateX(-50%) translateY(0px);
            opacity: 0.6;
          }
          50% { 
            transform: translateX(-50%) translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Display;