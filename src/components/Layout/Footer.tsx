import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../Common/LanguageToggle';
import ThemeToggle from '../Common/ThemeToggle';

/**
 * Simple footer component for the dashboard layout
 */
const Footer: React.FC = () => {
  const { t } = useTranslation('common');
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-secondary-200 dark:border-gray-700 px-6 py-4">
      <div className="flex justify-between items-center text-sm text-secondary-500 dark:text-gray-400">
        <div>
          <span>{t('layout.footer.copyright')}</span>
          <br />
          <span className="text-xs">{t('layout.footer.developedBy')}</span>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle variant="topbar" />
          <span>•</span>
          <LanguageToggle variant="footer" showLabel={true} />
          <span>•</span>
          <span>{t('layout.footer.version')}</span>
          <span>•</span>
          <Link to="/terms" className="hover:text-secondary-700 dark:hover:text-gray-200">{t('navigation.terms')}</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-secondary-700 dark:hover:text-gray-200">{t('navigation.privacy')}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;