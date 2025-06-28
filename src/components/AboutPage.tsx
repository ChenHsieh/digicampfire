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
  // Color scheme for the poem structure visualization
  const getWhisperColor = () => isDarkMode ? '#FFC880' : '#8B7DA1';
  const getAnchorColor = () => isDarkMode ? '#FB923C' : '#6366F1';
  const getSingleWordColor = () => isDarkMode ? '#A3A3A3' : '#6B7280';
  const getLineNumberColor = () => isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';

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

            <p style={{ marginBottom: '32px' }}>
              This format encourages brevity and precision, making each word count while creating 
              a meditative, almost mantra-like quality through the repetition of the anchor word.
            </p>

            {/* Skinny Poem Structure Visualization */}
            <div style={{
              background: isDarkMode ? 'rgba(28, 25, 23, 0.6)' : 'rgba(254, 254, 254, 0.8)',
              padding: '32px',
              borderRadius: '16px',
              border: `2px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.3)' : 'rgba(139, 125, 161, 0.2)'}`,
              marginBottom: '32px'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                marginBottom: '24px',
                color: getTextColor(),
                fontFamily: "'EB Garamond', serif",
                fontWeight: 600,
                textAlign: 'center'
              }}>
                The Structure of a Skinny Poem
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Example Poem */}
                <div>
                  <h4 style={{
                    fontSize: '1.1rem',
                    marginBottom: '16px',
                    color: getSecondaryTextColor(),
                    fontFamily: "'Courier Prime', monospace",
                    fontWeight: 600
                  }}>
                    Example Poem:
                  </h4>
                  
                  <div style={{
                    background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: `1px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.2)' : 'rgba(139, 125, 161, 0.15)'}`,
                    fontFamily: "'EB Garamond', serif",
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    textAlign: 'center'
                  }}>
                    {[
                      { text: "The weight of unspoken words", type: "whisper", line: 1 },
                      { text: "breathe", type: "anchor", line: 2 },
                      { text: "silence", type: "single", line: 3 },
                      { text: "holds", type: "single", line: 4 },
                      { text: "what", type: "single", line: 5 },
                      { text: "breathe", type: "anchor", line: 6 },
                      { text: "cannot", type: "single", line: 7 },
                      { text: "say", type: "single", line: 8 },
                      { text: "yet", type: "single", line: 9 },
                      { text: "breathe", type: "anchor", line: 10 },
                      { text: "The weight of unspoken words", type: "whisper", line: 11 }
                    ].map((item, index) => (
                      <div key={index} style={{
                        marginBottom: '8px',
                        color: item.type === 'whisper' ? getWhisperColor() : 
                               item.type === 'anchor' ? getAnchorColor() : 
                               getSingleWordColor(),
                        fontWeight: item.type === 'anchor' ? 600 : 
                                   item.type === 'whisper' ? 500 : 400,
                        fontStyle: item.type === 'whisper' ? 'italic' : 'normal'
                      }}>
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Structure Explanation */}
                <div>
                  <h4 style={{
                    fontSize: '1.1rem',
                    marginBottom: '16px',
                    color: getSecondaryTextColor(),
                    fontFamily: "'Courier Prime', monospace",
                    fontWeight: 600
                  }}>
                    Structure Breakdown:
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Whisper Lines */}
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: isDarkMode ? 'rgba(255, 200, 128, 0.1)' : 'rgba(139, 125, 161, 0.1)',
                      border: `1px solid ${getWhisperColor()}40`
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: getWhisperColor()
                        }} />
                        <span style={{
                          fontFamily: "'Courier Prime', monospace",
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: getWhisperColor()
                        }}>
                          Whisper Lines
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        color: getTextColor(),
                        paddingLeft: '20px'
                      }}>
                        Lines 1 & 11 - Same phrase or variation
                      </div>
                    </div>

                    {/* Anchor Lines */}
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: isDarkMode ? 'rgba(251, 146, 60, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                      border: `1px solid ${getAnchorColor()}40`
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: getAnchorColor()
                        }} />
                        <span style={{
                          fontFamily: "'Courier Prime', monospace",
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: getAnchorColor()
                        }}>
                          Anchor Word
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        color: getTextColor(),
                        paddingLeft: '20px'
                      }}>
                        Lines 2, 6, 10 - Same word repeated
                      </div>
                    </div>

                    {/* Single Word Lines */}
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: isDarkMode ? 'rgba(163, 163, 163, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                      border: `1px solid ${getSingleWordColor()}40`
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: getSingleWordColor()
                        }} />
                        <span style={{
                          fontFamily: "'Courier Prime', monospace",
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: getSingleWordColor()
                        }}>
                          Single Words
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        color: getTextColor(),
                        paddingLeft: '20px'
                      }}>
                        Lines 3, 4, 5, 7, 8, 9 - One word each
                      </div>
                    </div>
                  </div>

                  <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    background: isDarkMode ? 'rgba(180, 83, 9, 0.1)' : 'rgba(139, 125, 161, 0.05)',
                    borderRadius: '8px',
                    border: `1px solid ${isDarkMode ? 'rgba(180, 83, 9, 0.2)' : 'rgba(139, 125, 161, 0.1)'}`
                  }}>
                    <div style={{
                      fontSize: '0.9rem',
                      color: getSecondaryTextColor(),
                      fontStyle: 'italic',
                      textAlign: 'center'
                    }}>
                      The repetition creates rhythm and meditation,<br />
                      while the single words build meaning through simplicity.
                    </div>
                  </div>
                </div>
              </div>
            </div>

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