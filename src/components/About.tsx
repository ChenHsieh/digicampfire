import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame, Heart, Sparkles, Users } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import ThemedButton from './ThemedButton';

interface AboutProps {
  onNavigate: (page: 'landing' | 'display' | 'privacy' | 'about') => void;
  isDarkMode: boolean;
}

const About: React.FC<AboutProps> = ({ onNavigate, isDarkMode }) => {
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
            <Flame size={32} color={colors.primary} />
            <h1 style={{
              fontSize: '2.5rem',
              color: colors.text,
              fontWeight: 400,
              fontFamily: "'EB Garamond', serif"
            }}>
              About Digital Campfire
            </h1>
          </div>

          <div style={{
            fontSize: '1.1rem',
            lineHeight: 1.7,
            color: colors.text,
            fontFamily: "'EB Garamond', serif"
          }}>
            <p style={{ marginBottom: '24px', fontStyle: 'italic', color: colors.primary, fontSize: '1.2rem' }}>
              "A space for strangers to sit by and share one line of feeling"
            </p>

            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <Heart size={20} color="#22C55E" />
                <h2 style={{
                  fontSize: '1.4rem',
                  fontWeight: 500,
                  color: colors.text,
                  fontFamily: "'EB Garamond', serif"
                }}>
                  What is Digital Campfire?
                </h2>
              </div>
              <p style={{ marginBottom: '16px' }}>
                Digital Campfire transforms the noise of today's world into moments of quiet reflection. 
                We take the headlines that flood our feeds and transform them into gentle whispers—
                starting points for your own emotional journey.
              </p>
              <p style={{ marginBottom: '16px' }}>
                Using the ancient art of poetry and modern AI, we help you create "Skinny poems"—
                a unique 11-line format that gives structure to feelings that often feel too big for words.
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <Sparkles size={20} color={colors.primary} />
                <h2 style={{
                  fontSize: '1.4rem',
                  fontWeight: 500,
                  color: colors.text,
                  fontFamily: "'EB Garamond', serif"
                }}>
                  The Skinny Poem Format
                </h2>
              </div>
              <p style={{ marginBottom: '16px' }}>
                A Skinny poem follows a specific structure: it begins and ends with the same whisper, 
                anchored by a word that appears three times throughout the piece. Between these anchors, 
                single words create a rhythm that mirrors the way feelings actually move through us—
                sometimes scattered, sometimes focused, always searching for meaning.
              </p>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                fontFamily: "'Courier Prime', monospace",
                fontSize: '0.95rem',
                lineHeight: 1.6,
                textAlign: 'center',
                marginTop: '16px'
              }}>
                <div style={{ color: colors.primary, marginBottom: '8px' }}>Example Structure:</div>
                <div>The weight of unspoken words</div>
                <div style={{ color: '#22C55E' }}>breathe</div>
                <div>silence</div>
                <div>holds</div>
                <div>what</div>
                <div style={{ color: '#22C55E' }}>breathe</div>
                <div>cannot</div>
                <div>say</div>
                <div>in</div>
                <div style={{ color: '#22C55E' }}>breathe</div>
                <div>The weight of unspoken words</div>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <Users size={20} color="#22C55E" />
                <h2 style={{
                  fontSize: '1.4rem',
                  fontWeight: 500,
                  color: colors.text,
                  fontFamily: "'EB Garamond', serif"
                }}>
                  Why We Built This
                </h2>
              </div>
              <p style={{ marginBottom: '16px' }}>
                In a world that moves too fast, where news cycles spin endlessly and emotions get buried 
                under the weight of information, we wanted to create a different kind of space. 
                A place where the day's events become doorways to inner reflection rather than sources of overwhelm.
              </p>
              <p style={{ marginBottom: '16px' }}>
                Digital Campfire is for anyone who has ever felt the need to pause, to process, 
                to transform the chaos of the external world into something more personal and meaningful. 
                It's for the moments when you need to sit with your feelings and give them shape.
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
                How to Use Digital Campfire
              </h3>
              <ol style={{ paddingLeft: '20px', marginBottom: '0' }}>
                <li style={{ marginBottom: '8px' }}>Choose a whisper that resonates with you from today's transformed headlines</li>
                <li style={{ marginBottom: '8px' }}>Select an anchor word that feels meaningful in this moment</li>
                <li style={{ marginBottom: '8px' }}>Share what you're carrying (or skip if you prefer)</li>
                <li style={{ marginBottom: '0' }}>Let the AI weave your inputs into a Skinny poem that's uniquely yours</li>
              </ol>
            </div>

            <div style={{
              textAlign: 'center',
              marginTop: '40px',
              padding: '24px',
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(34, 197, 94, 0.3)'
            }}>
              <p style={{
                fontSize: '1.1rem',
                fontStyle: 'italic',
                marginBottom: '16px',
                color: colors.text
              }}>
                "Poetry is not a luxury. It is a vital necessity of our existence."
              </p>
              <p style={{
                fontSize: '0.9rem',
                color: '#22C55E',
                marginBottom: '0'
              }}>
                — Audre Lorde
              </p>
            </div>

            <p style={{
              marginTop: '32px',
              fontSize: '0.9rem',
              color: colors.primary,
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              Built with care for moments of reflection • Powered by OpenAI • News from The Guardian
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;