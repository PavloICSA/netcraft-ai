# NetCraft AI API Documentation

This document provides comprehensive API documentation for NetCraft AI's machine learning libraries and utilities.

## Table of Contents

- [Neural Networks](#neural-networks)
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
    cluster?: ClusterResult;
  };
  results: {
    predictions?: PredictionResult;
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

## Performance Considerations

### Memory Usage
- Large datasets (>10,000 rows) may require significant RAM
- Consider data sampling for initial exploration
- Use batch processing for large-scale operations

### Training Performance
- Smaller batch sizes may improve convergence but slow training
- Larger learning rates speed training but may cause instability
- Monitor loss curves to detect overfitting

### Browser Limitations
- localStorage has size limits (~5-10MB)
- Web Workers not currently used (single-threaded)
- Consider IndexedDB for very large datasets

## Best Practices

1. **Always validate input data** before processing
2. **Use appropriate data preprocessing** (normalization/standardization)
3. **Monitor training progress** with callbacks
4. **Save models regularly** during long training sessions
5. **Test with small datasets** before scaling up
6. **Handle errors gracefully** in production code
7. **Use TypeScript types** for better development experience