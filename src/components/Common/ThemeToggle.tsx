import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface ThemeToggleProps {
  variant?: 'topbar' | 'sidebar' | 'standalone' | 'landing';
  showLabel?: boolean;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'standalone',
  showLabel = false,
  className = ''
}) => {
  const { theme, actualTheme, setTheme } = useTheme();
  const { t } = useTranslation('common');

  const handleThemeChange = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'dark') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    }
  };

  const getLabel = () => {
    if (theme === 'dark') {
      return t('theme.dark');
    } else {
      return t('theme.light');
    }
  };

  const getTooltip = () => {
    if (theme === 'light') {
      return t('theme.switchToDark');
    } else {
      return t('theme.switchToLight');
    }
  };

  const baseClasses = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800';
  
  const variantClasses = {
    topbar: 'p-2 text-secondary-600 dark:text-gray-400 hover:text-secondary-900 dark:text-gray-100 hover:bg-secondary-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700',
    sidebar: 'p-2 text-secondary-600 dark:text-gray-400 hover:text-secondary-900 dark:text-gray-100 hover:bg-secondary-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700',
    standalone: 'p-3 border border-secondary-300 text-secondary-600 dark:text-gray-400 hover:text-secondary-900 dark:text-gray-100 hover:bg-secondary-50 dark:border-gray-600 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700',
    landing: 'p-3 bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm border border-white/30 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/70 hover:text-gray-900 dark:hover:text-gray-100 shadow-lg hover:shadow-xl'
  };

  return (
    <motion.button
      onClick={handleThemeChange}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      title={getTooltip()}
      aria-label={getTooltip()}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {getIcon()}
      </motion.div>
      {showLabel && (
        <span className="ml-2 text-sm font-medium">
          {getLabel()}
        </span>
      )}
    </motion.button>
  );
};

export default ThemeToggle;