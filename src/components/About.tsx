import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Sparkles, BookOpen } from 'lucide-react';

const About: React.FC = () => {
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
            background: `
              radial-gradient(circle at 30% 30%, rgba(254, 254, 254, 0.9) 0%, transparent 30%),
              radial-gradient(circle at 70% 70%, rgba(244, 194, 194, 0.7) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(139, 125, 161, 0.6) 0%, transparent 70%)
            `,
            borderRadius: '50%',
            margin: '0 auto 24px',
            boxShadow: '0 0 40px rgba(139, 125, 161, 0.3)'
          }} />
          
          <h1 style={{
            fontSize: '3rem',
            marginBottom: '16px',
            color: '#2D2D37',
            fontFamily: "'EB Garamond', serif",
            fontWeight: 400
          }}>
            About Digital Campfire
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            color: '#8B7DA1',
            fontStyle: 'italic',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            A space where strangers gather to transform the noise of the world into poetry
          </p>
        </motion.div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gap: '40px',
          marginBottom: '60px'
        }}>
          {/* What is Digital Campfire */}
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
              <Heart size={24} color="#8B7DA1" />
              <h2 style={{
                fontSize: '1.8rem',
                color: '#2D2D37',
                fontFamily: "'EB Garamond', serif",
                fontWeight: 500
              }}>
                What is Digital Campfire?
              </h2>
            </div>
            
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#2D2D37',
              marginBottom: '20px'
            }}>
              Digital Campfire is an experimental space where the day's news becomes the raw material for poetry. 
              We believe that in our overwhelming information age, there's profound value in slowing down, 
              reflecting, and transforming the noise into something more human.
            </p>
            
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#2D2D37'
            }}>
              Each day, we gather headlines from around the world and transform them into "whispers" — 
              poetic phrases that capture the emotional essence rather than the literal facts. 
              You choose a whisper that resonates, select an anchor word, and share what you're carrying. 
              Together, these elements become a Skinny poem.
            </p>
          </motion.section>

          {/* The Skinny Poem Form */}
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
              <BookOpen size={24} color="#8B7DA1" />
              <h2 style={{
                fontSize: '1.8rem',
                color: '#2D2D37',
                fontFamily: "'EB Garamond', serif",
                fontWeight: 500
              }}>
                The Skinny Poem
              </h2>
            </div>
            
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#2D2D37',
              marginBottom: '20px'
            }}>
              A Skinny poem is a specific 11-line form that creates meaning through repetition and constraint:
            </p>
            
            <div style={{
              background: 'rgba(139, 125, 161, 0.1)',
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontFamily: "'EB Garamond', serif",
              fontSize: '1rem',
              lineHeight: 1.6
            }}>
              <div style={{ marginBottom: '8px', fontStyle: 'italic', color: '#8B7DA1' }}>Structure:</div>
              <div>Line 1: The whisper (poetic phrase)</div>
              <div>Line 2: Your anchor word</div>
              <div>Lines 3-5: Single words building the image</div>
              <div>Line 6: Your anchor word (repeated)</div>
              <div>Lines 7-9: Single words continuing the image</div>
              <div>Line 10: Your anchor word (repeated)</div>
              <div>Line 11: The whisper (returned to)</div>
            </div>
            
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#2D2D37'
            }}>
              This form creates a meditative rhythm, where the anchor word becomes a heartbeat 
              that holds the poem together, and the whisper frames the entire emotional journey.
            </p>
          </motion.section>

          {/* Community & Sharing */}
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
              <Users size={24} color="#8B7DA1" />
              <h2 style={{
                fontSize: '1.8rem',
                color: '#2D2D37',
                fontFamily: "'EB Garamond', serif",
                fontWeight: 500
              }}>
                Sharing Your Light
              </h2>
            </div>
            
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#2D2D37',
              marginBottom: '20px'
            }}>
              When you "offer your spark" by sharing your poem with our community, it becomes part of 
              our growing archive — a collection of how people around the world are processing and 
              transforming the events of our time into personal meaning.
            </p>
            
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#2D2D37'
            }}>
              Each shared poem is anonymous but carries the date it was created, creating a poetic 
              record of our collective emotional landscape. Visit our archive to see how others have 
              transformed the same whispers into entirely different expressions of feeling.
            </p>
          </motion.section>

          {/* Philosophy */}
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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <Sparkles size={24} color="#8B7DA1" />
              <h2 style={{
                fontSize: '1.8rem',
                color: '#2D2D37',
                fontFamily: "'EB Garamond', serif",
                fontWeight: 500
              }}>
                Why We Gather
              </h2>
            </div>
            
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#2D2D37',
              marginBottom: '20px'
            }}>
              In a world of endless information, we often forget to pause and feel. Digital Campfire 
              creates a ritual of transformation — taking the external noise and making it internal, 
              personal, and ultimately healing.
            </p>
            
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#2D2D37'
            }}>
              We believe that poetry is not just art, but a technology for processing emotion and 
              finding meaning. By gathering around this digital fire, we practice the ancient human 
              tradition of storytelling, but adapted for our modern moment of information overload.
            </p>
          </motion.section>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
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
            Thank you for bringing your light to our circle
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;