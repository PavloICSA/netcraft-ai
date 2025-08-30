import React from 'react';
import { useTranslation } from 'react-i18next';

interface LocaleDateProps {
  value: Date | string;
  options?: Intl.DateTimeFormatOptions;
  className?: string;
  fallback?: string;
}

const LocaleDate: React.FC<LocaleDateProps> = ({
  value,
  options = {},
  className = '',
  fallback = 'Invalid Date'
}) => {
  const { i18n } = useTranslation();
  
  const formatDate = (dateValue: Date | string, locale: string, formatOptions: Intl.DateTimeFormatOptions): string => {
    try {
      // Convert string to Date if necessary
      const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
      
      // Validate that the date is valid
      if (isNaN(date.getTime())) {
        return fallback;
      }
      
      // Create formatter with locale
      const formatter = new Intl.DateTimeFormat(locale, formatOptions);
      return formatter.format(date);
    } catch (error) {
      console.warn('Failed to format date:', error);
      // Fallback to English locale if current locale fails
      try {
        const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
        if (isNaN(date.getTime())) {
          return fallback;
        }
        const fallbackFormatter = new Intl.DateTimeFormat('en-US', formatOptions);
        return fallbackFormatter.format(date);
      } catch (fallbackError) {
        console.error('Fallback date formatting failed:', fallbackError);
        return fallback;
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

  // Default options for better UX
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };

  const locale = getLocale(i18n.language);
  const formattedDate = formatDate(value, locale, defaultOptions);

  // Create ISO string for title attribute (accessibility)
  const getISOString = (dateValue: Date | string): string => {
    try {
      const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
      return isNaN(date.getTime()) ? '' : date.toISOString();
    } catch {
      return '';
    }
  };

  const isoString = getISOString(value);

  return (
    <time 
      className={className} 
      dateTime={isoString}
      title={isoString}
    >
      {formattedDate}
    </time>
  );
};

export default LocaleDate;