import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Database, Eye, Lock } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '120px 24px 80px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          maxWidth: '800px',
          width: '100%'
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}
        >
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(139, 125, 161, 0.2)',
            borderRadius: '50%',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(139, 125, 161, 0.3)'
          }}>
            <Shield size={32} color="#8B7DA1" />
          </div>
          
          <h1 style={{
            fontSize: '3rem',
            marginBottom: '16px',
            color: '#2D2D37',
            fontFamily: "'EB Garamond', serif",
            fontWeight: 400
          }}>
            Privacy Statement
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            color: '#8B7DA1',
            fontStyle: 'italic',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            How we handle your creative expressions and personal data
          </p>
        </motion.div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gap: '40px',
          marginBottom: '60px'
        }}>
          {/* What We Collect */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              background: 'rgba(254, 254, 254, 0.8)',
              padding: '40px',
              borderRadius: '20px',
              border: '1px solid rgba(139, 125, 161, 0.15)',
              backdropFilter: 'blur(15px)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <Database size={24} color="#8B7DA1" />
              <h2 style={{
                fontSize: '1.8rem',
                color: '#2D2D37',
                fontFamily: "'EB Garamond', serif",
                fontWeight: 500
              }}>
                What We Collect
              </h2>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '1.3rem',
                color: '#2D2D37',
                fontFamily: "'EB Garamond', serif",
                fontWeight: 500,
                marginBottom: '12px'
              }}>
                When You Create a Poem:
              </h3>
              <ul style={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: '#2D2D37',
                paddingLeft: '20px'
              }}>
                <li>Your selected whisper (transformed news headline)</li>
                <li>Your chosen anchor word</li>
                <li>Your feeling/emotion input (optional)</li>
                <li>The generated poem text</li>
                <li>Creation timestamp</li>
              </ul>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '1.3rem',
                color: '#2D2D37',
                fontFamily: "'EB Garamond', serif",
                fontWeight: 500,
                marginBottom: '12px'
              }}>
                When You Share Your Poem:
              </h3>
              <ul style={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: '#2D2D37',
                paddingLeft: '20px'
              }}>
                <li>All poem creation data (as above)</li>
                <li>Sharing timestamp</li>
                <li>Anonymous identifier (no personal information)</li>
              </ul>
            </div>

            <div style={{
              background: 'rgba(139, 125, 161, 0.1)',
              padding: '20px',
              borderRadius: '12px',
              marginTop: '20px'
            }}>
              <p style={{
                fontSize: '1rem',
                color: '#2D2D37',
                fontWeight: 500,
                marginBottom: '8px'
              }}>
                Important: We do NOT collect:
              </p>
              <ul style={{
                fontSize: '1rem',
                color: '#2D2D37',
                paddingLeft: '20px'
              }}>
                <li>Names, email addresses, or contact information</li>
                <li>IP addresses or location data</li>
                <li>Device information or browser fingerprints</li>
                <li>Any personally identifiable information</li>
              </ul>
            </div>
          </motion.section>

          {/* How We Use Your Data */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              background: 'rgba(254, 254, 254, 0.8)',
              padding: '40px',
              borderRadius: '20px',
              border: '1px solid rgba(139, 125, 161, 0.15)',
              backdropFilter: 'blur(15px)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <Eye size={24} color="#8B7DA1" />
              <h2 style={{
                fontSize: '1.8rem',
                color: '#2D2D37',
                fontFamily: "'EB Garamond', serif",
                fontWeight: 500
              }}>
                How We Use Your Data
              </h2>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '1.3rem',
                color: '#2D2D37',
                fontFamily: "'EB Garamond', serif",
                fontWeight: 500,
                marginBottom: '12px'
              }}>
                Shared Poems:
              </h3>
              <ul style={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: '#2D2D37',
                paddingLeft: '20px'
              }}>
                <li>Display in our public archive for others to read and find inspiration</li>
                <li>Create a collective record of how people process current events through poetry</li>
                <li>Analyze patterns in emotional responses to world events (anonymously)</li>
              </ul>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '1.3rem',
                color: '#2D2D37',
                fontFamily: "'EB Garamond', serif",
                fontWeight: 500,
                marginBottom: '12px'
              }}>
                Private Poems:
              </h3>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: '#2D2D37'
              }}>
                Poems you create but don't share are not stored on our servers. They exist only 
                in your browser session and are lost when you close the page or navigate away.
              </p>
            </div>
          </motion.section>

          {/* Data Security */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{
              background: 'rgba(254, 254, 254, 0.8)',
              padding: '40px',
              borderRadius: '20px',
              border: '1px solid rgba(139, 125, 161, 0.15)',
              backdropFilter: 'blur(15px)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <Lock size={24} color="#8B7DA1" />
              <h2 style={{
                fontSize: '1.8rem',
                color: '#2D2D37',
                fontFamily: "'EB Garamond', serif",
                fontWeight: 500
              }}>
                Data Security & Storage
              </h2>
            </div>
            
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#2D2D37',
              marginBottom: '20px'
            }}>
              Your shared poems are stored securely using Supabase, a trusted database platform 
              with enterprise-grade security. All data is encrypted in transit and at rest.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '1.3rem',
                color: '#2D2D37',
                fontFamily: "'EB Garamond', serif",
                fontWeight: 500,
                marginBottom: '12px'
              }}>
                Data Retention:
              </h3>
              <ul style={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: '#2D2D37',
                paddingLeft: '20px'
              }}>
                <li>Shared poems are stored indefinitely as part of our community archive</li>
                <li>We may periodically remove very old entries to maintain performance</li>
                <li>No personal data is retained beyond the poem content and timestamps</li>
              </ul>
            </div>
          </motion.section>

          {/* Your Rights */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            style={{
              background: 'rgba(254, 254, 254, 0.8)',
              padding: '40px',
              borderRadius: '20px',
              border: '1px solid rgba(139, 125, 161, 0.15)',
              backdropFilter: 'blur(15px)'
            }}
          >
            <h2 style={{
              fontSize: '1.8rem',
              color: '#2D2D37',
              fontFamily: "'EB Garamond', serif",
              fontWeight: 500,
              marginBottom: '24px'
            }}>
              Your Rights & Choices
            </h2>
            
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#2D2D37',
              marginBottom: '20px'
            }}>
              Since we don't collect personal information, traditional data rights (like access or 
              deletion requests) don't apply in the usual way. However:
            </p>

            <ul style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#2D2D37',
              paddingLeft: '20px',
              marginBottom: '20px'
            }}>
              <li>You can choose not to share your poems (they won't be stored)</li>
              <li>Shared poems are anonymous and cannot be traced back to you</li>
              <li>You can contact us if you have concerns about specific content</li>
            </ul>

            <div style={{
              background: 'rgba(139, 125, 161, 0.1)',
              padding: '20px',
              borderRadius: '12px'
            }}>
              <p style={{
                fontSize: '1rem',
                color: '#2D2D37',
                fontWeight: 500,
                marginBottom: '8px'
              }}>
                Contact Us:
              </p>
              <p style={{
                fontSize: '1rem',
                color: '#2D2D37'
              }}>
                If you have questions about this privacy statement or our data practices, 
                please reach out through our contact form or email us directly.
              </p>
            </div>
          </motion.section>

          {/* Updates */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            style={{
              background: 'rgba(254, 254, 254, 0.8)',
              padding: '40px',
              borderRadius: '20px',
              border: '1px solid rgba(139, 125, 161, 0.15)',
              backdropFilter: 'blur(15px)'
            }}
          >
            <h2 style={{
              fontSize: '1.8rem',
              color: '#2D2D37',
              fontFamily: "'EB Garamond', serif",
              fontWeight: 500,
              marginBottom: '24px'
            }}>
              Updates to This Statement
            </h2>
            
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#2D2D37'
            }}>
              We may update this privacy statement from time to time to reflect changes in our 
              practices or for legal reasons. Any changes will be posted on this page with an 
              updated "last modified" date. We encourage you to review this statement periodically.
            </p>

            <p style={{
              fontSize: '0.9rem',
              color: '#8B7DA1',
              fontStyle: 'italic',
              marginTop: '20px'
            }}>
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </motion.section>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          style={{
            textAlign: 'center',
            padding: '40px 0'
          }}
        >
          <p style={{
            fontSize: '1rem',
            color: '#8B7DA1',
            fontStyle: 'italic',
            fontFamily: "'EB Garamond', serif"
          }}>
            Your trust is sacred to us
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Privacy;