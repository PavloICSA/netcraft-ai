import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';

interface UseLocaleResult {
  currentLanguage: string;
  changeLanguage: (lng: string) => Promise<void>;
  isRTL: boolean;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (value: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  getLocaleCode: () => string;
  isLanguageSupported: (lng: string) => boolean;
}

const useLocale = (): UseLocaleResult => {
  const { i18n } = useTranslation();

  // Map i18n language codes to Intl locale codes
  const getLocaleCode = useCallback((): string => {
    switch (i18n.language) {
      case 'uk':
        return 'uk-UA';
      case 'en':
      default:
        return 'en-US';
    }
  }, [i18n.language]);

  // Check if language is supported
  const isLanguageSupported = useCallback((lng: string): boolean => {
    const supportedLanguages = ['en', 'uk'];
    return supportedLanguages.includes(lng);
  }, []);

  // Change language with error handling and side effects
  const changeLanguage = useCallback(async (lng: string): Promise<void> => {
    try {
      if (!isLanguageSupported(lng)) {
        console.warn(`Language ${lng} is not supported. Falling back to English.`);
        lng = 'en';
      }

      await i18n.changeLanguage(lng);
      
      // Update HTML lang attribute
      document.documentElement.lang = lng;
      
      // Store preference in localStorage
      localStorage.setItem('i18nextLng', lng);
      
      // Dispatch custom event for other components to listen to
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: lng, locale: getLocaleCode() } 
      }));
      
    } catch (error) {
      console.error('Failed to change language:', error);
      throw error;
    }
  }, [i18n, isLanguageSupported, getLocaleCode]);

  // Format number with current locale
  const formatNumber = useCallback((
    value: number, 
    options: Intl.NumberFormatOptions = {}
  ): string => {
    try {
      if (!Number.isFinite(value)) {
        return 'N/A';
      }
      
      const locale = getLocaleCode();
      const formatter = new Intl.NumberFormat(locale, options);
      return formatter.format(value);
    } catch (error) {
      console.warn('Failed to format number:', error);
      // Fallback to basic string conversion
      return value.toString();
    }
  }, [getLocaleCode]);

  // Format date with current locale
  const formatDate = useCallback((
    value: Date | string, 
    options: Intl.DateTimeFormatOptions = {}
  ): string => {
    try {
      const date = typeof value === 'string' ? new Date(value) : value;
      
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      const locale = getLocaleCode();
      const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options
      };
      
      const formatter = new Intl.DateTimeFormat(locale, defaultOptions);
      return formatter.format(date);
    } catch (error) {
      console.warn('Failed to format date:', error);
      return 'Invalid Date';
    }
  }, [getLocaleCode]);

  // Determine if current language is RTL (Right-to-Left)
  const isRTL = useMemo((): boolean => {
    // Ukrainian and English are both LTR languages
    // This could be extended for other languages in the future
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(i18n.language);
  }, [i18n.language]);

  return {
    currentLanguage: i18n.language,
    changeLanguage,
    isRTL,
    formatNumber,
    formatDate,
    getLocaleCode,
    isLanguageSupported
  };
};

export default useLocale;