import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface PrivacyPageProps {
  onBack: () => void;
  isDarkMode: boolean;
  getTextColor: () => string;
  getSecondaryTextColor: () => string;
  getCardBackground: (isSelected?: boolean) => string;
  getCardBorder: (isSelected?: boolean) => string;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({
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
            fontWeight: 400,
            fontFamily: "'EB Garamond', serif",
            textAlign: 'center'
          }}>
            Privacy Policy
          </h1>

          <div style={{
            fontSize: '1.1rem',
            lineHeight: 1.7,
            color: getTextColor(),
            fontFamily: "'EB Garamond', serif"
          }}>
            <div style={{
              background: isDarkMode ? 'rgba(180, 83, 9, 0.1)' : 'rgba(139, 125, 161, 0.05)',
              padding: '24px',
              borderRadius: '12px',
              border: `1px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.2)' : 'rgba(139, 125, 161, 0.1)'}`,
              marginBottom: '32px'
            }}>
              <h2 style={{
                fontSize: '1.3rem',
                marginBottom: '16px',
                color: getTextColor(),
                fontFamily: "'EB Garamond', serif",
                fontWeight: 500
              }}>
                Your Privacy Matters
              </h2>
              <p style={{
                fontSize: '1rem',
                color: getSecondaryTextColor(),
                fontStyle: 'italic',
                marginBottom: '0'
              }}>
                We believe in transparency about how your data is handled when you use Digital Campfire.
              </p>
            </div>

            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '16px',
              marginTop: '32px',
              color: getTextColor(),
              fontFamily: "'EB Garamond', serif",
              fontWeight: 500
            }}>
              Data Storage
            </h2>

            <p style={{ marginBottom: '24px' }}>
              <strong>We do not store your personal input.</strong> Everything you type into Digital Campfire—your 
              selected whispers, anchor words, feelings, and any edits you make to your poems—stays on your device 
              and is not saved to our servers.
            </p>

            <p style={{ marginBottom: '24px' }}>
              The only data we store locally on your device are your preferences for dark/light mode and 
              sound on/off settings, which are saved in your browser's local storage to enhance your experience 
              across visits.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '16px',
              marginTop: '32px',
              color: getTextColor(),
              fontFamily: "'EB Garamond', serif",
              fontWeight: 500
            }}>
              AI Processing
            </h2>

            <p style={{ marginBottom: '24px' }}>
              Digital Campfire uses OpenAI's API to transform news headlines into poetic phrases and to generate 
              your personalized Skinny poems. When you use our service:
            </p>

            <ul style={{
              paddingLeft: '24px',
              marginBottom: '24px'
            }}>
              <li style={{ marginBottom: '12px' }}>
                Your inputs (whispers, anchor words, feelings) are sent to OpenAI's servers for processing
              </li>
              <li style={{ marginBottom: '12px' }}>
                This processing follows OpenAI's standard data usage policies
              </li>
              <li style={{ marginBottom: '12px' }}>
                The generated poems are returned to your browser and not stored by us
              </li>
            </ul>

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
                For detailed information about OpenAI's data handling practices:
              </p>
              <motion.a
                href="https://openai.com/privacy/"
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
                OpenAI Privacy Policy
              </motion.a>
            </div>

            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '16px',
              marginTop: '32px',
              color: getTextColor(),
              fontFamily: "'EB Garamond', serif",
              fontWeight: 500
            }}>
              News Sources
            </h2>

            <p style={{ marginBottom: '24px' }}>
              We fetch news headlines from The Guardian's RSS feed to create the "whispers" you can choose from. 
              This helps ensure you're working with current, real-world content as the starting point for your creative process.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '16px',
              marginTop: '32px',
              color: getTextColor(),
              fontFamily: "'EB Garamond', serif",
              fontWeight: 500
            }}>
              Sharing Your Poems
            </h2>

            <p style={{ marginBottom: '24px' }}>
              When you choose to share your poem using our sharing features (copy to clipboard or email), 
              you have full control over where and how your poem is shared. We don't track or store any 
              information about your sharing activities.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '16px',
              marginTop: '32px',
              color: getTextColor(),
              fontFamily: "'EB Garamond', serif",
              fontWeight: 500
            }}>
              Questions?
            </h2>

            <p style={{ marginBottom: '24px' }}>
              If you have any questions about how your data is handled or about this privacy policy, 
              please feel free to reach out. We believe in keeping things simple and transparent.
            </p>

            <p style={{
              fontSize: '1rem',
              color: getSecondaryTextColor(),
              fontStyle: 'italic',
              textAlign: 'center',
              marginTop: '32px'
            }}>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;