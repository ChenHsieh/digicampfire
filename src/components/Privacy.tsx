import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Database, Lock } from 'lucide-react';
import Navigation from './Navigation';

interface PrivacyProps {
  onNavigate: (page: 'landing' | 'display' | 'privacy' | 'about') => void;
}

const Privacy: React.FC<PrivacyProps> = ({ onNavigate }) => {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px 24px 120px',
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
        <motion.button
          onClick={() => onNavigate('landing')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#EA580C',
            fontSize: '0.9rem',
            padding: '8px 16px',
            borderRadius: '20px',
            marginBottom: '40px',
            background: 'rgba(229, 229, 229, 0.08)',
            border: '1px solid rgba(234, 88, 12, 0.3)',
            cursor: 'pointer',
            backdropFilter: 'blur(15px)',
            fontFamily: "'Courier Prime', monospace",
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(234, 88, 12, 0.1)'
          }}
        >
          <ArrowLeft size={16} />
          Back to campfire
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            background: 'rgba(229, 229, 229, 0.05)',
            padding: '48px',
            borderRadius: '20px',
            border: '1px solid rgba(234, 88, 12, 0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(234, 88, 12, 0.1)'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <Shield size={32} color="#EA580C" />
            <h1 style={{
              fontSize: '2.5rem',
              color: '#E5E5E5',
              fontWeight: 400,
              fontFamily: "'EB Garamond', serif"
            }}>
              Privacy Notice
            </h1>
          </div>

          <div style={{
            fontSize: '1.1rem',
            lineHeight: 1.7,
            color: '#E5E5E5',
            fontFamily: "'EB Garamond', serif"
          }}>
            <p style={{ marginBottom: '24px', fontStyle: 'italic', color: '#EA580C' }}>
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
                  color: '#E5E5E5',
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
                <Database size={20} color="#EA580C" />
                <h2 style={{
                  fontSize: '1.4rem',
                  fontWeight: 500,
                  color: '#E5E5E5',
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
                  color: '#E5E5E5',
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
              background: 'rgba(234, 88, 12, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(234, 88, 12, 0.3)',
              marginTop: '32px'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 500,
                color: '#E5E5E5',
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
              color: '#EA580C',
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              Last updated: January 2025
            </p>
          </div>
        </motion.div>
      </motion.div>

      <Navigation currentPage="privacy" onNavigate={onNavigate} />
    </div>
  );
};

export default Privacy;