import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScrollToTop } from '../utils/useScrollToTop';
import ForecastingForm from '../components/Forecasting/ForecastingForm';
import ForecastingResults from '../components/Forecasting/ForecastingResults';
import { ForecastConfig, ForecastModel, ForecastResult, TimeSeriesData } from '../types';
import { MovingAverageForecaster } from '../lib/forecasting/algorithms/moving-average';
import { ExponentialSmoothingForecaster } from '../lib/forecasting/algorithms/exponential-smoothing';
import { LinearTrendForecaster } from '../lib/forecasting/algorithms/linear-trend';
import { createTimeSeriesData, parseDateTime } from '../lib/data/csv-utils';
import { useProject } from '../contexts/ProjectContext';

/**
 * Time series forecasting page with complete workflow
 */
const ForecastingPage: React.FC = () => {
  // Ensure page starts from top
  useScrollToTop();

  const { projectState, updateModel, updateResults } = useProject();
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData | null>(null);
  const [isForecasting, setIsForecasting] = useState(false);
  const [selectedDateColumn, setSelectedDateColumn] = useState<string>('');
  const [selectedValueColumn, setSelectedValueColumn] = useState<string>('');

  const currentDataset = projectState.currentDataset || null;
  const forecastModel = projectState.models.forecast || null;
  const forecastResult = projectState.results.forecast || null;

  // Process dataset when it changes or columns are selected
  useEffect(() => {
    if (currentDataset && selectedDateColumn && selectedValueColumn) {
      processTimeSeriesData();
    }
  }, [currentDataset, selectedDateColumn, selectedValueColumn]);

  /**
   * Process the dataset to extract time series data
   */
  const processTimeSeriesData = () => {
    if (!currentDataset || !selectedDateColumn || !selectedValueColumn) return;

    try {
      // Extract timestamps and values from selected columns
      const timestamps: Date[] = [];
      const values: number[] = [];

      currentDataset.data.forEach((row, index) => {
        const timestampValue = row[selectedDateColumn];
        const numericValue = row[selectedValueColumn];

        // Parse timestamp
        const parsedDate = parseDateTime(timestampValue);
        if (!parsedDate) {
          console.warn(`Invalid timestamp at row ${index}:`, timestampValue);
          return;
        }

        // Parse numeric value
        const parsedValue = Number(numericValue);
        if (isNaN(parsedValue)) {
          console.warn(`Invalid numeric value at row ${index}:`, numericValue);
          return;
        }

        timestamps.push(parsedDate);
        values.push(parsedValue);
      });

      if (timestamps.length < 10) {
        alert('Insufficient data for forecasting. Please provide at least 10 valid data points.');
        return;
      }

      // Create time series data
      const tsData = createTimeSeriesData(timestamps, values, {
        handleMissing: 'forward-fill'
      });

      setTimeSeriesData(tsData);
    } catch (error) {
      console.error('Error processing time series data:', error);
      alert(`Error processing data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  /**
   * Handle forecasting with the selected configuration
   */
  const handleForecast = async (config: ForecastConfig) => {
    if (!timeSeriesData) {
      alert('No time series data available. Please select date and value columns.');
      return;
    }

    try {
      setIsForecasting(true);
      
      // Create forecaster based on method
      let forecaster;
      switch (config.method) {
        case 'moving-average':
          forecaster = new MovingAverageForecaster();
          break;
        case 'exponential-smoothing':
          forecaster = new ExponentialSmoothingForecaster();
          break;
        case 'linear-trend':
          forecaster = new LinearTrendForecaster();
          break;
        default:
          throw new Error(`Unknown forecasting method: ${config.method}`);
      }

      // Fit the model
      forecaster.fit(timeSeriesData, config);

      // Generate predictions
      const result = forecaster.predict(config.forecastHorizon);

      // Create model object
      const model: ForecastModel = {
        config,
        result,
        trained: true,
        trainingData: timeSeriesData,
        createdAt: new Date()
      };

      // Update project state through context
      updateModel('forecast', model);
      updateResults('forecast', result);

    } catch (error) {
      console.error('Forecasting failed:', error);
      alert(`Forecasting failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsForecasting(false);
    }
  };

  /**
   * Export forecast results as CSV
   */
  const handleExportResults = (results: ForecastResult[]) => {
    if (!results.length) return;

    try {
      // Combine all results into a single CSV
      const exportData: Record<string, any>[] = [];

      results.forEach((result, methodIndex) => {
        // Historical data
        result.timestamps.historical.forEach((timestamp, i) => {
          const row: Record<string, any> = {
            timestamp: timestamp.toISOString(),
            type: 'historical',
            method: result.method,
            value: timeSeriesData?.values[i] || null,
            fitted_value: result.fittedValues[i] || null,
            prediction: null,
            confidence_lower: null,
            confidence_upper: null
          };
          exportData.push(row);
        });

        // Forecast data
        result.timestamps.forecast.forEach((timestamp, i) => {
          const row: Record<string, any> = {
            timestamp: timestamp.toISOString(),
            type: 'forecast',
            method: result.method,
            value: null,
            fitted_value: null,
            prediction: result.predictions[i],
            confidence_lower: result.confidenceIntervals.lower[i],
            confidence_upper: result.confidenceIntervals.upper[i]
          };
          exportData.push(row);
        });
      });

      // Convert to CSV
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header];
            return value === null ? '' : String(value);
          }).join(',')
        )
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `forecast_results_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  /**
   * Export forecast model as JSON
   */
  const handleExportModel = (model: ForecastModel) => {
    try {
      const modelData = {
        ...model,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };

      const jsonContent = JSON.stringify(modelData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `forecast_model_${model.config.method}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Model export failed:', error);
      alert('Model export failed. Please try again.');
    }
  };

  // Get available date and numeric columns
  const dateColumns = currentDataset?.columns.filter(col => col.type === 'datetime') || [];
  const numericColumns = currentDataset?.columns.filter(col => col.type === 'numeric') || [];

  if (!currentDataset) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-gray-100 mb-2">No Dataset Loaded</h2>
        <p className="text-secondary-600 dark:text-gray-400 mb-6">Please upload a dataset with datetime and numeric columns to start forecasting.</p>
        <a href="/data" className="btn-primary">
          Go to Data Page
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-gray-100 mb-2">
          Time Series Forecasting
        </h1>
        <p className="text-secondary-600 dark:text-gray-400">
          Analyze temporal patterns and predict future values using statistical forecasting methods
        </p>
      </motion.div>

      {/* Column Selection */}
      {(!selectedDateColumn || !selectedValueColumn) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-4">Select Time Series Columns</h2>
          
          {dateColumns.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex">
                <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">No Date Columns Detected</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your dataset doesn't contain any datetime columns. Please ensure your data has a column with dates or timestamps.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                Date/Time Column
              </label>
              <select
                value={selectedDateColumn}
                onChange={(e) => setSelectedDateColumn(e.target.value)}
                className="input-field"
                disabled={dateColumns.length === 0}
              >
                <option value="">Select date column...</option>
                {dateColumns.map(col => (
                  <option key={col.name} value={col.name}>
                    {col.name} ({col.values.length} values)
                  </option>
                ))}
              </select>
              <p className="text-xs text-secondary-500 mt-1">
                Column containing timestamps or dates for the time series
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                Value Column
              </label>
              <select
                value={selectedValueColumn}
                onChange={(e) => setSelectedValueColumn(e.target.value)}
                className="input-field"
                disabled={numericColumns.length === 0}
              >
                <option value="">Select value column...</option>
                {numericColumns.map(col => (
                  <option key={col.name} value={col.name}>
                    {col.name} ({col.values.length} values)
                  </option>
                ))}
              </select>
              <p className="text-xs text-secondary-500 mt-1">
                Numeric column containing the values to forecast
              </p>
            </div>
          </div>

          {selectedDateColumn && selectedValueColumn && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-green-800">
                  Time series data ready for forecasting
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Main Content */}
      {timeSeriesData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ForecastingForm
              dataset={currentDataset}
              timeSeriesData={timeSeriesData}
              onForecast={handleForecast}
              isForecasting={isForecasting}
            />
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ForecastingResults
              models={forecastModel ? [forecastModel] : []}
              results={forecastResult ? [forecastResult] : []}
              isForecasting={isForecasting}
              onExportResults={handleExportResults}
              onExportModel={handleExportModel}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ForecastingPage;