import React from 'react';
import { useTranslation } from 'react-i18next';

interface LocaleNumberProps {
  value: number;
  options?: Intl.NumberFormatOptions;
  className?: string;
  fallback?: string;
}

const LocaleNumber: React.FC<LocaleNumberProps> = ({
  value,
  options = {},
  className = '',
  fallback = 'N/A'
}) => {
  const { i18n } = useTranslation();
  
  const formatNumber = (num: number, locale: string, formatOptions: Intl.NumberFormatOptions): string => {
    try {
      // Validate that the number is finite
      if (!Number.isFinite(num)) {
        return fallback;
      }
      
      // Create formatter with locale
      const formatter = new Intl.NumberFormat(locale, formatOptions);
      return formatter.format(num);
    } catch (error) {
      console.warn('Failed to format number:', error);
      // Fallback to English locale if current locale fails
      try {
        const fallbackFormatter = new Intl.NumberFormat('en-US', formatOptions);
        return fallbackFormatter.format(num);
      } catch (fallbackError) {
        console.error('Fallback number formatting failed:', fallbackError);
        return num.toString();
      }
    }
  };

  // Map i18n language codes to Intl locale codes
  const getLocale = (language: string): string => {
    switch (language) {
      case 'uk':
        return 'uk-UA';
      case 'en':
      default:
        return 'en-US';
    }
  };

  const locale = getLocale(i18n.language);
  const formattedNumber = formatNumber(value, locale, options);

  return (
    <span className={className} title={`${value}`}>
      {formattedNumber}
    </span>
  );
};

export default LocaleNumber;