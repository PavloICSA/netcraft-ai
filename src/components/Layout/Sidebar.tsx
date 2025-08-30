import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../Common/ThemeToggle';

/**
 * Navigation sidebar for the dashboard layout
 */
const Sidebar: React.FC = () => {
  const { t } = useTranslation('common');
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed to test

  const navigationItems = [
    {
      nameKey: 'navigation.data',
      path: '/data',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      nameKey: 'navigation.predictor',
      path: '/predictor',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      nameKey: 'navigation.clusterizer',
      path: '/clusterizer',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    {
      nameKey: 'navigation.forecasting',
      path: '/forecasting',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      nameKey: 'navigation.results',
      path: '/results',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const infoItems = [
    { 
      nameKey: 'navigation.guidelines', 
      path: '/guidelines',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      nameKey: 'navigation.about', 
      path: '/about',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      nameKey: 'navigation.contact', 
      path: '/contact',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const legalItems = [
    { 
      nameKey: 'navigation.terms', 
      path: '/terms',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      nameKey: 'navigation.privacy', 
      path: '/privacy',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0, width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3 }}
      className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 border-r border-secondary-200 dark:border-gray-700 flex flex-col h-screen`}
    >
      {/* Logo and Toggle */}
      <div className={`${isCollapsed ? 'p-3' : 'p-6'} border-b border-secondary-200 dark:border-gray-700 flex items-center ${isCollapsed ? 'flex-col space-y-2' : 'justify-between'}`}>
        {!isCollapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">NC</span>
            </div>
            <span className="text-xl font-bold text-secondary-900 dark:text-gray-100">NetCraft AI</span>
          </Link>
        )}
        {isCollapsed && (
          <Link to="/" className="flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">NC</span>
            </div>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg hover:bg-secondary-100 dark:hover:bg-gray-700 transition-colors duration-200 flex-shrink-0"
          aria-label={isCollapsed ? t('actions.expandSidebar') : t('actions.collapseSidebar')}
        >
          <svg className="w-5 h-5 text-secondary-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 ${isCollapsed ? 'p-2' : 'p-4'} space-y-1 overflow-y-auto`}>
        <div className={isCollapsed ? 'space-y-1' : 'mb-6'}>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-secondary-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              {t('navigation.analysis')}
            </h3>
          )}
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'space-x-3 px-3 py-2'} rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border-r-2 border-primary-500'
                  : 'text-secondary-600 dark:text-gray-400 hover:bg-secondary-100 dark:hover:bg-gray-700 hover:text-secondary-900 dark:hover:text-gray-100'
              }`}
              title={isCollapsed ? t(item.nameKey) : undefined}
            >
              {item.icon}
              {!isCollapsed && <span>{t(item.nameKey)}</span>}
            </Link>
          ))}
        </div>

        <div className={isCollapsed ? 'space-y-1' : 'mb-6'}>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-secondary-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              {t('navigation.information')}
            </h3>
          )}
          {infoItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'space-x-3 px-3 py-2'} rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border-r-2 border-primary-500'
                  : 'text-secondary-600 dark:text-gray-400 hover:bg-secondary-100 dark:hover:bg-gray-700 hover:text-secondary-900 dark:hover:text-gray-100'
              }`}
              title={isCollapsed ? t(item.nameKey) : undefined}
            >
              {item.icon}
              {!isCollapsed && <span>{t(item.nameKey)}</span>}
            </Link>
          ))}
        </div>

        <div className={isCollapsed ? 'space-y-1' : ''}>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-secondary-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              {t('navigation.legal')}
            </h3>
          )}
          {legalItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'space-x-3 px-3 py-2'} rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border-r-2 border-primary-500'
                  : 'text-secondary-600 dark:text-gray-400 hover:bg-secondary-100 dark:hover:bg-gray-700 hover:text-secondary-900 dark:hover:text-gray-100'
              }`}
              title={isCollapsed ? t(item.nameKey) : undefined}
            >
              {item.icon}
              {!isCollapsed && <span>{t(item.nameKey)}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-secondary-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="mb-3 flex justify-center">
              <ThemeToggle variant="sidebar" />
            </div>
          )}
          <div className="text-xs text-secondary-500 dark:text-gray-400 text-center">
            <p>NetCraft AI v1.0</p>
            <p className="mt-1">{t('layout.footer.copyright')}</p>
          </div>
        </div>
      )}
    </motion.aside>
  );
};

export default Sidebar;