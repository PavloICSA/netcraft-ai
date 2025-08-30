# Implementation Plan

- [x] 1. Install dependencies and setup i18n infrastructure










  - Install i18next, react-i18next, and i18next-browser-languagedetector packages
  - Create src/lib/i18n/index.ts with complete i18n configuration
  - Create TypeScript type definitions in src/lib/i18n/types.ts
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 2. Create translation file structure and base English translations





  - Create locales/en/ directory with all namespace JSON files (common, landing, data, predictor, clusterizer, forecasting, results, forms, legal, errors, guides)
  - Populate English translation files with comprehensive key-value pairs extracted from existing components
  - Create locales/uk/ directory structure with placeholder Ukrainian translations
  - _Requirements: 7.1, 7.5_

- [x] 3. Implement core internationalization components







  - Create LanguageToggle.tsx component with accessibility features and keyboard navigation
  - Implement LocaleNumber.tsx wrapper component using Intl.NumberFormat
  - Implement LocaleDate.tsx wrapper component using Intl.DateTimeFormat
  - Create useLocale.ts custom hook for locale management
  - _Requirements: 5.1, 5.2, 5.3, 4.1, 4.2, 4.3_

- [x] 4. Integrate i18n provider into main application







  - Modify src/main.tsx to wrap App with i18n provider
  - Update src/App.tsx to handle language detection and HTML lang attribute updates
  - Add language change event listeners and localStorage persistence
  - _Requirements: 1.1, 1.3, 1.4, 5.4_

- [x] 5. Migrate Layout components to use translations










  - Update Topbar.tsx to use useTranslation hook for all user-facing text
  - Update Footer.tsx to use translations while preserving copyright and version info
  - Update Sidebar.tsx to use translations for navigation items
  - Add LanguageToggle component to Topbar and Footer
  - _Requirements: 2.1, 1.2_

- [x] 6. Migrate Landing page components





  - Update Hero.tsx component to use translations for marketing copy
  - Update Features.tsx component to use translations for feature descriptions
  - Update DemoCarousel.tsx to use translations while preserving dataset names
  - Update AIStats.tsx and animation components with translated labels
  - _Requirements: 2.2, 3.3_

- [x] 7. Migrate Data components with technical term preservation












  - Update DataUploader components to use translations for UI text
  - Update DataPreview.tsx to use translations while preserving column names and CSV filenames
  - Implement locale-aware number formatting in data display tables
  - Add translated validation messages and error handling
  - _Requirements: 2.1, 3.4, 4.3, 2.4_

- [x] 8. Migrate Predictor components with metric preservation






  - Update PredictorForm.tsx to use translations for form labels and help text
  - Update RandomForestForm.tsx with translations while preserving algorithm names
  - Update PredictorResults.tsx and RandomForestResults.tsx to use translated metric descriptions with preserved abbreviations
  - Implement locale-aware number formatting for prediction results
  - _Requirements: 2.1, 3.1, 3.2, 4.3_

- [x] 9. Migrate Clusterizer components














  - Update clustering form components to use translations while preserving algorithm names (K-means, SOM)
  - Update clustering results components with translated descriptions
  - Implement locale-aware formatting for cluster statistics and metrics
  - Add translated tooltips for algorithm selection with preserved technical names
  - _Requirements: 2.1, 3.2, 4.3_

- [x] 10. Migrate Forecasting components




  - Update ForecastingForm.tsx to use translations for algorithm selection and parameters
  - Update TimeSeriesChart.tsx to use locale-aware number formatting for axis labels
  - Update MetricsPanel.tsx to use translated metric descriptions with preserved abbreviations (RMSE, MAE, MAPE)
  - Update ForecastExport.tsx with translated export options
  - _Requirements: 2.1, 3.1, 4.2, 4.3_

- [x] 11. Migrate informational and legal pages
  - Update AboutPage.tsx, GuidelinesPage.tsx with full translations
  - Update info pages (NeuralNetworksInfoPage, RandomForestInfoPage, etc.) with translated content while preserving technical terms
  - Create legal page translation skeleton with clear placeholders for Terms and Privacy pages
  - Add translated error pages and 404 content
  - _Requirements: 2.2, 2.4_

- [x] 12. Implement comprehensive Ukrainian translations
  - Complete all Ukrainian translation files with proper pluralization rules
  - Implement interpolation tokens for dynamic content
  - Ensure technical terms and abbreviations remain unchanged as specified
  - Add context comments for translators in JSON files
  - _Requirements: 7.2, 7.3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 13. Create translation tooling and quality assurance
  - Create scripts/translation-coverage.ts script to compare en vs uk JSON files
  - Implement translation validation functions to check preserved terms
  - Create CSV export functionality for translator handoff
  - Add automated tests for translation key coverage and technical term preservation
  - _Requirements: 6.4, 8.3_

- [x] 14. Implement comprehensive testing suite
  - Write unit tests for LanguageToggle component functionality
  - Create integration tests for language switching across different pages
  - Add tests for locale-aware number and date formatting
  - Implement accessibility tests for screen reader announcements and HTML lang attribute
  - Write tests for localStorage persistence of language preference
  - _Requirements: 8.1, 8.2, 8.4, 8.5_

- [x] 15. Performance optimization and final integration ✅ COMPLETED
  - ✅ Implement lazy loading for translation namespaces based on routes
  - ✅ Optimize bundle size by removing unused translation keys  
  - ✅ Add error boundaries for translation failures
  - ✅ Update README with translator instructions and technical term preservation guidelines
  - ✅ Create RouteWrapper component with loading states and error handling
  - ✅ Implement bundle optimization utilities and analysis scripts
  - ✅ Add comprehensive testing for lazy loading and optimization features
  - _Requirements: 6.1, 6.2_