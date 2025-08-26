/**
 * Basic tests for NetCraft AI neural network implementation
 */

import { createModel, forwardPass, activationFunctions } from '../lib/ann/ann-logic-1';
import { trainModel } from '../lib/ann/ann-logic-2';
import { ANNConfig } from '../types';

describe('Neural Network Implementation', () => {
  test('should create a model with correct architecture', () => {
    const config: ANNConfig = {
      inputSize: 3,
      hiddenLayers: [5, 3],
      outputSize: 1,
      activationFunction: 'relu',
      learningRate: 0.01,
      epochs: 10,
      batchSize: 32,
      taskType: 'regression'
    };

    const model = createModel(config);

    expect(model.config).toEqual(config);
    expect(model.weights).toHaveLength(3); // input->hidden1, hidden1->hidden2, hidden2->output
    expect(model.biases).toHaveLength(3);
    expect(model.trained).toBe(false);
  });

  test('should perform forward pass correctly', () => {
    const config: ANNConfig = {
      inputSize: 2,
      hiddenLayers: [3],
      outputSize: 1,
      activationFunction: 'relu',
      learningRate: 0.01,
      epochs: 10,
      batchSize: 32,
      taskType: 'regression'
    };

    const model = createModel(config);
    const input = [1, 2];
    
    const result = forwardPass(model, input);
    
    expect(result.output).toHaveLength(1);
    expect(result.activations).toHaveLength(3); // input, hidden, output
    expect(result.zValues).toHaveLength(2); // hidden, output
  });

  test('should apply activation functions correctly', () => {
    expect(activationFunctions.relu(5)).toBe(5);
    expect(activationFunctions.relu(-3)).toBe(0);
    
    expect(activationFunctions.sigmoid(0)).toBeCloseTo(0.5, 5);
    expect(activationFunctions.sigmoid(100)).toBeCloseTo(1, 5);
    expect(activationFunctions.sigmoid(-100)).toBeCloseTo(0, 5);
    
    expect(activationFunctions.tanh(0)).toBe(0);
    expect(activationFunctions.tanh(100)).toBeCloseTo(1, 5);
    expect(activationFunctions.tanh(-100)).toBeCloseTo(-1, 5);
  });
});