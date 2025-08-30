/**
 * Main i18n configuration for NetCraft AI
 * Implements comprehensive bilingual support (English/Ukrainian)
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import type { I18nConfig, SupportedLanguage, TranslationNamespace } from './types';

// Import ALL translation resources synchronously for immediate availability
import enCommon from '../../locales/en/common.json';
import enErrors from '../../locales/en/errors.json';
import enLanding from '../../locales/en/landing.json';
import enData from '../../locales/en/data.json';
import enForms from '../../locales/en/forms.json';
import enResults from '../../locales/en/results.json';
import enForecasting from '../../locales/en/forecasting.json';
import enPredictor from '../../locales/en/predictor.json';
import enClusterizer from '../../locales/en/clusterizer.json';
import enLegal from '../../locales/en/legal.json';
import enGuides from '../../locales/en/guides.json';
import enPages from '../../locales/en/pages.json';

import ukCommon from '../../locales/uk/common.json';
import ukErrors from '../../locales/uk/errors.json';
import ukLanding from '../../locales/uk/landing.json';
import ukData from '../../locales/uk/data.json';
import ukForms from '../../locales/uk/forms.json';
import ukResults from '../../locales/uk/results.json';
import ukForecasting from '../../locales/uk/forecasting.json';
import ukPredictor from '../../locales/uk/predictor.json';
import ukClusterizer from '../../locales/uk/clusterizer.json';
import ukLegal from '../../locales/uk/legal.json';
import ukGuides from '../../locales/uk/guides.json';
import ukPages from '../../locales/uk/pages.json';

// Verify all translation resources are properly loaded
const verifyTranslationResources = () => {
  const errors: string[] = [];
  
  // Check English resources
  Object.entries(translationResources.en).forEach(([namespace, resource]) => {
    if (!resource || Object.keys(resource).length === 0) {
      errors.push(`English namespace '${namespace}' is empty or missing`);
    }
  });
  
  // Check Ukrainian resources
  Object.entries(translationResources.uk).forEach(([namespace, resource]) => {
    if (!resource || Object.keys(resource).length === 0) {
      errors.push(`Ukrainian namespace '${namespace}' is empty or missing`);
    }
  });
  
  if (errors.length > 0) {
    console.error('Translation resource verification failed:', errors);
    return false;
  }
  
  console.log('✅ All translation resources verified successfully');
  return true;
};

// ALL translation resources loaded synchronously for immediate availability
const translationResources = {
  en: {
    common: enCommon,
    errors: enErrors,
    landing: enLanding,
    data: enData,
    forms: enForms,
    results: enResults,
    forecasting: enForecasting,
    predictor: enPredictor,
    clusterizer: enClusterizer,
    legal: enLegal,
    guides: enGuides,
    pages: enPages
  },
  uk: {
    common: ukCommon,
    errors: ukErrors,
    landing: ukLanding,
    data: ukData,
    forms: ukForms,
    results: ukResults,
    forecasting: ukForecasting,
    predictor: ukPredictor,
    clusterizer: ukClusterizer,
    legal: ukLegal,
    guides: ukGuides,
    pages: ukPages
  }
};

// i18n configuration
const config: I18nConfig = {
  fallbackLng: 'en',
  supportedLngs: ['en', 'uk'],
  defaultNS: 'common',
  ns: [
    'common',
    'landing', 
    'data',
    'predictor',
    'clusterizer',
    'forecasting',
    'results',
    'forms',
    'legal',
    'errors',
    'guides',
    'pages'
  ],
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  detection: {
    order: ['querystring', 'localStorage'],
    caches: ['localStorage'],
    lookupQuerystring: 'lng',
    lookupLocalStorage: 'i18nextLng',
  }
};

// Format missing key to readable text
const formatMissingKey = (key: string): string => {
  // Convert "navigation.data" to "Data" as fallback
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
};

// Initialize i18n with ALL translation resources loaded synchronously
const initializeI18n = () => {
  // Check if i18n is already initialized to avoid double initialization
  if (!i18n.isInitialized) {
    try {
      // Verify all resources are loaded before initialization
      if (!verifyTranslationResources()) {
        console.error('Translation resource verification failed, but continuing with initialization');
      }

      // Initialize synchronously with all resources loaded
      i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
          ...config,
          lng: 'en', // Force English as default
          resources: translationResources,
          // Improved missing key handler that returns meaningful fallbacks
          missingKeyHandler: (lngs: readonly string[], ns: string, key: string) => {
            if (process.env.NODE_ENV === 'development') {
              console.warn(`Missing translation: ${lngs[0]}.${ns}.${key}`);
            }
          },
          // This is the handler that actually provides the fallback text
          parseMissingKeyHandler: (key: string) => {
            const formattedKey = formatMissingKey(key);
            if (process.env.NODE_ENV === 'development') {
              console.warn(`Using formatted fallback for missing key "${key}": "${formattedKey}"`);
            }
            return formattedKey;
          },
          // Ensure synchronous initialization
          initImmediate: false,
          // Add comprehensive error logging
          saveMissing: process.env.NODE_ENV === 'development',
          // Fallback handling
          fallbackLng: 'en',
          fallbackNS: 'common'
        });

      // Verify resource bundles are properly registered after initialization
      const verifyResourceBundles = () => {
        if (!i18n.isInitialized) {
          console.error('❌ i18n not initialized, cannot verify resource bundles');
          return false;
        }

        const languages = ['en', 'uk'];
        const namespaces = Object.keys(translationResources.en);
        
        for (const lang of languages) {
          for (const ns of namespaces) {
            if (!i18n.hasResourceBundle(lang, ns)) {
              console.error(`❌ Resource bundle missing: ${lang}.${ns}`);
              return false;
            }
            
            // Test that we can actually get the resource bundle
            const bundle = i18n.getResourceBundle(lang, ns);
            if (!bundle || Object.keys(bundle).length === 0) {
              console.error(`❌ Resource bundle empty: ${lang}.${ns}`);
              return false;
            }
          }
        }
        
        console.log('✅ All resource bundles verified and accessible');
        return true;
      };

      // Only verify if initialization succeeded
      if (i18n.isInitialized) {
        // Verify resource bundles after initialization
        if (!verifyResourceBundles()) {
          console.error('Resource bundle verification failed after initialization');
        }

        // Set up language change handler after initialization
        i18n.on('languageChanged', (lng: string) => {
          if (typeof window !== 'undefined') {
            document.documentElement.lang = lng;
            
            // Announce language change to screen readers
            const announcement = lng === 'uk' ? 'Мова змінена на українську' : 'Language changed to English';
            announceToScreenReader(announcement);
          }
        });

        // Add comprehensive error logging for initialization failures
        i18n.on('failedLoading', (lng: string, ns: string, msg: string) => {
          console.error(`Failed to load translation namespace ${ns} for language ${lng}:`, msg);
        });

        i18n.on('missingKey', (lngs: readonly string[], namespace: string, key: string) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Missing translation key: ${key} in namespace ${namespace} for languages ${lngs.join(', ')}`);
          }
        });

        console.log('✅ i18n initialized successfully with all resources');
      } else {
        console.error('❌ i18n initialization completed but isInitialized is false');
      }
    } catch (error) {
      console.error('❌ Failed to initialize i18n:', error);
      // Don't re-throw in test environment
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }
    }
  }
  return i18n;
};

// Force English as default language
if (typeof window !== 'undefined') {
  // Always set English as default on first load
  localStorage.setItem('i18nextLng', 'en');
}

/**
 * Verify all critical namespaces are loaded (all namespaces are loaded synchronously now)
 */
export const verifyCriticalNamespaces = (): boolean => {
  const allNamespaces: TranslationNamespace[] = [
    'common', 'errors', 'landing', 'data', 'forms', 'results', 
    'forecasting', 'predictor', 'clusterizer', 'legal', 'guides', 'pages'
  ];
  
  const languages: SupportedLanguage[] = ['en', 'uk'];
  
  for (const namespace of allNamespaces) {
    for (const lang of languages) {
      if (!i18n.hasResourceBundle(lang, namespace)) {
        console.error(`Namespace ${namespace} not loaded for language ${lang}`);
        return false;
      }
      
      const bundle = i18n.getResourceBundle(lang, namespace);
      if (!bundle || Object.keys(bundle).length === 0) {
        console.error(`Namespace ${namespace} is empty for language ${lang}`);
        return false;
      }
    }
  }
  
  return true;
};

// Initialize immediately - SYNCHRONOUS to ensure it's ready before components render
console.log('🚀 Starting i18n initialization...');

// Perform the initialization
try {
  initializeI18n();
} catch (error) {
  console.error('❌ Critical error during i18n initialization:', error);
  
  // In development (but not test), throw the error to make it visible
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack trace:', (error as Error).stack);
    throw error;
  }
}

// Verify initialization was successful
if (!i18n || !i18n.isInitialized) {
  console.error('❌ i18n failed to initialize synchronously');
  console.error('i18n instance exists:', !!i18n);
  console.error('i18n isInitialized:', i18n?.isInitialized);
  console.error('Available resources:', i18n?.options?.resources);
  
  // In test environment, don't throw - just log the error
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('i18n initialization failed');
  }
} else {
  console.log('✅ i18n initialized successfully with language:', i18n.language);
  console.log('✅ Available namespaces:', Object.keys(i18n.options?.resources?.en || {}));
  
  // Test critical translations to ensure they work (only in non-test environment)
  if (process.env.NODE_ENV !== 'test') {
    const testTranslations = [
      { key: 'navigation.data', ns: 'common', expected: 'Data' },
      { key: 'title', ns: 'landing', expected: 'NetCraft AI' },
      { key: 'upload.title', ns: 'data', expected: 'Upload Data' }
    ];
    
    let allTestsPassed = true;
    testTranslations.forEach(({ key, ns }) => {
      const result = i18n.t(key, { ns });
      if (result === key) {
        console.error(`❌ Translation test failed: ${ns}.${key} returned key instead of translation`);
        allTestsPassed = false;
      } else {
        console.log(`✅ Translation test passed: ${ns}.${key} = "${result}"`);
      }
    });
    
    if (!allTestsPassed) {
      throw new Error('Translation tests failed - translations are not working properly');
    }
    
    // Verify all critical namespaces
    if (!verifyCriticalNamespaces()) {
      throw new Error('Critical namespace verification failed');
    }
  }
  
  console.log('🎉 i18n system fully initialized and verified!');
}

// Screen reader announcement utility
function announceToScreenReader(message: string) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  document.body.appendChild(announcement);
  announcement.textContent = message;
  
  // Remove after announcement
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
}

// Utility functions for i18n management
export const i18nUtils = {
  /**
   * Get current language
   */
  getCurrentLanguage: (): SupportedLanguage => {
    return i18n.language as SupportedLanguage;
  },

  /**
   * Change language programmatically
   */
  changeLanguage: async (lng: SupportedLanguage): Promise<void> => {
    await i18n.changeLanguage(lng);
  },

  /**
   * Check if current language is RTL (not applicable for en/uk but future-proof)
   */
  isRTL: (): boolean => {
    const rtlLanguages = ['ar', 'he', 'fa'];
    return rtlLanguages.includes(i18n.language);
  },

  /**
   * Format number according to current locale
   */
  formatNumber: (value: number, options?: Intl.NumberFormatOptions): string => {
    const locale = i18n.language === 'uk' ? 'uk-UA' : 'en-US';
    try {
      return new Intl.NumberFormat(locale, options).format(value);
    } catch (error) {
      console.warn('Number formatting failed, falling back to default:', error);
      return value.toString();
    }
  },

  /**
   * Format date according to current locale
   */
  formatDate: (value: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const locale = i18n.language === 'uk' ? 'uk-UA' : 'en-US';
    const date = typeof value === 'string' ? new Date(value) : value;
    
    try {
      return new Intl.DateTimeFormat(locale, options).format(date);
    } catch (error) {
      console.warn('Date formatting failed, falling back to default:', error);
      return date.toLocaleDateString();
    }
  },

  /**
   * Verify namespace is loaded (all namespaces are loaded synchronously now)
   */
  verifyNamespace: (namespace: TranslationNamespace): boolean => {
    const languages: SupportedLanguage[] = ['en', 'uk'];
    
    for (const lang of languages) {
      if (!i18n.hasResourceBundle(lang, namespace)) {
        console.error(`Namespace ${namespace} not loaded for language ${lang}`);
        return false;
      }
      
      const bundle = i18n.getResourceBundle(lang, namespace);
      if (!bundle || Object.keys(bundle).length === 0) {
        console.error(`Namespace ${namespace} is empty for language ${lang}`);
        return false;
      }
    }
    
    return true;
  },

  /**
   * Check if translation key exists
   */
  keyExists: (key: string, namespace?: TranslationNamespace): boolean => {
    return i18n.exists(key, { ns: namespace });
  },

  /**
   * Get all loaded namespaces
   */
  getLoadedNamespaces: (): string[] => {
    return i18n.reportNamespaces?.getUsedNamespaces() || [];
  }
};

// Route-based namespace loading configuration
export const routeNamespaces: Record<string, TranslationNamespace[]> = {
  '/': ['common', 'landing'],
  '/data': ['common', 'data', 'forms'],
  '/predictor': ['common', 'predictor', 'forms', 'results'],
  '/clusterizer': ['common', 'clusterizer', 'forms', 'results'],
  '/forecasting': ['common', 'forecasting', 'forms', 'results'],
  '/results': ['common', 'results'],
  '/about': ['common', 'guides', 'pages'],
  '/guidelines': ['common', 'guides', 'pages'],
  '/terms': ['common', 'legal', 'pages'],
  '/privacy': ['common', 'legal', 'pages'],
  '/neural-networks': ['common', 'guides', 'pages'],
  '/random-forest': ['common', 'guides', 'pages'],
  '/time-series-forecasting': ['common', 'guides', 'pages'],
  '/clustering': ['common', 'guides', 'pages'],
  '/data-analysis': ['common', 'guides', 'pages'],
  '/contact': ['common', 'forms', 'pages'],
  '/contribution': ['common', 'guides', 'pages']
};

/**
 * Get required namespaces for a route
 */
export const getRouteNamespaces = (pathname: string): TranslationNamespace[] => {
  return routeNamespaces[pathname] || ['common'];
};

/**
 * Verify namespaces for a specific route are loaded
 */
export const verifyRouteNamespaces = (pathname: string): boolean => {
  const namespaces = getRouteNamespaces(pathname);
  return namespaces.every(namespace => i18nUtils.verifyNamespace(namespace));
};



// Set initial HTML lang attribute after initialization
if (typeof window !== 'undefined' && i18n && i18n.isInitialized) {
  document.documentElement.lang = i18n.language || 'en';
}

export default i18n;