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
            
            <div style={{
              background: 'rgba(139, 125, 161, 0.1)',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <p style={{
                fontSize: '1.1rem',
                color: '#2D2D37',
                fontWeight: 500,
                marginBottom: '8px'
              }}>
                We collect NOTHING.
              </p>
              <p style={{
                fontSize: '1rem',
                color: '#2D2D37',
                lineHeight: 1.6
              }}>
                Digital Campfire is a completely client-side application. Your poems, feelings, 
                and creative expressions never leave your browser. Nothing is stored on our servers, 
                and no personal data is collected or transmitted.
              </p>
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
                <li>Your poem exists only in your browser's memory</li>
                <li>When you close the tab or navigate away, it's gone forever</li>
                <li>No data is sent to any server or database</li>
                <li>Your creative process is completely private</li>
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
                External Services:
              </h3>
              <ul style={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: '#2D2D37',
                paddingLeft: '20px'
              }}>
                <li>We use OpenAI's API to help generate poems (your inputs are processed but not stored by us)</li>
                <li>We fetch news headlines from The Guardian's public RSS feed</li>
                <li>These services have their own privacy policies</li>
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
            
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#2D2D37',
              marginBottom: '20px'
            }}>
              Since we don't collect or store any data, there's nothing for us to use! 
              Your creative process is entirely yours:
            </p>

            <ul style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#2D2D37',
              paddingLeft: '20px',
              marginBottom: '20px'
            }}>
              <li>Your poems remain in your browser only</li>
              <li>You control what happens to your creations</li>
              <li>You can copy, share, or save them yourself</li>
              <li>We have no access to your personal expressions</li>
            </ul>
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
                Data Security
              </h2>
            </div>
            
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#2D2D37',
              marginBottom: '20px'
            }}>
              The most secure data is data that doesn't exist on servers. Since Digital Campfire 
              operates entirely in your browser, your creative expressions are as secure as your 
              own device.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '1.3rem',
                color: '#2D2D37',
                fontFamily: "'EB Garamond', serif",
                fontWeight: 500,
                marginBottom: '12px'
              }}>
                What This Means:
              </h3>
              <ul style={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: '#2D2D37',
                paddingLeft: '20px'
              }}>
                <li>No data breaches possible (we have no data to breach)</li>
                <li>No unauthorized access to your poems</li>
                <li>No government or third-party data requests</li>
                <li>Complete creative privacy</li>
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
              Since we don't collect personal data, traditional data rights don't apply. 
              Instead, you have something better: complete control.
            </p>

            <ul style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#2D2D37',
              paddingLeft: '20px',
              marginBottom: '20px'
            }}>
              <li>You own your poems completely</li>
              <li>You decide what to do with them</li>
              <li>You can use the app without any account or registration</li>
              <li>Your creative process is entirely anonymous</li>
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
                If you have questions about this privacy statement or our practices, 
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
              updated "last modified" date. Since we don't collect contact information, 
              we encourage you to check this page periodically.
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
            Your privacy is absolute here
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Privacy;