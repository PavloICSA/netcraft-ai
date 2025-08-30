# NetCraft AI

A comprehensive, client-side machine learning web application that combines neural network prediction, random forest classification, clustering analysis, and time series forecasting with a modern, accessible UI. Crafting artificial neural networks, ensemble methods, clustering, and forecasts entirely in the browser. Built with React 18, TypeScript 5.2+, Tailwind CSS 3.3+, and comprehensive internationalization support.


> **🔒 Privacy-First Design**: All data processing happens entirely in your browser. Your data never leaves your device, ensuring complete privacy and security.

## Features

### 🧠 Neural Network Predictor
- **Custom multilayer perceptron** implementation in TypeScript
- Support for **regression and classification** tasks
- **Configurable architecture** (hidden layers, neurons, activation functions)
- **Real-time training progress** with loss curves and epoch tracking
- **Comprehensive evaluation metrics** (MSE, MAE, R², accuracy, confusion matrix)
- **Data normalization and preprocessing** for optimal training performance
- **Model serialization** for persistence and deployment

### 🌳 Random Forest Classifier
- **Ensemble learning** with decision trees and bootstrap aggregating (bagging)
- **Feature importance analysis** with mean decrease in impurity
- **Out-of-bag (OOB) scoring** for model validation without separate test set
- **Support for both classification and regression** tasks
- **Configurable parameters** (trees, depth, sampling ratios, random seed)
- **Batch prediction capabilities** with confidence scores and tree voting
- **Feature sampling strategies** (sqrt, log2, all, custom ratio)

### 📈 Time Series Forecasting
- **Moving Average** forecasting with configurable window sizes
- **Exponential Smoothing** (simple and double/Holt's method) with trend support
- **Linear Trend** analysis with polynomial regression capabilities
- **Comprehensive forecast metrics** (MAE, RMSE, MAPE, R²)
- **Confidence intervals** and prediction uncertainty quantification
- **Automatic frequency detection** and time series preprocessing
- **Missing value handling** and data validation
- **Train/test split** for model validation

### 🎯 Clustering Analysis
- **K-means clustering** with k-means++ initialization and elbow method
- **Self-Organizing Maps (SOM)** with rectangular and hexagonal topologies
- **Interactive visualizations** and cluster analysis with U-Matrix
- **Quality metrics** (silhouette score, inertia, topographic error)
- **Principal Component Analysis (PCA)** for dimensionality reduction
- **Data normalization and standardization** utilities

### 📊 Data Management
- **CSV file upload** with drag-and-drop support and validation
- **Automatic column type inference** (numeric, categorical, datetime)
- **Time series data preprocessing** and validation with gap detection
- **Data preview** with comprehensive statistics and column selection
- **Demo datasets** (Iris classification, Sales regression, Time series forecasting)
- **Data export** capabilities with CSV generation

### 🎨 Modern UI/UX
- **Responsive design** with Tailwind CSS and mobile optimization
- **Animated components** with Framer Motion for smooth transitions
- **Accessible components** with comprehensive ARIA support
- **Dark/light/system theme support** with automatic detection
- **Professional dashboard layout** with sidebar navigation
- **Interactive charts** with Chart.js integration
- **Loading states** and progress indicators

### 🌍 Internationalization (i18n)
- **Bilingual support** (English and Ukrainian) with 100% coverage
- **Lazy loading** of translation namespaces for performance
- **Technical term preservation** (algorithm names, metrics remain in English)
- **Locale-aware formatting** for numbers and dates
- **Accessibility announcements** for language changes
- **Translation management tools** (coverage analysis, validation, export)
- **Bundle optimization** for efficient loading

### 💾 Export & Persistence
- **Save/load models** as JSON with full serialization support
- **Export results** to CSV (predictions, clusters, forecasts, feature importance)
- **Local storage** for project state with automatic migration system
- **Model serialization** and deserialization with version compatibility
- **Comprehensive project reports** in JSON format with metadata
- **Image export** capabilities for charts and visualizations

### 🔄 Data Migration & Compatibility
- **Automatic migration** from legacy localStorage keys (neuroxl-* to netcraft-*)
- **Backward compatibility** with previous versions and graceful fallbacks
- **Seamless data preservation** during updates with error handling
- **Migration status tracking** and comprehensive logging
- **Safe cleanup** of old keys after successful migration

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Minimum 4GB RAM recommended for large datasets

### Installation

```bash
# Clone the repository
git clone https://github.com/PavloICSA/netcraft-ai.git
cd netcraft-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage Guide

### 1. Upload Data
- Navigate to the **Data** page
- Upload a CSV file or try demo datasets
- Review column types and statistics
- Select columns for analysis

### 2. Machine Learning Prediction
- Go to **Predictor** page
- Choose between Neural Networks and Random Forest
- Select input features and target variable
- Configure model parameters:
  - **Neural Networks**: Hidden layers, activation functions, learning rate
  - **Random Forest**: Number of trees, max depth, feature sampling
- Train the model and view results with feature importance

### 3. Time Series Forecasting
- Visit **Forecasting** page
- Upload time series data with timestamp and value columns
- Choose forecasting method:
  - **Moving Average**: Simple trend following
  - **Exponential Smoothing**: Weighted historical data
  - **Linear Trend**: Polynomial trend analysis
- Configure forecast horizon and confidence levels
- Analyze forecast accuracy with comprehensive metrics

### 4. Clustering Analysis
- Visit **Clusterizer** page
- Select features for clustering
- Choose method:
  - **K-means**: Specify number of clusters
  - **SOM**: Configure grid size and epochs
- Analyze cluster results and visualizations

### 5. Export Results
- Save trained models as JSON files
- Export predictions, forecasts, and cluster assignments as CSV
- View comprehensive analysis reports with all model results

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Common/          # Shared components (Button, Modal, LocaleNumber, LanguageToggle)
│   ├── Data/            # Data upload and preview components
│   ├── Predictor/       # Neural network and Random Forest UI components
│   ├── Forecasting/     # Time series forecasting UI components
│   ├── Clusterizer/     # Clustering UI components
│   ├── Landing/         # Landing page components (Hero, Features, Demo)
│   └── Layout/          # Layout components (Topbar, Sidebar, Footer)
├── lib/                 # Core logic libraries
│   ├── ann/             # Neural network implementation
│   │   ├── ann-logic-1.ts   # Model definition, forward pass
│   │   └── ann-logic-2.ts   # Training, metrics, serialization
│   ├── random-forest/   # Random Forest implementation
│   │   ├── RandomForest.ts  # Random Forest classifier
│   │   ├── DecisionTree.ts  # Decision tree implementation
│   │   ├── feature-importance.ts # Feature importance analysis
│   │   └── rf-utils.ts      # Random Forest utilities
│   ├── forecasting/     # Time series forecasting algorithms
│   │   ├── algorithms/      # Forecasting algorithm implementations
│   │   │   ├── moving-average.ts    # Moving average forecaster
│   │   │   ├── exponential-smoothing.ts # Exponential smoothing
│   │   │   └── linear-trend.ts      # Linear trend analysis
│   │   ├── metrics/         # Forecasting evaluation metrics
│   │   │   └── forecast-metrics.ts  # MAE, RMSE, MAPE calculations
│   │   ├── base-forecaster.ts # Base forecasting interface
│   │   └── types.ts         # Forecasting type definitions
│   ├── cluster/         # Clustering algorithms
│   │   ├── kmeans.ts        # K-means implementation
│   │   ├── som.ts           # Self-Organizing Map
│   │   └── cluster-utils.ts # Utility functions
│   ├── i18n/            # Internationalization utilities
│   │   ├── index.ts         # i18n configuration
│   │   ├── bundle-optimizer.ts # Translation optimization
│   │   ├── csv-export.ts    # Translation export utilities
│   │   └── validation.ts    # Translation validation
│   └── data/            # Data processing utilities
│       ├── migration-utils.ts    # localStorage migration
│       ├── migration-init.ts     # Migration initialization
│       └── csv-utils.ts          # CSV processing utilities
├── locales/             # Translation files
│   ├── en/              # English translations
│   │   ├── common.json      # Shared UI elements
│   │   ├── predictor.json   # ML prediction interface
│   │   ├── forecasting.json # Time series forecasting
│   │   ├── clusterizer.json # Clustering interface
│   │   └── [other namespaces]
│   └── uk/              # Ukrainian translations
│       └── [same structure as en/]
├── pages/               # Page components (one per route)
│   ├── LandingPage.tsx      # Marketing landing page
│   ├── DataPage.tsx         # Data management interface
│   ├── PredictorPage.tsx    # Neural network and Random Forest training
│   ├── ForecastingPage.tsx  # Time series forecasting
│   ├── ClusterizerPage.tsx  # Clustering analysis
│   ├── ResultsPage.tsx      # Comprehensive results view
│   ├── AboutPage.tsx        # Project information
│   ├── ContactPage.tsx      # Contact form
│   ├── GuidelinesPage.tsx   # Usage guidelines
│   ├── *InfoPage.tsx        # Information pages for each ML method
│   ├── TermsPage.tsx        # Terms of use
│   └── PrivacyPage.tsx      # Privacy policy
├── contexts/            # React contexts
│   ├── ProjectContext.tsx   # Global project state management
│   └── ThemeContext.tsx     # Theme system (dark/light/system)
├── hooks/               # Custom React hooks
│   └── useLocale.ts         # Internationalization hook
├── utils/               # Utility functions and hooks
│   ├── image-export.ts      # Chart and visualization export
│   └── useScrollToTop.ts    # Scroll management hook
├── types.d.ts          # Global TypeScript type definitions
├── routes.tsx          # Application routing configuration
└── utils.ts            # General utility functions
```

## Architecture

### Neural Networks
- **Pure TypeScript implementation** for transparency
- Configurable multilayer perceptron
- Gradient descent with backpropagation
- Support for multiple activation functions (ReLU, Sigmoid, Tanh)
- Batch training with progress tracking
- Data normalization for optimal training performance

### Random Forest
- **Ensemble learning** with bootstrap aggregating
- **Decision tree** implementation with CART algorithm
- **Feature importance** calculation using mean decrease in impurity
- **Out-of-bag scoring** for model validation without separate test set
- Support for both classification and regression tasks
- Configurable parameters (number of trees, max depth, feature sampling)

### Time Series Forecasting
- **Moving Average** with configurable window sizes
- **Exponential Smoothing** (simple and double/Holt's method)
- **Linear Trend** analysis with polynomial regression
- Comprehensive forecast evaluation metrics (MAE, RMSE, MAPE, R²)
- Confidence intervals and prediction uncertainty quantification
- Automatic time series preprocessing and frequency detection

### Clustering
- **K-means** with multiple initialization strategies
- **Self-Organizing Maps** with neighborhood functions
- Quality assessment metrics
- 2D visualization support

### Data Processing
- CSV parsing with PapaParse 5.4+
- Automatic column type inference (numeric, categorical, datetime)
- Time series data preprocessing and validation
- Statistical analysis and data profiling
- Data validation and cleaning utilities
- Demo datasets with realistic examples

### Privacy & Security
- **100% Client-Side Processing**: No server dependencies
- **Zero Data Collection**: Your data never leaves your browser
- **Local Storage Only**: Complete control over your data
- **Open Source**: Transparent and auditable codebase

## Development

### Technology Stack
- **Frontend**: React 18.2+ with TypeScript 5.2+ (strict mode)
- **Build Tool**: Vite 4.5+ with React plugin and HMR
- **Styling**: Tailwind CSS 3.3+ with custom design system
- **Routing**: React Router DOM 6.20+ with SPA configuration
- **Animation**: Framer Motion 10.16+ for smooth transitions
- **Charts**: Chart.js 4.4+ with React Chart.js 2 integration

### Code Quality
- **TypeScript strict mode** for comprehensive type safety
- **ESLint** with TypeScript and React hooks plugins
- **Prettier** for consistent code formatting (single quotes, 100 char width)
- **Jest** with jsdom environment and React Testing Library
- **Comprehensive test coverage** for core ML algorithms

### Development Commands

```bash
# Development
npm run dev          # Start dev server on port 3000 with auto-open
npm run build        # TypeScript compile + Vite build
npm run preview      # Preview production build

# Code Quality
npm run lint         # ESLint check with TypeScript rules
npm run format       # Prettier formatting (single quotes, 2 spaces)

# Translation Management
npm run translation-coverage    # Check translation completeness across all namespaces
npm run translation-validate    # Validate translation files and technical term preservation
npm run translation-export      # Export translations to CSV for translators
npm run translation-all         # Run all translation tools (coverage, validation, export)
npm run translation-optimize    # Optimize translation bundles for performance
npm run translation-optimize-save # Save optimized translations back to files

# Production
npm run build        # Build for deployment with source maps and optimization
```

### Build Configuration
- **Output Directory**: `dist/` with organized assets
- **Base Path**: Relative (`./`) for flexible deployment
- **Source Maps**: Enabled for debugging
- **Dev Server**: Auto-opens browser on localhost:3000
- **Asset Optimization**: Automatic bundling and minification

## Deployment

### Vercel (Recommended)

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy automatically on push

### Netlify

1. Build the project: `npm run build`
2. Upload `dist/` folder to Netlify
3. Configure redirects for SPA routing

### Manual Deployment

```bash
# Build for production
npm run build

# Serve the dist/ folder with any static file server
npx serve dist
```

## Demo Datasets

### Iris Dataset
- **Purpose**: Classification demo (Neural Networks, Random Forest)
- **Features**: Sepal/petal measurements
- **Classes**: 3 flower species
- **Size**: 30 samples, 4 features

### Sales Time Series
- **Purpose**: Regression demo (Neural Networks, Random Forest)
- **Features**: Temperature, promotion flags
- **Target**: Daily sales figures
- **Size**: 20 samples, 3 features

### Forecasting Demo Data
- **Purpose**: Time series forecasting demo
- **Features**: Daily sales with seasonal patterns
- **Frequency**: Daily observations
- **Size**: 100+ time points with trend and seasonality

## API Reference

### Neural Network API

```typescript
import { createModel, trainModel, predict, evaluateModel } from './lib/ann/ann-logic-1';
import { serializeModel, deserializeModel } from './lib/ann/ann-logic-2';

// Create model with configuration
const config: ANNConfig = {
  inputSize: 4,
  hiddenLayers: [10, 5],
  outputSize: 1,
  activationFunction: 'relu',
  learningRate: 0.01,
  epochs: 100,
  batchSize: 32,
  taskType: 'regression'
};
const model = createModel(config);

// Train model with progress callback
await trainModel(model, inputs, targets, (epoch, loss, accuracy) => {
  console.log(`Epoch ${epoch}: Loss ${loss}, Accuracy ${accuracy}`);
});

// Make predictions
const predictions = predict(model, testInputs);

// Evaluate performance
const metrics = evaluateModel(model, testInputs, testTargets);

// Serialize/deserialize models
const modelJson = serializeModel(model);
const loadedModel = deserializeModel(modelJson);
```

### Random Forest API

```typescript
import { RandomForest } from './lib/random-forest/RandomForest';
import { calculateFeatureImportance } from './lib/random-forest/feature-importance';

// Create and train Random Forest
const config: RandomForestConfig = {
  numTrees: 100,
  maxDepth: 10,
  minSamplesLeaf: 1,
  featureSamplingRatio: 'sqrt',
  taskType: 'classification',
  bootstrapSampleRatio: 1.0
};

const rf = new RandomForest(config);
const model = await rf.train(features, targets, featureNames, (progress, treesCompleted) => {
  console.log(`Progress: ${progress}%, Trees: ${treesCompleted}`);
});

// Make predictions with confidence
const prediction = rf.predict([1.5, 2.3, 0.8, 1.2]);
console.log(prediction.prediction, prediction.confidence);

// Batch predictions
const predictions = rf.predictBatch(testFeatures);

// Feature importance analysis
const importance = calculateFeatureImportance(model.featureImportance, featureNames);
```

### Time Series Forecasting API

```typescript
import { MovingAverageForecaster } from './lib/forecasting/algorithms/moving-average';
import { ExponentialSmoothingForecaster } from './lib/forecasting/algorithms/exponential-smoothing';
import { LinearTrendForecaster } from './lib/forecasting/algorithms/linear-trend';
import { createTimeSeriesData } from './lib/data/csv-utils';

// Prepare time series data
const timeSeriesData = createTimeSeriesData(timestamps, values);

// Moving Average Forecasting
const maForecaster = new MovingAverageForecaster();
const maConfig: ForecastConfig = {
  method: 'moving-average',
  parameters: { windowSize: 5 },
  forecastHorizon: 10,
  trainTestSplit: 0.8,
  confidenceLevel: 0.95
};

maForecaster.fit(timeSeriesData, maConfig);
const maResult = maForecaster.predict(10);

// Exponential Smoothing
const esForecaster = new ExponentialSmoothingForecaster();
const esConfig: ForecastConfig = {
  method: 'exponential-smoothing',
  parameters: { alpha: 0.3, beta: 0.2 },
  forecastHorizon: 10,
  trainTestSplit: 0.8,
  confidenceLevel: 0.95
};

esForecaster.fit(timeSeriesData, esConfig);
const esResult = esForecaster.predict(10);

// Access forecast results
console.log(esResult.predictions); // Future values
console.log(esResult.confidenceIntervals); // Uncertainty bounds
console.log(esResult.metrics); // MAE, RMSE, MAPE, R²
```

### Clustering API

```typescript
import { kMeans, trainSOM } from './lib/cluster/';
import { calculateSilhouetteScore, findOptimalK } from './lib/cluster/kmeans';

// K-means clustering with k-means++ initialization
const kmeansResult = kMeans(data, {
  k: 3,
  maxIterations: 100,
  tolerance: 1e-6,
  initMethod: 'kmeans++'
});

// Self-Organizing Map with configurable topology
const somResult = trainSOM(data, {
  gridSize: [10, 10],
  epochs: 1000,
  learningRate: 0.1,
  neighborhoodRadius: 5,
  topology: 'rectangular'
});

// Quality assessment
const silhouetteScore = calculateSilhouetteScore(data, kmeansResult.clusters);
const optimalK = findOptimalK(data, 10);
```

### Data Processing API

```typescript
import { storageUtils } from './lib/data/migration-utils';
import { arrayToCSV, inferDataType, calculateNumericStats } from './lib/data/csv-utils';

// Storage with automatic migration
const projectState = storageUtils.getProjectState();
storageUtils.setProjectState(JSON.stringify(newState));

// CSV utilities
const csvString = arrayToCSV(dataArray);
const columnType = inferDataType(columnValues);
const stats = calculateNumericStats(numericValues);
```

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[API Documentation](docs/API.md)** - Complete API reference for all libraries and utilities
- **[Random Forest Guide](docs/RANDOM_FOREST.md)** - Comprehensive Random Forest implementation guide
- **[Time Series Forecasting Guide](docs/FORECASTING.md)** - Forecasting algorithms and best practices
- **[Translation Tooling Guide](docs/TRANSLATION_TOOLING.md)** - Internationalization and translation management
- **[Data Migration Guide](docs/MIGRATION.md)** - Data migration system and backward compatibility
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions and optimization

## Internationalization

NetCraft AI provides comprehensive internationalization (i18n) with advanced translation management:

### Supported Languages
- **English (en)** - Default language with complete coverage
- **Ukrainian (uk)** - Full translation support with 100% coverage and cultural adaptation

### Advanced Translation Features
- **Synchronous Loading**: All translation namespaces loaded immediately for instant availability
- **Technical Term Preservation**: Algorithm names and metrics remain in English for consistency
- **Locale-Aware Formatting**: Numbers, dates, and currencies formatted per user's locale
- **Accessibility Integration**: Screen reader announcements for language changes
- **Error Boundaries**: Graceful handling of translation loading failures with fallbacks
- **Bundle Optimization**: Automatic optimization and compression of translation files
- **Coverage Analysis**: Real-time translation completeness tracking and reporting
- **Validation Tools**: Automated checking for missing keys and technical term preservation

### For Translators

#### Translation File Structure
```
src/locales/
├── en/                 # English translations (reference)
│   ├── common.json     # Shared UI elements
│   ├── landing.json    # Landing page content
│   ├── data.json       # Data management interface
│   ├── predictor.json  # Neural network interface
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

#### Technical Term Preservation Guidelines

**PRESERVE UNCHANGED** (keep in English):
- Algorithm names: `K-means`, `SOM`, `Random Forest`, `Neural Network`
- Metric abbreviations: `MSE`, `MAE`, `RMSE`, `MAPE`, `R²`
- Technical terms: `CSV`, `JSON`, `API`, `URL`, `HTTP`
- File formats: `.csv`, `.json`, `.txt`
- Programming concepts: `TypeScript`, `React`, `JavaScript`

**TRANSLATE** (adapt to target language):
- UI labels and buttons
- Help text and descriptions
- Error messages
- Form validation messages
- Marketing copy and features

#### Translation Workflow

1. **Export for Translation**:
   ```bash
   npm run translation:export
   ```
   This generates `translation-export-[lang].csv` files for translators.

2. **Validate Translations**:
   ```bash
   npm run translation:validate
   ```
   Checks for missing keys and technical term preservation.

3. **Coverage Report**:
   ```bash
   npm run translation:coverage
   ```
   Shows translation completeness across all namespaces.

#### Translation Quality Guidelines

- **Context Awareness**: Consider the UI context when translating
- **Consistency**: Use consistent terminology across all files
- **Pluralization**: Follow target language pluralization rules
- **Interpolation**: Preserve `{{variable}}` placeholders exactly
- **Technical Accuracy**: Maintain technical meaning while adapting language
- **Cultural Adaptation**: Adapt examples and references to target culture

#### Example Translation Patterns

```json
// ✅ CORRECT - Technical terms preserved
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

// ❌ INCORRECT - Technical terms translated
{
  "algorithm": {
    "kmeans": "К-засоби кластеризація",  // Wrong!
    "som": "Самоорганізуюча карта",      // Wrong!
    "randomForest": "Випадковий ліс"     // Wrong!
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and add tests
4. Run linting and tests: `npm run lint && npm test`
5. Commit changes: `git commit -m "Add feature"`
6. Push to branch: `git push origin feature-name`
7. Create a Pull Request

### Development Guidelines

- Follow TypeScript strict mode conventions
- Write comprehensive tests for new features
- Update documentation for API changes
- Use semantic commit messages
- Ensure backward compatibility when possible
- Follow internationalization guidelines for new UI text

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Browser Compatibility

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 90+ | ✅ Fully Supported | Recommended for best performance |
| Firefox | 88+ | ✅ Fully Supported | Full feature compatibility |
| Safari | 14+ | ✅ Fully Supported | Excellent on macOS and iOS |
| Edge | 90+ | ✅ Fully Supported | Chromium-based versions |

### Performance Recommendations
- **RAM**: 4GB+ for datasets with 1000+ rows, 8GB+ for large Random Forest models
- **CPU**: Modern multi-core processor for faster training (Random Forest benefits from multiple cores)
- **Storage**: 100MB+ free localStorage space for model persistence and data migration
- **Network**: Initial load only (fully offline after loading, ~2-5MB initial bundle)
- **Display**: 1024x768+ resolution for optimal dashboard experience

## Support

- 📧 Email: pavel.likhovid@gmail.com
- 📖 Documentation: [docs.netcraft-ai.com](https://docs.netcraft-ai.com)
- 🐛 Issues: [GitHub Issues](https://github.com/PavloICSA/netcraft-ai/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/PavloICSA/netcraft-ai/discussions)

## Roadmap

### Version 1.1 (Current - Released)
- [x] **Random Forest implementation** with feature importance and OOB scoring
- [x] **Time series forecasting** (Moving Average, Exponential Smoothing, Linear Trend)
- [x] **Comprehensive internationalization** (English/Ukrainian) with 100% coverage
- [x] **Enhanced data preprocessing** and validation with automatic type inference
- [x] **Project state management** with automatic migration from legacy keys
- [x] **Batch prediction capabilities** with confidence scoring
- [x] **Confidence intervals** for forecasting with uncertainty quantification
- [x] **Dark/light/system theme support** with automatic detection
- [x] **Advanced translation tooling** with coverage analysis and validation
- [x] **Image export capabilities** for charts and visualizations

### Version 1.2 (Planned - Q3 2025)
- [ ] **Additional forecasting algorithms** (ARIMA, Seasonal ARIMA, Prophet)
- [ ] **More clustering algorithms** (DBSCAN, Hierarchical clustering, Gaussian Mixture)
- [ ] **Advanced neural network architectures** (CNN for image data, RNN/LSTM for sequences)
- [ ] **Model comparison framework** with automated benchmarking
- [ ] **Enhanced data visualization** with D3.js interactive charts
- [ ] **Hyperparameter optimization** with grid search and random search
- [ ] **Model interpretability** features (SHAP values, feature attribution)

### Version 1.3 (Future - Q4 2025)
- [ ] **Web Workers integration** for background processing and performance
- [ ] **Advanced data preprocessing** (feature engineering, automated cleaning)
- [ ] **Real-time model monitoring** and performance tracking
- [ ] **Additional language support** (Spanish, French, German)
- [ ] **Cloud deployment integration** with major platforms
- [ ] **API endpoints** for model serving and integration
- [ ] **Mobile-responsive enhancements** for tablet and phone usage

### Version 2.0 (Long-term - 2026)
- [ ] **Real-time data streaming** capabilities with WebSocket support
- [ ] **AutoML capabilities** for automated model selection and tuning
- [ ] **Advanced ensemble methods** (stacking, blending, voting)
- [ ] **Integration with popular ML libraries** (TensorFlow.js, ML5.js)
- [ ] **User accounts and project sharing** with cloud synchronization
- [ ] **Collaborative features** for team-based model development
- [ ] **Advanced deployment options** (Docker, Kubernetes, serverless)

---

Built with ❤️ using React, TypeScript, and modern web technologies.
