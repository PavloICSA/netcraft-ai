import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Dataset, ANNConfig } from '../../types';
import { normalizeData } from '../../lib/data/csv-utils';

interface PredictorFormProps {
  dataset: Dataset;
  onTrain: (config: ANNConfig, data: { 
    inputs: number[][]; 
    targets: number[][]; 
    inputNormalizationStats?: { mean: number; std: number }[];
    targetNormalizationStats?: { mean: number; std: number }[];
  }) => void;
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
  const { t } = useTranslation('predictor');
  const [inputColumns, setInputColumns] = useState<string[]>([]);
  const [targetColumn, setTargetColumn] = useState<string>('');
  const [taskType, setTaskType] = useState<'regression' | 'classification'>('regression');
  const [hiddenLayers, setHiddenLayers] = useState<number[]>([10, 5]);
  const [activationFunction, setActivationFunction] = useState<'relu' | 'sigmoid' | 'tanh'>('relu');
  const [learningRate, setLearningRate] = useState(0.001); // Lower default learning rate
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
  }, [numericColumns.length, inputColumns.length]);

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
  }, [targetColumn, dataset.data.length]);

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputColumns.length === 0 || !targetColumn) {
      alert(t('form.validation.selectInputAndTarget'));
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

    // Validate data for NaN values
    const hasNaNInputs = inputs.some(row => row.some(val => isNaN(val)));
    const hasNaNTargets = targets.some(row => row.some(val => isNaN(val)));
    
    if (hasNaNInputs || hasNaNTargets) {
      alert(t('form.validation.invalidData'));
      return;
    }

    // Normalize input data for better training stability
    const { normalizedData: normalizedInputs, normalizationStats: inputNormalizationStats } = normalizeData(inputs);
    
    // Normalize target data for regression tasks
    let normalizedTargets = targets;
    let targetNormalizationStats: { mean: number; std: number }[] | undefined;
    
    if (taskType === 'regression') {
      const { normalizedData, normalizationStats } = normalizeData(targets);
      normalizedTargets = normalizedData;
      targetNormalizationStats = normalizationStats;
    }

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

    onTrain(config, { 
      inputs: normalizedInputs, 
      targets: normalizedTargets,
      inputNormalizationStats,
      targetNormalizationStats
    });
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
      <h2 className="text-xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">
        {t('form.title')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data Selection */}
        <div>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">{t('form.dataSelection.title')}</h3>
          
          {/* Input Columns */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
              {t('form.dataSelection.inputFeatures')}
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
                  <span className="ml-2 text-sm text-secondary-700 dark:text-gray-300">{column.name}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-secondary-500 mt-1">
              {t('form.dataSelection.selectedColumns', { count: inputColumns.length })}
            </p>
          </div>

          {/* Target Column */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
              {t('form.dataSelection.targetVariable')}
            </label>
            <select
              value={targetColumn}
              onChange={(e) => setTargetColumn(e.target.value)}
              className="input-field"
            >
              <option value="">{t('form.dataSelection.selectTargetColumn')}</option>
              {allColumns.map(column => (
                <option key={column.name} value={column.name}>
                  {column.name} ({column.type})
                </option>
              ))}
            </select>
          </div>

          {/* Task Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
              {t('form.dataSelection.taskType')}
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
                <span className="ml-2 text-sm text-secondary-700 dark:text-gray-300">{t('form.dataSelection.regression')}</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="classification"
                  checked={taskType === 'classification'}
                  onChange={(e) => setTaskType(e.target.value as 'classification')}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-secondary-700 dark:text-gray-300">{t('form.dataSelection.classification')}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Network Architecture */}
        <div>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">{t('form.architecture.title')}</h3>
          
          {/* Hidden Layers */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
              {t('form.architecture.hiddenLayers')}
            </label>
            <div className="space-y-2">
              {hiddenLayers.map((neurons, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-secondary-600 dark:text-gray-400 w-16">{t('form.architecture.layer', { number: index + 1 })}:</span>
                  <input
                    type="number"
                    value={neurons}
                    onChange={(e) => updateHiddenLayers(index, parseInt(e.target.value) || 1)}
                    min="1"
                    max="1000"
                    className="input-field flex-1"
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity(t('form.validation.neuronsRange'));
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity('');
                    }}
                  />
                  <span className="text-sm text-secondary-600 dark:text-gray-400">{t('form.architecture.neurons')}</span>
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
                {t('form.architecture.addLayer')}
              </button>
            </div>
          </div>

          {/* Activation Function */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
              {t('form.architecture.activationFunction')}
            </label>
            <select
              value={activationFunction}
              onChange={(e) => setActivationFunction(e.target.value as 'relu' | 'sigmoid' | 'tanh')}
              className="input-field"
            >
              <option value="relu">{t('form.architecture.relu')}</option>
              <option value="sigmoid">{t('form.architecture.sigmoid')}</option>
              <option value="tanh">{t('form.architecture.tanh')}</option>
            </select>
          </div>
        </div>

        {/* Training Parameters */}
        <div>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">{t('form.training.title')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                {t('form.training.learningRate')}
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
                    target.setCustomValidity(t('form.validation.learningRateRange'));
                  } else if (target.validity.rangeOverflow) {
                    target.setCustomValidity(t('form.validation.learningRateRange'));
                  } else if (target.validity.stepMismatch) {
                    target.setCustomValidity(t('form.validation.validDecimal'));
                  } else {
                    target.setCustomValidity(t('form.validation.validLearningRate'));
                  }
                }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.setCustomValidity('');
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                {t('form.training.epochs')}
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
                  target.setCustomValidity(t('form.validation.epochsRange'));
                }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.setCustomValidity('');
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                {t('form.training.batchSize')}
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
                  target.setCustomValidity(t('form.validation.batchSizeRange'));
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
              <span className="text-sm font-medium text-primary-900">{t('form.progress.title')}</span>
              <span className="text-sm text-primary-700">
                {t('form.progress.epoch', { current: trainingProgress.epoch, total: epochs })}
              </span>
            </div>
            <div className="w-full bg-primary-200 rounded-full h-2 mb-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(trainingProgress.epoch / epochs) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-primary-700">
              <span>{t('form.progress.loss', { value: trainingProgress.loss.toFixed(6) })}</span>
              {trainingProgress.accuracy !== undefined && (
                <span>{t('form.progress.accuracy', { value: (trainingProgress.accuracy * 100).toFixed(2) })}</span>
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
          {isTraining ? t('form.buttons.training') : t('form.buttons.trainModel')}
        </button>
      </form>
    </div>
  );
};

export default PredictorForm;