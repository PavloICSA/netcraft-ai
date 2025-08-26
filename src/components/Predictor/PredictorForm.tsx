import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dataset, ANNConfig } from '../../types';

interface PredictorFormProps {
  dataset: Dataset;
  onTrain: (config: ANNConfig, data: { inputs: number[][]; targets: number[][] }) => void;
  isTraining: boolean;
  trainingProgress: { epoch: number; loss: number; accuracy?: number } | null;
}

/**
 * Neural network configuration form
 */
const PredictorForm: React.FC<PredictorFormProps> = ({
  dataset,
  onTrain,
  isTraining,
  trainingProgress
}) => {
  const [inputColumns, setInputColumns] = useState<string[]>([]);
  const [targetColumn, setTargetColumn] = useState<string>('');
  const [taskType, setTaskType] = useState<'regression' | 'classification'>('regression');
  const [hiddenLayers, setHiddenLayers] = useState<number[]>([10, 5]);
  const [activationFunction, setActivationFunction] = useState<'relu' | 'sigmoid' | 'tanh'>('relu');
  const [learningRate, setLearningRate] = useState(0.01);
  const [epochs, setEpochs] = useState(100);
  const [batchSize, setBatchSize] = useState(32);

  const numericColumns = dataset.columns.filter(col => col.type === 'numeric');
  const allColumns = dataset.columns;

  // Auto-select numeric columns as inputs
  useEffect(() => {
    if (numericColumns.length > 0 && inputColumns.length === 0) {
      setInputColumns(numericColumns.slice(0, -1).map(col => col.name));
      if (numericColumns.length > 1) {
        setTargetColumn(numericColumns[numericColumns.length - 1].name);
      }
    }
  }, [dataset]);

  // Auto-detect task type based on target column
  useEffect(() => {
    if (targetColumn) {
      const targetCol = dataset.columns.find(col => col.name === targetColumn);
      if (targetCol && targetCol.stats) {
        // If unique values are less than 10% of total data, likely classification
        const uniqueRatio = targetCol.stats.unique! / dataset.data.length;
        setTaskType(uniqueRatio < 0.1 ? 'classification' : 'regression');
      }
    }
  }, [targetColumn, dataset]);

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputColumns.length === 0 || !targetColumn) {
      alert('Please select input columns and target column');
      return;
    }

    // Prepare training data
    const inputs: number[][] = [];
    const targets: number[][] = [];

    dataset.data.forEach(row => {
      // Extract input features
      const inputRow = inputColumns.map(col => {
        const value = row[col];
        return typeof value === 'number' ? value : parseFloat(value) || 0;
      });

      // Extract target
      const targetValue = row[targetColumn];
      let targetRow: number[];

      if (taskType === 'classification') {
        // For classification, convert to class index
        const uniqueValues = [...new Set(dataset.data.map(r => r[targetColumn]))].sort();
        const classIndex = uniqueValues.indexOf(targetValue);
        targetRow = [classIndex];
      } else {
        // For regression, use numeric value
        targetRow = [typeof targetValue === 'number' ? targetValue : parseFloat(targetValue) || 0];
      }

      inputs.push(inputRow);
      targets.push(targetRow);
    });

    // Create configuration
    const config: ANNConfig = {
      inputSize: inputColumns.length,
      hiddenLayers,
      outputSize: taskType === 'classification' 
        ? Math.max(2, [...new Set(targets.map(t => t[0]))].length)
        : 1,
      activationFunction,
      learningRate,
      epochs,
      batchSize,
      taskType
    };

    onTrain(config, { inputs, targets });
  };

  /**
   * Update hidden layers
   */
  const updateHiddenLayers = (index: number, value: number) => {
    const newLayers = [...hiddenLayers];
    newLayers[index] = value;
    setHiddenLayers(newLayers);
  };

  /**
   * Add hidden layer
   */
  const addHiddenLayer = () => {
    setHiddenLayers([...hiddenLayers, 5]);
  };

  /**
   * Remove hidden layer
   */
  const removeHiddenLayer = (index: number) => {
    if (hiddenLayers.length > 1) {
      setHiddenLayers(hiddenLayers.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-secondary-900 mb-6">
        Neural Network Configuration
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data Selection */}
        <div>
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Data Selection</h3>
          
          {/* Input Columns */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Input Features
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-secondary-200 rounded-lg p-3">
              {numericColumns.map(column => (
                <label key={column.name} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={inputColumns.includes(column.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setInputColumns([...inputColumns, column.name]);
                      } else {
                        setInputColumns(inputColumns.filter(col => col !== column.name));
                      }
                    }}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-secondary-700">{column.name}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-secondary-500 mt-1">
              Selected: {inputColumns.length} columns
            </p>
          </div>

          {/* Target Column */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Target Variable
            </label>
            <select
              value={targetColumn}
              onChange={(e) => setTargetColumn(e.target.value)}
              className="input-field"
            >
              <option value="">Select target column</option>
              {allColumns.map(column => (
                <option key={column.name} value={column.name}>
                  {column.name} ({column.type})
                </option>
              ))}
            </select>
          </div>

          {/* Task Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Task Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="regression"
                  checked={taskType === 'regression'}
                  onChange={(e) => setTaskType(e.target.value as 'regression')}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-secondary-700">Regression</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="classification"
                  checked={taskType === 'classification'}
                  onChange={(e) => setTaskType(e.target.value as 'classification')}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-secondary-700">Classification</span>
              </label>
            </div>
          </div>
        </div>

        {/* Network Architecture */}
        <div>
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Network Architecture</h3>
          
          {/* Hidden Layers */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Hidden Layers
            </label>
            <div className="space-y-2">
              {hiddenLayers.map((neurons, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-secondary-600 w-16">Layer {index + 1}:</span>
                  <input
                    type="number"
                    value={neurons}
                    onChange={(e) => updateHiddenLayers(index, parseInt(e.target.value) || 1)}
                    min="1"
                    max="1000"
                    className="input-field flex-1"
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity('Please enter a number between 1 and 1000');
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity('');
                    }}
                  />
                  <span className="text-sm text-secondary-600">neurons</span>
                  {hiddenLayers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHiddenLayer(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addHiddenLayer}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                + Add Layer
              </button>
            </div>
          </div>

          {/* Activation Function */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Activation Function
            </label>
            <select
              value={activationFunction}
              onChange={(e) => setActivationFunction(e.target.value as 'relu' | 'sigmoid' | 'tanh')}
              className="input-field"
            >
              <option value="relu">ReLU</option>
              <option value="sigmoid">Sigmoid</option>
              <option value="tanh">Tanh</option>
            </select>
          </div>
        </div>

        {/* Training Parameters */}
        <div>
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Training Parameters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Learning Rate
              </label>
              <input
                type="number"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value) || 0.01)}
                min="0.0001"
                max="1"
                step="0.001"
                className="input-field"
                onInvalid={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (target.validity.rangeUnderflow) {
                    target.setCustomValidity('Please enter a value between 0.0001 and 1');
                  } else if (target.validity.rangeOverflow) {
                    target.setCustomValidity('Please enter a value between 0.0001 and 1');
                  } else if (target.validity.stepMismatch) {
                    target.setCustomValidity('Please enter a valid decimal number');
                  } else {
                    target.setCustomValidity('Please enter a valid learning rate between 0.0001 and 1');
                  }
                }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.setCustomValidity('');
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Epochs
              </label>
              <input
                type="number"
                value={epochs}
                onChange={(e) => setEpochs(parseInt(e.target.value) || 100)}
                min="1"
                max="10000"
                className="input-field"
                onInvalid={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.setCustomValidity('Please enter a number between 1 and 10000');
                }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.setCustomValidity('');
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Batch Size
              </label>
              <input
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(parseInt(e.target.value) || 32)}
                min="1"
                max="1000"
                className="input-field"
                onInvalid={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.setCustomValidity('Please enter a number between 1 and 1000');
                }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.setCustomValidity('');
                }}
              />
            </div>
          </div>
        </div>

        {/* Training Progress */}
        {isTraining && trainingProgress && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary-50 border border-primary-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-primary-900">Training Progress</span>
              <span className="text-sm text-primary-700">
                Epoch {trainingProgress.epoch} / {epochs}
              </span>
            </div>
            <div className="w-full bg-primary-200 rounded-full h-2 mb-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(trainingProgress.epoch / epochs) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-primary-700">
              <span>Loss: {trainingProgress.loss.toFixed(6)}</span>
              {trainingProgress.accuracy !== undefined && (
                <span>Accuracy: {(trainingProgress.accuracy * 100).toFixed(2)}%</span>
              )}
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isTraining || inputColumns.length === 0 || !targetColumn}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTraining ? 'Training...' : 'Train Model'}
        </button>
      </form>
    </div>
  );
};

export default PredictorForm;