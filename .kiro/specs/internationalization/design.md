# Design Document

## Overview

The internationalization system for NetCraft AI will implement comprehensive bilingual support using react-i18next as the core library. The design follows a modular approach with namespace-based organization, type-safe translation keys, and locale-aware formatting. The system preserves technical terminology while providing full Ukrainian translations for user-facing content.

## Architecture

### Core Libraries and Dependencies

- **react-i18next**: Primary internationalization framework
- **i18next**: Core i18n engine with interpolation and pluralization
- **i18next-browser-languagedetector**: Automatic language detection
- **TypeScript**: Type-safe translation keys and configuration

### Configuration Structure

```typescript
// src/lib/i18n/index.ts
const i18nConfig = {
  fallbackLng: 'en',
  supportedLngs: ['en', 'uk'],
  defaultNS: 'common',
  ns: ['common', 'landing', 'data', 'predictor', 'clusterizer', 'forecasting', 'results', 'forms', 'legal', 'errors', 'guides'],
  detection: {
    order: ['localStorage', 'navigator', 'querystring'],
    caches: ['localStorage']
  }
}
```

### Directory Structure

```
src/
├── lib/i18n/
│   ├── index.ts              # Main i18n configuration
│   ├── types.ts              # TypeScript type definitions
│   └── utils.ts              # i18n utility functions
├── locales/
│   ├── en/                   # English translations (source)
│   │   ├── common.json
│   │   ├── landing.json
│   │   ├── data.json
│   │   ├── predictor.json
│   │   ├── clusterizer.json
│   │   ├── forecasting.json
│   │   ├── results.json
│   │   ├── forms.json
│   │   ├── legal.json
│   │   ├── errors.json
│   │   └── guides.json
│   └── uk/                   # Ukrainian translations
│       └── [same structure]
├── components/
│   ├── LanguageToggle.tsx    # Language switching component
│   ├── LocaleNumber.tsx      # Locale-aware number formatting
│   └── LocaleDate.tsx        # Locale-aware date formatting
└── hooks/
    └── useLocale.ts          # Custom locale management hook
```## C
omponents and Interfaces

### Language Toggle Component

```typescript
interface LanguageToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'topbar' | 'footer' | 'standalone';
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className,
  showLabel = true,
  variant = 'standalone'
}) => {
  // Implementation with accessibility features
  // - aria-pressed for current language state
  // - keyboard navigation support
  // - screen reader announcements
  // - Visual indicators (flags optional)
}
```

### Locale-Aware Formatting Components

```typescript
interface LocaleNumberProps {
  value: number;
  options?: Intl.NumberFormatOptions;
  className?: string;
}

interface LocaleDateProps {
  value: Date | string;
  options?: Intl.DateTimeFormatOptions;
  className?: string;
}
```

### Translation Hook Interface

```typescript
interface UseTranslationResult {
  t: (key: string, options?: any) => string;
  i18n: i18n;
  ready: boolean;
}

// Custom hook for locale management
interface UseLocaleResult {
  currentLanguage: string;
  changeLanguage: (lng: string) => Promise<void>;
  isRTL: boolean;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (value: Date | string, options?: Intl.DateTimeFormatOptions) => string;
}
```

## Data Models

### Translation Key Structure

```typescript
// Hierarchical key organization
type TranslationKeys = {
  common: {
    buttons: {
      save: string;
      cancel: string;
      delete: string;
      export: string;
    };
    navigation: {
      home: string;
      data: string;
      predictor: string;
    };
  };
  predictor: {
    form: {
      selectTarget: string;
      selectFeatures: string;
    };
    metrics: {
      rmse: string; // "Root Mean Square Error (RMSE)"
      mae: string;  // "Mean Absolute Error (MAE)"
    };
  };
}
```

### Namespace Organization

- **common**: Shared UI elements, buttons, navigation
- **landing**: Marketing copy, hero sections, features
- **data**: Data upload, preview, validation messages
- **predictor**: Neural network and Random Forest interfaces
- **clusterizer**: Clustering algorithms and results
- **forecasting**: Time series forecasting components
- **results**: Results display and export functionality
- **forms**: Form labels, validation, help text
- **legal**: Terms, privacy policy, legal notices
- **errors**: Error messages and troubleshooting
- **guides**: Help documentation and tutorials

### Technical Term Preservation Rules

```typescript
// Terms that must remain unchanged
const PRESERVE_TERMS = {
  metrics: ['RMSE', 'MSE', 'MAE', 'MAPE', 'R²', 'AUC', 'F1', 'Precision', 'Recall'],
  algorithms: ['Random Forest', 'K-means', 'SOM', 'ANN', 'LSTM', 'PCA', 'DBSCAN', 't-SNE', 'UMAP'],
  datasets: ['Iris', 'Sales Timeseries', 'example.csv'],
  units: ['%', 'kg', 'ha', 'm', 'cm', 'USD', 'EUR'],
  brands: ['NetCraft AI']
};

// Translation pattern for metrics
// English: "Root Mean Square Error (RMSE)"
// Ukrainian: "Квадратний корінь середнього квадратичного відхилення (RMSE)"
```#
# Error Handling

### Translation Loading Errors

```typescript
// Fallback strategy for missing translations
const errorHandling = {
  // Show key path if translation missing in development
  missingKeyHandler: (lng: string, ns: string, key: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation: ${lng}.${ns}.${key}`);
      return `[${key}]`;
    }
    return key;
  },
  
  // Fallback to English if Ukrainian translation fails
  fallbackStrategy: 'fallback',
  
  // Handle namespace loading failures
  loadFailure: (lng: string, ns: string) => {
    console.error(`Failed to load namespace ${ns} for language ${lng}`);
  }
};
```

### Locale Detection Failures

```typescript
// Graceful degradation for locale detection
const localeDetection = {
  // Default to English if detection fails
  fallbackLocale: 'en-US',
  
  // Handle browser API unavailability
  intlSupport: typeof Intl !== 'undefined',
  
  // Validate locale before applying
  validateLocale: (locale: string) => {
    try {
      new Intl.NumberFormat(locale);
      return true;
    } catch {
      return false;
    }
  }
};
```

### Runtime Translation Errors

```typescript
// Error boundaries for translation components
class TranslationErrorBoundary extends React.Component {
  // Catch translation rendering errors
  // Fallback to English or key display
  // Log errors for debugging
}
```

## Testing Strategy

### Unit Testing Approach

```typescript
// Test translation key coverage
describe('Translation Coverage', () => {
  test('all English keys have Ukrainian translations', () => {
    // Compare en/*.json with uk/*.json
    // Report missing keys
  });
  
  test('technical terms are preserved', () => {
    // Verify PRESERVE_TERMS remain unchanged
    // Check metric abbreviations in parentheses
  });
});

// Test locale formatting
describe('Locale Formatting', () => {
  test('numbers format correctly for uk-UA', () => {
    // Test thousand separators
    // Test decimal notation
  });
  
  test('dates format correctly for uk-UA', () => {
    // Test date order (DD.MM.YYYY)
    // Test month names
  });
});
```

### Integration Testing

```typescript
// Test language switching
describe('Language Toggle Integration', () => {
  test('UI switches to Ukrainian instantly', () => {
    // Render component in English
    // Click language toggle
    // Verify text changes to Ukrainian
  });
  
  test('language preference persists', () => {
    // Set Ukrainian
    // Reload page
    // Verify Ukrainian is maintained
  });
});
```

### Accessibility Testing

```typescript
// Test screen reader compatibility
describe('Accessibility', () => {
  test('language changes are announced', () => {
    // Mock screen reader
    // Verify aria-live announcements
  });
  
  test('HTML lang attribute updates', () => {
    // Check document.documentElement.lang
    // Verify proper language codes
  });
});
```

### Translation Quality Assurance

```typescript
// Automated translation checks
const translationQA = {
  // Check for interpolation token consistency
  validateInterpolation: (enText: string, ukText: string) => {
    const enTokens = enText.match(/\{\{[^}]+\}\}/g) || [];
    const ukTokens = ukText.match(/\{\{[^}]+\}\}/g) || [];
    return enTokens.length === ukTokens.length;
  },
  
  // Verify preserved terms remain unchanged
  checkPreservedTerms: (ukText: string) => {
    return PRESERVE_TERMS.metrics.every(term => 
      ukText.includes(term) || !ukText.includes(term.toLowerCase())
    );
  },
  
  // Generate translator handoff CSV
  generateTranslatorCSV: () => {
    // Export key, english, ukrainian columns
    // Include context and preservation notes
  }
};
```#
# Implementation Architecture

### Application Integration Points

```typescript
// Main App component integration
const App: React.FC = () => {
  // Wrap with i18n provider at root level
  // Initialize language detection on mount
  // Update HTML lang attribute on language change
  
  useEffect(() => {
    // Set initial language attribute
    document.documentElement.lang = i18n.language;
    
    // Listen for language changes
    i18n.on('languageChanged', (lng) => {
      document.documentElement.lang = lng;
    });
  }, []);
};
```

### Component Migration Strategy

```typescript
// Before: Hard-coded strings
const Button = () => <button>Save Project</button>;

// After: Internationalized
const Button = () => {
  const { t } = useTranslation('common');
  return <button>{t('buttons.save')}</button>;
};

// Complex example with interpolation
const DataInfo = ({ dataset }: { dataset: Dataset }) => {
  const { t } = useTranslation('data');
  return (
    <p>{t('info.rowsAndColumns', { 
      rows: dataset.data.length, 
      columns: dataset.columns.length 
    })}</p>
  );
};
```

### Lazy Loading Strategy

```typescript
// Namespace-based lazy loading for performance
const LazyTranslation = {
  // Load only required namespaces per route
  '/': ['common', 'landing'],
  '/data': ['common', 'data', 'forms'],
  '/predictor': ['common', 'predictor', 'forms', 'results'],
  '/clusterizer': ['common', 'clusterizer', 'forms', 'results'],
  '/forecasting': ['common', 'forecasting', 'forms', 'results']
};

// Route-based namespace loading
const useRouteTranslations = (pathname: string) => {
  const namespaces = LazyTranslation[pathname] || ['common'];
  return useTranslation(namespaces);
};
```

### Performance Considerations

```typescript
// Bundle optimization
const i18nOptimization = {
  // Split translations by route
  dynamicImports: true,
  
  // Minimize bundle size
  removeUnusedKeys: true,
  
  // Cache translations in memory
  cacheTranslations: true,
  
  // Preload critical namespaces
  preloadNamespaces: ['common', 'errors']
};
```

## Migration Plan

### Phase 1: Infrastructure Setup
1. Install and configure i18next libraries
2. Create base configuration and type definitions
3. Set up translation file structure
4. Implement LanguageToggle component

### Phase 2: Core Components
1. Migrate Layout components (Topbar, Sidebar, Footer)
2. Implement LocaleNumber and LocaleDate components
3. Update common UI components (buttons, modals, forms)
4. Add translation coverage tooling

### Phase 3: Feature Pages
1. Migrate Landing page components
2. Update Data upload and preview components
3. Migrate Predictor components (ANN and Random Forest)
4. Update Clusterizer components

### Phase 4: Advanced Features
1. Migrate Forecasting components
2. Update Results and export functionality
3. Migrate informational pages (About, Guidelines, etc.)
4. Add legal page translations

### Phase 5: Quality Assurance
1. Comprehensive testing suite
2. Translation coverage validation
3. Accessibility compliance verification
4. Performance optimization

## Technical Decisions and Rationales

### Library Choice: react-i18next
- **Rationale**: Industry standard with excellent TypeScript support
- **Benefits**: Mature ecosystem, extensive documentation, React hooks integration
- **Trade-offs**: Additional bundle size vs. functionality

### Namespace Organization
- **Rationale**: Logical separation prevents key conflicts and enables lazy loading
- **Benefits**: Better maintainability, performance optimization, clear ownership
- **Trade-offs**: More complex setup vs. better organization

### Technical Term Preservation
- **Rationale**: Maintains scientific accuracy and international consistency
- **Benefits**: Preserves domain expertise, enables cross-language collaboration
- **Trade-offs**: Mixed-language UI vs. technical accuracy

### Client-Side Only Implementation
- **Rationale**: Aligns with existing client-side architecture
- **Benefits**: No server dependencies, faster switching, offline capability
- **Trade-offs**: Larger initial bundle vs. server complexity