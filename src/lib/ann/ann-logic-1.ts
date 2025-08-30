/**
 * ANN Logic Part 1: Model Definition, Forward Pass, and Weight Initialization
 * Core neural network implementation with TypeScript
 */

import { ANNConfig, ANNModel } from '../../types';

/**
 * Activation functions and their derivatives
 */
export const activationFunctions = {
  relu: (x: number): number => Math.max(0, x),
  reluDerivative: (x: number): number => x > 0 ? 1 : 0,
  
  sigmoid: (x: number): number => {
    // Clamp input to prevent overflow
    const clampedX = Math.max(-500, Math.min(500, x));
    return 1 / (1 + Math.exp(-clampedX));
  },
  sigmoidDerivative: (x: number): number => {
    const s = activationFunctions.sigmoid(x);
    return s * (1 - s);
  },
  
  tanh: (x: number): number => Math.tanh(x),
  tanhDerivative: (x: number): number => {
    const t = Math.tanh(x);
    return 1 - t * t;
  }
};

/**
 * Initialize weights using Xavier/Glorot initialization
 */
export function initializeWeights(inputSize: number, outputSize: number): number[][] {
  const weights: number[][] = [];
  const limit = Math.sqrt(6 / (inputSize + outputSize));
  
  for (let i = 0; i < outputSize; i++) {
    weights[i] = [];
    for (let j = 0; j < inputSize; j++) {
      weights[i][j] = (Math.random() * 2 - 1) * limit;
    }
  }
  
  return weights;
}

/**
 * Initialize biases to small random values
 */
export function initializeBiases(size: number): number[] {
  return Array(size).fill(0).map(() => (Math.random() - 0.5) * 0.1);
}

/**
 * Create a new ANN model with initialized weights and biases
 */
export function createModel(config: ANNConfig): ANNModel {
  const layers = [config.inputSize, ...config.hiddenLayers, config.outputSize];
  const weights: number[][][] = [];
  const biases: number[][] = [];
  
  // Initialize weights and biases for each layer
  for (let i = 0; i < layers.length - 1; i++) {
    weights.push(initializeWeights(layers[i], layers[i + 1]));
    biases.push(initializeBiases(layers[i + 1]));
  }
  
  return {
    config,
    weights,
    biases,
    trained: false,
    trainingHistory: {
      loss: [],
      accuracy: config.taskType === 'classification' ? [] : undefined,
      epochs: 0
    }
  };
}

/**
 * Forward pass through the network
 */
export function forwardPass(
  model: ANNModel, 
  input: number[]
): { output: number[]; activations: number[][]; zValues: number[][] } {
  const { weights, biases, config } = model;
  const activations: number[][] = [input];
  const zValues: number[][] = [];
  
  let currentActivation = input;
  
  // Process each layer
  for (let layerIndex = 0; layerIndex < weights.length; layerIndex++) {
    const layerWeights = weights[layerIndex];
    const layerBiases = biases[layerIndex];
    const z: number[] = [];
    const activation: number[] = [];
    
    // Calculate weighted sum + bias for each neuron
    for (let neuronIndex = 0; neuronIndex < layerWeights.length; neuronIndex++) {
      let sum = layerBiases[neuronIndex];
      
      for (let inputIndex = 0; inputIndex < currentActivation.length; inputIndex++) {
        sum += currentActivation[inputIndex] * layerWeights[neuronIndex][inputIndex];
      }
      
      z.push(sum);
      
      // Apply activation function
      const isOutputLayer = layerIndex === weights.length - 1;
      if (isOutputLayer && config.taskType === 'classification' && config.outputSize > 1) {
        // Softmax for multi-class classification (applied after all neurons)
        activation.push(sum);
      } else {
        // Regular activation function
        const activationFn = activationFunctions[config.activationFunction];
        activation.push(activationFn(sum));
      }
    }
    
    // Apply softmax for multi-class classification output layer
    if (layerIndex === weights.length - 1 && 
        config.taskType === 'classification' && 
        config.outputSize > 1) {
      const softmaxOutput = applySoftmax(activation);
      activations.push(softmaxOutput);
    } else {
      activations.push(activation);
    }
    
    zValues.push(z);
    currentActivation = activations[activations.length - 1];
  }
  
  return {
    output: currentActivation,
    activations,
    zValues
  };
}

/**
 * Apply softmax activation function
 */
export function applySoftmax(values: number[]): number[] {
  const maxVal = Math.max(...values);
  const expValues = values.map(v => {
    const clampedValue = Math.max(-500, Math.min(500, v - maxVal));
    return Math.exp(clampedValue);
  });
  const sumExp = expValues.reduce((sum, val) => sum + val, 0);
  
  // Prevent division by zero
  if (sumExp === 0 || !isFinite(sumExp)) {
    return values.map(() => 1 / values.length);
  }
  
  return expValues.map(val => val / sumExp);
}

/**
 * Calculate loss for a single prediction
 */
export function calculateLoss(
  predicted: number[], 
  actual: number[], 
  taskType: 'regression' | 'classification'
): number {
  if (taskType === 'regression') {
    // Mean Squared Error
    let sum = 0;
    for (let i = 0; i < predicted.length; i++) {
      const diff = predicted[i] - actual[i];
      sum += diff * diff;
    }
    return sum / predicted.length;
  } else {
    // Cross-entropy loss for classification
    let sum = 0;
    for (let i = 0; i < predicted.length; i++) {
      // Clip predictions to prevent log(0)
      const clippedPred = Math.max(1e-15, Math.min(1 - 1e-15, predicted[i]));
      sum -= actual[i] * Math.log(clippedPred);
    }
    return sum;
  }
}

/**
 * Convert class index to one-hot encoding
 */
export function oneHotEncode(classIndex: number, numClasses: number): number[] {
  const encoded = Array(numClasses).fill(0);
  encoded[classIndex] = 1;
  return encoded;
}

/**
 * Get predicted class from output probabilities
 */
export function getPredictedClass(output: number[]): number {
  return output.indexOf(Math.max(...output));
}