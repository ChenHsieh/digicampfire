import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Info, Shield } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  // Don't show navigation on the main app pages
  if (location.pathname === '/') {
    return null;
  }

  const navItems = [
    { path: '/', label: 'Campfire', icon: Home },
    { path: '/about', label: 'About', icon: Info },
    { path: '/privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        display: 'flex',
        gap: '8px',
        background: 'rgba(254, 254, 254, 0.9)',
        padding: '8px',
        borderRadius: '20px',
        border: '1px solid rgba(139, 125, 161, 0.2)',
        backdropFilter: 'blur(15px)',
        boxShadow: '0 4px 20px rgba(45, 45, 55, 0.1)'
      }}
    >
      {navItems.map(({ path, label, icon: Icon }) => (
        <Link
          key={path}
          to={path}
          style={{ textDecoration: 'none' }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '12px',
              background: location.pathname === path ? 
                'rgba(139, 125, 161, 0.2)' : 
                'transparent',
              color: location.pathname === path ? '#2D2D37' : '#8B7DA1',
              fontSize: '0.85rem',
              fontFamily: "'Courier Prime', monospace",
              fontWeight: 500,
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            <Icon size={14} />
            <span>{label}</span>
          </motion.div>
        </Link>
      ))}
    </motion.nav>
  );
};

export default Navigation;