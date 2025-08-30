/**
 * Global type definitions for NetCraft AI
 */

export interface Dataset {
  id: string;
  name: string;
  data: Record<string, any>[];
  columns: DataColumn[];
  createdAt: Date;
}

export interface DataColumn {
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

export interface ANNConfig {
  inputSize: number;
  hiddenLayers: number[];
  outputSize: number;
  activationFunction: 'relu' | 'sigmoid' | 'tanh';
  learningRate: number;
  epochs: number;
  batchSize: number;
  taskType: 'regression' | 'classification';
}

export interface ANNModel {
  config: ANNConfig;
  weights: number[][][];
  biases: number[][];
  trained: boolean;
  trainingHistory: TrainingHistory;
}

export interface TrainingHistory {
  loss: number[];
  accuracy?: number[];
  epochs: number;
}

export interface PredictionResult {
  predictions: number[];
  metrics: {
    mse?: number;
    mae?: number;
    r2?: number;
    accuracy?: number;
    confusionMatrix?: number[][];
  };
}

export interface ClusterConfig {
  method: 'kmeans' | 'som';
  k?: number; // for k-means
  gridSize?: [number, number]; // for SOM
  epochs: number;
  learningRate?: number;
}

export interface ClusterResult {
  clusters: number[];
  centroids?: number[][];
  somWeights?: number[][][]; // for SOM
  inertia?: number; // for k-means
  // SOM-specific properties
  nodes?: Array<{ weights: number[]; x: number; y: number }>;
  gridSize?: [number, number];
  quantizationError?: number;
  topographicError?: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

// Random Forest Types
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
  prediction?: number | number[];
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
  featureIndices: number[];
  oobIndices: number[];
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

// Time Series Forecasting Types
export interface TimeSeriesPoint {
  timestamp: Date;
  value: number;
}

export interface TimeSeriesData {
  timestamps: Date[];
  values: number[];
  metadata: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'irregular';
    hasGaps: boolean;
    totalPoints: number;
  };
}

export interface ForecastConfig {
  method: 'moving-average' | 'exponential-smoothing' | 'linear-trend';
  parameters: {
    // Moving Average
    windowSize?: number;
    
    // Exponential Smoothing
    alpha?: number;
    beta?: number;
    gamma?: number;
    seasonalPeriods?: number;
    
    // Linear Trend
    polynomialDegree?: number;
  };
  forecastHorizon: number;
  trainTestSplit: number;
  confidenceLevel: number;
}

export interface ForecastResult {
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

export interface ForecastModel {
  config: ForecastConfig;
  result: ForecastResult;
  trained: boolean;
  trainingData: TimeSeriesData;
  createdAt: Date;
}

export interface ProjectState {
  currentDataset?: Dataset;
  models: {
    ann?: ANNModel;
    cluster?: ClusterResult;
    randomForest?: RandomForestModel;
    forecast?: ForecastModel;
  };
  results: {
    predictions?: PredictionResult;
    clusters?: ClusterResult;
    randomForest?: RandomForestPrediction[];
    forecast?: ForecastResult;
  };
}