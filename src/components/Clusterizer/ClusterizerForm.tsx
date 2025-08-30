import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Dataset, ClusterConfig } from '../../types';
import LocaleNumber from '../Common/LocaleNumber';

interface ClusterizerFormProps {
  dataset: Dataset;
  onCluster: (config: ClusterConfig, data: number[][]) => void;
  isProcessing: boolean;
  processingProgress: { step: string; progress: number } | null;
}

/**
 * Clustering configuration form
 */
const ClusterizerForm: React.FC<ClusterizerFormProps> = ({
  dataset,
  onCluster,
  isProcessing,
  processingProgress
}) => {
  const { t } = useTranslation('clusterizer');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [method, setMethod] = useState<'kmeans' | 'som'>('kmeans');
  const [k, setK] = useState(3);
  const [gridWidth, setGridWidth] = useState(5);
  const [gridHeight, setGridHeight] = useState(5);
  const [epochs, setEpochs] = useState(100);
  const [learningRate, setLearningRate] = useState(0.1);

  const numericColumns = dataset.columns.filter(col => col.type === 'numeric');

  // Auto-select numeric columns
  useEffect(() => {
    if (numericColumns.length > 0 && selectedColumns.length === 0) {
      setSelectedColumns(numericColumns.slice(0, 4).map(col => col.name));
    }
  }, [dataset]);

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedColumns.length === 0) {
      alert(t('form.selectAtLeastOne'));
      return;
    }

    // Prepare data
    const data: number[][] = dataset.data.map(row => {
      return selectedColumns.map(col => {
        const value = row[col];
        return typeof value === 'number' ? value : parseFloat(value) || 0;
      });
    });

    // Create configuration
    const config: ClusterConfig = {
      method,
      epochs,
      ...(method === 'kmeans' ? { k } : {
        gridSize: [gridWidth, gridHeight] as [number, number],
        learningRate
      })
    };

    onCluster(config, data);
  };

  /**
   * Toggle column selection
   */
  const toggleColumn = (columnName: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnName)
        ? prev.filter(name => name !== columnName)
        : [...prev, columnName]
    );
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">
        {t('form.title')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Feature Selection */}
        <div>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">{t('form.featureSelection')}</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
              {t('form.selectFeatures')}
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-secondary-200 rounded-lg p-3">
              {numericColumns.map(column => (
                <label key={column.name} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column.name)}
                    onChange={() => toggleColumn(column.name)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-secondary-700 dark:text-gray-300">{column.name}</span>
                  {column.stats && (
                    <span className="ml-auto text-xs text-secondary-500">
                      <LocaleNumber value={column.stats.min || 0} options={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} /> - <LocaleNumber value={column.stats.max || 0} options={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
                    </span>
                  )}
                </label>
              ))}
            </div>
            <p className="text-xs text-secondary-500 mt-1">
              {t('form.selectedFeatures', { count: selectedColumns.length })}
            </p>
          </div>
        </div>

        {/* Method Selection */}
        <div>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">{t('form.clusteringMethod')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              method === 'kmeans' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'
            }`}>
              <input
                type="radio"
                value="kmeans"
                checked={method === 'kmeans'}
                onChange={(e) => setMethod(e.target.value as 'kmeans')}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-2">{t('form.kmeans')}</div>
                <div className="text-sm text-secondary-600 dark:text-gray-400">
                  {t('form.kmeansDescription')}
                </div>
              </div>
            </label>

            <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              method === 'som' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'
            }`}>
              <input
                type="radio"
                value="som"
                checked={method === 'som'}
                onChange={(e) => setMethod(e.target.value as 'som')}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-2">{t('form.som')}</div>
                <div className="text-sm text-secondary-600 dark:text-gray-400">
                  {t('form.somDescription')}
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Method-specific Parameters */}
        <div>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">{t('form.parameters.title')}</h3>
          
          {method === 'kmeans' ? (
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                {t('form.parameters.numberOfClusters')}
              </label>
              <input
                type="number"
                value={k}
                onChange={(e) => setK(parseInt(e.target.value) || 3)}
                min="2"
                max="20"
                className="input-field"
                onInvalid={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.setCustomValidity(t('form.validation.numberBetween2And20'));
                }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.setCustomValidity('');
                }}
              />
              <p className="text-xs text-secondary-500 mt-1">
                {t('form.parameters.numberOfClustersHelp')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                    {t('form.parameters.gridWidth')}
                  </label>
                  <input
                    type="number"
                    value={gridWidth}
                    onChange={(e) => setGridWidth(parseInt(e.target.value) || 5)}
                    min="2"
                    max="20"
                    className="input-field"
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity(t('form.validation.numberBetween2And20'));
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity('');
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                    {t('form.parameters.gridHeight')}
                  </label>
                  <input
                    type="number"
                    value={gridHeight}
                    onChange={(e) => setGridHeight(parseInt(e.target.value) || 5)}
                    min="2"
                    max="20"
                    className="input-field"
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity(t('form.validation.numberBetween2And20'));
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity('');
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                  {t('form.parameters.learningRate')}
                </label>
                <input
                  type="number"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value) || 0.1)}
                  min="0.001"
                  max="1"
                  step="0.01"
                  className="input-field"
                  onInvalid={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.validity.rangeUnderflow) {
                      target.setCustomValidity(t('form.validation.valueBetween0001And1'));
                    } else if (target.validity.rangeOverflow) {
                      target.setCustomValidity(t('form.validation.valueBetween0001And1'));
                    } else if (target.validity.stepMismatch) {
                      target.setCustomValidity(t('form.validation.validDecimalNumber'));
                    } else {
                      target.setCustomValidity(t('form.validation.validLearningRate'));
                    }
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.setCustomValidity('');
                  }}
                />
                <p className="text-xs text-secondary-500 mt-1">
                  {t('form.parameters.learningRateHelp')}
                </p>
              </div>
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
              {t('form.parameters.trainingEpochs')}
            </label>
            <input
              type="number"
              value={epochs}
              onChange={(e) => setEpochs(parseInt(e.target.value) || 100)}
              min="10"
              max="1000"
              className="input-field"
              onInvalid={(e) => {
                const target = e.target as HTMLInputElement;
                target.setCustomValidity(t('form.validation.numberBetween10And1000'));
              }}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.setCustomValidity('');
              }}
            />
            <p className="text-xs text-secondary-500 mt-1">
              {t('form.parameters.trainingEpochsHelp')}
            </p>
          </div>
        </div>

        {/* Processing Progress */}
        {isProcessing && processingProgress && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary-50 border border-primary-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-primary-900">
                {processingProgress.step}
              </span>
              <span className="text-sm text-primary-700">
                {processingProgress.progress}%
              </span>
            </div>
            <div className="w-full bg-primary-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${processingProgress.progress}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || selectedColumns.length === 0}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? t('form.processing') : t('form.runClustering', { method: method === 'kmeans' ? t('form.kmeans') : t('form.som') })}
        </button>
      </form>

      {/* Data Summary */}
      <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
        <h4 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('form.dataSummary.title')}</h4>
        <div className="text-sm text-secondary-600 dark:text-gray-400 space-y-1">
          <div>{t('form.dataSummary.totalSamples', { count: dataset.data.length })}</div>
          <div>{t('form.dataSummary.selectedFeatures', { count: selectedColumns.length })}</div>
          <div>{t('form.dataSummary.method', { method: method === 'kmeans' ? t('form.kmeans') : t('form.som') })}</div>
          {method === 'kmeans' ? (
            <div>{t('form.dataSummary.targetClusters', { count: k })}</div>
          ) : (
            <div>{t('form.dataSummary.somGrid', { width: gridWidth, height: gridHeight, total: gridWidth * gridHeight })}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClusterizerForm;