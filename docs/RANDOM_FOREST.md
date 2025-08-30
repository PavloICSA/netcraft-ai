# Random Forest Guide

NetCraft AI provides a comprehensive Random Forest implementation with feature importance analysis, out-of-bag scoring, and support for both classification and regression tasks.

## Overview

Random Forest is an ensemble learning method that combines multiple decision trees to create a robust and accurate predictor. Our implementation includes:

- **Bootstrap Aggregating (Bagging)**: Each tree is trained on a random subset of data
- **Feature Sampling**: Random subset of features considered at each split
- **Out-of-Bag (OOB) Scoring**: Model validation without separate test set
- **Feature Importance**: Analysis of which features contribute most to predictions
- **Confidence Scoring**: Prediction confidence based on tree agreement

## How Random Forest Works

### 1. Bootstrap Sampling

For each tree in the forest:
- Create a bootstrap sample by randomly sampling with replacement
- Typically use 100% of original data size (configurable)
- Remaining samples become "out-of-bag" (OOB) for validation

### 2. Feature Sampling

At each node split:
- Randomly select a subset of features to consider
- Common choices: √(total features), log₂(total features), or all features
- This introduces diversity and reduces overfitting

### 3. Tree Building

Each decision tree:
- Uses CART (Classification and Regression Trees) algorithm
- Splits based on best feature/threshold combination
- Continues until stopping criteria are met (max depth, min samples)

### 4. Prediction Aggregation

**Classification**: Majority vote across all trees
**Regression**: Average of all tree predictions

### 5. Confidence Calculation

**Classification**: Proportion of trees voting for the predicted class
**Regression**: Inverse of prediction variance across trees

## Configuration Options

### Core Parameters

#### `numTrees: number`
Number of decision trees in the forest.
- **Default**: 100
- **Range**: 10-500
- **Impact**: More trees generally improve accuracy but increase training time

#### `maxDepth: number | 'auto'`
Maximum depth of each decision tree.
- **Default**: 'auto' (log₂(samples) + 1)
- **Range**: 1-50 or 'auto'
- **Impact**: Deeper trees can capture complex patterns but may overfit

#### `minSamplesLeaf: number`
Minimum number of samples required at each leaf node.
- **Default**: 1
- **Range**: 1-20
- **Impact**: Higher values prevent overfitting but may underfit

#### `featureSamplingRatio: 'sqrt' | 'log2' | 'all' | number`
Number of features to consider at each split.
- **'sqrt'**: √(total features) - good default for classification
- **'log2'**: log₂(total features) - alternative for classification
- **'all'**: All features - reduces randomness, may overfit
- **number**: Custom ratio (0-1) of features to use

#### `taskType: 'classification' | 'regression'`
Type of machine learning task.
- **Auto-detected** based on target variable characteristics
- **Classification**: Discrete target values
- **Regression**: Continuous target values

#### `bootstrapSampleRatio: number`
Proportion of data to use for each tree's bootstrap sample.
- **Default**: 1.0 (100% of data size with replacement)
- **Range**: 0.1-1.0
- **Impact**: Lower values increase diversity but may reduce individual tree quality

#### `randomSeed?: number`
Seed for random number generation (optional).
- **Default**: undefined (random)
- **Use**: For reproducible results

## Feature Importance

Random Forest calculates feature importance using **Mean Decrease in Impurity**:

1. For each tree, calculate impurity reduction for each feature
2. Average across all trees
3. Normalize to sum to 1.0
4. Rank features by importance

### Interpretation

- **Higher values**: More important features
- **Relative ranking**: Compare features within the same model
- **Stability**: More stable than single tree importance

### Example Usage

```typescript
import { calculateFeatureImportance } from './lib/random-forest/feature-importance';

// After training
const importance = calculateFeatureImportance(model.featureImportance, featureNames);

importance.forEach(feature => {
  console.log(`${feature.featureName}: ${(feature.importance * 100).toFixed(2)}% (rank ${feature.rank})`);
});
```

## Out-of-Bag (OOB) Scoring

OOB scoring provides model validation without requiring a separate test set:

1. For each sample, find trees that didn't use it in training (OOB trees)
2. Make prediction using only these OOB trees
3. Compare OOB predictions with actual values
4. Calculate accuracy/error metrics

### Benefits

- **No data splitting required**: Use all data for training
- **Unbiased estimate**: OOB samples weren't used in training
- **Automatic validation**: Built into the training process

### Interpretation

- **Classification**: OOB accuracy (0-1, higher is better)
- **Regression**: OOB score (varies, interpretation depends on data scale)

## Usage Examples

### Basic Classification

```typescript
import { RandomForest } from './lib/random-forest/RandomForest';

// Prepare data
const features = [[1, 2], [2, 3], [3, 1], [4, 2]]; // Feature matrix
const targets = [0, 1, 0, 1]; // Class labels
const featureNames = ['feature1', 'feature2'];

// Configure Random Forest
const config: RandomForestConfig = {
  numTrees: 100,
  maxDepth: 10,
  minSamplesLeaf: 1,
  featureSamplingRatio: 'sqrt',
  taskType: 'classification',
  bootstrapSampleRatio: 1.0
};

// Train model
const rf = new RandomForest(config);
const model = await rf.train(features, targets, featureNames, (progress, treesCompleted) => {
  console.log(`Training progress: ${progress.toFixed(1)}%`);
});

// Make predictions
const prediction = rf.predict([2.5, 2.5]);
console.log(`Predicted class: ${prediction.prediction}`);
console.log(`Confidence: ${(prediction.confidence * 100).toFixed(1)}%`);

// Batch predictions
const batchPredictions = rf.predictBatch([[1, 1], [3, 3], [2, 2]]);
```

### Basic Regression

```typescript
// Regression example: predicting house prices
const features = [
  [1200, 3, 2], // sqft, bedrooms, bathrooms
  [1500, 4, 2],
  [800, 2, 1],
  [2000, 4, 3]
];
const targets = [200000, 250000, 150000, 350000]; // prices
const featureNames = ['sqft', 'bedrooms', 'bathrooms'];

const config: RandomForestConfig = {
  numTrees: 100,
  maxDepth: 'auto',
  minSamplesLeaf: 1,
  featureSamplingRatio: 'sqrt',
  taskType: 'regression',
  bootstrapSampleRatio: 1.0
};

const rf = new RandomForest(config);
const model = await rf.train(features, targets, featureNames);

// Predict house price
const prediction = rf.predict([1300, 3, 2]);
console.log(`Predicted price: $${prediction.prediction.toFixed(0)}`);
```

### Model Serialization

```typescript
// Save model
const serializedModel = rf.serialize();
const modelJson = JSON.stringify(serializedModel);
localStorage.setItem('rf-model', modelJson);

// Load model
const modelJson = localStorage.getItem('rf-model');
const modelData = JSON.parse(modelJson);
const loadedRF = RandomForest.deserialize(modelData);

// Use loaded model
const prediction = loadedRF.predict([1, 2, 3]);
```

### Batch Prediction from CSV

```typescript
// Process CSV file for batch predictions
const processBatchPredictions = async (csvFile: File, model: RandomForest, featureNames: string[]) => {
  const text = await csvFile.text();
  const lines = text.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  
  // Validate required features
  const missingFeatures = featureNames.filter(name => !headers.includes(name));
  if (missingFeatures.length > 0) {
    throw new Error(`Missing features: ${missingFeatures.join(', ')}`);
  }
  
  // Process data rows
  const predictions = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    // Extract features
    const features = featureNames.map(name => parseFloat(row[name]));
    if (features.some(isNaN)) continue; // Skip invalid rows
    
    const prediction = model.predict(features);
    predictions.push(prediction);
  }
  
  return predictions;
};
```

## Best Practices

### Data Preparation

1. **Handle missing values**: Random Forest can handle some missing data, but clean data is better
2. **Feature scaling**: Not required for Random Forest (tree-based)
3. **Categorical encoding**: Use one-hot encoding or label encoding for categorical features
4. **Feature selection**: Random Forest handles irrelevant features well, but removing obviously irrelevant features can help

### Parameter Tuning

1. **Start with defaults**: Default parameters often work well
2. **Increase trees gradually**: Start with 100, increase if needed
3. **Tune max depth**: Use 'auto' first, then experiment with fixed values
4. **Adjust feature sampling**: 'sqrt' for classification, 'all' or custom ratio for regression
5. **Monitor OOB score**: Use as validation metric during tuning

### Model Validation

1. **Use OOB score**: Built-in validation metric
2. **Cross-validation**: For more robust validation
3. **Feature importance**: Understand which features matter
4. **Prediction confidence**: Use confidence scores for decision making

### Performance Optimization

1. **Parallel training**: Current implementation is sequential (future: Web Workers)
2. **Memory management**: Large forests can use significant memory
3. **Batch predictions**: More efficient than individual predictions
4. **Model compression**: Consider reducing tree depth for deployment

## Advantages and Limitations

### Advantages

1. **Robust to overfitting**: Ensemble method reduces overfitting risk
2. **Handles mixed data types**: Works with numeric and categorical features
3. **Feature importance**: Built-in feature selection capability
4. **No feature scaling required**: Tree-based method
5. **Handles missing values**: Can work with incomplete data
6. **OOB validation**: Built-in model validation
7. **Interpretable**: Feature importance provides insights

### Limitations

1. **Memory intensive**: Stores multiple trees
2. **Less interpretable than single trees**: Ensemble is harder to understand
3. **Can overfit with very noisy data**: Though less than single trees
4. **Biased toward categorical features**: With many categories
5. **Not optimal for linear relationships**: Neural networks or linear models may be better

## Comparison with Other Algorithms

### vs. Neural Networks

**Random Forest advantages:**
- No hyperparameter tuning required
- Built-in feature importance
- Handles mixed data types naturally
- Less prone to overfitting
- Faster training on small-medium datasets

**Neural Network advantages:**
- Better for complex non-linear patterns
- Better for high-dimensional data
- Can learn feature representations
- Better for very large datasets

### vs. Single Decision Tree

**Random Forest advantages:**
- Much more robust and accurate
- Less prone to overfitting
- Better generalization
- Confidence scores

**Single Tree advantages:**
- More interpretable
- Faster training and prediction
- Less memory usage
- Easier to visualize

## Troubleshooting

### Common Issues

**"Poor prediction accuracy"**
- Increase number of trees
- Adjust max depth (try both deeper and shallower)
- Check feature quality and relevance
- Ensure sufficient training data
- Verify task type (classification vs regression)

**"Training takes too long"**
- Reduce number of trees
- Reduce max depth
- Increase min samples per leaf
- Use smaller bootstrap sample ratio
- Consider data sampling for initial experiments

**"High memory usage"**
- Reduce number of trees
- Reduce max depth
- Process data in smaller batches
- Clear unused variables

**"Low confidence scores"**
- Increase number of trees
- Check data quality
- Ensure features are informative
- Consider feature engineering

### Performance Issues

**Slow predictions**
- Use batch prediction for multiple samples
- Consider model compression techniques
- Profile memory usage

**Memory errors**
- Reduce model size (fewer trees, less depth)
- Process predictions in batches
- Use streaming for large datasets

## Advanced Topics

### Custom Feature Sampling

```typescript
// Custom feature sampling ratio
const config: RandomForestConfig = {
  numTrees: 100,
  featureSamplingRatio: 0.6, // Use 60% of features at each split
  // ... other parameters
};
```

### Handling Imbalanced Data

```typescript
// For imbalanced classification, consider:
// 1. Adjusting bootstrap sample ratio
const config: RandomForestConfig = {
  bootstrapSampleRatio: 0.8, // Smaller samples may help with imbalance
  // ... other parameters
};

// 2. Post-processing predictions based on confidence
const predictions = rf.predictBatch(testFeatures);
const highConfidencePredictions = predictions.filter(p => p.confidence > 0.8);
```

### Feature Selection

```typescript
// Use feature importance for feature selection
const importance = calculateFeatureImportance(model.featureImportance, featureNames);
const topFeatures = importance
  .sort((a, b) => b.importance - a.importance)
  .slice(0, 10) // Top 10 features
  .map(f => f.featureName);

console.log('Most important features:', topFeatures);
```

## API Reference

See [API Documentation](API.md#random-forest) for complete API reference including:
- Class constructors and methods
- Configuration interfaces
- Return value structures
- Error handling
- Type definitions

## Examples in Application

To see Random Forest in action:
1. Load demo dataset (Iris or Sales data)
2. Navigate to Predictor page
3. Select "Random Forest" algorithm
4. Configure parameters and train
5. Analyze feature importance and predictions
6. Export model and results