import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ForecastResult, ForecastModel } from '../../types';
import MetricsPanel from './MetricsPanel';
import TimeSeriesChart from './TimeSeriesChart';
import ForecastExport from './ForecastExport';
import { useTranslation } from 'react-i18next';

interface ForecastingResultsProps {
  models: ForecastModel[];
  results: ForecastResult[];
  isForecasting: boolean;
  onExportResults?: (results: ForecastResult[]) => void;
  onExportModel?: (model: ForecastModel) => void;
}

/**
 * Comprehensive forecasting results display component
 */
const ForecastingResults: React.FC<ForecastingResultsProps> = ({
  models,
  results,
  isForecasting,
  onExportResults,
  onExportModel
}) => {
  const { t } = useTranslation('forecasting');
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [showConfidenceIntervals, setShowConfidenceIntervals] = useState(true);
  const [activeTab, setActiveTab] = useState<'chart' | 'metrics' | 'comparison'>('chart');
  const [showExportModal, setShowExportModal] = useState(false);

  /**
   * Toggle method visibility in chart
   */
  const toggleMethod = (method: string) => {
    setSelectedMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  /**
   * Open export modal
   */
  const openExportModal = () => {
    setShowExportModal(true);
  };

  /**
   * Export specific model
   */
  const exportModel = (model: ForecastModel) => {
    if (!onExportModel) return;

    try {
      onExportModel(model);
    } catch (error) {
      console.error('Export failed:', error);
      alert(t('results.export.errors.jsonFailed'));
    }
  };

  /**
   * Format method name for display
   */
  const formatMethodName = (method: string): string => {
    return method
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  /**
   * Get method ranking based on average performance
   */
  const getMethodRanking = () => {
    if (results.length === 0) return [];

    return results
      .map(result => {
        // Calculate average rank across metrics (lower is better)
        const mae = result.metrics.mae;
        const rmse = result.metrics.rmse;
        const mape = result.metrics.mape;
        
        // Simple scoring: lower values are better
        const score = mae + rmse + mape;
        
        return {
          method: result.method,
          score,
          metrics: result.metrics
        };
      })
      .sort((a, b) => a.score - b.score);
  };

  if (isForecasting) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-2">{t('buttons.generating')}</h3>
          <p className="text-secondary-600 dark:text-gray-400">
            Please wait while the forecasting algorithms are processing your data...
          </p>
        </div>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-2">{t('results.metrics.noResults')}</h3>
          <p className="text-secondary-600 dark:text-gray-400">
            Configure and run a forecast to see results here.
          </p>
        </div>
      </div>
    );
  }

  const ranking = getMethodRanking();
  const timeSeriesData = models[0]?.trainingData;

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-2">
              {t('results.title')}
            </h3>
            <p className="text-sm text-secondary-600 dark:text-gray-400">
              {results.length} method{results.length > 1 ? 's' : ''} compared • 
              {timeSeriesData ? ` ${timeSeriesData.values.length} data points` : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={openExportModal}
              className="btn-secondary text-sm"
            >
              {t('results.export.title')}
            </button>
          </div>
        </div>

        {/* Method Controls */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-secondary-900 dark:text-gray-100 mb-2">Visible Methods</h4>
            <div className="flex flex-wrap gap-2">
              {results.map((result, index) => (
                <button
                  key={result.method}
                  onClick={() => toggleMethod(result.method)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedMethods.length === 0 || selectedMethods.includes(result.method)
                      ? 'bg-primary-100 border-primary-300 text-primary-700'
                      : 'bg-secondary-100 border-secondary-300 text-secondary-600 dark:text-gray-400'
                  }`}
                >
                  {formatMethodName(result.method)}
                </button>
              ))}
              <button
                onClick={() => setSelectedMethods([])}
                className="px-3 py-1 text-sm rounded-full border border-secondary-300 text-secondary-600 dark:text-gray-400 hover:bg-secondary-50"
              >
                Show All
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showConfidenceIntervals}
                onChange={(e) => setShowConfidenceIntervals(e.target.checked)}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-secondary-700 dark:text-gray-300">Show Confidence Intervals</span>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'chart', label: 'Visualization', icon: '📈' },
            { id: 'metrics', label: 'Accuracy Metrics', icon: '📊' },
            { id: 'comparison', label: 'Method Comparison', icon: '⚖️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 dark:text-gray-300 hover:border-secondary-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'chart' && timeSeriesData && (
          <TimeSeriesChart
            timeSeriesData={timeSeriesData}
            forecastResults={results}
            selectedMethods={selectedMethods}
            showConfidenceIntervals={showConfidenceIntervals}
            height={500}
          />
        )}

        {activeTab === 'metrics' && (
          <MetricsPanel results={results} />
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-6">
            {/* Method Ranking */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-4">
                Method Performance Ranking
              </h3>
              <div className="space-y-3">
                {ranking.map((item, index) => (
                  <div
                    key={item.method}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      index === 0 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : 'bg-secondary-50 border-secondary-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 
                          ? 'bg-green-50 dark:bg-green-900/200 text-white' 
                          : 'bg-secondary-400 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-secondary-900 dark:text-gray-100">
                          {formatMethodName(item.method)}
                        </div>
                        <div className="text-sm text-secondary-600 dark:text-gray-400">
                          Combined Score: {item.score.toFixed(4)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-secondary-600 dark:text-gray-400">
                        MAE: {item.metrics.mae.toFixed(4)}
                      </div>
                      <div className="text-sm text-secondary-600 dark:text-gray-400">
                        RMSE: {item.metrics.rmse.toFixed(4)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Model Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {models.map((model, index) => (
                <motion.div
                  key={model.config.method}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-secondary-900 dark:text-gray-100">
                      {formatMethodName(model.config.method)}
                    </h4>
                    {onExportModel && (
                      <button
                        onClick={() => exportModel(model)}
                        className="text-xs text-primary-600 hover:text-primary-700"
                      >
                        Export
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-600 dark:text-gray-400">Horizon:</span>
                      <span className="font-medium">{model.config.forecastHorizon}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600 dark:text-gray-400">Train Split:</span>
                      <span className="font-medium">{(model.config.trainTestSplit * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600 dark:text-gray-400">Confidence:</span>
                      <span className="font-medium">{(model.config.confidenceLevel * 100).toFixed(0)}%</span>
                    </div>
                    
                    {/* Method-specific parameters */}
                    {model.config.method === 'moving-average' && model.config.parameters.windowSize && (
                      <div className="flex justify-between">
                        <span className="text-secondary-600 dark:text-gray-400">Window:</span>
                        <span className="font-medium">{model.config.parameters.windowSize}</span>
                      </div>
                    )}
                    
                    {model.config.method === 'exponential-smoothing' && (
                      <>
                        {model.config.parameters.alpha && (
                          <div className="flex justify-between">
                            <span className="text-secondary-600 dark:text-gray-400">Alpha:</span>
                            <span className="font-medium">{model.config.parameters.alpha.toFixed(2)}</span>
                          </div>
                        )}
                        {model.config.parameters.beta && (
                          <div className="flex justify-between">
                            <span className="text-secondary-600 dark:text-gray-400">Beta:</span>
                            <span className="font-medium">{model.config.parameters.beta.toFixed(2)}</span>
                          </div>
                        )}
                      </>
                    )}
                    
                    {model.config.method === 'linear-trend' && model.config.parameters.polynomialDegree && (
                      <div className="flex justify-between">
                        <span className="text-secondary-600 dark:text-gray-400">Degree:</span>
                        <span className="font-medium">{model.config.parameters.polynomialDegree}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-secondary-200">
                    <div className="text-xs text-secondary-500">
                      Created: {(model.createdAt instanceof Date ? model.createdAt : new Date(model.createdAt)).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Export Modal */}
      {showExportModal && (
        <ForecastExport
          results={results}
          models={models}
          timeSeriesData={timeSeriesData}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};

export default ForecastingResults;