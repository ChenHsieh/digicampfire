import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
  isDarkMode: boolean;
  getTextColor: () => string;
  getSecondaryTextColor: () => string;
  getCardBackground: (isSelected?: boolean) => string;
  getCardBorder: (isSelected?: boolean) => string;
}

const AboutPage: React.FC<AboutPageProps> = ({
  onBack,
  isDarkMode,
  getTextColor,
  getSecondaryTextColor,
  getCardBackground,
  getCardBorder
}) => {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px 0 80px',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 24px',
        width: '100%',
        position: 'relative'
      }}>
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: getSecondaryTextColor(),
            fontSize: '0.9rem',
            padding: '8px 16px',
            borderRadius: '20px',
            marginBottom: '40px',
            background: getCardBackground(),
            border: `1px solid ${getCardBorder()}`,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            fontFamily: "'Courier Prime', monospace"
          }}
        >
          <ArrowLeft size={16} />
          Back to the fire
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            background: getCardBackground(),
            padding: '48px',
            borderRadius: '20px',
            border: `1px solid ${getCardBorder()}`,
            backdropFilter: 'blur(15px)',
            boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(45, 45, 55, 0.1)'
          }}
        >
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '32px',
            color: getTextColor(),
            fontWeight: 500,
            fontFamily: "'EB Garamond', serif",
            textAlign: 'center'
          }}>
            About Digital Campfire
          </h1>

          <div style={{
            fontSize: '1.1rem',
            lineHeight: 1.7,
            color: getTextColor(),
            fontFamily: "'EB Garamond', serif",
            marginBottom: '32px'
          }}>
            <p style={{ marginBottom: '24px' }}>
              Digital Campfire transforms today's news headlines into personalized short "Skinny poems" with the help of AI. 
              Rather than being just another AI poem generator, this is crafted as a lightweight creative writing gadget.
            </p>

            <p style={{ marginBottom: '24px' }}>
              The process is simple and meditative: you press a few buttons, weigh in on your feelings, 
              and can edit the poem at the end. It's designed to help you find a moment of reflection 
              and creativity in the midst of our information-saturated world.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '16px',
              marginTop: '32px',
              color: getTextColor(),
              fontFamily: "'EB Garamond', serif",
              fontWeight: 600
            }}>
              What is a Skinny Poem?
            </h2>

            <p style={{ marginBottom: '24px' }}>
              Skinny poems are a unique poetic form that follows a specific 11-line structure. 
              They begin and end with the same line (or a variation), use a repeated "anchor" word, 
              and focus on single words in the middle lines to create rhythm and meaning through repetition.
            </p>

            <p style={{ marginBottom: '24px' }}>
              This format encourages brevity and precision, making each word count while creating 
              a meditative, almost mantra-like quality through the repetition of the anchor word.
            </p>

            <div style={{
              background: isDarkMode ? 'rgba(180, 83, 9, 0.1)' : 'rgba(139, 125, 161, 0.05)',
              padding: '24px',
              borderRadius: '12px',
              border: `1px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.2)' : 'rgba(139, 125, 161, 0.1)'}`,
              marginBottom: '32px'
            }}>
              <p style={{
                fontSize: '1rem',
                color: getSecondaryTextColor(),
                fontStyle: 'italic',
                marginBottom: '16px'
              }}>
                Learn more about Skinny poems and their origins:
              </p>
              <motion.a
                href="https://theskinnypoetryjournal.wordpress.com/about/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: getSecondaryTextColor(),
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontFamily: "'Courier Prime', monospace",
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: isDarkMode ? 'rgba(180, 83, 9, 0.2)' : 'rgba(139, 125, 161, 0.1)',
                  border: `1px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.2)'}`,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode ? 'rgba(180, 83, 9, 0.2)' : 'rgba(139, 125, 161, 0.1)';
                }}
              >
                <ExternalLink size={16} />
                The Skinny Poetry Journal
              </motion.a>
            </div>

            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '16px',
              color: getTextColor(),
              fontFamily: "'EB Garamond', serif",
              fontWeight: 600
            }}>
              How It Works
            </h2>

            <ol style={{
              paddingLeft: '24px',
              marginBottom: '24px'
            }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>Choose a Whisper:</strong> Select from poetic interpretations of today's news headlines
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Pick an Anchor:</strong> Choose a word that will repeat throughout your poem
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Share Your Feeling:</strong> Optionally express what you're carrying today
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Receive Your Poem:</strong> Watch as AI crafts a Skinny poem from your choices
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Make It Yours:</strong> Edit and refine the poem to match your voice
              </li>
            </ol>

            <p style={{
              fontSize: '1rem',
              color: getSecondaryTextColor(),
              fontStyle: 'italic',
              textAlign: 'center',
              marginTop: '32px'
            }}>
              Thank you for joining us by the digital campfire.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;