// Technical terms that should be preserved across translations
export const PRESERVED_TERMS = [
  'Neural Network',
  'Random Forest',
  'K-means',
  'SOM',
  'CSV',
  'JSON',
  'API',
  'ML',
  'AI',
  'MSE',
  'RMSE',
  'MAE',
  'MAPE',
  'R²',
  'TypeScript',
  'JavaScript',
  'HTML',
  'CSS',
  'HTTP',
  'HTTPS',
  'URL',
  'UUID',
  'ISO',
  'UTF-8',
  'NetCraft AI'
];

export interface TranslationValidationError {
  key: string;
  type: 'missing_key' | 'missing_term' | 'format_mismatch' | 'empty_value';
  message: string;
  expected?: string;
  actual?: string;
}

export interface TranslationValidationResult {
  isValid: boolean;
  errors: TranslationValidationError[];
  warnings: TranslationValidationError[];
}

/**
 * Validates translation completeness and quality
 */
export class TranslationValidator {
  private sourceTranslations: Record<string, any>;
  private targetTranslations: Record<string, any>;

  constructor(sourceTranslations: Record<string, any>, targetTranslations: Record<string, any>) {
    this.sourceTranslations = sourceTranslations;
    this.targetTranslations = targetTranslations;
  }

  /**
   * Flattens nested translation object into dot-notation keys
   */
  private flattenTranslations(obj: Record<string, any>, prefix = ''): Record<string, string> {
    const flattened: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string') {
        flattened[newKey] = value;
      } else if (typeof value === 'object' && value !== null) {
        Object.assign(flattened, this.flattenTranslations(value, newKey));
      }
    }
    
    return flattened;
  }

  /**
   * Validates that all source keys exist in target translations
   */
  private validateKeyCompleteness(): TranslationValidationError[] {
    const errors: TranslationValidationError[] = [];
    const sourceFlat = this.flattenTranslations(this.sourceTranslations);
    const targetFlat = this.flattenTranslations(this.targetTranslations);

    for (const key of Object.keys(sourceFlat)) {
      if (!(key in targetFlat)) {
        errors.push({
          key,
          type: 'missing_key',
          message: `Missing translation key: ${key}`
        });
      } else if (!targetFlat[key] || targetFlat[key].trim() === '') {
        errors.push({
          key,
          type: 'empty_value',
          message: `Empty translation value for key: ${key}`
        });
      }
    }

    return errors;
  }

  /**
   * Validates that technical terms are preserved in translations
   */
  private validatePreservedTerms(): TranslationValidationError[] {
    const errors: TranslationValidationError[] = [];
    const sourceFlat = this.flattenTranslations(this.sourceTranslations);
    const targetFlat = this.flattenTranslations(this.targetTranslations);

    for (const [key, sourceValue] of Object.entries(sourceFlat)) {
      const targetValue = targetFlat[key];
      if (!targetValue) continue;

      for (const term of PRESERVED_TERMS) {
        if (sourceValue.includes(term) && !targetValue.includes(term)) {
          errors.push({
            key,
            type: 'missing_term',
            message: `Technical term "${term}" not preserved in translation`,
            expected: term,
            actual: targetValue
          });
        }
      }
    }

    return errors;
  }

  /**
   * Validates that placeholder formats are preserved (e.g., {count}, {{variable}})
   */
  private validatePlaceholderFormats(): TranslationValidationError[] {
    const errors: TranslationValidationError[] = [];
    const sourceFlat = this.flattenTranslations(this.sourceTranslations);
    const targetFlat = this.flattenTranslations(this.targetTranslations);

    // Regex patterns for different placeholder formats
    const placeholderPatterns = [
      /\{[^}]+\}/g,        // {variable}
      /\{\{[^}]+\}\}/g,    // {{variable}}
      /%[sd%]/g,           // %s, %d, %%
      /\$\{[^}]+\}/g       // ${variable}
    ];

    for (const [key, sourceValue] of Object.entries(sourceFlat)) {
      const targetValue = targetFlat[key];
      if (!targetValue) continue;

      for (const pattern of placeholderPatterns) {
        const sourcePlaceholders: string[] = sourceValue.match(pattern) || [];
        const targetPlaceholders: string[] = targetValue.match(pattern) || [];

        if (sourcePlaceholders.length !== targetPlaceholders.length) {
          errors.push({
            key,
            type: 'format_mismatch',
            message: `Placeholder count mismatch in key: ${key}`,
            expected: sourcePlaceholders.join(', '),
            actual: targetPlaceholders.join(', ')
          });
        }

        // Check if all source placeholders exist in target
        for (const placeholder of sourcePlaceholders) {
          if (!targetPlaceholders.includes(placeholder)) {
            errors.push({
              key,
              type: 'format_mismatch',
              message: `Missing placeholder "${placeholder}" in translation`,
              expected: placeholder,
              actual: targetValue
            });
          }
        }
      }
    }

    return errors;
  }

  /**
   * Runs all validation checks
   */
  public validate(): TranslationValidationResult {
    const errors: TranslationValidationError[] = [];
    const warnings: TranslationValidationError[] = [];

    // Run all validation checks
    errors.push(...this.validateKeyCompleteness());
    errors.push(...this.validatePreservedTerms());
    errors.push(...this.validatePlaceholderFormats());

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validates a specific translation key
   */
  public validateKey(key: string): TranslationValidationResult {
    const sourceFlat = this.flattenTranslations(this.sourceTranslations);
    const targetFlat = this.flattenTranslations(this.targetTranslations);
    
    const errors: TranslationValidationError[] = [];
    
    if (!(key in sourceFlat)) {
      errors.push({
        key,
        type: 'missing_key',
        message: `Source key not found: ${key}`
      });
      return { isValid: false, errors, warnings: [] };
    }

    if (!(key in targetFlat)) {
      errors.push({
        key,
        type: 'missing_key',
        message: `Target key not found: ${key}`
      });
    } else {
      const sourceValue = sourceFlat[key];
      const targetValue = targetFlat[key];

      // Check preserved terms
      for (const term of PRESERVED_TERMS) {
        if (sourceValue.includes(term) && !targetValue.includes(term)) {
          errors.push({
            key,
            type: 'missing_term',
            message: `Technical term "${term}" not preserved`,
            expected: term,
            actual: targetValue
          });
        }
      }

      // Check placeholders
      const placeholderPattern = /\{[^}]+\}/g;
      const sourcePlaceholders = sourceValue.match(placeholderPattern) || [];
      const targetPlaceholders = targetValue.match(placeholderPattern) || [];

      if (sourcePlaceholders.length !== targetPlaceholders.length) {
        errors.push({
          key,
          type: 'format_mismatch',
          message: `Placeholder count mismatch`,
          expected: sourcePlaceholders.join(', '),
          actual: targetPlaceholders.join(', ')
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: []
    };
  }
}

/**
 * Utility function to validate translations between two locale objects
 */
export function validateTranslations(
  sourceTranslations: Record<string, any>,
  targetTranslations: Record<string, any>
): TranslationValidationResult {
  const validator = new TranslationValidator(sourceTranslations, targetTranslations);
  return validator.validate();
}

/**
 * Utility function to get translation coverage statistics
 */
export function getTranslationCoverage(
  sourceTranslations: Record<string, any>,
  targetTranslations: Record<string, any>
): {
  totalKeys: number;
  translatedKeys: number;
  coverage: number;
  missingKeys: string[];
} {
  const validator = new TranslationValidator(sourceTranslations, targetTranslations);
  const sourceFlat = validator['flattenTranslations'](sourceTranslations);
  const targetFlat = validator['flattenTranslations'](targetTranslations);

  const totalKeys = Object.keys(sourceFlat).length;
  const translatedKeys = Object.keys(sourceFlat).filter(key => 
    key in targetFlat && targetFlat[key] && targetFlat[key].trim() !== ''
  ).length;
  const missingKeys = Object.keys(sourceFlat).filter(key => 
    !(key in targetFlat) || !targetFlat[key] || targetFlat[key].trim() === ''
  );

  return {
    totalKeys,
    translatedKeys,
    coverage: totalKeys > 0 ? (translatedKeys / totalKeys) * 100 : 0,
    missingKeys
  };
}