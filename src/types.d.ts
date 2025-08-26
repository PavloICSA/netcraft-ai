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

export interface ProjectState {
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