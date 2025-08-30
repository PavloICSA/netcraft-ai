/**
 * Demo file to show the internationalization components work
 * This demonstrates the components created in task 3
 */

import React from 'react';
import LanguageToggle from './LanguageToggle';
import LocaleNumber from './LocaleNumber';
import LocaleDate from './LocaleDate';
import useLocale from '../../hooks/useLocale';

const I18nDemo: React.FC = () => {
  const { formatNumber, formatDate, currentLanguage } = useLocale();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Internationalization Components Demo</h1>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Language Toggle Component</h2>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-600 mb-2">Standalone variant:</p>
            <LanguageToggle variant="standalone" />
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Topbar variant:</p>
            <LanguageToggle variant="topbar" />
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Footer variant (no label):</p>
            <LanguageToggle variant="footer" showLabel={false} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Locale Number Component</h2>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-600">Large number:</p>
            <LocaleNumber value={1234567.89} className="font-mono" />
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Percentage:</p>
            <LocaleNumber 
              value={0.1234} 
              options={{ style: 'percent', minimumFractionDigits: 2 }}
              className="font-mono" 
            />
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Currency:</p>
            <LocaleNumber 
              value={1234.56} 
              options={{ style: 'currency', currency: 'USD' }}
              className="font-mono" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Locale Date Component</h2>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-600">Default format:</p>
            <LocaleDate value={new Date('2023-12-25T10:30:00Z')} className="font-mono" />
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Long format:</p>
            <LocaleDate 
              value="2023-12-25" 
              options={{ 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }}
              className="font-mono" 
            />
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Time only:</p>
            <LocaleDate 
              value={new Date('2023-12-25T10:30:00Z')} 
              options={{ 
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              }}
              className="font-mono" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">useLocale Hook Demo</h2>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-600">Current language:</p>
            <code className="bg-gray-100 px-2 py-1 rounded">{currentLanguage}</code>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Formatted number via hook:</p>
            <code className="bg-gray-100 px-2 py-1 rounded">
              {formatNumber(1234567.89)}
            </code>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Formatted date via hook:</p>
            <code className="bg-gray-100 px-2 py-1 rounded">
              {formatDate(new Date('2023-12-25T10:30:00Z'))}
            </code>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Features Implemented:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✅ LanguageToggle component with accessibility features and keyboard navigation</li>
          <li>✅ LocaleNumber component using Intl.NumberFormat</li>
          <li>✅ LocaleDate component using Intl.DateTimeFormat</li>
          <li>✅ useLocale custom hook for locale management</li>
          <li>✅ Support for multiple variants and styling options</li>
          <li>✅ Error handling and fallback mechanisms</li>
          <li>✅ TypeScript type safety</li>
          <li>✅ Accessibility compliance (ARIA attributes, screen reader support)</li>
        </ul>
      </div>
    </div>
  );
};

export default I18nDemo;