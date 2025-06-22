import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

interface ThemedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  isDarkMode: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
  children,
  onClick,
  isDarkMode,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  style = {},
  icon,
  type = 'button'
}) => {
  const colors = useTheme(isDarkMode);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: `linear-gradient(135deg, ${isDarkMode ? '#2D2D37' : '#f1f5f9'} 0%, ${colors.primary} 100%)`,
          color: colors.text,
          border: 'none'
        };
      case 'secondary':
        return {
          background: `rgba(${isDarkMode ? '234, 88, 12' : '194, 65, 12'}, 0.15)`,
          color: colors.text,
          border: `1px solid ${colors.border}`
        };
      case 'outline':
        return {
          background: colors.background,
          color: colors.primary,
          border: `1px solid ${colors.border}`
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: '6px 12px',
          fontSize: '0.8rem',
          borderRadius: '16px'
        };
      case 'medium':
        return {
          padding: '8px 16px',
          fontSize: '0.9rem',
          borderRadius: '20px'
        };
      case 'large':
        return {
          padding: '12px 20px',
          fontSize: '1rem',
          borderRadius: '25px'
        };
      default:
        return {};
    }
  };

  const buttonStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: icon ? '8px' : '0',
    cursor: disabled ? 'not-allowed' : 'pointer',
    backdropFilter: 'blur(15px)',
    fontFamily: "'Courier Prime', monospace",
    fontWeight: 500,
    boxShadow: disabled ? 'none' : colors.shadow,
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.3s ease',
    ...getSizeStyles(),
    ...getVariantStyles(),
    ...style
  };

  return (
    <motion.button
      type={type}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={className}
      style={buttonStyles}
      disabled={disabled}
    >
      {icon && icon}
      {children}
    </motion.button>
  );
};

export default ThemedButton;