import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ANNModel, PredictionResult } from '../../types';
import { serializeModel } from '../../lib/ann/ann-logic-2';
import { downloadElementAsImage, generateImageFilename } from '../../utils/image-export';
import LocaleNumber from '../Common/LocaleNumber';

interface PredictorResultsProps {
  model: ANNModel | null;
  results: PredictionResult | null;
  isTraining: boolean;
  trainingProgress: { epoch: number; loss: number; accuracy?: number } | null;
}

/**
 * Neural network results display component
 */
const PredictorResults: React.FC<PredictorResultsProps> = ({
  model,
  results,
  isTraining,
  trainingProgress
}) => {
  const { t } = useTranslation('predictor');
  const confusionMatrixRef = useRef<HTMLDivElement>(null);
  /**
   * Export model as JSON
   */
  const exportModel = () => {
    if (!model) return;

    try {
      const modelJson = serializeModel(model);
      const blob = new Blob([modelJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `netcraft_model_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert(t('results.export.exportFailed'));
    }
  };

  /**
   * Export predictions as CSV
   */
  const exportPredictions = () => {
    if (!results) return;

    try {
      const csvContent = [
        'Index,Prediction',
        ...results.predictions.map((pred, index) => `${index},${pred}`)
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `netcraft_predictions_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert(t('results.export.exportFailed'));
    }
  };

  /**
   * Export confusion matrix as image
   */
  const exportConfusionMatrix = async () => {
    if (!confusionMatrixRef.current) return;

    try {
      const filename = generateImageFilename('confusion_matrix');
      await downloadElementAsImage(confusionMatrixRef.current, filename);
    } catch (error) {
      console.error('Export failed:', error);
      alert(t('results.export.confusionMatrixExportFailed'));
    }
  };

  if (isTraining) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-2">{t('results.ann.trainingModel')}</h3>
          <p className="text-secondary-600 dark:text-gray-400">
            {t('results.ann.trainingDescription')}
          </p>
          {trainingProgress && (
            <div className="mt-4 text-sm text-secondary-500">
              {t('form.progress.epoch', { current: trainingProgress.epoch, total: '?' })} • {t('form.progress.loss', { value: trainingProgress.loss.toFixed(6) })}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!model || !results) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-2">{t('results.ann.noModel')}</h3>
          <p className="text-secondary-600 dark:text-gray-400">
            {t('results.ann.noModelDescription')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Model Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-2">
              {t('results.ann.title')}
            </h3>
            <div className="text-sm text-secondary-600 dark:text-gray-400 space-y-1">
              <div>{t('results.ann.task', { type: model.config.taskType })}</div>
              <div>{t('results.ann.architecture', { input: model.config.inputSize, hidden: model.config.hiddenLayers.join(' → '), output: model.config.outputSize })}</div>
              <div>{t('results.ann.activation', { function: model.config.activationFunction })}</div>
              <div>{t('results.ann.learningRate', { rate: model.config.learningRate })}</div>
            </div>
          </div>
          <button
            onClick={exportModel}
            className="btn-secondary text-sm"
          >
            {t('results.export.exportModel')}
          </button>
        </div>

        {/* Training History */}
        {model.trainingHistory && (
          <div className="mt-4">
            <h4 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('results.ann.trainingHistory')}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-secondary-600 dark:text-gray-400">{t('results.ann.epochs')}</span>
                <span className="ml-2 font-medium">{model.trainingHistory.epochs}</span>
              </div>
              <div>
                <span className="text-secondary-600 dark:text-gray-400">{t('results.ann.finalLoss')}</span>
                <span className="ml-2 font-medium">
                  <LocaleNumber value={model.trainingHistory.loss[model.trainingHistory.loss.length - 1]} options={{ minimumFractionDigits: 6, maximumFractionDigits: 6 }} />
                </span>
              </div>
              {model.trainingHistory.accuracy && (
                <div>
                  <span className="text-secondary-600 dark:text-gray-400">{t('results.ann.finalAccuracy')}</span>
                  <span className="ml-2 font-medium">
                    <LocaleNumber value={model.trainingHistory.accuracy[model.trainingHistory.accuracy.length - 1] * 100} options={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100">
            {t('results.metrics.title')}
          </h3>
          <button
            onClick={exportPredictions}
            className="btn-secondary text-sm"
          >
            {t('results.export.exportPredictions')}
          </button>
        </div>

        {model.config.taskType === 'regression' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                <LocaleNumber value={results.metrics.mse || 0} options={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }} />
              </div>
              <div className="text-sm text-blue-700">{t('results.metrics.meanSquaredError')}</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                <LocaleNumber value={results.metrics.mae || 0} options={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }} />
              </div>
              <div className="text-sm text-green-700">{t('results.metrics.meanAbsoluteError')}</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                <LocaleNumber value={results.metrics.r2 || 0} options={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }} />
              </div>
              <div className="text-sm text-purple-700">{t('results.metrics.rSquaredScore')}</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                <LocaleNumber value={results.metrics.accuracy! * 100} options={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />%
              </div>
              <div className="text-sm text-green-700">{t('results.metrics.accuracy')}</div>
            </div>

            {/* Confusion Matrix */}
            {results.metrics.confusionMatrix && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-secondary-900 dark:text-gray-100">{t('results.confusionMatrix.title')}</h4>
                  <button
                    onClick={exportConfusionMatrix}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-secondary-700 dark:text-gray-300 bg-white border border-secondary-300 rounded-md hover:bg-secondary-50 hover:border-secondary-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    title={t('results.confusionMatrix.downloadImage')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {t('results.confusionMatrix.downloadImage')}
                  </button>
                </div>
                <div ref={confusionMatrixRef} className="bg-white p-4 rounded-lg border border-secondary-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="p-3 text-left font-semibold text-secondary-700 dark:text-gray-300 border-b-2 border-secondary-200">
                            {t('results.confusionMatrix.actual')} \ {t('results.confusionMatrix.predicted')}
                          </th>
                          {results.metrics.confusionMatrix[0].map((_, index) => (
                            <th key={index} className="p-3 text-center font-semibold text-secondary-700 dark:text-gray-300 border-b-2 border-secondary-200">
                              {t('results.confusionMatrix.class', { number: index })}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.metrics.confusionMatrix.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            <td className="p-3 font-semibold text-secondary-700 dark:text-gray-300 border-r border-secondary-200">
                              {t('results.confusionMatrix.class', { number: rowIndex })}
                            </td>
                            {row.map((value, colIndex) => (
                              <td
                                key={colIndex}
                                className={`p-3 text-center font-medium border-r border-secondary-100 ${
                                  rowIndex === colIndex 
                                    ? 'bg-green-100 text-green-800' 
                                    : value > 0 
                                      ? 'bg-red-50 dark:bg-red-900/20 text-red-700' 
                                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-600'
                                }`}
                              >
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Predictions Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          {t('results.predictions.title')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-2 px-3">{t('results.predictions.sample')}</th>
                <th className="text-left py-2 px-3">{t('results.predictions.prediction')}</th>
              </tr>
            </thead>
            <tbody>
              {results.predictions.slice(0, 10).map((prediction, index) => (
                <tr key={index} className="border-b border-secondary-100">
                  <td className="py-2 px-3">{index + 1}</td>
                  <td className="py-2 px-3">
                    {model.config.taskType === 'classification'
                      ? t('results.predictions.class', { number: prediction })
                      : <LocaleNumber value={prediction} options={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }} />
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {results.predictions.length > 10 && (
          <p className="text-sm text-secondary-500 mt-2">
            Showing first 10 of {results.predictions.length} predictions
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default PredictorResults;