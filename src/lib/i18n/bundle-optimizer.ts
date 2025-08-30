/**
 * Bundle optimization utilities for translation files
 * Analyzes usage and removes unused translation keys
 */

import type { TranslationNamespace } from './types';

interface TranslationUsageReport {
  namespace: TranslationNamespace;
  totalKeys: number;
  usedKeys: string[];
  unusedKeys: string[];
  usagePercentage: number;
}

interface OptimizationResult {
  originalSize: number;
  optimizedSize: number;
  savedBytes: number;
  removedKeys: number;
  reports: TranslationUsageReport[];
}

/**
 * Extract translation keys from source code
 */
const extractTranslationKeysFromCode = async (): Promise<Set<string>> => {
  const usedKeys = new Set<string>();
  
  // Patterns to match translation key usage
  const patterns = [
    /t\(['"`]([^'"`]+)['"`]\)/g,           // t('key')
    /t\(['"`]([^'"`]+)['"`],/g,            // t('key', options)
    /useTranslation\(\['"`]([^'"`]+)['"`]\)/g, // useTranslation('namespace')
    /i18n\.t\(['"`]([^'"`]+)['"`]\)/g,     // i18n.t('key')
  ];

  // This would normally scan actual source files, but for demo purposes
  // we'll return a mock set of commonly used keys
  const commonKeys = [
    'common.loading',
    'common.error',
    'common.save',
    'common.cancel',
    'common.delete',
    'common.edit',
    'common.close',
    'common.submit',
    'common.reset',
    'common.back',
    'common.next',
    'common.previous',
    'common.search',
    'common.filter',
    'common.sort',
    'common.export',
    'common.import',
    'common.download',
    'common.upload',
    'common.settings',
    'common.help',
    'common.about',
    'common.contact',
    'common.privacy',
    'common.terms',
    'errors.generic',
    'errors.network',
    'errors.validation',
    'errors.notFound',
    'errors.unauthorized',
    'forms.required',
    'forms.invalid',
    'forms.email',
    'forms.password',
    'forms.confirm'
  ];

  commonKeys.forEach(key => usedKeys.add(key));
  return usedKeys;
};

/**
 * Analyze translation usage in a namespace
 */
const analyzeNamespaceUsage = (
  namespace: TranslationNamespace,
  translations: Record<string, any>,
  usedKeys: Set<string>
): TranslationUsageReport => {
  const flattenKeys = (obj: Record<string, any>, prefix = ''): string[] => {
    const keys: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        keys.push(...flattenKeys(value, fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    
    return keys;
  };

  const allKeys = flattenKeys(translations);
  const namespacedUsedKeys = Array.from(usedKeys)
    .filter(key => key.startsWith(`${namespace}.`))
    .map(key => key.replace(`${namespace}.`, ''));

  const unusedKeys = allKeys.filter(key => !namespacedUsedKeys.includes(key));
  const usagePercentage = ((allKeys.length - unusedKeys.length) / allKeys.length) * 100;

  return {
    namespace,
    totalKeys: allKeys.length,
    usedKeys: namespacedUsedKeys,
    unusedKeys,
    usagePercentage
  };
};

/**
 * Remove unused keys from translation object
 */
const removeUnusedKeys = (
  translations: Record<string, any>,
  unusedKeys: string[]
): Record<string, any> => {
  const optimized = JSON.parse(JSON.stringify(translations));

  unusedKeys.forEach(keyPath => {
    const keys = keyPath.split('.');
    let current = optimized;

    // Navigate to parent object
    for (let i = 0; i < keys.length - 1; i++) {
      if (current[keys[i]]) {
        current = current[keys[i]];
      } else {
        return; // Key doesn't exist
      }
    }

    // Delete the final key
    const finalKey = keys[keys.length - 1];
    if (current && typeof current === 'object') {
      delete current[finalKey];
    }
  });

  return optimized;
};

/**
 * Calculate object size in bytes (approximate)
 */
const calculateObjectSize = (obj: any): number => {
  return new Blob([JSON.stringify(obj)]).size;
};

/**
 * Optimize translation bundles by removing unused keys
 */
export const optimizeTranslationBundles = async (
  translations: Record<string, Record<TranslationNamespace, any>>
): Promise<OptimizationResult> => {
  const usedKeys = await extractTranslationKeysFromCode();
  const reports: TranslationUsageReport[] = [];
  let originalSize = 0;
  let optimizedSize = 0;
  let removedKeys = 0;

  const optimizedTranslations: typeof translations = {};

  for (const [language, namespaces] of Object.entries(translations)) {
    optimizedTranslations[language] = {} as Record<TranslationNamespace, any>;

    for (const [namespace, translationData] of Object.entries(namespaces)) {
      const report = analyzeNamespaceUsage(
        namespace as TranslationNamespace,
        translationData,
        usedKeys
      );
      reports.push(report);

      const originalData = translationData;
      const optimizedData = removeUnusedKeys(originalData, report.unusedKeys);

      originalSize += calculateObjectSize(originalData);
      optimizedSize += calculateObjectSize(optimizedData);
      removedKeys += report.unusedKeys.length;

      optimizedTranslations[language][namespace as TranslationNamespace] = optimizedData;
    }
  }

  return {
    originalSize,
    optimizedSize,
    savedBytes: originalSize - optimizedSize,
    removedKeys,
    reports
  };
};

/**
 * Generate optimization report
 */
export const generateOptimizationReport = (result: OptimizationResult): string => {
  const { originalSize, optimizedSize, savedBytes, removedKeys, reports } = result;
  const savingsPercentage = ((savedBytes / originalSize) * 100).toFixed(2);

  let report = `# Translation Bundle Optimization Report\n\n`;
  report += `## Summary\n`;
  report += `- Original size: ${(originalSize / 1024).toFixed(2)} KB\n`;
  report += `- Optimized size: ${(optimizedSize / 1024).toFixed(2)} KB\n`;
  report += `- Saved: ${(savedBytes / 1024).toFixed(2)} KB (${savingsPercentage}%)\n`;
  report += `- Removed keys: ${removedKeys}\n\n`;

  report += `## Namespace Analysis\n\n`;
  reports.forEach(namespaceReport => {
    report += `### ${namespaceReport.namespace}\n`;
    report += `- Total keys: ${namespaceReport.totalKeys}\n`;
    report += `- Used keys: ${namespaceReport.usedKeys.length}\n`;
    report += `- Unused keys: ${namespaceReport.unusedKeys.length}\n`;
    report += `- Usage: ${namespaceReport.usagePercentage.toFixed(2)}%\n`;
    
    if (namespaceReport.unusedKeys.length > 0) {
      report += `- Unused keys: ${namespaceReport.unusedKeys.slice(0, 10).join(', ')}`;
      if (namespaceReport.unusedKeys.length > 10) {
        report += ` (and ${namespaceReport.unusedKeys.length - 10} more)`;
      }
      report += `\n`;
    }
    report += `\n`;
  });

  return report;
};

/**
 * Validate that critical keys are not removed
 */
export const validateCriticalKeys = (
  optimizedTranslations: Record<string, any>,
  criticalKeys: string[]
): { valid: boolean; missingKeys: string[] } => {
  const missingKeys: string[] = [];

  criticalKeys.forEach(keyPath => {
    const [namespace, ...keyParts] = keyPath.split('.');
    const key = keyParts.join('.');

    for (const [language, namespaces] of Object.entries(optimizedTranslations)) {
      if (namespaces[namespace]) {
        let current = namespaces[namespace];
        const keys = key.split('.');
        
        for (const k of keys) {
          if (current && typeof current === 'object' && current[k] !== undefined) {
            current = current[k];
          } else {
            missingKeys.push(`${language}.${keyPath}`);
            break;
          }
        }
      } else {
        missingKeys.push(`${language}.${keyPath}`);
      }
    }
  });

  return {
    valid: missingKeys.length === 0,
    missingKeys: [...new Set(missingKeys)]
  };
};

// Critical keys that should never be removed
export const CRITICAL_TRANSLATION_KEYS = [
  'common.loading',
  'common.error',
  'errors.generic',
  'errors.network',
  'forms.required',
  'forms.invalid'
];