/**
 * ANN Logic Part 2: Training Loop, Metrics, and Model Serialization
 * Training algorithms and model persistence
 */

import { ANNModel, PredictionResult, TrainingHistory } from '../../types';
import { 
  forwardPass, 
  calculateLoss, 
  activationFunctions, 
  oneHotEncode, 
  getPredictedClass 
} from './ann-logic-1';

/**
 * Training progress callback type
 */
export type TrainingProgressCallback = (epoch: number, loss: number, accuracy?: number) => void;

/**
 * Backward pass and weight updates using gradient descent
 */
export function backwardPass(
  model: ANNModel,
  input: number[],
  target: number[],
  forwardResult: { output: number[]; activations: number[][]; zValues: number[][] }
): void {
  const { weights, biases, config } = model;
  const { activations, zValues } = forwardResult;
  const numLayers = weights.length;
  
  // Calculate output layer error
  const outputError: number[] = [];
  const output = activations[activations.length - 1];
  
  for (let i = 0; i < output.length; i++) {
    if (config.taskType === 'regression') {
      outputError.push(2 * (output[i] - target[i]) / output.length);
    } else {
      // For classification, derivative of cross-entropy with softmax
      outputError.push(output[i] - target[i]);
    }
  }
  
  // Backpropagate errors
  let currentError = outputError;
  
  for (let layerIndex = numLayers - 1; layerIndex >= 0; layerIndex--) {
    const layerWeights = weights[layerIndex];
    const layerBiases = biases[layerIndex];
    const layerActivations = activations[layerIndex];
    const nextLayerActivations = activations[layerIndex + 1];
    const zValues_layer = zValues[layerIndex];
    
    // Calculate gradients for weights and biases
    for (let neuronIndex = 0; neuronIndex < layerWeights.length; neuronIndex++) {
      const error = currentError[neuronIndex];
      
      // Update bias with gradient clipping
      const clippedError = Math.max(-5, Math.min(5, error));
      
      // Check for NaN bias updates
      if (isNaN(clippedError)) {
        console.warn('NaN bias gradient detected, skipping update');
        continue;
      }
      
      biases[layerIndex][neuronIndex] -= config.learningRate * clippedError;
      
      // Update weights with gradient clipping
      for (let inputIndex = 0; inputIndex < layerWeights[neuronIndex].length; inputIndex++) {
        const gradient = error * layerActivations[inputIndex];
        
        // Clip gradients to prevent exploding gradients
        const clippedGradient = Math.max(-5, Math.min(5, gradient));
        
        // Check for NaN gradients
        if (isNaN(clippedGradient)) {
          console.warn('NaN gradient detected, skipping update');
          continue;
        }
        
        weights[layerIndex][neuronIndex][inputIndex] -= config.learningRate * clippedGradient;
      }
    }
    
    // Calculate error for previous layer (if not input layer)
    if (layerIndex > 0) {
      const prevError: number[] = [];
      const prevZValues = zValues[layerIndex - 1];
      
      for (let prevNeuronIndex = 0; prevNeuronIndex < layerActivations.length; prevNeuronIndex++) {
        let errorSum = 0;
        
        for (let currentNeuronIndex = 0; currentNeuronIndex < currentError.length; currentNeuronIndex++) {
          errorSum += currentError[currentNeuronIndex] * 
                     layerWeights[currentNeuronIndex][prevNeuronIndex];
        }
        
        // Apply derivative of activation function
        const activationDerivative = getActivationDerivative(
          config.activationFunction, 
          prevZValues[prevNeuronIndex]
        );
        
        prevError.push(errorSum * activationDerivative);
      }
      
      currentError = prevError;
    }
  }
}

/**
 * Get activation function derivative
 */
function getActivationDerivative(activationType: string, zValue: number): number {
  switch (activationType) {
    case 'relu':
      return activationFunctions.reluDerivative(zValue);
    case 'sigmoid':
      return activationFunctions.sigmoidDerivative(zValue);
    case 'tanh':
      return activationFunctions.tanhDerivative(zValue);
    default:
      return 1;
  }
}

/**
 * Train the neural network
 */
export async function trainModel(
  model: ANNModel,
  trainInputs: number[][],
  trainTargets: number[][],
  onProgress?: TrainingProgressCallback
): Promise<TrainingHistory> {
  const { config } = model;
  const history: TrainingHistory = {
    loss: [],
    accuracy: config.taskType === 'classification' ? [] : undefined,
    epochs: 0
  };
  
  // Convert targets for classification if needed
  const processedTargets = config.taskType === 'classification' && config.outputSize > 1
    ? trainTargets.map(target => 
        Array.isArray(target) && target.length === 1 
          ? oneHotEncode(target[0], config.outputSize)
          : target
      )
    : trainTargets;
  
  for (let epoch = 0; epoch < config.epochs; epoch++) {
    let totalLoss = 0;
    let correctPredictions = 0;
    
    // Shuffle training data
    const indices = Array.from({ length: trainInputs.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    // Process batches
    const batchSize = Math.min(config.batchSize, trainInputs.length);
    const numBatches = Math.ceil(trainInputs.length / batchSize);
    
    for (let batchIndex = 0; batchIndex < numBatches; batchIndex++) {
      const batchStart = batchIndex * batchSize;
      const batchEnd = Math.min(batchStart + batchSize, trainInputs.length);
      
      for (let i = batchStart; i < batchEnd; i++) {
        const dataIndex = indices[i];
        const input = trainInputs[dataIndex];
        const target = processedTargets[dataIndex];
        
        // Forward pass
        const forwardResult = forwardPass(model, input);
        
        // Calculate loss
        const loss = calculateLoss(forwardResult.output, target, config.taskType);
        
        // Check for invalid loss values
        if (isNaN(loss) || !isFinite(loss)) {
          console.warn('Invalid loss detected:', loss, 'Output:', forwardResult.output, 'Target:', target);
          continue; // Skip this sample
        }
        
        totalLoss += loss;
        
        // Calculate accuracy for classification
        if (config.taskType === 'classification') {
          const predictedClass = getPredictedClass(forwardResult.output);
          const actualClass = config.outputSize > 1 
            ? getPredictedClass(target)
            : target[0];
          
          if (predictedClass === actualClass) {
            correctPredictions++;
          }
        }
        
        // Backward pass
        backwardPass(model, input, target, forwardResult);
      }
    }
    
    // Record epoch metrics
    const avgLoss = totalLoss / trainInputs.length;
    history.loss.push(avgLoss);
    
    if (config.taskType === 'classification' && history.accuracy) {
      const accuracy = correctPredictions / trainInputs.length;
      history.accuracy.push(accuracy);
      
      if (onProgress) {
        onProgress(epoch + 1, avgLoss, accuracy);
      }
    } else {
      if (onProgress) {
        onProgress(epoch + 1, avgLoss);
      }
    }
    
    // Allow UI to update
    if (epoch % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  history.epochs = config.epochs;
  model.trainingHistory = history;
  model.trained = true;
  
  return history;
}

/**
 * Make predictions with the trained model
 */
export function predict(model: ANNModel, inputs: number[][]): number[][] {
  if (!model.trained) {
    throw new Error('Model must be trained before making predictions');
  }
  
  return inputs.map(input => {
    const result = forwardPass(model, input);
    return result.output;
  });
}

/**
 * Evaluate model performance
 */
export function evaluateModel(
  model: ANNModel,
  testInputs: number[][],
  testTargets: number[][]
): PredictionResult {
  const predictions = predict(model, testInputs);
  const flatPredictions = predictions.map(pred => 
    model.config.taskType === 'classification' ? getPredictedClass(pred) : pred[0]
  );
  
  const metrics: PredictionResult['metrics'] = {};
  
  if (model.config.taskType === 'regression') {
    // Calculate regression metrics
    const actualValues = testTargets.map(target => target[0]);
    const mse = calculateMSE(flatPredictions as number[], actualValues);
    const mae = calculateMAE(flatPredictions as number[], actualValues);
    const r2 = calculateR2(flatPredictions as number[], actualValues);
    
    metrics.mse = mse;
    metrics.mae = mae;
    metrics.r2 = r2;
  } else {
    // Calculate classification metrics
    const actualClasses = testTargets.map(target => 
      Array.isArray(target) && target.length > 1 ? getPredictedClass(target) : target[0]
    );
    const accuracy = calculateAccuracy(flatPredictions as number[], actualClasses);
    const confusionMatrix = calculateConfusionMatrix(
      flatPredictions as number[], 
      actualClasses, 
      model.config.outputSize
    );
    
    metrics.accuracy = accuracy;
    metrics.confusionMatrix = confusionMatrix;
  }
  
  return {
    predictions: flatPredictions,
    metrics
  };
}

/**
 * Calculate Mean Squared Error
 */
function calculateMSE(predicted: number[], actual: number[]): number {
  let sum = 0;
  for (let i = 0; i < predicted.length; i++) {
    const diff = predicted[i] - actual[i];
    sum += diff * diff;
  }
  return sum / predicted.length;
}

/**
 * Calculate Mean Absolute Error
 */
function calculateMAE(predicted: number[], actual: number[]): number {
  let sum = 0;
  for (let i = 0; i < predicted.length; i++) {
    sum += Math.abs(predicted[i] - actual[i]);
  }
  return sum / predicted.length;
}

/**
 * Calculate R-squared
 */
function calculateR2(predicted: number[], actual: number[]): number {
  const actualMean = actual.reduce((sum, val) => sum + val, 0) / actual.length;
  
  let totalSumSquares = 0;
  let residualSumSquares = 0;
  
  for (let i = 0; i < actual.length; i++) {
    totalSumSquares += Math.pow(actual[i] - actualMean, 2);
    residualSumSquares += Math.pow(actual[i] - predicted[i], 2);
  }
  
  return 1 - (residualSumSquares / totalSumSquares);
}

/**
 * Calculate classification accuracy
 */
function calculateAccuracy(predicted: number[], actual: number[]): number {
  let correct = 0;
  for (let i = 0; i < predicted.length; i++) {
    if (predicted[i] === actual[i]) {
      correct++;
    }
  }
  return correct / predicted.length;
}

/**
 * Calculate confusion matrix
 */
function calculateConfusionMatrix(
  predicted: number[], 
  actual: number[], 
  numClasses: number
): number[][] {
  const matrix: number[][] = Array(numClasses).fill(0).map(() => Array(numClasses).fill(0));
  
  for (let i = 0; i < predicted.length; i++) {
    const actualClass = Math.floor(actual[i]);
    const predictedClass = Math.floor(predicted[i]);
    
    if (actualClass >= 0 && actualClass < numClasses && 
        predictedClass >= 0 && predictedClass < numClasses) {
      matrix[actualClass][predictedClass]++;
    }
  }
  
  return matrix;
}

/**
 * Serialize model to JSON
 */
export function serializeModel(model: ANNModel): string {
  return JSON.stringify({
    config: model.config,
    weights: model.weights,
    biases: model.biases,
    trained: model.trained,
    trainingHistory: model.trainingHistory
  });
}

/**
 * Deserialize model from JSON
 */
export function deserializeModel(jsonString: string): ANNModel {
  const data = JSON.parse(jsonString);
  return {
    config: data.config,
    weights: data.weights,
    biases: data.biases,
    trained: data.trained,
    trainingHistory: data.trainingHistory
  };
}