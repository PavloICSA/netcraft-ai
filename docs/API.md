# NetCraft AI API Documentation

This document provides comprehensive API documentation for NetCraft AI's machine learning libraries and utilities.

## Table of Contents

- [Neural Networks](#neural-networks)
- [Random Forest](#random-forest)
- [Time Series Forecasting](#time-series-forecasting)
- [Clustering](#clustering)
- [Data Processing](#data-processing)
- [Storage & Migration](#storage--migration)
- [Types & Interfaces](#types--interfaces)

## Neural Networks

### Core Functions

#### `createModel(config: ANNConfig): ANNModel`

Creates a new neural network model with the specified configuration.

```typescript
import { createModel } from './lib/ann/ann-logic-1';

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
```

**Parameters:**
- `config`: Neural network configuration object

**Returns:**
- `ANNModel`: Initialized model with random weights and biases

#### `trainModel(model: ANNModel, inputs: number[][], targets: number[][], onProgress?: TrainingProgressCallback): Promise<TrainingHistory>`

Trains the neural network using gradient descent with backpropagation.

```typescript
import { trainModel } from './lib/ann/ann-logic-2';

const history = await trainModel(
  model,
  trainInputs,
  trainTargets,
  (epoch, loss, accuracy) => {
    console.log(`Epoch ${epoch}: Loss ${loss.toFixed(6)}`);
  }
);
```

**Parameters:**
- `model`: The model to train
- `inputs`: Training input data (2D array)
- `targets`: Training target data (2D array)
- `onProgress`: Optional callback for training progress

**Returns:**
- `Promise<TrainingHistory>`: Training history with loss and accuracy

#### `predict(model: ANNModel, inputs: number[][]): number[][]`

Makes predictions using the trained model.

```typescript
import { predict } from './lib/ann/ann-logic-2';

const predictions = predict(model, testInputs);
```

**Parameters:**
- `model`: Trained model
- `inputs`: Input data for prediction

**Returns:**
- `number[][]`: Predictions array

#### `evaluateModel(model: ANNModel, testInputs: number[][], testTargets: number[][]): PredictionResult`

Evaluates model performance on test data.

```typescript
import { evaluateModel } from './lib/ann/ann-logic-2';

const evaluation = evaluateModel(model, testInputs, testTargets);
console.log(evaluation.metrics.mse); // For regression
console.log(evaluation.metrics.accuracy); // For classification
```

**Parameters:**
- `model`: Trained model
- `testInputs`: Test input data
- `testTargets`: Test target data

**Returns:**
- `PredictionResult`: Evaluation metrics and predictions

### Model Serialization

#### `serializeModel(model: ANNModel): string`

Serializes a model to JSON string for storage.

```typescript
import { serializeModel } from './lib/ann/ann-logic-2';

const modelJson = serializeModel(model);
localStorage.setItem('my-model', modelJson);
```

#### `deserializeModel(jsonString: string): ANNModel`

Deserializes a model from JSON string.

```typescript
import { deserializeModel } from './lib/ann/ann-logic-2';

const modelJson = localStorage.getItem('my-model');
const model = deserializeModel(modelJson);
```

### Activation Functions

Available activation functions and their derivatives:

```typescript
import { activationFunctions } from './lib/ann/ann-logic-1';

// Available functions
activationFunctions.relu(x);
activationFunctions.sigmoid(x);
activationFunctions.tanh(x);

// Derivatives
activationFunctions.reluDerivative(x);
activationFunctions.sigmoidDerivative(x);
activationFunctions.tanhDerivative(x);
```

## Random Forest

### Core Functions

#### `RandomForest` Class

Main class for Random Forest ensemble learning.

```typescript
import { RandomForest } from './lib/random-forest/RandomForest';

const config: RandomForestConfig = {
  numTrees: 100,
  maxDepth: 10,
  minSamplesLeaf: 1,
  featureSamplingRatio: 'sqrt',
  taskType: 'classification',
  bootstrapSampleRatio: 1.0,
  randomSeed: 42
};

const rf = new RandomForest(config);
```

#### `train(features: number[][], targets: number[], featureNames: string[], onProgress?: ProgressCallback): Promise<RandomForestModel>`

Trains the Random Forest model with bootstrap aggregating.

```typescript
const model = await rf.train(
  features,
  targets,
  featureNames,
  (progress, treesCompleted) => {
    console.log(`Progress: ${progress}%, Trees: ${treesCompleted}/${config.numTrees}`);
  }
);

console.log(model.oobScore); // Out-of-bag score
console.log(model.featureImportance); // Feature importance scores
```

**Parameters:**
- `features`: Training feature data (2D array)
- `targets`: Training target data (1D array)
- `featureNames`: Names of features for importance analysis
- `onProgress`: Optional callback for training progress

**Returns:**
- `Promise<RandomForestModel>`: Trained model with trees and metadata

#### `predict(features: number[]): RandomForestPrediction`

Makes a single prediction with confidence score.

```typescript
const prediction = rf.predict([1.5, 2.3, 0.8, 1.2]);
console.log(prediction.prediction); // Predicted class/value
console.log(prediction.confidence); // Confidence score (0-1)
console.log(prediction.treeVotes); // Individual tree votes (classification)
```

**Parameters:**
- `features`: Input features for prediction

**Returns:**
- `RandomForestPrediction`: Prediction with confidence and tree votes

#### `predictBatch(features: number[][]): RandomForestPrediction[]`

Makes batch predictions for multiple samples.

```typescript
const predictions = rf.predictBatch(testFeatures);
predictions.forEach((pred, i) => {
  console.log(`Sample ${i}: ${pred.prediction} (${(pred.confidence * 100).toFixed(1)}%)`);
});
```

#### `serialize(): RandomForestModel`

Serializes the trained model for storage.

```typescript
const serializedModel = rf.serialize();
const modelJson = JSON.stringify(serializedModel);
localStorage.setItem('rf-model', modelJson);
```

#### `RandomForest.deserialize(model: RandomForestModel): RandomForest`

Deserializes a model from storage.

```typescript
const modelJson = localStorage.getItem('rf-model');
const modelData = JSON.parse(modelJson);
const rf = RandomForest.deserialize(modelData);
```

### Feature Importance

#### `calculateFeatureImportance(importanceScores: number[], featureNames: string[]): FeatureImportance[]`

Calculates and ranks feature importance.

```typescript
import { calculateFeatureImportance } from './lib/random-forest/feature-importance';

const importance = calculateFeatureImportance(model.featureImportance, featureNames);
importance.forEach(feature => {
  console.log(`${feature.featureName}: ${(feature.importance * 100).toFixed(2)}% (rank ${feature.rank})`);
});
```

### Random Forest Utilities

#### `prepareTrainingData(data: Record<string, any>[], targetColumn: string, inputColumns: string[])`

Prepares data for Random Forest training.

```typescript
import { prepareTrainingData } from './lib/random-forest/rf-utils';

const trainingData = prepareTrainingData(dataset, 'target', ['feature1', 'feature2']);
console.log(trainingData.taskType); // 'classification' or 'regression'
```

#### `validateRandomForestConfig(config: RandomForestConfig): string[]`

Validates Random Forest configuration.

```typescript
import { validateRandomForestConfig } from './lib/random-forest/rf-utils';

const errors = validateRandomForestConfig(config);
if (errors.length > 0) {
  console.error('Configuration errors:', errors);
}
```

## Time Series Forecasting

### Base Forecaster Interface

All forecasting algorithms implement the `IForecaster` interface:

```typescript
interface IForecaster {
  fit(data: TimeSeriesData, config: ForecastConfig): void;
  predict(horizon: number): ForecastResult;
  isTrained(): boolean;
  getMethodName(): string;
}
```

### Moving Average Forecaster

#### `MovingAverageForecaster` Class

Simple moving average forecasting.

```typescript
import { MovingAverageForecaster } from './lib/forecasting/algorithms/moving-average';

const forecaster = new MovingAverageForecaster();
const config: ForecastConfig = {
  method: 'moving-average',
  parameters: { windowSize: 5 },
  forecastHorizon: 10,
  trainTestSplit: 0.8,
  confidenceLevel: 0.95
};

forecaster.fit(timeSeriesData, config);
const result = forecaster.predict(10);
```

### Exponential Smoothing Forecaster

#### `ExponentialSmoothingForecaster` Class

Exponential smoothing with optional trend (Holt's method).

```typescript
import { ExponentialSmoothingForecaster } from './lib/forecasting/algorithms/exponential-smoothing';

const forecaster = new ExponentialSmoothingForecaster();

// Simple exponential smoothing
const simpleConfig: ForecastConfig = {
  method: 'exponential-smoothing',
  parameters: { alpha: 0.3 },
  forecastHorizon: 10,
  trainTestSplit: 0.8,
  confidenceLevel: 0.95
};

// Double exponential smoothing (with trend)
const doubleConfig: ForecastConfig = {
  method: 'exponential-smoothing',
  parameters: { alpha: 0.3, beta: 0.2 },
  forecastHorizon: 10,
  trainTestSplit: 0.8,
  confidenceLevel: 0.95
};

forecaster.fit(timeSeriesData, doubleConfig);
const result = forecaster.predict(10);
```

### Linear Trend Forecaster

#### `LinearTrendForecaster` Class

Linear regression-based trend forecasting.

```typescript
import { LinearTrendForecaster } from './lib/forecasting/algorithms/linear-trend';

const forecaster = new LinearTrendForecaster();
const config: ForecastConfig = {
  method: 'linear-trend',
  parameters: { polynomialDegree: 1 },
  forecastHorizon: 10,
  trainTestSplit: 0.8,
  confidenceLevel: 0.95
};

forecaster.fit(timeSeriesData, config);
const result = forecaster.predict(10);

// Access trend parameters
console.log(forecaster.getSlope());
console.log(forecaster.getIntercept());
```

### Forecast Metrics

#### Forecast Accuracy Metrics

```typescript
import { 
  calculateMAE, 
  calculateRMSE, 
  calculateMAPE, 
  calculateAllMetrics,
  formatMetrics 
} from './lib/forecasting/metrics/forecast-metrics';

// Individual metrics
const mae = calculateMAE(actual, predicted);
const rmse = calculateRMSE(actual, predicted);
const mape = calculateMAPE(actual, predicted);

// All metrics at once
const metrics = calculateAllMetrics(actual, predicted);

// Formatted for display
const formatted = formatMetrics(metrics);
console.log(formatted.MAE, formatted.RMSE, formatted.MAPE);
```

### Time Series Data Processing

#### `createTimeSeriesData(timestamps: Date[], values: number[], options?: TimeSeriesOptions): TimeSeriesData`

Creates time series data structure with metadata.

```typescript
import { createTimeSeriesData } from './lib/data/csv-utils';

const timeSeriesData = createTimeSeriesData(timestamps, values, {
  handleMissing: 'forward-fill'
});

console.log(timeSeriesData.metadata.frequency); // 'daily', 'weekly', etc.
console.log(timeSeriesData.metadata.hasGaps); // boolean
```

#### `detectTimeSeriesFrequency(timestamps: Date[]): string`

Automatically detects time series frequency.

```typescript
import { detectTimeSeriesFrequency } from './lib/data/csv-utils';

const frequency = detectTimeSeriesFrequency(timestamps);
// Returns: 'daily', 'weekly', 'monthly', or 'irregular'
```

## Clustering

### K-Means Clustering

#### `kMeans(data: number[][], config: KMeansConfig): ClusterResult`

Performs k-means clustering on the provided data.

```typescript
import { kMeans } from './lib/cluster/kmeans';

const result = kMeans(data, {
  k: 3,
  maxIterations: 100,
  tolerance: 1e-6,
  initMethod: 'kmeans++'
});

console.log(result.clusters); // Cluster assignments
console.log(result.centroids); // Cluster centers
console.log(result.inertia); // Within-cluster sum of squares
```

**Parameters:**
- `data`: Input data (2D array)
- `config`: K-means configuration

**Configuration Options:**
- `k`: Number of clusters
- `maxIterations`: Maximum iterations (default: 100)
- `tolerance`: Convergence tolerance (default: 1e-6)
- `initMethod`: Initialization method ('random' | 'kmeans++')

#### `calculateSilhouetteScore(data: number[][], clusters: number[]): number`

Calculates silhouette score for clustering quality assessment.

```typescript
import { calculateSilhouetteScore } from './lib/cluster/kmeans';

const score = calculateSilhouetteScore(data, clusters);
console.log(`Silhouette Score: ${score.toFixed(3)}`);
```

#### `findOptimalK(data: number[][], maxK: number): { k: number; inertias: number[]; scores: number[] }`

Finds optimal number of clusters using elbow method.

```typescript
import { findOptimalK } from './lib/cluster/kmeans';

const optimal = findOptimalK(data, 10);
console.log(`Optimal k: ${optimal.k}`);
```

### Self-Organizing Maps (SOM)

#### `trainSOM(data: number[][], config: SOMConfig): SOMResult`

Trains a Self-Organizing Map on the provided data.

```typescript
import { trainSOM } from './lib/cluster/som';

const result = trainSOM(data, {
  gridSize: [10, 10],
  epochs: 1000,
  learningRate: 0.1,
  neighborhoodRadius: 5,
  topology: 'rectangular'
});

console.log(result.clusters); // Cluster assignments
console.log(result.nodes); // SOM nodes
console.log(result.quantizationError); // Quality metric
```

**Configuration Options:**
- `gridSize`: [width, height] of SOM grid
- `epochs`: Number of training epochs
- `learningRate`: Learning rate (default: 0.1)
- `neighborhoodRadius`: Initial neighborhood radius
- `topology`: Grid topology ('rectangular' | 'hexagonal')

#### `calculateUMatrix(nodes: SOMNode[], gridWidth: number, gridHeight: number): number[][]`

Calculates U-Matrix for SOM visualization.

```typescript
import { calculateUMatrix } from './lib/cluster/som';

const uMatrix = calculateUMatrix(result.nodes, 10, 10);
```

#### `getComponentPlanes(nodes: SOMNode[], gridWidth: number, gridHeight: number): number[][][]`

Gets component planes for each input dimension.

```typescript
import { getComponentPlanes } from './lib/cluster/som';

const planes = getComponentPlanes(result.nodes, 10, 10);
```

### Clustering Utilities

#### `normalizeData(data: number[][]): { normalized: number[][]; mins: number[]; maxs: number[] }`

Normalizes data to [0, 1] range.

```typescript
import { normalizeData } from './lib/cluster/cluster-utils';

const { normalized, mins, maxs } = normalizeData(data);
```

#### `standardizeData(data: number[][]): { standardized: number[][]; means: number[]; stds: number[] }`

Standardizes data to zero mean and unit variance.

```typescript
import { standardizeData } from './lib/cluster/cluster-utils';

const { standardized, means, stds } = standardizeData(data);
```

#### `performPCA(data: number[][], components: number): { transformed: number[][]; explained: number[] }`

Performs Principal Component Analysis for dimensionality reduction.

```typescript
import { performPCA } from './lib/cluster/cluster-utils';

const { transformed, explained } = performPCA(data, 2);
```

## Data Processing

### CSV Utilities

#### `arrayToCSV(data: Record<string, any>[]): string`

Converts array of objects to CSV string.

```typescript
import { arrayToCSV } from './lib/data/csv-utils';

const csvString = arrayToCSV(dataArray);
```

#### `inferDataType(values: any[]): 'numeric' | 'categorical' | 'datetime'`

Infers data type from array of values.

```typescript
import { inferDataType } from './lib/data/csv-utils';

const type = inferDataType(columnValues);
```

#### `calculateNumericStats(values: number[]): object`

Calculates basic statistics for numeric data.

```typescript
import { calculateNumericStats } from './lib/data/csv-utils';

const stats = calculateNumericStats(numericValues);
console.log(stats.mean, stats.std, stats.min, stats.max);
```

#### `normalizeData(data: number[][]): { normalizedData: number[][]; normalizationStats: { mean: number; std: number }[] }`

Normalizes data for machine learning algorithms.

```typescript
import { normalizeData } from './lib/data/csv-utils';

const { normalizedData, normalizationStats } = normalizeData(features);
```

#### Time Series Utilities

```typescript
// Validate datetime strings
const isValid = isValidDateTime('2023-01-01');

// Parse datetime with fallback
const date = parseDateTime('2023-01-01T10:30:00');

// Handle missing values in time series
const { values, removedIndices } = handleMissingValues(values, 'forward-fill');

// Handle missing timestamps
const { timestamps, values } = handleMissingTimestamps(timestamps, values);
```

## Storage & Migration

### Storage Utilities

#### `storageUtils.getProjectState(): string | null`

Gets project state with automatic migration fallback.

```typescript
import { storageUtils } from './lib/data/migration-utils';

const projectState = storageUtils.getProjectState();
```

#### `storageUtils.setProjectState(value: string): void`

Sets project state using new key format.

```typescript
storageUtils.setProjectState(JSON.stringify(state));
```

### Migration Functions

#### `performFullMigration(): MigrationResult`

Performs complete migration of localStorage keys.

```typescript
import { performFullMigration } from './lib/data/migration-utils';

const result = performFullMigration();
if (result.success) {
  console.log('Migration successful');
}
```

#### `isMigrationNeeded(): boolean`

Checks if migration is required.

```typescript
import { isMigrationNeeded } from './lib/data/migration-utils';

if (isMigrationNeeded()) {
  console.log('Migration required');
}
```

## Types & Interfaces

### Neural Network Types

```typescript
interface ANNConfig {
  inputSize: number;
  hiddenLayers: number[];
  outputSize: number;
  activationFunction: 'relu' | 'sigmoid' | 'tanh';
  learningRate: number;
  epochs: number;
  batchSize: number;
  taskType: 'regression' | 'classification';
}

interface ANNModel {
  config: ANNConfig;
  weights: number[][][];
  biases: number[][];
  trained: boolean;
  trainingHistory: TrainingHistory;
}

interface TrainingHistory {
  loss: number[];
  accuracy?: number[];
  epochs: number;
}

interface PredictionResult {
  predictions: number[];
  metrics: {
    mse?: number;
    mae?: number;
    r2?: number;
    accuracy?: number;
    confusionMatrix?: number[][];
  };
}
```

### Random Forest Types

```typescript
interface RandomForestConfig {
  numTrees: number;
  maxDepth: number | 'auto';
  minSamplesLeaf: number;
  featureSamplingRatio: 'sqrt' | 'log2' | 'all' | number;
  taskType: 'regression' | 'classification';
  bootstrapSampleRatio: number;
  randomSeed?: number;
}

interface RandomForestModel {
  config: RandomForestConfig;
  trees: DecisionTree[];
  featureImportance: number[];
  oobScore: number;
  trained: boolean;
  trainingHistory: {
    treesCompleted: number[];
    oobScores: number[];
    trainingTime: number;
  };
}

interface RandomForestPrediction {
  prediction: number | number[];
  confidence?: number;
  treeVotes?: number[];
}

interface FeatureImportance {
  featureIndex: number;
  featureName: string;
  importance: number;
  rank: number;
}
```

### Time Series Forecasting Types

```typescript
interface TimeSeriesData {
  timestamps: Date[];
  values: number[];
  metadata: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'irregular';
    hasGaps: boolean;
    totalPoints: number;
  };
}

interface ForecastConfig {
  method: 'moving-average' | 'exponential-smoothing' | 'linear-trend';
  parameters: {
    windowSize?: number;
    alpha?: number;
    beta?: number;
    polynomialDegree?: number;
  };
  forecastHorizon: number;
  trainTestSplit: number;
  confidenceLevel: number;
}

interface ForecastResult {
  method: string;
  fittedValues: number[];
  predictions: number[];
  confidenceIntervals: {
    lower: number[];
    upper: number[];
  };
  metrics: {
    mae: number;
    rmse: number;
    mape: number;
    r2?: number;
  };
  timestamps: {
    historical: Date[];
    forecast: Date[];
  };
}

interface ForecastModel {
  config: ForecastConfig;
  result: ForecastResult;
  trained: boolean;
  trainingData: TimeSeriesData;
  createdAt: Date;
}
```

### Clustering Types

```typescript
interface ClusterConfig {
  method: 'kmeans' | 'som';
  k?: number; // for k-means
  gridSize?: [number, number]; // for SOM
  epochs: number;
  learningRate?: number;
}

interface ClusterResult {
  clusters: number[];
  centroids?: number[][];
  somWeights?: number[][][]; // for SOM
  inertia?: number; // for k-means
}

interface KMeansConfig {
  k: number;
  maxIterations?: number;
  tolerance?: number;
  initMethod?: 'random' | 'kmeans++';
}

interface SOMConfig {
  gridSize: [number, number];
  epochs: number;
  learningRate?: number;
  neighborhoodRadius?: number;
  topology?: 'rectangular' | 'hexagonal';
}
```

### Data Types

```typescript
interface Dataset {
  id: string;
  name: string;
  data: Record<string, any>[];
  columns: DataColumn[];
  createdAt: Date;
}

interface DataColumn {
  name: string;
  type: 'numeric' | 'categorical' | 'datetime';
  values: any[];
  stats?: {
    min?: number;
    max?: number;
    mean?: number;
    std?: number;
    unique?: number;
    nullCount?: number;
  };
}

interface ProjectState {
  currentDataset?: Dataset;
  models: {
    ann?: ANNModel;
    randomForest?: RandomForestModel;
    forecast?: ForecastModel;
    cluster?: ClusterResult;
  };
  results: {
    predictions?: PredictionResult;
    randomForest?: RandomForestPrediction[];
    forecast?: ForecastResult;
    clusters?: ClusterResult;
  };
}
```

## Error Handling

All API functions include proper error handling:

```typescript
try {
  const model = createModel(config);
  const history = await trainModel(model, inputs, targets);
} catch (error) {
  console.error('Training failed:', error.message);
}
```

Common error scenarios:
- Invalid configuration parameters
- Insufficient training data
- Numerical instability
- Storage quota exceeded
- Migration failures
- Time series data validation errors
- Feature/target dimension mismatches

## Performance Considerations

### Memory Usage
- Large datasets (>10,000 rows) may require significant RAM
- Random Forest with many trees can be memory-intensive
- Time series with long histories may impact performance
- Consider data sampling for initial exploration
- Use batch processing for large-scale operations

### Training Performance
- **Neural Networks**: Smaller batch sizes may improve convergence but slow training
- **Random Forest**: More trees improve accuracy but increase training time
- **Time Series**: Longer series require more computation for trend analysis
- Monitor training progress with callbacks
- Consider using Web Workers for heavy computations (future enhancement)

### Browser Limitations
- localStorage has size limits (~5-10MB)
- Web Workers not currently used (single-threaded)
- Consider IndexedDB for very large datasets
- Some browsers may limit computation time for long-running scripts

## Best Practices

1. **Always validate input data** before processing
2. **Use appropriate data preprocessing** (normalization/standardization)
3. **Monitor training progress** with callbacks
4. **Save models regularly** during long training sessions
5. **Test with small datasets** before scaling up
6. **Handle errors gracefully** in production code
7. **Use TypeScript types** for better development experience
8. **Choose appropriate algorithms** for your data characteristics:
   - Neural Networks: Complex non-linear relationships
   - Random Forest: Tabular data with mixed types
   - Time Series: Temporal data with trends/seasonality
   - Clustering: Exploratory data analysis
9. **Validate time series data** for gaps and irregular frequencies
10. **Use confidence intervals** for uncertainty quantification