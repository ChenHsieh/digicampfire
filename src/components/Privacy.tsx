import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Database, Lock } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import ThemedButton from './ThemedButton';

interface PrivacyProps {
  onNavigate: (page: 'landing' | 'display' | 'privacy' | 'about') => void;
  isDarkMode: boolean;
}

const Privacy: React.FC<PrivacyProps> = ({ onNavigate, isDarkMode }) => {
  const colors = useTheme(isDarkMode);

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px 24px 40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ maxWidth: '800px', width: '100%' }}
      >
        <ThemedButton
          onClick={() => onNavigate('landing')}
          isDarkMode={isDarkMode}
          variant="outline"
          icon={<ArrowLeft size={16} />}
          style={{
            marginBottom: '40px',
            marginLeft: '80px' // Add left margin to avoid nav bubble overlap
          }}
        >
          Back to campfire
        </ThemedButton>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            background: colors.background,
            padding: '48px',
            borderRadius: '20px',
            border: `1px solid ${colors.border}`,
            backdropFilter: 'blur(20px)',
            boxShadow: colors.glowShadow
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <Shield size={32} color={colors.primary} />
            <h1 style={{
              fontSize: '2.5rem',
              color: colors.text,
              fontWeight: 400,
              fontFamily: "'EB Garamond', serif"
            }}>
              Privacy Notice
            </h1>
          </div>

          <div style={{
            fontSize: '1.1rem',
            lineHeight: 1.7,
            color: colors.text,
            fontFamily: "'EB Garamond', serif"
          }}>
            <p style={{ marginBottom: '24px', fontStyle: 'italic', color: colors.primary }}>
              Your privacy is sacred to us. Here's how we protect the words you share by our digital fire.
            </p>

            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <Eye size={20} color="#22C55E" />
                <h2 style={{
                  fontSize: '1.4rem',
                  fontWeight: 500,
                  color: colors.text,
                  fontFamily: "'EB Garamond', serif"
                }}>
                  What We See
                </h2>
              </div>
              <p style={{ marginBottom: '16px' }}>
                When you create a poem, we temporarily process your whisper, anchor word, and feelings through OpenAI's API to generate your personalized verse. This happens in real-time and is not stored on our servers.
              </p>
              <p style={{ marginBottom: '16px' }}>
                We also fetch current news headlines from The Guardian's RSS feed to transform them into poetic whispers, but we don't track which headlines you choose.
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <Database size={20} color={colors.primary} />
                <h2 style={{
                  fontSize: '1.4rem',
                  fontWeight: 500,
                  color: colors.text,
                  fontFamily: "'EB Garamond', serif"
                }}>
                  What We Keep
                </h2>
              </div>
              <p style={{ marginBottom: '16px' }}>
                <strong>Nothing.</strong> Your poems, feelings, and personal expressions are not stored in any database. Each session is ephemeral—when you close the browser, your words return to the digital wind.
              </p>
              <p style={{ marginBottom: '16px' }}>
                We don't use cookies, tracking pixels, or analytics. No user accounts, no data collection, no digital footprints left behind.
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <Lock size={20} color="#22C55E" />
                <h2 style={{
                  fontSize: '1.4rem',
                  fontWeight: 500,
                  color: colors.text,
                  fontFamily: "'EB Garamond', serif"
                }}>
                  Third-Party Services
                </h2>
              </div>
              <p style={{ marginBottom: '16px' }}>
                We use OpenAI's API to generate poems. Your input is sent to OpenAI for processing but is not used to train their models (as per OpenAI's API data usage policy). The communication is encrypted and temporary.
              </p>
              <p style={{ marginBottom: '16px' }}>
                News headlines are fetched from The Guardian's public RSS feed through CORS proxies. No personal data is sent in these requests.
              </p>
            </div>

            <div style={{
              padding: '24px',
              background: `rgba(${isDarkMode ? '234, 88, 12' : '194, 65, 12'}, 0.1)`,
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              marginTop: '32px'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 500,
                color: colors.text,
                marginBottom: '12px',
                fontFamily: "'EB Garamond', serif"
              }}>
                Our Promise
              </h3>
              <p style={{ marginBottom: '0', fontStyle: 'italic' }}>
                Digital Campfire is a space for authentic expression without judgment or surveillance. 
                Your words are yours alone—we're simply the wind that carries them into poetry.
              </p>
            </div>

            <p style={{
              marginTop: '32px',
              fontSize: '0.9rem',
              color: colors.primary,
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              Last updated: January 2025
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Privacy;