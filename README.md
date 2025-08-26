# NetCraft AI

A production-ready, client-side web application that combines neural network prediction and clustering analysis with a beautiful, modern UI. Crafting artificial neural networks, clustering, and forecasts in the browser. Built with React 18, TypeScript 5.2+, and Tailwind CSS 3.3+.

![NetCraft AI](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=NetCraft+AI+Dashboard)

> **🔒 Privacy-First Design**: All data processing happens entirely in your browser. Your data never leaves your device, ensuring complete privacy and security.

## Features

### 🧠 Neural Network Predictor
- Custom multilayer perceptron implementation in TypeScript
- Support for regression and classification tasks
- Configurable architecture (hidden layers, neurons, activation functions)
- Real-time training progress with loss curves
- Comprehensive evaluation metrics (MSE, MAE, R², accuracy, confusion matrix)

### 🎯 Clustering Analysis
- **K-means clustering** with k-means++ initialization
- **Self-Organizing Maps (SOM)** with rectangular topology
- Interactive visualizations and cluster analysis
- Quality metrics (silhouette score, inertia, topographic error)

### 📊 Data Management
- CSV file upload with drag-and-drop support
- Automatic column type inference (numeric, categorical, datetime)
- Data preview with statistics and column selection
- Demo datasets (Iris, Sales time series)

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Animated components with Framer Motion
- Accessible components with ARIA support
- Dark/light theme support
- Professional dashboard layout

### 💾 Export & Persistence
- Save/load models as JSON with full serialization
- Export results to CSV (predictions, clusters, centroids)
- Local storage for project state with automatic migration
- Model serialization and deserialization
- Comprehensive project reports in JSON format

### 🔄 Data Migration & Compatibility
- Automatic migration from legacy localStorage keys
- Backward compatibility with previous versions
- Seamless data preservation during updates
- Migration status tracking and error handling

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Minimum 4GB RAM recommended for large datasets

### Installation

```bash
# Clone the repository
git clone <repository-url>
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

### 2. Neural Network Prediction
- Go to **Predictor** page
- Choose input features and target variable
- Configure network architecture:
  - Hidden layers and neurons
  - Activation function (ReLU, Sigmoid, Tanh)
  - Learning rate and epochs
- Train the model and view results

### 3. Clustering Analysis
- Visit **Clusterizer** page
- Select features for clustering
- Choose method:
  - **K-means**: Specify number of clusters
  - **SOM**: Configure grid size and epochs
- Analyze cluster results and visualizations

### 4. Export Results
- Save trained models as JSON files
- Export predictions and cluster assignments as CSV
- View comprehensive analysis reports

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Common/          # Shared components (Button, Modal)
│   ├── Data/            # Data upload and preview components
│   ├── Predictor/       # Neural network UI components
│   ├── Clusterizer/     # Clustering UI components
│   ├── Landing/         # Landing page components (Hero, Features, Demo)
│   └── Layout/          # Layout components (Topbar, Sidebar, Footer)
├── lib/                 # Core logic libraries
│   ├── ann/             # Neural network implementation
│   │   ├── ann-logic-1.ts   # Model definition, forward pass
│   │   └── ann-logic-2.ts   # Training, metrics, serialization
│   ├── cluster/         # Clustering algorithms
│   │   ├── kmeans.ts        # K-means implementation
│   │   ├── som.ts           # Self-Organizing Map
│   │   └── cluster-utils.ts # Utility functions
│   └── data/            # Data processing utilities
│       ├── migration-utils.ts    # localStorage migration
│       ├── migration-init.ts     # Migration initialization
│       └── csv-utils.ts          # CSV processing utilities
├── pages/               # Page components (one per route)
│   ├── LandingPage.tsx      # Marketing landing page
│   ├── DataPage.tsx         # Data management interface
│   ├── PredictorPage.tsx    # Neural network training
│   ├── ClusterizerPage.tsx  # Clustering analysis
│   ├── ResultsPage.tsx      # Comprehensive results view
│   ├── AboutPage.tsx        # Project information
│   ├── ContactPage.tsx      # Contact form
│   ├── GuidelinesPage.tsx   # Usage guidelines
│   ├── TermsPage.tsx        # Terms of use
│   └── PrivacyPage.tsx      # Privacy policy
├── __tests__/           # Test files
├── types.d.ts          # Global TypeScript type definitions
├── routes.tsx          # Application routing configuration
├── utils.ts            # General utility functions
└── setupTests.ts       # Jest test configuration
```

## Architecture

### Neural Networks
- **Pure TypeScript implementation** for transparency
- Configurable multilayer perceptron
- Gradient descent with backpropagation
- Support for multiple activation functions
- Batch training with progress tracking

### Clustering
- **K-means** with multiple initialization strategies
- **Self-Organizing Maps** with neighborhood functions
- Quality assessment metrics
- 2D visualization support

### Data Processing
- CSV parsing with PapaParse 5.4+
- Automatic column type inference (numeric, categorical, datetime)
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
npm test             # Jest test suite with jsdom
npm test -- --coverage  # Test with coverage report

# Production
npm run build        # Build for deployment with source maps
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
- **Purpose**: Classification demo
- **Features**: Sepal/petal measurements
- **Classes**: 3 flower species
- **Size**: 30 samples, 4 features

### Sales Time Series
- **Purpose**: Regression demo
- **Features**: Temperature, promotion flags
- **Target**: Daily sales figures
- **Size**: 20 samples, 3 features

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

- **[API Documentation](docs/API.md)** - Complete API reference for all libraries
- **[Migration Guide](docs/MIGRATION.md)** - Data migration system documentation
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions

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

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |

### Performance Recommendations
- **RAM**: 4GB+ for datasets with 1000+ rows
- **CPU**: Modern multi-core processor for faster training
- **Storage**: 100MB+ free space for model persistence
- **Network**: Initial load only (fully offline after loading)

## Support

- 📧 Email: support@netcraft-ai.com
- 📖 Documentation: [docs.netcraft-ai.com](https://docs.netcraft-ai.com)
- 🐛 Issues: [GitHub Issues](https://github.com/netcraft-ai/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/netcraft-ai/discussions)

## Roadmap

### Version 1.1
- [ ] Advanced neural network architectures (CNN, RNN)
- [ ] More clustering algorithms (DBSCAN, Hierarchical)
- [ ] Enhanced data preprocessing tools
- [ ] Model comparison and ensemble methods

### Version 1.2
- [ ] Cloud deployment integration
- [ ] User accounts and project sharing
- [ ] Advanced visualizations with D3.js
- [ ] API endpoints for model serving

### Version 2.0
- [ ] Real-time data streaming
- [ ] AutoML capabilities
- [ ] Advanced hyperparameter optimization
- [ ] Integration with popular ML libraries

---

Built with ❤️ using React, TypeScript, and modern web technologies.