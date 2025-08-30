# Random Forest Design Document

## Overview

This design document outlines the implementation of Random Forest algorithm for NetCraft AI, following the established architectural patterns used in the neural network and clustering implementations. Random Forest will be implemented as a pure TypeScript ensemble learning method that operates entirely client-side, providing robust predictions with feature importance analysis.

The implementation will follow the same separation of concerns as existing algorithms: pure logic in `src/lib/`, UI components in `src/components/`, and comprehensive TypeScript interfaces in `types.d.ts`.

## Architecture

### Core Components

1. **Decision Tree Implementation** (`src/lib/random-forest/decision-tree.ts`)
   - Individual decision tree with CART algorithm
   - Supports both classification and regression
   - Implements Gini impurity and MSE splitting criteria
   - Handles categorical and numerical features

2. **Random Forest Engine** (`src/lib/random-forest/random-forest.ts`)
   - Ensemble management and training coordination
   - Bootstrap sampling for bagging
   - Feature subsampling at each split
   - Parallel tree construction (using Web Workers if available)

3. **Feature Importance Calculator** (`src/lib/random-forest/feature-importance.ts`)
   - Mean decrease in impurity calculation
   - Permutation importance analysis
   - Feature ranking and visualization data preparation

4. **Random Forest Utilities** (`src/lib/random-forest/rf-utils.ts`)
   - Data preprocessing and validation
   - Bootstrap sampling utilities
   - Prediction aggregation methods
   - Model serialization/deserialization

### UI Components

1. **RandomForestForm** (`src/components/Predictor/RandomForestForm.tsx`)
   - Hyperparameter configuration interface
   - Training progress display
   - Follows same pattern as existing PredictorForm

2. **RandomForestResults** (`src/components/Predictor/RandomForestResults.tsx`)
   - Model performance metrics display
   - Feature importance visualization
   - Prediction interface for new data

3. **FeatureImportanceChart** (`src/components/Predictor/FeatureImportanceChart.tsx`)
   - Horizontal bar chart for feature rankings
   - Interactive tooltips and sorting options

4. **DecisionBoundaryVisualization** (`src/components/Predictor/DecisionBoundaryVisualization.tsx`)
   - 2D decision boundary plotting for educational purposes
   - Individual tree boundaries with ensemble overlay

## Components and Interfaces

### TypeScript Interfaces

```typescript
// Addition to src/types.d.ts

export interface RandomForestConfig {
  numTrees: number;
  maxDepth: number | 'auto';
  minSamplesLeaf: number;
  featureSamplingRatio: 'sqrt' | 'log2' | 'all' | number;
  taskType: 'regression' | 'classification';
  randomSeed?: number;
  bootstrapSampleRatio: number;
}

export interface DecisionTreeNode {
  isLeaf: boolean;
  prediction?: number | number[]; // number for regression, array for classification
  featureIndex?: number;
  threshold?: number;
  left?: DecisionTreeNode;
  right?: DecisionTreeNode;
  samples: number;
  impurity: number;
}

export interface DecisionTree {
  root: DecisionTreeNode;
  config: {
    maxDepth: number;
    minSamplesLeaf: number;
    taskType: 'regression' | 'classification';
  };
  featureIndices: number[]; // Features used in this tree
  oobIndices: number[]; // Out-of-bag sample indices
}

export interface RandomForestModel {
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

export interface FeatureImportance {
  featureIndex: number;
  featureName: string;
  importance: number;
  rank: number;
}

export interface RandomForestPrediction {
  prediction: number | number[];
  confidence?: number;
  treeVotes?: number[];
  featureContributions?: number[];
}
```

### Decision Tree Implementation

The decision tree will use the CART (Classification and Regression Trees) algorithm:

1. **Splitting Criteria**
   - Gini impurity for classification
   - Mean Squared Error for regression
   - Support for both numerical and categorical features

2. **Tree Construction**
   - Recursive binary splitting
   - Configurable maximum depth and minimum samples per leaf
   - Feature subsampling at each node

3. **Prediction**
   - Traverse tree based on feature values
   - Return class probabilities for classification
   - Return mean value for regression

### Random Forest Ensemble

The ensemble will implement standard Random Forest methodology:

1. **Bootstrap Sampling**
   - Create bootstrap samples for each tree
   - Track out-of-bag samples for validation

2. **Feature Subsampling**
   - Random feature selection at each split
   - Configurable sampling ratios (sqrt, log2, all, custom)

3. **Prediction Aggregation**
   - Majority voting for classification
   - Mean averaging for regression
   - Confidence estimation based on vote distribution

## Data Models

### Training Data Structure

```typescript
interface TrainingData {
  features: number[][];
  targets: number[];
  featureNames: string[];
  featureTypes: ('numeric' | 'categorical')[];
}
```

### Bootstrap Sample

```typescript
interface BootstrapSample {
  indices: number[];
  oobIndices: number[];
  features: number[][];
  targets: number[];
}
```

### Prediction Result

```typescript
interface RandomForestResult extends PredictionResult {
  featureImportance: FeatureImportance[];
  oobScore: number;
  treeVotes?: number[][];
  decisionPaths?: string[];
}
```

## Error Handling

### Input Validation

1. **Configuration Validation**
   - Validate hyperparameter ranges
   - Check for valid feature sampling ratios
   - Ensure minimum dataset size requirements

2. **Data Validation**
   - Check for missing values and handle appropriately
   - Validate feature types and consistency
   - Ensure sufficient samples for training

3. **Training Error Handling**
   - Handle edge cases in tree construction
   - Manage memory constraints for large datasets
   - Provide meaningful error messages for failures

### Runtime Error Management

1. **Tree Construction Failures**
   - Skip problematic trees and continue training
   - Log warnings for debugging
   - Maintain minimum ensemble size

2. **Prediction Errors**
   - Handle missing features gracefully
   - Provide fallback predictions
   - Validate input data format

## Testing Strategy

### Unit Tests

1. **Decision Tree Tests**
   - Test splitting criteria calculations
   - Verify tree construction logic
   - Test prediction accuracy on simple datasets

2. **Random Forest Tests**
   - Test bootstrap sampling
   - Verify feature importance calculations
   - Test ensemble prediction aggregation

3. **Utility Function Tests**
   - Test data preprocessing functions
   - Verify serialization/deserialization
   - Test error handling edge cases

### Integration Tests

1. **End-to-End Training**
   - Test complete training pipeline
   - Verify model persistence
   - Test prediction workflow

2. **UI Component Tests**
   - Test form validation and submission
   - Verify results display
   - Test feature importance visualization

### Performance Tests

1. **Scalability Testing**
   - Test with various dataset sizes
   - Measure training and prediction times
   - Monitor memory usage

2. **Accuracy Benchmarks**
   - Compare against known datasets
   - Validate against scikit-learn implementations
   - Test edge cases and boundary conditions

## Implementation Phases

### Phase 1: Core Decision Tree
- Implement basic decision tree with CART algorithm
- Add support for classification and regression
- Create comprehensive unit tests

### Phase 2: Random Forest Ensemble
- Implement bootstrap sampling
- Add feature subsampling
- Create ensemble prediction aggregation

### Phase 3: Feature Importance
- Implement mean decrease in impurity
- Add permutation importance calculation
- Create feature ranking utilities

### Phase 4: UI Integration
- Create Random Forest form component
- Add results display with feature importance
- Integrate with existing predictor workflow

### Phase 5: Advanced Features
- Add decision boundary visualization
- Implement model comparison utilities
- Add export/import functionality

### Phase 6: Optimization and Polish
- Performance optimization
- Enhanced error handling
- Comprehensive documentation

## Performance Considerations

### Memory Management
- Efficient tree storage using minimal node structures
- Lazy loading of tree predictions
- Garbage collection optimization for large ensembles

### Computational Efficiency
- Vectorized operations where possible
- Efficient sorting algorithms for feature selection
- Parallel tree construction using Web Workers

### User Experience
- Progressive training with real-time updates
- Responsive UI during long training sessions
- Meaningful progress indicators and time estimates

## Integration with Existing System

### Data Pipeline Integration
- Reuse existing CSV parsing and preprocessing
- Integrate with current data validation pipeline
- Support existing feature engineering workflows

### UI Consistency
- Follow established design patterns
- Reuse existing chart components where possible
- Maintain consistent navigation and layout

### Model Management
- Integrate with existing model persistence system
- Support model comparison with neural networks
- Maintain consistent export/import formats