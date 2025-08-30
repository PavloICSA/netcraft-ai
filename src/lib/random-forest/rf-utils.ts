import type { RandomForestConfig, PredictionResult } from '../../types';

/**
 * Utility functions for Random Forest implementation
 */

/**
 * Prepare training data from dataset
 */
export function prepareTrainingData(
  data: Record<string, any>[],
  targetColumn: string,
  inputColumns: string[]
): {
  features: number[][];
  targets: number[];
  featureNames: string[];
  taskType: 'regression' | 'classification';
} {
  if (data.length === 0) {
    throw new Error('Dataset is empty');
  }

  if (!inputColumns.length) {
    throw new Error('No input columns specified');
  }

  if (!targetColumn) {
    throw new Error('No target column specified');
  }

  // Extract features
  const features: number[][] = [];
  const targets: number[] = [];

  for (const row of data) {
    // Extract input features
    const featureRow = inputColumns.map(col => {
      const value = row[col];
      const numericValue = typeof value === 'number' ? value : parseFloat(value);
      if (isNaN(numericValue)) {
        throw new Error(`Invalid numeric value for column ${col}: ${value}`);
      }
      return numericValue;
    });

    // Extract target
    const targetValue = row[targetColumn];
    const numericTarget = typeof targetValue === 'number' ? targetValue : parseFloat(targetValue);
    if (isNaN(numericTarget)) {
      throw new Error(`Invalid numeric value for target column ${targetColumn}: ${targetValue}`);
    }

    features.push(featureRow);
    targets.push(numericTarget);
  }

  // Determine task type based on target values
  const uniqueTargets = [...new Set(targets)];
  const taskType: 'regression' | 'classification' = 
    uniqueTargets.length <= Math.max(2, Math.sqrt(targets.length)) ? 'classification' : 'regression';

  return {
    features,
    targets,
    featureNames: inputColumns,
    taskType
  };
}

/**
 * Validate Random Forest configuration
 */
export function validateRandomForestConfig(config: RandomForestConfig): string[] {
  const errors: string[] = [];

  // Validate number of trees
  if (config.numTrees < 1 || config.numTrees > 1000) {
    errors.push('Number of trees must be between 1 and 1000');
  }

  // Validate max depth
  if (config.maxDepth !== 'auto' && (config.maxDepth < 1 || config.maxDepth > 50)) {
    errors.push('Max depth must be "auto" or between 1 and 50');
  }

  // Validate min samples per leaf
  if (config.minSamplesLeaf < 1 || config.minSamplesLeaf > 100) {
    errors.push('Min samples per leaf must be between 1 and 100');
  }

  // Validate feature sampling ratio
  if (typeof config.featureSamplingRatio === 'number') {
    if (config.featureSamplingRatio <= 0 || config.featureSamplingRatio > 1) {
      errors.push('Feature sampling ratio must be between 0 and 1');
    }
  } else if (!['sqrt', 'log2', 'all'].includes(config.featureSamplingRatio)) {
    errors.push('Feature sampling ratio must be "sqrt", "log2", "all", or a number between 0 and 1');
  }

  // Validate bootstrap sample ratio
  if (config.bootstrapSampleRatio <= 0 || config.bootstrapSampleRatio > 1) {
    errors.push('Bootstrap sample ratio must be between 0 and 1');
  }

  // Validate task type
  if (!['regression', 'classification'].includes(config.taskType)) {
    errors.push('Task type must be "regression" or "classification"');
  }

  // Validate random seed if provided
  if (config.randomSeed !== undefined && (!Number.isInteger(config.randomSeed) || config.randomSeed < 0)) {
    errors.push('Random seed must be a non-negative integer');
  }

  return errors;
}

/**
 * Calculate metrics for Random Forest predictions
 */
export function calculateMetrics(
  predictions: number[],
  targets: number[],
  taskType: 'regression' | 'classification'
): PredictionResult['metrics'] {
  if (predictions.length !== targets.length) {
    throw new Error('Predictions and targets must have the same length');
  }

  if (predictions.length === 0) {
    throw new Error('No predictions to evaluate');
  }

  if (taskType === 'regression') {
    // Calculate regression metrics
    const n = predictions.length;
    
    // Mean Squared Error
    const mse = predictions.reduce((sum, pred, i) => {
      return sum + Math.pow(pred - targets[i], 2);
    }, 0) / n;

    // Mean Absolute Error
    const mae = predictions.reduce((sum, pred, i) => {
      return sum + Math.abs(pred - targets[i]);
    }, 0) / n;

    // R² Score
    const targetMean = targets.reduce((sum, target) => sum + target, 0) / n;
    const totalSumSquares = targets.reduce((sum, target) => {
      return sum + Math.pow(target - targetMean, 2);
    }, 0);
    
    const residualSumSquares = predictions.reduce((sum, pred, i) => {
      return sum + Math.pow(targets[i] - pred, 2);
    }, 0);

    const r2 = totalSumSquares === 0 ? 1 : 1 - (residualSumSquares / totalSumSquares);

    return { mse, mae, r2 };
  } else {
    // Calculate classification metrics
    const n = predictions.length;
    let correct = 0;

    // Count correct predictions
    for (let i = 0; i < n; i++) {
      if (Math.round(predictions[i]) === Math.round(targets[i])) {
        correct++;
      }
    }

    const accuracy = correct / n;

    // Create confusion matrix
    const uniqueClasses = [...new Set([...predictions, ...targets])].map(x => Math.round(x)).sort((a, b) => a - b);
    const numClasses = uniqueClasses.length;
    const confusionMatrix: number[][] = Array(numClasses).fill(0).map(() => Array(numClasses).fill(0));

    for (let i = 0; i < n; i++) {
      const actualClass = Math.round(targets[i]);
      const predictedClass = Math.round(predictions[i]);
      
      const actualIndex = uniqueClasses.indexOf(actualClass);
      const predictedIndex = uniqueClasses.indexOf(predictedClass);
      
      if (actualIndex >= 0 && predictedIndex >= 0) {
        confusionMatrix[actualIndex][predictedIndex]++;
      }
    }

    return { accuracy, confusionMatrix };
  }
}

/**
 * Create bootstrap sample indices
 */
export function createBootstrapSample(dataSize: number, sampleRatio: number = 1.0): {
  indices: number[];
  oobIndices: number[];
} {
  const sampleSize = Math.floor(dataSize * sampleRatio);
  const indices: number[] = [];
  const usedIndices = new Set<number>();

  // Create bootstrap sample with replacement
  for (let i = 0; i < sampleSize; i++) {
    const randomIndex = Math.floor(Math.random() * dataSize);
    indices.push(randomIndex);
    usedIndices.add(randomIndex);
  }

  // Out-of-bag samples are those not selected
  const oobIndices: number[] = [];
  for (let i = 0; i < dataSize; i++) {
    if (!usedIndices.has(i)) {
      oobIndices.push(i);
    }
  }

  return { indices, oobIndices };
}

/**
 * Calculate feature sampling size based on ratio
 */
export function getFeatureSampleSize(totalFeatures: number, ratio: 'sqrt' | 'log2' | 'all' | number): number {
  if (typeof ratio === 'number') {
    return Math.min(Math.max(1, Math.floor(ratio * totalFeatures)), totalFeatures);
  }

  switch (ratio) {
    case 'sqrt':
      return Math.max(1, Math.floor(Math.sqrt(totalFeatures)));
    case 'log2':
      return Math.max(1, Math.floor(Math.log2(totalFeatures)));
    case 'all':
      return totalFeatures;
    default:
      return Math.max(1, Math.floor(Math.sqrt(totalFeatures)));
  }
}

/**
 * Validate Random Forest configuration (throws on error)
 */
export function validateConfig(config: RandomForestConfig): void {
  const errors = validateRandomForestConfig(config);
  if (errors.length > 0) {
    throw new Error('Configuration validation failed: ' + errors.join(', '));
  }
}

/**
 * Aggregate predictions from multiple trees
 */
export function aggregatePredictions(
  predictions: (number | number[])[],
  taskType: 'regression' | 'classification'
): number | number[] {
  if (predictions.length === 0) {
    throw new Error('No predictions to aggregate');
  }

  if (taskType === 'regression') {
    // For regression, return the mean of all predictions
    const numericPredictions = predictions as number[];
    const sum = numericPredictions.reduce((acc, pred) => acc + pred, 0);
    return sum / numericPredictions.length;
  } else {
    // For classification, return majority vote
    const numericPredictions = predictions as number[];
    const voteCounts = new Map<number, number>();
    
    // Count votes for each class
    for (const prediction of numericPredictions) {
      voteCounts.set(prediction, (voteCounts.get(prediction) || 0) + 1);
    }

    // Find the class with the most votes
    let maxVotes = 0;
    let majorityClass = 0;
    
    for (const [classLabel, votes] of voteCounts.entries()) {
      if (votes > maxVotes) {
        maxVotes = votes;
        majorityClass = classLabel;
      }
    }

    return majorityClass;
  }
}

/**
 * Calculate prediction confidence based on tree agreement
 */
export function calculatePredictionConfidence(
  predictions: (number | number[])[],
  taskType: 'regression' | 'classification'
): number {
  if (predictions.length === 0) return 0;

  if (taskType === 'regression') {
    // For regression, confidence is based on variance (lower variance = higher confidence)
    const numericPredictions = predictions as number[];
    const mean = numericPredictions.reduce((acc, pred) => acc + pred, 0) / numericPredictions.length;
    const variance = numericPredictions.reduce((acc, pred) => acc + Math.pow(pred - mean, 2), 0) / numericPredictions.length;
    
    // Convert variance to confidence (0-1 scale, higher is better)
    // Use exponential decay to map variance to confidence
    return Math.exp(-variance);
  } else {
    // For classification, confidence is the proportion of trees that voted for the majority class
    const numericPredictions = predictions as number[];
    const voteCounts = new Map<number, number>();
    
    // Count votes for each class
    for (const prediction of numericPredictions) {
      voteCounts.set(prediction, (voteCounts.get(prediction) || 0) + 1);
    }

    // Find the maximum vote count
    const maxVotes = Math.max(...voteCounts.values());
    
    // Confidence is the proportion of trees that agreed
    return maxVotes / numericPredictions.length;
  }
}

/**
 * Sample features randomly for a tree
 */
export function sampleFeatures(totalFeatures: number, sampleSize: number): number[] {
  const allFeatures = Array.from({ length: totalFeatures }, (_, i) => i);
  const sampledFeatures: number[] = [];
  
  // Fisher-Yates shuffle to randomly sample features
  for (let i = 0; i < sampleSize; i++) {
    const randomIndex = Math.floor(Math.random() * (allFeatures.length - i));
    const selectedFeature = allFeatures[randomIndex];
    
    // Swap selected feature to the end
    allFeatures[randomIndex] = allFeatures[allFeatures.length - 1 - i];
    allFeatures[allFeatures.length - 1 - i] = selectedFeature;
    
    sampledFeatures.push(selectedFeature);
  }
  
  return sampledFeatures.sort((a, b) => a - b);
}