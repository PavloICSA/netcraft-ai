import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ForecastResult, ForecastModel, TimeSeriesData } from '../../types';
import { useTranslation } from 'react-i18next';
import useLocale from '../../hooks/useLocale';

interface ForecastExportProps {
  results: ForecastResult[];
  models: ForecastModel[];
  timeSeriesData?: TimeSeriesData;
  onClose?: () => void;
}

/**
 * Export component for forecasting results and models
 */
const ForecastExport: React.FC<ForecastExportProps> = ({
  results,
  models,
  timeSeriesData,
  onClose
}) => {
  const { t } = useTranslation('forecasting');
  const { getLocaleCode } = useLocale();
  const locale = getLocaleCode();
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeConfidenceIntervals, setIncludeConfidenceIntervals] = useState(true);
  const [selectedMethods, setSelectedMethods] = useState<string[]>(
    results.map(r => r.method)
  );

  /**
   * Export forecast results as CSV
   */
  const exportResultsAsCSV = () => {
    try {
      const filteredResults = results.filter(r => selectedMethods.includes(r.method));
      
      if (filteredResults.length === 0) {
        alert(t('results.export.methods.selectAtLeastOne'));
        return;
      }

      const exportData: Record<string, any>[] = [];

      filteredResults.forEach((result) => {
        // Historical data with fitted values
        result.timestamps.historical.forEach((timestamp, i) => {
          const row: Record<string, any> = {
            timestamp: timestamp.toISOString(),
            date: timestamp.toLocaleDateString(locale),
            time: timestamp.toLocaleTimeString(locale),
            type: 'historical',
            method: result.method,
            actual_value: timeSeriesData?.values[i] || null,
            fitted_value: result.fittedValues[i] || null,
            prediction: null,
            residual: timeSeriesData?.values[i] && result.fittedValues[i] 
              ? timeSeriesData.values[i] - result.fittedValues[i] 
              : null
          };

          if (includeConfidenceIntervals) {
            row.confidence_lower = null;
            row.confidence_upper = null;
          }

          exportData.push(row);
        });

        // Forecast data
        result.timestamps.forecast.forEach((timestamp, i) => {
          const row: Record<string, any> = {
            timestamp: timestamp.toISOString(),
            date: timestamp.toLocaleDateString(locale),
            time: timestamp.toLocaleTimeString(locale),
            type: 'forecast',
            method: result.method,
            actual_value: null,
            fitted_value: null,
            prediction: result.predictions[i],
            residual: null
          };

          if (includeConfidenceIntervals) {
            row.confidence_lower = result.confidenceIntervals.lower[i];
            row.confidence_upper = result.confidenceIntervals.upper[i];
          }

          exportData.push(row);
        });
      });

      // Add metadata as separate rows if requested
      if (includeMetadata) {
        filteredResults.forEach((result) => {
          const metadataRow: Record<string, any> = {
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            type: 'metadata',
            method: result.method,
            actual_value: null,
            fitted_value: null,
            prediction: null,
            residual: null,
            mae: result.metrics.mae,
            rmse: result.metrics.rmse,
            mape: result.metrics.mape,
            r2: result.metrics.r2 || null
          };

          if (includeConfidenceIntervals) {
            metadataRow.confidence_lower = null;
            metadataRow.confidence_upper = null;
          }

          exportData.push(metadataRow);
        });
      }

      // Convert to CSV
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header];
            if (value === null || value === undefined) return '';
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return String(value);
          }).join(',')
        )
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `forecast_results_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('CSV export failed:', error);
      alert(t('results.export.errors.csvFailed'));
    }
  };

  /**
   * Export forecast models as JSON
   */
  const exportModelsAsJSON = () => {
    try {
      const filteredModels = models.filter(m => selectedMethods.includes(m.config.method));
      
      if (filteredModels.length === 0) {
        alert('Please select at least one method to export.');
        return;
      }

      const exportData = {
        exportInfo: {
          exportedAt: new Date().toISOString(),
          version: '1.0',
          application: 'NetCraft AI - Time Series Forecasting',
          totalModels: filteredModels.length
        },
        timeSeriesData: includeMetadata ? timeSeriesData : null,
        models: filteredModels.map(model => ({
          ...model,
          createdAt: model.createdAt.toISOString()
        })),
        results: results.filter(r => selectedMethods.includes(r.method))
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `forecast_models_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('JSON export failed:', error);
      alert(t('results.export.errors.jsonFailed'));
    }
  };

  /**
   * Handle export based on selected format
   */
  const handleExport = () => {
    if (exportFormat === 'csv') {
      exportResultsAsCSV();
    } else {
      exportModelsAsJSON();
    }
  };

  /**
   * Toggle method selection
   */
  const toggleMethod = (method: string) => {
    setSelectedMethods(prev => 
      prev.includes(method)
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-gray-100">
            {t('results.export.title')}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-secondary-400 hover:text-secondary-600 dark:text-gray-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <h3 className="text-sm font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('results.export.format.title')}</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={(e) => setExportFormat(e.target.value as 'csv')}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-secondary-700 dark:text-gray-300">
                  {t('results.export.format.csv')}
                </span>
              </label>
              <p className="text-xs text-secondary-500 ml-6">
                {t('results.export.format.csvDescription')}
              </p>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={(e) => setExportFormat(e.target.value as 'json')}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-secondary-700 dark:text-gray-300">
                  {t('results.export.format.json')}
                </span>
              </label>
              <p className="text-xs text-secondary-500 ml-6">
                {t('results.export.format.jsonDescription')}
              </p>
            </div>
          </div>

          {/* Method Selection */}
          <div>
            <h3 className="text-sm font-medium text-secondary-900 dark:text-gray-100 mb-3">
              {t('results.export.methods.title', { count: selectedMethods.length })}
            </h3>
            <div className="space-y-2">
              {results.map((result) => (
                <label key={result.method} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedMethods.includes(result.method)}
                    onChange={() => toggleMethod(result.method)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-secondary-700 dark:text-gray-300">
                    {formatMethodName(result.method)}
                  </span>
                  <span className="ml-auto text-xs text-secondary-500">
                    MAE: {result.metrics.mae.toFixed(4)}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-2">
              <button
                onClick={() => setSelectedMethods(results.map(r => r.method))}
                className="text-xs text-primary-600 hover:text-primary-700 mr-3"
              >
                {t('results.export.methods.selectAll')}
              </button>
              <button
                onClick={() => setSelectedMethods([])}
                className="text-xs text-secondary-600 dark:text-gray-400 hover:text-secondary-700 dark:text-gray-300"
              >
                {t('results.export.methods.clearAll')}
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h3 className="text-sm font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('results.export.options.title')}</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-secondary-700 dark:text-gray-300">
                  {t('results.export.options.includeMetadata')}
                </span>
              </label>
              
              {exportFormat === 'csv' && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeConfidenceIntervals}
                    onChange={(e) => setIncludeConfidenceIntervals(e.target.checked)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-secondary-700 dark:text-gray-300">
                    {t('results.export.options.includeConfidenceIntervals')}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('results.export.summary.title')}</h4>
            <div className="text-xs text-secondary-600 dark:text-gray-400 space-y-1">
              <div>{t('results.export.summary.format', { format: exportFormat.toUpperCase() })}</div>
              <div>{t('results.export.summary.methods', { count: selectedMethods.length })}</div>
              <div>
                {t('results.export.summary.dataPoints', { count: results.length > 0 ? 
                  results[0].timestamps.historical.length + results[0].timestamps.forecast.length : 0 })}
              </div>
              {includeMetadata && <div>{t('results.export.summary.includesMetadata')}</div>}
              {exportFormat === 'csv' && includeConfidenceIntervals && (
                <div>{t('results.export.summary.includesConfidenceIntervals')}</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-secondary-200">
          {onClose && (
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              {t('results.export.buttons.cancel')}
            </button>
          )}
          <button
            onClick={handleExport}
            disabled={selectedMethods.length === 0}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('results.export.buttons.export', { format: exportFormat.toUpperCase() })}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ForecastExport;