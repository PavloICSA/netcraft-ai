import React from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'topbar' | 'footer' | 'standalone' | 'landing';
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className = '',
  showLabel = true,
  variant = 'standalone'
}) => {
  const { i18n, t } = useTranslation('common');
  const currentLanguage = i18n.language;

  const handleLanguageChange = async (newLanguage: string) => {
    try {
      await i18n.changeLanguage(newLanguage);
      
      // Update HTML lang attribute
      document.documentElement.lang = newLanguage;
      
      // Announce language change to screen readers
      const announcement = newLanguage === 'en' 
        ? 'Language changed to English' 
        : 'Мова змінена на українську';
      
      // Create temporary element for screen reader announcement
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.textContent = announcement;
      document.body.appendChild(announcer);
      
      // Remove announcement element after screen reader has time to read it
      setTimeout(() => {
        document.body.removeChild(announcer);
      }, 1000);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, language: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLanguageChange(language);
    }
  };

  const baseClasses = 'inline-flex items-center gap-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  
  const variantClasses = {
    topbar: 'px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700',
    footer: 'px-2 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-700',
    standalone: 'px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700',
    landing: 'px-3 py-2 text-sm'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {showLabel && (
        <span className="text-gray-700 dark:text-gray-300">
          Language:
        </span>
      )}
      
      <div className="flex items-center gap-1" role="group" aria-label="Language selection">
        <button
          type="button"
          onClick={() => handleLanguageChange('en')}
          onKeyDown={(e) => handleKeyDown(e, 'en')}
          aria-pressed={currentLanguage === 'en'}
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
            variant === 'landing'
              ? currentLanguage === 'en'
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-100 shadow-md hover:shadow-lg hover:scale-105'
              : currentLanguage === 'en'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow-sm'
          }`}
          aria-label="Switch to English"
        >
          EN
        </button>
        
        <button
          type="button"
          onClick={() => handleLanguageChange('uk')}
          onKeyDown={(e) => handleKeyDown(e, 'uk')}
          aria-pressed={currentLanguage === 'uk'}
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
            variant === 'landing'
              ? currentLanguage === 'uk'
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-100 shadow-md hover:shadow-lg hover:scale-105'
              : currentLanguage === 'uk'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow-sm'
          }`}
          aria-label="Switch to Ukrainian"
        >
          УК
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;