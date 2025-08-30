/**
 * TypeScript type definitions for internationalization
 */

// Supported languages
export type SupportedLanguage = 'en' | 'uk';

// Translation namespaces
export type TranslationNamespace = 
  | 'common'
  | 'landing'
  | 'data'
  | 'predictor'
  | 'clusterizer'
  | 'forecasting'
  | 'results'
  | 'forms'
  | 'legal'
  | 'errors'
  | 'guides'
  | 'pages';

// Language detection configuration
export interface LanguageDetectionConfig {
  order: string[];
  caches: string[];
  lookupQuerystring?: string;
  lookupCookie?: string;
  lookupLocalStorage?: string;
  lookupFromPathIndex?: number;
  lookupFromSubdomainIndex?: number;
}

// i18next configuration interface
export interface I18nConfig {
  fallbackLng: SupportedLanguage;
  supportedLngs: SupportedLanguage[];
  defaultNS: TranslationNamespace;
  ns: TranslationNamespace[];
  debug: boolean;
  interpolation: {
    escapeValue: boolean;
  };
  detection: LanguageDetectionConfig;
}

// Translation key structure for type safety
export interface TranslationKeys {
  common: {
    buttons: {
      save: string;
      cancel: string;
      delete: string;
      export: string;
      import: string;
      reset: string;
      clear: string;
      submit: string;
      close: string;
      back: string;
      next: string;
      previous: string;
      continue: string;
      finish: string;
    };
    navigation: {
      home: string;
      data: string;
      predictor: string;
      clusterizer: string;
      forecasting: string;
      results: string;
      about: string;
      guidelines: string;
      contact: string;
    };
    status: {
      loading: string;
      success: string;
      error: string;
      warning: string;
      info: string;
    };
    actions: {
      edit: string;
      view: string;
      download: string;
      upload: string;
      copy: string;
      paste: string;
      select: string;
      deselect: string;
    };
  };
  landing: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
      getStarted: string;
      learnMore: string;
    };
    features: {
      title: string;
      subtitle: string;
      neuralNetworks: {
        title: string;
        description: string;
      };
      randomForest: {
        title: string;
        description: string;
      };
      clustering: {
        title: string;
        description: string;
      };
      forecasting: {
        title: string;
        description: string;
      };
    };
  };
  data: {
    upload: {
      title: string;
      description: string;
      dragDrop: string;
      selectFile: string;
      supportedFormats: string;
    };
    preview: {
      title: string;
      rows: string;
      columns: string;
      dataTypes: string;
    };
    validation: {
      fileRequired: string;
      invalidFormat: string;
      tooLarge: string;
      noData: string;
    };
  };
  predictor: {
    form: {
      selectTarget: string;
      selectFeatures: string;
      networkArchitecture: string;
      trainingParameters: string;
    };
    metrics: {
      accuracy: string;
      precision: string;
      recall: string;
      f1Score: string;
      rmse: string;
      mae: string;
      mse: string;
    };
  };
  clusterizer: {
    algorithms: {
      kmeans: string;
      som: string;
    };
    parameters: {
      clusters: string;
      iterations: string;
      learningRate: string;
    };
  };
  forecasting: {
    algorithms: {
      movingAverage: string;
      exponentialSmoothing: string;
      linearTrend: string;
    };
    metrics: {
      rmse: string;
      mae: string;
      mape: string;
    };
  };
  results: {
    export: {
      title: string;
      format: string;
      filename: string;
    };
    model: {
      save: string;
      load: string;
      accuracy: string;
    };
  };
  forms: {
    validation: {
      required: string;
      invalid: string;
      tooShort: string;
      tooLong: string;
      mustBeNumber: string;
      mustBePositive: string;
    };
    labels: {
      name: string;
      description: string;
      value: string;
      type: string;
    };
  };
  legal: {
    terms: {
      title: string;
      lastUpdated: string;
    };
    privacy: {
      title: string;
      lastUpdated: string;
    };
  };
  errors: {
    general: {
      somethingWrong: string;
      tryAgain: string;
      contactSupport: string;
    };
    network: {
      connectionFailed: string;
      timeout: string;
    };
    validation: {
      invalidInput: string;
      missingData: string;
    };
  };
  guides: {
    gettingStarted: {
      title: string;
      description: string;
    };
    tutorials: {
      neuralNetworks: string;
      randomForest: string;
      clustering: string;
      forecasting: string;
    };
  };
}

// Terms that must be preserved in all translations
export const PRESERVE_TERMS = {
  metrics: [
    'RMSE', 'MSE', 'MAE', 'MAPE', 'R²', 'AUC', 'F1', 
    'Precision', 'Recall', 'Accuracy'
  ],
  algorithms: [
    'Random Forest', 'K-means', 'SOM', 'ANN', 'LSTM', 
    'PCA', 'DBSCAN', 't-SNE', 'UMAP', 'Decision Tree',
    'Linear Regression', 'Logistic Regression'
  ],
  datasets: [
    'Iris', 'Sales Timeseries', 'example.csv'
  ],
  units: [
    '%', 'kg', 'ha', 'm', 'cm', 'USD', 'EUR'
  ],
  brands: [
    'NetCraft AI'
  ]
} as const;

// Language toggle component props
export interface LanguageToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'topbar' | 'footer' | 'standalone';
}

// Locale formatting component props
export interface LocaleNumberProps {
  value: number;
  options?: Intl.NumberFormatOptions;
  className?: string;
}

export interface LocaleDateProps {
  value: Date | string;
  options?: Intl.DateTimeFormatOptions;
  className?: string;
}

// Custom hook return types
export interface UseLocaleResult {
  currentLanguage: SupportedLanguage;
  changeLanguage: (lng: SupportedLanguage) => Promise<void>;
  isRTL: boolean;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (value: Date | string, options?: Intl.DateTimeFormatOptions) => string;
}