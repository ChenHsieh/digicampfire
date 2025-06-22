import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Heart, RefreshCw, Search, Filter } from 'lucide-react';
import { getSharedPoems, type SharedPoem } from '../utils/database';

const Archive: React.FC = () => {
  const [poems, setPoems] = useState<SharedPoem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnchor, setSelectedAnchor] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    loadPoems();
  }, []);

  const loadPoems = async () => {
    setLoading(true);
    try {
      const sharedPoems = await getSharedPoems();
      setPoems(sharedPoems);
    } catch (error) {
      console.error('Error loading poems:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique anchor words for filter
  const uniqueAnchors = Array.from(new Set(poems.map(p => p.anchor))).sort();

  // Filter and sort poems
  const filteredPoems = poems
    .filter(poem => {
      const matchesSearch = searchTerm === '' || 
        poem.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poem.whisper.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poem.feeling?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAnchor = selectedAnchor === '' || poem.anchor === selectedAnchor;
      
      return matchesSearch && matchesAnchor;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
          maxWidth: '1000px',
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
            <Calendar size={32} color="#8B7DA1" />
          </div>
          
          <h1 style={{
            fontSize: '3rem',
            marginBottom: '16px',
            color: '#2D2D37',
            fontFamily: "'EB Garamond', serif",
            fontWeight: 400
          }}>
            Community Archive
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            color: '#8B7DA1',
            fontStyle: 'italic',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Sparks shared by fellow travelers around the digital campfire
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            background: 'rgba(254, 254, 254, 0.8)',
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid rgba(139, 125, 161, 0.15)',
            backdropFilter: 'blur(15px)',
            marginBottom: '40px'
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'end'
          }}>
            {/* Search */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                color: '#8B7DA1',
                marginBottom: '8px',
                fontFamily: "'Courier Prime', monospace",
                fontWeight: 500
              }}>
                Search poems
              </label>
              <div style={{ position: 'relative' }}>
                <Search 
                  size={16} 
                  color="#8B7DA1" 
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by content, whisper, or feeling..."
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    border: '1px solid rgba(139, 125, 161, 0.3)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    background: 'rgba(254, 254, 254, 0.9)',
                    color: '#2D2D37',
                    outline: 'none',
                    fontFamily: "'Courier Prime', monospace"
                  }}
                />
              </div>
            </div>

            {/* Anchor Filter */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                color: '#8B7DA1',
                marginBottom: '8px',
                fontFamily: "'Courier Prime', monospace",
                fontWeight: 500
              }}>
                Filter by anchor
              </label>
              <div style={{ position: 'relative' }}>
                <Filter 
                  size={16} 
                  color="#8B7DA1" 
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
                <select
                  value={selectedAnchor}
                  onChange={(e) => setSelectedAnchor(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    border: '1px solid rgba(139, 125, 161, 0.3)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    background: 'rgba(254, 254, 254, 0.9)',
                    color: '#2D2D37',
                    outline: 'none',
                    fontFamily: "'Courier Prime', monospace",
                    cursor: 'pointer'
                  }}
                >
                  <option value="">All anchors</option>
                  {uniqueAnchors.map(anchor => (
                    <option key={anchor} value={anchor}>{anchor}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                color: '#8B7DA1',
                marginBottom: '8px',
                fontFamily: "'Courier Prime', monospace",
                fontWeight: 500
              }}>
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(139, 125, 161, 0.3)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: 'rgba(254, 254, 254, 0.9)',
                  color: '#2D2D37',
                  outline: 'none',
                  fontFamily: "'Courier Prime', monospace",
                  cursor: 'pointer'
                }}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>

            {/* Refresh */}
            <motion.button
              onClick={loadPoems}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                background: 'rgba(139, 125, 161, 0.2)',
                border: '1px solid rgba(139, 125, 161, 0.3)',
                color: '#2D2D37',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                fontFamily: "'Courier Prime', monospace",
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center'
              }}
            >
              <RefreshCw 
                size={16} 
                style={{
                  animation: loading ? 'spin 1s linear infinite' : 'none'
                }}
              />
              Refresh
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{
            textAlign: 'center',
            padding: '16px 24px',
            background: 'rgba(254, 254, 254, 0.8)',
            borderRadius: '12px',
            border: '1px solid rgba(139, 125, 161, 0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 600,
              color: '#2D2D37',
              fontFamily: "'EB Garamond', serif"
            }}>
              {filteredPoems.length}
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#8B7DA1',
              fontFamily: "'Courier Prime', monospace"
            }}>
              {filteredPoems.length === 1 ? 'poem' : 'poems'} found
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '16px 24px',
            background: 'rgba(254, 254, 254, 0.8)',
            borderRadius: '12px',
            border: '1px solid rgba(139, 125, 161, 0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 600,
              color: '#2D2D37',
              fontFamily: "'EB Garamond', serif"
            }}>
              {uniqueAnchors.length}
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#8B7DA1',
              fontFamily: "'Courier Prime', monospace"
            }}>
              unique anchors
            </div>
          </div>
        </motion.div>

        {/* Poems Grid */}
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px',
            color: '#8B7DA1',
            fontSize: '1.1rem',
            fontStyle: 'italic'
          }}>
            <RefreshCw 
              size={24} 
              style={{
                animation: 'spin 1s linear infinite',
                marginRight: '12px'
              }}
            />
            Loading shared poems...
          </div>
        ) : filteredPoems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#8B7DA1',
              fontSize: '1.1rem',
              fontStyle: 'italic'
            }}
          >
            {poems.length === 0 ? (
              <>
                <Heart size={48} color="#8B7DA1" style={{ margin: '0 auto 20px', display: 'block' }} />
                No poems have been shared yet. Be the first to offer your spark!
              </>
            ) : (
              'No poems match your current filters. Try adjusting your search or filters.'
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '32px'
            }}
          >
            <AnimatePresence>
              {filteredPoems.map((poem, index) => (
                <motion.div
                  key={poem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  style={{
                    background: `
                      radial-gradient(circle at center, rgba(244, 194, 194, 0.08) 0%, transparent 70%),
                      rgba(254, 254, 254, 0.9)
                    `,
                    padding: '32px',
                    borderRadius: '20px',
                    border: '1px solid rgba(139, 125, 161, 0.15)',
                    backdropFilter: 'blur(15px)',
                    boxShadow: '0 8px 32px rgba(45, 45, 55, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Poem Text */}
                  <div style={{
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                    color: '#2D2D37',
                    whiteSpace: 'pre-wrap',
                    textAlign: 'center',
                    fontFamily: "'EB Garamond', serif",
                    marginBottom: '24px'
                  }}>
                    {poem.text}
                  </div>

                  {/* Metadata */}
                  <div style={{
                    borderTop: '1px solid rgba(139, 125, 161, 0.15)',
                    paddingTop: '20px',
                    display: 'grid',
                    gap: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.85rem',
                      color: '#8B7DA1'
                    }}>
                      <span style={{ fontFamily: "'Courier Prime', monospace" }}>
                        Anchor: <strong style={{ color: '#2D2D37' }}>{poem.anchor}</strong>
                      </span>
                      <span style={{ fontFamily: "'Courier Prime', monospace" }}>
                        {formatDate(poem.created_at)}
                      </span>
                    </div>

                    <div style={{
                      fontSize: '0.9rem',
                      color: '#8B7DA1',
                      fontStyle: 'italic',
                      fontFamily: "'EB Garamond', serif"
                    }}>
                      "{poem.whisper}"
                    </div>

                    {poem.feeling && (
                      <div style={{
                        fontSize: '0.85rem',
                        color: '#8B7DA1',
                        fontStyle: 'italic',
                        fontFamily: "'EB Garamond', serif",
                        background: 'rgba(139, 125, 161, 0.1)',
                        padding: '8px 12px',
                        borderRadius: '8px'
                      }}>
                        What they carried: "{poem.feeling}"
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          style={{
            textAlign: 'center',
            padding: '60px 0 40px',
            marginTop: '60px'
          }}
        >
          <p style={{
            fontSize: '1rem',
            color: '#8B7DA1',
            fontStyle: 'italic',
            fontFamily: "'EB Garamond', serif"
          }}>
            Each poem is a light in the darkness, shared by someone who chose to be vulnerable
          </p>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Archive;