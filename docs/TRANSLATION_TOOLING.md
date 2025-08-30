# Translation Tooling Guide

NetCraft AI includes comprehensive translation management tools for maintaining high-quality internationalization across multiple languages.

## Overview

The translation tooling system provides:
- **Coverage Analysis**: Track translation completeness across all namespaces
- **Validation Tools**: Ensure technical term preservation and consistency
- **Export/Import**: CSV-based workflow for translators
- **Bundle Optimization**: Performance optimization for translation files
- **Automated Reporting**: Detailed analysis of translation status

## Supported Languages

### Current Languages
- **English (en)** - Default language, 100% coverage
- **Ukrainian (uk)** - Complete translation with cultural adaptation

### Language Structure
```
src/locales/
├── en/                 # English translations (reference)
│   ├── common.json     # Shared UI elements
│   ├── landing.json    # Landing page content
│   ├── data.json       # Data management interface
│   ├── predictor.json  # Neural network and Random Forest
│   ├── clusterizer.json # Clustering interface
│   ├── forecasting.json # Time series forecasting
│   ├── results.json    # Results and metrics
│   ├── forms.json      # Form labels and validation
│   ├── legal.json      # Terms and privacy content
│   ├── errors.json     # Error messages
│   ├── guides.json     # Help and documentation
│   └── pages.json      # Static page content
└── uk/                 # Ukrainian translations
    └── [same structure as en/]
```

## Translation Management Commands

### Coverage Analysis
```bash
# Check translation completeness
npm run translation-coverage

# Output example:
# Translation Coverage Report
# ========================
# 
# English (en): 100.0% (450/450 keys)
# Ukrainian (uk): 100.0% (450/450 keys)
# 
# Namespace Coverage:
# - common: en=100%, uk=100%
# - predictor: en=100%, uk=100%
# - forecasting: en=100%, uk=100%
```

### Validation
```bash
# Validate translations and technical terms
npm run translation-validate

# Checks for:
# - Missing translation keys
# - Technical term preservation
# - Interpolation variable consistency
# - JSON syntax errors
```

### Export for Translators
```bash
# Export translations to CSV format
npm run translation-export

# Creates files:
# - translation-export-en.csv
# - translation-export-uk.csv
# - translation-missing-uk.csv (if any missing keys)
```

### Bundle Optimization
```bash
# Optimize translation bundles
npm run translation-optimize

# Save optimized versions
npm run translation-optimize-save
```

### Complete Analysis
```bash
# Run all translation tools
npm run translation-all
```

## Technical Term Preservation

### Preserved Terms (Keep in English)

**Algorithm Names:**
- `K-means`, `SOM`, `Random Forest`, `Neural Network`
- `ARIMA`, `LSTM`, `CNN`, `PCA`

**Metric Abbreviations:**
- `MSE`, `MAE`, `RMSE`, `MAPE`, `R²`
- `OOB`, `AUC`, `ROC`

**Technical Terms:**
- `CSV`, `JSON`, `API`, `URL`, `HTTP`
- `TypeScript`, `React`, `JavaScript`

**File Formats:**
- `.csv`, `.json`, `.txt`, `.xlsx`

### Translation Guidelines

**✅ CORRECT Examples:**
```json
{
  "algorithm": {
    "kmeans": "K-means кластеризація",
    "som": "SOM (Self-Organizing Map)",
    "randomForest": "Random Forest класифікація"
  },
  "metrics": {
    "mse": "MSE (середньоквадратична помилка)",
    "accuracy": "Точність: {{value}}%"
  }
}
```

**❌ INCORRECT Examples:**
```json
{
  "algorithm": {
    "kmeans": "К-засоби кластеризація",  // Wrong!
    "som": "Самоорганізуюча карта",      // Wrong!
    "randomForest": "Випадковий ліс"     // Wrong!
  }
}
```

## Translation Workflow

### For Developers

1. **Add New Text**: Always add to English first
```typescript
// Add to appropriate namespace file
{
  "newFeature": {
    "title": "New Feature",
    "description": "Description of the new feature"
  }
}
```

2. **Run Coverage Check**:
```bash
npm run translation-coverage
```

3. **Export for Translation**:
```bash
npm run translation-export
```

4. **Validate After Translation**:
```bash
npm run translation-validate
```

### For Translators

1. **Receive CSV Export**: Get `translation-export-[lang].csv`

2. **Translation Rules**:
   - Preserve technical terms exactly as specified
   - Maintain `{{variable}}` placeholders
   - Consider cultural context and local conventions
   - Use consistent terminology across all files

3. **CSV Format**:
```csv
Namespace,Key,English,Ukrainian,Context
common,button.save,Save,Зберегти,Button label
predictor,algorithm.randomForest,Random Forest,Random Forest,Algorithm name - DO NOT TRANSLATE
```

4. **Return Completed CSV**: Send back translated file

### Integration Process

1. **Import Translations**: Update JSON files from CSV
2. **Validate**: Run validation tools
3. **Test**: Verify in application
4. **Optimize**: Run bundle optimization
5. **Deploy**: Include in next release

## Advanced Features

### Namespace Loading Strategy

**Synchronous Loading**: All namespaces loaded immediately
```typescript
// All translations available instantly
const { t } = useTranslation(['common', 'predictor', 'forecasting']);
```

**Route-Based Namespaces**: Automatic namespace detection
```typescript
// Automatically loads required namespaces for each route
const getRouteNamespaces = (pathname: string): string[] => {
  const routeMap: Record<string, string[]> = {
    '/': ['landing', 'common'],
    '/predictor': ['predictor', 'common', 'forms'],
    '/forecasting': ['forecasting', 'common', 'forms'],
    // ...
  };
  return routeMap[pathname] || ['common'];
};
```

### Bundle Optimization

**Automatic Optimization**:
- Remove unused keys
- Compress common patterns
- Optimize file sizes
- Generate performance reports

**Performance Metrics**:
```bash
Bundle Optimization Report
=========================
Original size: 125.4 KB
Optimized size: 98.7 KB
Compression: 21.3%
Load time improvement: ~15ms
```

### Validation Rules

**Key Consistency**: Ensure all languages have same keys
```typescript
const validateKeyConsistency = (languages: Record<string, any>) => {
  const englishKeys = extractKeys(languages.en);
  const missingKeys: Record<string, string[]> = {};
  
  Object.keys(languages).forEach(lang => {
    if (lang === 'en') return;
    const langKeys = extractKeys(languages[lang]);
    missingKeys[lang] = englishKeys.filter(key => !langKeys.includes(key));
  });
  
  return missingKeys;
};
```

**Technical Term Validation**:
```typescript
const technicalTerms = ['K-means', 'SOM', 'Random Forest', 'MSE', 'MAE'];
const validateTechnicalTerms = (translation: string, original: string) => {
  return technicalTerms.every(term => {
    if (original.includes(term)) {
      return translation.includes(term);
    }
    return true;
  });
};
```

## Error Handling

### Common Issues

**Missing Keys**:
```bash
Error: Missing translation key 'predictor.newFeature.title' in language 'uk'
Solution: Add missing key to uk/predictor.json
```

**Technical Term Violation**:
```bash
Warning: Technical term 'Random Forest' translated in uk/predictor.json
Key: algorithm.randomForest
Expected: "Random Forest класифікація"
Found: "Випадковий ліс класифікація"
```

**Interpolation Mismatch**:
```bash
Error: Interpolation variable mismatch in 'results.accuracy'
English: "Accuracy: {{value}}%"
Ukrainian: "Точність: {{значення}}%" // Wrong variable name
```

### Debugging Tools

**Translation Debug Mode**:
```typescript
// Enable in development
localStorage.setItem('i18n-debug', 'true');

// Shows missing keys in UI
// Highlights technical term violations
// Displays namespace loading status
```

**Console Logging**:
```typescript
// Automatic logging of translation issues
console.warn('Translation key not found:', key);
console.error('Technical term violation:', { key, expected, found });
```

## Performance Considerations

### Loading Strategy
- **Synchronous loading** for immediate availability
- **Bundle splitting** by namespace for optimization
- **Compression** for reduced file sizes
- **Caching** for improved performance

### Memory Usage
- **Lazy cleanup** of unused namespaces
- **Efficient storage** of translation data
- **Minimal runtime overhead**

### Network Optimization
- **Compressed bundles** for faster loading
- **CDN-friendly** file structure
- **Cache-friendly** naming conventions

## Future Enhancements

### Planned Features
- **Automatic translation** with AI assistance
- **Translation memory** for consistency
- **Collaborative translation** platform
- **Real-time translation** updates
- **Additional languages** (Spanish, French, German)

### Advanced Tools
- **Translation analytics** and usage tracking
- **A/B testing** for different translations
- **Context-aware** translation suggestions
- **Integration** with professional translation services

## API Reference

### Translation Utilities
```typescript
import { i18nUtils } from './lib/i18n';

// Verify namespace is loaded
const isLoaded = i18nUtils.verifyNamespace('predictor');

// Get missing keys
const missing = i18nUtils.getMissingKeys('uk', 'predictor');

// Validate technical terms
const valid = i18nUtils.validateTechnicalTerms(translation, original);
```

### Coverage Analysis
```typescript
import { analyzeCoverage } from './scripts/translation-coverage';

const report = analyzeCoverage();
console.log(report.summary);
console.log(report.namespaces);
console.log(report.missingKeys);
```

### Bundle Optimization
```typescript
import { optimizeTranslations } from './scripts/optimize-translations';

const result = optimizeTranslations();
console.log(`Saved ${result.savedBytes} bytes`);
console.log(`Compression: ${result.compressionRatio}%`);
```

## Best Practices

### For Developers
1. **Always add English first** before other languages
2. **Use descriptive keys** with namespace prefixes
3. **Group related translations** in logical namespaces
4. **Test translations** in actual UI context
5. **Run validation** before committing changes

### For Translators
1. **Preserve technical terms** exactly as specified
2. **Maintain consistency** across all files
3. **Consider cultural context** and local conventions
4. **Test translations** in the application when possible
5. **Ask questions** about unclear context or technical terms

### For Project Managers
1. **Regular coverage checks** to identify gaps
2. **Quality assurance** with native speakers
3. **Performance monitoring** of translation loading
4. **User feedback** collection for translation quality
5. **Continuous improvement** of translation processes