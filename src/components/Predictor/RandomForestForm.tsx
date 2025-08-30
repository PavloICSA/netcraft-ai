import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Dataset, RandomForestConfig } from '../../types';
import { prepareTrainingData, validateRandomForestConfig } from '../../lib/random-forest/rf-utils';

interface RandomForestFormProps {
  dataset: Dataset;
  onTrain: (config: RandomForestConfig, data: { 
    features: number[][]; 
    targets: number[]; 
    featureNames: string[];
    taskType: 'regression' | 'classification';
  }) => void;
  isTraining: boolean;
  trainingProgress: { progress: number; treesCompleted: number; totalTrees: number } | null;
}

/**
 * Random Forest configuration form
 */
const RandomForestForm: React.FC<RandomForestFormProps> = ({
  dataset,
  onTrain,
  isTraining,
  trainingProgress
}) => {
  const { t } = useTranslation('predictor');
  const [inputColumns, setInputColumns] = useState<string[]>([]);
  const [targetColumn, setTargetColumn] = useState<string>('');
  const [taskType, setTaskType] = useState<'regression' | 'classification'>('regression');
  const [numTrees, setNumTrees] = useState(100);
  const [maxDepth, setMaxDepth] = useState<number | 'auto'>('auto');
  const [minSamplesLeaf, setMinSamplesLeaf] = useState(1);
  const [featureSamplingRatio, setFeatureSamplingRatio] = useState<'sqrt' | 'log2' | 'all'>('sqrt');
  const [bootstrapSampleRatio, setBootstrapSampleRatio] = useState(1.0);
  const [randomSeed, setRandomSeed] = useState<number | undefined>(42);

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
      alert(t('form.validation.selectInputAndTarget'));
      return;
    }

    // Create configuration
    const config: RandomForestConfig = {
      numTrees,
      maxDepth,
      minSamplesLeaf,
      featureSamplingRatio,
      taskType,
      randomSeed,
      bootstrapSampleRatio
    };

    // Validate configuration
    const validationErrors = validateRandomForestConfig(config);
    if (validationErrors.length > 0) {
      alert(t('randomForest.validation.configErrors', { errors: validationErrors.join('\n') }));
      return;
    }

    // Prepare training data
    try {
      const trainingData = prepareTrainingData(dataset.data, targetColumn, inputColumns);
      
      // Validate data for NaN values
      const hasNaNFeatures = trainingData.features.some(row => row.some(val => isNaN(val)));
      const hasNaNTargets = trainingData.targets.some(val => isNaN(val));
      
      if (hasNaNFeatures || hasNaNTargets) {
        alert(t('form.validation.invalidData'));
        return;
      }

      onTrain(config, trainingData);
    } catch (error) {
      alert(t('results.export.batchPredictionFailed', { error: (error as Error).message }));
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">
        {t('randomForest.title')}
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

        {/* Forest Configuration */}
        <div>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">{t('randomForest.forestConfig.title')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                {t('randomForest.forestConfig.numberOfTrees')}
              </label>
              <input
                type="number"
                value={numTrees}
                onChange={(e) => setNumTrees(parseInt(e.target.value) || 100)}
                min="10"
                max="500"
                className="input-field"
              />
              <p className="text-xs text-secondary-500 mt-1">{t('randomForest.helpText.treesRecommended')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                {t('randomForest.forestConfig.maxDepth')}
              </label>
              <select
                value={maxDepth}
                onChange={(e) => setMaxDepth(e.target.value === 'auto' ? 'auto' : parseInt(e.target.value))}
                className="input-field"
              >
                <option value="auto">{t('randomForest.forestConfig.auto')}</option>
                {Array.from({ length: 20 }, (_, i) => i + 1).map(depth => (
                  <option key={depth} value={depth}>{depth}</option>
                ))}
              </select>
              <p className="text-xs text-secondary-500 mt-1">{t('randomForest.helpText.autoDepth')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                {t('randomForest.forestConfig.minSamplesLeaf')}
              </label>
              <input
                type="number"
                value={minSamplesLeaf}
                onChange={(e) => setMinSamplesLeaf(parseInt(e.target.value) || 1)}
                min="1"
                max="20"
                className="input-field"
              />
              <p className="text-xs text-secondary-500 mt-1">{t('randomForest.helpText.minSamplesHelp')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                {t('randomForest.forestConfig.featureSampling')}
              </label>
              <select
                value={featureSamplingRatio}
                onChange={(e) => setFeatureSamplingRatio(e.target.value as 'sqrt' | 'log2' | 'all')}
                className="input-field"
              >
                <option value="sqrt">{t('randomForest.forestConfig.sqrtFeatures')}</option>
                <option value="log2">{t('randomForest.forestConfig.log2Features')}</option>
                <option value="all">{t('randomForest.forestConfig.allFeatures')}</option>
              </select>
              <p className="text-xs text-secondary-500 mt-1">{t('randomForest.helpText.featureSamplingHelp')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                {t('randomForest.forestConfig.bootstrapSampleRatio')}
              </label>
              <input
                type="number"
                value={bootstrapSampleRatio}
                onChange={(e) => setBootstrapSampleRatio(parseFloat(e.target.value) || 1.0)}
                min="0.1"
                max="1.0"
                step="0.1"
                className="input-field"
              />
              <p className="text-xs text-secondary-500 mt-1">{t('randomForest.helpText.bootstrapHelp')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                {t('randomForest.forestConfig.randomSeed')}
              </label>
              <input
                type="number"
                value={randomSeed || ''}
                onChange={(e) => setRandomSeed(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="42"
                className="input-field"
              />
              <p className="text-xs text-secondary-500 mt-1">{t('randomForest.helpText.seedHelp')}</p>
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
              <span className="text-sm font-medium text-primary-900">{t('randomForest.progress.title')}</span>
              <span className="text-sm text-primary-700">
                {t('randomForest.progress.tree', { current: trainingProgress.treesCompleted, total: trainingProgress.totalTrees })}
              </span>
            </div>
            <div className="w-full bg-primary-200 rounded-full h-2 mb-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${trainingProgress.progress}%` }}
              />
            </div>
            <div className="text-xs text-primary-700">
              {t('randomForest.progress.complete', { percent: trainingProgress.progress.toFixed(1) })}
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isTraining || inputColumns.length === 0 || !targetColumn}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTraining ? t('randomForest.buttons.trainingForest') : t('randomForest.buttons.trainForest')}
        </button>
      </form>
    </div>
  );
};

export default RandomForestForm;