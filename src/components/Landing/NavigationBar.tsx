import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../Common/ThemeToggle';
import LanguageToggle from '../Common/LanguageToggle';

/**
 * Beautiful navigation bar with animated buttons for About, Guidelines, and Contact
 */
const NavigationBar: React.FC = () => {
  const { t } = useTranslation('common');
  
  const navItems = [
    {
      name: t('navigation.about'),
      path: '/about',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-purple-600',
      hoverGradient: 'from-blue-600 to-purple-700',
      shadowColor: 'blue-500/25'
    },
    {
      name: t('navigation.guidelines'),
      path: '/guidelines',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-teal-600',
      hoverGradient: 'from-emerald-600 to-teal-700',
      shadowColor: 'emerald-500/25'
    },
    {
      name: t('navigation.contact'),
      path: '/contact',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-violet-500 to-indigo-600',
      hoverGradient: 'from-violet-600 to-indigo-700',
      shadowColor: 'violet-500/25'
    }
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative py-6"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Theme Toggle at the top */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <ThemeToggle variant="landing" />
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          {/* Language toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 md:mb-0"
          >
            <LanguageToggle variant="landing" showLabel={false} />
          </motion.div>
          
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Link
                to={item.path}
                className={`group relative inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${item.gradient} hover:${item.hoverGradient} text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-${item.shadowColor} transform hover:scale-105 hover:-translate-y-1 overflow-hidden`}
              >
                {/* Background glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-full blur-md`}></div>
                
                {/* Animated shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
                
                {/* Content */}
                <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </span>
                <span className="relative z-10 text-sm md:text-base font-medium">
                  {item.name}
                </span>
                
                {/* Ripple effect on hover */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-24 h-0.5 bg-gradient-to-r from-transparent via-primary-400/60 dark:via-primary-500/40 to-transparent"></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-0.5 bg-gradient-to-r from-transparent via-accent-400/60 dark:via-accent-500/40 to-transparent"></div>
      </div>
    </motion.nav>
  );
};

export default NavigationBar;